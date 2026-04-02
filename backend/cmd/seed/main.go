package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/config"
	"github.com/Artentic/lostinthetoolpool/internal/database"
)

// SeedProduct matches the JSON format in data/products/*.json
type SeedProduct struct {
	SKU          string            `json:"sku"`
	Name         string            `json:"name"`
	Brand        string            `json:"brand"`
	Ecosystem    string            `json:"ecosystem"`
	Category     string            `json:"category"`
	Subcategory  string            `json:"subcategory"`
	ToolType     string            `json:"tool_type"`
	PriceCurrent float64           `json:"price_current"`
	PriceMSRP    float64           `json:"price_msrp"`
	Specs        map[string]any    `json:"specs"`
	Rating       float32           `json:"rating"`
	ReviewCount  uint32            `json:"review_count"`
	Description  string            `json:"description"`
	Features     []string          `json:"features"`
	IsCordless   bool              `json:"is_cordless"`
	WeightLbs    float32           `json:"weight_lbs"`
	Retailers    []string          `json:"retailers"`
	ImageURL     string            `json:"image_url"`
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: seed <data-dir>")
		fmt.Println("  data-dir: path to directory containing product JSON files")
		fmt.Println("  Example: seed ../../data/products")
		os.Exit(1)
	}

	dataDir := os.Args[1]
	cfg := config.Load()

	log.Println("Connecting to ClickHouse...")
	ch, err := database.NewClickHouse(cfg.ClickHouseDSN)
	if err != nil {
		log.Fatalf("clickhouse: %v", err)
	}
	defer ch.Close()

	// Find all JSON files
	files, err := filepath.Glob(filepath.Join(dataDir, "*.json"))
	if err != nil {
		log.Fatalf("glob: %v", err)
	}

	if len(files) == 0 {
		log.Fatalf("no JSON files found in %s", dataDir)
	}

	var allProducts []SeedProduct
	for _, file := range files {
		products, err := loadFile(file)
		if err != nil {
			log.Printf("SKIP %s: %v", filepath.Base(file), err)
			continue
		}
		log.Printf("Loaded %d products from %s", len(products), filepath.Base(file))
		allProducts = append(allProducts, products...)
	}

	log.Printf("Total: %d products to seed", len(allProducts))

	if len(allProducts) == 0 {
		log.Fatal("no products to seed")
	}

	// Insert into ClickHouse
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	inserted := 0
	skipped := 0

	for _, p := range allProducts {
		if p.SKU == "" || p.Name == "" {
			skipped++
			continue
		}

		specsJSON, _ := json.Marshal(p.Specs)
		affiliateLinks := buildAffiliateLinks(p.Retailers, p.SKU)
		linksJSON, _ := json.Marshal(affiliateLinks)

		slug := slugify(p.Name)
		if p.PriceMSRP == 0 {
			p.PriceMSRP = p.PriceCurrent
		}

		cordless := uint8(0)
		if p.IsCordless {
			cordless = 1
		}

		err := ch.Conn().Exec(ctx, `
			INSERT INTO products (
				sku, name, brand, ecosystem, category, subcategory, tool_type, slug,
				price_current, price_msrp, specs, rating, review_count, image_url,
				affiliate_links, description, features, is_cordless, weight_lbs,
				in_stock, is_active
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
			p.SKU, p.Name, p.Brand, p.Ecosystem, p.Category, p.Subcategory,
			p.ToolType, slug, p.PriceCurrent, p.PriceMSRP, string(specsJSON),
			p.Rating, p.ReviewCount, p.ImageURL, string(linksJSON),
			p.Description, p.Features, cordless, p.WeightLbs,
		)
		if err != nil {
			log.Printf("WARN: insert %s: %v", p.SKU, err)
			skipped++
			continue
		}

		// Also insert initial price history
		ch.Conn().Exec(ctx, `
			INSERT INTO price_history (sku, price, retailer, in_stock)
			VALUES (?, ?, 'seed', 1)`, p.SKU, p.PriceCurrent)

		inserted++
	}

	log.Printf("Done: %d inserted, %d skipped", inserted, skipped)
}

func loadFile(path string) ([]SeedProduct, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var products []SeedProduct
	if err := json.Unmarshal(data, &products); err != nil {
		return nil, fmt.Errorf("parse JSON: %w", err)
	}
	return products, nil
}

func buildAffiliateLinks(retailers []string, sku string) map[string]string {
	links := make(map[string]string, len(retailers))
	for _, r := range retailers {
		// Placeholder URLs — will be replaced with real affiliate links
		links[r] = fmt.Sprintf("https://%s.com/search?q=%s", r, sku)
	}
	return links
}

func slugify(s string) string {
	var result []byte
	prevDash := false
	for _, c := range []byte(s) {
		switch {
		case c >= 'a' && c <= 'z', c >= '0' && c <= '9':
			result = append(result, c)
			prevDash = false
		case c >= 'A' && c <= 'Z':
			result = append(result, c+32) // lowercase
			prevDash = false
		default:
			if !prevDash && len(result) > 0 {
				result = append(result, '-')
				prevDash = true
			}
		}
	}
	// Trim trailing dash
	if len(result) > 0 && result[len(result)-1] == '-' {
		result = result[:len(result)-1]
	}
	// Limit length
	if len(result) > 80 {
		result = result[:80]
		for len(result) > 0 && result[len(result)-1] == '-' {
			result = result[:len(result)-1]
		}
	}
	return string(result)
}
