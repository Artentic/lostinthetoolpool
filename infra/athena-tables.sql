-- Athena table definitions for analytics data in S3
-- These query the JSON Lines files written by Kinesis Firehose

CREATE DATABASE IF NOT EXISTS litp_analytics;

-- All events in one table, partitioned by date and event type
CREATE EXTERNAL TABLE IF NOT EXISTS litp_analytics.events (
    event_type      STRING,
    session_id      STRING,
    timestamp       STRING,
    page_url        STRING,
    referrer        STRING,
    user_agent      STRING,
    screen_width    INT,

    -- Search events
    query_text      STRING,
    query_type      STRING,
    results_count   INT,
    response_ms     INT,

    -- Affiliate click events
    sku             STRING,
    retailer        STRING,
    destination_url STRING,
    referrer_query  STRING,

    -- Page view events
    page_type       STRING,
    page_slug       STRING,
    device_type     STRING,

    -- Product view events
    brand           STRING,
    ecosystem       STRING,
    price           DOUBLE,
    source          STRING,

    -- Ecosystem selection events
    context         STRING,

    -- Toolkit generation events
    project_slug    STRING,
    tool_count      INT,
    total_cost      DOUBLE
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES ('ignore.malformed.json' = 'TRUE')
LOCATION 's3://litp-analytics-ACCOUNT_ID/events/'
TBLPROPERTIES ('has_encrypted_data'='false');

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Top search queries (all time)
-- SELECT query_text, COUNT(*) as cnt, AVG(results_count) as avg_results
-- FROM litp_analytics.events
-- WHERE event_type = 'search'
-- GROUP BY query_text ORDER BY cnt DESC LIMIT 50;

-- Zero-result searches (content gaps — your roadmap)
-- SELECT query_text, COUNT(*) as cnt
-- FROM litp_analytics.events
-- WHERE event_type = 'search' AND results_count = 0
-- GROUP BY query_text ORDER BY cnt DESC LIMIT 50;

-- Affiliate click-through by retailer
-- SELECT retailer, COUNT(*) as clicks, COUNT(DISTINCT session_id) as unique_clickers
-- FROM litp_analytics.events
-- WHERE event_type = 'affiliate_click'
-- GROUP BY retailer ORDER BY clicks DESC;

-- Most viewed products
-- SELECT sku, brand, COUNT(*) as views
-- FROM litp_analytics.events
-- WHERE event_type = 'product_view'
-- GROUP BY sku, brand ORDER BY views DESC LIMIT 20;

-- Ecosystem popularity over time
-- SELECT ecosystem, DATE(from_iso8601_timestamp(timestamp)) as dt, COUNT(*) as selections
-- FROM litp_analytics.events
-- WHERE event_type = 'ecosystem_selection'
-- GROUP BY ecosystem, DATE(from_iso8601_timestamp(timestamp))
-- ORDER BY dt DESC, selections DESC;

-- Conversion funnel: page views → product views → affiliate clicks
-- SELECT
--   COUNT(DISTINCT CASE WHEN event_type = 'pageview' THEN session_id END) as visitors,
--   COUNT(DISTINCT CASE WHEN event_type = 'product_view' THEN session_id END) as product_viewers,
--   COUNT(DISTINCT CASE WHEN event_type = 'affiliate_click' THEN session_id END) as clickers
-- FROM litp_analytics.events
-- WHERE DATE(from_iso8601_timestamp(timestamp)) = CURRENT_DATE;

-- Mobile vs desktop
-- SELECT device_type, COUNT(DISTINCT session_id) as sessions,
--        COUNT(CASE WHEN event_type = 'affiliate_click' THEN 1 END) as clicks
-- FROM litp_analytics.events
-- WHERE event_type IN ('pageview', 'affiliate_click')
-- GROUP BY device_type;

-- Advisor usage and quality
-- SELECT DATE(from_iso8601_timestamp(timestamp)) as dt,
--        COUNT(*) as queries,
--        COUNT(DISTINCT session_id) as unique_users
-- FROM litp_analytics.events
-- WHERE event_type = 'advisor_query'
-- GROUP BY DATE(from_iso8601_timestamp(timestamp))
-- ORDER BY dt DESC;
