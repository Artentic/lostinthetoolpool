import { c as create_ssr_component, b as subscribe, e as escape, v as validate_component } from "../../../chunks/ssr.js";
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
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-16qcmdo_START -->${$$result.title = `<title>${escape(query ? `"${query}" — Search Results` : "Search Tools")} — Lost in the Tool Pool</title>`, ""}<!-- HEAD_svelte-16qcmdo_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="flex justify-center mb-8">${validate_component(SearchBar, "SearchBar").$$render(
      $$result,
      {
        placeholder: "Search tools, brands, or categories...",
        value: query
      },
      {
        value: ($$value) => {
          query = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${`${`${`<div class="text-center py-12" data-svelte-h="svelte-1q7izpr"><p class="text-gray-500 font-body normal-case">Enter a search term to find tools.</p></div>`}`}`}</div>`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};
