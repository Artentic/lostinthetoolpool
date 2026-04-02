import { c as create_ssr_component, e as escape, g as add_attribute, d as each, v as validate_component } from "../../../../chunks/ssr.js";
const AffiliateNotice = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { compact = false } = $$props;
  if ($$props.compact === void 0 && $$bindings.compact && compact !== void 0) $$bindings.compact(compact);
  return `${compact ? `<p class="text-[11px] text-gray-500 font-body normal-case mt-2" data-svelte-h="svelte-1r7vyo2">Links may earn us a commission — <a href="/legal/affiliate-disclosure" class="underline hover:text-gray-400">details</a>. Does not affect our picks.</p>` : `<div class="bg-charcoal-dark/50 border border-gray-700/30 rounded-lg px-4 py-3 mb-6" data-svelte-h="svelte-kdxpsc"><p class="text-xs text-gray-400 font-body normal-case"><strong class="text-gray-300">Transparency:</strong> We earn affiliate commissions when you buy through our links, at no extra cost to you.
			This does not influence our recommendations.
			<a href="/legal/affiliate-disclosure" class="text-safety-orange hover:underline">Learn more</a></p></div>`}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let product;
  let specs;
  let features;
  let retailers;
  let ecoSlug;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  product = data.product;
  specs = product.specs || {};
  features = product.features || [];
  retailers = product.retailers || [];
  ecoSlug = product.ecosystem || "";
  return `${$$result.head += `<!-- HEAD_svelte-1xcc2sg_START -->${$$result.title = `<title>${escape(product.name)} — $${escape(product.price_current)} — Lost in the Tool Pool</title>`, ""}<meta name="description"${add_attribute("content", product.description, 0)}><!-- HEAD_svelte-1xcc2sg_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-6">${ecoSlug ? `<a href="${"/ecosystems/" + escape(ecoSlug, true)}" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">← ${escape(ecoSlug.replace(/-/g, " "))}</a>` : ``}</div> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-charcoal-light rounded-xl p-8 flex items-center justify-center aspect-square">${product.image_url ? `<img${add_attribute("src", product.image_url, 0)}${add_attribute("alt", product.name, 0)} class="max-w-full max-h-full object-contain">` : `<div class="text-center"><svg class="w-24 h-24 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg> <p class="text-xs text-gray-600 mt-2">${escape(product.brand)}</p></div>`}</div>  <div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider">${escape(product.brand)} / ${escape(product.category?.replace(/-/g, " "))}</span> <h1 class="text-2xl sm:text-3xl text-white mt-2 normal-case font-heading leading-tight">${escape(product.name)}</h1> ${product.rating > 0 ? `<div class="flex items-center gap-2 mt-3"><div class="flex items-center gap-0.5">${each(Array(5), (_, i) => {
    return `<svg class="${"w-4 h-4 " + escape(
      i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600",
      true
    )}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
  })}</div> <span class="text-sm text-gray-400">${escape(product.rating)} (${escape((product.review_count || 0).toLocaleString())} reviews)</span></div>` : ``} <div class="mt-6"><span class="text-4xl font-heading font-bold text-safety-orange">$${escape(product.price_current)}</span> ${product.price_msrp && product.price_msrp > product.price_current ? `<span class="ml-2 text-lg text-gray-500 line-through">$${escape(product.price_msrp)}</span>` : ``} ${product.is_cordless ? `<span class="ml-2 text-xs text-gray-500 font-body normal-case" data-svelte-h="svelte-rrghcm">(tool only)</span>` : ``}</div> ${product.description ? `<p class="mt-4 text-gray-400 font-body normal-case text-sm leading-relaxed">${escape(product.description)}</p>` : ``}  ${retailers.length > 0 ? `<div class="mt-6 flex flex-wrap gap-3">${each(retailers, (retailer) => {
    return `<a href="#" class="${"affiliate-btn " + escape(
      retailer === "amazon" ? "bg-[#ff9900] text-black" : retailer === "homedepot" ? "bg-[#f96302] text-white" : retailer === "lowes" ? "bg-[#004990] text-white" : "bg-gray-600 text-white",
      true
    )}">Buy at ${escape(retailer === "homedepot" ? "Home Depot" : retailer === "lowes" ? "Lowe's" : retailer.charAt(0).toUpperCase() + retailer.slice(1))} </a>`;
  })}</div> ${validate_component(AffiliateNotice, "AffiliateNotice").$$render($$result, { compact: true }, {}, {})}` : ``}</div></div>  ${Object.keys(specs).length > 0 ? `<div class="card mt-8"><h2 class="text-lg text-safety-orange mb-4" data-svelte-h="svelte-1t6gjjp">Specifications</h2> <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">${each(Object.entries(specs), ([key, value]) => {
    return `<div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider">${escape(key.replace(/_/g, " "))}</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape(value)}</p> </div>`;
  })} ${product.weight_lbs > 0 ? `<div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider" data-svelte-h="svelte-8yzjw0">Weight</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape(product.weight_lbs)} lbs</p></div>` : ``}</div></div>` : ``}  ${features.length > 0 ? `<div class="card mt-4"><h2 class="text-lg text-electric-blue mb-4" data-svelte-h="svelte-11q6akq">Key Features</h2> <ul class="space-y-2">${each(features, (feature) => {
    return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0 mt-1.5"></span> ${escape(feature)} </li>`;
  })}</ul></div>` : ``}  ${ecoSlug ? `<div class="mt-6 text-center"><a href="${"/ecosystems/" + escape(ecoSlug, true)}" class="text-electric-blue hover:text-electric-blue-light transition text-sm font-heading uppercase tracking-wider">View all ${escape(ecoSlug.replace(/-/g, " "))} tools →</a></div>` : ``}</div>`;
});
export {
  Page as default
};
