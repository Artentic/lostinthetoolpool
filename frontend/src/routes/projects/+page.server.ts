import { apiFetch } from '$lib/api/server';

export async function load() {
	try {
		const projects = await apiFetch<any[]>('/api/v1/projects');
		return { projects };
	} catch {
		return { projects: [] };
	}
}
