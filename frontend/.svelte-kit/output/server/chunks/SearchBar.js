import { c as create_ssr_component, f as createEventDispatcher, e as escape, g as add_attribute } from "./ssr.js";
const SearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = "" } = $$props;
  let { placeholder = "Describe your project or search for a tool..." } = $$props;
  let { size = "normal" } = $$props;
  createEventDispatcher();
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0) $$bindings.placeholder(placeholder);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  return `<div class="${"relative " + escape(size === "large" ? "max-w-3xl" : "max-w-xl", true) + " w-full"}"><input type="text"${add_attribute("placeholder", placeholder, 0)} class="${"input-search " + escape(
    size === "large" ? "text-xl py-5 pr-16" : "text-base py-3 pr-14",
    true
  )}"${add_attribute("value", value, 0)}> <button class="${"absolute right-3 top-1/2 -translate-y-1/2 bg-safety-orange hover:bg-safety-orange-light text-white rounded-lg " + escape(size === "large" ? "p-3" : "p-2", true) + " transition-colors"}" aria-label="Search"><svg${add_attribute("class", size === "large" ? "w-6 h-6" : "w-5 h-5", 0)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></div>`;
});
export {
  SearchBar as S
};
