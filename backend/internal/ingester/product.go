package ingester

import (
	"crypto/sha256"
	"encoding/hex"
	"regexp"
	"strings"
	"unicode"
)

// RawProduct is a product as scraped from a retailer feed before normalization.
type RawProduct struct {
	SourceRetailer string  `json:"source_retailer"`
	SourceID       string  `json:"source_id"`
	Name           string  `json:"name"`
	Brand          string  `json:"brand"`
	Price          float64 `json:"price"`
	MSRP           float64 `json:"msrp"`
	URL            string  `json:"url"`
	ImageURL       string  `json:"image_url"`
	Description    string  `json:"description"`
	UPC            string  `json:"upc"`
	ModelNumber    string  `json:"model_number"`
	Rating         float32 `json:"rating"`
	ReviewCount    uint32  `json:"review_count"`
	InStock        bool    `json:"in_stock"`
	Category       string  `json:"category"`
	Specs          map[string]string `json:"specs"`
}

// NormalizedProduct is the cleaned, deduplicated product ready for loading.
type NormalizedProduct struct {
	SKU            string            `json:"sku"`
	Name           string            `json:"name"`
	Brand          string            `json:"brand"`
	Ecosystem      string            `json:"ecosystem"`
	Category       string            `json:"category"`
	Subcategory    string            `json:"subcategory"`
	ToolType       string            `json:"tool_type"`
	Slug           string            `json:"slug"`
	PriceCurrent   float64           `json:"price_current"`
	PriceMSRP      float64           `json:"price_msrp"`
	Specs          map[string]string `json:"specs"`
	Rating         float32           `json:"rating"`
	ReviewCount    uint32            `json:"review_count"`
	ImageURL       string            `json:"image_url"`
	Description    string            `json:"description"`
	Features       []string          `json:"features"`
	IsCordless     bool              `json:"is_cordless"`
	WeightLbs      float32           `json:"weight_lbs"`
	InStock        bool              `json:"in_stock"`
	AffiliateLinks map[string]string `json:"affiliate_links"`
}

// Normalize converts a raw product into a normalized product.
func Normalize(raw RawProduct) NormalizedProduct {
	brand := normalizeBrand(raw.Brand)
	ecosystem := detectEcosystem(raw.Name, brand)
	category, subcategory, toolType := classifyTool(raw.Name, raw.Category)
	sku := generateSKU(brand, raw.ModelNumber, raw.UPC)

	np := NormalizedProduct{
		SKU:          sku,
		Name:         strings.TrimSpace(raw.Name),
		Brand:        brand,
		Ecosystem:    ecosystem,
		Category:     category,
		Subcategory:  subcategory,
		ToolType:     toolType,
		Slug:         slugify(raw.Name),
		PriceCurrent: raw.Price,
		PriceMSRP:    raw.MSRP,
		Specs:        raw.Specs,
		Rating:       raw.Rating,
		ReviewCount:  raw.ReviewCount,
		ImageURL:     raw.ImageURL,
		Description:  strings.TrimSpace(raw.Description),
		IsCordless:   detectCordless(raw.Name, raw.Description),
		InStock:      raw.InStock,
		AffiliateLinks: map[string]string{
			raw.SourceRetailer: raw.URL,
		},
	}

	if np.PriceMSRP == 0 {
		np.PriceMSRP = np.PriceCurrent
	}
	if np.Specs == nil {
		np.Specs = make(map[string]string)
	}

	return np
}

var brandAliases = map[string]string{
	"milwaukee tool":       "Milwaukee",
	"milwaukee electric":   "Milwaukee",
	"dewalt":               "DeWalt",
	"de walt":              "DeWalt",
	"makita usa":           "Makita",
	"ryobi tools":         "Ryobi",
	"ryobi limited":       "Ryobi",
	"bosch power tools":   "Bosch",
	"robert bosch":        "Bosch",
	"ridgid":              "Ridgid",
	"metabo hpt":          "Metabo HPT",
	"hitachi":             "Metabo HPT",
	"ego power+":          "EGO",
	"ego power":           "EGO",
}

