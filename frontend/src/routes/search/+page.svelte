<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '$components/SearchBar.svelte';
	import { goto } from '$app/navigation';

	let query = $page.url.searchParams.get('q') || '';
	let results: any[] = [];
	let loading = false;
	let searched = false;

	async function handleSearch(e: CustomEvent<string>) {
		query = e.detail;
		loading = true;
		searched = true;
		goto(`/search?q=${encodeURIComponent(query)}`, { replaceState: true });

		try {
			// TODO: Call search API
			results = [];
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{query ? `"${query}" — Search Results` : 'Search Tools'} — Lost in the Tool Pool</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="flex justify-center mb-8">
		<SearchBar bind:value={query} on:search={handleSearch} placeholder="Search tools, brands, or categories..." />
	</div>

	{#if loading}
		<div class="text-center py-12">
			<div class="w-8 h-8 border-2 border-safety-orange border-t-transparent rounded-full animate-spin mx-auto" />
			<p class="text-gray-400 mt-4 font-body normal-case">Searching...</p>
		</div>
	{:else if searched && results.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-400 font-body normal-case">No results found for "{query}".</p>
			<p class="text-gray-500 text-sm mt-2 font-body normal-case">Try the <a href="/advisor?q={encodeURIComponent(query)}" class="text-safety-orange hover:underline">AI Advisor</a> for natural language queries.</p>
		</div>
	{:else if !searched}
		<div class="text-center py-12">
			<p class="text-gray-500 font-body normal-case">Enter a search term to find tools.</p>
		</div>
	{/if}
</div>
