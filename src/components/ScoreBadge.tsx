import { getTier, tierColor } from "@/lib/creators";

export function ScoreBadge({
  score,
  showLabel = true,
  size = 56,
}: {
  score: number;
  showLabel?: boolean;
  size?: number;
}) {
  const tier = getTier(score);
  const color = tierColor(tier);

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-heading font-bold"
        style={{
          width: size,
          height: size,
          border: `3px solid ${color}`,
          color,
        }}
      >
        {score}
      </div>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>
          {tier}
        </span>
      )}
    </div>
  );
}
