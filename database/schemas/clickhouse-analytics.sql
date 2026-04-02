-- Extended ClickHouse analytics tables for detailed user behavior tracking
-- These supplement the base tables in clickhouse-init.sql

-- =============================================================================
-- PAGE VIEWS (granular — every page visit)
-- =============================================================================
CREATE TABLE IF NOT EXISTS page_views (
    session_id   String,
    page_type    String,     -- 'home', 'project', 'tool', 'ecosystem', 'advisor', 'compare', 'search'
    page_slug    String,     -- e.g. 'build-a-deck', 'milwaukee-m18-fuel-impact-driver'
    device_type  String,     -- 'mobile', 'tablet', 'desktop'
    referrer     String,
    created_at   DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at, session_id, page_type);

ALTER TABLE page_views ADD INDEX idx_page_type (page_type) TYPE bloom_filter GRANULARITY 4;
ALTER TABLE page_views ADD INDEX idx_page_slug (page_slug) TYPE bloom_filter GRANULARITY 4;

-- =============================================================================
-- PRODUCT VIEWS (every time a user views a product detail page)
-- =============================================================================
CREATE TABLE IF NOT EXISTS product_views (
    session_id   String,
    sku          String,
    brand        String,
    ecosystem    String,
    price        Float64,
    source       String,     -- 'search', 'project_toolkit', 'ecosystem_page', 'comparison', 'advisor'
    created_at   DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at, sku);

-- =============================================================================
-- ECOSYSTEM SELECTIONS (when user picks an ecosystem in any context)
-- =============================================================================
CREATE TABLE IF NOT EXISTS ecosystem_selections (
    session_id   String,
    ecosystem    String,
    context      String,     -- 'project_toolkit', 'starter_kit', 'comparison', 'advisor'
    created_at   DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at, ecosystem);

-- =============================================================================
-- TOOLKIT GENERATIONS (when a project toolkit is built)
-- =============================================================================
CREATE TABLE IF NOT EXISTS toolkit_generations (
    session_id   String,
    project_slug String,
    ecosystem    String,
    tool_count   UInt32,
    total_cost   Float64,
    created_at   DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at, project_slug);

-- =============================================================================
-- MATERIALIZED VIEWS — real-time dashboards
-- =============================================================================

-- Hourly page views by type
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hourly_pageviews
ENGINE = SummingMergeTree()
ORDER BY (hour, page_type, device_type)
AS SELECT
    toStartOfHour(created_at) AS hour,
    page_type,
    device_type,
    count() AS view_count,
    uniqExact(session_id) AS unique_sessions
FROM page_views
GROUP BY hour, page_type, device_type;

-- Most viewed products (daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_product_views_daily
ENGINE = SummingMergeTree()
ORDER BY (dt, sku, source)
AS SELECT
    toDate(created_at) AS dt,
    sku,
    brand,
    ecosystem,
    source,
    count() AS view_count,
    uniqExact(session_id) AS unique_viewers
FROM product_views
GROUP BY dt, sku, brand, ecosystem, source;

-- Ecosystem popularity (daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ecosystem_popularity
ENGINE = SummingMergeTree()
ORDER BY (dt, ecosystem, context)
AS SELECT
    toDate(created_at) AS dt,
    ecosystem,
    context,
    count() AS selection_count,
    uniqExact(session_id) AS unique_sessions
FROM ecosystem_selections
GROUP BY dt, ecosystem, context;

-- Project toolkit generation stats
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_toolkit_stats
ENGINE = SummingMergeTree()
ORDER BY (dt, project_slug, ecosystem)
AS SELECT
    toDate(created_at) AS dt,
    project_slug,
    ecosystem,
    count() AS generation_count,
    avg(total_cost) AS avg_cost,
    avg(tool_count) AS avg_tools
FROM toolkit_generations
GROUP BY dt, project_slug, ecosystem;

-- Conversion funnel: product view → affiliate click (daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_affiliate_conversion
ENGINE = SummingMergeTree()
ORDER BY (dt, retailer)
AS SELECT
    toDate(created_at) AS dt,
    retailer,
    count() AS click_count,
    uniqExact(session_id) AS unique_clickers,
    uniqExact(sku) AS unique_products
FROM affiliate_clicks
GROUP BY dt, retailer;

-- =============================================================================
-- ANALYTICS QUERIES (run these to understand your users)
-- =============================================================================

-- Top search queries with no results (content gap!)
-- SELECT query_text, count() as cnt
-- FROM search_queries
-- WHERE results_count = 0
-- GROUP BY query_text ORDER BY cnt DESC LIMIT 50;

-- Most popular projects by toolkit generation
-- SELECT project_slug, ecosystem, count() as cnt, avg(total_cost) as avg_cost
-- FROM toolkit_generations
-- GROUP BY project_slug, ecosystem ORDER BY cnt DESC;

-- Affiliate click-through rate by page type
-- SELECT pv.page_type, count(DISTINCT ac.session_id) / count(DISTINCT pv.session_id) as ctr
-- FROM page_views pv
-- LEFT JOIN affiliate_clicks ac ON pv.session_id = ac.session_id
-- GROUP BY pv.page_type ORDER BY ctr DESC;

-- Ecosystem selection trends (which ecosystems are gaining/losing interest)
-- SELECT ecosystem, toStartOfWeek(created_at) as week, count() as selections
-- FROM ecosystem_selections
-- GROUP BY ecosystem, week ORDER BY week DESC, selections DESC;

-- Mobile vs desktop conversion comparison
-- SELECT device_type, count(DISTINCT pv.session_id) as sessions,
--        count(DISTINCT ac.session_id) as converters,
--        count(DISTINCT ac.session_id) / count(DISTINCT pv.session_id) as conversion_rate
-- FROM page_views pv
-- LEFT JOIN affiliate_clicks ac ON pv.session_id = ac.session_id
-- GROUP BY device_type;
