package model

import (
	"encoding/json"
	"time"
)

// DIFFICULTY_LABELS maps difficulty levels 1-5 to human-readable labels.
var DIFFICULTY_LABELS = [6]string{"", "Easy", "Moderate", "Intermediate", "Advanced", "Expert"}

// Product represents a tool product from ClickHouse.
type Product struct {
	SKU            string          `json:"sku" db:"sku"`
	Name           string          `json:"name" db:"name"`
	Brand          string          `json:"brand" db:"brand"`
	Ecosystem      string          `json:"ecosystem" db:"ecosystem"`
	Category       string          `json:"category" db:"category"`
	Subcategory    string          `json:"subcategory" db:"subcategory"`
	ToolType       string          `json:"tool_type" db:"tool_type"`
	Slug           string          `json:"slug" db:"slug"`
	PriceCurrent   float64         `json:"price_current" db:"price_current"`
	PriceMSRP      float64         `json:"price_msrp" db:"price_msrp"`
	Specs          json.RawMessage `json:"specs" db:"specs"`
	Rating         float32         `json:"rating" db:"rating"`
	ReviewCount    uint32          `json:"review_count" db:"review_count"`
	ImageURL       string          `json:"image_url" db:"image_url"`
	AffiliateLinks json.RawMessage `json:"affiliate_links" db:"affiliate_links"`
	Description    string          `json:"description" db:"description"`
	Features       []string        `json:"features" db:"features"`
	IsCordless     bool            `json:"is_cordless" db:"is_cordless"`
	WeightLbs      float32         `json:"weight_lbs" db:"weight_lbs"`
	InStock        bool            `json:"in_stock" db:"in_stock"`
	UpdatedAt      time.Time       `json:"updated_at" db:"updated_at"`
}

// PriceHistory represents a price point for a product.
type PriceHistory struct {
	SKU        string    `json:"sku" db:"sku"`
	Price      float64   `json:"price" db:"price"`
	Retailer   string    `json:"retailer" db:"retailer"`
	InStock    bool      `json:"in_stock" db:"in_stock"`
	RecordedAt time.Time `json:"recorded_at" db:"recorded_at"`
}

// Project represents a DIY project.
type Project struct {
	Slug         string   `json:"slug"`
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Difficulty   int      `json:"difficulty"`
	TimeEstimate string   `json:"time_estimate"`
	ImageURL     string   `json:"image_url,omitempty"`
	RelatedSlugs []string `json:"related_slugs,omitempty"`
}

// ProjectToolkit is the toolkit recommendation for a project + ecosystem.
type ProjectToolkit struct {
	Project       Project       `json:"project"`
	Ecosystem     string        `json:"ecosystem"`
	EssentialTools []ToolkitItem `json:"essential_tools"`
	RecommendedTools []ToolkitItem `json:"recommended_tools"`
	OptionalTools []ToolkitItem `json:"optional_tools"`
	TotalCost     float64       `json:"total_cost"`
	SafetyGear    []string      `json:"safety_gear"`
}

// ToolkitItem is a single tool in a toolkit recommendation.
type ToolkitItem struct {
	Product     *Product `json:"product,omitempty"`
	Subcategory string   `json:"subcategory"`
	Reason      string   `json:"reason"`
	Priority    string   `json:"priority"` // "essential", "recommended", "optional"
	RentOption  string   `json:"rent_option,omitempty"`
}

// Ecosystem represents a battery tool ecosystem.
type Ecosystem struct {
	Slug          string `json:"slug"`
	Name          string `json:"name"`
	Brand         string `json:"brand"`
	Voltage       int    `json:"voltage"`
	ToolCount     int    `json:"tool_count"`
	Target        string `json:"target"` // "diy", "pro", "both"
	ParentCompany string `json:"parent_company,omitempty"`
}

// EcosystemDetail includes the ecosystem plus its tools.
type EcosystemDetail struct {
	Ecosystem
	Tools      []Product `json:"tools"`
	StarterKit []Product `json:"starter_kit,omitempty"`
}

// Category represents a tool category with subcategories.
type Category struct {
	Slug          string        `json:"slug"`
	Name          string        `json:"name"`
	Subcategories []Subcategory `json:"subcategories"`
}

// Subcategory represents a tool subcategory.
type Subcategory struct {
	Slug      string `json:"slug"`
	Name      string `json:"name"`
	ToolCount int    `json:"tool_count,omitempty"`
}

// SearchRequest is the input for the search endpoint.
type SearchRequest struct {
	Query     string   `json:"query"`
	Filters   *Filters `json:"filters,omitempty"`
	Limit     int      `json:"limit,omitempty"`
}

// Filters for search results.
type Filters struct {
	Brand      []string `json:"brand,omitempty"`
	Ecosystem  []string `json:"ecosystem,omitempty"`
	Category   []string `json:"category,omitempty"`
	PriceMin   float64  `json:"price_min,omitempty"`
	PriceMax   float64  `json:"price_max,omitempty"`
	CordlessOnly bool   `json:"cordless_only,omitempty"`
}

// SearchResult is the response from the search endpoint.
type SearchResult struct {
	Products []Product `json:"products"`
	Total    int       `json:"total"`
	QueryMS  int64     `json:"query_ms"`
}

// AdvisorRequest is the input for the AI advisor.
type AdvisorRequest struct {
	Query       string   `json:"query"`
	OwnedTools  []string `json:"owned_tools,omitempty"`
	Budget      float64  `json:"budget,omitempty"`
	Ecosystem   string   `json:"ecosystem,omitempty"`
}

// AdvisorResponse is the streaming response from the advisor.
type AdvisorResponse struct {
	Message    string        `json:"message"`
	Toolkit    []ToolkitItem `json:"toolkit,omitempty"`
	TotalCost  float64       `json:"total_cost,omitempty"`
	Ecosystem  string        `json:"ecosystem_recommendation,omitempty"`
}

// AffiliateClick tracks a click on an affiliate link.
type AffiliateClick struct {
	SessionID      string `json:"session_id"`
	SKU            string `json:"sku"`
	Retailer       string `json:"retailer"`
	DestinationURL string `json:"destination_url"`
	ReferrerPage   string `json:"referrer_page"`
	ReferrerQuery  string `json:"referrer_query"`
}

// ComparisonResult is the response for side-by-side tool comparison.
type ComparisonResult struct {
	Products []Product `json:"products"`
	Specs    []SpecRow `json:"specs"`
}

// SpecRow is a row in a comparison table.
type SpecRow struct {
	Label  string            `json:"label"`
	Values map[string]string `json:"values"` // SKU → value
	Unit   string            `json:"unit,omitempty"`
}
