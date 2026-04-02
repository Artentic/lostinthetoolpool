import { c as create_ssr_component, b as subscribe, e as escape, v as validate_component, d as each } from "../../../chunks/ssr.js";
import { p as page } from "../../../chunks/stores.js";
import { S as SearchBar } from "../../../chunks/SearchBar.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let query = $page.url.searchParams.get("q") || "";
  let results = [];
  let total = 0;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1bmy5ss_START -->${$$result.title = `<title>${escape(query ? `"${query}" — ${total} results` : "Search Tools")} — Lost in the Tool Pool</title>`, ""}<!-- HEAD_svelte-1bmy5ss_END -->`, ""} <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="flex justify-center mb-8">${validate_component(SearchBar, "SearchBar").$$render(
      $$result,
      {
        placeholder: "Search 1,000+ tools by name, brand, or category...",
        value: query
      },
      {
        value: ($$value) => {
          query = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${``} ${`${results.length > 0 ? `<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">${each(results, (product) => {
      return `<a href="${"/tools/" + escape(product.slug, true)}" class="card group hover:-translate-y-0.5 transition-all"><span class="text-[10px] text-gray-600 font-heading uppercase">${escape(product.brand)} / ${escape(product.ecosystem)}</span> <h3 class="font-body text-sm text-gray-200 group-hover:text-safety-orange transition normal-case leading-tight mt-1">${escape(product.name)}</h3> <div class="flex items-end justify-between mt-3"><span class="text-xl font-heading font-bold text-safety-orange">${product.price_current > 0 ? `$${escape(product.price_current)}` : `TBD`}</span> ${product.rating > 0 ? `<span class="text-xs text-gray-500 flex items-center gap-1"><svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${escape(product.rating)} </span>` : ``}</div> </a>`;
    })}</div>` : `${``}`}`}</div>`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};
