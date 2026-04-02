package config

import "os"

type Config struct {
	Port                string
	AWSRegion           string
	OpenSearchEndpoint  string
	FirehoseStreamName  string
	BedrockModel        string
	CohereAPIKey        string
}

func Load() *Config {
	return &Config{
		Port:               getEnv("PORT", "8080"),
		AWSRegion:          getEnv("AWS_REGION", "us-east-1"),
		OpenSearchEndpoint: getEnv("OPENSEARCH_ENDPOINT", ""),
		FirehoseStreamName: getEnv("FIREHOSE_STREAM", "litp-analytics"),
		BedrockModel:       getEnv("BEDROCK_MODEL", "anthropic.claude-sonnet-4-6-20250514-v1:0"),
		CohereAPIKey:       getEnv("COHERE_API_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
