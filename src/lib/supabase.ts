import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False when env vars are missing — lets the UI fall back to demo navigation. */
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — auth runs in demo mode."
  );
}

// Placeholder values keep createClient from throwing when env is absent;
// guarded by isSupabaseConfigured before any real call.
export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "public-anon-placeholder"
);
