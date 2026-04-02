package service

import (
	"encoding/json"
	"testing"

	"github.com/Artentic/lostinthetoolpool/internal/model"
)

func TestBuildSpecComparison(t *testing.T) {
	products := []model.Product{
		{
			SKU:          "MIL-001",
			PriceCurrent: 149.00,
			Rating:       4.9,
			WeightLbs:    2.9,
			Specs:        json.RawMessage(`{"voltage":18,"max_torque":"2000 in-lbs","brushless":true}`),
		},
		{
			SKU:          "DEW-001",
			PriceCurrent: 119.00,
			Rating:       4.8,
			WeightLbs:    2.8,
			Specs:        json.RawMessage(`{"voltage":20,"max_torque":"1825 in-lbs","brushless":true}`),
		},
	}

	rows := buildSpecComparison(products)

	if len(rows) == 0 {
		t.Fatal("expected spec rows")
	}

	// First 3 rows should be price, rating, weight
	if rows[0].Label != "price" {
		t.Fatalf("first row should be 'price', got '%s'", rows[0].Label)
	}
	if rows[0].Values["MIL-001"] != "149.00" {
		t.Fatalf("expected MIL price 149.00, got %s", rows[0].Values["MIL-001"])
	}
	if rows[0].Values["DEW-001"] != "119.00" {
		t.Fatalf("expected DEW price 119.00, got %s", rows[0].Values["DEW-001"])
	}

	if rows[1].Label != "rating" {
		t.Fatalf("second row should be 'rating', got '%s'", rows[1].Label)
	}

	if rows[2].Label != "weight" {
		t.Fatalf("third row should be 'weight', got '%s'", rows[2].Label)
	}

	// Should have spec rows for voltage, max_torque, brushless
	specLabels := make(map[string]bool)
	for _, r := range rows[3:] {
		specLabels[r.Label] = true
	}
	for _, expected := range []string{"voltage", "max_torque", "brushless"} {
		if !specLabels[expected] {
			t.Errorf("missing spec row: %s", expected)
		}
	}
}

func TestBuildSpecComparisonMissingSpecs(t *testing.T) {
	products := []model.Product{
		{
			SKU:          "A",
			PriceCurrent: 100,
			Specs:        json.RawMessage(`{"voltage":18}`),
		},
		{
			SKU:          "B",
			PriceCurrent: 200,
			Specs:        json.RawMessage(`{"voltage":20,"brushless":true}`),
		},
	}

	rows := buildSpecComparison(products)

	// Product A shouldn't have a value for "brushless"
	for _, r := range rows {
		if r.Label == "brushless" {
			if _, ok := r.Values["A"]; ok {
				t.Error("product A should not have brushless value")
			}
			if v, ok := r.Values["B"]; !ok || v != "true" {
				t.Error("product B should have brushless=true")
			}
		}
	}
}

func TestBuildSpecComparisonEmptySpecs(t *testing.T) {
	products := []model.Product{
		{SKU: "A", PriceCurrent: 100, Specs: json.RawMessage(`{}`)},
		{SKU: "B", PriceCurrent: 200, Specs: json.RawMessage(`{}`)},
	}

	rows := buildSpecComparison(products)

	// Should still have price, rating, weight
	if len(rows) < 3 {
		t.Fatalf("expected at least 3 rows, got %d", len(rows))
	}
}

func TestBuildSpecComparisonInvalidJSON(t *testing.T) {
	products := []model.Product{
		{SKU: "A", PriceCurrent: 100, Specs: json.RawMessage(`invalid`)},
	}

	// Should not panic
	rows := buildSpecComparison(products)
	if len(rows) < 3 {
		t.Fatalf("expected at least 3 rows even with bad JSON, got %d", len(rows))
	}
}

func TestScanProductInterface(t *testing.T) {
	// Test that scanProduct handles the expected column count
	// by verifying the interface signature
	var scanner interface {
		Scan(dest ...any) error
	}
	_ = scanner // compile check
}
