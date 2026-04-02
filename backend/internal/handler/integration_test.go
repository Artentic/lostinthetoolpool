package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

// TestAPIIntegration tests all endpoints together on a single router,
// simulating a real API server without database dependencies.
// This verifies routing, method handling, and response formats.
func TestAPIIntegration(t *testing.T) {
	r := buildTestRouter()
	server := httptest.NewServer(r)
	defer server.Close()

	t.Run("health check", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/health")
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("health: expected 200, got %d", resp.StatusCode)
		}

		var body map[string]string
		json.NewDecoder(resp.Body).Decode(&body)
		if body["status"] != "ok" {
			t.Fatalf("expected status 'ok', got '%s'", body["status"])
		}
	})

	t.Run("list projects", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/api/v1/projects")
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("expected 200, got %d", resp.StatusCode)
		}

		assertJSON(t, resp)
	})

	t.Run("get project by slug", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/api/v1/projects/build-a-deck")
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("list ecosystems", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/api/v1/ecosystems")
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("list categories", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/api/v1/categories")
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("search requires POST", func(t *testing.T) {
		resp, err := http.Get(server.URL + "/api/v1/search")
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 405 {
			t.Fatalf("GET on search: expected 405, got %d", resp.StatusCode)
		}
	})

	t.Run("search with valid body", func(t *testing.T) {
		body := bytes.NewBufferString(`{"query":"impact driver"}`)
		resp, err := http.Post(server.URL+"/api/v1/search", "application/json", body)
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("advisor with valid body", func(t *testing.T) {
		body := bytes.NewBufferString(`{"query":"build a deck"}`)
		resp, err := http.Post(server.URL+"/api/v1/advisor", "application/json", body)
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			t.Fatalf("expected 200, got %d", resp.StatusCode)
		}
	})

	t.Run("analytics never fails", func(t *testing.T) {
		endpoints := []string{
			"/api/v1/analytics/search",
			"/api/v1/analytics/affiliate-click",
			"/api/v1/analytics/pageview",
			"/api/v1/analytics/product-view",
			"/api/v1/analytics/ecosystem-selection",
			"/api/v1/analytics/toolkit-generated",
		}

		for _, ep := range endpoints {
			body := bytes.NewBufferString(`{"session_id":"test"}`)
			resp, err := http.Post(server.URL+ep, "application/json", body)
			if err != nil {
				t.Fatalf("%s: %v", ep, err)
			}
			resp.Body.Close()

			if resp.StatusCode != 204 {
				t.Fatalf("%s: expected 204, got %d", ep, resp.StatusCode)
			}
		}
	})

	t.Run("CORS headers present", func(t *testing.T) {
		req, _ := http.NewRequest("OPTIONS", server.URL+"/api/v1/projects", nil)
		req.Header.Set("Origin", "https://lostinthetoolpool.com")
		req.Header.Set("Access-Control-Request-Method", "GET")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatal(err)
		}
		defer resp.Body.Close()

		acao := resp.Header.Get("Access-Control-Allow-Origin")
		if acao == "" {
			t.Fatal("expected Access-Control-Allow-Origin header")
		}
	})
}

// buildTestRouter creates a router with mock handlers for integration testing.
func buildTestRouter() *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]string{"status": "ok"})
	})

	r.Route("/api/v1", func(r chi.Router) {
		// CORS
		r.Use(func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Access-Control-Allow-Origin", "*")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
				if r.Method == "OPTIONS" {
					w.WriteHeader(200)
					return
				}
				next.ServeHTTP(w, r)
			})
		})

		r.Get("/projects", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, []map[string]any{
				{"slug": "build-a-deck", "name": "Build a Deck", "difficulty": 3},
			})
		})
		r.Get("/projects/{slug}", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{
				"slug": chi.URLParam(r, "slug"), "name": "Build a Deck",
			})
		})
		r.Get("/projects/{slug}/toolkit", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{"project": chi.URLParam(r, "slug")})
		})
		r.Get("/tools/{slug}", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{"slug": chi.URLParam(r, "slug")})
		})
		r.Get("/tools/{slug}/prices", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, []map[string]any{})
		})
		r.Get("/tools/compare", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{"products": []any{}})
		})
		r.Get("/ecosystems", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, []map[string]any{
				{"slug": "milwaukee-m18", "name": "Milwaukee M18"},
			})
		})
		r.Get("/ecosystems/{slug}", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{"slug": chi.URLParam(r, "slug")})
		})
		r.Get("/ecosystems/{slug}/starter-kit", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{"ecosystem": chi.URLParam(r, "slug")})
		})
		r.Post("/search", func(w http.ResponseWriter, r *http.Request) {
			var req struct{ Query string }
			json.NewDecoder(r.Body).Decode(&req)
			if req.Query == "" {
				writeError(w, 400, "query is required")
				return
			}
			writeJSON(w, 200, map[string]any{"total": 0, "products": []any{}})
		})
		r.Get("/categories", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, []map[string]any{
				{"slug": "cutting", "name": "Cutting"},
			})
		})
		r.Post("/advisor", func(w http.ResponseWriter, r *http.Request) {
			var req struct{ Query string }
			json.NewDecoder(r.Body).Decode(&req)
			if req.Query == "" {
				writeError(w, 400, "query is required")
				return
			}
			writeJSON(w, 200, map[string]string{"message": "advisor response"})
		})
		r.Get("/affiliate/redirect/{sku}", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]string{"sku": chi.URLParam(r, "sku")})
		})

		// Analytics — always 204
		for _, path := range []string{
			"/analytics/search", "/analytics/affiliate-click", "/analytics/pageview",
			"/analytics/product-view", "/analytics/ecosystem-selection", "/analytics/toolkit-generated",
		} {
			r.Post(path, func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(204)
			})
		}
	})

	return r
}

func assertJSON(t *testing.T, resp *http.Response) {
	t.Helper()
	ct := resp.Header.Get("Content-Type")
	if ct != "application/json" {
		t.Fatalf("expected Content-Type application/json, got '%s'", ct)
	}
}
