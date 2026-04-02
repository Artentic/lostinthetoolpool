package ingester

import (
	"testing"
)

func TestNormalizeBrand(t *testing.T) {
	tests := []struct{ input, want string }{
		{"DeWalt", "DeWalt"},
		{"dewalt", "DeWalt"},
		{"DEWALT", "DeWalt"},
		{"Milwaukee Tool", "Milwaukee"},
		{"milwaukee tool", "Milwaukee"},
		{"Ryobi Tools", "Ryobi"},
		{"Hitachi", "Metabo HPT"},
		{"EGO Power+", "EGO"},
		{"Bosch Power Tools", "Bosch"},
		{"  Milwaukee Tool  ", "Milwaukee"},
		{"", "Unknown"},
	}

	for _, tc := range tests {
		got := normalizeBrand(tc.input)
		if got != tc.want {
			t.Errorf("normalizeBrand(%q) = %q, want %q", tc.input, got, tc.want)
		}
	}
}

func TestDetectEcosystem(t *testing.T) {
	tests := []struct {
		name, brand, want string
	}{
		{"Milwaukee M18 FUEL Impact Driver", "Milwaukee", "milwaukee-m18"},
		{"Milwaukee M12 Compact Drill", "Milwaukee", "milwaukee-m12"},
		{"DeWalt 20V MAX XR Drill", "DeWalt", "dewalt-20v-max"},
		{"Makita 18V LXT Circular Saw", "Makita", "makita-18v-lxt"},
		{"Makita 40V XGT Router", "Makita", "makita-40v-xgt"},
		{"Ryobi ONE+ HP Impact Driver", "Ryobi", "ryobi-one-plus"},
		{"Ryobi 40V Lawn Mower", "Ryobi", "ryobi-40v"},
		{"EGO POWER+ 56V Blower", "EGO", "ego-56v"},
		{"Some Milwaukee Tool", "Milwaukee", "milwaukee-m18"}, // fallback by brand
		{"Unknown Brand Tool", "Unknown", ""},
	}

	for _, tc := range tests {
		got := detectEcosystem(tc.name, tc.brand)
		if got != tc.want {
			t.Errorf("detectEcosystem(%q, %q) = %q, want %q", tc.name, tc.brand, got, tc.want)
		}
	}
}

func TestClassifyTool(t *testing.T) {
	tests := []struct {
		name, wantCat, wantSub string
	}{
		{"Milwaukee M18 FUEL 1/4\" Hex Impact Driver", "drilling-driving", "impact-drivers"},
		{"DeWalt 20V MAX XR Brushless Drill/Driver", "drilling-driving", "drill-drivers"},
		{"Makita 18V LXT 7-1/4\" Circular Saw", "cutting", "circular-saws"},
		{"DeWalt 12\" Sliding Compound Miter Saw", "cutting", "miter-saws"},
		{"Milwaukee M18 FUEL SAWZALL", "cutting", "reciprocating-saws"},
		{"Ryobi ONE+ Jigsaw", "cutting", "jigsaws"},
		{"Milwaukee M18 FUEL Oscillating Multi-Tool", "cutting", "oscillating-multi-tools"},
		{"EGO POWER+ 56V 21\" Self-Propelled Mower", "outdoor-power", "lawn-mowers"},
		{"EGO 56V String Trimmer", "outdoor-power", "string-trimmers"},
		{"EGO 56V Leaf Blower", "outdoor-power", "leaf-blowers"},
		{"EGO 18\" Chain Saw", "outdoor-power", "chainsaws"},
		{"Milwaukee M18 Brad Nailer", "fastening", "brad-nailers"},
		{"Random Unknown Product", "uncategorized", "uncategorized"},
	}

	for _, tc := range tests {
		cat, sub, _ := classifyTool(tc.name, "")
		if cat != tc.wantCat {
			t.Errorf("classifyTool(%q) category = %q, want %q", tc.name, cat, tc.wantCat)
		}
		if sub != tc.wantSub {
			t.Errorf("classifyTool(%q) subcategory = %q, want %q", tc.name, sub, tc.wantSub)
		}
	}
}

