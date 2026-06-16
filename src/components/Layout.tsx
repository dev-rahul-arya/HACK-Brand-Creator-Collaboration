import { Link, NavLink, Outlet } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/brand/discover", label: "Discover" },
  { to: "/brand/dashboard", label: "Brand" },
  { to: "/creator/dashboard", label: "Creator" },
  { to: "/login", label: "Login" },
];

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border-dark">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-heading text-lg font-bold text-primary">
            Proofluence
          </Link>
          <ul className="flex gap-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `transition-colors hover:text-light ${
                      isActive ? "text-light" : "text-muted"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
