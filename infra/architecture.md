# Lost in the Tool Pool — Infrastructure Architecture

## The Big Picture

```
                            USERS (US)
                               │
                               ▼
                     ┌───────────────────┐
                     │    CloudFront     │  CDN / Edge cache
                     │   (global edge)   │  Cache-Control on GET responses
                     └────────┬──────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
          Static assets              API requests
          (HTML/CSS/JS)              (/api/v1/*)
                 │                         │
                 ▼                         ▼
        ┌──────────────┐         ┌──────────────────┐
        │  S3 Bucket   │         │  ALB (public)    │  Application Load Balancer
        │  (frontend)  │         │  lostinthetool   │  Routes to Fargate
        └──────────────┘         │  pool.com/api/*  │  SSL termination
                                 └────────┬─────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │   ECS Fargate          │
                              │   (us-east-1)          │
                              │                        │
                              │   Go API Server        │
                              │   0.25 vCPU / 512MB    │
                              │   ARM64 (Graviton)     │
                              │   Fargate Spot         │
                              │                        │
                              │   ┌──────────────┐     │
                              │   │ In-memory    │     │
                              │   │ cache (Go)   │     │
                              │   └──────────────┘     │
                              └──┬──┬──┬──────────┬────┘
                                 │  │  │          │
              ┌──────────────────┘  │  └───┐      └──────────────┐
              │                     │      │                     │
              ▼                     ▼      ▼                     ▼
     ┌─────────────────┐  ┌──────────────┐ ┌──────────────┐ ┌──────────┐
     │ ClickHouse Cloud│  │ Qdrant Cloud │ │  Neo4j Aura  │ │ Bedrock  │
     │ (AWS us-east-1) │  │(AWS us-east-1│ │(AWS us-east-1│ │ (Claude) │
     │                 │  │              │ │              │ │          │
     │ Products        │  │ Tool vectors │ │ Ecosystem    │ │ Advisor  │
     │ Price history   │  │ Project vecs │ │ graph        │ │ feature  │
     │ Analytics       │  │ Semantic     │ │ Brands       │ │          │
     │ Search logs     │  │ search       │ │ Categories   │ │          │
     │ Affiliate clicks│  │              │ │ Projects     │ │          │
     └─────────────────┘  └──────────────┘ │ Relationships│ └──────────┘
                                           └──────────────┘
```

## Data Ingestion Pipeline (Hetzner)

```
┌─────────────────────────────────────────────────────────────────────┐
│                     HETZNER CLOUD (EU)                              │
│                     Cheap compute, unlimited bandwidth              │
│                                                                     │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────────┐    │
│  │  Scrapers   │───▶│  Normalizer  │───▶│  Staging ClickHouse │    │
│  │             │    │              │    │  (local, for QA)    │    │
│  │ • Amazon    │    │ • Dedupe     │    │                     │    │
│  │   PA-API    │    │ • Map to     │    │  Verify data before │    │
│  │ • Home Depot│    │   taxonomy   │    │  pushing to prod    │    │
│  │   datafeed  │    │ • Extract    │    │                     │    │
│  │ • Lowe's    │    │   ecosystem  │    └──────────┬──────────┘    │
│  │ • Acme Tools│    │ • Clean      │               │               │
│  │ • CPO       │    │   specs      │               │               │
│  │ • Ohio PT   │    │              │               │               │
│  └─────────────┘    └──────────────┘               │               │
│                                                     │               │
│  ┌─────────────────────────────────┐               │               │
│  │  Embedding Service              │               │               │
│  │                                 │               │               │
│  │  Cohere API (embed-english-v3)  │               │               │
│  │  Batch: 96 texts per request    │               │               │
│  │  Output: 1024-dim vectors       │               │               │
│  │                                 │               │               │
│  │  Input: "{name}. {category}.    │               │               │
│  │   {description}. Specs: {specs}"│               │               │
│  └──────────────┬──────────────────┘               │               │
│                  │                                  │               │
│                  │                                  │               │
└──────────────────┼──────────────────────────────────┼───────────────┘
                   │                                  │
                   │  Push ready data                 │  Push ready data
                   │  (vectors + metadata)            │  (products + prices)
                   │                                  │
                   ▼                                  ▼
          ┌──────────────┐                   ┌─────────────────┐
          │ Qdrant Cloud │                   │ ClickHouse Cloud│
          │ (AWS)        │                   │ (AWS)           │
          └──────────────┘                   └─────────────────┘

                              also pushes
                                  │
                                  ▼
                          ┌──────────────┐
                          │  Neo4j Aura  │  (ecosystem graph updates)
                          │  (AWS)       │
                          └──────────────┘
```

