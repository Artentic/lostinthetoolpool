import { c as create_ssr_component, v as validate_component, d as each, e as escape } from "../../chunks/ssr.js";
import { S as SearchBar } from "../../chunks/SearchBar.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const exampleQueries = [
    "I want to build a 12x16 deck on a budget",
    "What's the minimum toolkit for a bathroom reno?",
    "Milwaukee vs DeWalt for a serious DIYer?",
    "Best starter kit under $500 for a new homeowner"
  ];
  const projects = [
    {
      slug: "build-a-deck",
      name: "Build a Deck",
      difficulty: 3
    },
    {
      slug: "build-a-fence",
      name: "Build a Fence",
      difficulty: 2
    },
    {
      slug: "bathroom-renovation",
      name: "Bathroom Reno",
      difficulty: 4
    },
    {
      slug: "paint-a-room",
      name: "Paint a Room",
      difficulty: 1
    },
    {
      slug: "install-hardwood-flooring",
      name: "Install Flooring",
      difficulty: 3
    },
    {
      slug: "build-raised-garden-beds",
      name: "Garden Beds",
      difficulty: 1
    },
    {
      slug: "drywall-installation",
      name: "Drywall",
      difficulty: 3
    },
    {
      slug: "yard-maintenance",
      name: "Yard Care",
      difficulty: 1
    }
  ];
  const ecosystems = [
    {
      name: "Milwaukee",
      slug: "milwaukee-m18",
      color: "#db0032"
    },
    {
      name: "DeWalt",
      slug: "dewalt-20v-max",
      color: "#febd17"
    },
    {
      name: "Makita",
      slug: "makita-18v-lxt",
      color: "#00a4b3"
    },
    {
      name: "Ryobi",
      slug: "ryobi-one-plus",
      color: "#8dc73f"
    },
    {
      name: "EGO",
      slug: "ego-56v",
      color: "#00b140"
    },
    {
      name: "Bosch",
      slug: "bosch-18v",
      color: "#005daa"
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-nihspp_START -->${$$result.title = `<title>Lost in the Tool Pool — AI-Powered Tool Recommendations for DIY Projects</title>`, ""}<meta name="description" content="Tell us your project, we'll tell you exactly what tools you need. AI-powered recommendations, ecosystem comparisons, and the best deals."><!-- HEAD_svelte-nihspp_END -->`, ""}  <section class="relative min-h-[90vh] flex items-center overflow-hidden"><div class="absolute inset-0 bg-void"></div> <div class="absolute inset-0 section-grid opacity-60"></div> <div class="absolute inset-0" style="background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,107,53,0.04) 0%, transparent 100%)"></div>  <div class="absolute right-[8%] top-[20%] w-72 h-72 hidden lg:block animate-float opacity-30" data-svelte-h="svelte-159c7ho"><div class="relative w-full h-full"><div class="absolute inset-0" style="background: linear-gradient(135deg, #1e1e2e 0%, #0e0e14 40%, #1e1e2e 80%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); "></div> <div class="absolute inset-4" style="background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); "></div> <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full" style="background: linear-gradient(135deg, #08080c 0%, #12121a 50%, #08080c 100%); box-shadow: inset 0 2px 4px rgba(255,255,255,0.05);"></div></div></div>  <div class="absolute left-[5%] bottom-[15%] w-40 h-40 hidden lg:block animate-float opacity-20" style="animation-delay: -3s;" data-svelte-h="svelte-1hmjtm4"><div class="w-full h-full rounded-2xl rotate-12" style="background: linear-gradient(135deg, #181824 0%, #0e0e14 50%, #181824 100%); box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04); "></div></div> <div class="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 w-full"><div class="${[
    "max-w-3xl",
    "opacity-0 "
  ].join(" ").trim()}"><div class="flex items-center gap-3 mb-8" data-svelte-h="svelte-16x1njw"><div class="h-px w-12 bg-ember/60"></div> <span class="text-ember font-mono text-xs tracking-widest uppercase">AI-Powered Tool Advisor</span></div> <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-8" data-svelte-h="svelte-gp0gch">Tell us your project.
				<br> <span class="text-gradient">We&#39;ll tell you</span> <br> <span class="text-gradient">what tools you need.</span></h1> <p class="text-steel text-lg sm:text-xl max-w-xl mb-12 leading-relaxed font-light" data-svelte-h="svelte-10nxl05">Stop guessing. Stop overspending. Get personalized tool recommendations
				tailored to your project, budget, and skill level.</p> <div class="max-w-2xl mb-8">${validate_component(SearchBar, "SearchBar").$$render(
    $$result,
    {
      size: "large",
      placeholder: "Describe your project..."
    },
    {},
    {}
  )}</div> <div class="flex flex-wrap gap-2 max-w-2xl">${each(exampleQueries, (query) => {
    return `<button class="text-xs px-3.5 py-1.5 rounded-full border border-void-400/40 text-steel-dark hover:text-ember hover:border-ember/30 transition-all duration-300 font-body">${escape(query)} </button>`;
  })}</div></div></div> <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent"></div></section>  <section class="relative py-28 px-6 lg:px-8"><div class="max-w-7xl mx-auto"><div class="flex items-end justify-between mb-14" data-svelte-h="svelte-2mikzb"><div><span class="text-ember font-mono text-xs tracking-widest uppercase mb-3 block">Quick Start</span> <h2 class="text-3xl sm:text-4xl">Pick a project, get your toolkit</h2></div> <a href="/projects" class="hidden sm:flex items-center gap-2 text-steel text-sm hover:text-ember transition-colors font-body">All 20 projects
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></a></div> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger">${each(projects, (project) => {
    return `<a href="${"/projects/" + escape(project.slug, true)}" class="card group cursor-pointer opacity-0 animate-slide-up"><span class="font-display text-sm text-white/90 group-hover:text-ember transition-colors duration-300">${escape(project.name)}</span> <div class="flex items-center gap-1.5 mt-3">${each(Array(5), (_, i) => {
      return `<span class="${"w-1.5 h-1.5 rounded-full " + escape(i < project.difficulty ? "bg-ember/70" : "bg-void-400", true)}"></span>`;
    })}</div> </a>`;
  })}</div></div></section>  <section class="relative py-28 px-6 lg:px-8 section-glow"><div class="absolute inset-0 bg-void-50"></div> <div class="absolute inset-0 section-grid opacity-40"></div> <div class="relative max-w-7xl mx-auto"><div class="text-center mb-20" data-svelte-h="svelte-ptpk7v"><span class="text-ember font-mono text-xs tracking-widest uppercase mb-3 block">How It Works</span> <h2 class="text-3xl sm:text-4xl">Three steps to the right tools</h2></div> <div class="grid md:grid-cols-3 gap-8 lg:gap-12">${each(
    [
      {
        num: "01",
        title: "Describe Your Project",
        desc: "Tell us what you want to build in plain English. No jargon needed."
      },
      {
        num: "02",
        title: "Get Your Toolkit",
        desc: "We recommend exactly what you need. Skip what you own. Rent what you use once."
      },
      {
        num: "03",
        title: "Buy With Confidence",
        desc: "Compare prices across retailers. Pick the ecosystem that fits your life."
      }
    ],
    (step) => {
      return `<div class="card-glass text-center"><div class="w-14 h-14 mx-auto mb-6 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.02) 100%); border: 1px solid rgba(255,107,53,0.15);"><span class="text-ember font-mono text-sm font-semibold">${escape(step.num)}</span></div> <h3 class="text-lg mb-3">${escape(step.title)}</h3> <p class="text-steel text-sm leading-relaxed">${escape(step.desc)}</p> </div>`;
    }
  )}</div></div></section>  <section class="relative py-28 px-6 lg:px-8"><div class="max-w-7xl mx-auto"><div class="text-center mb-14" data-svelte-h="svelte-1tnn8jg"><span class="text-ember font-mono text-xs tracking-widest uppercase mb-3 block">Battery Platforms</span> <h2 class="text-3xl sm:text-4xl mb-4">Choose your ecosystem</h2> <p class="text-steel max-w-lg mx-auto text-sm leading-relaxed">Your first battery tool locks you into an ecosystem. We help you pick the right one.</p></div> <div class="flex flex-wrap justify-center gap-3">${each(ecosystems, (eco) => {
    return `<a href="${"/ecosystems/" + escape(eco.slug, true)}" class="group px-6 py-3 rounded-xl border border-void-400/40 hover:-translate-y-0.5 transition-all duration-300"><span class="font-display font-semibold text-sm text-white">${escape(eco.name)}</span> </a>`;
  })}</div> <div class="text-center mt-8" data-svelte-h="svelte-mqs966"><a href="/ecosystems" class="text-steel text-sm hover:text-ember transition-colors font-body">Compare all 34 ecosystems →</a></div></div></section>  <section class="relative py-16 px-6 lg:px-8"><div class="absolute inset-0 bg-void-50"></div> <div class="relative max-w-7xl mx-auto"><div class="grid grid-cols-2 sm:grid-cols-4 gap-8">${each(
    [
      { value: "1,039", label: "Tools Analyzed" },
      { value: "34", label: "Ecosystems" },
      { value: "24", label: "Brands" },
      { value: "$0", label: "Pay-to-Rank" }
    ],
    (stat) => {
      return `<div class="text-center"><span class="text-3xl sm:text-4xl font-display font-bold text-gradient">${escape(stat.value)}</span> <p class="text-steel-dark text-xs font-mono tracking-widest uppercase mt-2">${escape(stat.label)}</p> </div>`;
    }
  )}</div></div></section>  <section class="relative py-28 px-6 lg:px-8 overflow-hidden" data-svelte-h="svelte-1r3vp9p"><div class="absolute inset-0" style="background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,53,0.05) 0%, transparent 100%)"></div> <div class="relative max-w-2xl mx-auto text-center"><h2 class="text-3xl sm:text-4xl mb-6">Ready to stop guessing?</h2> <p class="text-steel text-lg mb-10 leading-relaxed">Describe your next project and get a personalized toolkit recommendation in seconds.</p> <a href="/advisor" class="btn-primary text-lg px-10 py-4">Try the Advisor</a></div></section>`;
});
export {
  Page as default
};
