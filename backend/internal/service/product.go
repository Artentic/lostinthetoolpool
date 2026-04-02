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

func (s *ProductService) GetBySlug(ctx context.Context, slug string) (*model.Product, error) {
	cacheKey := "product:" + slug
	if data, ok := s.cache.Get(cacheKey); ok {
		var p model.Product
		if json.Unmarshal(data, &p) == nil {
			return &p, nil
		}
	}

	row := s.ch.Conn().QueryRow(ctx, `
		SELECT sku, name, brand, ecosystem, category, subcategory, tool_type, slug,
		       price_current, price_msrp, specs, rating, review_count, image_url,
		       affiliate_links, description, features, is_cordless, weight_lbs,
		       in_stock, updated_at
		FROM products FINAL
		WHERE slug = ? AND is_active = 1
		LIMIT 1
	`, slug)

	p, err := scanProduct(row)
	if err != nil {
		return nil, fmt.Errorf("query product: %w", err)
	}

	if data, err := json.Marshal(p); err == nil {
		s.cache.Set(cacheKey, data, 15*time.Minute)
	}
	return p, nil
}

func (s *ProductService) GetBySKU(ctx context.Context, sku string) (*model.Product, error) {
	cacheKey := "product:sku:" + sku
	if data, ok := s.cache.Get(cacheKey); ok {
		var p model.Product
		if json.Unmarshal(data, &p) == nil {
			return &p, nil
		}
	}

	row := s.ch.Conn().QueryRow(ctx, `
		SELECT sku, name, brand, ecosystem, category, subcategory, tool_type, slug,
		       price_current, price_msrp, specs, rating, review_count, image_url,
		       affiliate_links, description, features, is_cordless, weight_lbs,
		       in_stock, updated_at
		FROM products FINAL
		WHERE sku = ? AND is_active = 1
		LIMIT 1
	`, sku)

	p, err := scanProduct(row)
	if err != nil {
		return nil, fmt.Errorf("query product by sku: %w", err)
	}

	if data, err := json.Marshal(p); err == nil {
		s.cache.Set(cacheKey, data, 15*time.Minute)
	}
	return p, nil
}

func (s *ProductService) ListByEcosystem(ctx context.Context, ecosystem string) ([]model.Product, error) {
	cacheKey := "products:eco:" + ecosystem
	if data, ok := s.cache.Get(cacheKey); ok {
		var products []model.Product
		if json.Unmarshal(data, &products) == nil {
			return products, nil
		}
	}

	rows, err := s.ch.Conn().Query(ctx, `
		SELECT sku, name, brand, ecosystem, category, subcategory, tool_type, slug,
		       price_current, price_msrp, specs, rating, review_count, image_url,
		       affiliate_links, description, features, is_cordless, weight_lbs,
		       in_stock, updated_at
		FROM products FINAL
		WHERE ecosystem = ? AND is_active = 1
		ORDER BY rating DESC, review_count DESC
	`, ecosystem)
	if err != nil {
		return nil, fmt.Errorf("query products by ecosystem: %w", err)
	}
	defer rows.Close()

	products, err := scanProducts(rows)
	if err != nil {
		return nil, err
	}

	if data, err := json.Marshal(products); err == nil {
		s.cache.Set(cacheKey, data, 10*time.Minute)
	}
	return products, nil
}

func (s *ProductService) Compare(ctx context.Context, skus []string) (*model.ComparisonResult, error) {
	cacheKey := "compare:" + strings.Join(skus, ",")
	if data, ok := s.cache.Get(cacheKey); ok {
		var result model.ComparisonResult
		if json.Unmarshal(data, &result) == nil {
			return &result, nil
		}
	}

	var products []model.Product
	for _, sku := range skus {
		p, err := s.GetBySKU(ctx, sku)
		if err != nil {
			continue
		}
		products = append(products, *p)
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
		FROM price_history
		WHERE sku = ?
		ORDER BY recorded_at DESC
		LIMIT 90
	`, sku)
	if err != nil {
		return nil, fmt.Errorf("query price history: %w", err)
	}
	defer rows.Close()

	var history []model.PriceHistory
	for rows.Next() {
		var ph model.PriceHistory
		var stock uint8
		if err := rows.Scan(&ph.SKU, &ph.Price, &ph.Retailer, &stock, &ph.RecordedAt); err != nil {
			return nil, fmt.Errorf("scan price history: %w", err)
		}
		ph.InStock = stock == 1
		history = append(history, ph)
	}
	return history, nil
}

func (s *ProductService) TrackAffiliateClick(ctx context.Context, click model.AffiliateClick) error {
	return s.ch.Conn().Exec(ctx, `
		INSERT INTO affiliate_clicks (session_id, sku, retailer, destination_url, referrer_page, referrer_query)
		VALUES (?, ?, ?, ?, ?, ?)
	`, click.SessionID, click.SKU, click.Retailer, click.DestinationURL, click.ReferrerPage, click.ReferrerQuery)
}

// scanProduct scans a single row into a Product.
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

// scanProducts scans multiple rows into a slice of Products.
func scanProducts(rows interface{ Next() bool; Scan(dest ...any) error }) ([]model.Product, error) {
	var products []model.Product
	for rows.Next() {
		p, err := scanProduct(rows)
		if err != nil {
			return nil, fmt.Errorf("scan product: %w", err)
		}
		products = append(products, *p)
	}
	return products, nil
}

// buildSpecComparison extracts specs from products into a comparison table.
func buildSpecComparison(products []model.Product) []model.SpecRow {
	allSpecs := make(map[string]bool)
	parsed := make([]map[string]interface{}, len(products))

	for i, p := range products {
		var specs map[string]interface{}
		if err := json.Unmarshal(p.Specs, &specs); err == nil {
			parsed[i] = specs
			for k := range specs {
				allSpecs[k] = true
			}
		}
	}

	var rows []model.SpecRow
	for key := range allSpecs {
		row := model.SpecRow{Label: key, Values: make(map[string]string)}
		for i, p := range products {
			if parsed[i] != nil {
				if v, ok := parsed[i][key]; ok {
					row.Values[p.SKU] = fmt.Sprintf("%v", v)
				}
			}
		}
		rows = append(rows, row)
	}

	priceRow := model.SpecRow{Label: "price", Values: make(map[string]string), Unit: "USD"}
	ratingRow := model.SpecRow{Label: "rating", Values: make(map[string]string)}
	weightRow := model.SpecRow{Label: "weight", Values: make(map[string]string), Unit: "lbs"}
	for _, p := range products {
		priceRow.Values[p.SKU] = fmt.Sprintf("%.2f", p.PriceCurrent)
		ratingRow.Values[p.SKU] = fmt.Sprintf("%.1f", p.Rating)
		weightRow.Values[p.SKU] = fmt.Sprintf("%.1f", p.WeightLbs)
	}

	return append([]model.SpecRow{priceRow, ratingRow, weightRow}, rows...)
}
