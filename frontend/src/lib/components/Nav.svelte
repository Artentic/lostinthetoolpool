<script>
	let mobileOpen = false;
</script>

<nav class="sticky top-0 z-50 bg-charcoal-dark/95 backdrop-blur-sm border-b border-gray-700/50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<a href="/" class="flex items-center gap-3 group">
				<span class="text-2xl">🏊</span>
				<span class="font-heading font-extrabold text-xl tracking-wider">
					<span class="text-safety-orange">LOST</span>
					<span class="text-gray-300"> IN THE </span>
					<span class="text-electric-blue">TOOL POOL</span>
				</span>
			</a>

			<div class="hidden md:flex items-center gap-6">
				<a href="/advisor" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">
					Project Advisor
				</a>
				<a href="/projects" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">
					Projects
				</a>
				<a href="/ecosystems" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">
					Ecosystems
				</a>
				<a href="/compare" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">
					Compare
				</a>
			</div>

			<button
				class="md:hidden text-gray-300 p-2"
				on:click={() => (mobileOpen = !mobileOpen)}
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if mobileOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<div class="md:hidden border-t border-gray-700/50 bg-charcoal-dark">
			<div class="px-4 py-3 space-y-2">
				<a href="/advisor" class="block py-2 text-gray-300 hover:text-safety-orange font-heading uppercase tracking-wider" on:click={() => (mobileOpen = false)}>Project Advisor</a>
				<a href="/projects" class="block py-2 text-gray-300 hover:text-safety-orange font-heading uppercase tracking-wider" on:click={() => (mobileOpen = false)}>Projects</a>
				<a href="/ecosystems" class="block py-2 text-gray-300 hover:text-safety-orange font-heading uppercase tracking-wider" on:click={() => (mobileOpen = false)}>Ecosystems</a>
				<a href="/compare" class="block py-2 text-gray-300 hover:text-safety-orange font-heading uppercase tracking-wider" on:click={() => (mobileOpen = false)}>Compare</a>
			</div>
		</div>
	{/if}
</nav>
