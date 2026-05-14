/** Supabase URL from dashboard */
export function getSupabaseUrl(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  return v || undefined
}

/**
 * Publishable / anon key for browser and SSR (never use service_role here).
 * Supports legacy NEXT_PUBLIC_SUPABASE_ANON_KEY and newer publishable key name.
 */
export function getSupabasePublishableKey(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  return raw || undefined
}

/** URL + anon/publishable key (auth client can run). */
export function supabasePublishableEnvReady(): boolean {
  return !!(getSupabaseUrl() && getSupabasePublishableKey())
}
