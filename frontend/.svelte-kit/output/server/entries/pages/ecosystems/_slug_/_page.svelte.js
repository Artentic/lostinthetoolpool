import { c as create_ssr_component, b as subscribe, e as escape, d as each } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let slug;
  let eco;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const ecoData = {
    "milwaukee-m18": {
      name: "Milwaukee M18",
      brand: "Milwaukee",
      voltage: 18,
      tools: "250+",
      target: "Professional trades and serious DIYers",
      parent: "TTI Group",
      exclusive: "Home Depot",
      warranty: "5-year tool warranty",
      color: "bg-milwaukee",
      strengths: [
        "Industry-leading impact drivers and drills",
        "ONE-KEY smart tool connectivity",
        "Largest pro-grade selection",
        "Excellent battery life with high-output packs"
      ],
      weaknesses: [
        "Premium pricing",
        "Home Depot exclusive limits availability",
        "Overkill for casual DIY"
      ],
      starter_kit: [
        "Drill/Driver",
        "Impact Driver",
        "Circular Saw",
        "Reciprocating Saw",
        "Multi-Tool"
      ],
      starter_cost: 685
    }
  };
  slug = $page.params.slug;
  eco = ecoData[slug] || {
    name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    brand: slug.split("-")[0],
    voltage: 18,
    tools: "TBD",
    target: "TBD",
    parent: "",
    exclusive: "",
    warranty: "",
    color: "bg-gray-600",
    strengths: [],
    weaknesses: [],
    starter_kit: [],
    starter_cost: 0
  };
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1rc1t3x_START -->${$$result.title = `<title>${escape(eco.name)} Ecosystem Guide — Lost in the Tool Pool</title>`, ""}<meta name="description" content="${"Complete guide to the " + escape(eco.name, true) + " battery ecosystem. " + escape(eco.tools, true) + " tools, compatibility info, starter kit recommendations, and honest pros/cons."}"><!-- HEAD_svelte-1rc1t3x_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-6" data-svelte-h="svelte-14bwacf"><a href="/ecosystems" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">← All Ecosystems</a></div> <div class="flex items-center gap-4 mb-8"><span class="${"ecosystem-badge " + escape(eco.color, true) + " text-lg px-6 py-3"}">${escape(eco.brand)}</span> <div><h1 class="text-3xl sm:text-4xl text-white">${escape(eco.name)}</h1> <p class="text-gray-400 font-body normal-case mt-1">${escape(eco.target)}</p></div></div>  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"><div class="card text-center"><span class="text-2xl font-heading font-bold text-safety-orange">${escape(eco.voltage)}V</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-136dfv0">Voltage</p></div> <div class="card text-center"><span class="text-2xl font-heading font-bold text-electric-blue">${escape(eco.tools)}</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-tdnc65">Tools</p></div> <div class="card text-center"><span class="text-sm font-heading font-bold text-gray-300">${escape(eco.exclusive || "Everywhere")}</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-ewqqr5">Sold At</p></div> <div class="card text-center"><span class="text-sm font-heading font-bold text-gray-300">${escape(eco.warranty || "Varies")}</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-1yyb9le">Warranty</p></div></div>  ${eco.strengths.length ? `<div class="card mb-4"><h2 class="text-lg text-green-400 mb-3" data-svelte-h="svelte-1nkp35r">Strengths</h2> <ul class="space-y-2">${each(eco.strengths, (s) => {
    return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="text-green-400 flex-shrink-0" data-svelte-h="svelte-1twkq3y">+</span> ${escape(s)} </li>`;
  })}</ul></div>` : ``}  ${eco.weaknesses.length ? `<div class="card mb-4"><h2 class="text-lg text-red-400 mb-3" data-svelte-h="svelte-1r2ckga">Weaknesses</h2> <ul class="space-y-2">${each(eco.weaknesses, (w) => {
    return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="text-red-400 flex-shrink-0" data-svelte-h="svelte-vt3uqc">-</span> ${escape(w)} </li>`;
  })}</ul></div>` : ``}  ${eco.starter_kit.length ? `<div class="card"><h2 class="text-lg text-safety-orange mb-3" data-svelte-h="svelte-qqtcqm">Recommended Starter Kit</h2> <ul class="space-y-2 mb-4">${each(eco.starter_kit, (tool) => {
    return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-safety-orange flex-shrink-0"></span> ${escape(tool)} </li>`;
  })}</ul> ${eco.starter_cost ? `<p class="text-sm text-gray-400 font-body normal-case">Estimated cost (tools only): <span class="text-safety-orange font-bold">$${escape(eco.starter_cost)}</span></p>` : ``}</div>` : ``}</div>`;
});
export {
  Page as default
};
