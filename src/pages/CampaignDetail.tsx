import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCampaign,
  nextStatus,
  type CampaignStatus,
  type Message,
} from "@/lib/campaigns";
import { CampaignStatusStepper } from "@/components/CampaignStatusStepper";
import { StatusBadge } from "@/components/StatusBadge";
import { formatINR } from "@/lib/format";

export default function CampaignDetail() {
  const { id = "" } = useParams();
  const campaign = getCampaign(id);

  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? "draft");
  const [messages, setMessages] = useState<Message[]>(campaign?.messages ?? []);
  const [draft, setDraft] = useState("");

  if (!campaign) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-2xl font-bold">Campaign not found</h1>
        <Link to="/brand/dashboard" className="mt-4 inline-block text-info hover:text-primary">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const upcoming = nextStatus(status);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { sender: "brand", text, at: "now" }]);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/brand/dashboard" className="text-sm text-info hover:text-primary">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p className="text-muted">
            {campaign.brandName} ·{" "}
            <Link
              to={`/brand/creators/${campaign.creatorId}`}
              className="text-info hover:text-primary"
            >
              {campaign.creatorName}
            </Link>
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Stepper */}
      <section className="mt-8 rounded-xl border border-border-dark p-5">
        <CampaignStatusStepper status={status} />
        {upcoming && (
          <button
            onClick={() => setStatus(upcoming)}
            className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-heading font-semibold text-light hover:opacity-90"
          >
            Advance to {upcoming.replace("_", " ")} →
          </button>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Brief */}
        <section className="surface rounded-xl border border-border-light p-5">
          <h2 className="font-heading text-lg font-semibold">Campaign brief</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <Row label="Product">
              {campaign.productName} ({formatINR(campaign.productPrice)})
            </Row>
            <Row label="Budget">{formatINR(campaign.campaignBudget)}</Row>
            <Row label="Creator fee">{formatINR(campaign.creatorFee)}</Row>
            {(campaign.startDate || campaign.endDate) && (
              <Row label="Timeline">
                {campaign.startDate} → {campaign.endDate}
              </Row>
            )}
            {campaign.deliverables && <Row label="Deliverables">{campaign.deliverables}</Row>}
            {campaign.dos && <Row label="Do's">{campaign.dos}</Row>}
            {campaign.donts && <Row label="Don'ts">{campaign.donts}</Row>}
          </dl>

          {campaign.affiliate && (
            <div className="mt-4 rounded-lg border border-border-light p-3 text-sm">
              <div>
                Link <span className="font-mono">/r/{campaign.affiliate.slug}</span>
              </div>
              <div>
                Coupon <span className="font-mono">{campaign.affiliate.couponCode}</span> ·{" "}
                {campaign.affiliate.conversions} conversions ·{" "}
                {formatINR(campaign.affiliate.revenue)}
              </div>
            </div>
          )}
        </section>

        {/* Messaging */}
        <section className="surface flex flex-col rounded-xl border border-border-light p-5">
          <h2 className="font-heading text-lg font-semibold">Messages</h2>
          <div className="mt-3 flex-1 space-y-3 overflow-y-auto" style={{ maxHeight: 260 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.sender === "brand"
                    ? "ml-auto bg-primary text-light"
                    : "bg-dark/5 text-dark"
                }`}
              >
                {m.text}
                <div
                  className={`mt-0.5 text-[10px] ${
                    m.sender === "brand" ? "text-light/70" : "text-muted"
                  }`}
                >
                  {m.sender} · {m.at}
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
          </div>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="input"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 text-sm font-medium text-light hover:opacity-90"
            >
              Send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
