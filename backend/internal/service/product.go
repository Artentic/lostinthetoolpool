package service

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/cache"
	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/model"
)

type ProductService struct {
	ch    *database.ClickHouseClient
	cache *cache.Memory
}

func NewProductService(ch *database.ClickHouseClient, c *cache.Memory) *ProductService {
	return &ProductService{ch: ch, cache: c}
}

// GetBySlugRaw returns pre-serialized JSON bytes on cache hit.
// This avoids marshal→unmarshal→marshal round-trips for cached responses.
func (s *ProductService) GetBySlugRaw(ctx context.Context, slug string) ([]byte, error) {
	cacheKey := "p:" + slug
	if data, ok := s.cache.Get(cacheKey); ok {
		return data, nil
	}

	p, err := s.queryProductBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(p)
	if err != nil {
		return nil, err
	}
	s.cache.Set(cacheKey, data, 15*time.Minute)
	return data, nil
}

func (s *ProductService) GetBySlug(ctx context.Context, slug string) (*model.Product, error) {
	raw, err := s.GetBySlugRaw(ctx, slug)
	if err != nil {
		return nil, err
	}
	var p model.Product
	if err := json.Unmarshal(raw, &p); err != nil {
		return nil, err
	}
	return &p, nil
}

func (s *ProductService) GetBySKU(ctx context.Context, sku string) (*model.Product, error) {
	cacheKey := "ps:" + sku
	if data, ok := s.cache.Get(cacheKey); ok {
		var p model.Product
		json.Unmarshal(data, &p)
		return &p, nil
	}

	p, err := s.queryProductBySKU(ctx, sku)
	if err != nil {
		return nil, err
	}

	if data, err := json.Marshal(p); err == nil {
		s.cache.Set(cacheKey, data, 15*time.Minute)
	}
	return p, nil
}

func (s *ProductService) ListByEcosystemRaw(ctx context.Context, ecosystem string) ([]byte, error) {
	cacheKey := "pe:" + ecosystem
	if data, ok := s.cache.Get(cacheKey); ok {
		return data, nil
	}

	rows, err := s.ch.Conn().Query(ctx, productQuery+` WHERE ecosystem = ? AND is_active = 1 ORDER BY rating DESC, review_count DESC`, ecosystem)
	if err != nil {
		return nil, fmt.Errorf("query products by ecosystem: %w", err)
	}
	defer rows.Close()

	products, err := scanProducts(rows)
	if err != nil {
		return nil, err
	}

	data, err := json.Marshal(products)
	if err != nil {
		return nil, err
	}
	s.cache.Set(cacheKey, data, 10*time.Minute)
	return data, nil
}

func (s *ProductService) ListByEcosystem(ctx context.Context, ecosystem string) ([]model.Product, error) {
	raw, err := s.ListByEcosystemRaw(ctx, ecosystem)
	if err != nil {
		return nil, err
	}
	var products []model.Product
	json.Unmarshal(raw, &products)
	return products, nil
}

func (s *ProductService) Compare(ctx context.Context, skus []string) (*model.ComparisonResult, error) {
	cacheKey := "cmp:" + strings.Join(skus, ",")
	if data, ok := s.cache.Get(cacheKey); ok {
		var result model.ComparisonResult
		json.Unmarshal(data, &result)
		return &result, nil
	}

	// Batch fetch all products in one query
	products, err := s.batchGetBySKUs(ctx, skus)
	if err != nil {
		return nil, err
	}

	specs := buildSpecComparison(products)
	result := &model.ComparisonResult{Products: products, Specs: specs}

	if data, err := json.Marshal(result); err == nil {
		s.cache.Set(cacheKey, data, 30*time.Minute)
	}
	return result, nil
}

func (s *ProductService) GetPriceHistory(ctx context.Context, sku string) ([]model.PriceHistory, error) {
	rows, err := s.ch.Conn().Query(ctx, `
		SELECT sku, price, retailer, in_stock, recorded_at
		FROM price_history WHERE sku = ?
		ORDER BY recorded_at DESC LIMIT 90`, sku)
	if err != nil {
		return nil, fmt.Errorf("query price history: %w", err)
	}
	defer rows.Close()

	// Pre-allocate — 90 is max
	history := make([]model.PriceHistory, 0, 90)
	for rows.Next() {
		var ph model.PriceHistory
		var stock uint8
		if err := rows.Scan(&ph.SKU, &ph.Price, &ph.Retailer, &stock, &ph.RecordedAt); err != nil {
			return nil, err
		}
		ph.InStock = stock == 1
		history = append(history, ph)
	}
	return history, nil
}

