<script lang="ts">
	import SearchBar from '$components/SearchBar.svelte';
	import { goto } from '$app/navigation';

	const exampleQueries = [
		'I want to build a 12x16 deck on a budget',
		"What's the minimum toolkit for a bathroom reno?",
		'Milwaukee vs DeWalt for a serious DIYer?',
		'I need to cut a hole in drywall for a new outlet',
		'Best starter kit under $500 for a new homeowner',
		'What do I need to refinish hardwood floors?'
	];

	const projects = [
		{ slug: 'build-a-deck', name: 'Build a Deck', icon: '🪵', difficulty: 3 },
		{ slug: 'build-a-fence', name: 'Build a Fence', icon: '🏗️', difficulty: 2 },
		{ slug: 'bathroom-renovation', name: 'Bathroom Reno', icon: '🚿', difficulty: 4 },
		{ slug: 'paint-a-room', name: 'Paint a Room', icon: '🎨', difficulty: 1 },
		{ slug: 'install-hardwood-flooring', name: 'Install Flooring', icon: '🪵', difficulty: 3 },
		{ slug: 'build-raised-garden-beds', name: 'Garden Beds', icon: '🌱', difficulty: 1 },
		{ slug: 'drywall-installation', name: 'Drywall', icon: '🧱', difficulty: 3 },
		{ slug: 'yard-maintenance', name: 'Yard Care', icon: '🌿', difficulty: 1 }
	];

	function handleSearch(e: CustomEvent<string>) {
		goto(`/advisor?q=${encodeURIComponent(e.detail)}`);
	}
</script>

