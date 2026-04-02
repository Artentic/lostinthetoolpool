package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/model"
	"github.com/Artentic/lostinthetoolpool/internal/service"
)

type AdvisorHandler struct {
	advisorSvc *service.AdvisorService
}

func NewAdvisorHandler(advisorSvc *service.AdvisorService) *AdvisorHandler {
	return &AdvisorHandler{advisorSvc: advisorSvc}
}

// POST /api/v1/advisor
func (h *AdvisorHandler) Advise(w http.ResponseWriter, r *http.Request) {
	var req model.AdvisorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Query == "" {
		writeError(w, http.StatusBadRequest, "query is required")
		return
	}

	// Check if client accepts streaming
	if r.Header.Get("Accept") == "text/event-stream" {
		h.adviseStream(w, r, req)
		return
	}

	if h.advisorSvc == nil {
		writeJSON(w, http.StatusOK, &model.AdvisorResponse{
			Message: "Advisor service not configured. Set AWS credentials and COHERE_API_KEY.",
		})
		return
	}

	resp, err := h.advisorSvc.Advise(r.Context(), req)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "advisor failed: "+err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (h *AdvisorHandler) adviseStream(w http.ResponseWriter, r *http.Request, req model.AdvisorRequest) {
	if h.advisorSvc == nil {
		writeError(w, http.StatusServiceUnavailable, "advisor not configured")
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.WriteHeader(http.StatusOK)

	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}

	if err := h.advisorSvc.AdviseStream(r.Context(), req, w); err != nil {
		// Can't send error status after headers are sent, just log
		_ = json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
	}
}
