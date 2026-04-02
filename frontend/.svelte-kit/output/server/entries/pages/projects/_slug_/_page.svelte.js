import { c as create_ssr_component, b as subscribe, e as escape, v as validate_component, d as each } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import { D as DifficultyBadge } from "../../../../chunks/DifficultyBadge.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let slug;
  let project;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const projectData = {
    "build-a-deck": {
      name: "Build a Deck",
      difficulty: 3,
      time: "3-5 weekends",
      icon: "🪵",
      description: "Build a wood or composite deck attached to your house. One of the most rewarding DIY projects that adds real value to your home.",
      essential: [
        "Circular Saw",
        "Drill/Driver",
        "Impact Driver",
        "Speed Square",
        "Tape Measure",
        "Level (4ft)",
        "Chalk Line",
        "Post Hole Digger"
      ],
      recommended: ["Miter Saw", "Jigsaw", "Reciprocating Saw", "Clamps"],
      rentable: [
        "Post Hole Auger — $50/day, saves hours of digging",
        "Miter Saw — $45/day if you only need it for this project"
      ],
      budget_cost: "$350-500 (Ryobi ONE+)",
      pro_cost: "$600-900 (Milwaukee M18)",
      safety: ["Safety glasses", "Hearing protection", "Work gloves", "Dust mask"],
      mistakes: [
        "Not checking local building codes and permit requirements before starting",
        "Skipping the ledger board flashing — leads to water damage",
        "Using regular screws instead of structural screws for framing",
        "Not pre-drilling hardwood decking — causes splitting",
        'Setting posts too shallow — code usually requires 42" depth for frost line'
      ]
    }
  };
  let selectedEcosystem = "ryobi-one-plus";
  slug = $page.params.slug;
  project = projectData[slug] || {
    name: slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    difficulty: 3,
    time: "Varies",
    icon: "🔧",
    description: "Project details loading...",
    essential: [],
    recommended: [],
    rentable: [],
    budget_cost: "TBD",
    pro_cost: "TBD",
    safety: [],
    mistakes: []
  };
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1xgkb4k_START -->${$$result.title = `<title>What Tools Do You Need to ${escape(project.name)}? — Lost in the Tool Pool</title>`, ""}<meta name="description" content="${"Complete tool list for " + escape(project.name, true) + ". Essential tools, nice-to-haves, rental options, and cost breakdown across battery ecosystems."}"><!-- HEAD_svelte-1xgkb4k_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-8" data-svelte-h="svelte-7ls23x"><a href="/projects" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">← All Projects</a></div> <div class="flex items-start gap-4 mb-8"><span class="text-5xl">${escape(project.icon)}</span> <div><h1 class="text-3xl sm:text-4xl text-white">${escape(project.name)}</h1> <p class="text-gray-400 font-body normal-case mt-2">${escape(project.description)}</p> <div class="flex items-center gap-6 mt-3">${validate_component(DifficultyBadge, "DifficultyBadge").$$render($$result, { level: project.difficulty }, {}, {})} <span class="text-sm text-gray-400">⏱ ${escape(project.time)}</span></div></div></div>  <div class="card mb-6"><h2 class="text-lg text-safety-orange mb-3" data-svelte-h="svelte-bsm4dm">Choose Your Ecosystem</h2> <div class="flex flex-wrap gap-2">${each(
    [
      {
        slug: "ryobi-one-plus",
        name: "Ryobi ONE+",
        color: "bg-ryobi text-black",
        cost: project.budget_cost
      },
      {
        slug: "milwaukee-m18",
        name: "Milwaukee M18",
        color: "bg-milwaukee text-white",
        cost: project.pro_cost
      },
      {
        slug: "dewalt-20v-max",
        name: "DeWalt 20V",
        color: "bg-dewalt text-black",
        cost: project.pro_cost
      },
      {
        slug: "makita-18v-lxt",
        name: "Makita 18V",
        color: "bg-makita text-white",
        cost: project.pro_cost
      }
    ],
    (eco) => {
      return `<button class="${"ecosystem-badge " + escape(
        selectedEcosystem === eco.slug ? eco.color : "bg-gray-700 text-gray-300",
        true
      ) + " cursor-pointer transition"}">${escape(eco.name)} </button>`;
    }
  )}</div> <p class="mt-3 text-sm text-gray-400 font-body normal-case">Estimated tool cost: <span class="text-safety-orange font-bold">${escape(selectedEcosystem.includes("ryobi") ? project.budget_cost : project.pro_cost)}</span></p></div>  ${project.essential.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-safety-orange mb-3" data-svelte-h="svelte-13qb2tf">Essential Tools</h2> <p class="text-xs text-gray-500 mb-4 font-body normal-case" data-svelte-h="svelte-pw2ylk">You literally cannot do this project without these.</p> <ul class="space-y-2">${each(project.essential, (tool) => {
    return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-safety-orange flex-shrink-0"></span> ${escape(tool)} </li>`;
  })}</ul></div>` : ``}  ${project.recommended.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-electric-blue mb-3" data-svelte-h="svelte-ltsk00">Recommended</h2> <p class="text-xs text-gray-500 mb-4 font-body normal-case" data-svelte-h="svelte-13q3sxt">These make the job significantly easier and faster.</p> <ul class="space-y-2">${each(project.recommended, (tool) => {
    return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-electric-blue flex-shrink-0"></span> ${escape(tool)} </li>`;
  })}</ul></div>` : ``}  ${project.rentable.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-yellow-400 mb-3" data-svelte-h="svelte-1fsuy46">Consider Renting</h2> <ul class="space-y-2">${each(project.rentable, (item) => {
    return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5"></span> ${escape(item)} </li>`;
  })}</ul></div>` : ``}  ${project.safety.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-red-400 mb-3" data-svelte-h="svelte-1sspzyb">Safety Equipment</h2> <div class="flex flex-wrap gap-2">${each(project.safety, (item) => {
    return `<span class="px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-body normal-case">${escape(item)} </span>`;
  })}</div></div>` : ``}  ${project.mistakes.length > 0 ? `<div class="card"><h2 class="text-lg text-yellow-400 mb-3" data-svelte-h="svelte-r563va">Common Beginner Mistakes</h2> <ul class="space-y-3">${each(project.mistakes, (mistake) => {
    return `<li class="flex items-start gap-3 text-gray-400 font-body normal-case text-sm"><span class="text-yellow-400 flex-shrink-0" data-svelte-h="svelte-1idmo4s">⚠</span> ${escape(mistake)} </li>`;
  })}</ul></div>` : ``}</div>`;
});
export {
  Page as default
};
