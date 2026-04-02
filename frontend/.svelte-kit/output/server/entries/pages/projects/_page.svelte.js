import { c as create_ssr_component, d as each, e as escape, v as validate_component } from "../../../chunks/ssr.js";
import { D as DifficultyBadge } from "../../../chunks/DifficultyBadge.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const projects = [
    {
      slug: "build-a-deck",
      name: "Build a Deck",
      difficulty: 3,
      time: "3-5 weekends",
      icon: "🪵",
      description: "Build a wood or composite deck"
    },
    {
      slug: "build-a-fence",
      name: "Build a Fence",
      difficulty: 2,
      time: "2-3 weekends",
      icon: "🏗️",
      description: "Install a privacy or picket fence"
    },
    {
      slug: "bathroom-renovation",
      name: "Bathroom Renovation",
      difficulty: 4,
      time: "4-8 weekends",
      icon: "🚿",
      description: "Full bathroom remodel"
    },
    {
      slug: "kitchen-renovation",
      name: "Kitchen Renovation",
      difficulty: 5,
      time: "8-16 weekends",
      icon: "🍳",
      description: "Full kitchen remodel"
    },
    {
      slug: "finish-a-basement",
      name: "Finish a Basement",
      difficulty: 4,
      time: "8-12 weekends",
      icon: "🏠",
      description: "Frame, insulate, drywall, finish"
    },
    {
      slug: "install-hardwood-flooring",
      name: "Install Flooring",
      difficulty: 3,
      time: "2-4 weekends",
      icon: "🪵",
      description: "Hardwood or laminate flooring"
    },
    {
      slug: "install-tile",
      name: "Install Tile",
      difficulty: 3,
      time: "2-4 weekends",
      icon: "🧱",
      description: "Ceramic or porcelain tile"
    },
    {
      slug: "build-raised-garden-beds",
      name: "Garden Beds",
      difficulty: 1,
      time: "1 weekend",
      icon: "🌱",
      description: "Simple raised garden beds"
    },
    {
      slug: "build-a-shed",
      name: "Build a Shed",
      difficulty: 3,
      time: "3-5 weekends",
      icon: "🏚️",
      description: "Small to medium storage shed"
    },
    {
      slug: "drywall-installation",
      name: "Drywall",
      difficulty: 3,
      time: "2-4 weekends",
      icon: "🧱",
      description: "Hang, tape, mud, and sand"
    },
    {
      slug: "paint-a-room",
      name: "Paint a Room",
      difficulty: 1,
      time: "1-2 days",
      icon: "🎨",
      description: "Prep and paint walls and trim"
    },
    {
      slug: "install-crown-molding",
      name: "Crown Molding",
      difficulty: 3,
      time: "1-2 weekends",
      icon: "📐",
      description: "Install crown molding or trim"
    },
    {
      slug: "basic-plumbing-repairs",
      name: "Plumbing Repairs",
      difficulty: 2,
      time: "1-4 hours",
      icon: "🔧",
      description: "Fix leaks, replace faucets"
    },
    {
      slug: "basic-electrical-work",
      name: "Electrical Work",
      difficulty: 3,
      time: "1-4 hours",
      icon: "⚡",
      description: "Replace outlets, switches, fixtures"
    },
    {
      slug: "hang-shelves-cabinets",
      name: "Hang Shelves",
      difficulty: 2,
      time: "2-4 hours",
      icon: "📦",
      description: "Mount shelves or wall cabinets"
    },
    {
      slug: "assemble-furniture",
      name: "Assemble Furniture",
      difficulty: 1,
      time: "1-3 hours",
      icon: "🪑",
      description: "Flat-pack or kit furniture"
    },
    {
      slug: "car-maintenance",
      name: "Car Maintenance",
      difficulty: 2,
      time: "1-4 hours",
      icon: "🚗",
      description: "Oil changes, brake pads, basics"
    },
    {
      slug: "yard-maintenance",
      name: "Yard Maintenance",
      difficulty: 1,
      time: "2-4 hrs/week",
      icon: "🌿",
      description: "Mowing, edging, trimming"
    },
    {
      slug: "tree-trimming",
      name: "Tree Trimming",
      difficulty: 4,
      time: "1-2 days",
      icon: "🌳",
      description: "Trim branches or remove trees"
    },
    {
      slug: "concrete-work",
      name: "Concrete Work",
      difficulty: 4,
      time: "2-4 weekends",
      icon: "🧱",
      description: "Small patio or walkway"
    }
  ];
  return `${$$result.head += `<!-- HEAD_svelte-1wxw9lg_START -->${$$result.title = `<title>DIY Projects — What Tools Do You Need? — Lost in the Tool Pool</title>`, ""}<meta name="description" content="Browse 20 common home improvement projects and see exactly what tools you need for each one. From painting a room to building a deck."><!-- HEAD_svelte-1wxw9lg_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-bqtqs"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Browse</span> <span class="text-safety-orange">Projects</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Pick a project and see exactly what tools you need, how long it&#39;ll take,
			and what it&#39;ll cost across different tool ecosystems.</p></div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">${each(projects, (project) => {
    return `<a href="${"/projects/" + escape(project.slug, true)}" class="card group hover:-translate-y-1 transition-all duration-300"><div class="flex items-start gap-3"><span class="text-3xl">${escape(project.icon)}</span> <div class="flex-1"><h3 class="font-heading text-sm text-gray-200 group-hover:text-safety-orange transition normal-case">${escape(project.name)}</h3> <p class="text-xs text-gray-500 font-body normal-case mt-1">${escape(project.description)}</p> <div class="mt-2 flex items-center justify-between">${validate_component(DifficultyBadge, "DifficultyBadge").$$render($$result, { level: project.difficulty }, {}, {})} <span class="text-xs text-gray-500">${escape(project.time)}</span></div> </div></div> </a>`;
  })}</div></div>`;
});
export {
  Page as default
};
