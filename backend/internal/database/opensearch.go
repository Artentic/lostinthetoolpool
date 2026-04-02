package database

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
)

// OpenSearchClient connects to OpenSearch Serverless for vector search.
// Uses AWS SigV4 signing — no separate credentials needed.
type OpenSearchClient struct {
	endpoint   string
	region     string
	httpClient *http.Client
	cfg        aws.Config
}

func NewOpenSearch(region, endpoint string) (*OpenSearchClient, error) {
	cfg, err := awsconfig.LoadDefaultConfig(context.Background(), awsconfig.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	return &OpenSearchClient{
		endpoint:   endpoint,
		region:     region,
		httpClient: &http.Client{Timeout: 10 * time.Second},
		cfg:        cfg,
	}, nil
}

type VectorSearchRequest struct {
	Vector  []float32         `json:"vector"`
	K       int               `json:"k"`
	Filters map[string]any    `json:"filters,omitempty"`
}

type VectorSearchResult struct {
	SKU   string  `json:"sku"`
	Name  string  `json:"name"`
	Score float32 `json:"score"`
}

// Search performs a k-NN vector search against the tools index.
func (o *OpenSearchClient) Search(ctx context.Context, collection string, vector []float32, k int, filters map[string]any) ([]VectorSearchResult, error) {
	query := map[string]any{
		"size": k,
		"query": map[string]any{
			"knn": map[string]any{
				"embedding": map[string]any{
					"vector": vector,
					"k":      k,
				},
			},
		},
		"_source": []string{"sku", "name", "brand", "ecosystem", "price"},
	}

	if len(filters) > 0 {
		query["query"] = map[string]any{
			"bool": map[string]any{
				"must": []any{
					map[string]any{
						"knn": map[string]any{
							"embedding": map[string]any{
								"vector": vector,
								"k":      k,
							},
						},
					},
				},
				"filter": buildFilters(filters),
			},
		}
	}

	body, err := json.Marshal(query)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/%s/_search", o.endpoint, collection)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	// Sign with SigV4 for OpenSearch Serverless
	creds, err := o.cfg.Credentials.Retrieve(ctx)
	if err != nil {
		return nil, fmt.Errorf("get credentials: %w", err)
	}

	signer := v4.NewSigner()
	hash := "unsigned-payload"
	err = signer.SignHTTP(ctx, creds, req, hash, "aoss", o.region, time.Now())
	if err != nil {
		return nil, fmt.Errorf("sign request: %w", err)
	}

	resp, err := o.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("opensearch request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("opensearch error %d: %s", resp.StatusCode, string(respBody))
	}

	var result struct {
		Hits struct {
			Hits []struct {
				Score  float32        `json:"_score"`
				Source map[string]any `json:"_source"`
			} `json:"hits"`
		} `json:"hits"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("decode opensearch response: %w", err)
	}

	var results []VectorSearchResult
	for _, hit := range result.Hits.Hits {
		r := VectorSearchResult{Score: hit.Score}
		if v, ok := hit.Source["sku"].(string); ok {
			r.SKU = v
		}
		if v, ok := hit.Source["name"].(string); ok {
			r.Name = v
		}
		results = append(results, r)
	}

	return results, nil
}

func buildFilters(filters map[string]any) []any {
	var result []any
	for k, v := range filters {
		switch val := v.(type) {
		case string:
			result = append(result, map[string]any{"term": map[string]any{k: val}})
		case []string:
			result = append(result, map[string]any{"terms": map[string]any{k: val}})
		case bool:
			result = append(result, map[string]any{"term": map[string]any{k: val}})
		}
	}
	return result
}
