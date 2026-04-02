package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/model"
	"github.com/Artentic/lostinthetoolpool/internal/service"
)

type SearchHandler struct {
	searchSvc *service.SearchService
}

func NewSearchHandler(searchSvc *service.SearchService) *SearchHandler {
	return &SearchHandler{searchSvc: searchSvc}
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

	// TODO: Generate embedding via Cohere API
	// For now, return a placeholder response
	// In production: embedding := embed(req.Query)
	// Then: results := h.searchSvc.Search(ctx, embedding, req.Filters, req.Limit)

	writeJSON(w, http.StatusOK, &model.SearchResult{
		Products: nil,
		Total:    0,
		QueryMS:  0,
	})
}
