<script lang="ts">
	import SearchBar from '$components/SearchBar.svelte';

	let compareList: string[] = [];
	let searchQuery = '';

	function addToCompare(sku: string) {
		if (compareList.length < 5 && !compareList.includes(sku)) {
			compareList = [...compareList, sku];
		}
	}

	function removeFromCompare(sku: string) {
		compareList = compareList.filter(s => s !== sku);
	}

	// Example tools to compare
	const suggestions = [
		{ sku: 'MIL-2853-20', name: 'Milwaukee M18 FUEL Impact Driver', brand: 'Milwaukee', price: 149, ecosystem: 'M18' },
		{ sku: 'DW-DCF887B', name: 'DeWalt 20V XR Impact Driver', brand: 'DeWalt', price: 119, ecosystem: '20V MAX' },
		{ sku: 'RY-PSBID01B', name: 'Ryobi ONE+ HP Impact Driver', brand: 'Ryobi', price: 59, ecosystem: 'ONE+' },
		{ sku: 'MIL-2732-20', name: 'Milwaukee M18 FUEL Circular Saw', brand: 'Milwaukee', price: 199, ecosystem: 'M18' },
		{ sku: 'DW-DCS570B', name: 'DeWalt 20V Circular Saw', brand: 'DeWalt', price: 149, ecosystem: '20V MAX' },
		{ sku: 'RY-PBLCS300B', name: 'Ryobi ONE+ HP Circular Saw', brand: 'Ryobi', price: 119, ecosystem: 'ONE+' },
	];
</script>

<svelte:head>
	<title>Compare Tools Side by Side — Lost in the Tool Pool</title>
	<meta name="description" content="Compare power tools side by side. Specs, prices, and ratings across Milwaukee, DeWalt, Makita, Ryobi, and more." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="text-center mb-10">
		<h1 class="text-3xl sm:text-4xl mb-4">
			<span class="text-white">Compare</span>
			<span class="text-safety-orange"> Tools</span>
		</h1>
		<p class="text-gray-400 font-body normal-case max-w-xl mx-auto">
			Pick 2-5 tools and see them side by side. Specs, prices, ratings, and honest analysis.
		</p>
	</div>

	<!-- Selected tools -->
	{#if compareList.length > 0}
		<div class="card mb-6">
			<div class="flex items-center justify-between mb-3">
				<h2 class="text-sm text-gray-400 font-heading uppercase tracking-wider">Comparing ({compareList.length}/5)</h2>
				<button on:click={() => compareList = []} class="text-xs text-gray-500 hover:text-red-400 transition">Clear all</button>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each compareList as sku}
					{@const tool = suggestions.find(s => s.sku === sku)}
					<span class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-dark border border-gray-600 text-sm">
						<span class="text-gray-300 font-body normal-case">{tool?.name || sku}</span>
						<button on:click={() => removeFromCompare(sku)} class="text-gray-500 hover:text-red-400">x</button>
					</span>
				{/each}
			</div>
			{#if compareList.length >= 2}
				<button class="btn-primary mt-4 text-sm">Compare Now</button>
			{:else}
				<p class="text-xs text-gray-500 mt-2 font-body normal-case">Add at least 2 tools to compare</p>
			{/if}
		</div>
	{/if}

	<!-- Tool suggestions -->
	<h2 class="text-sm text-gray-500 font-heading uppercase tracking-wider mb-4">Popular comparisons</h2>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each suggestions as tool}
			<button
				on:click={() => addToCompare(tool.sku)}
				class="card text-left group cursor-pointer {compareList.includes(tool.sku) ? 'border-safety-orange/50' : ''}"
				disabled={compareList.includes(tool.sku)}
			>
				<div class="flex items-start justify-between">
					<div>
						<span class="text-xs text-gray-500 font-heading uppercase">{tool.brand} {tool.ecosystem}</span>
						<h3 class="font-body text-sm text-gray-200 normal-case mt-1">{tool.name}</h3>
						<span class="text-lg font-heading font-bold text-safety-orange mt-2 block">${tool.price}</span>
					</div>
					{#if compareList.includes(tool.sku)}
						<span class="text-safety-orange text-lg">✓</span>
					{:else}
						<span class="text-gray-600 group-hover:text-safety-orange transition text-lg">+</span>
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>
