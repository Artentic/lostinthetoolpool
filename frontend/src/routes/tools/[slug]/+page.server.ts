import { apiFetch } from '$lib/api/server';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const product = await apiFetch<any>(`/api/v1/tools/${params.slug}`);
		return { product };
	} catch {
		throw error(404, 'Tool not found');
	}
}
