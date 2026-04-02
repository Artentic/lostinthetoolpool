package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/model"
	pb "github.com/qdrant/go-client/qdrant"
)

type SearchService struct {
	qdrant *database.QdrantClient
	ch     *database.ClickHouseClient
	redis  *database.RedisClient
}

func NewSearchService(qdrant *database.QdrantClient, ch *database.ClickHouseClient, redis *database.RedisClient) *SearchService {
	return &SearchService{qdrant: qdrant, ch: ch, redis: redis}
}

// Search performs a vector similarity search against the tools collection.
// The embedding must be generated before calling this method.
func (s *SearchService) Search(ctx context.Context, embedding []float32, filters *model.Filters, limit int) (*model.SearchResult, error) {
	if limit <= 0 {
		limit = 20
	}

	start := time.Now()

	// Build Qdrant filter conditions
	var must []*pb.Condition
	if filters != nil {
		if len(filters.Brand) > 0 {
			must = append(must, matchKeywords("brand", filters.Brand))
		}
		if len(filters.Ecosystem) > 0 {
			must = append(must, matchKeywords("ecosystem", filters.Ecosystem))
		}
		if len(filters.Category) > 0 {
			must = append(must, matchKeywords("category", filters.Category))
		}
		if filters.CordlessOnly {
			must = append(must, &pb.Condition{
				ConditionOneOf: &pb.Condition_Field{
					Field: &pb.FieldCondition{
						Key: "is_cordless",
						Match: &pb.Match{
							MatchValue: &pb.Match_Boolean{Boolean: true},
						},
					},
				},
			})
		}
		if filters.PriceMin > 0 || filters.PriceMax > 0 {
			rangeFilter := &pb.Range{}
			if filters.PriceMin > 0 {
				gte := filters.PriceMin
				rangeFilter.Gte = &gte
			}
			if filters.PriceMax > 0 {
				lte := filters.PriceMax
				rangeFilter.Lte = &lte
			}
			must = append(must, &pb.Condition{
				ConditionOneOf: &pb.Condition_Field{
					Field: &pb.FieldCondition{
						Key:   "price",
						Range: rangeFilter,
					},
				},
			})
		}
	}

	searchReq := &pb.SearchPoints{
		CollectionName: "tools",
		Vector:         embedding,
		Limit:          uint64(limit),
		WithPayload:    &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	}

	if len(must) > 0 {
		searchReq.Filter = &pb.Filter{Must: must}
	}

	resp, err := s.qdrant.Points().Search(ctx, searchReq)
	if err != nil {
		return nil, fmt.Errorf("qdrant search: %w", err)
	}

	// Extract SKUs from results and fetch full products from ClickHouse
	var skus []string
	for _, r := range resp.GetResult() {
		payload := r.GetPayload()
		if sku, ok := payload["sku"]; ok {
			skus = append(skus, sku.GetStringValue())
		}
	}

	products, err := s.fetchProductsBySKUs(ctx, skus)
	if err != nil {
		return nil, err
	}

	elapsed := time.Since(start).Milliseconds()

	return &model.SearchResult{
		Products: products,
		Total:    len(products),
		QueryMS:  elapsed,
	}, nil
}

func (s *SearchService) fetchProductsBySKUs(ctx context.Context, skus []string) ([]model.Product, error) {
	if len(skus) == 0 {
		return nil, nil
	}

	rows, err := s.ch.Conn().Query(ctx, `
		SELECT sku, name, brand, ecosystem, category, subcategory, tool_type, slug,
		       price_current, price_msrp, specs, rating, review_count, image_url,
		       affiliate_links, description, features, is_cordless, weight_lbs,
		       in_stock, updated_at
		FROM products FINAL
		WHERE sku IN (?) AND is_active = 1
	`, skus)
	if err != nil {
		return nil, fmt.Errorf("fetch products by skus: %w", err)
	}
	defer rows.Close()

	return scanProducts(rows)
}

// LogQuery logs a search query to ClickHouse for analytics.
func (s *SearchService) LogQuery(ctx context.Context, sessionID, queryText, queryType string, resultsCount int, resultsSKUs []string, clickedSKU string, responseMS int) {
	// Fire and forget — don't block on analytics
	go func() {
		bgCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = s.ch.Conn().Exec(bgCtx, `
			INSERT INTO search_queries (session_id, query_text, query_type, results_count, results_skus, clicked_sku, response_ms)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`, sessionID, queryText, queryType, resultsCount, resultsSKUs, clickedSKU, responseMS)
	}()
}

// CacheSearchResult caches a search result in Redis.
func (s *SearchService) CacheSearchResult(ctx context.Context, query string, result *model.SearchResult) {
	data, err := json.Marshal(result)
	if err != nil {
		return
	}
	s.redis.Client().Set(ctx, "search:"+query, data, 15*time.Minute)
}

// GetCachedSearch returns a cached search result if available.
func (s *SearchService) GetCachedSearch(ctx context.Context, query string) *model.SearchResult {
	data, err := s.redis.Client().Get(ctx, "search:"+query).Bytes()
	if err != nil {
		return nil
	}
	var result model.SearchResult
	if json.Unmarshal(data, &result) == nil {
		return &result
	}
	return nil
}

func matchKeywords(field string, values []string) *pb.Condition {
	var matchValues []*pb.Value
	for _, v := range values {
		matchValues = append(matchValues, &pb.Value{
			Kind: &pb.Value_StringValue{StringValue: v},
		})
	}
	return &pb.Condition{
		ConditionOneOf: &pb.Condition_Field{
			Field: &pb.FieldCondition{
				Key: field,
				Match: &pb.Match{
					MatchValue: &pb.Match_Keywords{
						Keywords: &pb.RepeatedStrings{Strings: values},
					},
				},
			},
		},
	}
}
