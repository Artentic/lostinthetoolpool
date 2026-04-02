
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/advisor" | "/compare" | "/ecosystems" | "/ecosystems/[slug]" | "/legal" | "/legal/accessibility" | "/legal/affiliate-disclosure" | "/legal/disclaimer" | "/legal/privacy" | "/legal/terms" | "/projects" | "/projects/[slug]" | "/search" | "/tools" | "/tools/[slug]";
		RouteParams(): {
			"/ecosystems/[slug]": { slug: string };
			"/projects/[slug]": { slug: string };
			"/tools/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string };
			"/advisor": Record<string, never>;
			"/compare": Record<string, never>;
			"/ecosystems": { slug?: string };
			"/ecosystems/[slug]": { slug: string };
			"/legal": Record<string, never>;
			"/legal/accessibility": Record<string, never>;
			"/legal/affiliate-disclosure": Record<string, never>;
			"/legal/disclaimer": Record<string, never>;
			"/legal/privacy": Record<string, never>;
			"/legal/terms": Record<string, never>;
			"/projects": { slug?: string };
			"/projects/[slug]": { slug: string };
			"/search": Record<string, never>;
			"/tools": { slug?: string };
			"/tools/[slug]": { slug: string }
		};
		Pathname(): "/" | "/advisor" | "/compare" | "/ecosystems" | `/ecosystems/${string}` & {} | "/legal/accessibility" | "/legal/affiliate-disclosure" | "/legal/disclaimer" | "/legal/privacy" | "/legal/terms" | "/projects" | `/projects/${string}` & {} | "/search" | `/tools/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}