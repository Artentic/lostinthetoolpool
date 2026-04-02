<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '$components/SearchBar.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

	let query = $page.url.searchParams.get('q') || '';
	let results: any[] = [];
	let total = 0;
	let queryMs = 0;
	let loading = false;
	let searched = false;

	async function handleSearch(e: CustomEvent<string>) {
		query = e.detail;
		loading = true;
		searched = true;
		if (browser) goto(`/search?q=${encodeURIComponent(query)}`, { replaceState: true });

		try {
			const res = await fetch(`${API_BASE}/api/v1/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query, limit: 30 })
			});
			const data = await res.json();
			results = data.products || [];
			total = data.total || 0;
			queryMs = data.query_ms || 0;
		} catch {
			results = [];
		} finally {
			loading = false;
		}
	}

	import { onMount } from 'svelte';
	onMount(() => {
		if (query) handleSearch(new CustomEvent('search', { detail: query }));
	});
</script>

<svelte:head>
	<title>{query ? `"${query}" — ${total} results` : 'Search Tools'} — Lost in the Tool Pool</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="flex justify-center mb-8">
		<SearchBar bind:value={query} on:search={handleSearch} placeholder="Search 1,000+ tools by name, brand, or category..." />
	</div>

	{#if searched && !loading}
		<p class="text-xs text-gray-500 mb-4 text-center">{total} results in {queryMs}ms</p>
	{/if}

	{#if loading}
		<div class="text-center py-12">
			<div class="w-8 h-8 border-2 border-safety-orange border-t-transparent rounded-full animate-spin mx-auto" />
		</div>
	{:else if results.length > 0}
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
			{#each results as product}
				<a href="/tools/{product.slug}" class="card group hover:-translate-y-0.5 transition-all">
					<span class="text-[10px] text-gray-600 font-heading uppercase">{product.brand} / {product.ecosystem}</span>
					<h3 class="font-body text-sm text-gray-200 group-hover:text-safety-orange transition normal-case leading-tight mt-1">
						{product.name}
					</h3>
					<div class="flex items-end justify-between mt-3">
						<span class="text-xl font-heading font-bold text-safety-orange">
							{#if product.price_current > 0}${product.price_current}{:else}TBD{/if}
						</span>
						{#if product.rating > 0}
							<span class="text-xs text-gray-500 flex items-center gap-1">
								<svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								{product.rating}
							</span>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else if searched}
		<div class="text-center py-12">
			<p class="text-gray-400 font-body normal-case">No results for "{query}"</p>
			<p class="text-gray-500 text-sm mt-2">Try: "impact driver", "circular saw", "milwaukee", "chainsaw"</p>
		</div>
	{/if}
</div>