func TestDetectCordless(t *testing.T) {
	tests := []struct {
		name, desc string
		want       bool
	}{
		{"Milwaukee M18 FUEL Impact Driver", "", true},
		{"DeWalt 20V MAX Drill", "", true},
		{"Cordless Circular Saw", "", true},
		{"15-Amp Corded Table Saw", "", false},
		{"Bench Grinder 6\"", "", false},
		{"Some Tool", "battery powered", true},
	}

	for _, tc := range tests {
		got := detectCordless(tc.name, tc.desc)
		if got != tc.want {
			t.Errorf("detectCordless(%q, %q) = %v, want %v", tc.name, tc.desc, got, tc.want)
		}
	}
}

func TestSlugify(t *testing.T) {
	tests := []struct{ input, want string }{
		{"Milwaukee M18 FUEL Impact Driver", "milwaukee-m18-fuel-impact-driver"},
		{"DeWalt 20V MAX XR 1/4\" Drill", "dewalt-20v-max-xr-1-4-drill"},
		{"  Spaces  Around  ", "spaces-around"},
		{"Special!@#Characters$%^", "special-characters"},
	}

	for _, tc := range tests {
		got := slugify(tc.input)
		if got != tc.want {
			t.Errorf("slugify(%q) = %q, want %q", tc.input, got, tc.want)
		}
	}
}

func TestSlugifyMaxLength(t *testing.T) {
	long := "Milwaukee M18 FUEL Brushless Cordless Compact 1/2 inch Drill/Driver Tool Only Very Long Product Name That Goes On Forever"
	slug := slugify(long)
	if len(slug) > 80 {
		t.Errorf("slug too long: %d chars", len(slug))
	}
}

func TestGenerateSKU(t *testing.T) {
	tests := []struct {
		brand, model, upc, want string
	}{
		{"Milwaukee", "2853-20", "", "MIL-2853-20"},
		{"DeWalt", "DCF887B", "", "DEW-DCF887B"},
		{"", "", "012345678901", "UPC-012345678901"},
	}

	for _, tc := range tests {
		got := generateSKU(tc.brand, tc.model, tc.upc)
		if got != tc.want {
			t.Errorf("generateSKU(%q, %q, %q) = %q, want %q", tc.brand, tc.model, tc.upc, got, tc.want)
		}
	}
}

func TestGenerateSKUFallback(t *testing.T) {
	sku := generateSKU("", "", "")
	if len(sku) == 0 {
		t.Fatal("expected non-empty fallback SKU")
	}
	if sku[:4] != "GEN-" {
		t.Fatalf("expected GEN- prefix, got %q", sku)
	}
}

func TestValidatePrice(t *testing.T) {
	tests := []struct {
		old, new float64
		want     bool
	}{
		{100, 105, true},   // 5% increase — ok
		{100, 95, true},    // 5% decrease — ok
		{100, 140, true},   // 40% increase — ok
		{100, 60, true},    // 40% decrease — ok
		{100, 160, false},  // 60% increase — suspicious
		{100, 40, false},   // 60% decrease — suspicious
		{100, 0, false},    // zero price — error
		{100, -10, false},  // negative — error
		{0, 100, true},     // new product
		{0, 0, false},      // both zero — error
	}

	for _, tc := range tests {
		got := ValidatePrice(tc.old, tc.new)
		if got != tc.want {
			t.Errorf("ValidatePrice(%.0f, %.0f) = %v, want %v", tc.old, tc.new, got, tc.want)
		}
	}
}

