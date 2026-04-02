<script>
	import '../app.css';
	import Nav from '$components/Nav.svelte';
	import Footer from '$components/Footer.svelte';
</script>

<div class="min-h-screen flex flex-col">
	<Nav />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
