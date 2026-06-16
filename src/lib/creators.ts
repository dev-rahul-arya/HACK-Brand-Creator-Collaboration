// Seed creator data (PRD Appendix A + a few extras for a fuller leaderboard).
// Frontend-only mock until the backend leaderboard endpoint exists.

export type ScoreTier = "Verified Performer" | "Rising Creator" | "Growing" | "Needs Data";

export type ScoreBreakdown = {
  nicheClarity: number;
  audienceAuthenticity: number;
  engagementQuality: number;
  roiHistory: number;
};

export type Creator = {
  id: string;
  name: string;
  avatarUrl?: string;
  niche: string; // primary niche
  nicheTags: string[];
  subscribers: number;
  avgViews: number;
  engagementRate: number; // %
  baseRatePerVideo: number; // INR
  proofluenceScore: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  aiBrief: string;
  audience: { ageGroup: string; genderSplit: string; topCountry: string };
  historicalAvgCtr?: number; // 0-1, overrides niche benchmark in ROI
  platform: "youtube" | "instagram" | "both";
  location: "India metro" | "India tier-2" | "Global";
};

export const NICHES = [
  "tech",
  "beauty",
  "finance",
  "gaming",
  "fitness",
  "lifestyle",
  "food",
] as const;

export const TIERS: ScoreTier[] = [
  "Verified Performer",
  "Rising Creator",
  "Growing",
  "Needs Data",
];

export const SCORE_WEIGHTS: { key: keyof ScoreBreakdown; label: string; weight: number }[] = [
  { key: "nicheClarity", label: "Niche Clarity", weight: 25 },
  { key: "audienceAuthenticity", label: "Audience Authenticity", weight: 30 },
  { key: "engagementQuality", label: "Engagement Quality", weight: 25 },
  { key: "roiHistory", label: "Campaign ROI History", weight: 20 },
];

export function getTier(score: number): ScoreTier {
  if (score >= 80) return "Verified Performer";
  if (score >= 60) return "Rising Creator";
  if (score >= 40) return "Growing";
  return "Needs Data";
}

// Maps a tier to a design-system color token (see globals.css / PRD §10.2).
export function tierColor(tier: ScoreTier): string {
  switch (tier) {
    case "Verified Performer":
      return "var(--color-success)";
    case "Rising Creator":
      return "var(--color-info)";
    case "Growing":
      return "var(--color-primary)";
    default:
      return "var(--color-muted)";
  }
}

