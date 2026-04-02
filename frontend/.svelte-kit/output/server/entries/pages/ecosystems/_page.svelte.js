import { c as create_ssr_component, d as each, e as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const ecosystems = [
    {
      slug: "milwaukee-m18",
      name: "Milwaukee M18",
      brand: "Milwaukee",
      voltage: 18,
      tools: "250+",
      target: "Pro",
      color: "bg-milwaukee",
      exclusive: "Home Depot"
    },
    {
      slug: "milwaukee-m12",
      name: "Milwaukee M12",
      brand: "Milwaukee",
      voltage: 12,
      tools: "125+",
      target: "Pro",
      color: "bg-milwaukee",
      exclusive: "Home Depot"
    },
    {
      slug: "dewalt-20v-max",
      name: "DeWalt 20V MAX",
      brand: "DeWalt",
      voltage: 20,
      tools: "300+",
      target: "Both",
      color: "bg-dewalt text-black",
      exclusive: "None"
    },
    {
      slug: "makita-18v-lxt",
      name: "Makita 18V LXT",
      brand: "Makita",
      voltage: 18,
      tools: "350+",
      target: "Both",
      color: "bg-makita",
      exclusive: "None"
    },
    {
      slug: "ryobi-one-plus",
      name: "Ryobi ONE+",
      brand: "Ryobi",
      voltage: 18,
      tools: "300+",
      target: "DIY",
      color: "bg-ryobi text-black",
      exclusive: "Home Depot"
    },
    {
      slug: "bosch-18v",
      name: "Bosch 18V",
      brand: "Bosch",
      voltage: 18,
      tools: "90+",
      target: "Both",
      color: "bg-bosch",
      exclusive: "None"
    },
    {
      slug: "ridgid-18v",
      name: "Ridgid 18V",
      brand: "Ridgid",
      voltage: 18,
      tools: "85+",
      target: "Both",
      color: "bg-gray-500",
      exclusive: "Home Depot"
    },
    {
      slug: "ego-56v",
      name: "EGO 56V",
      brand: "EGO",
      voltage: 56,
      tools: "70+",
      target: "Both",
      color: "bg-ego",
      exclusive: "None"
    },
    {
      slug: "kobalt-24v",
      name: "Kobalt 24V",
      brand: "Kobalt",
      voltage: 24,
      tools: "75+",
      target: "DIY",
      color: "bg-blue-600",
      exclusive: "Lowe's"
    },
    {
      slug: "greenworks-24v",
      name: "Greenworks 24V",
      brand: "Greenworks",
      voltage: 24,
      tools: "100+",
      target: "DIY",
      color: "bg-green-600",
      exclusive: "None"
    },
    {
      slug: "husqvarna-battery",
      name: "Husqvarna Battery",
      brand: "Husqvarna",
      voltage: 36,
      tools: "55+",
      target: "Pro",
      color: "bg-orange-600",
      exclusive: "Dealers"
    },
    {
      slug: "stihl-ak",
      name: "STIHL AK",
      brand: "STIHL",
      voltage: 36,
      tools: "20+",
      target: "DIY",
      color: "bg-orange-500",
      exclusive: "Dealers"
    },
    {
      slug: "stihl-ap",
      name: "STIHL AP",
      brand: "STIHL",
      voltage: 36,
      tools: "25+",
      target: "Pro",
      color: "bg-orange-500",
      exclusive: "Dealers"
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-1bs6ilz_START -->${$$result.title = `<title>Battery Tool Ecosystems Compared — Lost in the Tool Pool</title>`, ""}<meta name="description" content="Compare 13 battery tool ecosystems: Milwaukee, DeWalt, Makita, Ryobi, EGO, and more. Find the right platform before you're locked in."><!-- HEAD_svelte-1bs6ilz_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-1bvq6uy"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Battery</span> <span class="text-safety-orange">Ecosystems</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Your first battery tool purchase locks you into an ecosystem.
			Choose wisely — here&#39;s everything you need to know about each one.</p></div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${each(ecosystems, (eco) => {
    return `<a href="${"/ecosystems/" + escape(eco.slug, true)}" class="card group hover:-translate-y-1 transition-all duration-300"><div class="flex items-center justify-between mb-3"><span class="${"ecosystem-badge " + escape(eco.color, true)}">${escape(eco.brand)}</span> <span class="text-xs text-gray-500 font-heading uppercase">${escape(eco.target)}</span></div> <h3 class="font-heading text-lg text-gray-200 group-hover:text-safety-orange transition">${escape(eco.name)}</h3> <div class="mt-3 grid grid-cols-3 gap-2 text-center"><div><span class="text-sm font-bold text-safety-orange">${escape(eco.voltage)}V</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1hwxn3z">Voltage</p></div> <div><span class="text-sm font-bold text-electric-blue">${escape(eco.tools)}</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1vmem2o">Tools</p></div> <div><span class="text-xs font-bold text-gray-400">${escape(eco.exclusive)}</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1wztm65">Exclusive</p> </div></div> </a>`;
  })}</div></div>`;
});
export {
  Page as default
};
