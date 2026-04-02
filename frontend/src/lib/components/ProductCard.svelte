<script lang="ts">
	import { ECOSYSTEM_COLORS } from '$types';
	import type { Product } from '$types';

	export let product: Product;
	export let showEcosystem = true;

	$: ecosystemClass = ECOSYSTEM_COLORS[product.ecosystem] || 'bg-gray-600 text-white';
	$: discount = product.price_msrp > product.price_current
		? Math.round((1 - product.price_current / product.price_msrp) * 100)
		: 0;
</script>

<a href="/tools/{product.slug}" class="card group block">
	<div class="flex flex-col h-full">
		{#if product.image_url}
			<div class="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden">
				<img src={product.image_url} alt={product.name} class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
			</div>
		{:else}
			<div class="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
				<svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
				</svg>
			</div>
		{/if}

		<div class="flex-1 flex flex-col">
			{#if showEcosystem}
				<span class="ecosystem-badge {ecosystemClass} self-start mb-2">
					{product.brand} {product.ecosystem.split('-').slice(-1)}
				</span>
			{/if}

			<h3 class="font-body font-semibold text-sm leading-tight group-hover:text-safety-orange transition normal-case">
				{product.name}
			</h3>

			<div class="mt-auto pt-3 flex items-end justify-between">
				<div>
					<span class="text-2xl font-heading font-bold text-safety-orange">${product.price_current}</span>
					{#if discount > 0}
						<span class="ml-2 text-sm text-gray-500 line-through">${product.price_msrp}</span>
						<span class="ml-1 text-xs text-green-400 font-bold">-{discount}%</span>
					{/if}
				</div>

				<div class="flex items-center gap-1 text-sm text-gray-400">
					<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					{product.rating}
					<span class="text-gray-600">({product.review_count.toLocaleString()})</span>
				</div>
			</div>
		</div>
	</div>
</a>
