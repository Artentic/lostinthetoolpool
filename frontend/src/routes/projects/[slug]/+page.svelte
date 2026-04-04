<script lang="ts">
	import AffiliateNotice from '$components/AffiliateNotice.svelte';

	export let data;
	$: project = data.project;
	$: toolkit = data.toolkit?.toolkit || [];
	$: totalCost = data.toolkit?.total_cost || 0;
	$: ecosystem = data.ecosystem;

	$: essentialTools = project.essential_tools || [];
	$: recommendedTools = project.recommended_tools || [];
	$: rentInstead = project.rent_instead || [];
	$: safetyGear = project.safety_gear || [];
	$: mistakes = project.common_mistakes || [];
	$: related = project.related || [];

	const ecosystemOptions = [
		{ slug: 'ryobi-one-plus', name: 'Ryobi ONE+', label: 'Budget' },
		{ slug: 'dewalt-20v-max', name: 'DeWalt 20V', label: 'Mid' },
		{ slug: 'milwaukee-m18', name: 'Milwaukee M18', label: 'Pro' },
		{ slug: 'makita-18v-lxt', name: 'Makita 18V', label: 'Pro' },
	];
</script>

<svelte:head>
	<title>What Tools Do You Need to {project.name}? — Lost in the Tool Pool</title>
	<meta name="description" content="Complete tool list for {project.name}. Essential tools, nice-to-haves, rental options, and cost breakdown." />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-16">
	<div class="mb-6">
		<a href="/projects" class="text-steel-dark text-sm hover:text-ember transition-colors">
			← All Projects
		</a>
	</div>

	<!-- Header -->
	<div class="mb-10">
		<h1 class="text-3xl sm:text-4xl mb-3">{project.name}</h1>
		<p class="text-steel text-sm leading-relaxed max-w-2xl">{project.description}</p>
		<div class="flex items-center gap-6 mt-4">
			<div class="flex items-center gap-1.5">
				{#each Array(5) as _, i}
					<span class="w-2 h-2 rounded-full {i < project.difficulty ? 'bg-ember' : 'bg-void-400'}" />
				{/each}
			</div>
			<span class="text-steel-dark text-sm font-mono">{project.time_estimate}</span>
			{#if project.permit_required}
				<span class="text-amber-500/80 text-xs font-mono">Permit likely required</span>
			{/if}
		</div>
	</div>

	<!-- Ecosystem Selector -->
	<div class="card mb-6">
		<h2 class="font-display text-sm text-white mb-3">Choose Your Ecosystem</h2>
		<div class="flex flex-wrap gap-2">
			{#each ecosystemOptions as eco}
				<a href="/projects/{project.slug}?ecosystem={eco.slug}"
				   class="px-4 py-2 rounded-xl text-sm font-body transition-all duration-200
				          {ecosystem === eco.slug
				            ? 'bg-ember/10 border border-ember/30 text-ember'
				            : 'border border-void-400/40 text-steel-dark hover:text-white hover:border-void-400'}">
					{eco.name}
					<span class="text-[10px] ml-1 opacity-60">{eco.label}</span>
				</a>
			{/each}
		</div>
		{#if totalCost > 0}
			<p class="mt-3 text-sm text-steel">
				Estimated tool cost: <span class="text-ember font-display font-semibold">${Math.round(totalCost)}</span>
				<span class="text-steel-dark text-xs ml-1">({ecosystem.replace(/-/g, ' ')})</span>
			</p>
		{/if}
	</div>

	<AffiliateNotice />

	<!-- Matched Toolkit Products -->
	{#if toolkit.length > 0}
		<div class="card mb-4">
			<h2 class="font-display text-sm text-ember mb-4">Recommended Tools</h2>
			<div class="space-y-3">
				{#each toolkit as item}
					{@const prod = item.product}
					{#if prod}
						<a href="/tools/{prod.slug}" class="flex items-center justify-between py-2 group">
							<div class="flex-1 min-w-0">
								<span class="text-white text-sm group-hover:text-ember transition-colors block truncate">
									{prod.name}
								</span>
								<span class="text-steel-dark text-xs">{item.tool_type?.replace(/-/g, ' ')}</span>
							</div>
							<span class="text-ember font-display font-semibold text-sm ml-4">
								${prod.price_current}
							</span>
						</a>
					{/if}
				{/each}
			</div>
		</div>
	{/if}

	<!-- Also Recommended -->
	{#if recommendedTools.length > 0}
		<div class="card mb-4">
			<h2 class="font-display text-sm text-frost mb-3">Nice to Have</h2>
			<ul class="space-y-2">
				{#each recommendedTools as tool}
					<li class="flex items-center gap-3 text-steel text-sm">
						<span class="w-1.5 h-1.5 rounded-full bg-frost/50 flex-shrink-0" />
						{tool.replace(/-/g, ' ')}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Rent Instead -->
	{#if rentInstead.length > 0}
		<div class="card mb-4">
			<h2 class="font-display text-sm text-amber-400 mb-3">Consider Renting</h2>
			<ul class="space-y-2">
				{#each rentInstead as item}
					<li class="flex items-start gap-3 text-steel text-sm">
						<span class="w-1.5 h-1.5 rounded-full bg-amber-400/50 flex-shrink-0 mt-1.5" />
						{item}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Safety Gear -->
	{#if safetyGear.length > 0}
		<div class="card mb-4">
			<h2 class="font-display text-sm text-red-400 mb-3">Safety Equipment</h2>
			<div class="flex flex-wrap gap-2">
				{#each safetyGear as item}
					<span class="px-3 py-1 rounded-full bg-red-900/20 border border-red-500/20 text-red-300/80 text-xs">
						{item}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Common Mistakes -->
	{#if mistakes.length > 0}
		<div class="card mb-4">
			<h2 class="font-display text-sm text-amber-400 mb-3">Common Mistakes</h2>
			<ul class="space-y-3">
				{#each mistakes as mistake}
					<li class="flex items-start gap-3 text-steel text-sm leading-relaxed">
						<span class="text-amber-400/60 flex-shrink-0 text-xs mt-0.5">!</span>
						{mistake}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Related Projects -->
	{#if related.length > 0}
		<div class="mt-8">
			<h2 class="font-display text-sm text-white mb-3">Related Projects</h2>
			<div class="flex flex-wrap gap-2">
				{#each related as slug}
					<a href="/projects/{slug}" class="px-4 py-2 rounded-xl border border-void-400/40 text-steel-dark text-sm
					          hover:text-ember hover:border-ember/30 transition-all">
						{slug.replace(/-/g, ' ')}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
