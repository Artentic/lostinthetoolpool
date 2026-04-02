package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/service"
)

type AnalyticsHandler struct {
	svc *service.AnalyticsService
}

func NewAnalyticsHandler(svc *service.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{svc: svc}
}

// POST /api/v1/analytics/search
func (h *AnalyticsHandler) LogSearch(w http.ResponseWriter, r *http.Request) {
	var evt struct {
		SessionID    string   `json:"session_id"`
		QueryText    string   `json:"query_text"`
		QueryType    string   `json:"query_type"`
		ResultsCount int      `json:"results_count"`
		ResultsSKUs  []string `json:"results_skus"`
		ResponseMS   int      `json:"response_ms"`
		PageURL      string   `json:"page_url"`
		Referrer     string   `json:"referrer"`
		UserAgent    string   `json:"user_agent"`
		ScreenWidth  int      `json:"screen_width"`
	}
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	h.svc.LogSearch(evt.SessionID, evt.QueryText, evt.QueryType, evt.ResultsCount, evt.ResultsSKUs, evt.ResponseMS)
	w.WriteHeader(http.StatusNoContent)
}

// POST /api/v1/analytics/affiliate-click
func (h *AnalyticsHandler) LogAffiliateClick(w http.ResponseWriter, r *http.Request) {
	var evt struct {
		SessionID      string `json:"session_id"`
		SKU            string `json:"sku"`
		Retailer       string `json:"retailer"`
		DestinationURL string `json:"destination_url"`
		ReferrerQuery  string `json:"referrer_query"`
		PageURL        string `json:"page_url"`
		Referrer       string `json:"referrer"`
		UserAgent      string `json:"user_agent"`
		ScreenWidth    int    `json:"screen_width"`
	}
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	h.svc.LogAffiliateClick(evt.SessionID, evt.SKU, evt.Retailer, evt.DestinationURL, evt.PageURL, evt.ReferrerQuery)
	w.WriteHeader(http.StatusNoContent)
}

// POST /api/v1/analytics/pageview
func (h *AnalyticsHandler) LogPageView(w http.ResponseWriter, r *http.Request) {
	var evt struct {
		SessionID   string `json:"session_id"`
		PageType    string `json:"page_type"`
		PageSlug    string `json:"page_slug"`
		PageURL     string `json:"page_url"`
		Referrer    string `json:"referrer"`
		UserAgent   string `json:"user_agent"`
		ScreenWidth int    `json:"screen_width"`
	}
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	deviceType := "desktop"
	if evt.ScreenWidth < 768 {
		deviceType = "mobile"
	} else if evt.ScreenWidth < 1024 {
		deviceType = "tablet"
	}

	h.svc.LogPageView(evt.SessionID, evt.PageType, evt.PageSlug, evt.Referrer, evt.UserAgent, deviceType)
	w.WriteHeader(http.StatusNoContent)
}

// POST /api/v1/analytics/product-view
func (h *AnalyticsHandler) LogProductView(w http.ResponseWriter, r *http.Request) {
	var evt struct {
		SessionID string  `json:"session_id"`
		SKU       string  `json:"sku"`
		Brand     string  `json:"brand"`
		Ecosystem string  `json:"ecosystem"`
		Price     float64 `json:"price"`
		Source    string  `json:"source"`
		PageURL   string  `json:"page_url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	h.svc.LogProductView(evt.SessionID, evt.SKU, evt.Brand, evt.Ecosystem, evt.Price, evt.Source)
	w.WriteHeader(http.StatusNoContent)
}

// POST /api/v1/analytics/ecosystem-selection
func (h *AnalyticsHandler) LogEcosystemSelection(w http.ResponseWriter, r *http.Request) {
	var evt struct {
		SessionID string `json:"session_id"`
		Ecosystem string `json:"ecosystem"`
		Context   string `json:"context"`
	}
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	h.svc.LogEcosystemSelection(evt.SessionID, evt.Ecosystem, evt.Context)
	w.WriteHeader(http.StatusNoContent)
}

// POST /api/v1/analytics/toolkit-generated
func (h *AnalyticsHandler) LogToolkitGenerated(w http.ResponseWriter, r *http.Request) {
	var evt struct {
		SessionID   string  `json:"session_id"`
		ProjectSlug string  `json:"project_slug"`
		Ecosystem   string  `json:"ecosystem"`
		ToolCount   int     `json:"tool_count"`
		TotalCost   float64 `json:"total_cost"`
	}
	if err := json.NewDecoder(r.Body).Decode(&evt); err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	h.svc.LogToolkitGenerated(evt.SessionID, evt.ProjectSlug, evt.Ecosystem, evt.ToolCount, evt.TotalCost)
	w.WriteHeader(http.StatusNoContent)
}
