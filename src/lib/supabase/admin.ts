import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — NEVER import this into client components.
 * Used only inside Route Handlers for privileged actions like creating
 * staff auth accounts (Admin creating Agent / Sales Rep logins).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