func normalizeBrand(brand string) string {
	lower := strings.ToLower(strings.TrimSpace(brand))
	if normalized, ok := brandAliases[lower]; ok {
		return normalized
	}
	// Title case the original
	if len(brand) > 0 {
		return strings.TrimSpace(brand)
	}
	return "Unknown"
}

// ecosystemPatterns maps name patterns to ecosystem slugs.
var ecosystemPatterns = []struct {
	patterns  []string
	ecosystem string
}{
	{[]string{"m18", "m18 fuel"}, "milwaukee-m18"},
	{[]string{"m12"}, "milwaukee-m12"},
	{[]string{"20v max", "20v", "flexvolt"}, "dewalt-20v-max"},
	{[]string{"18v lxt", "lxt"}, "makita-18v-lxt"},
	{[]string{"40v xgt", "xgt"}, "makita-40v-xgt"},
	{[]string{"one+", "one plus", "ryobi 18v"}, "ryobi-one-plus"},
	{[]string{"ryobi 40v"}, "ryobi-40v"},
	{[]string{"56v", "power+"}, "ego-56v"},
}

func detectEcosystem(name, brand string) string {
	lower := strings.ToLower(name)
	for _, ep := range ecosystemPatterns {
		for _, pattern := range ep.patterns {
			if strings.Contains(lower, pattern) {
				return ep.ecosystem
			}
		}
	}

	// Fallback by brand
	switch brand {
	case "Milwaukee":
		return "milwaukee-m18"
	case "DeWalt":
		return "dewalt-20v-max"
	case "Makita":
		return "makita-18v-lxt"
	case "Ryobi":
		return "ryobi-one-plus"
	case "EGO":
		return "ego-56v"
	case "Bosch":
		return "bosch-18v"
	case "Ridgid":
		return "ridgid-18v"
	}
	return ""
}

// toolClassification maps keywords to (category, subcategory, toolType).
var toolClassification = []struct {
	keywords    []string
	category    string
	subcategory string
	toolType    string
}{
	{[]string{"impact driver"}, "drilling-driving", "impact-drivers", "impact-driver"},
	{[]string{"drill/driver", "drill driver", "drill/drv"}, "drilling-driving", "drill-drivers", "drill-driver"},
	{[]string{"hammer drill"}, "drilling-driving", "hammer-drills", "hammer-drill"},
	{[]string{"circular saw"}, "cutting", "circular-saws", "circular-saw"},
	{[]string{"miter saw", "mitre saw"}, "cutting", "miter-saws", "miter-saw"},
	{[]string{"reciprocating saw", "sawzall", "recip saw"}, "cutting", "reciprocating-saws", "reciprocating-saw"},
	{[]string{"jig saw", "jigsaw"}, "cutting", "jigsaws", "jigsaw"},
	{[]string{"table saw"}, "cutting", "table-saws", "table-saw"},
	{[]string{"band saw", "bandsaw"}, "cutting", "band-saws", "band-saw"},
	{[]string{"oscillating", "multi-tool", "multitool"}, "cutting", "oscillating-multi-tools", "oscillating-multi-tool"},
	{[]string{"angle grinder", "grinder"}, "sanding-finishing", "angle-grinders", "angle-grinder"},
	{[]string{"random orbit sander", "orbital sander"}, "sanding-finishing", "random-orbit-sanders", "random-orbit-sander"},
	{[]string{"belt sander"}, "sanding-finishing", "belt-sanders", "belt-sander"},
	{[]string{"router"}, "sanding-finishing", "routers", "compact-router"},
	{[]string{"brad nailer"}, "fastening", "brad-nailers", "brad-nailer"},
	{[]string{"finish nailer"}, "fastening", "finish-nailers", "finish-nailer"},
	{[]string{"framing nailer"}, "fastening", "framing-nailers", "framing-nailer"},
	{[]string{"impact wrench"}, "fastening", "impact-wrenches", "impact-wrench"},
	{[]string{"lawn mower", "mower"}, "outdoor-power", "lawn-mowers", "lawn-mower"},
	{[]string{"string trimmer", "line trimmer", "weed"}, "outdoor-power", "string-trimmers", "string-trimmer"},
	{[]string{"leaf blower", "blower"}, "outdoor-power", "leaf-blowers", "leaf-blower"},
	{[]string{"chainsaw", "chain saw"}, "outdoor-power", "chainsaws", "chainsaw"},
	{[]string{"hedge trimmer"}, "outdoor-power", "hedge-trimmers", "hedge-trimmer"},
}

