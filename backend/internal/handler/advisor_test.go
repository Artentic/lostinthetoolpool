package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestAdvisorValidation(t *testing.T) {
	r := chi.NewRouter()
	r.Post("/api/v1/advisor", func(w http.ResponseWriter, r *http.Request) {
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
		writeJSON(w, http.StatusOK, map[string]string{"message": "advisor response"})
	})

	tests := []struct {
		name     string
		body     string
		wantCode int
	}{
		{"valid", `{"query":"build a deck"}`, 200},
		{"empty query", `{"query":""}`, 400},
		{"with budget", `{"query":"build a deck","budget":500}`, 200},
		{"with ecosystem", `{"query":"build a deck","ecosystem":"ryobi-one-plus"}`, 200},
		{"invalid json", `not json`, 400},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/v1/advisor", bytes.NewBufferString(tc.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tc.wantCode {
				t.Fatalf("expected %d, got %d", tc.wantCode, w.Code)
			}
		})
	}
}

func TestAdvisorStreamingHeader(t *testing.T) {
	r := chi.NewRouter()
	r.Post("/api/v1/advisor", func(w http.ResponseWriter, r *http.Request) {
		accept := r.Header.Get("Accept")
		if accept == "text/event-stream" {
			w.Header().Set("Content-Type", "text/event-stream")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("data: streaming\n\n"))
		} else {
			writeJSON(w, http.StatusOK, map[string]string{"message": "sync response"})
		}
	})

	// Sync request
	req := httptest.NewRequest("POST", "/api/v1/advisor", bytes.NewBufferString(`{"query":"test"}`))
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if ct := w.Header().Get("Content-Type"); ct != "application/json" {
		t.Fatalf("sync: expected application/json, got '%s'", ct)
	}

	// Streaming request
	req = httptest.NewRequest("POST", "/api/v1/advisor", bytes.NewBufferString(`{"query":"test"}`))
	req.Header.Set("Accept", "text/event-stream")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if ct := w.Header().Get("Content-Type"); ct != "text/event-stream" {
		t.Fatalf("streaming: expected text/event-stream, got '%s'", ct)
	}
}
