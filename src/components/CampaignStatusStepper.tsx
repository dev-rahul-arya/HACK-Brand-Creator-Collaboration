import { STATUS_FLOW, type CampaignStatus } from "@/lib/campaigns";

export function CampaignStatusStepper({ status }: { status: CampaignStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {STATUS_FLOW.map((s, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const color = done
          ? "var(--color-success)"
          : current
            ? "var(--color-primary)"
            : "var(--color-muted)";
        return (
          <li key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  border: `2px solid ${color}`,
                  color,
                  backgroundColor: current ? "var(--color-primary)" : "transparent",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="mt-1 text-[10px] capitalize"
                style={{ color: current ? "var(--color-light)" : "var(--color-muted)" }}
              >
                {s.replace("_", " ")}
              </span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                className="mx-1 h-0.5 w-6"
                style={{
                  backgroundColor: i < currentIndex ? "var(--color-success)" : "var(--color-border-dark)",
                }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
