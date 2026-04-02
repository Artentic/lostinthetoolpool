package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestToolCompareValidation(t *testing.T) {
	r := chi.NewRouter()
	r.Get("/api/v1/tools/compare", func(w http.ResponseWriter, r *http.Request) {
		idsParam := r.URL.Query().Get("ids")
		if idsParam == "" {
			writeError(w, http.StatusBadRequest, "ids parameter required (comma-separated SKUs)")
			return
		}
		skus := splitNonEmpty(idsParam, ",")
		if len(skus) < 2 {
			writeError(w, http.StatusBadRequest, "at least 2 SKUs required for comparison")
			return
		}
		if len(skus) > 5 {
			writeError(w, http.StatusBadRequest, "max 5 products for comparison")
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"count": len(skus)})
	})

	tests := []struct {
		name     string
		url      string
		wantCode int
	}{
		{"no ids", "/api/v1/tools/compare", 400},
		{"one id", "/api/v1/tools/compare?ids=SKU1", 400},
		{"two ids", "/api/v1/tools/compare?ids=SKU1,SKU2", 200},
		{"five ids", "/api/v1/tools/compare?ids=A,B,C,D,E", 200},
		{"six ids", "/api/v1/tools/compare?ids=A,B,C,D,E,F", 400},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", tc.url, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tc.wantCode {
				t.Fatalf("expected %d, got %d", tc.wantCode, w.Code)
			}
		})
	}
}

func TestToolGetBySlug(t *testing.T) {
	r := chi.NewRouter()
	r.Get("/api/v1/tools/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := chi.URLParam(r, "slug")
		if slug == "" {
			writeError(w, http.StatusBadRequest, "slug is required")
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"slug": slug})
	})

	req := httptest.NewRequest("GET", "/api/v1/tools/milwaukee-m18-fuel-impact-driver", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var result map[string]string
	json.Unmarshal(w.Body.Bytes(), &result)
	if result["slug"] != "milwaukee-m18-fuel-impact-driver" {
		t.Fatalf("expected slug in response, got '%s'", result["slug"])
	}
}

// helper for tests — split and filter empty strings
func splitNonEmpty(s string, sep string) []string {
	parts := make([]string, 0)
	for _, p := range splitString(s, sep) {
		if p != "" {
			parts = append(parts, p)
		}
	}
	return parts
}

func splitString(s, sep string) []string {
	if s == "" {
		return nil
	}
	result := make([]string, 0)
	start := 0
	for i := 0; i < len(s); i++ {
		if string(s[i]) == sep {
			result = append(result, s[start:i])
			start = i + 1
		}
	}
	result = append(result, s[start:])
	return result
}
