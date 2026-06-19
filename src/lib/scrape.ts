// Orchestrates a "scrape": fetch YouTube data, enforce a daily limit, map to a
// Creator card, and persist (Supabase creator_profiles for a creator's OWN
// channel; localStorage for brand-discovered creators, which have no users row).

import type { Creator, ScoreBreakdown } from "./creators";
import { NICHES, SCORE_WEIGHTS } from "./creators";
import { fetchYouTubeChannel, type YouTubeChannelData } from "./youtube";
import type { CreatorAnalysis } from "./ai";
import { supabase, isSupabaseConfigured } from "./supabase";
import { formatCount } from "./format";

export const SCRAPE_DAILY_LIMIT = 3;

const LS_BRAND_SCRAPES = "pf_scraped_creators";
const LS_MY_CHANNEL = "pf_my_channel";
const LS_MY_ANALYSIS = "pf_my_analysis";

function countKey() {
  return `pf_scrape_count_${new Date().toISOString().slice(0, 10)}`;
}

export function scrapesUsedToday(): number {
  return Number(localStorage.getItem(countKey()) ?? 0);
}
export function scrapesRemaining(): number {
  return Math.max(0, SCRAPE_DAILY_LIMIT - scrapesUsedToday());
}
function recordScrape() {
  localStorage.setItem(countKey(), String(scrapesUsedToday() + 1));
}
function assertCanScrape() {
  if (scrapesRemaining() <= 0) {
    throw new Error(
      `Daily scrape limit reached (${SCRAPE_DAILY_LIMIT}/day). Try again tomorrow.`
    );
  }
}

// --- mapping helpers (provisional until the AI scoring service is wired) ---

const COUNTRY_NAMES: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  AE: "UAE",
};
function countryName(code?: string): string {
  if (!code) return "—";
  return COUNTRY_NAMES[code] ?? code;
}

function guessNiche(text: string): string {
  const t = text.toLowerCase();
  for (const n of NICHES) if (t.includes(n)) return n;
  if (/makeup|skincare|cosmetic|grwm/.test(t)) return "beauty";
  if (/gadget|smartphone|unbox|coding|software|\bai\b/.test(t)) return "tech";
  if (/invest|stock|mutual fund|money|trading/.test(t)) return "finance";
  if (/workout|gym|nutrition|yoga/.test(t)) return "fitness";
  if (/recipe|cooking|kitchen|food/.test(t)) return "food";
  if (/game|gaming|esports|valorant|bgmi/.test(t)) return "gaming";
  return "lifestyle";
}

function deriveTags(d: YouTubeChannelData, niche: string): string[] {
  const fromKeywords = d.keywords.filter((k) => k.length >= 2 && k.length <= 20).slice(0, 4);
  if (fromKeywords.length) {
    return Array.from(new Set([niche, ...fromKeywords])).slice(0, 5);
  }
  if (d.topics.length) {
    return Array.from(
      new Set([niche, ...d.topics.map((t) => t.toLowerCase())])
    ).slice(0, 5);
  }
  return [niche];
}

// Rough INR/video rate from reach — a placeholder the creator can edit.
function estimateRate(subscribers: number): number {
  return Math.max(2000, Math.round((subscribers * 0.4) / 1000) * 1000);
}

// Heuristic proxies mapped to PRD §9.1 weights. ROI history is honestly 0
// (no campaign data), which keeps provisional scores moderate until AI runs.
function provisionalBreakdown(d: YouTubeChannelData): ScoreBreakdown {
  const engagementQuality = Math.round(Math.min(100, (d.engagementRate / 6) * 100));
  const nicheFocused = d.topics.length > 0 || d.keywords.length > 0;
  const nicheClarity = nicheFocused ? Math.min(100, 60 + d.keywords.length * 3) : 45;
  const audienceAuthenticity = Math.round(Math.min(95, 40 + d.engagementRate * 7));
  return { nicheClarity, audienceAuthenticity, engagementQuality, roiHistory: 0 };
}

function scoreFromBreakdown(b: ScoreBreakdown): number {
  return Math.round(
    SCORE_WEIGHTS.reduce((s, w) => s + (b[w.key] * w.weight) / 100, 0)
  );
}

function buildBrief(d: YouTubeChannelData, niche: string): string {
  const cadence = d.uploadsPerMonth ? `~${d.uploadsPerMonth} videos/month` : "irregularly";
  return (
    `${d.title} is a ${niche} channel with ${formatCount(d.subscribers)} subscribers, ` +
    `posting ${cadence}. Recent uploads average ${formatCount(d.avgViews)} views at ` +
    `${d.engagementRate}% engagement${d.country ? `, based in ${countryName(d.country)}` : ""}. ` +
    `Audience demographics need AI analysis — provisional score until then.`
  );
}

