package handler

import (
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/service"
	"github.com/go-chi/chi/v5"
)

type EcosystemHandler struct {
	ecoSvc     *service.EcosystemService
	productSvc *service.ProductService
}

func NewEcosystemHandler(ecoSvc *service.EcosystemService, productSvc *service.ProductService) *EcosystemHandler {
	return &EcosystemHandler{ecoSvc: ecoSvc, productSvc: productSvc}
}

// GET /api/v1/ecosystems
func (h *EcosystemHandler) List(w http.ResponseWriter, r *http.Request) {
	ecosystems, err := h.ecoSvc.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list ecosystems")
		return
	}
	writeJSON(w, http.StatusOK, ecosystems)
}

// GET /api/v1/ecosystems/{slug}
func (h *EcosystemHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	if slug == "" {
		writeError(w, http.StatusBadRequest, "slug is required")
		return
	}

	eco, err := h.ecoSvc.GetBySlug(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusNotFound, "ecosystem not found")
		return
	}

	// Fetch tools in this ecosystem
	tools, _ := h.productSvc.ListByEcosystem(r.Context(), slug)

	writeJSON(w, http.StatusOK, map[string]any{
		"ecosystem": eco,
		"tools":     tools,
	})
}

// GET /api/v1/ecosystems/{slug}/starter-kit
func (h *EcosystemHandler) GetStarterKit(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	if slug == "" {
		writeError(w, http.StatusBadRequest, "slug is required")
		return
	}

	eco, err := h.ecoSvc.GetBySlug(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusNotFound, "ecosystem not found")
		return
	}

	// Get all tools in ecosystem, pick the essential starter kit
	tools, err := h.productSvc.ListByEcosystem(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get tools")
		return
	}

	// Starter kit: one from each essential subcategory
	starterSubcategories := map[string]bool{
		"drill-drivers":        true,
		"impact-drivers":       true,
		"circular-saws":        true,
		"reciprocating-saws":   true,
		"oscillating-multi-tools": true,
	}

	var starterKit []any
	pickedSubcats := make(map[string]bool)
	totalCost := 0.0

	for _, t := range tools {
		if starterSubcategories[t.Subcategory] && !pickedSubcats[t.Subcategory] {
			pickedSubcats[t.Subcategory] = true
			totalCost += t.PriceCurrent
			starterKit = append(starterKit, t)
		}
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ecosystem":  eco,
		"starter_kit": starterKit,
		"total_cost":  totalCost,
	})
}
