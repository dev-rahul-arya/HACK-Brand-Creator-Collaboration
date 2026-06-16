export function YouTubeConnectBanner({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/40 bg-primary/10 p-5">
      <div>
        <h2 className="font-heading text-lg font-semibold">
          Connect YouTube to get your Proofluence Score
        </h2>
        <p className="mt-1 text-sm text-muted">
          We pull your channel stats via authorized YouTube OAuth — no scraping.
          Your data stays yours.
        </p>
      </div>
      <button
        onClick={onConnect}
        className="shrink-0 rounded-lg bg-primary px-4 py-2.5 font-heading font-semibold text-light hover:opacity-90"
      >
        Connect YouTube
      </button>
    </div>
  );
}