export function youtubeToCreator(d: YouTubeChannelData): Creator {
  const niche = guessNiche(
    [d.title, d.description, ...d.keywords, ...d.topics].join(" ")
  );
  const breakdown = provisionalBreakdown(d);
  return {
    id: `yt-${d.channelId}`,
    name: d.title,
    avatarUrl: d.thumbnailUrl,
    niche,
    nicheTags: deriveTags(d, niche),
    subscribers: d.subscribers,
    avgViews: d.avgViews,
    engagementRate: d.engagementRate,
    baseRatePerVideo: estimateRate(d.subscribers),
    proofluenceScore: scoreFromBreakdown(breakdown),
    scoreBreakdown: breakdown,
    aiBrief: buildBrief(d, niche),
    audience: { ageGroup: "—", genderSplit: "—", topCountry: countryName(d.country) },
    platform: "youtube",
    location: d.country === "IN" ? "India metro" : "Global",
    source: "youtube",
    channelId: d.channelId,
    customUrl: d.customUrl,
    totalViews: d.totalViews,
    videoCount: d.videoCount,
    channelCountry: d.country,
    channelCreatedAt: d.createdAt,
    uploadsPerMonth: d.uploadsPerMonth,
    lastUploadAt: d.lastUploadAt,
    avgDurationSeconds: d.avgDurationSeconds,
    topics: d.topics,
    keywords: d.keywords,
    recentVideos: d.recentVideos
      .slice(0, 6)
      .map((v) => ({ id: v.id, title: v.title, views: v.views })),
    analyzed: false,
  };
}

// --- brand-side: scraped creators live in localStorage (no users row) ---

export function getScrapedCreators(): Creator[] {
  try {
    return JSON.parse(localStorage.getItem(LS_BRAND_SCRAPES) ?? "[]") as Creator[];
  } catch {
    return [];
  }
}

function saveBrandScrape(c: Creator) {
  const list = getScrapedCreators().filter((x) => x.id !== c.id);
  list.unshift(c);
  localStorage.setItem(LS_BRAND_SCRAPES, JSON.stringify(list));
}

/** Persist an updated scraped creator (e.g. after AI analysis). */
export function updateScrapedCreator(c: Creator) {
  const list = getScrapedCreators().map((x) => (x.id === c.id ? c : x));
  localStorage.setItem(LS_BRAND_SCRAPES, JSON.stringify(list));
}

/** Brand action: scrape a public channel into a leaderboard card. */
export async function scrapeCreator(input: string): Promise<Creator> {
  assertCanScrape();
  const data = await fetchYouTubeChannel(input);
  recordScrape();
  const creator = youtubeToCreator(data);
  saveBrandScrape(creator);
  return creator;
}

// --- creator-side: own channel persists to creator_profiles (or localStorage) ---

async function saveOwnChannel(
  userId: string | null,
  d: YouTubeChannelData
): Promise<"db" | "local"> {
  const row = {
    youtube_channel_id: d.channelId,
    total_subscribers: d.subscribers,
    avg_views_last_30: d.avgViews,
    engagement_rate: d.engagementRate,
    bio: d.description?.slice(0, 500) || null,
    niche_tags: deriveTags(d, guessNiche(`${d.title} ${d.description}`)),
    last_synced_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && userId) {
    const { error } = await supabase
      .from("creator_profiles")
      .upsert({ id: userId, ...row }, { onConflict: "id" });
    if (!error) return "db";
    console.warn("[scrape] creator_profiles upsert failed, using localStorage:", error.message);
  }

  localStorage.setItem(LS_MY_CHANNEL, JSON.stringify(d));
  return "local";
}

export function getMyChannel(): YouTubeChannelData | null {
  try {
    const raw = localStorage.getItem(LS_MY_CHANNEL);
    return raw ? (JSON.parse(raw) as YouTubeChannelData) : null;
  } catch {
    return null;
  }
}

/** Creator action: import own channel; persists to DB when possible. */
export async function scrapeOwnChannel(
  userId: string | null,
  input: string
): Promise<{ data: YouTubeChannelData; stored: "db" | "local" }> {
  assertCanScrape();
  const data = await fetchYouTubeChannel(input);
  recordScrape();
  const stored = await saveOwnChannel(userId, data);
  return { data, stored };
}

/** Persist an AI analysis of the creator's own channel. */
export async function saveCreatorAnalysis(
  userId: string | null,
  a: CreatorAnalysis
): Promise<"db" | "local"> {
  const row = {
    proofluence_score: a.proofluenceScore,
    score_breakdown: a.scoreBreakdown,
    ai_brief: a.aiBrief,
    audience_demographics: a.audience,
    niche_tags: a.nicheTags,
  };
  if (isSupabaseConfigured && userId) {
    const { error } = await supabase
      .from("creator_profiles")
      .upsert({ id: userId, ...row }, { onConflict: "id" });
    if (!error) return "db";
    console.warn("[scrape] analysis upsert failed, using localStorage:", error.message);
  }
  localStorage.setItem(LS_MY_ANALYSIS, JSON.stringify(a));
  return "local";
}

export function getMyAnalysis(): CreatorAnalysis | null {
  try {
    const raw = localStorage.getItem(LS_MY_ANALYSIS);
    return raw ? (JSON.parse(raw) as CreatorAnalysis) : null;
  } catch {
    return null;
  }
}
