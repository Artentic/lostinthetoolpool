<script lang="ts">
	import AffiliateNotice from '$components/AffiliateNotice.svelte';

	export let data;
	$: product = data.product;
	$: specs = product.specs || {};
	$: features = product.features || [];
	$: retailers = product.retailers || [];
	$: ecoSlug = product.ecosystem || '';
</script>

<svelte:head>
	<title>{product.name} — ${product.price_current} — Lost in the Tool Pool</title>
	<meta name="description" content="{product.description}" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="mb-6">
		{#if ecoSlug}
			<a href="/ecosystems/{ecoSlug}" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">
				← {ecoSlug.replace(/-/g, ' ')}
			</a>
		{/if}
	</div>

	<div class="grid md:grid-cols-2 gap-8">
		<!-- Image -->
		<div class="bg-charcoal-light rounded-xl p-8 flex items-center justify-center aspect-square">
			{#if product.image_url}
				<img src={product.image_url} alt={product.name} class="max-w-full max-h-full object-contain" />
			{:else}
				<div class="text-center">
					<svg class="w-24 h-24 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
					</svg>
					<p class="text-xs text-gray-600 mt-2">{product.brand}</p>
				</div>
			{/if}
		</div>

		<!-- Details -->
		<div>
			<span class="text-xs text-gray-500 font-heading uppercase tracking-wider">{product.brand} / {product.category?.replace(/-/g, ' ')}</span>
			<h1 class="text-2xl sm:text-3xl text-white mt-2 normal-case font-heading leading-tight">{product.name}</h1>

			{#if product.rating > 0}
				<div class="flex items-center gap-2 mt-3">
					<div class="flex items-center gap-0.5">
						{#each Array(5) as _, i}
							<svg class="w-4 h-4 {i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						{/each}
					</div>
					<span class="text-sm text-gray-400">{product.rating} ({(product.review_count || 0).toLocaleString()} reviews)</span>
				</div>
			{/if}

			<div class="mt-6">
				<span class="text-4xl font-heading font-bold text-safety-orange">${product.price_current}</span>
				{#if product.price_msrp && product.price_msrp > product.price_current}
					<span class="ml-2 text-lg text-gray-500 line-through">${product.price_msrp}</span>
				{/if}
				{#if product.is_cordless}
					<span class="ml-2 text-xs text-gray-500 font-body normal-case">(tool only)</span>
				{/if}
			</div>

			{#if product.description}
				<p class="mt-4 text-gray-400 font-body normal-case text-sm leading-relaxed">{product.description}</p>
			{/if}

			<!-- Buy buttons -->
			{#if retailers.length > 0}
				<div class="mt-6 flex flex-wrap gap-3">
					{#each retailers as retailer}
						<a href="#" class="affiliate-btn {
							retailer === 'amazon' ? 'bg-[#ff9900] text-black' :
							retailer === 'homedepot' ? 'bg-[#f96302] text-white' :
							retailer === 'lowes' ? 'bg-[#004990] text-white' :
							'bg-gray-600 text-white'
						}">
							Buy at {retailer === 'homedepot' ? 'Home Depot' : retailer === 'lowes' ? "Lowe's" : retailer.charAt(0).toUpperCase() + retailer.slice(1)}
						</a>
					{/each}
				</div>
				<AffiliateNotice compact />
			{/if}
		</div>
	</div>

	<!-- Specs -->
	{#if Object.keys(specs).length > 0}
		<div class="card mt-8">
			<h2 class="text-lg text-safety-orange mb-4">Specifications</h2>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
				{#each Object.entries(specs) as [key, value]}
					<div>
						<span class="text-xs text-gray-500 font-heading uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
						<p class="text-white font-body normal-case text-sm mt-0.5">{value}</p>
					</div>
				{/each}
				{#if product.weight_lbs > 0}
					<div>
						<span class="text-xs text-gray-500 font-heading uppercase tracking-wider">Weight</span>
						<p class="text-white font-body normal-case text-sm mt-0.5">{product.weight_lbs} lbs</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Features -->
	{#if features.length > 0}
		<div class="card mt-4">
			<h2 class="text-lg text-electric-blue mb-4">Key Features</h2>
			<ul class="space-y-2">
				{#each features as feature}
					<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0 mt-1.5" />
						{feature}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Ecosystem -->
	{#if ecoSlug}
		<div class="mt-6 text-center">
			<a href="/ecosystems/{ecoSlug}" class="text-electric-blue hover:text-electric-blue-light transition text-sm font-heading uppercase tracking-wider">
				View all {ecoSlug.replace(/-/g, ' ')} tools →
			</a>
		</div>
	{/if}
</div>
