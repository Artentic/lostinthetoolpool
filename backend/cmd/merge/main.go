package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type Product struct {
	SKU          string            `json:"sku"`
	Name         string            `json:"name"`
	Brand        string            `json:"brand"`
	Ecosystem    string            `json:"ecosystem"`
	Category     string            `json:"category"`
	Subcategory  string            `json:"subcategory"`
	ToolType     string            `json:"tool_type"`
	Slug         string            `json:"slug"`
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
	if len(os.Args) < 3 {
		fmt.Println("Usage: merge <input-dir> <output-file>")
		os.Exit(1)
	}

	inputDir := os.Args[1]
	outputFile := os.Args[2]

	files, _ := filepath.Glob(filepath.Join(inputDir, "*.json"))
	if len(files) == 0 {
		log.Fatalf("no JSON files in %s", inputDir)
	}

	// Load all products
	seen := make(map[string]int) // SKU → index in merged
	var merged []Product

	for _, file := range files {
		data, err := os.ReadFile(file)
		if err != nil {
			log.Printf("SKIP %s: %v", filepath.Base(file), err)
			continue
		}

		var products []Product
		if err := json.Unmarshal(data, &products); err != nil {
			// Try wrapped format
			var wrapped struct {
				Products []Product `json:"products"`
			}
			if err := json.Unmarshal(data, &wrapped); err == nil {
				products = wrapped.Products
			} else {
				log.Printf("SKIP %s: can't parse", filepath.Base(file))
				continue
			}
		}

		for _, p := range products {
			if p.SKU == "" || p.Name == "" {
				continue
			}

			// Generate slug if missing
			if p.Slug == "" {
				p.Slug = slugify(p.Name)
			}

			// MSRP fallback
			if p.PriceMSRP == 0 {
				p.PriceMSRP = p.PriceCurrent
			}

			if idx, exists := seen[p.SKU]; exists {
				// Merge: keep lower price, higher reviews, combine retailers
				if p.PriceCurrent > 0 && p.PriceCurrent < merged[idx].PriceCurrent {
					merged[idx].PriceCurrent = p.PriceCurrent
				}
				if p.ReviewCount > merged[idx].ReviewCount {
					merged[idx].ReviewCount = p.ReviewCount
					merged[idx].Rating = p.Rating
				}
				// Merge retailers
				retailerSet := make(map[string]bool)
				for _, r := range merged[idx].Retailers {
					retailerSet[r] = true
				}
				for _, r := range p.Retailers {
					retailerSet[r] = true
				}
				merged[idx].Retailers = merged[idx].Retailers[:0]
				for r := range retailerSet {
					merged[idx].Retailers = append(merged[idx].Retailers, r)
				}
				// Fill missing fields from the newer entry
				if merged[idx].Description == "" && p.Description != "" {
					merged[idx].Description = p.Description
				}
				if len(merged[idx].Features) == 0 && len(p.Features) > 0 {
					merged[idx].Features = p.Features
				}
				if merged[idx].WeightLbs == 0 && p.WeightLbs > 0 {
					merged[idx].WeightLbs = p.WeightLbs
				}
			} else {
				seen[p.SKU] = len(merged)
				merged = append(merged, p)
			}
		}

		log.Printf("Processed %s: %d products", filepath.Base(file), len(products))
	}

	// Sort by brand, then category, then name
	sort.Slice(merged, func(i, j int) bool {
		if merged[i].Brand != merged[j].Brand {
			return merged[i].Brand < merged[j].Brand
		}
		if merged[i].Category != merged[j].Category {
			return merged[i].Category < merged[j].Category
		}
		return merged[i].Name < merged[j].Name
	})

	// Stats
	brands := make(map[string]int)
	ecosystems := make(map[string]int)
	categories := make(map[string]int)
	for _, p := range merged {
		brands[p.Brand]++
		ecosystems[p.Ecosystem]++
		categories[p.Category]++
	}

	log.Printf("\n=== MERGED CATALOG ===")
	log.Printf("Total: %d unique products", len(merged))
	log.Printf("Brands: %d", len(brands))
	log.Printf("Ecosystems: %d", len(ecosystems))
	log.Printf("Categories: %d", len(categories))

	// Write output
	output, err := json.MarshalIndent(merged, "", "  ")
	if err != nil {
		log.Fatalf("marshal: %v", err)
	}

	if err := os.WriteFile(outputFile, output, 0644); err != nil {
		log.Fatalf("write: %v", err)
	}

	log.Printf("Written to %s (%.1f MB)", outputFile, float64(len(output))/1024/1024)
}

func slugify(s string) string {
	var result []byte
	prevDash := false
	for _, c := range []byte(strings.ToLower(s)) {
		switch {
		case c >= 'a' && c <= 'z', c >= '0' && c <= '9':
			result = append(result, c)
			prevDash = false
		default:
			if !prevDash && len(result) > 0 {
				result = append(result, '-')
				prevDash = true
			}
		}
	}
	if len(result) > 0 && result[len(result)-1] == '-' {
		result = result[:len(result)-1]
	}
	if len(result) > 80 {
		result = result[:80]
		for len(result) > 0 && result[len(result)-1] == '-' {
			result = result[:len(result)-1]
		}
	}
	return string(result)
}
