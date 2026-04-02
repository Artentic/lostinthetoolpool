package config

import "os"

type Config struct {
	Port          string
	ClickHouseDSN string
	QdrantHost    string
	QdrantPort    string
	Neo4jURI      string
	Neo4jUser     string
	Neo4jPassword string
	AWSRegion     string
	BedrockModel  string
	CohereAPIKey  string
}

func Load() *Config {
	return &Config{
		Port:          getEnv("PORT", "8080"),
		ClickHouseDSN: getEnv("CLICKHOUSE_DSN", "clickhouse://litp:litp_dev_2024@localhost:9000/litp"),
		QdrantHost:    getEnv("QDRANT_HOST", "localhost"),
		QdrantPort:    getEnv("QDRANT_PORT", "6334"),
		Neo4jURI:      getEnv("NEO4J_URI", "bolt://localhost:7687"),
		Neo4jUser:     getEnv("NEO4J_USER", "neo4j"),
		Neo4jPassword: getEnv("NEO4J_PASSWORD", "litp_dev_2024"),
		AWSRegion:     getEnv("AWS_REGION", "us-east-1"),
		BedrockModel:  getEnv("BEDROCK_MODEL", "anthropic.claude-sonnet-4-6-20250514-v1:0"),
		CohereAPIKey:  getEnv("COHERE_API_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