## Ingestion Schedule (Hetzner cron)

```
┌──────────────────────────────────────────────────────────┐
│                    DAILY PIPELINE                         │
│                                                          │
│  02:00 UTC ─── Scrape all retailer feeds                 │
│       │                                                  │
│       ▼                                                  │
│  02:30 UTC ─── Normalize + dedupe + map to taxonomy      │
│       │                                                  │
│       ▼                                                  │
│  03:00 UTC ─── Load into staging ClickHouse              │
│       │        Run sanity checks:                        │
│       │        • Price changes > 50% → flag for review   │
│       │        • New SKUs → auto-categorize              │
│       │        • Missing products → mark inactive        │
│       │                                                  │
│       ▼                                                  │
│  03:30 UTC ─── Generate embeddings (Cohere)              │
│       │        Only for new/changed products             │
│       │        ~$0.10 per 1000 embeddings                │
│       │                                                  │
│       ▼                                                  │
│  04:00 UTC ─── Push to production                        │
│                • Products + prices → ClickHouse Cloud    │
│                • Vectors → Qdrant Cloud                  │
│                • Relationships → Neo4j Aura              │
│                                                          │
│  06:00 UTC ─── Price-only update (every 6 hours)         │
│  12:00 UTC ─── Price-only update                         │
│  18:00 UTC ─── Price-only update                         │
│                                                          │
│  SUNDAY ────── Stale product cleanup                     │
│                Remove products not seen in 14 days       │
└──────────────────────────────────────────────────────────┘
```

## Request Flow: User Searches for a Tool

```
User types: "something to cut curves in plywood"
     │
     ▼
CloudFront ── cache miss (POST request, not cached)
     │
     ▼
ALB → Fargate (Go API)
     │
     ├──1. Check in-memory cache ── miss
     │
     ├──2. Call Cohere embed API ── "something to cut curves..." → [0.12, -0.45, ...]
     │     (1024-dim vector, ~50ms)
     │
     ├──3. Search Qdrant ── k-NN similarity search
     │     Returns: jigsaw, scroll saw, band saw, oscillating tool
     │     (~20ms)
     │
     ├──4. Fetch product details from ClickHouse ── by SKU
     │     Full specs, prices, affiliate links
     │     (~5ms)
     │
     ├──5. Cache result in memory (15 min TTL)
     │
     ├──6. Log query to ClickHouse (async, non-blocking)
     │
     └──7. Return JSON response
           Total: ~80ms
```

## Request Flow: AI Advisor

```
User types: "I want to build a 12x16 deck on a budget"
     │
     ▼
CloudFront → ALB → Fargate (SSE streaming)
     │
     ├──1. Embed query with Cohere → vector
     │
     ├──2. Search Qdrant for relevant tools (top 15)
     │     Matches: circular saw, drill, impact driver, jigsaw, level...
     │
     ├──3. Search Qdrant for relevant projects (top 3)
     │     Matches: build-a-deck, build-a-fence, concrete-work
     │
     ├──4. Build context prompt with matched tools + projects
     │
     ├──5. Stream to Claude via Bedrock (SSE)
     │     System: "You are the Lost in the Tool Pool advisor..."
     │     Context: matched tools with prices, project requirements
     │     User: "I want to build a 12x16 deck on a budget"
     │
     │     Claude streams response with:
     │     • Essential tools (with specific product recs)
     │     • Recommended tools
     │     • What to rent
     │     • Safety gear
     │     • Budget ecosystem recommendation (Ryobi ONE+)
     │     • Total cost estimate
     │
     └──6. Log advisor query to ClickHouse (async)
```

## Request Flow: Affiliate Click

```
User clicks "Buy at Home Depot" on a product page
     │
     ▼
Frontend fires two events simultaneously:
     │
     ├──1. PostHog: trackAffiliateClick(sku, retailer, price, source)
     │     (for session replay, heatmaps, funnels)
     │
     ├──2. ClickHouse: logAffiliateClick(sku, retailer, url, query)
     │     (via sendBeacon — survives page navigation)
     │
     └──3. Redirect to: /api/v1/affiliate/redirect/{sku}?retailer=homedepot
           │
           ▼
      Fargate API:
           ├── Log click to ClickHouse (async)
           └── HTTP 307 redirect to Home Depot affiliate URL
                │
                ▼
           Home Depot sets their affiliate cookie
           User buys tool
           We get commission (1%)
```

