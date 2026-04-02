import { browser } from '$app/environment';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Server-side analytics via our ClickHouse backend.
 * These events go to our own database — full data ownership, no third party.
 * Used for business-critical metrics: search queries, affiliate clicks, revenue attribution.
 */

let sessionId = '';

function getSessionId(): string {
	if (!browser) return '';
	if (!sessionId) {
		// Generate a session ID that persists for this tab/session
		sessionId = crypto.randomUUID();
	}
	return sessionId;
}

// Fire and forget — don't await, don't block
function sendEvent(endpoint: string, data: Record<string, unknown>) {
	if (!browser) return;

	const payload = {
		...data,
		session_id: getSessionId(),
		timestamp: new Date().toISOString(),
		page_url: window.location.pathname,
		referrer: document.referrer,
		user_agent: navigator.userAgent,
		screen_width: window.innerWidth
	};

	// Use sendBeacon for reliability (works even on page unload)
	const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
	const sent = navigator.sendBeacon(`${API_BASE}${endpoint}`, blob);

	// Fallback to fetch if sendBeacon fails
	if (!sent) {
		fetch(`${API_BASE}${endpoint}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			keepalive: true
		}).catch(() => {}); // Silent fail — analytics should never break the UX
	}
}

// ============================================================================
// SEARCH EVENTS → ClickHouse search_queries table
// ============================================================================

export function logSearch(query: string, queryType: string, resultCount: number, responseMs: number, resultSkus: string[] = []) {
	sendEvent('/api/v1/analytics/search', {
		query_text: query,
		query_type: queryType, // 'search', 'advisor', 'compare'
		results_count: resultCount,
		results_skus: resultSkus,
		response_ms: responseMs
	});
}

// ============================================================================
// AFFILIATE CLICK EVENTS → ClickHouse affiliate_clicks table
// ============================================================================

export function logAffiliateClick(sku: string, retailer: string, destinationUrl: string, referrerQuery: string = '') {
	sendEvent('/api/v1/analytics/affiliate-click', {
		sku,
		retailer,
		destination_url: destinationUrl,
		referrer_query: referrerQuery
	});
}

// ============================================================================
// PAGE VIEW EVENTS → ClickHouse sessions table
// ============================================================================

export function logPageView(pageType: string, pageSlug: string = '') {
	sendEvent('/api/v1/analytics/pageview', {
		page_type: pageType, // 'home', 'project', 'tool', 'ecosystem', 'advisor', 'compare', 'search'
		page_slug: pageSlug
	});
}

// ============================================================================
// PRODUCT INTERACTION EVENTS → ClickHouse for conversion funnels
// ============================================================================

export function logProductView(sku: string, brand: string, ecosystem: string, price: number, source: string) {
	sendEvent('/api/v1/analytics/product-view', {
		sku,
		brand,
		ecosystem,
		price,
		source // 'search', 'project_toolkit', 'ecosystem_page', 'comparison', 'advisor'
	});
}

export function logEcosystemSelection(ecosystem: string, context: string) {
	sendEvent('/api/v1/analytics/ecosystem-selection', {
		ecosystem,
		context // 'project_toolkit', 'starter_kit', 'comparison'
	});
}

export function logToolkitGenerated(projectSlug: string, ecosystem: string, toolCount: number, totalCost: number) {
	sendEvent('/api/v1/analytics/toolkit-generated', {
		project_slug: projectSlug,
		ecosystem,
		tool_count: toolCount,
		total_cost: totalCost
	});
}
