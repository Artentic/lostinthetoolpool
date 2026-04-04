<script lang="ts">
	import { browser } from '$app/environment';

	const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

	let searchQuery = '';
	let searchResults: any[] = [];
	let compareList: any[] = [];
	let searching = false;
	let debounceTimer: any;

	async function search(query: string) {
		if (!query || query.length < 2) { searchResults = []; return; }
		searching = true;
		try {
			const res = await fetch(`${API_BASE}/api/v1/search`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query, limit: 8 })
			});
			const data = await res.json();
			searchResults = (data.products || []).filter(
				(p: any) => !compareList.find((c: any) => c.sku === p.sku)
			);
		} catch { searchResults = []; }
		searching = false;
	}

	function onInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => search(searchQuery), 200);
	}

	function addProduct(product: any) {
		if (compareList.length < 5) {
			compareList = [...compareList, product];
			searchResults = searchResults.filter((p: any) => p.sku !== product.sku);
			searchQuery = '';
			searchResults = [];
		}
	}

	function removeProduct(sku: string) {
		compareList = compareList.filter((p: any) => p.sku !== sku);
	}

	// Collect all spec keys across compared products
	$: allSpecKeys = (() => {
		const keys = new Set<string>();
		for (const p of compareList) {
			if (p.specs) Object.keys(p.specs).forEach(k => keys.add(k));
		}
		return Array.from(keys).sort();
	})();
</script>

<svelte:head>
	<title>Compare Tools Side by Side — Lost in the Tool Pool</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
	<div class="mb-10">
		<span class="text-ember font-mono text-xs tracking-widest uppercase mb-3 block">Compare</span>
		<h1 class="text-3xl sm:text-4xl">Compare tools side by side</h1>
		<p class="text-steel mt-3 text-sm">Search and add 2-5 tools to compare specs, prices, and ratings.</p>
	</div>

	<!-- Search to add -->
	<div class="relative mb-8 max-w-xl">
		<input
			type="text"
			bind:value={searchQuery}
			on:input={onInput}
			placeholder="Search for a tool to add..."
			class="input-search text-base py-3"
		/>
		{#if searchResults.length > 0}
			<div class="absolute top-full left-0 right-0 mt-1 bg-void-100 border border-void-400/50 rounded-xl overflow-hidden z-20 shadow-depth">
				{#each searchResults as product}
					<button
						on:click={() => addProduct(product)}
						class="w-full text-left px-4 py-3 hover:bg-void-200 transition-colors flex items-center justify-between"
					>
						<div class="min-w-0">
							<span class="text-white text-sm block truncate">{product.name}</span>
							<span class="text-steel-dark text-xs">{product.brand} / {product.ecosystem}</span>
						</div>
						<span class="text-ember font-display font-semibold text-sm ml-4">${product.price_current}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Selected products -->
	{#if compareList.length > 0}
		<div class="flex flex-wrap gap-2 mb-6">
			{#each compareList as product}
				<span class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-void-100 border border-void-400/50 text-sm">
					<span class="text-white truncate max-w-[200px]">{product.name}</span>
					<button on:click={() => removeProduct(product.sku)} class="text-steel-dark hover:text-red-400 transition-colors">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</span>
			{/each}
			<button on:click={() => compareList = []} class="text-xs text-steel-dark hover:text-red-400 transition-colors px-2">
				Clear all
			</button>
		</div>

		<!-- Comparison Table -->
		{#if compareList.length >= 2}
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr>
							<th class="text-left py-3 px-4 text-steel-dark font-mono text-xs uppercase">Spec</th>
							{#each compareList as product}
								<th class="text-left py-3 px-4 min-w-[180px]">
									<a href="/tools/{product.slug}" class="text-white hover:text-ember transition-colors text-sm font-display">
										{product.name}
									</a>
									<span class="block text-steel-dark text-xs mt-0.5">{product.brand}</span>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						<!-- Price -->
						<tr class="border-t border-void-400/20">
							<td class="py-3 px-4 text-steel-dark font-mono text-xs">Price</td>
							{#each compareList as product}
								<td class="py-3 px-4 text-ember font-display font-semibold">${product.price_current}</td>
							{/each}
						</tr>
						<!-- Rating -->
						<tr class="border-t border-void-400/20">
							<td class="py-3 px-4 text-steel-dark font-mono text-xs">Rating</td>
							{#each compareList as product}
								<td class="py-3 px-4 text-white">
									{#if product.rating > 0}
										<span class="flex items-center gap-1">
											<svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
											{product.rating}
										</span>
									{:else}—{/if}
								</td>
							{/each}
						</tr>
						<!-- Ecosystem -->
						<tr class="border-t border-void-400/20">
							<td class="py-3 px-4 text-steel-dark font-mono text-xs">Ecosystem</td>
							{#each compareList as product}
								<td class="py-3 px-4 text-white text-xs">{product.ecosystem}</td>
							{/each}
						</tr>
						<!-- Weight -->
						<tr class="border-t border-void-400/20">
							<td class="py-3 px-4 text-steel-dark font-mono text-xs">Weight</td>
							{#each compareList as product}
								<td class="py-3 px-4 text-white">{product.weight_lbs > 0 ? product.weight_lbs + ' lbs' : '—'}</td>
							{/each}
						</tr>
						<!-- Dynamic specs -->
						{#each allSpecKeys as key}
							<tr class="border-t border-void-400/20">
								<td class="py-3 px-4 text-steel-dark font-mono text-xs">{key.replace(/_/g, ' ')}</td>
								{#each compareList as product}
									<td class="py-3 px-4 text-white">{product.specs?.[key] ?? '—'}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="text-steel-dark text-sm">Add at least 2 tools to compare.</p>
		{/if}
	{:else}
		<p class="text-steel-dark text-sm">Search above to add tools to your comparison.</p>
	{/if}
</div>
