package handler

import (
	"net/http"
	"strings"

	"github.com/Artentic/lostinthetoolpool/internal/service"
	"github.com/go-chi/chi/v5"
)

type ToolHandler struct {
	productSvc *service.ProductService
}

func NewToolHandler(productSvc *service.ProductService) *ToolHandler {
	return &ToolHandler{productSvc: productSvc}
}

// GET /api/v1/tools/{slug}
func (h *ToolHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	if slug == "" {
		writeError(w, http.StatusBadRequest, "slug is required")
		return
	}

	product, err := h.productSvc.GetBySlug(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusNotFound, "tool not found")
		return
	}

	writeJSON(w, http.StatusOK, product)
}

// GET /api/v1/tools/compare?ids=SKU1,SKU2,SKU3
func (h *ToolHandler) Compare(w http.ResponseWriter, r *http.Request) {
	idsParam := r.URL.Query().Get("ids")
	if idsParam == "" {
		writeError(w, http.StatusBadRequest, "ids parameter required (comma-separated SKUs)")
		return
	}

	skus := strings.Split(idsParam, ",")
	if len(skus) < 2 {
		writeError(w, http.StatusBadRequest, "at least 2 SKUs required for comparison")
		return
	}
	if len(skus) > 5 {
		writeError(w, http.StatusBadRequest, "max 5 products for comparison")
		return
	}

	result, err := h.productSvc.Compare(r.Context(), skus)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "comparison failed")
		return
	}

	writeJSON(w, http.StatusOK, result)
}

// GET /api/v1/tools/{slug}/prices
func (h *ToolHandler) GetPriceHistory(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	product, err := h.productSvc.GetBySlug(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusNotFound, "tool not found")
		return
	}

	history, err := h.productSvc.GetPriceHistory(r.Context(), product.SKU)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get price history")
		return
	}

	writeJSON(w, http.StatusOK, history)
}
