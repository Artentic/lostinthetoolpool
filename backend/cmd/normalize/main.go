package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

// Product matches the JSON format from data/products/*.json
type Product struct {
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

var ecosystemMap = map[string]string{
	"m18":              "milwaukee-m18",
	"m12":              "milwaukee-m12",
	"milwaukee-m18":    "milwaukee-m18",
	"milwaukee-m12":    "milwaukee-m12",
	"milwaukee m18":    "milwaukee-m18",
	"20v max":          "dewalt-20v-max",
	"20v":              "dewalt-20v-max",
	"dewalt-20v":       "dewalt-20v-max",
	"dewalt-20v-max":   "dewalt-20v-max",
	"dewalt 20v max":   "dewalt-20v-max",
	"flexvolt":         "dewalt-flexvolt",
	"dewalt-60v":       "dewalt-flexvolt",
	"60v max":          "dewalt-flexvolt",
	"18v lxt":          "makita-18v-lxt",
	"makita-18v-lxt":   "makita-18v-lxt",
	"makita 18v lxt":   "makita-18v-lxt",
	"40v xgt":          "makita-40v-xgt",
	"makita-40v-xgt":   "makita-40v-xgt",
	"one+ 18v":         "ryobi-one-plus",
	"one+":             "ryobi-one-plus",
	"ryobi-one-plus":   "ryobi-one-plus",
	"ryobi one+":       "ryobi-one-plus",
	"ryobi-40v":        "ryobi-40v",
	"ryobi 40v":        "ryobi-40v",
	"ego-56v":          "ego-56v",
	"ego 56v":          "ego-56v",
	"56v":              "ego-56v",
	"bosch-18v":        "bosch-18v",
	"ridgid-18v":       "ridgid-18v",
	"metabo-hpt":       "metabo-hpt-multivolt",
	"corded":           "corded",
}

func normalizeEcosystem(eco, name string) string {
	lower := strings.ToLower(strings.TrimSpace(eco))
	if mapped, ok := ecosystemMap[lower]; ok {
		return mapped
	}

	// Try to detect from product name
	nameLower := strings.ToLower(name)
	for _, pair := range []struct{ keyword, eco string }{
		{"m18 fuel", "milwaukee-m18"},
		{"m18", "milwaukee-m18"},
		{"m12", "milwaukee-m12"},
		{"20v max", "dewalt-20v-max"},
		{"flexvolt", "dewalt-flexvolt"},
		{"18v lxt", "makita-18v-lxt"},
		{"40v xgt", "makita-40v-xgt"},
		{"one+", "ryobi-one-plus"},
		{"ryobi 40v", "ryobi-40v"},
		{"56v", "ego-56v"},
	} {
		if strings.Contains(nameLower, pair.keyword) {
			return pair.eco
		}
	}

	return eco // return as-is if can't normalize
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: normalize <data-dir>")
		os.Exit(1)
	}

	dataDir := os.Args[1]
	files, _ := filepath.Glob(filepath.Join(dataDir, "*.json"))

	totalProducts := 0
	totalFixed := 0

	for _, file := range files {
		data, err := os.ReadFile(file)
		if err != nil {
			log.Printf("SKIP %s: %v", filepath.Base(file), err)
			continue
		}

		var products []Product
		var wrapped struct {
			Products []Product `json:"products"`
			// Preserve other fields
		}

		isWrapped := false
		if err := json.Unmarshal(data, &products); err != nil {
			if err := json.Unmarshal(data, &wrapped); err == nil {
				products = wrapped.Products
				isWrapped = true
			} else {
				log.Printf("SKIP %s: can't parse", filepath.Base(file))
				continue
			}
		}

		fixed := 0
		for i := range products {
			original := products[i].Ecosystem
			products[i].Ecosystem = normalizeEcosystem(products[i].Ecosystem, products[i].Name)
			if products[i].Ecosystem != original {
				fixed++
			}
			if products[i].PriceMSRP == 0 {
				products[i].PriceMSRP = products[i].PriceCurrent
			}
		}

		// Write back
		var output []byte
		if isWrapped {
			wrapped.Products = products
			output, _ = json.MarshalIndent(wrapped, "", "  ")
		} else {
			output, _ = json.MarshalIndent(products, "", "  ")
		}
		os.WriteFile(file, output, 0644)

		log.Printf("%s: %d products, %d ecosystem fixes", filepath.Base(file), len(products), fixed)
		totalProducts += len(products)
		totalFixed += fixed
	}

	log.Printf("Total: %d products, %d ecosystem fixes", totalProducts, totalFixed)
}
