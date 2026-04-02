package handler

import (
	"net/http"

	"github.com/Artentic/lostinthetoolpool/internal/service"
	"github.com/go-chi/chi/v5"
)

type ProjectHandler struct {
	svc *service.ProjectService
}

func NewProjectHandler(svc *service.ProjectService) *ProjectHandler {
	return &ProjectHandler{svc: svc}
}

// GET /api/v1/projects
func (h *ProjectHandler) List(w http.ResponseWriter, r *http.Request) {
	projects, err := h.svc.List(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list projects")
		return
	}
	writeJSON(w, http.StatusOK, projects)
}

// GET /api/v1/projects/{slug}
func (h *ProjectHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	if slug == "" {
		writeError(w, http.StatusBadRequest, "slug is required")
		return
	}

	project, err := h.svc.GetBySlug(r.Context(), slug)
	if err != nil {
		writeError(w, http.StatusNotFound, "project not found")
		return
	}
	writeJSON(w, http.StatusOK, project)
}

// GET /api/v1/projects/{slug}/toolkit?ecosystem=milwaukee-m18
func (h *ProjectHandler) GetToolkit(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	ecosystem := r.URL.Query().Get("ecosystem")
	if ecosystem == "" {
		ecosystem = "ryobi-one-plus" // default to budget-friendly
	}

	toolkit, err := h.svc.GetToolkit(r.Context(), slug, ecosystem)
	if err != nil {
		writeError(w, http.StatusNotFound, "toolkit not found")
		return
	}
	writeJSON(w, http.StatusOK, toolkit)
}
