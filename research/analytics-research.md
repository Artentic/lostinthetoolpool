# Analytics Solutions Research — lostinthetoolpool.com

**Date:** 2026-04-02  
**Context:** SvelteKit affiliate site on Cloudflare Pages, Go backend, ClickHouse already in stack.  
**Requirement:** Detailed behavioral tracking, session replay, heatmaps, funnel analysis, GDPR-compliant (EU/Belgium company), ideally no cookie banners.

---

## 1. PostHog (RECOMMENDED — Primary Platform)

**What it is:** Open-source, all-in-one product analytics platform. Analytics, session replay, heatmaps, feature flags, A/B testing, surveys, error tracking — one tool.

**Pricing:**
- Free tier: 1M analytics events/month, 5K session recordings/month, 1M feature flag requests
- After free tier: $0.00005/event (1-2M), drops to $0.000009/event at scale
- Session replay: $0.005/recording after free tier
- No credit card required for free tier

**Session Replay:** Yes — full session replay with rage click detection, network tab, console logs. Included in free tier (5K recordings/month).

**Heatmaps:** Yes — click maps, scroll maps, built into the platform.

**Custom Events:** Yes — autocapture (clicks, pageviews, form submissions without code) + custom event API for specific tracking.

**GDPR Compliance:**
- EU Cloud hosted in Frankfurt, Germany (data never leaves EU)
- Cookieless tracking mode available (`persistence: "memory"` or custom config)
- In cookieless mode: no cookie banner needed, no consent required
- SOC 2 certified, GDPR-ready, HIPAA-ready
- Open source — you can audit the code
- **Trade-off in cookieless mode:** Users appear as different people each day (inflated user counts), cannot use `identify()`. Session replay still works within a single session.

**Self-Hosting:** Yes — Docker one-liner for hobby instance. However, PostHog recommends Cloud for production (self-hosted limited to ~100K events/month before performance issues).

**SvelteKit Integration:** Official SDK and documentation. Install `posthog-js`, initialize in `+layout.js` with browser check. Supports SSR. Has SvelteKit-specific reverse proxy guide for ad-blocker bypass. One gotcha: must disable relative asset paths in `svelte.config.js` for session replay to work.

**Pros for our use case:**
- Single platform replaces 3-4 tools
- Autocapture means instant tracking of all button clicks, link clicks, product cards
- Funnel analysis built in (search → product view → affiliate click)
- Can track affiliate redirect clicks as custom events
- EU hosting = no GDPR headaches
- Feature flags useful for A/B testing different recommendation layouts
- Free tier is generous enough for launch and early growth

**Cons:**
- Cookieless mode inflates user counts (acceptable trade-off vs cookie banners)
- Self-hosted is not recommended for production scale
- Can get expensive at scale (10M events/month ≈ $500/month)
- Heavier script than privacy-focused alternatives (~100KB vs ~1KB)

---

## 2. Plausible Analytics

**What it is:** Lightweight, privacy-first web analytics. Cookie-free by design. EU-made (Estonia).

**Pricing:** Starts at $9/month based on pageviews. No free tier (free trial only).

**Session Replay:** No. Explicitly out of scope — will never be added.

**Heatmaps:** No. Explicitly out of scope.

**Custom Events:** Yes — goals and custom events via API. Limited compared to PostHog/Mixpanel.

**GDPR Compliance:** Best-in-class.
- Zero cookies, no local storage, no browser cache
- No personal data collected
- No cookie banner needed, period
- EU-hosted (Estonia), data never leaves EU
- CNIL-compliant
- Script is ~1KB

**Self-Hosting:** Yes — fully open source, self-hostable with Docker.

**SvelteKit Integration:** Simple script tag. No special SDK needed. Works with SSR out of the box.

**Pros:** Absolute lightest touch. Perfect privacy compliance. Clean dashboard for basic metrics.

