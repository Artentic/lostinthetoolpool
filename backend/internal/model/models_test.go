package model

import (
	"encoding/json"
	"testing"
)

func TestProductJSON(t *testing.T) {
	p := Product{
		SKU:         "MIL-2853-20",
		Name:        "Milwaukee M18 FUEL Impact Driver",
		Brand:       "Milwaukee",
		Ecosystem:   "milwaukee-m18",
		Category:    "drilling-driving",
		Subcategory: "impact-drivers",
		Slug:        "milwaukee-m18-fuel-impact-driver",
		PriceCurrent: 149.00,
		PriceMSRP:    149.00,
		Specs:        json.RawMessage(`{"voltage":18,"max_torque":"2000 in-lbs"}`),
		Rating:       4.9,
		ReviewCount:  6200,
		IsCordless:   true,
		WeightLbs:    2.9,
		InStock:      true,
	}

	data, err := json.Marshal(p)
	if err != nil {
		t.Fatalf("failed to marshal product: %v", err)
	}

	var decoded Product
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal product: %v", err)
	}

	if decoded.SKU != "MIL-2853-20" {
		t.Fatalf("expected SKU 'MIL-2853-20', got '%s'", decoded.SKU)
	}
	if decoded.PriceCurrent != 149.00 {
		t.Fatalf("expected price 149.00, got %f", decoded.PriceCurrent)
	}
	if decoded.Rating != 4.9 {
		t.Fatalf("expected rating 4.9, got %f", decoded.Rating)
	}
	if !decoded.IsCordless {
		t.Fatal("expected cordless to be true")
	}
}

func TestProductSpecsParsing(t *testing.T) {
	p := Product{
		Specs: json.RawMessage(`{"voltage":18,"brushless":true,"max_rpm":3600}`),
	}

	var specs map[string]interface{}
	if err := json.Unmarshal(p.Specs, &specs); err != nil {
		t.Fatalf("failed to parse specs: %v", err)
	}

	if specs["voltage"].(float64) != 18 {
		t.Fatalf("expected voltage 18, got %v", specs["voltage"])
	}
	if specs["brushless"].(bool) != true {
		t.Fatal("expected brushless true")
	}
}

func TestSearchRequestDefaults(t *testing.T) {
	body := `{"query":"impact driver"}`
	var req SearchRequest
	if err := json.Unmarshal([]byte(body), &req); err != nil {
		t.Fatalf("failed to unmarshal: %v", err)
	}

	if req.Query != "impact driver" {
		t.Fatalf("expected 'impact driver', got '%s'", req.Query)
	}
	if req.Limit != 0 {
		t.Fatalf("expected default limit 0, got %d", req.Limit)
	}
	if req.Filters != nil {
		t.Fatal("expected nil filters by default")
	}
}

func TestSearchRequestWithFilters(t *testing.T) {
	body := `{
		"query": "circular saw",
		"filters": {
			"brand": ["Milwaukee", "DeWalt"],
			"price_max": 200,
			"cordless_only": true
		},
		"limit": 10
	}`

	var req SearchRequest
	if err := json.Unmarshal([]byte(body), &req); err != nil {
		t.Fatalf("failed to unmarshal: %v", err)
	}

	if len(req.Filters.Brand) != 2 {
		t.Fatalf("expected 2 brands, got %d", len(req.Filters.Brand))
	}
	if req.Filters.PriceMax != 200 {
		t.Fatalf("expected price_max 200, got %f", req.Filters.PriceMax)
	}
	if !req.Filters.CordlessOnly {
		t.Fatal("expected cordless_only true")
	}
	if req.Limit != 10 {
		t.Fatalf("expected limit 10, got %d", req.Limit)
	}
}

func TestAdvisorRequestJSON(t *testing.T) {
	body := `{
		"query": "I want to build a deck",
		"budget": 500,
		"ecosystem": "ryobi-one-plus",
		"owned_tools": ["drill", "tape-measure"]
	}`

	var req AdvisorRequest
	if err := json.Unmarshal([]byte(body), &req); err != nil {
		t.Fatalf("failed to unmarshal: %v", err)
	}

	if req.Query != "I want to build a deck" {
		t.Fatalf("unexpected query: %s", req.Query)
	}
	if req.Budget != 500 {
		t.Fatalf("expected budget 500, got %f", req.Budget)
	}
	if req.Ecosystem != "ryobi-one-plus" {
		t.Fatalf("expected ecosystem 'ryobi-one-plus', got '%s'", req.Ecosystem)
	}
	if len(req.OwnedTools) != 2 {
		t.Fatalf("expected 2 owned tools, got %d", len(req.OwnedTools))
	}
}

func TestDifficultyLabels(t *testing.T) {
	if DIFFICULTY_LABELS[1] != "Easy" {
		t.Fatalf("expected 'Easy', got '%s'", DIFFICULTY_LABELS[1])
	}
	if DIFFICULTY_LABELS[5] != "Expert" {
		t.Fatalf("expected 'Expert', got '%s'", DIFFICULTY_LABELS[5])
	}
}

func TestComparisonResultJSON(t *testing.T) {
	result := ComparisonResult{
		Products: []Product{
			{SKU: "A", Name: "Tool A", PriceCurrent: 100},
			{SKU: "B", Name: "Tool B", PriceCurrent: 200},
		},
		Specs: []SpecRow{
			{Label: "price", Values: map[string]string{"A": "100", "B": "200"}, Unit: "USD"},
		},
	}

	data, err := json.Marshal(result)
	if err != nil {
		t.Fatalf("failed to marshal: %v", err)
	}

	var decoded ComparisonResult
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("failed to unmarshal: %v", err)
	}

	if len(decoded.Products) != 2 {
		t.Fatalf("expected 2 products, got %d", len(decoded.Products))
	}
	if decoded.Specs[0].Values["A"] != "100" {
		t.Fatalf("expected spec value '100', got '%s'", decoded.Specs[0].Values["A"])
	}
}
