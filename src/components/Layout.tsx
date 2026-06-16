import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const baseLinks = [
  { to: "/", label: "Home" },
  { to: "/brand/discover", label: "Discover" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors hover:text-light ${isActive ? "text-light" : "text-muted"}`;

export default function Layout() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const dashboard =
    role === "creator" ? "/creator/dashboard" : "/brand/dashboard";

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-border-dark">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-heading text-lg font-bold text-primary">
            Proofluence
          </Link>
          <ul className="flex items-center gap-6 text-sm">
            {baseLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === "/"} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <NavLink to={dashboard} className={linkClass}>
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-muted transition-colors hover:text-light"
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
