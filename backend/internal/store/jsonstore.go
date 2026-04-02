package store

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strings"
	"sync"
)

// Product is the unified product type for the JSON store.
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

// JSONStore is a read-only in-memory product store loaded from catalog.json.
// Zero external dependencies. Serves the full API without any database.
type JSONStore struct {
	mu         sync.RWMutex
	products   []Product
	bySKU      map[string]*Product
	bySlug     map[string]*Product
	byEco      map[string][]*Product
	byCat      map[string][]*Product
	bySubcat   map[string][]*Product
	byBrand    map[string][]*Product
	ecosystems []string
	categories []string
	brands     []string
}

// Load reads the merged catalog.json and builds all indexes.
func Load(path string) (*JSONStore, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("read catalog: %w", err)
	}

	var products []Product
	if err := json.Unmarshal(data, &products); err != nil {
		return nil, fmt.Errorf("parse catalog: %w", err)
	}

	s := &JSONStore{
		products: products,
		bySKU:    make(map[string]*Product, len(products)),
		bySlug:   make(map[string]*Product, len(products)),
		byEco:    make(map[string][]*Product),
		byCat:    make(map[string][]*Product),
		bySubcat: make(map[string][]*Product),
		byBrand:  make(map[string][]*Product),
	}

	ecoSet := make(map[string]bool)
	catSet := make(map[string]bool)
	brandSet := make(map[string]bool)

	for i := range products {
		p := &products[i]
		s.bySKU[p.SKU] = p
		s.bySlug[p.Slug] = p
		s.byEco[p.Ecosystem] = append(s.byEco[p.Ecosystem], p)
		s.byCat[p.Category] = append(s.byCat[p.Category], p)
		s.bySubcat[p.Subcategory] = append(s.bySubcat[p.Subcategory], p)
		s.byBrand[p.Brand] = append(s.byBrand[p.Brand], p)
		ecoSet[p.Ecosystem] = true
		catSet[p.Category] = true
		brandSet[p.Brand] = true
	}

	for k := range ecoSet {
		s.ecosystems = append(s.ecosystems, k)
	}
	sort.Strings(s.ecosystems)

	for k := range catSet {
		s.categories = append(s.categories, k)
	}
	sort.Strings(s.categories)

	for k := range brandSet {
		s.brands = append(s.brands, k)
	}
	sort.Strings(s.brands)

	return s, nil
}

func (s *JSONStore) GetBySKU(sku string) *Product        { return s.bySKU[sku] }
func (s *JSONStore) GetBySlug(slug string) *Product      { return s.bySlug[slug] }
func (s *JSONStore) ListByEcosystem(eco string) []*Product { return s.byEco[eco] }
func (s *JSONStore) ListByCategory(cat string) []*Product  { return s.byCat[cat] }
func (s *JSONStore) ListBySubcategory(sub string) []*Product { return s.bySubcat[sub] }
func (s *JSONStore) ListByBrand(brand string) []*Product   { return s.byBrand[brand] }
func (s *JSONStore) Ecosystems() []string                  { return s.ecosystems }
func (s *JSONStore) Categories() []string                  { return s.categories }
func (s *JSONStore) Brands() []string                      { return s.brands }
func (s *JSONStore) Count() int                            { return len(s.products) }
func (s *JSONStore) All() []Product                        { return s.products }

// Search does a simple text search across name, description, brand, category.
// Returns up to limit results sorted by relevance (match quality + rating).
func (s *JSONStore) Search(query string, limit int) []*Product {
	if limit <= 0 {
		limit = 20
	}

	query = strings.ToLower(query)
	words := strings.Fields(query)

	type scored struct {
		product *Product
		score   float64
	}

	var results []scored

	for i := range s.products {
		p := &s.products[i]
		score := 0.0

		nameLower := strings.ToLower(p.Name)
		descLower := strings.ToLower(p.Description)
		catLower := strings.ToLower(p.Category + " " + p.Subcategory)

		for _, w := range words {
			if strings.Contains(nameLower, w) {
				score += 10
			}
			if strings.Contains(descLower, w) {
				score += 3
			}
			if strings.Contains(catLower, w) {
				score += 5
			}
			if strings.EqualFold(p.Brand, w) {
				score += 8
			}
		}

		if score > 0 {
			// Boost by rating
			score += float64(p.Rating)
			results = append(results, scored{p, score})
		}
	}

	sort.Slice(results, func(i, j int) bool {
		return results[i].score > results[j].score
	})

	if len(results) > limit {
		results = results[:limit]
	}

	out := make([]*Product, len(results))
	for i, r := range results {
		out[i] = r.product
	}
	return out
}

// FilteredSearch searches with ecosystem and price filters.
func (s *JSONStore) FilteredSearch(query string, ecosystem string, minPrice, maxPrice float64, cordlessOnly bool, limit int) []*Product {
	results := s.Search(query, 200) // get wide set, then filter

	var filtered []*Product
	for _, p := range results {
		if ecosystem != "" && p.Ecosystem != ecosystem {
			continue
		}
		if minPrice > 0 && p.PriceCurrent < minPrice {
			continue
		}
		if maxPrice > 0 && p.PriceCurrent > maxPrice {
			continue
		}
		if cordlessOnly && !p.IsCordless {
			continue
		}
		filtered = append(filtered, p)
		if len(filtered) >= limit {
			break
		}
	}
	return filtered
}
