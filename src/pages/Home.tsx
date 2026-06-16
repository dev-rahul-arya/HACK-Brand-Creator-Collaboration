import { Link } from "react-router-dom";

const sections = [
  { to: "/brand/discover", label: "Brand → Discover creators (leaderboard)" },
  { to: "/brand/dashboard", label: "Brand → Dashboard" },
  { to: "/creator/dashboard", label: "Creator → Dashboard" },
  { to: "/creator/profile", label: "Creator → Profile & YouTube connect" },
  { to: "/login", label: "Login" },
  { to: "/signup", label: "Sign up" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold text-primary">Proofluence</h1>
      <p className="mt-2 text-lg text-muted">
        Know your ROI before you spend a rupee.
      </p>
      <p className="mt-6 max-w-xl leading-relaxed">
        Transparent brand–creator collaboration: score creators with AI, project
        campaign ROI before spending, and track live performance via affiliate
        links and coupon codes.
      </p>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-muted">
        Sections
      </h2>
      <ul className="mt-4 space-y-2">
        {sections.map((s) => (
          <li key={s.to}>
            <Link to={s.to} className="text-info hover:text-primary">
              {s.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-sm text-muted">
        Placeholder landing — visual design comes later. Building functional
        pages first.
      </p>
    </div>
  );
}
