<script>
	export let compact = false;
</script>

{#if compact}
	<p class="text-[11px] text-gray-500 font-body normal-case mt-2">
		Links may earn us a commission — <a href="/legal/affiliate-disclosure" class="underline hover:text-gray-400">details</a>. Does not affect our picks.
	</p>
{:else}
	<div class="bg-charcoal-dark/50 border border-gray-700/30 rounded-lg px-4 py-3 mb-6">
		<p class="text-xs text-gray-400 font-body normal-case">
			<strong class="text-gray-300">Transparency:</strong> We earn affiliate commissions when you buy through our links, at no extra cost to you.
			This does not influence our recommendations.
			<a href="/legal/affiliate-disclosure" class="text-safety-orange hover:underline">Learn more</a>
		</p>
	</div>
{/if}
