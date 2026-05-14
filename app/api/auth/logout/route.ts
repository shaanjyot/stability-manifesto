import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function POST() {
  const url = getSupabaseUrl()
  const anonKey = getSupabasePublishableKey()

  if (!url || !anonKey) {
    return NextResponse.json({ ok: true })
  }

  const cookieStore = cookies()
  const json = NextResponse.json({ ok: true })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          json.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.signOut()
  return json
}
