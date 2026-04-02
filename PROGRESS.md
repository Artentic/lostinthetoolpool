# Lost in the Tool Pool — Build Progress

**Last updated:** 2026-04-02
**Git commits:** 29
**Tests:** 101 across 10 packages

---

## Phase 1: Research & Intelligence Gathering — COMPLETE

| Deliverable | File | Lines | Size |
|---|---|---|---|
| Competitive Analysis | `/research/competitive-analysis.md` | 761 | 48K |
| Tool Ecosystem Deep Dive | `/research/tool-ecosystems.md` | 1,256 | 64K |
| Tool Category Taxonomy | `/research/tool-taxonomy.md` | 3,384 | 184K |
| Project-to-Tool Mapping | `/research/project-tool-mapping.md` | 1,712 | 108K |
| User Intent Research | `/research/user-intent-research.md` | 491 | 28K |
| Affiliate Program Research | `/research/affiliate-programs.md` | 849 | 40K |

**8,453 lines, 472KB of research.** 7 market gaps identified. 20 projects mapped.

---

## Phase 2: Database Architecture — COMPLETE

| File | Purpose |
|---|---|
| `database/docker-compose.yml` | ClickHouse + Qdrant + Neo4j (local dev) |
| `database/schemas/clickhouse-init.sql` | Products, price history, analytics, materialized views |
| `database/schemas/clickhouse-analytics.sql` | Extended analytics: page views, product views, ecosystem selections |
| `database/schemas/neo4j-init.cypher` | 13 brands, 19 ecosystems, 20 projects, categories, relationships |
| `database/schemas/qdrant-init.sh` | 3 vector collections: tools, projects, queries |
| `database/scripts/seed-clickhouse.sql` | Initial seed data |
| `database/docs/data-ingestion-pipeline.md` | 6-stage pipeline design |

---

## Phase 3: Backend API (Go) — COMPLETE

**Two entry points:**
- `cmd/api/main.go` — Production server (ClickHouse + Qdrant + Neo4j)
- `cmd/local/main.go` — Local server (JSON catalog, zero databases)

**API endpoints (13):**
- `GET /api/v1/projects`, `/projects/:slug`, `/projects/:slug/toolkit`
- `GET /api/v1/tools/:slug`, `/tools/:slug/prices`, `/tools/compare`
- `GET /api/v1/ecosystems`, `/ecosystems/:slug`, `/ecosystems/:slug/starter-kit`
- `POST /api/v1/search`, `POST /api/v1/advisor`
- `GET /api/v1/categories`, `GET /api/v1/brands`, `GET /api/v1/stats`
- `GET /api/v1/affiliate/redirect/:sku`
- `POST /api/v1/analytics/*` (6 analytics endpoints)

**Packages:**

| Package | Files | Tests | Purpose |
|---|---|---|---|
| `cmd/api` | 1 | — | Production server entry point |
| `cmd/local` | 1 | — | Local JSON-based server |
| `cmd/seed` | 2 | 6 | Load product JSON → ClickHouse |
| `cmd/merge` | 1 | — | Merge + deduplicate product files |
| `cmd/normalize` | 1 | — | Fix ecosystem/category naming |
| `internal/cache` | 2 | 11 | Sharded in-memory cache (126ns/get, 0 allocs) |
| `internal/config` | 2 | 4 | Environment-based config |
| `internal/database` | 3 | — | ClickHouse, Neo4j, Qdrant clients |
| `internal/handler` | 9 | 23 | HTTP handlers + integration test |
| `internal/ingester` | 2 | 12 | Product normalization, classification, dedup |
| `internal/ingester/sources` | 4 | 17 | Source registry + change monitor |
| `internal/middleware` | 2 | 3 | Request logging |
| `internal/model` | 2 | 7 | Data models |
| `internal/service` | 7 | 9 | Business logic (product, ecosystem, project, search, advisor, analytics, embedding) |
| `internal/store` | 2 | 11 | In-memory JSON store with indexed lookups + text search |

**Total: 101 tests, all passing. Backend compiles clean.**

---

## Phase 4: Frontend (SvelteKit) — COMPLETE

**Builds in 1.9s.** Cloudflare adapter output ready.

| Page | Route | Description |
|---|---|---|
| Homepage | `/` | Hero, search, project tiles, ecosystem chooser |
| Project Advisor | `/advisor` | AI conversational interface |
| Projects List | `/projects` | 20 projects with difficulty badges |
| Project Detail | `/projects/[slug]` | Toolkit, ecosystem selector, safety |
| Tool Detail | `/tools/[slug]` | Specs, features, buy buttons |
| Ecosystems List | `/ecosystems` | All ecosystems with stats |
| Ecosystem Detail | `/ecosystems/[slug]` | Strengths/weaknesses, starter kit |
| Compare | `/compare` | Side-by-side tool comparison |
| Search | `/search` | Text search with filters |
| Privacy Policy | `/legal/privacy` | GDPR + CCPA compliant |
| Terms of Service | `/legal/terms` | Liability, AI disclaimer |
| Affiliate Disclosure | `/legal/affiliate-disclosure` | FTC compliant |
| Disclaimer | `/legal/disclaimer` | Safety, liability, AI accuracy |
| Accessibility | `/legal/accessibility` | WCAG 2.1 AA target |

