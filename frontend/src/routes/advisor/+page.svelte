<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '$components/SearchBar.svelte';
	import { goto } from '$app/navigation';

	let query = $page.url.searchParams.get('q') || '';
	let response = '';
	let loading = false;

	async function handleSearch(e: CustomEvent<string>) {
		query = e.detail;
		loading = true;
		response = '';

		// Update URL
		goto(`/advisor?q=${encodeURIComponent(query)}`, { replaceState: true });

		try {
			// TODO: Call streaming advisor API in Phase 5
			response = `Thanks for your question about: "${query}"\n\nThe AI advisor is being connected. Once live, I'll analyze your project and recommend:\n\n• Essential tools you need\n• Nice-to-have tools that save time\n• Which battery ecosystem fits best\n• Tools you should rent instead of buy\n• Total cost breakdown by ecosystem\n• Safety equipment needed\n\nThis feature is powered by Claude AI and will provide personalized recommendations based on your project description, budget, and skill level.`;
		} finally {
			loading = false;
		}
	}

	// Auto-search if query param present
	import { onMount } from 'svelte';
	onMount(() => {
		if (query) {
			handleSearch(new CustomEvent('search', { detail: query }));
		}
	});
</script>

<svelte:head>
	<title>Project Advisor — Lost in the Tool Pool</title>
	<meta name="description" content="Describe your DIY project and get AI-powered tool recommendations. Personalized toolkit suggestions based on your project, budget, and skill level." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="text-center mb-10">
		<h1 class="text-3xl sm:text-4xl mb-4">
			<span class="text-white">Project</span>
			<span class="text-safety-orange"> Advisor</span>
		</h1>
		<p class="text-gray-400 font-body normal-case">
			Describe your project in plain English. Our AI figures out exactly what tools you need.
		</p>
	</div>

	<div class="flex justify-center mb-8">
		<SearchBar
			size="large"
			bind:value={query}
			placeholder="I want to build a 12x16 deck on a budget..."
			on:search={handleSearch}
		/>
	</div>

	{#if loading}
		<div class="card">
			<div class="flex items-center gap-3">
				<div class="w-5 h-5 border-2 border-safety-orange border-t-transparent rounded-full animate-spin" />
				<span class="text-gray-400 font-body normal-case">Analyzing your project...</span>
			</div>
		</div>
	{:else if response}
		<div class="card">
			<div class="prose prose-invert max-w-none">
				<pre class="whitespace-pre-wrap font-body text-sm text-gray-300 normal-case leading-relaxed">{response}</pre>
			</div>
		</div>
	{/if}

	<!-- Example queries -->
	{#if !response && !loading}
		<div class="mt-8">
			<h2 class="text-sm text-gray-500 font-heading uppercase tracking-wider text-center mb-4">Try asking...</h2>
			<div class="grid sm:grid-cols-2 gap-3">
				{#each [
					'I want to build a 12x16 deck on a budget',
					"What's the minimum toolkit for a bathroom reno?",
					'Milwaukee vs DeWalt for a serious DIYer?',
					'Best starter kit under $500 for a new homeowner',
					'I need to cut a hole in drywall for a new outlet',
					'What do I need to refinish hardwood floors?'
				] as example}
					<button
						on:click={() => { query = example; handleSearch(new CustomEvent('search', { detail: example })); }}
						class="card text-left text-sm text-gray-400 hover:text-safety-orange cursor-pointer font-body normal-case"
					>
						"{example}"
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
