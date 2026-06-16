import { Link } from "react-router-dom";

type Role = "brand" | "creator";

export function AuthShell({
  title,
  subtitle,
  role,
  onRoleChange,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  role: Role;
  onRoleChange: (r: Role) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <Link to="/" className="font-heading text-xl font-bold text-primary">
        Proofluence
      </Link>
      <h1 className="mt-8 text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>

      {/* Role toggle */}
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-border-dark p-1">
        {(["brand", "creator"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onRoleChange(r)}
            className={`rounded-md py-2 text-sm font-medium capitalize transition-colors ${
              role === r ? "bg-primary text-light" : "text-muted hover:text-light"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {children}

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border-dark py-2.5 text-sm font-medium hover:bg-light/5"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-muted">{footer}</p>
    </div>
  );
}

export type { Role };