**Components:** Nav, Footer, SearchBar, ProductCard, DifficultyBadge, AffiliateNotice
**Design:** Dark workshop theme, Barlow Condensed + Inter, safety orange (#ff6b35) + electric blue (#4ecdc4)
**Analytics:** PostHog (cookieless, EU) + ClickHouse (25+ named events, scroll tracking, sendBeacon)

---

## Phase 5: LLM Integration — COMPLETE

| Component | File | Description |
|---|---|---|
| Embedding Service | `service/embedding.go` | Cohere embed-english-v3.0, 1024 dims, batch 96/req |
| Advisor Service | `service/advisor.go` | RAG: embed → Qdrant → context → Claude via Bedrock (SSE) |
| Search Handler | `handler/search.go` | Cohere embeddings for semantic vector search |
| Advisor Handler | `handler/advisor.go` | Sync + SSE streaming responses |

**Pipeline:** Query → Cohere embed → Qdrant k-NN → Build context with tools + projects → Claude via Bedrock → Structured toolkit response

---

## Phase 6: Marketing Strategy — COMPLETE

`marketing/strategy.md` — SEO, Reddit, YouTube, email, partnerships, conversion optimization, seasonal calendar, launch checklist. Revenue projection: $40/mo → $9,200/mo (multi-stream) by month 24.

---

## Phase 7: Analytics — COMPLETE

**Dual-layer, cookieless:**
- **PostHog EU (Frankfurt):** Autocapture, session replay, heatmaps, funnels. No cookie banner.
- **ClickHouse (own data):** 25+ named events, 6 analytics tables, materialized views for real-time dashboards.

Pre-built queries for: zero-result searches (content gaps), ecosystem trends, conversion funnels, mobile vs desktop.

---

## Phase 8: Compliance — COMPLETE

| Document | Location | Required By |
|---|---|---|
| Privacy Policy | `/legal/privacy` | GDPR, CCPA |
| Terms of Service | `/legal/terms` | Best practice |
| Affiliate Disclosure | `/legal/affiliate-disclosure` | FTC |
| Disclaimer | `/legal/disclaimer` | Best practice (safety) |
| Accessibility Statement | `/legal/accessibility` | Best practice (ADA) |
| GDPR ROPA | `docs/gdpr-ropa.md` | GDPR Article 30 |
| Safety Rules Engine | `data/safety-rules.json` | Liability mitigation |

---

## Phase 9: Infrastructure — DESIGNED

**Architecture:** `infra/architecture.md` — visual diagrams for all flows

| Component | Service | Status |
|---|---|---|
| Frontend | CloudFront + S3 | Designed |
| API | ECS Fargate Spot (ARM64) | Designed |
| Products + Analytics | ClickHouse Cloud (AWS) | Designed |
| Vector Search | Qdrant Cloud (AWS) | Designed |
| Graph | Neo4j Aura (AWS) | Designed |
| Data Pipeline | Hetzner CX22 | Designed |
| AI | AWS Bedrock (Claude) | Designed |
| DNS | Route 53 | Designed |

**Estimated cost:** $30-90/mo at launch, $150-250/mo at 10K visitors/day

---

## Phase 10: Knowledge Base — COMPLETE

### Product Catalog

| File | Products | Brands |
|---|---|---|
| `milwaukee-full.json` | 180 | Milwaukee (M18 + M12) |
| `ryobi-full.json` | 146 | Ryobi (ONE+ + 40V) |
| `dewalt-full.json` | 129 | DeWalt (20V MAX + FLEXVOLT) |
| `tier2-cordless.json` | 151 | Bosch, Ridgid, Craftsman, Kobalt, HART, Metabo HPT |
| `outdoor-brands.json` | 150 | STIHL, Husqvarna, ECHO, Greenworks, Toro, WORX |
| `specialty-brands.json` | 103 | Hilti, Festool, Dremel, Klein, Knipex, Paslode, Bostitch |
| `makita-full.json` | 83 | Makita (LXT + XGT) |
| `ego-full.json` | 56 | EGO 56V |
| + 4 curated files | 87 | Cross-ecosystem top picks |

**Merged catalog:** `data/catalog.json` — **1,039 unique products, 24 brands, 34 ecosystems, 42 categories**

### Manufacturer Spec Documents

| File | Lines | Key Data |
|---|---|---|
| `milwaukee-specs.md` | 802 | 13+ batteries, ONE-KEY, QUIK-LOK, blade compat |
| `ryobi-specs.md` | ~600 | 492+ ONE+ tools, 141+ 40V, unusual tools |
| `dewalt-specs.md` | 562 | 21 battery models, ATOMIC/XR/FLEXVOLT decoded |
| `makita-specs.md` | 611 | Star Protection, AVT, AWS tech, 350+ LXT |
| `ego-specs.md` | 538 | Battery/charger matrix, gas comparison data |
| `outdoor-brands-specs.md` | ~500 | STIHL/Husqvarna/ECHO/Greenworks/Toro/WORX |
| `specialty-brands-specs.md` | ~400 | Hilti Nuron, Festool Systainer, Paslode fuel cell |
| `source-documents.md` | 293 | 80+ manufacturer PDF URLs for pipeline ingestion |
| `retailer-category-tree.md` | 1,356 | Full Home Depot taxonomy, 170K+ SKU universe |

### Intelligence Layer

| File | Content |
|---|---|
| `tool-use-cases.json` | 45 tool types, 68 overlaps, 52 task-to-tool mappings, rent-vs-buy, danger ratings |
| `safety-rules.json` | 18 "hire a pro" triggers, PPE by task, per-tool warnings, permit flags, AI prompt rules |
| `sources.json` | 19 data sources (PDFs, scrapers, APIs, feeds) with change detection config |

---

## What's NOT Done Yet

### Critical Path to Launch

| # | Task | Status | Effort |
|---|---|---|---|
| 1 | Wire frontend to local API (real data on pages) | NOT STARTED | Medium |
| 2 | Deploy Fargate + CloudFront to AWS | NOT STARTED | Medium |
| 3 | Apply for affiliate programs (Amazon, HD, Acme) | NOT STARTED | Manual |
| 4 | Generate Cohere embeddings for 1,039 products | NOT STARTED | Small |
| 5 | Connect Qdrant Cloud for vector search | NOT STARTED | Small |
| 6 | Connect Bedrock for AI advisor | NOT STARTED | Small |
| 7 | Insert real affiliate links | NOT STARTED | Medium |
| 8 | Scrape product images from retailers | NOT STARTED | Medium |

### Data Pipeline (Hetzner)

| Task | Status |
|---|---|
| Source monitor built + tested | DONE |
| Source registry (19 sources) | DONE |
| Per-retailer scraper logic | NOT STARTED |
| PDF catalog parser | NOT STARTED |
| Scheduled cron pipeline | NOT STARTED |
| Availability/stock tracking | NOT STARTED |

### Future Expansion

| Task | Status |
|---|---|
| Hand tools catalog (wrenches, pliers, etc.) | NOT STARTED |
| Garden tools catalog | NOT STARTED |
| Safety equipment catalog | NOT STARTED |
| Tool storage/organization catalog | NOT STARTED |
| Global product availability (multi-country) | DESIGNED |
| Multi-country affiliate links | DESIGNED |

---

## Repository Structure

```
lostinthetoolpool.com/
├── backend/                    Go API (10 packages, 101 tests)
│   ├── cmd/
│   │   ├── api/                Production server (DB-backed)
│   │   ├── local/              Local server (JSON catalog)
│   │   ├── seed/               Load JSON → ClickHouse
│   │   ├── merge/              Merge + deduplicate products
│   │   └── normalize/          Fix ecosystem/category names
│   ├── internal/
│   │   ├── cache/              Sharded in-memory cache
│   │   ├── config/             Environment config
│   │   ├── database/           ClickHouse, Neo4j, Qdrant clients
│   │   ├── handler/            HTTP handlers + integration tests
│   │   ├── ingester/           Product normalization pipeline
│   │   │   └── sources/        Source registry + change monitor
│   │   ├── middleware/         Request logging
│   │   ├── model/              Data models
│   │   ├── service/            Business logic
│   │   └── store/              JSON-backed in-memory store
│   ├── Dockerfile
│   ├── Makefile
│   ├── go.mod
│   └── go.sum
├── frontend/                   SvelteKit (14 pages, builds in 1.9s)
│   ├── src/
│   │   ├── routes/             14 page routes + 5 legal pages
│   │   ├── lib/
│   │   │   ├── components/     Nav, Footer, SearchBar, ProductCard, etc.
│   │   │   ├── analytics/      PostHog + ClickHouse + scroll tracking
│   │   │   ├── api/            API client
│   │   │   └── types/          TypeScript types
│   │   └── app.css             Tailwind + custom workshop theme
│   ├── package.json
│   ├── svelte.config.js
│   └── tailwind.config.js
├── data/                       Knowledge base (2.6MB)
│   ├── catalog.json            Merged: 1,039 products
│   ├── tool-use-cases.json     45 types, 68 overlaps
│   ├── safety-rules.json       18 triggers, PPE, warnings
│   ├── sources.json            19 data sources
│   ├── products/               12 product JSON files
│   └── docs/                   9 spec/reference documents
├── database/                   Schemas + docker-compose
├── research/                   6 research documents (472KB)
├── marketing/                  Strategy doc
├── infra/                      Architecture, setup guide, task def
├── docs/                       GDPR ROPA
├── CLAUDE.md                   Build brief
└── PROGRESS.md                 This file
```
