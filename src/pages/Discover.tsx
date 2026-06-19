import { useMemo, useState } from "react";
import { CREATORS, NICHES, TIERS, getTier, type Creator } from "@/lib/creators";
import {
  getScrapedCreators,
  scrapeCreator,
  scrapesRemaining,
  SCRAPE_DAILY_LIMIT,
} from "@/lib/scrape";
import { CreatorCard } from "@/components/CreatorCard";

export default function Discover() {
  const [niche, setNiche] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [minSubs, setMinSubs] = useState<number>(0);

  const [scraped, setScraped] = useState<Creator[]>(getScrapedCreators());
  const [scrapeInput, setScrapeInput] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(scrapesRemaining());

  const pool = useMemo(() => [...scraped, ...CREATORS], [scraped]);

  const results = useMemo(() => {
    return pool
      .filter((c) => {
        if (niche !== "all" && c.niche !== niche) return false;
        if (tier !== "all" && getTier(c.proofluenceScore) !== tier) return false;
        if (c.subscribers < minSubs) return false;
        return true;
      })
      .sort((a, b) => b.proofluenceScore - a.proofluenceScore);
  }, [pool, niche, tier, minSubs]);

  async function runScrape(e: React.FormEvent) {
    e.preventDefault();
    setScrapeError(null);
    setScraping(true);
    try {
      await scrapeCreator(scrapeInput.trim());
      setScraped(getScrapedCreators());
      setRemaining(scrapesRemaining());
      setScrapeInput("");
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "Scrape failed.");
    } finally {
      setScraping(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Discover Creators</h1>
      <p className="mt-1 text-muted">
        Ranked by Proofluence Score. {results.length} creator
        {results.length === 1 ? "" : "s"}.
      </p>

      {/* Scrape panel */}
      <form
        onSubmit={runScrape}
        className="mt-6 rounded-xl border border-border-dark p-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Add a creator by scraping their YouTube
            </label>
            <input
              value={scrapeInput}
              onChange={(e) => setScrapeInput(e.target.value)}
              required
              placeholder="@mkbhd  ·  youtube.com/@…  ·  channel name"
              className="input-dark"
            />
          </div>
          <button
            type="submit"
            disabled={scraping || remaining <= 0}
            className="rounded-lg bg-primary px-5 py-2.5 font-heading font-semibold text-light hover:opacity-90 disabled:opacity-60"
          >
            {scraping ? "Scraping…" : "Scrape"}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <span className="text-muted">
            {remaining}/{SCRAPE_DAILY_LIMIT} scrapes left today
          </span>
          {scrapeError && <span className="text-primary">{scrapeError}</span>}
        </div>
      </form>

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
