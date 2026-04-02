const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		}
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: res.statusText }));
		throw new Error(error.error || `API error: ${res.status}`);
	}

	return res.json();
}

import type {
	Product,
	Project,
	Ecosystem,
	Category,
	SearchResult,
	ProjectToolkit,
	ComparisonResult
} from '$types';

export const api = {
	// Projects
	listProjects: () => fetchJSON<Project[]>('/api/v1/projects'),

	getProject: (slug: string) => fetchJSON<Project>(`/api/v1/projects/${slug}`),

	getToolkit: (slug: string, ecosystem?: string) =>
		fetchJSON<ProjectToolkit>(
			`/api/v1/projects/${slug}/toolkit${ecosystem ? `?ecosystem=${ecosystem}` : ''}`
		),

	// Tools
	getTool: (slug: string) => fetchJSON<Product>(`/api/v1/tools/${slug}`),

	getPriceHistory: (slug: string) => fetchJSON<any[]>(`/api/v1/tools/${slug}/prices`),

	compareTools: (skus: string[]) =>
		fetchJSON<ComparisonResult>(`/api/v1/tools/compare?ids=${skus.join(',')}`),

	// Ecosystems
	listEcosystems: () => fetchJSON<Ecosystem[]>('/api/v1/ecosystems'),

	getEcosystem: (slug: string) =>
		fetchJSON<{ ecosystem: Ecosystem; tools: Product[] }>(`/api/v1/ecosystems/${slug}`),

	getStarterKit: (slug: string) =>
		fetchJSON<{ ecosystem: Ecosystem; starter_kit: Product[]; total_cost: number }>(
			`/api/v1/ecosystems/${slug}/starter-kit`
		),

	// Search
	search: (query: string, filters?: Record<string, unknown>) =>
		fetchJSON<SearchResult>('/api/v1/search', {
			method: 'POST',
			body: JSON.stringify({ query, filters })
		}),

	// Categories
	listCategories: () => fetchJSON<Category[]>('/api/v1/categories'),

	// Advisor
	advise: (query: string, options?: { owned_tools?: string[]; budget?: number; ecosystem?: string }) =>
		fetchJSON<any>('/api/v1/advisor', {
			method: 'POST',
			body: JSON.stringify({ query, ...options })
		}),

	// Affiliate
	getAffiliateUrl: (sku: string, retailer: string) =>
		`${API_BASE}/api/v1/affiliate/redirect/${sku}?retailer=${retailer}`
};
