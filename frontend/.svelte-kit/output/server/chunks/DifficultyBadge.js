import { c as create_ssr_component, d as each, e as escape } from "./ssr.js";
import { D as DIFFICULTY_LABELS } from "./index.js";
const DifficultyBadge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { level } = $$props;
  let { showLabel = true } = $$props;
  const colors = [
    "",
    "bg-green-400",
    "bg-lime-400",
    "bg-yellow-400",
    "bg-orange-400",
    "bg-red-400"
  ];
  if ($$props.level === void 0 && $$bindings.level && level !== void 0) $$bindings.level(level);
  if ($$props.showLabel === void 0 && $$bindings.showLabel && showLabel !== void 0) $$bindings.showLabel(showLabel);
  return `<div class="flex items-center gap-1.5">${each(Array(5), (_, i) => {
    return `<span class="${"difficulty-dot " + escape(i < level ? colors[level] : "bg-gray-600", true)}"></span>`;
  })} ${showLabel ? `<span class="ml-1 text-xs text-gray-400 font-heading uppercase">${escape(DIFFICULTY_LABELS[level])}</span>` : ``}</div>`;
});
export {
  DifficultyBadge as D
};
