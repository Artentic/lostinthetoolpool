import { apiFetch } from '$lib/api/server';

export async function load({ params }) {
	try {
		const data = await apiFetch<any>(`/api/v1/ecosystems/${params.slug}`);
		return { ecosystem: data.ecosystem || params.slug, tools: data.tools || [] };
	} catch {
		return { ecosystem: params.slug, tools: [] };
	}
}