func classifyTool(name, rawCategory string) (category, subcategory, toolType string) {
	lower := strings.ToLower(name)
	for _, tc := range toolClassification {
		for _, kw := range tc.keywords {
			if strings.Contains(lower, kw) {
				return tc.category, tc.subcategory, tc.toolType
			}
		}
	}
	return "uncategorized", "uncategorized", "unknown"
}

func detectCordless(name, description string) bool {
	lower := strings.ToLower(name + " " + description)
	cordlessKeywords := []string{"cordless", "battery", "18v", "20v", "40v", "56v", "m18", "m12", "one+", "lxt", "xgt", "flexvolt"}
	for _, kw := range cordlessKeywords {
		if strings.Contains(lower, kw) {
			return true
		}
	}
	return false
}

func generateSKU(brand, modelNumber, upc string) string {
	if modelNumber != "" {
		prefix := strings.ToUpper(brand[:3])
		model := strings.ToUpper(strings.ReplaceAll(modelNumber, " ", "-"))
		return prefix + "-" + model
	}
	if upc != "" {
		return "UPC-" + upc
	}
	// Hash-based fallback
	h := sha256.Sum256([]byte(brand + modelNumber + upc))
	return "GEN-" + hex.EncodeToString(h[:6])
}

var nonAlphaNum = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(s string) string {
	lower := strings.ToLower(s)
	slug := nonAlphaNum.ReplaceAllString(lower, "-")
	slug = strings.Trim(slug, "-")

	// Limit length
	if len(slug) > 80 {
		slug = slug[:80]
		if i := strings.LastIndex(slug, "-"); i > 40 {
			slug = slug[:i]
		}
	}
	return slug
}

// ValidatePrice checks if a price update is sane (not a scraping error).
func ValidatePrice(oldPrice, newPrice float64) bool {
	if oldPrice == 0 {
		return newPrice > 0
	}
	if newPrice <= 0 {
		return false
	}
	ratio := newPrice / oldPrice
	// Reject changes > 50% up or down — likely a data error
	return ratio > 0.5 && ratio < 1.5
}

// Deduplicate merges products from multiple retailers by UPC or model number.
func Deduplicate(products []NormalizedProduct) []NormalizedProduct {
	seen := make(map[string]int, len(products)) // SKU → index in result
	result := make([]NormalizedProduct, 0, len(products))

	for _, p := range products {
		if idx, exists := seen[p.SKU]; exists {
			// Merge affiliate links
			for k, v := range p.AffiliateLinks {
				result[idx].AffiliateLinks[k] = v
			}
			// Use lower price
			if p.PriceCurrent < result[idx].PriceCurrent {
				result[idx].PriceCurrent = p.PriceCurrent
			}
			// Use higher review count
			if p.ReviewCount > result[idx].ReviewCount {
				result[idx].ReviewCount = p.ReviewCount
				result[idx].Rating = p.Rating
			}
		} else {
			seen[p.SKU] = len(result)
			result = append(result, p)
		}
	}
	return result
}

// slugify for non-exported use by Normalize
func stripNonAlpha(r rune) rune {
	if unicode.IsLetter(r) || unicode.IsDigit(r) || r == ' ' || r == '-' {
		return r
	}
	return -1
}
