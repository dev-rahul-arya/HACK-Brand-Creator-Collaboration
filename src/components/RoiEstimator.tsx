import { useMemo, useState } from "react";
import type { Creator } from "@/lib/creators";
import { projectRoi, type RoiResult } from "@/lib/roi";
import { formatCount, formatINR } from "@/lib/format";

const confidenceColor: Record<RoiResult["confidence"], string> = {
  high: "var(--color-success)",
  medium: "var(--color-info)",
  low: "var(--color-muted)",
};

export function RoiEstimator({
  creator,
  onClose,
}: {
  creator: Creator;
  onClose: () => void;
}) {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(799);
  const [campaignBudget, setCampaignBudget] = useState(creator.baseRatePerVideo);

  // Recompute live as inputs change, so the projection visibly responds.
  const result: RoiResult | null = useMemo(
    () =>
      productPrice > 0 && campaignBudget > 0
        ? projectRoi(creator, { productPrice, campaignBudget })
        : null,
    [creator, productPrice, campaignBudget]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-dark/60"
      onClick={onClose}
    >
      <div
        className="surface h-full w-full max-w-md overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Estimate ROI</h2>
            <p className="text-sm text-muted">with {creator.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-muted hover:bg-dark/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <Field label="Product / service">
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Vitamin C Serum"
              className="input"
            />
          </Field>
          <Field label="Product price (₹)">
            <input
              type="number"
              min={1}
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Campaign budget (₹)">
            <input
              type="number"
              min={0}
              step={1000}
              value={campaignBudget}
              onChange={(e) => setCampaignBudget(Number(e.target.value))}
              className="input"
            />
            <span className="mt-1 block text-xs text-muted">
              ≈ {formatINR(creator.baseRatePerVideo)}/video — drag higher to fund
              more deliverables.
            </span>
          </Field>
        </div>

        {result && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold">Projection</h3>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  color: confidenceColor[result.confidence],
                  border: `1px solid ${confidenceColor[result.confidence]}`,
                }}
              >
                {result.confidence} confidence
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Projected revenue" value={formatINR(result.projectedRevenue)} big />
              <Stat label="ROAS" value={`${result.projectedRoas}×`} big />
              <Stat label="Reach (views)" value={formatCount(result.projectedViews)} />
              <Stat label="Est. clicks" value={formatCount(result.projectedClicks)} />
              <Stat label="Est. conversions" value={String(result.projectedConversions)} />
              <Stat
                label="Deliverables"
                value={`${result.deliverables} video${result.deliverables === 1 ? "" : "s"}`}
              />
              <Stat label="Total spend" value={formatINR(result.totalSpend)} />
            </div>

            <div className="rounded-lg border border-border-light p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Net ROI</span>
                <span
                  className="font-heading font-semibold"
                  style={{
                    color:
                      result.netRoi >= 0
                        ? "var(--color-success)"
                        : "var(--color-primary)",
                  }}
                >
                  {formatINR(result.netRoi)}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted">
                CTR {(result.ctrUsed * 100).toFixed(1)}%
                {creator.historicalAvgCtr ? " (historical)" : ` (×${result.engagementFactor.toFixed(2)} engagement)`}{" "}
                · conversion {(result.convRateUsed * 100).toFixed(1)}% · authenticity{" "}
                {(result.authFactor * 100).toFixed(0)}%
              </div>
            </div>

            <p className="text-xs text-muted">
              Reach is the creator's real avg views ({formatCount(creator.avgViews)})
              scaled by authenticity, engagement and deliverables. Conversion uses
              {creator.niche} niche benchmarks. Actual results may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-lg border border-border-light p-3">
      <div className={`font-heading font-bold ${big ? "text-xl text-primary" : "text-base"}`}>
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
