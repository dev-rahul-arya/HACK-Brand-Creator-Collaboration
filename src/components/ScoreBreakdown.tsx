import { SCORE_WEIGHTS, type ScoreBreakdown as Breakdown } from "@/lib/creators";

export function ScoreBreakdown({ breakdown }: { breakdown: Breakdown }) {
  return (
    <div className="space-y-3">
      {SCORE_WEIGHTS.map(({ key, label, weight }) => {
        const value = breakdown[key];
        return (
          <div key={key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span>
                {label}{" "}
                <span className="text-xs text-muted">({weight}%)</span>
              </span>
              <span className="font-heading font-semibold">{value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-dark/10">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
