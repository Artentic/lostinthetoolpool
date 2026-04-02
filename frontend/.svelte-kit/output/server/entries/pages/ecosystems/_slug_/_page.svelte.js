import { c as create_ssr_component, b as subscribe, e as escape, d as each } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let slug;
  let tools;
  let ecoName;
  let byCategory;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  slug = $page.params.slug;
  tools = data.tools || [];
  ecoName = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  byCategory = tools.reduce(
    (acc, t) => {
      const cat = t.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(t);
      return acc;
    },
    {}
  );
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-jtzmr8_START -->${$$result.title = `<title>${escape(ecoName)} — ${escape(tools.length)} Tools — Lost in the Tool Pool</title>`, ""}<!-- HEAD_svelte-jtzmr8_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-6" data-svelte-h="svelte-14bwacf"><a href="/ecosystems" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">← All Ecosystems</a></div> <h1 class="text-3xl sm:text-4xl text-white mb-2">${escape(ecoName)}</h1> <p class="text-gray-400 font-body normal-case mb-8">${escape(tools.length)} tools in this ecosystem</p> ${each(Object.entries(byCategory), ([category, catTools]) => {
    return `<div class="mb-8"><h2 class="text-lg text-safety-orange mb-4 font-heading uppercase">${escape(category.replace(/-/g, " "))}</h2> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">${each(catTools, (tool) => {
      return `<a href="${"/tools/" + escape(tool.slug, true)}" class="card group hover:-translate-y-0.5 transition-all"><h3 class="font-body text-sm text-gray-200 group-hover:text-safety-orange transition normal-case leading-tight">${escape(tool.name)}</h3> <div class="flex items-end justify-between mt-3"><span class="text-xl font-heading font-bold text-safety-orange">${tool.price_current > 0 ? `$${escape(tool.price_current)}` : `TBD`}</span> ${tool.rating > 0 ? `<span class="text-xs text-gray-500 flex items-center gap-1"><svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${escape(tool.rating)} </span>` : ``}</div> ${tool.subcategory ? `<span class="text-[10px] text-gray-600 font-heading uppercase mt-1 block">${escape(tool.subcategory.replace(/-/g, " "))}</span>` : ``} </a>`;
    })}</div> </div>`;
  })}</div>`;
});
export {
  Page as default
};
