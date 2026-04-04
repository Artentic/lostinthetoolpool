package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/store"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

// Local API server — serves from catalog.json, no databases needed.
// Run: go run cmd/local/main.go
func main() {
	catalogPath := os.Getenv("CATALOG_PATH")
	if catalogPath == "" {
		catalogPath = "../data/catalog.json"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	projectsPath := os.Getenv("PROJECTS_PATH")
	if projectsPath == "" {
		projectsPath = "../data/projects.json"
	}

	log.Printf("Loading catalog from %s...", catalogPath)
	s, err := store.Load(catalogPath)
	if err != nil {
		log.Fatalf("Failed to load catalog: %v", err)
	}
	log.Printf("Loaded %d products, %d ecosystems, %d brands",
		s.Count(), len(s.Ecosystems()), len(s.Brands()))

	// Load projects
	var projects []map[string]any
	if data, err := os.ReadFile(projectsPath); err == nil {
		json.Unmarshal(data, &projects)
		log.Printf("Loaded %d projects", len(projects))
	} else {
		log.Printf("No projects file: %v", err)
	}

	// Index projects by slug
	projectBySlug := make(map[string]map[string]any)
	for _, p := range projects {
		if slug, ok := p["slug"].(string); ok {
			projectBySlug[slug] = p
		}
	}

	r := chi.NewRouter()
	r.Use(chimw.RealIP)
	r.Use(chimw.Recoverer)
	r.Use(chimw.Compress(5))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Content-Type"},
		MaxAge:         300,
	}))
	// Cache-Control on all GET responses
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == "GET" {
				w.Header().Set("Cache-Control", "public, max-age=300")
			}
			next.ServeHTTP(w, r)
		})
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]any{"status": "ok", "products": s.Count()})
	})

	r.Route("/api/v1", func(r chi.Router) {
		// Projects
		r.Get("/projects", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, projects)
		})

		r.Get("/projects/{slug}", func(w http.ResponseWriter, r *http.Request) {
			slug := chi.URLParam(r, "slug")
			p, ok := projectBySlug[slug]
			if !ok {
				writeErr(w, 404, "project not found")
				return
			}
			writeJSON(w, 200, p)
		})

		r.Get("/projects/{slug}/toolkit", func(w http.ResponseWriter, r *http.Request) {
			slug := chi.URLParam(r, "slug")
			p, ok := projectBySlug[slug]
			if !ok {
				writeErr(w, 404, "project not found")
				return
			}

			ecosystem := r.URL.Query().Get("ecosystem")
			if ecosystem == "" {
				ecosystem = "ryobi-one-plus"
			}

			// Match essential tools to real products in the chosen ecosystem
			var toolkitProducts []map[string]any
			if tools, ok := p["essential_tools"].([]any); ok {
				for _, t := range tools {
					toolName, _ := t.(string)
					// Search for this tool type in the ecosystem
					results := s.FilteredSearch(strings.ReplaceAll(toolName, "-", " "), ecosystem, 0, 0, false, 1)
					if len(results) > 0 {
						toolkitProducts = append(toolkitProducts, map[string]any{
							"tool_type": toolName,
							"priority":  "essential",
							"product":   results[0],
						})
					} else {
						// Fallback: search across all ecosystems
						results = s.Search(strings.ReplaceAll(toolName, "-", " "), 1)
						if len(results) > 0 {
							toolkitProducts = append(toolkitProducts, map[string]any{
								"tool_type": toolName,
								"priority":  "essential",
								"product":   results[0],
							})
						}
					}
				}
			}

			// Total cost
			totalCost := 0.0
			for _, tp := range toolkitProducts {
				if prod, ok := tp["product"].(*store.Product); ok {
					totalCost += prod.PriceCurrent
				}
			}

			writeJSON(w, 200, map[string]any{
				"project":    p,
				"ecosystem":  ecosystem,
				"toolkit":    toolkitProducts,
				"total_cost": totalCost,
			})
		})

		// Products / Tools
		r.Get("/tools/{slug}", func(w http.ResponseWriter, r *http.Request) {
			p := s.GetBySlug(chi.URLParam(r, "slug"))
			if p == nil {
				writeErr(w, 404, "tool not found")
				return
			}
			writeJSON(w, 200, p)
		})

		r.Get("/tools/compare", func(w http.ResponseWriter, r *http.Request) {
			ids := strings.Split(r.URL.Query().Get("ids"), ",")
			var products []*store.Product
			for _, id := range ids {
				if p := s.GetBySKU(strings.TrimSpace(id)); p != nil {
					products = append(products, p)
				}
			}
			writeJSON(w, 200, map[string]any{"products": products})
		})

		// Search
		r.Post("/search", func(w http.ResponseWriter, r *http.Request) {
			var req struct {
				Query   string `json:"query"`
				Eco     string `json:"ecosystem"`
				Limit   int    `json:"limit"`
			}
			json.NewDecoder(r.Body).Decode(&req)
			if req.Query == "" {
				writeErr(w, 400, "query required")
				return
			}
			if req.Limit <= 0 {
				req.Limit = 20
			}
			start := time.Now()
			var results []*store.Product
			if req.Eco != "" {
				results = s.FilteredSearch(req.Query, req.Eco, 0, 0, false, req.Limit)
			} else {
				results = s.Search(req.Query, req.Limit)
			}
			writeJSON(w, 200, map[string]any{
				"products": results,
				"total":    len(results),
				"query_ms": time.Since(start).Milliseconds(),
			})
		})

		// Ecosystems
		r.Get("/ecosystems", func(w http.ResponseWriter, r *http.Request) {
			type eco struct {
				Slug  string `json:"slug"`
				Count int    `json:"tool_count"`
			}
			var ecos []eco
			for _, e := range s.Ecosystems() {
				ecos = append(ecos, eco{Slug: e, Count: len(s.ListByEcosystem(e))})
			}
			writeJSON(w, 200, ecos)
		})

		r.Get("/ecosystems/{slug}", func(w http.ResponseWriter, r *http.Request) {
			slug := chi.URLParam(r, "slug")
			tools := s.ListByEcosystem(slug)
			if len(tools) == 0 {
				writeErr(w, 404, "ecosystem not found")
				return
			}
			writeJSON(w, 200, map[string]any{"ecosystem": slug, "tools": tools, "count": len(tools)})
		})

		// Categories
		r.Get("/categories", func(w http.ResponseWriter, r *http.Request) {
			type cat struct {
				Slug  string `json:"slug"`
				Count int    `json:"tool_count"`
			}
			var cats []cat
			for _, c := range s.Categories() {
				cats = append(cats, cat{Slug: c, Count: len(s.ListByCategory(c))})
			}
			writeJSON(w, 200, cats)
		})

		// Brands
		r.Get("/brands", func(w http.ResponseWriter, r *http.Request) {
			type brand struct {
				Name  string `json:"name"`
				Count int    `json:"tool_count"`
			}
			var brands []brand
			for _, b := range s.Brands() {
				brands = append(brands, brand{Name: b, Count: len(s.ListByBrand(b))})
			}
			writeJSON(w, 200, brands)
		})

		// Stats
		r.Get("/stats", func(w http.ResponseWriter, r *http.Request) {
			writeJSON(w, 200, map[string]any{
				"total_products": s.Count(),
				"ecosystems":     len(s.Ecosystems()),
				"categories":     len(s.Categories()),
				"brands":         len(s.Brands()),
			})
		})

		// Analytics (accept but don't store in local mode)
		for _, path := range []string{
			"/analytics/search", "/analytics/affiliate-click", "/analytics/pageview",
			"/analytics/product-view", "/analytics/ecosystem-selection", "/analytics/toolkit-generated",
		} {
			r.Post(path, func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(204)
			})
		}
	})

	log.Printf("Local API server on http://localhost:%s", port)
	log.Printf("Try: curl http://localhost:%s/api/v1/stats", port)
	log.Printf("Try: curl -X POST http://localhost:%s/api/v1/search -d '{\"query\":\"impact driver\"}'", port)

	srv := &http.Server{Addr: ":" + port, Handler: r, ReadTimeout: 10 * time.Second, WriteTimeout: 10 * time.Second}
	log.Fatal(srv.ListenAndServe())
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(`{"error":"` + msg + `"}`))
}
