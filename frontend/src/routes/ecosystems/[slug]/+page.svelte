<script lang="ts">
	import { page } from '$app/stores';

	$: slug = $page.params.slug;

	// In production: load from API
	const ecoData: Record<string, any> = {
		'milwaukee-m18': {
			name: 'Milwaukee M18', brand: 'Milwaukee', voltage: 18, tools: '250+',
			target: 'Professional trades and serious DIYers',
			parent: 'TTI Group', exclusive: 'Home Depot',
			warranty: '5-year tool warranty',
			color: 'bg-milwaukee',
			strengths: ['Industry-leading impact drivers and drills', 'ONE-KEY smart tool connectivity', 'Largest pro-grade selection', 'Excellent battery life with high-output packs'],
			weaknesses: ['Premium pricing', 'Home Depot exclusive limits availability', 'Overkill for casual DIY'],
			starter_kit: ['Drill/Driver', 'Impact Driver', 'Circular Saw', 'Reciprocating Saw', 'Multi-Tool'],
			starter_cost: 685
		}
	};

	$: eco = ecoData[slug] || {
		name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
		brand: slug.split('-')[0], voltage: 18, tools: 'TBD', target: 'TBD',
		parent: '', exclusive: '', warranty: '', color: 'bg-gray-600',
		strengths: [], weaknesses: [], starter_kit: [], starter_cost: 0
	};
</script>

<svelte:head>
	<title>{eco.name} Ecosystem Guide — Lost in the Tool Pool</title>
	<meta name="description" content="Complete guide to the {eco.name} battery ecosystem. {eco.tools} tools, compatibility info, starter kit recommendations, and honest pros/cons." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="mb-6">
		<a href="/ecosystems" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">
			← All Ecosystems
		</a>
	</div>

	<div class="flex items-center gap-4 mb-8">
		<span class="ecosystem-badge {eco.color} text-lg px-6 py-3">{eco.brand}</span>
		<div>
			<h1 class="text-3xl sm:text-4xl text-white">{eco.name}</h1>
			<p class="text-gray-400 font-body normal-case mt-1">{eco.target}</p>
		</div>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
		<div class="card text-center">
			<span class="text-2xl font-heading font-bold text-safety-orange">{eco.voltage}V</span>
			<p class="text-xs text-gray-500 font-heading uppercase mt-1">Voltage</p>
		</div>
		<div class="card text-center">
			<span class="text-2xl font-heading font-bold text-electric-blue">{eco.tools}</span>
			<p class="text-xs text-gray-500 font-heading uppercase mt-1">Tools</p>
		</div>
		<div class="card text-center">
			<span class="text-sm font-heading font-bold text-gray-300">{eco.exclusive || 'Everywhere'}</span>
			<p class="text-xs text-gray-500 font-heading uppercase mt-1">Sold At</p>
		</div>
		<div class="card text-center">
			<span class="text-sm font-heading font-bold text-gray-300">{eco.warranty || 'Varies'}</span>
			<p class="text-xs text-gray-500 font-heading uppercase mt-1">Warranty</p>
		</div>
	</div>

	<!-- Strengths -->
	{#if eco.strengths.length}
		<div class="card mb-4">
			<h2 class="text-lg text-green-400 mb-3">Strengths</h2>
			<ul class="space-y-2">
				{#each eco.strengths as s}
					<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="text-green-400 flex-shrink-0">+</span> {s}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Weaknesses -->
	{#if eco.weaknesses.length}
		<div class="card mb-4">
			<h2 class="text-lg text-red-400 mb-3">Weaknesses</h2>
			<ul class="space-y-2">
				{#each eco.weaknesses as w}
					<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="text-red-400 flex-shrink-0">-</span> {w}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Starter Kit -->
	{#if eco.starter_kit.length}
		<div class="card">
			<h2 class="text-lg text-safety-orange mb-3">Recommended Starter Kit</h2>
			<ul class="space-y-2 mb-4">
				{#each eco.starter_kit as tool}
					<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="w-2 h-2 rounded-full bg-safety-orange flex-shrink-0" />
						{tool}
					</li>
				{/each}
			</ul>
			{#if eco.starter_cost}
				<p class="text-sm text-gray-400 font-body normal-case">
					Estimated cost (tools only): <span class="text-safety-orange font-bold">${eco.starter_cost}</span>
				</p>
			{/if}
		</div>
	{/if}
</div>
