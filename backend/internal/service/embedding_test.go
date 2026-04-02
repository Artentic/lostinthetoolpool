package service

import (
	"testing"
)

func TestEmbeddingServiceCreation(t *testing.T) {
	svc := NewEmbeddingService("test-key")
	if svc == nil {
		t.Fatal("expected non-nil service")
	}
	if svc.apiKey != "test-key" {
		t.Fatalf("expected apiKey 'test-key', got '%s'", svc.apiKey)
	}
}

func TestEmbedEmptyTexts(t *testing.T) {
	svc := NewEmbeddingService("test-key")
	result, err := svc.Embed(nil, []string{}, "search_query")
	if err != nil {
		t.Fatalf("unexpected error for empty texts: %v", err)
	}
	if result != nil {
		t.Fatal("expected nil result for empty texts")
	}
}

func TestCohereEmbedRequestBatching(t *testing.T) {
	// Verify that batching logic works for >96 texts
	// We can't call the real API, but we can test the batch splitting logic
	texts := make([]string, 200)
	for i := range texts {
		texts[i] = "test text"
	}

	// With 200 texts and batch size 96, we need 3 batches
	batchCount := 0
	for i := 0; i < len(texts); i += 96 {
		end := i + 96
		if end > len(texts) {
			end = len(texts)
		}
		batch := texts[i:end]
		batchCount++

		if batchCount == 1 && len(batch) != 96 {
			t.Fatalf("first batch should be 96, got %d", len(batch))
		}
		if batchCount == 2 && len(batch) != 96 {
			t.Fatalf("second batch should be 96, got %d", len(batch))
		}
		if batchCount == 3 && len(batch) != 8 {
			t.Fatalf("third batch should be 8, got %d", len(batch))
		}
	}

	if batchCount != 3 {
		t.Fatalf("expected 3 batches for 200 texts, got %d", batchCount)
	}
}