**Cons:** No session replay, no heatmaps, no funnels, no behavioral analytics. Only tells you WHAT happened (pageviews, referrers), not WHY. Useless for optimizing affiliate conversion funnels. Not sufficient as a standalone solution for our needs.

**Verdict:** Good complement for public-facing vanity metrics dashboard, but cannot be the primary tool.

---

## 3. Umami

**What it is:** Open-source, privacy-focused web analytics. Similar to Plausible but fully free to self-host.

**Pricing:**
- Self-hosted: Free (unlimited)
- Cloud: Free for 1M events/month, then $0.00002/event

**Session Replay:** No.

**Heatmaps:** No. Feature request exists but explicitly out of scope.

**Custom Events:** Yes — track custom events with properties. API available.

**GDPR Compliance:** Cookie-free, no personal data, GDPR-compliant out of the box. Script ~2KB.

**Self-Hosting:** Yes — Docker Compose, supports PostgreSQL and MySQL. Very lightweight, runs on a $3/month VPS.

**SvelteKit Integration:** Script tag. Simple. No SSR issues.

**Pros:** Completely free self-hosted. Very lightweight. Good custom events API. We already have the infrastructure (Docker).

**Cons:** Same as Plausible — no session replay, no heatmaps, no funnels, no behavioral depth. Client-side only — weak server-side tracking. Not enough for affiliate conversion optimization.

**Verdict:** Could replace Plausible as free alternative for basic web analytics, but still needs to be paired with a behavioral tool.

---

## 4. Mixpanel

**What it is:** Cloud-based product analytics focused on event tracking, funnels, retention analysis.

**Pricing:**
- Free: 1M events/month, 10K session replays/month, 5 saved reports, 30 AI queries/month
- Growth: Starts free (first 1M events free), then $0.28/1K events. 20K session replays. Unlimited reports.
- Enterprise: Custom pricing. Unlimited events.
- Startup program: First year free if <5 years old, <$8M funding

**Session Replay:** Yes — added in late 2025. AI-powered replay summaries. 10K/month on free tier.

**Heatmaps:** Yes — heatmap comparison mode added late 2025.

**Custom Events:** Yes — manual instrumentation required (no autocapture). Gives cleaner data but more setup work.

**GDPR Compliance:** SOC 2 certified, GDPR-ready, EU data residency available. But uses cookies by default — requires cookie consent in EU. You configure compliance; Mixpanel provides the tools.

**Self-Hosting:** No.

**SvelteKit Integration:** JavaScript SDK. Works fine. No SvelteKit-specific docs.

**Pros:** Strong funnel analysis. Good free tier. Session replay now included. AI-powered insights. Excellent for understanding conversion paths.

**Cons:**
- Requires cookie consent in EU (needs cookie banner)
- No autocapture — every event must be manually instrumented
- No self-hosting
- Gets expensive quickly past free tier ($0.28/1K events = $280/month at 1M events)
- Overkill for our stage; better suited for larger product teams

**Verdict:** Strong product analytics but cookie requirement is a dealbreaker for our "no banner" goal. More expensive than PostHog for similar features.

---

## 5. Amplitude

**What it is:** Enterprise-grade product analytics with session replay, feature flags, experimentation.

**Pricing:**
- Starter (free): 50K MTUs, 10M events, 1K session replays/month
- Plus: $49/month for 300K MTUs, 25M events, 10K session replays
- Growth: $500-2,000+/month (custom)
- Enterprise: $2,000-10,000+/month (custom)

**Session Replay:** Yes — built-in, privacy-first. Available on free tier (1K/month).

**Heatmaps:** Limited — not a core feature like Hotjar/PostHog.

**Custom Events:** Yes — strong event tracking with behavioral cohorts.

**GDPR Compliance:** SOC 2 Type 2, GDPR, HIPAA, CCPA, Privacy Shield. EU data residency. But uses cookies — needs consent banner.

**Self-Hosting:** No.

**SvelteKit Integration:** JavaScript SDK. No SvelteKit-specific docs.

**Pros:** Deep analytics, predictive insights, strong segmentation. Good free tier.

