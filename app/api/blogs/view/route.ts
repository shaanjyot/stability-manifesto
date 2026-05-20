import { NextResponse } from 'next/server'
import { incrementBlogVisit } from '@/lib/blogs-store'

export const dynamic = 'force-dynamic'

/**
 * Records one page view for a blog slug (called from the client after navigation).
 * Avoids inflating counts when Next.js prefetches the RSC payload.
 */
export async function POST(req: Request) {
  let slug: string | null = null
  try {
    const j = (await req.json()) as { slug?: unknown }
    slug = typeof j.slug === 'string' ? j.slug.trim() : null
  } catch {
    slug = null
  }
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  await incrementBlogVisit(slug)
  return NextResponse.json({ ok: true })
}