func (s *ProductService) TrackAffiliateClick(ctx context.Context, click model.AffiliateClick) error {
	return s.ch.Conn().Exec(ctx, `
		INSERT INTO affiliate_clicks (session_id, sku, retailer, destination_url, referrer_page, referrer_query)
		VALUES (?, ?, ?, ?, ?, ?)`,
		click.SessionID, click.SKU, click.Retailer, click.DestinationURL, click.ReferrerPage, click.ReferrerQuery)
}

// batchGetBySKUs fetches multiple products in a single ClickHouse query.
func (s *ProductService) batchGetBySKUs(ctx context.Context, skus []string) ([]model.Product, error) {
	if len(skus) == 0 {
		return nil, nil
	}

	rows, err := s.ch.Conn().Query(ctx, productQuery+` WHERE sku IN (?) AND is_active = 1`, skus)
	if err != nil {
		return nil, fmt.Errorf("batch get products: %w", err)
	}
	defer rows.Close()
	return scanProducts(rows)
}

// Shared query — avoids string allocation on every call.
const productQuery = `SELECT sku, name, brand, ecosystem, category, subcategory, tool_type, slug,
	price_current, price_msrp, specs, rating, review_count, image_url,
	affiliate_links, description, features, is_cordless, weight_lbs,
	in_stock, updated_at
FROM products FINAL`

func (s *ProductService) queryProductBySlug(ctx context.Context, slug string) (*model.Product, error) {
	row := s.ch.Conn().QueryRow(ctx, productQuery+` WHERE slug = ? AND is_active = 1 LIMIT 1`, slug)
	return scanProduct(row)
}

func (s *ProductService) queryProductBySKU(ctx context.Context, sku string) (*model.Product, error) {
	row := s.ch.Conn().QueryRow(ctx, productQuery+` WHERE sku = ? AND is_active = 1 LIMIT 1`, sku)
	return scanProduct(row)
}

func scanProduct(row interface{ Scan(dest ...any) error }) (*model.Product, error) {
	var p model.Product
	var specsStr, linksStr string
	var cordless, stock uint8
	err := row.Scan(
		&p.SKU, &p.Name, &p.Brand, &p.Ecosystem, &p.Category, &p.Subcategory,
		&p.ToolType, &p.Slug, &p.PriceCurrent, &p.PriceMSRP, &specsStr,
		&p.Rating, &p.ReviewCount, &p.ImageURL, &linksStr, &p.Description,
		&p.Features, &cordless, &p.WeightLbs, &stock, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	p.Specs = json.RawMessage(specsStr)
	p.AffiliateLinks = json.RawMessage(linksStr)
	p.IsCordless = cordless == 1
	p.InStock = stock == 1
	return &p, nil
}

func scanProducts(rows interface{ Next() bool; Scan(dest ...any) error }) ([]model.Product, error) {
	products := make([]model.Product, 0, 32) // Pre-allocate reasonable capacity
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, fmt.Errorf("scan product: %w", err)
		}
		products = append(products, *p)
	}
	return products, nil
}

func buildSpecComparison(products []model.Product) []model.SpecRow {
	allSpecs := make(map[string]bool, 16)
	parsed := make([]map[string]interface{}, len(products))

	for i, p := range products {
		var specs map[string]interface{}
		if json.Unmarshal(p.Specs, &specs) == nil {
			parsed[i] = specs
			for k := range specs {
				allSpecs[k] = true
			}
		}
	}

	rows := make([]model.SpecRow, 0, len(allSpecs)+3)

	// Add price/rating/weight first
	priceRow := model.SpecRow{Label: "price", Values: make(map[string]string, len(products)), Unit: "USD"}
	ratingRow := model.SpecRow{Label: "rating", Values: make(map[string]string, len(products))}
	weightRow := model.SpecRow{Label: "weight", Values: make(map[string]string, len(products)), Unit: "lbs"}
	for _, p := range products {
		priceRow.Values[p.SKU] = fmt.Sprintf("%.2f", p.PriceCurrent)
		ratingRow.Values[p.SKU] = fmt.Sprintf("%.1f", p.Rating)
		weightRow.Values[p.SKU] = fmt.Sprintf("%.1f", p.WeightLbs)
	}
	rows = append(rows, priceRow, ratingRow, weightRow)

	for key := range allSpecs {
		row := model.SpecRow{Label: key, Values: make(map[string]string, len(products))}
		for i, p := range products {
			if parsed[i] != nil {
				if v, ok := parsed[i][key]; ok {
					row.Values[p.SKU] = fmt.Sprintf("%v", v)
				}
			}
		}
		rows = append(rows, row)
	}

	return rows
}
