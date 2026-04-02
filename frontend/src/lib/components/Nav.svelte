<script>
	let mobileOpen = false;
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
	 style="background: linear-gradient(180deg, rgba(8,8,12,0.95) 0%, rgba(8,8,12,0.8) 100%); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
	<div class="max-w-7xl mx-auto px-6 lg:px-8">
		<div class="flex items-center justify-between h-18 py-4">
			<a href="/" class="flex items-center gap-3 group">
				<!-- Logo mark -->
				<div class="relative w-8 h-8 flex items-center justify-center">
					<div class="absolute inset-0 bg-ember/20 rounded-lg rotate-45 group-hover:rotate-[55deg] transition-transform duration-500" />
					<svg class="w-4 h-4 text-ember relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
						<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
					</svg>
				</div>
				<span class="font-display font-bold text-lg tracking-tight">
					<span class="text-white">Lost in the</span>
					<span class="text-ember ml-1">Tool Pool</span>
				</span>
			</a>

			<div class="hidden md:flex items-center gap-1">
				<a href="/advisor" class="px-4 py-2 text-steel hover:text-white transition-colors duration-200 font-body text-sm">
					Advisor
				</a>
				<a href="/projects" class="px-4 py-2 text-steel hover:text-white transition-colors duration-200 font-body text-sm">
					Projects
				</a>
				<a href="/ecosystems" class="px-4 py-2 text-steel hover:text-white transition-colors duration-200 font-body text-sm">
					Ecosystems
				</a>
				<a href="/compare" class="px-4 py-2 text-steel hover:text-white transition-colors duration-200 font-body text-sm">
					Compare
				</a>
				<a href="/search" class="ml-2 px-4 py-2 text-steel hover:text-white transition-colors duration-200 font-body text-sm flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					Search
				</a>
			</div>

			<button
				class="md:hidden text-steel p-2 hover:text-white transition-colors"
				on:click={() => (mobileOpen = !mobileOpen)}
				aria-label="Toggle menu"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					{#if mobileOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<div class="md:hidden border-t border-void-400/30" style="background: rgba(8,8,12,0.98);">
			<div class="px-6 py-4 space-y-1">
				{#each [
					{ href: '/advisor', label: 'Project Advisor' },
					{ href: '/projects', label: 'Projects' },
					{ href: '/ecosystems', label: 'Ecosystems' },
					{ href: '/compare', label: 'Compare' },
					{ href: '/search', label: 'Search' },
				] as item}
					<a href={item.href} class="block py-3 text-steel hover:text-white transition-colors font-body text-sm" on:click={() => (mobileOpen = false)}>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>
