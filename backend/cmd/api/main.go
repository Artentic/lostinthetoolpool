package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/config"
	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/handler"
	mw "github.com/Artentic/lostinthetoolpool/internal/middleware"
	"github.com/Artentic/lostinthetoolpool/internal/service"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	cfg := config.Load()

	// Initialize database connections
	ch, err := database.NewClickHouse(cfg.ClickHouseDSN)
	if err != nil {
		log.Fatalf("clickhouse: %v", err)
	}
	defer ch.Close()

	qdrant, err := database.NewQdrant(cfg.QdrantHost, cfg.QdrantPort)
	if err != nil {
		log.Fatalf("qdrant: %v", err)
	}
	defer qdrant.Close()

	neo4j, err := database.NewNeo4j(cfg.Neo4jURI, cfg.Neo4jUser, cfg.Neo4jPassword)
	if err != nil {
		log.Fatalf("neo4j: %v", err)
	}
	defer neo4j.Close(context.Background())

	redis, err := database.NewRedis(cfg.RedisAddr)
	if err != nil {
		log.Fatalf("redis: %v", err)
	}
	defer redis.Close()

	// Initialize services
	productSvc := service.NewProductService(ch, redis)
	ecosystemSvc := service.NewEcosystemService(neo4j, redis)
	projectSvc := service.NewProjectService(neo4j, redis)
	searchSvc := service.NewSearchService(qdrant, ch, redis)
	categorySvc := service.NewCategoryService(neo4j, redis)

	// Initialize handlers
	toolH := handler.NewToolHandler(productSvc)
	ecoH := handler.NewEcosystemHandler(ecosystemSvc, productSvc)
	projH := handler.NewProjectHandler(projectSvc)
	searchH := handler.NewSearchHandler(searchSvc)
	catH := handler.NewCategoryHandler(categorySvc)
	affH := handler.NewAffiliateHandler(productSvc)
	advisorH := handler.NewAdvisorHandler()

	// Router
	r := chi.NewRouter()

	// Middleware
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(mw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(chimw.Compress(5))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	// API v1 routes
	r.Route("/api/v1", func(r chi.Router) {
		// Projects
		r.Get("/projects", projH.List)
		r.Get("/projects/{slug}", projH.GetBySlug)
		r.Get("/projects/{slug}/toolkit", projH.GetToolkit)

		// Tools
		r.Get("/tools/{slug}", toolH.GetBySlug)
		r.Get("/tools/{slug}/prices", toolH.GetPriceHistory)
		r.Get("/tools/compare", toolH.Compare)

		// Ecosystems
		r.Get("/ecosystems", ecoH.List)
		r.Get("/ecosystems/{slug}", ecoH.GetBySlug)
		r.Get("/ecosystems/{slug}/starter-kit", ecoH.GetStarterKit)

		// Search
		r.Post("/search", searchH.Search)

		// Categories
		r.Get("/categories", catH.List)

		// Advisor (AI-powered)
		r.Post("/advisor", advisorH.Advise)

		// Affiliate
		r.Get("/affiliate/redirect/{sku}", affH.Redirect)
	})

	// Server
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		log.Printf("API server starting on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("server shutdown: %v", err)
	}
	log.Println("Server stopped")
}
