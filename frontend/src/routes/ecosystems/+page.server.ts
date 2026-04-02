import { apiFetch } from '$lib/api/server';

export async function load() {
	try {
		const ecosystems = await apiFetch<any[]>('/api/v1/ecosystems');
		return { ecosystems };
	} catch {
		return { ecosystems: [] };
	}
}