func TestDeduplicate(t *testing.T) {
	products := []NormalizedProduct{
		{SKU: "MIL-001", Name: "Impact Driver", PriceCurrent: 149, ReviewCount: 100, Rating: 4.5, AffiliateLinks: map[string]string{"amazon": "url1"}},
		{SKU: "MIL-001", Name: "Impact Driver", PriceCurrent: 139, ReviewCount: 200, Rating: 4.7, AffiliateLinks: map[string]string{"homedepot": "url2"}},
		{SKU: "DEW-001", Name: "Drill", PriceCurrent: 99, ReviewCount: 50, Rating: 4.3, AffiliateLinks: map[string]string{"amazon": "url3"}},
	}

	result := Deduplicate(products)

	if len(result) != 2 {
		t.Fatalf("expected 2 products after dedup, got %d", len(result))
	}

	// MIL-001 should have merged
	mil := result[0]
	if mil.SKU != "MIL-001" {
		t.Fatal("first product should be MIL-001")
	}
	if mil.PriceCurrent != 139 {
		t.Errorf("expected lower price 139, got %.0f", mil.PriceCurrent)
	}
	if mil.ReviewCount != 200 {
		t.Errorf("expected higher review count 200, got %d", mil.ReviewCount)
	}
	if mil.Rating != 4.7 {
		t.Errorf("expected higher-count rating 4.7, got %.1f", mil.Rating)
	}
	if len(mil.AffiliateLinks) != 2 {
		t.Errorf("expected 2 affiliate links, got %d", len(mil.AffiliateLinks))
	}
	if _, ok := mil.AffiliateLinks["amazon"]; !ok {
		t.Error("missing amazon affiliate link")
	}
	if _, ok := mil.AffiliateLinks["homedepot"]; !ok {
		t.Error("missing homedepot affiliate link")
	}
}

func TestNormalizeFullProduct(t *testing.T) {
	raw := RawProduct{
		SourceRetailer: "amazon",
		SourceID:       "B07X123",
		Name:           "Milwaukee M18 FUEL 1/4\" Hex Impact Driver (Tool Only)",
		Brand:          "Milwaukee Tool",
		Price:          149.00,
		MSRP:           149.00,
		URL:            "https://amazon.com/dp/B07X123",
		Description:    "Cordless impact driver with 2000 in-lbs torque",
		ModelNumber:    "2853-20",
		Rating:         4.9,
		ReviewCount:    6200,
		InStock:        true,
	}

	np := Normalize(raw)

	if np.SKU != "MIL-2853-20" {
		t.Errorf("SKU = %q, want MIL-2853-20", np.SKU)
	}
	if np.Brand != "Milwaukee" {
		t.Errorf("Brand = %q, want Milwaukee", np.Brand)
	}
	if np.Ecosystem != "milwaukee-m18" {
		t.Errorf("Ecosystem = %q, want milwaukee-m18", np.Ecosystem)
	}
	if np.Category != "drilling-driving" {
		t.Errorf("Category = %q, want drilling-driving", np.Category)
	}
	if np.Subcategory != "impact-drivers" {
		t.Errorf("Subcategory = %q, want impact-drivers", np.Subcategory)
	}
	if !np.IsCordless {
		t.Error("expected IsCordless = true")
	}
	if np.AffiliateLinks["amazon"] != "https://amazon.com/dp/B07X123" {
		t.Errorf("affiliate link wrong: %q", np.AffiliateLinks["amazon"])
	}
	if np.PriceCurrent != 149.00 {
		t.Errorf("price = %.2f, want 149.00", np.PriceCurrent)
	}
}

func BenchmarkNormalize(b *testing.B) {
	raw := RawProduct{
		Name:        "Milwaukee M18 FUEL 1/4\" Hex Impact Driver",
		Brand:       "Milwaukee Tool",
		Price:       149.00,
		ModelNumber: "2853-20",
		Rating:      4.9,
		ReviewCount: 6200,
		InStock:     true,
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		Normalize(raw)
	}
}

func BenchmarkClassifyTool(b *testing.B) {
	name := "Milwaukee M18 FUEL 7-1/4\" Circular Saw"
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		classifyTool(name, "")
	}
}

func BenchmarkDeduplicate(b *testing.B) {
	products := make([]NormalizedProduct, 100)
	for i := range products {
		products[i] = NormalizedProduct{
			SKU:            generateSKU("Brand", string(rune(i%50)), ""),
			PriceCurrent:   float64(50 + i),
			ReviewCount:    uint32(i * 10),
			AffiliateLinks: map[string]string{"amazon": "url"},
		}
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		Deduplicate(products)
	}
}
