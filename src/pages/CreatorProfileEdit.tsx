import { useState } from "react";
import { getCreator, NICHES } from "@/lib/creators";
import { CURRENT_CREATOR_ID } from "@/lib/campaigns";
import { YouTubeConnectBanner } from "@/components/YouTubeConnectBanner";
import { ScoreBadge } from "@/components/ScoreBadge";
import { formatCount } from "@/lib/format";

export default function CreatorProfileEdit() {
  const creator = getCreator(CURRENT_CREATOR_ID);

  const [connected, setConnected] = useState(false);
  const [bio, setBio] = useState(creator?.aiBrief ?? "");
  const [tags, setTags] = useState<string[]>(creator?.nicheTags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [baseRate, setBaseRate] = useState(creator?.baseRatePerVideo ?? 0);
  const [categories, setCategories] = useState<string[]>(
    creator ? [creator.niche] : []
  );
  const [saved, setSaved] = useState(false);

  if (!creator) return null;

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Your profile</h1>
      <p className="text-muted">Edit how brands see you on the leaderboard.</p>

      <div className="mt-6">
        {connected ? (
          <section className="surface rounded-xl border border-border-light p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold">
                  YouTube connected ✓
                </h2>
                <p className="text-sm text-muted">
                  Stats synced from your channel (read-only).
                </p>
              </div>
              <ScoreBadge score={creator.proofluenceScore} size={56} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <Synced label="Subscribers" value={formatCount(creator.subscribers)} />
              <Synced label="Avg views" value={formatCount(creator.avgViews)} />
              <Synced label="Engagement" value={`${creator.engagementRate}%`} />
            </div>
          </section>
        ) : (
          <YouTubeConnectBanner onConnect={() => setConnected(true)} />
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
