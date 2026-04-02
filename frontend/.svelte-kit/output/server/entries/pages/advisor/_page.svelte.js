import { c as create_ssr_component, b as subscribe, v as validate_component, d as each, e as escape } from "../../../chunks/ssr.js";
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
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1xlo0gx_START -->${$$result.title = `<title>Project Advisor — Lost in the Tool Pool</title>`, ""}<meta name="description" content="Describe your DIY project and get AI-powered tool recommendations. Personalized toolkit suggestions based on your project, budget, and skill level."><!-- HEAD_svelte-1xlo0gx_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-tctnwk"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Project</span> <span class="text-safety-orange">Advisor</span></h1> <p class="text-gray-400 font-body normal-case">Describe your project in plain English. Our AI figures out exactly what tools you need.</p></div> <div class="flex justify-center mb-8">${validate_component(SearchBar, "SearchBar").$$render(
      $$result,
      {
        size: "large",
        placeholder: "I want to build a 12x16 deck on a budget...",
        value: query
      },
      {
        value: ($$value) => {
          query = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${`${``}`}  ${`<div class="mt-8"><h2 class="text-sm text-gray-500 font-heading uppercase tracking-wider text-center mb-4" data-svelte-h="svelte-hetvse">Try asking...</h2> <div class="grid sm:grid-cols-2 gap-3">${each(
      [
        "I want to build a 12x16 deck on a budget",
        "What's the minimum toolkit for a bathroom reno?",
        "Milwaukee vs DeWalt for a serious DIYer?",
        "Best starter kit under $500 for a new homeowner",
        "I need to cut a hole in drywall for a new outlet",
        "What do I need to refinish hardwood floors?"
      ],
      (example) => {
        return `<button class="card text-left text-sm text-gray-400 hover:text-safety-orange cursor-pointer font-body normal-case">&quot;${escape(example)}&quot;
					</button>`;
      }
    )}</div></div>`}</div>`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};
