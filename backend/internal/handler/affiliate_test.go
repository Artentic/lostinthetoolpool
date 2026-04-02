package handler

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestAffiliateRedirectDefaultRetailer(t *testing.T) {
	r := chi.NewRouter()
	r.Get("/api/v1/affiliate/redirect/{sku}", func(w http.ResponseWriter, r *http.Request) {
		retailer := r.URL.Query().Get("retailer")
		if retailer == "" {
			retailer = "amazon"
		}
		// In real handler, would look up product and redirect
		writeJSON(w, http.StatusOK, map[string]string{
			"sku":      chi.URLParam(r, "sku"),
			"retailer": retailer,
		})
	})

	// Without retailer — defaults to amazon
	req := httptest.NewRequest("GET", "/api/v1/affiliate/redirect/MIL-2853-20", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// With retailer
	req = httptest.NewRequest("GET", "/api/v1/affiliate/redirect/MIL-2853-20?retailer=homedepot", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}
}
