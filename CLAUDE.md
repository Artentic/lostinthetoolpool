LOSTINTHETOOLPOOL.COM — Overnight Build Brief
What This Is
An AI-powered tool advisor for DIY homeowners and amateur builders in the US market. Users describe their project ("I want to build a deck") and the AI tells them exactly what tools they need, which battery ecosystem to invest in, and links them to the best deals — earning affiliate revenue on every click.
Brand Identity

Name: Lost in the Tool Pool
Domain: lostinthetoolpool.com
Tone: Friendly expert neighbor who actually knows tools. Not corporate, not patronizing. Think "the buddy at the hardware store who saves you from buying crap."
Visual: Bold, industrial but warm. Think dark backgrounds with bright accent colors (safety orange, Milwaukee red, DeWalt yellow). Tool-inspired typography. NOT generic SaaS clean. NOT AI-bro aesthetic. This should feel like a well-organized workshop, not a tech startup.
Logo concept: A person (stick figure or simple icon) swimming/drowning in a pool filled with tools (wrenches, drills, saws). Playful and immediately communicates the problem.


PHASE 1: Research & Intelligence Gathering
Output: /research/ directory with markdown files
1.1 Competitive Analysis
Scrape and analyze these sites. For each, document: what they do well, what they do poorly, how they monetize, their content structure, and their SEO approach.

toolboxbuzz.com (professional tool reviews)
protoolreviews.com (pro-focused reviews)
thetoolreport.com
popularmechanics.com/tools section
familyhandyman.com/tools section
homedepot.com tool categories and recommendation UX
lowes.com tool categories and recommendation UX
pcpartpicker.com (for the UX pattern — this is our model but for tools)
rtings.com (for the data-driven comparison approach)
wirecutter.com/tools section

Save as: /research/competitive-analysis.md
1.2 Tool Ecosystem Deep Dive
Research and document the major battery tool ecosystems:

