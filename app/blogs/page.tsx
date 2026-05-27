import Link from 'next/link'
import { listBlogsMeta } from '@/lib/blogs-store'

export const dynamic = 'force-dynamic'

export default async function BlogsIndexPage() {
  const blogs = await listBlogsMeta()

  return (
    <div style={{ color: '#e0e0f0', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <header style={{ marginBottom: 56 }}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: 4,
              color: '#c0a060',
              textTransform: 'uppercase',
              marginBottom: 14,
              fontWeight: 700,
            }}
          >
            PUBLICATIONS
          </div>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              color: '#e8e8f8',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            <span style={{ color: '#c0a060' }}>Blogs</span> &amp; briefs
          </h1>
          <p style={{ fontSize: 17, color: '#707088', maxWidth: 560, lineHeight: 1.7 }}>
            Each entry includes a short extracted summary and an embedded PDF viewer.
          </p>
        </header>

        {blogs.length === 0 ? (
          <div
            style={{
              padding: '48px 32px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              textAlign: 'center',
              color: '#666',
              fontSize: 16,
            }}
          >
            No posts yet. Admin can publish from{' '}
            <Link href="/admin" style={{ color: '#c0a060', textDecoration: 'underline' }}>
              /admin
            </Link>
            .
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {blogs.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/blogs/${b.slug}`}
                  style={{
                    display: 'block',
                    padding: '28px 32px',
                    borderRadius: 12,
                    border: '1px solid rgba(192,160,96,0.15)',
                    background: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#555', marginBottom: 10 }}>
                    {new Date(b.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 'clamp(20px, 2.5vw, 26px)',
                      color: '#e8e8f8',
                      fontWeight: 700,
                      marginBottom: 10,
                      lineHeight: 1.25,
                    }}
                  >
                    {b.title}
                  </h2>
                  <span style={{ fontSize: 14, color: '#c0a060', fontWeight: 600, letterSpacing: 1 }}>
                    Read →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
