<script lang="ts">
	import { page } from '$app/stores';
	import { ECOSYSTEM_COLORS } from '$types';

	$: slug = $page.params.slug;

	// In production: load from API via +page.server.ts
	// Placeholder structure showing the UI design
	let product = {
		sku: 'MIL-2853-20',
		name: 'Milwaukee M18 FUEL 1/4" Hex Impact Driver',
		brand: 'Milwaukee',
		ecosystem: 'milwaukee-m18',
		slug,
		price_current: 149,
		price_msrp: 149,
		rating: 4.9,
		review_count: 6200,
		description: 'The king of impact drivers. 2000 in-lbs of torque with 4-mode DRIVE CONTROL for precision and power.',
		features: ['POWERSTATE brushless motor', '4-mode DRIVE CONTROL', 'REDLINK intelligence', 'Auto-stop mode for precision'],
		specs: { voltage: 18, max_rpm: 3600, max_torque: '2000 in-lbs', drive: '1/4 hex', brushless: true },
		is_cordless: true,
		weight_lbs: 2.9,
		affiliate_links: { homedepot: '#', amazon: '#' }
	};

	$: ecosystemClass = ECOSYSTEM_COLORS[product.ecosystem] || 'bg-gray-600 text-white';
</script>

<svelte:head>
	<title>{product.name} — Lost in the Tool Pool</title>
	<meta name="description" content="{product.description} ${product.price_current}. Compare prices across retailers." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="mb-6">
		<a href="/ecosystems/{product.ecosystem}" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">
			← {product.brand} {product.ecosystem.split('-').pop()?.toUpperCase()}
		</a>
	</div>

	<div class="grid md:grid-cols-2 gap-8">
		<!-- Image -->
		<div class="bg-charcoal-light rounded-xl p-8 flex items-center justify-center aspect-square">
			<svg class="w-32 h-32 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
			</svg>
		</div>

		<!-- Details -->
		<div>
			<span class="ecosystem-badge {ecosystemClass} mb-3">{product.brand} {product.ecosystem.split('-').pop()}</span>
			<h1 class="text-2xl sm:text-3xl text-white mt-2 normal-case font-heading">{product.name}</h1>

			<div class="flex items-center gap-3 mt-3">
				<div class="flex items-center gap-1">
					{#each Array(5) as _, i}
						<svg class="w-4 h-4 {i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					{/each}
					<span class="text-sm text-gray-400 ml-1">{product.rating} ({product.review_count.toLocaleString()} reviews)</span>
				</div>
			</div>

			<div class="mt-6">
				<span class="text-4xl font-heading font-bold text-safety-orange">${product.price_current}</span>
				{#if product.is_cordless}
					<span class="ml-2 text-xs text-gray-500 font-body normal-case">(tool only — battery sold separately)</span>
				{/if}
			</div>

			<p class="mt-4 text-gray-400 font-body normal-case text-sm leading-relaxed">{product.description}</p>

			<!-- Buy buttons -->
			<div class="mt-6 flex flex-wrap gap-3">
				<a href="#" class="affiliate-btn bg-[#ff9900] text-black">
					Buy at Amazon
				</a>
				<a href="#" class="affiliate-btn bg-[#f96302] text-white">
					Buy at Home Depot
				</a>
				<a href="#" class="affiliate-btn bg-[#004990] text-white">
					Buy at Lowe's
				</a>
			</div>

			<p class="mt-2 text-xs text-gray-600 font-body normal-case">
				Prices may vary. We earn a commission on purchases — this doesn't affect our recommendations.
			</p>
		</div>
	</div>

	<!-- Specs -->
	<div class="card mt-8">
		<h2 class="text-lg text-safety-orange mb-4">Specifications</h2>
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
			{#each Object.entries(product.specs) as [key, value]}
				<div>
					<span class="text-xs text-gray-500 font-heading uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
					<p class="text-white font-body normal-case text-sm mt-0.5">{value}</p>
				</div>
			{/each}
			<div>
				<span class="text-xs text-gray-500 font-heading uppercase tracking-wider">Weight</span>
				<p class="text-white font-body normal-case text-sm mt-0.5">{product.weight_lbs} lbs</p>
			</div>
			<div>
				<span class="text-xs text-gray-500 font-heading uppercase tracking-wider">Cordless</span>
				<p class="text-white font-body normal-case text-sm mt-0.5">{product.is_cordless ? 'Yes' : 'No'}</p>
			</div>
		</div>
	</div>

	<!-- Features -->
	<div class="card mt-4">
		<h2 class="text-lg text-electric-blue mb-4">Key Features</h2>
		<ul class="space-y-2">
			{#each product.features as feature}
				<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm">
					<span class="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0" />
					{feature}
				</li>
			{/each}
		</ul>
	</div>
</div>