Milwaukee M18 / M12 (TTI Group)
DeWalt 20V MAX / FLEXVOLT (Stanley Black & Decker)
Makita 18V LXT / 40V XGT
Ryobi ONE+ 18V / HP 40V (TTI Group — same parent as Milwaukee)
Bosch 18V
Ridgid 18V (also TTI Group)
Metabo HPT (MultiVolt)
FLEX 24V
Kobalt 24V (Lowe's exclusive)
EGO 56V (outdoor power)
Greenworks (outdoor)
Husqvarna (outdoor)
STIHL (outdoor)

For each ecosystem, document: tool count in lineup, battery compatibility/cross-compatibility, price range, warranty terms, target audience (DIY vs pro), exclusive retailers, strengths, weaknesses.
Save as: /research/tool-ecosystems.md
1.3 Tool Category Taxonomy
Build a comprehensive taxonomy of every tool category a homeowner or tradesperson might need. Organize hierarchically:
Level 1: Category (e.g., "Drilling & Driving", "Cutting", "Measuring & Layout")
Level 2: Subcategory (e.g., "Circular Saws", "Miter Saws", "Table Saws")
Level 3: Specific tool type (e.g., "7-1/4 inch Sidewinder Circular Saw")
For each tool type, document:

What it does (in plain language for a beginner)
When you need it (which projects require this tool)
Key specs that matter (watts, RPM, blade size, weight, etc.)
Price range (budget / mid / pro)
Can it be cordless? Which ecosystems offer it?
Common beginner mistakes when buying this tool
What's the alternative if you don't want to buy it? (rental, different technique, etc.)

Save as: /research/tool-taxonomy.md
1.4 Project-to-Tool Mapping
Create a comprehensive mapping of common home projects to required tools:
Projects to cover:

Build a deck
Build a fence
Bathroom renovation
Kitchen renovation
Finish a basement
Install hardwood/laminate flooring
Install tile
Build raised garden beds
Build a shed
Drywall installation and finishing
Paint a room (prep + paint)
Install crown molding / trim
Basic plumbing repairs
Basic electrical work
Hang shelves / cabinets
Assemble furniture
Car maintenance basics (brake pads, oil change, etc.)
Yard maintenance (mowing, edging, leaf blowing, hedge trimming)
Tree trimming / removal
Concrete work (small patio, walkway)

For each project:

Tools absolutely required (minimum viable toolkit)
Tools that make it much easier (nice to have)
Tools you can rent instead of buying
Estimated total tool cost (budget ecosystem vs pro ecosystem)
Difficulty level (1-5)
Time estimate for a beginner
Safety equipment needed

Save as: /research/project-tool-mapping.md
1.5 User Intent Research
Research what actual users search for. Find common queries from:

Google autocomplete for "what tools do I need to..."
Reddit r/HomeImprovement, r/DIY, r/Tools — common questions
Google "People Also Ask" for tool-related queries
YouTube search suggestions for tool comparisons

Save as: /research/user-intent-research.md
1.6 Affiliate Program Research
Document affiliate programs and commission structures for:

Amazon Associates (general — tools category)
Home Depot (via Impact Radius)
Lowe's affiliate program
Acme Tools
Tool Nut
CPO Outlets
Direct brand programs (Milwaukee, DeWalt, Makita — if they exist)
Other relevant programs

For each: commission rate, cookie duration, payment terms, any restrictions.
Save as: /research/affiliate-programs.md

PHASE 2: Database Architecture & Data Model
Output: /database/ directory with schemas, docker-compose, seed scripts
2.1 Architecture Decisions
We use three databases, each for what it's best at:
ClickHouse — Analytics and product data

Tool products (SKUs, prices, specs, ratings)
Price history tracking
User search/click analytics
Affiliate click tracking
Fast aggregations for "most popular tools for deck building"

Qdrant — Vector search

Tool descriptions embedded for semantic search
Project descriptions embedded for matching
User queries embedded for "what did you mean?" matching
Enable natural language search: "something to cut curves in plywood" → jigsaw

Neo4j — Relationship graph

Tool ecosystem relationships (which batteries work with which tools)
Tool-to-project relationships (which tools are needed for which projects)
Cross-sell / "also bought" relationships
Brand → ecosystem → tool category → specific tool hierarchy
Compatibility graph (this blade fits that saw, this bit fits that drill)

2.2 Data Model
Design comprehensive schemas for each database. Include:

Products table (ClickHouse): SKU, name, brand, ecosystem, category, subcategory, price, specs as JSON, affiliate links, rating, review count, image URLs, last_updated
Price history (ClickHouse): SKU, price, retailer, timestamp
Search analytics (ClickHouse): query, user_session, timestamp, results_shown, clicked_product
Tool embeddings (Qdrant): vector + metadata payload
Project embeddings (Qdrant): vector + metadata payload
Ecosystem graph (Neo4j): brands, ecosystems, batteries, tools, projects, compatibility edges
User sessions: session_id, queries, clicks, referrals (for analytics)

2.3 Infrastructure
Create a docker-compose.yml with:

ClickHouse (latest)
Qdrant (latest)
Neo4j (latest)
Redis (for caching — fast responses are critical)
The Go API server

Also create:

Schema initialization scripts for each database
Seed data scripts using the research from Phase 1
A data ingestion pipeline design doc

Save everything in: /database/

PHASE 3: Backend API
Output: /backend/ directory with Go application
3.1 Tech Stack

Go with chi router
ClickHouse Go client
Qdrant Go client
Neo4j Go driver
Redis for caching
API design: REST with JSON responses, keep it simple

3.2 Core Endpoints
Design and implement:
GET  /api/v1/projects                    — List all project types
GET  /api/v1/projects/:slug              — Project detail with tool requirements
GET  /api/v1/projects/:slug/toolkit      — Recommended toolkit for project + ecosystem
POST /api/v1/search                      — AI-powered natural language search
GET  /api/v1/tools/:id                   — Tool detail with specs, prices, reviews
GET  /api/v1/tools/compare?ids=1,2,3     — Side-by-side comparison
GET  /api/v1/ecosystems                  — List all battery ecosystems
GET  /api/v1/ecosystems/:slug            — Ecosystem detail with all tools in lineup
GET  /api/v1/ecosystems/:slug/starter-kit— Recommended starter kit for ecosystem
POST /api/v1/advisor                     — "Project Mode" — describe project, get full toolkit
GET  /api/v1/categories                  — Tool category tree
GET  /api/v1/affiliate/redirect/:sku     — Track click + redirect to retailer
3.3 Performance Requirements

Every API response under 50ms (use Redis caching aggressively)
Vector search under 100ms
Graph queries under 50ms
Pre-compute popular queries and cache results
Use connection pooling for all databases


PHASE 4: Frontend Website
Output: /frontend/ directory with SvelteKit application
4.1 Tech Stack

SvelteKit (SSR for SEO — critical for an affiliate site)
Tailwind CSS
Deploy target: Cloudflare Pages (edge rendering for speed)

4.2 Pages to Build
Homepage

Hero: "Tell us your project. We'll tell you what tools you need."
Search bar front and center (the main interaction)
Quick-start project cards (deck, fence, bathroom, etc.) as visual tiles
"How it works" section (3 steps: describe project → get toolkit → buy with confidence)
Trust signals (tool count, ecosystems covered, "we're not paid to rank")

Project Mode page (/advisor)

Conversational interface: user describes their project in natural language
AI responds with a structured toolkit recommendation
Each tool shows: what it is, why you need it, best option in each ecosystem, price, affiliate link
Total cost calculator that updates as you toggle ecosystems
"Skip this tool — I already own it" toggle

Project pages (/projects/build-a-deck)

SEO-optimized landing pages for each project type
Required tools with explanation
Ecosystem comparison for this project
Difficulty rating, time estimate, safety notes
Related projects

Tool detail pages (/tools/dewalt-dcs391b)

Specs, price comparison across retailers
Which projects need this tool
Ecosystem info (what battery, what charger)
Alternatives in other ecosystems
User-friendly explanation of specs ("750 watts means...")

Ecosystem pages (/ecosystems/milwaukee-m18)

Full tool lineup
Starter kit recommendations by budget
Strengths and weaknesses
Who it's best for

Comparison page (/compare)

Side-by-side tool comparison (like Rtings)
Spec-by-spec with visual indicators (green/yellow/red)

Search results page

Fast, responsive search with instant results
Semantic search: "something to cut angles" → miter saw
Filters by category, price, ecosystem

4.3 Design Requirements

Speed: Target Lighthouse score 95+. Use SSR, edge caching, lazy loading, minimal JS
Mobile first: Most traffic will be mobile (people in hardware stores searching)
Dark mode default: Dark background with bright accents. Workshop aesthetic.
Typography: Bold, industrial. Consider fonts like "Barlow Condensed" for headers, "Inter" or "DM Sans" for body. Tool labels should feel stamped/stenciled.
Color palette:

Primary: Deep charcoal (#1a1a2e)
Accent: Safety orange (#ff6b35)
Secondary: Electric blue (#4ecdc4) for interactive elements
Warning/highlight: Milwaukee red, DeWalt yellow as ecosystem brand colors


Micro-interactions: Satisfying clicks, tool icons that rotate on hover, smooth transitions
No generic stock photos: Use tool product images, workshop photography, or custom illustrations


PHASE 5: LLM Integration
Output: Integrated into backend and frontend
5.1 Search & Advisor

Use Claude API (via AWS Bedrock, eu-central-1 or us-east-1) for the advisor feature
User query → embed with Cohere → vector search Qdrant for relevant tools/projects → send context + query to Claude → structured response
Cache common queries in Redis (most people ask similar things)
Streaming responses for the advisor (feels faster)

5.2 Search Examples (show on homepage)
Display these as clickable example queries to teach users the interaction model:

"I want to build a 12x16 deck on a budget"
"What's the minimum toolkit for a bathroom reno?"
"Milwaukee vs DeWalt for a serious DIYer?"
"I need to cut a hole in drywall for a new outlet"
"Best starter kit under $500 for a new homeowner"
"What do I need to refinish hardwood floors?"

5.3 User Input Capture

Log every search query (anonymized) to ClickHouse
Track: query text, timestamp, session_id, results shown, which results clicked
Build a feedback loop: popular unanswered queries → new content to create
Weekly analytics: top queries, conversion rates, popular ecosystems


PHASE 6: Marketing Strategy
Output: /marketing/ directory with strategy doc
6.1 SEO-First Content Strategy (zero budget)

Every project page is a long-tail SEO play: "what tools do I need to build a fence"
Every tool comparison is SEO: "milwaukee m18 vs dewalt 20v max circular saw"
Every ecosystem page targets: "best [ecosystem] starter kit [year]"
Schema markup on every page (Product, HowTo, FAQ)

6.2 Reddit & Community Strategy

Be genuinely helpful on r/HomeImprovement, r/DIY, r/Tools, r/BeginnerWoodWorking
Don't spam links — answer questions thoroughly, mention the site only when directly relevant
Build reputation as the "tool ecosystem expert"

6.3 YouTube/Short-form Content Strategy

"What tools do you ACTUALLY need for [project]" — 60 second shorts
"The $500 Starter Kit Challenge" — build toolkit on a budget
"Tool Ecosystem Showdown" series — Milwaukee vs DeWalt for specific projects

6.4 Email Capture

"Get your free personalized tool checklist" — email gate the PDF version of the advisor output
Monthly newsletter: new tool releases, deal alerts, project ideas

6.5 Partnership Opportunities

Reach out to tool YouTubers for cross-promotion
Guest posts on DIY blogs
Tool brand partnerships (they want exposure too)

6.6 Conversion Optimization

Every tool recommendation has a clear "Buy at Home Depot" / "Buy at Amazon" button
Price comparison widget showing current prices across retailers
"Complete Kit" bundles with one-click to add all recommended tools to cart
Urgency: "Price dropped 12% this week" alerts from price tracking


EXECUTION ORDER
Claude should work through these phases sequentially:

Research (Phase 1) — gather all intelligence first
Database design (Phase 2) — model the data based on research
Backend API (Phase 3) — build the data layer
Frontend (Phase 4) — build the website
LLM integration (Phase 5) — wire up the AI features
Marketing strategy (Phase 6) — document the go-to-market plan

For each phase, create a PROGRESS.md file tracking what's been completed.
KEY PRINCIPLES

Speed is everything. Every page load under 1 second. Every search under 200ms.
Mobile first. People search for tools on their phones in hardware stores.
Trust through transparency. We're not paid to rank tools higher. Say this explicitly.
Beginner-friendly language. No jargon without explanation.
Opinionated recommendations. Don't give people 50 options. Give them THE answer with reasoning.
