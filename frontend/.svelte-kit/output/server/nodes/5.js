import * as server from '../entries/pages/ecosystems/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/ecosystems/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/ecosystems/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BR2Six7A.js","_app/immutable/chunks/DKrd6ziA.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/Cq4za7Ty.js"];
export const stylesheets = [];
export const fonts = [];
