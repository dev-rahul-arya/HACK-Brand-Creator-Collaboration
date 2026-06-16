# PRD — Proofluence
### Transparent Brand-Creator Collaboration Platform
**Hackfluence 2026 | Track: Brand-Creator Collaboration + Creator Growth + AI**

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [User Personas](#4-user-personas)
5. [Core Features](#5-core-features)
6. [Technical Architecture](#6-technical-architecture)
7. [Database Schema](#7-database-schema)
8. [API Integrations](#8-api-integrations)
9. [AI Scoring Engine](#9-ai-scoring-engine)
10. [UI/UX Specifications](#10-uiux-specifications)
11. [Team Responsibilities](#11-team-responsibilities)
12. [Sprint Checklist](#12-sprint-checklist)
13. [MVP Scope vs. Future Features](#13-mvp-scope-vs-future-features)
14. [Success Metrics](#14-success-metrics)

---

## 1. Project Overview

| Field | Details |
|---|---|
| **Product Name** | Proofluence *(alternatives: Klikk, Clairo, Influxr)* |
| **Tagline** | "Know your ROI before you spend a rupee." |
| **Hackathon** | Hackfluence 2026 |
| **Primary Track** | Brand-Creator Collaboration |
| **Secondary Tracks** | Creator Growth, Artificial Intelligence |
| **Team Size** | 4 members |
| **Prototype Deadline** | June 20–21, 2026 |
| **Target Market** | Indian creator economy (D2C brands + YouTube/Instagram creators) |

---

## 2. Problem Statement

### 2.1 For Brands
- Brands pay agencies **20–40% commission** on every influencer deal with zero transparency on how creators were selected.
- ROI is measured *after* the campaign, often only in vanity metrics (views, likes) — never in projected or actual sales.
- No standardized way to compare creators across niches, audience quality, and past performance.
- Fake followers and bot engagement inflate creator pricing with no accountability.

### 2.2 For Creators
- Creators are **underpaid** because they don't know their true market value.
- Agencies gate-keep brand deals and take a cut the creator never sees.
- No single place to prove their impact with real data to attract premium brands.
- Affiliate links and coupon codes are manually tracked in spreadsheets, losing attribution data.

### 2.3 Market Gap
> Existing tools (Grin, AspireIQ, Winkl) are expensive enterprise SaaS targeting large agencies.
> No tool exists that gives **direct, transparent, data-driven access** between indie brands and mid-tier creators (10K–500K subscribers) in the Indian market.

---

## 3. Solution

Proofluence is a **two-sided marketplace + analytics platform** that:

1. **Connects brands and creators directly** — no agency, no middleman.
2. **Scores creators using AI** — on niche fit, audience authenticity, engagement quality, and past campaign ROI.
3. **Projects profit before a campaign launches** — brands see estimated views, clicks, and sales before spending a rupee.
4. **Tracks live ROI** — via affiliate links and creator-specific coupon codes with real-time attribution.
5. **Puts creators in control of their data** — via YouTube OAuth, no unauthorized scraping.

---

## 4. User Personas

### Persona A — Brand Manager (Riya, 28)
- Runs marketing for a D2C skincare brand, ₹5Cr annual revenue
- Has ₹2–5L/month for influencer marketing
- Pain: Wasted ₹3L on a macro-influencer with fake followers last quarter
- Goal: Find 5–10 micro-creators with genuine audiences and track actual sales

### Persona B — Content Creator (Arjun, 23)
- 45K YouTube subscribers, tech + gadgets niche
- Does 2–3 brand deals/month via DMs, rates negotiated blindly
- Pain: Undercharges because he has no data to back his pricing
- Goal: Get discovered by relevant brands, track his deal earnings, prove ROI

---

## 5. Core Features

### 5.1 Creator Onboarding & Profile

**Feature: Creator Profile**
- Creator signs up via email/Google
- Connects YouTube channel via **YouTube Data API v3 OAuth**
- Optionally connects Instagram Business Account
- Profile auto-populated with: subscriber count, avg views (last 30 videos), top categories, engagement rate, audience age/gender/location breakdown
- Creator manually adds: niche tags (up to 5), base rate (per video/post), preferred brand categories, past brand collaborations

**Fields on Creator Profile:**
```
creatorId, name, bio, profilePicUrl, youtubeChannelId,
instagramHandle, nicheTag[], totalSubscribers, avgViewsLast30,
engagementRate, audienceDemographics{}, baseRatePerVideo,
preferredCategories[], createdAt, isVerified
```

---

### 5.2 AI-Powered Creator Score

Each creator gets a **Proofluence Score (0–100)** broken into 4 sub-scores:

| Sub-score | Weight | What it measures |
|---|---|---|
| Niche Clarity | 25% | How focused/consistent the content niche is |
| Audience Authenticity | 30% | Bot detection, follower/engagement ratio, comment quality |
| Engagement Quality | 25% | Saves, shares, comment depth vs. passive likes |
| Campaign ROI History | 20% | Past coupon/affiliate conversion rates (if available) |

**Score Badge Tiers:**
- 80–100: 🟢 Verified Performer
- 60–79: 🔵 Rising Creator
- 40–59: 🟡 Growing
- Below 40: 🔴 Needs Data

The AI also generates a **1-paragraph Creator Brief** for brands:
> "Arjun has a highly engaged tech audience (18–24M, tier 1–2 cities). His last 8 sponsored integrations averaged 4.2% CTR. Audience skews 72% male. Best fit for: electronics, gaming, productivity apps."

---

### 5.3 Brand-Creator Leaderboard (Discovery)

**What it is:** A ranked, filterable directory of creators sorted by Proofluence Score — brands' primary discovery surface.

**Filters:**
- Niche/Category (Tech, Beauty, Finance, Gaming, Fitness, Lifestyle, etc.)
- Subscriber range (1K–10K | 10K–100K | 100K–500K | 500K+)
- Avg views per video
- Audience location (India metro / India tier-2 / Global)
- Audience age bracket
- Budget range (creator's base rate)
- Platform (YouTube | Instagram | Both)
- Score tier

**Leaderboard Card (per creator):**
- Profile pic + name + channel link
- Subscriber count + Avg views
- Proofluence Score badge
- Top 3 niche tags
- Starting rate (₹X/video)
- "View Full Profile" + "Start Deal" CTA

---

### 5.4 Projected ROI Calculator

**Trigger:** Brand views a creator profile and clicks "Estimate ROI."

**Brand Inputs:**
- Product/service name
- Product price (₹)
- Campaign budget (₹)
- Campaign type (Integration / Dedicated / Short)
- Target action (awareness / link click / purchase)

**Platform Calculates (using creator's historical data):**

```
Projected Views       = avg_views_per_video × view_decay_factor
Projected Reach       = views × audience_authenticity_score
Estimated CTR         = historical_ctr_for_niche OR category_benchmark
Estimated Clicks      = projected_reach × estimated_ctr
Estimated Conversions = clicks × category_avg_conversion_rate
Projected Revenue     = conversions × product_price
Projected ROAS        = revenue / campaign_budget
Creator Fee           = creator_base_rate
Net ROI               = revenue - (campaign_budget + creator_fee)
```

**Output displayed as:**
- ROI Summary card: Projected Revenue, ROAS, estimated conversions
- Confidence level: High / Medium / Low (based on data availability)
- Disclaimer: "Based on historical averages. Actual results may vary."

---

### 5.5 Campaign Management

**Brand can:**
1. Create a Campaign Brief (name, product, budget, timeline, deliverables, dos/don'ts)
2. Send invite to a creator from the leaderboard
3. Negotiate (in-app messaging, simple text)
4. Approve/reject creator's content brief submission
5. Mark campaign as active / completed

**Creator can:**
1. View incoming campaign invites
2. Accept / decline with counter-offer
3. Submit content brief / script for approval
4. Mark deliverable as submitted (with content link)

**Campaign Status Flow:**
```
Draft → Invited → Negotiating → Agreed → In Progress → Delivered → Completed → Archived
```

---

### 5.6 Affiliate Link & Coupon Code Tracker

**This is the live ROI layer — the most critical feature.**

**How it works:**
1. When a deal is finalized, the platform **auto-generates** a unique:
   - Trackable affiliate link (UTM-tagged redirect): `proofluence.app/r/[creatorSlug]/[campaignId]`
   - Unique coupon code: `ARJUN15` (creator name + brand discount)
2. Brand embeds the tracking pixel/webhook OR manually logs conversions
3. Platform dashboard shows in real time:
   - Link clicks
   - Coupon redemptions
   - Revenue attributed
   - Creator's earnings (if revenue-share model)

**Affiliate Link Record:**
```
linkId, campaignId, creatorId, brandId, shortUrl, utmParams{},
totalClicks, uniqueClicks, conversions, revenueGenerated,
couponCode, couponRedemptions, createdAt
```

---

### 5.7 Dual Dashboard

#### Brand Dashboard
- Active campaigns (status, creator, spend)
- Total campaigns ROI (aggregate)
- Top performing creators (by ROAS)
- Pending invites
- Budget utilization meter
- Leaderboard shortcut

#### Creator Dashboard
- Proofluence Score with breakdown
- Active deals + status
- Pending invites from brands
- Total earnings this month / lifetime
- Affiliate link performance (clicks, conversions)
- "Boost your score" tips (e.g., post more consistently in your niche)
- Benchmarks: "Your engagement rate is 2.1× higher than average in Tech niche"

---

### 5.8 YouTube Analytics Integration

**Data pulled via YouTube Data API v3 (OAuth — creator authorizes):**

| Data Point | API Endpoint |
|---|---|
| Subscriber count | `channels.list` — `statistics.subscriberCount` |
| Total views | `channels.list` — `statistics.viewCount` |
| Video list (last 30) | `search.list` by channelId, type=video |
| Per-video views, likes, comments | `videos.list` — `statistics` |
| Video categories | `videos.list` — `snippet.categoryId` |
| Audience demographics | YouTube Analytics API — `ageGroup`, `gender`, `country` |
| Watch time | YouTube Analytics API — `estimatedMinutesWatched` |

**Engagement Rate Formula:**
```
engagement_rate = (total_likes + total_comments) / total_views × 100
(averaged across last 30 videos)
```

**Bot/Authenticity Detection (heuristic model):**
- Like-to-view ratio below 0.5% → flag
- Comment-to-view ratio below 0.05% → flag
- Sudden subscriber spike (>10% in 7 days with no viral video) → flag
- Comment sentiment diversity score (if comments are too similar → flag)

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR for SEO, fast routing |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, consistent design system |
| **Backend** | Node.js + Express (REST API) | Team familiarity, quick setup |
| **AI Layer** | Python + FastAPI | Separate microservice for scoring/analysis |
| **Database** | PostgreSQL (via Supabase) | Relational data, free tier, auth built-in |
| **Auth** | Supabase Auth + Google OAuth | Creator/Brand sign-up, YouTube OAuth |
| **File Storage** | Supabase Storage | Profile pictures, content briefs |
| **YouTube Data** | YouTube Data API v3 + YouTube Analytics API | Official, OAuth-based |
| **AI Model** | Claude API (claude-sonnet-4-6) | Creator brief generation, scoring analysis |
| **Deployment** | Vercel (Frontend) + Railway (Backend/AI) | Free tiers, fast deploy |
| **Short Links** | Custom redirect table in DB | Trackable affiliate links |

### 6.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│   Brand UI  │  Creator UI  │  Admin  │  Landing Page   │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API calls
┌──────────────────────▼──────────────────────────────────┐
│               BACKEND (Node.js / Express)               │
│  Auth  │  Campaigns  │  Creators  │  Brands  │  Links  │
└──────┬────────────────────────────────────────┬─────────┘
       │                                        │
┌──────▼──────┐                       ┌─────────▼────────┐
│  PostgreSQL  │                       │  AI Microservice │
│  (Supabase) │                       │  (Python/FastAPI)│
└─────────────┘                       │  Claude API      │
                                      │  Scoring Engine  │
┌─────────────────────────────────────└──────────────────┘
│            EXTERNAL APIs                               │
│  YouTube Data API v3  │  YouTube Analytics API        │
│  Instagram Graph API  │  Claude API                   │
└────────────────────────────────────────────────────────┘
```

### 6.3 Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# YouTube
YOUTUBE_API_KEY=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=

# Claude API
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://proofluence.vercel.app
JWT_SECRET=
```

---

## 7. Database Schema

### Tables

```sql
-- USERS (base table for both brands and creators)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('brand', 'creator')) NOT NULL,
  profile_pic_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATOR PROFILES
CREATE TABLE creator_profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  youtube_channel_id TEXT UNIQUE,
  youtube_access_token TEXT,
  youtube_refresh_token TEXT,
  instagram_handle TEXT,
  bio TEXT,
  niche_tags TEXT[],          -- e.g. ['tech', 'gadgets', 'ai']
  preferred_categories TEXT[],
  base_rate_per_video INTEGER, -- in INR
  total_subscribers INTEGER,
  avg_views_last_30 INTEGER,
  engagement_rate FLOAT,
  proofluence_score INTEGER,   -- 0-100
  score_breakdown JSONB,       -- {niche_clarity, authenticity, engagement, roi_history}
  ai_brief TEXT,               -- AI-generated creator brief
  audience_demographics JSONB, -- {age: {}, gender: {}, country: {}}
  last_synced_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT FALSE
);

-- BRAND PROFILES
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  company_name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  monthly_budget INTEGER,      -- in INR
  description TEXT
);

-- CAMPAIGNS
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id),
  creator_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price INTEGER,
  campaign_budget INTEGER,
  deliverables TEXT,           -- description of what creator must deliver
  dos TEXT,
  donts TEXT,
  status TEXT CHECK (status IN (
    'draft','invited','negotiating','agreed',
    'in_progress','delivered','completed','archived'
  )) DEFAULT 'draft',
  campaign_type TEXT CHECK (campaign_type IN ('integration','dedicated','short')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CAMPAIGN MESSAGES (in-app negotiation)
CREATE TABLE campaign_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  sender_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AFFILIATE LINKS & COUPON CODES
CREATE TABLE affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  creator_id UUID REFERENCES users(id),
  brand_id UUID REFERENCES users(id),
  short_slug TEXT UNIQUE NOT NULL,  -- e.g. 'arjun-skincare-q2'
  destination_url TEXT NOT NULL,
  coupon_code TEXT UNIQUE,          -- e.g. 'ARJUN15'
  coupon_discount_pct INTEGER,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated INTEGER DEFAULT 0, -- in INR
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLICK EVENTS (for tracking)
CREATE TABLE link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES affiliate_links(id),
  ip_hash TEXT,                  -- hashed for privacy
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- COUPON REDEMPTIONS
CREATE TABLE coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES affiliate_links(id),
  order_value INTEGER,           -- in INR
  redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- VIDEO SNAPSHOTS (cached YT data)
CREATE TABLE video_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id),
  video_id TEXT NOT NULL,        -- YouTube video ID
  title TEXT,
  published_at TIMESTAMPTZ,
  views INTEGER,
  likes INTEGER,
  comments INTEGER,
  category_id TEXT,
  duration_seconds INTEGER,
  snapshotted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROI PROJECTIONS (saved estimates)
CREATE TABLE roi_projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id),
  creator_id UUID REFERENCES users(id),
  product_price INTEGER,
  campaign_budget INTEGER,
  projected_views INTEGER,
  projected_clicks INTEGER,
  projected_conversions INTEGER,
  projected_revenue INTEGER,
  projected_roas FLOAT,
  confidence_level TEXT CHECK (confidence_level IN ('high','medium','low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. API Integrations

### 8.1 YouTube Data API v3

**Setup:**
1. Create a project in Google Cloud Console
2. Enable: YouTube Data API v3 + YouTube Analytics API
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URI: `https://proofluence.vercel.app/api/auth/youtube/callback`

**OAuth Flow:**
```
Creator clicks "Connect YouTube" →
Redirect to Google OAuth →
User grants permission →
Callback receives code →
Exchange code for access_token + refresh_token →
Store tokens in creator_profiles (encrypted) →
Run initial data sync
```

**Key API Calls:**

```javascript
// 1. Get channel info
GET https://www.googleapis.com/youtube/v3/channels
  ?part=snippet,statistics,brandingSettings
  &mine=true
  &key={API_KEY}
// Headers: Authorization: Bearer {access_token}

// 2. Get last 30 videos
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &channelId={channelId}
  &maxResults=30
  &order=date
  &type=video
  &key={API_KEY}

// 3. Get video statistics (batch, up to 50 per call)
GET https://www.googleapis.com/youtube/v3/videos
  ?part=statistics,snippet,contentDetails
  &id={videoId1},{videoId2},...
  &key={API_KEY}

// 4. Audience demographics (requires OAuth, YouTube Analytics API)
GET https://youtubeanalytics.googleapis.com/v2/reports
  ?ids=channel==MINE
  &startDate=2025-01-01
  &endDate=2026-06-16
  &metrics=views,estimatedMinutesWatched,averageViewDuration
  &dimensions=ageGroup,gender
  &key={API_KEY}
// Headers: Authorization: Bearer {access_token}

// 5. Country breakdown
GET https://youtubeanalytics.googleapis.com/v2/reports
  ?ids=channel==MINE
  &startDate=2025-01-01
  &endDate=2026-06-16
  &metrics=views
  &dimensions=country
  &sort=-views
  &maxResults=10
```

**Rate Limits:**
- YouTube Data API: 10,000 units/day (free tier)
- `channels.list` costs 1 unit
- `search.list` costs 100 units — use sparingly, cache results
- `videos.list` costs 1 unit per call — batch video IDs

**Recommended: Cache all YouTube data in `video_snapshots` and refresh every 24 hours, not on every page load.**

---

### 8.2 Claude API (AI Scoring + Brief Generation)

**Endpoint:** `POST https://api.anthropic.com/v1/messages`
**Model:** `claude-sonnet-4-6`

**Use Case 1: Generate Creator Brief**

```python
# Python / FastAPI endpoint: POST /ai/creator-brief
import anthropic

def generate_creator_brief(creator_data: dict) -> str:
    client = anthropic.Anthropic()
    
    prompt = f"""
You are an influencer marketing analyst. Based on the following creator data, 
write a concise 2-3 sentence brief for brands considering this creator. 
Focus on: audience fit, content quality signals, and what types of products/brands 
would perform best with this creator.

Creator Data:
- Name: {creator_data['name']}
- Niche Tags: {', '.join(creator_data['niche_tags'])}
- Subscribers: {creator_data['total_subscribers']:,}
- Avg Views (last 30 videos): {creator_data['avg_views_last_30']:,}
- Engagement Rate: {creator_data['engagement_rate']}%
- Top Audience Location: {creator_data['top_country']}
- Audience Age: {creator_data['top_age_group']}
- Audience Gender Split: {creator_data['gender_split']}
- Past Brand Categories: {creator_data.get('past_brand_categories', 'None yet')}

Write only the brief. No preamble. No headers. Plain paragraph.
"""
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.content[0].text
```

**Use Case 2: Score Niche Clarity**

```python
def score_niche_clarity(video_titles: list[str], declared_tags: list[str]) -> dict:
    client = anthropic.Anthropic()
    
    titles_str = "\n".join([f"- {t}" for t in video_titles[:30]])
    
    prompt = f"""
Analyze these YouTube video titles to determine niche clarity and consistency.
Declared niche tags by creator: {', '.join(declared_tags)}

Video titles (last 30):
{titles_str}

Return ONLY a JSON object with:
{{
  "niche_clarity_score": <0-100>,
  "detected_primary_niche": "<niche>",
  "detected_secondary_niches": ["<niche1>", "<niche2>"],
  "consistency_assessment": "<one sentence>",
  "niche_match_to_declared": <true|false>
}}
No markdown. No explanation. JSON only.
"""
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )
    
    import json
    return json.loads(response.content[0].text)
```

**Use Case 3: Comment Quality Analysis (Bot Detection)**

```python
def analyze_comment_quality(comments: list[str]) -> dict:
    # Sample 50 comments max
    sample = comments[:50]
    comments_str = "\n".join([f"- {c}" for c in sample])
    
    prompt = f"""
Analyze these YouTube comments for authenticity signals.

Comments:
{comments_str}

Return ONLY JSON:
{{
  "authenticity_score": <0-100>,
  "spam_ratio": <0.0-1.0>,
  "generic_comment_ratio": <0.0-1.0>,
  "sentiment_diversity": <"low"|"medium"|"high">,
  "engagement_signals": ["<signal1>", "<signal2>"],
  "red_flags": ["<flag1>"] 
}}
No markdown. JSON only.
"""
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=250,
        messages=[{"role": "user", "content": prompt}]
    )
    import json
    return json.loads(response.content[0].text)
```

---

### 8.3 Affiliate Link Redirect Handler

```javascript
// Backend route: GET /r/:slug
// Example: proofluence.app/r/arjun-skincare-q2

app.get('/r/:slug', async (req, res) => {
  const { slug } = req.params;
  
  // 1. Look up link
  const link = await db.query(
    'SELECT * FROM affiliate_links WHERE short_slug = $1', [slug]
  );
  if (!link) return res.status(404).send('Link not found');

  // 2. Log click (async, don't block redirect)
  const ipHash = hashIp(req.ip);
  db.query(
    `INSERT INTO link_clicks (link_id, ip_hash, user_agent, referrer, country)
     VALUES ($1, $2, $3, $4, $5)`,
    [link.id, ipHash, req.headers['user-agent'], req.headers['referer'], geoIP(req.ip)]
  );

  // 3. Increment click counter
  db.query(
    `UPDATE affiliate_links SET total_clicks = total_clicks + 1 WHERE id = $1`,
    [link.id]
  );

  // 4. Redirect to destination URL
  res.redirect(302, link.destination_url);
});
```

---

## 9. AI Scoring Engine

### 9.1 Final Score Calculation

```python
# FastAPI: POST /ai/score-creator
def calculate_proofluence_score(creator_data: dict) -> dict:
    
    # --- Sub-score 1: Niche Clarity (25%) ---
    niche_result = score_niche_clarity(
        creator_data['video_titles'],
        creator_data['niche_tags']
    )
    niche_score = niche_result['niche_clarity_score']
    
    # --- Sub-score 2: Audience Authenticity (30%) ---
    # Heuristic component
    like_view_ratio = creator_data['total_likes'] / max(creator_data['total_views'], 1)
    comment_view_ratio = creator_data['total_comments'] / max(creator_data['total_views'], 1)
    
    heuristic_score = 100
    if like_view_ratio < 0.005: heuristic_score -= 30
    if comment_view_ratio < 0.0005: heuristic_score -= 20
    
    # AI comment quality component
    comment_result = analyze_comment_quality(creator_data['sample_comments'])
    comment_score = comment_result['authenticity_score']
    
    authenticity_score = (heuristic_score * 0.4) + (comment_score * 0.6)
    authenticity_score = max(0, min(100, authenticity_score))
    
    # --- Sub-score 3: Engagement Quality (25%) ---
    engagement_rate = creator_data['engagement_rate']
    # Benchmark: Good engagement for YouTube is 2–5%
    if engagement_rate >= 5:    eq_score = 100
    elif engagement_rate >= 3:  eq_score = 80
    elif engagement_rate >= 2:  eq_score = 60
    elif engagement_rate >= 1:  eq_score = 40
    else:                       eq_score = 20
    
    # --- Sub-score 4: Campaign ROI History (20%) ---
    if creator_data.get('past_campaigns'):
        avg_ctr = sum(c['ctr'] for c in creator_data['past_campaigns']) / len(creator_data['past_campaigns'])
        roi_score = min(100, avg_ctr * 20)  # 5% CTR = 100 score
    else:
        roi_score = 50  # Neutral score for new creators
    
    # --- Final Weighted Score ---
    final_score = int(
        (niche_score * 0.25) +
        (authenticity_score * 0.30) +
        (eq_score * 0.25) +
        (roi_score * 0.20)
    )
    
    return {
        "proofluence_score": final_score,
        "score_breakdown": {
            "niche_clarity": round(niche_score),
            "audience_authenticity": round(authenticity_score),
            "engagement_quality": round(eq_score),
            "roi_history": round(roi_score)
        },
        "tier": get_tier(final_score),
        "detected_niche": niche_result['detected_primary_niche']
    }

def get_tier(score: int) -> str:
    if score >= 80: return "Verified Performer"
    if score >= 60: return "Rising Creator"
    if score >= 40: return "Growing"
    return "Needs Data"
```

### 9.2 ROI Projection Formula

```python
# Category benchmark CTRs (fallback when no historical data)
CATEGORY_CTR_BENCHMARKS = {
    "tech": 0.032,
    "beauty": 0.028,
    "finance": 0.045,
    "gaming": 0.018,
    "fitness": 0.025,
    "lifestyle": 0.020,
    "food": 0.022,
    "default": 0.025
}

CATEGORY_CONVERSION_RATES = {
    "tech": 0.03,
    "beauty": 0.04,
    "finance": 0.02,
    "gaming": 0.025,
    "fitness": 0.035,
    "lifestyle": 0.03,
    "food": 0.05,
    "default": 0.03
}

def project_roi(creator: dict, brand_input: dict) -> dict:
    avg_views = creator['avg_views_last_30']
    auth_score = creator['score_breakdown']['audience_authenticity'] / 100
    niche = creator['detected_niche']
    
    # Views adjusted for audience authenticity
    projected_views = int(avg_views * auth_score)
    
    # CTR: use historical if available, else benchmark
    ctr = creator.get('historical_avg_ctr') or CATEGORY_CTR_BENCHMARKS.get(niche, 0.025)
    projected_clicks = int(projected_views * ctr)
    
    # Conversion rate
    conv_rate = CATEGORY_CONVERSION_RATES.get(niche, 0.03)
    projected_conversions = int(projected_clicks * conv_rate)
    
    # Revenue
    projected_revenue = projected_conversions * brand_input['product_price']
    
    # ROAS
    total_spend = brand_input['campaign_budget'] + creator['base_rate_per_video']
    projected_roas = round(projected_revenue / max(total_spend, 1), 2)
    
    # Confidence
    if creator.get('historical_avg_ctr') and creator['proofluence_score'] >= 70:
        confidence = "high"
    elif creator['proofluence_score'] >= 50:
        confidence = "medium"
    else:
        confidence = "low"
    
    return {
        "projected_views": projected_views,
        "projected_clicks": projected_clicks,
        "projected_conversions": projected_conversions,
        "projected_revenue": projected_revenue,
        "projected_roas": projected_roas,
        "total_spend": total_spend,
        "net_roi": projected_revenue - total_spend,
        "confidence_level": confidence,
        "assumptions": {
            "ctr_used": ctr,
            "conversion_rate_used": conv_rate,
            "authenticity_factor": auth_score
        }
    }
```

---

## 10. UI/UX Specifications

### 10.1 Pages & Routes

```
/ (Landing Page)
/login
/signup?role=brand|creator

/creator/
  /creator/dashboard         → Creator home
  /creator/profile           → Edit profile, connect YouTube
  /creator/campaigns         → Active + past deals
  /creator/campaigns/[id]    → Campaign detail + messaging
  /creator/affiliate         → Link/coupon performance
  /creator/score             → Proofluence Score breakdown

/brand/
  /brand/dashboard           → Brand home
  /brand/discover            → Creator leaderboard + filters
  /brand/creators/[id]       → Creator full profile + ROI calculator
  /brand/campaigns           → All campaigns
  /brand/campaigns/new       → Create campaign brief
  /brand/campaigns/[id]      → Campaign detail + messaging

/r/[slug]                   → Affiliate link redirect (backend only)
/api/                       → All backend routes
```

### 10.2 Design System

**Color Palette:**

| Token | Hex | Usage |
|---|---|---|
| `dark` | `#141413` | Page background, navbars, dark surfaces |
| `light` | `#faf9f5` | Cards, panels, light backgrounds |
| `primary` | `#d97757` | CTAs, active states, score highlights, links |
| `info` | `#6a9bcc` | Info badges, secondary actions, data callouts |
| `success` | `#788c5d` | Verified Performer tier, positive ROI, confirmed status |
| `text-on-dark` | `#faf9f5` | All text on dark backgrounds |
| `text-on-light` | `#141413` | All text on light backgrounds |
| `muted` | `#8a897e` | Subtext, placeholders, disabled states |
| `border` | `#2e2d2b` | Dividers on dark surfaces |
| `border-light` | `#e2e0d8` | Dividers on light surfaces |

**Score Tier Colors:**
- 80–100 Verified Performer → `#788c5d` (success green)
- 60–79 Rising Creator → `#6a9bcc` (info blue)
- 40–59 Growing → `#d97757` (primary orange)
- Below 40 Needs Data → `#8a897e` (muted)

**Typography:**
- **Headings:** Poppins (Google Fonts) — weights 600, 700. Used for all `h1`–`h4`, nav items, card titles, score numbers.
- **Body:** Lora (Google Fonts) — weights 400, 500. Used for all body copy, descriptions, labels, form fields. Lora is a serif — it adds editorial warmth against the dark background.
- **Mono:** JetBrains Mono — used only for coupon codes, affiliate slugs, API keys.

**Google Fonts import (add to `app/layout.tsx`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Lora:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
```

**Tailwind config (`tailwind.config.ts`):**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        dark:    '#141413',
        light:   '#faf9f5',
        primary: '#d97757',
        info:    '#6a9bcc',
        success: '#788c5d',
        muted:   '#8a897e',
        border: {
          dark:  '#2e2d2b',
          light: '#e2e0d8',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body:    ['Lora', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
export default config
```

**Global CSS (`app/globals.css`):**
```css
body {
  background-color: #141413;
  color: #faf9f5;
  font-family: 'Lora', serif;
}

h1, h2, h3, h4, h5, h6,
.font-heading {
  font-family: 'Poppins', sans-serif;
}

/* Light surface override — used on cards and panels */
.surface {
  background-color: #faf9f5;
  color: #141413;
}
```

**Component Library:** shadcn/ui with Tailwind CSS (override shadcn's default CSS variables to match this palette in `globals.css`)

### 10.3 Key UI Components to Build

1. **CreatorCard** — Used in leaderboard grid
   - Props: `{ creator, showScore, showRate, onViewProfile, onStartDeal }`

2. **ScoreBadge** — Circular score meter (0–100 arc)
   - Color changes by tier (green/blue/amber/red)

3. **ROIProjectionModal** — Slide-in panel
   - Brand inputs on left, projection cards on right
   - Animated number counters for projected revenue

4. **CampaignStatusStepper** — Shows campaign lifecycle
   - 7-step horizontal stepper with active state

5. **AffiliateTracker** — Mini dashboard card
   - Click counter, coupon redemptions, revenue meter

6. **YouTubeConnectBanner** — Shown until creator connects
   - "Connect YouTube to get your Proofluence Score" CTA

7. **LeaderboardFilter** — Left sidebar with all filter options
   - Collapsible sections, range sliders for budget/subs

---

## 11. Team Responsibilities

### Member 1 — Web Designer / Frontend Dev

**Stack:** Next.js, Tailwind CSS, shadcn/ui

**Owns:**
- Landing page (`/`)
- Authentication pages (`/login`, `/signup`)
- Brand discovery page with leaderboard + filters (`/brand/discover`)
- Creator profile page (`/brand/creators/[id]`)
- ROI Calculator modal
- Brand dashboard (`/brand/dashboard`)
- Creator dashboard (`/creator/dashboard`)
- All shared UI components (CreatorCard, ScoreBadge, CampaignStatusStepper)
- Responsive design (mobile-first)
- Design system setup (colors, typography, spacing)

**Key deliverables:**
- [ ] Next.js project init, Tailwind + shadcn/ui setup, design tokens configured
- [ ] Global layout (nav, sidebar, footer)
- [ ] Landing page (`/`)
- [ ] Auth pages (`/login`, `/signup`)
- [ ] Brand leaderboard page with filters (`/brand/discover`)
- [ ] Creator profile page layout (`/brand/creators/[id]`)
- [ ] ROI Projection modal (wired to API)
- [ ] Brand dashboard (`/brand/dashboard`) with live data
- [ ] Creator dashboard (`/creator/dashboard`) with live data
- [ ] All shared components: CreatorCard, ScoreBadge, CampaignStatusStepper, AffiliateTracker, YouTubeConnectBanner, LeaderboardFilter
- [ ] Mobile responsive throughout

---

### Member 2 — AI Specialist

**Stack:** Python, FastAPI, Claude API, Anthropic SDK

**Owns:**
- FastAPI microservice setup (`/ai` service)
- Claude API integration for:
  - Creator brief generation
  - Niche clarity scoring
  - Comment quality + bot detection
- Proofluence Score calculation engine
- ROI projection algorithm
- Expose REST endpoints consumed by Node backend

**API Endpoints to build:**

```
POST /ai/score-creator       → Input: creator_data → Output: score + breakdown
POST /ai/generate-brief      → Input: creator_data → Output: brief text
POST /ai/analyze-comments    → Input: comments[]  → Output: authenticity score
POST /ai/project-roi         → Input: creator + brand_input → Output: projection
GET  /ai/health              → Health check
```

**Key deliverables:**
- [ ] FastAPI microservice project set up and deployed to Railway
- [ ] `POST /ai/score-creator` endpoint returning real Proofluence Score + breakdown
- [ ] `POST /ai/generate-brief` endpoint returning creator brief paragraph
- [ ] `POST /ai/analyze-comments` endpoint returning authenticity score
- [ ] `POST /ai/project-roi` endpoint returning full projection object
- [ ] `GET /ai/health` health check endpoint
- [ ] Scoring tested against 3–5 real creator datasets
- [ ] ROI projection benchmarks validated per niche
- [ ] Seed demo data scored + briefs generated for Appendix A creators

---

### Member 3 — YouTube Dashboard & Data Integration

**Stack:** Node.js, Google APIs, PostgreSQL

**Owns:**
- Node.js + Express backend setup
- Supabase setup (DB schema, tables, RLS policies)
- YouTube OAuth flow (connect/disconnect)
- YouTube Data API v3 integration:
  - Channel stats sync
  - Video list + statistics sync
  - Audience demographics pull
- Data sync scheduler (refresh every 24h)
- All CRUD API endpoints:
  - Auth (register/login)
  - Creator profile CRUD
  - Brand profile CRUD
  - Campaign CRUD + status transitions
  - Messaging
  - Affiliate link generation + click tracking
- Coupon redemption webhook endpoint

**Key API Endpoints:**

```
Auth:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/youtube/connect
GET  /api/auth/youtube/callback

Creators:
GET  /api/creators                 → Leaderboard (with filters)
GET  /api/creators/:id             → Single profile
PUT  /api/creators/:id             → Update profile
POST /api/creators/:id/sync        → Trigger YouTube data refresh

Campaigns:
POST /api/campaigns                → Create
GET  /api/campaigns                → List (by user)
GET  /api/campaigns/:id            → Single
PUT  /api/campaigns/:id/status     → Update status
POST /api/campaigns/:id/messages   → Send message
GET  /api/campaigns/:id/messages   → Get messages

Affiliate:
POST /api/affiliate/generate       → Generate link + coupon for campaign
GET  /api/affiliate/:campaignId    → Get link performance
POST /api/affiliate/redeem         → Log coupon redemption (webhook)

ROI:
POST /api/roi/project              → Calls AI service, saves result
GET  /api/roi/:creatorId           → Get saved projections for a creator
```

**Key deliverables:**
- [ ] Supabase project created, all tables from Section 7 schema created
- [ ] RLS (Row Level Security) policies set on all tables
- [ ] Node.js + Express backend scaffolded and deployed to Railway
- [ ] `POST /api/auth/register` and `POST /api/auth/login` working
- [ ] YouTube OAuth flow complete (`/connect` → Google → `/callback` → tokens stored)
- [ ] Channel stats + last 30 videos syncing to `video_snapshots` table
- [ ] Audience demographics pulling from YouTube Analytics API
- [ ] 24h data refresh scheduler (cron job)
- [ ] All Creator CRUD endpoints working
- [ ] All Campaign CRUD endpoints + status transitions working
- [ ] Campaign messaging (send + list) working
- [ ] Affiliate link generation endpoint working
- [ ] `/r/:slug` redirect handler live and logging clicks
- [ ] Coupon redemption webhook endpoint
- [ ] `POST /api/roi/project` wired to AI service
- [ ] Leaderboard filter query optimized with indexes

---

### Member 4 — PPT & Presentation

**Owns:**
- Hackfluence PPT submission (due June 18–19)
- B-school presentation (June 19–20)
- Demo script for prototype submission

**PPT Slides Structure (Hackfluence required: problem, solution, business model, market, expected impact):**

```
Slide 1: Title — "Proofluence: Know your ROI before you spend a rupee"
Slide 2: The Problem — 3 stats on influencer marketing waste + middleman cut
Slide 3: The Gap — What existing tools miss (no projected ROI, agency lock-in)
Slide 4: Our Solution — Platform overview + 3 key pillars
Slide 5: How it Works — 5-step user journey (Brand → Discover → Estimate → Deal → Track)
Slide 6: Proofluence Score — What it measures + why it matters
Slide 7: ROI Projection Feature — Before/after spend clarity
Slide 8: Live Tracking — Affiliate link + coupon attribution
Slide 9: Market Opportunity — Indian creator economy size (₹2,200Cr by 2025)
Slide 10: Business Model — Platform fee (5% on deals) + Brand SaaS subscription
Slide 11: Team + Traction (if any)
Slide 12: The Ask / What's Next
```

**B-School Round Deep Dives:**
- Business viability: Creator economy TAM + SAM + SOM
- Unit economics: per-deal 5% platform fee = ₹2,500 on a ₹50,000 deal
- Go-to-market: Target 100 micro-creators (10K–100K) in tech + beauty niches first, onboard 10 D2C brands
- Moat: Data flywheel — more campaigns → more ROI data → better projections → more trust

---

## 12. Sprint Checklist

Master task list for the full build. Each member tracks their own column; cross off as done.

### 🎨 Member 1 — Frontend / Web Design
- [ ] Next.js init + Tailwind + shadcn/ui configured
- [ ] Design tokens (colors, fonts) applied globally via `tailwind.config.ts` and `globals.css`
- [ ] Google Fonts loaded (Poppins + Lora)
- [ ] Global layout component (dark navbar, sidebar shell)
- [ ] Landing page (`/`) — hero, feature highlights, dual CTA (brand / creator)
- [ ] Login page (`/login`)
- [ ] Signup page (`/signup?role=brand|creator`)
- [ ] `CreatorCard` component (props: name, score, niche tags, subs, rate)
- [ ] `ScoreBadge` component (arc meter, tier color by score range)
- [ ] `LeaderboardFilter` sidebar (niche, subs, score tier, budget sliders)
- [ ] Brand Discover / Leaderboard page (`/brand/discover`) with filter + grid
- [ ] Creator Profile page (`/brand/creators/[id]`) — stats, AI brief, score breakdown
- [ ] `ROIProjectionModal` — brand inputs + animated output cards
- [ ] `CampaignStatusStepper` — 7-stage horizontal stepper
- [ ] `AffiliateTracker` card — clicks, redemptions, revenue
- [ ] `YouTubeConnectBanner` — shown to creator pre-OAuth
- [ ] Brand Dashboard (`/brand/dashboard`) — campaign list, top creators, budget meter
- [ ] Creator Dashboard (`/creator/dashboard`) — score, deals, affiliate performance
- [ ] Campaign detail page + messaging thread UI
- [ ] Connect all pages to live backend API data
- [ ] Mobile responsive polish (all breakpoints)
- [ ] Light surface override (`.surface` class) applied to cards/panels

---

### 🤖 Member 2 — AI Specialist
- [ ] FastAPI project created (`ai-service/`)
- [ ] `requirements.txt`: fastapi, uvicorn, anthropic, httpx, python-dotenv
- [ ] `.env` with `ANTHROPIC_API_KEY`
- [ ] `GET /ai/health` — returns `{ status: "ok" }`
- [ ] `scoring.py` — Proofluence Score engine (Section 9.1)
- [ ] `POST /ai/score-creator` — returns score + 4 sub-scores + tier
- [ ] `brief.py` — Claude prompt for creator brief (Section 8.2)
- [ ] `POST /ai/generate-brief` — returns 2–3 sentence brand-facing brief
- [ ] `comments.py` — comment authenticity analysis
- [ ] `POST /ai/analyze-comments` — returns authenticity score + red flags
- [ ] `roi.py` — ROI projection formula (Section 9.2)
- [ ] `POST /ai/project-roi` — returns full projection object
- [ ] Category CTR + conversion benchmarks table populated
- [ ] Deployed to Railway with public URL
- [ ] Tested against 3 demo creators (Rahul, Priya, Vikram from Appendix A)
- [ ] Seed demo data: scores + briefs pre-generated and stored in DB

---

### 🔌 Member 3 — Backend / YouTube Integration
- [ ] Supabase project created
- [ ] All 8 tables from Section 7 schema created (SQL run in Supabase editor)
- [ ] RLS policies: users can only read/write their own rows
- [ ] Node.js + Express project scaffolded
- [ ] `.env` with all variables from Section 6.3
- [ ] `POST /api/auth/register` — creates user row + role-specific profile
- [ ] `POST /api/auth/login` — returns JWT
- [ ] Auth middleware (JWT verify on protected routes)
- [ ] `GET /api/auth/youtube/connect` — redirects to Google OAuth
- [ ] `GET /api/auth/youtube/callback` — exchanges code, stores tokens
- [ ] YouTube channel stats sync (`channels.list`)
- [ ] Last 30 videos sync (`search.list` + `videos.list`)
- [ ] Audience demographics sync (YouTube Analytics API)
- [ ] Data stored in `video_snapshots` + `creator_profiles` updated
- [ ] 24h cron job for auto-refresh
- [ ] `GET /api/creators` — leaderboard with query filters
- [ ] `GET /api/creators/:id` — single profile with all stats
- [ ] `PUT /api/creators/:id` — profile update
- [ ] `POST /api/creators/:id/sync` — manual YouTube refresh trigger
- [ ] `POST /api/campaigns` — create campaign brief
- [ ] `GET /api/campaigns` — list by authenticated user
- [ ] `GET /api/campaigns/:id` — single campaign
- [ ] `PUT /api/campaigns/:id/status` — status transition
- [ ] `POST /api/campaigns/:id/messages` — send message
- [ ] `GET /api/campaigns/:id/messages` — fetch thread
- [ ] `POST /api/affiliate/generate` — create `affiliate_links` row + coupon code
- [ ] `GET /r/:slug` — redirect handler, log to `link_clicks`, increment counter
- [ ] `GET /api/affiliate/:campaignId` — performance stats
- [ ] `POST /api/affiliate/redeem` — coupon redemption webhook
- [ ] `POST /api/roi/project` — proxies to AI service, saves `roi_projections` row
- [ ] `GET /api/roi/:creatorId` — fetch saved projections
- [ ] Deployed to Railway with public URL
- [ ] Seed demo data inserted (3 creators, 1 brand, 1 campaign, 1 affiliate link)

---

### 📊 Member 4 — PPT & Presentation
- [ ] Slide 1: Title slide — product name, tagline, team
- [ ] Slide 2: Problem — 3 stats (influencer waste, agency cut, fake followers)
- [ ] Slide 3: Market gap — what existing tools miss
- [ ] Slide 4: Solution overview — 3 pillars (score, project, track)
- [ ] Slide 5: How it works — 5-step user journey flow
- [ ] Slide 6: Proofluence Score — what it measures, tier breakdown
- [ ] Slide 7: ROI Projection — before/after brand clarity
- [ ] Slide 8: Live tracking — affiliate link + coupon attribution
- [ ] Slide 9: Market opportunity — Indian creator economy TAM/SAM/SOM
- [ ] Slide 10: Business model — 5% deal fee + Brand Pro ₹999/month
- [ ] Slide 11: Team + any early traction
- [ ] Slide 12: What's next / ask
- [ ] PPT submitted on time (June 18–19)
- [ ] B-school round deck prepared (business viability deep-dive)
- [ ] Demo script written (3-minute end-to-end walkthrough)
- [ ] Final prototype presentation rehearsed
- [ ] Backup demo video recorded (in case of live demo failure)

---

## 13. MVP Scope vs. Future Features

### Must Have (MVP — 4 days)
- [x] Creator signup + YouTube OAuth connect
- [x] Brand signup
- [x] Proofluence Score calculation + display
- [x] Creator leaderboard with basic filters (niche, subs, score)
- [x] Creator profile page with AI-generated brief
- [x] ROI Projection calculator
- [x] Campaign creation + invite flow
- [x] Affiliate link generation + basic click tracking
- [x] Brand dashboard (active campaigns, top creators)
- [x] Creator dashboard (score, active deals, affiliate performance)

### Should Have (if time allows)
- [ ] In-app messaging between brand and creator
- [ ] Campaign status flow with all 7 stages
- [ ] Coupon code redemption webhook
- [ ] Email notifications (new invite, campaign update)
- [ ] Mobile responsive design

### Won't Have (post-hackathon)
- [ ] Instagram API integration
- [ ] Payment gateway (in-platform payments)
- [ ] Contract generation (e-sign)
- [ ] Content approval workflow (script/video review)
- [ ] Advanced bot detection (ML model)
- [ ] Creator storefront
- [ ] API for brand integrations (Shopify, WooCommerce)

---

## 14. Success Metrics

### Hackathon Demo Success
- Complete end-to-end flow demonstrable in under 3 minutes
- At least 1 real YouTube creator connected with live score
- ROI projection working with realistic numbers
- Affiliate link actually redirecting and counting clicks

### Judge Evaluation Criteria Addressed

| Criterion | How Proofluence addresses it |
|---|---|
| Problem clarity | Clear: brands overpay, creators underearn, agencies take 20–40% |
| Prototype quality | Functional web app with real YouTube data |
| Business model | 5% platform fee on deals + ₹999/month Brand Pro tier |
| Impact | Removes middlemen from ₹2,200Cr Indian creator economy |

---

## Appendix A — Seed Demo Data

For the prototype demo, pre-seed the database with:

**Demo Creator 1 — Tech Niche**
- Name: Rahul Sharma | Subscribers: 42,000 | Avg Views: 28,000
- Proofluence Score: 78 (Rising Creator)
- Niche Tags: tech, gadgets, smartphones
- Base Rate: ₹25,000/video

**Demo Creator 2 — Beauty Niche**
- Name: Priya Nair | Subscribers: 115,000 | Avg Views: 67,000
- Proofluence Score: 84 (Verified Performer)
- Niche Tags: beauty, skincare, makeup
- Base Rate: ₹45,000/video

**Demo Creator 3 — Finance Niche**
- Name: Vikram Joshi | Subscribers: 28,000 | Avg Views: 19,000
- Proofluence Score: 61 (Rising Creator)
- Niche Tags: finance, investing, personal finance
- Base Rate: ₹18,000/video

**Demo Brand 1**
- Company: Glow Republic (D2C skincare)
- Budget: ₹2L/month
- Target: Beauty + Lifestyle creators

**Demo Campaign**
- Brand: Glow Republic → Creator: Priya Nair
- Product: Vitamin C Serum (₹799)
- Budget: ₹45,000 + ₹45,000 creator fee
- Projected Revenue: ₹1,12,000 (ROAS: 1.24×)
- Status: In Progress
- Affiliate Link: proofluence.app/r/priya-glow-q2
- Coupon: PRIYA15

---

## Appendix B — Quick Start for Claude Code

```bash
# 1. Clone / init repo
npx create-next-app@latest proofluence --typescript --tailwind --app
cd proofluence

# 2. Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @anthropic-ai/sdk
npm install shadcn/ui lucide-react
npm install axios react-hook-form zod
npx shadcn-ui@latest init

# 3. Python AI service
mkdir ai-service && cd ai-service
python3 -m venv venv && source venv/bin/activate
pip install fastapi uvicorn anthropic httpx python-dotenv

# 4. Set up Supabase
# Create project at supabase.com
# Run schema SQL from Section 7 in SQL editor
# Copy project URL + anon key to .env.local

# 5. Set up YouTube API
# Create project at console.cloud.google.com
# Enable YouTube Data API v3 + YouTube Analytics API
# Create OAuth 2.0 credentials
# Add to .env.local

# 6. Run dev
npm run dev          # Next.js on :3000
uvicorn main:app --reload --port 8000  # FastAPI on :8000
```

**Folder Structure:**
```
proofluence/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/signup/page.tsx
│   ├── brand/
│   │   ├── dashboard/page.tsx
│   │   ├── discover/page.tsx
│   │   └── campaigns/
│   ├── creator/
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   └── campaigns/
│   └── api/
│       ├── auth/
│       ├── creators/
│       ├── brands/
│       ├── campaigns/
│       └── affiliate/
├── components/
│   ├── ui/            (shadcn components)
│   ├── CreatorCard.tsx
│   ├── ScoreBadge.tsx
│   ├── ROIModal.tsx
│   ├── CampaignStepper.tsx
│   └── AffiliateTracker.tsx
├── lib/
│   ├── supabase.ts
│   ├── youtube.ts
│   └── utils.ts
└── ai-service/
    ├── main.py
    ├── scoring.py
    ├── brief.py
    └── roi.py
```

---

*PRD Version 1.0 — Hackfluence 2026 — Team Proofluence*
*Generated: June 2026*
