package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type EmbeddingService struct {
	apiKey     string
	httpClient *http.Client
}

func NewEmbeddingService(apiKey string) *EmbeddingService {
	return &EmbeddingService{
		apiKey: apiKey,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

type cohereEmbedRequest struct {
	Texts     []string `json:"texts"`
	Model     string   `json:"model"`
	InputType string   `json:"input_type"`
}

type cohereEmbedResponse struct {
	Embeddings [][]float32 `json:"embeddings"`
}

// Embed generates embeddings for the given texts using Cohere embed-english-v3.0.
// inputType should be "search_query" for user queries or "search_document" for tool descriptions.
func (s *EmbeddingService) Embed(ctx context.Context, texts []string, inputType string) ([][]float32, error) {
	if len(texts) == 0 {
		return nil, nil
	}

	// Cohere allows max 96 texts per request
	var allEmbeddings [][]float32
	for i := 0; i < len(texts); i += 96 {
		end := i + 96
		if end > len(texts) {
			end = len(texts)
		}
		batch := texts[i:end]

		embeddings, err := s.embedBatch(ctx, batch, inputType)
		if err != nil {
			return nil, fmt.Errorf("embed batch %d: %w", i/96, err)
		}
		allEmbeddings = append(allEmbeddings, embeddings...)
	}

	return allEmbeddings, nil
}

// EmbedQuery embeds a single search query.
func (s *EmbeddingService) EmbedQuery(ctx context.Context, query string) ([]float32, error) {
	embeddings, err := s.Embed(ctx, []string{query}, "search_query")
	if err != nil {
		return nil, err
	}
	if len(embeddings) == 0 {
		return nil, fmt.Errorf("no embedding returned")
	}
	return embeddings[0], nil
}

func (s *EmbeddingService) embedBatch(ctx context.Context, texts []string, inputType string) ([][]float32, error) {
	reqBody := cohereEmbedRequest{
		Texts:     texts,
		Model:     "embed-english-v3.0",
		InputType: inputType,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.cohere.ai/v1/embed", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("cohere request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("cohere error %d: %s", resp.StatusCode, string(respBody))
	}

	var result cohereEmbedResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("decode cohere response: %w", err)
	}

	return result.Embeddings, nil
}
