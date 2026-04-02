package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"github.com/Artentic/lostinthetoolpool/internal/database"
	"github.com/Artentic/lostinthetoolpool/internal/model"
	pb "github.com/qdrant/go-client/qdrant"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/bedrockruntime"
)

type AdvisorService struct {
	bedrock   *bedrockruntime.Client
	modelID   string
	embedSvc  *EmbeddingService
	qdrant    *database.QdrantClient
	ch        *database.ClickHouseClient
	redis     *database.RedisClient
}

func NewAdvisorService(region, modelID string, embedSvc *EmbeddingService, qdrant *database.QdrantClient, ch *database.ClickHouseClient, redis *database.RedisClient) (*AdvisorService, error) {
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(region))
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	client := bedrockruntime.NewFromConfig(cfg)

	return &AdvisorService{
		bedrock:  client,
		modelID:  modelID,
		embedSvc: embedSvc,
		qdrant:   qdrant,
		ch:       ch,
		redis:    redis,
	}, nil
}

// Advise processes a user's project description and returns tool recommendations.
// It uses RAG: embed query → search Qdrant → build context → send to Claude.
func (s *AdvisorService) Advise(ctx context.Context, req model.AdvisorRequest) (*model.AdvisorResponse, error) {
	// Step 1: Embed the user's query
	embedding, err := s.embedSvc.EmbedQuery(ctx, req.Query)
	if err != nil {
		return nil, fmt.Errorf("embed query: %w", err)
	}

	// Step 2: Search Qdrant for relevant tools and projects
	toolResults, err := s.searchTools(ctx, embedding, 15)
	if err != nil {
		return nil, fmt.Errorf("search tools: %w", err)
	}

	projectResults, err := s.searchProjects(ctx, embedding, 3)
	if err != nil {
		return nil, fmt.Errorf("search projects: %w", err)
	}

	// Step 3: Build context for Claude
	context_text := s.buildContext(toolResults, projectResults, req)

	// Step 4: Call Claude via Bedrock
	response, err := s.callClaude(ctx, context_text, req.Query)
	if err != nil {
		return nil, fmt.Errorf("call claude: %w", err)
	}

	return &model.AdvisorResponse{
		Message: response,
	}, nil
}

// AdviseStream sends a streaming response for the advisor.
func (s *AdvisorService) AdviseStream(ctx context.Context, req model.AdvisorRequest, writer io.Writer) error {
	embedding, err := s.embedSvc.EmbedQuery(ctx, req.Query)
	if err != nil {
		return fmt.Errorf("embed query: %w", err)
	}

	toolResults, err := s.searchTools(ctx, embedding, 15)
	if err != nil {
		return fmt.Errorf("search tools: %w", err)
	}

	projectResults, err := s.searchProjects(ctx, embedding, 3)
	if err != nil {
		return fmt.Errorf("search projects: %w", err)
	}

	contextText := s.buildContext(toolResults, projectResults, req)

	return s.callClaudeStreaming(ctx, contextText, req.Query, writer)
}

func (s *AdvisorService) searchTools(ctx context.Context, embedding []float32, limit int) ([]*pb.ScoredPoint, error) {
	resp, err := s.qdrant.Points().Search(ctx, &pb.SearchPoints{
		CollectionName: "tools",
		Vector:         embedding,
		Limit:          uint64(limit),
		WithPayload:    &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	})
	if err != nil {
		return nil, err
	}
	return resp.GetResult(), nil
}

func (s *AdvisorService) searchProjects(ctx context.Context, embedding []float32, limit int) ([]*pb.ScoredPoint, error) {
	resp, err := s.qdrant.Points().Search(ctx, &pb.SearchPoints{
		CollectionName: "projects",
		Vector:         embedding,
		Limit:          uint64(limit),
		WithPayload:    &pb.WithPayloadSelector{SelectorOptions: &pb.WithPayloadSelector_Enable{Enable: true}},
	})
	if err != nil {
		return nil, err
	}
	return resp.GetResult(), nil
}

