import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin-emails'
import { supabaseAuthEnvConfigured } from '@/lib/auth'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function POST(req: Request) {
  const url = getSupabaseUrl()
  const anonKey = getSupabasePublishableKey()

  if (!url || !anonKey || !supabaseAuthEnvConfigured()) {
    return NextResponse.json(
      {
        error:
          'Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY), and ADMIN_EMAIL in .env.local.',
      },
      { status: 503 }
    )
  }

  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const cookieStore = cookies()
  const okResponse = NextResponse.json({ ok: true })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          okResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
  if (signErr) {
    const msg =
      signErr.message === 'Invalid login credentials' ? 'Invalid credentials' : signErr.message
    return NextResponse.json({ error: msg }, { status: 401 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    const forbidden = NextResponse.json(
      { error: 'This account is not authorized for admin access.' },
      { status: 403 }
    )

    const signOutClient = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            forbidden.cookies.set(name, value, options)
          })
        },
      },
    })

    await signOutClient.auth.signOut()
    return forbidden
  }

  return okResponse
}
