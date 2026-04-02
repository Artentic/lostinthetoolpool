import { c as create_ssr_component, e as escape, d as each } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ecosystems;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  ecosystems = data.ecosystems || [];
  return `${$$result.head += `<!-- HEAD_svelte-1wknsp4_START -->${$$result.title = `<title>Battery Tool Ecosystems Compared — Lost in the Tool Pool</title>`, ""}<meta name="description" content="${"Compare " + escape(ecosystems.length, true) + " battery tool ecosystems: Milwaukee, DeWalt, Makita, Ryobi, EGO, and more. Find the right platform before you're locked in."}"><!-- HEAD_svelte-1wknsp4_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10"><h1 class="text-3xl sm:text-4xl mb-4" data-svelte-h="svelte-1p8o9d6"><span class="text-white">Battery</span> <span class="text-safety-orange">Ecosystems</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Your first battery tool purchase locks you into an ecosystem.
			Choose wisely — ${escape(ecosystems.length)} platforms compared.</p></div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${each(ecosystems, (eco) => {
    return `<a href="${"/ecosystems/" + escape(eco.slug, true)}" class="card group hover:-translate-y-1 transition-all duration-300"><div class="flex items-center justify-between mb-3"><span class="ecosystem-badge bg-gray-600 text-white">${escape(eco.slug.split("-")[0])}</span></div> <h3 class="font-heading text-lg text-gray-200 group-hover:text-safety-orange transition">${escape(eco.slug)}</h3> <div class="mt-3 text-center"><span class="text-2xl font-heading font-bold text-electric-blue">${escape(eco.tool_count)}</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1vmem2o">Tools</p></div> </a>`;
  })}</div></div>`;
});
export {
  Page as default
};
