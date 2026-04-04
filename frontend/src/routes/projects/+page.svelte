<script lang="ts">
	export let data;
	$: projects = data.projects || [];
</script>

<svelte:head>
	<title>DIY Projects — What Tools Do You Need? — Lost in the Tool Pool</title>
	<meta name="description" content="Browse {projects.length} common home improvement projects and see exactly what tools you need for each one." />
</svelte:head>

<div class="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16">
	<div class="mb-14">
		<span class="text-ember font-mono text-xs tracking-widest uppercase mb-3 block">Browse Projects</span>
		<h1 class="text-3xl sm:text-4xl">Pick a project, get your toolkit</h1>
		<p class="text-steel mt-3 max-w-xl text-sm leading-relaxed">
			{projects.length} common home improvement projects. Each one shows exactly what tools you need,
			how long it'll take, and what it'll cost.
		</p>
	</div>

	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
		{#each projects as project}
			<a href="/projects/{project.slug}" class="card group">
				<div class="flex items-start justify-between">
					<div>
						<h3 class="font-display text-sm text-white group-hover:text-ember transition-colors duration-300">
							{project.name}
						</h3>
						<p class="text-steel-dark text-xs mt-1 line-clamp-2">{project.description}</p>
					</div>
				</div>
				<div class="flex items-center justify-between mt-4">
					<div class="flex items-center gap-1.5">
						{#each Array(5) as _, i}
							<span class="w-1.5 h-1.5 rounded-full {i < project.difficulty ? 'bg-ember/70' : 'bg-void-400'}" />
						{/each}
					</div>
					<span class="text-xs text-steel-dark font-mono">{project.time_estimate}</span>
				</div>
				{#if project.permit_required}
					<span class="text-[10px] text-amber-500/60 font-mono mt-2 block">Permit likely required</span>
				{/if}
			</a>
		{/each}
	</div>
</div>
