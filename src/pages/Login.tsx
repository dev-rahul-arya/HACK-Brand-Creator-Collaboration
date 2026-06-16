import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, type Role } from "@/components/AuthShell";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("brand");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // No backend yet — route to the role's dashboard.
    navigate(role === "brand" ? "/brand/dashboard" : "/creator/dashboard");
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
        <input type="email" required placeholder="Email" className="input-dark" />
        <input type="password" required placeholder="Password" className="input-dark" />
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 font-heading font-semibold text-light hover:opacity-90"
        >
          Log in as {role}
        </button>
      </form>
    </AuthShell>
  );
}
