# Serverless Architecture — AWS us-east-1

## Overview

API on Lambda, databases on managed cloud services running on AWS infrastructure.
Same region (us-east-1), same peering, minimal latency. ClickHouse and Qdrant
billed through AWS Marketplace = one AWS bill.

```
Users (US)
   │
   ▼
┌──────────────┐     ┌──────────────────┐
│  CloudFront  │────▶│  S3 (static)     │  Frontend
│  (CDN/edge)  │     └──────────────────┘
└──────┬───────┘
       │ /api/*
       ▼
┌──────────────┐
│ API Gateway  │  HTTP API
│ (us-east-1)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Lambda     │  Go, ARM64, 512MB
│ (us-east-1)  │
└──┬──┬──┬──┬──┘
   │  │  │  │
   ▼  ▼  ▼  ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ClickHouse│ │  Qdrant  │ │  Neo4j   │ │  Redis   │ │ Bedrock  │
│  Cloud   │ │  Cloud   │ │  Aura    │ │(Upstash) │ │ (Claude) │
│          │ │          │ │          │ │          │ │          │
│ Products │ │ Vectors  │ │  Graph   │ │  Cache   │ │ Advisor  │
│Analytics │ │ Search   │ │Ecosystem │ │          │ │          │
│ Prices   │ │          │ │Relations │ │          │ │          │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
  AWS infra    AWS infra    AWS infra    AWS infra     AWS native
  us-east-1    us-east-1    us-east-1    us-east-1     us-east-1
```

## Where Everything Runs

| Service | Provider | Infra | Region | Billing |
|---|---|---|---|---|
| **Lambda** | AWS | AWS | us-east-1 | AWS bill |
| **API Gateway** | AWS | AWS | us-east-1 | AWS bill |
| **CloudFront + S3** | AWS | AWS | Global/us-east-1 | AWS bill |
| **ClickHouse** | ClickHouse Cloud | **AWS** | us-east-1 | AWS Marketplace |
| **Qdrant** | Qdrant Cloud | **AWS** | us-east-1 | AWS Marketplace |
| **Neo4j** | Neo4j Aura | **AWS** | us-east-1 | AWS Marketplace |
| **Redis** | Upstash | **AWS** | us-east-1 | AWS Marketplace |
| **Bedrock** | AWS | AWS | us-east-1 | AWS bill |
| **Route 53** | AWS | AWS | Global | AWS bill |

**Key:** ClickHouse Cloud, Qdrant Cloud, Neo4j Aura, and Upstash all run on AWS
infrastructure and are available through the AWS Marketplace. This means:
- Same physical network as Lambda (sub-1ms latency within us-east-1)
- Billed on your AWS account (consolidated billing)
- No separate vendor accounts needed if purchased via Marketplace

## Why These Specific Databases

| Database | Why Not a Generic AWS Service |
|---|---|
| **ClickHouse** | 100x faster than Athena for analytics. Column-oriented, perfect for "top searches this week" instant queries. DynamoDB can't aggregate. |
| **Qdrant** | Purpose-built vector DB. OpenSearch Serverless has $25/mo minimum AND k-NN is slower. Qdrant free tier = 1GB, plenty for launch. |
| **Neo4j** | Ecosystem → Tool → Battery → Project relationships are naturally a graph. DynamoDB can model this but queries become ugly. Aura free tier = 200K nodes. |
| **Redis/Upstash** | Sub-millisecond cache. DynamoDB with TTL works but adds 5-10ms per cache read. Redis: <1ms. Critical for the 50ms API response target. |

## Cost Estimates

### Launch ($0 — 1K visitors/day)
| Service | Cost |
|---|---|
| CloudFront + S3 | $0 (free tier) |
| Lambda + API Gateway | $0 (free tier) |
| ClickHouse Cloud | $0 (30-day trial, then ~$47/mo for smallest) |
| Qdrant Cloud | $0 (free tier: 1GB) |
| Neo4j Aura | $0 (free tier: 200K nodes) |
| Upstash Redis | $0 (free tier: 10K cmds/day) |
| Bedrock | ~$5-20 |
| Route 53 | $0.50 |
| **Total** | **~$5-20/month** |

### After ClickHouse trial ($47/mo minimum)
| Service | Cost |
|---|---|
| ClickHouse Cloud | $47 (smallest serverless) |
| Everything else | ~$5-20 |
| **Total** | **~$50-70/month** |

### Growth (10K visitors/day)
| Service | Cost |
|---|---|
| ClickHouse Cloud | ~$60 |
| Qdrant Cloud | ~$25 (past free tier) |
| All AWS services | ~$30 |
| Bedrock | ~$50-150 |
| Upstash | ~$10 |
| **Total** | **~$175-275/month** |

## Lambda Deployment

Go on Lambda ARM64 (Graviton):
- Cold start: <15ms (Go is the fastest Lambda runtime)
- Warm invocation: <1ms overhead
- DB connections initialized in `init()`, reused across invocations
- Chi router works unchanged via `aws-lambda-go-api-proxy`
- No VPC needed (all databases have public endpoints)

## Environment Variables

```bash
CLICKHOUSE_DSN=clickhouse://default:PASSWORD@HOST.clickhouse.cloud:8443/litp?secure=true
QDRANT_HOST=HOST.cloud.qdrant.io
QDRANT_PORT=6334
NEO4J_URI=neo4j+s://HOST.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxx
REDIS_URL=rediss://default:PASSWORD@HOST.upstash.io:6379
AWS_REGION=us-east-1
BEDROCK_MODEL=anthropic.claude-sonnet-4-6-20250514-v1:0
COHERE_API_KEY=xxx
```
