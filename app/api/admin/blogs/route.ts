import { NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import { getAuthenticatedAdminUser, supabaseAuthEnvConfigured, supabaseServiceConfigured } from '@/lib/auth'
import {
  createBlogFromPdf,
  deleteBlogById,
  extractSummaryFromText,
  textToParagraphs,
} from '@/lib/blogs-store'

export const runtime = 'nodejs'

async function requireAdmin() {
  if (!supabaseAuthEnvConfigured()) {
    return {
      error: NextResponse.json(
        {
          error:
            'Supabase admin auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and ADMIN_EMAIL.',
        },
        { status: 503 }
      ),
      user: null as Awaited<ReturnType<typeof getAuthenticatedAdminUser>>,
    }
  }

  const user = await getAuthenticatedAdminUser()
  if (!user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null as Awaited<ReturnType<typeof getAuthenticatedAdminUser>>,
    }
  }

  return { error: null, user }
}

export async function DELETE(req: Request) {
  const { error, user } = await requireAdmin()
  if (!user) return error!

  if (!supabaseServiceConfigured()) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY for storage and database writes.' },
      { status: 503 }
    )
  }

  let id: string | null = null
  try {
    const j = await req.json()
    id = typeof j?.id === 'string' ? j.id : null
  } catch {
    id = null
  }
  if (!id) {
    id = new URL(req.url).searchParams.get('id')
  }
  if (!id?.trim()) {
    return NextResponse.json({ error: 'Missing blog id' }, { status: 400 })
  }

  const result = await deleteBlogById(id.trim())
  if (!result.ok) {
    const status = result.error === 'Blog not found' ? 404 : 400
    return NextResponse.json({ error: result.error ?? 'Delete failed' }, { status })
  }
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  const { error, user } = await requireAdmin()
  if (!user) return error!

  if (!supabaseServiceConfigured()) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_SERVICE_ROLE_KEY for PDF upload and publishing.' },
      { status: 503 }
    )
  }

  const form = await req.formData()
  const file = form.get('file')
  const title = form.get('title')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing PDF file' }, { status: 400 })
  }

  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  let text = ''
  let pageCount: number | undefined
  try {
    const parsed = await pdfParse(buf)
    text = typeof parsed.text === 'string' ? parsed.text : ''
    const n = (parsed as { numpages?: number }).numpages
    if (typeof n === 'number' && n > 0) pageCount = n
  } catch {
    return NextResponse.json(
      { error: 'Could not parse PDF. The file may be encrypted or corrupted.' },
      { status: 422 }
    )
  }

  const paragraphs = textToParagraphs(text)
  const summary =
    paragraphs.length > 0
      ? extractSummaryFromText(text)
      : 'No extractable text was found in this PDF. Read the full document in the viewer below.'

  try {
    const meta = await createBlogFromPdf({
      pdfBuffer: buf,
      originalFilename: file.name,
      titleInput: typeof title === 'string' ? title : null,
      summary,
      pageCount,
    })
    return NextResponse.json({ blog: meta })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Publish failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
