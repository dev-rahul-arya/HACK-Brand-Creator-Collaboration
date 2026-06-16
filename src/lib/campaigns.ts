// Seed campaign + affiliate data (PRD §5.5–5.6, Appendix A).
// Frontend-only mock until backend campaign endpoints exist.

export const CAMPAIGN_STATUSES = [
  "draft",
  "invited",
  "negotiating",
  "agreed",
  "in_progress",
  "delivered",
  "completed",
  "archived",
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export type Affiliate = {
  slug: string;
  couponCode: string;
  clicks: number;
  conversions: number;
  revenue: number; // INR
};

export type Campaign = {
  id: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  title: string;
  productName: string;
  productPrice: number;
  campaignBudget: number;
  creatorFee: number;
  status: CampaignStatus;
  projectedRevenue?: number;
  projectedRoas?: number;
  affiliate?: Affiliate;
  deliverables?: string;
  dos?: string;
  donts?: string;
  startDate?: string;
  endDate?: string;
  messages?: Message[];
};

export type Message = {
  sender: "brand" | "creator";
  text: string;
  at: string;
};

// Ordered lifecycle for the status stepper (archived is terminal, omitted).
export const STATUS_FLOW: CampaignStatus[] = [
  "draft",
  "invited",
  "negotiating",
  "agreed",
  "in_progress",
  "delivered",
  "completed",
];

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export function nextStatus(status: CampaignStatus): CampaignStatus | undefined {
  const i = STATUS_FLOW.indexOf(status);
  if (i === -1 || i >= STATUS_FLOW.length - 1) return undefined;
  return STATUS_FLOW[i + 1];
}

// Demo identities (stand-ins for the logged-in user until auth exists).
export const CURRENT_BRAND = "Glow Republic";
export const BRAND_MONTHLY_BUDGET = 200000; // ₹2L (Appendix A)
export const CURRENT_CREATOR_ID = "priya-nair";

export function statusColor(status: CampaignStatus): string {
  switch (status) {
    case "completed":
    case "delivered":
      return "var(--color-success)";
    case "agreed":
    case "in_progress":
      return "var(--color-info)";
    case "invited":
    case "negotiating":
      return "var(--color-primary)";
    default:
      return "var(--color-muted)";
  }
}

const ACTIVE: CampaignStatus[] = [
  "invited",
  "negotiating",
  "agreed",
  "in_progress",
  "delivered",
];

export function isActive(status: CampaignStatus): boolean {
  return ACTIVE.includes(status);
}

export function roas(c: Campaign): number | undefined {
  if (!c.affiliate) return undefined;
  const spend = c.campaignBudget + c.creatorFee;
  return Math.round((c.affiliate.revenue / Math.max(spend, 1)) * 100) / 100;
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    brandName: "Glow Republic",
    creatorId: "priya-nair",
    creatorName: "Priya Nair",
    title: "Vitamin C Serum Launch",
    productName: "Vitamin C Serum",
    productPrice: 799,
    campaignBudget: 45000,
    creatorFee: 45000,
    status: "in_progress",
    projectedRevenue: 112000,
    projectedRoas: 1.24,
    deliverables:
      "1 dedicated YouTube integration (60–90s) + 2 Instagram stories with swipe-up to the affiliate link.",
    dos: "Show the serum texture on camera, mention the PRIYA15 coupon, use the tracked link in the description.",
    donts: "No competitor brand mentions in the same video; no exaggerated medical claims.",
    startDate: "2026-06-10",
    endDate: "2026-06-30",
    messages: [
      { sender: "brand", text: "Hi Priya! Excited to work together on the serum launch.", at: "Jun 8" },
      { sender: "creator", text: "Thanks! I can shoot the integration this week.", at: "Jun 9" },
      { sender: "brand", text: "Perfect. Coupon PRIYA15 and your tracked link are ready.", at: "Jun 10" },
    ],
    affiliate: {
      slug: "priya-glow-q2",
      couponCode: "PRIYA15",
      clicks: 1840,
      conversions: 96,
      revenue: 76704,
    },
  },
  {
    id: "c2",
    brandName: "Glow Republic",
    creatorId: "ananya-rao",
    creatorName: "Ananya Rao",
    title: "Summer Sunscreen Push",
    productName: "Glow SPF 50 Sunscreen",
    productPrice: 599,
    campaignBudget: 32000,
    creatorFee: 32000,
    status: "negotiating",
  },
  {
    id: "c3",
    brandName: "Glow Republic",
    creatorId: "sneha-iyer",
    creatorName: "Sneha Iyer",
    title: "Lifestyle Gift Box Awareness",
    productName: "Glow Gift Box",
    productPrice: 1299,
    campaignBudget: 15000,
    creatorFee: 9000,
    status: "invited",
  },
  {
    id: "c4",
    brandName: "Glow Republic",
    creatorId: "priya-nair",
    creatorName: "Priya Nair",
    title: "Winter Skincare (Q1)",
    productName: "Hydra Cream",
    productPrice: 699,
    campaignBudget: 40000,
    creatorFee: 45000,
    status: "completed",
    projectedRevenue: 98000,
    projectedRoas: 1.15,
    affiliate: {
      slug: "priya-glow-q1",
      couponCode: "PRIYA10",
      clicks: 2200,
      conversions: 130,
      revenue: 90870,
    },
  },
  {
    id: "c5",
    brandName: "Lumière Cosmetics",
    creatorId: "priya-nair",
    creatorName: "Priya Nair",
    title: "Festive Makeup Reel",
    productName: "Matte Lipstick",
    productPrice: 549,
    campaignBudget: 30000,
    creatorFee: 45000,
    status: "completed",
    affiliate: {
      slug: "priya-lumiere",
      couponCode: "PRIYALUM",
      clicks: 1500,
      conversions: 80,
      revenue: 43920,
    },
  },
  {
    id: "c6",
    brandName: "Herbé Wellness",
    creatorId: "priya-nair",
    creatorName: "Priya Nair",
    title: "Herbal Glow Serum",
    productName: "Herbal Glow Serum",
    productPrice: 899,
    campaignBudget: 35000,
    creatorFee: 45000,
    status: "invited",
  },
];
