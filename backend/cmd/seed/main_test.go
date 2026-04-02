package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestSlugify(t *testing.T) {
	tests := []struct{ input, want string }{
		{"Milwaukee M18 FUEL Impact Driver", "milwaukee-m18-fuel-impact-driver"},
		{"DeWalt 20V MAX XR 1/4\" Drill", "dewalt-20v-max-xr-1-4-drill"},
		{"  Spaces  ", "spaces"},
		{"ALL CAPS", "all-caps"},
		{"", ""},
	}
	for _, tc := range tests {
		got := slugify(tc.input)
		if got != tc.want {
			t.Errorf("slugify(%q) = %q, want %q", tc.input, got, tc.want)
		}
	}
}

func TestBuildAffiliateLinks(t *testing.T) {
	links := buildAffiliateLinks([]string{"amazon", "homedepot"}, "MIL-001")
	if len(links) != 2 {
		t.Fatalf("expected 2 links, got %d", len(links))
	}
	if _, ok := links["amazon"]; !ok {
		t.Error("missing amazon link")
	}
	if _, ok := links["homedepot"]; !ok {
		t.Error("missing homedepot link")
	}
}

func TestLoadFile(t *testing.T) {
	// Create a temp JSON file
	tmpDir := t.TempDir()
	testFile := filepath.Join(tmpDir, "test.json")

	products := []SeedProduct{
		{
			SKU:          "TEST-001",
			Name:         "Test Drill",
			Brand:        "TestBrand",
			Ecosystem:    "test-18v",
			Category:     "drilling-driving",
			Subcategory:  "drill-drivers",
			PriceCurrent: 99.00,
			Rating:       4.5,
			ReviewCount:  100,
			IsCordless:   true,
			Features:     []string{"Feature 1"},
			Retailers:    []string{"amazon"},
		},
		{
			SKU:          "TEST-002",
			Name:         "Test Impact",
			Brand:        "TestBrand",
			PriceCurrent: 129.00,
		},
	}

	data, _ := json.Marshal(products)
	os.WriteFile(testFile, data, 0644)

	loaded, err := loadFile(testFile)
	if err != nil {
		t.Fatalf("loadFile: %v", err)
	}
	if len(loaded) != 2 {
		t.Fatalf("expected 2 products, got %d", len(loaded))
	}
	if loaded[0].SKU != "TEST-001" {
		t.Errorf("expected SKU TEST-001, got %s", loaded[0].SKU)
	}
	if loaded[0].PriceCurrent != 99.00 {
		t.Errorf("expected price 99, got %.2f", loaded[0].PriceCurrent)
	}
	if !loaded[0].IsCordless {
		t.Error("expected cordless true")
	}
}

func TestLoadFileInvalidJSON(t *testing.T) {
	tmpDir := t.TempDir()
	testFile := filepath.Join(tmpDir, "bad.json")
	os.WriteFile(testFile, []byte("not json"), 0644)

	_, err := loadFile(testFile)
	if err == nil {
		t.Fatal("expected error for invalid JSON")
	}
}

func TestLoadFileNotFound(t *testing.T) {
	_, err := loadFile("/nonexistent/file.json")
	if err == nil {
		t.Fatal("expected error for missing file")
	}
}

func TestSeedProductJSONRoundtrip(t *testing.T) {
	p := SeedProduct{
		SKU:          "MIL-2853-20",
		Name:         "Milwaukee M18 FUEL Impact Driver",
		Brand:        "Milwaukee",
		Ecosystem:    "milwaukee-m18",
		Category:     "drilling-driving",
		Subcategory:  "impact-drivers",
		ToolType:     "impact-driver",
		PriceCurrent: 149.00,
		PriceMSRP:    149.00,
		Specs:        map[string]any{"voltage": float64(18), "brushless": true},
		Rating:       4.9,
		ReviewCount:  6200,
		Description:  "Test description",
		Features:     []string{"Feature 1", "Feature 2"},
		IsCordless:   true,
		WeightLbs:    2.9,
		Retailers:    []string{"homedepot", "amazon"},
	}

	data, err := json.Marshal(p)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}

	var decoded SeedProduct
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}

	if decoded.SKU != p.SKU {
		t.Errorf("SKU mismatch")
	}
	if decoded.PriceCurrent != p.PriceCurrent {
		t.Errorf("price mismatch")
	}
	if len(decoded.Features) != 2 {
		t.Errorf("features count mismatch")
	}
	if len(decoded.Retailers) != 2 {
		t.Errorf("retailers count mismatch")
	}
}
