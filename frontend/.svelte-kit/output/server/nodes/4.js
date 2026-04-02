

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/compare/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.Bj9CtVmE.js","_app/immutable/chunks/DKrd6ziA.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/Cq4za7Ty.js"];
export const stylesheets = [];
export const fonts = [];
