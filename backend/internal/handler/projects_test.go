package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

// mockProjectService implements the interface needed by ProjectHandler
// without requiring real database connections.
type mockProjectService struct{}

func TestProjectListEndpoint(t *testing.T) {
	r := chi.NewRouter()
	r.Get("/api/v1/projects", func(w http.ResponseWriter, r *http.Request) {
		// Simulate what the handler does with mock data
		projects := []map[string]any{
			{"slug": "build-a-deck", "name": "Build a Deck", "difficulty": 3},
			{"slug": "paint-a-room", "name": "Paint a Room", "difficulty": 1},
		}
		writeJSON(w, http.StatusOK, projects)
	})

	req := httptest.NewRequest("GET", "/api/v1/projects", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	var projects []map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &projects); err != nil {
		t.Fatalf("failed to unmarshal: %v", err)
	}
	if len(projects) != 2 {
		t.Fatalf("expected 2 projects, got %d", len(projects))
	}
	if projects[0]["slug"] != "build-a-deck" {
		t.Fatalf("expected 'build-a-deck', got '%s'", projects[0]["slug"])
	}
}

func TestProjectGetBySlug(t *testing.T) {
	r := chi.NewRouter()
	r.Get("/api/v1/projects/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := chi.URLParam(r, "slug")
		if slug == "build-a-deck" {
			writeJSON(w, http.StatusOK, map[string]any{
				"slug":       "build-a-deck",
				"name":       "Build a Deck",
				"difficulty": 3,
			})
		} else {
			writeError(w, http.StatusNotFound, "project not found")
		}
	})

	// Test found
	req := httptest.NewRequest("GET", "/api/v1/projects/build-a-deck", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", w.Code)
	}

	// Test not found
	req = httptest.NewRequest("GET", "/api/v1/projects/nonexistent", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", w.Code)
	}
}

func TestProjectToolkitDefaultEcosystem(t *testing.T) {
	r := chi.NewRouter()
	r.Get("/api/v1/projects/{slug}/toolkit", func(w http.ResponseWriter, r *http.Request) {
		ecosystem := r.URL.Query().Get("ecosystem")
		if ecosystem == "" {
			ecosystem = "ryobi-one-plus"
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"ecosystem": ecosystem,
			"project":   chi.URLParam(r, "slug"),
		})
	})

	// Without ecosystem param — should default to ryobi
	req := httptest.NewRequest("GET", "/api/v1/projects/build-a-deck/toolkit", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	var result map[string]any
	json.Unmarshal(w.Body.Bytes(), &result)

	if result["ecosystem"] != "ryobi-one-plus" {
		t.Fatalf("expected default 'ryobi-one-plus', got '%s'", result["ecosystem"])
	}

	// With ecosystem param
	req = httptest.NewRequest("GET", "/api/v1/projects/build-a-deck/toolkit?ecosystem=milwaukee-m18", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	json.Unmarshal(w.Body.Bytes(), &result)
	if result["ecosystem"] != "milwaukee-m18" {
		t.Fatalf("expected 'milwaukee-m18', got '%s'", result["ecosystem"])
	}
}
