import { Link } from "react-router-dom";
import { CAMPAIGNS, CURRENT_CREATOR_ID, isActive } from "@/lib/campaigns";
import { getCreator, getTier, tierColor } from "@/lib/creators";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCount, formatINR } from "@/lib/format";

export default function CreatorDashboard() {
  const creator = getCreator(CURRENT_CREATOR_ID);
  if (!creator) return null;

  const myCampaigns = CAMPAIGNS.filter((c) => c.creatorId === CURRENT_CREATOR_ID);
  const activeDeals = myCampaigns.filter((c) => isActive(c.status) && c.status !== "invited");
  const invites = myCampaigns.filter((c) => c.status === "invited");

  // Earnings: fees from in-progress + completed deals.
  const earnings = myCampaigns
    .filter((c) => c.status === "in_progress" || c.status === "completed")
    .reduce((s, c) => s + c.creatorFee, 0);

  const affiliates = myCampaigns.flatMap((c) => (c.affiliate ? [c.affiliate] : []));
  const totalClicks = affiliates.reduce((s, a) => s + a.clicks, 0);
  const totalConversions = affiliates.reduce((s, a) => s + a.conversions, 0);
  const totalAffiliateRevenue = affiliates.reduce((s, a) => s + a.revenue, 0);

  const tier = getTier(creator.proofluenceScore);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{creator.name}</h1>
          <p className="text-muted">Creator dashboard</p>
        </div>
        <Link
          to="/creator/profile"
          className="rounded-lg border border-border-dark px-4 py-2 text-sm font-medium hover:bg-light/5"
        >
          Edit profile
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Score */}
        <section className="surface rounded-xl border border-border-light p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Proofluence Score</h2>
            <span className="text-sm font-medium" style={{ color: tierColor(tier) }}>
              {tier}
            </span>
          </div>
          <div className="mt-4 flex justify-center">
            <ScoreBadge score={creator.proofluenceScore} showLabel={false} size={88} />
          </div>
          <div className="mt-5">
            <ScoreBreakdown breakdown={creator.scoreBreakdown} />
          </div>
        </section>

        {/* Earnings + affiliate */}
        <section className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Kpi label="Earnings" value={formatINR(earnings)} accent />
            <Kpi label="Link clicks" value={formatCount(totalClicks)} />
            <Kpi label="Conversions" value={String(totalConversions)} />
            <Kpi label="Attributed revenue" value={formatINR(totalAffiliateRevenue)} />
          </div>

          <h2 className="mt-6 font-heading text-lg font-semibold">Affiliate performance</h2>
          <div className="mt-3 space-y-3">
            {affiliates.map((a) => (
              <div
                key={a.slug}
                className="surface flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-light p-4"
              >
                <div>
                  <div className="font-mono text-sm">/r/{a.slug}</div>
                  <div className="text-xs text-muted">
                    coupon <span className="font-mono">{a.couponCode}</span>
                  </div>
                </div>
                <div className="text-sm text-muted">
                  {formatCount(a.clicks)} clicks · {a.conversions} conv ·{" "}
                  <span className="text-dark">{formatINR(a.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Active deals */}
        <section>
          <h2 className="font-heading text-lg font-semibold">Active deals</h2>
          <div className="mt-3 space-y-3">
            {activeDeals.map((c) => (
              <DealRow
                key={c.id}
                to={`/creator/campaigns/${c.id}`}
                title={c.title}
                sub={c.brandName}
                status={c.status}
              />
            ))}
            {activeDeals.length === 0 && <p className="text-muted">No active deals.</p>}
          </div>
        </section>

        {/* Pending invites */}
        <section>
          <h2 className="font-heading text-lg font-semibold">Pending invites</h2>
          <div className="mt-3 space-y-3">
            {invites.map((c) => (
              <DealRow
                key={c.id}
                to={`/creator/campaigns/${c.id}`}
                title={c.title}
                sub={`${c.brandName} · ${formatINR(c.creatorFee)} offered`}
                status={c.status}
              />
            ))}
            {invites.length === 0 && <p className="text-muted">No pending invites.</p>}
          </div>
        </section>
      </div>

      {/* Boost tips + benchmark */}
      <section className="surface mt-6 rounded-xl border border-border-light p-5">
        <h2 className="font-heading text-lg font-semibold">Boost your score</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            Your engagement rate ({creator.engagementRate}%) is above the {creator.niche}{" "}
            niche average — highlight it to brands.
          </li>
          <li>Run one more tracked campaign to strengthen your ROI History sub-score.</li>
          <li>Keep posting consistently in your core niche to lift Niche Clarity.</li>
        </ul>
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border-dark p-4">
      <div className={`font-heading text-xl font-bold ${accent ? "text-primary" : ""}`}>
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function DealRow({
  title,
  sub,
  status,
  to,
}: {
  title: string;
  sub: string;
  status: Parameters<typeof StatusBadge>[0]["status"];
  to: string;
}) {
  return (
    <Link
      to={to}
      className="surface flex items-center justify-between rounded-xl border border-border-light p-4 transition-colors hover:border-primary"
    >
      <div>
        <div className="font-heading font-semibold">{title}</div>
        <div className="text-sm text-muted">{sub}</div>
      </div>
      <StatusBadge status={status} />
    </Link>
  );
}
