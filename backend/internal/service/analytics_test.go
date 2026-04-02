package service

import (
	"testing"
)

func TestAnalyticsServiceCreation(t *testing.T) {
	// AnalyticsService should accept a nil ClickHouse client gracefully
	// (fire-and-forget goroutines will just fail silently)
	svc := NewAnalyticsService(nil)
	if svc == nil {
		t.Fatal("expected non-nil service")
	}
}

func TestAnalyticsFireAndForget(t *testing.T) {
	// All analytics methods should not panic even with nil client
	// They run in goroutines so we can't easily assert,
	// but we can verify they don't panic on call
	svc := NewAnalyticsService(nil)

	// These should all return immediately without panic
	svc.LogSearch("s1", "drill", "search", 10, []string{"SKU1"}, 50)
	svc.LogAffiliateClick("s1", "SKU1", "amazon", "url", "/tools/drill", "drill")
	svc.LogPageView("s1", "tool", "drill", "", "Chrome", "desktop")
	svc.LogProductView("s1", "SKU1", "Milwaukee", "m18", 149, "search")
	svc.LogEcosystemSelection("s1", "milwaukee-m18", "toolkit")
	svc.LogToolkitGenerated("s1", "build-a-deck", "ryobi-one-plus", 5, 350)
}