## Analytics Flow

```
┌──────────────────────────────────────────────────────────┐
│                    ANALYTICS                              │
│                                                          │
│  LAYER 1: PostHog EU (Frankfurt)                         │
│  ┌────────────────────────────────────────────┐          │
│  │ • Autocapture (all clicks, page views)     │          │
│  │ • Session replay (watch users browse)      │          │
│  │ • Heatmaps (where do they click?)          │          │
│  │ • Scroll depth tracking                    │          │
│  │ • Funnels (search → view → click → buy)    │          │
│  │ • Cookieless = no banner needed            │          │
│  └────────────────────────────────────────────┘          │
│                                                          │
│  LAYER 2: ClickHouse (our own data, forever)             │
│  ┌────────────────────────────────────────────┐          │
│  │ • Every search query (+ zero-result ones)  │          │
│  │ • Every affiliate click with source page   │          │
│  │ • Product views by ecosystem               │          │
│  │ • Ecosystem selection trends               │          │
│  │ • Toolkit generation stats                 │          │
│  │ • Mobile vs desktop breakdown              │          │
│  │ • Pre-aggregated via materialized views    │          │
│  └────────────────────────────────────────────┘          │
│                                                          │
│  KEY QUERIES:                                            │
│  • "What are people searching for that returns nothing?" │
│    → Content roadmap                                     │
│  • "Which ecosystem is trending up/down?"                │
│    → Product strategy                                    │
│  • "Which page type drives the most affiliate clicks?"   │
│    → Double down on what works                           │
│  • "Mobile vs desktop: who converts better?"             │
│    → UX priorities                                       │
└──────────────────────────────────────────────────────────┘
```

## Fargate Service Configuration

```
┌──────────────────────────────────────────────────────────┐
│                ECS FARGATE SERVICE                        │
│                                                          │
│  Cluster:        litp-cluster                            │
│  Service:        litp-api                                │
│  Task Definition:                                        │
│    CPU:          256 (0.25 vCPU)                         │
│    Memory:       512 MB                                  │
│    Architecture: ARM64 (Graviton — 20% cheaper)          │
│    Capacity:     FARGATE_SPOT (70% cheaper)              │
│                                                          │
│  Container:                                              │
│    Image:        ECR → litp-api:latest                   │
│    Port:         8080                                    │
│    Health check: GET /health                             │
│    Environment:  CLICKHOUSE_DSN, QDRANT_HOST, etc.       │
│                                                          │
│  Auto Scaling:                                           │
│    Min:          1 task                                   │
│    Max:          4 tasks                                  │
│    Target:       CPU 70% average                         │
│                                                          │
│  Networking:                                             │
│    Subnets:      Public (no NAT gateway needed)          │
│    Security grp: Allow 8080 from ALB only                │
│                                                          │
│  Estimated cost:                                         │
│    Spot ARM64:   ~$3-5/month (1 task, always on)         │
│    Scaled (4):   ~$12-20/month                           │
└──────────────────────────────────────────────────────────┘
```

## Hetzner Server Configuration

```
┌──────────────────────────────────────────────────────────┐
│              HETZNER CLOUD (EU)                           │
│                                                          │
│  Server:     CX22 (2 vCPU, 4GB RAM, 40GB SSD)           │
│  Cost:       €4.49/month                                 │
│  Bandwidth:  20TB included (essentially unlimited)       │
│  OS:         Ubuntu 24.04                                │
│                                                          │
│  Installed:                                              │
│    • Go 1.22 (build + run ingestion pipeline)            │
│    • ClickHouse (local staging instance)                 │
│    • Docker (for local testing)                          │
│    • cron (scheduled pipeline runs)                      │
│                                                          │
│  Directory structure:                                    │
│    /opt/litp/                                            │
│    ├── ingester/          Go ingestion binary            │
│    ├── data/raw/          Raw retailer feeds             │
│    ├── data/normalized/   Cleaned data                   │
│    ├── data/embeddings/   Cached Cohere vectors          │
│    ├── logs/              Pipeline logs                  │
│    └── .env               API keys + DB credentials      │
│                                                          │
│  Cron:                                                   │
│    0 2 * * * /opt/litp/ingester full-pipeline            │
│    0 6,12,18 * * * /opt/litp/ingester price-update       │
│    0 3 * * 0 /opt/litp/ingester cleanup-stale            │
│                                                          │
│  Monitoring:                                             │
│    Pipeline logs → stdout (journalctl)                   │
│    Failures → email alert via simple SMTP                │
│    Dashboard: Hetzner Cloud Console                      │
└──────────────────────────────────────────────────────────┘
```

