import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Service-role client for trusted server contexts only (webhooks, certificate
 * issuance). Never import this into client components. Returns null if the
 * service role key is absent.
 */
export function createAdminClient() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
