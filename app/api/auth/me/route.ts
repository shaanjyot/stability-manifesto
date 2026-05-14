import { NextResponse } from 'next/server'
import { adminAllowlistConfigured, isAdminEmail } from '@/lib/admin-emails'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabasePublishableEnvReady } from '@/lib/supabase/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const configured = supabasePublishableEnvReady()
  const adminEmailsConfigured = adminAllowlistConfigured()

  if (!configured) {
    return NextResponse.json({
      authenticated: false,
      configured: false,
      adminEmailsConfigured: false,
    })
  }

  try {
    const supabase = createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({
        authenticated: false,
        configured: true,
        adminEmailsConfigured,
      })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const authenticated =
      adminEmailsConfigured && !!(user?.email && isAdminEmail(user.email))

    return NextResponse.json({
      authenticated,
      configured: true,
      adminEmailsConfigured,
    })
  } catch {
    return NextResponse.json({
      authenticated: false,
      configured: true,
      adminEmailsConfigured,
    })
  }
}