## DNS & Domains

```
┌──────────────────────────────────────────────────────────┐
│                  Route 53                                 │
│                                                          │
│  lostinthetoolpool.com                                   │
│    │                                                     │
│    ├── A (alias) ──────→ CloudFront distribution         │
│    │                     (serves S3 frontend)            │
│    │                                                     │
│    ├── api.lostinthe... → ALB                            │
│    │   CNAME               (Fargate API)                 │
│    │                                                     │
│    └── MX ─────────────→ Email provider                  │
│                           (for privacy@, legal@, etc.)   │
└──────────────────────────────────────────────────────────┘
```

## Monthly Cost Summary

```
┌──────────────────────────────────────────────────────────┐
│                  MONTHLY COSTS                           │
│                                                          │
│  AWS (Production — serving users)                        │
│  ├── Fargate Spot (ARM64)      $3-5                     │
│  ├── ALB                       $16 + usage              │
│  ├── CloudFront + S3           $0-5                     │
│  ├── Route 53                  $0.50                    │
│  ├── ECR (container images)    $0-1                     │
│  ├── Bedrock (Claude)          $5-50 (usage dependent)  │
│  └── CloudWatch Logs           $0-2                     │
│                                ─────                     │
│                        AWS:    $25-80                     │
│                                                          │
│  Managed Databases (on AWS infra, Marketplace billing)   │
│  ├── ClickHouse Cloud          $0 (trial) → $47         │
│  ├── Qdrant Cloud              $0 (free tier)           │
│  └── Neo4j Aura               $0 (free tier)           │
│                                ─────                     │
│                        DBs:    $0-47                     │
│                                                          │
│  Hetzner (Data Pipeline — runs in background)            │
│  └── CX22                     €4.49 (~$5)               │
│                                ─────                     │
│                    Hetzner:    $5                         │
│                                                          │
│  External APIs                                           │
│  ├── Cohere (embeddings)       $0-5                     │
│  └── PostHog EU (analytics)    $0 (free tier)           │
│                                ─────                     │
│                       APIs:    $0-5                      │
│                                                          │
│  ══════════════════════════════════════                   │
│  LAUNCH TOTAL:                 ~$30-90/month             │
│  AFTER CH TRIAL:               ~$75-135/month            │
│  AT 10K VISITORS/DAY:          ~$150-250/month           │
│  ══════════════════════════════════════                   │
│                                                          │
│  NOTE: ALB is the biggest fixed cost ($16/mo minimum).   │
│  Alternative: API Gateway HTTP ($0, pay-per-request)     │
│  in front of Fargate via Cloud Map. Saves $16/mo at      │
│  launch but adds complexity.                             │
└──────────────────────────────────────────────────────────┘
```

## Security

```
┌──────────────────────────────────────────────────────────┐
│                  SECURITY MODEL                          │
│                                                          │
│  CloudFront:                                             │
│    • HTTPS only (ACM certificate, auto-renewed)          │
│    • TLS 1.2+ enforced                                   │
│    • S3 Origin Access Control (no public bucket)         │
│                                                          │
│  ALB:                                                    │
│    • HTTPS termination                                   │
│    • Security group: 443 from CloudFront only            │
│                                                          │
│  Fargate:                                                │
│    • Security group: 8080 from ALB only                  │
│    • No SSH, no public IP                                │
│    • IAM task role for Bedrock access                    │
│    • Secrets in AWS Secrets Manager or SSM Params        │
│    • No VPC endpoints needed (public subnets fine —      │
│      all DBs are managed cloud with public endpoints)    │
│                                                          │
│  Databases:                                              │
│    • ClickHouse Cloud: TLS, IP allowlist                 │
│    • Qdrant Cloud: API key auth, TLS                     │
│    • Neo4j Aura: TLS, username/password                  │
│    • All credentials in Secrets Manager                  │
│                                                          │
│  Hetzner:                                                │
│    • Firewall: SSH (key only) + deny all                 │
│    • No inbound ports needed                             │
│    • Outbound only: push data to AWS databases           │
│    • API keys in /opt/litp/.env (chmod 600)              │
└──────────────────────────────────────────────────────────┘
```
