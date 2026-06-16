import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

export type Role = "brand" | "creator";

type Result = { error: string | null };

type AuthValue = {
  session: Session | null;
  user: User | null;
  role: Role | null;
  name: string | null;
  loading: boolean;
  configured: boolean;
  signUp: (p: {
    email: string;
    password: string;
    role: Role;
    name: string;
  }) => Promise<Result>;
  signIn: (p: { email: string; password: string }) => Promise<Result>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const meta = user?.user_metadata ?? {};
  const role = (meta.role as Role | undefined) ?? null;
  const name = (meta.name as string | undefined) ?? null;

  async function signUp(p: {
    email: string;
    password: string;
    role: Role;
    name: string;
  }): Promise<Result> {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
      // Role + name live in user_metadata; a DB trigger can mirror these into
      // public.users / *_profiles on the Supabase side.
      options: { data: { role: p.role, name: p.name } },
    });
    if (error) console.error("[supabase signUp]", error);
    return { error: error ? error.message || "Sign up failed (see console)." : null };
  }

  async function signIn(p: { email: string; password: string }): Promise<Result> {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    });
    if (error) console.error("[supabase signIn]", error);
    return { error: error ? error.message || "Login failed (see console)." : null };
  }

  async function signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        name,
        loading,
        configured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
