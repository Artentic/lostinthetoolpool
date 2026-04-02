<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let placeholder = 'Describe your project or search for a tool...';
	export let size: 'normal' | 'large' = 'normal';

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		if (value.trim()) {
			dispatch('search', value.trim());
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<div class="relative {size === 'large' ? 'max-w-3xl' : 'max-w-xl'} w-full">
	<input
		type="text"
		bind:value
		on:keydown={handleKeydown}
		{placeholder}
		class="input-search {size === 'large' ? 'text-xl py-5 pr-16' : 'text-base py-3 pr-14'}"
	/>
	<button
		on:click={handleSubmit}
		class="absolute right-3 top-1/2 -translate-y-1/2 bg-safety-orange hover:bg-safety-orange-light
		       text-white rounded-lg {size === 'large' ? 'p-3' : 'p-2'} transition-colors"
		aria-label="Search"
	>
		<svg class="{size === 'large' ? 'w-6 h-6' : 'w-5 h-5'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	</button>
</div>
