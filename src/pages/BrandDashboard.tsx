import { Link } from "react-router-dom";
import {
  CAMPAIGNS,
  CURRENT_BRAND,
  BRAND_MONTHLY_BUDGET,
  isActive,
  roas,
} from "@/lib/campaigns";
import { StatusBadge } from "@/components/StatusBadge";
import { formatINR } from "@/lib/format";

export default function BrandDashboard() {
  const campaigns = CAMPAIGNS.filter((c) => c.brandName === CURRENT_BRAND);
  const active = campaigns.filter((c) => isActive(c.status));
  const pendingInvites = campaigns.filter((c) => c.status === "invited");

  const committed = active.reduce((s, c) => s + c.campaignBudget + c.creatorFee, 0);
  const budgetPct = Math.min(100, Math.round((committed / BRAND_MONTHLY_BUDGET) * 100));

  const withRoi = campaigns.filter((c) => c.affiliate);
  const totalRevenue = withRoi.reduce((s, c) => s + (c.affiliate?.revenue ?? 0), 0);
  const totalSpend = withRoi.reduce((s, c) => s + c.campaignBudget + c.creatorFee, 0);
  const aggregateRoas = totalSpend ? Math.round((totalRevenue / totalSpend) * 100) / 100 : 0;

  const topCreators = withRoi
    .map((c) => ({ name: c.creatorName, roas: roas(c) ?? 0, title: c.title }))
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{CURRENT_BRAND}</h1>
          <p className="text-muted">Brand dashboard</p>
        </div>
        <Link
          to="/brand/discover"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-heading font-semibold text-light hover:opacity-90"
        >
          Discover creators →
        </Link>
      </div>

      {/* KPI row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Kpi label="Active campaigns" value={String(active.length)} />
        <Kpi label="Aggregate ROAS" value={`${aggregateRoas}×`} accent />
        <Kpi label="Revenue tracked" value={formatINR(totalRevenue)} />
        <Kpi label="Pending invites" value={String(pendingInvites.length)} />
      </div>

      {/* Budget meter */}
      <section className="surface mt-6 rounded-xl border border-border-light p-5">
        <div className="flex items-baseline justify-between text-sm">
          <h2 className="font-heading font-semibold">Budget utilization</h2>
          <span className="text-muted">
            {formatINR(committed)} of {formatINR(BRAND_MONTHLY_BUDGET)} ({budgetPct}%)
          </span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-dark/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${budgetPct}%`,
              backgroundColor:
                budgetPct > 90 ? "var(--color-primary)" : "var(--color-success)",
            }}
          />
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Active campaigns */}
        <section className="md:col-span-2">
          <h2 className="font-heading text-lg font-semibold">Active campaigns</h2>
          <div className="mt-3 space-y-3">
            {active.map((c) => (
              <Link
                key={c.id}
                to={`/brand/campaigns/${c.id}`}
                className="surface flex items-center justify-between rounded-xl border border-border-light p-4 transition-colors hover:border-primary"
              >
                <div>
                  <div className="font-heading font-semibold">{c.title}</div>
                  <div className="text-sm text-muted">
                    {c.creatorName} · {formatINR(c.campaignBudget + c.creatorFee)} spend
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
            {active.length === 0 && (
              <p className="text-muted">No active campaigns.</p>
            )}
          </div>
        </section>

        {/* Top creators */}
        <section>
          <h2 className="font-heading text-lg font-semibold">Top by ROAS</h2>
          <div className="mt-3 space-y-3">
            {topCreators.map((t, i) => (
              <div
                key={t.name + i}
                className="surface rounded-xl border border-border-light p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold">{t.name}</span>
                  <span className="font-heading font-bold text-success">{t.roas}×</span>
                </div>
                <div className="text-xs text-muted">{t.title}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border-dark p-4">
      <div className={`font-heading text-2xl font-bold ${accent ? "text-primary" : ""}`}>
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
