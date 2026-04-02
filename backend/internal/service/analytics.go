package service

import (
	"context"
	"time"

	"github.com/Artentic/lostinthetoolpool/internal/database"
)

// AnalyticsService handles all event logging to ClickHouse.
// All methods are fire-and-forget — they never block the request.
// Safe to call with nil ClickHouse client (silently drops events).
type AnalyticsService struct {
	ch *database.ClickHouseClient
}

func NewAnalyticsService(ch *database.ClickHouseClient) *AnalyticsService {
	return &AnalyticsService{ch: ch}
}

func (s *AnalyticsService) exec(query string, args ...any) {
	if s.ch == nil {
		return
	}
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_ = s.ch.Conn().Exec(ctx, query, args...)
	}()
}

func (s *AnalyticsService) LogSearch(sessionID, queryText, queryType string, resultsCount int, resultsSKUs []string, responseMS int) {
	s.exec(`INSERT INTO search_queries (session_id, query_text, query_type, results_count, results_skus, response_ms)
		VALUES (?, ?, ?, ?, ?, ?)`, sessionID, queryText, queryType, resultsCount, resultsSKUs, responseMS)
}

func (s *AnalyticsService) LogAffiliateClick(sessionID, sku, retailer, destinationURL, referrerPage, referrerQuery string) {
	s.exec(`INSERT INTO affiliate_clicks (session_id, sku, retailer, destination_url, referrer_page, referrer_query)
		VALUES (?, ?, ?, ?, ?, ?)`, sessionID, sku, retailer, destinationURL, referrerPage, referrerQuery)
}

func (s *AnalyticsService) LogPageView(sessionID, pageType, pageSlug, referrer, userAgent, deviceType string) {
	s.exec(`INSERT INTO sessions (session_id, last_seen, page_views, user_agent, referrer, device_type)
		VALUES (?, now(), 1, ?, ?, ?)`, sessionID, userAgent, referrer, deviceType)
	s.exec(`INSERT INTO page_views (session_id, page_type, page_slug, device_type, referrer)
		VALUES (?, ?, ?, ?, ?)`, sessionID, pageType, pageSlug, deviceType, referrer)
}

func (s *AnalyticsService) LogProductView(sessionID, sku, brand, ecosystem string, price float64, source string) {
	s.exec(`INSERT INTO product_views (session_id, sku, brand, ecosystem, price, source)
		VALUES (?, ?, ?, ?, ?, ?)`, sessionID, sku, brand, ecosystem, price, source)
}

func (s *AnalyticsService) LogEcosystemSelection(sessionID, ecosystem, selectionContext string) {
	s.exec(`INSERT INTO ecosystem_selections (session_id, ecosystem, context)
		VALUES (?, ?, ?)`, sessionID, ecosystem, selectionContext)
}

func (s *AnalyticsService) LogToolkitGenerated(sessionID, projectSlug, ecosystem string, toolCount int, totalCost float64) {
	s.exec(`INSERT INTO toolkit_generations (session_id, project_slug, ecosystem, tool_count, total_cost)
		VALUES (?, ?, ?, ?, ?)`, sessionID, projectSlug, ecosystem, toolCount, totalCost)
}
