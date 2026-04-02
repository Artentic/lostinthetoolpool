package store

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

type testHelper interface {
	Helper()
	TempDir() string
}

func createTestCatalog(t testHelper) string {
	t.Helper()
	products := []Product{
		{SKU: "MIL-001", Name: "Milwaukee M18 FUEL Impact Driver", Brand: "Milwaukee", Ecosystem: "milwaukee-m18", Category: "drilling-driving", Subcategory: "impact-drivers", Slug: "milwaukee-m18-fuel-impact-driver", PriceCurrent: 149, Rating: 4.9, ReviewCount: 6200, Description: "Powerful impact driver", IsCordless: true},
		{SKU: "MIL-002", Name: "Milwaukee M18 FUEL Drill/Driver", Brand: "Milwaukee", Ecosystem: "milwaukee-m18", Category: "drilling-driving", Subcategory: "drill-drivers", Slug: "milwaukee-m18-fuel-drill-driver", PriceCurrent: 99, Rating: 4.8, ReviewCount: 3200, Description: "Compact brushless drill", IsCordless: true},
		{SKU: "DW-001", Name: "DeWalt 20V MAX XR Impact Driver", Brand: "DeWalt", Ecosystem: "dewalt-20v-max", Category: "drilling-driving", Subcategory: "impact-drivers", Slug: "dewalt-20v-max-xr-impact-driver", PriceCurrent: 119, Rating: 4.8, ReviewCount: 7800, Description: "Best-selling impact driver", IsCordless: true},
		{SKU: "DW-002", Name: "DeWalt 20V MAX Circular Saw", Brand: "DeWalt", Ecosystem: "dewalt-20v-max", Category: "cutting", Subcategory: "circular-saws", Slug: "dewalt-20v-max-circular-saw", PriceCurrent: 149, Rating: 4.7, ReviewCount: 3500, Description: "Reliable circular saw", IsCordless: true},
		{SKU: "RY-001", Name: "Ryobi ONE+ HP Impact Driver", Brand: "Ryobi", Ecosystem: "ryobi-one-plus", Category: "drilling-driving", Subcategory: "impact-drivers", Slug: "ryobi-one-plus-hp-impact-driver", PriceCurrent: 59, Rating: 4.6, ReviewCount: 3400, Description: "Budget brushless impact", IsCordless: true},
		{SKU: "DW-003", Name: "DeWalt 12\" Sliding Miter Saw", Brand: "DeWalt", Ecosystem: "corded", Category: "cutting", Subcategory: "miter-saws", Slug: "dewalt-12-sliding-miter-saw", PriceCurrent: 399, Rating: 4.8, ReviewCount: 12500, Description: "Best-selling miter saw", IsCordless: false},
	}

	dir := t.TempDir()
	path := filepath.Join(dir, "catalog.json")
	data, _ := json.Marshal(products)
	os.WriteFile(path, data, 0644)
	return path
}

func TestLoad(t *testing.T) {
	path := createTestCatalog(t)
	s, err := Load(path)
	if err != nil {
		t.Fatal(err)
	}
	if s.Count() != 6 {
		t.Fatalf("expected 6 products, got %d", s.Count())
	}
}

func TestGetBySKU(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	p := s.GetBySKU("MIL-001")
	if p == nil {
		t.Fatal("expected product")
	}
	if p.Brand != "Milwaukee" {
		t.Errorf("expected Milwaukee, got %s", p.Brand)
	}

	if s.GetBySKU("NONEXISTENT") != nil {
		t.Error("expected nil for missing SKU")
	}
}

func TestGetBySlug(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	p := s.GetBySlug("dewalt-20v-max-circular-saw")
	if p == nil {
		t.Fatal("expected product")
	}
	if p.SKU != "DW-002" {
		t.Errorf("expected DW-002, got %s", p.SKU)
	}
}

func TestListByEcosystem(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	mil := s.ListByEcosystem("milwaukee-m18")
	if len(mil) != 2 {
		t.Fatalf("expected 2 Milwaukee M18, got %d", len(mil))
	}

	dw := s.ListByEcosystem("dewalt-20v-max")
	if len(dw) != 2 {
		t.Fatalf("expected 2 DeWalt 20V MAX, got %d", len(dw))
	}
}

func TestListByCategory(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	drilling := s.ListByCategory("drilling-driving")
	if len(drilling) != 4 {
		t.Fatalf("expected 4 drilling-driving, got %d", len(drilling))
	}

	cutting := s.ListByCategory("cutting")
	if len(cutting) != 2 {
		t.Fatalf("expected 2 cutting, got %d", len(cutting))
	}
}

func TestSearch(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	results := s.Search("impact driver", 10)
	if len(results) == 0 {
		t.Fatal("expected search results for 'impact driver'")
	}
	// Impact drivers should rank highest
	if results[0].Subcategory != "impact-drivers" {
		t.Errorf("top result should be impact driver, got %s", results[0].Subcategory)
	}
}

func TestSearchMilwaukee(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	results := s.Search("milwaukee", 10)
	if len(results) != 2 {
		t.Fatalf("expected 2 Milwaukee results, got %d", len(results))
	}
}

func TestSearchNoResults(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	results := s.Search("quantum hyperdrive", 10)
	if len(results) != 0 {
		t.Errorf("expected 0 results, got %d", len(results))
	}
}

func TestFilteredSearch(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	// Filter by ecosystem
	results := s.FilteredSearch("driver", "ryobi-one-plus", 0, 0, false, 10)
	if len(results) != 1 {
		t.Fatalf("expected 1 Ryobi result, got %d", len(results))
	}

	// Filter by price
	results = s.FilteredSearch("driver", "", 0, 100, false, 10)
	for _, p := range results {
		if p.PriceCurrent > 100 {
			t.Errorf("got product over $100: %s at $%.0f", p.Name, p.PriceCurrent)
		}
	}

	// Cordless only
	results = s.FilteredSearch("saw", "", 0, 0, true, 10)
	for _, p := range results {
		if !p.IsCordless {
			t.Errorf("got corded product with cordless filter: %s", p.Name)
		}
	}
}

func TestEcosystems(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	ecos := s.Ecosystems()
	if len(ecos) != 4 {
		t.Fatalf("expected 4 ecosystems, got %d: %v", len(ecos), ecos)
	}
}

func TestBrands(t *testing.T) {
	path := createTestCatalog(t)
	s, _ := Load(path)

	brands := s.Brands()
	if len(brands) != 3 {
		t.Fatalf("expected 3 brands, got %d", len(brands))
	}
}

func BenchmarkSearch(b *testing.B) {
	path := createTestCatalog(b)
	s, _ := Load(path)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		s.Search("impact driver milwaukee", 20)
	}
}
