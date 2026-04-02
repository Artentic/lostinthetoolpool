<script lang="ts">
	import { page } from '$app/stores';
	import DifficultyBadge from '$components/DifficultyBadge.svelte';

	$: slug = $page.params.slug;

	// In production, this would come from +page.server.ts load function
	// For now, static data matching the project-tool-mapping research
	const projectData: Record<string, any> = {
		'build-a-deck': {
			name: 'Build a Deck', difficulty: 3, time: '3-5 weekends', icon: '🪵',
			description: 'Build a wood or composite deck attached to your house. One of the most rewarding DIY projects that adds real value to your home.',
			essential: ['Circular Saw', 'Drill/Driver', 'Impact Driver', 'Speed Square', 'Tape Measure', 'Level (4ft)', 'Chalk Line', 'Post Hole Digger'],
			recommended: ['Miter Saw', 'Jigsaw', 'Reciprocating Saw', 'Clamps'],
			rentable: ['Post Hole Auger — $50/day, saves hours of digging', 'Miter Saw — $45/day if you only need it for this project'],
			budget_cost: '$350-500 (Ryobi ONE+)', pro_cost: '$600-900 (Milwaukee M18)',
			safety: ['Safety glasses', 'Hearing protection', 'Work gloves', 'Dust mask'],
			mistakes: [
				'Not checking local building codes and permit requirements before starting',
				'Skipping the ledger board flashing — leads to water damage',
				'Using regular screws instead of structural screws for framing',
				'Not pre-drilling hardwood decking — causes splitting',
				'Setting posts too shallow — code usually requires 42" depth for frost line'
			]
		}
	};

	$: project = projectData[slug] || {
		name: slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
		difficulty: 3, time: 'Varies', icon: '🔧',
		description: 'Project details loading...',
		essential: [], recommended: [], rentable: [],
		budget_cost: 'TBD', pro_cost: 'TBD',
		safety: [], mistakes: []
	};

	let selectedEcosystem = 'ryobi-one-plus';
</script>

<svelte:head>
	<title>What Tools Do You Need to {project.name}? — Lost in the Tool Pool</title>
	<meta name="description" content="Complete tool list for {project.name}. Essential tools, nice-to-haves, rental options, and cost breakdown across battery ecosystems." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
	<div class="mb-8">
		<a href="/projects" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">
			← All Projects
		</a>
	</div>

	<div class="flex items-start gap-4 mb-8">
		<span class="text-5xl">{project.icon}</span>
		<div>
			<h1 class="text-3xl sm:text-4xl text-white">{project.name}</h1>
			<p class="text-gray-400 font-body normal-case mt-2">{project.description}</p>
			<div class="flex items-center gap-6 mt-3">
				<DifficultyBadge level={project.difficulty} />
				<span class="text-sm text-gray-400">⏱ {project.time}</span>
			</div>
		</div>
	</div>

	<!-- Ecosystem Selector -->
	<div class="card mb-6">
		<h2 class="text-lg text-safety-orange mb-3">Choose Your Ecosystem</h2>
		<div class="flex flex-wrap gap-2">
			{#each [
				{ slug: 'ryobi-one-plus', name: 'Ryobi ONE+', color: 'bg-ryobi text-black', cost: project.budget_cost },
				{ slug: 'milwaukee-m18', name: 'Milwaukee M18', color: 'bg-milwaukee text-white', cost: project.pro_cost },
				{ slug: 'dewalt-20v-max', name: 'DeWalt 20V', color: 'bg-dewalt text-black', cost: project.pro_cost },
				{ slug: 'makita-18v-lxt', name: 'Makita 18V', color: 'bg-makita text-white', cost: project.pro_cost }
			] as eco}
				<button
					on:click={() => selectedEcosystem = eco.slug}
					class="ecosystem-badge {selectedEcosystem === eco.slug ? eco.color : 'bg-gray-700 text-gray-300'} cursor-pointer transition"
				>
					{eco.name}
				</button>
			{/each}
		</div>
		<p class="mt-3 text-sm text-gray-400 font-body normal-case">
			Estimated tool cost: <span class="text-safety-orange font-bold">{selectedEcosystem.includes('ryobi') ? project.budget_cost : project.pro_cost}</span>
		</p>
	</div>

	<!-- Essential Tools -->
	{#if project.essential.length > 0}
		<div class="card mb-4">
			<h2 class="text-lg text-safety-orange mb-3">Essential Tools</h2>
			<p class="text-xs text-gray-500 mb-4 font-body normal-case">You literally cannot do this project without these.</p>
			<ul class="space-y-2">
				{#each project.essential as tool}
					<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="w-2 h-2 rounded-full bg-safety-orange flex-shrink-0" />
						{tool}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Recommended -->
	{#if project.recommended.length > 0}
		<div class="card mb-4">
			<h2 class="text-lg text-electric-blue mb-3">Recommended</h2>
			<p class="text-xs text-gray-500 mb-4 font-body normal-case">These make the job significantly easier and faster.</p>
			<ul class="space-y-2">
				{#each project.recommended as tool}
					<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="w-2 h-2 rounded-full bg-electric-blue flex-shrink-0" />
						{tool}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Rent Instead -->
	{#if project.rentable.length > 0}
		<div class="card mb-4">
			<h2 class="text-lg text-yellow-400 mb-3">Consider Renting</h2>
			<ul class="space-y-2">
				{#each project.rentable as item}
					<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm">
						<span class="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5" />
						{item}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Safety Gear -->
	{#if project.safety.length > 0}
		<div class="card mb-4">
			<h2 class="text-lg text-red-400 mb-3">Safety Equipment</h2>
			<div class="flex flex-wrap gap-2">
				{#each project.safety as item}
					<span class="px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-body normal-case">
						{item}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Common Mistakes -->
	{#if project.mistakes.length > 0}
		<div class="card">
			<h2 class="text-lg text-yellow-400 mb-3">Common Beginner Mistakes</h2>
			<ul class="space-y-3">
				{#each project.mistakes as mistake}
					<li class="flex items-start gap-3 text-gray-400 font-body normal-case text-sm">
						<span class="text-yellow-400 flex-shrink-0">⚠</span>
						{mistake}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
