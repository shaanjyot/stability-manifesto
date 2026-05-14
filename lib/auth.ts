import { adminAllowlistConfigured, isAdminEmail } from '@/lib/admin-emails'
import {
  getSupabaseUrl,
  supabasePublishableEnvReady,
} from '@/lib/supabase/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export function supabaseAuthEnvConfigured(): boolean {
  return supabasePublishableEnvReady() && adminAllowlistConfigured()
}

export { supabasePublishableEnvReady }

/** Server-side uploads and DB writes (never expose this key to the browser). */
export function supabaseServiceConfigured(): boolean {
  return !!(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
}

/** Current Supabase user only if they are in ADMIN_EMAIL allowlist */
export async function getAuthenticatedAdminUser() {
  if (!supabaseAuthEnvConfigured()) return null

  const supabase = createSupabaseServerClient()
  if (!supabase) return null

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user?.email || !isAdminEmail(user.email)) {
    return null
  }

  return user
}
