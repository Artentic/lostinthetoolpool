import { c as create_ssr_component, e as escape, d as each } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let compareList = [];
  const suggestions = [
    {
      sku: "MIL-2853-20",
      name: "Milwaukee M18 FUEL Impact Driver",
      brand: "Milwaukee",
      price: 149,
      ecosystem: "M18"
    },
    {
      sku: "DW-DCF887B",
      name: "DeWalt 20V XR Impact Driver",
      brand: "DeWalt",
      price: 119,
      ecosystem: "20V MAX"
    },
    {
      sku: "RY-PSBID01B",
      name: "Ryobi ONE+ HP Impact Driver",
      brand: "Ryobi",
      price: 59,
      ecosystem: "ONE+"
    },
    {
      sku: "MIL-2732-20",
      name: "Milwaukee M18 FUEL Circular Saw",
      brand: "Milwaukee",
      price: 199,
      ecosystem: "M18"
    },
    {
      sku: "DW-DCS570B",
      name: "DeWalt 20V Circular Saw",
      brand: "DeWalt",
      price: 149,
      ecosystem: "20V MAX"
    },
    {
      sku: "RY-PBLCS300B",
      name: "Ryobi ONE+ HP Circular Saw",
      brand: "Ryobi",
      price: 119,
      ecosystem: "ONE+"
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-zr3fwj_START -->${$$result.title = `<title>Compare Tools Side by Side — Lost in the Tool Pool</title>`, ""}<meta name="description" content="Compare power tools side by side. Specs, prices, and ratings across Milwaukee, DeWalt, Makita, Ryobi, and more."><!-- HEAD_svelte-zr3fwj_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-g3p2b7"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Compare</span> <span class="text-safety-orange">Tools</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Pick 2-5 tools and see them side by side. Specs, prices, ratings, and honest analysis.</p></div>  ${compareList.length > 0 ? `<div class="card mb-6"><div class="flex items-center justify-between mb-3"><h2 class="text-sm text-gray-400 font-heading uppercase tracking-wider">Comparing (${escape(compareList.length)}/5)</h2> <button class="text-xs text-gray-500 hover:text-red-400 transition" data-svelte-h="svelte-2g715s">Clear all</button></div> <div class="flex flex-wrap gap-2">${each(compareList, (sku) => {
    let tool = suggestions.find((s) => s.sku === sku);
    return ` <span class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-dark border border-gray-600 text-sm"><span class="text-gray-300 font-body normal-case">${escape(tool?.name || sku)}</span> <button class="text-gray-500 hover:text-red-400" data-svelte-h="svelte-qe9xbv">x</button> </span>`;
  })}</div> ${compareList.length >= 2 ? `<button class="btn-primary mt-4 text-sm" data-svelte-h="svelte-7aa5a7">Compare Now</button>` : `<p class="text-xs text-gray-500 mt-2 font-body normal-case" data-svelte-h="svelte-1d3wguz">Add at least 2 tools to compare</p>`}</div>` : ``}  <h2 class="text-sm text-gray-500 font-heading uppercase tracking-wider mb-4" data-svelte-h="svelte-41zdsk">Popular comparisons</h2> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">${each(suggestions, (tool) => {
    return `<button class="${"card text-left group cursor-pointer " + escape(
      compareList.includes(tool.sku) ? "border-safety-orange/50" : "",
      true
    )}" ${compareList.includes(tool.sku) ? "disabled" : ""}><div class="flex items-start justify-between"><div><span class="text-xs text-gray-500 font-heading uppercase">${escape(tool.brand)} ${escape(tool.ecosystem)}</span> <h3 class="font-body text-sm text-gray-200 normal-case mt-1">${escape(tool.name)}</h3> <span class="text-lg font-heading font-bold text-safety-orange mt-2 block">$${escape(tool.price)}</span></div> ${compareList.includes(tool.sku) ? `<span class="text-safety-orange text-lg" data-svelte-h="svelte-1f8tklq">✓</span>` : `<span class="text-gray-600 group-hover:text-safety-orange transition text-lg" data-svelte-h="svelte-12h5kfh">+</span>`}</div> </button>`;
  })}</div></div>`;
});
export {
  Page as default
};
