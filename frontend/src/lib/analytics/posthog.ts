import posthog from 'posthog-js';
import { browser } from '$app/environment';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.posthog.com';

let initialized = false;

export function initPostHog() {
	if (!browser || !POSTHOG_KEY || initialized) return;

	posthog.init(POSTHOG_KEY, {
		api_host: POSTHOG_HOST,
		// Cookieless mode — no banner needed, GDPR safe
		persistence: 'memory',
		// Autocapture everything: clicks, inputs, page views
		autocapture: true,
		// Session replay
		enable_recording_console_log: false,
		// Capture page views on route change
		capture_pageview: false, // We handle this manually for SvelteKit
		capture_pageleave: true,
		// Disable cookies entirely
		disable_cookie: true,
		disable_persistence: false,
		// Performance
		loaded: (ph) => {
			// Start session recording
			ph.startSessionRecording();
		}
	});

	initialized = true;
}

// ============================================================================
// PAGE TRACKING
// ============================================================================

export function trackPageView(url: string) {
	if (!browser || !initialized) return;
	posthog.capture('$pageview', {
		$current_url: url
	});
}

// ============================================================================
// SEARCH & ADVISOR TRACKING
// ============================================================================

export function trackSearch(query: string, resultCount: number, responseMs: number) {
	if (!browser) return;
	posthog.capture('search_performed', {
		query,
		result_count: resultCount,
		response_ms: responseMs,
		query_length: query.length,
		query_word_count: query.trim().split(/\s+/).length
	});
}

export function trackAdvisorQuery(query: string, options?: { budget?: number; ecosystem?: string }) {
	if (!browser) return;
	posthog.capture('advisor_query', {
		query,
		has_budget: !!options?.budget,
		budget: options?.budget,
		ecosystem_preference: options?.ecosystem,
		query_length: query.length
	});
}

export function trackExampleQueryClicked(query: string, location: string) {
	if (!browser) return;
	posthog.capture('example_query_clicked', {
		query,
		location // 'homepage', 'advisor'
	});
}

// ============================================================================
// PRODUCT & TOOL TRACKING
// ============================================================================

export function trackProductView(sku: string, name: string, brand: string, ecosystem: string, price: number) {
	if (!browser) return;
	posthog.capture('product_viewed', {
		sku,
		product_name: name,
		brand,
		ecosystem,
		price,
		price_bucket: getPriceBucket(price)
	});
}

export function trackAffiliateClick(sku: string, retailer: string, price: number, source: string) {
	if (!browser) return;
	posthog.capture('affiliate_click', {
		sku,
		retailer,
		price,
		source, // 'product_page', 'toolkit', 'comparison', 'advisor'
		price_bucket: getPriceBucket(price)
	});
}

export function trackCompareStarted(skus: string[]) {
	if (!browser) return;
	posthog.capture('compare_started', {
		sku_count: skus.length,
		skus
	});
}

export function trackCompareToolAdded(sku: string, name: string) {
	if (!browser) return;
	posthog.capture('compare_tool_added', { sku, product_name: name });
}

export function trackCompareToolRemoved(sku: string) {
	if (!browser) return;
	posthog.capture('compare_tool_removed', { sku });
}

// ============================================================================
// PROJECT TRACKING
// ============================================================================

export function trackProjectView(slug: string, name: string, difficulty: number) {
	if (!browser) return;
	posthog.capture('project_viewed', {
		project_slug: slug,
		project_name: name,
		difficulty
	});
}

export function trackEcosystemSelected(ecosystem: string, context: string) {
	if (!browser) return;
	posthog.capture('ecosystem_selected', {
		ecosystem,
		context // 'project_toolkit', 'ecosystem_page', 'advisor'
	});
}

export function trackToolkitViewed(projectSlug: string, ecosystem: string, toolCount: number, totalCost: number) {
	if (!browser) return;
	posthog.capture('toolkit_viewed', {
		project_slug: projectSlug,
		ecosystem,
		tool_count: toolCount,
		total_cost: totalCost,
		cost_bucket: getPriceBucket(totalCost)
	});
}

export function trackOwnedToolToggled(sku: string, owned: boolean) {
	if (!browser) return;
	posthog.capture('owned_tool_toggled', { sku, marked_as_owned: owned });
}

// ============================================================================
// ECOSYSTEM TRACKING
// ============================================================================

export function trackEcosystemView(slug: string, name: string) {
	if (!browser) return;
	posthog.capture('ecosystem_viewed', {
		ecosystem_slug: slug,
		ecosystem_name: name
	});
}

export function trackStarterKitViewed(ecosystem: string, totalCost: number) {
	if (!browser) return;
	posthog.capture('starter_kit_viewed', {
		ecosystem,
		total_cost: totalCost
	});
}

// ============================================================================
// ENGAGEMENT TRACKING
// ============================================================================

export function trackScrollDepth(depth: number, page: string) {
	if (!browser) return;
	// Only track at 25%, 50%, 75%, 100% milestones
	posthog.capture('scroll_depth', {
		depth_percent: depth,
		page
	});
}

export function trackExternalLinkClick(url: string, linkText: string, page: string) {
	if (!browser) return;
	posthog.capture('external_link_clicked', {
		url,
		link_text: linkText,
		page
	});
}

export function trackEmailSignup(source: string) {
	if (!browser) return;
	posthog.capture('email_signup', { source });
}

export function trackFilterUsed(filterType: string, filterValue: string) {
	if (!browser) return;
	posthog.capture('filter_used', {
		filter_type: filterType, // 'brand', 'ecosystem', 'price_range', 'cordless'
		filter_value: filterValue
	});
}

// ============================================================================
// ERROR TRACKING
// ============================================================================

export function trackError(error: string, context: string) {
	if (!browser) return;
	posthog.capture('frontend_error', {
		error_message: error,
		context
	});
}

// ============================================================================
// HELPERS
// ============================================================================

function getPriceBucket(price: number): string {
	if (price < 50) return 'under-50';
	if (price < 100) return '50-100';
	if (price < 200) return '100-200';
	if (price < 500) return '200-500';
	if (price < 1000) return '500-1000';
	return '1000-plus';
}
