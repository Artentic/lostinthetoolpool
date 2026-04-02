// Server-side API client for SvelteKit load functions.
// Uses the local API at build/dev time, production API in prod.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`, {
		...init,
		headers: { 'Content-Type': 'application/json', ...init?.headers }
	});

	if (!res.ok) {
		throw new Error(`API ${res.status}: ${path}`);
	}

	return res.json();
}
