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

export type RoiInput = {
  productPrice: number;
  campaignBudget: number;
};

export type RoiResult = {
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
};

export function projectRoi(creator: Creator, input: RoiInput): RoiResult {
  const authFactor = creator.scoreBreakdown.audienceAuthenticity / 100;
  const projectedViews = Math.round(creator.avgViews * authFactor);

  const ctrUsed =
    creator.historicalAvgCtr ??
    CATEGORY_CTR_BENCHMARKS[creator.niche] ??
    CATEGORY_CTR_BENCHMARKS.default;
  const projectedClicks = Math.round(projectedViews * ctrUsed);

  const convRateUsed =
    CATEGORY_CONVERSION_RATES[creator.niche] ?? CATEGORY_CONVERSION_RATES.default;
  const projectedConversions = Math.round(projectedClicks * convRateUsed);

  const projectedRevenue = projectedConversions * input.productPrice;
  const totalSpend = input.campaignBudget + creator.baseRatePerVideo;
  const projectedRoas = Math.round((projectedRevenue / Math.max(totalSpend, 1)) * 100) / 100;

  let confidence: RoiResult["confidence"];
  if (creator.historicalAvgCtr && creator.proofluenceScore >= 70) confidence = "high";
  else if (creator.proofluenceScore >= 50) confidence = "medium";
  else confidence = "low";

  return {
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
  };
}
