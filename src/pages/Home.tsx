import { Link } from "react-router-dom";

const stats = [
  { value: "0–100", label: "Proofluence Score" },
  { value: "Pre-spend", label: "ROI projection" },
  { value: "First-party", label: "YouTube data" },
];

const steps = [
  {
    n: "01",
    title: "Score every creator",
    body: "AI rates niche clarity, audience authenticity, engagement quality and past ROI into one 0–100 Proofluence Score — built on authorized first-party data, never scraping.",
  },
  {
    n: "02",
    title: "Project ROI before you spend",
    body: "Pick a creator, set a budget, and see projected reach, clicks, conversions and ROAS using per-niche benchmarks and their real performance history.",
  },
  {
    n: "03",
    title: "Track live performance",
    body: "Close a deal and we auto-generate an affiliate link and coupon code. Watch clicks, conversions and revenue land on both dashboards in real time.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <span className="inline-block rounded-full border border-border-dark px-3 py-1 text-xs font-heading uppercase tracking-wide text-muted">
          For the Indian creator economy
        </span>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-tight sm:text-6xl">
          Know your ROI before
          <br />
          you spend a <span className="text-primary">rupee.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-light/80">
          Proofluence is a transparent brand–creator marketplace. Discover
          YouTube creators ranked by an AI Proofluence Score, project campaign
          ROI before committing budget, and track live results with affiliate
          links and coupon codes.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup?role=brand"
            className="rounded-lg bg-primary px-6 py-3 font-heading font-semibold text-light hover:opacity-90"
          >
            I'm a brand
          </Link>
          <Link
            to="/signup?role=creator"
            className="rounded-lg border border-border-dark px-6 py-3 font-heading font-semibold hover:border-primary"
          >
            I'm a creator
          </Link>
        </div>

        {/* Stat strip */}
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border-dark p-4">
              <div className="font-heading text-xl font-bold text-primary">
                {s.value}
              </div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-heading text-3xl font-bold">
          From guesswork to proof
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Three steps from discovery to measured return.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="surface rounded-xl border border-border-light p-6"
            >
              <div className="font-mono text-sm text-primary">{s.n}</div>
              <h3 className="mt-3 font-heading text-lg font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dark/70">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual audience CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border-dark p-8">
            <h3 className="font-heading text-2xl font-bold">For brands</h3>
            <p className="mt-2 text-light/75">
              Stop paying for vanity reach. Rank creators by proven performance,
              forecast ROAS, and spend with confidence.
            </p>
            <Link
              to="/brand/discover"
              className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 font-heading font-semibold text-light hover:opacity-90"
            >
              Discover creators →
            </Link>
          </div>
          <div className="rounded-2xl border border-border-dark p-8">
            <h3 className="font-heading text-2xl font-bold">For creators</h3>
            <p className="mt-2 text-light/75">
              Turn your real numbers into leverage. Connect YouTube, earn a
              Proofluence Score, and let brands come to you with fair offers.
            </p>
            <Link
              to="/creator/profile"
              className="mt-6 inline-block rounded-lg border border-border-dark px-5 py-2.5 font-heading font-semibold hover:border-primary"
            >
              Build your profile →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-dark">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-muted">
          <span className="font-heading font-semibold text-light">
            Proofluence
          </span>
          <span>Hackfluence 2026 · Built for the Indian creator economy</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-primary">
              Log in
            </Link>
            <Link to="/signup" className="hover:text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
