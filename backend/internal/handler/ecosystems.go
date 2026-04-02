package handler

import (
	"encoding/json"
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
	data, err := h.ecoSvc.ListRaw(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list ecosystems")
		return
	}
	writeCached(w, http.StatusOK, data)
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

	toolsRaw, _ := h.productSvc.ListByEcosystemRaw(r.Context(), slug)

	// Build combined response with minimal allocation
	var tools json.RawMessage = []byte("[]")
	if toolsRaw != nil {
		tools = toolsRaw
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ecosystem":`))
	ecoJSON, _ := json.Marshal(eco)
	w.Write(ecoJSON)
	w.Write([]byte(`,"tools":`))
	w.Write(tools)
	w.Write([]byte(`}`))
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

	tools, err := h.productSvc.ListByEcosystem(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get tools")
		return
	}

	// Pick one tool per essential subcategory
	starterSubcats := [5]string{"drill-drivers", "impact-drivers", "circular-saws", "reciprocating-saws", "oscillating-multi-tools"}
	pickedSubcats := make(map[string]bool, 5)
	starterKit := make([]any, 0, 5)
	totalCost := 0.0

	for _, t := range tools {
		for _, sub := range starterSubcats {
			if t.Subcategory == sub && !pickedSubcats[sub] {
				pickedSubcats[sub] = true
				totalCost += t.PriceCurrent
				starterKit = append(starterKit, t)
				break
			}
		}
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ecosystem":   eco,
		"starter_kit": starterKit,
		"total_cost":  totalCost,
	})
}
