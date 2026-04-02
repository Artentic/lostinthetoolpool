# Serverless Architecture — 100% AWS, us-east-1

## Overview

Everything on AWS. One console, one bill, one IAM. Zero servers.

```
Users (US)
   │
   ▼
┌──────────────┐     ┌──────────────────┐
│  CloudFront  │────▶│  S3 (static)     │  Frontend (SvelteKit pre-rendered)
│  (CDN/edge)  │     │  + Lambda@Edge   │  SSR for dynamic pages
└──────┬───────┘     └──────────────────┘
       │
       │ /api/*
       ▼
┌──────────────┐
│ API Gateway  │  HTTP API (cheaper, faster than REST API)
│ (us-east-1)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Lambda     │  Go binary, ARM64 Graviton, 512MB
│ (us-east-1)  │  <15ms cold start
└──┬──┬──┬──┬──┘
   │  │  │  │
   │  │  │  └──────────────────────────────┐
   │  │  └──────────────────┐              │
   │  └──────────┐          │              │
   ▼             ▼          ▼              ▼
┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐
│ DynamoDB │ │OpenSearch │ │ Firehose  │ │ Bedrock  │
│          │ │Serverless│ │ → S3      │ │ (Claude) │
│ Products │ │ (vectors)│ │ → Athena  │ │          │
│ Projects │ │          │ │           │ │          │
│ Ecosys.  │ │ Semantic │ │ Analytics │ │ Advisor  │
│ Cache    │ │ search   │ │           │ │          │
└──────────┘ └──────────┘ └───────────┘ └──────────┘
```

## AWS Services Used

| Service | Purpose | Replaces | Why |
|---|---|---|---|
| **CloudFront + S3** | Frontend hosting | Cloudflare Pages | Same AWS account, Origin Access Control |
| **Lambda@Edge** | SSR for dynamic pages | SvelteKit SSR | SEO-critical pages need server rendering |
| **API Gateway (HTTP)** | API routing | — | Cheapest API Gateway option |
| **Lambda** | API compute | Go server | ARM64, pay-per-request |
| **DynamoDB** | Products, projects, ecosystems, categories, cache | ClickHouse + Neo4j + Redis | Single data store, no VPC, scales to zero |
| **OpenSearch Serverless** | Vector search (k-NN) | Qdrant | AWS-native, same k-NN capability, no VPC required |
| **Kinesis Firehose → S3** | Event ingestion | ClickHouse analytics | Serverless, zero ops |
| **Athena** | Analytics queries | ClickHouse queries | Query S3 directly, pay per scan |
| **Bedrock** | Claude AI for advisor | — | Same as before |
| **Route 53** | DNS | Cloudflare DNS | One console |
| **SES** | Transactional email | ConvertKit (keep for newsletter) | Verification emails, receipts |
| **ACM** | TLS certificates | — | Free, auto-renewing |

## Why DynamoDB For Everything

Our data model is simpler than it looks:
- **Products**: Key-value by SKU, GSI on slug, ecosystem, category
- **Projects**: Key-value by slug, small dataset (~20 items)
- **Ecosystems**: Key-value by slug, small dataset (~20 items)
- **Categories**: Hierarchical but small (~16 categories, ~50 subcategories)
- **Relationships**: Project→Tools, Ecosystem→Tools — modeled as GSIs and list attributes
- **Cache**: DynamoDB with TTL attribute (items auto-expire)

The "graph" we had in Neo4j is really just:
- Brand owns Ecosystem (static, 13 records)
- Project requires Tool categories (static, ~200 relationships)
- Tool belongs to Ecosystem (attribute on product)

This is easily modeled in DynamoDB. No need for a dedicated graph database.

## DynamoDB Table Design

### Table: `litp-products`
```
PK: SKU
GSI1: slug (for URL lookups)
GSI2: ecosystem#category (for listing tools by ecosystem or category)
GSI3: subcategory#rating (for "best in subcategory" queries)

Attributes: name, brand, ecosystem, category, subcategory, slug,
            price, specs (map), rating, review_count, description,
            features (list), affiliate_links (map), is_cordless, weight
```