export const CREATORS: Creator[] = [
  {
    id: "priya-nair",
    name: "Priya Nair",
    niche: "beauty",
    nicheTags: ["beauty", "skincare", "makeup"],
    subscribers: 115000,
    avgViews: 67000,
    engagementRate: 5.4,
    baseRatePerVideo: 45000,
    proofluenceScore: 84,
    scoreBreakdown: { nicheClarity: 88, audienceAuthenticity: 86, engagementQuality: 90, roiHistory: 70 },
    aiBrief:
      "Priya has a highly engaged, predominantly female skincare audience (25–34, tier-1 India). Her last sponsored integrations converted strongly with low spam signals. Best fit for: skincare, beauty tools, and wellness D2C brands.",
    audience: { ageGroup: "25–34", genderSplit: "82% F / 18% M", topCountry: "India" },
    historicalAvgCtr: 0.041,
    platform: "both",
    location: "India metro",
  },
  {
    id: "rahul-sharma",
    name: "Rahul Sharma",
    niche: "tech",
    nicheTags: ["tech", "gadgets", "smartphones"],
    subscribers: 42000,
    avgViews: 28000,
    engagementRate: 4.1,
    baseRatePerVideo: 25000,
    proofluenceScore: 78,
    scoreBreakdown: { nicheClarity: 85, audienceAuthenticity: 80, engagementQuality: 78, roiHistory: 65 },
    aiBrief:
      "Rahul runs a focused tech & gadgets channel with a male-skewed, purchase-intent audience (18–24, tier 1–2). Comment quality is authentic with strong product discussion. Best fit for: electronics, accessories, and productivity apps.",
    audience: { ageGroup: "18–24", genderSplit: "72% M / 28% F", topCountry: "India" },
    historicalAvgCtr: 0.038,
    platform: "youtube",
    location: "India metro",
  },
  {
    id: "vikram-joshi",
    name: "Vikram Joshi",
    niche: "finance",
    nicheTags: ["finance", "investing", "personal finance"],
    subscribers: 28000,
    avgViews: 19000,
    engagementRate: 3.2,
    baseRatePerVideo: 18000,
    proofluenceScore: 61,
    scoreBreakdown: { nicheClarity: 70, audienceAuthenticity: 62, engagementQuality: 60, roiHistory: 50 },
    aiBrief:
      "Vikram covers personal finance and investing for a tier-2 India audience (25–34). Engagement is steady but campaign history is limited. Best fit for: fintech apps, brokerages, and education products.",
    audience: { ageGroup: "25–34", genderSplit: "68% M / 32% F", topCountry: "India" },
    platform: "youtube",
    location: "India tier-2",
  },
  {
    id: "ananya-rao",
    name: "Ananya Rao",
    niche: "fitness",
    nicheTags: ["fitness", "wellness", "nutrition"],
    subscribers: 76000,
    avgViews: 41000,
    engagementRate: 4.7,
    baseRatePerVideo: 32000,
    proofluenceScore: 72,
    scoreBreakdown: { nicheClarity: 75, audienceAuthenticity: 74, engagementQuality: 76, roiHistory: 60 },
    aiBrief:
      "Ananya's fitness & wellness content reaches an active, slightly female-skewed audience (18–24). Solid engagement and authentic community. Best fit for: supplements, activewear, and health apps.",
    audience: { ageGroup: "18–24", genderSplit: "60% F / 40% M", topCountry: "India" },
    historicalAvgCtr: 0.03,
    platform: "both",
    location: "India metro",
  },
  {
    id: "karan-mehta",
    name: "Karan Mehta",
    niche: "gaming",
    nicheTags: ["gaming", "esports", "reviews"],
    subscribers: 210000,
    avgViews: 88000,
    engagementRate: 2.6,
    baseRatePerVideo: 55000,
    proofluenceScore: 58,
    scoreBreakdown: { nicheClarity: 65, audienceAuthenticity: 55, engagementQuality: 52, roiHistory: 60 },
    aiBrief:
      "Karan has large gaming reach but lower engagement-per-view and some authenticity flags. Strongly male, 18–24, mixed India/Global. Best fit for: gaming peripherals, energy drinks, and game launches with broad-reach goals.",
    audience: { ageGroup: "18–24", genderSplit: "88% M / 12% F", topCountry: "India / Global" },
    platform: "youtube",
    location: "Global",
  },
  {
    id: "sneha-iyer",
    name: "Sneha Iyer",
    niche: "lifestyle",
    nicheTags: ["lifestyle", "travel", "vlogs"],
    subscribers: 15000,
    avgViews: 9000,
    engagementRate: 1.8,
    baseRatePerVideo: 9000,
    proofluenceScore: 38,
    scoreBreakdown: { nicheClarity: 45, audienceAuthenticity: 38, engagementQuality: 35, roiHistory: 35 },
    aiBrief:
      "Sneha is an emerging lifestyle & travel creator with limited data so far. Niche is still broad and authenticity needs more signal. Best fit for: low-risk awareness campaigns while she builds a track record.",
    audience: { ageGroup: "18–24", genderSplit: "55% F / 45% M", topCountry: "India" },
    platform: "instagram",
    location: "India tier-2",
  },
];

export function getCreator(id: string): Creator | undefined {
  return CREATORS.find((c) => c.id === id);
}