**Cons:**
- Cookie-based — needs consent banner in EU
- No self-hosting
- Very expensive at scale
- Overkill for our stage — designed for large product teams
- Free tier session replay limit (1K/month) is very low
- Complex setup, steep learning curve

**Verdict:** Too heavy, too expensive, needs cookie consent. Not the right fit.

---

## 6. Matomo

**What it is:** Open-source Google Analytics alternative. Self-hostable. EU-focused.

**Pricing:**
- Self-hosted core: Free
- Heatmap & Session Recording plugin: €219/year (up to 4 users), €439/year (5-15 users)
- Other premium plugins (funnels, A/B testing): ~€229/year each
- Cloud: From €19/month (includes all premium features)
- Total self-hosted with all plugins: Easily €600-900/year

**Session Replay:** Yes — via premium plugin (not free).

**Heatmaps:** Yes — via premium plugin (not free).

**Custom Events:** Yes — comprehensive event tracking.

**GDPR Compliance:** Best-in-class for traditional analytics.
- Endorsed by CNIL (French DPA) and multiple EU data protection authorities
- Cookie-less tracking mode with IP anonymization
- Can be configured to not need consent banner
- Full data ownership when self-hosted

**Self-Hosting:** Yes — but resource-intensive. PHP/MySQL stack. Can be expensive to host at scale.

**SvelteKit Integration:** JavaScript tracker. Works fine. No SvelteKit-specific docs.

**Pros:** GDPR gold standard. Full GA replacement. Data ownership. EU authorities love it.

**Cons:**
- Premium plugins add up (€600-900/year for full feature set)
- PHP stack — doesn't fit our Go/Docker infrastructure
- Self-hosted Matomo is resource-hungry and maintenance-heavy
- UI feels dated compared to PostHog/Mixpanel
- Session replay quality is inferior to dedicated tools
- Plugin ecosystem can be clunky

**Verdict:** Solid GDPR story but the PHP stack, plugin costs, and maintenance burden make it a poor fit. PostHog does everything Matomo does, better, with a more modern stack.

---

## 7. Microsoft Clarity (RECOMMENDED — Free Complement)

**What it is:** Free heatmap and session replay tool from Microsoft. Completely free, forever, no limits.

**Pricing:** Free. No paid tiers. No limits on sessions, users, or sites.

**Session Replay:** Yes — unlimited recordings. 30-day retention (small sample kept up to 13 months). Rage click detection, dead click detection, excessive scrolling detection.

**Heatmaps:** Yes — click maps, scroll maps, area maps. Unlimited.

**Custom Events:** Limited — primarily automatic behavioral signals (rage clicks, dead clicks, quick backs). Can integrate with GA4 for custom events.

**GDPR Compliance:** PROBLEMATIC.
- Requires explicit opt-in consent before tracking in EU (Microsoft mandated this in 2025)
- Cloud-only — data stored on Microsoft Azure (US servers)
- No self-hosting option
- No cookie-free mode
- Auto-masks sensitive fields but still needs cookie banner

**Self-Hosting:** No.

**SvelteKit Integration:** Script tag. Simple. Works everywhere.

**Pros:**
- Completely free and unlimited — unbeatable value
- Heatmaps and session replay quality is excellent
- Rage click and dead click detection built in
- Copilot AI for summarizing sessions
- Zero cost even at massive scale

**Cons:**
- Needs cookie consent in EU — cannot run without banner
- No self-hosting
- No custom event tracking (behavior signals only)
- No funnel analysis
- No product analytics
- Data on US servers
- 30-day recording retention

