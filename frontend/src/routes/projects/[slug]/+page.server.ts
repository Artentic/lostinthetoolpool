import { apiFetch } from '$lib/api/server';
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
	try {
		const project = await apiFetch<any>(`/api/v1/projects/${params.slug}`);
		const ecosystem = url.searchParams.get('ecosystem') || 'ryobi-one-plus';
		const toolkit = await apiFetch<any>(`/api/v1/projects/${params.slug}/toolkit?ecosystem=${ecosystem}`);
		return { project, toolkit, ecosystem };
	} catch {
		throw error(404, 'Project not found');
	}
}
