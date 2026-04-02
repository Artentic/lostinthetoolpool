export interface Product {
	sku: string;
	name: string;
	brand: string;
	ecosystem: string;
	category: string;
	subcategory: string;
	tool_type: string;
	slug: string;
	price_current: number;
	price_msrp: number;
	specs: Record<string, unknown>;
	rating: number;
	review_count: number;
	image_url: string;
	affiliate_links: Record<string, string>;
	description: string;
	features: string[];
	is_cordless: boolean;
	weight_lbs: number;
	in_stock: boolean;
	updated_at: string;
}

export interface Project {
	slug: string;
	name: string;
	description: string;
	difficulty: number;
	time_estimate: string;
	image_url?: string;
	related_slugs?: string[];
}

export interface Ecosystem {
	slug: string;
	name: string;
	brand: string;
	voltage: number;
	tool_count: number;
	target: 'diy' | 'pro' | 'both';
	parent_company?: string;
}

export interface Category {
	slug: string;
	name: string;
	subcategories: Subcategory[];
}

export interface Subcategory {
	slug: string;
	name: string;
	tool_count?: number;
}

export interface SearchResult {
	products: Product[];
	total: number;
	query_ms: number;
}

export interface ToolkitItem {
	product?: Product;
	subcategory: string;
	reason: string;
	priority: 'essential' | 'recommended' | 'optional';
	rent_option?: string;
}

export interface ProjectToolkit {
	project: Project;
	ecosystem: string;
	essential_tools: ToolkitItem[];
	recommended_tools: ToolkitItem[];
	optional_tools: ToolkitItem[];
	total_cost: number;
	safety_gear: string[];
}

export interface ComparisonResult {
	products: Product[];
	specs: SpecRow[];
}

export interface SpecRow {
	label: string;
	values: Record<string, string>;
	unit?: string;
}

export interface AdvisorRequest {
	query: string;
	owned_tools?: string[];
	budget?: number;
	ecosystem?: string;
}

export const ECOSYSTEM_COLORS: Record<string, string> = {
	'milwaukee-m18': 'bg-milwaukee text-white',
	'milwaukee-m12': 'bg-milwaukee text-white',
	'dewalt-20v-max': 'bg-dewalt text-black',
	'dewalt-flexvolt': 'bg-dewalt text-black',
	'makita-18v-lxt': 'bg-makita text-white',
	'makita-40v-xgt': 'bg-makita text-white',
	'ryobi-one-plus': 'bg-ryobi text-black',
	'ryobi-40v': 'bg-ryobi text-black',
	'bosch-18v': 'bg-bosch text-white',
	'ego-56v': 'bg-ego text-white'
};

export const DIFFICULTY_LABELS = ['', 'Easy', 'Moderate', 'Intermediate', 'Advanced', 'Expert'];
