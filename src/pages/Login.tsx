import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { useAuth, type Role } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, role: sessionRole } = useAuth();
  const [role, setRole] = useState<Role>("brand");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    // Prefer the role from the authenticated session; fall back to the toggle.
    const dest = (sessionRole ?? role) === "creator" ? "/creator/dashboard" : "/brand/dashboard";
    navigate(dest);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Proofluence account."
      role={role}
      onRoleChange={setRole}
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="text-info hover:text-primary">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-dark"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-dark"
        />
        {error && <p className="text-sm text-primary">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 font-heading font-semibold text-light hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Logging in…" : `Log in as ${role}`}
        </button>
      </form>
    </AuthShell>
  );
}
