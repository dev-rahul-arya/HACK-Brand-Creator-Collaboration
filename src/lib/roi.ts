// Client-side ROI projection (PRD §9.2). Mirrors the AI service's /ai/project-roi
// so the UI works before the backend exists; swap to an API call later.
import type { Creator } from "@/lib/creators";

export const CATEGORY_CTR_BENCHMARKS: Record<string, number> = {
  tech: 0.032,
  beauty: 0.028,
  finance: 0.045,
  gaming: 0.018,
  fitness: 0.025,
  lifestyle: 0.02,
  food: 0.022,
  default: 0.025,
};

export const CATEGORY_CONVERSION_RATES: Record<string, number> = {
  tech: 0.03,
  beauty: 0.04,
  finance: 0.02,
  gaming: 0.025,
  fitness: 0.035,
  lifestyle: 0.03,
  food: 0.05,
  default: 0.03,
};

// Baseline engagement (%) used to scale benchmark CTR up/down by how engaged a
// creator's real audience is — so the projection is creator-specific, not flat.
const BASELINE_ENGAGEMENT = 3.5;
const MAX_DELIVERABLES = 10;

export type RoiInput = {
  productPrice: number;
  campaignBudget: number;
};

export type RoiResult = {
  deliverables: number;
  projectedViews: number;
  projectedClicks: number;
  projectedConversions: number;
  projectedRevenue: number;
  totalSpend: number;
  netRoi: number;
  projectedRoas: number;
  confidence: "high" | "medium" | "low";
  ctrUsed: number;
  convRateUsed: number;
  authFactor: number;
  engagementFactor: number;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function projectRoi(creator: Creator, input: RoiInput): RoiResult {
  // Budget buys deliverables (videos/integrations) at the creator's rate;
  // more deliverables → more reach. This makes the budget input actually matter.
  const rate = Math.max(creator.baseRatePerVideo, 1);
  const deliverables = clamp(Math.round(input.campaignBudget / rate), 1, MAX_DELIVERABLES);

  const authFactor = creator.scoreBreakdown.audienceAuthenticity / 100;
  const projectedViews = Math.round(creator.avgViews * authFactor * deliverables);

  // Real engagement modulates CTR: an audience that engages more clicks more.
  const engagementFactor = creator.engagementRate
    ? clamp(creator.engagementRate / BASELINE_ENGAGEMENT, 0.5, 2.5)
    : 1;
  const baseCtr =
    creator.historicalAvgCtr ??
    CATEGORY_CTR_BENCHMARKS[creator.niche] ??
    CATEGORY_CTR_BENCHMARKS.default;
  const ctrUsed = creator.historicalAvgCtr ? baseCtr : baseCtr * engagementFactor;
  const projectedClicks = Math.round(projectedViews * ctrUsed);

  const convRateUsed =
    CATEGORY_CONVERSION_RATES[creator.niche] ?? CATEGORY_CONVERSION_RATES.default;
  const projectedConversions = Math.round(projectedClicks * convRateUsed);

  const projectedRevenue = projectedConversions * input.productPrice;
  const totalSpend = Math.max(input.campaignBudget, rate);
  const projectedRoas = Math.round((projectedRevenue / Math.max(totalSpend, 1)) * 100) / 100;

  let confidence: RoiResult["confidence"];
  const hasRealSignal = Boolean(creator.historicalAvgCtr || creator.analyzed);
  if (hasRealSignal && creator.proofluenceScore >= 70) confidence = "high";
  else if (creator.proofluenceScore >= 50 || creator.engagementRate > 0) confidence = "medium";
  else confidence = "low";

  return {
    deliverables,
    projectedViews,
    projectedClicks,
    projectedConversions,
    projectedRevenue,
    totalSpend,
    netRoi: projectedRevenue - totalSpend,
    projectedRoas,
    confidence,
    ctrUsed,
    convRateUsed,
    authFactor,
    engagementFactor,
  };
}
