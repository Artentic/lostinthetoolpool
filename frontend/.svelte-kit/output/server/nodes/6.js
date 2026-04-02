import * as server from '../entries/pages/ecosystems/_slug_/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/ecosystems/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/ecosystems/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.CcNkyYQg.js","_app/immutable/chunks/DKrd6ziA.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/Cq4za7Ty.js","_app/immutable/chunks/i7wgsyJU.js","_app/immutable/chunks/C6T1Hsz6.js"];
export const stylesheets = [];
export const fonts = [];