<svelte:head>
	<title>Lost in the Tool Pool — AI-Powered Tool Recommendations for DIY Projects</title>
	<meta name="description" content="Tell us your project, we'll tell you exactly what tools you need. AI-powered recommendations, ecosystem comparisons, and the best deals." />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-gradient-to-b from-charcoal-dark via-charcoal to-charcoal-dark" />
	<div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Crect fill=%22none%22 stroke=%22%23ff6b35%22 stroke-width=%220.5%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'); background-size: 60px 60px;" />

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
			<span class="text-white">Tell Us Your Project.</span><br />
			<span class="text-safety-orange">We'll Tell You What Tools You Need.</span>
		</h1>

		<p class="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body normal-case">
			Stop guessing. Stop overspending. Get AI-powered tool recommendations
			tailored to your specific project, budget, and skill level.
		</p>

		<div class="flex justify-center mb-8">
			<SearchBar
				size="large"
				placeholder="Describe your project... e.g., I want to build a deck"
				on:search={handleSearch}
			/>
		</div>

		<div class="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
			{#each exampleQueries as query}
				<button
					on:click={() => goto(`/advisor?q=${encodeURIComponent(query)}`)}
					class="text-xs px-3 py-1.5 rounded-full bg-charcoal-light border border-gray-600/50
					       text-gray-400 hover:text-safety-orange hover:border-safety-orange/30 transition
					       font-body normal-case"
				>
					"{query}"
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Quick Start Projects -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
	<h2 class="text-2xl sm:text-3xl text-center mb-10">
		<span class="text-gray-300">Pick a Project,</span>
		<span class="text-safety-orange"> Get Your Toolkit</span>
	</h2>

	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
		{#each projects as project}
			<a
				href="/projects/{project.slug}"
				class="card text-center group cursor-pointer hover:border-safety-orange/50 hover:-translate-y-1 transition-all duration-300"
			>
				<span class="text-4xl block mb-3">{project.icon}</span>
				<span class="font-heading text-sm text-gray-200 group-hover:text-safety-orange transition">
					{project.name}
				</span>
				<div class="mt-2 flex justify-center gap-1">
					{#each Array(5) as _, i}
						<span class="w-1.5 h-1.5 rounded-full {i < project.difficulty ? 'bg-safety-orange' : 'bg-gray-600'}" />
					{/each}
				</div>
			</a>
		{/each}
	</div>

	<div class="text-center mt-6">
		<a href="/projects" class="text-electric-blue hover:text-electric-blue-light transition text-sm font-heading uppercase tracking-wider">
			View all 20 projects →
		</a>
	</div>
</section>

<!-- How It Works -->
<section class="bg-charcoal-dark py-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h2 class="text-2xl sm:text-3xl text-center mb-12">
			<span class="text-gray-300">How It</span>
			<span class="text-electric-blue"> Works</span>
		</h2>

		<div class="grid md:grid-cols-3 gap-8">
			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-safety-orange/10 border border-safety-orange/30 flex items-center justify-center">
					<span class="text-safety-orange font-heading text-2xl font-bold">1</span>
				</div>
				<h3 class="text-lg mb-2 text-white">Describe Your Project</h3>
				<p class="text-gray-400 text-sm normal-case font-body">
					Tell us what you want to build in plain English. No jargon needed.
					"I want to build a deck" is perfect.
				</p>
			</div>

			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center">
					<span class="text-electric-blue font-heading text-2xl font-bold">2</span>
				</div>
				<h3 class="text-lg mb-2 text-white">Get Your Toolkit</h3>
				<p class="text-gray-400 text-sm normal-case font-body">
					We recommend exactly what you need — tools, accessories, and safety gear.
					Skip what you already own. Rent what you'll use once.
				</p>
			</div>

			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-safety-orange/10 border border-safety-orange/30 flex items-center justify-center">
					<span class="text-safety-orange font-heading text-2xl font-bold">3</span>
				</div>
				<h3 class="text-lg mb-2 text-white">Buy With Confidence</h3>
				<p class="text-gray-400 text-sm normal-case font-body">
					Compare prices across retailers. Pick the battery ecosystem that fits your life.
					Every recommendation explained — no mystery picks.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Ecosystem Chooser Teaser -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
	<h2 class="text-2xl sm:text-3xl text-center mb-4">
		<span class="text-gray-300">Choose Your</span>
		<span class="text-safety-orange"> Battery Ecosystem</span>
	</h2>
	<p class="text-center text-gray-400 mb-10 max-w-xl mx-auto font-body normal-case text-sm">
		Your first battery tool purchase locks you into an ecosystem. We help you pick the right one
		before you're invested.
	</p>

	<div class="flex flex-wrap justify-center gap-3">
		{#each [
			{ name: 'Milwaukee', color: 'bg-milwaukee', slug: 'milwaukee-m18' },
			{ name: 'DeWalt', color: 'bg-dewalt text-black', slug: 'dewalt-20v-max' },
			{ name: 'Makita', color: 'bg-makita', slug: 'makita-18v-lxt' },
			{ name: 'Ryobi', color: 'bg-ryobi text-black', slug: 'ryobi-one-plus' },
			{ name: 'Bosch', color: 'bg-bosch', slug: 'bosch-18v' },
			{ name: 'EGO', color: 'bg-ego', slug: 'ego-56v' }
		] as eco}
			<a
				href="/ecosystems/{eco.slug}"
				class="ecosystem-badge {eco.color} text-sm px-5 py-2.5 hover:scale-105 transition-transform cursor-pointer"
			>
				{eco.name}
			</a>
		{/each}
	</div>

	<div class="text-center mt-6">
		<a href="/ecosystems" class="text-electric-blue hover:text-electric-blue-light transition text-sm font-heading uppercase tracking-wider">
			Compare all 13 ecosystems →
		</a>
	</div>
</section>

<!-- Trust Banner -->
<section class="bg-charcoal-dark border-y border-gray-700/30 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
			<div>
				<span class="text-3xl font-heading font-bold text-safety-orange">500+</span>
				<p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Tools Analyzed</p>
			</div>
			<div>
				<span class="text-3xl font-heading font-bold text-electric-blue">13</span>
				<p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Battery Ecosystems</p>
			</div>
			<div>
				<span class="text-3xl font-heading font-bold text-safety-orange">20</span>
				<p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Project Types</p>
			</div>
			<div>
				<span class="text-3xl font-heading font-bold text-electric-blue">$0</span>
				<p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Pay-to-Rank</p>
			</div>
		</div>
	</div>
</section>
