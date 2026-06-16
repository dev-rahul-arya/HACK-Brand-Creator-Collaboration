import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { useAuth, type Role } from "@/lib/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, configured } = useAuth();
  const initialRole: Role = searchParams.get("role") === "creator" ? "creator" : "brand";
  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const { error } = await signUp({ email, password, role, name });
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    // With email confirmation on, Supabase won't return a live session yet.
    if (configured) {
      setNotice("Account created. Check your email to confirm, then log in.");
      return;
    }
    navigate(role === "brand" ? "/brand/dashboard" : "/creator/dashboard");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        role === "brand"
          ? "Find creators and project ROI before you spend."
          : "Get scored, get discovered, and track your deals."
      }
      role={role}
      onRoleChange={setRole}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-info hover:text-primary">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          required
          placeholder={role === "brand" ? "Company name" : "Your name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-dark"
        />
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
          minLength={6}
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-dark"
        />
        {error && <p className="text-sm text-primary">{error}</p>}
        {notice && <p className="text-sm text-success">{notice}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 font-heading font-semibold text-light hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating…" : `Sign up as ${role}`}
        </button>
      </form>
    </AuthShell>
  );
}
