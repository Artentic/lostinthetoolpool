# Data Ingestion Pipeline Design

## Overview

The data ingestion pipeline populates and keeps current all three databases (ClickHouse, Qdrant, Neo4j) with product data, pricing, and relationships. It runs as a set of Go services that can be triggered on a schedule or manually.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Retailer   │────▶│   Scraper/   │────▶│  Normalizer     │
│  APIs/Feeds │     │   Fetcher    │     │  (clean, dedupe) │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────────────────────┤
                    │              │                │
                    ▼              ▼                ▼
             ┌──────────┐  ┌──────────┐    ┌──────────┐
             │ClickHouse│  │  Qdrant  │    │  Neo4j   │
             │(products,│  │(vectors) │    │ (graph)  │
             │ prices)  │  │          │    │          │
             └──────────┘  └──────────┘    └──────────┘
```

## Data Sources

### 1. Retailer Product Feeds
| Source | Method | Frequency | Data |
|--------|--------|-----------|------|
| Amazon | Product Advertising API (PA-API 5.0) | Daily | Products, prices, ratings, images |
| Home Depot | Affiliate datafeed (Impact) | Daily | Products, prices, stock status |
| Lowe's | Affiliate datafeed | Daily | Products, prices |
| Acme Tools | ShareASale datafeed | Weekly | Products, prices |
| CPO Outlets | Rakuten datafeed | Weekly | Products, prices |

### 2. Manual Seed Data
- Tool taxonomy from `/research/tool-taxonomy.md`
- Ecosystem data from `/research/tool-ecosystems.md`
- Project-tool mappings from `/research/project-tool-mapping.md`

### 3. Embedding Generation
- Cohere Embed v3 (embed-english-v3.0, 1024 dimensions)
- Input: tool name + description + category + key specs
- Batch processing: up to 96 texts per API call

## Pipeline Stages

### Stage 1: Fetch
```
cmd/ingester/fetch.go
```
- Pull product feeds from retailer APIs/datafeeds
- Store raw responses in `/data/raw/{source}/{date}/` (local or S3)
- Rate limit per source (Amazon: 1 req/sec, others: 10 req/sec)
- Retry with exponential backoff on failures

### Stage 2: Normalize
```
cmd/ingester/normalize.go
```
- Parse each source's format into a unified `Product` struct
- Extract brand, ecosystem from product title/description
- Map to our category taxonomy using keyword matching + LLM fallback
- Deduplicate across retailers by UPC/model number
- Generate SKU if missing: `{brand}-{model}-{variant}`

### Stage 3: Load to ClickHouse
```
cmd/ingester/load_clickhouse.go
```
- Upsert products into `products` table (ReplacingMergeTree handles dedup)
- Insert price point into `price_history` table
- Batch inserts: 1000 rows per batch for throughput

### Stage 4: Generate Embeddings
```
cmd/ingester/embed.go
```
- For new/updated products, generate text for embedding:
  ```
  "{name}. {category} > {subcategory}. {description}. Key specs: {specs_summary}"
  ```
- Call Cohere embed API in batches of 96
- Cache embeddings locally to avoid re-generating unchanged products

### Stage 5: Load to Qdrant
```
cmd/ingester/load_qdrant.go
```
- Upsert points with vector + payload metadata
- Payload includes: sku, name, brand, ecosystem, category, subcategory, price, is_cordless, rating, slug
- Use point ID = hash of SKU for stable IDs

### Stage 6: Update Neo4j Graph
```
cmd/ingester/load_neo4j.go
```
- Create/update Tool nodes matching SKUs
- Create relationships: Tool→Ecosystem, Tool→Category, Tool→Subcategory
- Update Retailer→Tool SELLS relationships with current price
- Run cross-ecosystem alternative matching (same subcategory, different ecosystem)

## Scheduling

| Job | Schedule | Duration (est.) |
|-----|----------|-----------------|
| Full product refresh | Daily 2 AM ET | ~30 min |
| Price update only | Every 6 hours | ~10 min |
| Embedding refresh | Daily 3 AM ET | ~15 min |
| Graph relationship sync | Daily 4 AM ET | ~5 min |
| Stale product cleanup | Weekly Sunday | ~2 min |

## Error Handling

- Each stage logs to structured JSON (stdout for Docker)
- Failed items are written to a dead-letter queue (Redis list)
- Dead letter items are retried on next run
- Alert on: >5% failure rate, any stage taking >2x expected duration
- Price sanity check: reject prices that changed >50% from last known (likely data error)

## Monitoring Queries

```sql
-- Products per source
SELECT count(), max(updated_at) FROM products GROUP BY 1;

-- Price history coverage
SELECT retailer, count(DISTINCT sku), max(recorded_at)
FROM price_history
GROUP BY retailer;

-- Stale products (not updated in 7 days)
SELECT count() FROM products WHERE updated_at < now() - INTERVAL 7 DAY;
```

## Initial Seed Process

For launch, before retailer feeds are connected:

1. Run `scripts/seed-from-research.go` — parses research markdown files and creates ~200 representative products across all ecosystems
2. Run `scripts/seed-neo4j.go` — loads the full graph structure (brands, ecosystems, categories, projects, relationships)
3. Run `scripts/seed-qdrant.go` — generates embeddings for all seeded products and projects
4. Manual QA: verify ecosystem graph is correct, spot-check 20 products, test 10 vector searches

## Scaling Notes

- Current design handles up to ~50,000 products comfortably
- ClickHouse can handle millions of price history rows without issue
- Qdrant performs well up to 1M vectors with current config
- Neo4j graph stays small (<100K nodes) — no scaling concerns
- If product count exceeds 50K, add parallel fetchers per retailer
