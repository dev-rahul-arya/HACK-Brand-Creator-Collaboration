import { Link } from "react-router-dom";
import type { Creator } from "@/lib/creators";
import { formatCount, formatINR } from "@/lib/format";
import { ScoreBadge } from "@/components/ScoreBadge";

export function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <div className="surface flex flex-col gap-4 rounded-xl border border-border-light p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {creator.avatarUrl ? (
            <img
              src={creator.avatarUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted/30 font-heading font-bold text-dark">
              {creator.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-heading text-base font-semibold leading-tight">
              {creator.name}
            </h3>
            <p className="text-xs text-muted capitalize">{creator.platform}</p>
          </div>
        </div>
        <ScoreBadge score={creator.proofluenceScore} showLabel={false} size={48} />
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          <div className="font-heading font-semibold">
            {formatCount(creator.subscribers)}
          </div>
          <div className="text-xs text-muted">subscribers</div>
        </div>
        <div>
          <div className="font-heading font-semibold">
            {formatCount(creator.avgViews)}
          </div>
          <div className="text-xs text-muted">avg views</div>
        </div>
        <div>
          <div className="font-heading font-semibold">{creator.engagementRate}%</div>
          <div className="text-xs text-muted">engagement</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {creator.nicheTags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-dark/5 px-2 py-0.5 text-xs text-dark/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border-light pt-4">
        <span className="text-sm">
          <span className="font-heading font-semibold">
            {formatINR(creator.baseRatePerVideo)}
          </span>
          <span className="text-xs text-muted"> / video</span>
        </span>
        <div className="flex gap-2">
          <Link
            to={`/brand/creators/${creator.id}`}
            className="rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium hover:bg-dark/5"
          >
            View
          </Link>
          <Link
            to={`/brand/creators/${creator.id}?action=deal`}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-light hover:opacity-90"
          >
            Start Deal
          </Link>
        </div>
      </div>
    </div>
  );
}
