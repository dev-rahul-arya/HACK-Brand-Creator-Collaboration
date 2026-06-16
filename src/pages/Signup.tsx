import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthShell, type Role } from "@/components/AuthShell";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole: Role = searchParams.get("role") === "creator" ? "creator" : "brand";
  const [role, setRole] = useState<Role>(initialRole);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // No backend yet — route to the role's dashboard.
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
          className="input-dark"
        />
        <input type="email" required placeholder="Email" className="input-dark" />
        <input type="password" required placeholder="Password" className="input-dark" />
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 font-heading font-semibold text-light hover:opacity-90"
        >
          Sign up as {role}
        </button>
      </form>
    </AuthShell>
  );
}
