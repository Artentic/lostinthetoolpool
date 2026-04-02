package service

import (
	"strings"
	"testing"

	"github.com/Artentic/lostinthetoolpool/internal/model"
)

func TestBuildContext(t *testing.T) {
	svc := &AdvisorService{}

	req := model.AdvisorRequest{
		Query:      "build a deck on a budget",
		Budget:     500,
		Ecosystem:  "ryobi-one-plus",
		OwnedTools: []string{"drill", "tape-measure"},
	}

	ctx := svc.buildContext(nil, nil, req)

	if !strings.Contains(ctx, "Lost in the Tool Pool advisor") {
		t.Error("context should contain system prompt")
	}
	if !strings.Contains(ctx, "$500") {
		t.Error("context should contain budget")
	}
	if !strings.Contains(ctx, "ryobi-one-plus") {
		t.Error("context should contain ecosystem preference")
	}
	if !strings.Contains(ctx, "drill, tape-measure") {
		t.Error("context should contain owned tools")
	}
}

func TestBuildContextNoOptionalFields(t *testing.T) {
	svc := &AdvisorService{}

	req := model.AdvisorRequest{
		Query: "what tools for a fence",
	}

	ctx := svc.buildContext(nil, nil, req)

	if strings.Contains(ctx, "USER BUDGET") {
		t.Error("should not contain budget section when budget is 0")
	}
	if strings.Contains(ctx, "PREFERRED ECOSYSTEM") {
		t.Error("should not contain ecosystem section when empty")
	}
	if strings.Contains(ctx, "TOOLS ALREADY OWNED") {
		t.Error("should not contain owned tools section when empty")
	}
}

func TestBuildContextRules(t *testing.T) {
	svc := &AdvisorService{}
	req := model.AdvisorRequest{Query: "test"}
	ctx := svc.buildContext(nil, nil, req)

	requiredRules := []string{
		"opinionated recommendations",
		"WHY each tool is needed",
		"Essential, Recommended, or Optional",
		"rental for tools",
		"safety equipment",
		"battery ecosystem",
		"beginners",
	}

	for _, rule := range requiredRules {
		if !strings.Contains(ctx, rule) {
			t.Errorf("context missing required rule: %s", rule)
		}
	}
}

func TestBedrockRequestFormat(t *testing.T) {
	req := bedrockRequest{
		AnthropicVersion: "bedrock-2023-05-31",
		MaxTokens:        2048,
		System:           "You are a tool advisor.",
		Messages: []bedrockMessage{
			{Role: "user", Content: "build a deck"},
		},
	}

	if req.AnthropicVersion != "bedrock-2023-05-31" {
		t.Error("wrong anthropic version")
	}
	if req.MaxTokens != 2048 {
		t.Error("wrong max tokens")
	}
	if len(req.Messages) != 1 {
		t.Error("expected 1 message")
	}
	if req.Messages[0].Role != "user" {
		t.Error("expected user role")
	}
}
