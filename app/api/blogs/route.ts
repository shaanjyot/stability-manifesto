import { NextResponse } from 'next/server'
import { listBlogsMeta } from '@/lib/blogs-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const blogs = await listBlogsMeta()
  return NextResponse.json({ blogs })
}