func (s *AdvisorService) buildContext(tools []*pb.ScoredPoint, projects []*pb.ScoredPoint, req model.AdvisorRequest) string {
	var sb strings.Builder

	sb.WriteString("You are the Lost in the Tool Pool advisor — a friendly, knowledgeable tool expert who helps DIY homeowners figure out exactly what tools they need for their projects.\n\n")
	sb.WriteString("RULES:\n")
	sb.WriteString("- Give opinionated recommendations, not 50 options\n")
	sb.WriteString("- Explain WHY each tool is needed in plain language\n")
	sb.WriteString("- Categorize tools as Essential, Recommended, or Optional\n")
	sb.WriteString("- Suggest rental for tools that will only be used once\n")
	sb.WriteString("- Mention safety equipment needed\n")
	sb.WriteString("- If the user mentions a budget, respect it\n")
	sb.WriteString("- If the user mentions an ecosystem preference, recommend tools from that ecosystem\n")
	sb.WriteString("- Always mention the battery ecosystem implications of their choices\n")
	sb.WriteString("- Be friendly and encouraging — these are beginners\n\n")

	if req.Budget > 0 {
		sb.WriteString(fmt.Sprintf("USER BUDGET: $%.0f\n\n", req.Budget))
	}
	if req.Ecosystem != "" {
		sb.WriteString(fmt.Sprintf("PREFERRED ECOSYSTEM: %s\n\n", req.Ecosystem))
	}
	if len(req.OwnedTools) > 0 {
		sb.WriteString(fmt.Sprintf("TOOLS ALREADY OWNED: %s\n\n", strings.Join(req.OwnedTools, ", ")))
	}

	if len(projects) > 0 {
		sb.WriteString("RELEVANT PROJECTS FROM DATABASE:\n")
		for _, p := range projects {
			payload := p.GetPayload()
			name := payload["name"].GetStringValue()
			desc := payload["description"].GetStringValue()
			sb.WriteString(fmt.Sprintf("- %s: %s\n", name, desc))
		}
		sb.WriteString("\n")
	}

	if len(tools) > 0 {
		sb.WriteString("RELEVANT TOOLS FROM DATABASE:\n")
		for _, t := range tools {
			payload := t.GetPayload()
			name := payload["name"].GetStringValue()
			brand := payload["brand"].GetStringValue()
			eco := payload["ecosystem"].GetStringValue()
			price := payload["price"].GetDoubleValue()
			sb.WriteString(fmt.Sprintf("- %s (%s, %s) — $%.0f\n", name, brand, eco, price))
		}
		sb.WriteString("\n")
	}

	return sb.String()
}

type bedrockRequest struct {
	AnthropicVersion string           `json:"anthropic_version"`
	MaxTokens        int              `json:"max_tokens"`
	System           string           `json:"system,omitempty"`
	Messages         []bedrockMessage `json:"messages"`
}

type bedrockMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type bedrockResponse struct {
	Content []struct {
		Text string `json:"text"`
	} `json:"content"`
}

func (s *AdvisorService) callClaude(ctx context.Context, systemPrompt, userQuery string) (string, error) {
	reqBody := bedrockRequest{
		AnthropicVersion: "bedrock-2023-05-31",
		MaxTokens:        2048,
		System:           systemPrompt,
		Messages: []bedrockMessage{
			{Role: "user", Content: userQuery},
		},
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	resp, err := s.bedrock.InvokeModel(ctx, &bedrockruntime.InvokeModelInput{
		ModelId:     aws.String(s.modelID),
		Body:        body,
		ContentType: aws.String("application/json"),
	})
	if err != nil {
		return "", fmt.Errorf("invoke bedrock: %w", err)
	}

	var result bedrockResponse
	if err := json.Unmarshal(resp.Body, &result); err != nil {
		return "", fmt.Errorf("decode bedrock response: %w", err)
	}

	if len(result.Content) == 0 {
		return "", fmt.Errorf("empty response from bedrock")
	}

	return result.Content[0].Text, nil
}

func (s *AdvisorService) callClaudeStreaming(ctx context.Context, systemPrompt, userQuery string, writer io.Writer) error {
	reqBody := bedrockRequest{
		AnthropicVersion: "bedrock-2023-05-31",
		MaxTokens:        2048,
		System:           systemPrompt,
		Messages: []bedrockMessage{
			{Role: "user", Content: userQuery},
		},
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	resp, err := s.bedrock.InvokeModelWithResponseStream(ctx, &bedrockruntime.InvokeModelWithResponseStreamInput{
		ModelId:     aws.String(s.modelID),
		Body:        body,
		ContentType: aws.String("application/json"),
	})
	if err != nil {
		return fmt.Errorf("invoke bedrock stream: %w", err)
	}

	stream := resp.GetStream()
	defer stream.Close()

	for event := range stream.Events() {
		switch v := event.(type) {
		case *bedrockruntime.InvokeModelWithResponseStreamOutputMemberChunk:
			// Parse the chunk to extract text delta
			var chunk struct {
				Type  string `json:"type"`
				Delta struct {
					Type string `json:"type"`
					Text string `json:"text"`
				} `json:"delta"`
			}
			if err := json.Unmarshal(v.Value.Bytes, &chunk); err == nil {
				if chunk.Delta.Text != "" {
					fmt.Fprintf(writer, "data: %s\n\n", chunk.Delta.Text)
					if f, ok := writer.(interface{ Flush() }); ok {
						f.Flush()
					}
				}
			}
		}
	}

	return nil
}
