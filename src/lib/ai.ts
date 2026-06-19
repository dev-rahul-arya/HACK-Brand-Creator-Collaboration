// Gemini-backed creator analysis (browser-side, no backend — mirrors the future
// /ai/score-creator + /ai/generate-brief endpoints in PRD §8.2).

import type { Creator, ScoreBreakdown } from "./creators";
import { NICHES, SCORE_WEIGHTS } from "./creators";

const KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
export const isAiConfigured = Boolean(KEY);

// Model is configurable via env; default to the lite flash model, which has the
// most generous free-tier limits. Override with VITE_GEMINI_MODEL.
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || "gemini-2.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export type CreatorAnalysis = {
  proofluenceScore: number;
  scoreBreakdown: ScoreBreakdown;
  niche: string;
  nicheTags: string[];
  aiBrief: string;
  audience: { ageGroup: string; genderSplit: string; topCountry: string };
};

function clamp(n: unknown): number {
  const x = Math.round(Number(n));
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, x));
}

function buildPrompt(c: Creator): string {
  const videos = (c.recentVideos ?? [])
    .map((v) => `- ${v.title} (${v.views} views)`)
    .join("\n");
  return `You are Proofluence's creator-scoring engine for an Indian brand–creator marketplace.
Analyze this YouTube creator and return ONLY JSON (no markdown).

Creator data:
- Name: ${c.name}
- Subscribers: ${c.subscribers}
- Avg (median) views: ${c.avgViews}
- Total channel views: ${c.totalViews ?? "unknown"}
- Video count: ${c.videoCount ?? "unknown"}
- Engagement rate: ${c.engagementRate}%
- Upload cadence: ${c.uploadsPerMonth ?? "unknown"} videos/month
- Country: ${c.channelCountry ?? "unknown"}
- Detected topics: ${(c.topics ?? []).join(", ") || "none"}
- Channel keywords: ${(c.keywords ?? []).join(", ") || "none"}
- Recent videos:\n${videos || "none"}

Score each 0-100 using these definitions:
- nicheClarity: how focused/consistent the content niche is
- audienceAuthenticity: likelihood the audience is real (engagement vs reach, no bot signals)
- engagementQuality: depth/quality of engagement relative to views
- roiHistory: expected ad ROI potential (no past campaign data available, so estimate conservatively)

Pick "niche" from EXACTLY this list: ${NICHES.join(", ")}.
Return JSON shaped exactly:
{
  "scoreBreakdown": { "nicheClarity": int, "audienceAuthenticity": int, "engagementQuality": int, "roiHistory": int },
  "niche": string,
  "nicheTags": [up to 5 short lowercase tags],
  "aiBrief": "2-3 sentence brand-facing summary: who they reach and what brands fit best",
  "audience": { "ageGroup": "e.g. 18-24", "genderSplit": "e.g. 70% M / 30% F", "topCountry": "e.g. India" }
}`;
}

export async function analyzeCreator(c: Creator): Promise<CreatorAnalysis> {
  if (!KEY) {
    throw new Error(
      "Gemini API key missing. Set VITE_GEMINI_API_KEY in .env.local and restart the dev server."
    );
  }
  const res = await fetch(`${ENDPOINT}?key=${KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(c) }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
        maxOutputTokens: 700,
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const status = data?.error?.status ? ` ${data.error.status}` : "";
    const detail = data?.error?.message ?? `HTTP ${res.status}`;
    console.error("[gemini]", res.status, data?.error);
    if (res.status === 429) {
      throw new Error(
        `Gemini quota/rate limit hit (429${status}) on model "${MODEL}". ` +
          `If this happens on the first call, your API key's project has no free-tier quota — ` +
          `create a key at aistudio.google.com/apikey, or set VITE_GEMINI_MODEL to another model. Detail: ${detail}`
      );
    }
    throw new Error(`Gemini error (${res.status}${status}): ${detail}`);
  }

  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned malformed JSON. Try again.");
  }

  const breakdown: ScoreBreakdown = {
    nicheClarity: clamp(parsed?.scoreBreakdown?.nicheClarity),
    audienceAuthenticity: clamp(parsed?.scoreBreakdown?.audienceAuthenticity),
    engagementQuality: clamp(parsed?.scoreBreakdown?.engagementQuality),
    roiHistory: clamp(parsed?.scoreBreakdown?.roiHistory),
  };

  // Enforce the PRD §9.1 weighted formula rather than trusting the model's total.
  const proofluenceScore = Math.round(
    SCORE_WEIGHTS.reduce((s, w) => s + (breakdown[w.key] * w.weight) / 100, 0)
  );

  const niche =
    typeof parsed?.niche === "string" && (NICHES as readonly string[]).includes(parsed.niche)
      ? parsed.niche
      : c.niche;

  const nicheTags: string[] = Array.isArray(parsed?.nicheTags)
    ? parsed.nicheTags.map((t: unknown) => String(t).toLowerCase()).slice(0, 5)
    : c.nicheTags;

  return {
    proofluenceScore,
    scoreBreakdown: breakdown,
    niche,
    nicheTags,
    aiBrief: typeof parsed?.aiBrief === "string" ? parsed.aiBrief : c.aiBrief,
    audience: {
      ageGroup: parsed?.audience?.ageGroup ?? c.audience.ageGroup,
      genderSplit: parsed?.audience?.genderSplit ?? c.audience.genderSplit,
      topCountry: parsed?.audience?.topCountry ?? c.audience.topCountry,
    },
  };
}

/** Merge an analysis back onto a creator. */
export function applyAnalysis(c: Creator, a: CreatorAnalysis): Creator {
  return {
    ...c,
    proofluenceScore: a.proofluenceScore,
    scoreBreakdown: a.scoreBreakdown,
    niche: a.niche,
    nicheTags: a.nicheTags,
    aiBrief: a.aiBrief,
    audience: a.audience,
    analyzed: true,
  };
}
