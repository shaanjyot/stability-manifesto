import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export function createSupabaseServerClient(): SupabaseClient | null {
  const url = getSupabaseUrl()
  const anonKey = getSupabasePublishableKey()
  if (!url || !anonKey) {
    return null
  }

  const cookieStore = cookies()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          /* Server Components cannot always set cookies; middleware refreshes session. */
        }
      },
    },
  })
}
