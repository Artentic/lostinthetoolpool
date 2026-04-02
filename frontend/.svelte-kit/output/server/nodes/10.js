

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/legal/privacy/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.Bv5-OObi.js","_app/immutable/chunks/tkWzf5gq.js","_app/immutable/chunks/6Jn0Uoq0.js"];
export const stylesheets = [];
export const fonts = [];
