package config

import (
	"os"
	"testing"
)

func TestLoadDefaults(t *testing.T) {
	// Clear any env vars that might interfere
	envVars := []string{"PORT", "CLICKHOUSE_DSN", "QDRANT_HOST", "QDRANT_PORT",
		"NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD", "AWS_REGION",
		"BEDROCK_MODEL", "COHERE_API_KEY"}
	saved := make(map[string]string)
	for _, k := range envVars {
		saved[k] = os.Getenv(k)
		os.Unsetenv(k)
	}
	defer func() {
		for k, v := range saved {
			if v != "" {
				os.Setenv(k, v)
			}
		}
	}()

	cfg := Load()

	if cfg.Port != "8080" {
		t.Errorf("default port = %s, want 8080", cfg.Port)
	}
	if cfg.AWSRegion != "us-east-1" {
		t.Errorf("default region = %s, want us-east-1", cfg.AWSRegion)
	}
	if cfg.QdrantHost != "localhost" {
		t.Errorf("default qdrant host = %s, want localhost", cfg.QdrantHost)
	}
	if cfg.QdrantPort != "6334" {
		t.Errorf("default qdrant port = %s, want 6334", cfg.QdrantPort)
	}
	if cfg.CohereAPIKey != "" {
		t.Errorf("default cohere key should be empty, got %s", cfg.CohereAPIKey)
	}
}

func TestLoadFromEnv(t *testing.T) {
	os.Setenv("PORT", "9090")
	os.Setenv("COHERE_API_KEY", "test-key-123")
	defer os.Unsetenv("PORT")
	defer os.Unsetenv("COHERE_API_KEY")

	cfg := Load()

	if cfg.Port != "9090" {
		t.Errorf("port = %s, want 9090", cfg.Port)
	}
	if cfg.CohereAPIKey != "test-key-123" {
		t.Errorf("cohere key = %s, want test-key-123", cfg.CohereAPIKey)
	}
}

func TestGetEnvFallback(t *testing.T) {
	os.Unsetenv("TEST_NONEXISTENT_KEY")
	val := getEnv("TEST_NONEXISTENT_KEY", "fallback-value")
	if val != "fallback-value" {
		t.Errorf("expected fallback, got %s", val)
	}
}
