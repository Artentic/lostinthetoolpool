import * as server from '../entries/pages/tools/_slug_/_page.server.ts.js';

export const index = 15;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tools/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/tools/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/15.DDfJtW7G.js","_app/immutable/chunks/DKrd6ziA.js","_app/immutable/chunks/Cq4za7Ty.js","_app/immutable/chunks/D6YF6ztN.js"];
export const stylesheets = [];
export const fonts = [];
