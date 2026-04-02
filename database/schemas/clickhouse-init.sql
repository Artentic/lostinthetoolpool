-- ClickHouse Schema for Lost in the Tool Pool
-- Handles: product catalog, price history, search analytics, affiliate tracking

-- =============================================================================
-- PRODUCTS
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
    sku          String,
    name         String,
    brand        String,
    ecosystem    String,           -- e.g. 'milwaukee-m18', 'dewalt-20v-max'
    category     String,           -- Level 1: 'cutting'
    subcategory  String,           -- Level 2: 'circular-saws'
    tool_type    String,           -- Level 3: '7-1/4-inch-sidewinder'
    slug         String,           -- URL-friendly: 'dewalt-dcs391b'

    -- Pricing
    price_current   Decimal(10, 2),
    price_msrp      Decimal(10, 2),
    currency        String DEFAULT 'USD',

    -- Specs stored as flexible JSON
    specs       String,            -- JSON: {"voltage": 20, "blade_size": "7-1/4\"", ...}

    -- Ratings
    rating          Float32,
    review_count    UInt32,

    -- Media
    image_url       String,
    image_urls      Array(String),

    -- Affiliate
    affiliate_links String,        -- JSON: {"amazon": "url", "homedepot": "url", ...}

    -- Metadata
    description     String,
    features        Array(String),
    is_cordless     UInt8,
    weight_lbs      Float32,
    upc             String,

    -- Status
    in_stock        UInt8 DEFAULT 1,
    is_active       UInt8 DEFAULT 1,

    -- Timestamps
    created_at      DateTime DEFAULT now(),
    updated_at      DateTime DEFAULT now()
)
ENGINE = ReplacingMergeTree(updated_at)
ORDER BY (sku)
PRIMARY KEY (sku);

-- Index for common queries
ALTER TABLE products ADD INDEX idx_brand (brand) TYPE bloom_filter GRANULARITY 4;
ALTER TABLE products ADD INDEX idx_ecosystem (ecosystem) TYPE bloom_filter GRANULARITY 4;
ALTER TABLE products ADD INDEX idx_category (category) TYPE bloom_filter GRANULARITY 4;
ALTER TABLE products ADD INDEX idx_slug (slug) TYPE bloom_filter GRANULARITY 4;

-- =============================================================================
-- PRICE HISTORY
-- =============================================================================
CREATE TABLE IF NOT EXISTS price_history (
    sku         String,
    price       Decimal(10, 2),
    retailer    String,            -- 'amazon', 'homedepot', 'lowes', etc.
    url         String,
    in_stock    UInt8 DEFAULT 1,
    recorded_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(recorded_at)
ORDER BY (sku, retailer, recorded_at);

-- =============================================================================
-- SEARCH ANALYTICS
-- =============================================================================
CREATE TABLE IF NOT EXISTS search_queries (
    query_id        UUID DEFAULT generateUUIDv4(),
    session_id      String,
    query_text      String,
    query_type      String,        -- 'search', 'advisor', 'compare'
    results_count   UInt32,
    results_skus    Array(String), -- SKUs shown in results
    clicked_sku     String,        -- First product clicked (if any)
    response_ms     UInt32,        -- Response time in milliseconds
    created_at      DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at, session_id);

ALTER TABLE search_queries ADD INDEX idx_query_text (query_text) TYPE tokenbf_v1(10240, 3, 0) GRANULARITY 4;

-- =============================================================================
-- AFFILIATE CLICK TRACKING
-- =============================================================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    click_id        UUID DEFAULT generateUUIDv4(),
    session_id      String,
    sku             String,
    retailer        String,
    destination_url String,
    referrer_page   String,        -- Which page they clicked from
    referrer_query  String,        -- What search led them here (if any)
    created_at      DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)
ORDER BY (created_at, retailer, sku);

-- =============================================================================
-- USER SESSIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id      String,
    first_seen      DateTime DEFAULT now(),
    last_seen       DateTime DEFAULT now(),
    page_views      UInt32 DEFAULT 1,
    searches        UInt32 DEFAULT 0,
    clicks          UInt32 DEFAULT 0,
    user_agent      String,
    referrer        String,
    country         String DEFAULT '',
    device_type     String DEFAULT ''   -- 'mobile', 'desktop', 'tablet'
)
ENGINE = ReplacingMergeTree(last_seen)
ORDER BY (session_id);

-- =============================================================================
-- MATERIALIZED VIEWS for fast aggregations
-- =============================================================================

-- Popular products (by affiliate clicks)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_popular_products
ENGINE = SummingMergeTree()
ORDER BY (sku, retailer)
AS SELECT
    sku,
    retailer,
    count() AS click_count,
    toDate(created_at) AS dt
FROM affiliate_clicks
GROUP BY sku, retailer, dt;

-- Popular searches
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_popular_searches
ENGINE = SummingMergeTree()
ORDER BY (query_text)
AS SELECT
    query_text,
    count() AS search_count,
    toDate(created_at) AS dt
FROM search_queries
GROUP BY query_text, dt;

-- Daily stats
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_stats
ENGINE = SummingMergeTree()
ORDER BY (dt)
AS SELECT
    toDate(created_at) AS dt,
    count() AS total_searches,
    uniqExact(session_id) AS unique_sessions
FROM search_queries
GROUP BY dt;
