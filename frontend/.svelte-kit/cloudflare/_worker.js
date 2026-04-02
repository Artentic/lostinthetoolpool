var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key2) && key2 !== except)
        __defProp(to2, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@sveltejs/kit/src/exports/internal/remote-functions.js
var init_remote_functions = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/remote-functions.js"() {
  }
});

// node_modules/@sveltejs/kit/src/exports/internal/index.js
var HttpError, Redirect, SvelteKitError, ActionFailure;
var init_internal = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/index.js"() {
    init_remote_functions();
    HttpError = class {
      /**
       * @param {number} status
       * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
       */
      constructor(status, body2) {
        this.status = status;
        if (typeof body2 === "string") {
          this.body = { message: body2 };
        } else if (body2) {
          this.body = body2;
        } else {
          this.body = { message: `Error: ${status}` };
        }
      }
      toString() {
        return JSON.stringify(this.body);
      }
    };
    Redirect = class {
      /**
       * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
       * @param {string} location
       */
      constructor(status, location2) {
        this.status = status;
        this.location = location2;
      }
    };
    SvelteKitError = class extends Error {
      /**
       * @param {number} status
       * @param {string} text
       * @param {string} message
       */
      constructor(status, text2, message) {
        super(message);
        this.status = status;
        this.text = text2;
      }
    };
    ActionFailure = class {
      /**
       * @param {number} status
       * @param {T} data
       */
      constructor(status, data) {
        this.status = status;
        this.data = data;
      }
    };
  }
});

// node_modules/@sveltejs/kit/src/runtime/server/constants.js
var IN_WEBCONTAINER;
var init_constants = __esm({
  "node_modules/@sveltejs/kit/src/runtime/server/constants.js"() {
    IN_WEBCONTAINER = !!globalThis.process?.versions?.webcontainer;
  }
});

// node_modules/@sveltejs/kit/src/exports/internal/event.js
function with_request_store(store, fn2) {
  try {
    sync_store = store;
    return als ? als.run(store, fn2) : fn2();
  } finally {
    if (!IN_WEBCONTAINER) {
      sync_store = null;
    }
  }
}
var sync_store, als;
var init_event = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/event.js"() {
    init_constants();
    sync_store = null;
    import("node:async_hooks").then((hooks) => als = new hooks.AsyncLocalStorage()).catch(() => {
    });
  }
});

// node_modules/@sveltejs/kit/src/exports/internal/server.js
function merge_tracing(event_like, current2) {
  return {
    ...event_like,
    tracing: {
      ...event_like.tracing,
      current: current2
    }
  };
}
var init_server = __esm({
  "node_modules/@sveltejs/kit/src/exports/internal/server.js"() {
    init_event();
  }
});

// .svelte-kit/output/server/chunks/utils.js
function get_relative_path(from, to2) {
  const from_parts = from.split(/[/\\]/);
  const to_parts = to2.split(/[/\\]/);
  from_parts.pop();
  while (from_parts[0] === to_parts[0]) {
    from_parts.shift();
    to_parts.shift();
  }
  let i2 = from_parts.length;
  while (i2--) from_parts[i2] = "..";
  return from_parts.concat(to_parts).join("/");
}
function base64_encode(bytes) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i2 = 0; i2 < bytes.length; i2++) {
    binary += String.fromCharCode(bytes[i2]);
  }
  return btoa(binary);
}
function base64_decode(encoded) {
  if (globalThis.Buffer) {
    const buffer = globalThis.Buffer.from(encoded, "base64");
    return new Uint8Array(buffer);
  }
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i2 = 0; i2 < binary.length; i2++) {
    bytes[i2] = binary.charCodeAt(i2);
  }
  return bytes;
}
var text_encoder2, text_decoder2;
var init_utils = __esm({
  ".svelte-kit/output/server/chunks/utils.js"() {
    text_encoder2 = new TextEncoder();
    text_decoder2 = new TextDecoder();
  }
});

// .svelte-kit/output/server/chunks/exports.js
function resolve(base2, path) {
  if (path[0] === "/" && path[1] === "/") return path;
  let url = new URL(base2, internal);
  url = new URL(path, url);
  return url.protocol === internal.protocol ? url.pathname + url.search + url.hash : url.href;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore") return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
function make_trackable(url, callback, search_params_callback, allow_hash = false) {
  const tracked = new URL(url);
  Object.defineProperty(tracked, "searchParams", {
    value: new Proxy(tracked.searchParams, {
      get(obj, key2) {
        if (key2 === "get" || key2 === "getAll" || key2 === "has") {
          return (param, ...rest) => {
            search_params_callback(param);
            return obj[key2](param, ...rest);
          };
        }
        callback();
        const value = Reflect.get(obj, key2);
        return typeof value === "function" ? value.bind(obj) : value;
      }
    }),
    enumerable: true,
    configurable: true
  });
  const tracked_url_properties = ["href", "pathname", "search", "toString", "toJSON"];
  if (allow_hash) tracked_url_properties.push("hash");
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
    tracked.searchParams[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url.searchParams, opts);
    };
  }
  if (!allow_hash) {
    disable_hash(tracked);
  }
  return tracked;
}
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `page.url.hash` inside a component instead"
      );
    }
  });
}
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
function validator(expected) {
  function validate(module, file) {
    if (!module) return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2)) continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  return validate;
}
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
var internal, valid_layout_exports, valid_page_exports, valid_layout_server_exports, valid_page_server_exports, valid_server_exports, validate_layout_exports, validate_page_exports, validate_layout_server_exports, validate_page_server_exports, validate_server_exports;
var init_exports = __esm({
  ".svelte-kit/output/server/chunks/exports.js"() {
    internal = new URL("sveltekit-internal://");
    valid_layout_exports = /* @__PURE__ */ new Set([
      "load",
      "prerender",
      "csr",
      "ssr",
      "trailingSlash",
      "config"
    ]);
    valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
    valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
    valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
    valid_server_exports = /* @__PURE__ */ new Set([
      "GET",
      "POST",
      "PATCH",
      "PUT",
      "DELETE",
      "OPTIONS",
      "HEAD",
      "fallback",
      "prerender",
      "trailingSlash",
      "config",
      "entries"
    ]);
    validate_layout_exports = validator(valid_layout_exports);
    validate_page_exports = validator(valid_page_exports);
    validate_layout_server_exports = validator(valid_layout_server_exports);
    validate_page_server_exports = validator(valid_page_server_exports);
    validate_server_exports = validator(valid_server_exports);
  }
});

// .svelte-kit/output/server/chunks/ssr.js
function noop() {
}
function run(fn2) {
  return fn2();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a2, b2) {
  return a2 != a2 ? b2 == b2 : a2 !== b2 || a2 && typeof a2 === "object" || typeof a2 === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function set_current_component(component17) {
  current_component = component17;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component17 = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component17.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn2) => {
        fn2.call(component17, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function escape(value, is_attr = false) {
  const str = String(value);
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped2 = "";
  let last = 0;
  while (pattern2.test(str)) {
    const i2 = pattern2.lastIndex - 1;
    const ch = str[i2];
    escaped2 += str.substring(last, i2) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i2 + 1;
  }
  return escaped2 + str.substring(last);
}
function each(items, fn2) {
  items = ensure_array_like(items);
  let str = "";
  for (let i2 = 0; i2 < items.length; i2 += 1) {
    str += fn2(items[i2], i2);
  }
  return str;
}
function validate_component(component17, name) {
  if (!component17 || !component17.$$render) {
    if (name === "svelte:component") name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component17;
}
function create_ssr_component(fn2) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn2(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css) => css.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean) return "";
  const assignment = `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
var current_component, ATTR_REGEX, CONTENT_REGEX, missing_component, on_destroy;
var init_ssr = __esm({
  ".svelte-kit/output/server/chunks/ssr.js"() {
    ATTR_REGEX = /[&"<]/g;
    CONTENT_REGEX = /[&<]/g;
    missing_component = {
      $$render: () => ""
    };
  }
});

// .svelte-kit/output/server/chunks/ssr2.js
function onMount() {
}
function afterUpdate() {
}
var init_ssr2 = __esm({
  ".svelte-kit/output/server/chunks/ssr2.js"() {
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse3;
    exports.serialize = serialize2;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse3(str, options2) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options2 || {};
      var dec = opt.decode || decode;
      var index17 = 0;
      while (index17 < str.length) {
        var eqIdx = str.indexOf("=", index17);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index17);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index17 = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str.slice(index17, eqIdx).trim();
        if (void 0 === obj[key2]) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index17 = endIdx + 1;
      }
      return obj;
    }
    function serialize2(name, val, options2) {
      var opt = options2 || {};
      var enc = opt.encode || encode2;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.partitioned) {
        str += "; Partitioned";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode2(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e3) {
        return str;
      }
    }
  }
});

// .svelte-kit/output/server/chunks/state.svelte.js
var is_legacy, placeholder_url;
var init_state_svelte = __esm({
  ".svelte-kit/output/server/chunks/state.svelte.js"() {
    init_ssr2();
    init_exports();
    init_server();
    is_legacy = onMount.toString().includes("$$") || /function \w+\(\) \{\}/.test(onMount.toString());
    placeholder_url = "a:";
    if (is_legacy) {
      ({
        data: {},
        form: null,
        error: null,
        params: {},
        route: { id: null },
        state: {},
        status: -1,
        url: new URL(placeholder_url)
      });
    }
  }
});

// .svelte-kit/output/server/chunks/stores.js
var getStores, page;
var init_stores = __esm({
  ".svelte-kit/output/server/chunks/stores.js"() {
    init_ssr();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        /** @type {typeof page} */
        page: {
          subscribe: stores.page.subscribe
        },
        /** @type {typeof navigating} */
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        /** @type {typeof updated} */
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn2) {
        const store = getStores().page;
        return store.subscribe(fn2);
      }
    };
  }
});

// node_modules/posthog-js/dist/module.js
function c(t3, i2, e3, r3, s4, n3, o3) {
  try {
    var a2 = t3[n3](o3), l2 = a2.value;
  } catch (t4) {
    return void e3(t4);
  }
  a2.done ? i2(l2) : Promise.resolve(l2).then(r3, s4);
}
function f(t3) {
  return function() {
    var i2 = this, e3 = arguments;
    return new Promise(function(r3, s4) {
      var n3 = t3.apply(i2, e3);
      function o3(t4) {
        c(n3, r3, s4, o3, a2, "next", t4);
      }
      function a2(t4) {
        c(n3, r3, s4, o3, a2, "throw", t4);
      }
      o3(void 0);
    });
  };
}
function p() {
  return p = Object.assign ? Object.assign.bind() : function(t3) {
    for (var i2 = 1; arguments.length > i2; i2++) {
      var e3 = arguments[i2];
      for (var r3 in e3) ({}).hasOwnProperty.call(e3, r3) && (t3[r3] = e3[r3]);
    }
    return t3;
  }, p.apply(null, arguments);
}
function _(t3, i2) {
  if (null == t3) return {};
  var e3 = {};
  for (var r3 in t3) if ({}.hasOwnProperty.call(t3, r3)) {
    if (-1 !== i2.indexOf(r3)) continue;
    e3[r3] = t3[r3];
  }
  return e3;
}
function g() {
  return (g = f(function* (t3, i2) {
    void 0 === i2 && (i2 = true);
    try {
      var e3 = new Blob([t3], { type: "text/plain" }).stream().pipeThrough(new CompressionStream("gzip"));
      return yield new Response(e3).blob();
    } catch (t4) {
      return i2 && console.error("Failed to gzip compress data", t4), null;
    }
  })).apply(this, arguments);
}
function w(t3, i2) {
  return -1 !== t3.indexOf(i2);
}
function B(t3) {
  return null === t3 || "object" != typeof t3;
}
function H(t3, i2) {
  return {}.toString.call(t3) === "[object " + i2 + "]";
}
function q(t3) {
  return "undefined" != typeof Event && function(t4, i2) {
    try {
      return t4 instanceof i2;
    } catch (t5) {
      return false;
    }
  }(t3, Event);
}
function G(t3, i2, e3, r3, s4) {
  return i2 > e3 && (r3.warn("min cannot be greater than max."), i2 = e3), L(t3) ? t3 > e3 ? (r3.warn(" cannot be  greater than max: " + e3 + ". Using max value instead."), e3) : i2 > t3 ? (r3.warn(" cannot be less than min: " + i2 + ". Using min value instead."), i2) : t3 : (r3.warn(" must be a number. using max or fallback. max: " + e3 + ", fallback: " + s4), G(s4 || e3, i2, e3, r3));
}
function Jt(t3) {
  var i2 = globalThis._posthogChunkIds;
  if (i2) {
    var e3 = Object.keys(i2);
    return Q && e3.length === X || (X = e3.length, Q = e3.reduce((e4, r3) => {
      K || (K = {});
      var s4 = K[r3];
      if (s4) e4[s4[0]] = s4[1];
      else for (var n3 = t3(r3), o3 = n3.length - 1; o3 >= 0; o3--) {
        var a2 = n3[o3], l2 = null == a2 ? void 0 : a2.filename, u2 = i2[r3];
        if (l2 && u2) {
          e4[l2] = u2, K[r3] = [l2, u2];
          break;
        }
      }
      return e4;
    }, {})), Q;
  }
}
function Qt(t3, i2, e3, r3, s4) {
  var n3 = { platform: t3, filename: i2, function: "<anonymous>" === e3 ? Xt : e3, in_app: true };
  return C(r3) || (n3.lineno = r3), C(s4) || (n3.colno = s4), n3;
}
function fi(t3, i2) {
  void 0 === i2 && (i2 = 40);
  var e3 = Object.keys(t3);
  if (e3.sort(), !e3.length) return "[object has no keys]";
  for (var r3 = e3.length; r3 > 0; r3--) {
    var s4 = e3.slice(0, r3).join(", ");
    if (i2 >= s4.length) return r3 === e3.length ? s4 : s4.length > i2 ? s4.slice(0, i2) + "..." : s4;
  }
  return "";
}
function me(t3, i2) {
  R(t3) && t3.forEach(i2);
}
function be(t3, i2) {
  if (!D(t3)) if (R(t3)) t3.forEach(i2);
  else if (j(t3)) t3.forEach((t4, e4) => i2(t4, e4));
  else for (var e3 in t3) T.call(t3, e3) && i2(t3[e3], e3);
}
function we(t3) {
  for (var i2 = Object.keys(t3), e3 = i2.length, r3 = new Array(e3); e3--; ) r3[e3] = [i2[e3], t3[i2[e3]]];
  return r3;
}
function $e(t3) {
  var i2 = null == t3 ? void 0 : t3.hostname;
  if (!F(i2)) return false;
  var e3 = i2.split(".").slice(-2).join(".");
  for (var r3 of Te) if (e3 === r3) return false;
  return true;
}
function ke(t3, i2, e3, r3) {
  var { capture: s4 = false, passive: n3 = true } = null != r3 ? r3 : {};
  null == t3 || t3.addEventListener(i2, e3, { capture: s4, passive: n3 });
}
function Re(t3) {
  return "ph_toolbar_internal" === t3.name;
}
function Ze(t3, i2) {
  var { organization: e3, projectId: r3, prefix: s4, severityAllowList: n3 = ["error"], sendExceptionsToPostHog: o3 = true } = void 0 === i2 ? {} : i2;
  return (i3) => {
    var a2, l2, u2, h2, d2;
    if ("*" !== n3 && !n3.includes(i3.level) || !t3.__loaded) return i3;
    i3.tags || (i3.tags = {});
    var v2 = t3.requestRouter.endpointFor("ui", "/project/" + t3.config.token + "/person/" + t3.get_distinct_id());
    i3.tags["PostHog Person URL"] = v2, t3.sessionRecordingStarted() && (i3.tags["PostHog Recording URL"] = t3.get_session_replay_url({ withTimestamp: true }));
    var c3, f2 = (null == (a2 = i3.exception) ? void 0 : a2.values) || [], _2 = f2.map((t4) => p({}, t4, { stacktrace: t4.stacktrace ? p({}, t4.stacktrace, { type: "raw", frames: (t4.stacktrace.frames || []).map((t5) => p({}, t5, { platform: "web:javascript" })) }) : void 0 })), g2 = { $exception_message: (null == (l2 = f2[0]) ? void 0 : l2.value) || i3.message, $exception_type: null == (u2 = f2[0]) ? void 0 : u2.type, $exception_level: i3.level, $exception_list: _2, $sentry_event_id: i3.event_id, $sentry_exception: i3.exception, $sentry_exception_message: (null == (h2 = f2[0]) ? void 0 : h2.value) || i3.message, $sentry_exception_type: null == (d2 = f2[0]) ? void 0 : d2.type, $sentry_tags: i3.tags };
    return e3 && r3 && (g2.$sentry_url = (s4 || "https://sentry.io/organizations/") + e3 + "/issues/?project=" + r3 + "&query=" + i3.event_id), o3 && (null == (c3 = t3.exceptions) || c3.sendExceptionEvent(g2)), i3;
  };
}
function dr(t3, i2, e3) {
  if (!r) return {};
  var s4, n3 = i2 ? [...ar, ...e3 || []] : [], o3 = vr(sr(r.URL, n3, ur), t3), a2 = (s4 = {}, be(hr, function(t4) {
    var i3 = Ue.Wt(t4);
    s4[t4] = i3 || null;
  }), s4);
  return ye(a2, o3);
}
function vr(t3, i2) {
  var e3 = lr.concat(i2 || []), r3 = {};
  return be(e3, function(i3) {
    var e4 = rr(t3, i3);
    r3[i3] = e4 || null;
  }), r3;
}
function cr(t3) {
  var i2 = function(t4) {
    return t4 ? 0 === t4.search(or + "google.([^/?]*)") ? "google" : 0 === t4.search(or + "bing.com") ? "bing" : 0 === t4.search(or + "yahoo.com") ? "yahoo" : 0 === t4.search(or + "duckduckgo.com") ? "duckduckgo" : null : null;
  }(t3), e3 = "yahoo" != i2 ? "q" : "p", s4 = {};
  if (!M(i2)) {
    s4.$search_engine = i2;
    var n3 = r ? rr(r.referrer, e3) : "";
    n3.length && (s4.ph_keyword = n3);
  }
  return s4;
}
function fr() {
  return navigator.language || navigator.userLanguage;
}
function _r() {
  return (null == r ? void 0 : r.referrer) || pr;
}
function gr(t3, i2) {
  var e3 = t3 ? [...ar, ...i2 || []] : [], r3 = null == s2 ? void 0 : s2.href.substring(0, 1e3);
  return { r: _r().substring(0, 1e3), u: r3 ? sr(r3, e3, ur) : void 0 };
}
function mr(t3) {
  var i2, { r: e3, u: r3 } = t3, s4 = { $referrer: e3, $referring_domain: null == e3 ? void 0 : e3 == pr ? pr : null == (i2 = er(e3)) ? void 0 : i2.host };
  if (r3) {
    s4.$current_url = r3;
    var n3 = er(r3);
    s4.$host = null == n3 ? void 0 : n3.host, s4.$pathname = null == n3 ? void 0 : n3.pathname;
    var o3 = vr(r3);
    ye(s4, o3);
  }
  if (e3) {
    var a2 = cr(e3);
    ye(s4, a2);
  }
  return s4;
}
function br() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (t3) {
    return;
  }
}
function yr() {
  try {
    return (/* @__PURE__ */ new Date()).getTimezoneOffset();
  } catch (t3) {
    return;
  }
}
function ys(t3, i2) {
  void 0 === i2 && (i2 = {});
  var e3 = /* @__PURE__ */ function() {
    var t4 = 4294967295;
    return { p(i3) {
      for (var e4 = t4, r4 = 0; i3.length > r4; ++r4) e4 = ms[255 & e4 ^ i3[r4]] ^ e4 >>> 8;
      t4 = e4;
    }, d() {
      return 4294967295 ^ t4;
    } };
  }(), r3 = t3.length;
  e3.p(t3);
  var s4, n3, o3, a2, l2, u2 = (a2 = 10 + ((s4 = i2).filename && s4.filename.length + 1 || 0), l2 = 8, function(t4, i3, e4, r4, s5, n4) {
    var o4 = t4.length, a3 = new Hr(r4 + o4 + 5 * (1 + Math.floor(o4 / 7e3)) + s5), l3 = a3.subarray(r4, a3.length - s5), u3 = 0;
    if (!i3 || 8 > o4) for (var h3 = 0; o4 >= h3; h3 += 65535) {
      var d2 = h3 + 65535;
      o4 > d2 ? u3 = ps(l3, u3, t4.subarray(h3, d2)) : (l3[h3] = true, u3 = ps(l3, u3, t4.subarray(h3, o4)));
    }
    else {
      for (var v2 = gs[i3 - 1], c3 = v2 >>> 13, f2 = 8191 & v2, p2 = (1 << e4) - 1, _2 = new qr(32768), g2 = new qr(p2 + 1), m2 = Math.ceil(e4 / 3), b2 = 2 * m2, y2 = function(i4) {
        return (t4[i4] ^ t4[i4 + 1] << m2 ^ t4[i4 + 2] << b2) & p2;
      }, w2 = new Wr(25e3), E2 = new qr(288), S2 = new qr(32), x2 = 0, T2 = 0, k2 = (h3 = 0, 0), R2 = 0, P2 = 0; o4 > h3; ++h3) {
        var O2 = y2(h3), I2 = 32767 & h3, C2 = g2[O2];
        if (_2[I2] = C2, g2[O2] = I2, h3 >= R2) {
          var F2 = o4 - h3;
          if ((x2 > 7e3 || k2 > 24576) && F2 > 423) {
            u3 = _s(t4, l3, 0, w2, E2, S2, T2, k2, P2, h3 - P2, u3), k2 = x2 = T2 = 0, P2 = h3;
            for (var A2 = 0; 286 > A2; ++A2) E2[A2] = 0;
            for (A2 = 0; 30 > A2; ++A2) S2[A2] = 0;
          }
          var M2 = 2, D2 = 0, L2 = f2, U2 = I2 - C2 & 32767;
          if (F2 > 2 && O2 == y2(h3 - U2)) for (var N2 = Math.min(c3, F2) - 1, j2 = Math.min(32767, h3), z2 = Math.min(258, F2); j2 >= U2 && --L2 && I2 != C2; ) {
            if (t4[h3 + M2] == t4[h3 + M2 - U2]) {
              for (var B2 = 0; z2 > B2 && t4[h3 + B2] == t4[h3 + B2 - U2]; ++B2) ;
              if (B2 > M2) {
                if (M2 = B2, D2 = U2, B2 > N2) break;
                var H2 = Math.min(U2, B2 - 2), q2 = 0;
                for (A2 = 0; H2 > A2; ++A2) {
                  var W2 = h3 - U2 + A2 + 32768 & 32767, V2 = W2 - _2[W2] + 32768 & 32767;
                  V2 > q2 && (q2 = V2, C2 = W2);
                }
              }
            }
            U2 += (I2 = C2) - (C2 = _2[I2]) + 32768 & 32767;
          }
          if (D2) {
            w2[k2++] = 268435456 | Xr[M2] << 18 | Qr[D2];
            var Y2 = 31 & Xr[M2], G2 = 31 & Qr[D2];
            T2 += Vr[Y2] + Yr[G2], ++E2[257 + Y2], ++S2[G2], R2 = h3 + M2, ++x2;
          } else w2[k2++] = t4[h3], ++E2[t4[h3]];
        }
      }
      u3 = _s(t4, l3, true, w2, E2, S2, T2, k2, P2, h3 - P2, u3);
    }
    return ls(a3, 0, r4 + as(u3) + s5);
  }(n3 = t3, null == (o3 = i2).level ? 6 : o3.level, null == o3.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(n3.length)))) : 12 + o3.mem, a2, l2)), h2 = u2.length;
  return function(t4, i3) {
    var e4 = i3.filename;
    if (t4[0] = 31, t4[1] = 139, t4[2] = 8, t4[8] = 2 > i3.level ? 4 : 9 == i3.level ? 2 : 0, t4[9] = 3, 0 != i3.mtime && bs(t4, 4, Math.floor(new Date(i3.mtime || Date.now()) / 1e3)), e4) {
      t4[3] = 8;
      for (var r4 = 0; e4.length >= r4; ++r4) t4[r4 + 10] = e4.charCodeAt(r4);
    }
  }(u2, i2), bs(u2, h2 - 8, e3.d()), bs(u2, h2 - 4, r3), u2;
}
function js(t3, i2, e3) {
  return xs({ distinct_id: t3, userPropertiesToSet: i2, userPropertiesToSetOnce: e3 });
}
function Hs(t3, i2) {
  return !t3 || Object.entries(t3).every((t4) => {
    var [e3, r3] = t4, s4 = null == i2 ? void 0 : i2[e3];
    if (C(s4) || M(s4)) return false;
    var n3 = [String(s4)], o3 = zs[r3.operator];
    return !!o3 && o3(r3.values, n3);
  });
}
function gn(t3) {
  return t3 instanceof Element && (t3.id === re || !(null == t3.closest || !t3.closest(".toolbar-global-fade-container")));
}
function mn(t3) {
  return !!t3 && 1 === t3.nodeType;
}
function bn(t3, i2) {
  return !!t3 && !!t3.tagName && t3.tagName.toLowerCase() === i2.toLowerCase();
}
function yn(t3) {
  return !!t3 && 3 === t3.nodeType;
}
function wn(t3) {
  return !!t3 && 11 === t3.nodeType;
}
function En(t3) {
  return t3 ? E(t3).split(/\s+/) : [];
}
function Sn(i2) {
  var e3 = null == t ? void 0 : t.location.href;
  return !!(e3 && i2 && i2.some((t3) => e3.match(t3)));
}
function xn(t3) {
  var i2 = "";
  switch (typeof t3.className) {
    case "string":
      i2 = t3.className;
      break;
    case "object":
      i2 = (t3.className && "baseVal" in t3.className ? t3.className.baseVal : null) || t3.getAttribute("class") || "";
      break;
    default:
      i2 = "";
  }
  return En(i2);
}
function Tn(t3) {
  return D(t3) ? null : E(t3).split(/(\s+)/).filter((t4) => Hn(t4)).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255);
}
function $n(t3) {
  var i2 = "";
  return Mn(t3) && !Dn(t3) && t3.childNodes && t3.childNodes.length && be(t3.childNodes, function(t4) {
    var e3;
    yn(t4) && t4.textContent && (i2 += null !== (e3 = Tn(t4.textContent)) && void 0 !== e3 ? e3 : "");
  }), E(i2);
}
function kn(t3) {
  return C(t3.target) ? t3.srcElement || null : null != (i2 = t3.target) && i2.shadowRoot ? t3.composedPath()[0] || null : t3.target || null;
  var i2;
}
function Pn(t3, i2) {
  if (C(i2)) return true;
  var e3, r3 = function(t4) {
    if (i2.some((i3) => t4.matches(i3))) return { v: true };
  };
  for (var s4 of t3) if (e3 = r3(s4)) return e3.v;
  return false;
}
function On(t3) {
  var i2 = t3.parentNode;
  return !(!i2 || !mn(i2)) && i2;
}
function Mn(t3) {
  for (var i2 = t3; i2.parentNode && !bn(i2, "body"); i2 = i2.parentNode) {
    var e3 = xn(i2);
    if (w(e3, "ph-sensitive") || w(e3, "ph-no-capture")) return false;
  }
  if (w(xn(t3), "ph-include")) return true;
  var r3 = t3.type || "";
  if (F(r3)) switch (r3.toLowerCase()) {
    case "hidden":
    case "password":
      return false;
  }
  var s4 = t3.name || t3.id || "";
  return !F(s4) || !/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s4.replace(/[^a-zA-Z0-9]/g, ""));
}
function Dn(t3) {
  return !!(bn(t3, "input") && !["button", "checkbox", "submit", "reset"].includes(t3.type) || bn(t3, "select") || bn(t3, "textarea") || "true" === t3.getAttribute("contenteditable"));
}
function Hn(t3, i2) {
  if (void 0 === i2 && (i2 = true), D(t3)) return false;
  if (F(t3)) {
    if (t3 = E(t3), (i2 ? Un : Nn).test((t3 || "").replace(/[- ]/g, ""))) return false;
    if ((i2 ? zn : Bn).test(t3)) return false;
  }
  return true;
}
function qn(t3) {
  var i2 = $n(t3);
  return Hn(i2 = (i2 + " " + Wn(t3)).trim()) ? i2 : "";
}
function Wn(t3) {
  var i2 = "";
  return t3 && t3.childNodes && t3.childNodes.length && be(t3.childNodes, function(t4) {
    var e3;
    if (t4 && "span" === (null == (e3 = t4.tagName) ? void 0 : e3.toLowerCase())) try {
      var r3 = $n(t4);
      i2 = (i2 + " " + r3).trim(), t4.childNodes && t4.childNodes.length && (i2 = (i2 + " " + Wn(t4)).trim());
    } catch (t5) {
      yi.error("[AutoCapture]", t5);
    }
  }), i2;
}
function Vn(t3) {
  return t3.replace(/"|\\"/g, '\\"');
}
function Yn(t3) {
  var i2 = t3.attr__class;
  return i2 ? R(i2) ? i2 : En(i2) : void 0;
}
function Xn(t3, i2) {
  return i2.length > t3 ? i2.slice(0, t3) + "..." : i2;
}
function Qn(t3) {
  if (t3.previousElementSibling) return t3.previousElementSibling;
  var i2 = t3;
  do {
    i2 = i2.previousSibling;
  } while (i2 && !mn(i2));
  return i2;
}
function Zn(i2, e3) {
  for (var r3, s4, { e: n3, maskAllElementAttributes: o3, maskAllText: a2, elementAttributeIgnoreList: l2, elementsChainAsString: u2 } = e3, h2 = [i2], d2 = i2; d2.parentNode && !bn(d2, "body"); ) wn(d2.parentNode) ? (h2.push(d2.parentNode.host), d2 = d2.parentNode.host) : (h2.push(d2.parentNode), d2 = d2.parentNode);
  var v2, c3, f2 = [], _2 = {}, g2 = false, m2 = false;
  if (be(h2, (t3) => {
    var i3 = Mn(t3);
    "a" === t3.tagName.toLowerCase() && (g2 = t3.getAttribute("href"), g2 = i3 && g2 && Hn(g2) && g2), w(xn(t3), "ph-no-capture") && (m2 = true), f2.push(function(t4, i4, e5, r4) {
      var s5 = t4.tagName.toLowerCase(), n4 = { tag_name: s5 };
      Rn.indexOf(s5) > -1 && !e5 && (n4.$el_text = "a" === s5.toLowerCase() || "button" === s5.toLowerCase() ? Xn(1024, qn(t4)) : Xn(1024, $n(t4)));
      var o4 = xn(t4);
      o4.length > 0 && (n4.classes = o4.filter(function(t5) {
        return "" !== t5;
      })), be(t4.attributes, function(e6) {
        var s6;
        if ((!Dn(t4) || -1 !== ["name", "id", "class", "aria-label"].indexOf(e6.name)) && (null == r4 || !r4.includes(e6.name)) && !i4 && Hn(e6.value) && (!F(s6 = e6.name) || "_ngcontent" !== s6.substring(0, 10) && "_nghost" !== s6.substring(0, 7))) {
          var o5 = e6.value;
          "class" === e6.name && (o5 = En(o5).join(" ")), n4["attr__" + e6.name] = Xn(1024, o5);
        }
      });
      for (var a3 = 1, l3 = 1, u3 = t4; u3 = Qn(u3); ) a3++, u3.tagName === t4.tagName && l3++;
      return n4.nth_child = a3, n4.nth_of_type = l3, n4;
    }(t3, o3, a2, l2));
    var e4 = function(t4) {
      if (!Mn(t4)) return {};
      var i4 = {};
      return be(t4.attributes, function(t5) {
        if (t5.name && 0 === t5.name.indexOf("data-ph-capture-attribute")) {
          var e5 = t5.name.replace("data-ph-capture-attribute-", ""), r4 = t5.value;
          e5 && r4 && Hn(r4) && (i4[e5] = r4);
        }
      }), i4;
    }(t3);
    ye(_2, e4);
  }), m2) return { props: {}, explicitNoCapture: m2 };
  if (a2 || (f2[0].$el_text = "a" === i2.tagName.toLowerCase() || "button" === i2.tagName.toLowerCase() ? qn(i2) : $n(i2)), g2) {
    var b2, y2;
    f2[0].attr__href = g2;
    var E2 = null == (b2 = er(g2)) ? void 0 : b2.host, S2 = null == t || null == (y2 = t.location) ? void 0 : y2.host;
    E2 && S2 && E2 !== S2 && (v2 = g2);
  }
  return { props: ye({ $event_type: n3.type, $ce_version: 1 }, u2 ? {} : { $elements: f2 }, { $elements_chain: (c3 = f2, function(t3) {
    return t3.map((t4) => {
      var i3, e4, r4 = "";
      if (t4.tag_name && (r4 += t4.tag_name), t4.attr_class) for (var s5 of (t4.attr_class.sort(), t4.attr_class)) r4 += "." + s5.replace(/"/g, "");
      var n4 = p({}, t4.text ? { text: t4.text } : {}, { "nth-child": null !== (i3 = t4.nth_child) && void 0 !== i3 ? i3 : 0, "nth-of-type": null !== (e4 = t4.nth_of_type) && void 0 !== e4 ? e4 : 0 }, t4.href ? { href: t4.href } : {}, t4.attr_id ? { attr_id: t4.attr_id } : {}, t4.attributes), o4 = {};
      return we(n4).sort((t5, i4) => {
        var [e5] = t5, [r5] = i4;
        return e5.localeCompare(r5);
      }).forEach((t5) => {
        var [i4, e5] = t5;
        return o4[Vn(i4.toString())] = Vn(e5.toString());
      }), (r4 += ":") + we(o4).map((t5) => {
        var [i4, e5] = t5;
        return i4 + '="' + e5 + '"';
      }).join("");
    }).join(";");
  }(function(t3) {
    return t3.map((t4) => {
      var i3, e4, r4 = { text: null == (i3 = t4.$el_text) ? void 0 : i3.slice(0, 400), tag_name: t4.tag_name, href: null == (e4 = t4.attr__href) ? void 0 : e4.slice(0, 2048), attr_class: Yn(t4), attr_id: t4.attr__id, nth_child: t4.nth_child, nth_of_type: t4.nth_of_type, attributes: {} };
      return we(t4).filter((t5) => {
        var [i4] = t5;
        return 0 === i4.indexOf("attr__");
      }).forEach((t5) => {
        var [i4, e5] = t5;
        return r4.attributes[i4] = e5;
      }), r4;
    });
  }(c3))) }, null != (r3 = f2[0]) && r3.$el_text ? { $el_text: null == (s4 = f2[0]) ? void 0 : s4.$el_text } : {}, v2 && "click" === n3.type ? { $external_click_url: v2 } : {}, _2) };
}
function io(t3, i2, e3) {
  try {
    if (!(i2 in t3)) return () => {
    };
    var r3 = t3[i2], s4 = e3(r3);
    return P(s4) && (s4.prototype = s4.prototype || {}, Object.defineProperties(s4, { __posthog_wrapped__: { enumerable: false, value: true } })), t3[i2] = s4, () => {
      t3[i2] = r3;
    };
  } catch (t4) {
    return () => {
    };
  }
}
function co(t3) {
  return O(t3) && "clientX" in t3 && "clientY" in t3 && L(t3.clientX) && L(t3.clientY);
}
function bo(t3, i2, e3) {
  if (D(t3)) return false;
  switch (e3) {
    case "exact":
      return t3 === i2;
    case "contains":
      var r3 = i2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/_/g, ".").replace(/%/g, ".*");
      return new RegExp(r3, "i").test(t3);
    case "regex":
      try {
        return new RegExp(i2).test(t3);
      } catch (t4) {
        return false;
      }
    default:
      return false;
  }
}
var t, i, e, r, s2, n, o, a, l, u, h, d, v, m, b, y, E, S, x, T, k, R, P, O, I, C, F, A, M, D, L, U, N, j, z, W, V, Y, J, K, X, Q, Z, tt, it, et, rt, st, nt, ot, at, lt, ut, ht, dt, vt, ct, ft, pt, _t, gt, mt, bt, yt, wt, Et, St, xt, Tt, $t, kt, Rt, Pt, Ot, It, Ct, Ft, At, Mt, Dt, Lt, Ut, Nt, jt, zt, Bt, Ht, qt, Wt, Vt, Yt, Gt, Kt, Xt, Zt, ti, ii, ei, ri, si, ni, oi, ai, li, ui, hi, di, vi, ci, pi, _i, gi, mi, bi, yi, wi, Ei, Si, xi, Ti, $i, ki, Ri, Pi, Oi, Ii, Ci, Fi, Ai, Mi, Di, Li, Ui, Ni, ji, zi, Bi, Hi, qi, Wi, Vi, Yi, Gi, Ji, Ki, Xi, Qi, Zi, te, ie, ee, re, se, ne, oe, ae, le, ue, he, de, ve, ce, fe, pe, _e, ge, ye, Ee, Se, xe, Te, Pe, Oe, Ie, Ce, Fe, Ae, Me, De, Le, Ue, Ne, je, ze, Be, He, qe, We, Ve, Ye, Ge, Je, Ke, Xe, Qe, tr, ir, er, rr, sr, nr, or, ar, lr, ur, hr, pr, wr, Er, Sr, kr, Ir, Cr, Fr, Mr, Dr, Lr, Ur, Nr, jr, Br, Hr, qr, Wr, Vr, Yr, Gr, Jr, Kr, Xr, is, Qr, Zr, ts, es, rs, ss, ns, os, as, ls, us, hs, ds, vs, cs, fs, ps, _s, gs, ms, bs, ws, Es, Ss, xs, Ts, $s, ks, Rs, Ps, Os, Is, Cs, Fs, As, Ms, Ds, Ls, Us, Ns, zs, Bs, qs, Ws, Vs, Ys, Gs, Js, Ks, Xs, Qs, Zs, tn, en, rn, sn, nn, on, an, ln, un, hn, dn, vn, cn, fn, pn, _n, Rn, In, Cn, Fn, An, Ln, Un, Nn, jn, zn, Bn, Gn, Jn, Kn, to, eo, ro, so, no, oo, ao, lo, uo, ho, vo, fo, po, _o, go, mo, yo, wo, Eo, So, xo, To, $o, ko, Ro, Po, Oo, Io, Co, Fo, Ao, Mo, Do, Lo, Uo, No, jo, zo, Bo, Ho, qo, Wo, Vo, Yo, Go, Jo, Ko, Xo, Qo, Zo, ta, ia, ea, ra, sa;
var init_module = __esm({
  "node_modules/posthog-js/dist/module.js"() {
    t = "undefined" != typeof window ? window : void 0;
    i = "undefined" != typeof globalThis ? globalThis : t;
    "undefined" == typeof self && (i.self = i), "undefined" == typeof File && (i.File = function() {
    });
    e = null == i ? void 0 : i.navigator;
    r = null == i ? void 0 : i.document;
    s2 = null == i ? void 0 : i.location;
    n = null == i ? void 0 : i.fetch;
    o = null != i && i.XMLHttpRequest && "withCredentials" in new i.XMLHttpRequest() ? i.XMLHttpRequest : void 0;
    a = null == i ? void 0 : i.AbortController;
    l = null == i ? void 0 : i.CompressionStream;
    u = null == e ? void 0 : e.userAgent;
    h = null != t ? t : {};
    d = "1.364.6";
    v = { DEBUG: false, LIB_VERSION: d, LIB_NAME: "web", JS_SDK_VERSION: d };
    m = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"];
    b = ["amazonbot", "amazonproductbot", "app.hypefactors.com", "applebot", "archive.org_bot", "awariobot", "backlinksextendedbot", "baiduspider", "bingbot", "bingpreview", "chrome-lighthouse", "dataforseobot", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "http://yandex.com/bots", "hubspot", "ia_archiver", "leikibot", "linkedinbot", "meta-externalagent", "mj12bot", "msnbot", "nessus", "petalbot", "pinterest", "prerender", "rogerbot", "screaming frog", "sebot-wa", "sitebulb", "slackbot", "slurp", "trendictionbot", "turnitin", "twitterbot", "vercel-screenshot", "vercelbot", "yahoo! slurp", "yandexbot", "zoombot", "bot.htm", "bot.php", "(bot;", "bot/", "crawler", "ahrefsbot", "ahrefssiteaudit", "semrushbot", "siteauditbot", "splitsignalbot", "gptbot", "oai-searchbot", "chatgpt-user", "perplexitybot", "better uptime bot", "sentryuptimebot", "uptimerobot", "headlesschrome", "cypress", "google-hoteladsverifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleother", "google-cloudvertexbot", "googleweblight", "mediapartners-google", "storebot-google", "google-inspectiontool", "bytespider"];
    y = function(t3, i2) {
      if (void 0 === i2 && (i2 = []), !t3) return false;
      var e3 = t3.toLowerCase();
      return b.concat(i2).some((t4) => {
        var i3 = t4.toLowerCase();
        return -1 !== e3.indexOf(i3);
      });
    };
    E = function(t3) {
      return t3.trim();
    };
    S = function(t3) {
      return t3.replace(/^\$/, "");
    };
    x = Object.prototype;
    T = x.hasOwnProperty;
    k = x.toString;
    R = Array.isArray || function(t3) {
      return "[object Array]" === k.call(t3);
    };
    P = (t3) => "function" == typeof t3;
    O = (t3) => t3 === Object(t3) && !R(t3);
    I = (t3) => {
      if (O(t3)) {
        for (var i2 in t3) if (T.call(t3, i2)) return false;
        return true;
      }
      return false;
    };
    C = (t3) => void 0 === t3;
    F = (t3) => "[object String]" == k.call(t3);
    A = (t3) => F(t3) && 0 === t3.trim().length;
    M = (t3) => null === t3;
    D = (t3) => C(t3) || M(t3);
    L = (t3) => "[object Number]" == k.call(t3) && t3 == t3;
    U = (t3) => L(t3) && t3 > 0;
    N = (t3) => "[object Boolean]" === k.call(t3);
    j = (t3) => t3 instanceof FormData;
    z = (t3) => w(m, t3);
    W = [true, "true", 1, "1", "yes"];
    V = (t3) => w(W, t3);
    Y = [false, "false", 0, "0", "no"];
    J = class {
      constructor(t3) {
        this.Pt = {}, this.Dt = t3.Dt, this.jt = G(t3.bucketSize, 0, 100, t3.qt), this.$t = G(t3.refillRate, 0, this.jt, t3.qt), this.Ht = G(t3.refillInterval, 0, 864e5, t3.qt);
      }
      Vt(t3, i2) {
        var e3 = Math.floor((i2 - t3.lastAccess) / this.Ht);
        e3 > 0 && (t3.tokens = Math.min(t3.tokens + e3 * this.$t, this.jt), t3.lastAccess = t3.lastAccess + e3 * this.Ht);
      }
      consumeRateLimit(t3) {
        var i2, e3 = Date.now(), r3 = String(t3), s4 = this.Pt[r3];
        return s4 ? this.Vt(s4, e3) : this.Pt[r3] = s4 = { tokens: this.jt, lastAccess: e3 }, 0 === s4.tokens || (s4.tokens--, 0 === s4.tokens && (null == (i2 = this.Dt) || i2.call(this, t3)), 0 === s4.tokens);
      }
      stop() {
        this.Pt = {};
      }
    };
    Z = "Mobile";
    tt = "iOS";
    it = "Android";
    et = "Tablet";
    rt = it + " " + et;
    st = "iPad";
    nt = "Apple";
    ot = nt + " Watch";
    at = "Safari";
    lt = "BlackBerry";
    ut = "Samsung";
    ht = ut + "Browser";
    dt = ut + " Internet";
    vt = "Chrome";
    ct = vt + " OS";
    ft = vt + " " + tt;
    pt = "Internet Explorer";
    _t = pt + " " + Z;
    gt = "Opera";
    mt = gt + " Mini";
    bt = "Edge";
    yt = "Microsoft " + bt;
    wt = "Firefox";
    Et = wt + " " + tt;
    St = "Nintendo";
    xt = "PlayStation";
    Tt = "Xbox";
    $t = it + " " + Z;
    kt = Z + " " + at;
    Rt = "Windows";
    Pt = Rt + " Phone";
    Ot = "Nokia";
    It = "Ouya";
    Ct = "Generic";
    Ft = Ct + " " + Z.toLowerCase();
    At = Ct + " " + et.toLowerCase();
    Mt = "Konqueror";
    Dt = "(\\d+(\\.\\d+)?)";
    Lt = new RegExp("Version/" + Dt);
    Ut = new RegExp(Tt, "i");
    Nt = new RegExp(xt + " \\w+", "i");
    jt = new RegExp(St + " \\w+", "i");
    zt = new RegExp(lt + "|PlayBook|BB10", "i");
    Bt = { "NT3.51": "NT 3.11", "NT4.0": "NT 4.0", "5.0": "2000", 5.1: "XP", 5.2: "XP", "6.0": "Vista", 6.1: "7", 6.2: "8", 6.3: "8.1", 6.4: "10", "10.0": "10" };
    Ht = function(t3, i2) {
      return i2 = i2 || "", w(t3, " OPR/") && w(t3, "Mini") ? mt : w(t3, " OPR/") ? gt : zt.test(t3) ? lt : w(t3, "IE" + Z) || w(t3, "WPDesktop") ? _t : w(t3, ht) ? dt : w(t3, bt) || w(t3, "Edg/") ? yt : w(t3, "FBIOS") ? "Facebook " + Z : w(t3, "UCWEB") || w(t3, "UCBrowser") ? "UC Browser" : w(t3, "CriOS") ? ft : w(t3, "CrMo") || w(t3, vt) ? vt : w(t3, it) && w(t3, at) ? $t : w(t3, "FxiOS") ? Et : w(t3.toLowerCase(), Mt.toLowerCase()) ? Mt : ((t4, i3) => i3 && w(i3, nt) || function(t5) {
        return w(t5, at) && !w(t5, vt) && !w(t5, it);
      }(t4))(t3, i2) ? w(t3, Z) ? kt : at : w(t3, wt) ? wt : w(t3, "MSIE") || w(t3, "Trident/") ? pt : w(t3, "Gecko") ? wt : "";
    };
    qt = { [_t]: [new RegExp("rv:" + Dt)], [yt]: [new RegExp(bt + "?\\/" + Dt)], [vt]: [new RegExp("(" + vt + "|CrMo)\\/" + Dt)], [ft]: [new RegExp("CriOS\\/" + Dt)], "UC Browser": [new RegExp("(UCBrowser|UCWEB)\\/" + Dt)], [at]: [Lt], [kt]: [Lt], [gt]: [new RegExp("(Opera|OPR)\\/" + Dt)], [wt]: [new RegExp(wt + "\\/" + Dt)], [Et]: [new RegExp("FxiOS\\/" + Dt)], [Mt]: [new RegExp("Konqueror[:/]?" + Dt, "i")], [lt]: [new RegExp(lt + " " + Dt), Lt], [$t]: [new RegExp("android\\s" + Dt, "i")], [dt]: [new RegExp(ht + "\\/" + Dt)], [pt]: [new RegExp("(rv:|MSIE )" + Dt)], Mozilla: [new RegExp("rv:" + Dt)] };
    Wt = function(t3, i2) {
      var e3 = Ht(t3, i2), r3 = qt[e3];
      if (C(r3)) return null;
      for (var s4 = 0; r3.length > s4; s4++) {
        var n3 = t3.match(r3[s4]);
        if (n3) return parseFloat(n3[n3.length - 2]);
      }
      return null;
    };
    Vt = [[new RegExp(Tt + "; " + Tt + " (.*?)[);]", "i"), (t3) => [Tt, t3 && t3[1] || ""]], [new RegExp(St, "i"), [St, ""]], [new RegExp(xt, "i"), [xt, ""]], [zt, [lt, ""]], [new RegExp(Rt, "i"), (t3, i2) => {
      if (/Phone/.test(i2) || /WPDesktop/.test(i2)) return [Pt, ""];
      if (new RegExp(Z).test(i2) && !/IEMobile\b/.test(i2)) return [Rt + " " + Z, ""];
      var e3 = /Windows NT ([0-9.]+)/i.exec(i2);
      if (e3 && e3[1]) {
        var r3 = Bt[e3[1]] || "";
        return /arm/i.test(i2) && (r3 = "RT"), [Rt, r3];
      }
      return [Rt, ""];
    }], [/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, (t3) => t3 && t3[3] ? [tt, [t3[3], t3[4], t3[5] || "0"].join(".")] : [tt, ""]], [/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, (t3) => {
      var i2 = "";
      return t3 && t3.length >= 3 && (i2 = C(t3[2]) ? t3[3] : t3[2]), ["watchOS", i2];
    }], [new RegExp("(" + it + " (\\d+)\\.(\\d+)\\.?(\\d+)?|" + it + ")", "i"), (t3) => t3 && t3[2] ? [it, [t3[2], t3[3], t3[4] || "0"].join(".")] : [it, ""]], [/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, (t3) => {
      var i2 = ["Mac OS X", ""];
      return t3 && t3[1] && (i2[1] = [t3[1], t3[2], t3[3] || "0"].join(".")), i2;
    }], [/Mac/i, ["Mac OS X", ""]], [/CrOS/, [ct, ""]], [/Linux|debian/i, ["Linux", ""]]];
    Yt = function(t3) {
      return jt.test(t3) ? St : Nt.test(t3) ? xt : Ut.test(t3) ? Tt : new RegExp(It, "i").test(t3) ? It : new RegExp("(" + Pt + "|WPDesktop)", "i").test(t3) ? Pt : /iPad/.test(t3) ? st : /iPod/.test(t3) ? "iPod Touch" : /iPhone/.test(t3) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(t3) ? ot : zt.test(t3) ? lt : /(kobo)\s(ereader|touch)/i.test(t3) ? "Kobo" : new RegExp(Ot, "i").test(t3) ? Ot : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(t3) || /(kf[a-z]+)( bui|\)).+silk\//i.test(t3) ? "Kindle Fire" : /(Android|ZTE)/i.test(t3) ? new RegExp(Z).test(t3) && !/(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(t3) || /pixel[\daxl ]{1,6}/i.test(t3) && !/pixel c/i.test(t3) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(t3) || /lmy47v/i.test(t3) && !/QTAQZ3/i.test(t3) ? it : rt : new RegExp("(pda|" + Z + ")", "i").test(t3) ? Ft : new RegExp(et, "i").test(t3) && !new RegExp(et + " pc", "i").test(t3) ? At : "";
    };
    Gt = (t3) => t3 instanceof Error;
    Kt = class {
      constructor(t3, i2, e3) {
        void 0 === e3 && (e3 = []), this.coercers = t3, this.stackParser = i2, this.modifiers = e3;
      }
      buildFromUnknown(t3, i2) {
        void 0 === i2 && (i2 = {});
        var e3 = i2 && i2.mechanism || { handled: true, type: "generic" }, r3 = this.buildCoercingContext(e3, i2, 0).apply(t3), s4 = this.buildParsingContext(i2), n3 = this.parseStacktrace(r3, s4);
        return { $exception_list: this.convertToExceptionList(n3, e3), $exception_level: "error" };
      }
      modifyFrames(t3) {
        var i2 = this;
        return f(function* () {
          for (var e3 of t3) e3.stacktrace && e3.stacktrace.frames && R(e3.stacktrace.frames) && (e3.stacktrace.frames = yield i2.applyModifiers(e3.stacktrace.frames));
          return t3;
        })();
      }
      coerceFallback(t3) {
        var i2;
        return { type: "Error", value: "Unknown error", stack: null == (i2 = t3.syntheticException) ? void 0 : i2.stack, synthetic: true };
      }
      parseStacktrace(t3, i2) {
        var e3, r3;
        return null != t3.cause && (e3 = this.parseStacktrace(t3.cause, i2)), "" != t3.stack && null != t3.stack && (r3 = this.applyChunkIds(this.stackParser(t3.stack, t3.synthetic ? i2.skipFirstLines : 0), i2.chunkIdMap)), p({}, t3, { cause: e3, stack: r3 });
      }
      applyChunkIds(t3, i2) {
        return t3.map((t4) => (t4.filename && i2 && (t4.chunk_id = i2[t4.filename]), t4));
      }
      applyCoercers(t3, i2) {
        for (var e3 of this.coercers) if (e3.match(t3)) return e3.coerce(t3, i2);
        return this.coerceFallback(i2);
      }
      applyModifiers(t3) {
        var i2 = this;
        return f(function* () {
          var e3 = t3;
          for (var r3 of i2.modifiers) e3 = yield r3(e3);
          return e3;
        })();
      }
      convertToExceptionList(t3, i2) {
        var e3, r3, s4, n3 = { type: t3.type, value: t3.value, mechanism: { type: null !== (e3 = i2.type) && void 0 !== e3 ? e3 : "generic", handled: null === (r3 = i2.handled) || void 0 === r3 || r3, synthetic: null !== (s4 = t3.synthetic) && void 0 !== s4 && s4 } };
        t3.stack && (n3.stacktrace = { type: "raw", frames: t3.stack });
        var o3 = [n3];
        return null != t3.cause && o3.push(...this.convertToExceptionList(t3.cause, p({}, i2, { handled: true }))), o3;
      }
      buildParsingContext(t3) {
        var i2;
        return { chunkIdMap: Jt(this.stackParser), skipFirstLines: null !== (i2 = t3.skipFirstLines) && void 0 !== i2 ? i2 : 1 };
      }
      buildCoercingContext(t3, i2, e3) {
        void 0 === e3 && (e3 = 0);
        var r3 = (e4, r4) => {
          if (4 >= r4) {
            var s4 = this.buildCoercingContext(t3, i2, r4);
            return this.applyCoercers(e4, s4);
          }
        };
        return p({}, i2, { syntheticException: 0 == e3 ? i2.syntheticException : void 0, mechanism: t3, apply: (t4) => r3(t4, e3), next: (t4) => r3(t4, e3 + 1) });
      }
    };
    Xt = "?";
    Zt = (t3, i2) => {
      var e3 = -1 !== t3.indexOf("safari-extension"), r3 = -1 !== t3.indexOf("safari-web-extension");
      return e3 || r3 ? [-1 !== t3.indexOf("@") ? t3.split("@")[0] : Xt, e3 ? "safari-extension:" + i2 : "safari-web-extension:" + i2] : [t3, i2];
    };
    ti = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
    ii = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    ei = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    ri = (t3, i2) => {
      var e3 = ti.exec(t3);
      if (e3) {
        var [, r3, s4, n3] = e3;
        return Qt(i2, r3, Xt, +s4, +n3);
      }
      var o3 = ii.exec(t3);
      if (o3) {
        if (o3[2] && 0 === o3[2].indexOf("eval")) {
          var a2 = ei.exec(o3[2]);
          a2 && (o3[2] = a2[1], o3[3] = a2[2], o3[4] = a2[3]);
        }
        var [l2, u2] = Zt(o3[1] || Xt, o3[2]);
        return Qt(i2, u2, l2, o3[3] ? +o3[3] : void 0, o3[4] ? +o3[4] : void 0);
      }
    };
    si = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
    ni = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    oi = (t3, i2) => {
      var e3 = si.exec(t3);
      if (e3) {
        if (e3[3] && e3[3].indexOf(" > eval") > -1) {
          var r3 = ni.exec(e3[3]);
          r3 && (e3[1] = e3[1] || "eval", e3[3] = r3[1], e3[4] = r3[2], e3[5] = "");
        }
        var s4 = e3[3], n3 = e3[1] || Xt;
        return [n3, s4] = Zt(n3, s4), Qt(i2, s4, n3, e3[4] ? +e3[4] : void 0, e3[5] ? +e3[5] : void 0);
      }
    };
    ai = /\(error: (.*)\)/;
    li = class {
      match(t3) {
        return this.isDOMException(t3) || this.isDOMError(t3);
      }
      coerce(t3, i2) {
        var e3 = F(t3.stack);
        return { type: this.getType(t3), value: this.getValue(t3), stack: e3 ? t3.stack : void 0, cause: t3.cause ? i2.next(t3.cause) : void 0, synthetic: false };
      }
      getType(t3) {
        return this.isDOMError(t3) ? "DOMError" : "DOMException";
      }
      getValue(t3) {
        var i2 = t3.name || (this.isDOMError(t3) ? "DOMError" : "DOMException");
        return t3.message ? i2 + ": " + t3.message : i2;
      }
      isDOMException(t3) {
        return H(t3, "DOMException");
      }
      isDOMError(t3) {
        return H(t3, "DOMError");
      }
    };
    ui = class {
      match(t3) {
        return ((t4) => t4 instanceof Error)(t3);
      }
      coerce(t3, i2) {
        return { type: this.getType(t3), value: this.getMessage(t3, i2), stack: this.getStack(t3), cause: t3.cause ? i2.next(t3.cause) : void 0, synthetic: false };
      }
      getType(t3) {
        return t3.name || t3.constructor.name;
      }
      getMessage(t3, i2) {
        var e3 = t3.message;
        return String(e3.error && "string" == typeof e3.error.message ? e3.error.message : e3);
      }
      getStack(t3) {
        return t3.stacktrace || t3.stack || void 0;
      }
    };
    hi = class {
      constructor() {
      }
      match(t3) {
        return H(t3, "ErrorEvent") && null != t3.error;
      }
      coerce(t3, i2) {
        var e3;
        return i2.apply(t3.error) || { type: "ErrorEvent", value: t3.message, stack: null == (e3 = i2.syntheticException) ? void 0 : e3.stack, synthetic: true };
      }
    };
    di = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
    vi = class {
      match(t3) {
        return "string" == typeof t3;
      }
      coerce(t3, i2) {
        var e3, [r3, s4] = this.getInfos(t3);
        return { type: null != r3 ? r3 : "Error", value: null != s4 ? s4 : t3, stack: null == (e3 = i2.syntheticException) ? void 0 : e3.stack, synthetic: true };
      }
      getInfos(t3) {
        var i2 = "Error", e3 = t3, r3 = t3.match(di);
        return r3 && (i2 = r3[1], e3 = r3[2]), [i2, e3];
      }
    };
    ci = ["fatal", "error", "warning", "log", "info", "debug"];
    pi = class {
      match(t3) {
        return "object" == typeof t3 && null !== t3;
      }
      coerce(t3, i2) {
        var e3, r3 = this.getErrorPropertyFromObject(t3);
        return r3 ? i2.apply(r3) : { type: this.getType(t3), value: this.getValue(t3), stack: null == (e3 = i2.syntheticException) ? void 0 : e3.stack, level: this.isSeverityLevel(t3.level) ? t3.level : "error", synthetic: true };
      }
      getType(t3) {
        return q(t3) ? t3.constructor.name : "Error";
      }
      getValue(t3) {
        if ("name" in t3 && "string" == typeof t3.name) {
          var i2 = "'" + t3.name + "' captured as exception";
          return "message" in t3 && "string" == typeof t3.message && (i2 += " with message: '" + t3.message + "'"), i2;
        }
        if ("message" in t3 && "string" == typeof t3.message) return t3.message;
        var e3 = this.getObjectClassName(t3);
        return (e3 && "Object" !== e3 ? "'" + e3 + "'" : "Object") + " captured as exception with keys: " + fi(t3);
      }
      isSeverityLevel(t3) {
        return F(t3) && !A(t3) && ci.indexOf(t3) >= 0;
      }
      getErrorPropertyFromObject(t3) {
        for (var i2 in t3) if ({}.hasOwnProperty.call(t3, i2)) {
          var e3 = t3[i2];
          if (Gt(e3)) return e3;
        }
      }
      getObjectClassName(t3) {
        try {
          var i2 = Object.getPrototypeOf(t3);
          return i2 ? i2.constructor.name : void 0;
        } catch (t4) {
          return;
        }
      }
    };
    _i = class {
      match(t3) {
        return q(t3);
      }
      coerce(t3, i2) {
        var e3, r3 = t3.constructor.name;
        return { type: r3, value: r3 + " captured as exception with keys: " + fi(t3), stack: null == (e3 = i2.syntheticException) ? void 0 : e3.stack, synthetic: true };
      }
    };
    gi = class {
      match(t3) {
        return B(t3);
      }
      coerce(t3, i2) {
        var e3;
        return { type: "Error", value: "Primitive value captured as exception: " + String(t3), stack: null == (e3 = i2.syntheticException) ? void 0 : e3.stack, synthetic: true };
      }
    };
    mi = class {
      match(t3) {
        return H(t3, "PromiseRejectionEvent") || this.isCustomEventWrappingRejection(t3);
      }
      isCustomEventWrappingRejection(t3) {
        if (!q(t3)) return false;
        try {
          var i2 = t3.detail;
          return null != i2 && "object" == typeof i2 && "reason" in i2;
        } catch (t4) {
          return false;
        }
      }
      coerce(t3, i2) {
        var e3, r3 = this.getUnhandledRejectionReason(t3);
        return B(r3) ? { type: "UnhandledRejection", value: "Non-Error promise rejection captured with value: " + String(r3), stack: null == (e3 = i2.syntheticException) ? void 0 : e3.stack, synthetic: true } : i2.apply(r3);
      }
      getUnhandledRejectionReason(t3) {
        try {
          if ("reason" in t3) return t3.reason;
          if ("detail" in t3 && null != t3.detail && "object" == typeof t3.detail && "reason" in t3.detail) return t3.detail.reason;
        } catch (t4) {
        }
        return t3;
      }
    };
    bi = function(i2, e3) {
      var { debugEnabled: r3 } = void 0 === e3 ? {} : e3, s4 = { C(e4) {
        if (t && (v.DEBUG || h.POSTHOG_DEBUG || r3) && !C(t.console) && t.console) {
          for (var s5 = ("__rrweb_original__" in t.console[e4]) ? t.console[e4].__rrweb_original__ : t.console[e4], n3 = arguments.length, o3 = new Array(n3 > 1 ? n3 - 1 : 0), a2 = 1; n3 > a2; a2++) o3[a2 - 1] = arguments[a2];
          s5(i2, ...o3);
        }
      }, info() {
        for (var t3 = arguments.length, i3 = new Array(t3), e4 = 0; t3 > e4; e4++) i3[e4] = arguments[e4];
        s4.C("log", ...i3);
      }, warn() {
        for (var t3 = arguments.length, i3 = new Array(t3), e4 = 0; t3 > e4; e4++) i3[e4] = arguments[e4];
        s4.C("warn", ...i3);
      }, error() {
        for (var t3 = arguments.length, i3 = new Array(t3), e4 = 0; t3 > e4; e4++) i3[e4] = arguments[e4];
        s4.C("error", ...i3);
      }, critical() {
        for (var t3 = arguments.length, e4 = new Array(t3), r4 = 0; t3 > r4; r4++) e4[r4] = arguments[r4];
        console.error(i2, ...e4);
      }, uninitializedWarning(t3) {
        s4.error("You must initialize PostHog before calling " + t3);
      }, createLogger: (t3, e4) => bi(i2 + " " + t3, e4) };
      return s4;
    };
    yi = bi("[PostHog.js]");
    wi = yi.createLogger;
    Ei = wi("[ExternalScriptsLoader]");
    Si = (t3, i2, e3) => {
      if (t3.config.disable_external_dependency_loading) return Ei.warn(i2 + " was requested but loading of external scripts is disabled."), e3("Loading of external scripts is disabled");
      var s4 = null == r ? void 0 : r.querySelectorAll("script");
      if (s4) {
        for (var n3, o3 = function() {
          if (s4[a2].src === i2) {
            var t4 = s4[a2];
            return t4.__posthog_loading_callback_fired ? { v: e3() } : (t4.addEventListener("load", (i3) => {
              t4.__posthog_loading_callback_fired = true, e3(void 0, i3);
            }), t4.onerror = (t5) => e3(t5), { v: void 0 });
          }
        }, a2 = 0; s4.length > a2; a2++) if (n3 = o3()) return n3.v;
      }
      var l2 = () => {
        if (!r) return e3("document not found");
        var s5 = r.createElement("script");
        if (s5.type = "text/javascript", s5.crossOrigin = "anonymous", s5.src = i2, s5.onload = (t4) => {
          s5.__posthog_loading_callback_fired = true, e3(void 0, t4);
        }, s5.onerror = (t4) => e3(t4), t3.config.prepare_external_dependency_script && (s5 = t3.config.prepare_external_dependency_script(s5)), !s5) return e3("prepare_external_dependency_script returned null");
        if ("head" === t3.config.external_scripts_inject_target) r.head.appendChild(s5);
        else {
          var n4, o4 = r.querySelectorAll("body > script");
          o4.length > 0 ? null == (n4 = o4[0].parentNode) || n4.insertBefore(s5, o4[0]) : r.body.appendChild(s5);
        }
      };
      null != r && r.body ? l2() : null == r || r.addEventListener("DOMContentLoaded", l2);
    };
    h.__PosthogExtensions__ = h.__PosthogExtensions__ || {}, h.__PosthogExtensions__.loadExternalDependency = (t3, i2, e3) => {
      var r3 = "/static/" + i2 + ".js?v=" + t3.version;
      if ("remote-config" === i2 && (r3 = "/array/" + t3.config.token + "/config.js"), "toolbar" === i2) {
        var s4 = 3e5;
        r3 = r3 + "&t=" + Math.floor(Date.now() / s4) * s4;
      }
      var n3 = t3.requestRouter.endpointFor("assets", r3);
      Si(t3, n3, e3);
    }, h.__PosthogExtensions__.loadSiteApp = (t3, i2, e3) => {
      var r3 = t3.requestRouter.endpointFor("api", i2);
      Si(t3, r3, e3);
    };
    xi = "$people_distinct_id";
    Ti = "$device_id";
    $i = "__alias";
    ki = "__timers";
    Ri = "$autocapture_disabled_server_side";
    Pi = "$heatmaps_enabled_server_side";
    Oi = "$exception_capture_enabled_server_side";
    Ii = "$error_tracking_suppression_rules";
    Ci = "$error_tracking_capture_extension_exceptions";
    Fi = "$web_vitals_enabled_server_side";
    Ai = "$dead_clicks_enabled_server_side";
    Mi = "$product_tours_enabled_server_side";
    Di = "$web_vitals_allowed_metrics";
    Li = "$session_recording_remote_config";
    Ui = "$sesid";
    Ni = "$session_is_sampled";
    ji = "$enabled_feature_flags";
    zi = "$early_access_features";
    Bi = "$feature_flag_details";
    Hi = "$stored_person_properties";
    qi = "$stored_group_properties";
    Wi = "$surveys";
    Vi = "$flag_call_reported";
    Yi = "$flag_call_reported_session_id";
    Gi = "$feature_flag_errors";
    Ji = "$feature_flag_evaluated_at";
    Ki = "$user_state";
    Xi = "$client_session_props";
    Qi = "$capture_rate_limit";
    Zi = "$initial_campaign_params";
    te = "$initial_referrer_info";
    ie = "$initial_person_info";
    ee = "$epp";
    re = "__POSTHOG_TOOLBAR__";
    se = "$posthog_cookieless";
    ne = [xi, $i, "__cmpns", ki, "$session_recording_enabled_server_side", Pi, Ui, ji, Ii, Ki, zi, Bi, qi, Hi, Wi, Vi, Yi, Gi, Ji, Xi, Qi, Zi, te, ee, ie];
    oe = "PostHog loadExternalDependency extension not found.";
    ae = "on_reject";
    le = "always";
    ue = "anonymous";
    he = "identified";
    de = "identified_only";
    ve = "visibilitychange";
    ce = "beforeunload";
    fe = "$pageview";
    pe = "$pageleave";
    _e = "$identify";
    ge = "$groupidentify";
    ye = function(t3) {
      for (var i2 = arguments.length, e3 = new Array(i2 > 1 ? i2 - 1 : 0), r3 = 1; i2 > r3; r3++) e3[r3 - 1] = arguments[r3];
      for (var s4 of e3) for (var n3 in s4) void 0 !== s4[n3] && (t3[n3] = s4[n3]);
      return t3;
    };
    Ee = function(t3) {
      try {
        return t3();
      } catch (t4) {
        return;
      }
    };
    Se = function(t3) {
      return function() {
        try {
          for (var i2 = arguments.length, e3 = new Array(i2), r3 = 0; i2 > r3; r3++) e3[r3] = arguments[r3];
          return t3.apply(this, e3);
        } catch (t4) {
          yi.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), yi.critical(t4);
        }
      };
    };
    xe = function(t3) {
      var i2 = {};
      return be(t3, function(t4, e3) {
        (F(t4) && t4.length > 0 || L(t4)) && (i2[e3] = t4);
      }), i2;
    };
    Te = ["herokuapp.com", "vercel.app", "netlify.app"];
    Math.trunc || (Math.trunc = function(t3) {
      return 0 > t3 ? Math.ceil(t3) : Math.floor(t3);
    }), Number.isInteger || (Number.isInteger = function(t3) {
      return L(t3) && isFinite(t3) && Math.floor(t3) === t3;
    });
    Pe = class _Pe {
      constructor(t3) {
        if (this.bytes = t3, 16 !== t3.length) throw new TypeError("not 128-bit length");
      }
      static fromFieldsV7(t3, i2, e3, r3) {
        if (!Number.isInteger(t3) || !Number.isInteger(i2) || !Number.isInteger(e3) || !Number.isInteger(r3) || 0 > t3 || 0 > i2 || 0 > e3 || 0 > r3 || t3 > 281474976710655 || i2 > 4095 || e3 > 1073741823 || r3 > 4294967295) throw new RangeError("invalid field value");
        var s4 = new Uint8Array(16);
        return s4[0] = t3 / Math.pow(2, 40), s4[1] = t3 / Math.pow(2, 32), s4[2] = t3 / Math.pow(2, 24), s4[3] = t3 / Math.pow(2, 16), s4[4] = t3 / Math.pow(2, 8), s4[5] = t3, s4[6] = 112 | i2 >>> 8, s4[7] = i2, s4[8] = 128 | e3 >>> 24, s4[9] = e3 >>> 16, s4[10] = e3 >>> 8, s4[11] = e3, s4[12] = r3 >>> 24, s4[13] = r3 >>> 16, s4[14] = r3 >>> 8, s4[15] = r3, new _Pe(s4);
      }
      toString() {
        for (var t3 = "", i2 = 0; this.bytes.length > i2; i2++) t3 = t3 + (this.bytes[i2] >>> 4).toString(16) + (15 & this.bytes[i2]).toString(16), 3 !== i2 && 5 !== i2 && 7 !== i2 && 9 !== i2 || (t3 += "-");
        if (36 !== t3.length) throw new Error("Invalid UUIDv7 was generated");
        return t3;
      }
      clone() {
        return new _Pe(this.bytes.slice(0));
      }
      equals(t3) {
        return 0 === this.compareTo(t3);
      }
      compareTo(t3) {
        for (var i2 = 0; 16 > i2; i2++) {
          var e3 = this.bytes[i2] - t3.bytes[i2];
          if (0 !== e3) return Math.sign(e3);
        }
        return 0;
      }
    };
    Oe = class {
      constructor() {
        this.I = 0, this.S = 0, this.k = new Fe();
      }
      generate() {
        var t3 = this.generateOrAbort();
        if (C(t3)) {
          this.I = 0;
          var i2 = this.generateOrAbort();
          if (C(i2)) throw new Error("Could not generate UUID after timestamp reset");
          return i2;
        }
        return t3;
      }
      generateOrAbort() {
        var t3 = Date.now();
        if (t3 > this.I) this.I = t3, this.A();
        else {
          if (this.I >= t3 + 1e4) return;
          this.S++, this.S > 4398046511103 && (this.I++, this.A());
        }
        return Pe.fromFieldsV7(this.I, Math.trunc(this.S / Math.pow(2, 30)), this.S & Math.pow(2, 30) - 1, this.k.nextUint32());
      }
      A() {
        this.S = 1024 * this.k.nextUint32() + (1023 & this.k.nextUint32());
      }
    };
    Ce = (t3) => {
      if ("undefined" != typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw new Error("no cryptographically strong RNG available");
      for (var i2 = 0; t3.length > i2; i2++) t3[i2] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
      return t3;
    };
    t && !C(t.crypto) && crypto.getRandomValues && (Ce = (t3) => crypto.getRandomValues(t3));
    Fe = class {
      constructor() {
        this.T = new Uint32Array(8), this.N = 1 / 0;
      }
      nextUint32() {
        return this.T.length > this.N || (Ce(this.T), this.N = 0), this.T[this.N++];
      }
    };
    Ae = () => Me().toString();
    Me = () => (Ie || (Ie = new Oe())).generate();
    De = "";
    Le = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i;
    Ue = { Yt: () => !!r, Ut(t3) {
      yi.error("cookieStore error: " + t3);
    }, Wt(t3) {
      if (r) {
        try {
          for (var i2 = t3 + "=", e3 = r.cookie.split(";").filter((t4) => t4.length), s4 = 0; e3.length > s4; s4++) {
            for (var n3 = e3[s4]; " " == n3.charAt(0); ) n3 = n3.substring(1, n3.length);
            if (0 === n3.indexOf(i2)) return decodeURIComponent(n3.substring(i2.length, n3.length));
          }
        } catch (t4) {
        }
        return null;
      }
    }, Gt(t3) {
      var i2;
      try {
        i2 = JSON.parse(Ue.Wt(t3)) || {};
      } catch (t4) {
      }
      return i2;
    }, Xt(t3, i2, e3, s4, n3) {
      if (r) try {
        var o3 = "", a2 = "", l2 = function(t4, i3) {
          if (i3) {
            var e4 = function(t5, i4) {
              if (void 0 === i4 && (i4 = r), De) return De;
              if (!i4) return "";
              if (["localhost", "127.0.0.1"].includes(t5)) return "";
              for (var e5 = t5.split("."), s6 = Math.min(e5.length, 8), n4 = "dmn_chk_" + Ae(); !De && s6--; ) {
                var o4 = e5.slice(s6).join("."), a3 = n4 + "=1;domain=." + o4 + ";path=/";
                i4.cookie = a3 + ";max-age=3", i4.cookie.includes(n4) && (i4.cookie = a3 + ";max-age=0", De = o4);
              }
              return De;
            }(t4);
            if (!e4) {
              var s5 = ((t5) => {
                var i4 = t5.match(Le);
                return i4 ? i4[0] : "";
              })(t4);
              s5 !== e4 && yi.info("Warning: cookie subdomain discovery mismatch", s5, e4), e4 = s5;
            }
            return e4 ? "; domain=." + e4 : "";
          }
          return "";
        }(r.location.hostname, s4);
        if (e3) {
          var u2 = /* @__PURE__ */ new Date();
          u2.setTime(u2.getTime() + 864e5 * e3), o3 = "; expires=" + u2.toUTCString();
        }
        n3 && (a2 = "; secure");
        var h2 = t3 + "=" + encodeURIComponent(JSON.stringify(i2)) + o3 + "; SameSite=Lax; path=/" + l2 + a2;
        return h2.length > 3686.4 && yi.warn("cookieStore warning: large cookie, len=" + h2.length), r.cookie = h2, h2;
      } catch (t4) {
        return;
      }
    }, Jt(t3, i2) {
      if (null != r && r.cookie) try {
        Ue.Xt(t3, "", -1, i2);
      } catch (t4) {
        return;
      }
    } };
    Ne = null;
    je = { Yt() {
      if (!M(Ne)) return Ne;
      var i2 = true;
      if (C(t)) i2 = false;
      else try {
        var e3 = "__mplssupport__";
        je.Xt(e3, "xyz"), '"xyz"' !== je.Wt(e3) && (i2 = false), je.Jt(e3);
      } catch (t3) {
        i2 = false;
      }
      return i2 || yi.error("localStorage unsupported; falling back to cookie store"), Ne = i2, i2;
    }, Ut(t3) {
      yi.error("localStorage error: " + t3);
    }, Wt(i2) {
      try {
        return null == t ? void 0 : t.localStorage.getItem(i2);
      } catch (t3) {
        je.Ut(t3);
      }
      return null;
    }, Gt(t3) {
      try {
        return JSON.parse(je.Wt(t3)) || {};
      } catch (t4) {
      }
      return null;
    }, Xt(i2, e3) {
      try {
        null == t || t.localStorage.setItem(i2, JSON.stringify(e3));
      } catch (t3) {
        je.Ut(t3);
      }
    }, Jt(i2) {
      try {
        null == t || t.localStorage.removeItem(i2);
      } catch (t3) {
        je.Ut(t3);
      }
    } };
    ze = [Ti, "distinct_id", Ui, Ni, ee, ie, Ki];
    Be = {};
    He = { Yt: () => true, Ut(t3) {
      yi.error("memoryStorage error: " + t3);
    }, Wt: (t3) => Be[t3] || null, Gt: (t3) => Be[t3] || null, Xt(t3, i2) {
      Be[t3] = i2;
    }, Jt(t3) {
      delete Be[t3];
    } };
    qe = null;
    We = { Yt() {
      if (!M(qe)) return qe;
      if (qe = true, C(t)) qe = false;
      else try {
        var i2 = "__support__";
        We.Xt(i2, "xyz"), '"xyz"' !== We.Wt(i2) && (qe = false), We.Jt(i2);
      } catch (t3) {
        qe = false;
      }
      return qe;
    }, Ut(t3) {
      yi.error("sessionStorage error: ", t3);
    }, Wt(i2) {
      try {
        return null == t ? void 0 : t.sessionStorage.getItem(i2);
      } catch (t3) {
        We.Ut(t3);
      }
      return null;
    }, Gt(t3) {
      try {
        return JSON.parse(We.Wt(t3)) || null;
      } catch (t4) {
      }
      return null;
    }, Xt(i2, e3) {
      try {
        null == t || t.sessionStorage.setItem(i2, JSON.stringify(e3));
      } catch (t3) {
        We.Ut(t3);
      }
    }, Jt(i2) {
      try {
        null == t || t.sessionStorage.removeItem(i2);
      } catch (t3) {
        We.Ut(t3);
      }
    } };
    Ve = class {
      constructor(t3) {
        this._instance = t3;
      }
      get Rt() {
        return this._instance.config;
      }
      get consent() {
        return this.Kt() ? 0 : this.Qt;
      }
      isOptedOut() {
        return this.Rt.cookieless_mode === le || 0 === this.consent || -1 === this.consent && (this.Rt.opt_out_capturing_by_default || this.Rt.cookieless_mode === ae);
      }
      isOptedIn() {
        return !this.isOptedOut();
      }
      isExplicitlyOptedOut() {
        return 0 === this.consent;
      }
      optInOut(t3) {
        this.tr.Xt(this.er, t3 ? 1 : 0, this.Rt.cookie_expiration, this.Rt.cross_subdomain_cookie, this.Rt.secure_cookie);
      }
      reset() {
        this.tr.Jt(this.er, this.Rt.cross_subdomain_cookie);
      }
      get er() {
        var { token: t3, opt_out_capturing_cookie_prefix: i2, consent_persistence_name: e3 } = this._instance.config;
        return e3 || (i2 ? i2 + t3 : "__ph_opt_in_out_" + t3);
      }
      get Qt() {
        var t3 = this.tr.Wt(this.er);
        return V(t3) ? 1 : w(Y, t3) ? 0 : -1;
      }
      get tr() {
        if (!this.rr) {
          var t3 = this.Rt.opt_out_capturing_persistence_type;
          this.rr = "localStorage" === t3 ? je : Ue;
          var i2 = "localStorage" === t3 ? Ue : je;
          i2.Wt(this.er) && (this.rr.Wt(this.er) || this.optInOut(V(i2.Wt(this.er))), i2.Jt(this.er, this.Rt.cross_subdomain_cookie));
        }
        return this.rr;
      }
      Kt() {
        return !!this.Rt.respect_dnt && [null == e ? void 0 : e.doNotTrack, null == e ? void 0 : e.msDoNotTrack, h.doNotTrack].some((t3) => V(t3));
      }
    };
    Ye = wi("[Dead Clicks]");
    Ge = () => true;
    Je = (t3) => {
      var i2, e3 = !(null == (i2 = t3.instance.persistence) || !i2.get_property(Ai)), r3 = t3.instance.config.capture_dead_clicks;
      return N(r3) ? r3 : !!O(r3) || e3;
    };
    Ke = class {
      get lazyLoadedDeadClicksAutocapture() {
        return this.ir;
      }
      constructor(t3, i2, e3) {
        this.instance = t3, this.isEnabled = i2, this.onCapture = e3, this.startIfEnabledOrStop();
      }
      onRemoteConfig(t3) {
        "captureDeadClicks" in t3 && (this.instance.persistence && this.instance.persistence.register({ [Ai]: t3.captureDeadClicks }), this.startIfEnabledOrStop());
      }
      startIfEnabledOrStop() {
        this.isEnabled(this) ? this.nr(() => {
          this.sr();
        }) : this.stop();
      }
      nr(t3) {
        var i2, e3;
        null != (i2 = h.__PosthogExtensions__) && i2.initDeadClicksAutocapture && t3(), null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this.instance, "dead-clicks-autocapture", (i3) => {
          i3 ? Ye.error("failed to load script", i3) : t3();
        });
      }
      sr() {
        var t3;
        if (r) {
          if (!this.ir && null != (t3 = h.__PosthogExtensions__) && t3.initDeadClicksAutocapture) {
            var i2 = O(this.instance.config.capture_dead_clicks) ? this.instance.config.capture_dead_clicks : {};
            i2.__onCapture = this.onCapture, this.ir = h.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, i2), this.ir.start(r), Ye.info("starting...");
          }
        } else Ye.error("`document` not found. Cannot start.");
      }
      stop() {
        this.ir && (this.ir.stop(), this.ir = void 0, Ye.info("stopping..."));
      }
    };
    Xe = wi("[SegmentIntegration]");
    Qe = "posthog-js";
    tr = class {
      constructor(t3, i2, e3, r3, s4, n3) {
        this.name = Qe, this.setupOnce = function(o3) {
          o3(Ze(t3, { organization: i2, projectId: e3, prefix: r3, severityAllowList: s4, sendExceptionsToPostHog: null == n3 || n3 }));
        };
      }
    };
    ir = class {
      constructor(t3) {
        this.ar = (t4, i2, e3) => {
          e3 && (e3.noSessionId || e3.activityTimeout || e3.sessionPastMaximumLength) && (yi.info("[PageViewManager] Session rotated, clearing pageview state", { sessionId: t4, changeReason: e3 }), this.lr = void 0, this._instance.scrollManager.resetContext());
        }, this._instance = t3, this.ur();
      }
      ur() {
        var t3;
        this.hr = null == (t3 = this._instance.sessionManager) ? void 0 : t3.onSessionId(this.ar);
      }
      destroy() {
        var t3;
        null == (t3 = this.hr) || t3.call(this), this.hr = void 0;
      }
      doPageView(i2, e3) {
        var r3, s4 = this.cr(i2, e3);
        return this.lr = { pathname: null !== (r3 = null == t ? void 0 : t.location.pathname) && void 0 !== r3 ? r3 : "", pageViewId: e3, timestamp: i2 }, this._instance.scrollManager.resetContext(), s4;
      }
      doPageLeave(t3) {
        var i2;
        return this.cr(t3, null == (i2 = this.lr) ? void 0 : i2.pageViewId);
      }
      doEvent() {
        var t3;
        return { $pageview_id: null == (t3 = this.lr) ? void 0 : t3.pageViewId };
      }
      cr(t3, i2) {
        var e3 = this.lr;
        if (!e3) return { $pageview_id: i2 };
        var r3 = { $pageview_id: i2, $prev_pageview_id: e3.pageViewId }, s4 = this._instance.scrollManager.getContext();
        if (s4 && !this._instance.config.disable_scroll_properties) {
          var { maxScrollHeight: n3, lastScrollY: o3, maxScrollY: a2, maxContentHeight: l2, lastContentY: u2, maxContentY: h2 } = s4;
          if (!(C(n3) || C(o3) || C(a2) || C(l2) || C(u2) || C(h2))) {
            n3 = Math.ceil(n3), o3 = Math.ceil(o3), a2 = Math.ceil(a2), l2 = Math.ceil(l2), u2 = Math.ceil(u2), h2 = Math.ceil(h2);
            var d2 = n3 > 1 ? G(o3 / n3, 0, 1, yi) : 1, v2 = n3 > 1 ? G(a2 / n3, 0, 1, yi) : 1, c3 = l2 > 1 ? G(u2 / l2, 0, 1, yi) : 1, f2 = l2 > 1 ? G(h2 / l2, 0, 1, yi) : 1;
            r3 = ye(r3, { $prev_pageview_last_scroll: o3, $prev_pageview_last_scroll_percentage: d2, $prev_pageview_max_scroll: a2, $prev_pageview_max_scroll_percentage: v2, $prev_pageview_last_content: u2, $prev_pageview_last_content_percentage: c3, $prev_pageview_max_content: h2, $prev_pageview_max_content_percentage: f2 });
          }
        }
        return e3.pathname && (r3.$prev_pageview_pathname = e3.pathname), e3.timestamp && (r3.$prev_pageview_duration = (t3.getTime() - e3.timestamp.getTime()) / 1e3), r3;
      }
    };
    er = (t3) => {
      var i2 = null == r ? void 0 : r.createElement("a");
      return C(i2) ? null : (i2.href = t3, i2);
    };
    rr = function(t3, i2) {
      for (var e3, r3 = ((t3.split("#")[0] || "").split(/\?(.*)/)[1] || "").replace(/^\?+/g, "").split("&"), s4 = 0; r3.length > s4; s4++) {
        var n3 = r3[s4].split("=");
        if (n3[0] === i2) {
          e3 = n3;
          break;
        }
      }
      if (!R(e3) || 2 > e3.length) return "";
      var o3 = e3[1];
      try {
        o3 = decodeURIComponent(o3);
      } catch (t4) {
        yi.error("Skipping decoding for malformed query param: " + o3);
      }
      return o3.replace(/\+/g, " ");
    };
    sr = function(t3, i2, e3) {
      if (!t3 || !i2 || !i2.length) return t3;
      for (var r3 = t3.split("#"), s4 = r3[1], n3 = (r3[0] || "").split("?"), o3 = n3[1], a2 = n3[0], l2 = (o3 || "").split("&"), u2 = [], h2 = 0; l2.length > h2; h2++) {
        var d2 = l2[h2].split("=");
        R(d2) && (i2.includes(d2[0]) ? u2.push(d2[0] + "=" + e3) : u2.push(l2[h2]));
      }
      var v2 = a2;
      return null != o3 && (v2 += "?" + u2.join("&")), null != s4 && (v2 += "#" + s4), v2;
    };
    nr = function(t3, i2) {
      var e3 = t3.match(new RegExp(i2 + "=([^&]*)"));
      return e3 ? e3[1] : null;
    };
    or = "https?://(.*)";
    ar = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "irclid", "_kx"];
    lr = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid", ...ar];
    ur = "<masked>";
    hr = ["li_fat_id"];
    pr = "$direct";
    wr = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"];
    Er = class {
      constructor(t3, i2) {
        this.Rt = t3, this.props = {}, this.dr = false, this.vr = ((t4) => {
          var i3 = "";
          return t4.token && (i3 = t4.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), t4.persistence_name ? "ph_" + t4.persistence_name : "ph_" + i3 + "_posthog";
        })(t3), this.tr = this.pr(t3), this.load(), t3.debug && yi.info("Persistence loaded", t3.persistence, p({}, this.props)), this.update_config(t3, t3, i2), this.save();
      }
      isDisabled() {
        return !!this.gr;
      }
      pr(i2) {
        -1 === wr.indexOf(i2.persistence.toLowerCase()) && (yi.critical("Unknown persistence type " + i2.persistence + "; falling back to localStorage+cookie"), i2.persistence = "localStorage+cookie");
        var e3 = function(i3) {
          void 0 === i3 && (i3 = []);
          var e4 = [...ze, ...i3];
          return p({}, je, { Gt(t3) {
            try {
              var i4 = {};
              try {
                i4 = Ue.Gt(t3) || {};
              } catch (t4) {
              }
              var e5 = ye(i4, JSON.parse(je.Wt(t3) || "{}"));
              return je.Xt(t3, e5), e5;
            } catch (t4) {
            }
            return null;
          }, Xt(t3, i4, r4, s4, n3, o3) {
            try {
              je.Xt(t3, i4, void 0, void 0, o3);
              var a2 = {};
              e4.forEach((t4) => {
                i4[t4] && (a2[t4] = i4[t4]);
              }), Object.keys(a2).length && Ue.Xt(t3, a2, r4, s4, n3, o3);
            } catch (t4) {
              je.Ut(t4);
            }
          }, Jt(i4, e5) {
            try {
              null == t || t.localStorage.removeItem(i4), Ue.Jt(i4, e5);
            } catch (t3) {
              je.Ut(t3);
            }
          } });
        }(i2.cookie_persisted_properties || []), r3 = i2.persistence.toLowerCase();
        return "localstorage" === r3 && je.Yt() ? je : "localstorage+cookie" === r3 && e3.Yt() ? e3 : "sessionstorage" === r3 && We.Yt() ? We : "memory" === r3 ? He : "cookie" === r3 ? Ue : e3.Yt() ? e3 : Ue;
      }
      mr(t3) {
        var i2 = null != t3 ? t3 : this.Rt.feature_flag_cache_ttl_ms;
        if (!i2 || 0 >= i2) return false;
        var e3 = this.props[Ji];
        return !e3 || "number" != typeof e3 || Date.now() - e3 > i2;
      }
      properties() {
        var t3 = {};
        return be(this.props, (i2, e3) => {
          if (e3 === ji && O(i2)) {
            if (!this.mr()) for (var r3 = Object.keys(i2), s4 = 0; r3.length > s4; s4++) t3["$feature/" + r3[s4]] = i2[r3[s4]];
          } else -1 === ne.indexOf(e3) && (t3[e3] = i2);
        }), t3;
      }
      load() {
        if (!this.gr) {
          var t3 = this.tr.Gt(this.vr);
          t3 && (this.props = ye({}, t3));
        }
      }
      save() {
        this.gr || this.tr.Xt(this.vr, this.props, this.yr, this.br, this.wr, this.Rt.debug);
      }
      remove() {
        this.tr.Jt(this.vr, false), this.tr.Jt(this.vr, true);
      }
      clear() {
        this.remove(), this.props = {};
      }
      register_once(t3, i2, e3) {
        if (O(t3)) {
          C(i2) && (i2 = "None"), this.yr = C(e3) ? this._r : e3;
          var r3 = false;
          if (be(t3, (t4, e4) => {
            this.props.hasOwnProperty(e4) && this.props[e4] !== i2 || (this.props[e4] = t4, r3 = true);
          }), r3) return this.save(), true;
        }
        return false;
      }
      register(t3, i2) {
        if (O(t3)) {
          this.yr = C(i2) ? this._r : i2;
          var e3 = false;
          if (be(t3, (i3, r3) => {
            t3.hasOwnProperty(r3) && this.props[r3] !== i3 && (this.props[r3] = i3, e3 = true);
          }), e3) return this.save(), true;
        }
        return false;
      }
      unregister(t3) {
        t3 in this.props && (delete this.props[t3], this.save());
      }
      update_campaign_params() {
        if (!this.dr) {
          var t3 = dr(this.Rt.custom_campaign_params, this.Rt.mask_personal_data_properties, this.Rt.custom_personal_data_properties);
          I(xe(t3)) || this.register(t3), this.dr = true;
        }
      }
      update_search_keyword() {
        var t3;
        this.register((t3 = null == r ? void 0 : r.referrer) ? cr(t3) : {});
      }
      update_referrer_info() {
        var t3;
        this.register_once({ $referrer: _r(), $referring_domain: null != r && r.referrer && (null == (t3 = er(r.referrer)) ? void 0 : t3.host) || pr }, void 0);
      }
      set_initial_person_info() {
        this.props[Zi] || this.props[te] || this.register_once({ [ie]: gr(this.Rt.mask_personal_data_properties, this.Rt.custom_personal_data_properties) }, void 0);
      }
      get_initial_props() {
        var t3 = {};
        be([te, Zi], (i3) => {
          var e4 = this.props[i3];
          e4 && be(e4, function(i4, e5) {
            t3["$initial_" + S(e5)] = i4;
          });
        });
        var i2, e3, r3 = this.props[ie];
        if (r3) {
          var s4 = (i2 = mr(r3), e3 = {}, be(i2, function(t4, i3) {
            e3["$initial_" + S(i3)] = t4;
          }), e3);
          ye(t3, s4);
        }
        return t3;
      }
      safe_merge(t3) {
        return be(this.props, function(i2, e3) {
          e3 in t3 || (t3[e3] = i2);
        }), t3;
      }
      update_config(t3, i2, e3) {
        if (this._r = this.yr = t3.cookie_expiration, this.set_disabled(t3.disable_persistence || !!e3), this.set_cross_subdomain(t3.cross_subdomain_cookie), this.set_secure(t3.secure_cookie), t3.persistence !== i2.persistence || !((t4, i3) => {
          if (t4.length !== i3.length) return false;
          var e4 = [...t4].sort(), r4 = [...i3].sort();
          return e4.every((t5, i4) => t5 === r4[i4]);
        })(t3.cookie_persisted_properties || [], i2.cookie_persisted_properties || [])) {
          var r3 = this.pr(t3), s4 = this.props;
          this.clear(), this.tr = r3, this.props = s4, this.save();
        }
      }
      set_disabled(t3) {
        this.gr = t3, this.gr ? this.remove() : this.save();
      }
      set_cross_subdomain(t3) {
        t3 !== this.br && (this.br = t3, this.remove(), this.save());
      }
      set_secure(t3) {
        t3 !== this.wr && (this.wr = t3, this.remove(), this.save());
      }
      set_event_timer(t3, i2) {
        var e3 = this.props[ki] || {};
        e3[t3] = i2, this.props[ki] = e3, this.save();
      }
      remove_event_timer(t3) {
        var i2 = (this.props[ki] || {})[t3];
        return C(i2) || (delete this.props[ki][t3], this.save()), i2;
      }
      get_property(t3) {
        return this.props[t3];
      }
      set_property(t3, i2) {
        this.props[t3] = i2, this.save();
      }
    };
    Sr = { Activation: "events", Cancellation: "cancelEvents" };
    kr = { Popover: "popover", API: "api", Widget: "widget", ExternalSurvey: "external_survey" };
    Ir = { SHOWN: "survey shown", DISMISSED: "survey dismissed", SENT: "survey sent", ABANDONED: "survey abandoned" };
    Cr = { SURVEY_ID: "$survey_id", SURVEY_NAME: "$survey_name", SURVEY_RESPONSE: "$survey_response", SURVEY_ITERATION: "$survey_iteration", SURVEY_ITERATION_START_DATE: "$survey_iteration_start_date", SURVEY_PARTIALLY_COMPLETED: "$survey_partially_completed", SURVEY_SUBMISSION_ID: "$survey_submission_id", SURVEY_QUESTIONS: "$survey_questions", SURVEY_COMPLETED: "$survey_completed", PRODUCT_TOUR_ID: "$product_tour_id", SURVEY_LAST_SEEN_DATE: "$survey_last_seen_date" };
    Fr = { Popover: "popover", Inline: "inline" };
    Mr = { SHOWN: "product tour shown", DISMISSED: "product tour dismissed", COMPLETED: "product tour completed", STEP_SHOWN: "product tour step shown", STEP_COMPLETED: "product tour step completed", BUTTON_CLICKED: "product tour button clicked", STEP_SELECTOR_FAILED: "product tour step selector failed", BANNER_CONTAINER_SELECTOR_FAILED: "product tour banner container selector failed", BANNER_ACTION_CLICKED: "product tour banner action clicked" };
    Dr = { TOUR_ID: "$product_tour_id", TOUR_NAME: "$product_tour_name", TOUR_ITERATION: "$product_tour_iteration", TOUR_RENDER_REASON: "$product_tour_render_reason", TOUR_STEP_ID: "$product_tour_step_id", TOUR_STEP_ORDER: "$product_tour_step_order", TOUR_STEP_TYPE: "$product_tour_step_type", TOUR_DISMISS_REASON: "$product_tour_dismiss_reason", TOUR_BUTTON_TEXT: "$product_tour_button_text", TOUR_BUTTON_ACTION: "$product_tour_button_action", TOUR_BUTTON_LINK: "$product_tour_button_link", TOUR_BUTTON_TOUR_ID: "$product_tour_button_tour_id", TOUR_STEPS_COUNT: "$product_tour_steps_count", TOUR_STEP_SELECTOR: "$product_tour_step_selector", TOUR_STEP_SELECTOR_FOUND: "$product_tour_step_selector_found", TOUR_STEP_ELEMENT_TAG: "$product_tour_step_element_tag", TOUR_STEP_ELEMENT_ID: "$product_tour_step_element_id", TOUR_STEP_ELEMENT_CLASSES: "$product_tour_step_element_classes", TOUR_STEP_ELEMENT_TEXT: "$product_tour_step_element_text", TOUR_ERROR: "$product_tour_error", TOUR_MATCHES_COUNT: "$product_tour_matches_count", TOUR_FAILURE_PHASE: "$product_tour_failure_phase", TOUR_WAITED_FOR_ELEMENT: "$product_tour_waited_for_element", TOUR_WAIT_DURATION_MS: "$product_tour_wait_duration_ms", TOUR_BANNER_SELECTOR: "$product_tour_banner_selector", TOUR_LINKED_SURVEY_ID: "$product_tour_linked_survey_id", USE_MANUAL_SELECTOR: "$use_manual_selector", INFERENCE_DATA_PRESENT: "$inference_data_present", TOUR_LAST_SEEN_DATE: "$product_tour_last_seen_date", TOUR_TYPE: "$product_tour_type" };
    Lr = wi("[RateLimiter]");
    Ur = class {
      constructor(t3) {
        this.serverLimits = {}, this.lastEventRateLimited = false, this.checkForLimiting = (t4) => {
          var i2 = t4.text;
          if (i2 && i2.length) try {
            (JSON.parse(i2).quota_limited || []).forEach((t5) => {
              Lr.info((t5 || "events") + " is quota limited."), this.serverLimits[t5] = (/* @__PURE__ */ new Date()).getTime() + 6e4;
            });
          } catch (t5) {
            return void Lr.warn('could not rate limit - continuing. Error: "' + (null == t5 ? void 0 : t5.message) + '"', { text: i2 });
          }
        }, this.instance = t3, this.lastEventRateLimited = this.clientRateLimitContext(true).isRateLimited;
      }
      get captureEventsPerSecond() {
        var t3;
        return (null == (t3 = this.instance.config.rate_limiting) ? void 0 : t3.events_per_second) || 10;
      }
      get captureEventsBurstLimit() {
        var t3;
        return Math.max((null == (t3 = this.instance.config.rate_limiting) ? void 0 : t3.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond);
      }
      clientRateLimitContext(t3) {
        var i2, e3, r3;
        void 0 === t3 && (t3 = false);
        var { captureEventsBurstLimit: s4, captureEventsPerSecond: n3 } = this, o3 = (/* @__PURE__ */ new Date()).getTime(), a2 = null !== (i2 = null == (e3 = this.instance.persistence) ? void 0 : e3.get_property(Qi)) && void 0 !== i2 ? i2 : { tokens: s4, last: o3 };
        a2.tokens += (o3 - a2.last) / 1e3 * n3, a2.last = o3, a2.tokens > s4 && (a2.tokens = s4);
        var l2 = 1 > a2.tokens;
        return l2 || t3 || (a2.tokens = Math.max(0, a2.tokens - 1)), !l2 || this.lastEventRateLimited || t3 || this.instance.capture("$$client_ingestion_warning", { $$client_ingestion_warning_message: "posthog-js client rate limited. Config is set to " + n3 + " events per second and " + s4 + " events burst limit." }, { skip_client_rate_limiting: true }), this.lastEventRateLimited = l2, null == (r3 = this.instance.persistence) || r3.set_property(Qi, a2), { isRateLimited: l2, remainingTokens: a2.tokens };
      }
      isServerRateLimited(t3) {
        var i2 = this.serverLimits[t3 || "events"] || false;
        return false !== i2 && (/* @__PURE__ */ new Date()).getTime() < i2;
      }
    };
    Nr = wi("[RemoteConfig]");
    jr = class {
      constructor(t3) {
        this._instance = t3;
      }
      get remoteConfig() {
        var t3;
        return null == (t3 = h._POSTHOG_REMOTE_CONFIG) || null == (t3 = t3[this._instance.config.token]) ? void 0 : t3.config;
      }
      Ir(t3) {
        var i2, e3;
        null != (i2 = h.__PosthogExtensions__) && i2.loadExternalDependency ? null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this._instance, "remote-config", () => t3(this.remoteConfig)) : t3();
      }
      Cr(t3) {
        this._instance._send_request({ method: "GET", url: this._instance.requestRouter.endpointFor("assets", "/array/" + this._instance.config.token + "/config"), callback(i2) {
          t3(i2.json);
        } });
      }
      load() {
        try {
          if (this.remoteConfig) return Nr.info("Using preloaded remote config", this.remoteConfig), this.Sr(this.remoteConfig), void this.kr();
          if (this._instance.Tr()) return void Nr.warn("Remote config is disabled. Falling back to local config.");
          this.Ir((t3) => {
            if (!t3) return Nr.info("No config found after loading remote JS config. Falling back to JSON."), void this.Cr((t4) => {
              this.Sr(t4), this.kr();
            });
            this.Sr(t3), this.kr();
          });
        } catch (t3) {
          Nr.error("Error loading remote config", t3);
        }
      }
      stop() {
        this.Ar && (clearInterval(this.Ar), this.Ar = void 0);
      }
      refresh() {
        this._instance.Tr() || "hidden" === (null == r ? void 0 : r.visibilityState) || this._instance.reloadFeatureFlags();
      }
      kr() {
        var t3;
        if (!this.Ar) {
          var i2 = null !== (t3 = this._instance.config.remote_config_refresh_interval_ms) && void 0 !== t3 ? t3 : 3e5;
          0 !== i2 && (this.Ar = setInterval(() => {
            this.refresh();
          }, i2));
        }
      }
      Sr(t3) {
        var i2;
        t3 || Nr.error("Failed to fetch remote config from PostHog."), this._instance.Sr(null != t3 ? t3 : {}), false !== (null == t3 ? void 0 : t3.hasFeatureFlags) && (this._instance.config.advanced_disable_feature_flags_on_first_load || null == (i2 = this._instance.featureFlags) || i2.ensureFlagsLoaded());
      }
    };
    Br = { GZipJS: "gzip-js", Base64: "base64" };
    Hr = Uint8Array;
    qr = Uint16Array;
    Wr = Uint32Array;
    Vr = new Hr([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
    Yr = new Hr([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
    Gr = new Hr([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    Jr = function(t3, i2) {
      for (var e3 = new qr(31), r3 = 0; 31 > r3; ++r3) e3[r3] = i2 += 1 << t3[r3 - 1];
      var s4 = new Wr(e3[30]);
      for (r3 = 1; 30 > r3; ++r3) for (var n3 = e3[r3]; e3[r3 + 1] > n3; ++n3) s4[n3] = n3 - e3[r3] << 5 | r3;
      return [e3, s4];
    };
    Kr = Jr(Vr, 2);
    Xr = Kr[1];
    Kr[0][28] = 258, Xr[258] = 28;
    for (Qr = Jr(Yr, 0)[1], Zr = new qr(32768), ts = 0; 32768 > ts; ++ts) {
      is = (43690 & ts) >>> 1 | (21845 & ts) << 1;
      Zr[ts] = ((65280 & (is = (61680 & (is = (52428 & is) >>> 2 | (13107 & is) << 2)) >>> 4 | (3855 & is) << 4)) >>> 8 | (255 & is) << 8) >>> 1;
    }
    es = function(t3, i2, e3) {
      for (var r3 = t3.length, s4 = 0, n3 = new qr(i2); r3 > s4; ++s4) ++n3[t3[s4] - 1];
      var o3, a2 = new qr(i2);
      for (s4 = 0; i2 > s4; ++s4) a2[s4] = a2[s4 - 1] + n3[s4 - 1] << 1;
      if (e3) {
        o3 = new qr(1 << i2);
        var l2 = 15 - i2;
        for (s4 = 0; r3 > s4; ++s4) if (t3[s4]) for (var u2 = s4 << 4 | t3[s4], h2 = i2 - t3[s4], d2 = a2[t3[s4] - 1]++ << h2, v2 = d2 | (1 << h2) - 1; v2 >= d2; ++d2) o3[Zr[d2] >>> l2] = u2;
      } else for (o3 = new qr(r3), s4 = 0; r3 > s4; ++s4) o3[s4] = Zr[a2[t3[s4] - 1]++] >>> 15 - t3[s4];
      return o3;
    };
    rs = new Hr(288);
    for (ts = 0; 144 > ts; ++ts) rs[ts] = 8;
    for (ts = 144; 256 > ts; ++ts) rs[ts] = 9;
    for (ts = 256; 280 > ts; ++ts) rs[ts] = 7;
    for (ts = 280; 288 > ts; ++ts) rs[ts] = 8;
    ss = new Hr(32);
    for (ts = 0; 32 > ts; ++ts) ss[ts] = 5;
    ns = es(rs, 9, 0);
    os = es(ss, 5, 0);
    as = function(t3) {
      return (t3 / 8 >> 0) + (7 & t3 && 1);
    };
    ls = function(t3, i2, e3) {
      (null == e3 || e3 > t3.length) && (e3 = t3.length);
      var r3 = new (t3 instanceof qr ? qr : t3 instanceof Wr ? Wr : Hr)(e3 - i2);
      return r3.set(t3.subarray(i2, e3)), r3;
    };
    us = function(t3, i2, e3) {
      var r3 = i2 / 8 >> 0;
      t3[r3] |= e3 <<= 7 & i2, t3[r3 + 1] |= e3 >>> 8;
    };
    hs = function(t3, i2, e3) {
      var r3 = i2 / 8 >> 0;
      t3[r3] |= e3 <<= 7 & i2, t3[r3 + 1] |= e3 >>> 8, t3[r3 + 2] |= e3 >>> 16;
    };
    ds = function(t3, i2) {
      for (var e3 = [], r3 = 0; t3.length > r3; ++r3) t3[r3] && e3.push({ s: r3, f: t3[r3] });
      var s4 = e3.length, n3 = e3.slice();
      if (!s4) return [new Hr(0), 0];
      if (1 == s4) {
        var o3 = new Hr(e3[0].s + 1);
        return o3[e3[0].s] = 1, [o3, 1];
      }
      e3.sort(function(t4, i3) {
        return t4.f - i3.f;
      }), e3.push({ s: -1, f: 25001 });
      var a2 = e3[0], l2 = e3[1], u2 = 0, h2 = 1, d2 = 2;
      for (e3[0] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 }; h2 != s4 - 1; ) a2 = e3[e3[d2].f > e3[u2].f ? u2++ : d2++], l2 = e3[u2 != h2 && e3[d2].f > e3[u2].f ? u2++ : d2++], e3[h2++] = { s: -1, f: a2.f + l2.f, l: a2, r: l2 };
      var v2 = n3[0].s;
      for (r3 = 1; s4 > r3; ++r3) n3[r3].s > v2 && (v2 = n3[r3].s);
      var c3 = new qr(v2 + 1), f2 = vs(e3[h2 - 1], c3, 0);
      if (f2 > i2) {
        r3 = 0;
        var p2 = 0, _2 = f2 - i2, g2 = 1 << _2;
        for (n3.sort(function(t4, i3) {
          return c3[i3.s] - c3[t4.s] || t4.f - i3.f;
        }); s4 > r3; ++r3) {
          var m2 = n3[r3].s;
          if (i2 >= c3[m2]) break;
          p2 += g2 - (1 << f2 - c3[m2]), c3[m2] = i2;
        }
        for (p2 >>>= _2; p2 > 0; ) {
          var b2 = n3[r3].s;
          i2 > c3[b2] ? p2 -= 1 << i2 - c3[b2]++ - 1 : ++r3;
        }
        for (; r3 >= 0 && p2; --r3) {
          var y2 = n3[r3].s;
          c3[y2] == i2 && (--c3[y2], ++p2);
        }
        f2 = i2;
      }
      return [new Hr(c3), f2];
    };
    vs = function(t3, i2, e3) {
      return -1 == t3.s ? Math.max(vs(t3.l, i2, e3 + 1), vs(t3.r, i2, e3 + 1)) : i2[t3.s] = e3;
    };
    cs = function(t3) {
      for (var i2 = t3.length; i2 && !t3[--i2]; ) ;
      for (var e3 = new qr(++i2), r3 = 0, s4 = t3[0], n3 = 1, o3 = function(t4) {
        e3[r3++] = t4;
      }, a2 = 1; i2 >= a2; ++a2) if (t3[a2] == s4 && a2 != i2) ++n3;
      else {
        if (!s4 && n3 > 2) {
          for (; n3 > 138; n3 -= 138) o3(32754);
          n3 > 2 && (o3(n3 > 10 ? n3 - 11 << 5 | 28690 : n3 - 3 << 5 | 12305), n3 = 0);
        } else if (n3 > 3) {
          for (o3(s4), --n3; n3 > 6; n3 -= 6) o3(8304);
          n3 > 2 && (o3(n3 - 3 << 5 | 8208), n3 = 0);
        }
        for (; n3--; ) o3(s4);
        n3 = 1, s4 = t3[a2];
      }
      return [e3.subarray(0, r3), i2];
    };
    fs = function(t3, i2) {
      for (var e3 = 0, r3 = 0; i2.length > r3; ++r3) e3 += t3[r3] * i2[r3];
      return e3;
    };
    ps = function(t3, i2, e3) {
      var r3 = e3.length, s4 = as(i2 + 2);
      t3[s4] = 255 & r3, t3[s4 + 1] = r3 >>> 8, t3[s4 + 2] = 255 ^ t3[s4], t3[s4 + 3] = 255 ^ t3[s4 + 1];
      for (var n3 = 0; r3 > n3; ++n3) t3[s4 + n3 + 4] = e3[n3];
      return 8 * (s4 + 4 + r3);
    };
    _s = function(t3, i2, e3, r3, s4, n3, o3, a2, l2, u2, h2) {
      us(i2, h2++, e3), ++s4[256];
      for (var d2 = ds(s4, 15), v2 = d2[0], c3 = d2[1], f2 = ds(n3, 15), p2 = f2[0], _2 = f2[1], g2 = cs(v2), m2 = g2[0], b2 = g2[1], y2 = cs(p2), w2 = y2[0], E2 = y2[1], S2 = new qr(19), x2 = 0; m2.length > x2; ++x2) S2[31 & m2[x2]]++;
      for (x2 = 0; w2.length > x2; ++x2) S2[31 & w2[x2]]++;
      for (var T2 = ds(S2, 7), k2 = T2[0], R2 = T2[1], P2 = 19; P2 > 4 && !k2[Gr[P2 - 1]]; --P2) ;
      var O2, I2, C2, F2, A2 = u2 + 5 << 3, M2 = fs(s4, rs) + fs(n3, ss) + o3, D2 = fs(s4, v2) + fs(n3, p2) + o3 + 14 + 3 * P2 + fs(S2, k2) + (2 * S2[16] + 3 * S2[17] + 7 * S2[18]);
      if (M2 >= A2 && D2 >= A2) return ps(i2, h2, t3.subarray(l2, l2 + u2));
      if (us(i2, h2, 1 + (M2 > D2)), h2 += 2, M2 > D2) {
        O2 = es(v2, c3, 0), I2 = v2, C2 = es(p2, _2, 0), F2 = p2;
        var L2 = es(k2, R2, 0);
        for (us(i2, h2, b2 - 257), us(i2, h2 + 5, E2 - 1), us(i2, h2 + 10, P2 - 4), h2 += 14, x2 = 0; P2 > x2; ++x2) us(i2, h2 + 3 * x2, k2[Gr[x2]]);
        h2 += 3 * P2;
        for (var U2 = [m2, w2], N2 = 0; 2 > N2; ++N2) {
          var j2 = U2[N2];
          for (x2 = 0; j2.length > x2; ++x2) us(i2, h2, L2[z2 = 31 & j2[x2]]), h2 += k2[z2], z2 > 15 && (us(i2, h2, j2[x2] >>> 5 & 127), h2 += j2[x2] >>> 12);
        }
      } else O2 = ns, I2 = rs, C2 = os, F2 = ss;
      for (x2 = 0; a2 > x2; ++x2) if (r3[x2] > 255) {
        var z2;
        hs(i2, h2, O2[257 + (z2 = r3[x2] >>> 18 & 31)]), h2 += I2[z2 + 257], z2 > 7 && (us(i2, h2, r3[x2] >>> 23 & 31), h2 += Vr[z2]);
        var B2 = 31 & r3[x2];
        hs(i2, h2, C2[B2]), h2 += F2[B2], B2 > 3 && (hs(i2, h2, r3[x2] >>> 5 & 8191), h2 += Yr[B2]);
      } else hs(i2, h2, O2[r3[x2]]), h2 += I2[r3[x2]];
      return hs(i2, h2, O2[256]), h2 + I2[256];
    };
    gs = new Wr([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
    ms = function() {
      for (var t3 = new Wr(256), i2 = 0; 256 > i2; ++i2) {
        for (var e3 = i2, r3 = 9; --r3; ) e3 = (1 & e3 && 3988292384) ^ e3 >>> 1;
        t3[i2] = e3;
      }
      return t3;
    }();
    bs = function(t3, i2, e3) {
      for (; e3; ++i2) t3[i2] = e3, e3 >>>= 8;
    };
    ws = !!o || !!n;
    Es = "text/plain";
    Ss = function(t3, i2, e3) {
      var r3;
      void 0 === e3 && (e3 = true);
      var [s4, n3] = t3.split("?"), o3 = p({}, i2), a2 = null !== (r3 = null == n3 ? void 0 : n3.split("&").map((t4) => {
        var i3, [r4, s5] = t4.split("="), n4 = e3 && null !== (i3 = o3[r4]) && void 0 !== i3 ? i3 : s5;
        return delete o3[r4], r4 + "=" + n4;
      })) && void 0 !== r3 ? r3 : [], l2 = function(t4, i3) {
        var e4, r4;
        void 0 === i3 && (i3 = "&");
        var s5 = [];
        return be(t4, function(t5, i4) {
          C(t5) || C(i4) || "undefined" === i4 || (e4 = encodeURIComponent(((t6) => t6 instanceof File)(t5) ? t5.name : t5.toString()), r4 = encodeURIComponent(i4), s5[s5.length] = r4 + "=" + e4);
        }), s5.join(i3);
      }(o3);
      return l2 && a2.push(l2), s4 + "?" + a2.join("&");
    };
    xs = (t3, i2) => JSON.stringify(t3, (t4, i3) => "bigint" == typeof i3 ? i3.toString() : i3, i2);
    Ts = (t3) => {
      if (t3.zt) return t3.zt;
      var { data: i2, compression: e3 } = t3;
      if (i2) {
        if (e3 === Br.GZipJS) {
          var r3 = ys(function(t4, i3) {
            var e4 = t4.length;
            if ("undefined" != typeof TextEncoder) return new TextEncoder().encode(t4);
            for (var r4 = new Hr(t4.length + (t4.length >>> 1)), s5 = 0, n4 = function(t5) {
              r4[s5++] = t5;
            }, o4 = 0; e4 > o4; ++o4) {
              if (s5 + 5 > r4.length) {
                var a2 = new Hr(s5 + 8 + (e4 - o4 << 1));
                a2.set(r4), r4 = a2;
              }
              var l2 = t4.charCodeAt(o4);
              128 > l2 ? n4(l2) : 2048 > l2 ? (n4(192 | l2 >>> 6), n4(128 | 63 & l2)) : l2 > 55295 && 57344 > l2 ? (n4(240 | (l2 = 65536 + (1047552 & l2) | 1023 & t4.charCodeAt(++o4)) >>> 18), n4(128 | l2 >>> 12 & 63), n4(128 | l2 >>> 6 & 63), n4(128 | 63 & l2)) : (n4(224 | l2 >>> 12), n4(128 | l2 >>> 6 & 63), n4(128 | 63 & l2));
            }
            return ls(r4, 0, s5);
          }(xs(i2)), { mtime: 0 });
          return { contentType: Es, body: r3.buffer.slice(r3.byteOffset, r3.byteOffset + r3.byteLength), estimatedSize: r3.byteLength };
        }
        if (e3 === Br.Base64) {
          var s4 = function(t4) {
            return t4 ? btoa(encodeURIComponent(t4).replace(/%([0-9A-F]{2})/g, (t5, i3) => String.fromCharCode(parseInt(i3, 16)))) : t4;
          }(xs(i2)), n3 = ((t4) => "data=" + encodeURIComponent("string" == typeof t4 ? t4 : xs(t4)))(s4);
          return { contentType: "application/x-www-form-urlencoded", body: n3, estimatedSize: new Blob([n3]).size };
        }
        var o3 = xs(i2);
        return { contentType: "application/json", body: o3, estimatedSize: new Blob([o3]).size };
      }
    };
    $s = function() {
      var t3 = f(function* (t4) {
        var i2 = xs(t4.data), e3 = yield function(t5, i3) {
          return g.apply(this, arguments);
        }(i2, v.DEBUG);
        if (!e3) return t4;
        var r3 = yield e3.arrayBuffer();
        return p({}, t4, { zt: { contentType: Es, body: r3, estimatedSize: r3.byteLength } });
      });
      return function(i2) {
        return t3.apply(this, arguments);
      };
    }();
    ks = [];
    n && ks.push({ transport: "fetch", method(t3) {
      var i2, e3, { contentType: r3, body: s4, estimatedSize: o3 } = null !== (i2 = Ts(t3)) && void 0 !== i2 ? i2 : {}, l2 = new Headers();
      be(t3.headers, function(t4, i3) {
        l2.append(i3, t4);
      }), r3 && l2.append("Content-Type", r3);
      var u2 = t3.url, h2 = null;
      if (a) {
        var d2 = new a();
        h2 = { signal: d2.signal, timeout: setTimeout(() => d2.abort(), t3.timeout) };
      }
      n(u2, p({ method: (null == t3 ? void 0 : t3.method) || "GET", headers: l2, keepalive: "POST" === t3.method && 52428.8 > (o3 || 0), body: s4, signal: null == (e3 = h2) ? void 0 : e3.signal }, t3.fetchOptions)).then((i3) => i3.text().then((e4) => {
        var r4 = { statusCode: i3.status, text: e4 };
        if (200 === i3.status) try {
          r4.json = JSON.parse(e4);
        } catch (t4) {
          yi.error(t4);
        }
        null == t3.callback || t3.callback(r4);
      })).catch((i3) => {
        yi.error(i3), null == t3.callback || t3.callback({ statusCode: 0, error: i3 });
      }).finally(() => h2 ? clearTimeout(h2.timeout) : null);
    } }), o && ks.push({ transport: "XHR", method(t3) {
      var i2, e3 = new o();
      e3.open(t3.method || "GET", t3.url, true);
      var { contentType: r3, body: s4 } = null !== (i2 = Ts(t3)) && void 0 !== i2 ? i2 : {};
      be(t3.headers, function(t4, i3) {
        e3.setRequestHeader(i3, t4);
      }), r3 && e3.setRequestHeader("Content-Type", r3), t3.timeout && (e3.timeout = t3.timeout), t3.disableXHRCredentials || (e3.withCredentials = true), e3.onreadystatechange = () => {
        if (4 === e3.readyState) {
          var i3 = { statusCode: e3.status, text: e3.responseText };
          if (200 === e3.status) try {
            i3.json = JSON.parse(e3.responseText);
          } catch (t4) {
          }
          null == t3.callback || t3.callback(i3);
        }
      }, e3.send(s4);
    } }), null != e && e.sendBeacon && ks.push({ transport: "sendBeacon", method(t3) {
      var i2 = Ss(t3.url, { beacon: "1" });
      try {
        var r3, { contentType: s4, body: n3 } = null !== (r3 = Ts(t3)) && void 0 !== r3 ? r3 : {};
        if (!n3) return;
        var o3 = n3 instanceof Blob ? n3 : new Blob([n3], { type: s4 });
        e.sendBeacon(i2, o3);
      } catch (t4) {
      }
    } });
    Rs = 3e3;
    Ps = class {
      constructor(t3, i2) {
        this.Er = true, this.Rr = [], this.Nr = G((null == i2 ? void 0 : i2.flush_interval_ms) || Rs, 250, 5e3, yi.createLogger("flush interval"), Rs), this.Mr = t3;
      }
      enqueue(t3) {
        this.Rr.push(t3), this.Fr || this.Or();
      }
      unload() {
        this.Pr();
        var t3 = this.Rr.length > 0 ? this.Lr() : {}, i2 = Object.values(t3);
        [...i2.filter((t4) => 0 === t4.url.indexOf("/e")), ...i2.filter((t4) => 0 !== t4.url.indexOf("/e"))].map((t4) => {
          this.Mr(p({}, t4, { transport: "sendBeacon" }));
        });
      }
      enable() {
        this.Er = false, this.Or();
      }
      Or() {
        var t3 = this;
        this.Er || (this.Fr = setTimeout(() => {
          if (this.Pr(), this.Rr.length > 0) {
            var i2 = this.Lr(), e3 = function() {
              var e4 = i2[r3], s4 = (/* @__PURE__ */ new Date()).getTime();
              e4.data && R(e4.data) && be(e4.data, (t4) => {
                t4.offset = Math.abs(t4.timestamp - s4), delete t4.timestamp;
              }), t3.Mr(e4);
            };
            for (var r3 in i2) e3();
          }
        }, this.Nr));
      }
      Pr() {
        clearTimeout(this.Fr), this.Fr = void 0;
      }
      Lr() {
        var t3 = {};
        return be(this.Rr, (i2) => {
          var e3, r3 = i2, s4 = (r3 ? r3.batchKey : null) || r3.url;
          C(t3[s4]) && (t3[s4] = p({}, r3, { data: [] })), null == (e3 = t3[s4].data) || e3.push(r3.data);
        }), this.Rr = [], t3;
      }
    };
    Os = ["retriesPerformedSoFar"];
    Is = class {
      constructor(i2) {
        this.Dr = false, this.Br = 3e3, this.Rr = [], this._instance = i2, this.Rr = [], this.jr = true, !C(t) && "onLine" in t.navigator && (this.jr = t.navigator.onLine, this.qr = () => {
          this.jr = true, this.Zr();
        }, this.$r = () => {
          this.jr = false;
        }, ke(t, "online", this.qr), ke(t, "offline", this.$r));
      }
      get length() {
        return this.Rr.length;
      }
      retriableRequest(t3) {
        var { retriesPerformedSoFar: i2 } = t3, e3 = _(t3, Os);
        U(i2) && (e3.url = Ss(e3.url, { retry_count: i2 })), this._instance._send_request(p({}, e3, { callback: (t4) => {
          200 === t4.statusCode || t4.statusCode >= 400 && 500 > t4.statusCode || (null != i2 ? i2 : 0) >= 10 ? null == e3.callback || e3.callback(t4) : this.Hr(p({ retriesPerformedSoFar: i2 }, e3));
        } }));
      }
      Hr(t3) {
        var i2 = t3.retriesPerformedSoFar || 0;
        t3.retriesPerformedSoFar = i2 + 1;
        var e3 = function(t4) {
          var i3 = 3e3 * Math.pow(2, t4), e4 = i3 / 2, r4 = Math.min(18e5, i3), s5 = Math.random() - 0.5;
          return Math.ceil(r4 + s5 * (r4 - e4));
        }(i2), r3 = Date.now() + e3;
        this.Rr.push({ retryAt: r3, requestOptions: t3 });
        var s4 = "Enqueued failed request for retry in " + e3;
        navigator.onLine || (s4 += " (Browser is offline)"), yi.warn(s4), this.Dr || (this.Dr = true, this.Vr());
      }
      Vr() {
        if (this.zr && clearTimeout(this.zr), 0 === this.Rr.length) return this.Dr = false, void (this.zr = void 0);
        this.zr = setTimeout(() => {
          this.jr && this.Rr.length > 0 && this.Zr(), this.Vr();
        }, this.Br);
      }
      Zr() {
        var t3 = Date.now(), i2 = [], e3 = this.Rr.filter((e4) => t3 > e4.retryAt || (i2.push(e4), false));
        if (this.Rr = i2, e3.length > 0) for (var { requestOptions: r3 } of e3) this.retriableRequest(r3);
      }
      unload() {
        for (var { requestOptions: i2 } of (this.zr && (clearTimeout(this.zr), this.zr = void 0), this.Dr = false, C(t) || (this.qr && (t.removeEventListener("online", this.qr), this.qr = void 0), this.$r && (t.removeEventListener("offline", this.$r), this.$r = void 0)), this.Rr)) try {
          this._instance._send_request(p({}, i2, { transport: "sendBeacon" }));
        } catch (t3) {
          yi.error(t3);
        }
        this.Rr = [];
      }
    };
    Cs = class {
      constructor(t3) {
        this.Yr = () => {
          var t4, i2, e3, r3;
          this.Ur || (this.Ur = {});
          var s4 = this.scrollElement(), n3 = this.scrollY(), o3 = s4 ? Math.max(0, s4.scrollHeight - s4.clientHeight) : 0, a2 = n3 + ((null == s4 ? void 0 : s4.clientHeight) || 0), l2 = (null == s4 ? void 0 : s4.scrollHeight) || 0;
          this.Ur.lastScrollY = Math.ceil(n3), this.Ur.maxScrollY = Math.max(n3, null !== (t4 = this.Ur.maxScrollY) && void 0 !== t4 ? t4 : 0), this.Ur.maxScrollHeight = Math.max(o3, null !== (i2 = this.Ur.maxScrollHeight) && void 0 !== i2 ? i2 : 0), this.Ur.lastContentY = a2, this.Ur.maxContentY = Math.max(a2, null !== (e3 = this.Ur.maxContentY) && void 0 !== e3 ? e3 : 0), this.Ur.maxContentHeight = Math.max(l2, null !== (r3 = this.Ur.maxContentHeight) && void 0 !== r3 ? r3 : 0);
        }, this._instance = t3;
      }
      get Wr() {
        return this._instance.config.scroll_root_selector;
      }
      getContext() {
        return this.Ur;
      }
      resetContext() {
        var t3 = this.Ur;
        return setTimeout(this.Yr, 0), t3;
      }
      startMeasuringScrollPosition() {
        ke(t, "scroll", this.Yr, { capture: true }), ke(t, "scrollend", this.Yr, { capture: true }), ke(t, "resize", this.Yr);
      }
      scrollElement() {
        if (!this.Wr) return null == t ? void 0 : t.document.documentElement;
        var i2 = R(this.Wr) ? this.Wr : [this.Wr];
        for (var e3 of i2) {
          var r3 = null == t ? void 0 : t.document.querySelector(e3);
          if (r3) return r3;
        }
      }
      scrollY() {
        if (this.Wr) {
          var i2 = this.scrollElement();
          return i2 && i2.scrollTop || 0;
        }
        return t && (t.scrollY || t.pageYOffset || t.document.documentElement.scrollTop) || 0;
      }
      scrollX() {
        if (this.Wr) {
          var i2 = this.scrollElement();
          return i2 && i2.scrollLeft || 0;
        }
        return t && (t.scrollX || t.pageXOffset || t.document.documentElement.scrollLeft) || 0;
      }
    };
    Fs = (t3) => gr(null == t3 ? void 0 : t3.config.mask_personal_data_properties, null == t3 ? void 0 : t3.config.custom_personal_data_properties);
    As = class {
      constructor(t3, i2, e3, r3) {
        this.Gr = (t4) => {
          var i3 = this.Xr();
          if (!i3 || i3.sessionId !== t4) {
            var e4 = { sessionId: t4, props: this.Jr(this._instance) };
            this.Kr.register({ [Xi]: e4 });
          }
        }, this._instance = t3, this.Qr = i2, this.Kr = e3, this.Jr = r3 || Fs, this.Qr.onSessionId(this.Gr);
      }
      Xr() {
        return this.Kr.props[Xi];
      }
      getSetOnceProps() {
        var t3, i2 = null == (t3 = this.Xr()) ? void 0 : t3.props;
        return i2 ? "r" in i2 ? mr(i2) : { $referring_domain: i2.referringDomain, $pathname: i2.initialPathName, utm_source: i2.utm_source, utm_campaign: i2.utm_campaign, utm_medium: i2.utm_medium, utm_content: i2.utm_content, utm_term: i2.utm_term } : {};
      }
      getSessionProps() {
        var t3 = {};
        return be(xe(this.getSetOnceProps()), (i2, e3) => {
          "$current_url" === e3 && (e3 = "url"), t3["$session_entry_" + S(e3)] = i2;
        }), t3;
      }
    };
    Ms = class {
      constructor() {
        this.ti = {};
      }
      on(t3, i2) {
        return this.ti[t3] || (this.ti[t3] = []), this.ti[t3].push(i2), () => {
          this.ti[t3] = this.ti[t3].filter((t4) => t4 !== i2);
        };
      }
      emit(t3, i2) {
        for (var e3 of this.ti[t3] || []) e3(i2);
        for (var r3 of this.ti["*"] || []) r3(t3, i2);
      }
    };
    Ds = wi("[SessionId]");
    Ls = class {
      on(t3, i2) {
        return this.ei.on(t3, i2);
      }
      constructor(t3, i2, e3) {
        var r3;
        if (this.ri = [], this.ii = void 0, this.ei = new Ms(), this.ni = (t4, i3) => !(!U(t4) || !U(i3)) && Math.abs(t4 - i3) > this.sessionTimeoutMs, !t3.persistence) throw new Error("SessionIdManager requires a PostHogPersistence instance");
        if (t3.config.cookieless_mode === le) throw new Error('SessionIdManager cannot be used with cookieless_mode="always"');
        this.Rt = t3.config, this.Kr = t3.persistence, this.si = void 0, this.oi = void 0, this._sessionStartTimestamp = null, this._sessionActivityTimestamp = null, this.ai = i2 || Ae, this.li = e3 || Ae;
        var s4 = this.Rt.persistence_name || this.Rt.token;
        if (this._sessionTimeoutMs = 1e3 * G(this.Rt.session_idle_timeout_seconds || 1800, 60, 36e3, Ds.createLogger("session_idle_timeout_seconds"), 1800), t3.register({ $configured_session_timeout_ms: this._sessionTimeoutMs }), this.ui(), this.hi = "ph_" + s4 + "_window_id", this.ci = "ph_" + s4 + "_primary_window_exists", this.di()) {
          var n3 = We.Gt(this.hi), o3 = We.Gt(this.ci);
          n3 && !o3 ? this.si = n3 : We.Jt(this.hi), We.Xt(this.ci, true);
        }
        if (null != (r3 = this.Rt.bootstrap) && r3.sessionID) try {
          var a2 = ((t4) => {
            var i3 = this.Rt.bootstrap.sessionID.replace(/-/g, "");
            if (32 !== i3.length) throw new Error("Not a valid UUID");
            if ("7" !== i3[12]) throw new Error("Not a UUIDv7");
            return parseInt(i3.substring(0, 12), 16);
          })();
          this.vi(this.Rt.bootstrap.sessionID, (/* @__PURE__ */ new Date()).getTime(), a2);
        } catch (t4) {
          Ds.error("Invalid sessionID in bootstrap", t4);
        }
        this.fi();
      }
      get sessionTimeoutMs() {
        return this._sessionTimeoutMs;
      }
      onSessionId(t3) {
        return C(this.ri) && (this.ri = []), this.ri.push(t3), this.oi && t3(this.oi, this.si), () => {
          this.ri = this.ri.filter((i2) => i2 !== t3);
        };
      }
      di() {
        return "memory" !== this.Rt.persistence && !this.Kr.gr && We.Yt();
      }
      pi(t3) {
        t3 !== this.si && (this.si = t3, this.di() && We.Xt(this.hi, t3));
      }
      gi() {
        return this.si ? this.si : this.di() ? We.Gt(this.hi) : null;
      }
      vi(t3, i2, e3) {
        t3 === this.oi && i2 === this._sessionActivityTimestamp && e3 === this._sessionStartTimestamp || (this._sessionStartTimestamp = e3, this._sessionActivityTimestamp = i2, this.oi = t3, this.Kr.register({ [Ui]: [i2, t3, e3] }));
      }
      mi() {
        var t3 = this.Kr.props[Ui];
        return R(t3) && 2 === t3.length && t3.push(t3[0]), t3 || [0, null, 0];
      }
      resetSessionId() {
        this.vi(null, null, null);
      }
      destroy() {
        clearTimeout(this.yi), this.yi = void 0, this.ii && t && (t.removeEventListener(ce, this.ii, { capture: false }), this.ii = void 0), this.ri = [];
      }
      fi() {
        this.ii = () => {
          this.di() && We.Jt(this.ci);
        }, ke(t, ce, this.ii, { capture: false });
      }
      checkAndGetSessionAndWindowId(t3, i2) {
        if (void 0 === t3 && (t3 = false), void 0 === i2 && (i2 = null), this.Rt.cookieless_mode === le) throw new Error('checkAndGetSessionAndWindowId should not be called with cookieless_mode="always"');
        var e3 = i2 || (/* @__PURE__ */ new Date()).getTime(), [r3, s4, n3] = this.mi(), o3 = this.gi(), a2 = U(n3) && Math.abs(e3 - n3) > 864e5, l2 = false, u2 = !s4, h2 = !u2 && !t3 && this.ni(e3, r3);
        u2 || h2 || a2 ? (s4 = this.ai(), o3 = this.li(), Ds.info("new session ID generated", { sessionId: s4, windowId: o3, changeReason: { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } }), n3 = e3, l2 = true) : o3 || (o3 = this.li(), l2 = true);
        var d2 = U(r3) && t3 && !a2 ? r3 : e3, v2 = U(n3) ? n3 : (/* @__PURE__ */ new Date()).getTime();
        return this.pi(o3), this.vi(s4, d2, v2), t3 || this.ui(), l2 && this.ri.forEach((t4) => t4(s4, o3, l2 ? { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } : void 0)), { sessionId: s4, windowId: o3, sessionStartTimestamp: v2, changeReason: l2 ? { noSessionId: u2, activityTimeout: h2, sessionPastMaximumLength: a2 } : void 0, lastActivityTimestamp: r3 };
      }
      ui() {
        clearTimeout(this.yi), this.yi = setTimeout(() => {
          var [t3] = this.mi();
          if (this.ni((/* @__PURE__ */ new Date()).getTime(), t3)) {
            var i2 = this.oi;
            this.resetSessionId(), this.ei.emit("forcedIdleReset", { idleSessionId: i2 });
          }
        }, 1.1 * this.sessionTimeoutMs);
      }
    };
    Us = function(t3, i2) {
      if (!t3) return false;
      var e3 = t3.userAgent;
      if (e3 && y(e3, i2)) return true;
      try {
        var r3 = null == t3 ? void 0 : t3.userAgentData;
        if (null != r3 && r3.brands && r3.brands.some((t4) => y(null == t4 ? void 0 : t4.brand, i2))) return true;
      } catch (t4) {
      }
      return !!t3.webdriver;
    };
    Ns = function(t3, i2) {
      if (!function(t4) {
        try {
          new RegExp(t4);
        } catch (t5) {
          return false;
        }
        return true;
      }(i2)) return false;
      try {
        return new RegExp(i2).test(t3);
      } catch (t4) {
        return false;
      }
    };
    zs = { exact: (t3, i2) => i2.some((i3) => t3.some((t4) => i3 === t4)), is_not: (t3, i2) => i2.every((i3) => t3.every((t4) => i3 !== t4)), regex: (t3, i2) => i2.some((i3) => t3.some((t4) => Ns(i3, t4))), not_regex: (t3, i2) => i2.every((i3) => t3.every((t4) => !Ns(i3, t4))), icontains: (t3, i2) => i2.map(Bs).some((i3) => t3.map(Bs).some((t4) => i3.includes(t4))), not_icontains: (t3, i2) => i2.map(Bs).every((i3) => t3.map(Bs).every((t4) => !i3.includes(t4))), gt: (t3, i2) => i2.some((i3) => {
      var e3 = parseFloat(i3);
      return !isNaN(e3) && t3.some((t4) => e3 > parseFloat(t4));
    }), lt: (t3, i2) => i2.some((i3) => {
      var e3 = parseFloat(i3);
      return !isNaN(e3) && t3.some((t4) => e3 < parseFloat(t4));
    }) };
    Bs = (t3) => t3.toLowerCase();
    qs = "custom";
    Ws = "i.posthog.com";
    Vs = class {
      constructor(t3) {
        this.bi = {}, this.instance = t3;
      }
      get apiHost() {
        var t3 = this.instance.config.api_host.trim().replace(/\/$/, "");
        return "https://app.posthog.com" === t3 ? "https://us.i.posthog.com" : t3;
      }
      get flagsApiHost() {
        var t3 = this.instance.config.flags_api_host;
        return t3 ? t3.trim().replace(/\/$/, "") : this.apiHost;
      }
      get uiHost() {
        var t3, i2 = null == (t3 = this.instance.config.ui_host) ? void 0 : t3.replace(/\/$/, "");
        return i2 || (i2 = this.apiHost.replace("." + Ws, ".posthog.com")), "https://app.posthog.com" === i2 ? "https://us.posthog.com" : i2;
      }
      get region() {
        return this.bi[this.apiHost] || (this.bi[this.apiHost] = /https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "us" : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "eu" : qs), this.bi[this.apiHost];
      }
      endpointFor(t3, i2) {
        if (void 0 === i2 && (i2 = ""), i2 && (i2 = "/" === i2[0] ? i2 : "/" + i2), "ui" === t3) return this.uiHost + i2;
        if ("flags" === t3) return this.flagsApiHost + i2;
        if (this.region === qs) return this.apiHost + i2;
        var e3 = Ws + i2;
        switch (t3) {
          case "assets":
            return "https://" + this.region + "-assets." + e3;
          case "api":
            return "https://" + this.region + "." + e3;
        }
      }
    };
    Ys = wi("[Surveys]");
    Gs = "seenSurvey_";
    Js = (t3, i2) => {
      var e3 = "$survey_" + i2 + "/" + t3.id;
      return t3.current_iteration && t3.current_iteration > 0 && (e3 = "$survey_" + i2 + "/" + t3.id + "/" + t3.current_iteration), e3;
    };
    Ks = (t3) => ((t4, i2) => {
      var e3 = "" + Gs + i2.id;
      return i2.current_iteration && i2.current_iteration > 0 && (e3 = "" + Gs + i2.id + "_" + i2.current_iteration), e3;
    })(0, t3);
    Xs = [kr.Popover, kr.Widget, kr.API];
    Qs = { ignoreConditions: false, ignoreDelay: false, displayType: Fr.Popover };
    Zs = wi("[PostHog ExternalIntegrations]");
    tn = { intercom: "intercom-integration", crispChat: "crisp-chat-integration" };
    en = class {
      constructor(t3) {
        this._instance = t3;
      }
      nr(t3, i2) {
        var e3;
        null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this._instance, t3, (t4) => {
          if (t4) return Zs.error("failed to load script", t4);
          i2();
        });
      }
      startIfEnabledOrStop() {
        var t3 = this, i2 = function(i3) {
          var e4, s5, n3;
          !r3 || null != (e4 = h.__PosthogExtensions__) && null != (e4 = e4.integrations) && e4[i3] || t3.nr(tn[i3], () => {
            var e5;
            null == (e5 = h.__PosthogExtensions__) || null == (e5 = e5.integrations) || null == (e5 = e5[i3]) || e5.start(t3._instance);
          }), !r3 && null != (s5 = h.__PosthogExtensions__) && null != (s5 = s5.integrations) && s5[i3] && (null == (n3 = h.__PosthogExtensions__) || null == (n3 = n3.integrations) || null == (n3 = n3[i3]) || n3.stop());
        };
        for (var [e3, r3] of Object.entries(null !== (s4 = this._instance.config.integrations) && void 0 !== s4 ? s4 : {})) {
          var s4;
          i2(e3);
        }
      }
    };
    rn = {};
    sn = 0;
    nn = () => {
    };
    on = 'Consent opt in/out is not valid with cookieless_mode="always" and will be ignored';
    an = "Surveys module not available";
    ln = "sanitize_properties is deprecated. Use before_send instead";
    un = "Invalid value for property_denylist config: ";
    hn = "posthog";
    dn = !ws && -1 === (null == u ? void 0 : u.indexOf("MSIE")) && -1 === (null == u ? void 0 : u.indexOf("Mozilla"));
    vn = (i2) => {
      var e3;
      return p({ api_host: "https://us.i.posthog.com", flags_api_host: null, ui_host: null, token: "", autocapture: true, cross_subdomain_cookie: $e(null == r ? void 0 : r.location), persistence: "localStorage+cookie", persistence_name: "", cookie_persisted_properties: [], loaded: nn, save_campaign_params: true, custom_campaign_params: [], custom_blocked_useragents: [], save_referrer: true, capture_pageleave: "if_capture_pageview", defaults: null != i2 ? i2 : "unset", __preview_deferred_init_extensions: false, debug: s2 && F(null == s2 ? void 0 : s2.search) && -1 !== s2.search.indexOf("__posthog_debug=true") || false, cookie_expiration: 365, upgrade: false, disable_session_recording: false, disable_persistence: false, disable_web_experiments: true, disable_surveys: false, disable_surveys_automatic_display: false, disable_conversations: false, disable_product_tours: false, disable_external_dependency_loading: false, enable_recording_console_log: void 0, secure_cookie: "https:" === (null == t || null == (e3 = t.location) ? void 0 : e3.protocol), ip: false, opt_out_capturing_by_default: false, opt_out_persistence_by_default: false, opt_out_useragent_filter: false, opt_out_capturing_persistence_type: "localStorage", consent_persistence_name: null, opt_out_capturing_cookie_prefix: null, opt_in_site_apps: false, property_denylist: [], respect_dnt: false, sanitize_properties: null, request_headers: {}, request_batching: true, properties_string_max_length: 65535, mask_all_element_attributes: false, mask_all_text: false, mask_personal_data_properties: false, custom_personal_data_properties: [], advanced_disable_flags: false, advanced_disable_decide: false, advanced_disable_feature_flags: false, advanced_disable_feature_flags_on_first_load: false, advanced_only_evaluate_survey_feature_flags: false, advanced_feature_flags_dedup_per_session: false, advanced_enable_surveys: false, advanced_disable_toolbar_metrics: false, feature_flag_request_timeout_ms: 3e3, surveys_request_timeout_ms: 1e4, on_request_error(t3) {
        yi.error("Bad HTTP status: " + t3.statusCode + " " + t3.text);
      }, get_device_id: (t3) => t3, capture_performance: void 0, name: "posthog", bootstrap: {}, disable_compression: false, session_idle_timeout_seconds: 1800, person_profiles: de, before_send: void 0, request_queue_config: { flush_interval_ms: Rs }, error_tracking: {}, _onCapture: nn, __preview_eager_load_replay: false }, ((t3) => ({ rageclick: !t3 || "2025-11-30" > t3 || { content_ignorelist: true }, capture_pageview: !t3 || "2025-05-24" > t3 || "history_change", session_recording: t3 && t3 >= "2025-11-30" ? { strictMinimumDuration: true } : {}, external_scripts_inject_target: t3 && t3 >= "2026-01-30" ? "head" : "body", internal_or_test_user_hostname: t3 && t3 >= "2026-01-30" ? /^(localhost|127\.0\.0\.1)$/ : void 0 }))(i2));
    };
    cn = [["process_person", "person_profiles"], ["xhr_headers", "request_headers"], ["cookie_name", "persistence_name"], ["disable_cookie", "disable_persistence"], ["store_google", "save_campaign_params"], ["verbose", "debug"]];
    fn = (t3) => {
      var i2 = {};
      for (var [e3, r3] of cn) C(t3[e3]) || (i2[r3] = t3[e3]);
      var s4 = ye({}, i2, t3);
      return R(t3.property_blacklist) && (C(t3.property_denylist) ? s4.property_denylist = t3.property_blacklist : R(t3.property_denylist) ? s4.property_denylist = [...t3.property_blacklist, ...t3.property_denylist] : yi.error(un + t3.property_denylist)), s4;
    };
    pn = class {
      constructor() {
        this.__forceAllowLocalhost = false;
      }
      get wi() {
        return this.__forceAllowLocalhost;
      }
      set wi(t3) {
        yi.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = t3;
      }
    };
    _n = class __n {
      Ii(t3, i2) {
        if (t3) {
          var e3 = this.Ci.indexOf(t3);
          -1 !== e3 && this.Ci.splice(e3, 1);
        }
        return this.Ci.push(i2), null == i2.initialize || i2.initialize(), i2;
      }
      get decideEndpointWasHit() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this.featureFlags) ? void 0 : i2.hasLoadedFlags) && void 0 !== t3 && t3;
      }
      get flagsEndpointWasHit() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this.featureFlags) ? void 0 : i2.hasLoadedFlags) && void 0 !== t3 && t3;
      }
      constructor() {
        var t3;
        this.webPerformance = new pn(), this.Si = false, this.version = v.LIB_VERSION, this.ki = new Ms(), this.Ci = [], this._calculate_event_properties = this.calculateEventProperties.bind(this), this.config = vn(), this.SentryIntegration = tr, this.sentryIntegration = (t4) => function(t5, i3) {
          var e3 = Ze(t5, i3);
          return { name: Qe, processEvent: (t6) => e3(t6) };
        }(this, t4), this.__request_queue = [], this.__loaded = false, this.analyticsDefaultEndpoint = "/e/", this.xi = false, this.Ti = null, this.Ai = null, this.Ei = null, this.scrollManager = new Cs(this), this.pageViewManager = new ir(this), this.rateLimiter = new Ur(this), this.requestRouter = new Vs(this), this.consent = new Ve(this), this.externalIntegrations = new en(this);
        var i2 = null !== (t3 = __n.__defaultExtensionClasses) && void 0 !== t3 ? t3 : {};
        this.featureFlags = i2.featureFlags && new i2.featureFlags(this), this.toolbar = i2.toolbar && new i2.toolbar(this), this.surveys = i2.surveys && new i2.surveys(this), this.conversations = i2.conversations && new i2.conversations(this), this.logs = i2.logs && new i2.logs(this), this.experiments = i2.experiments && new i2.experiments(this), this.exceptions = i2.exceptions && new i2.exceptions(this), this.people = { set: (t4, i3, e3) => {
          var r3 = F(t4) ? { [t4]: i3 } : t4;
          this.setPersonProperties(r3), null == e3 || e3({});
        }, set_once: (t4, i3, e3) => {
          var r3 = F(t4) ? { [t4]: i3 } : t4;
          this.setPersonProperties(void 0, r3), null == e3 || e3({});
        } }, this.on("eventCaptured", (t4) => yi.info('send "' + (null == t4 ? void 0 : t4.event) + '"', t4));
      }
      init(t3, i2, e3) {
        if (e3 && e3 !== hn) {
          var r3, s4 = null !== (r3 = rn[e3]) && void 0 !== r3 ? r3 : new __n();
          return s4._init(t3, i2, e3), rn[e3] = s4, rn[hn][e3] = s4, s4;
        }
        return this._init(t3, i2, e3);
      }
      _init(i2, e3, r3) {
        var s4;
        if (void 0 === e3 && (e3 = {}), C(i2) || A(i2)) return yi.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
        if (this.__loaded) return console.warn("[PostHog.js]", "You have already initialized PostHog! Re-initializing is a no-op"), this;
        this.__loaded = true, this.config = {}, e3.debug = this.Ri(e3.debug), this.Ni = e3, this.Mi = [], e3.person_profiles ? this.Ai = e3.person_profiles : e3.process_person && (this.Ai = e3.process_person), this.set_config(ye({}, vn(e3.defaults), fn(e3), { name: r3, token: i2 })), this.config.on_xhr_error && yi.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = e3.disable_compression ? void 0 : Br.GZipJS;
        var n3 = this.Fi();
        this.persistence = new Er(this.config, n3), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new Er(p({}, this.config, { persistence: "sessionStorage" }), n3);
        var o3 = p({}, this.persistence.props), a2 = p({}, this.sessionPersistence.props);
        this.register({ $initialization_time: (/* @__PURE__ */ new Date()).toISOString() }), this.Oi = new Ps((t3) => this.Pi(t3), this.config.request_queue_config), this.Li = new Is(this), this.__request_queue = [];
        var l2 = this.config.cookieless_mode === le || this.config.cookieless_mode === ae && this.consent.isExplicitlyOptedOut();
        if (l2 || (this.sessionManager = new Ls(this), this.sessionPropsManager = new As(this, this.sessionManager, this.persistence)), this.config.__preview_deferred_init_extensions ? (yi.info("Deferring extension initialization to improve startup performance"), setTimeout(() => {
          this.Di(l2);
        }, 0)) : (yi.info("Initializing extensions synchronously"), this.Di(l2)), v.DEBUG = v.DEBUG || this.config.debug, v.DEBUG && yi.info("Starting in debug mode", { this: this, config: e3, thisC: p({}, this.config), p: o3, s: a2 }), void 0 !== (null == (s4 = e3.bootstrap) ? void 0 : s4.distinctID)) {
          var u2 = e3.bootstrap.distinctID, h2 = this.get_distinct_id(), d2 = this.persistence.get_property(Ki);
          if (e3.bootstrap.isIdentifiedID && null != h2 && h2 !== u2 && d2 === ue) this.identify(u2);
          else if (e3.bootstrap.isIdentifiedID && null != h2 && h2 !== u2 && d2 === he) yi.warn("Bootstrap distinctID differs from an already-identified user. The existing identity is preserved. Call reset() before reinitializing if you intend to switch users.");
          else {
            var c3 = this.config.get_device_id(Ae()), f2 = e3.bootstrap.isIdentifiedID ? c3 : u2;
            this.persistence.set_property(Ki, e3.bootstrap.isIdentifiedID ? he : ue), this.register({ distinct_id: u2, $device_id: f2 });
          }
        }
        if (l2) this.register_once({ distinct_id: se, $device_id: null }, "");
        else if (!this.get_distinct_id()) {
          var _2 = this.config.get_device_id(Ae());
          this.register_once({ distinct_id: _2, $device_id: _2 }, ""), this.persistence.set_property(Ki, ue);
        }
        return ke(t, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this), { passive: false }), e3.segment ? function(t3, i3) {
          var e4 = t3.config.segment;
          if (!e4) return i3();
          !function(t4, i4) {
            var e5 = t4.config.segment;
            if (!e5) return i4();
            var r4 = (e6) => {
              var r5 = () => e6.anonymousId() || Ae();
              t4.config.get_device_id = r5, e6.id() && (t4.register({ distinct_id: e6.id(), $device_id: r5() }), t4.persistence.set_property(Ki, he)), i4();
            }, s5 = e5.user();
            "then" in s5 && P(s5.then) ? s5.then(r4) : r4(s5);
          }(t3, () => {
            e4.register(((t4) => {
              Promise && Promise.resolve || Xe.warn("This browser does not have Promise support, and can not use the segment integration");
              var i4 = (i5, e5) => {
                if (!e5) return i5;
                i5.event.userId || i5.event.anonymousId === t4.get_distinct_id() || (Xe.info("No userId set, resetting PostHog"), t4.reset()), i5.event.userId && i5.event.userId !== t4.get_distinct_id() && (Xe.info("UserId set, identifying with PostHog"), t4.identify(i5.event.userId));
                var r4 = t4.calculateEventProperties(e5, i5.event.properties);
                return i5.event.properties = Object.assign({}, r4, i5.event.properties), i5;
              };
              return { name: "PostHog JS", type: "enrichment", version: "1.0.0", isLoaded: () => true, load: () => Promise.resolve(), track: (t5) => i4(t5, t5.event.event), page: (t5) => i4(t5, fe), identify: (t5) => i4(t5, _e), screen: (t5) => i4(t5, "$screen") };
            })(t3)).then(() => {
              i3();
            });
          });
        }(this, () => this.Bi()) : this.Bi(), P(this.config._onCapture) && this.config._onCapture !== nn && (yi.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", (t3) => this.config._onCapture(t3.event, t3))), this.config.ip && yi.warn('The `ip` config option has NO EFFECT AT ALL and has been deprecated. Use a custom transformation or "Discard IP data" project setting instead. See https://posthog.com/tutorials/web-redact-properties#hiding-customer-ip-address for more information.'), this;
      }
      Di(t3) {
        var i2, e3, r3, s4, n3, o3, a2, l2 = performance.now(), u2 = p({}, __n.__defaultExtensionClasses, this.config.__extensionClasses), h2 = [];
        u2.featureFlags && this.Ci.push(this.featureFlags = null !== (i2 = this.featureFlags) && void 0 !== i2 ? i2 : new u2.featureFlags(this)), u2.exceptions && this.Ci.push(this.exceptions = null !== (e3 = this.exceptions) && void 0 !== e3 ? e3 : new u2.exceptions(this)), u2.historyAutocapture && this.Ci.push(this.historyAutocapture = new u2.historyAutocapture(this)), u2.tracingHeaders && this.Ci.push(new u2.tracingHeaders(this)), u2.siteApps && this.Ci.push(this.siteApps = new u2.siteApps(this)), u2.sessionRecording && !t3 && this.Ci.push(this.sessionRecording = new u2.sessionRecording(this)), this.config.disable_scroll_properties || h2.push(() => {
          this.scrollManager.startMeasuringScrollPosition();
        }), u2.autocapture && this.Ci.push(this.autocapture = new u2.autocapture(this)), u2.surveys && this.Ci.push(this.surveys = null !== (r3 = this.surveys) && void 0 !== r3 ? r3 : new u2.surveys(this)), u2.logs && this.Ci.push(this.logs = null !== (s4 = this.logs) && void 0 !== s4 ? s4 : new u2.logs(this)), u2.conversations && this.Ci.push(this.conversations = null !== (n3 = this.conversations) && void 0 !== n3 ? n3 : new u2.conversations(this)), u2.productTours && this.Ci.push(this.productTours = new u2.productTours(this)), u2.heatmaps && this.Ci.push(this.heatmaps = new u2.heatmaps(this)), u2.webVitalsAutocapture && this.Ci.push(this.webVitalsAutocapture = new u2.webVitalsAutocapture(this)), u2.exceptionObserver && this.Ci.push(this.exceptionObserver = new u2.exceptionObserver(this)), u2.deadClicksAutocapture && this.Ci.push(this.deadClicksAutocapture = new u2.deadClicksAutocapture(this, Je)), u2.toolbar && this.Ci.push(this.toolbar = null !== (o3 = this.toolbar) && void 0 !== o3 ? o3 : new u2.toolbar(this)), u2.experiments && this.Ci.push(this.experiments = null !== (a2 = this.experiments) && void 0 !== a2 ? a2 : new u2.experiments(this)), this.Ci.forEach((t4) => {
          t4.initialize && h2.push(() => {
            null == t4.initialize || t4.initialize();
          });
        }), h2.push(() => {
          if (this.ji) {
            var t4 = this.ji;
            this.ji = void 0, this.Sr(t4);
          }
        }), this.qi(h2, l2);
      }
      qi(t3, i2) {
        for (; t3.length > 0; ) {
          if (this.config.__preview_deferred_init_extensions && performance.now() - i2 >= 30 && t3.length > 0) return void setTimeout(() => {
            this.qi(t3, i2);
          }, 0);
          var e3 = t3.shift();
          if (e3) try {
            e3();
          } catch (t4) {
            yi.error("Error initializing extension:", t4);
          }
        }
        var r3 = Math.round(performance.now() - i2);
        this.register_for_session({ $sdk_debug_extensions_init_method: this.config.__preview_deferred_init_extensions ? "deferred" : "synchronous", $sdk_debug_extensions_init_time_ms: r3 }), this.config.__preview_deferred_init_extensions && yi.info("PostHog extensions initialized (" + r3 + "ms)");
      }
      Sr(t3) {
        var i2;
        if (!r || !r.body) return yi.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout(() => {
          this.Sr(t3);
        }, 500);
        this.config.__preview_deferred_init_extensions && (this.ji = t3), this.compression = void 0, t3.supportedCompression && !this.config.disable_compression && (this.compression = w(t3.supportedCompression, Br.GZipJS) ? Br.GZipJS : w(t3.supportedCompression, Br.Base64) ? Br.Base64 : void 0), null != (i2 = t3.analytics) && i2.endpoint && (this.analyticsDefaultEndpoint = t3.analytics.endpoint), this.set_config({ person_profiles: this.Ai ? this.Ai : de }), this.Ci.forEach((i3) => null == i3.onRemoteConfig ? void 0 : i3.onRemoteConfig(t3));
      }
      Bi() {
        try {
          this.config.loaded(this);
        } catch (t4) {
          yi.critical("`loaded` function failed", t4);
        }
        if (this.Zi(), this.config.internal_or_test_user_hostname && null != s2 && s2.hostname) {
          var t3 = s2.hostname, i2 = this.config.internal_or_test_user_hostname;
          ("string" == typeof i2 ? t3 === i2 : i2.test(t3)) && this.setInternalOrTestUser();
        }
        this.config.capture_pageview && setTimeout(() => {
          (this.consent.isOptedIn() || this.config.cookieless_mode === le) && this.$i();
        }, 1), this.Hi = new jr(this), this.Hi.load();
      }
      Zi() {
        var t3;
        this.is_capturing() && this.config.request_batching && (null == (t3 = this.Oi) || t3.enable());
      }
      _dom_loaded() {
        this.is_capturing() && me(this.__request_queue, (t3) => this.Pi(t3)), this.__request_queue = [], this.Zi();
      }
      _handle_unload() {
        var t3, i2, e3;
        null == (t3 = this.surveys) || t3.handlePageUnload(), this.config.request_batching ? (this.Vi() && this.capture(pe), null == (i2 = this.Oi) || i2.unload(), null == (e3 = this.Li) || e3.unload()) : this.Vi() && this.capture(pe, null, { transport: "sendBeacon" });
      }
      _send_request(t3) {
        this.__loaded && (dn ? this.__request_queue.push(t3) : this.rateLimiter.isServerRateLimited(t3.batchKey) || (t3.transport = t3.transport || this.config.api_transport, t3.url = Ss(t3.url, { ip: this.config.ip ? 1 : 0 }), t3.headers = p({}, this.config.request_headers, t3.headers), t3.compression = "best-available" === t3.compression ? this.compression : t3.compression, t3.disableXHRCredentials = this.config.__preview_disable_xhr_credentials, this.config.__preview_disable_beacon && (t3.disableTransport = ["sendBeacon"]), t3.fetchOptions = t3.fetchOptions || this.config.fetch_options, ((t4) => {
          var i2, e3, r3, s4 = p({}, t4);
          s4.timeout = s4.timeout || 6e4, s4.url = Ss(s4.url, { _: (/* @__PURE__ */ new Date()).getTime().toString(), ver: v.JS_SDK_VERSION, compression: s4.compression });
          var n3 = null !== (i2 = s4.transport) && void 0 !== i2 ? i2 : "fetch", o3 = ks.filter((t5) => !s4.disableTransport || !t5.transport || !s4.disableTransport.includes(t5.transport)), a2 = null !== (e3 = null == (r3 = function(t5, i3) {
            for (var e4 = 0; t5.length > e4; e4++) if (t5[e4].transport === n3) return t5[e4];
          }(o3)) ? void 0 : r3.method) && void 0 !== e3 ? e3 : o3[0].method;
          if (!a2) throw new Error("No available transport method");
          "sendBeacon" !== n3 && s4.data && s4.compression === Br.GZipJS && l ? $s(s4).then((t5) => {
            a2(t5);
          }).catch(() => {
            a2(s4);
          }) : a2(s4);
        })(p({}, t3, { callback: (i2) => {
          var e3, r3;
          this.rateLimiter.checkForLimiting(i2), 400 > i2.statusCode || null == (e3 = (r3 = this.config).on_request_error) || e3.call(r3, i2), null == t3.callback || t3.callback(i2);
        } }))));
      }
      Pi(t3) {
        this.Li ? this.Li.retriableRequest(t3) : this._send_request(t3);
      }
      _execute_array(t3) {
        sn++;
        try {
          var i2, e3 = [], r3 = [], s4 = [];
          me(t3, (t4) => {
            t4 && (R(i2 = t4[0]) ? s4.push(t4) : P(t4) ? t4.call(this) : R(t4) && "alias" === i2 ? e3.push(t4) : R(t4) && -1 !== i2.indexOf("capture") && P(this[i2]) ? s4.push(t4) : r3.push(t4));
          });
          var n3 = function(t4, i3) {
            me(t4, function(t5) {
              if (R(t5[0])) {
                var e4 = i3;
                be(t5, function(t6) {
                  e4 = e4[t6[0]].apply(e4, t6.slice(1));
                });
              } else i3[t5[0]].apply(i3, t5.slice(1));
            });
          };
          n3(e3, this), n3(r3, this), n3(s4, this);
        } finally {
          sn--;
        }
      }
      push(t3) {
        if (sn > 0 && R(t3) && F(t3[0])) {
          var i2 = __n.prototype[t3[0]];
          P(i2) && i2.apply(this, t3.slice(1));
        } else this._execute_array([t3]);
      }
      capture(t3, i2, e3) {
        var r3, s4, n3, o3, a2;
        if (this.__loaded && this.persistence && this.sessionPersistence && this.Oi) {
          if (this.is_capturing()) if (!C(t3) && F(t3)) {
            var l2 = !this.config.opt_out_useragent_filter && this._is_bot();
            if (!l2 || this.config.__preview_capture_bot_pageviews) {
              var u2 = null != e3 && e3.skip_client_rate_limiting ? void 0 : this.rateLimiter.clientRateLimitContext();
              if (null == u2 || !u2.isRateLimited) {
                null != i2 && i2.$current_url && !F(null == i2 ? void 0 : i2.$current_url) && (yi.error("Invalid `$current_url` property provided to `posthog.capture`. Input must be a string. Ignoring provided value."), null == i2 || delete i2.$current_url), "$exception" !== t3 || null != e3 && e3.zi || yi.warn("Using `posthog.capture('$exception')` is unreliable because it does not attach required metadata. Use `posthog.captureException(error)` instead, which attaches required metadata automatically."), this.sessionPersistence.update_search_keyword(), this.config.save_campaign_params && this.sessionPersistence.update_campaign_params(), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.save_campaign_params || this.config.save_referrer) && this.persistence.set_initial_person_info();
                var h2 = /* @__PURE__ */ new Date(), d2 = (null == e3 ? void 0 : e3.timestamp) || h2, v2 = Ae(), c3 = { uuid: v2, event: t3, properties: this.calculateEventProperties(t3, i2 || {}, d2, v2) };
                t3 === fe && this.config.__preview_capture_bot_pageviews && l2 && (c3.event = "$bot_pageview", c3.properties.$browser_type = "bot"), u2 && (c3.properties.$lib_rate_limit_remaining_tokens = u2.remainingTokens), (null == e3 ? void 0 : e3.$set) && (c3.$set = null == e3 ? void 0 : e3.$set);
                var f2, _2 = this.Yi(null == e3 ? void 0 : e3.$set_once, t3 !== ge, t3 === _e);
                if (_2 && (c3.$set_once = _2), null != e3 && e3._noTruncate || (s4 = this.config.properties_string_max_length, n3 = c3, o3 = (t4) => F(t4) ? t4.slice(0, s4) : t4, a2 = /* @__PURE__ */ new Set(), c3 = function t4(i3, e4) {
                  return i3 !== Object(i3) ? o3 ? o3(i3) : i3 : a2.has(i3) ? void 0 : (a2.add(i3), R(i3) ? (r4 = [], me(i3, (i4) => {
                    r4.push(t4(i4));
                  })) : (r4 = {}, be(i3, (i4, e5) => {
                    a2.has(i4) || (r4[e5] = t4(i4, e5));
                  })), r4);
                  var r4;
                }(n3)), c3.timestamp = d2, C(null == e3 ? void 0 : e3.timestamp) || (c3.properties.$event_time_override_provided = true, c3.properties.$event_time_override_system_time = h2), t3 === Ir.DISMISSED || t3 === Ir.SENT) {
                  var g2 = null == i2 ? void 0 : i2[Cr.SURVEY_ID], m2 = null == i2 ? void 0 : i2[Cr.SURVEY_ITERATION];
                  f2 = { id: g2, current_iteration: m2 }, localStorage.getItem(Ks(f2)) || localStorage.setItem(Ks(f2), "true"), c3.$set = p({}, c3.$set, { [Js({ id: g2, current_iteration: m2 }, t3 === Ir.SENT ? "responded" : "dismissed")]: true });
                } else t3 === Ir.SHOWN && (c3.$set = p({}, c3.$set, { [Cr.SURVEY_LAST_SEEN_DATE]: (/* @__PURE__ */ new Date()).toISOString() }));
                if (t3 === Mr.SHOWN) {
                  var b2 = null == i2 ? void 0 : i2[Dr.TOUR_TYPE];
                  b2 && (c3.$set = p({}, c3.$set, { [Dr.TOUR_LAST_SEEN_DATE + "/" + b2]: (/* @__PURE__ */ new Date()).toISOString() }));
                }
                var y2 = p({}, c3.properties.$set, c3.$set);
                if (I(y2) || this.setPersonPropertiesForFlags(y2), !D(this.config.before_send)) {
                  var w2 = this.Ui(c3);
                  if (!w2) return;
                  c3 = w2;
                }
                this.ki.emit("eventCaptured", c3);
                var E2 = { method: "POST", url: null !== (r3 = null == e3 ? void 0 : e3._url) && void 0 !== r3 ? r3 : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint), data: c3, compression: "best-available", batchKey: null == e3 ? void 0 : e3._batchKey };
                return !this.config.request_batching || e3 && (null == e3 || !e3._batchKey) || null != e3 && e3.send_instantly ? this.Pi(E2) : this.Oi.enqueue(E2), c3;
              }
              yi.critical("This capture call is ignored due to client rate limiting.");
            }
          } else yi.error("No event name provided to posthog.capture");
        } else yi.uninitializedWarning("posthog.capture");
      }
      _addCaptureHook(t3) {
        return this.on("eventCaptured", (i2) => t3(i2.event, i2));
      }
      calculateEventProperties(i2, e3, n3, o3, a2) {
        if (n3 = n3 || /* @__PURE__ */ new Date(), !this.persistence || !this.sessionPersistence) return e3;
        var l2 = a2 ? void 0 : this.persistence.remove_event_timer(i2), h2 = p({}, e3);
        if (h2.token = this.config.token, h2.$config_defaults = this.config.defaults, (this.config.cookieless_mode == le || this.config.cookieless_mode == ae && this.consent.isExplicitlyOptedOut()) && (h2.$cookieless_mode = true), "$snapshot" === i2) {
          var d2 = p({}, this.persistence.properties(), this.sessionPersistence.properties());
          return h2.distinct_id = d2.distinct_id, (!F(h2.distinct_id) && !L(h2.distinct_id) || A(h2.distinct_id)) && yi.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), h2;
        }
        var c3, f2 = function(i3, e4) {
          var r3, n4, o4, a3;
          if (!u) return {};
          var l3, h3, d3, c4, f3, p2, _3, g3, m3 = i3 ? [...ar, ...e4 || []] : [], [b3, y3] = function(t3) {
            for (var i4 = 0; Vt.length > i4; i4++) {
              var [e5, r4] = Vt[i4], s4 = e5.exec(t3), n5 = s4 && (P(r4) ? r4(s4, t3) : r4);
              if (n5) return n5;
            }
            return ["", ""];
          }(u);
          return ye(xe({ $os: b3, $os_version: y3, $browser: Ht(u, navigator.vendor), $device: Yt(u), $device_type: (h3 = u, d3 = { userAgentDataPlatform: null == (r3 = navigator) || null == (r3 = r3.userAgentData) ? void 0 : r3.platform, maxTouchPoints: null == (n4 = navigator) ? void 0 : n4.maxTouchPoints, screenWidth: null == t || null == (o4 = t.screen) ? void 0 : o4.width, screenHeight: null == t || null == (a3 = t.screen) ? void 0 : a3.height, devicePixelRatio: null == t ? void 0 : t.devicePixelRatio }, g3 = Yt(h3), g3 === st || g3 === rt || "Kobo" === g3 || "Kindle Fire" === g3 || g3 === At ? et : g3 === St || g3 === Tt || g3 === xt || g3 === It ? "Console" : g3 === ot ? "Wearable" : g3 ? Z : "Android" === (null == d3 ? void 0 : d3.userAgentDataPlatform) && (null !== (c4 = null == d3 ? void 0 : d3.maxTouchPoints) && void 0 !== c4 ? c4 : 0) > 0 ? 600 > Math.min(null !== (f3 = null == d3 ? void 0 : d3.screenWidth) && void 0 !== f3 ? f3 : 0, null !== (p2 = null == d3 ? void 0 : d3.screenHeight) && void 0 !== p2 ? p2 : 0) / (null !== (_3 = null == d3 ? void 0 : d3.devicePixelRatio) && void 0 !== _3 ? _3 : 1) ? Z : et : "Desktop"), $timezone: br(), $timezone_offset: yr() }), { $current_url: sr(null == s2 ? void 0 : s2.href, m3, ur), $host: null == s2 ? void 0 : s2.host, $pathname: null == s2 ? void 0 : s2.pathname, $raw_user_agent: u.length > 1e3 ? u.substring(0, 997) + "..." : u, $browser_version: Wt(u, navigator.vendor), $browser_language: fr(), $browser_language_prefix: (l3 = fr(), "string" == typeof l3 ? l3.split("-")[0] : void 0), $screen_height: null == t ? void 0 : t.screen.height, $screen_width: null == t ? void 0 : t.screen.width, $viewport_height: null == t ? void 0 : t.innerHeight, $viewport_width: null == t ? void 0 : t.innerWidth, $lib: v.LIB_NAME, $lib_version: v.LIB_VERSION, $insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10), $time: Date.now() / 1e3 });
        }(this.config.mask_personal_data_properties, this.config.custom_personal_data_properties);
        if (this.sessionManager) {
          var { sessionId: _2, windowId: g2 } = this.sessionManager.checkAndGetSessionAndWindowId(a2, n3.getTime());
          h2.$session_id = _2, h2.$window_id = g2;
        }
        this.sessionPropsManager && ye(h2, this.sessionPropsManager.getSessionProps());
        try {
          var m2;
          this.sessionRecording && ye(h2, this.sessionRecording.sdkDebugProperties), h2.$sdk_debug_retry_queue_size = null == (m2 = this.Li) ? void 0 : m2.length;
        } catch (t3) {
          h2.$sdk_debug_error_capturing_properties = String(t3);
        }
        if (this.requestRouter.region === qs && (h2.$lib_custom_api_host = this.config.api_host), c3 = i2 !== fe || a2 ? i2 !== pe || a2 ? this.pageViewManager.doEvent() : this.pageViewManager.doPageLeave(n3) : this.pageViewManager.doPageView(n3, o3), h2 = ye(h2, c3), i2 === fe && r && (h2.title = r.title), !C(l2)) {
          var b2 = n3.getTime() - l2;
          h2.$duration = parseFloat((b2 / 1e3).toFixed(3));
        }
        u && this.config.opt_out_useragent_filter && (h2.$browser_type = this._is_bot() ? "bot" : "browser"), (h2 = ye({}, f2, this.persistence.properties(), this.sessionPersistence.properties(), h2)).$is_identified = this._isIdentified(), R(this.config.property_denylist) ? be(this.config.property_denylist, function(t3) {
          delete h2[t3];
        }) : yi.error(un + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
        var y2 = this.config.sanitize_properties;
        y2 && (yi.error(ln), h2 = y2(h2, i2));
        var w2 = this.Wi();
        return h2.$process_person_profile = w2, w2 && !a2 && this.Gi("_calculate_event_properties"), h2;
      }
      Yi(t3, i2, e3) {
        var r3;
        if (void 0 === i2 && (i2 = true), void 0 === e3 && (e3 = false), !this.persistence || !this.Wi()) return t3;
        if (this.Si && !e3) return t3;
        var s4 = this.persistence.get_initial_props(), n3 = null == (r3 = this.sessionPropsManager) ? void 0 : r3.getSetOnceProps(), o3 = ye({}, s4, n3 || {}, t3 || {}), a2 = this.config.sanitize_properties;
        return a2 && (yi.error(ln), o3 = a2(o3, "$set_once")), i2 && (this.Si = true), I(o3) ? void 0 : o3;
      }
      register(t3, i2) {
        var e3;
        null == (e3 = this.persistence) || e3.register(t3, i2);
      }
      register_once(t3, i2, e3) {
        var r3;
        null == (r3 = this.persistence) || r3.register_once(t3, i2, e3);
      }
      register_for_session(t3) {
        var i2;
        null == (i2 = this.sessionPersistence) || i2.register(t3);
      }
      unregister(t3) {
        var i2;
        null == (i2 = this.persistence) || i2.unregister(t3);
      }
      unregister_for_session(t3) {
        var i2;
        null == (i2 = this.sessionPersistence) || i2.unregister(t3);
      }
      Xi(t3, i2) {
        this.register({ [t3]: i2 });
      }
      getFeatureFlag(t3, i2) {
        var e3;
        return null == (e3 = this.featureFlags) ? void 0 : e3.getFeatureFlag(t3, i2);
      }
      getFeatureFlagPayload(t3) {
        var i2;
        return null == (i2 = this.featureFlags) ? void 0 : i2.getFeatureFlagPayload(t3);
      }
      getFeatureFlagResult(t3, i2) {
        var e3;
        return null == (e3 = this.featureFlags) ? void 0 : e3.getFeatureFlagResult(t3, i2);
      }
      isFeatureEnabled(t3, i2) {
        var e3;
        return null == (e3 = this.featureFlags) ? void 0 : e3.isFeatureEnabled(t3, i2);
      }
      reloadFeatureFlags() {
        var t3;
        null == (t3 = this.featureFlags) || t3.reloadFeatureFlags();
      }
      updateFlags(t3, i2, e3) {
        var r3;
        null == (r3 = this.featureFlags) || r3.updateFlags(t3, i2, e3);
      }
      updateEarlyAccessFeatureEnrollment(t3, i2, e3) {
        var r3;
        null == (r3 = this.featureFlags) || r3.updateEarlyAccessFeatureEnrollment(t3, i2, e3);
      }
      getEarlyAccessFeatures(t3, i2, e3) {
        var r3;
        return void 0 === i2 && (i2 = false), null == (r3 = this.featureFlags) ? void 0 : r3.getEarlyAccessFeatures(t3, i2, e3);
      }
      on(t3, i2) {
        return this.ki.on(t3, i2);
      }
      onFeatureFlags(t3) {
        return this.featureFlags ? this.featureFlags.onFeatureFlags(t3) : (t3([], {}, { errorsLoading: true }), () => {
        });
      }
      onSurveysLoaded(t3) {
        return this.surveys ? this.surveys.onSurveysLoaded(t3) : (t3([], { isLoaded: false, error: an }), () => {
        });
      }
      onSessionId(t3) {
        var i2, e3;
        return null !== (i2 = null == (e3 = this.sessionManager) ? void 0 : e3.onSessionId(t3)) && void 0 !== i2 ? i2 : () => {
        };
      }
      getSurveys(t3, i2) {
        void 0 === i2 && (i2 = false), this.surveys ? this.surveys.getSurveys(t3, i2) : t3([], { isLoaded: false, error: an });
      }
      getActiveMatchingSurveys(t3, i2) {
        void 0 === i2 && (i2 = false), this.surveys ? this.surveys.getActiveMatchingSurveys(t3, i2) : t3([], { isLoaded: false, error: an });
      }
      renderSurvey(t3, i2) {
        var e3;
        null == (e3 = this.surveys) || e3.renderSurvey(t3, i2);
      }
      displaySurvey(t3, i2) {
        var e3;
        void 0 === i2 && (i2 = Qs), null == (e3 = this.surveys) || e3.displaySurvey(t3, i2);
      }
      cancelPendingSurvey(t3) {
        var i2;
        null == (i2 = this.surveys) || i2.cancelPendingSurvey(t3);
      }
      canRenderSurvey(t3) {
        var i2, e3;
        return null !== (i2 = null == (e3 = this.surveys) ? void 0 : e3.canRenderSurvey(t3)) && void 0 !== i2 ? i2 : { visible: false, disabledReason: an };
      }
      canRenderSurveyAsync(t3, i2) {
        var e3, r3;
        return void 0 === i2 && (i2 = false), null !== (e3 = null == (r3 = this.surveys) ? void 0 : r3.canRenderSurveyAsync(t3, i2)) && void 0 !== e3 ? e3 : Promise.resolve({ visible: false, disabledReason: an });
      }
      Ji(t3) {
        return !t3 || A(t3) ? (yi.critical("Unique user id has not been set in posthog.identify"), false) : t3 === se ? (yi.critical('The string "' + t3 + '" was set in posthog.identify which indicates an error. This ID is only used as a sentinel value.'), false) : !["distinct_id", "distinctid"].includes(t3.toLowerCase()) && !["undefined", "null"].includes(t3.toLowerCase()) || (yi.critical('The string "' + t3 + '" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.'), false);
      }
      identify(t3, i2, e3) {
        if (!this.__loaded || !this.persistence) return yi.uninitializedWarning("posthog.identify");
        if (L(t3) && (t3 = t3.toString(), yi.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), this.Ji(t3) && this.Gi("posthog.identify")) {
          var r3 = this.get_distinct_id();
          this.register({ $user_id: t3 }), this.get_property(Ti) || this.register_once({ $had_persisted_distinct_id: true, $device_id: r3 }, ""), t3 !== r3 && t3 !== this.get_property($i) && (this.unregister($i), this.register({ distinct_id: t3 }));
          var s4, n3 = (this.persistence.get_property(Ki) || ue) === ue;
          t3 !== r3 && n3 ? (this.persistence.set_property(Ki, he), this.setPersonPropertiesForFlags(p({}, e3 || {}, i2 || {}), false), this.capture(_e, { distinct_id: t3, $anon_distinct_id: r3 }, { $set: i2 || {}, $set_once: e3 || {} }), this.Ei = js(t3, i2, e3), null == (s4 = this.featureFlags) || s4.setAnonymousDistinctId(r3)) : (i2 || e3) && this.setPersonProperties(i2, e3), t3 !== r3 && (this.reloadFeatureFlags(), this.unregister(Vi));
        }
      }
      setPersonProperties(t3, i2) {
        if ((t3 || i2) && this.Gi("posthog.setPersonProperties")) {
          var e3 = js(this.get_distinct_id(), t3, i2);
          this.Ei !== e3 ? (this.setPersonPropertiesForFlags(p({}, i2 || {}, t3 || {})), this.capture("$set", { $set: t3 || {}, $set_once: i2 || {} }), this.Ei = e3) : yi.info("A duplicate setPersonProperties call was made with the same properties. It has been ignored.");
        }
      }
      group(t3, i2, e3) {
        if (t3 && i2) {
          var r3 = this.getGroups();
          r3[t3] !== i2 && this.resetGroupPropertiesForFlags(t3), this.register({ $groups: p({}, r3, { [t3]: i2 }) }), e3 && (this.capture(ge, { $group_type: t3, $group_key: i2, $group_set: e3 }), this.setGroupPropertiesForFlags({ [t3]: e3 })), r3[t3] === i2 || e3 || this.reloadFeatureFlags();
        } else yi.error("posthog.group requires a group type and group key");
      }
      resetGroups() {
        this.register({ $groups: {} }), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags();
      }
      setPersonPropertiesForFlags(t3, i2) {
        var e3;
        void 0 === i2 && (i2 = true), null == (e3 = this.featureFlags) || e3.setPersonPropertiesForFlags(t3, i2);
      }
      resetPersonPropertiesForFlags() {
        var t3;
        null == (t3 = this.featureFlags) || t3.resetPersonPropertiesForFlags();
      }
      setGroupPropertiesForFlags(t3, i2) {
        var e3;
        void 0 === i2 && (i2 = true), this.Gi("posthog.setGroupPropertiesForFlags") && (null == (e3 = this.featureFlags) || e3.setGroupPropertiesForFlags(t3, i2));
      }
      resetGroupPropertiesForFlags(t3) {
        var i2;
        null == (i2 = this.featureFlags) || i2.resetGroupPropertiesForFlags(t3);
      }
      reset(t3) {
        var i2, e3, r3, s4, n3, o3, a2;
        if (yi.info("reset"), !this.__loaded) return yi.uninitializedWarning("posthog.reset");
        var l2 = this.get_property(Ti);
        if (this.consent.reset(), null == (i2 = this.persistence) || i2.clear(), null == (e3 = this.sessionPersistence) || e3.clear(), null == (r3 = this.surveys) || r3.reset(), null == (s4 = this.Hi) || s4.stop(), null == (n3 = this.featureFlags) || n3.reset(), null == (o3 = this.persistence) || o3.set_property(Ki, ue), null == (a2 = this.sessionManager) || a2.resetSessionId(), this.Ei = null, this.config.cookieless_mode === le) this.register_once({ distinct_id: se, $device_id: null }, "");
        else {
          var u2 = this.config.get_device_id(Ae());
          this.register_once({ distinct_id: u2, $device_id: t3 ? u2 : l2 }, "");
        }
        this.register({ $last_posthog_reset: (/* @__PURE__ */ new Date()).toISOString() }, 1), this.reloadFeatureFlags();
      }
      get_distinct_id() {
        return this.get_property("distinct_id");
      }
      getGroups() {
        return this.get_property("$groups") || {};
      }
      get_session_id() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this.sessionManager) ? void 0 : i2.checkAndGetSessionAndWindowId(true).sessionId) && void 0 !== t3 ? t3 : "";
      }
      get_session_replay_url(t3) {
        if (!this.sessionManager) return "";
        var { sessionId: i2, sessionStartTimestamp: e3 } = this.sessionManager.checkAndGetSessionAndWindowId(true), r3 = this.requestRouter.endpointFor("ui", "/project/" + this.config.token + "/replay/" + i2);
        if (null != t3 && t3.withTimestamp && e3) {
          var s4, n3 = null !== (s4 = t3.timestampLookBack) && void 0 !== s4 ? s4 : 10;
          if (!e3) return r3;
          r3 += "?t=" + Math.max(Math.floor(((/* @__PURE__ */ new Date()).getTime() - e3) / 1e3) - n3, 0);
        }
        return r3;
      }
      alias(t3, i2) {
        return t3 === this.get_property(xi) ? (yi.critical("Attempting to create alias for existing People user - aborting."), -2) : this.Gi("posthog.alias") ? (C(i2) && (i2 = this.get_distinct_id()), t3 !== i2 ? (this.Xi($i, t3), this.capture("$create_alias", { alias: t3, distinct_id: i2 })) : (yi.warn("alias matches current distinct_id - skipping api call."), this.identify(t3), -1)) : void 0;
      }
      set_config(t3) {
        var i2 = p({}, this.config);
        if (O(t3)) {
          var e3, r3, s4, n3, o3, a2, l2, u2, h2;
          ye(this.config, fn(t3));
          var d2 = this.Fi();
          null == (e3 = this.persistence) || e3.update_config(this.config, i2, d2), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new Er(p({}, this.config, { persistence: "sessionStorage" }), d2);
          var c3 = this.Ri(this.config.debug);
          N(c3) && (this.config.debug = c3), N(this.config.debug) && (this.config.debug ? (v.DEBUG = true, je.Yt() && je.Xt("ph_debug", true), yi.info("set_config", { config: t3, oldConfig: i2, newConfig: p({}, this.config) })) : (v.DEBUG = false, je.Yt() && je.Jt("ph_debug"))), null == (r3 = this.exceptionObserver) || r3.onConfigChange(), null == (s4 = this.sessionRecording) || s4.startIfEnabledOrStop(), null == (n3 = this.autocapture) || n3.startIfEnabled(), null == (o3 = this.heatmaps) || o3.startIfEnabled(), null == (a2 = this.exceptionObserver) || a2.startIfEnabledOrStop(), null == (l2 = this.deadClicksAutocapture) || l2.startIfEnabledOrStop(), null == (u2 = this.surveys) || u2.loadIfEnabled(), this.Ki(), null == (h2 = this.externalIntegrations) || h2.startIfEnabledOrStop();
        }
      }
      _overrideSDKInfo(t3, i2) {
        v.LIB_NAME = t3, v.LIB_VERSION = i2;
      }
      startSessionRecording(t3) {
        var i2, e3, r3, s4, n3, o3 = true === t3, a2 = { sampling: o3 || !(null == t3 || !t3.sampling), linked_flag: o3 || !(null == t3 || !t3.linked_flag), url_trigger: o3 || !(null == t3 || !t3.url_trigger), event_trigger: o3 || !(null == t3 || !t3.event_trigger) };
        Object.values(a2).some(Boolean) && (null == (i2 = this.sessionManager) || i2.checkAndGetSessionAndWindowId(), a2.sampling && (null == (e3 = this.sessionRecording) || e3.overrideSampling()), a2.linked_flag && (null == (r3 = this.sessionRecording) || r3.overrideLinkedFlag()), a2.url_trigger && (null == (s4 = this.sessionRecording) || s4.overrideTrigger("url")), a2.event_trigger && (null == (n3 = this.sessionRecording) || n3.overrideTrigger("event")));
        this.set_config({ disable_session_recording: false });
      }
      stopSessionRecording() {
        this.set_config({ disable_session_recording: true });
      }
      sessionRecordingStarted() {
        var t3;
        return !(null == (t3 = this.sessionRecording) || !t3.started);
      }
      captureException(t3, i2) {
        if (this.exceptions) {
          var e3 = new Error("PostHog syntheticException"), r3 = this.exceptions.buildProperties(t3, { handled: true, syntheticException: e3 });
          return this.exceptions.sendExceptionEvent(p({}, r3, i2));
        }
      }
      startExceptionAutocapture(t3) {
        this.set_config({ capture_exceptions: null == t3 || t3 });
      }
      stopExceptionAutocapture() {
        this.set_config({ capture_exceptions: false });
      }
      loadToolbar(t3) {
        var i2, e3;
        return null !== (i2 = null == (e3 = this.toolbar) ? void 0 : e3.loadToolbar(t3)) && void 0 !== i2 && i2;
      }
      get_property(t3) {
        var i2;
        return null == (i2 = this.persistence) ? void 0 : i2.props[t3];
      }
      getSessionProperty(t3) {
        var i2;
        return null == (i2 = this.sessionPersistence) ? void 0 : i2.props[t3];
      }
      toString() {
        var t3, i2 = null !== (t3 = this.config.name) && void 0 !== t3 ? t3 : hn;
        return i2 !== hn && (i2 = hn + "." + i2), i2;
      }
      _isIdentified() {
        var t3, i2;
        return (null == (t3 = this.persistence) ? void 0 : t3.get_property(Ki)) === he || (null == (i2 = this.sessionPersistence) ? void 0 : i2.get_property(Ki)) === he;
      }
      Wi() {
        var t3, i2;
        return !("never" === this.config.person_profiles || this.config.person_profiles === de && !this._isIdentified() && I(this.getGroups()) && (null == (t3 = this.persistence) || null == (t3 = t3.props) || !t3[$i]) && (null == (i2 = this.persistence) || null == (i2 = i2.props) || !i2[ee]));
      }
      Vi() {
        return true === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && (true === this.config.capture_pageview || "history_change" === this.config.capture_pageview);
      }
      createPersonProfile() {
        this.Wi() || this.Gi("posthog.createPersonProfile") && this.setPersonProperties({}, {});
      }
      setInternalOrTestUser() {
        this.Gi("posthog.setInternalOrTestUser") && this.setPersonProperties({ $internal_or_test_user: true });
      }
      Gi(t3) {
        return "never" === this.config.person_profiles ? (yi.error(t3 + ' was called, but process_person is set to "never". This call will be ignored.'), false) : (this.Xi(ee, true), true);
      }
      Fi() {
        if ("always" === this.config.cookieless_mode) return true;
        var t3 = this.consent.isOptedOut();
        return this.config.disable_persistence || t3 && !(!this.config.opt_out_persistence_by_default && this.config.cookieless_mode !== ae);
      }
      Ki() {
        var t3, i2, e3, r3, s4 = this.Fi();
        return (null == (t3 = this.persistence) ? void 0 : t3.gr) !== s4 && (null == (e3 = this.persistence) || e3.set_disabled(s4)), (null == (i2 = this.sessionPersistence) ? void 0 : i2.gr) !== s4 && (null == (r3 = this.sessionPersistence) || r3.set_disabled(s4)), s4;
      }
      opt_in_capturing(t3) {
        var i2;
        if (this.config.cookieless_mode !== le) {
          if (this.config.cookieless_mode === ae && this.consent.isExplicitlyOptedOut()) {
            var e3, r3, s4, n3, o3;
            this.reset(true), null == (e3 = this.sessionManager) || e3.destroy(), null == (r3 = this.pageViewManager) || r3.destroy(), this.sessionManager = new Ls(this), this.pageViewManager = new ir(this), this.persistence && (this.sessionPropsManager = new As(this, this.sessionManager, this.persistence));
            var a2 = null !== (s4 = null == (n3 = this.config.__extensionClasses) ? void 0 : n3.sessionRecording) && void 0 !== s4 ? s4 : null == (o3 = __n.__defaultExtensionClasses) ? void 0 : o3.sessionRecording;
            a2 && (this.sessionRecording = this.Ii(this.sessionRecording, new a2(this)));
          }
          var l2, u2;
          this.consent.optInOut(true), this.Ki(), this.Zi(), null == (i2 = this.sessionRecording) || i2.startIfEnabledOrStop(), this.config.cookieless_mode == ae && (null == (l2 = this.surveys) || l2.loadIfEnabled()), (C(null == t3 ? void 0 : t3.captureEventName) || null != t3 && t3.captureEventName) && this.capture(null !== (u2 = null == t3 ? void 0 : t3.captureEventName) && void 0 !== u2 ? u2 : "$opt_in", null == t3 ? void 0 : t3.captureProperties, { send_instantly: true }), this.config.capture_pageview && this.$i();
        } else yi.warn(on);
      }
      opt_out_capturing() {
        var t3, i2, e3;
        this.config.cookieless_mode !== le ? (this.config.cookieless_mode === ae && this.consent.isOptedIn() && this.reset(true), this.consent.optInOut(false), this.Ki(), this.config.cookieless_mode === ae && (this.register({ distinct_id: se, $device_id: null }), null == (t3 = this.sessionManager) || t3.destroy(), null == (i2 = this.pageViewManager) || i2.destroy(), this.sessionManager = void 0, this.sessionPropsManager = void 0, null == (e3 = this.sessionRecording) || e3.stopRecording(), this.sessionRecording = void 0, this.$i())) : yi.warn(on);
      }
      has_opted_in_capturing() {
        return this.consent.isOptedIn();
      }
      has_opted_out_capturing() {
        return this.consent.isOptedOut();
      }
      get_explicit_consent_status() {
        var t3 = this.consent.consent;
        return 1 === t3 ? "granted" : 0 === t3 ? "denied" : "pending";
      }
      is_capturing() {
        return this.config.cookieless_mode === le || (this.config.cookieless_mode === ae ? this.consent.isExplicitlyOptedOut() || this.consent.isOptedIn() : !this.has_opted_out_capturing());
      }
      clear_opt_in_out_capturing() {
        this.consent.reset(), this.Ki();
      }
      _is_bot() {
        return e ? Us(e, this.config.custom_blocked_useragents) : void 0;
      }
      $i() {
        r && ("visible" === r.visibilityState ? this.xi || (this.xi = true, this.capture(fe, { title: r.title }, { send_instantly: true }), this.Ti && (r.removeEventListener(ve, this.Ti), this.Ti = null)) : this.Ti || (this.Ti = this.$i.bind(this), ke(r, ve, this.Ti)));
      }
      debug(i2) {
        false === i2 ? (null == t || t.console.log("You've disabled debug mode."), this.set_config({ debug: false })) : (null == t || t.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), this.set_config({ debug: true }));
      }
      Tr() {
        var t3, i2, e3, r3, s4, n3, o3 = this.Ni || {};
        return "advanced_disable_flags" in o3 ? !!o3.advanced_disable_flags : false !== this.config.advanced_disable_flags ? !!this.config.advanced_disable_flags : true === this.config.advanced_disable_decide ? (yi.warn("Config field 'advanced_disable_decide' is deprecated. Please use 'advanced_disable_flags' instead. The old field will be removed in a future major version."), true) : (e3 = "advanced_disable_decide", false, r3 = yi, s4 = (i2 = "advanced_disable_flags") in (t3 = o3) && !D(t3[i2]), n3 = e3 in t3 && !D(t3[e3]), s4 ? t3[i2] : !!n3 && (r3 && r3.warn("Config field '" + e3 + "' is deprecated. Please use '" + i2 + "' instead. The old field will be removed in a future major version."), t3[e3]));
      }
      Ui(t3) {
        if (D(this.config.before_send)) return t3;
        var i2 = R(this.config.before_send) ? this.config.before_send : [this.config.before_send], e3 = t3;
        for (var r3 of i2) {
          if (e3 = r3(e3), D(e3)) {
            var s4 = "Event '" + t3.event + "' was rejected in beforeSend function";
            return z(t3.event) ? yi.warn(s4 + ". This can cause unexpected behavior.") : yi.info(s4), null;
          }
          e3.properties && !I(e3.properties) || yi.warn("Event '" + t3.event + "' has no properties after beforeSend function, this is likely an error.");
        }
        return e3;
      }
      getPageViewId() {
        var t3;
        return null == (t3 = this.pageViewManager.lr) ? void 0 : t3.pageViewId;
      }
      captureTraceFeedback(t3, i2) {
        this.capture("$ai_feedback", { $ai_trace_id: String(t3), $ai_feedback_text: i2 });
      }
      captureTraceMetric(t3, i2, e3) {
        this.capture("$ai_metric", { $ai_trace_id: String(t3), $ai_metric_name: i2, $ai_metric_value: String(e3) });
      }
      Ri(t3) {
        var i2 = N(t3) && !t3, e3 = je.Yt() && "true" === je.Wt("ph_debug");
        return !i2 && (!!e3 || t3);
      }
    };
    _n.__defaultExtensionClasses = {}, function(t3, i2) {
      for (var e3 = 0; i2.length > e3; e3++) t3.prototype[i2[e3]] = Se(t3.prototype[i2[e3]]);
    }(_n, ["identify"]);
    Rn = ["a", "button", "form", "input", "select", "textarea", "label"];
    In = ["next", "previous", "prev", ">", "<"];
    Cn = [".ph-no-rageclick", ".ph-no-capture"];
    Fn = (t3) => !t3 || bn(t3, "html") || !mn(t3);
    An = (i2, e3) => {
      if (!t || Fn(i2)) return { parentIsUsefulElement: false, targetElementList: [] };
      for (var r3 = false, s4 = [i2], n3 = i2; n3.parentNode && !bn(n3, "body"); ) if (wn(n3.parentNode)) s4.push(n3.parentNode.host), n3 = n3.parentNode.host;
      else {
        var o3 = On(n3);
        if (!o3) break;
        if (e3 || Rn.indexOf(o3.tagName.toLowerCase()) > -1) r3 = true;
        else {
          var a2 = t.getComputedStyle(o3);
          a2 && "pointer" === a2.getPropertyValue("cursor") && (r3 = true);
        }
        s4.push(o3), n3 = o3;
      }
      return { parentIsUsefulElement: r3, targetElementList: s4 };
    };
    Ln = "(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11})";
    Un = new RegExp("^(?:" + Ln + ")$");
    Nn = new RegExp(Ln);
    jn = "\\d{3}-?\\d{2}-?\\d{4}";
    zn = new RegExp("^(" + jn + ")$");
    Bn = new RegExp("(" + jn + ")");
    Gn = class {
      constructor(t3) {
        this.disabled = false === t3;
        var i2 = O(t3) ? t3 : {};
        this.thresholdPx = i2.threshold_px || 30, this.timeoutMs = i2.timeout_ms || 1e3, this.clickCount = i2.click_count || 3, this.clicks = [];
      }
      isRageClick(t3, i2, e3) {
        if (this.disabled) return false;
        var r3 = this.clicks[this.clicks.length - 1];
        if (r3 && Math.abs(t3 - r3.x) + Math.abs(i2 - r3.y) < this.thresholdPx && this.timeoutMs > e3 - r3.timestamp) {
          if (this.clicks.push({ x: t3, y: i2, timestamp: e3 }), this.clicks.length === this.clickCount) return true;
        } else this.clicks = [{ x: t3, y: i2, timestamp: e3 }];
        return false;
      }
    };
    Jn = "$copy_autocapture";
    Kn = wi("[AutoCapture]");
    to = wi("[ExceptionAutocapture]");
    eo = wi("[TracingHeaders]");
    ro = wi("[Web Vitals]");
    so = 9e5;
    no = "disabled";
    oo = "lazy_loading";
    ao = "awaiting_config";
    lo = "missing_config";
    wi("[SessionRecording]");
    uo = "[SessionRecording]";
    ho = wi(uo);
    vo = wi("[Heatmaps]");
    fo = wi("[Product Tours]");
    po = "ph_product_tours";
    _o = ["$set_once", "$set"];
    go = wi("[SiteApps]");
    mo = "Error while initializing PostHog app with config id ";
    yo = class {
      constructor(t3) {
        this.Qi = new Ms(), this.tn = (t4, i2) => this.en(t4, i2) && this.rn(t4, i2) && this.nn(t4, i2) && this.sn(t4, i2), this.en = (t4, i2) => null == i2 || !i2.event || (null == t4 ? void 0 : t4.event) === (null == i2 ? void 0 : i2.event), this._instance = t3, this.an = /* @__PURE__ */ new Set(), this.ln = /* @__PURE__ */ new Set();
      }
      init() {
        var t3, i2;
        C(null == (t3 = this._instance) ? void 0 : t3._addCaptureHook) || (null == (i2 = this._instance) || i2._addCaptureHook((t4, i3) => {
          this.on(t4, i3);
        }));
      }
      register(t3) {
        var i2, e3;
        if (!C(null == (i2 = this._instance) ? void 0 : i2._addCaptureHook) && (t3.forEach((t4) => {
          var i3, e4;
          null == (i3 = this.ln) || i3.add(t4), null == (e4 = t4.steps) || e4.forEach((t5) => {
            var i4;
            null == (i4 = this.an) || i4.add((null == t5 ? void 0 : t5.event) || "");
          });
        }), null != (e3 = this._instance) && e3.autocapture)) {
          var r3, s4 = /* @__PURE__ */ new Set();
          t3.forEach((t4) => {
            var i3;
            null == (i3 = t4.steps) || i3.forEach((t5) => {
              null != t5 && t5.selector && s4.add(null == t5 ? void 0 : t5.selector);
            });
          }), null == (r3 = this._instance) || r3.autocapture.setElementSelectors(s4);
        }
      }
      on(t3, i2) {
        var e3;
        null != i2 && 0 != t3.length && (this.an.has(t3) || this.an.has(null == i2 ? void 0 : i2.event)) && this.ln && (null == (e3 = this.ln) ? void 0 : e3.size) > 0 && this.ln.forEach((t4) => {
          this.un(i2, t4) && this.Qi.emit("actionCaptured", t4.name);
        });
      }
      hn(t3) {
        this.onAction("actionCaptured", (i2) => t3(i2));
      }
      un(t3, i2) {
        if (null == (null == i2 ? void 0 : i2.steps)) return false;
        for (var e3 of i2.steps) if (this.tn(t3, e3)) return true;
        return false;
      }
      onAction(t3, i2) {
        return this.Qi.on(t3, i2);
      }
      rn(t3, i2) {
        if (null != i2 && i2.url) {
          var e3, r3 = null == t3 || null == (e3 = t3.properties) ? void 0 : e3.$current_url;
          if (!r3 || "string" != typeof r3) return false;
          if (!bo(r3, i2.url, i2.url_matching || "contains")) return false;
        }
        return true;
      }
      nn(t3, i2) {
        return !!this.cn(t3, i2) && !!this.dn(t3, i2) && !!this.vn(t3, i2);
      }
      cn(t3, i2) {
        var e3;
        if (null == i2 || !i2.href) return true;
        var r3 = this.fn(t3);
        if (r3.length > 0) return r3.some((t4) => bo(t4.href, i2.href, i2.href_matching || "exact"));
        var s4, n3 = (null == t3 || null == (e3 = t3.properties) ? void 0 : e3.$elements_chain) || "";
        return !!n3 && bo((s4 = n3.match(/(?::|")href="(.*?)"/)) ? s4[1] : "", i2.href, i2.href_matching || "exact");
      }
      dn(t3, i2) {
        var e3;
        if (null == i2 || !i2.text) return true;
        var r3 = this.fn(t3);
        if (r3.length > 0) return r3.some((t4) => bo(t4.text, i2.text, i2.text_matching || "exact") || bo(t4.$el_text, i2.text, i2.text_matching || "exact"));
        var s4, n3, o3, a2 = (null == t3 || null == (e3 = t3.properties) ? void 0 : e3.$elements_chain) || "";
        return !!a2 && (s4 = function(t4) {
          for (var i3, e4 = [], r4 = /(?::|")text="(.*?)"/g; !D(i3 = r4.exec(t4)); ) e4.includes(i3[1]) || e4.push(i3[1]);
          return e4;
        }(a2), n3 = i2.text, o3 = i2.text_matching || "exact", s4.some((t4) => bo(t4, n3, o3)));
      }
      vn(t3, i2) {
        var e3, r3;
        if (null == i2 || !i2.selector) return true;
        var s4 = null == t3 || null == (e3 = t3.properties) ? void 0 : e3.$element_selectors;
        if (null != s4 && s4.includes(i2.selector)) return true;
        var n3 = (null == t3 || null == (r3 = t3.properties) ? void 0 : r3.$elements_chain) || "";
        if (i2.selector_regex && n3) try {
          return new RegExp(i2.selector_regex).test(n3);
        } catch (t4) {
          return false;
        }
        return false;
      }
      fn(t3) {
        var i2;
        return null == (null == t3 || null == (i2 = t3.properties) ? void 0 : i2.$elements) ? [] : null == t3 ? void 0 : t3.properties.$elements;
      }
      sn(t3, i2) {
        return null == i2 || !i2.properties || 0 === i2.properties.length || Hs(i2.properties.reduce((t4, i3) => {
          var e3 = R(i3.value) ? i3.value.map(String) : null != i3.value ? [String(i3.value)] : [];
          return t4[i3.key] = { values: e3, operator: i3.operator || "exact" }, t4;
        }, {}), null == t3 ? void 0 : t3.properties);
      }
    };
    wo = class {
      constructor(t3) {
        this._instance = t3, this.pn = /* @__PURE__ */ new Map(), this.gn = /* @__PURE__ */ new Map(), this.mn = /* @__PURE__ */ new Map();
      }
      yn(t3, i2) {
        return !!t3 && Hs(t3.propertyFilters, null == i2 ? void 0 : i2.properties);
      }
      bn(t3, i2) {
        var e3 = /* @__PURE__ */ new Map();
        return t3.forEach((t4) => {
          var r3;
          null == (r3 = t4.conditions) || null == (r3 = r3[i2]) || null == (r3 = r3.values) || r3.forEach((i3) => {
            if (null != i3 && i3.name) {
              var r4 = e3.get(i3.name) || [];
              r4.push(t4.id), e3.set(i3.name, r4);
            }
          });
        }), e3;
      }
      wn(t3, i2, e3) {
        var r3 = (e3 === Sr.Activation ? this.pn : this.gn).get(t3), s4 = [];
        return this._n((t4) => {
          s4 = t4.filter((t5) => null == r3 ? void 0 : r3.includes(t5.id));
        }), s4.filter((r4) => {
          var s5, n3 = null == (s5 = r4.conditions) || null == (s5 = s5[e3]) || null == (s5 = s5.values) ? void 0 : s5.find((i3) => i3.name === t3);
          return this.yn(n3, i2);
        });
      }
      register(t3) {
        var i2;
        C(null == (i2 = this._instance) ? void 0 : i2._addCaptureHook) || (this.In(t3), this.Cn(t3));
      }
      Cn(t3) {
        var i2 = t3.filter((t4) => {
          var i3, e3;
          return (null == (i3 = t4.conditions) ? void 0 : i3.actions) && (null == (e3 = t4.conditions) || null == (e3 = e3.actions) || null == (e3 = e3.values) ? void 0 : e3.length) > 0;
        });
        0 !== i2.length && (null == this.Sn && (this.Sn = new yo(this._instance), this.Sn.init(), this.Sn.hn((t4) => {
          this.onAction(t4);
        })), i2.forEach((t4) => {
          var i3, e3, r3, s4, n3;
          t4.conditions && null != (i3 = t4.conditions) && i3.actions && null != (e3 = t4.conditions) && null != (e3 = e3.actions) && e3.values && (null == (r3 = t4.conditions) || null == (r3 = r3.actions) || null == (r3 = r3.values) ? void 0 : r3.length) > 0 && (null == (s4 = this.Sn) || s4.register(t4.conditions.actions.values), null == (n3 = t4.conditions) || null == (n3 = n3.actions) || null == (n3 = n3.values) || n3.forEach((i4) => {
            if (i4 && i4.name) {
              var e4 = this.mn.get(i4.name);
              e4 && e4.push(t4.id), this.mn.set(i4.name, e4 || [t4.id]);
            }
          }));
        }));
      }
      In(t3) {
        var i2, e3 = t3.filter((t4) => {
          var i3, e4;
          return (null == (i3 = t4.conditions) ? void 0 : i3.events) && (null == (e4 = t4.conditions) || null == (e4 = e4.events) || null == (e4 = e4.values) ? void 0 : e4.length) > 0;
        }), r3 = t3.filter((t4) => {
          var i3, e4;
          return (null == (i3 = t4.conditions) ? void 0 : i3.cancelEvents) && (null == (e4 = t4.conditions) || null == (e4 = e4.cancelEvents) || null == (e4 = e4.values) ? void 0 : e4.length) > 0;
        });
        0 === e3.length && 0 === r3.length || (null == (i2 = this._instance) || i2._addCaptureHook((t4, i3) => {
          this.onEvent(t4, i3);
        }), this.pn = this.bn(t3, Sr.Activation), this.gn = this.bn(t3, Sr.Cancellation));
      }
      onEvent(t3, i2) {
        var e3, r3 = this.re(), s4 = this.kn(), n3 = this.xn(), o3 = (null == (e3 = this._instance) || null == (e3 = e3.persistence) ? void 0 : e3.props[s4]) || [];
        if (n3 === t3 && i2 && o3.length > 0) {
          var a2, l2;
          r3.info("event matched, removing item from activated items", { event: t3, eventPayload: i2, existingActivatedItems: o3 });
          var u2 = (null == i2 || null == (a2 = i2.properties) ? void 0 : a2.$survey_id) || (null == i2 || null == (l2 = i2.properties) ? void 0 : l2.$product_tour_id);
          if (u2) {
            var h2 = o3.indexOf(u2);
            0 > h2 || (o3.splice(h2, 1), this.Tn(o3));
          }
        } else {
          if (this.gn.has(t3)) {
            var d2 = this.wn(t3, i2, Sr.Cancellation);
            d2.length > 0 && (r3.info("cancel event matched, cancelling items", { event: t3, itemsToCancel: d2.map((t4) => t4.id) }), d2.forEach((t4) => {
              var i3 = o3.indexOf(t4.id);
              0 > i3 || o3.splice(i3, 1), this.An(t4.id);
            }), this.Tn(o3));
          }
          if (this.pn.has(t3)) {
            r3.info("event name matched", { event: t3, eventPayload: i2, items: this.pn.get(t3) });
            var v2 = this.wn(t3, i2, Sr.Activation);
            this.Tn(o3.concat(v2.map((t4) => t4.id) || []));
          }
        }
      }
      onAction(t3) {
        var i2, e3 = this.kn(), r3 = (null == (i2 = this._instance) || null == (i2 = i2.persistence) ? void 0 : i2.props[e3]) || [];
        this.mn.has(t3) && this.Tn(r3.concat(this.mn.get(t3) || []));
      }
      Tn(t3) {
        var i2, e3 = this.re(), r3 = this.kn(), s4 = [...new Set(t3)].filter((t4) => !this.En(t4));
        e3.info("updating activated items", { activatedItems: s4 }), null == (i2 = this._instance) || null == (i2 = i2.persistence) || i2.register({ [r3]: s4 });
      }
      getActivatedIds() {
        var t3, i2 = this.kn();
        return (null == (t3 = this._instance) || null == (t3 = t3.persistence) ? void 0 : t3.props[i2]) || [];
      }
      getEventToItemsMap() {
        return this.pn;
      }
      Rn() {
        return this.Sn;
      }
    };
    Eo = class extends wo {
      constructor(t3) {
        super(t3);
      }
      kn() {
        return "$surveys_activated";
      }
      xn() {
        return Ir.SHOWN;
      }
      _n(t3) {
        var i2;
        null == (i2 = this._instance) || i2.getSurveys(t3);
      }
      An(t3) {
        var i2;
        null == (i2 = this._instance) || i2.cancelPendingSurvey(t3);
      }
      re() {
        return Ys;
      }
      En() {
        return false;
      }
      getSurveys() {
        return this.getActivatedIds();
      }
      getEventToSurveys() {
        return this.getEventToItemsMap();
      }
    };
    So = "SDK is not enabled or survey functionality is not yet loaded";
    xo = "Disabled. Not loading surveys.";
    To = null != t && t.location ? nr(t.location.hash, "__posthog") || nr(location.hash, "state") : null;
    $o = "_postHogToolbarParams";
    ko = wi("[Toolbar]");
    Ro = wi("[FeatureFlags]");
    Po = wi("[FeatureFlags]", { debugEnabled: true });
    Oo = `" failed. Feature flags didn't load in time.`;
    Io = "$active_feature_flags";
    Co = "$override_feature_flags";
    Fo = "$feature_flag_payloads";
    Ao = "$override_feature_flag_payloads";
    Mo = "$feature_flag_request_id";
    Do = (t3) => {
      for (var i2 = {}, e3 = 0; t3.length > e3; e3++) i2[t3[e3]] = true;
      return i2;
    };
    Lo = (t3) => {
      var i2 = {};
      for (var [e3, r3] of we(t3 || {})) r3 && (i2[e3] = r3);
      return i2;
    };
    Uo = wi("[Error tracking]");
    No = "Refusing to render web experiment since the viewer is a likely bot";
    jo = { icontains: (i2, e3) => !!t && e3.href.toLowerCase().indexOf(i2.toLowerCase()) > -1, not_icontains: (i2, e3) => !!t && -1 === e3.href.toLowerCase().indexOf(i2.toLowerCase()), regex: (i2, e3) => !!t && Ns(e3.href, i2), not_regex: (i2, e3) => !!t && !Ns(e3.href, i2), exact: (t3, i2) => i2.href === t3, is_not: (t3, i2) => i2.href !== t3 };
    zo = class _zo {
      get Rt() {
        return this._instance.config;
      }
      constructor(t3) {
        var i2 = this;
        this.getWebExperimentsAndEvaluateDisplayLogic = function(t4) {
          void 0 === t4 && (t4 = false), i2.getWebExperiments((t5) => {
            _zo.Nn("retrieved web experiments from the server"), i2.Mn = /* @__PURE__ */ new Map(), t5.forEach((t6) => {
              if (t6.feature_flag_key) {
                var e3;
                i2.Mn && (_zo.Nn("setting flag key ", t6.feature_flag_key, " to web experiment ", t6), null == (e3 = i2.Mn) || e3.set(t6.feature_flag_key, t6));
                var r3 = i2._instance.getFeatureFlag(t6.feature_flag_key);
                F(r3) && t6.variants[r3] && i2.Fn(t6.name, r3, t6.variants[r3].transforms);
              } else if (t6.variants) for (var s4 in t6.variants) {
                var n3 = t6.variants[s4];
                _zo.On(n3) && i2.Fn(t6.name, s4, n3.transforms);
              }
            });
          }, t4);
        }, this._instance = t3, this._instance.onFeatureFlags((t4) => {
          this.onFeatureFlags(t4);
        });
      }
      initialize() {
      }
      onFeatureFlags(t3) {
        if (this._is_bot()) _zo.Nn(No);
        else if (!this.Rt.disable_web_experiments) {
          if (D(this.Mn)) return this.Mn = /* @__PURE__ */ new Map(), this.loadIfEnabled(), void this.previewWebExperiment();
          _zo.Nn("applying feature flags", t3), t3.forEach((t4) => {
            var i2;
            if (this.Mn && null != (i2 = this.Mn) && i2.has(t4)) {
              var e3, r3 = this._instance.getFeatureFlag(t4), s4 = null == (e3 = this.Mn) ? void 0 : e3.get(t4);
              r3 && null != s4 && s4.variants[r3] && this.Fn(s4.name, r3, s4.variants[r3].transforms);
            }
          });
        }
      }
      previewWebExperiment() {
        var t3 = _zo.getWindowLocation();
        if (null != t3 && t3.search) {
          var i2 = rr(null == t3 ? void 0 : t3.search, "__experiment_id"), e3 = rr(null == t3 ? void 0 : t3.search, "__experiment_variant");
          i2 && e3 && (_zo.Nn("previewing web experiments " + i2 + " && " + e3), this.getWebExperiments((t4) => {
            this.Pn(parseInt(i2), e3, t4);
          }, false, true));
        }
      }
      loadIfEnabled() {
        this.Rt.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic();
      }
      getWebExperiments(t3, i2, e3) {
        if (this.Rt.disable_web_experiments && !e3) return t3([]);
        var r3 = this._instance.get_property("$web_experiments");
        if (r3 && !i2) return t3(r3);
        this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/web_experiments/?token=" + this.Rt.token), method: "GET", callback: (i3) => t3(200 === i3.statusCode && i3.json && i3.json.experiments || []) });
      }
      Pn(t3, i2, e3) {
        var r3 = e3.filter((i3) => i3.id === t3);
        r3 && r3.length > 0 && (_zo.Nn("Previewing web experiment [" + r3[0].name + "] with variant [" + i2 + "]"), this.Fn(r3[0].name, i2, r3[0].variants[i2].transforms));
      }
      static On(t3) {
        return !D(t3.conditions) && _zo.Ln(t3) && _zo.Dn(t3);
      }
      static Ln(t3) {
        var i2;
        if (D(t3.conditions) || D(null == (i2 = t3.conditions) ? void 0 : i2.url)) return true;
        var e3, r3, s4, n3 = _zo.getWindowLocation();
        return !!n3 && (null == (e3 = t3.conditions) || !e3.url || jo[null !== (r3 = null == (s4 = t3.conditions) ? void 0 : s4.urlMatchType) && void 0 !== r3 ? r3 : "icontains"](t3.conditions.url, n3));
      }
      static getWindowLocation() {
        return null == t ? void 0 : t.location;
      }
      static Dn(t3) {
        var i2;
        if (D(t3.conditions) || D(null == (i2 = t3.conditions) ? void 0 : i2.utm)) return true;
        var e3 = dr();
        if (e3.utm_source) {
          var r3, s4, n3, o3, a2, l2, u2, h2, d2 = null == (r3 = t3.conditions) || null == (r3 = r3.utm) || !r3.utm_campaign || (null == (s4 = t3.conditions) || null == (s4 = s4.utm) ? void 0 : s4.utm_campaign) == e3.utm_campaign, v2 = null == (n3 = t3.conditions) || null == (n3 = n3.utm) || !n3.utm_source || (null == (o3 = t3.conditions) || null == (o3 = o3.utm) ? void 0 : o3.utm_source) == e3.utm_source, c3 = null == (a2 = t3.conditions) || null == (a2 = a2.utm) || !a2.utm_medium || (null == (l2 = t3.conditions) || null == (l2 = l2.utm) ? void 0 : l2.utm_medium) == e3.utm_medium, f2 = null == (u2 = t3.conditions) || null == (u2 = u2.utm) || !u2.utm_term || (null == (h2 = t3.conditions) || null == (h2 = h2.utm) ? void 0 : h2.utm_term) == e3.utm_term;
          return d2 && c3 && f2 && v2;
        }
        return false;
      }
      static Nn(t3) {
        for (var i2 = arguments.length, e3 = new Array(i2 > 1 ? i2 - 1 : 0), r3 = 1; i2 > r3; r3++) e3[r3 - 1] = arguments[r3];
        yi.info("[WebExperiments] " + t3, e3);
      }
      Fn(t3, i2, e3) {
        this._is_bot() ? _zo.Nn(No) : "control" !== i2 ? e3.forEach((e4) => {
          if (e4.selector) {
            var r3;
            _zo.Nn("applying transform of variant " + i2 + " for experiment " + t3 + " ", e4);
            var s4 = null == (r3 = document) ? void 0 : r3.querySelectorAll(e4.selector);
            null == s4 || s4.forEach((t4) => {
              var i3 = t4;
              e4.html && (i3.innerHTML = e4.html), e4.css && i3.setAttribute("style", e4.css);
            });
          }
        }) : _zo.Nn("Control variants leave the page unmodified.");
      }
      _is_bot() {
        return e && this._instance ? Us(e, this.Rt.custom_blocked_useragents) : void 0;
      }
    };
    Bo = wi("[Conversations]");
    Ho = "Conversations not available yet.";
    qo = { featureFlags: class {
      constructor(t3) {
        this.Bn = false, this.jn = false, this.qn = false, this.Zn = false, this.$n = false, this.Hn = false, this.Vn = false, this.zn = false, this._instance = t3, this.featureFlagEventHandlers = [];
      }
      get Rt() {
        return this._instance.config;
      }
      get Kr() {
        return this._instance.persistence;
      }
      Yn(t3) {
        return this._instance.get_property(t3);
      }
      Un() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this.Kr) ? void 0 : i2.mr(this.Rt.feature_flag_cache_ttl_ms)) && void 0 !== t3 && t3;
      }
      Wn() {
        return !!this.Un() && (this.zn || this.qn || (this.zn = true, Ro.warn("Feature flag cache is stale, triggering refresh..."), this.reloadFeatureFlags()), true);
      }
      Gn() {
        var t3, i2 = null !== (t3 = this.Rt.evaluation_contexts) && void 0 !== t3 ? t3 : this.Rt.evaluation_environments;
        return !this.Rt.evaluation_environments || this.Rt.evaluation_contexts || this.Vn || (Ro.warn("evaluation_environments is deprecated. Use evaluation_contexts instead. evaluation_environments will be removed in a future version."), this.Vn = true), null != i2 && i2.length ? i2.filter((t4) => {
          var i3 = t4 && "string" == typeof t4 && t4.trim().length > 0;
          return i3 || Ro.error("Invalid evaluation context found:", t4, "Expected non-empty string"), i3;
        }) : [];
      }
      Xn() {
        return this.Gn().length > 0;
      }
      initialize() {
        var t3, i2, { config: e3 } = this._instance, r3 = null !== (t3 = null == (i2 = e3.bootstrap) ? void 0 : i2.featureFlags) && void 0 !== t3 ? t3 : {};
        if (Object.keys(r3).length) {
          var s4, n3, o3 = null !== (s4 = null == (n3 = e3.bootstrap) ? void 0 : n3.featureFlagPayloads) && void 0 !== s4 ? s4 : {}, a2 = Object.keys(r3).filter((t4) => !!r3[t4]).reduce((t4, i3) => (t4[i3] = r3[i3] || false, t4), {}), l2 = Object.keys(o3).filter((t4) => a2[t4]).reduce((t4, i3) => (o3[i3] && (t4[i3] = o3[i3]), t4), {});
          this.receivedFeatureFlags({ featureFlags: a2, featureFlagPayloads: l2 });
        }
      }
      updateFlags(t3, i2, e3) {
        var r3 = null != e3 && e3.merge ? this.getFlagVariants() : {}, s4 = null != e3 && e3.merge ? this.getFlagPayloads() : {}, n3 = p({}, r3, t3), o3 = p({}, s4, i2), a2 = {};
        for (var [l2, u2] of Object.entries(n3)) {
          var h2 = "string" == typeof u2;
          a2[l2] = { key: l2, enabled: !!h2 || Boolean(u2), variant: h2 ? u2 : void 0, reason: void 0, metadata: C(null == o3 ? void 0 : o3[l2]) ? void 0 : { id: 0, version: void 0, description: void 0, payload: o3[l2] } };
        }
        this.receivedFeatureFlags({ flags: a2 });
      }
      get hasLoadedFlags() {
        return this.jn;
      }
      getFlags() {
        return Object.keys(this.getFlagVariants());
      }
      getFlagsWithDetails() {
        var t3 = this.Yn(Bi), i2 = this.Yn(Co), e3 = this.Yn(Ao);
        if (!e3 && !i2) return t3 || {};
        var r3 = ye({}, t3 || {}), s4 = [.../* @__PURE__ */ new Set([...Object.keys(e3 || {}), ...Object.keys(i2 || {})])];
        for (var n3 of s4) {
          var o3, a2, l2 = r3[n3], u2 = null == i2 ? void 0 : i2[n3], h2 = C(u2) ? null !== (o3 = null == l2 ? void 0 : l2.enabled) && void 0 !== o3 && o3 : !!u2, d2 = C(u2) ? l2.variant : "string" == typeof u2 ? u2 : void 0, v2 = null == e3 ? void 0 : e3[n3], c3 = p({}, l2, { enabled: h2, variant: h2 ? null != d2 ? d2 : null == l2 ? void 0 : l2.variant : void 0 });
          h2 !== (null == l2 ? void 0 : l2.enabled) && (c3.original_enabled = null == l2 ? void 0 : l2.enabled), d2 !== (null == l2 ? void 0 : l2.variant) && (c3.original_variant = null == l2 ? void 0 : l2.variant), v2 && (c3.metadata = p({}, null == l2 ? void 0 : l2.metadata, { payload: v2, original_payload: null == l2 || null == (a2 = l2.metadata) ? void 0 : a2.payload })), r3[n3] = c3;
        }
        return this.Bn || (Ro.warn(" Overriding feature flag details!", { flagDetails: t3, overriddenPayloads: e3, finalDetails: r3 }), this.Bn = true), r3;
      }
      getFlagVariants() {
        var t3 = this.Yn(ji), i2 = this.Yn(Co);
        if (!i2) return t3 || {};
        for (var e3 = ye({}, t3), r3 = Object.keys(i2), s4 = 0; r3.length > s4; s4++) e3[r3[s4]] = i2[r3[s4]];
        return this.Bn || (Ro.warn(" Overriding feature flags!", { enabledFlags: t3, overriddenFlags: i2, finalFlags: e3 }), this.Bn = true), e3;
      }
      getFlagPayloads() {
        var t3 = this.Yn(Fo), i2 = this.Yn(Ao);
        if (!i2) return t3 || {};
        for (var e3 = ye({}, t3 || {}), r3 = Object.keys(i2), s4 = 0; r3.length > s4; s4++) e3[r3[s4]] = i2[r3[s4]];
        return this.Bn || (Ro.warn(" Overriding feature flag payloads!", { flagPayloads: t3, overriddenPayloads: i2, finalPayloads: e3 }), this.Bn = true), e3;
      }
      reloadFeatureFlags() {
        this.Zn || this.Rt.advanced_disable_feature_flags || this.Jn || (this._instance.ki.emit("featureFlagsReloading", true), this.Jn = setTimeout(() => {
          this.Kn();
        }, 5));
      }
      Qn() {
        clearTimeout(this.Jn), this.Jn = void 0;
      }
      ensureFlagsLoaded() {
        this.jn || this.qn || this.Jn || this.reloadFeatureFlags();
      }
      setAnonymousDistinctId(t3) {
        this.$anon_distinct_id = t3;
      }
      setReloadingPaused(t3) {
        this.Zn = t3;
      }
      Kn(t3) {
        var i2;
        if (this.Qn(), !this._instance.Tr()) if (this.qn) this.$n = true;
        else {
          var e3 = this.Rt.token, r3 = this.Yn(Ti), s4 = { token: e3, distinct_id: this._instance.get_distinct_id(), groups: this._instance.getGroups(), $anon_distinct_id: this.$anon_distinct_id, person_properties: p({}, (null == (i2 = this.Kr) ? void 0 : i2.get_initial_props()) || {}, this.Yn(Hi) || {}), group_properties: this.Yn(qi), timezone: br() };
          M(r3) || C(r3) || (s4.$device_id = r3), (null != t3 && t3.disableFlags || this.Rt.advanced_disable_feature_flags) && (s4.disable_flags = true), this.Xn() && (s4.evaluation_contexts = this.Gn());
          var n3 = this._instance.requestRouter.endpointFor("flags", "/flags/?v=2" + (this.Rt.advanced_only_evaluate_survey_feature_flags ? "&only_evaluate_survey_feature_flags=true" : ""));
          this.qn = true, this._instance._send_request({ method: "POST", url: n3, data: s4, compression: this.Rt.disable_compression ? void 0 : Br.Base64, timeout: this.Rt.feature_flag_request_timeout_ms, callback: (t4) => {
            var i3, e4, r4, n4 = true;
            if (200 === t4.statusCode && (this.$n || (this.$anon_distinct_id = void 0), n4 = false), this.qn = false, !s4.disable_flags || this.$n) {
              this.Hn = !n4;
              var o3 = [];
              t4.error ? t4.error instanceof Error ? o3.push("AbortError" === t4.error.name ? "timeout" : "connection_error") : o3.push("unknown_error") : 200 !== t4.statusCode && o3.push("api_error_" + t4.statusCode), null != (i3 = t4.json) && i3.errorsWhileComputingFlags && o3.push("errors_while_computing_flags");
              var a2, l2 = !(null == (e4 = t4.json) || null == (e4 = e4.quotaLimited) || !e4.includes("feature_flags"));
              if (l2 && o3.push("quota_limited"), null == (r4 = this.Kr) || r4.register({ [Gi]: o3 }), l2) Ro.warn("You have hit your feature flags quota limit, and will not be able to load feature flags until the quota is reset.  Please visit https://posthog.com/docs/billing/limits-alerts to learn more.");
              else s4.disable_flags || this.receivedFeatureFlags(null !== (a2 = t4.json) && void 0 !== a2 ? a2 : {}, n4), this.$n && (this.$n = false, this.Kn());
            }
          } });
        }
      }
      getFeatureFlag(t3, i2) {
        var e3;
        if (void 0 === i2 && (i2 = {}), !i2.fresh || this.Hn) if (this.jn || this.getFlags() && this.getFlags().length > 0) {
          if (!this.Wn()) {
            var r3 = this.getFeatureFlagResult(t3, i2);
            return null !== (e3 = null == r3 ? void 0 : r3.variant) && void 0 !== e3 ? e3 : null == r3 ? void 0 : r3.enabled;
          }
        } else Ro.warn('getFeatureFlag for key "' + t3 + Oo);
      }
      getFeatureFlagDetails(t3) {
        return this.getFlagsWithDetails()[t3];
      }
      getFeatureFlagPayload(t3) {
        var i2 = this.getFeatureFlagResult(t3, { send_event: false });
        return null == i2 ? void 0 : i2.payload;
      }
      getFeatureFlagResult(t3, i2) {
        if (void 0 === i2 && (i2 = {}), !i2.fresh || this.Hn) if (this.jn || this.getFlags() && this.getFlags().length > 0) {
          if (!this.Wn()) {
            var e3 = this.getFlagVariants(), r3 = t3 in e3, s4 = e3[t3], n3 = this.getFlagPayloads()[t3], o3 = String(s4), a2 = this.Yn(Mo) || void 0, l2 = this.Yn(Ji) || void 0, u2 = this.Yn(Vi) || {};
            if (this.Rt.advanced_feature_flags_dedup_per_session) {
              var h2, d2 = this._instance.get_session_id(), v2 = this.Yn(Yi);
              d2 && d2 !== v2 && (u2 = {}, null == (h2 = this.Kr) || h2.register({ [Vi]: u2, [Yi]: d2 }));
            }
            if ((i2.send_event || !("send_event" in i2)) && (!(t3 in u2) || !u2[t3].includes(o3))) {
              var c3, f2, p2, _2, g2, m2, b2, y2, w2, E2;
              R(u2[t3]) ? u2[t3].push(o3) : u2[t3] = [o3], null == (c3 = this.Kr) || c3.register({ [Vi]: u2 });
              var S2 = this.getFeatureFlagDetails(t3), x2 = [...null !== (f2 = this.Yn(Gi)) && void 0 !== f2 ? f2 : []];
              C(s4) && x2.push("flag_missing");
              var T2 = { $feature_flag: t3, $feature_flag_response: s4, $feature_flag_payload: n3 || null, $feature_flag_request_id: a2, $feature_flag_evaluated_at: l2, $feature_flag_bootstrapped_response: (null == (p2 = this.Rt.bootstrap) || null == (p2 = p2.featureFlags) ? void 0 : p2[t3]) || null, $feature_flag_bootstrapped_payload: (null == (_2 = this.Rt.bootstrap) || null == (_2 = _2.featureFlagPayloads) ? void 0 : _2[t3]) || null, $used_bootstrap_value: !this.Hn };
              C(null == S2 || null == (g2 = S2.metadata) ? void 0 : g2.version) || (T2.$feature_flag_version = S2.metadata.version);
              var k2, P2 = null !== (m2 = null == S2 || null == (b2 = S2.reason) ? void 0 : b2.description) && void 0 !== m2 ? m2 : null == S2 || null == (y2 = S2.reason) ? void 0 : y2.code;
              P2 && (T2.$feature_flag_reason = P2), null != S2 && null != (w2 = S2.metadata) && w2.id && (T2.$feature_flag_id = S2.metadata.id), C(null == S2 ? void 0 : S2.original_variant) && C(null == S2 ? void 0 : S2.original_enabled) || (T2.$feature_flag_original_response = C(S2.original_variant) ? S2.original_enabled : S2.original_variant), null != S2 && null != (E2 = S2.metadata) && E2.original_payload && (T2.$feature_flag_original_payload = null == S2 || null == (k2 = S2.metadata) ? void 0 : k2.original_payload), x2.length && (T2.$feature_flag_error = x2.join(",")), this._instance.capture("$feature_flag_called", T2);
            }
            if (r3) {
              var O2 = n3;
              if (!C(n3)) try {
                O2 = JSON.parse(n3);
              } catch (t4) {
              }
              return { key: t3, enabled: !!s4, variant: "string" == typeof s4 ? s4 : void 0, payload: O2 };
            }
          }
        } else Ro.warn('getFeatureFlagResult for key "' + t3 + Oo);
      }
      getRemoteConfigPayload(t3, i2) {
        var e3 = this.Rt.token, r3 = { distinct_id: this._instance.get_distinct_id(), token: e3 };
        this.Xn() && (r3.evaluation_contexts = this.Gn()), this._instance._send_request({ method: "POST", url: this._instance.requestRouter.endpointFor("flags", "/flags/?v=2"), data: r3, compression: this.Rt.disable_compression ? void 0 : Br.Base64, timeout: this.Rt.feature_flag_request_timeout_ms, callback(e4) {
          var r4, s4 = null == (r4 = e4.json) ? void 0 : r4.featureFlagPayloads;
          i2((null == s4 ? void 0 : s4[t3]) || void 0);
        } });
      }
      isFeatureEnabled(t3, i2) {
        if (void 0 === i2 && (i2 = {}), !i2.fresh || this.Hn) {
          if (this.jn || this.getFlags() && this.getFlags().length > 0) {
            var e3 = this.getFeatureFlag(t3, i2);
            return C(e3) ? void 0 : !!e3;
          }
          Ro.warn('isFeatureEnabled for key "' + t3 + Oo);
        }
      }
      addFeatureFlagsHandler(t3) {
        this.featureFlagEventHandlers.push(t3);
      }
      removeFeatureFlagsHandler(t3) {
        this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter((i2) => i2 !== t3);
      }
      receivedFeatureFlags(t3, i2) {
        if (this.Kr) {
          this.jn = true;
          var e3 = this.getFlagVariants(), r3 = this.getFlagPayloads(), s4 = this.getFlagsWithDetails();
          !function(t4, i3, e4, r4, s5) {
            void 0 === e4 && (e4 = {}), void 0 === r4 && (r4 = {}), void 0 === s5 && (s5 = {});
            var n3 = ((t5) => {
              var i4 = t5.flags;
              return i4 ? (t5.featureFlags = Object.fromEntries(Object.keys(i4).map((t6) => {
                var e5;
                return [t6, null !== (e5 = i4[t6].variant) && void 0 !== e5 ? e5 : i4[t6].enabled];
              })), t5.featureFlagPayloads = Object.fromEntries(Object.keys(i4).filter((t6) => i4[t6].enabled).filter((t6) => {
                var e5;
                return null == (e5 = i4[t6].metadata) ? void 0 : e5.payload;
              }).map((t6) => {
                var e5;
                return [t6, null == (e5 = i4[t6].metadata) ? void 0 : e5.payload];
              }))) : Ro.warn("Using an older version of the feature flags endpoint. Please upgrade your PostHog server to the latest version"), t5;
            })(t4), o3 = n3.flags, a2 = n3.featureFlags, l2 = n3.featureFlagPayloads;
            if (a2) {
              var u2 = t4.requestId, h2 = t4.evaluatedAt;
              if (R(a2)) {
                Ro.warn("v1 of the feature flags endpoint is deprecated. Please use the latest version.");
                var d2 = {};
                if (a2) for (var v2 = 0; a2.length > v2; v2++) d2[a2[v2]] = true;
                i3 && i3.register({ [Io]: a2, [ji]: d2 });
              } else {
                var c3 = a2, f2 = l2, _2 = o3;
                if (t4.errorsWhileComputingFlags) if (o3) {
                  var g2 = new Set(Object.keys(o3).filter((t5) => {
                    var i4;
                    return !(null != (i4 = o3[t5]) && i4.failed);
                  }));
                  c3 = p({}, e4, Object.fromEntries(Object.entries(c3).filter((t5) => {
                    var [i4] = t5;
                    return g2.has(i4);
                  }))), f2 = p({}, r4, Object.fromEntries(Object.entries(f2 || {}).filter((t5) => {
                    var [i4] = t5;
                    return g2.has(i4);
                  }))), _2 = p({}, s5, Object.fromEntries(Object.entries(_2 || {}).filter((t5) => {
                    var [i4] = t5;
                    return g2.has(i4);
                  })));
                } else c3 = p({}, e4, c3), f2 = p({}, r4, f2), _2 = p({}, s5, _2);
                i3 && i3.register(p({ [Io]: Object.keys(Lo(c3)), [ji]: c3 || {}, [Fo]: f2 || {}, [Bi]: _2 || {} }, u2 ? { [Mo]: u2 } : {}, h2 ? { [Ji]: h2 } : {}));
              }
            }
          }(t3, this.Kr, e3, r3, s4), i2 || (this.zn = false), this.ts(i2);
        }
      }
      override(t3, i2) {
        void 0 === i2 && (i2 = false), Ro.warn("override is deprecated. Please use overrideFeatureFlags instead."), this.overrideFeatureFlags({ flags: t3, suppressWarning: i2 });
      }
      overrideFeatureFlags(t3) {
        if (!this._instance.__loaded || !this.Kr) return Ro.uninitializedWarning("posthog.featureFlags.overrideFeatureFlags");
        if (false === t3) return this.Kr.unregister(Co), this.Kr.unregister(Ao), this.ts(), Po.info("All overrides cleared");
        if (R(t3)) {
          var i2 = Do(t3);
          return this.Kr.register({ [Co]: i2 }), this.ts(), Po.info("Flag overrides set", { flags: t3 });
        }
        if (t3 && "object" == typeof t3 && ("flags" in t3 || "payloads" in t3)) {
          var e3, r3 = t3;
          if (this.Bn = Boolean(null !== (e3 = r3.suppressWarning) && void 0 !== e3 && e3), "flags" in r3) {
            if (false === r3.flags) this.Kr.unregister(Co), Po.info("Flag overrides cleared");
            else if (r3.flags) {
              if (R(r3.flags)) {
                var s4 = Do(r3.flags);
                this.Kr.register({ [Co]: s4 });
              } else this.Kr.register({ [Co]: r3.flags });
              Po.info("Flag overrides set", { flags: r3.flags });
            }
          }
          return "payloads" in r3 && (false === r3.payloads ? (this.Kr.unregister(Ao), Po.info("Payload overrides cleared")) : r3.payloads && (this.Kr.register({ [Ao]: r3.payloads }), Po.info("Payload overrides set", { payloads: r3.payloads }))), void this.ts();
        }
        if (t3 && "object" == typeof t3) return this.Kr.register({ [Co]: t3 }), this.ts(), Po.info("Flag overrides set", { flags: t3 });
        Ro.warn("Invalid overrideOptions provided to overrideFeatureFlags", { overrideOptions: t3 });
      }
      onFeatureFlags(t3) {
        if (this.addFeatureFlagsHandler(t3), this.jn) {
          var { flags: i2, flagVariants: e3 } = this.es();
          t3(i2, e3);
        }
        return () => this.removeFeatureFlagsHandler(t3);
      }
      updateEarlyAccessFeatureEnrollment(t3, i2, e3) {
        var r3, s4 = (this.Yn(zi) || []).find((i3) => i3.flagKey === t3), n3 = { ["$feature_enrollment/" + t3]: i2 }, o3 = { $feature_flag: t3, $feature_enrollment: i2, $set: n3 };
        s4 && (o3.$early_access_feature_name = s4.name), e3 && (o3.$feature_enrollment_stage = e3), this._instance.capture("$feature_enrollment_update", o3), this.setPersonPropertiesForFlags(n3, false);
        var a2 = p({}, this.getFlagVariants(), { [t3]: i2 });
        null == (r3 = this.Kr) || r3.register({ [Io]: Object.keys(Lo(a2)), [ji]: a2 }), this.ts();
      }
      getEarlyAccessFeatures(t3, i2, e3) {
        void 0 === i2 && (i2 = false);
        var r3 = this.Yn(zi), s4 = e3 ? "&" + e3.map((t4) => "stage=" + t4).join("&") : "";
        if (r3 && !i2) return t3(r3);
        this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/early_access_features/?token=" + this.Rt.token + s4), method: "GET", callback: (i3) => {
          var e4, r4;
          if (i3.json) {
            var s5 = i3.json.earlyAccessFeatures;
            return null == (e4 = this.Kr) || e4.unregister(zi), null == (r4 = this.Kr) || r4.register({ [zi]: s5 }), t3(s5);
          }
        } });
      }
      es() {
        var t3 = this.getFlags(), i2 = this.getFlagVariants();
        return { flags: t3.filter((t4) => i2[t4]), flagVariants: Object.keys(i2).filter((t4) => i2[t4]).reduce((t4, e3) => (t4[e3] = i2[e3], t4), {}) };
      }
      ts(t3) {
        var { flags: i2, flagVariants: e3 } = this.es();
        this.featureFlagEventHandlers.forEach((r3) => r3(i2, e3, { errorsLoading: t3 }));
      }
      setPersonPropertiesForFlags(t3, i2) {
        void 0 === i2 && (i2 = true);
        var e3 = this.Yn(Hi) || {};
        this._instance.register({ [Hi]: p({}, e3, t3) }), i2 && this._instance.reloadFeatureFlags();
      }
      resetPersonPropertiesForFlags() {
        this._instance.unregister(Hi);
      }
      setGroupPropertiesForFlags(t3, i2) {
        void 0 === i2 && (i2 = true);
        var e3 = this.Yn(qi) || {};
        0 !== Object.keys(e3).length && Object.keys(e3).forEach((i3) => {
          e3[i3] = p({}, e3[i3], t3[i3]), delete t3[i3];
        }), this._instance.register({ [qi]: p({}, e3, t3) }), i2 && this._instance.reloadFeatureFlags();
      }
      resetGroupPropertiesForFlags(t3) {
        if (t3) {
          var i2 = this.Yn(qi) || {};
          this._instance.register({ [qi]: p({}, i2, { [t3]: {} }) });
        } else this._instance.unregister(qi);
      }
      reset() {
        this.jn = false, this.qn = false, this.Zn = false, this.$n = false, this.Hn = false, this.$anon_distinct_id = void 0, this.Qn(), this.Bn = false;
      }
    } };
    Wo = { sessionRecording: class {
      get Rt() {
        return this._instance.config;
      }
      get Kr() {
        return this._instance.persistence;
      }
      get started() {
        var t3;
        return !(null == (t3 = this.rs) || !t3.isStarted);
      }
      get status() {
        var t3, i2;
        return this.ns === ao || this.ns === lo ? this.ns : null !== (t3 = null == (i2 = this.rs) ? void 0 : i2.status) && void 0 !== t3 ? t3 : this.ns;
      }
      constructor(t3) {
        if (this._forceAllowLocalhostNetworkCapture = false, this.ns = no, this.ss = void 0, this._instance = t3, !this._instance.sessionManager) throw ho.error("started without valid sessionManager"), new Error(uo + " started without valid sessionManager. This is a bug.");
        if (this.Rt.cookieless_mode === le) throw new Error(uo + ' cannot be used with cookieless_mode="always"');
      }
      initialize() {
        this.startIfEnabledOrStop();
      }
      get os() {
        var i2, e3 = !(null == (i2 = this._instance.get_property(Li)) || !i2.enabled), r3 = !this.Rt.disable_session_recording, s4 = this.Rt.disable_session_recording || this._instance.consent.isOptedOut();
        return t && e3 && r3 && !s4;
      }
      startIfEnabledOrStop(t3) {
        var i2;
        if (!this.os || null == (i2 = this.rs) || !i2.isStarted) {
          var e3 = !C(Object.assign) && !C(Array.from);
          this.os && e3 ? (this.ls(t3), ho.info("starting")) : (this.ns = no, this.stopRecording());
        }
      }
      ls(t3) {
        var i2, e3, r3;
        this.os && (this.ns !== ao && this.ns !== lo && (this.ns = oo), null != h && null != (i2 = h.__PosthogExtensions__) && null != (i2 = i2.rrweb) && i2.record && null != (e3 = h.__PosthogExtensions__) && e3.initSessionRecording ? this.us(t3) : null == (r3 = h.__PosthogExtensions__) || null == r3.loadExternalDependency || r3.loadExternalDependency(this._instance, this.hs, (i3) => {
          if (i3) return ho.error("could not load recorder", i3);
          this.us(t3);
        }));
      }
      stopRecording() {
        var t3, i2;
        null == (t3 = this.ss) || t3.call(this), this.ss = void 0, null == (i2 = this.rs) || i2.stop();
      }
      cs() {
        var t3, i2;
        null == (t3 = this.ss) || t3.call(this), this.ss = void 0, null == (i2 = this.rs) || i2.discard();
      }
      ds() {
        var t3;
        null == (t3 = this.Kr) || t3.unregister(Ni);
      }
      vs(t3, i2) {
        if (D(t3)) return null;
        var e3, r3 = L(t3) ? t3 : parseFloat(t3);
        return "number" != typeof (e3 = r3) || !Number.isFinite(e3) || 0 > e3 || e3 > 1 ? (ho.warn(i2 + " must be between 0 and 1. Ignoring invalid value:", t3), null) : r3;
      }
      fs(t3) {
        if (this.Kr) {
          var i2, e3, r3 = this.Kr, s4 = () => {
            var i3, e4 = false === t3.sessionRecording ? void 0 : t3.sessionRecording, s5 = this.vs(null == (i3 = this.Rt.session_recording) ? void 0 : i3.sampleRate, "session_recording.sampleRate"), n3 = this.vs(null == e4 ? void 0 : e4.sampleRate, "remote config sampleRate"), o3 = null != s5 ? s5 : n3;
            D(o3) && this.ds();
            var a2 = null == e4 ? void 0 : e4.minimumDurationMilliseconds;
            r3.register({ [Li]: p({ cache_timestamp: Date.now(), enabled: !!e4 }, e4, { networkPayloadCapture: p({ capturePerformance: t3.capturePerformance }, null == e4 ? void 0 : e4.networkPayloadCapture), canvasRecording: { enabled: null == e4 ? void 0 : e4.recordCanvas, fps: null == e4 ? void 0 : e4.canvasFps, quality: null == e4 ? void 0 : e4.canvasQuality }, sampleRate: o3, minimumDurationMilliseconds: C(a2) ? null : a2, endpoint: null == e4 ? void 0 : e4.endpoint, triggerMatchType: null == e4 ? void 0 : e4.triggerMatchType, masking: null == e4 ? void 0 : e4.masking, urlTriggers: null == e4 ? void 0 : e4.urlTriggers }) });
          };
          s4(), null == (i2 = this.ss) || i2.call(this), this.ss = null == (e3 = this._instance.sessionManager) ? void 0 : e3.onSessionId(s4);
        }
      }
      onRemoteConfig(t3) {
        return "sessionRecording" in t3 ? false === t3.sessionRecording ? (this.fs(t3), void this.cs()) : (this.fs(t3), void this.startIfEnabledOrStop()) : (this.ns === ao && (this.ns = lo, ho.warn("config refresh failed, recording will not start until page reload")), void this.startIfEnabledOrStop());
      }
      log(t3, i2) {
        var e3;
        void 0 === i2 && (i2 = "log"), null != (e3 = this.rs) && e3.log ? this.rs.log(t3, i2) : ho.warn("log called before recorder was ready");
      }
      get hs() {
        var t3, i2, e3 = null == (t3 = this._instance) || null == (t3 = t3.persistence) ? void 0 : t3.get_property(Li);
        return (null == e3 || null == (i2 = e3.scriptConfig) ? void 0 : i2.script) || "lazy-recorder";
      }
      ps() {
        var t3, i2 = this._instance.get_property(Li);
        if (!i2) return false;
        var e3 = null !== (t3 = ("object" == typeof i2 ? i2 : JSON.parse(i2)).cache_timestamp) && void 0 !== t3 ? t3 : Date.now();
        return 36e5 >= Date.now() - e3;
      }
      us(t3) {
        var i2, e3;
        if (null == (i2 = h.__PosthogExtensions__) || !i2.initSessionRecording) return ho.warn("Called on script loaded before session recording is available. This can be caused by adblockers."), void this._instance.register_for_session({ $sdk_debug_recording_script_not_loaded: true });
        if (this.rs || (this.rs = null == (e3 = h.__PosthogExtensions__) ? void 0 : e3.initSessionRecording(this._instance), this.rs._forceAllowLocalhostNetworkCapture = this._forceAllowLocalhostNetworkCapture), !this.ps()) {
          if (this.ns === lo || this.ns === ao) return;
          return this.ns = ao, ho.info("persisted remote config is stale, requesting fresh config before starting"), void new jr(this._instance).load();
        }
        this.ns = oo, this.rs.start(t3);
      }
      onRRwebEmit(t3) {
        var i2;
        null == (i2 = this.rs) || null == i2.onRRwebEmit || i2.onRRwebEmit(t3);
      }
      overrideLinkedFlag() {
        var t3, i2;
        this.rs || null == (i2 = this.Kr) || i2.register({ $replay_override_linked_flag: true }), null == (t3 = this.rs) || t3.overrideLinkedFlag();
      }
      overrideSampling() {
        var t3, i2;
        this.rs || null == (i2 = this.Kr) || i2.register({ $replay_override_sampling: true }), null == (t3 = this.rs) || t3.overrideSampling();
      }
      overrideTrigger(t3) {
        var i2, e3;
        this.rs || null == (e3 = this.Kr) || e3.register({ ["url" === t3 ? "$replay_override_url_trigger" : "$replay_override_event_trigger"]: true }), null == (i2 = this.rs) || i2.overrideTrigger(t3);
      }
      get sdkDebugProperties() {
        var t3;
        return (null == (t3 = this.rs) ? void 0 : t3.sdkDebugProperties) || { $recording_status: this.status };
      }
      tryAddCustomEvent(t3, i2) {
        var e3;
        return !(null == (e3 = this.rs) || !e3.tryAddCustomEvent(t3, i2));
      }
    } };
    Vo = { autocapture: class {
      constructor(t3) {
        this.gs = false, this.ys = null, this.bs = false, this.instance = t3, this.rageclicks = new Gn(t3.config.rageclick), this.ws = null;
      }
      initialize() {
        this.startIfEnabled();
      }
      get Rt() {
        var t3, i2, e3 = O(this.instance.config.autocapture) ? this.instance.config.autocapture : {};
        return e3.url_allowlist = null == (t3 = e3.url_allowlist) ? void 0 : t3.map((t4) => new RegExp(t4)), e3.url_ignorelist = null == (i2 = e3.url_ignorelist) ? void 0 : i2.map((t4) => new RegExp(t4)), e3;
      }
      _s() {
        if (this.isBrowserSupported()) {
          if (t && r) {
            var i2 = (i3) => {
              i3 = i3 || (null == t ? void 0 : t.event);
              try {
                this.Is(i3);
              } catch (t3) {
                Kn.error("Failed to capture event", t3);
              }
            };
            if (ke(r, "submit", i2, { capture: true }), ke(r, "change", i2, { capture: true }), ke(r, "click", i2, { capture: true }), this.Rt.capture_copied_text) {
              var e3 = (i3) => {
                this.Is(i3 = i3 || (null == t ? void 0 : t.event), Jn);
              };
              ke(r, "copy", e3, { capture: true }), ke(r, "cut", e3, { capture: true });
            }
          }
        } else Kn.info("Disabling Automatic Event Collection because this browser is not supported");
      }
      startIfEnabled() {
        this.isEnabled && !this.gs && (this._s(), this.gs = true);
      }
      onRemoteConfig(t3) {
        t3.elementsChainAsString && (this.bs = t3.elementsChainAsString), this.instance.persistence && this.instance.persistence.register({ [Ri]: !!t3.autocapture_opt_out }), this.ys = !!t3.autocapture_opt_out, this.startIfEnabled();
      }
      setElementSelectors(t3) {
        this.ws = t3;
      }
      getElementSelectors(t3) {
        var i2, e3 = [];
        return null == (i2 = this.ws) || i2.forEach((i3) => {
          var s4 = null == r ? void 0 : r.querySelectorAll(i3);
          null == s4 || s4.forEach((r3) => {
            t3 === r3 && e3.push(i3);
          });
        }), e3;
      }
      get isEnabled() {
        var t3, i2, e3 = null == (t3 = this.instance.persistence) ? void 0 : t3.props[Ri];
        if (M(this.ys) && !N(e3) && !this.instance.Tr()) return false;
        var r3 = null !== (i2 = this.ys) && void 0 !== i2 ? i2 : !!e3;
        return !!this.instance.config.autocapture && !r3;
      }
      Is(i2, e3) {
        if (void 0 === e3 && (e3 = "$autocapture"), this.isEnabled) {
          var r3, s4 = kn(i2);
          yn(s4) && (s4 = s4.parentNode || null), "$autocapture" === e3 && "click" === i2.type && i2 instanceof MouseEvent && this.instance.config.rageclick && null != (r3 = this.rageclicks) && r3.isRageClick(i2.clientX, i2.clientY, i2.timeStamp || (/* @__PURE__ */ new Date()).getTime()) && function(i3, e4) {
            if (!t || Fn(i3)) return false;
            var r4, s5, n4;
            if (N(e4) ? (r4 = !!e4 && Cn, s5 = void 0) : (r4 = null !== (n4 = null == e4 ? void 0 : e4.css_selector_ignorelist) && void 0 !== n4 ? n4 : Cn, s5 = null == e4 ? void 0 : e4.content_ignorelist), false === r4) return false;
            var { targetElementList: o4 } = An(i3, false);
            return !function(t3, i4) {
              if (false === t3 || C(t3)) return false;
              var e5;
              if (true === t3) e5 = In;
              else {
                if (!R(t3)) return false;
                if (t3.length > 10) return yi.error("[PostHog] content_ignorelist array cannot exceed 10 items. Use css_selector_ignorelist for more complex matching."), false;
                e5 = t3.map((t4) => t4.toLowerCase());
              }
              return i4.some((t4) => {
                var { safeText: i5, ariaLabel: r5 } = t4;
                return e5.some((t5) => i5.includes(t5) || r5.includes(t5));
              });
            }(s5, o4.map((t3) => {
              var i4;
              return { safeText: $n(t3).toLowerCase(), ariaLabel: (null == (i4 = t3.getAttribute("aria-label")) ? void 0 : i4.toLowerCase().trim()) || "" };
            })) && !Pn(o4, r4);
          }(s4, this.instance.config.rageclick) && this.Is(i2, "$rageclick");
          var n3 = e3 === Jn;
          if (s4 && function(i3, e4, r4, s5, n4) {
            var o4, a3, l3, u3;
            if (void 0 === r4 && (r4 = void 0), !t || Fn(i3)) return false;
            if (null != (o4 = r4) && o4.url_allowlist && !Sn(r4.url_allowlist)) return false;
            if (null != (a3 = r4) && a3.url_ignorelist && Sn(r4.url_ignorelist)) return false;
            if (null != (l3 = r4) && l3.dom_event_allowlist) {
              var h3 = r4.dom_event_allowlist;
              if (h3 && !h3.some((t3) => e4.type === t3)) return false;
            }
            var { parentIsUsefulElement: d3, targetElementList: v2 } = An(i3, s5);
            if (!function(t3, i4) {
              var e5 = null == i4 ? void 0 : i4.element_allowlist;
              if (C(e5)) return true;
              var r5, s6 = function(t4) {
                if (e5.some((i5) => t4.tagName.toLowerCase() === i5)) return { v: true };
              };
              for (var n5 of t3) if (r5 = s6(n5)) return r5.v;
              return false;
            }(v2, r4)) return false;
            if (!Pn(v2, null == (u3 = r4) ? void 0 : u3.css_selector_allowlist)) return false;
            var c3 = t.getComputedStyle(i3);
            if (c3 && "pointer" === c3.getPropertyValue("cursor") && "click" === e4.type) return true;
            var f2 = i3.tagName.toLowerCase();
            switch (f2) {
              case "html":
                return false;
              case "form":
                return (n4 || ["submit"]).indexOf(e4.type) >= 0;
              case "input":
              case "select":
              case "textarea":
                return (n4 || ["change", "click"]).indexOf(e4.type) >= 0;
              default:
                return d3 ? (n4 || ["click"]).indexOf(e4.type) >= 0 : (n4 || ["click"]).indexOf(e4.type) >= 0 && (Rn.indexOf(f2) > -1 || "true" === i3.getAttribute("contenteditable"));
            }
          }(s4, i2, this.Rt, n3, n3 ? ["copy", "cut"] : void 0)) {
            var { props: o3, explicitNoCapture: a2 } = Zn(s4, { e: i2, maskAllElementAttributes: this.instance.config.mask_all_element_attributes, maskAllText: this.instance.config.mask_all_text, elementAttributeIgnoreList: this.Rt.element_attribute_ignorelist, elementsChainAsString: this.bs });
            if (a2) return false;
            var l2 = this.getElementSelectors(s4);
            if (l2 && l2.length > 0 && (o3.$element_selectors = l2), e3 === Jn) {
              var u2, h2 = Tn(null == t || null == (u2 = t.getSelection()) ? void 0 : u2.toString()), d2 = i2.type || "clipboard";
              if (!h2) return false;
              o3.$selected_content = h2, o3.$copy_type = d2;
            }
            return this.instance.capture(e3, o3), true;
          }
        }
      }
      isBrowserSupported() {
        return P(null == r ? void 0 : r.querySelectorAll);
      }
    }, historyAutocapture: class {
      constructor(i2) {
        var e3;
        this._instance = i2, this.Cs = (null == t || null == (e3 = t.location) ? void 0 : e3.pathname) || "";
      }
      initialize() {
        this.startIfEnabled();
      }
      get isEnabled() {
        return "history_change" === this._instance.config.capture_pageview;
      }
      startIfEnabled() {
        this.isEnabled && (yi.info("History API monitoring enabled, starting..."), this.monitorHistoryChanges());
      }
      stop() {
        this.Ss && this.Ss(), this.Ss = void 0, yi.info("History API monitoring stopped");
      }
      monitorHistoryChanges() {
        var i2, e3;
        if (t && t.history) {
          var r3 = this;
          null != (i2 = t.history.pushState) && i2.__posthog_wrapped__ || io(t.history, "pushState", (t3) => function(i3, e4, s4) {
            t3.call(this, i3, e4, s4), r3.ks("pushState");
          }), null != (e3 = t.history.replaceState) && e3.__posthog_wrapped__ || io(t.history, "replaceState", (t3) => function(i3, e4, s4) {
            t3.call(this, i3, e4, s4), r3.ks("replaceState");
          }), this.xs();
        }
      }
      ks(i2) {
        try {
          var e3, r3 = null == t || null == (e3 = t.location) ? void 0 : e3.pathname;
          if (!r3) return;
          r3 !== this.Cs && this.isEnabled && this._instance.capture(fe, { navigation_type: i2 }), this.Cs = r3;
        } catch (t3) {
          yi.error("Error capturing " + i2 + " pageview", t3);
        }
      }
      xs() {
        if (!this.Ss) {
          var i2 = () => {
            this.ks("popstate");
          };
          ke(t, "popstate", i2), this.Ss = () => {
            t && t.removeEventListener("popstate", i2);
          };
        }
      }
    }, heatmaps: class {
      get Rt() {
        return this.instance.config;
      }
      constructor(t3) {
        var i2;
        this.Ts = false, this.gs = false, this.As = null, this.instance = t3, this.Ts = !(null == (i2 = this.instance.persistence) || !i2.props[Pi]), this.rageclicks = new Gn(t3.config.rageclick);
      }
      initialize() {
        this.startIfEnabled();
      }
      get flushIntervalMilliseconds() {
        var t3 = 5e3;
        return O(this.Rt.capture_heatmaps) && this.Rt.capture_heatmaps.flush_interval_milliseconds && (t3 = this.Rt.capture_heatmaps.flush_interval_milliseconds), t3;
      }
      get isEnabled() {
        return D(this.Rt.capture_heatmaps) ? D(this.Rt.enable_heatmaps) ? this.Ts : this.Rt.enable_heatmaps : false !== this.Rt.capture_heatmaps;
      }
      startIfEnabled() {
        if (this.isEnabled) {
          if (this.gs) return;
          vo.info("starting..."), this.Es(), this.Tt();
        } else {
          var t3;
          clearInterval(null !== (t3 = this.As) && void 0 !== t3 ? t3 : void 0), this.Rs(), this.getAndClearBuffer();
        }
      }
      onRemoteConfig(t3) {
        if ("heatmaps" in t3) {
          var i2 = !!t3.heatmaps;
          this.instance.persistence && this.instance.persistence.register({ [Pi]: i2 }), this.Ts = i2, this.startIfEnabled();
        }
      }
      getAndClearBuffer() {
        var t3 = this.T;
        return this.T = void 0, t3;
      }
      Ns(t3) {
        this.wt(t3.originalEvent, "deadclick");
      }
      Tt() {
        this.As && clearInterval(this.As), this.As = "visible" === (null == r ? void 0 : r.visibilityState) ? setInterval(this.Zr.bind(this), this.flushIntervalMilliseconds) : null;
      }
      Es() {
        t && r && (this.Ms = this.Zr.bind(this), ke(t, ce, this.Ms), this.Fs = (i2) => this.wt(i2 || (null == t ? void 0 : t.event)), ke(r, "click", this.Fs, { capture: true }), this.Os = (i2) => this.Ps(i2 || (null == t ? void 0 : t.event)), ke(r, "mousemove", this.Os, { capture: true }), this.Ls = new Ke(this.instance, Ge, this.Ns.bind(this)), this.Ls.startIfEnabledOrStop(), this.Ds = this.Tt.bind(this), ke(r, ve, this.Ds), this.gs = true);
      }
      Rs() {
        var i2;
        t && r && (this.Ms && t.removeEventListener(ce, this.Ms), this.Fs && r.removeEventListener("click", this.Fs, { capture: true }), this.Os && r.removeEventListener("mousemove", this.Os, { capture: true }), this.Ds && r.removeEventListener(ve, this.Ds), clearTimeout(this.Bs), null == (i2 = this.Ls) || i2.stop(), this.gs = false);
      }
      js(i2, e3) {
        var r3 = this.instance.scrollManager.scrollY(), s4 = this.instance.scrollManager.scrollX(), n3 = this.instance.scrollManager.scrollElement(), o3 = function(i3, e4, r4) {
          for (var s5 = i3; s5 && mn(s5) && !bn(s5, "body"); ) {
            if (s5 === r4) return false;
            if (w(e4, null == t ? void 0 : t.getComputedStyle(s5).position)) return true;
            s5 = On(s5);
          }
          return false;
        }(kn(i2), ["fixed", "sticky"], n3);
        return { x: i2.clientX + (o3 ? 0 : s4), y: i2.clientY + (o3 ? 0 : r3), target_fixed: o3, type: e3 };
      }
      wt(t3, i2) {
        var e3;
        if (void 0 === i2 && (i2 = "click"), !gn(t3.target) && co(t3)) {
          var r3 = this.js(t3, i2);
          null != (e3 = this.rageclicks) && e3.isRageClick(t3.clientX, t3.clientY, (/* @__PURE__ */ new Date()).getTime()) && this.qs(p({}, r3, { type: "rageclick" })), this.qs(r3);
        }
      }
      Ps(t3) {
        !gn(t3.target) && co(t3) && (clearTimeout(this.Bs), this.Bs = setTimeout(() => {
          this.qs(this.js(t3, "mousemove"));
        }, 500));
      }
      qs(i2) {
        if (t) {
          var e3 = t.location.href, r3 = this.Rt.custom_personal_data_properties, s4 = this.Rt.mask_personal_data_properties ? [...ar, ...r3 || []] : [], n3 = sr(e3, s4, ur);
          this.T = this.T || {}, this.T[n3] || (this.T[n3] = []), this.T[n3].push(i2);
        }
      }
      Zr() {
        this.T && !I(this.T) && this.instance.capture("$$heatmap", { $heatmap_data: this.getAndClearBuffer() });
      }
    }, deadClicksAutocapture: Ke, webVitalsAutocapture: class {
      constructor(t3) {
        var i2;
        this.Ts = false, this.gs = false, this.T = { url: void 0, metrics: [], firstMetricTimestamp: void 0 }, this.Zs = () => {
          clearTimeout(this.$s), 0 !== this.T.metrics.length && (this._instance.capture("$web_vitals", this.T.metrics.reduce((t4, i3) => p({}, t4, { ["$web_vitals_" + i3.name + "_event"]: p({}, i3), ["$web_vitals_" + i3.name + "_value"]: i3.value }), {})), this.T = { url: void 0, metrics: [], firstMetricTimestamp: void 0 });
        }, this.nt = (t4) => {
          var i3, e3 = null == (i3 = this._instance.sessionManager) ? void 0 : i3.checkAndGetSessionAndWindowId(true);
          if (C(e3)) ro.error("Could not read session ID. Dropping metrics!");
          else {
            this.T = this.T || { url: void 0, metrics: [], firstMetricTimestamp: void 0 };
            var r3 = this.Hs();
            C(r3) || (D(null == t4 ? void 0 : t4.name) || D(null == t4 ? void 0 : t4.value) ? ro.error("Invalid metric received", t4) : !this.Vs || this.Vs > t4.value ? (this.T.url !== r3 && (this.Zs(), this.$s = setTimeout(this.Zs, this.flushToCaptureTimeoutMs)), C(this.T.url) && (this.T.url = r3), this.T.firstMetricTimestamp = C(this.T.firstMetricTimestamp) ? Date.now() : this.T.firstMetricTimestamp, t4.attribution && t4.attribution.interactionTargetElement && (t4.attribution.interactionTargetElement = void 0), this.T.metrics.push(p({}, t4, { $current_url: r3, $session_id: e3.sessionId, $window_id: e3.windowId, timestamp: Date.now() })), this.T.metrics.length === this.allowedMetrics.length && this.Zs()) : ro.error("Ignoring metric with value >= " + this.Vs, t4));
          }
        }, this.zs = () => {
          if (!this.gs) {
            var t4, i3, e3, r3, s4 = h.__PosthogExtensions__;
            C(s4) || C(s4.postHogWebVitalsCallbacks) || ({ onLCP: t4, onCLS: i3, onFCP: e3, onINP: r3 } = s4.postHogWebVitalsCallbacks), t4 && i3 && e3 && r3 ? (this.allowedMetrics.indexOf("LCP") > -1 && t4(this.nt.bind(this)), this.allowedMetrics.indexOf("CLS") > -1 && i3(this.nt.bind(this)), this.allowedMetrics.indexOf("FCP") > -1 && e3(this.nt.bind(this)), this.allowedMetrics.indexOf("INP") > -1 && r3(this.nt.bind(this)), this.gs = true) : ro.error("web vitals callbacks not loaded - not starting");
          }
        }, this._instance = t3, this.Ts = !(null == (i2 = this._instance.persistence) || !i2.props[Fi]), this.startIfEnabled();
      }
      get Ys() {
        return this._instance.config.capture_performance;
      }
      get allowedMetrics() {
        var t3, i2, e3 = O(this.Ys) ? null == (t3 = this.Ys) ? void 0 : t3.web_vitals_allowed_metrics : void 0;
        return D(e3) ? (null == (i2 = this._instance.persistence) ? void 0 : i2.props[Di]) || ["CLS", "FCP", "INP", "LCP"] : e3;
      }
      get flushToCaptureTimeoutMs() {
        return (O(this.Ys) ? this.Ys.web_vitals_delayed_flush_ms : void 0) || 5e3;
      }
      get useAttribution() {
        var t3 = O(this.Ys) ? this.Ys.web_vitals_attribution : void 0;
        return null != t3 && t3;
      }
      get Vs() {
        var t3 = O(this.Ys) && L(this.Ys.__web_vitals_max_value) ? this.Ys.__web_vitals_max_value : so;
        return t3 > 0 && 6e4 >= t3 ? so : t3;
      }
      get isEnabled() {
        var t3 = null == s2 ? void 0 : s2.protocol;
        if ("http:" !== t3 && "https:" !== t3) return ro.info("Web Vitals are disabled on non-http/https protocols"), false;
        var i2 = O(this.Ys) ? this.Ys.web_vitals : N(this.Ys) ? this.Ys : void 0;
        return N(i2) ? i2 : this.Ts;
      }
      startIfEnabled() {
        this.isEnabled && !this.gs && (ro.info("enabled, starting..."), this.nr(this.zs));
      }
      onRemoteConfig(t3) {
        if ("capturePerformance" in t3) {
          var i2 = O(t3.capturePerformance) && !!t3.capturePerformance.web_vitals, e3 = O(t3.capturePerformance) ? t3.capturePerformance.web_vitals_allowed_metrics : void 0;
          this._instance.persistence && (this._instance.persistence.register({ [Fi]: i2 }), this._instance.persistence.register({ [Di]: e3 })), this.Ts = i2, this.startIfEnabled();
        }
      }
      nr(t3) {
        var i2, e3;
        null != (i2 = h.__PosthogExtensions__) && i2.postHogWebVitalsCallbacks ? t3() : null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this._instance, this.useAttribution ? "web-vitals-with-attribution" : "web-vitals", (i3) => {
          i3 ? ro.error("failed to load script", i3) : t3();
        });
      }
      Hs() {
        var i2 = t ? t.location.href : void 0;
        if (i2) {
          var e3 = this._instance.config.custom_personal_data_properties, r3 = this._instance.config.mask_personal_data_properties ? [...ar, ...e3 || []] : [];
          return sr(i2, r3, ur);
        }
        ro.error("Could not determine current URL");
      }
    } };
    Yo = { exceptionObserver: class {
      constructor(i2) {
        var e3, r3, s4;
        this.zs = () => {
          var i3;
          if (t && this.isEnabled && null != (i3 = h.__PosthogExtensions__) && i3.errorWrappingFunctions) {
            var e4 = h.__PosthogExtensions__.errorWrappingFunctions.wrapOnError, r4 = h.__PosthogExtensions__.errorWrappingFunctions.wrapUnhandledRejection, s5 = h.__PosthogExtensions__.errorWrappingFunctions.wrapConsoleError;
            try {
              !this.Us && this.Rt.capture_unhandled_errors && (this.Us = e4(this.captureException.bind(this))), !this.Ws && this.Rt.capture_unhandled_rejections && (this.Ws = r4(this.captureException.bind(this))), !this.Gs && this.Rt.capture_console_errors && (this.Gs = s5(this.captureException.bind(this)));
            } catch (t3) {
              to.error("failed to start", t3), this.Xs();
            }
          }
        }, this._instance = i2, this.Js = !(null == (e3 = this._instance.persistence) || !e3.props[Oi]), this.Ks = new J({ refillRate: null !== (r3 = this._instance.config.error_tracking.__exceptionRateLimiterRefillRate) && void 0 !== r3 ? r3 : 1, bucketSize: null !== (s4 = this._instance.config.error_tracking.__exceptionRateLimiterBucketSize) && void 0 !== s4 ? s4 : 10, refillInterval: 1e4, qt: to }), this.Rt = this.Qs(), this.startIfEnabledOrStop();
      }
      Qs() {
        var t3 = this._instance.config.capture_exceptions, i2 = { capture_unhandled_errors: false, capture_unhandled_rejections: false, capture_console_errors: false };
        return O(t3) ? i2 = p({}, i2, t3) : (C(t3) ? this.Js : t3) && (i2 = p({}, i2, { capture_unhandled_errors: true, capture_unhandled_rejections: true })), i2;
      }
      get isEnabled() {
        return this.Rt.capture_console_errors || this.Rt.capture_unhandled_errors || this.Rt.capture_unhandled_rejections;
      }
      startIfEnabledOrStop() {
        this.isEnabled ? (to.info("enabled"), this.Xs(), this.nr(this.zs)) : this.Xs();
      }
      nr(t3) {
        var i2, e3;
        null != (i2 = h.__PosthogExtensions__) && i2.errorWrappingFunctions && t3(), null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this._instance, "exception-autocapture", (i3) => {
          if (i3) return to.error("failed to load script", i3);
          t3();
        });
      }
      Xs() {
        var t3, i2, e3;
        null == (t3 = this.Us) || t3.call(this), this.Us = void 0, null == (i2 = this.Ws) || i2.call(this), this.Ws = void 0, null == (e3 = this.Gs) || e3.call(this), this.Gs = void 0;
      }
      onRemoteConfig(t3) {
        "autocaptureExceptions" in t3 && (this.Js = !!t3.autocaptureExceptions || false, this._instance.persistence && this._instance.persistence.register({ [Oi]: this.Js }), this.Rt = this.Qs(), this.startIfEnabledOrStop());
      }
      onConfigChange() {
        this.Rt = this.Qs();
      }
      captureException(t3) {
        var i2, e3, r3, s4 = null !== (i2 = null == t3 || null == (e3 = t3.$exception_list) || null == (e3 = e3[0]) ? void 0 : e3.type) && void 0 !== i2 ? i2 : "Exception";
        this.Ks.consumeRateLimit(s4) ? to.info("Skipping exception capture because of client rate limiting.", { exception: s4 }) : null == (r3 = this._instance.exceptions) || r3.sendExceptionEvent(t3);
      }
    }, exceptions: class {
      constructor(t3) {
        var i2, e3;
        this.eo = [], this.ro = new Kt([new li(), new mi(), new hi(), new ui(), new _i(), new pi(), new vi(), new gi()], function(t4) {
          for (var i3 = arguments.length, e4 = new Array(i3 > 1 ? i3 - 1 : 0), r3 = 1; i3 > r3; r3++) e4[r3 - 1] = arguments[r3];
          return function(i4, r4) {
            void 0 === r4 && (r4 = 0);
            for (var s4 = [], n3 = i4.split("\n"), o3 = r4; n3.length > o3; o3++) {
              var a2 = n3[o3];
              if (1024 >= a2.length) {
                var l2 = ai.test(a2) ? a2.replace(ai, "$1") : a2;
                if (!l2.match(/\S*Error: /)) {
                  for (var u2 of e4) {
                    var h2 = u2(l2, t4);
                    if (h2) {
                      s4.push(h2);
                      break;
                    }
                  }
                  if (s4.length >= 50) break;
                }
              }
            }
            return function(t5) {
              if (!t5.length) return [];
              var i5 = Array.from(t5);
              return i5.reverse(), i5.slice(0, 50).map((t6) => {
                return p({}, t6, { filename: t6.filename || (e5 = i5, e5[e5.length - 1] || {}).filename, function: t6.function || Xt });
                var e5;
              });
            }(s4);
          };
        }("web:javascript", ri, oi)), this._instance = t3, this.eo = null !== (i2 = null == (e3 = this._instance.persistence) ? void 0 : e3.get_property(Ii)) && void 0 !== i2 ? i2 : [];
      }
      onRemoteConfig(t3) {
        var i2, e3, r3;
        if ("errorTracking" in t3) {
          var s4 = null !== (i2 = null == (e3 = t3.errorTracking) ? void 0 : e3.suppressionRules) && void 0 !== i2 ? i2 : [], n3 = null == (r3 = t3.errorTracking) ? void 0 : r3.captureExtensionExceptions;
          this.eo = s4, this._instance.persistence && this._instance.persistence.register({ [Ii]: this.eo, [Ci]: n3 });
        }
      }
      get io() {
        var t3, i2 = !!this._instance.get_property(Ci), e3 = this._instance.config.error_tracking.captureExtensionExceptions;
        return null !== (t3 = null != e3 ? e3 : i2) && void 0 !== t3 && t3;
      }
      buildProperties(t3, i2) {
        return this.ro.buildFromUnknown(t3, { syntheticException: null == i2 ? void 0 : i2.syntheticException, mechanism: { handled: null == i2 ? void 0 : i2.handled } });
      }
      sendExceptionEvent(t3) {
        var i2 = t3.$exception_list;
        if (this.no(i2)) {
          if (this.so(i2)) return void Uo.info("Skipping exception capture because a suppression rule matched");
          if (!this.io && this.oo(i2)) return void Uo.info("Skipping exception capture because it was thrown by an extension");
          if (!this._instance.config.error_tracking.__capturePostHogExceptions && this.ao(i2)) return void Uo.info("Skipping exception capture because it was thrown by the PostHog SDK");
        }
        return this._instance.capture("$exception", t3, { _noTruncate: true, _batchKey: "exceptionEvent", zi: true });
      }
      so(t3) {
        if (0 === t3.length) return false;
        var i2 = t3.reduce((t4, i3) => {
          var { type: e3, value: r3 } = i3;
          return F(e3) && e3.length > 0 && t4.$exception_types.push(e3), F(r3) && r3.length > 0 && t4.$exception_values.push(r3), t4;
        }, { $exception_types: [], $exception_values: [] });
        return this.eo.some((t4) => {
          var e3 = t4.values.map((t5) => {
            var e4, r3 = zs[t5.operator], s4 = R(t5.value) ? t5.value : [t5.value], n3 = null !== (e4 = i2[t5.key]) && void 0 !== e4 ? e4 : [];
            return s4.length > 0 && r3(s4, n3);
          });
          return "OR" === t4.type ? e3.some(Boolean) : e3.every(Boolean);
        });
      }
      oo(t3) {
        return t3.flatMap((t4) => {
          var i2, e3;
          return null !== (i2 = null == (e3 = t4.stacktrace) ? void 0 : e3.frames) && void 0 !== i2 ? i2 : [];
        }).some((t4) => t4.filename && t4.filename.startsWith("chrome-extension://"));
      }
      ao(t3) {
        if (t3.length > 0) {
          var i2, e3, r3, s4, n3 = null !== (i2 = null == (e3 = t3[0].stacktrace) ? void 0 : e3.frames) && void 0 !== i2 ? i2 : [], o3 = n3[n3.length - 1];
          return null !== (r3 = null == o3 || null == (s4 = o3.filename) ? void 0 : s4.includes("posthog.com/static")) && void 0 !== r3 && r3;
        }
        return false;
      }
      no(t3) {
        return !D(t3) && R(t3);
      }
    } };
    Go = p({ productTours: class {
      get Kr() {
        return this._instance.persistence;
      }
      constructor(t3) {
        this.lo = null, this.uo = null, this._instance = t3;
      }
      initialize() {
        this.loadIfEnabled();
      }
      onRemoteConfig(t3) {
        "productTours" in t3 && (this.Kr && this.Kr.register({ [Mi]: !!t3.productTours }), this.loadIfEnabled());
      }
      loadIfEnabled() {
        var t3, i2;
        this.lo || (t3 = this._instance).config.disable_product_tours || null == (i2 = t3.persistence) || !i2.get_property(Mi) || this.nr(() => this.ho());
      }
      nr(t3) {
        var i2, e3;
        null != (i2 = h.__PosthogExtensions__) && i2.generateProductTours ? t3() : null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this._instance, "product-tours", (i3) => {
          i3 ? fo.error("Could not load product tours script", i3) : t3();
        });
      }
      ho() {
        var t3;
        !this.lo && null != (t3 = h.__PosthogExtensions__) && t3.generateProductTours && (this.lo = h.__PosthogExtensions__.generateProductTours(this._instance, true));
      }
      getProductTours(t3, i2) {
        if (void 0 === i2 && (i2 = false), !R(this.uo) || i2) {
          var e3 = this.Kr;
          if (e3) {
            var r3 = e3.props[po];
            if (R(r3) && !i2) return this.uo = r3, void t3(r3, { isLoaded: true });
          }
          this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/product_tours/?token=" + this._instance.config.token), method: "GET", callback: (i3) => {
            var r4 = i3.statusCode;
            if (200 !== r4 || !i3.json) {
              var s4 = "Product Tours API could not be loaded, status: " + r4;
              return fo.error(s4), void t3([], { isLoaded: false, error: s4 });
            }
            var n3 = R(i3.json.product_tours) ? i3.json.product_tours : [];
            this.uo = n3, e3 && e3.register({ [po]: n3 }), t3(n3, { isLoaded: true });
          } });
        } else t3(this.uo, { isLoaded: true });
      }
      getActiveProductTours(t3) {
        D(this.lo) ? t3([], { isLoaded: false, error: "Product tours not loaded" }) : this.lo.getActiveProductTours(t3);
      }
      showProductTour(t3) {
        var i2;
        null == (i2 = this.lo) || i2.showTourById(t3);
      }
      previewTour(t3) {
        this.lo ? this.lo.previewTour(t3) : this.nr(() => {
          var i2;
          this.ho(), null == (i2 = this.lo) || i2.previewTour(t3);
        });
      }
      dismissProductTour() {
        var t3;
        null == (t3 = this.lo) || t3.dismissTour("user_clicked_skip");
      }
      nextStep() {
        var t3;
        null == (t3 = this.lo) || t3.nextStep();
      }
      previousStep() {
        var t3;
        null == (t3 = this.lo) || t3.previousStep();
      }
      clearCache() {
        var t3;
        this.uo = null, null == (t3 = this.Kr) || t3.unregister(po);
      }
      resetTour(t3) {
        var i2;
        null == (i2 = this.lo) || i2.resetTour(t3);
      }
      resetAllTours() {
        var t3;
        null == (t3 = this.lo) || t3.resetAllTours();
      }
      cancelPendingTour(t3) {
        var i2;
        null == (i2 = this.lo) || i2.cancelPendingTour(t3);
      }
    } }, qo);
    Jo = { siteApps: class {
      constructor(t3) {
        this._instance = t3, this.co = [], this.apps = {};
      }
      get isEnabled() {
        return !!this._instance.config.opt_in_site_apps;
      }
      do(t3, i2) {
        if (i2) {
          var e3 = this.globalsForEvent(i2);
          this.co.push(e3), this.co.length > 1e3 && (this.co = this.co.slice(10));
        }
      }
      get siteAppLoaders() {
        var t3;
        return null == (t3 = h._POSTHOG_REMOTE_CONFIG) || null == (t3 = t3[this._instance.config.token]) ? void 0 : t3.siteApps;
      }
      initialize() {
        if (this.isEnabled) {
          var t3 = this._instance._addCaptureHook(this.do.bind(this));
          this.vo = () => {
            t3(), this.co = [], this.vo = void 0;
          };
        }
      }
      globalsForEvent(t3) {
        var i2, e3, r3, s4, n3, o3, a2;
        if (!t3) throw new Error("Event payload is required");
        var l2 = {}, u2 = this._instance.get_property("$groups") || [], h2 = this._instance.get_property("$stored_group_properties") || {};
        for (var [d2, v2] of Object.entries(h2)) l2[d2] = { id: u2[d2], type: d2, properties: v2 };
        var { $set_once: c3, $set: f2 } = t3;
        return { event: p({}, _(t3, _o), { properties: p({}, t3.properties, f2 ? { $set: p({}, null !== (i2 = null == (e3 = t3.properties) ? void 0 : e3.$set) && void 0 !== i2 ? i2 : {}, f2) } : {}, c3 ? { $set_once: p({}, null !== (r3 = null == (s4 = t3.properties) ? void 0 : s4.$set_once) && void 0 !== r3 ? r3 : {}, c3) } : {}), elements_chain: null !== (n3 = null == (o3 = t3.properties) ? void 0 : o3.$elements_chain) && void 0 !== n3 ? n3 : "", distinct_id: null == (a2 = t3.properties) ? void 0 : a2.distinct_id }), person: { properties: this._instance.get_property("$stored_person_properties") }, groups: l2 };
      }
      setupSiteApp(t3) {
        var i2 = this.apps[t3.id], e3 = () => {
          var e4;
          !i2.errored && this.co.length && (go.info("Processing " + this.co.length + " events for site app with id " + t3.id), this.co.forEach((t4) => null == i2.processEvent ? void 0 : i2.processEvent(t4)), i2.processedBuffer = true), Object.values(this.apps).every((t4) => t4.processedBuffer || t4.errored) && (null == (e4 = this.vo) || e4.call(this));
        }, r3 = false, s4 = (s5) => {
          i2.errored = !s5, i2.loaded = true, go.info("Site app with id " + t3.id + " " + (s5 ? "loaded" : "errored")), r3 && e3();
        };
        try {
          var { processEvent: n3 } = t3.init({ posthog: this._instance, callback(t4) {
            s4(t4);
          } });
          n3 && (i2.processEvent = n3), r3 = true;
        } catch (i3) {
          go.error(mo + t3.id, i3), s4(false);
        }
        if (r3 && i2.loaded) try {
          e3();
        } catch (e4) {
          go.error("Error while processing buffered events PostHog app with config id " + t3.id, e4), i2.errored = true;
        }
      }
      fo() {
        var t3 = this.siteAppLoaders || [];
        for (var i2 of t3) this.apps[i2.id] = { id: i2.id, loaded: false, errored: false, processedBuffer: false };
        for (var e3 of t3) this.setupSiteApp(e3);
      }
      po(t3) {
        if (0 !== Object.keys(this.apps).length) {
          var i2 = this.globalsForEvent(t3);
          for (var e3 of Object.values(this.apps)) try {
            null == e3.processEvent || e3.processEvent(i2);
          } catch (i3) {
            go.error("Error while processing event " + t3.event + " for site app " + e3.id, i3);
          }
        }
      }
      onRemoteConfig(t3) {
        var i2, e3, r3, s4 = this;
        if (null != (i2 = this.siteAppLoaders) && i2.length) return this.isEnabled ? (this.fo(), void this._instance.on("eventCaptured", (t4) => this.po(t4))) : void go.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
        if (null == (e3 = this.vo) || e3.call(this), null != (r3 = t3.siteApps) && r3.length) if (this.isEnabled) {
          var n3 = function(t4) {
            var i3;
            h["__$$ph_site_app_" + t4] = s4._instance, null == (i3 = h.__PosthogExtensions__) || null == i3.loadSiteApp || i3.loadSiteApp(s4._instance, a2, (i4) => {
              if (i4) return go.error(mo + t4, i4);
            });
          };
          for (var { id: o3, url: a2 } of t3.siteApps) n3(o3);
        } else go.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
      }
    } };
    Ko = { tracingHeaders: class {
      constructor(t3) {
        this.mo = void 0, this.yo = void 0, this.zs = () => {
          var t4, i2;
          C(this.mo) && (null == (t4 = h.__PosthogExtensions__) || null == (t4 = t4.tracingHeadersPatchFns) || t4._patchXHR(this._instance.config.__add_tracing_headers || [], this._instance.get_distinct_id(), this._instance.sessionManager)), C(this.yo) && (null == (i2 = h.__PosthogExtensions__) || null == (i2 = i2.tracingHeadersPatchFns) || i2._patchFetch(this._instance.config.__add_tracing_headers || [], this._instance.get_distinct_id(), this._instance.sessionManager));
        }, this._instance = t3;
      }
      initialize() {
        this.startIfEnabledOrStop();
      }
      nr(t3) {
        var i2, e3;
        null != (i2 = h.__PosthogExtensions__) && i2.tracingHeadersPatchFns && t3(), null == (e3 = h.__PosthogExtensions__) || null == e3.loadExternalDependency || e3.loadExternalDependency(this._instance, "tracing-headers", (i3) => {
          if (i3) return eo.error("failed to load script", i3);
          t3();
        });
      }
      startIfEnabledOrStop() {
        var t3, i2;
        this._instance.config.__add_tracing_headers ? this.nr(this.zs) : (null == (t3 = this.mo) || t3.call(this), null == (i2 = this.yo) || i2.call(this), this.mo = void 0, this.yo = void 0);
      }
    } };
    Xo = p({ surveys: class {
      get Rt() {
        return this._instance.config;
      }
      constructor(t3) {
        this.bo = void 0, this._surveyManager = null, this.wo = false, this._o = [], this.Io = null, this._instance = t3, this._surveyEventReceiver = null;
      }
      initialize() {
        this.loadIfEnabled();
      }
      onRemoteConfig(t3) {
        if (!this.Rt.disable_surveys) {
          var i2 = t3.surveys;
          if (D(i2)) return Ys.warn("Flags not loaded yet. Not loading surveys.");
          var e3 = R(i2);
          this.bo = e3 ? i2.length > 0 : i2, Ys.info("flags response received, isSurveysEnabled: " + this.bo), this.loadIfEnabled();
        }
      }
      reset() {
        localStorage.removeItem("lastSeenSurveyDate");
        for (var t3 = [], i2 = 0; i2 < localStorage.length; i2++) {
          var e3 = localStorage.key(i2);
          (null != e3 && e3.startsWith(Gs) || null != e3 && e3.startsWith("inProgressSurvey_")) && t3.push(e3);
        }
        t3.forEach((t4) => localStorage.removeItem(t4));
      }
      loadIfEnabled() {
        if (!this._surveyManager) if (this.wo) Ys.info("Already initializing surveys, skipping...");
        else if (this.Rt.disable_surveys) Ys.info(xo);
        else if (this.Rt.cookieless_mode && this._instance.consent.isOptedOut()) Ys.info("Not loading surveys in cookieless mode without consent.");
        else {
          var t3 = null == h ? void 0 : h.__PosthogExtensions__;
          if (t3) {
            if (!C(this.bo) || this.Rt.advanced_enable_surveys) {
              var i2 = this.bo || this.Rt.advanced_enable_surveys;
              this.wo = true;
              try {
                var e3 = t3.generateSurveys;
                if (e3) return void this.Co(e3, i2);
                var r3 = t3.loadExternalDependency;
                if (!r3) return void this.So(oe);
                r3(this._instance, "surveys", (e4) => {
                  e4 || !t3.generateSurveys ? this.So("Could not load surveys script", e4) : this.Co(t3.generateSurveys, i2);
                });
              } catch (t4) {
                throw this.So("Error initializing surveys", t4), t4;
              } finally {
                this.wo = false;
              }
            }
          } else Ys.error("PostHog Extensions not found.");
        }
      }
      Co(t3, i2) {
        this._surveyManager = t3(this._instance, i2), this._surveyEventReceiver = new Eo(this._instance), Ys.info("Surveys loaded successfully"), this.ko({ isLoaded: true });
      }
      So(t3, i2) {
        Ys.error(t3, i2), this.ko({ isLoaded: false, error: t3 });
      }
      onSurveysLoaded(t3) {
        return this._o.push(t3), this._surveyManager && this.ko({ isLoaded: true }), () => {
          this._o = this._o.filter((i2) => i2 !== t3);
        };
      }
      getSurveys(t3, i2) {
        if (void 0 === i2 && (i2 = false), this.Rt.disable_surveys) return Ys.info(xo), t3([]);
        var e3, r3 = this._instance.get_property(Wi);
        if (r3 && !i2) return t3(r3, { isLoaded: true });
        "undefined" != typeof Promise && this.Io ? this.Io.then((i3) => {
          var { surveys: e4, context: r4 } = i3;
          return t3(e4, r4);
        }) : ("undefined" != typeof Promise && (this.Io = new Promise((t4) => {
          e3 = t4;
        })), this._instance._send_request({ url: this._instance.requestRouter.endpointFor("api", "/api/surveys/?token=" + this.Rt.token), method: "GET", timeout: this.Rt.surveys_request_timeout_ms, callback: (i3) => {
          var r4;
          this.Io = null;
          var s4 = i3.statusCode;
          if (200 !== s4 || !i3.json) {
            var n3 = "Surveys API could not be loaded, status: " + s4;
            Ys.error(n3);
            var o3 = { isLoaded: false, error: n3 };
            return t3([], o3), void (null == e3 || e3({ surveys: [], context: o3 }));
          }
          var a2, l2 = i3.json.surveys || [], u2 = l2.filter((t4) => function(t5) {
            return !(!t5.start_date || t5.end_date);
          }(t4) && (function(t5) {
            var i4;
            return !(null == (i4 = t5.conditions) || null == (i4 = i4.events) || null == (i4 = i4.values) || !i4.length);
          }(t4) || function(t5) {
            var i4;
            return !(null == (i4 = t5.conditions) || null == (i4 = i4.actions) || null == (i4 = i4.values) || !i4.length);
          }(t4)));
          u2.length > 0 && (null == (a2 = this._surveyEventReceiver) || a2.register(u2)), null == (r4 = this._instance.persistence) || r4.register({ [Wi]: l2 });
          var h2 = { isLoaded: true };
          t3(l2, h2), null == e3 || e3({ surveys: l2, context: h2 });
        } }));
      }
      ko(t3) {
        for (var i2 of this._o) try {
          if (!t3.isLoaded) return i2([], t3);
          this.getSurveys(i2);
        } catch (t4) {
          Ys.error("Error in survey callback", t4);
        }
      }
      getActiveMatchingSurveys(t3, i2) {
        if (void 0 === i2 && (i2 = false), !D(this._surveyManager)) return this._surveyManager.getActiveMatchingSurveys(t3, i2);
        Ys.warn("init was not called");
      }
      xo(t3) {
        var i2 = null;
        return this.getSurveys((e3) => {
          var r3;
          i2 = null !== (r3 = e3.find((i3) => i3.id === t3)) && void 0 !== r3 ? r3 : null;
        }), i2;
      }
      To(t3) {
        if (D(this._surveyManager)) return { eligible: false, reason: So };
        var i2 = "string" == typeof t3 ? this.xo(t3) : t3;
        return i2 ? this._surveyManager.checkSurveyEligibility(i2) : { eligible: false, reason: "Survey not found" };
      }
      canRenderSurvey(t3) {
        if (D(this._surveyManager)) return Ys.warn("init was not called"), { visible: false, disabledReason: So };
        var i2 = this.To(t3);
        return { visible: i2.eligible, disabledReason: i2.reason };
      }
      canRenderSurveyAsync(t3, i2) {
        return D(this._surveyManager) ? (Ys.warn("init was not called"), Promise.resolve({ visible: false, disabledReason: So })) : new Promise((e3) => {
          this.getSurveys((i3) => {
            var r3, s4 = null !== (r3 = i3.find((i4) => i4.id === t3)) && void 0 !== r3 ? r3 : null;
            if (s4) {
              var n3 = this.To(s4);
              e3({ visible: n3.eligible, disabledReason: n3.reason });
            } else e3({ visible: false, disabledReason: "Survey not found" });
          }, i2);
        });
      }
      renderSurvey(t3, i2, e3) {
        var s4;
        if (D(this._surveyManager)) Ys.warn("init was not called");
        else {
          var n3 = "string" == typeof t3 ? this.xo(t3) : t3;
          if (null != n3 && n3.id) if (Xs.includes(n3.type)) {
            var o3 = null == r ? void 0 : r.querySelector(i2);
            if (o3) return null != (s4 = n3.appearance) && s4.surveyPopupDelaySeconds ? (Ys.info("Rendering survey " + n3.id + " with delay of " + n3.appearance.surveyPopupDelaySeconds + " seconds"), void setTimeout(() => {
              var t4, i3;
              Ys.info("Rendering survey " + n3.id + " with delay of " + (null == (t4 = n3.appearance) ? void 0 : t4.surveyPopupDelaySeconds) + " seconds"), null == (i3 = this._surveyManager) || i3.renderSurvey(n3, o3, e3), Ys.info("Survey " + n3.id + " rendered");
            }, 1e3 * n3.appearance.surveyPopupDelaySeconds)) : void this._surveyManager.renderSurvey(n3, o3, e3);
            Ys.warn("Survey element not found");
          } else Ys.warn("Surveys of type " + n3.type + " cannot be rendered in the app");
          else Ys.warn("Survey not found");
        }
      }
      displaySurvey(t3, i2) {
        var e3;
        if (D(this._surveyManager)) Ys.warn("init was not called");
        else {
          var r3 = this.xo(t3);
          if (r3) {
            var s4 = r3;
            if (null != (e3 = r3.appearance) && e3.surveyPopupDelaySeconds && i2.ignoreDelay && (s4 = p({}, r3, { appearance: p({}, r3.appearance, { surveyPopupDelaySeconds: 0 }) })), i2.displayType !== Fr.Popover && i2.initialResponses && Ys.warn("initialResponses is only supported for popover surveys. prefill will not be applied."), false === i2.ignoreConditions) {
              var n3 = this.canRenderSurvey(r3);
              if (!n3.visible) return void Ys.warn("Survey is not eligible to be displayed: ", n3.disabledReason);
            }
            i2.displayType !== Fr.Inline ? this._surveyManager.handlePopoverSurvey(s4, i2) : this.renderSurvey(s4, i2.selector, i2.properties);
          } else Ys.warn("Survey not found");
        }
      }
      cancelPendingSurvey(t3) {
        D(this._surveyManager) ? Ys.warn("init was not called") : this._surveyManager.cancelSurvey(t3);
      }
      handlePageUnload() {
        var t3;
        null == (t3 = this._surveyManager) || t3.handlePageUnload();
      }
    } }, qo);
    Qo = { toolbar: class {
      constructor(t3) {
        this.instance = t3;
      }
      Ao(t3) {
        h.ph_toolbar_state = t3;
      }
      Eo() {
        var t3;
        return null !== (t3 = h.ph_toolbar_state) && void 0 !== t3 ? t3 : 0;
      }
      initialize() {
        return this.maybeLoadToolbar();
      }
      maybeLoadToolbar(i2, e3, s4) {
        if (void 0 === i2 && (i2 = void 0), void 0 === e3 && (e3 = void 0), void 0 === s4 && (s4 = void 0), Re(this.instance.config)) return false;
        if (!t || !r) return false;
        i2 = null != i2 ? i2 : t.location, s4 = null != s4 ? s4 : t.history;
        try {
          if (!e3) {
            try {
              t.localStorage.setItem("test", "test"), t.localStorage.removeItem("test");
            } catch (t3) {
              return false;
            }
            e3 = null == t ? void 0 : t.localStorage;
          }
          var n3, o3 = To || nr(i2.hash, "__posthog") || nr(i2.hash, "state"), a2 = o3 ? Ee(() => JSON.parse(atob(decodeURIComponent(o3)))) || Ee(() => JSON.parse(decodeURIComponent(o3))) : null;
          return a2 && "ph_authorize" === a2.action ? ((n3 = a2).source = "url", n3 && Object.keys(n3).length > 0 && (a2.desiredHash ? i2.hash = a2.desiredHash : s4 ? s4.replaceState(s4.state, "", i2.pathname + i2.search) : i2.hash = "")) : ((n3 = JSON.parse(e3.getItem($o) || "{}")).source = "localstorage", delete n3.userIntent), !(!n3.token || this.instance.config.token !== n3.token || (this.loadToolbar(n3), 0));
        } catch (t3) {
          return false;
        }
      }
      Ro(t3) {
        var i2 = h.ph_load_toolbar || h.ph_load_editor;
        !D(i2) && P(i2) ? i2(t3, this.instance) : ko.warn("No toolbar load function found");
      }
      loadToolbar(i2) {
        var e3 = !(null == r || !r.getElementById(re));
        if (!t || e3) return false;
        var s4 = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics, n3 = p({ token: this.instance.config.token }, i2, { apiURL: this.instance.requestRouter.endpointFor("ui") }, s4 ? { instrument: false } : {});
        if (t.localStorage.setItem($o, JSON.stringify(p({}, n3, { source: void 0 }))), 2 === this.Eo()) this.Ro(n3);
        else if (0 === this.Eo()) {
          var o3;
          this.Ao(1), null == (o3 = h.__PosthogExtensions__) || null == o3.loadExternalDependency || o3.loadExternalDependency(this.instance, "toolbar", (t3) => {
            if (t3) return ko.error("[Toolbar] Failed to load", t3), void this.Ao(0);
            this.Ao(2), this.Ro(n3);
          }), ke(t, "turbolinks:load", () => {
            this.Ao(0), this.loadToolbar(n3);
          });
        }
        return true;
      }
      No(t3) {
        return this.loadToolbar(t3);
      }
      maybeLoadEditor(t3, i2, e3) {
        return void 0 === t3 && (t3 = void 0), void 0 === i2 && (i2 = void 0), void 0 === e3 && (e3 = void 0), this.maybeLoadToolbar(t3, i2, e3);
      }
    } };
    Zo = p({ experiments: zo }, qo);
    ta = { conversations: class {
      constructor(t3) {
        this.Mo = void 0, this._conversationsManager = null, this.Fo = false, this.Oo = null, this._instance = t3;
      }
      initialize() {
        this.loadIfEnabled();
      }
      onRemoteConfig(t3) {
        if (!this._instance.config.disable_conversations) {
          var i2 = t3.conversations;
          D(i2) || (N(i2) ? this.Mo = i2 : (this.Mo = i2.enabled, this.Oo = i2), this.loadIfEnabled());
        }
      }
      reset() {
        var t3;
        null == (t3 = this._conversationsManager) || t3.reset(), this._conversationsManager = null, this.Mo = void 0, this.Oo = null;
      }
      loadIfEnabled() {
        if (!(this._conversationsManager || this.Fo || this._instance.config.disable_conversations || Re(this._instance.config) || this._instance.config.cookieless_mode && this._instance.consent.isOptedOut())) {
          var t3 = null == h ? void 0 : h.__PosthogExtensions__;
          if (t3 && !C(this.Mo) && this.Mo) if (this.Oo && this.Oo.token) {
            this.Fo = true;
            try {
              var i2 = t3.initConversations;
              if (i2) return this.Po(i2), void (this.Fo = false);
              var e3 = t3.loadExternalDependency;
              if (!e3) return void this.Lo(oe);
              e3(this._instance, "conversations", (i3) => {
                i3 || !t3.initConversations ? this.Lo("Could not load conversations script", i3) : this.Po(t3.initConversations), this.Fo = false;
              });
            } catch (t4) {
              this.Lo("Error initializing conversations", t4), this.Fo = false;
            }
          } else Bo.error("Conversations enabled but missing token in remote config.");
        }
      }
      Po(t3) {
        if (this.Oo) try {
          this._conversationsManager = t3(this.Oo, this._instance), Bo.info("Conversations loaded successfully");
        } catch (t4) {
          this.Lo("Error completing conversations initialization", t4);
        }
        else Bo.error("Cannot complete initialization: remote config is null");
      }
      Lo(t3, i2) {
        Bo.error(t3, i2), this._conversationsManager = null, this.Fo = false;
      }
      show() {
        this._conversationsManager ? this._conversationsManager.show() : Bo.warn("Conversations not loaded yet.");
      }
      hide() {
        this._conversationsManager && this._conversationsManager.hide();
      }
      isAvailable() {
        return true === this.Mo && !M(this._conversationsManager);
      }
      isVisible() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this._conversationsManager) ? void 0 : i2.isVisible()) && void 0 !== t3 && t3;
      }
      sendMessage(t3, i2, e3) {
        var r3 = this;
        return f(function* () {
          return r3._conversationsManager ? r3._conversationsManager.sendMessage(t3, i2, e3) : (Bo.warn(Ho), null);
        })();
      }
      getMessages(t3, i2) {
        var e3 = this;
        return f(function* () {
          return e3._conversationsManager ? e3._conversationsManager.getMessages(t3, i2) : (Bo.warn(Ho), null);
        })();
      }
      markAsRead(t3) {
        var i2 = this;
        return f(function* () {
          return i2._conversationsManager ? i2._conversationsManager.markAsRead(t3) : (Bo.warn(Ho), null);
        })();
      }
      getTickets(t3) {
        var i2 = this;
        return f(function* () {
          return i2._conversationsManager ? i2._conversationsManager.getTickets(t3) : (Bo.warn(Ho), null);
        })();
      }
      requestRestoreLink(t3) {
        var i2 = this;
        return f(function* () {
          return i2._conversationsManager ? i2._conversationsManager.requestRestoreLink(t3) : (Bo.warn(Ho), null);
        })();
      }
      restoreFromToken(t3) {
        var i2 = this;
        return f(function* () {
          return i2._conversationsManager ? i2._conversationsManager.restoreFromToken(t3) : (Bo.warn(Ho), null);
        })();
      }
      restoreFromUrlToken() {
        var t3 = this;
        return f(function* () {
          return t3._conversationsManager ? t3._conversationsManager.restoreFromUrlToken() : (Bo.warn(Ho), null);
        })();
      }
      getCurrentTicketId() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this._conversationsManager) ? void 0 : i2.getCurrentTicketId()) && void 0 !== t3 ? t3 : null;
      }
      getWidgetSessionId() {
        var t3, i2;
        return null !== (t3 = null == (i2 = this._conversationsManager) ? void 0 : i2.getWidgetSessionId()) && void 0 !== t3 ? t3 : null;
      }
    } };
    ia = { logs: class {
      constructor(t3) {
        var i2;
        this.Do = false, this.Bo = false, this._instance = t3, this._instance && null != (i2 = this._instance.config.logs) && i2.captureConsoleLogs && (this.Do = true);
      }
      initialize() {
        this.loadIfEnabled();
      }
      onRemoteConfig(t3) {
        var i2, e3 = null == (i2 = t3.logs) ? void 0 : i2.captureConsoleLogs;
        !D(e3) && e3 && (this.Do = true, this.loadIfEnabled());
      }
      reset() {
      }
      loadIfEnabled() {
        if (this.Do && !this.Bo) {
          var t3 = wi("[logs]"), i2 = null == h ? void 0 : h.__PosthogExtensions__;
          if (i2) {
            var e3 = i2.loadExternalDependency;
            e3 ? e3(this._instance, "logs", (e4) => {
              var r3;
              e4 || null == (r3 = i2.logs) || !r3.initializeLogs ? t3.error("Could not load logs script", e4) : (i2.logs.initializeLogs(this._instance), this.Bo = true);
            }) : t3.error(oe);
          } else t3.error("PostHog Extensions not found.");
        }
      }
    } };
    ea = p({}, qo, Wo, Vo, Yo, Go, Jo, Xo, Ko, Qo, Zo, ta, ia);
    _n.__defaultExtensionClasses = p({}, ea);
    sa = (ra = rn[hn] = new _n(), function() {
      function i2() {
        i2.done || (i2.done = true, dn = false, be(rn, function(t3) {
          t3._dom_loaded();
        }));
      }
      null != r && r.addEventListener ? "complete" === r.readyState ? i2() : ke(r, "DOMContentLoaded", i2, { capture: false }) : t && yi.error("Browser doesn't support `document.addEventListener` so PostHog couldn't be initialized");
    }(), ra);
  }
});

// .svelte-kit/output/server/entries/pages/_layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
function trackPageView(url) {
  return;
}
var Nav, Footer, Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.svelte.js"() {
    init_ssr();
    init_stores();
    init_module();
    Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<nav class="sticky top-0 z-50 bg-charcoal-dark/95 backdrop-blur-sm border-b border-gray-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><a href="/" class="flex items-center gap-3 group" data-svelte-h="svelte-ecb7ps"><span class="text-2xl">\u{1F3CA}</span> <span class="font-heading font-extrabold text-xl tracking-wider"><span class="text-safety-orange">LOST</span> <span class="text-gray-300">IN THE</span> <span class="text-electric-blue">TOOL POOL</span></span></a> <div class="hidden md:flex items-center gap-6" data-svelte-h="svelte-13imxz6"><a href="/advisor" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Project Advisor</a> <a href="/projects" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Projects</a> <a href="/ecosystems" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Ecosystems</a> <a href="/compare" class="text-gray-300 hover:text-safety-orange transition font-heading uppercase tracking-wider text-sm">Compare</a></div> <button class="md:hidden text-gray-300 p-2" aria-label="Toggle menu"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`}</svg></button></div></div> ${``}</nav>`;
    });
    Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<footer class="bg-charcoal-dark border-t border-gray-700/50 mt-20"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="grid grid-cols-1 md:grid-cols-4 gap-8" data-svelte-h="svelte-1sqi8w3"><div><span class="font-heading font-extrabold text-lg tracking-wider"><span class="text-safety-orange">LOST</span> <span class="text-gray-300">IN THE</span> <span class="text-electric-blue">TOOL POOL</span></span> <p class="mt-3 text-gray-400 text-sm leading-relaxed">AI-powered tool recommendations for DIY homeowners.
					We help you figure out what you actually need.</p></div> <div><h4 class="text-safety-orange text-sm mb-3">Explore</h4> <ul class="space-y-2 text-sm text-gray-400"><li><a href="/advisor" class="hover:text-white transition">Project Advisor</a></li> <li><a href="/projects" class="hover:text-white transition">Browse Projects</a></li> <li><a href="/ecosystems" class="hover:text-white transition">Battery Ecosystems</a></li> <li><a href="/compare" class="hover:text-white transition">Compare Tools</a></li></ul></div> <div><h4 class="text-safety-orange text-sm mb-3">Popular Projects</h4> <ul class="space-y-2 text-sm text-gray-400"><li><a href="/projects/build-a-deck" class="hover:text-white transition">Build a Deck</a></li> <li><a href="/projects/bathroom-renovation" class="hover:text-white transition">Bathroom Renovation</a></li> <li><a href="/projects/build-a-fence" class="hover:text-white transition">Build a Fence</a></li> <li><a href="/projects/paint-a-room" class="hover:text-white transition">Paint a Room</a></li></ul></div> <div><h4 class="text-safety-orange text-sm mb-3">Transparency</h4> <p class="text-sm text-gray-400 leading-relaxed">We earn affiliate commissions when you buy through our links.
					This does <strong class="text-gray-300">not</strong> affect our rankings.
					We recommend what&#39;s best for your project, not what pays us the most.</p></div></div> <div class="mt-8 pt-6 border-t border-gray-700/30"><div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4" data-svelte-h="svelte-1epega"><a href="/legal/privacy" class="hover:text-gray-300 transition">Privacy Policy</a> <a href="/legal/terms" class="hover:text-gray-300 transition">Terms of Service</a> <a href="/legal/affiliate-disclosure" class="hover:text-gray-300 transition">Affiliate Disclosure</a> <a href="/legal/disclaimer" class="hover:text-gray-300 transition">Disclaimer</a> <a href="/legal/accessibility" class="hover:text-gray-300 transition">Accessibility</a></div> <p class="text-center text-xs text-gray-600">\xA9 ${escape((/* @__PURE__ */ new Date()).getFullYear())} Lost in the Tool Pool, operated by CYBERNITED (Belgium). Built by tool nerds, for humans who build things.</p></div></div></footer>`;
    });
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      {
        if ($page.url.pathname) {
          trackPageView($page.url.pathname);
          const path = $page.url.pathname;
          path === "/" ? "home" : path.startsWith("/projects/") ? "project" : path === "/projects" ? "projects_list" : path.startsWith("/tools/") ? "tool" : path.startsWith("/ecosystems/") ? "ecosystem" : path === "/ecosystems" ? "ecosystems_list" : path === "/advisor" ? "advisor" : path === "/compare" ? "compare" : path === "/search" ? "search" : "other";
          $page.params?.slug || "";
        }
      }
      $$unsubscribe_page();
      return `<div class="min-h-screen flex flex-col">${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})} <main class="flex-1">${slots.default ? slots.default({}) : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  component: () => component,
  fonts: () => fonts,
  imports: () => imports,
  index: () => index,
  stylesheets: () => stylesheets
});
var index, component_cache, component, imports, stylesheets, fonts;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    index = 0;
    component = async () => component_cache ??= (await Promise.resolve().then(() => (init_layout_svelte(), layout_svelte_exports))).default;
    imports = ["_app/immutable/nodes/0.MroiXzfe.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js"];
    stylesheets = ["_app/immutable/assets/0.CbAuLbLL.css"];
    fonts = [];
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2
});
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_ssr();
    init_stores();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $$unsubscribe_page();
      return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  component: () => component2,
  fonts: () => fonts2,
  imports: () => imports2,
  index: () => index2,
  stylesheets: () => stylesheets2
});
var index2, component_cache2, component2, imports2, stylesheets2, fonts2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    index2 = 1;
    component2 = async () => component_cache2 ??= (await Promise.resolve().then(() => (init_error_svelte(), error_svelte_exports))).default;
    imports2 = ["_app/immutable/nodes/1.Ci66qjqM.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js"];
    stylesheets2 = [];
    fonts2 = [];
  }
});

// .svelte-kit/output/server/chunks/SearchBar.js
var SearchBar;
var init_SearchBar = __esm({
  ".svelte-kit/output/server/chunks/SearchBar.js"() {
    init_ssr();
    SearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  }
});

// .svelte-kit/output/server/entries/pages/_page.svelte.js
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: () => Page
});
var Page;
var init_page_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_page.svelte.js"() {
    init_ssr();
    init_SearchBar();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const exampleQueries = [
        "I want to build a 12x16 deck on a budget",
        "What's the minimum toolkit for a bathroom reno?",
        "Milwaukee vs DeWalt for a serious DIYer?",
        "I need to cut a hole in drywall for a new outlet",
        "Best starter kit under $500 for a new homeowner",
        "What do I need to refinish hardwood floors?"
      ];
      const projects = [
        {
          slug: "build-a-deck",
          name: "Build a Deck",
          icon: "\u{1FAB5}",
          difficulty: 3
        },
        {
          slug: "build-a-fence",
          name: "Build a Fence",
          icon: "\u{1F3D7}\uFE0F",
          difficulty: 2
        },
        {
          slug: "bathroom-renovation",
          name: "Bathroom Reno",
          icon: "\u{1F6BF}",
          difficulty: 4
        },
        {
          slug: "paint-a-room",
          name: "Paint a Room",
          icon: "\u{1F3A8}",
          difficulty: 1
        },
        {
          slug: "install-hardwood-flooring",
          name: "Install Flooring",
          icon: "\u{1FAB5}",
          difficulty: 3
        },
        {
          slug: "build-raised-garden-beds",
          name: "Garden Beds",
          icon: "\u{1F331}",
          difficulty: 1
        },
        {
          slug: "drywall-installation",
          name: "Drywall",
          icon: "\u{1F9F1}",
          difficulty: 3
        },
        {
          slug: "yard-maintenance",
          name: "Yard Care",
          icon: "\u{1F33F}",
          difficulty: 1
        }
      ];
      return `${$$result.head += `<!-- HEAD_svelte-nihspp_START -->${$$result.title = `<title>Lost in the Tool Pool \u2014 AI-Powered Tool Recommendations for DIY Projects</title>`, ""}<meta name="description" content="Tell us your project, we'll tell you exactly what tools you need. AI-powered recommendations, ecosystem comparisons, and the best deals."><!-- HEAD_svelte-nihspp_END -->`, ""}  <section class="relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-b from-charcoal-dark via-charcoal to-charcoal-dark"></div> <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Crect fill=%22none%22 stroke=%22%23ff6b35%22 stroke-width=%220.5%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'); background-size: 60px 60px;"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center"><h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6" data-svelte-h="svelte-c94snm"><span class="text-white">Tell Us Your Project.</span><br> <span class="text-safety-orange">We&#39;ll Tell You What Tools You Need.</span></h1> <p class="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-body normal-case" data-svelte-h="svelte-s63pwd">Stop guessing. Stop overspending. Get AI-powered tool recommendations
			tailored to your specific project, budget, and skill level.</p> <div class="flex justify-center mb-8">${validate_component(SearchBar, "SearchBar").$$render(
        $$result,
        {
          size: "large",
          placeholder: "Describe your project... e.g., I want to build a deck"
        },
        {},
        {}
      )}</div> <div class="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">${each(exampleQueries, (query) => {
        return `<button class="text-xs px-3 py-1.5 rounded-full bg-charcoal-light border border-gray-600/50 text-gray-400 hover:text-safety-orange hover:border-safety-orange/30 transition font-body normal-case">&quot;${escape(query)}&quot;
				</button>`;
      })}</div></div></section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h2 class="text-2xl sm:text-3xl text-center mb-10" data-svelte-h="svelte-gbdanl"><span class="text-gray-300">Pick a Project,</span> <span class="text-safety-orange">Get Your Toolkit</span></h2> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">${each(projects, (project) => {
        return `<a href="${"/projects/" + escape(project.slug, true)}" class="card text-center group cursor-pointer hover:border-safety-orange/50 hover:-translate-y-1 transition-all duration-300"><span class="text-4xl block mb-3">${escape(project.icon)}</span> <span class="font-heading text-sm text-gray-200 group-hover:text-safety-orange transition">${escape(project.name)}</span> <div class="mt-2 flex justify-center gap-1">${each(Array(5), (_2, i2) => {
          return `<span class="${"w-1.5 h-1.5 rounded-full " + escape(
            i2 < project.difficulty ? "bg-safety-orange" : "bg-gray-600",
            true
          )}"></span>`;
        })}</div> </a>`;
      })}</div> <div class="text-center mt-6" data-svelte-h="svelte-15bh0ak"><a href="/projects" class="text-electric-blue hover:text-electric-blue-light transition text-sm font-heading uppercase tracking-wider">View all 20 projects \u2192</a></div></section>  <section class="bg-charcoal-dark py-16" data-svelte-h="svelte-ztwm9d"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 class="text-2xl sm:text-3xl text-center mb-12"><span class="text-gray-300">How It</span> <span class="text-electric-blue">Works</span></h2> <div class="grid md:grid-cols-3 gap-8"><div class="text-center"><div class="w-16 h-16 mx-auto mb-4 rounded-full bg-safety-orange/10 border border-safety-orange/30 flex items-center justify-center"><span class="text-safety-orange font-heading text-2xl font-bold">1</span></div> <h3 class="text-lg mb-2 text-white">Describe Your Project</h3> <p class="text-gray-400 text-sm normal-case font-body">Tell us what you want to build in plain English. No jargon needed.
					&quot;I want to build a deck&quot; is perfect.</p></div> <div class="text-center"><div class="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center"><span class="text-electric-blue font-heading text-2xl font-bold">2</span></div> <h3 class="text-lg mb-2 text-white">Get Your Toolkit</h3> <p class="text-gray-400 text-sm normal-case font-body">We recommend exactly what you need \u2014 tools, accessories, and safety gear.
					Skip what you already own. Rent what you&#39;ll use once.</p></div> <div class="text-center"><div class="w-16 h-16 mx-auto mb-4 rounded-full bg-safety-orange/10 border border-safety-orange/30 flex items-center justify-center"><span class="text-safety-orange font-heading text-2xl font-bold">3</span></div> <h3 class="text-lg mb-2 text-white">Buy With Confidence</h3> <p class="text-gray-400 text-sm normal-case font-body">Compare prices across retailers. Pick the battery ecosystem that fits your life.
					Every recommendation explained \u2014 no mystery picks.</p></div></div></div></section>  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h2 class="text-2xl sm:text-3xl text-center mb-4" data-svelte-h="svelte-u81eaz"><span class="text-gray-300">Choose Your</span> <span class="text-safety-orange">Battery Ecosystem</span></h2> <p class="text-center text-gray-400 mb-10 max-w-xl mx-auto font-body normal-case text-sm" data-svelte-h="svelte-ia706t">Your first battery tool purchase locks you into an ecosystem. We help you pick the right one
		before you&#39;re invested.</p> <div class="flex flex-wrap justify-center gap-3">${each(
        [
          {
            name: "Milwaukee",
            color: "bg-milwaukee",
            slug: "milwaukee-m18"
          },
          {
            name: "DeWalt",
            color: "bg-dewalt text-black",
            slug: "dewalt-20v-max"
          },
          {
            name: "Makita",
            color: "bg-makita",
            slug: "makita-18v-lxt"
          },
          {
            name: "Ryobi",
            color: "bg-ryobi text-black",
            slug: "ryobi-one-plus"
          },
          {
            name: "Bosch",
            color: "bg-bosch",
            slug: "bosch-18v"
          },
          {
            name: "EGO",
            color: "bg-ego",
            slug: "ego-56v"
          }
        ],
        (eco) => {
          return `<a href="${"/ecosystems/" + escape(eco.slug, true)}" class="${"ecosystem-badge " + escape(eco.color, true) + " text-sm px-5 py-2.5 hover:scale-105 transition-transform cursor-pointer"}">${escape(eco.name)} </a>`;
        }
      )}</div> <div class="text-center mt-6" data-svelte-h="svelte-1b0v8oc"><a href="/ecosystems" class="text-electric-blue hover:text-electric-blue-light transition text-sm font-heading uppercase tracking-wider">Compare all 13 ecosystems \u2192</a></div></section>  <section class="bg-charcoal-dark border-y border-gray-700/30 py-8" data-svelte-h="svelte-dreatt"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center"><div><span class="text-3xl font-heading font-bold text-safety-orange">500+</span> <p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Tools Analyzed</p></div> <div><span class="text-3xl font-heading font-bold text-electric-blue">13</span> <p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Battery Ecosystems</p></div> <div><span class="text-3xl font-heading font-bold text-safety-orange">20</span> <p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Project Types</p></div> <div><span class="text-3xl font-heading font-bold text-electric-blue">$0</span> <p class="text-xs text-gray-400 font-heading uppercase tracking-wider">Pay-to-Rank</p></div></div></div></section>`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  component: () => component3,
  fonts: () => fonts3,
  imports: () => imports3,
  index: () => index3,
  stylesheets: () => stylesheets3
});
var index3, component_cache3, component3, imports3, stylesheets3, fonts3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    index3 = 2;
    component3 = async () => component_cache3 ??= (await Promise.resolve().then(() => (init_page_svelte(), page_svelte_exports))).default;
    imports3 = ["_app/immutable/nodes/2.BFLsbHpc.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/DYtejBVi.js", "_app/immutable/chunks/JdRanJdr.js"];
    stylesheets3 = [];
    fonts3 = [];
  }
});

// .svelte-kit/output/server/entries/pages/advisor/_page.svelte.js
var page_svelte_exports2 = {};
__export(page_svelte_exports2, {
  default: () => Page2
});
var Page2;
var init_page_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/advisor/_page.svelte.js"() {
    init_ssr();
    init_stores();
    init_SearchBar();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    Page2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let query = $page.url.searchParams.get("q") || "";
      let $$settled;
      let $$rendered;
      let previous_head = $$result.head;
      do {
        $$settled = true;
        $$result.head = previous_head;
        $$rendered = `${$$result.head += `<!-- HEAD_svelte-1xlo0gx_START -->${$$result.title = `<title>Project Advisor \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Describe your DIY project and get AI-powered tool recommendations. Personalized toolkit suggestions based on your project, budget, and skill level."><!-- HEAD_svelte-1xlo0gx_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-tctnwk"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Project</span> <span class="text-safety-orange">Advisor</span></h1> <p class="text-gray-400 font-body normal-case">Describe your project in plain English. Our AI figures out exactly what tools you need.</p></div> <div class="flex justify-center mb-8">${validate_component(SearchBar, "SearchBar").$$render(
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
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports4 = {};
__export(__exports4, {
  component: () => component4,
  fonts: () => fonts4,
  imports: () => imports4,
  index: () => index4,
  stylesheets: () => stylesheets4
});
var index4, component_cache4, component4, imports4, stylesheets4, fonts4;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    index4 = 3;
    component4 = async () => component_cache4 ??= (await Promise.resolve().then(() => (init_page_svelte2(), page_svelte_exports2))).default;
    imports4 = ["_app/immutable/nodes/3.v8lvCR9X.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js", "_app/immutable/chunks/DYtejBVi.js"];
    stylesheets4 = [];
    fonts4 = [];
  }
});

// .svelte-kit/output/server/entries/pages/compare/_page.svelte.js
var page_svelte_exports3 = {};
__export(page_svelte_exports3, {
  default: () => Page3
});
var Page3;
var init_page_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/compare/_page.svelte.js"() {
    init_ssr();
    Page3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let compareList = [];
      const suggestions = [
        {
          sku: "MIL-2853-20",
          name: "Milwaukee M18 FUEL Impact Driver",
          brand: "Milwaukee",
          price: 149,
          ecosystem: "M18"
        },
        {
          sku: "DW-DCF887B",
          name: "DeWalt 20V XR Impact Driver",
          brand: "DeWalt",
          price: 119,
          ecosystem: "20V MAX"
        },
        {
          sku: "RY-PSBID01B",
          name: "Ryobi ONE+ HP Impact Driver",
          brand: "Ryobi",
          price: 59,
          ecosystem: "ONE+"
        },
        {
          sku: "MIL-2732-20",
          name: "Milwaukee M18 FUEL Circular Saw",
          brand: "Milwaukee",
          price: 199,
          ecosystem: "M18"
        },
        {
          sku: "DW-DCS570B",
          name: "DeWalt 20V Circular Saw",
          brand: "DeWalt",
          price: 149,
          ecosystem: "20V MAX"
        },
        {
          sku: "RY-PBLCS300B",
          name: "Ryobi ONE+ HP Circular Saw",
          brand: "Ryobi",
          price: 119,
          ecosystem: "ONE+"
        }
      ];
      return `${$$result.head += `<!-- HEAD_svelte-zr3fwj_START -->${$$result.title = `<title>Compare Tools Side by Side \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Compare power tools side by side. Specs, prices, and ratings across Milwaukee, DeWalt, Makita, Ryobi, and more."><!-- HEAD_svelte-zr3fwj_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-g3p2b7"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Compare</span> <span class="text-safety-orange">Tools</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Pick 2-5 tools and see them side by side. Specs, prices, ratings, and honest analysis.</p></div>  ${compareList.length > 0 ? `<div class="card mb-6"><div class="flex items-center justify-between mb-3"><h2 class="text-sm text-gray-400 font-heading uppercase tracking-wider">Comparing (${escape(compareList.length)}/5)</h2> <button class="text-xs text-gray-500 hover:text-red-400 transition" data-svelte-h="svelte-2g715s">Clear all</button></div> <div class="flex flex-wrap gap-2">${each(compareList, (sku) => {
        let tool = suggestions.find((s4) => s4.sku === sku);
        return ` <span class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-dark border border-gray-600 text-sm"><span class="text-gray-300 font-body normal-case">${escape(tool?.name || sku)}</span> <button class="text-gray-500 hover:text-red-400" data-svelte-h="svelte-qe9xbv">x</button> </span>`;
      })}</div> ${compareList.length >= 2 ? `<button class="btn-primary mt-4 text-sm" data-svelte-h="svelte-7aa5a7">Compare Now</button>` : `<p class="text-xs text-gray-500 mt-2 font-body normal-case" data-svelte-h="svelte-1d3wguz">Add at least 2 tools to compare</p>`}</div>` : ``}  <h2 class="text-sm text-gray-500 font-heading uppercase tracking-wider mb-4" data-svelte-h="svelte-41zdsk">Popular comparisons</h2> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">${each(suggestions, (tool) => {
        return `<button class="${"card text-left group cursor-pointer " + escape(
          compareList.includes(tool.sku) ? "border-safety-orange/50" : "",
          true
        )}" ${compareList.includes(tool.sku) ? "disabled" : ""}><div class="flex items-start justify-between"><div><span class="text-xs text-gray-500 font-heading uppercase">${escape(tool.brand)} ${escape(tool.ecosystem)}</span> <h3 class="font-body text-sm text-gray-200 normal-case mt-1">${escape(tool.name)}</h3> <span class="text-lg font-heading font-bold text-safety-orange mt-2 block">$${escape(tool.price)}</span></div> ${compareList.includes(tool.sku) ? `<span class="text-safety-orange text-lg" data-svelte-h="svelte-1f8tklq">\u2713</span>` : `<span class="text-gray-600 group-hover:text-safety-orange transition text-lg" data-svelte-h="svelte-12h5kfh">+</span>`}</div> </button>`;
      })}</div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports5 = {};
__export(__exports5, {
  component: () => component5,
  fonts: () => fonts5,
  imports: () => imports5,
  index: () => index5,
  stylesheets: () => stylesheets5
});
var index5, component_cache5, component5, imports5, stylesheets5, fonts5;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    index5 = 4;
    component5 = async () => component_cache5 ??= (await Promise.resolve().then(() => (init_page_svelte3(), page_svelte_exports3))).default;
    imports5 = ["_app/immutable/nodes/4.BAjJm2fL.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets5 = [];
    fonts5 = [];
  }
});

// .svelte-kit/output/server/entries/pages/ecosystems/_page.svelte.js
var page_svelte_exports4 = {};
__export(page_svelte_exports4, {
  default: () => Page4
});
var Page4;
var init_page_svelte4 = __esm({
  ".svelte-kit/output/server/entries/pages/ecosystems/_page.svelte.js"() {
    init_ssr();
    Page4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const ecosystems = [
        {
          slug: "milwaukee-m18",
          name: "Milwaukee M18",
          brand: "Milwaukee",
          voltage: 18,
          tools: "250+",
          target: "Pro",
          color: "bg-milwaukee",
          exclusive: "Home Depot"
        },
        {
          slug: "milwaukee-m12",
          name: "Milwaukee M12",
          brand: "Milwaukee",
          voltage: 12,
          tools: "125+",
          target: "Pro",
          color: "bg-milwaukee",
          exclusive: "Home Depot"
        },
        {
          slug: "dewalt-20v-max",
          name: "DeWalt 20V MAX",
          brand: "DeWalt",
          voltage: 20,
          tools: "300+",
          target: "Both",
          color: "bg-dewalt text-black",
          exclusive: "None"
        },
        {
          slug: "makita-18v-lxt",
          name: "Makita 18V LXT",
          brand: "Makita",
          voltage: 18,
          tools: "350+",
          target: "Both",
          color: "bg-makita",
          exclusive: "None"
        },
        {
          slug: "ryobi-one-plus",
          name: "Ryobi ONE+",
          brand: "Ryobi",
          voltage: 18,
          tools: "300+",
          target: "DIY",
          color: "bg-ryobi text-black",
          exclusive: "Home Depot"
        },
        {
          slug: "bosch-18v",
          name: "Bosch 18V",
          brand: "Bosch",
          voltage: 18,
          tools: "90+",
          target: "Both",
          color: "bg-bosch",
          exclusive: "None"
        },
        {
          slug: "ridgid-18v",
          name: "Ridgid 18V",
          brand: "Ridgid",
          voltage: 18,
          tools: "85+",
          target: "Both",
          color: "bg-gray-500",
          exclusive: "Home Depot"
        },
        {
          slug: "ego-56v",
          name: "EGO 56V",
          brand: "EGO",
          voltage: 56,
          tools: "70+",
          target: "Both",
          color: "bg-ego",
          exclusive: "None"
        },
        {
          slug: "kobalt-24v",
          name: "Kobalt 24V",
          brand: "Kobalt",
          voltage: 24,
          tools: "75+",
          target: "DIY",
          color: "bg-blue-600",
          exclusive: "Lowe's"
        },
        {
          slug: "greenworks-24v",
          name: "Greenworks 24V",
          brand: "Greenworks",
          voltage: 24,
          tools: "100+",
          target: "DIY",
          color: "bg-green-600",
          exclusive: "None"
        },
        {
          slug: "husqvarna-battery",
          name: "Husqvarna Battery",
          brand: "Husqvarna",
          voltage: 36,
          tools: "55+",
          target: "Pro",
          color: "bg-orange-600",
          exclusive: "Dealers"
        },
        {
          slug: "stihl-ak",
          name: "STIHL AK",
          brand: "STIHL",
          voltage: 36,
          tools: "20+",
          target: "DIY",
          color: "bg-orange-500",
          exclusive: "Dealers"
        },
        {
          slug: "stihl-ap",
          name: "STIHL AP",
          brand: "STIHL",
          voltage: 36,
          tools: "25+",
          target: "Pro",
          color: "bg-orange-500",
          exclusive: "Dealers"
        }
      ];
      return `${$$result.head += `<!-- HEAD_svelte-1bs6ilz_START -->${$$result.title = `<title>Battery Tool Ecosystems Compared \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Compare 13 battery tool ecosystems: Milwaukee, DeWalt, Makita, Ryobi, EGO, and more. Find the right platform before you're locked in."><!-- HEAD_svelte-1bs6ilz_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-1bvq6uy"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Battery</span> <span class="text-safety-orange">Ecosystems</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Your first battery tool purchase locks you into an ecosystem.
			Choose wisely \u2014 here&#39;s everything you need to know about each one.</p></div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${each(ecosystems, (eco) => {
        return `<a href="${"/ecosystems/" + escape(eco.slug, true)}" class="card group hover:-translate-y-1 transition-all duration-300"><div class="flex items-center justify-between mb-3"><span class="${"ecosystem-badge " + escape(eco.color, true)}">${escape(eco.brand)}</span> <span class="text-xs text-gray-500 font-heading uppercase">${escape(eco.target)}</span></div> <h3 class="font-heading text-lg text-gray-200 group-hover:text-safety-orange transition">${escape(eco.name)}</h3> <div class="mt-3 grid grid-cols-3 gap-2 text-center"><div><span class="text-sm font-bold text-safety-orange">${escape(eco.voltage)}V</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1hwxn3z">Voltage</p></div> <div><span class="text-sm font-bold text-electric-blue">${escape(eco.tools)}</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1vmem2o">Tools</p></div> <div><span class="text-xs font-bold text-gray-400">${escape(eco.exclusive)}</span> <p class="text-[10px] text-gray-500 font-heading uppercase" data-svelte-h="svelte-1wztm65">Exclusive</p> </div></div> </a>`;
      })}</div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports6 = {};
__export(__exports6, {
  component: () => component6,
  fonts: () => fonts6,
  imports: () => imports6,
  index: () => index6,
  stylesheets: () => stylesheets6
});
var index6, component_cache6, component6, imports6, stylesheets6, fonts6;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    index6 = 5;
    component6 = async () => component_cache6 ??= (await Promise.resolve().then(() => (init_page_svelte4(), page_svelte_exports4))).default;
    imports6 = ["_app/immutable/nodes/5.DcuMyQhA.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets6 = [];
    fonts6 = [];
  }
});

// .svelte-kit/output/server/entries/pages/ecosystems/_slug_/_page.svelte.js
var page_svelte_exports5 = {};
__export(page_svelte_exports5, {
  default: () => Page5
});
var Page5;
var init_page_svelte5 = __esm({
  ".svelte-kit/output/server/entries/pages/ecosystems/_slug_/_page.svelte.js"() {
    init_ssr();
    init_stores();
    Page5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let slug;
      let eco;
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      const ecoData = {
        "milwaukee-m18": {
          name: "Milwaukee M18",
          brand: "Milwaukee",
          voltage: 18,
          tools: "250+",
          target: "Professional trades and serious DIYers",
          parent: "TTI Group",
          exclusive: "Home Depot",
          warranty: "5-year tool warranty",
          color: "bg-milwaukee",
          strengths: [
            "Industry-leading impact drivers and drills",
            "ONE-KEY smart tool connectivity",
            "Largest pro-grade selection",
            "Excellent battery life with high-output packs"
          ],
          weaknesses: [
            "Premium pricing",
            "Home Depot exclusive limits availability",
            "Overkill for casual DIY"
          ],
          starter_kit: [
            "Drill/Driver",
            "Impact Driver",
            "Circular Saw",
            "Reciprocating Saw",
            "Multi-Tool"
          ],
          starter_cost: 685
        }
      };
      slug = $page.params.slug;
      eco = ecoData[slug] || {
        name: slug.split("-").map((w2) => w2.charAt(0).toUpperCase() + w2.slice(1)).join(" "),
        brand: slug.split("-")[0],
        voltage: 18,
        tools: "TBD",
        target: "TBD",
        parent: "",
        exclusive: "",
        warranty: "",
        color: "bg-gray-600",
        strengths: [],
        weaknesses: [],
        starter_kit: [],
        starter_cost: 0
      };
      $$unsubscribe_page();
      return `${$$result.head += `<!-- HEAD_svelte-1rc1t3x_START -->${$$result.title = `<title>${escape(eco.name)} Ecosystem Guide \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="${"Complete guide to the " + escape(eco.name, true) + " battery ecosystem. " + escape(eco.tools, true) + " tools, compatibility info, starter kit recommendations, and honest pros/cons."}"><!-- HEAD_svelte-1rc1t3x_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-6" data-svelte-h="svelte-14bwacf"><a href="/ecosystems" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">\u2190 All Ecosystems</a></div> <div class="flex items-center gap-4 mb-8"><span class="${"ecosystem-badge " + escape(eco.color, true) + " text-lg px-6 py-3"}">${escape(eco.brand)}</span> <div><h1 class="text-3xl sm:text-4xl text-white">${escape(eco.name)}</h1> <p class="text-gray-400 font-body normal-case mt-1">${escape(eco.target)}</p></div></div>  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"><div class="card text-center"><span class="text-2xl font-heading font-bold text-safety-orange">${escape(eco.voltage)}V</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-136dfv0">Voltage</p></div> <div class="card text-center"><span class="text-2xl font-heading font-bold text-electric-blue">${escape(eco.tools)}</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-tdnc65">Tools</p></div> <div class="card text-center"><span class="text-sm font-heading font-bold text-gray-300">${escape(eco.exclusive || "Everywhere")}</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-ewqqr5">Sold At</p></div> <div class="card text-center"><span class="text-sm font-heading font-bold text-gray-300">${escape(eco.warranty || "Varies")}</span> <p class="text-xs text-gray-500 font-heading uppercase mt-1" data-svelte-h="svelte-1yyb9le">Warranty</p></div></div>  ${eco.strengths.length ? `<div class="card mb-4"><h2 class="text-lg text-green-400 mb-3" data-svelte-h="svelte-1nkp35r">Strengths</h2> <ul class="space-y-2">${each(eco.strengths, (s4) => {
        return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="text-green-400 flex-shrink-0" data-svelte-h="svelte-1twkq3y">+</span> ${escape(s4)} </li>`;
      })}</ul></div>` : ``}  ${eco.weaknesses.length ? `<div class="card mb-4"><h2 class="text-lg text-red-400 mb-3" data-svelte-h="svelte-1r2ckga">Weaknesses</h2> <ul class="space-y-2">${each(eco.weaknesses, (w2) => {
        return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="text-red-400 flex-shrink-0" data-svelte-h="svelte-vt3uqc">-</span> ${escape(w2)} </li>`;
      })}</ul></div>` : ``}  ${eco.starter_kit.length ? `<div class="card"><h2 class="text-lg text-safety-orange mb-3" data-svelte-h="svelte-qqtcqm">Recommended Starter Kit</h2> <ul class="space-y-2 mb-4">${each(eco.starter_kit, (tool) => {
        return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-safety-orange flex-shrink-0"></span> ${escape(tool)} </li>`;
      })}</ul> ${eco.starter_cost ? `<p class="text-sm text-gray-400 font-body normal-case">Estimated cost (tools only): <span class="text-safety-orange font-bold">$${escape(eco.starter_cost)}</span></p>` : ``}</div>` : ``}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/6.js
var __exports7 = {};
__export(__exports7, {
  component: () => component7,
  fonts: () => fonts7,
  imports: () => imports7,
  index: () => index7,
  stylesheets: () => stylesheets7
});
var index7, component_cache7, component7, imports7, stylesheets7, fonts7;
var init__7 = __esm({
  ".svelte-kit/output/server/nodes/6.js"() {
    index7 = 6;
    component7 = async () => component_cache7 ??= (await Promise.resolve().then(() => (init_page_svelte5(), page_svelte_exports5))).default;
    imports7 = ["_app/immutable/nodes/6.CTZz-sms.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js"];
    stylesheets7 = [];
    fonts7 = [];
  }
});

// .svelte-kit/output/server/entries/pages/legal/accessibility/_page.svelte.js
var page_svelte_exports6 = {};
__export(page_svelte_exports6, {
  default: () => Page6
});
var Page6;
var init_page_svelte6 = __esm({
  ".svelte-kit/output/server/entries/pages/legal/accessibility/_page.svelte.js"() {
    init_ssr();
    Page6 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `<!-- HEAD_svelte-10efs7_START -->${$$result.title = `<title>Accessibility Statement \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Our commitment to making Lost in the Tool Pool accessible to all users."><!-- HEAD_svelte-10efs7_END -->`, ""} <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-svelte-h="svelte-g7dsh2"><h1 class="text-3xl text-white mb-2">Accessibility Statement</h1> <p class="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p> <div class="prose prose-invert prose-sm max-w-none font-body normal-case space-y-6 text-gray-300 leading-relaxed"><h2 class="text-safety-orange text-lg font-heading uppercase">Our Commitment</h2> <p>Lost in the Tool Pool is committed to making our website accessible to all users, including people with disabilities. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">What We Do</h2> <ul><li>Use semantic HTML structure for proper screen reader navigation</li> <li>Provide sufficient color contrast ratios throughout the site</li> <li>Ensure all interactive elements are keyboard accessible</li> <li>Include descriptive alt text for images</li> <li>Use ARIA labels for interactive components</li> <li>Design responsive layouts that work across screen sizes and zoom levels</li> <li>Ensure form inputs have associated labels</li> <li>Avoid content that flashes more than three times per second</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">Known Limitations</h2> <p>We are continuously working to improve accessibility. Some areas where we know improvements are needed:</p> <ul><li>Some third-party product images may lack descriptive alt text</li> <li>The AI advisor&#39;s streaming text output may not announce properly in all screen readers</li> <li>Some tool comparison tables may be complex to navigate with assistive technology</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">Feedback</h2> <p>If you encounter accessibility barriers on our site, please let us know. We take all feedback seriously and will work to resolve issues promptly.</p> <p><strong>Email:</strong> accessibility@lostinthetoolpool.com</p> <p>When reporting an issue, please include:</p> <ul><li>The page URL where you encountered the problem</li> <li>A description of the issue</li> <li>The assistive technology you were using (if applicable)</li> <li>Your browser and operating system</li></ul> <p>We aim to respond to accessibility feedback within 5 business days.</p></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/7.js
var __exports8 = {};
__export(__exports8, {
  component: () => component8,
  fonts: () => fonts8,
  imports: () => imports8,
  index: () => index8,
  stylesheets: () => stylesheets8
});
var index8, component_cache8, component8, imports8, stylesheets8, fonts8;
var init__8 = __esm({
  ".svelte-kit/output/server/nodes/7.js"() {
    index8 = 7;
    component8 = async () => component_cache8 ??= (await Promise.resolve().then(() => (init_page_svelte6(), page_svelte_exports6))).default;
    imports8 = ["_app/immutable/nodes/7.C3jWvIiu.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets8 = [];
    fonts8 = [];
  }
});

// .svelte-kit/output/server/entries/pages/legal/affiliate-disclosure/_page.svelte.js
var page_svelte_exports7 = {};
__export(page_svelte_exports7, {
  default: () => Page7
});
var Page7;
var init_page_svelte7 = __esm({
  ".svelte-kit/output/server/entries/pages/legal/affiliate-disclosure/_page.svelte.js"() {
    init_ssr();
    Page7 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `<!-- HEAD_svelte-1gwm0r8_START -->${$$result.title = `<title>Affiliate Disclosure \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="How we earn money and why it doesn't affect our recommendations."><!-- HEAD_svelte-1gwm0r8_END -->`, ""} <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-svelte-h="svelte-g11w0r"><h1 class="text-3xl text-white mb-2">Affiliate Disclosure</h1> <p class="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p> <div class="prose prose-invert prose-sm max-w-none font-body normal-case space-y-6 text-gray-300 leading-relaxed"><h2 class="text-safety-orange text-lg font-heading uppercase">The Short Version</h2> <p>We earn money when you buy tools through our links. This is how we keep the site running. It costs you nothing extra. It does <strong>not</strong> influence what we recommend.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">How It Works</h2> <p>Lost in the Tool Pool is a participant in affiliate advertising programs with multiple retailers and affiliate networks. When you click a product link on our site and make a purchase, we may earn a small commission \u2014 typically 1-10% of the sale price, depending on the retailer.</p> <p><strong>This costs you nothing extra.</strong> The price you pay is the same whether you click through our link or go directly to the retailer.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">Our Affiliate Partners</h2> <p>We participate in affiliate programs with the following (this list may change):</p> <ul><li>Amazon Associates</li> <li>Home Depot (via Impact Radius)</li> <li>Lowe&#39;s</li> <li>Acme Tools (via ShareASale)</li> <li>CPO Outlets (via Rakuten)</li> <li>Ohio Power Tool</li> <li>KC Tool</li> <li>Tool Nut</li> <li>Other retailers as added</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">What This Means for Our Recommendations</h2> <p><strong>Nothing.</strong> Our recommendations are based on research, specifications, user reviews, and the specific needs of each project \u2014 never on which retailer pays us the highest commission.</p> <p>We will never:</p> <ul><li>Recommend a tool because the affiliate commission is higher</li> <li>Rank products based on affiliate payouts</li> <li>Hide information that might lead you to a non-affiliate option</li> <li>Discourage renting when renting is the smarter choice</li></ul> <p>We frequently recommend renting tools for one-time projects, buying used, or skipping tools entirely. None of these earn us any money. We do it because it&#39;s the right advice.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">FTC Compliance</h2> <p>This disclosure is made in accordance with the Federal Trade Commission&#39;s (FTC) guidelines on endorsements and testimonials (16 CFR Part 255). We believe in full transparency about how we earn revenue.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">Amazon Associates Disclosure</h2> <p>As an Amazon Associate, Lost in the Tool Pool earns from qualifying purchases. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">Questions?</h2> <p>If you have questions about our affiliate relationships, email us at <strong>legal@lostinthetoolpool.com</strong>.</p></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/8.js
var __exports9 = {};
__export(__exports9, {
  component: () => component9,
  fonts: () => fonts9,
  imports: () => imports9,
  index: () => index9,
  stylesheets: () => stylesheets9
});
var index9, component_cache9, component9, imports9, stylesheets9, fonts9;
var init__9 = __esm({
  ".svelte-kit/output/server/nodes/8.js"() {
    index9 = 8;
    component9 = async () => component_cache9 ??= (await Promise.resolve().then(() => (init_page_svelte7(), page_svelte_exports7))).default;
    imports9 = ["_app/immutable/nodes/8.QzSs5Etu.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets9 = [];
    fonts9 = [];
  }
});

// .svelte-kit/output/server/entries/pages/legal/disclaimer/_page.svelte.js
var page_svelte_exports8 = {};
__export(page_svelte_exports8, {
  default: () => Page8
});
var Page8;
var init_page_svelte8 = __esm({
  ".svelte-kit/output/server/entries/pages/legal/disclaimer/_page.svelte.js"() {
    init_ssr();
    Page8 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `<!-- HEAD_svelte-1dr0aqt_START -->${$$result.title = `<title>Disclaimer \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Important safety and liability disclaimers for tool recommendations and DIY project advice."><!-- HEAD_svelte-1dr0aqt_END -->`, ""} <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-svelte-h="svelte-1ituick"><h1 class="text-3xl text-white mb-2">Disclaimer</h1> <p class="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p> <div class="prose prose-invert prose-sm max-w-none font-body normal-case space-y-6 text-gray-300 leading-relaxed"><div class="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-8"><h2 class="text-red-400 text-lg font-heading uppercase mt-0">Safety Warning</h2> <p class="mb-0">Power tools are dangerous. They can cause serious injury or death if used improperly. <strong>Always read and follow the manufacturer&#39;s safety instructions</strong> for any tool you purchase. Wear appropriate personal protective equipment (PPE). Work within your skill level. When in doubt, hire a professional.</p></div> <h2 class="text-safety-orange text-lg font-heading uppercase">General Disclaimer</h2> <p>The information on this website is provided &quot;as is&quot; for general informational purposes only. Lost in the Tool Pool (operated by CYBERNITED) makes no warranties, express or implied, about the completeness, accuracy, reliability, or suitability of the information, products, or services mentioned on this site.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">Not Professional Advice</h2> <p>The content on this site is not a substitute for:</p> <ul><li><strong>Professional contractor services</strong> \u2014 If a project involves structural work, electrical wiring, plumbing, or gas lines, consult a licensed professional</li> <li><strong>Manufacturer instructions</strong> \u2014 Always follow the tool manufacturer&#39;s operating and safety guidelines</li> <li><strong>Local building codes</strong> \u2014 Building permits and code requirements vary by location. Check with your local building department before starting any project</li> <li><strong>Professional safety training</strong> \u2014 Some tools require training or certification to operate safely</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">AI-Generated Recommendations</h2> <p>Our Project Advisor uses artificial intelligence to generate tool recommendations. While we strive for accuracy, AI systems can make errors. AI-generated content may be:</p> <ul><li>Incomplete \u2014 missing tools or safety equipment needed for your specific situation</li> <li>Inaccurate \u2014 incorrect specifications, pricing, or compatibility information</li> <li>Outdated \u2014 tools may be discontinued or replaced with newer models</li> <li>Generic \u2014 unable to account for your specific experience level, workspace, or local conditions</li></ul> <p><strong>Always verify AI recommendations independently before making purchases or starting projects.</strong></p> <h2 class="text-safety-orange text-lg font-heading uppercase">Product Information</h2> <p>Product specifications, pricing, availability, and ratings displayed on this site are sourced from retailers and public databases. This information may be inaccurate or outdated. Always verify current details directly with the retailer or manufacturer before purchasing.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">Limitation of Liability</h2> <p>CYBERNITED, its operators, employees, and affiliates shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from:</p> <ul><li>Your use of or reliance on information provided on this site</li> <li>Injuries sustained while using tools recommended on this site</li> <li>Property damage resulting from DIY projects described on this site</li> <li>Financial decisions made based on pricing or product information on this site</li> <li>Errors or omissions in AI-generated content</li> <li>Actions of third-party retailers linked from this site</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">Your Responsibility</h2> <p>By using this site, you acknowledge that:</p> <ul><li>You are solely responsible for your safety when using tools</li> <li>You will verify all recommendations before acting on them</li> <li>You will follow all manufacturer safety guidelines</li> <li>You will comply with local building codes and permit requirements</li> <li>You will wear appropriate protective equipment</li> <li>You will work within your skill level and seek professional help when needed</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">Contact</h2> <p>Questions about this disclaimer? Contact us at <strong>legal@lostinthetoolpool.com</strong>.</p></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/9.js
var __exports10 = {};
__export(__exports10, {
  component: () => component10,
  fonts: () => fonts10,
  imports: () => imports10,
  index: () => index10,
  stylesheets: () => stylesheets10
});
var index10, component_cache10, component10, imports10, stylesheets10, fonts10;
var init__10 = __esm({
  ".svelte-kit/output/server/nodes/9.js"() {
    index10 = 9;
    component10 = async () => component_cache10 ??= (await Promise.resolve().then(() => (init_page_svelte8(), page_svelte_exports8))).default;
    imports10 = ["_app/immutable/nodes/9.ieS5X7nO.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets10 = [];
    fonts10 = [];
  }
});

// .svelte-kit/output/server/entries/pages/legal/privacy/_page.svelte.js
var page_svelte_exports9 = {};
__export(page_svelte_exports9, {
  default: () => Page9
});
var Page9;
var init_page_svelte9 = __esm({
  ".svelte-kit/output/server/entries/pages/legal/privacy/_page.svelte.js"() {
    init_ssr();
    Page9 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `<!-- HEAD_svelte-nrh4wn_START -->${$$result.title = `<title>Privacy Policy \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Privacy policy for lostinthetoolpool.com. How we handle your data, your rights, and our commitments."><!-- HEAD_svelte-nrh4wn_END -->`, ""} <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-svelte-h="svelte-hoqcve"><h1 class="text-3xl text-white mb-2">Privacy Policy</h1> <p class="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p> <div class="prose prose-invert prose-sm max-w-none font-body normal-case space-y-6 text-gray-300 leading-relaxed"><h2 class="text-safety-orange text-lg font-heading uppercase">1. Who We Are</h2> <p>Lost in the Tool Pool is operated by <strong>CYBERNITED</strong>, a company registered in Belgium.</p> <p><strong>Data Controller:</strong> CYBERNITED<br> <strong>Contact:</strong> privacy@lostinthetoolpool.com<br> <strong>Supervisory Authority:</strong> Autoriteit Gegevensbescherming / Autorit\xE9 de protection des donn\xE9es (Belgian Data Protection Authority)</p> <h2 class="text-safety-orange text-lg font-heading uppercase">2. What Data We Collect</h2> <p>We do <strong>not</strong> require user accounts, logins, or registration. We do <strong>not</strong> use cookies on our website. Here is exactly what we collect:</p> <h3 class="text-white text-base">Automatically collected (no cookies)</h3> <ul><li><strong>Page views</strong> \u2014 which pages you visit, in what order</li> <li><strong>Search queries</strong> \u2014 what you type in our search bar and advisor</li> <li><strong>Click interactions</strong> \u2014 which buttons, links, and products you click</li> <li><strong>Scroll depth</strong> \u2014 how far you scroll on each page</li> <li><strong>Session recordings</strong> \u2014 anonymized replays of your browsing session (via PostHog)</li> <li><strong>Device information</strong> \u2014 screen size, browser type, operating system</li> <li><strong>IP address</strong> \u2014 processed but not stored in identifiable form</li> <li><strong>Referrer URL</strong> \u2014 which website or search engine sent you here</li></ul> <h3 class="text-white text-base">Voluntarily provided</h3> <ul><li><strong>Email address</strong> \u2014 only if you subscribe to our newsletter</li> <li><strong>Project descriptions</strong> \u2014 text you enter in our AI advisor</li></ul> <h3 class="text-white text-base">What we do NOT collect</h3> <ul><li>Names, physical addresses, phone numbers</li> <li>Payment or financial information (we don&#39;t sell anything)</li> <li>Social media profiles</li> <li>Location data beyond country-level (derived from IP)</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">3. How We Use Your Data</h2> <table class="w-full text-sm"><thead><tr class="border-b border-gray-700"><th class="text-left py-2">Purpose</th><th class="text-left py-2">Legal Basis (GDPR)</th></tr></thead> <tbody><tr class="border-b border-gray-800"><td class="py-2">Improve our tool recommendations</td><td class="py-2">Legitimate interest</td></tr> <tr class="border-b border-gray-800"><td class="py-2">Understand which content is useful</td><td class="py-2">Legitimate interest</td></tr> <tr class="border-b border-gray-800"><td class="py-2">Fix bugs and improve performance</td><td class="py-2">Legitimate interest</td></tr> <tr class="border-b border-gray-800"><td class="py-2">Track affiliate link clicks for revenue</td><td class="py-2">Legitimate interest</td></tr> <tr class="border-b border-gray-800"><td class="py-2">Send newsletter emails</td><td class="py-2">Consent (opt-in)</td></tr> <tr class="border-b border-gray-800"><td class="py-2">Generate AI-powered tool recommendations</td><td class="py-2">Legitimate interest</td></tr></tbody></table> <h2 class="text-safety-orange text-lg font-heading uppercase">4. Data Processors (Third Parties)</h2> <p>We share data with these service providers, each bound by data processing agreements:</p> <table class="w-full text-sm"><thead><tr class="border-b border-gray-700"><th class="text-left py-2">Service</th><th class="text-left py-2">Purpose</th><th class="text-left py-2">Location</th></tr></thead> <tbody><tr class="border-b border-gray-800"><td class="py-2">PostHog EU</td><td class="py-2">Analytics, session replay, heatmaps</td><td class="py-2">Frankfurt, Germany (EU)</td></tr> <tr class="border-b border-gray-800"><td class="py-2">Cloudflare</td><td class="py-2">Website hosting and CDN</td><td class="py-2">Global (EU-compliant)</td></tr> <tr class="border-b border-gray-800"><td class="py-2">AWS (Bedrock)</td><td class="py-2">AI recommendation engine</td><td class="py-2">US (Standard Contractual Clauses)</td></tr> <tr class="border-b border-gray-800"><td class="py-2">ConvertKit</td><td class="py-2">Email newsletter</td><td class="py-2">US (Standard Contractual Clauses)</td></tr></tbody></table> <p>We do <strong>not</strong> sell your data to anyone. Ever.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">5. Cookies</h2> <p>We do <strong>not</strong> set any first-party cookies. Our analytics (PostHog) runs in cookieless mode.</p> <p>When you click an affiliate link and are redirected to a retailer (Amazon, Home Depot, Lowe&#39;s, etc.), that retailer may set their own cookies on their domain. We have no control over those cookies \u2014 please refer to the respective retailer&#39;s privacy policy.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">6. Affiliate Links</h2> <p>This website earns revenue through affiliate commissions. When you click a &quot;Buy at...&quot; link and make a purchase, we may earn a small commission at no extra cost to you. This does <strong>not</strong> influence our recommendations. See our <a href="/legal/affiliate-disclosure" class="text-safety-orange hover:underline">Affiliate Disclosure</a> for details.</p> <p>We track which affiliate links are clicked to measure our revenue and understand which recommendations are useful. This tracking uses session-level identifiers that are not linked to your personal identity.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">7. AI-Generated Content</h2> <p>Our Project Advisor feature uses artificial intelligence (Claude AI by Anthropic, via AWS Bedrock) to generate tool recommendations. Your project descriptions are sent to this AI service to generate responses. These queries are not stored by the AI provider beyond the duration of the request. We log the queries in our own analytics to improve our recommendations.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">8. Data Retention</h2> <ul><li><strong>Analytics data:</strong> 24 months, then automatically deleted</li> <li><strong>Session recordings:</strong> 90 days (PostHog default)</li> <li><strong>Search queries:</strong> 24 months (anonymized after 12 months)</li> <li><strong>Email addresses:</strong> Until you unsubscribe</li> <li><strong>Affiliate click data:</strong> 24 months</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">9. Your Rights (GDPR)</h2> <p>As our data processing is governed by EU law (GDPR), you have the following rights regardless of where you are located:</p> <ul><li><strong>Access</strong> \u2014 Request a copy of the data we hold about you</li> <li><strong>Rectification</strong> \u2014 Ask us to correct inaccurate data</li> <li><strong>Erasure</strong> \u2014 Ask us to delete your data (&quot;right to be forgotten&quot;)</li> <li><strong>Restriction</strong> \u2014 Ask us to limit how we process your data</li> <li><strong>Portability</strong> \u2014 Receive your data in a machine-readable format</li> <li><strong>Objection</strong> \u2014 Object to processing based on legitimate interest</li> <li><strong>Withdraw consent</strong> \u2014 For email subscriptions, unsubscribe at any time</li></ul> <p>To exercise any of these rights, email <strong>privacy@lostinthetoolpool.com</strong>. We will respond within 30 days.</p> <p>You also have the right to file a complaint with the Belgian Data Protection Authority: <strong>www.dataprotectionauthority.be</strong></p> <h2 class="text-safety-orange text-lg font-heading uppercase">10. Your Rights (California / CCPA)</h2> <p>If you are a California resident, you have additional rights under the CCPA/CPRA:</p> <ul><li><strong>Right to know</strong> what personal information we collect and why</li> <li><strong>Right to delete</strong> your personal information</li> <li><strong>Right to opt-out</strong> of the sale of personal information \u2014 we do not sell your data</li> <li><strong>Right to non-discrimination</strong> for exercising your privacy rights</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">11. Children&#39;s Privacy</h2> <p>This website is not directed at children under 13. We do not knowingly collect data from children. If you believe we have inadvertently collected data from a child, please contact us at privacy@lostinthetoolpool.com and we will delete it promptly.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">12. International Data Transfers</h2> <p>CYBERNITED is based in Belgium (EU). Some of our data processors are located in the United States. For these transfers, we rely on Standard Contractual Clauses (SCCs) approved by the European Commission, and we ensure each processor provides adequate safeguards for your data.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">13. Changes to This Policy</h2> <p>We may update this privacy policy from time to time. The &quot;Last updated&quot; date at the top will reflect the most recent revision. We encourage you to review this page periodically.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">14. Contact</h2> <p>Questions about this privacy policy or your data? Contact us:<br> <strong>Email:</strong> privacy@lostinthetoolpool.com<br> <strong>Company:</strong> CYBERNITED, Belgium</p></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/10.js
var __exports11 = {};
__export(__exports11, {
  component: () => component11,
  fonts: () => fonts11,
  imports: () => imports11,
  index: () => index11,
  stylesheets: () => stylesheets11
});
var index11, component_cache11, component11, imports11, stylesheets11, fonts11;
var init__11 = __esm({
  ".svelte-kit/output/server/nodes/10.js"() {
    index11 = 10;
    component11 = async () => component_cache11 ??= (await Promise.resolve().then(() => (init_page_svelte9(), page_svelte_exports9))).default;
    imports11 = ["_app/immutable/nodes/10.Bv5-OObi.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets11 = [];
    fonts11 = [];
  }
});

// .svelte-kit/output/server/entries/pages/legal/terms/_page.svelte.js
var page_svelte_exports10 = {};
__export(page_svelte_exports10, {
  default: () => Page10
});
var Page10;
var init_page_svelte10 = __esm({
  ".svelte-kit/output/server/entries/pages/legal/terms/_page.svelte.js"() {
    init_ssr();
    Page10 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `<!-- HEAD_svelte-wupnhb_START -->${$$result.title = `<title>Terms of Service \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Terms of service for lostinthetoolpool.com."><!-- HEAD_svelte-wupnhb_END -->`, ""} <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-svelte-h="svelte-jmnbcb"><h1 class="text-3xl text-white mb-2">Terms of Service</h1> <p class="text-sm text-gray-500 mb-8">Last updated: April 2, 2026</p> <div class="prose prose-invert prose-sm max-w-none font-body normal-case space-y-6 text-gray-300 leading-relaxed"><h2 class="text-safety-orange text-lg font-heading uppercase">1. Agreement</h2> <p>By accessing and using lostinthetoolpool.com (&quot;the Site&quot;), you agree to these Terms of Service. If you do not agree, please do not use the Site. The Site is operated by CYBERNITED, a company registered in Belgium.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">2. What This Site Does</h2> <p>Lost in the Tool Pool provides AI-powered tool recommendations for DIY home improvement projects. We help users identify which tools they may need for specific projects, compare tool ecosystems, and find purchase options from various retailers.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">3. Informational Purpose Only</h2> <p>All content on this Site \u2014 including tool recommendations, project guides, safety information, and AI-generated advice \u2014 is provided for <strong>informational purposes only</strong>. It is not a substitute for:</p> <ul><li>Professional contractor advice</li> <li>Manufacturer safety guidelines and instructions</li> <li>Local building codes and permit requirements</li> <li>Professional training in tool operation</li></ul> <p><strong>Always read and follow the manufacturer&#39;s safety instructions for any tool you purchase.</strong> When in doubt about a project, consult a licensed professional.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">4. Affiliate Relationships</h2> <p>This Site earns revenue through affiliate marketing. When you click on product links and make purchases from retailers, we may earn a commission. This relationship is fully disclosed in our <a href="/legal/affiliate-disclosure" class="text-safety-orange hover:underline">Affiliate Disclosure</a>.</p> <p>We do not sell tools directly. All purchases are made through third-party retailers. We are not responsible for the transaction, shipping, returns, warranties, or any other aspect of your purchase from those retailers.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">5. AI-Generated Content</h2> <p>Our Project Advisor feature uses artificial intelligence to generate recommendations. While we strive for accuracy, AI-generated content may contain errors, omissions, or outdated information. You should:</p> <ul><li>Verify all recommendations before making purchases</li> <li>Check current pricing directly with retailers</li> <li>Confirm tool compatibility with manufacturers</li> <li>Not rely solely on AI advice for safety-critical decisions</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">6. Accuracy of Information</h2> <p>We make reasonable efforts to ensure product information, pricing, specifications, and availability are accurate. However, we cannot guarantee that all information is current or error-free. Prices and availability change frequently. Always verify with the retailer before purchasing.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">7. Limitation of Liability</h2> <p>To the maximum extent permitted by law, CYBERNITED and its operators shall not be liable for:</p> <ul><li>Personal injury resulting from tool use based on our recommendations</li> <li>Property damage from DIY projects undertaken based on our guides</li> <li>Financial loss from product purchases made through our affiliate links</li> <li>Inaccurate or outdated product information, pricing, or specifications</li> <li>AI-generated recommendations that are incorrect or incomplete</li> <li>Decisions made based on information found on this Site</li></ul> <p>You use this Site and act on its recommendations <strong>at your own risk</strong>. Power tools are inherently dangerous. Always prioritize safety, wear appropriate protective equipment, and work within your skill level.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">8. Intellectual Property</h2> <p>The content, design, and code of this Site are owned by CYBERNITED. Product names, brand logos, and trademarks belong to their respective owners. Our use of these names is for informational purposes and does not imply endorsement by the brands.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">9. Prohibited Use</h2> <p>You may not:</p> <ul><li>Scrape, crawl, or automatically extract content from the Site at scale</li> <li>Reproduce our content on other websites without permission</li> <li>Use the Site in any way that could damage or impair its functionality</li> <li>Attempt to gain unauthorized access to our systems</li></ul> <h2 class="text-safety-orange text-lg font-heading uppercase">10. Third-Party Links</h2> <p>This Site contains links to third-party websites (retailers, manufacturers, etc.). We are not responsible for the content, privacy practices, or policies of these external sites. Clicking an affiliate link takes you to a third-party website governed by their own terms and privacy policies.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">11. Changes to Terms</h2> <p>We may update these terms at any time. The &quot;Last updated&quot; date will reflect changes. Continued use of the Site after changes constitutes acceptance of the new terms.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">12. Governing Law</h2> <p>These terms are governed by the laws of Belgium. Any disputes will be resolved in the courts of Belgium, without prejudice to any mandatory consumer protection provisions that may apply in your jurisdiction.</p> <h2 class="text-safety-orange text-lg font-heading uppercase">13. Contact</h2> <p>Questions about these terms? Contact us at <strong>legal@lostinthetoolpool.com</strong>.</p></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/11.js
var __exports12 = {};
__export(__exports12, {
  component: () => component12,
  fonts: () => fonts12,
  imports: () => imports12,
  index: () => index12,
  stylesheets: () => stylesheets12
});
var index12, component_cache12, component12, imports12, stylesheets12, fonts12;
var init__12 = __esm({
  ".svelte-kit/output/server/nodes/11.js"() {
    index12 = 11;
    component12 = async () => component_cache12 ??= (await Promise.resolve().then(() => (init_page_svelte10(), page_svelte_exports10))).default;
    imports12 = ["_app/immutable/nodes/11.CFsBYqSB.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js"];
    stylesheets12 = [];
    fonts12 = [];
  }
});

// .svelte-kit/output/server/chunks/index.js
var ECOSYSTEM_COLORS, DIFFICULTY_LABELS;
var init_chunks = __esm({
  ".svelte-kit/output/server/chunks/index.js"() {
    ECOSYSTEM_COLORS = {
      "milwaukee-m18": "bg-milwaukee text-white",
      "milwaukee-m12": "bg-milwaukee text-white",
      "dewalt-20v-max": "bg-dewalt text-black",
      "dewalt-flexvolt": "bg-dewalt text-black",
      "makita-18v-lxt": "bg-makita text-white",
      "makita-40v-xgt": "bg-makita text-white",
      "ryobi-one-plus": "bg-ryobi text-black",
      "ryobi-40v": "bg-ryobi text-black",
      "bosch-18v": "bg-bosch text-white",
      "ego-56v": "bg-ego text-white"
    };
    DIFFICULTY_LABELS = ["", "Easy", "Moderate", "Intermediate", "Advanced", "Expert"];
  }
});

// .svelte-kit/output/server/chunks/DifficultyBadge.js
var DifficultyBadge;
var init_DifficultyBadge = __esm({
  ".svelte-kit/output/server/chunks/DifficultyBadge.js"() {
    init_ssr();
    init_chunks();
    DifficultyBadge = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
      return `<div class="flex items-center gap-1.5">${each(Array(5), (_2, i2) => {
        return `<span class="${"difficulty-dot " + escape(i2 < level ? colors[level] : "bg-gray-600", true)}"></span>`;
      })} ${showLabel ? `<span class="ml-1 text-xs text-gray-400 font-heading uppercase">${escape(DIFFICULTY_LABELS[level])}</span>` : ``}</div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/projects/_page.svelte.js
var page_svelte_exports11 = {};
__export(page_svelte_exports11, {
  default: () => Page11
});
var Page11;
var init_page_svelte11 = __esm({
  ".svelte-kit/output/server/entries/pages/projects/_page.svelte.js"() {
    init_ssr();
    init_DifficultyBadge();
    Page11 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const projects = [
        {
          slug: "build-a-deck",
          name: "Build a Deck",
          difficulty: 3,
          time: "3-5 weekends",
          icon: "\u{1FAB5}",
          description: "Build a wood or composite deck"
        },
        {
          slug: "build-a-fence",
          name: "Build a Fence",
          difficulty: 2,
          time: "2-3 weekends",
          icon: "\u{1F3D7}\uFE0F",
          description: "Install a privacy or picket fence"
        },
        {
          slug: "bathroom-renovation",
          name: "Bathroom Renovation",
          difficulty: 4,
          time: "4-8 weekends",
          icon: "\u{1F6BF}",
          description: "Full bathroom remodel"
        },
        {
          slug: "kitchen-renovation",
          name: "Kitchen Renovation",
          difficulty: 5,
          time: "8-16 weekends",
          icon: "\u{1F373}",
          description: "Full kitchen remodel"
        },
        {
          slug: "finish-a-basement",
          name: "Finish a Basement",
          difficulty: 4,
          time: "8-12 weekends",
          icon: "\u{1F3E0}",
          description: "Frame, insulate, drywall, finish"
        },
        {
          slug: "install-hardwood-flooring",
          name: "Install Flooring",
          difficulty: 3,
          time: "2-4 weekends",
          icon: "\u{1FAB5}",
          description: "Hardwood or laminate flooring"
        },
        {
          slug: "install-tile",
          name: "Install Tile",
          difficulty: 3,
          time: "2-4 weekends",
          icon: "\u{1F9F1}",
          description: "Ceramic or porcelain tile"
        },
        {
          slug: "build-raised-garden-beds",
          name: "Garden Beds",
          difficulty: 1,
          time: "1 weekend",
          icon: "\u{1F331}",
          description: "Simple raised garden beds"
        },
        {
          slug: "build-a-shed",
          name: "Build a Shed",
          difficulty: 3,
          time: "3-5 weekends",
          icon: "\u{1F3DA}\uFE0F",
          description: "Small to medium storage shed"
        },
        {
          slug: "drywall-installation",
          name: "Drywall",
          difficulty: 3,
          time: "2-4 weekends",
          icon: "\u{1F9F1}",
          description: "Hang, tape, mud, and sand"
        },
        {
          slug: "paint-a-room",
          name: "Paint a Room",
          difficulty: 1,
          time: "1-2 days",
          icon: "\u{1F3A8}",
          description: "Prep and paint walls and trim"
        },
        {
          slug: "install-crown-molding",
          name: "Crown Molding",
          difficulty: 3,
          time: "1-2 weekends",
          icon: "\u{1F4D0}",
          description: "Install crown molding or trim"
        },
        {
          slug: "basic-plumbing-repairs",
          name: "Plumbing Repairs",
          difficulty: 2,
          time: "1-4 hours",
          icon: "\u{1F527}",
          description: "Fix leaks, replace faucets"
        },
        {
          slug: "basic-electrical-work",
          name: "Electrical Work",
          difficulty: 3,
          time: "1-4 hours",
          icon: "\u26A1",
          description: "Replace outlets, switches, fixtures"
        },
        {
          slug: "hang-shelves-cabinets",
          name: "Hang Shelves",
          difficulty: 2,
          time: "2-4 hours",
          icon: "\u{1F4E6}",
          description: "Mount shelves or wall cabinets"
        },
        {
          slug: "assemble-furniture",
          name: "Assemble Furniture",
          difficulty: 1,
          time: "1-3 hours",
          icon: "\u{1FA91}",
          description: "Flat-pack or kit furniture"
        },
        {
          slug: "car-maintenance",
          name: "Car Maintenance",
          difficulty: 2,
          time: "1-4 hours",
          icon: "\u{1F697}",
          description: "Oil changes, brake pads, basics"
        },
        {
          slug: "yard-maintenance",
          name: "Yard Maintenance",
          difficulty: 1,
          time: "2-4 hrs/week",
          icon: "\u{1F33F}",
          description: "Mowing, edging, trimming"
        },
        {
          slug: "tree-trimming",
          name: "Tree Trimming",
          difficulty: 4,
          time: "1-2 days",
          icon: "\u{1F333}",
          description: "Trim branches or remove trees"
        },
        {
          slug: "concrete-work",
          name: "Concrete Work",
          difficulty: 4,
          time: "2-4 weekends",
          icon: "\u{1F9F1}",
          description: "Small patio or walkway"
        }
      ];
      return `${$$result.head += `<!-- HEAD_svelte-1wxw9lg_START -->${$$result.title = `<title>DIY Projects \u2014 What Tools Do You Need? \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="Browse 20 common home improvement projects and see exactly what tools you need for each one. From painting a room to building a deck."><!-- HEAD_svelte-1wxw9lg_END -->`, ""} <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="text-center mb-10" data-svelte-h="svelte-bqtqs"><h1 class="text-3xl sm:text-4xl mb-4"><span class="text-white">Browse</span> <span class="text-safety-orange">Projects</span></h1> <p class="text-gray-400 font-body normal-case max-w-xl mx-auto">Pick a project and see exactly what tools you need, how long it&#39;ll take,
			and what it&#39;ll cost across different tool ecosystems.</p></div> <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">${each(projects, (project) => {
        return `<a href="${"/projects/" + escape(project.slug, true)}" class="card group hover:-translate-y-1 transition-all duration-300"><div class="flex items-start gap-3"><span class="text-3xl">${escape(project.icon)}</span> <div class="flex-1"><h3 class="font-heading text-sm text-gray-200 group-hover:text-safety-orange transition normal-case">${escape(project.name)}</h3> <p class="text-xs text-gray-500 font-body normal-case mt-1">${escape(project.description)}</p> <div class="mt-2 flex items-center justify-between">${validate_component(DifficultyBadge, "DifficultyBadge").$$render($$result, { level: project.difficulty }, {}, {})} <span class="text-xs text-gray-500">${escape(project.time)}</span></div> </div></div> </a>`;
      })}</div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/12.js
var __exports13 = {};
__export(__exports13, {
  component: () => component13,
  fonts: () => fonts13,
  imports: () => imports13,
  index: () => index13,
  stylesheets: () => stylesheets13
});
var index13, component_cache13, component13, imports13, stylesheets13, fonts13;
var init__13 = __esm({
  ".svelte-kit/output/server/nodes/12.js"() {
    index13 = 12;
    component13 = async () => component_cache13 ??= (await Promise.resolve().then(() => (init_page_svelte11(), page_svelte_exports11))).default;
    imports13 = ["_app/immutable/nodes/12.CdD0HRJu.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/Cfk4_Z0v.js", "_app/immutable/chunks/DU4gwN7y.js"];
    stylesheets13 = [];
    fonts13 = [];
  }
});

// .svelte-kit/output/server/entries/pages/projects/_slug_/_page.svelte.js
var page_svelte_exports12 = {};
__export(page_svelte_exports12, {
  default: () => Page12
});
var Page12;
var init_page_svelte12 = __esm({
  ".svelte-kit/output/server/entries/pages/projects/_slug_/_page.svelte.js"() {
    init_ssr();
    init_stores();
    init_DifficultyBadge();
    Page12 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let slug;
      let project;
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      const projectData = {
        "build-a-deck": {
          name: "Build a Deck",
          difficulty: 3,
          time: "3-5 weekends",
          icon: "\u{1FAB5}",
          description: "Build a wood or composite deck attached to your house. One of the most rewarding DIY projects that adds real value to your home.",
          essential: [
            "Circular Saw",
            "Drill/Driver",
            "Impact Driver",
            "Speed Square",
            "Tape Measure",
            "Level (4ft)",
            "Chalk Line",
            "Post Hole Digger"
          ],
          recommended: ["Miter Saw", "Jigsaw", "Reciprocating Saw", "Clamps"],
          rentable: [
            "Post Hole Auger \u2014 $50/day, saves hours of digging",
            "Miter Saw \u2014 $45/day if you only need it for this project"
          ],
          budget_cost: "$350-500 (Ryobi ONE+)",
          pro_cost: "$600-900 (Milwaukee M18)",
          safety: ["Safety glasses", "Hearing protection", "Work gloves", "Dust mask"],
          mistakes: [
            "Not checking local building codes and permit requirements before starting",
            "Skipping the ledger board flashing \u2014 leads to water damage",
            "Using regular screws instead of structural screws for framing",
            "Not pre-drilling hardwood decking \u2014 causes splitting",
            'Setting posts too shallow \u2014 code usually requires 42" depth for frost line'
          ]
        }
      };
      let selectedEcosystem = "ryobi-one-plus";
      slug = $page.params.slug;
      project = projectData[slug] || {
        name: slug.split("-").map((w2) => w2.charAt(0).toUpperCase() + w2.slice(1)).join(" "),
        difficulty: 3,
        time: "Varies",
        icon: "\u{1F527}",
        description: "Project details loading...",
        essential: [],
        recommended: [],
        rentable: [],
        budget_cost: "TBD",
        pro_cost: "TBD",
        safety: [],
        mistakes: []
      };
      $$unsubscribe_page();
      return `${$$result.head += `<!-- HEAD_svelte-1xgkb4k_START -->${$$result.title = `<title>What Tools Do You Need to ${escape(project.name)}? \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="${"Complete tool list for " + escape(project.name, true) + ". Essential tools, nice-to-haves, rental options, and cost breakdown across battery ecosystems."}"><!-- HEAD_svelte-1xgkb4k_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-8" data-svelte-h="svelte-7ls23x"><a href="/projects" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">\u2190 All Projects</a></div> <div class="flex items-start gap-4 mb-8"><span class="text-5xl">${escape(project.icon)}</span> <div><h1 class="text-3xl sm:text-4xl text-white">${escape(project.name)}</h1> <p class="text-gray-400 font-body normal-case mt-2">${escape(project.description)}</p> <div class="flex items-center gap-6 mt-3">${validate_component(DifficultyBadge, "DifficultyBadge").$$render($$result, { level: project.difficulty }, {}, {})} <span class="text-sm text-gray-400">\u23F1 ${escape(project.time)}</span></div></div></div>  <div class="card mb-6"><h2 class="text-lg text-safety-orange mb-3" data-svelte-h="svelte-bsm4dm">Choose Your Ecosystem</h2> <div class="flex flex-wrap gap-2">${each(
        [
          {
            slug: "ryobi-one-plus",
            name: "Ryobi ONE+",
            color: "bg-ryobi text-black",
            cost: project.budget_cost
          },
          {
            slug: "milwaukee-m18",
            name: "Milwaukee M18",
            color: "bg-milwaukee text-white",
            cost: project.pro_cost
          },
          {
            slug: "dewalt-20v-max",
            name: "DeWalt 20V",
            color: "bg-dewalt text-black",
            cost: project.pro_cost
          },
          {
            slug: "makita-18v-lxt",
            name: "Makita 18V",
            color: "bg-makita text-white",
            cost: project.pro_cost
          }
        ],
        (eco) => {
          return `<button class="${"ecosystem-badge " + escape(
            selectedEcosystem === eco.slug ? eco.color : "bg-gray-700 text-gray-300",
            true
          ) + " cursor-pointer transition"}">${escape(eco.name)} </button>`;
        }
      )}</div> <p class="mt-3 text-sm text-gray-400 font-body normal-case">Estimated tool cost: <span class="text-safety-orange font-bold">${escape(selectedEcosystem.includes("ryobi") ? project.budget_cost : project.pro_cost)}</span></p></div>  ${project.essential.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-safety-orange mb-3" data-svelte-h="svelte-13qb2tf">Essential Tools</h2> <p class="text-xs text-gray-500 mb-4 font-body normal-case" data-svelte-h="svelte-pw2ylk">You literally cannot do this project without these.</p> <ul class="space-y-2">${each(project.essential, (tool) => {
        return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-safety-orange flex-shrink-0"></span> ${escape(tool)} </li>`;
      })}</ul></div>` : ``}  ${project.recommended.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-electric-blue mb-3" data-svelte-h="svelte-ltsk00">Recommended</h2> <p class="text-xs text-gray-500 mb-4 font-body normal-case" data-svelte-h="svelte-13q3sxt">These make the job significantly easier and faster.</p> <ul class="space-y-2">${each(project.recommended, (tool) => {
        return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-electric-blue flex-shrink-0"></span> ${escape(tool)} </li>`;
      })}</ul></div>` : ``}  ${project.rentable.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-yellow-400 mb-3" data-svelte-h="svelte-1fsuy46">Consider Renting</h2> <ul class="space-y-2">${each(project.rentable, (item) => {
        return `<li class="flex items-start gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-1.5"></span> ${escape(item)} </li>`;
      })}</ul></div>` : ``}  ${project.safety.length > 0 ? `<div class="card mb-4"><h2 class="text-lg text-red-400 mb-3" data-svelte-h="svelte-1sspzyb">Safety Equipment</h2> <div class="flex flex-wrap gap-2">${each(project.safety, (item) => {
        return `<span class="px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-body normal-case">${escape(item)} </span>`;
      })}</div></div>` : ``}  ${project.mistakes.length > 0 ? `<div class="card"><h2 class="text-lg text-yellow-400 mb-3" data-svelte-h="svelte-r563va">Common Beginner Mistakes</h2> <ul class="space-y-3">${each(project.mistakes, (mistake) => {
        return `<li class="flex items-start gap-3 text-gray-400 font-body normal-case text-sm"><span class="text-yellow-400 flex-shrink-0" data-svelte-h="svelte-1idmo4s">\u26A0</span> ${escape(mistake)} </li>`;
      })}</ul></div>` : ``}</div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/13.js
var __exports14 = {};
__export(__exports14, {
  component: () => component14,
  fonts: () => fonts14,
  imports: () => imports14,
  index: () => index14,
  stylesheets: () => stylesheets14
});
var index14, component_cache14, component14, imports14, stylesheets14, fonts14;
var init__14 = __esm({
  ".svelte-kit/output/server/nodes/13.js"() {
    index14 = 13;
    component14 = async () => component_cache14 ??= (await Promise.resolve().then(() => (init_page_svelte12(), page_svelte_exports12))).default;
    imports14 = ["_app/immutable/nodes/13.BlEeCdSN.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js", "_app/immutable/chunks/Cfk4_Z0v.js", "_app/immutable/chunks/DU4gwN7y.js"];
    stylesheets14 = [];
    fonts14 = [];
  }
});

// .svelte-kit/output/server/entries/pages/search/_page.svelte.js
var page_svelte_exports13 = {};
__export(page_svelte_exports13, {
  default: () => Page13
});
var Page13;
var init_page_svelte13 = __esm({
  ".svelte-kit/output/server/entries/pages/search/_page.svelte.js"() {
    init_ssr();
    init_stores();
    init_SearchBar();
    init_internal();
    init_exports();
    init_utils();
    init_server();
    init_state_svelte();
    Page13 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let query = $page.url.searchParams.get("q") || "";
      let $$settled;
      let $$rendered;
      let previous_head = $$result.head;
      do {
        $$settled = true;
        $$result.head = previous_head;
        $$rendered = `${$$result.head += `<!-- HEAD_svelte-16qcmdo_START -->${$$result.title = `<title>${escape(query ? `"${query}" \u2014 Search Results` : "Search Tools")} \u2014 Lost in the Tool Pool</title>`, ""}<!-- HEAD_svelte-16qcmdo_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="flex justify-center mb-8">${validate_component(SearchBar, "SearchBar").$$render(
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
  }
});

// .svelte-kit/output/server/nodes/14.js
var __exports15 = {};
__export(__exports15, {
  component: () => component15,
  fonts: () => fonts15,
  imports: () => imports15,
  index: () => index15,
  stylesheets: () => stylesheets15
});
var index15, component_cache15, component15, imports15, stylesheets15, fonts15;
var init__15 = __esm({
  ".svelte-kit/output/server/nodes/14.js"() {
    index15 = 14;
    component15 = async () => component_cache15 ??= (await Promise.resolve().then(() => (init_page_svelte13(), page_svelte_exports13))).default;
    imports15 = ["_app/immutable/nodes/14.C33EEmkZ.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js", "_app/immutable/chunks/DYtejBVi.js"];
    stylesheets15 = [];
    fonts15 = [];
  }
});

// .svelte-kit/output/server/entries/pages/tools/_slug_/_page.svelte.js
var page_svelte_exports14 = {};
__export(page_svelte_exports14, {
  default: () => Page14
});
var Page14;
var init_page_svelte14 = __esm({
  ".svelte-kit/output/server/entries/pages/tools/_slug_/_page.svelte.js"() {
    init_ssr();
    init_stores();
    init_chunks();
    Page14 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let ecosystemClass;
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      let product = {
        name: 'Milwaukee M18 FUEL 1/4" Hex Impact Driver',
        brand: "Milwaukee",
        ecosystem: "milwaukee-m18",
        price_current: 149,
        rating: 4.9,
        review_count: 6200,
        description: "The king of impact drivers. 2000 in-lbs of torque with 4-mode DRIVE CONTROL for precision and power.",
        features: [
          "POWERSTATE brushless motor",
          "4-mode DRIVE CONTROL",
          "REDLINK intelligence",
          "Auto-stop mode for precision"
        ],
        specs: {
          voltage: 18,
          max_rpm: 3600,
          max_torque: "2000 in-lbs",
          drive: "1/4 hex",
          brushless: true
        },
        weight_lbs: 2.9
      };
      $page.params.slug;
      ecosystemClass = ECOSYSTEM_COLORS[product.ecosystem];
      $$unsubscribe_page();
      return `${$$result.head += `<!-- HEAD_svelte-11z40vr_START -->${$$result.title = `<title>${escape(product.name)} \u2014 Lost in the Tool Pool</title>`, ""}<meta name="description" content="${escape(product.description, true) + " $" + escape(product.price_current, true) + ". Compare prices across retailers."}"><!-- HEAD_svelte-11z40vr_END -->`, ""} <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div class="mb-6"><a href="${"/ecosystems/" + escape(product.ecosystem, true)}" class="text-sm text-gray-500 hover:text-safety-orange transition font-heading uppercase tracking-wider">\u2190 ${escape(product.brand)} ${escape(product.ecosystem.split("-").pop()?.toUpperCase())}</a></div> <div class="grid md:grid-cols-2 gap-8"> <div class="bg-charcoal-light rounded-xl p-8 flex items-center justify-center aspect-square" data-svelte-h="svelte-jni8d3"><svg class="w-32 h-32 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg></div>  <div><span class="${"ecosystem-badge " + escape(ecosystemClass, true) + " mb-3"}">${escape(product.brand)} ${escape(product.ecosystem.split("-").pop())}</span> <h1 class="text-2xl sm:text-3xl text-white mt-2 normal-case font-heading">${escape(product.name)}</h1> <div class="flex items-center gap-3 mt-3"><div class="flex items-center gap-1">${each(Array(5), (_2, i2) => {
        return `<svg class="${"w-4 h-4 " + escape(
          i2 < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600",
          true
        )}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
      })} <span class="text-sm text-gray-400 ml-1">${escape(product.rating)} (${escape(product.review_count.toLocaleString())} reviews)</span></div></div> <div class="mt-6"><span class="text-4xl font-heading font-bold text-safety-orange">$${escape(product.price_current)}</span> ${`<span class="ml-2 text-xs text-gray-500 font-body normal-case" data-svelte-h="svelte-1cbdwt9">(tool only \u2014 battery sold separately)</span>`}</div> <p class="mt-4 text-gray-400 font-body normal-case text-sm leading-relaxed">${escape(product.description)}</p>  <div class="mt-6 flex flex-wrap gap-3" data-svelte-h="svelte-yywb0s"><a href="#" class="affiliate-btn bg-[#ff9900] text-black">Buy at Amazon</a> <a href="#" class="affiliate-btn bg-[#f96302] text-white">Buy at Home Depot</a> <a href="#" class="affiliate-btn bg-[#004990] text-white">Buy at Lowe&#39;s</a></div> <p class="mt-2 text-xs text-gray-600 font-body normal-case" data-svelte-h="svelte-t0nfou">Prices may vary. We earn a commission on purchases \u2014 this doesn&#39;t affect our recommendations.</p></div></div>  <div class="card mt-8"><h2 class="text-lg text-safety-orange mb-4" data-svelte-h="svelte-1t6gjjp">Specifications</h2> <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">${each(Object.entries(product.specs), ([key2, value]) => {
        return `<div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider">${escape(key2.replace(/_/g, " "))}</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape(value)}</p> </div>`;
      })} <div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider" data-svelte-h="svelte-8yzjw0">Weight</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape(product.weight_lbs)} lbs</p></div> <div><span class="text-xs text-gray-500 font-heading uppercase tracking-wider" data-svelte-h="svelte-18qog49">Cordless</span> <p class="text-white font-body normal-case text-sm mt-0.5">${escape("Yes")}</p></div></div></div>  <div class="card mt-4"><h2 class="text-lg text-electric-blue mb-4" data-svelte-h="svelte-11q6akq">Key Features</h2> <ul class="space-y-2">${each(product.features, (feature) => {
        return `<li class="flex items-center gap-3 text-gray-300 font-body normal-case text-sm"><span class="w-1.5 h-1.5 rounded-full bg-electric-blue flex-shrink-0"></span> ${escape(feature)} </li>`;
      })}</ul></div></div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/15.js
var __exports16 = {};
__export(__exports16, {
  component: () => component16,
  fonts: () => fonts16,
  imports: () => imports16,
  index: () => index16,
  stylesheets: () => stylesheets16
});
var index16, component_cache16, component16, imports16, stylesheets16, fonts16;
var init__16 = __esm({
  ".svelte-kit/output/server/nodes/15.js"() {
    index16 = 15;
    component16 = async () => component_cache16 ??= (await Promise.resolve().then(() => (init_page_svelte14(), page_svelte_exports14))).default;
    imports16 = ["_app/immutable/nodes/15.rR2TzD-W.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/D6YF6ztN.js", "_app/immutable/chunks/6Jn0Uoq0.js", "_app/immutable/chunks/n7Og5-S1.js", "_app/immutable/chunks/JdRanJdr.js", "_app/immutable/chunks/DU4gwN7y.js"];
    stylesheets16 = [];
    fonts16 = [];
  }
});

// node_modules/@sveltejs/kit/src/exports/index.js
init_internal();

// node_modules/esm-env/true.js
var true_default = true;

// node_modules/esm-env/dev-fallback.js
var node_env = globalThis.process?.env?.NODE_ENV;
var dev_fallback_default = node_env && !node_env.toLowerCase().startsWith("prod");

// node_modules/@sveltejs/kit/src/runtime/utils.js
var text_encoder = new TextEncoder();
var text_decoder = new TextDecoder();

// node_modules/@sveltejs/kit/src/exports/index.js
function error(status, body2) {
  if ((!true_default || dev_fallback_default) && (isNaN(status) || status < 400 || status > 599)) {
    throw new Error(`HTTP error status codes must be between 400 and 599 \u2014 ${status} is invalid`);
  }
  throw new HttpError(status, body2);
}
function json(data, init2) {
  const body2 = JSON.stringify(data);
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    headers2.set("content-length", text_encoder.encode(body2).byteLength.toString());
  }
  if (!headers2.has("content-type")) {
    headers2.set("content-type", "application/json");
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}
function text(body2, init2) {
  const headers2 = new Headers(init2?.headers);
  if (!headers2.has("content-length")) {
    const encoded = text_encoder.encode(body2);
    headers2.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers: headers2
    });
  }
  return new Response(body2, {
    ...init2,
    headers: headers2
  });
}

// .svelte-kit/output/server/chunks/shared.js
init_internal();
init_server();

// node_modules/devalue/src/utils.js
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   * @param {any} [value] - The value that failed to be serialized
   * @param {any} [root] - The root value being serialized
   */
  constructor(message, keys, value, root) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
    this.value = value;
    this.root = root;
  }
};
function is_primitive(thing) {
  return Object(thing) !== thing;
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i2 = 0; i2 < len; i2 += 1) {
    const char = str[i2];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i2) + replacement;
      last_pos = i2 + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
var is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function stringify_key(key2) {
  return is_identifier.test(key2) ? "." + key2 : "[" + JSON.stringify(key2) + "]";
}
function is_valid_array_index(s4) {
  if (s4.length === 0) return false;
  if (s4.length > 1 && s4.charCodeAt(0) === 48) return false;
  for (let i2 = 0; i2 < s4.length; i2++) {
    const c3 = s4.charCodeAt(i2);
    if (c3 < 48 || c3 > 57) return false;
  }
  const n3 = +s4;
  if (n3 >= 2 ** 32 - 1) return false;
  if (n3 < 0) return false;
  return true;
}
function valid_array_indices(array2) {
  const keys = Object.keys(array2);
  for (var i2 = keys.length - 1; i2 >= 0; i2--) {
    if (is_valid_array_index(keys[i2])) {
      break;
    }
  }
  keys.length = i2 + 1;
  return keys;
}

// node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str2 = replacer(thing, (value2) => uneval(value2, replacer));
        if (typeof str2 === "string") {
          custom.set(thing, str2);
          return;
        }
      }
      if (typeof thing === "function") {
        throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
        case "URL":
        case "URLSearchParams":
          return;
        case "Array":
          thing.forEach((value2, i2) => {
            keys.push(`[${i2}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive(key2) : "..."})`
            );
            walk(value2);
            keys.pop();
          }
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
          walk(thing.buffer);
          return;
        case "ArrayBuffer":
          return;
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          return;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys,
              thing,
              value
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys,
              thing,
              value
            );
          }
          for (const key2 of Object.keys(thing)) {
            if (key2 === "__proto__") {
              throw new DevalueError(
                `Cannot stringify objects with __proto__ keys`,
                keys,
                thing,
                value
              );
            }
            keys.push(stringify_key(key2));
            walk(thing[key2]);
            keys.pop();
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a2, b2) => b2[1] - a2[1]).forEach((entry, i2) => {
    names.set(entry[0], get_name(i2));
  });
  function stringify3(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify3(thing.valueOf())})`;
      case "RegExp":
        return `new RegExp(${stringify_string(thing.source)}, "${thing.flags}")`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "URL":
        return `new URL(${stringify_string(thing.toString())})`;
      case "URLSearchParams":
        return `new URLSearchParams(${stringify_string(thing.toString())})`;
      case "Array": {
        let has_holes = false;
        let result = "[";
        for (let i2 = 0; i2 < thing.length; i2 += 1) {
          if (i2 > 0) result += ",";
          if (Object.hasOwn(thing, i2)) {
            result += stringify3(thing[i2]);
          } else if (!has_holes) {
            const populated_keys = valid_array_indices(
              /** @type {any[]} */
              thing
            );
            const population = populated_keys.length;
            const d2 = String(thing.length).length;
            const hole_cost = thing.length + 2;
            const sparse_cost = 25 + d2 + population * (d2 + 2);
            if (hole_cost > sparse_cost) {
              const entries = populated_keys.map((k2) => `${k2}:${stringify3(thing[k2])}`).join(",");
              return `Object.assign(Array(${thing.length}),{${entries}})`;
            }
            has_holes = true;
            i2 -= 1;
          }
        }
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return result + tail + "]";
      }
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify3).join(",")}])`;
      case "Int8Array":
      case "Uint8Array":
      case "Uint8ClampedArray":
      case "Int16Array":
      case "Uint16Array":
      case "Int32Array":
      case "Uint32Array":
      case "Float32Array":
      case "Float64Array":
      case "BigInt64Array":
      case "BigUint64Array": {
        let str2 = `new ${type}`;
        if (counts.get(thing.buffer) === 1) {
          const array2 = new thing.constructor(thing.buffer);
          str2 += `([${array2}])`;
        } else {
          str2 += `([${stringify3(thing.buffer)}])`;
        }
        const a2 = thing.byteOffset;
        const b2 = a2 + thing.byteLength;
        if (a2 > 0 || b2 !== thing.buffer.byteLength) {
          const m2 = +/(\d+)/.exec(type)[1] / 8;
          str2 += `.subarray(${a2 / m2},${b2 / m2})`;
        }
        return str2;
      }
      case "ArrayBuffer": {
        const ui8 = new Uint8Array(thing);
        return `new Uint8Array([${ui8.toString()}]).buffer`;
      }
      case "Temporal.Duration":
      case "Temporal.Instant":
      case "Temporal.PlainDate":
      case "Temporal.PlainTime":
      case "Temporal.PlainDateTime":
      case "Temporal.PlainMonthDay":
      case "Temporal.PlainYearMonth":
      case "Temporal.ZonedDateTime":
        return `${type}.from(${stringify_string(thing.toString())})`;
      default:
        const keys2 = Object.keys(thing);
        const obj = keys2.map((key2) => `${safe_key(key2)}:${stringify3(thing[key2])}`).join(",");
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return keys2.length > 0 ? `{${obj},__proto__:null}` : `{__proto__:null}`;
        }
        return `{${obj}}`;
    }
  }
  const str = stringify3(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify3(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v2, i2) => {
            statements.push(`${name}[${i2}]=${stringify3(v2)}`);
          });
          break;
        case "Set":
          values.push(`new Set`);
          statements.push(
            `${name}.${Array.from(thing).map((v2) => `add(${stringify3(v2)})`).join(".")}`
          );
          break;
        case "Map":
          values.push(`new Map`);
          statements.push(
            `${name}.${Array.from(thing).map(([k2, v2]) => `set(${stringify3(k2)}, ${stringify3(v2)})`).join(".")}`
          );
          break;
        case "ArrayBuffer":
          values.push(
            `new Uint8Array([${new Uint8Array(thing).join(",")}]).buffer`
          );
          break;
        default:
          values.push(
            Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}"
          );
          Object.keys(thing).forEach((key2) => {
            statements.push(
              `${name}${safe_prop(key2)}=${stringify3(thing[key2])}`
            );
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(
      ";"
    )}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function get_name(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function escape_unsafe_char(c3) {
  return escaped[c3] || c3;
}
function escape_unsafe_chars(str) {
  return str.replace(unsafe_chars, escape_unsafe_char);
}
function safe_key(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escape_unsafe_chars(JSON.stringify(key2));
}
function safe_prop(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? `.${key2}` : `[${escape_unsafe_chars(JSON.stringify(key2))}]`;
}
function stringify_primitive(thing) {
  if (typeof thing === "string") return stringify_string(thing);
  if (thing === void 0) return "void 0";
  if (thing === 0 && 1 / thing < 0) return "-0";
  const str = String(thing);
  if (typeof thing === "number") return str.replace(/^(-)?0\./, "$1.");
  if (typeof thing === "bigint") return thing + "n";
  return str;
}

// node_modules/devalue/src/base64.js
function encode64(arraybuffer) {
  const dv = new DataView(arraybuffer);
  let binaryString = "";
  for (let i2 = 0; i2 < arraybuffer.byteLength; i2++) {
    binaryString += String.fromCharCode(dv.getUint8(i2));
  }
  return binaryToAscii(binaryString);
}
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);
  for (let i2 = 0; i2 < arraybuffer.byteLength; i2++) {
    dv.setUint8(i2, binaryString.charCodeAt(i2));
  }
  return arraybuffer;
}
var KEY_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i2 = 0; i2 < data.length; i2++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i2]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 16711680) >> 16);
      output += String.fromCharCode((buffer & 65280) >> 8);
      output += String.fromCharCode(buffer & 255);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 65280) >> 8);
    output += String.fromCharCode(buffer & 255);
  }
  return output;
}
function binaryToAscii(str) {
  let out = "";
  for (let i2 = 0; i2 < str.length; i2 += 3) {
    const groupsOfSix = [void 0, void 0, void 0, void 0];
    groupsOfSix[0] = str.charCodeAt(i2) >> 2;
    groupsOfSix[1] = (str.charCodeAt(i2) & 3) << 4;
    if (str.length > i2 + 1) {
      groupsOfSix[1] |= str.charCodeAt(i2 + 1) >> 4;
      groupsOfSix[2] = (str.charCodeAt(i2 + 1) & 15) << 2;
    }
    if (str.length > i2 + 2) {
      groupsOfSix[2] |= str.charCodeAt(i2 + 2) >> 6;
      groupsOfSix[3] = str.charCodeAt(i2 + 2) & 63;
    }
    for (let j2 = 0; j2 < groupsOfSix.length; j2++) {
      if (typeof groupsOfSix[j2] === "undefined") {
        out += "=";
      } else {
        out += KEY_STRING[groupsOfSix[j2]];
      }
    }
  }
  return out;
}

// node_modules/devalue/src/constants.js
var UNDEFINED = -1;
var HOLE = -2;
var NAN = -3;
var POSITIVE_INFINITY = -4;
var NEGATIVE_INFINITY = -5;
var NEGATIVE_ZERO = -6;
var SPARSE = -7;

// node_modules/devalue/src/parse.js
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
function unflatten(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index17, standalone = false) {
    if (index17 === UNDEFINED) return void 0;
    if (index17 === NAN) return NaN;
    if (index17 === POSITIVE_INFINITY) return Infinity;
    if (index17 === NEGATIVE_INFINITY) return -Infinity;
    if (index17 === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index17 !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index17 in hydrated) return hydrated[index17];
    const value = values[index17];
    if (!value || typeof value !== "object") {
      hydrated[index17] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i2 = value[1];
          if (typeof i2 !== "number") {
            i2 = values.push(value[1]) - 1;
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i2)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i2);
          hydrated[index17] = reviver(hydrate(i2));
          hydrating.delete(i2);
          return hydrated[index17];
        }
        switch (type) {
          case "Date":
            hydrated[index17] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index17] = set;
            for (let i2 = 1; i2 < value.length; i2 += 1) {
              set.add(hydrate(value[i2]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index17] = map;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              map.set(hydrate(value[i2]), hydrate(value[i2 + 1]));
            }
            break;
          case "RegExp":
            hydrated[index17] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            const object = Object(value[1]);
            if (Object.hasOwn(object, "__proto__")) {
              throw new Error("Cannot parse an object with a `__proto__` property");
            }
            hydrated[index17] = object;
            break;
          case "BigInt":
            hydrated[index17] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index17] = obj;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              if (value[i2] === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              obj[value[i2]] = hydrate(value[i2 + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer = hydrate(value[1]);
            const typedArray = new TypedArrayConstructor(buffer);
            hydrated[index17] = value[2] !== void 0 ? typedArray.subarray(value[2], value[3]) : typedArray;
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index17] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index17] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index17] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index17] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!Number.isInteger(len) || len < 0) {
          throw new Error("Invalid input");
        }
        const array2 = new Array(len);
        hydrated[index17] = array2;
        for (let i2 = 2; i2 < value.length; i2 += 2) {
          const idx = value[i2];
          if (!Number.isInteger(idx) || idx < 0 || idx >= len) {
            throw new Error("Invalid input");
          }
          array2[idx] = hydrate(value[i2 + 1]);
        }
      } else {
        const array2 = new Array(value.length);
        hydrated[index17] = array2;
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          const n3 = value[i2];
          if (n3 === HOLE) continue;
          array2[i2] = hydrate(n3);
        }
      }
    } else {
      const object = {};
      hydrated[index17] = object;
      for (const key2 of Object.keys(value)) {
        if (key2 === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n3 = value[key2];
        object[key2] = hydrate(n3);
      }
    }
    return hydrated[index17];
  }
  return hydrate(0);
}

// node_modules/devalue/src/stringify.js
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key2 of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key: key2, fn: reducers[key2] });
    }
  }
  const keys = [];
  let p2 = 0;
  function flatten(thing) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return indexes.get(thing);
    const index18 = p2++;
    indexes.set(thing, index18);
    for (const { key: key2, fn: fn2 } of custom) {
      const value2 = fn2(thing);
      if (value2) {
        stringified[index18] = `["${key2}",${flatten(value2)}]`;
        return index18;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive2(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive2(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i2 = 0; i2 < thing.length; i2 += 1) {
            if (i2 > 0) str += ",";
            if (Object.hasOwn(thing, i2)) {
              keys.push(`[${i2}]`);
              str += flatten(thing[i2]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d2 = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d2 + population * (d2 + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j2 = 0; j2 < populated_keys.length; j2++) {
                  const key2 = populated_keys[j2];
                  keys.push(`[${key2}]`);
                  str += "," + key2 + "," + flatten(thing[key2]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive2(key2) : "..."})`
            );
            str += `,${flatten(key2)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          const a2 = thing.byteOffset;
          const b2 = a2 + thing.byteLength;
          if (a2 > 0 || b2 !== typedArray.buffer.byteLength) {
            const m2 = +/(\d+)/.exec(type)[1] / 8;
            str += `,${a2 / m2},${b2 / m2}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys,
              thing,
              value
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys,
              thing,
              value
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key2 of Object.keys(thing)) {
              if (key2 === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key2));
              str += `,${stringify_string(key2)},${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key2 of Object.keys(thing)) {
              if (key2 === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key2));
              str += `${stringify_string(key2)}:${flatten(thing[key2])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index18] = str;
    return index18;
  }
  const index17 = flatten(value);
  if (index17 < 0) return `${index17}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive2(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing instanceof String) return stringify_string(thing.toString());
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}

// .svelte-kit/output/server/chunks/shared.js
init_utils();
var browser = false;
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
var MUTATIVE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];
var PAGE_METHODS = ["GET", "POST", "HEAD"];
function set_nested_value(object, path_string, value) {
  if (path_string.startsWith("n:")) {
    path_string = path_string.slice(2);
    value = value === "" ? void 0 : parseFloat(value);
  } else if (path_string.startsWith("b:")) {
    path_string = path_string.slice(2);
    value = value === "on";
  }
  deep_set(object, split_path(path_string), value);
}
function convert_formdata(data) {
  const result = {};
  for (let key2 of data.keys()) {
    const is_array = key2.endsWith("[]");
    let values = data.getAll(key2);
    if (is_array) key2 = key2.slice(0, -2);
    if (values.length > 1 && !is_array) {
      throw new Error(`Form cannot contain duplicated keys \u2014 "${key2}" has ${values.length} values`);
    }
    values = values.filter(
      (entry) => typeof entry === "string" || entry.name !== "" || entry.size > 0
    );
    if (key2.startsWith("n:")) {
      key2 = key2.slice(2);
      values = values.map((v2) => v2 === "" ? void 0 : parseFloat(
        /** @type {string} */
        v2
      ));
    } else if (key2.startsWith("b:")) {
      key2 = key2.slice(2);
      values = values.map((v2) => v2 === "on");
    }
    set_nested_value(result, key2, is_array ? values : values[0]);
  }
  return result;
}
var BINARY_FORM_CONTENT_TYPE = "application/x-sveltekit-formdata";
var BINARY_FORM_VERSION = 0;
var HEADER_BYTES = 1 + 4 + 2;
async function deserialize_binary_form(request) {
  if (request.headers.get("content-type") !== BINARY_FORM_CONTENT_TYPE) {
    const form_data = await request.formData();
    return { data: convert_formdata(form_data), meta: {}, form_data };
  }
  if (!request.body) {
    throw deserialize_error("no body");
  }
  const content_length = parseInt(request.headers.get("content-length") ?? "");
  if (Number.isNaN(content_length)) {
    throw deserialize_error("invalid Content-Length header");
  }
  const reader = request.body.getReader();
  const chunks = [];
  function get_chunk(index17) {
    if (index17 in chunks) return chunks[index17];
    let i2 = chunks.length;
    while (i2 <= index17) {
      chunks[i2] = reader.read().then((chunk) => chunk.value);
      i2++;
    }
    return chunks[index17];
  }
  async function get_buffer(offset, length) {
    let start_chunk;
    let chunk_start = 0;
    let chunk_index;
    for (chunk_index = 0; ; chunk_index++) {
      const chunk = await get_chunk(chunk_index);
      if (!chunk) return null;
      const chunk_end = chunk_start + chunk.byteLength;
      if (offset >= chunk_start && offset < chunk_end) {
        start_chunk = chunk;
        break;
      }
      chunk_start = chunk_end;
    }
    if (offset + length <= chunk_start + start_chunk.byteLength) {
      return start_chunk.subarray(offset - chunk_start, offset + length - chunk_start);
    }
    const chunks2 = [start_chunk.subarray(offset - chunk_start)];
    let cursor = start_chunk.byteLength - offset + chunk_start;
    while (cursor < length) {
      chunk_index++;
      let chunk = await get_chunk(chunk_index);
      if (!chunk) return null;
      if (chunk.byteLength > length - cursor) {
        chunk = chunk.subarray(0, length - cursor);
      }
      chunks2.push(chunk);
      cursor += chunk.byteLength;
    }
    const buffer = new Uint8Array(length);
    cursor = 0;
    for (const chunk of chunks2) {
      buffer.set(chunk, cursor);
      cursor += chunk.byteLength;
    }
    return buffer;
  }
  const header = await get_buffer(0, HEADER_BYTES);
  if (!header) throw deserialize_error("too short");
  if (header[0] !== BINARY_FORM_VERSION) {
    throw deserialize_error(`got version ${header[0]}, expected version ${BINARY_FORM_VERSION}`);
  }
  const header_view = new DataView(header.buffer, header.byteOffset, header.byteLength);
  const data_length = header_view.getUint32(1, true);
  if (HEADER_BYTES + data_length > content_length) {
    throw deserialize_error("data overflow");
  }
  const file_offsets_length = header_view.getUint16(5, true);
  if (HEADER_BYTES + data_length + file_offsets_length > content_length) {
    throw deserialize_error("file offset table overflow");
  }
  const data_buffer = await get_buffer(HEADER_BYTES, data_length);
  if (!data_buffer) throw deserialize_error("data too short");
  let file_offsets;
  let files_start_offset;
  if (file_offsets_length > 0) {
    const file_offsets_buffer = await get_buffer(HEADER_BYTES + data_length, file_offsets_length);
    if (!file_offsets_buffer) throw deserialize_error("file offset table too short");
    const parsed_offsets = JSON.parse(text_decoder2.decode(file_offsets_buffer));
    if (!Array.isArray(parsed_offsets) || parsed_offsets.some((n3) => typeof n3 !== "number" || !Number.isInteger(n3) || n3 < 0)) {
      throw deserialize_error("invalid file offset table");
    }
    file_offsets = /** @type {Array<number>} */
    parsed_offsets;
    files_start_offset = HEADER_BYTES + data_length + file_offsets_length;
  }
  const file_spans = [];
  const [data, meta] = parse(text_decoder2.decode(data_buffer), {
    File: ([name, type, size, last_modified, index17]) => {
      if (typeof name !== "string" || typeof type !== "string" || typeof size !== "number" || typeof last_modified !== "number" || typeof index17 !== "number") {
        throw deserialize_error("invalid file metadata");
      }
      let offset = file_offsets[index17];
      if (offset === void 0) {
        throw deserialize_error("duplicate file offset table index");
      }
      file_offsets[index17] = void 0;
      offset += files_start_offset;
      if (offset + size > content_length) {
        throw deserialize_error("file data overflow");
      }
      file_spans.push({ offset, size });
      return new Proxy(new LazyFile(name, type, size, last_modified, get_chunk, offset), {
        getPrototypeOf() {
          return File.prototype;
        }
      });
    }
  });
  file_spans.sort((a2, b2) => a2.offset - b2.offset || a2.size - b2.size);
  for (let i2 = 1; i2 < file_spans.length; i2++) {
    const previous = file_spans[i2 - 1];
    const current2 = file_spans[i2];
    const previous_end = previous.offset + previous.size;
    if (previous_end < current2.offset) {
      throw deserialize_error("gaps in file data");
    }
    if (previous_end > current2.offset) {
      throw deserialize_error("overlapping file data");
    }
  }
  void (async () => {
    let has_more = true;
    while (has_more) {
      const chunk = await get_chunk(chunks.length);
      has_more = !!chunk;
    }
  })();
  return { data, meta, form_data: null };
}
function deserialize_error(message) {
  return new SvelteKitError(400, "Bad Request", `Could not deserialize binary form: ${message}`);
}
var LazyFile = class _LazyFile {
  /** @type {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} */
  #get_chunk;
  /** @type {number} */
  #offset;
  /**
   * @param {string} name
   * @param {string} type
   * @param {number} size
   * @param {number} last_modified
   * @param {(index: number) => Promise<Uint8Array<ArrayBuffer> | undefined>} get_chunk
   * @param {number} offset
   */
  constructor(name, type, size, last_modified, get_chunk, offset) {
    this.name = name;
    this.type = type;
    this.size = size;
    this.lastModified = last_modified;
    this.webkitRelativePath = "";
    this.#get_chunk = get_chunk;
    this.#offset = offset;
    this.arrayBuffer = this.arrayBuffer.bind(this);
    this.bytes = this.bytes.bind(this);
    this.slice = this.slice.bind(this);
    this.stream = this.stream.bind(this);
    this.text = this.text.bind(this);
  }
  /** @type {ArrayBuffer | undefined} */
  #buffer;
  async arrayBuffer() {
    this.#buffer ??= await new Response(this.stream()).arrayBuffer();
    return this.#buffer;
  }
  async bytes() {
    return new Uint8Array(await this.arrayBuffer());
  }
  /**
   * @param {number=} start
   * @param {number=} end
   * @param {string=} contentType
   */
  slice(start = 0, end = this.size, contentType = this.type) {
    if (start < 0) {
      start = Math.max(this.size + start, 0);
    } else {
      start = Math.min(start, this.size);
    }
    if (end < 0) {
      end = Math.max(this.size + end, 0);
    } else {
      end = Math.min(end, this.size);
    }
    const size = Math.max(end - start, 0);
    const file = new _LazyFile(
      this.name,
      contentType,
      size,
      this.lastModified,
      this.#get_chunk,
      this.#offset + start
    );
    return file;
  }
  stream() {
    let cursor = 0;
    let chunk_index = 0;
    return new ReadableStream({
      start: async (controller) => {
        let chunk_start = 0;
        let start_chunk;
        for (chunk_index = 0; ; chunk_index++) {
          const chunk = await this.#get_chunk(chunk_index);
          if (!chunk) return null;
          const chunk_end = chunk_start + chunk.byteLength;
          if (this.#offset >= chunk_start && this.#offset < chunk_end) {
            start_chunk = chunk;
            break;
          }
          chunk_start = chunk_end;
        }
        if (this.#offset + this.size <= chunk_start + start_chunk.byteLength) {
          controller.enqueue(
            start_chunk.subarray(this.#offset - chunk_start, this.#offset + this.size - chunk_start)
          );
          controller.close();
        } else {
          controller.enqueue(start_chunk.subarray(this.#offset - chunk_start));
          cursor = start_chunk.byteLength - this.#offset + chunk_start;
        }
      },
      pull: async (controller) => {
        chunk_index++;
        let chunk = await this.#get_chunk(chunk_index);
        if (!chunk) {
          controller.error("incomplete file data");
          controller.close();
          return;
        }
        if (chunk.byteLength > this.size - cursor) {
          chunk = chunk.subarray(0, this.size - cursor);
        }
        controller.enqueue(chunk);
        cursor += chunk.byteLength;
        if (cursor >= this.size) {
          controller.close();
        }
      }
    });
  }
  async text() {
    return text_decoder2.decode(await this.arrayBuffer());
  }
};
var path_regex = /^[a-zA-Z_$]\w*(\.[a-zA-Z_$]\w*|\[\d+\])*$/;
function split_path(path) {
  if (!path_regex.test(path)) {
    throw new Error(`Invalid path ${path}`);
  }
  return path.split(/\.|\[|\]/).filter(Boolean);
}
function check_prototype_pollution(key2) {
  if (key2 === "__proto__" || key2 === "constructor" || key2 === "prototype") {
    throw new Error(
      `Invalid key "${key2}"`
    );
  }
}
function deep_set(object, keys, value) {
  let current2 = object;
  for (let i2 = 0; i2 < keys.length - 1; i2 += 1) {
    const key2 = keys[i2];
    check_prototype_pollution(key2);
    const is_array = /^\d+$/.test(keys[i2 + 1]);
    const exists = Object.hasOwn(current2, key2);
    const inner = current2[key2];
    if (exists && is_array !== Array.isArray(inner)) {
      throw new Error(`Invalid array key ${keys[i2 + 1]}`);
    }
    if (!exists) {
      current2[key2] = is_array ? [] : {};
    }
    current2 = current2[key2];
  }
  const final_key = keys[keys.length - 1];
  check_prototype_pollution(final_key);
  current2[final_key] = value;
}
function negotiate(accept, types) {
  const parts = [];
  accept.split(",").forEach((str, i2) => {
    const match = /([^/ \t]+)\/([^; \t]+)[ \t]*(?:;[ \t]*q=([0-9.]+))?/.exec(str);
    if (match) {
      const [, type, subtype, q2 = "1"] = match;
      parts.push({ type, subtype, q: +q2, i: i2 });
    }
  });
  parts.sort((a2, b2) => {
    if (a2.q !== b2.q) {
      return b2.q - a2.q;
    }
    if (a2.subtype === "*" !== (b2.subtype === "*")) {
      return a2.subtype === "*" ? 1 : -1;
    }
    if (a2.type === "*" !== (b2.type === "*")) {
      return a2.type === "*" ? 1 : -1;
    }
    return a2.i - b2.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function is_content_type(request, ...types) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types.includes(type.toLowerCase());
}
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain",
    BINARY_FORM_CONTENT_TYPE
  );
}
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
function normalize_error(error2) {
  return (
    /** @type {import('../exports/internal/index.js').Redirect | HttpError | SvelteKitError | Error} */
    error2
  );
}
function get_status(error2) {
  return error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : 500;
}
function get_message(error2) {
  return error2 instanceof SvelteKitError ? error2.text : "Internal Error";
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
  // Svelte also escapes < because the escape function could be called inside a `noscript` there
  // https://github.com/sveltejs/svelte/security/advisories/GHSA-8266-84wp-wv5c
  // However, that doesn't apply in SvelteKit
};
var escape_html_dict = {
  "&": "&amp;",
  "<": "&lt;"
};
var surrogates = (
  // high surrogate without paired low surrogate
  "[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]"
);
var escape_html_attr_regex = new RegExp(
  `[${Object.keys(escape_html_attr_dict).join("")}]|` + surrogates,
  "g"
);
var escape_html_regex = new RegExp(
  `[${Object.keys(escape_html_dict).join("")}]|` + surrogates,
  "g"
);
function escape_html(str, is_attr) {
  const dict = is_attr ? escape_html_attr_dict : escape_html_dict;
  const escaped_str = str.replace(is_attr ? escape_html_attr_regex : escape_html_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return escaped_str;
}
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
function allowed_methods(mod) {
  const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
  if ("GET" in mod && !("HEAD" in mod)) {
    allowed.push("HEAD");
  }
  return allowed;
}
function get_global_name(options2) {
  return `__sveltekit_${options2.version_hash}`;
}
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message: escape_html(message) });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
async function handle_fatal_error(event, state, options2, error2) {
  error2 = error2 instanceof HttpError ? error2 : coalesce_to_error(error2);
  const status = get_status(error2);
  const body2 = await handle_error_and_jsonify(event, state, options2, error2);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body2, {
      status
    });
  }
  return static_error_page(options2, status, body2.message);
}
async function handle_error_and_jsonify(event, state, options2, error2) {
  if (error2 instanceof HttpError) {
    return { message: "Unknown Error", ...error2.body };
  }
  const status = get_status(error2);
  const message = get_message(error2);
  return await with_request_store(
    { event, state },
    () => options2.hooks.handleError({ error: error2, event, status, message })
  ) ?? { message };
}
function redirect_response(status, location2) {
  const response = new Response(void 0, {
    status,
    headers: { location: location2 }
  });
  return response;
}
function clarify_devalue_error(event, error2) {
  if (error2.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error2.message} (${error2.path}). If you need to serialize/deserialize custom types, use transport hooks: https://svelte.dev/docs/kit/hooks#Universal-hooks-transport.`;
  }
  if (error2.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error2.message;
}
function serialize_uses(node) {
  const uses = {};
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.dependencies = Array.from(node.uses.dependencies);
  }
  if (node.uses && node.uses.search_params.size > 0) {
    uses.search_params = Array.from(node.uses.search_params);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.params = Array.from(node.uses.params);
  }
  if (node.uses?.parent) uses.parent = 1;
  if (node.uses?.route) uses.route = 1;
  if (node.uses?.url) uses.url = 1;
  return uses;
}
function has_prerendered_path(manifest2, pathname) {
  return manifest2._.prerendered_routes.has(pathname) || pathname.at(-1) === "/" && manifest2._.prerendered_routes.has(pathname.slice(0, -1));
}
function format_server_error(status, error2, event) {
  const formatted_text = `
\x1B[1;31m[${status}] ${event.request.method} ${event.url.pathname}\x1B[0m`;
  if (status === 404) {
    return formatted_text;
  }
  return `${formatted_text}
${error2.stack}`;
}
function get_node_type(node_id) {
  const parts = node_id?.split("/");
  const filename = parts?.at(-1);
  if (!filename) return "unknown";
  const dot_parts = filename.split(".");
  return dot_parts.slice(0, -1).join(".");
}
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
function stringify2(data, transport) {
  const encoders = Object.fromEntries(Object.entries(transport).map(([k2, v2]) => [k2, v2.encode]));
  return stringify(data, encoders);
}
function parse_remote_arg(string, transport) {
  if (!string) return void 0;
  const json_string = text_decoder2.decode(
    // no need to add back `=` characters, atob can handle it
    base64_decode(string.replaceAll("-", "+").replaceAll("_", "/"))
  );
  const decoders = Object.fromEntries(Object.entries(transport).map(([k2, v2]) => [k2, v2.decode]));
  return parse(json_string, decoders);
}
function create_remote_key(id, payload) {
  return id + "/" + payload;
}

// .svelte-kit/output/server/index.js
init_internal();
init_server();

// .svelte-kit/output/server/chunks/environment.js
var base = "";
var assets = base;
var app_dir = "_app";
var relative = true;
var initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}

// .svelte-kit/output/server/index.js
init_exports();
init_utils();
init_ssr();

// .svelte-kit/output/server/chunks/internal.js
init_ssr();
init_ssr2();
var public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
var read_implementation = null;
function set_read_implementation(fn2) {
  read_implementation = fn2;
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0) $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0) $$bindings.page(page2);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0) $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0) $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0) $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0) $$bindings.data_1(data_1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      stores.page.set(page2);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      {
        data: data_0,
        params: page2.params,
        this: components[0]
      },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            {
              data: data_1,
              form,
              params: page2.params,
              this: components[1]
            },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      {
        data: data_0,
        form,
        params: page2.params,
        this: components[0]
      },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
var options = {
  app_template_contains_nonce: false,
  async: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  csrf_trusted_origins: [],
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hash_routing: false,
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  service_worker_options: void 0,
  server_error_boundaries: false,
  templates: {
    app: ({ head, body: body2, assets: assets2, nonce, env }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="' + assets2 + `/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="Tell us your project. We'll tell you what tools you need. AI-powered tool recommendations for DIY homeowners." />
		<meta name="theme-color" content="#1a1a2e" />
		` + head + '\n	</head>\n	<body data-sveltekit-preload-data="hover">\n		<div style="display: contents">' + body2 + "</div>\n	</body>\n</html>\n",
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "1s0b8kf"
};
async function get_hooks() {
  let handle;
  let handleFetch;
  let handleError;
  let handleValidationError;
  let init2;
  let reroute;
  let transport;
  return {
    handle,
    handleFetch,
    handleError,
    handleValidationError,
    init: init2,
    reroute,
    transport
  };
}

// .svelte-kit/output/server/index.js
var import_cookie = __toESM(require_cookie(), 1);

// node_modules/set-cookie-parser/lib/set-cookie.js
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
  split: "auto"
  // auto = split strings but not arrays
};
function isForbiddenKey(key2) {
  return typeof key2 !== "string" || key2 in {};
}
function createNullObj() {
  return /* @__PURE__ */ Object.create(null);
}
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options2) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValuePairStr = parts.shift();
  var parsed = parseNameValuePair(nameValuePairStr);
  var name = parsed.name;
  var value = parsed.value;
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  if (isForbiddenKey(name)) {
    return null;
  }
  try {
    value = options2.decodeValues ? decodeURIComponent(value) : value;
  } catch (e3) {
    console.error(
      "set-cookie-parser: failed to decode cookie value. Set options.decodeValues=false to disable decoding.",
      e3
    );
  }
  var cookie = createNullObj();
  cookie.name = name;
  cookie.value = value;
  parts.forEach(function(part) {
    var sides = part.split("=");
    var key2 = sides.shift().trimLeft().toLowerCase();
    if (isForbiddenKey(key2)) {
      return;
    }
    var value2 = sides.join("=");
    if (key2 === "expires") {
      cookie.expires = new Date(value2);
    } else if (key2 === "max-age") {
      var n3 = parseInt(value2, 10);
      if (!Number.isNaN(n3)) cookie.maxAge = n3;
    } else if (key2 === "secure") {
      cookie.secure = true;
    } else if (key2 === "httponly") {
      cookie.httpOnly = true;
    } else if (key2 === "samesite") {
      cookie.sameSite = value2;
    } else if (key2 === "partitioned") {
      cookie.partitioned = true;
    } else if (key2) {
      cookie[key2] = value2;
    }
  });
  return cookie;
}
function parseNameValuePair(nameValuePairStr) {
  var name = "";
  var value = "";
  var nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}
function parseSetCookie(input, options2) {
  options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
  if (!input) {
    if (!options2.map) {
      return [];
    } else {
      return createNullObj();
    }
  }
  if (input.headers) {
    if (typeof input.headers.getSetCookie === "function") {
      input = input.headers.getSetCookie();
    } else if (input.headers["set-cookie"]) {
      input = input.headers["set-cookie"];
    } else {
      var sch = input.headers[Object.keys(input.headers).find(function(key2) {
        return key2.toLowerCase() === "set-cookie";
      })];
      if (!sch && input.headers.cookie && !options2.silent) {
        console.warn(
          "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
        );
      }
      input = sch;
    }
  }
  var split = options2.split;
  var isArray = Array.isArray(input);
  if (split === "auto") {
    split = !isArray;
  }
  if (!isArray) {
    input = [input];
  }
  input = input.filter(isNonEmptyString);
  if (split) {
    input = input.map(splitCookiesString).flat();
  }
  if (!options2.map) {
    return input.map(function(str) {
      return parseString(str, options2);
    }).filter(Boolean);
  } else {
    var cookies = createNullObj();
    return input.reduce(function(cookies2, str) {
      var cookie = parseString(str, options2);
      if (cookie && !isForbiddenKey(cookie.name)) {
        cookies2[cookie.name] = cookie;
      }
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
parseSetCookie.parseSetCookie = parseSetCookie;
parseSetCookie.parse = parseSetCookie;
parseSetCookie.parseString = parseString;
parseSetCookie.splitCookiesString = splitCookiesString;

// .svelte-kit/output/server/index.js
function with_resolvers() {
  let resolve2;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve2 = res;
    reject = rej;
  });
  return { promise, resolve: resolve2, reject };
}
var NULL_BODY_STATUS = [101, 103, 204, 205, 304];
var IN_WEBCONTAINER2 = !!globalThis.process?.versions?.webcontainer;
async function render_endpoint(event, event_state, mod, state) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler = mod[method] || mod.fallback;
  if (method === "HEAD" && !mod.HEAD && mod.GET) {
    handler = mod.GET;
  }
  if (!handler) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state.prerendering && !state.prerendering.inside_reroute && !prerender) {
    if (state.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    event_state.allows_commands = true;
    const response = await with_request_store(
      { event, state: event_state },
      () => handler(
        /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
        event
      )
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state.prerendering && (!state.prerendering.inside_reroute || prerender)) {
      const cloned = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      cloned.headers.set("x-sveltekit-prerender", String(prerender));
      if (state.prerendering.inside_reroute && prerender) {
        cloned.headers.set(
          "x-sveltekit-routeid",
          encodeURI(
            /** @type {string} */
            event.route.id
          )
        );
        state.prerendering.dependencies.set(event.url.pathname, { response: cloned, body: null });
      } else {
        return cloned;
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return new Response(void 0, {
        status: e3.status,
        headers: { location: e3.location }
      });
    }
    throw e3;
  }
}
function is_endpoint_request(event) {
  const { method, headers: headers2 } = event.request;
  if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) {
    return true;
  }
  if (method === "POST" && headers2.get("x-sveltekit-action") === "true") return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
var DATA_SUFFIX = "/__data.json";
var HTML_DATA_SUFFIX = ".html__data.json";
function has_data_suffix2(pathname) {
  return pathname.endsWith(DATA_SUFFIX) || pathname.endsWith(HTML_DATA_SUFFIX);
}
function add_data_suffix2(pathname) {
  if (pathname.endsWith(".html")) return pathname.replace(/\.html$/, HTML_DATA_SUFFIX);
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
function strip_data_suffix2(pathname) {
  if (pathname.endsWith(HTML_DATA_SUFFIX)) {
    return pathname.slice(0, -HTML_DATA_SUFFIX.length) + ".html";
  }
  return pathname.slice(0, -DATA_SUFFIX.length);
}
var ROUTE_SUFFIX = "/__route.js";
function has_resolution_suffix2(pathname) {
  return pathname.endsWith(ROUTE_SUFFIX);
}
function add_resolution_suffix2(pathname) {
  return pathname.replace(/\/$/, "") + ROUTE_SUFFIX;
}
function strip_resolution_suffix2(pathname) {
  return pathname.slice(0, -ROUTE_SUFFIX.length);
}
var noop_span = {
  spanContext() {
    return noop_span_context;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return false;
  },
  recordException() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  }
};
var noop_span_context = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};
async function record_span({ name, attributes, fn: fn2 }) {
  {
    return fn2(noop_span);
  }
}
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
async function handle_action_json_request(event, event_state, options2, server2) {
  const actions = server2?.actions;
  if (!actions) {
    const no_actions_error = new SvelteKitError(
      405,
      "Method Not Allowed",
      `POST method not allowed. No form actions exist for ${"this page"}`
    );
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, event_state, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, event_state, actions);
    if (browser) ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        )
      });
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(
          event,
          event_state,
          options2,
          check_incorrect_fail_use(err)
        )
      },
      {
        status: get_status(err)
      }
    );
  }
}
function check_incorrect_fail_use(error2) {
  return error2 instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error2;
}
function action_json_redirect(redirect) {
  return action_json({
    type: "redirect",
    status: redirect.status,
    location: redirect.location
  });
}
function action_json(data, init2) {
  return json(data, init2);
}
function is_action_request(event) {
  return event.request.method === "POST";
}
async function handle_action_request(event, event_state, server2) {
  const actions = server2?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        `POST method not allowed. No form actions exist for ${"this page"}`
      )
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, event_state, actions);
    if (browser) ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://svelte.dev/docs/kit/form-actions#named-actions"
    );
  }
}
async function call_action(event, event_state, actions) {
  const url = new URL(event.request.url);
  let name = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name = param[0].slice(1);
      if (name === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name];
  if (!action) {
    throw new SvelteKitError(404, "Not Found", `No action with name '${name}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new SvelteKitError(
      415,
      "Unsupported Media Type",
      `Form actions expect form-encoded data \u2014 received ${event.request.headers.get(
        "content-type"
      )}`
    );
  }
  return record_span({
    name: "sveltekit.form_action",
    attributes: {
      "http.route": event.route.id || "unknown"
    },
    fn: async (current2) => {
      const traced_event = merge_tracing(event, current2);
      event_state.allows_commands = true;
      const result = await with_request_store(
        { event: traced_event, state: event_state },
        () => action(traced_event)
      );
      if (result instanceof ActionFailure) {
        current2.setAttributes({
          "sveltekit.form_action.result.type": "failure",
          "sveltekit.form_action.result.status": result.status
        });
      }
      return result;
    }
  });
}
function uneval_action_response(data, route_id, transport) {
  const replacer = (thing) => {
    for (const key2 in transport) {
      const encoded = transport[key2].encode(thing);
      if (encoded) {
        return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
      }
    }
  };
  return try_serialize(data, (value) => uneval(value, replacer), route_id);
}
function stringify_action_response(data, route_id, transport) {
  const encoders = Object.fromEntries(
    Object.entries(transport).map(([key2, value]) => [key2, value.encode])
  );
  return try_serialize(data, (value) => stringify(value, encoders), route_id);
}
function try_serialize(data, fn2, route_id) {
  try {
    return fn2(data);
  } catch (e3) {
    const error2 = (
      /** @type {any} */
      e3
    );
    if (data instanceof Response) {
      throw new Error(
        `Data returned from action inside ${route_id} is not serializable. Form actions need to return plain objects or fail(). E.g. return { success: true } or return fail(400, { message: "invalid" });`,
        { cause: e3 }
      );
    }
    if ("path" in error2) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error2.message}`;
      if (error2.path !== "") message += ` (data.${error2.path})`;
      throw new Error(message, { cause: e3 });
    }
    throw error2;
  }
}
function create_async_iterator() {
  let resolved = -1;
  let returned = -1;
  const deferred = [];
  return {
    iterate: (transform = (x2) => x2) => {
      return {
        [Symbol.asyncIterator]() {
          return {
            next: async () => {
              const next = deferred[++returned];
              if (!next) return { value: null, done: true };
              const value = await next.promise;
              return { value: transform(value), done: false };
            }
          };
        }
      };
    },
    add: (promise) => {
      deferred.push(with_resolvers());
      void promise.then((value) => {
        deferred[++resolved].resolve(value);
      });
    }
  };
}
function server_data_serializer(event, event_state, options2) {
  let promise_id = 1;
  let max_nodes = -1;
  const iterator = create_async_iterator();
  const global = get_global_name(options2);
  function get_replacer(index17) {
    return function replacer(thing) {
      if (typeof thing?.then === "function") {
        const id = promise_id++;
        const promise = thing.then(
          /** @param {any} data */
          (data) => ({ data })
        ).catch(
          /** @param {any} error */
          async (error2) => ({
            error: await handle_error_and_jsonify(event, event_state, options2, error2)
          })
        ).then(
          /**
           * @param {{data: any; error: any}} result
           */
          async ({ data, error: error2 }) => {
            let str;
            try {
              str = uneval(error2 ? [, error2] : [data], replacer);
            } catch {
              error2 = await handle_error_and_jsonify(
                event,
                event_state,
                options2,
                new Error(`Failed to serialize promise while rendering ${event.route.id}`)
              );
              str = uneval([, error2], replacer);
            }
            return {
              index: index17,
              str: `${global}.resolve(${id}, ${str.includes("app.decode") ? `(app) => ${str}` : `() => ${str}`})`
            };
          }
        );
        iterator.add(promise);
        return `${global}.defer(${id})`;
      } else {
        for (const key2 in options2.hooks.transport) {
          const encoded = options2.hooks.transport[key2].encode(thing);
          if (encoded) {
            return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
          }
        }
      }
    };
  }
  const strings = (
    /** @type {string[]} */
    []
  );
  return {
    set_max_nodes(i2) {
      max_nodes = i2;
    },
    add_node(i2, node) {
      try {
        if (!node) {
          strings[i2] = "null";
          return;
        }
        const payload = { type: "data", data: node.data, uses: serialize_uses(node) };
        if (node.slash) payload.slash = node.slash;
        strings[i2] = uneval(payload, get_replacer(i2));
      } catch (e3) {
        e3.path = e3.path.slice(1);
        throw new Error(clarify_devalue_error(
          event,
          /** @type {any} */
          e3
        ), { cause: e3 });
      }
    },
    get_data(csp) {
      const open = `<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>`;
      const close = `<\/script>
`;
      return {
        data: `[${compact(max_nodes > -1 ? strings.slice(0, max_nodes) : strings).join(",")}]`,
        chunks: promise_id > 1 ? iterator.iterate(({ index: index17, str }) => {
          if (max_nodes > -1 && index17 >= max_nodes) {
            return "";
          }
          return open + str + close;
        }) : null
      };
    }
  };
}
function server_data_serializer_json(event, event_state, options2) {
  let promise_id = 1;
  const iterator = create_async_iterator();
  const reducers = {
    ...Object.fromEntries(
      Object.entries(options2.hooks.transport).map(([key2, value]) => [key2, value.encode])
    ),
    /** @param {any} thing */
    Promise: (thing) => {
      if (typeof thing?.then !== "function") {
        return;
      }
      const id = promise_id++;
      let key2 = "data";
      const promise = thing.catch(
        /** @param {any} e */
        async (e3) => {
          key2 = "error";
          return handle_error_and_jsonify(
            event,
            event_state,
            options2,
            /** @type {any} */
            e3
          );
        }
      ).then(
        /** @param {any} value */
        async (value) => {
          let str;
          try {
            str = stringify(value, reducers);
          } catch {
            const error2 = await handle_error_and_jsonify(
              event,
              event_state,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            key2 = "error";
            str = stringify(error2, reducers);
          }
          return `{"type":"chunk","id":${id},"${key2}":${str}}
`;
        }
      );
      iterator.add(promise);
      return id;
    }
  };
  const strings = (
    /** @type {string[]} */
    []
  );
  return {
    add_node(i2, node) {
      try {
        if (!node) {
          strings[i2] = "null";
          return;
        }
        if (node.type === "error" || node.type === "skip") {
          strings[i2] = JSON.stringify(node);
          return;
        }
        strings[i2] = `{"type":"data","data":${stringify(node.data, reducers)},"uses":${JSON.stringify(
          serialize_uses(node)
        )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
      } catch (e3) {
        e3.path = "data" + e3.path;
        throw new Error(clarify_devalue_error(
          event,
          /** @type {any} */
          e3
        ), { cause: e3 });
      }
    },
    get_data() {
      return {
        data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
        chunks: promise_id > 1 ? iterator.iterate() : null
      };
    }
  };
}
async function load_server_data({ event, event_state, state, node, parent }) {
  if (!node?.server) return null;
  let is_tracking = true;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false,
    search_params: /* @__PURE__ */ new Set()
  };
  const load = node.server.load;
  const slash = node.server.trailingSlash;
  if (!load) {
    return { type: "data", data: null, uses, slash };
  }
  const url = make_trackable(
    event.url,
    () => {
      if (is_tracking) {
        uses.url = true;
      }
    },
    (param) => {
      if (is_tracking) {
        uses.search_params.add(param);
      }
    }
  );
  if (state.prerendering) {
    disable_search(url);
  }
  const result = await record_span({
    name: "sveltekit.load",
    attributes: {
      "sveltekit.load.node_id": node.server_id || "unknown",
      "sveltekit.load.node_type": get_node_type(node.server_id),
      "http.route": event.route.id || "unknown"
    },
    fn: async (current2) => {
      const traced_event = merge_tracing(event, current2);
      const result2 = await with_request_store(
        { event: traced_event, state: event_state },
        () => load.call(null, {
          ...traced_event,
          fetch: (info, init2) => {
            new URL(info instanceof Request ? info.url : info, event.url);
            return event.fetch(info, init2);
          },
          /** @param {string[]} deps */
          depends: (...deps) => {
            for (const dep of deps) {
              const { href } = new URL(dep, event.url);
              uses.dependencies.add(href);
            }
          },
          params: new Proxy(event.params, {
            get: (target, key2) => {
              if (is_tracking) {
                uses.params.add(key2);
              }
              return target[
                /** @type {string} */
                key2
              ];
            }
          }),
          parent: async () => {
            if (is_tracking) {
              uses.parent = true;
            }
            return parent();
          },
          route: new Proxy(event.route, {
            get: (target, key2) => {
              if (is_tracking) {
                uses.route = true;
              }
              return target[
                /** @type {'id'} */
                key2
              ];
            }
          }),
          url,
          untrack(fn2) {
            is_tracking = false;
            try {
              return fn2();
            } finally {
              is_tracking = true;
            }
          }
        })
      );
      return result2;
    }
  });
  return {
    type: "data",
    data: result ?? null,
    uses,
    slash
  };
}
async function load_data({
  event,
  event_state,
  fetched,
  node,
  parent,
  server_data_promise,
  state,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  const load = node?.universal?.load;
  if (!load) {
    return server_data_node?.data ?? null;
  }
  const result = await record_span({
    name: "sveltekit.load",
    attributes: {
      "sveltekit.load.node_id": node.universal_id || "unknown",
      "sveltekit.load.node_type": get_node_type(node.universal_id),
      "http.route": event.route.id || "unknown"
    },
    fn: async (current2) => {
      const traced_event = merge_tracing(event, current2);
      return await with_request_store(
        { event: traced_event, state: event_state },
        () => load.call(null, {
          url: event.url,
          params: event.params,
          data: server_data_node?.data ?? null,
          route: event.route,
          fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
          setHeaders: event.setHeaders,
          depends: () => {
          },
          parent,
          untrack: (fn2) => fn2(),
          tracing: traced_event.tracing
        })
      );
    }
  });
  return result ?? null;
}
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
  const universal_fetch = async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state.prerendering) {
        dependency = { response, body: null };
        state.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else if (url.protocol === "https:" || url.protocol === "http:") {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    let teed_body;
    const proxy = new Proxy(response, {
      get(response2, key2, receiver) {
        async function push_fetched(body2, is_b64) {
          const status_number = Number(response2.status);
          if (isNaN(status_number)) {
            throw new Error(
              `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
            );
          }
          fetched.push({
            url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
            method: event.request.method,
            request_body: (
              /** @type {string | ArrayBufferView | undefined} */
              input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
            ),
            request_headers: cloned_headers,
            response_body: body2,
            response: response2,
            is_b64
          });
        }
        if (key2 === "body") {
          if (response2.body === null) {
            return null;
          }
          if (teed_body) {
            return teed_body;
          }
          const [a2, b2] = response2.body.tee();
          void (async () => {
            let result = new Uint8Array();
            for await (const chunk of a2) {
              const combined = new Uint8Array(result.length + chunk.length);
              combined.set(result, 0);
              combined.set(chunk, result.length);
              result = combined;
            }
            if (dependency) {
              dependency.body = new Uint8Array(result);
            }
            void push_fetched(base64_encode(result), true);
          })();
          return teed_body = b2;
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            if (dependency) {
              dependency.body = bytes;
            }
            if (buffer instanceof ArrayBuffer) {
              await push_fetched(base64_encode(bytes), true);
            }
            return buffer;
          };
        }
        async function text2() {
          const body2 = await response2.text();
          if (body2 === "" && NULL_BODY_STATUS.includes(response2.status)) {
            await push_fetched(void 0, false);
            return void 0;
          }
          if (!body2 || typeof body2 === "string") {
            await push_fetched(body2, false);
          }
          if (dependency) {
            dependency.body = body2;
          }
          return body2;
        }
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            const body2 = await text2();
            return body2 ? JSON.parse(body2) : void 0;
          };
        }
        const value = Reflect.get(response2, key2, response2);
        if (value instanceof Function) {
          return Object.defineProperties(
            /**
             * @this {any}
             */
            function() {
              return Reflect.apply(value, this === receiver ? response2 : this, arguments);
            },
            {
              name: { value: value.name },
              length: { value: value.length }
            }
          );
        }
        return value;
      }
    });
    if (csr) {
      const get = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" \u2014 it must be included by the \`filterSerializedResponseHeaders\` option: https://svelte.dev/docs/kit/hooks#Server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy;
  };
  return (input, init2) => {
    const response = universal_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += text_decoder2.decode(value);
  }
  return result;
}
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn2) {
    set(fn2(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i2 = value.length;
      while (i2) hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i2 = buffer.length;
      while (i2) hash2 = hash2 * 33 ^ buffer[--i2];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
var replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering = false) {
  const headers2 = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers2[key2] = value;
    }
    if (key2 === "cache-control") cache_control = value;
    else if (key2 === "age") age = value;
    else if (key2 === "vary" && value.trim() === "*") varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers: headers2,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url="${escape_html(fetched.url, true)}"`
  ];
  if (fetched.is_b64) {
    attrs.push("data-b64");
  }
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
var s = JSON.stringify;
function sha256(data) {
  if (!key[0]) precompute();
  const out = init.slice(0);
  const array2 = encode(data);
  for (let i2 = 0; i2 < array2.length; i2 += 16) {
    const w2 = array2.subarray(i2, i2 + 16);
    let tmp;
    let a2;
    let b2;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w2[i22];
      } else {
        a2 = w2[i22 + 1 & 15];
        b2 = w2[i22 + 14 & 15];
        tmp = w2[i22 & 15] = (a2 >>> 7 ^ a2 >>> 18 ^ a2 >>> 3 ^ a2 << 25 ^ a2 << 14) + (b2 >>> 17 ^ b2 >>> 19 ^ b2 >>> 10 ^ b2 << 15 ^ b2 << 13) + w2[i22 & 15] + w2[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return btoa(String.fromCharCode(...bytes));
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x2) {
    return (x2 - Math.floor(x2)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a2 = bytes[i2 + 0];
    const b2 = bytes[i2 + 1];
    const c3 = bytes[i2 + 2];
    const d2 = bytes[i2 + 3];
    bytes[i2 + 0] = d2;
    bytes[i2 + 1] = c3;
    bytes[i2 + 2] = b2;
    bytes[i2 + 3] = a2;
  }
}
function encode(str) {
  const encoded = text_encoder2.encode(str);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var BaseProvider = class {
  /** @type {boolean} */
  #use_hashes;
  /** @type {boolean} */
  #script_needs_csp;
  /** @type {boolean} */
  #script_src_needs_csp;
  /** @type {boolean} */
  #script_src_elem_needs_csp;
  /** @type {boolean} */
  #style_needs_csp;
  /** @type {boolean} */
  #style_src_needs_csp;
  /** @type {boolean} */
  #style_src_attr_needs_csp;
  /** @type {boolean} */
  #style_src_elem_needs_csp;
  /** @type {import('types').CspDirectives} */
  #directives;
  /** @type {Set<import('types').Csp.Source>} */
  #script_src;
  /** @type {Set<import('types').Csp.Source>} */
  #script_src_elem;
  /** @type {Set<import('types').Csp.Source>} */
  #style_src;
  /** @type {Set<import('types').Csp.Source>} */
  #style_src_attr;
  /** @type {Set<import('types').Csp.Source>} */
  #style_src_elem;
  /** @type {boolean} */
  script_needs_nonce;
  /** @type {boolean} */
  style_needs_nonce;
  /** @type {boolean} */
  script_needs_hash;
  /** @type {string} */
  #nonce;
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    this.#use_hashes = use_hashes;
    this.#directives = directives;
    const d2 = this.#directives;
    this.#script_src = /* @__PURE__ */ new Set();
    this.#script_src_elem = /* @__PURE__ */ new Set();
    this.#style_src = /* @__PURE__ */ new Set();
    this.#style_src_attr = /* @__PURE__ */ new Set();
    this.#style_src_elem = /* @__PURE__ */ new Set();
    const effective_script_src = d2["script-src"] || d2["default-src"];
    const script_src_elem = d2["script-src-elem"];
    const effective_style_src = d2["style-src"] || d2["default-src"];
    const style_src_attr = d2["style-src-attr"];
    const style_src_elem = d2["style-src-elem"];
    const style_needs_csp = (directive) => !!directive && !directive.some((value) => value === "unsafe-inline");
    const script_needs_csp = (directive) => !!directive && (!directive.some((value) => value === "unsafe-inline") || directive.some((value) => value === "strict-dynamic"));
    this.#script_src_needs_csp = script_needs_csp(effective_script_src);
    this.#script_src_elem_needs_csp = script_needs_csp(script_src_elem);
    this.#style_src_needs_csp = style_needs_csp(effective_style_src);
    this.#style_src_attr_needs_csp = style_needs_csp(style_src_attr);
    this.#style_src_elem_needs_csp = style_needs_csp(style_src_elem);
    this.#script_needs_csp = this.#script_src_needs_csp || this.#script_src_elem_needs_csp;
    this.#style_needs_csp = this.#style_src_needs_csp || this.#style_src_attr_needs_csp || this.#style_src_elem_needs_csp;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    this.script_needs_hash = this.#script_needs_csp && this.#use_hashes;
    this.#nonce = nonce;
  }
  /** @param {string} content */
  add_script(content) {
    if (!this.#script_needs_csp) return;
    const source = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#script_src_needs_csp) {
      this.#script_src.add(source);
    }
    if (this.#script_src_elem_needs_csp) {
      this.#script_src_elem.add(source);
    }
  }
  /** @param {`sha256-${string}`[]} hashes */
  add_script_hashes(hashes) {
    for (const hash2 of hashes) {
      if (this.#script_src_needs_csp) {
        this.#script_src.add(hash2);
      }
      if (this.#script_src_elem_needs_csp) {
        this.#script_src_elem.add(hash2);
      }
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (!this.#style_needs_csp) return;
    const source = this.#use_hashes ? `sha256-${sha256(content)}` : `nonce-${this.#nonce}`;
    if (this.#style_src_needs_csp) {
      this.#style_src.add(source);
    }
    if (this.#style_src_attr_needs_csp) {
      this.#style_src_attr.add(source);
    }
    if (this.#style_src_elem_needs_csp) {
      const sha256_empty_comment_hash = "sha256-9OlNO0DNEeaVzHL4RZwCLsBHA8WBQ8toBp/4F5XV2nc=";
      const d2 = this.#directives;
      if (d2["style-src-elem"] && !d2["style-src-elem"].includes(sha256_empty_comment_hash) && !this.#style_src_elem.has(sha256_empty_comment_hash)) {
        this.#style_src_elem.add(sha256_empty_comment_hash);
      }
      if (source !== sha256_empty_comment_hash) {
        this.#style_src_elem.add(source);
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...this.#directives };
    if (this.#style_src.size > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#style_src_attr.size > 0) {
      directives["style-src-attr"] = [
        ...directives["style-src-attr"] || [],
        ...this.#style_src_attr
      ];
    }
    if (this.#style_src_elem.size > 0) {
      directives["style-src-elem"] = [
        ...directives["style-src-elem"] || [],
        ...this.#style_src_elem
      ];
    }
    if (this.#script_src.size > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    if (this.#script_src_elem.size > 0) {
      directives["script-src-elem"] = [
        ...directives["script-src-elem"] || [],
        ...this.#script_src_elem
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value) continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
};
var CspProvider = class extends BaseProvider {
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content="${escape_html(content, true)}">`;
  }
};
var CspReportOnlyProvider = class extends BaseProvider {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v2) => !!v2).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
};
var Csp = class {
  /** @readonly */
  nonce = generate_nonce();
  /** @type {CspProvider} */
  csp_provider;
  /** @type {CspReportOnlyProvider} */
  report_only_provider;
  /**
   * @param {import('./types.js').CspConfig} config
   * @param {import('./types.js').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_hash() {
    return this.csp_provider.script_needs_hash || this.report_only_provider.script_needs_hash;
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {`sha256-${string}`[]} hashes */
  add_script_hashes(hashes) {
    this.csp_provider.add_script_hashes(hashes);
    this.report_only_provider.add_script_hashes(hashes);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
};
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  const values_needing_match = values.filter((value) => value !== void 0);
  let buffered = 0;
  for (let i2 = 0; i2 < params.length; i2 += 1) {
    const param = params[i2];
    let value = values[i2 - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i2 - buffered, i2 + 1).filter((s22) => s22).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest) {
        value = "";
      } else {
        continue;
      }
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i2 + 1];
      const next_value = values[i2 + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered) return;
  return result;
}
function find_route(path, routes, matchers) {
  for (const route of routes) {
    const match = route.pattern.exec(path);
    if (!match) continue;
    const matched = exec(match, route.params, matchers);
    if (matched) {
      return {
        route,
        params: decode_params(matched)
      };
    }
  }
  return null;
}
function generate_route_object(route, url, manifest2) {
  const { errors, layouts, leaf } = route;
  const nodes = [...errors, ...layouts.map((l2) => l2?.[1]), leaf[1]].filter((n3) => typeof n3 === "number").map((n3) => `'${n3}': () => ${create_client_import(manifest2._.client.nodes?.[n3], url)}`).join(",\n		");
  return [
    `{
	id: ${s(route.id)}`,
    `errors: ${s(route.errors)}`,
    `layouts: ${s(route.layouts)}`,
    `leaf: ${s(route.leaf)}`,
    `nodes: {
		${nodes}
	}
}`
  ].join(",\n	");
}
function create_client_import(import_path, url) {
  if (!import_path) return "Promise.resolve({})";
  if (import_path[0] === "/") {
    return `import('${import_path}')`;
  }
  if (assets !== "") {
    return `import('${assets}/${import_path}')`;
  }
  let path = get_relative_path(url.pathname, `${base}/${import_path}`);
  if (path[0] !== ".") path = `./${path}`;
  return `import('${path}')`;
}
async function resolve_route(resolved_path, url, manifest2) {
  if (!manifest2._.client.routes) {
    return text("Server-side route resolution disabled", { status: 400 });
  }
  const matchers = await manifest2._.matchers();
  const result = find_route(resolved_path, manifest2._.client.routes, matchers);
  return create_server_routing_response(result?.route ?? null, result?.params ?? {}, url, manifest2).response;
}
function create_server_routing_response(route, params, url, manifest2) {
  const headers2 = new Headers({
    "content-type": "application/javascript; charset=utf-8"
  });
  if (route) {
    const csr_route = generate_route_object(route, url, manifest2);
    const body2 = `${create_css_import(route, url, manifest2)}
export const route = ${csr_route}; export const params = ${JSON.stringify(params)};`;
    return { response: text(body2, { headers: headers2 }), body: body2 };
  } else {
    return { response: text("", { headers: headers2 }), body: "" };
  }
}
function create_css_import(route, url, manifest2) {
  const { errors, layouts, leaf } = route;
  let css = "";
  for (const node of [...errors, ...layouts.map((l2) => l2?.[1]), leaf[1]]) {
    if (typeof node !== "number") continue;
    const node_css = manifest2._.client.css?.[node];
    for (const css_path of node_css ?? []) {
      css += `'${assets || base}/${css_path}',`;
    }
  }
  if (!css) return "";
  return `${create_client_import(
    /** @type {string} */
    manifest2._.client.start,
    url
  )}.then(x => x.load_css([${css}]));`;
}
var updated = {
  ...readable(false),
  check: () => false
};
async function render_response({
  branch,
  fetched,
  options: options2,
  manifest: manifest2,
  state,
  page_config,
  status,
  error: error2 = null,
  event,
  event_state,
  resolve_opts,
  action_result,
  data_serializer,
  error_components
}) {
  if (state.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest2._;
  const modulepreloads = new Set(client.imports);
  const stylesheets17 = new Set(client.stylesheets);
  const fonts17 = new Set(client.fonts);
  const link_headers = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s(base);
  const csp = new Csp(options2.csp, {
    prerender: !!state.prerendering
  });
  {
    if (!state.prerendering?.fallback) {
      const segments = event.url.pathname.slice(base.length).split("/").slice(2);
      base$1 = segments.map(() => "..").join("/") || ".";
      base_expression = `new URL(${s(base$1)}, location).pathname.slice(0, -1)`;
      if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
        assets$1 = base$1;
      }
    } else if (options2.hash_routing) {
      base_expression = "new URL('.', location).pathname.slice(0, -1)";
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(
        branch.map(({ node }) => {
          if (!node.component) {
            throw new Error(`Missing +page.svelte component for route ${event.route.id}`);
          }
          return node.component();
        })
      ),
      form: form_value
    };
    if (error_components) {
      if (error2) {
        props.error = error2;
      }
      props.errors = error_components;
    }
    let data2 = {};
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      data2 = { ...data2, ...branch[i2].data };
      props[`data_${i2}`] = data2;
    }
    props.page = {
      error: error2,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value,
      state: {}
    };
    const render_opts = {
      context: /* @__PURE__ */ new Map([
        [
          "__request__",
          {
            page: props.page
          }
        ]
      ]),
      csp: csp.script_needs_nonce ? { nonce: csp.nonce } : { hash: csp.script_needs_hash },
      transformError: error_components ? (
        /** @param {unknown} e */
        async (e3) => {
          const transformed2 = await handle_error_and_jsonify(event, event_state, options2, e3);
          props.page.error = props.error = error2 = transformed2;
          props.page.status = status = get_status(e3);
          return transformed2;
        }
      ) : void 0
    };
    const fetch2 = globalThis.fetch;
    try {
      if (browser) ;
      event_state.allows_commands = false;
      rendered = await with_request_store({ event, state: event_state }, async () => {
        if (relative) override({ base: base$1, assets: assets$1 });
        const maybe_promise = options2.root.render(props, render_opts);
        const rendered2 = options2.async && "then" in maybe_promise ? (
          /** @type {ReturnType<typeof options.root.render> & Promise<any>} */
          maybe_promise.then((r3) => r3)
        ) : maybe_promise;
        if (options2.async) {
          reset();
        }
        const { head: head2, html: html2, css, hashes } = (
          /** @type {ReturnType<typeof options.root.render>} */
          options2.async ? await rendered2 : rendered2
        );
        if (hashes) {
          csp.add_script_hashes(hashes.script);
        }
        return { head: head2, html: html2, css, hashes };
      });
    } finally {
      reset();
    }
    for (const { node } of branch) {
      for (const url of node.imports) modulepreloads.add(url);
      for (const url of node.stylesheets) stylesheets17.add(url);
      for (const url of node.fonts) fonts17.add(url);
      if (node.inline_styles && !client.inline) {
        Object.entries(await node.inline_styles()).forEach(([filename, css]) => {
          if (typeof css === "string") {
            inline_styles.set(filename, css);
            return;
          }
          inline_styles.set(filename, css(`${assets$1}/${app_dir}/immutable/assets`, assets$1));
        });
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null }, hashes: { script: [] } };
  }
  const head = new Head(rendered.head, !!state.prerendering);
  let body2 = rendered.html;
  const prefixed = (path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  };
  const style = client.inline ? client.inline?.style : Array.from(inline_styles.values()).join("\n");
  if (style) {
    const attributes = [];
    if (csp.style_needs_nonce) attributes.push(`nonce="${csp.nonce}"`);
    csp.add_style(style);
    head.add_style(style, attributes);
  }
  for (const dep of stylesheets17) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        link_headers.add(`<${encodeURI(path)}>; rel="preload"; as="style"; nopush`);
      }
    }
    head.add_stylesheet(path, attributes);
  }
  for (const dep of fonts17) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      head.add_link_tag(path, ['rel="preload"', 'as="font"', `type="font/${ext}"`, "crossorigin"]);
      link_headers.add(
        `<${encodeURI(path)}>; rel="preload"; as="font"; type="font/${ext}"; crossorigin; nopush`
      );
    }
  }
  const global = get_global_name(options2);
  const { data, chunks } = data_serializer.get_data(csp);
  if (page_config.ssr && page_config.csr) {
    body2 += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    const route = manifest2._.client.routes?.find((r3) => r3.id === event.route.id) ?? null;
    if (client.uses_env_dynamic_public && state.prerendering) {
      modulepreloads.add(`${app_dir}/env.js`);
    }
    if (!client.inline) {
      const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
        (path) => resolve_opts.preload({ type: "js", path })
      );
      for (const path of included_modulepreloads) {
        link_headers.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
        if (options2.preload_strategy !== "modulepreload") {
          head.add_script_preload(path);
        } else {
          head.add_link_tag(path, ['rel="modulepreload"']);
        }
      }
    }
    if (manifest2._.client.routes && state.prerendering && !state.prerendering.fallback) {
      const pathname = add_resolution_suffix2(event.url.pathname);
      state.prerendering.dependencies.set(
        pathname,
        create_server_routing_response(route, event.params, new URL(pathname, event.url), manifest2)
      );
    }
    const blocks = [];
    const load_env_eagerly = client.uses_env_dynamic_public && state.prerendering;
    const properties = [`base: ${base_expression}`];
    if (assets) {
      properties.push(`assets: ${s(assets)}`);
    }
    if (client.uses_env_dynamic_public) {
      properties.push(`env: ${load_env_eagerly ? "null" : s(public_env)}`);
    }
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      let app_declaration = "";
      if (Object.keys(options2.hooks.transport).length > 0) {
        if (client.inline) {
          app_declaration = `const app = __sveltekit_${options2.version_hash}.app.app;`;
        } else if (client.app) {
          app_declaration = `const app = await import(${s(prefixed(client.app))});`;
        } else {
          app_declaration = `const { app } = await import(${s(prefixed(client.start))});`;
        }
      }
      const prelude = app_declaration ? `${app_declaration}
							const [data, error] = fn(app);` : `const [data, error] = fn();`;
      properties.push(`resolve: async (id, fn) => {
							${prelude}

							const try_to_resolve = () => {
								if (!deferred.has(id)) {
									setTimeout(try_to_resolve, 0);
									return;
								}
								const { fulfil, reject } = deferred.get(id);
								deferred.delete(id);
								if (error) reject(error);
								else fulfil(data);
							}
							try_to_resolve();
						}`);
    }
    blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
    const args = ["element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id,
          options2.hooks.transport
        );
      }
      if (error2) {
        serialized.error = uneval(error2);
      }
      const hydrate = [
        `node_ids: [${branch.map(({ node }) => node.index).join(", ")}]`,
        `data: ${data}`,
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate.push(`status: ${status}`);
      }
      if (manifest2._.client.routes) {
        if (route) {
          const stringified = generate_route_object(route, event.url, manifest2).replaceAll(
            "\n",
            "\n							"
          );
          hydrate.push(`params: ${uneval(event.params)}`, `server_route: ${stringified}`);
        }
      } else if (options2.embedded) {
        hydrate.push(`params: ${uneval(event.params)}`, `route: ${s(event.route)}`);
      }
      const indent = "	".repeat(load_env_eagerly ? 7 : 6);
      args.push(`{
${indent}	${hydrate.join(`,
${indent}	`)}
${indent}}`);
    }
    const { remote_data: remote_cache } = event_state;
    let serialized_remote_data = "";
    if (remote_cache) {
      const remote = {};
      for (const [info, cache] of remote_cache) {
        if (!info.id) continue;
        for (const key2 in cache) {
          const remote_key = create_remote_key(info.id, key2);
          if (event_state.refreshes?.[remote_key] !== void 0) {
            remote[remote_key] = await cache[key2];
          } else {
            const result = await Promise.race([
              Promise.resolve(cache[key2]).then(
                (v2) => (
                  /** @type {const} */
                  { settled: true, value: v2 }
                ),
                (e3) => (
                  /** @type {const} */
                  { settled: true, error: e3 }
                )
              ),
              new Promise((resolve2) => {
                queueMicrotask(() => resolve2(
                  /** @type {const} */
                  { settled: false }
                ));
              })
            ]);
            if (result.settled) {
              if ("error" in result) throw result.error;
              remote[remote_key] = result.value;
            }
          }
        }
      }
      const replacer = (thing) => {
        for (const key2 in options2.hooks.transport) {
          const encoded = options2.hooks.transport[key2].encode(thing);
          if (encoded) {
            return `app.decode('${key2}', ${uneval(encoded, replacer)})`;
          }
        }
      };
      serialized_remote_data = `${global}.data = ${uneval(remote, replacer)};

						`;
    }
    const boot = client.inline ? `${client.inline.script}

					${serialized_remote_data}${global}.app.start(${args.join(", ")});` : client.app ? `Promise.all([
						import(${s(prefixed(client.start))}),
						import(${s(prefixed(client.app))})
					]).then(([kit, app]) => {
						${serialized_remote_data}kit.start(app, ${args.join(", ")});
					});` : `import(${s(prefixed(client.start))}).then((app) => {
						${serialized_remote_data}app.start(${args.join(", ")})
					});`;
    if (load_env_eagerly) {
      blocks.push(`import(${s(`${base$1}/${app_dir}/env.js`)}).then(({ env }) => {
						${global}.env = env;

						${boot.replace(/\n/g, "\n	")}
					});`);
    } else {
      blocks.push(boot);
    }
    if (options2.service_worker) {
      let opts = "";
      if (options2.service_worker_options != null) {
        const service_worker_options = { ...options2.service_worker_options };
        opts = `, ${s(service_worker_options)}`;
      }
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body2 += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers2 = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state.prerendering) {
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      head.add_http_equiv(csp_headers);
    }
    if (state.prerendering.cache) {
      head.add_http_equiv(
        `<meta http-equiv="cache-control" content="${state.prerendering.cache}">`
      );
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers2.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers2.set("content-security-policy-report-only", report_only_header);
    }
    if (link_headers.size) {
      headers2.set("link", Array.from(link_headers).join(", "));
    }
  }
  const html = options2.templates.app({
    head: head.build(),
    body: body2,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers2.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers: headers2
  }) : new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(text_encoder2.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          if (chunk.length) controller.enqueue(text_encoder2.encode(chunk));
        }
        controller.close();
      },
      type: "bytes"
    }),
    {
      headers: headers2
    }
  );
}
var Head = class {
  #rendered;
  #prerendering;
  /** @type {string[]} */
  #http_equiv = [];
  /** @type {string[]} */
  #link_tags = [];
  /** @type {string[]} */
  #script_preloads = [];
  /** @type {string[]} */
  #style_tags = [];
  /** @type {string[]} */
  #stylesheet_links = [];
  /**
   * @param {string} rendered
   * @param {boolean} prerendering
   */
  constructor(rendered, prerendering) {
    this.#rendered = rendered;
    this.#prerendering = prerendering;
  }
  build() {
    return [
      ...this.#http_equiv,
      ...this.#link_tags,
      ...this.#script_preloads,
      this.#rendered,
      ...this.#style_tags,
      ...this.#stylesheet_links
    ].join("\n		");
  }
  /**
   * @param {string} style
   * @param {string[]} attributes
   */
  add_style(style, attributes) {
    this.#style_tags.push(
      `<style${attributes.length ? " " + attributes.join(" ") : ""}>${style}</style>`
    );
  }
  /**
   * @param {string} href
   * @param {string[]} attributes
   */
  add_stylesheet(href, attributes) {
    this.#stylesheet_links.push(`<link href="${href}" ${attributes.join(" ")}>`);
  }
  /** @param {string} href */
  add_script_preload(href) {
    this.#script_preloads.push(
      `<link rel="preload" as="script" crossorigin="anonymous" href="${href}">`
    );
  }
  /**
   * @param {string} href
   * @param {string[]} attributes
   */
  add_link_tag(href, attributes) {
    if (!this.#prerendering) return;
    this.#link_tags.push(`<link href="${href}" ${attributes.join(" ")}>`);
  }
  /** @param {string} tag */
  add_http_equiv(tag) {
    if (!this.#prerendering) return;
    this.#http_equiv.push(tag);
  }
};
var PageNodes = class {
  data;
  /**
   * @param {Array<import('types').SSRNode | undefined>} nodes
   */
  constructor(nodes) {
    this.data = nodes;
  }
  layouts() {
    return this.data.slice(0, -1);
  }
  page() {
    return this.data.at(-1);
  }
  validate() {
    for (const layout of this.layouts()) {
      if (layout) {
        validate_layout_server_exports(
          layout.server,
          /** @type {string} */
          layout.server_id
        );
        validate_layout_exports(
          layout.universal,
          /** @type {string} */
          layout.universal_id
        );
      }
    }
    const page2 = this.page();
    if (page2) {
      validate_page_server_exports(
        page2.server,
        /** @type {string} */
        page2.server_id
      );
      validate_page_exports(
        page2.universal,
        /** @type {string} */
        page2.universal_id
      );
    }
  }
  /**
   * @template {'prerender' | 'ssr' | 'csr' | 'trailingSlash'} Option
   * @param {Option} option
   * @returns {Value | undefined}
   */
  #get_option(option) {
    return this.data.reduce(
      (value, node) => {
        return node?.universal?.[option] ?? node?.server?.[option] ?? value;
      },
      /** @type {Value | undefined} */
      void 0
    );
  }
  csr() {
    return this.#get_option("csr") ?? true;
  }
  ssr() {
    return this.#get_option("ssr") ?? true;
  }
  prerender() {
    return this.#get_option("prerender") ?? false;
  }
  trailing_slash() {
    return this.#get_option("trailingSlash") ?? "never";
  }
  get_config() {
    let current2 = {};
    for (const node of this.data) {
      if (!node?.universal?.config && !node?.server?.config) continue;
      current2 = {
        ...current2,
        // TODO: should we override the server config value with the universal value similar to other page options?
        ...node?.universal?.config,
        ...node?.server?.config
      };
    }
    return Object.keys(current2).length ? current2 : void 0;
  }
  should_prerender_data() {
    return this.data.some(
      // prerender in case of trailingSlash because the client retrieves that value from the server
      (node) => node?.server?.load || node?.server?.trailingSlash !== void 0
    );
  }
};
async function respond_with_error({
  event,
  event_state,
  options: options2,
  manifest: manifest2,
  state,
  status,
  error: error2,
  resolve_opts
}) {
  if (event.request.headers.get("x-sveltekit-error")) {
    return static_error_page(
      options2,
      status,
      /** @type {Error} */
      error2.message
    );
  }
  const fetched = [];
  try {
    const branch = [];
    const default_layout = await manifest2._.nodes[0]();
    const nodes = new PageNodes([default_layout]);
    const ssr = nodes.ssr();
    const csr = nodes.csr();
    const data_serializer = server_data_serializer(event, event_state, options2);
    if (ssr) {
      state.error = true;
      const server_data_promise = load_server_data({
        event,
        event_state,
        state,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({})
      });
      const server_data = await server_data_promise;
      data_serializer.add_node(0, server_data);
      const data = await load_data({
        event,
        event_state,
        fetched,
        node: default_layout,
        // eslint-disable-next-line @typescript-eslint/require-await
        parent: async () => ({}),
        resolve_opts,
        server_data_promise,
        state,
        csr
      });
      branch.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest2._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest: manifest2,
      state,
      page_config: {
        ssr,
        csr
      },
      status,
      error: await handle_error_and_jsonify(event, event_state, options2, error2),
      branch,
      error_components: [],
      fetched,
      event,
      event_state,
      resolve_opts,
      data_serializer
    });
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return redirect_response(e3.status, e3.location);
    }
    return static_error_page(
      options2,
      get_status(e3),
      (await handle_error_and_jsonify(event, event_state, options2, e3)).message
    );
  }
}
async function handle_remote_call(event, state, options2, manifest2, id) {
  return record_span({
    name: "sveltekit.remote.call",
    attributes: {},
    fn: (current2) => {
      const traced_event = merge_tracing(event, current2);
      return with_request_store(
        { event: traced_event, state },
        () => handle_remote_call_internal(traced_event, state, options2, manifest2, id)
      );
    }
  });
}
async function handle_remote_call_internal(event, state, options2, manifest2, id) {
  const [hash2, name, additional_args] = id.split("/");
  const remotes = manifest2._.remotes;
  if (!remotes[hash2]) error(404);
  const module = await remotes[hash2]();
  const fn2 = module.default[name];
  if (!fn2) error(404);
  const info = fn2.__;
  const transport = options2.hooks.transport;
  event.tracing.current.setAttributes({
    "sveltekit.remote.call.type": info.type,
    "sveltekit.remote.call.name": info.name
  });
  let form_client_refreshes;
  try {
    if (info.type === "query_batch") {
      if (event.request.method !== "POST") {
        throw new SvelteKitError(
          405,
          "Method Not Allowed",
          `\`query.batch\` functions must be invoked via POST request, not ${event.request.method}`
        );
      }
      const { payloads } = await event.request.json();
      const args = await Promise.all(
        payloads.map((payload2) => parse_remote_arg(payload2, transport))
      );
      const results = await with_request_store({ event, state }, () => info.run(args, options2));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(results, transport)
        }
      );
    }
    if (info.type === "form") {
      if (event.request.method !== "POST") {
        throw new SvelteKitError(
          405,
          "Method Not Allowed",
          `\`form\` functions must be invoked via POST request, not ${event.request.method}`
        );
      }
      if (!is_form_content_type(event.request)) {
        throw new SvelteKitError(
          415,
          "Unsupported Media Type",
          `\`form\` functions expect form-encoded data \u2014 received ${event.request.headers.get(
            "content-type"
          )}`
        );
      }
      const { data: data2, meta, form_data } = await deserialize_binary_form(event.request);
      form_client_refreshes = meta.remote_refreshes;
      if (additional_args && !("id" in data2)) {
        data2.id = JSON.parse(decodeURIComponent(additional_args));
      }
      const fn22 = info.fn;
      const result = await with_request_store({ event, state }, () => fn22(data2, meta, form_data));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(result, transport),
          refreshes: result.issues ? void 0 : await serialize_refreshes(meta.remote_refreshes)
        }
      );
    }
    if (info.type === "command") {
      const { payload: payload2, refreshes } = await event.request.json();
      const arg = parse_remote_arg(payload2, transport);
      const data2 = await with_request_store({ event, state }, () => fn2(arg));
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "result",
          result: stringify2(data2, transport),
          refreshes: await serialize_refreshes(refreshes)
        }
      );
    }
    const payload = info.type === "prerender" ? additional_args : (
      /** @type {string} */
      // new URL(...) necessary because we're hiding the URL from the user in the event object
      new URL(event.request.url).searchParams.get("payload")
    );
    const data = await with_request_store(
      { event, state },
      () => fn2(parse_remote_arg(payload, transport))
    );
    return json(
      /** @type {RemoteFunctionResponse} */
      {
        type: "result",
        result: stringify2(data, transport)
      }
    );
  } catch (error2) {
    if (error2 instanceof Redirect) {
      return json(
        /** @type {RemoteFunctionResponse} */
        {
          type: "redirect",
          location: error2.location,
          refreshes: await serialize_refreshes(form_client_refreshes)
        }
      );
    }
    const status = error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : 500;
    return json(
      /** @type {RemoteFunctionResponse} */
      {
        type: "error",
        error: await handle_error_and_jsonify(event, state, options2, error2),
        status
      },
      {
        // By setting a non-200 during prerendering we fail the prerender process (unless handleHttpError handles it).
        // Errors at runtime will be passed to the client and are handled there
        status: state.prerendering ? status : void 0,
        headers: {
          "cache-control": "private, no-store"
        }
      }
    );
  }
  async function serialize_refreshes(client_refreshes) {
    const refreshes = state.refreshes ?? {};
    if (client_refreshes) {
      for (const key2 of client_refreshes) {
        if (refreshes[key2] !== void 0) continue;
        const [hash3, name2, payload] = key2.split("/");
        const loader = manifest2._.remotes[hash3];
        const fn22 = (await loader?.())?.default?.[name2];
        if (!fn22) error(400, "Bad Request");
        refreshes[key2] = with_request_store(
          { event, state },
          () => fn22(parse_remote_arg(payload, transport))
        );
      }
    }
    if (Object.keys(refreshes).length === 0) {
      return void 0;
    }
    return stringify2(
      Object.fromEntries(
        await Promise.all(
          Object.entries(refreshes).map(async ([key2, promise]) => [key2, await promise])
        )
      ),
      transport
    );
  }
}
async function handle_remote_form_post(event, state, manifest2, id) {
  return record_span({
    name: "sveltekit.remote.form.post",
    attributes: {},
    fn: (current2) => {
      const traced_event = merge_tracing(event, current2);
      return with_request_store(
        { event: traced_event, state },
        () => handle_remote_form_post_internal(traced_event, state, manifest2, id)
      );
    }
  });
}
async function handle_remote_form_post_internal(event, state, manifest2, id) {
  const [hash2, name, action_id] = id.split("/");
  const remotes = manifest2._.remotes;
  const module = await remotes[hash2]?.();
  let form = (
    /** @type {RemoteForm<any, any>} */
    module?.default[name]
  );
  if (!form) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: new SvelteKitError(
        405,
        "Method Not Allowed",
        `POST method not allowed. No form actions exist for ${"this page"}`
      )
    };
  }
  if (action_id) {
    form = with_request_store({ event, state }, () => form.for(JSON.parse(action_id)));
  }
  try {
    const fn2 = (
      /** @type {RemoteInfo & { type: 'form' }} */
      /** @type {any} */
      form.__.fn
    );
    const { data, meta, form_data } = await deserialize_binary_form(event.request);
    if (action_id && !("id" in data)) {
      data.id = JSON.parse(decodeURIComponent(action_id));
    }
    await with_request_store({ event, state }, () => fn2(data, meta, form_data));
    return {
      type: "success",
      status: 200
    };
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function get_remote_id(url) {
  return url.pathname.startsWith(`${base}/${app_dir}/remote/`) && url.pathname.replace(`${base}/${app_dir}/remote/`, "");
}
function get_remote_action(url) {
  return url.searchParams.get("/remote");
}
var MAX_DEPTH = 10;
async function render_page(event, event_state, page2, options2, manifest2, state, nodes, resolve_opts) {
  if (state.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest2._.nodes[page2.leaf]();
    return handle_action_json_request(event, event_state, options2, node?.server);
  }
  try {
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.page()
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      const remote_id = get_remote_action(event.url);
      if (remote_id) {
        action_result = await handle_remote_form_post(event, event_state, manifest2, remote_id);
      } else {
        action_result = await handle_action_request(event, event_state, leaf_node.server);
      }
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        status = get_status(action_result.error);
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender = nodes.prerender();
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state.prerender_default = should_prerender;
    const should_prerender_data = nodes.should_prerender_data();
    const data_pathname = add_data_suffix2(event.url.pathname);
    const fetched = [];
    const ssr = nodes.ssr();
    const csr = nodes.csr();
    if (ssr === false && !(state.prerendering && should_prerender_data)) {
      if (browser && action_result && !event.request.headers.has("x-sveltekit-action")) ;
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr
        },
        status,
        error: null,
        event,
        event_state,
        options: options2,
        manifest: manifest2,
        state,
        resolve_opts,
        data_serializer: server_data_serializer(event, event_state, options2)
      });
    }
    const branch = [];
    let load_error = null;
    const data_serializer = server_data_serializer(event, event_state, options2);
    const data_serializer_json = state.prerendering && should_prerender_data ? server_data_serializer_json(event, event_state, options2) : null;
    const server_promises = nodes.data.map((node, i2) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          const server_data = await load_server_data({
            event,
            event_state,
            state,
            node,
            parent: async () => {
              const data = {};
              for (let j2 = 0; j2 < i2; j2 += 1) {
                const parent = await server_promises[j2];
                if (parent) Object.assign(data, parent.data);
              }
              return data;
            }
          });
          if (node) {
            data_serializer.add_node(i2, server_data);
          }
          data_serializer_json?.add_node(i2, server_data);
          return server_data;
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    const load_promises = nodes.data.map((node, i2) => {
      if (load_error) throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            event_state,
            fetched,
            node,
            parent: async () => {
              const data = {};
              for (let j2 = 0; j2 < i2; j2 += 1) {
                Object.assign(data, await load_promises[j2]);
              }
              return data;
            },
            resolve_opts,
            server_data_promise: server_promises[i2],
            state,
            csr
          });
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    for (const p2 of server_promises) p2.catch(() => {
    });
    for (const p2 of load_promises) p2.catch(() => {
    });
    for (let i2 = 0; i2 < nodes.data.length; i2 += 1) {
      const node = nodes.data[i2];
      if (node) {
        try {
          const server_data = await server_promises[i2];
          const data = await load_promises[i2];
          branch.push({ node, server_data, data });
        } catch (e3) {
          const err = normalize_error(e3);
          if (err instanceof Redirect) {
            if (state.prerendering && should_prerender_data) {
              const body2 = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state.prerendering.dependencies.set(data_pathname, {
                response: text(body2),
                body: body2
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = get_status(err);
          const error2 = await handle_error_and_jsonify(event, event_state, options2, err);
          while (i2--) {
            if (page2.errors[i2]) {
              const index17 = (
                /** @type {number} */
                page2.errors[i2]
              );
              const node2 = await manifest2._.nodes[index17]();
              let j2 = i2;
              while (!branch[j2]) j2 -= 1;
              data_serializer.set_max_nodes(j2 + 1);
              const layouts = compact(branch.slice(0, j2 + 1));
              const nodes2 = new PageNodes(layouts.map((layout) => layout.node));
              const error_branch = layouts.concat({
                node: node2,
                data: null,
                server_data: null
              });
              return await render_response({
                event,
                event_state,
                options: options2,
                manifest: manifest2,
                state,
                resolve_opts,
                page_config: {
                  ssr: nodes2.ssr(),
                  csr: nodes2.csr()
                },
                status: status2,
                error: error2,
                error_components: await load_error_components(
                  options2,
                  ssr,
                  error_branch,
                  page2,
                  manifest2
                ),
                branch: error_branch,
                fetched,
                data_serializer
              });
            }
          }
          return static_error_page(options2, status2, error2.message);
        }
      } else {
        branch.push(null);
      }
    }
    if (state.prerendering && data_serializer_json) {
      let { data, chunks } = data_serializer_json.get_data();
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    return await render_response({
      event,
      event_state,
      options: options2,
      manifest: manifest2,
      state,
      resolve_opts,
      page_config: {
        csr,
        ssr
      },
      status,
      error: null,
      branch: !ssr ? [] : compact(branch),
      action_result,
      fetched,
      data_serializer: !ssr ? server_data_serializer(event, event_state, options2) : data_serializer,
      error_components: await load_error_components(options2, ssr, branch, page2, manifest2)
    });
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return redirect_response(e3.status, e3.location);
    }
    return await respond_with_error({
      event,
      event_state,
      options: options2,
      manifest: manifest2,
      state,
      status: e3 instanceof HttpError ? e3.status : 500,
      error: e3,
      resolve_opts
    });
  }
}
async function load_error_components(options2, ssr, branch, page2, manifest2) {
  let error_components;
  if (options2.server_error_boundaries && ssr) {
    let last_idx = -1;
    error_components = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/await-thenable
      branch.map((b2, i2) => {
        if (i2 === 0) return void 0;
        if (!b2) return null;
        i2--;
        while (i2 > last_idx + 1 && page2.errors[i2] === void 0) i2 -= 1;
        last_idx = i2;
        const idx = page2.errors[i2];
        if (idx == null) return void 0;
        return manifest2._.nodes[idx]?.().then((e3) => e3.component?.()).catch(() => void 0);
      }).filter((e3) => e3 !== null)
    );
  }
  return error_components;
}
function once(fn2) {
  let done = false;
  let result;
  return () => {
    if (done) return result;
    done = true;
    return result = fn2();
  };
}
async function render_data(event, event_state, route, options2, manifest2, state, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n3, i2) => {
      return once(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n3 == void 0 ? n3 : await manifest2._.nodes[n3]();
          return load_server_data({
            event: new_event,
            event_state,
            state,
            node,
            parent: async () => {
              const data2 = {};
              for (let j2 = 0; j2 < i2; j2 += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j2]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            }
          });
        } catch (e3) {
          aborted = true;
          throw e3;
        }
      });
    });
    const promises = functions.map(async (fn2, i2) => {
      if (!invalidated[i2]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn2();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p2, i2) => p2.catch(async (error2) => {
          if (error2 instanceof Redirect) {
            throw error2;
          }
          length = Math.min(length, i2 + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, event_state, options2, error2),
              status: error2 instanceof HttpError || error2 instanceof SvelteKitError ? error2.status : void 0
            }
          );
        })
      )
    );
    const data_serializer = server_data_serializer_json(event, event_state, options2);
    for (let i2 = 0; i2 < nodes.length; i2++) data_serializer.add_node(i2, nodes[i2]);
    const { data, chunks } = data_serializer.get_data();
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(text_encoder2.encode(data));
          for await (const chunk of chunks) {
            controller.enqueue(text_encoder2.encode(chunk));
          }
          controller.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e3) {
    const error2 = normalize_error(e3);
    if (error2 instanceof Redirect) {
      return redirect_json_response(error2);
    } else {
      return json_response(await handle_error_and_jsonify(event, event_state, options2, error2), 500);
    }
  }
}
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
function redirect_json_response(redirect) {
  return json_response(
    /** @type {import('types').ServerRedirectNode} */
    {
      type: "redirect",
      location: redirect.location
    }
  );
}
var INVALID_COOKIE_CHARACTER_REGEX = /[\x00-\x1F\x7F()<>@,;:"/[\]?={} \t]/;
function validate_options(options2) {
  if (options2?.path === void 0) {
    throw new Error("You must specify a `path` when setting, deleting or serializing cookies");
  }
}
function generate_cookie_key(domain, path, name) {
  return `${domain || ""}${path}?${encodeURIComponent(name)}`;
}
function get_cookies(request, url) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = (0, import_cookie.parse)(header, { decode: (value) => value });
  let normalized_url;
  const new_cookies = /* @__PURE__ */ new Map();
  const defaults = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} [opts]
     */
    get(name, opts) {
      const best_match = Array.from(new_cookies.values()).filter((c3) => {
        return c3.name === name && domain_matches(url.hostname, c3.options.domain) && path_matches(url.pathname, c3.options.path);
      }).sort((a2, b2) => b2.options.path.length - a2.options.path.length)[0];
      if (best_match) {
        return best_match.options.maxAge === 0 ? void 0 : best_match.value;
      }
      const req_cookies = (0, import_cookie.parse)(header, { decode: opts?.decode });
      const cookie = req_cookies[name];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} [opts]
     */
    getAll(opts) {
      const cookies2 = (0, import_cookie.parse)(header, { decode: opts?.decode });
      const lookup = /* @__PURE__ */ new Map();
      for (const c3 of new_cookies.values()) {
        if (domain_matches(url.hostname, c3.options.domain) && path_matches(url.pathname, c3.options.path)) {
          const existing = lookup.get(c3.name);
          if (!existing || c3.options.path.length > existing.options.path.length) {
            lookup.set(c3.name, c3);
          }
        }
      }
      for (const c3 of lookup.values()) {
        cookies2[c3.name] = c3.value;
      }
      return Object.entries(cookies2).map(([name, value]) => ({ name, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('./page/types.js').Cookie['options']} options
     */
    set(name, value, options2) {
      const illegal_characters = name.match(INVALID_COOKIE_CHARACTER_REGEX);
      if (illegal_characters) {
        console.warn(
          `The cookie name "${name}" will be invalid in SvelteKit 3.0 as it contains ${illegal_characters.join(
            " and "
          )}. See RFC 2616 for more details https://datatracker.ietf.org/doc/html/rfc2616#section-2.2`
        );
      }
      validate_options(options2);
      set_internal(name, value, { ...defaults, ...options2 });
    },
    /**
     * @param {string} name
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    delete(name, options2) {
      validate_options(options2);
      cookies.set(name, "", { ...options2, maxAge: 0 });
    },
    /**
     * @param {string} name
     * @param {string} value
     *  @param {import('./page/types.js').Cookie['options']} options
     */
    serialize(name, value, options2) {
      validate_options(options2);
      let path = options2.path;
      if (!options2.domain || options2.domain === url.hostname) {
        if (!normalized_url) {
          throw new Error("Cannot serialize cookies until after the route is determined");
        }
        path = resolve(normalized_url, path);
      }
      return (0, import_cookie.serialize)(name, value, { ...defaults, ...options2, path });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const cookie of new_cookies.values()) {
      if (!domain_matches(destination.hostname, cookie.options.domain)) continue;
      if (!path_matches(destination.pathname, cookie.options.path)) continue;
      const encoder = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder(cookie.value);
    }
    if (header2) {
      const parsed = (0, import_cookie.parse)(header2, { decode: (value) => value });
      for (const name in parsed) {
        combined_cookies[name] = parsed[name];
      }
    }
    return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
  }
  const internal_queue = [];
  function set_internal(name, value, options2) {
    if (!normalized_url) {
      internal_queue.push(() => set_internal(name, value, options2));
      return;
    }
    let path = options2.path;
    if (!options2.domain || options2.domain === url.hostname) {
      path = resolve(normalized_url, path);
    }
    const cookie_key = generate_cookie_key(options2.domain, path, name);
    const cookie = { name, value, options: { ...options2, path } };
    new_cookies.set(cookie_key, cookie);
  }
  function set_trailing_slash(trailing_slash) {
    normalized_url = normalize_path(url.pathname, trailing_slash);
    internal_queue.forEach((fn2) => fn2());
  }
  return { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash };
}
function domain_matches(hostname, constraint) {
  if (!constraint) return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized) return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint) return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized) return true;
  return path.startsWith(normalized + "/");
}
function add_cookies_to_headers(headers2, cookies) {
  for (const new_cookie of cookies) {
    const { name, value, options: options2 } = new_cookie;
    headers2.append("set-cookie", (0, import_cookie.serialize)(name, value, options2));
    if (options2.path.endsWith(".html")) {
      const path = add_data_suffix2(options2.path);
      headers2.append("set-cookie", (0, import_cookie.serialize)(name, value, { ...options2, path }));
    }
  }
}
function create_fetch({ event, options: options2, manifest: manifest2, state, get_cookie_header, set_internal }) {
  const server_fetch = async (info, init2) => {
    const original_request = normalize_fetch_input(info, init2, event.url);
    let mode = (info instanceof Request ? info.mode : init2?.mode) ?? "cors";
    let credentials = (info instanceof Request ? info.credentials : init2?.credentials) ?? "same-origin";
    return options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: async (info2, init3) => {
        const request = normalize_fetch_input(info2, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info2 !== original_request) {
          mode = (info2 instanceof Request ? info2.mode : init3?.mode) ?? "cors";
          credentials = (info2 instanceof Request ? info2.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        const decoded = decodeURIComponent(url.pathname);
        if (url.origin !== event.url.origin || base && decoded !== base && !decoded.startsWith(`${base}/`)) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie) request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix = assets || base;
        const filename = (decoded.startsWith(prefix) ? decoded.slice(prefix.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest2.assets.has(filename) || filename in manifest2._.server_assets;
        const is_asset_html = manifest2.assets.has(filename_html) || filename_html in manifest2._.server_assets;
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest2.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          } else if (read_implementation && file in manifest2._.server_assets) {
            const length = manifest2._.server_assets[file];
            const type = manifest2.mimeTypes[file.slice(file.lastIndexOf("."))];
            return new Response(read_implementation(file), {
              headers: {
                "Content-Length": "" + length,
                "Content-Type": type
              }
            });
          }
          return await fetch(request);
        }
        if (has_prerendered_path(manifest2, base + decoded)) {
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await internal_fetch(request, options2, manifest2, state);
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str of splitCookiesString(set_cookie)) {
            const { name, value, ...options3 } = parseString(str, {
              decodeValues: false
            });
            const path = options3.path ?? (url.pathname.split("/").slice(0, -1).join("/") || "/");
            set_internal(name, value, {
              path,
              encode: (value2) => value2,
              .../** @type {import('cookie').CookieSerializeOptions} */
              options3
            });
          }
        }
        return response;
      }
    });
  };
  return (input, init2) => {
    const response = server_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
function normalize_fetch_input(info, init2, url) {
  if (info instanceof Request) {
    return info;
  }
  return new Request(typeof info === "string" ? new URL(info, url) : info, init2);
}
async function internal_fetch(request, options2, manifest2, state) {
  if (request.signal) {
    if (request.signal.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }
    let remove_abort_listener = () => {
    };
    const abort_promise = new Promise((_2, reject) => {
      const on_abort = () => {
        reject(new DOMException("The operation was aborted.", "AbortError"));
      };
      request.signal.addEventListener("abort", on_abort, { once: true });
      remove_abort_listener = () => request.signal.removeEventListener("abort", on_abort);
    });
    const result = await Promise.race([
      respond(request, options2, manifest2, {
        ...state,
        depth: state.depth + 1
      }),
      abort_promise
    ]);
    remove_abort_listener();
    return result;
  } else {
    return await respond(request, options2, manifest2, {
      ...state,
      depth: state.depth + 1
    });
  }
}
var body;
var etag;
var headers;
function get_public_env(request) {
  body ??= `export const env=${JSON.stringify(public_env)}`;
  etag ??= `W/${Date.now()}`;
  headers ??= new Headers({
    "content-type": "application/javascript; charset=utf-8",
    etag
  });
  if (request.headers.get("if-none-match") === etag) {
    return new Response(void 0, { status: 304, headers });
  }
  return new Response(body, { headers });
}
var default_transform = ({ html }) => html;
var default_filter = () => false;
var default_preload = ({ type }) => type === "js" || type === "css";
var page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
var allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
var respond = propagate_context(internal_respond);
async function internal_respond(request, options2, manifest2, state) {
  const url = new URL(request.url);
  const is_route_resolution_request = has_resolution_suffix2(url.pathname);
  const is_data_request = has_data_suffix2(url.pathname);
  const remote_id = get_remote_id(url);
  {
    const request_origin = request.headers.get("origin");
    if (remote_id) {
      if (request.method !== "GET" && request_origin !== url.origin) {
        const message = "Cross-site remote requests are forbidden";
        return json({ message }, { status: 403 });
      }
    } else if (options2.csrf_check_origin) {
      const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request_origin !== url.origin && (!request_origin || !options2.csrf_trusted_origins.includes(request_origin));
      if (forbidden) {
        const message = `Cross-site ${request.method} form submissions are forbidden`;
        const opts = { status: 403 };
        if (request.headers.get("accept") === "application/json") {
          return json({ message }, opts);
        }
        return text(message, opts);
      }
    }
  }
  if (options2.hash_routing && url.pathname !== base + "/" && url.pathname !== "/[fallback]") {
    return text("Not found", { status: 404 });
  }
  let invalidated_data_nodes;
  if (is_route_resolution_request) {
    url.pathname = strip_resolution_suffix2(url.pathname);
  } else if (is_data_request) {
    url.pathname = strip_data_suffix2(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  } else if (remote_id) {
    url.pathname = request.headers.get("x-sveltekit-pathname") ?? base;
    url.search = request.headers.get("x-sveltekit-search") ?? "";
  }
  const headers2 = {};
  const { cookies, new_cookies, get_cookie_header, set_internal, set_trailing_slash } = get_cookies(
    request,
    url
  );
  const event_state = {
    prerendering: state.prerendering,
    transport: options2.hooks.transport,
    handleValidationError: options2.hooks.handleValidationError,
    tracing: {
      record_span
    },
    is_in_remote_function: false
  };
  const event = {
    cookies,
    // @ts-expect-error `fetch` needs to be created after the `event` itself
    fetch: null,
    getClientAddress: state.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-cloudflare"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params: {},
    platform: state.platform,
    request,
    route: { id: null },
    setHeaders: (new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers2) {
          if (lower === "server-timing") {
            headers2[lower] += ", " + value;
          } else {
            throw new Error(`"${key2}" header is already set`);
          }
        } else {
          headers2[lower] = value;
          if (state.prerendering && lower === "cache-control") {
            state.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    },
    url,
    isDataRequest: is_data_request,
    isSubRequest: state.depth > 0,
    isRemoteRequest: !!remote_id
  };
  event.fetch = create_fetch({
    event,
    options: options2,
    manifest: manifest2,
    state,
    get_cookie_header,
    set_internal
  });
  if (state.emulator?.platform) {
    event.platform = await state.emulator.platform({
      config: {},
      prerender: !!state.prerendering?.fallback
    });
  }
  let resolved_path = url.pathname;
  if (!remote_id) {
    const prerendering_reroute_state = state.prerendering?.inside_reroute;
    try {
      if (state.prerendering) state.prerendering.inside_reroute = true;
      resolved_path = await options2.hooks.reroute({ url: new URL(url), fetch: event.fetch }) ?? url.pathname;
    } catch {
      return text("Internal Server Error", {
        status: 500
      });
    } finally {
      if (state.prerendering) state.prerendering.inside_reroute = prerendering_reroute_state;
    }
  }
  try {
    resolved_path = decode_pathname(resolved_path);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  if (
    // the resolved path has been decoded so it should be compared to the decoded url pathname
    resolved_path !== decode_pathname(url.pathname) && !state.prerendering?.fallback && has_prerendered_path(manifest2, resolved_path)
  ) {
    const url2 = new URL(request.url);
    url2.pathname = is_data_request ? add_data_suffix2(resolved_path) : is_route_resolution_request ? add_resolution_suffix2(resolved_path) : resolved_path;
    try {
      const response = await fetch(url2, request);
      const headers22 = new Headers(response.headers);
      if (headers22.has("content-encoding")) {
        headers22.delete("content-encoding");
        headers22.delete("content-length");
      }
      return new Response(response.body, {
        headers: headers22,
        status: response.status,
        statusText: response.statusText
      });
    } catch (error2) {
      return await handle_fatal_error(event, event_state, options2, error2);
    }
  }
  let route = null;
  if (base && !state.prerendering?.fallback) {
    if (!resolved_path.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    resolved_path = resolved_path.slice(base.length) || "/";
  }
  if (is_route_resolution_request) {
    return resolve_route(resolved_path, new URL(request.url), manifest2);
  }
  if (resolved_path === `/${app_dir}/env.js`) {
    return get_public_env(request);
  }
  if (!remote_id && resolved_path.startsWith(`/${app_dir}`)) {
    const headers22 = new Headers();
    headers22.set("cache-control", "public, max-age=0, must-revalidate");
    return text("Not found", { status: 404, headers: headers22 });
  }
  if (!state.prerendering?.fallback) {
    const matchers = await manifest2._.matchers();
    const result = find_route(resolved_path, manifest2._.routes, matchers);
    if (result) {
      route = result.route;
      event.route = { id: route.id };
      event.params = result.params;
    }
  }
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  let trailing_slash = "never";
  try {
    const page_nodes = route?.page ? new PageNodes(await load_page_nodes(route.page, manifest2)) : void 0;
    if (route && !remote_id) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (page_nodes) {
        if (browser) ;
        trailing_slash = page_nodes.trailing_slash();
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash ?? "never";
        if (browser) ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash);
        if (normalized !== url.pathname && !state.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
      if (state.before_handle || state.emulator?.platform) {
        let config = {};
        let prerender = false;
        if (route.endpoint) {
          const node = await route.endpoint();
          config = node.config ?? config;
          prerender = node.prerender ?? prerender;
        } else if (page_nodes) {
          config = page_nodes.get_config() ?? config;
          prerender = page_nodes.prerender();
        }
        if (state.before_handle) {
          state.before_handle(event, config, prerender);
        }
        if (state.emulator?.platform) {
          event.platform = await state.emulator.platform({ config, prerender });
        }
      }
    }
    set_trailing_slash(trailing_slash);
    if (state.prerendering && !state.prerendering.fallback && !state.prerendering.inside_reroute) {
      disable_search(url);
    }
    const response = await record_span({
      name: "sveltekit.handle.root",
      attributes: {
        "http.route": event.route.id || "unknown",
        "http.method": event.request.method,
        "http.url": event.url.href,
        "sveltekit.is_data_request": is_data_request,
        "sveltekit.is_sub_request": event.isSubRequest
      },
      fn: async (root_span) => {
        const traced_event = {
          ...event,
          tracing: {
            enabled: false,
            root: root_span,
            current: root_span
          }
        };
        event_state.allows_commands = MUTATIVE_METHODS.includes(request.method);
        return await with_request_store(
          { event: traced_event, state: event_state },
          () => options2.hooks.handle({
            event: traced_event,
            resolve: (event2, opts) => {
              return record_span({
                name: "sveltekit.resolve",
                attributes: {
                  "http.route": event2.route.id || "unknown"
                },
                fn: (resolve_span) => {
                  return with_request_store(
                    null,
                    () => resolve2(merge_tracing(event2, resolve_span), page_nodes, opts).then(
                      (response2) => {
                        for (const key2 in headers2) {
                          const value = headers2[key2];
                          response2.headers.set(
                            key2,
                            /** @type {string} */
                            value
                          );
                        }
                        add_cookies_to_headers(response2.headers, new_cookies.values());
                        if (state.prerendering && event2.route.id !== null) {
                          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
                        }
                        resolve_span.setAttributes({
                          "http.response.status_code": response2.status,
                          "http.response.body.size": response2.headers.get("content-length") || "unknown"
                        });
                        return response2;
                      }
                    )
                  );
                }
              });
            }
          })
        );
      }
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag2 = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag2) {
        const headers22 = new Headers({ etag: etag2 });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value) headers22.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers22
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location2 = response.headers.get("location");
      if (location2) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location2
        ));
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      const response = is_data_request || remote_id ? redirect_json_response(e3) : route?.page && is_action_json_request(event) ? action_json_redirect(e3) : redirect_response(e3.status, e3.location);
      add_cookies_to_headers(response.headers, new_cookies.values());
      return response;
    }
    return await handle_fatal_error(event, event_state, options2, e3);
  }
  async function resolve2(event2, page_nodes, opts) {
    try {
      if (opts) {
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (options2.hash_routing || state.prerendering?.fallback) {
        return await render_response({
          event: event2,
          event_state,
          options: options2,
          manifest: manifest2,
          state,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts,
          data_serializer: server_data_serializer(event2, event_state, options2)
        });
      }
      if (remote_id) {
        return await handle_remote_call(event2, event_state, options2, manifest2, remote_id);
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response2;
        if (is_data_request) {
          response2 = await render_data(
            event2,
            event_state,
            route,
            options2,
            manifest2,
            state,
            invalidated_data_nodes,
            trailing_slash
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response2 = await render_endpoint(event2, event_state, await route.endpoint(), state);
        } else if (route.page) {
          if (!page_nodes) {
            throw new Error("page_nodes not found. This should never happen");
          } else if (page_methods.has(method)) {
            response2 = await render_page(
              event2,
              event_state,
              route.page,
              options2,
              manifest2,
              state,
              page_nodes,
              resolve_opts
            );
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest2._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response2 = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response2 = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("Route is neither page nor endpoint. This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response2.headers.get("vary")?.split(",")?.map((v2) => v2.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response2 = new Response(response2.body, {
              status: response2.status,
              statusText: response2.statusText,
              headers: new Headers(response2.headers)
            });
            response2.headers.append("Vary", "Accept");
          }
        }
        return response2;
      }
      if (state.error && event2.isSubRequest) {
        const headers22 = new Headers(request.headers);
        headers22.set("x-sveltekit-error", "true");
        return await fetch(request, { headers: headers22 });
      }
      if (state.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state.depth === 0) {
        if (browser && event2.url.pathname === "/.well-known/appspecific/com.chrome.devtools.json") ;
        return await respond_with_error({
          event: event2,
          event_state,
          options: options2,
          manifest: manifest2,
          state,
          status: 404,
          error: new SvelteKitError(404, "Not Found", `Not found: ${event2.url.pathname}`),
          resolve_opts
        });
      }
      if (state.prerendering) {
        return text("not found", { status: 404 });
      }
      const response = await fetch(request);
      return new Response(response.body, response);
    } catch (e3) {
      return await handle_fatal_error(event2, event_state, options2, e3);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
}
function load_page_nodes(page2, manifest2) {
  return Promise.all([
    // we use == here rather than === because [undefined] serializes as "[null]"
    ...page2.layouts.map((n3) => n3 == void 0 ? n3 : manifest2._.nodes[n3]()),
    manifest2._.nodes[page2.leaf]()
  ]);
}
function propagate_context(fn2) {
  return async (req, ...rest) => {
    {
      return fn2(req, ...rest);
    }
  };
}
function filter_env(env, allowed, disallowed) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k2]) => k2.startsWith(allowed) && (disallowed === "" || !k2.startsWith(disallowed))
    )
  );
}
function set_app(value) {
}
var init_promise;
var current = null;
var Server = class {
  /** @type {import('types').SSROptions} */
  #options;
  /** @type {import('@sveltejs/kit').SSRManifest} */
  #manifest;
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest2) {
    this.#options = options;
    this.#manifest = manifest2;
    if (IN_WEBCONTAINER2) {
      const respond2 = this.respond.bind(this);
      this.respond = async (...args) => {
        const { promise, resolve: resolve2 } = (
          /** @type {PromiseWithResolvers<void>} */
          with_resolvers()
        );
        const previous = current;
        current = promise;
        await previous;
        return respond2(...args).finally(resolve2);
      };
    }
  }
  /**
   * @param {import('@sveltejs/kit').ServerInitOptions} opts
   */
  async init({ env, read }) {
    const { env_public_prefix, env_private_prefix } = this.#options;
    set_private_env(filter_env(env, env_private_prefix, env_public_prefix));
    set_public_env(filter_env(env, env_public_prefix, env_private_prefix));
    if (read) {
      const wrapped_read = (file) => {
        const result = read(file);
        if (result instanceof ReadableStream) {
          return result;
        } else {
          return new ReadableStream({
            async start(controller) {
              try {
                const stream = await Promise.resolve(result);
                if (!stream) {
                  controller.close();
                  return;
                }
                const reader = stream.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  controller.enqueue(value);
                }
                controller.close();
              } catch (error2) {
                controller.error(error2);
              }
            }
          });
        }
      };
      set_read_implementation(wrapped_read);
    }
    await (init_promise ??= (async () => {
      try {
        const module = await get_hooks();
        this.#options.hooks = {
          handle: module.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
          handleError: module.handleError || (({ status, error: error2, event }) => {
            const error_message = format_server_error(
              status,
              /** @type {Error} */
              error2,
              event
            );
            console.error(error_message);
          }),
          handleFetch: module.handleFetch || (({ request, fetch: fetch2 }) => fetch2(request)),
          handleValidationError: module.handleValidationError || (({ issues }) => {
            console.error("Remote function schema validation failed:", issues);
            return { message: "Bad Request" };
          }),
          reroute: module.reroute || (() => {
          }),
          transport: module.transport || {}
        };
        set_app({
          decoders: module.transport ? Object.fromEntries(Object.entries(module.transport).map(([k2, v2]) => [k2, v2.decode])) : {}
        });
        if (module.init) {
          await module.init();
        }
      } catch (e3) {
        {
          throw e3;
        }
      }
    })());
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    return respond(request, this.#options, this.#manifest, {
      ...options2,
      error: false,
      depth: 0
    });
  }
};

// .svelte-kit/cloudflare-tmp/manifest.js
var manifest = (() => {
  function __memo(fn2) {
    let value;
    return () => value ??= value = fn2();
  }
  return {
    appDir: "_app",
    appPath: "_app",
    assets: /* @__PURE__ */ new Set([]),
    mimeTypes: {},
    _: {
      client: { start: "_app/immutable/entry/start.BqlbT9VK.js", app: "_app/immutable/entry/app.DdjM-YfO.js", imports: ["_app/immutable/entry/start.BqlbT9VK.js", "_app/immutable/chunks/JdRanJdr.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/entry/app.DdjM-YfO.js", "_app/immutable/chunks/tkWzf5gq.js", "_app/immutable/chunks/6Jn0Uoq0.js"], stylesheets: [], fonts: [], uses_env_dynamic_public: false },
      nodes: [
        __memo(() => Promise.resolve().then(() => (init__(), __exports))),
        __memo(() => Promise.resolve().then(() => (init__2(), __exports2))),
        __memo(() => Promise.resolve().then(() => (init__3(), __exports3))),
        __memo(() => Promise.resolve().then(() => (init__4(), __exports4))),
        __memo(() => Promise.resolve().then(() => (init__5(), __exports5))),
        __memo(() => Promise.resolve().then(() => (init__6(), __exports6))),
        __memo(() => Promise.resolve().then(() => (init__7(), __exports7))),
        __memo(() => Promise.resolve().then(() => (init__8(), __exports8))),
        __memo(() => Promise.resolve().then(() => (init__9(), __exports9))),
        __memo(() => Promise.resolve().then(() => (init__10(), __exports10))),
        __memo(() => Promise.resolve().then(() => (init__11(), __exports11))),
        __memo(() => Promise.resolve().then(() => (init__12(), __exports12))),
        __memo(() => Promise.resolve().then(() => (init__13(), __exports13))),
        __memo(() => Promise.resolve().then(() => (init__14(), __exports14))),
        __memo(() => Promise.resolve().then(() => (init__15(), __exports15))),
        __memo(() => Promise.resolve().then(() => (init__16(), __exports16)))
      ],
      remotes: {},
      routes: [
        {
          id: "/",
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null
        },
        {
          id: "/advisor",
          pattern: /^\/advisor\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null
        },
        {
          id: "/compare",
          pattern: /^\/compare\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null
        },
        {
          id: "/ecosystems",
          pattern: /^\/ecosystems\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 5 },
          endpoint: null
        },
        {
          id: "/ecosystems/[slug]",
          pattern: /^\/ecosystems\/([^/]+?)\/?$/,
          params: [{ "name": "slug", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0], errors: [1], leaf: 6 },
          endpoint: null
        },
        {
          id: "/legal/accessibility",
          pattern: /^\/legal\/accessibility\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 7 },
          endpoint: null
        },
        {
          id: "/legal/affiliate-disclosure",
          pattern: /^\/legal\/affiliate-disclosure\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 8 },
          endpoint: null
        },
        {
          id: "/legal/disclaimer",
          pattern: /^\/legal\/disclaimer\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 9 },
          endpoint: null
        },
        {
          id: "/legal/privacy",
          pattern: /^\/legal\/privacy\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 10 },
          endpoint: null
        },
        {
          id: "/legal/terms",
          pattern: /^\/legal\/terms\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 11 },
          endpoint: null
        },
        {
          id: "/projects",
          pattern: /^\/projects\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 12 },
          endpoint: null
        },
        {
          id: "/projects/[slug]",
          pattern: /^\/projects\/([^/]+?)\/?$/,
          params: [{ "name": "slug", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0], errors: [1], leaf: 13 },
          endpoint: null
        },
        {
          id: "/search",
          pattern: /^\/search\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 14 },
          endpoint: null
        },
        {
          id: "/tools/[slug]",
          pattern: /^\/tools\/([^/]+?)\/?$/,
          params: [{ "name": "slug", "optional": false, "rest": false, "chained": false }],
          page: { layouts: [0], errors: [1], leaf: 15 },
          endpoint: null
        }
      ],
      prerendered_routes: /* @__PURE__ */ new Set([]),
      matchers: async () => {
        return {};
      },
      server_assets: {}
    }
  };
})();
var prerendered = /* @__PURE__ */ new Set([]);
var base_path = "";

// .svelte-kit/cloudflare-tmp/_worker.js
async function e2(e3, t22) {
  let n22 = "string" != typeof t22 && "HEAD" === t22.method;
  n22 && (t22 = new Request(t22, { method: "GET" }));
  let r3 = await e3.match(t22);
  return n22 && r3 && (r3 = new Response(null, r3)), r3;
}
function t2(e3, t22, n22, o22) {
  return ("string" == typeof t22 || "GET" === t22.method) && r2(n22) && (n22.headers.has("Set-Cookie") && (n22 = new Response(n22.body, n22)).headers.append("Cache-Control", "private=Set-Cookie"), o22.waitUntil(e3.put(t22, n22.clone()))), n22;
}
var n2 = /* @__PURE__ */ new Set([200, 203, 204, 300, 301, 404, 405, 410, 414, 501]);
function r2(e3) {
  if (!n2.has(e3.status)) return false;
  if (~(e3.headers.get("Vary") || "").indexOf("*")) return false;
  let t22 = e3.headers.get("Cache-Control") || "";
  return !/(private|no-cache|no-store)/i.test(t22);
}
function o2(n22) {
  return async function(r3, o22) {
    let a2 = await e2(n22, r3);
    if (a2) return a2;
    o22.defer((e3) => {
      t2(n22, r3, e3, o22);
    });
  };
}
var s3 = caches.default;
var c2 = t2.bind(0, s3);
var r22 = e2.bind(0, s3);
var e22 = o2.bind(0, s3);
var server = new Server(manifest);
var app_path = `/${manifest.appPath}`;
var immutable = `${app_path}/immutable/`;
var version_file = `${app_path}/version.json`;
var worker = {
  async fetch(req, env, context) {
    await server.init({ env });
    let pragma = req.headers.get("cache-control") || "";
    let res = !pragma.includes("no-cache") && await r22(req);
    if (res) return res;
    let { pathname, search } = new URL(req.url);
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
    }
    const stripped_pathname = pathname.replace(/\/$/, "");
    let is_static_asset = false;
    const filename = stripped_pathname.slice(base_path.length + 1);
    if (filename) {
      is_static_asset = manifest.assets.has(filename) || manifest.assets.has(filename + "/index.html") || filename in manifest._.server_assets || filename + "/index.html" in manifest._.server_assets;
    }
    let location2 = pathname.at(-1) === "/" ? stripped_pathname : pathname + "/";
    if (is_static_asset || prerendered.has(pathname) || pathname === version_file || pathname.startsWith(immutable)) {
      res = await env.ASSETS.fetch(req);
    } else if (location2 && prerendered.has(location2)) {
      if (search) location2 += search;
      res = new Response("", {
        status: 308,
        headers: {
          location: location2
        }
      });
    } else {
      res = await server.respond(req, {
        // @ts-ignore
        platform: { env, context, caches, cf: req.cf },
        getClientAddress() {
          return req.headers.get("cf-connecting-ip");
        }
      });
    }
    pragma = res.headers.get("cache-control") || "";
    return pragma && res.status < 400 ? c2(req, res, context) : res;
  }
};
var worker_default = worker;
export {
  worker_default as default
};
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=_worker.js.map
