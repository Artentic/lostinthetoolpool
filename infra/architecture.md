# Serverless Architecture — AWS us-east-1

## Overview

Everything serverless, pay-per-use, zero server management. US-based for optimal peering to the target audience.

```
                         ┌──────────────────┐
                         │  Cloudflare Pages │ (Frontend — global edge)
                         │  SvelteKit SSR    │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  API Gateway      │ (us-east-1)
                         │  HTTP API         │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  AWS Lambda       │ (Go binary, <50ms cold start)
                         │  ARM64 / 512MB    │
                         └────┬───┬───┬──┬──┘
                              │   │   │  │
              ┌───────────────┤   │   │  └──────────────────┐
              │               │   │   │                     │
     ┌────────▼──────┐ ┌─────▼───▼──┐ ┌────────▼──────┐ ┌──▼───────────┐
     │ ClickHouse    │ │ Qdrant     │ │ Neo4j Aura   │ │ Upstash      │
     │ Cloud         │ │ Cloud      │ │ Free/Pro     │ │ Redis        │
     │ (Serverless)  │ │ (AWS)      │ │ (AWS)        │ │ (Serverless) │
     │               │ │            │ │              │ │ (Global)     │
     └───────────────┘ └────────────┘ └──────────────┘ └──────────────┘
              │
     ┌────────▼──────┐
     │ AWS Bedrock   │ (Claude AI, us-east-1)
     └───────────────┘
```

## Component Decisions

### Frontend: Cloudflare Pages (keep as-is)
- **Why:** Free, global edge SSR, faster than CloudFront for static sites
- **Cost:** $0 (free tier: unlimited sites, 500 builds/month)
- **Peering:** 300+ edge locations, sub-50ms globally

### API: AWS Lambda + API Gateway
- **Why:** Go on Lambda has <15ms cold starts on ARM64, perfect for API
- **Runtime:** `provided.al2023` (custom runtime, Go compiled binary)
- **Architecture:** ARM64 (Graviton) — 20% cheaper than x86
- **Memory:** 512MB (more than enough for Go)
- **Timeout:** 30 seconds (advisor streaming may need longer)
- **Cost:** ~$0.20 per 1M requests + compute time
- **API Gateway:** HTTP API (not REST API) — cheaper, faster, sufficient

### ClickHouse: ClickHouse Cloud Serverless
- **Why:** Same query language we already use, serverless scales to zero
- **Region:** AWS us-east-1
- **Cost:** Free tier (10GB storage, limited compute), then ~$0.06/GB scanned
- **Use for:** Products, price history, all analytics tables

### Qdrant: Qdrant Cloud
- **Why:** Same gRPC client we already use, managed on AWS
- **Region:** AWS us-east-1
- **Cost:** Free tier (1GB, 1M vectors), then from $25/month
- **Use for:** Tool/project embeddings, semantic search

### Neo4j: Neo4j Aura
- **Why:** Same Bolt driver we already use, managed on AWS
- **Region:** AWS us-east-1 (available on Aura)
- **Cost:** Free tier (200K nodes, 400K relationships), then from $65/month
- **Use for:** Ecosystem graph, tool-project relationships

### Redis: Upstash
- **Why:** True serverless (per-request pricing), global replication, REST + Redis protocol
- **Region:** AWS us-east-1 (primary), global read replicas
- **Cost:** Free tier (10K commands/day), then $0.2 per 100K commands
- **Use for:** API response caching, search result caching

### AI: AWS Bedrock (Claude)
- **Why:** Already planned, same region, no cold start
- **Region:** us-east-1
- **Cost:** Per token (Sonnet: $3/$15 per 1M tokens input/output)
- **Use for:** Advisor feature

## Monthly Cost Estimates

### At launch (0-1K visitors/day)
| Service | Cost |
|---|---|
| Cloudflare Pages | $0 |
| Lambda + API Gateway | $0 (free tier: 1M requests/month) |
| ClickHouse Cloud | $0 (free trial) |
| Qdrant Cloud | $0 (free tier) |
| Neo4j Aura | $0 (free tier) |
| Upstash Redis | $0 (free tier) |
| Bedrock (Claude) | ~$5-20 (depends on advisor usage) |
| **Total** | **~$5-20/month** |

### Growth (5-10K visitors/day)
| Service | Cost |
|---|---|
| Cloudflare Pages | $0 |
| Lambda + API Gateway | ~$5 |
| ClickHouse Cloud | ~$30 |
| Qdrant Cloud | ~$25 |
| Neo4j Aura | $0 (free tier still sufficient) |
| Upstash Redis | ~$10 |
| Bedrock (Claude) | ~$50-100 |
| **Total** | **~$120-170/month** |

## Lambda Adaptation

The Go API needs minor changes to run on Lambda:

1. Replace `http.ListenAndServe` with `lambda.Start(handler)`
2. Use `github.com/awslabs/aws-lambda-go-api-proxy/chi` adapter
3. Chi router works unchanged — the adapter translates API Gateway events to `http.Request`
4. Connection pooling handled differently (connections reused across warm invocations)
5. Database connections initialized in `init()` function (reused across invocations)

## Environment Variables (Lambda)

```
CLICKHOUSE_DSN=clickhouse://...@xxx.clickhouse.cloud:8443/litp?secure=true
QDRANT_HOST=xxx.qdrant.io
QDRANT_PORT=6334
NEO4J_URI=neo4j+s://xxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=...
UPSTASH_REDIS_URL=rediss://...@xxx.upstash.io:6379
AWS_REGION=us-east-1
BEDROCK_MODEL=anthropic.claude-sonnet-4-6-20250514-v1:0
COHERE_API_KEY=...
```
