<script>
	import '../app.css';
	import Nav from '$components/Nav.svelte';
	import Footer from '$components/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { initPostHog, trackPageView } from '$lib/analytics/posthog';
	import { logPageView } from '$lib/analytics/clickhouse';
	import { initScrollTracking } from '$lib/analytics/scroll';

	onMount(() => {
		initPostHog();
	});

	// Track page views on every navigation
	$: if ($page.url.pathname) {
		trackPageView($page.url.pathname);

		// Determine page type for ClickHouse
		const path = $page.url.pathname;
		const pageType = path === '/' ? 'home'
			: path.startsWith('/projects/') ? 'project'
			: path === '/projects' ? 'projects_list'
			: path.startsWith('/tools/') ? 'tool'
			: path.startsWith('/ecosystems/') ? 'ecosystem'
			: path === '/ecosystems' ? 'ecosystems_list'
			: path === '/advisor' ? 'advisor'
			: path === '/compare' ? 'compare'
			: path === '/search' ? 'search'
			: 'other';

		const slug = $page.params?.slug || '';
		logPageView(pageType, slug);

		// Init scroll tracking for content pages
		if (typeof window !== 'undefined') {
			initScrollTracking(path);
		}
	}
</script>

<div class="min-h-screen flex flex-col">
	<Nav />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