**Verdict:** If we implement a cookie consent banner (which we'd need for affiliate tracking cookies anyway), Clarity is a no-brainer free addition for heatmaps and session replay. The quality rivals Hotjar at zero cost.

---

## 8. Hotjar

**What it is:** Heatmaps, session replay, surveys, and feedback tool. Now part of Contentsquare.

**Pricing:**
- Free (Observe): 35 daily sessions. Very limited.
- Plus: $39/month (100 sessions/day)
- Business: $99/month (500 sessions/day)
- Scale: $213+/month (500+ sessions/day, funnels, API)

**Session Replay:** Yes — good quality. Rage click detection. But daily session caps are harsh.

**Heatmaps:** Yes — click, move, scroll maps. Industry standard.

**Custom Events:** Yes — via Events API on paid plans.

**GDPR Compliance:** GDPR-compliant with consent integration. EU data centers available. Cookie-based — needs consent banner.

**Self-Hosting:** No.

**SvelteKit Integration:** Script tag. Simple.

**Pros:** Good heatmaps and session replay. Well-known tool. Surveys built in.

**Cons:**
- Expensive for what you get (Microsoft Clarity does 80% of this for free)
- Harsh daily session limits on free/lower tiers
- Needs cookie consent
- No product analytics, no funnels on cheaper plans
- Now part of Contentsquare — pricing trajectory is upward

**Verdict:** Hard to justify when Microsoft Clarity is free and PostHog includes heatmaps. Skip.

---

## 9. Google Analytics 4

**What it is:** Google's analytics platform. Industry standard but increasingly problematic in EU.

**Pricing:** Free (standard). GA360 from $50K/year.

**Session Replay:** No.

**Heatmaps:** No.

**Custom Events:** Yes — comprehensive event model.

**GDPR Compliance:** ACTIVELY PROBLEMATIC.
- Multiple EU DPAs have ruled GA violates GDPR (Austria, France, Italy)
- Requires explicit consent before any tracking
- Must implement Consent Mode v2
- Must sign DPA with Google
- Data transfers to US remain legally questionable
- €150M fine to SHEIN by CNIL in 2026 for consent violations
- Enforcement is escalating, not decreasing

**Self-Hosting:** No.

**SvelteKit Integration:** gtag.js script. Well-documented.

**Pros:** Free. Huge ecosystem of tools and knowledge. Best acquisition/attribution analysis.

**Cons:**
- Legal minefield in EU for a Belgian company
- Mandatory cookie consent banner with proper blocking CMP
- Google uses data for its own purposes
- Complex setup for proper GDPR compliance
- Data sampling on free tier at scale
- No session replay or heatmaps

**Verdict:** The GDPR risk is unacceptable for a Belgian company. The legal landscape has gotten worse, not better. Avoid as primary analytics. Only consider if you absolutely need Google Ads integration.

---

## 10. ClickHouse Custom Analytics (Already in Stack)

**What it is:** Build your own analytics on top of our existing ClickHouse instance.

**Pricing:** Free (we already run it). Only infrastructure cost.

**Session Replay:** No — would need to build from scratch (months of work, not worth it).

**Heatmaps:** No — would need to build from scratch.

**Custom Events:** Yes — we design the schema. Maximum flexibility.

**GDPR Compliance:** Perfect — we control everything. No third-party data sharing. Cookie-free by design.

**Self-Hosting:** Already self-hosted.

**SvelteKit Integration:** Custom — send events to our Go API, which writes to ClickHouse.

**What we should track in ClickHouse (per our existing data model):**
- Search queries (query text, timestamp, session_id, results shown, clicked product)
- Affiliate click tracking (SKU, retailer, timestamp, session_id, referrer)
- Product view events
- Ecosystem selection events
- Advisor query logs
- Price history data
- Aggregated analytics (top searches, conversion rates, popular ecosystems)

**Pros:**
- Zero additional cost
- Complete data ownership
- No GDPR concerns — no third-party data sharing
- Cookie-free — no consent needed
- Sub-millisecond query performance
- Already in our Docker stack
- Perfect for affiliate revenue attribution
- Can build custom dashboards exactly for our needs

**Cons:**
- No session replay (build vs buy)
- No heatmaps (build vs buy)
- No visual funnel builder (must write SQL)
- Must build ingestion pipeline and dashboard UI
- Maintenance burden

**Verdict:** Essential for our core business metrics (search analytics, affiliate clicks, revenue attribution). Already planned in our architecture. But insufficient alone for UX optimization — pair with PostHog or Clarity for behavioral insights.

---

## Recommendation: The Stack

### Primary: PostHog (EU Cloud) — Behavioral Analytics & Product Intelligence

**Why:** Single platform covers analytics, session replay, heatmaps, funnels, feature flags. EU-hosted. Cookieless mode available. Official SvelteKit support. Free tier covers our launch phase.

**Configuration:**
- Use PostHog EU Cloud (Frankfurt)
- Enable cookieless tracking mode (no banner needed for PostHog itself)
- Use autocapture for all clicks and pageviews
- Add custom events for: affiliate clicks, ecosystem selections, advisor queries, tool comparisons
- Set up funnels: search → results → product view → affiliate click
- Use feature flags for A/B testing recommendation layouts

**Cost projection:**
- Launch (0-50K users/month): Free
- Growth (50K-200K users/month): ~$50-150/month
- Scale (200K+ users/month): ~$200-500/month

### Secondary: ClickHouse Custom Analytics — Business Intelligence & Revenue

**Why:** Already in our stack. Zero additional cost. Complete control. Perfect for affiliate revenue tracking and business metrics that matter.

**What to track:**
- Every search query with results and clicks
- Every affiliate redirect with SKU, retailer, revenue
- Session-level conversion funnels (custom SQL)
- Price tracking data and deal alerts
- Ecosystem popularity trends
- Weekly/monthly business KPI dashboards

**Implementation:** Go API endpoints already planned. Add event ingestion middleware. Build Grafana dashboards on top.

### Optional Addition: Microsoft Clarity — Free Heatmaps & Session Replay

**Why:** If we end up implementing a cookie consent banner anyway (which we might need for affiliate cookies from Amazon/Home Depot), Clarity adds unlimited free heatmaps and session replay on top.

**When to add:** After launch, once we have traffic and need to optimize UX. Zero cost to add.

**Note:** Only enable for users who consent. Do not rely on this as primary analytics.

---

## What We Skip and Why

| Tool | Why Skip |
|------|----------|
| Plausible | No session replay, no heatmaps, no funnels. Too basic. |
| Umami | Same as Plausible. Would use over Plausible if we wanted free basic analytics, but PostHog covers this. |
| Mixpanel | Needs cookies. More expensive than PostHog. No autocapture. |
| Amplitude | Needs cookies. Expensive. Overkill for our stage. |
| Matomo | PHP stack doesn't fit. Plugin costs add up. Maintenance heavy. |
| Hotjar | Microsoft Clarity does the same thing for free. |
| GA4 | Legal liability for a Belgian company. Multiple EU DPA rulings against it. |

---

## Implementation Priority

1. **Week 1:** Set up PostHog EU Cloud account. Add posthog-js to SvelteKit layout. Enable autocapture. Configure cookieless mode.
2. **Week 1:** Implement ClickHouse search and affiliate click tracking in Go API (already planned in Phase 2/3).
3. **Week 2:** Configure PostHog funnels (search → product → affiliate click). Set up key custom events.
4. **Week 3:** Build Grafana dashboard on ClickHouse for business KPIs (revenue, top searches, ecosystem trends).
5. **Post-launch:** Evaluate adding Microsoft Clarity for free heatmaps if consent banner is already in place.

---

## Cost Summary

| Tool | Monthly Cost (Launch) | Monthly Cost (Scale) |
|------|----------------------|---------------------|
| PostHog EU Cloud | $0 | $200-500 |
| ClickHouse (already running) | $0 | $0 |
| Microsoft Clarity | $0 | $0 |
| **Total** | **$0** | **$200-500** |

This gives us: product analytics, session replay, heatmaps, funnels, feature flags, A/B testing, custom event tracking, affiliate revenue attribution, search analytics, and business intelligence — all GDPR-compliant, starting at zero cost.
