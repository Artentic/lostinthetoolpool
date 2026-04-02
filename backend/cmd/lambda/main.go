package main

import (
	"context"
	"log"
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/cache"
	"github.com/Artentic/lostinthetoolpool/internal/config"
	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/handler"
	mw "github.com/Artentic/lostinthetoolpool/internal/middleware"
	"github.com/Artentic/lostinthetoolpool/internal/service"
	"github.com/aws/aws-lambda-go/lambda"
	chiadapter "github.com/awslabs/aws-lambda-go-api-proxy/chi"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

var chiLambda *chiadapter.ChiLambda

// init runs once on cold start — connections reused across warm invocations.
func init() {
	cfg := config.Load()
	memCache := cache.New()

	ch, err := database.NewClickHouse(cfg.ClickHouseDSN)
	if err != nil {
		log.Fatalf("clickhouse: %v", err)
	}

	qdrant, err := database.NewQdrant(cfg.QdrantHost, cfg.QdrantPort)
	if err != nil {
		log.Fatalf("qdrant: %v", err)
	}

	neo4j, err := database.NewNeo4j(cfg.Neo4jURI, cfg.Neo4jUser, cfg.Neo4jPassword)
	if err != nil {
		log.Fatalf("neo4j: %v", err)
	}

	// Services
	productSvc := service.NewProductService(ch, memCache)
	ecosystemSvc := service.NewEcosystemService(neo4j, memCache)
	projectSvc := service.NewProjectService(neo4j, memCache)
	searchSvc := service.NewSearchService(qdrant, ch, memCache)
	categorySvc := service.NewCategoryService(neo4j, memCache)
	analyticsSvc := service.NewAnalyticsService(ch)

	var embedSvc *service.EmbeddingService
	if cfg.CohereAPIKey != "" {
		embedSvc = service.NewEmbeddingService(cfg.CohereAPIKey)
	}

	var advisorSvc *service.AdvisorService
	if embedSvc != nil {
		advisorSvc, err = service.NewAdvisorService(cfg.AWSRegion, cfg.BedrockModel, embedSvc, qdrant, ch)
		if err != nil {
			log.Printf("advisor not available: %v", err)
		}
	}

	// Handlers
	toolH := handler.NewToolHandler(productSvc)
	ecoH := handler.NewEcosystemHandler(ecosystemSvc, productSvc)
	projH := handler.NewProjectHandler(projectSvc)
	searchH := handler.NewSearchHandler(searchSvc, embedSvc)
	catH := handler.NewCategoryHandler(categorySvc)
	affH := handler.NewAffiliateHandler(productSvc)
	advisorH := handler.NewAdvisorHandler(advisorSvc)
	analyticsH := handler.NewAnalyticsHandler(analyticsSvc)

	r := chi.NewRouter()
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(mw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","runtime":"lambda"}`))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/projects", projH.List)
		r.Get("/projects/{slug}", projH.GetBySlug)
		r.Get("/projects/{slug}/toolkit", projH.GetToolkit)
		r.Get("/tools/{slug}", toolH.GetBySlug)
		r.Get("/tools/{slug}/prices", toolH.GetPriceHistory)
		r.Get("/tools/compare", toolH.Compare)
		r.Get("/ecosystems", ecoH.List)
		r.Get("/ecosystems/{slug}", ecoH.GetBySlug)
		r.Get("/ecosystems/{slug}/starter-kit", ecoH.GetStarterKit)
		r.Post("/search", searchH.Search)
		r.Get("/categories", catH.List)
		r.Post("/advisor", advisorH.Advise)
		r.Get("/affiliate/redirect/{sku}", affH.Redirect)
		r.Post("/analytics/search", analyticsH.LogSearch)
		r.Post("/analytics/affiliate-click", analyticsH.LogAffiliateClick)
		r.Post("/analytics/pageview", analyticsH.LogPageView)
		r.Post("/analytics/product-view", analyticsH.LogProductView)
		r.Post("/analytics/ecosystem-selection", analyticsH.LogEcosystemSelection)
		r.Post("/analytics/toolkit-generated", analyticsH.LogToolkitGenerated)
	})

	chiLambda = chiadapter.New(r)
}

func main() {
	lambda.Start(func(ctx context.Context, req chiadapter.Request) (chiadapter.Response, error) {
		return chiLambda.ProxyWithContext(ctx, req)
	})
}
