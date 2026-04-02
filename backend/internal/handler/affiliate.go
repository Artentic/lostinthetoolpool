package handler

import (
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/model"
	"github.com/Artentic/lostinthetoolpool/internal/service"
	"github.com/go-chi/chi/v5"
)

type AffiliateHandler struct {
	productSvc *service.ProductService
}

func NewAffiliateHandler(productSvc *service.ProductService) *AffiliateHandler {
	return &AffiliateHandler{productSvc: productSvc}
}

// GET /api/v1/affiliate/redirect/{sku}?retailer=amazon
func (h *AffiliateHandler) Redirect(w http.ResponseWriter, r *http.Request) {
	sku := chi.URLParam(r, "sku")
	retailer := r.URL.Query().Get("retailer")
	if retailer == "" {
		retailer = "amazon"
	}

	product, err := h.productSvc.GetBySKU(r.Context(), sku)
	if err != nil {
		writeError(w, http.StatusNotFound, "product not found")
		return
	}

	// Parse affiliate links from product
	var links map[string]string
	if err := product.AffiliateLinks.UnmarshalJSON([]byte(product.AffiliateLinks)); err != nil {
		writeError(w, http.StatusInternalServerError, "invalid affiliate links")
		return
	}

	destURL, ok := links[retailer]
	if !ok || destURL == "" {
		// Fallback to first available retailer
		for _, url := range links {
			if url != "" {
				destURL = url
				break
			}
		}
	}

	if destURL == "" {
		writeError(w, http.StatusNotFound, "no affiliate link available")
		return
	}

	// Track the click
	sessionID := r.URL.Query().Get("sid")
	click := model.AffiliateClick{
		SessionID:      sessionID,
		SKU:            sku,
		Retailer:       retailer,
		DestinationURL: destURL,
		ReferrerPage:   r.Referer(),
		ReferrerQuery:  r.URL.Query().Get("q"),
	}

	_ = h.productSvc.TrackAffiliateClick(r.Context(), click)

	http.Redirect(w, r, destURL, http.StatusTemporaryRedirect)
}