### Table: `litp-content`
```
PK: TYPE#SLUG (e.g., "PROJECT#build-a-deck", "ECOSYSTEM#milwaukee-m18", "CATEGORY#cutting")
SK: "DETAIL"

For relationships:
PK: "PROJECT#build-a-deck"
SK: "TOOL#circular-saws" (with priority attribute: essential/recommended/optional)

PK: "ECOSYSTEM#milwaukee-m18"
SK: "META" (ecosystem details)

PK: "CATEGORY#cutting"
SK: "SUBCATEGORY#circular-saws"
```

### Table: `litp-cache`
```
PK: cache_key
TTL: expires_at (DynamoDB auto-deletes expired items)
Attributes: data (JSON string), created_at
```

### Table: `litp-prices`
```
PK: SKU
SK: timestamp#retailer
Attributes: price, in_stock, retailer
```

## Analytics Pipeline

```
Frontend/API events
       │
       ▼
┌──────────────┐     ┌──────────┐     ┌──────────┐
│ API Gateway  │────▶│ Firehose │────▶│   S3     │
│ (POST /anal.)│     │ (buffer) │     │ (Parquet)│
└──────────────┘     └──────────┘     └────┬─────┘
                                           │
                                      ┌────▼─────┐
                                      │  Athena  │  SQL queries on demand
                                      └──────────┘
```

- Events go directly from API Gateway to Firehose (no Lambda needed)
- Firehose buffers and writes Parquet to S3 every 60 seconds
- Athena queries S3 directly — pay only when you query ($5/TB scanned)
- Partition by date for fast, cheap queries

Analytics event types stored in S3:
- `searches/` — every search query
- `pageviews/` — every page view with device type
- `affiliate-clicks/` — every affiliate click with source
- `product-views/` — every product view
- `ecosystem-selections/` — ecosystem choices
- `toolkit-generations/` — advisor usage

## Cost Estimates (us-east-1)

### Launch (0-1K visitors/day)
| Service | Cost |
|---|---|
| CloudFront + S3 | $0 (free tier: 1TB/mo, 10M requests) |
| Lambda | $0 (free tier: 1M requests, 400K GB-sec) |
| API Gateway | $0 (free tier: 1M requests/mo for 12 months) |
| DynamoDB | $0 (free tier: 25GB, 25 WCU, 25 RCU) |
| OpenSearch Serverless | ~$25 (minimum 0.5 OCU indexing + 0.5 OCU search) |
| Firehose + S3 | $0-5 |
| Athena | $0-2 (pay per query) |
| Bedrock | ~$5-20 |
| Route 53 | $0.50/zone |
| **Total** | **~$30-50/month** |

**Note:** OpenSearch Serverless has a ~$25/month minimum (0.5 OCU each for indexing and search). This is the biggest cost at launch. Alternative: use Bedrock Knowledge Bases for vector search (pay-per-query, no minimum) or defer vector search and use DynamoDB text search initially.

### Growth (10K visitors/day)
| Service | Cost |
|---|---|
| CloudFront + S3 | ~$5 |
| Lambda | ~$10 |
| API Gateway | ~$10 |
| DynamoDB | ~$15 (on-demand pricing) |
| OpenSearch Serverless | ~$50 |
| Firehose + S3 + Athena | ~$10 |
| Bedrock | ~$50-150 |
| **Total** | **~$150-250/month** |

## Alternative: Skip OpenSearch, Use Bedrock Knowledge Bases

To avoid the $25/month OpenSearch minimum at launch:
1. Store tool descriptions in S3
2. Create a Bedrock Knowledge Base pointing to that S3 bucket
3. Use `RetrieveAndGenerate` API for semantic search
4. Pay only per query (~$0.005/query)

This is cheaper until ~5,000 searches/month. Can migrate to OpenSearch later when traffic justifies the minimum cost.

## No VPC Required

Every service in this architecture works without a VPC:
- DynamoDB: Public endpoints with IAM auth
- OpenSearch Serverless: Public endpoints with IAM auth
- Firehose: Public endpoints with IAM auth
- Bedrock: Public endpoints with IAM auth

This means: **zero VPC cold start penalty on Lambda** (~6-10 seconds avoided).
