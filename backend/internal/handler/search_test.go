package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestSearchValidation(t *testing.T) {
	r := chi.NewRouter()
	r.Post("/api/v1/search", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Query string `json:"query"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if req.Query == "" {
			writeError(w, http.StatusBadRequest, "query is required")
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"query": req.Query, "total": 0})
	})

	tests := []struct {
		name     string
		body     string
		wantCode int
	}{
		{"valid query", `{"query":"impact driver"}`, 200},
		{"empty query", `{"query":""}`, 400},
		{"no query field", `{}`, 400},
		{"invalid json", `{bad`, 400},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/v1/search", bytes.NewBufferString(tc.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tc.wantCode {
				t.Fatalf("expected %d, got %d (body: %s)", tc.wantCode, w.Code, w.Body.String())
			}
		})
	}
}
