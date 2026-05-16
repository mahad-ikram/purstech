import { createClient } from "@supabase/supabase-js";

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Browser client (anon key — safe to expose) ────────────────────────
// Use in client components for non-sensitive operations.
export const supabase = createClient(URL, ANON);

// ── Admin client (service role key — SERVER ONLY) ─────────────────────
// NEVER import this in a "use client" component — the service role key
// bypasses Row Level Security and must stay on the server.
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
