import { statusColor, type CampaignStatus } from "@/lib/campaigns";

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const color = statusColor(status);
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{ color, border: `1px solid ${color}` }}
    >
      {status.replace("_", " ")}
    </span>
  );
}
