<script lang="ts">
	import { DIFFICULTY_LABELS } from '$types';

	export let level: number;
	export let showLabel = true;

	const colors = ['', 'bg-green-400', 'bg-lime-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400'];
</script>

<div class="flex items-center gap-1.5">
	{#each Array(5) as _, i}
		<span
			class="difficulty-dot {i < level ? colors[level] : 'bg-gray-600'}"
		/>
	{/each}
	{#if showLabel}
		<span class="ml-1 text-xs text-gray-400 font-heading uppercase">{DIFFICULTY_LABELS[level]}</span>
	{/if}
</div>
