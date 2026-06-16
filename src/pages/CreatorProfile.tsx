import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCreator, getTier, tierColor } from "@/lib/creators";
import { formatCount, formatINR } from "@/lib/format";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { RoiEstimator } from "@/components/RoiEstimator";

export default function CreatorProfile() {
  const { id = "" } = useParams();
  const [searchParams] = useSearchParams();
  const creator = getCreator(id);
  const [estimating, setEstimating] = useState(false);

  // Deep link: /brand/creators/:id?action=deal opens the estimator.
  useEffect(() => {
    if (searchParams.get("action") === "deal") setEstimating(true);
  }, [searchParams]);

  if (!creator) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-2xl font-bold">Creator not found</h1>
        <Link to="/brand/discover" className="mt-4 inline-block text-info hover:text-primary">
          ← Back to Discover
        </Link>
      </div>
    );
  }

  const tier = getTier(creator.proofluenceScore);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link to="/brand/discover" className="text-sm text-info hover:text-primary">
        ← Back to Discover
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 font-heading text-2xl font-bold">
            {creator.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{creator.name}</h1>
            <p className="text-muted capitalize">
              {creator.platform} · {creator.location}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {creator.nicheTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border-dark px-2 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <ScoreBadge score={creator.proofluenceScore} size={64} />
          <div className="flex gap-2">
            <button
              onClick={() => setEstimating(true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-heading font-semibold text-light hover:opacity-90"
            >
              Estimate ROI
            </button>
            <button
              onClick={() => alert("Deal flow coming next — campaign creation.")}
              className="rounded-lg border border-border-dark px-4 py-2 text-sm font-medium hover:bg-light/5"
            >
              Start Deal
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Subscribers" value={formatCount(creator.subscribers)} />
        <Stat label="Avg views" value={formatCount(creator.avgViews)} />
        <Stat label="Engagement" value={`${creator.engagementRate}%`} />
        <Stat label="Base rate" value={`${formatINR(creator.baseRatePerVideo)}/video`} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* AI brief */}
        <section className="surface rounded-xl border border-border-light p-5">
          <h2 className="font-heading text-lg font-semibold">AI Creator Brief</h2>
          <p className="mt-3 leading-relaxed">{creator.aiBrief}</p>
        </section>

        {/* Score breakdown */}
        <section className="surface rounded-xl border border-border-light p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-lg font-semibold">Proofluence Score</h2>
            <span className="text-sm font-medium" style={{ color: tierColor(tier) }}>
              {tier}
            </span>
          </div>
          <div className="mt-4">
            <ScoreBreakdown breakdown={creator.scoreBreakdown} />
          </div>
        </section>

        {/* Audience */}
        <section className="surface rounded-xl border border-border-light p-5 md:col-span-2">
          <h2 className="font-heading text-lg font-semibold">Audience</h2>
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-heading font-semibold">{creator.audience.ageGroup}</div>
              <div className="text-xs text-muted">top age group</div>
            </div>
            <div>
              <div className="font-heading font-semibold">{creator.audience.genderSplit}</div>
              <div className="text-xs text-muted">gender split</div>
            </div>
            <div>
              <div className="font-heading font-semibold">{creator.audience.topCountry}</div>
              <div className="text-xs text-muted">top location</div>
            </div>
          </div>
        </section>
      </div>

      {estimating && (
        <RoiEstimator creator={creator} onClose={() => setEstimating(false)} />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-dark p-4">
      <div className="font-heading text-lg font-bold">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
