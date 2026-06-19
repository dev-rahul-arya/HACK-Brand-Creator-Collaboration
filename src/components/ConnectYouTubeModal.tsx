import { useState } from "react";

export function ConnectYouTubeModal({
  open,
  onClose,
  onImport,
  remaining,
}: {
  open: boolean;
  onClose: () => void;
  /** Resolve with an optional success note; throw to show an error. */
  onImport: (input: string) => Promise<string | void>;
  remaining: number;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const note = await onImport(input.trim());
      setSuccess(note || "Imported successfully.");
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/70 p-4"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-md rounded-2xl border border-border-light p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-heading text-lg font-bold">Connect YouTube</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-dark"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm text-dark/80">
          🚧 <span className="font-semibold">Native OAuth integration coming soon.</span>{" "}
          Meanwhile, import public channel stats with our scraper.
        </div>

        <form onSubmit={submit} className="mt-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Channel URL, @handle, or name
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            placeholder="@mkbhd  ·  youtube.com/@…  ·  channel name"
            className="input"
          />

          {error && <p className="mt-2 text-sm text-primary">{error}</p>}
          {success && <p className="mt-2 text-sm text-success">{success}</p>}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted">
              {remaining} scrape{remaining === 1 ? "" : "s"} left today
            </span>
            <button
              type="submit"
              disabled={loading || remaining <= 0}
              className="rounded-lg bg-primary px-5 py-2.5 font-heading font-semibold text-light hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Importing…" : "Import"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
