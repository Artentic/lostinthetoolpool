package handler

import (
	"encoding/json"
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/model"
)

type AdvisorHandler struct {
	// LLM integration will be added in Phase 5
}

func NewAdvisorHandler() *AdvisorHandler {
	return &AdvisorHandler{}
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

	// Phase 5 will implement:
	// 1. Embed query with Cohere
	// 2. Vector search Qdrant for relevant tools/projects
	// 3. Build context from search results
	// 4. Send to Claude via Bedrock with streaming
	// 5. Return structured toolkit recommendation

	writeJSON(w, http.StatusOK, &model.AdvisorResponse{
		Message: "Advisor feature coming soon. Describe your project and we'll recommend the perfect toolkit.",
	})
}
