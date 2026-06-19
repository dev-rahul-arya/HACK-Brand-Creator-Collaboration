import { useState } from "react";
import { NICHES } from "@/lib/creators";
import { useAuth } from "@/lib/auth";
import {
  getMyAnalysis,
  getMyChannel,
  saveCreatorAnalysis,
  scrapeOwnChannel,
  scrapesRemaining,
  youtubeToCreator,
} from "@/lib/scrape";
import { analyzeCreator, type CreatorAnalysis } from "@/lib/ai";
import type { YouTubeChannelData } from "@/lib/youtube";
import { ConnectYouTubeModal } from "@/components/ConnectYouTubeModal";
import { ScoreBadge } from "@/components/ScoreBadge";
import { formatCount } from "@/lib/format";

export default function CreatorProfileEdit() {
  const { user } = useAuth();

  const initial = getMyChannel();
  const [channel, setChannel] = useState<YouTubeChannelData | null>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [remaining, setRemaining] = useState(scrapesRemaining());
  const [analysis, setAnalysis] = useState<CreatorAnalysis | null>(getMyAnalysis());
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [bio, setBio] = useState(initial?.description?.slice(0, 500) ?? "");
  const [tags, setTags] = useState<string[]>(
    initial ? youtubeToCreator(initial).nicheTags : []
  );
  const [tagInput, setTagInput] = useState("");
  const [baseRate, setBaseRate] = useState(
    initial ? youtubeToCreator(initial).baseRatePerVideo : 0
  );
  const [categories, setCategories] = useState<string[]>(
    initial ? youtubeToCreator(initial).nicheTags : []
  );
  const [saved, setSaved] = useState(false);

  async function handleImport(input: string): Promise<string> {
    const { data, stored } = await scrapeOwnChannel(user?.id ?? null, input);
    setChannel(data);
    setRemaining(scrapesRemaining());
    setAnalysis(null); // stats changed — previous analysis is stale
    // Seed editable fields from the freshly scraped channel.
    const mapped = youtubeToCreator(data);
    setBio(data.description?.slice(0, 500) ?? "");
    setTags(mapped.nicheTags);
    setCategories(mapped.nicheTags);
    setBaseRate(mapped.baseRatePerVideo);
    setTimeout(() => setModalOpen(false), 900);
    return stored === "db"
      ? "Synced ✓ Saved to your profile."
      : "Synced ✓ Saved locally (Supabase not connected).";
  }

  function addTag(e: React.FormEvent) {
    e.preventDefault();
    const t = tagInput.trim().toLowerCase();
    if (t && tags.length < 5 && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  function toggleCategory(c: string) {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function runAnalysis() {
    if (!channel) return;
    setAiError(null);
    setAnalyzing(true);
    try {
      const a = await analyzeCreator(youtubeToCreator(channel));
      setAnalysis(a);
      await saveCreatorAnalysis(user?.id ?? null, a);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  }

  const score =
    analysis?.proofluenceScore ??
    (channel ? youtubeToCreator(channel).proofluenceScore : 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Your profile</h1>
      <p className="text-muted">Edit how brands see you on the leaderboard.</p>

      <div className="mt-6">
        {channel ? (
          <section className="surface rounded-xl border border-border-light p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {channel.thumbnailUrl && (
                  <img
                    src={channel.thumbnailUrl}
                    alt=""
                    className="h-11 w-11 rounded-full"
                  />
                )}
                <div>
                  <h2 className="font-heading text-lg font-semibold">
                    {channel.title} ✓
                  </h2>
                  <p className="text-sm text-muted">
                    Imported via scraper · {channel.customUrl ?? channel.channelId}
                  </p>
                </div>
              </div>
              <ScoreBadge score={score} size={56} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <Synced label="Subscribers" value={formatCount(channel.subscribers)} />
              <Synced label="Avg views" value={formatCount(channel.avgViews)} />
              <Synced label="Engagement" value={`${channel.engagementRate}%`} />
            </div>
            <p className="mt-2 text-xs text-muted">
              {formatCount(channel.videoCount)} videos ·{" "}
              {formatCount(channel.totalViews)} total views
              {channel.uploadsPerMonth
                ? ` · ~${channel.uploadsPerMonth} uploads/mo`
                : ""}
            </p>

            {analysis && (
              <div className="mt-4 rounded-lg border border-info/40 bg-info/10 p-3">
                <div className="text-xs font-semibold text-info">AI-analyzed ✓</div>
                <p className="mt-1 text-sm text-dark/80">{analysis.aiBrief}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={runAnalysis}
                disabled={analyzing}
                className="rounded-lg border border-info px-4 py-2 text-sm font-heading font-semibold text-info hover:bg-info/10 disabled:opacity-60"
              >
                {analyzing ? "Analyzing…" : analysis ? "Re-run AI analysis" : "Run AI analysis"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Re-sync channel
              </button>
              {aiError && <span className="text-sm text-primary">{aiError}</span>}
            </div>
          </section>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/40 bg-primary/10 p-5">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Connect YouTube to get your Proofluence Score
              </h2>
              <p className="mt-1 text-sm text-muted">
                Native OAuth is coming soon — import your public stats now via the
                scraper.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="shrink-0 rounded-lg bg-primary px-4 py-2.5 font-heading font-semibold text-light hover:opacity-90"
            >
              Connect YouTube
            </button>
          </div>
        )}
      </div>

      {/* Editable fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        className="surface mt-6 space-y-6 rounded-xl border border-border-light p-5"
      >
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="input"
          />
        </Field>

        <Field label={`Niche tags (${tags.length}/5)`}>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 rounded-full bg-dark/5 px-2 py-0.5 text-xs"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="text-muted hover:text-primary"
                  aria-label={`Remove ${t}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          {tags.length < 5 && (
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag(e)}
              placeholder="Add a tag and press Enter"
              className="input mt-2"
            />
          )}
        </Field>

        <Field label="Base rate per video (₹)">
          <input
            type="number"
            min={0}
            value={baseRate}
            onChange={(e) => setBaseRate(Number(e.target.value))}
            className="input"
          />
        </Field>

        <Field label="Preferred brand categories">
          <div className="flex flex-wrap gap-2">
            {NICHES.map((c) => {
              const on = categories.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                    on
                      ? "border-primary bg-primary text-light"
                      : "border-border-light text-dark/70 hover:border-primary"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 font-heading font-semibold text-light hover:opacity-90"
          >
            Save profile
          </button>
          {saved && <span className="text-sm text-success">Saved ✓</span>}
        </div>
      </form>

      <ConnectYouTubeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onImport={handleImport}
        remaining={remaining}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Synced({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-heading text-lg font-bold">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
