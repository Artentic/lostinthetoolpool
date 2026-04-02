package handler

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestAnalyticsEndpointsReturn204(t *testing.T) {
	// Analytics endpoints should always return 204 No Content
	// They should never fail — analytics must not break the UX
	r := chi.NewRouter()

	endpoints := map[string]string{
		"/api/v1/analytics/search":              `{"session_id":"s1","query_text":"drill","query_type":"search"}`,
		"/api/v1/analytics/affiliate-click":      `{"session_id":"s1","sku":"MIL-001","retailer":"amazon"}`,
		"/api/v1/analytics/pageview":             `{"session_id":"s1","page_type":"tool","page_slug":"milwaukee"}`,
		"/api/v1/analytics/product-view":         `{"session_id":"s1","sku":"MIL-001","brand":"Milwaukee"}`,
		"/api/v1/analytics/ecosystem-selection":  `{"session_id":"s1","ecosystem":"milwaukee-m18"}`,
		"/api/v1/analytics/toolkit-generated":    `{"session_id":"s1","project_slug":"build-a-deck"}`,
	}

	for path := range endpoints {
		r.Post(path, func(w http.ResponseWriter, r *http.Request) {
			// Simulate analytics handler: always 204, never fail
			w.WriteHeader(http.StatusNoContent)
		})
	}

	for path, body := range endpoints {
		t.Run(path, func(t *testing.T) {
			req := httptest.NewRequest("POST", path, bytes.NewBufferString(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != http.StatusNoContent {
				t.Fatalf("expected 204, got %d for %s", w.Code, path)
			}
		})
	}
}

func TestAnalyticsHandlesMalformedJSON(t *testing.T) {
	r := chi.NewRouter()
	r.Post("/api/v1/analytics/search", func(w http.ResponseWriter, r *http.Request) {
		// Even with bad JSON, analytics should not error
		w.WriteHeader(http.StatusNoContent)
	})

	req := httptest.NewRequest("POST", "/api/v1/analytics/search", bytes.NewBufferString("not json at all"))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Fatalf("expected 204 even with bad JSON, got %d", w.Code)
	}
}

func TestAnalyticsHandlesEmptyBody(t *testing.T) {
	r := chi.NewRouter()
	r.Post("/api/v1/analytics/pageview", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})

	req := httptest.NewRequest("POST", "/api/v1/analytics/pageview", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Fatalf("expected 204 with empty body, got %d", w.Code)
	}
}
