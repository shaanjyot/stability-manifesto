import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogBySlug, loadBlogContent } from '@/lib/blogs-store'
import { BlogPdfViewer } from './BlogPdfViewer'
import { BlogShareToolbar } from './BlogShareToolbar'
import { BlogViewBeacon } from './BlogViewBeacon'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) return { title: 'Not found' }
  const c = await loadBlogContent(blog.id)
  const desc =
    c?.summary?.trim().slice(0, 160) || 'Read the full document in the embedded PDF viewer.'
  return {
    title: `${blog.title} · Stability Manifesto`,
    description: desc,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug)
  if (!blog) notFound()

  const content = await loadBlogContent(blog.id)
  const summary =
    content?.summary?.trim() ||
    'Read the full document in the PDF viewer below.'

  return (
    <article style={{ color: '#c8c8d8', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <BlogViewBeacon slug={blog.slug} />

        <header style={{ marginBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 28 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#555', marginBottom: 12 }}>
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(28px, 4.5vw, 42px)',
              fontWeight: 700,
              color: '#e8e8f8',
              lineHeight: 1.15,
              marginBottom: 12,
            }}
          >
            {blog.title}
          </h1>
          <BlogShareToolbar />
        </header>

        <section style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 3,
              color: '#c0a060',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Summary
          </div>
          <p
            style={{
              fontSize: 'clamp(16px, 1.15vw, 18px)',
              lineHeight: 1.8,
              color: '#a8a8b8',
              maxWidth: 720,
            }}
          >
            {summary}
          </p>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 3,
              color: '#c0a060',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Full document
          </div>
          <BlogPdfViewer pdfUrl={blog.pdfUrl} pageCount={content?.pageCount} />
        </section>
      </div>
    </article>
  )
}
