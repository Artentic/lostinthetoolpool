import { c as create_ssr_component, e as escape, b as subscribe, v as validate_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import "posthog-js";
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<nav class="sticky top-0 z-50 bg-charcoal-dark/95 backdrop-blur-sm border-b border-gray-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><a href="/" class="flex items-center gap-3 group" data-svelte-h="svelte-ecb7ps"><span class="text-2xl">🏊</span> <span class="font-heading font-extrabold text-xl tracking-wider"><span class="text-safety-orange">LOST</span> <span class="text-gray-300">IN THE</span> <span class="text-electric-blue">TOOL POOL</span></span></a> <div class="hidden md:flex items-center gap-6" data-svelte-h="svelte-13imxz6"><a href="/advisor" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Project Advisor</a> <a href="/projects" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Projects</a> <a href="/ecosystems" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Ecosystems</a> <a href="/compare" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Compare</a></div> <button class="md:hidden text-gray-300 p-2" aria-label="Toggle menu"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`}</svg></button></div></div> ${``}</nav>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="bg-charcoal-dark border-t border-gray-700/50 mt-20"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="grid grid-cols-1 md:grid-cols-4 gap-8" data-svelte-h="svelte-1sqi8w3"><div><span class="font-heading font-extrabold text-lg tracking-wider"><span class="text-safety-orange">LOST</span> <span class="text-gray-300">IN THE</span> <span class="text-electric-blue">TOOL POOL</span></span> <p class="mt-3 text-gray-400 text-sm leading-relaxed">AI-powered tool recommendations for DIY homeowners.
					We help you figure out what you actually need.</p></div> <div><h4 class="text-safety-orange text-sm mb-3">Explore</h4> <ul class="space-y-2 text-sm text-gray-400"><li><a href="/advisor" class="hover:text-white transition">Project Advisor</a></li> <li><a href="/projects" class="hover:text-white transition">Browse Projects</a></li> <li><a href="/ecosystems" class="hover:text-white transition">Battery Ecosystems</a></li> <li><a href="/compare" class="hover:text-white transition">Compare Tools</a></li></ul></div> <div><h4 class="text-safety-orange text-sm mb-3">Popular Projects</h4> <ul class="space-y-2 text-sm text-gray-400"><li><a href="/projects/build-a-deck" class="hover:text-white transition">Build a Deck</a></li> <li><a href="/projects/bathroom-renovation" class="hover:text-white transition">Bathroom Renovation</a></li> <li><a href="/projects/build-a-fence" class="hover:text-white transition">Build a Fence</a></li> <li><a href="/projects/paint-a-room" class="hover:text-white transition">Paint a Room</a></li></ul></div> <div><h4 class="text-safety-orange text-sm mb-3">Transparency</h4> <p class="text-sm text-gray-400 leading-relaxed">We earn affiliate commissions when you buy through our links.
					This does <strong class="text-gray-300">not</strong> affect our rankings.
					We recommend what&#39;s best for your project, not what pays us the most.</p></div></div> <div class="mt-8 pt-6 border-t border-gray-700/30"><div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4" data-svelte-h="svelte-1epega"><a href="/legal/privacy" class="hover:text-gray-300 transition">Privacy Policy</a> <a href="/legal/terms" class="hover:text-gray-300 transition">Terms of Service</a> <a href="/legal/affiliate-disclosure" class="hover:text-gray-300 transition">Affiliate Disclosure</a> <a href="/legal/disclaimer" class="hover:text-gray-300 transition">Disclaimer</a> <a href="/legal/accessibility" class="hover:text-gray-300 transition">Accessibility</a></div> <p class="text-center text-xs text-gray-600">© ${escape((/* @__PURE__ */ new Date()).getFullYear())} Lost in the Tool Pool, operated by CYBERNITED (Belgium). Built by tool nerds, for humans who build things.</p></div></div></footer>`;
});
function trackPageView(url) {
  return;
}
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  {
    if ($page.url.pathname) {
      trackPageView($page.url.pathname);
      const path = $page.url.pathname;
      path === "/" ? "home" : path.startsWith("/projects/") ? "project" : path === "/projects" ? "projects_list" : path.startsWith("/tools/") ? "tool" : path.startsWith("/ecosystems/") ? "ecosystem" : path === "/ecosystems" ? "ecosystems_list" : path === "/advisor" ? "advisor" : path === "/compare" ? "compare" : path === "/search" ? "search" : "other";
      $page.params?.slug || "";
    }
  }
  $$unsubscribe_page();
  return `<div class="min-h-screen flex flex-col">${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})} <main class="flex-1">${slots.default ? slots.default({}) : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
export {
  Layout as default
};
