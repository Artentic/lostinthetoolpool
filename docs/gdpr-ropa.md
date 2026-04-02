# Record of Processing Activities (ROPA)
## GDPR Article 30 — CYBERNITED / lostinthetoolpool.com

**Data Controller:** CYBERNITED, Belgium
**Contact:** privacy@lostinthetoolpool.com
**Date:** April 2, 2026

---

## Processing Activity 1: Website Analytics

| Field | Details |
|---|---|
| **Purpose** | Understand user behavior to improve tool recommendations and site UX |
| **Categories of data subjects** | Website visitors |
| **Categories of personal data** | IP address (hashed), device info, page views, click events, scroll depth, search queries, session recordings |
| **Legal basis** | Legitimate interest (Art. 6(1)(f)) |
| **Recipients** | PostHog EU (processor), internal ClickHouse database |
| **International transfers** | None — PostHog EU in Frankfurt, ClickHouse self-hosted in EU |
| **Retention period** | 24 months (session recordings: 90 days) |
| **Technical measures** | Cookieless mode, no PII stored in identifiable form, encrypted in transit (TLS) |

## Processing Activity 2: Affiliate Click Tracking

| Field | Details |
|---|---|
| **Purpose** | Track affiliate link clicks for revenue attribution |
| **Categories of data subjects** | Website visitors who click affiliate links |
| **Categories of personal data** | Session identifier (non-personal), clicked product, retailer, referring page |
| **Legal basis** | Legitimate interest (Art. 6(1)(f)) |
| **Recipients** | Internal ClickHouse database, affiliate networks (upon redirect) |
| **International transfers** | Affiliate networks may process data in US (Amazon, Home Depot) — redirect only, no data sent by us |
| **Retention period** | 24 months |
| **Technical measures** | Session IDs are randomly generated per browser session, not linked to identity |

## Processing Activity 3: AI-Powered Recommendations

| Field | Details |
|---|---|
| **Purpose** | Generate personalized tool recommendations based on user project descriptions |
| **Categories of data subjects** | Website visitors using the advisor feature |
| **Categories of personal data** | Free-text project descriptions, search queries |
| **Legal basis** | Legitimate interest (Art. 6(1)(f)) |
| **Recipients** | AWS Bedrock (Claude AI), Cohere (embedding API) |
| **International transfers** | US — AWS Bedrock (Standard Contractual Clauses), Cohere (Standard Contractual Clauses) |
| **Retention period** | Queries logged for 24 months (anonymized after 12 months). AI providers do not retain data beyond request processing |
| **Technical measures** | No PII expected in queries. Queries contain project descriptions only. TLS encryption |

## Processing Activity 4: Email Newsletter

| Field | Details |
|---|---|
| **Purpose** | Send tool deal alerts, project guides, and newsletter content |
| **Categories of data subjects** | Subscribers who opt in |
| **Categories of personal data** | Email address |
| **Legal basis** | Consent (Art. 6(1)(a)) — double opt-in |
| **Recipients** | ConvertKit (processor) |
| **International transfers** | US — ConvertKit (Standard Contractual Clauses) |
| **Retention period** | Until unsubscribe + 30 days for processing |
| **Technical measures** | Double opt-in, one-click unsubscribe, TLS encryption |

## Processing Activity 5: Website Hosting

| Field | Details |
|---|---|
| **Purpose** | Serve website content to visitors |
| **Categories of data subjects** | All website visitors |
| **Categories of personal data** | IP address, request headers (standard HTTP) |
| **Legal basis** | Legitimate interest (Art. 6(1)(f)) — necessary for website operation |
| **Recipients** | Cloudflare (processor) |
| **International transfers** | Cloudflare processes at nearest edge location — may include non-EU. DPA in place |
| **Retention period** | Access logs: 72 hours (Cloudflare default) |
| **Technical measures** | TLS encryption, DDoS protection, no logging beyond standard CDN operation |

---

## Data Processing Agreements Required

| Processor | Status | DPA Source |
|---|---|---|
| PostHog EU | Required | Available in PostHog dashboard settings |
| Cloudflare | Required | Part of Cloudflare Enterprise/Pro terms |
| AWS (Bedrock) | Required | AWS Data Processing Addendum |
| ConvertKit | Required | ConvertKit GDPR DPA |
| Cohere | Required | Cohere Terms of Service / DPA |

## Data Protection Impact Assessment (DPIA)

A lightweight DPIA is recommended for the AI advisor feature, as it involves automated decision-making that generates personalized recommendations. However, since:
- No sensitive data categories are processed
- No automated decisions with legal or similarly significant effects are made
- Users can freely ignore recommendations
- No profiling based on personal characteristics occurs

A full DPIA is not strictly required under Article 35, but documenting this assessment is good practice.

## No DPO Required

CYBERNITED does not require a Data Protection Officer because:
- Data processing is not a core business activity (tool recommendations are; data processing supports this)
- No large-scale processing of sensitive data categories
- No systematic monitoring of individuals at large scale
