

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/legal/privacy/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.DwdppfgJ.js","_app/immutable/chunks/DKrd6ziA.js","_app/immutable/chunks/Cq4za7Ty.js"];
export const stylesheets = [];
export const fonts = [];
