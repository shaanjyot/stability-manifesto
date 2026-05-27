import { randomUUID } from 'crypto'
import { getSupabaseUrl } from '@/lib/supabase/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseServiceRoleClient } from '@/lib/supabase/service'

const BUCKET = 'blog-pdfs'

export type BlogMeta = {
  id: string
  slug: string
  title: string
  createdAt: string
  pdfUrl: string
  /** Present when selected from DB; new rows default to 0 */
  visitCount?: number
}

/** Match prior JSON shape for blog detail pages */
export type BlogContentFile = {
  summary: string
  pageCount?: number
}

export function publicBlogPdfUrl(storagePath: string): string {
  const base = (getSupabaseUrl() ?? '').replace(/\/$/, '')
  if (base) {
    return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`
  }
  return `/blogs/pdfs/${storagePath}`
}

export function slugify(input: string): string {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'post'
}

async function uniqueSlug(base: string, existing: Set<string>): Promise<string> {
  let slug = base
  let n = 2
  while (existing.has(slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  return slug
}

export async function listBlogsMeta(): Promise<BlogMeta[]> {
  const supabase = createSupabaseServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, created_at, pdf_storage_path, visit_count')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    createdAt: row.created_at,
    pdfUrl: publicBlogPdfUrl(row.pdf_storage_path),
    visitCount: typeof row.visit_count === 'number' ? row.visit_count : 0,
  }))
}

export async function incrementBlogVisit(slug: string): Promise<void> {
  if (!slug?.trim()) return
  const supabase = createSupabaseServerClient()
  if (!supabase) return

  const { error } = await supabase.rpc('increment_blog_visit', { p_slug: slug.trim() })
  if (error) {
    console.warn('[blogs] increment_blog_visit:', error.message)
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogMeta | null> {
  const supabase = createSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blogs')
    .select('id, slug, title, created_at, pdf_storage_path')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    createdAt: data.created_at,
    pdfUrl: publicBlogPdfUrl(data.pdf_storage_path),
  }
}

export async function loadBlogContent(id: string): Promise<BlogContentFile | null> {
  const supabase = createSupabaseServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('blogs')
    .select('summary, page_count')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null

  return {
    summary: data.summary,
    pageCount: data.page_count ?? undefined,
  }
}

/** Build a short summary from raw PDF text (opening sentences, length-capped). */
export function extractSummaryFromText(raw: string, maxLen = 520): string {
  const trimmed = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!trimmed) {
    return ''
  }
  const paragraphs = textToParagraphs(trimmed)
  let s = paragraphs[0] ?? ''
  let i = 1
  while (s.length < maxLen && i < paragraphs.length) {
    s = `${s} ${paragraphs[i]}`
    i += 1
  }
  if (s.length <= maxLen) {
    return s.trim()
  }
  const slice = s.slice(0, maxLen)
  const lastSentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('.\n'))
  const lastSpace = slice.lastIndexOf(' ')
  const cut =
    lastSentence > maxLen * 0.45 ? lastSentence + 1 : lastSpace > maxLen * 0.35 ? lastSpace : maxLen
  const out = (cut > 0 ? slice.slice(0, cut) : slice).trim()
  return out.endsWith('.') ? out : `${out}…`
}

/** Split PDF text into readable paragraphs */
export function textToParagraphs(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const chunks = normalized.split(/\n{2,}/)
  const out: string[] = []
  for (const c of chunks) {
    const line = c.replace(/\n+/g, ' ').replace(/[ \t]+/g, ' ').trim()
    if (line.length > 0) out.push(line)
  }
  if (out.length === 0 && normalized.trim()) {
    return [normalized.trim().replace(/\n/g, ' ')]
  }
  return out
}

export async function createBlogFromPdf(opts: {
  pdfBuffer: Buffer
  originalFilename: string
  titleInput?: string | null
  summary: string
  pageCount?: number
}): Promise<BlogMeta> {
  const admin = createSupabaseServiceRoleClient()

  const { data: slugRows, error: slugErr } = await admin.from('blogs').select('slug')
  if (slugErr) {
    throw new Error(slugErr.message)
  }

  const existingSlugs = new Set((slugRows ?? []).map((r: { slug: string }) => r.slug))

  const baseName = opts.originalFilename.replace(/\.pdf$/i, '')
  const title =
    (opts.titleInput && opts.titleInput.trim()) ||
    baseName.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Untitled'

  const slug = await uniqueSlug(slugify(title), existingSlugs)
  const id = randomUUID()
  const pdf_storage_path = `${id}.pdf`

  const { error: uploadErr } = await admin.storage
    .from(BUCKET)
    .upload(pdf_storage_path, opts.pdfBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadErr) {
    throw new Error(uploadErr.message)
  }

  const summaryDisplay =
    opts.summary.trim() ||
    'No extractable text was found in this PDF. Read the full document in the viewer below.'

  const { data: inserted, error: insertErr } = await admin
    .from('blogs')
    .insert({
      id,
      slug,
      title,
      summary: summaryDisplay,
      page_count: opts.pageCount ?? null,
      pdf_storage_path,
      visit_count: 0,
    })
    .select('id, slug, title, created_at, pdf_storage_path')
    .single()

  if (insertErr || !inserted) {
    await admin.storage.from(BUCKET).remove([pdf_storage_path]).catch(() => {})
    throw new Error(insertErr?.message ?? 'Could not save blog record')
  }

  return {
    id: inserted.id,
    slug: inserted.slug,
    title: inserted.title,
    createdAt: inserted.created_at,
    pdfUrl: publicBlogPdfUrl(inserted.pdf_storage_path),
  }
}

export async function deleteBlogById(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!id || typeof id !== 'string' || id.includes('..')) {
    return { ok: false, error: 'Invalid id' }
  }

  const admin = createSupabaseServiceRoleClient()

  const { data: row, error: fetchErr } = await admin
    .from('blogs')
    .select('pdf_storage_path')
    .eq('id', id)
    .maybeSingle()

  if (fetchErr || !row?.pdf_storage_path) {
    return { ok: false, error: 'Blog not found' }
  }

  const storagePath = row.pdf_storage_path
  if (
    storagePath.includes('..') ||
    storagePath.includes('/') ||
    storagePath.includes('\\')
  ) {
    return { ok: false, error: 'Invalid stored PDF path' }
  }

  const { error: delErr } = await admin.from('blogs').delete().eq('id', id)

  if (delErr) {
    return { ok: false, error: delErr.message }
  }

  await admin.storage.from(BUCKET).remove([storagePath]).catch(() => {})

  return { ok: true }
}
