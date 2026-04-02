import { c as create_ssr_component, b as subscribe, e as escape, d as each } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import { E as ECOSYSTEM_COLORS } from "../../../../chunks/index.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ecosystemClass;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let product = {
    name: 'Milwaukee M18 FUEL 1/4" Hex Impact Driver',
    brand: "Milwaukee",
    ecosystem: "milwaukee-m18",
    price_current: 149,
    rating: 4.9,
    review_count: 6200,
    description: "The king of impact drivers. 2000 in-lbs of torque with 4-mode DRIVE CONTROL for precision and power.",
    features: [
      "POWERSTATE brushless motor",
      "4-mode DRIVE CONTROL",
      "REDLINK intelligence",
      "Auto-stop mode for precision"
    ],
    specs: {
      voltage: 18,
      max_rpm: 3600,
      max_torque: "2000 in-lbs",
      drive: "1/4 hex",
      brushless: true
    },
    weight_lbs: 2.9
  };
  $page.params.slug;
  ecosystemClass = ECOSYSTEM_COLORS[product.ecosystem];
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-11z40vr_START -->${$$result.title = `<title>${escape(product.name)} — Lost in the Tool Pool</title>`, ""}<meta name="description" content="${escape(product.description, true) + " $" + escape(product.price_current, true) + ". Compare prices across retailers."}"><!-- HEAD_svelte-11z40vr_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-6"><a href="${"/ecosystems/" + escape(product.ecosystem, true)}" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">← ${escape(product.brand)} ${escape(product.ecosystem.split("-").pop()?.toUpperCase())}</a></div> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-charcoal-light rounded-xl p-8 flex items-center justify-center aspect-square" data-svelte-h="svelte-jni8d3"><svg class="w-32 h-32 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg></div>  <div><span class="${"ecosystem-badge " + escape(ecosystemClass, true) + " mb-3"}">${escape(product.brand)} ${escape(product.ecosystem.split("-").pop())}</span> <h1 class="text-2xl sm:text-3xl text-white mt-2 normal-case font-heading">${escape(product.name)}</h1> <div class="flex items-center gap-3 mt-3"><div class="flex items-center gap-1">${each(Array(5), (_, i) => {
    return `<svg class="${"w-4 h-4 " + escape(
      i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600",
      true
    )}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
  })} <span class="text-sm text-gray-400 ml-1">${escape(product.rating)} (${escape(product.review_count.toLocaleString())} reviews)</span></div></div> <div class="mt-6"><span class="text-4xl font-heading font-bold text-safety-orange">$${escape(product.price_current)}</span> ${`<span class="ml-2 text-xs text-gray-500 font-body normal-case" data-svelte-h="svelte-1cbdwt9">(tool only — battery sold separately)</span>`}</div> <p class="mt-4 text-gray-400 font-body normal-case text-sm leading-relaxed">${escape(product.description)}</p>  <div class="mt-6 flex flex-wrap gap-3" data-svelte-h="svelte-yywb0s"><a href="#" class="affiliate-btn bg-[#ff9900] text-black">Buy at Amazon</a> <a href="#" class="affiliate-btn bg-[#f96302] text-white">Buy at Home Depot</a> <a href="#" class="affiliate-btn bg-[#004990] text-white">Buy at Lowe&#39;s</a></div> <p class="mt-2 text-xs text-gray-600 font-body normal-case" data-svelte-h="svelte-t0nfou">Prices may vary. We earn a commission on purchases — this doesn&#39;t affect our recommendations.</p></div></div>  <div class="card mt-8"><h2 class="text-lg text-safety-orange mb-4" data-svelte-h="svelte-1t6gjjp">Specifications</h2> <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">${each(Object.entries(product.specs), ([key, value]) => {
    return `<div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider">${escape(key.replace(/_/g, " "))}</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape(value)}</p> </div>`;
  })} <div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider" data-svelte-h="svelte-8yzjw0">Weight</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape(product.weight_lbs)} lbs</p></div> <div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider" data-svelte-h="svelte-18qog49">Cordless</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape("Yes")}</p></div></div></div>  <div class="card mt-4"><h2 class="text-lg text-electric-blue mb-4" data-svelte-h="svelte-11q6akq">Key Features</h2> <ul class="space-y-2">${each(product.features, (feature) => {
    return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0"></span> ${escape(feature)} </li>`;
  })}</ul></div></div>`;
});
export {
  Page as default
};
