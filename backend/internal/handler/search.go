package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/model"
	"github.com/Artentic/lostinthetoolpool/internal/service"
)

type SearchHandler struct {
	searchSvc *service.SearchService
	embedSvc  *service.EmbeddingService
}

func NewSearchHandler(searchSvc *service.SearchService, embedSvc *service.EmbeddingService) *SearchHandler {
	return &SearchHandler{searchSvc: searchSvc, embedSvc: embedSvc}
}

// POST /api/v1/search
func (h *SearchHandler) Search(w http.ResponseWriter, r *http.Request) {
	var req model.SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Query == "" {
		writeError(w, http.StatusBadRequest, "query is required")
		return
	}

	// Check cache first
	if cached := h.searchSvc.GetCachedSearch(r.Context(), req.Query); cached != nil {
		writeJSON(w, http.StatusOK, cached)
		return
	}

	// Generate embedding via Cohere
	if h.embedSvc == nil {
		writeJSON(w, http.StatusOK, &model.SearchResult{Products: nil, Total: 0, QueryMS: 0})
		return
	}

	embedding, err := h.embedSvc.EmbedQuery(r.Context(), req.Query)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to generate embedding")
		return
	}

	results, err := h.searchSvc.Search(r.Context(), embedding, req.Filters, req.Limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "search failed")
		return
	}

	// Cache and log
	h.searchSvc.CacheSearchResult(r.Context(), req.Query, results)

	var skus []string
	for _, p := range results.Products {
		skus = append(skus, p.SKU)
	}
	sessionID := r.URL.Query().Get("sid")
	h.searchSvc.LogQuery(r.Context(), sessionID, req.Query, "search", results.Total, skus, "", int(results.QueryMS))

	writeJSON(w, http.StatusOK, results)
}
