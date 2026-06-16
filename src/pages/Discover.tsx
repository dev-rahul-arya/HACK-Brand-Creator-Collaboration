import { useMemo, useState } from "react";
import { CREATORS, NICHES, TIERS, getTier } from "@/lib/creators";
import { CreatorCard } from "@/components/CreatorCard";

export default function Discover() {
  const [niche, setNiche] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [minSubs, setMinSubs] = useState<number>(0);

  const results = useMemo(() => {
    return CREATORS.filter((c) => {
      if (niche !== "all" && c.niche !== niche) return false;
      if (tier !== "all" && getTier(c.proofluenceScore) !== tier) return false;
      if (c.subscribers < minSubs) return false;
      return true;
    }).sort((a, b) => b.proofluenceScore - a.proofluenceScore);
  }, [niche, tier, minSubs]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Discover Creators</h1>
      <p className="mt-1 text-muted">
        Ranked by Proofluence Score. {results.length} creator
        {results.length === 1 ? "" : "s"}.
      </p>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Filter sidebar */}
        <aside className="w-full shrink-0 space-y-6 md:w-56">
          <Filter label="Niche">
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-lg border border-border-dark bg-transparent px-3 py-2 text-sm capitalize"
            >
              <option value="all">All niches</option>
              {NICHES.map((n) => (
                <option key={n} value={n} className="capitalize text-dark">
                  {n}
                </option>
              ))}
            </select>
          </Filter>

          <Filter label="Score tier">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full rounded-lg border border-border-dark bg-transparent px-3 py-2 text-sm"
            >
              <option value="all">All tiers</option>
              {TIERS.map((t) => (
                <option key={t} value={t} className="text-dark">
                  {t}
                </option>
              ))}
            </select>
          </Filter>

          <Filter label={`Min subscribers: ${minSubs.toLocaleString("en-IN")}`}>
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={minSubs}
              onChange={(e) => setMinSubs(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </Filter>
        </aside>

        {/* Results grid */}
        <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <CreatorCard key={c.id} creator={c} />
          ))}
          {results.length === 0 && (
            <p className="text-muted">No creators match these filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
