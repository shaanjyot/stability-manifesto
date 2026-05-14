'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

type BlogRow = {
  id: string
  slug: string
  title: string
  createdAt: string
}

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [adminEmailsConfigured, setAdminEmailsConfigured] = useState(true)
  const [checking, setChecking] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadMsg, setUploadMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [blogs, setBlogs] = useState<BlogRow[]>([])

  const fetchBlogs = useCallback(async () => {
    try {
      const r = await fetch('/api/blogs', { cache: 'no-store' })
      const j = await r.json()
      setBlogs(Array.isArray(j.blogs) ? j.blogs : [])
    } catch {
      setBlogs([])
    }
  }, [])

  const refreshSession = useCallback(async () => {
    setChecking(true)
    try {
      const r = await fetch('/api/auth/me', { credentials: 'include' })
      const j = await r.json()
      setConfigured(!!j.configured)
      setAdminEmailsConfigured(!!j.adminEmailsConfigured)
      setAuthenticated(!!j.authenticated)
    } catch {
      setConfigured(false)
      setAdminEmailsConfigured(false)
      setAuthenticated(false)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  useEffect(() => {
    if (authenticated) fetchBlogs()
  }, [authenticated, fetchBlogs])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setBusy(true)
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setLoginError(typeof j.error === 'string' ? j.error : 'Login failed')
        return
      }
      setPassword('')
      setEmail('')
      setAuthenticated(true)
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setAuthenticated(false)
    setBusy(false)
  }

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadMsg(null)
    if (!file) {
      setUploadMsg({ type: 'err', text: 'Choose a PDF file.' })
      return
    }
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (title.trim()) fd.append('title', title.trim())
      const r = await fetch('/api/admin/blogs', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setUploadMsg({ type: 'err', text: typeof j.error === 'string' ? j.error : 'Upload failed' })
        return
      }
      const slug = j.blog?.slug as string | undefined
      const t = j.blog?.title as string | undefined
      setUploadMsg({
        type: 'ok',
        text: slug ? `Published "${t ?? 'Post'}". Open /blogs/${slug}` : `Published: ${t ?? 'OK'}`,
      })
      setFile(null)
      setTitle('')
      fetchBlogs()
    } finally {
      setBusy(false)
    }
  }

  const deleteBlog = async (b: BlogRow) => {
    if (
      !confirm(
        `Delete "${b.title}" permanently?\n\nThis removes the PDF from storage and the blog row from the database.`
      )
    ) {
      return
    }
    setUploadMsg(null)
    setBusy(true)
    try {
      const r = await fetch('/api/admin/blogs', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b.id }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        setUploadMsg({ type: 'err', text: typeof j.error === 'string' ? j.error : 'Delete failed' })
        return
      }
      setUploadMsg({ type: 'ok', text: 'Post deleted.' })
      fetchBlogs()
    } finally {
      setBusy(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 400,
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid rgba(192,160,96,0.25)',
    background: 'rgba(0,0,0,0.35)',
    color: '#e8e8f8',
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 16,
    marginTop: 8,
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#888',
    fontWeight: 600,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#060608',
        fontFamily: "'Rajdhani', sans-serif",
        color: '#e0e0f0',
        padding: '80px 24px 64px',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <nav style={{ marginBottom: 32 }}>
          <Link
            href="/blogs"
            style={{ fontSize: 13, letterSpacing: 2, color: '#c0a060', textDecoration: 'none', fontWeight: 600 }}
          >
            ← Blogs
          </Link>
          <span style={{ color: '#333', margin: '0 12px' }}>|</span>
          <Link href="/" style={{ fontSize: 13, letterSpacing: 2, color: '#555', textDecoration: 'none' }}>
            Home
          </Link>
        </nav>

        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(26px, 4vw, 36px)',
            color: '#e8e8f8',
            marginBottom: 8,
          }}
        >
          Admin
        </h1>
        <p style={{ color: '#666', marginBottom: 36, fontSize: 15 }}>
          Sign in with Supabase email auth (allowlisted in ADMIN_EMAIL). Publish posts from PDF text extraction.
        </p>

        {checking ? (
          <p style={{ color: '#555' }}>Checking session…</p>
        ) : !configured ? (
          <div
            style={{
              padding: 20,
              borderRadius: 10,
              border: '1px solid rgba(224,112,112,0.35)',
              background: 'rgba(224,112,112,0.06)',
              color: '#e07070',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Server is missing <code style={{ color: '#c0a060' }}>NEXT_PUBLIC_SUPABASE_URL</code> and a publishable key (
            <code style={{ color: '#c0a060' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> or{' '}
            <code style={{ color: '#c0a060' }}>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>) in{' '}
            <code style={{ color: '#c0a060' }}>.env.local</code>. Restart <code style={{ color: '#c0a060' }}>npm run dev</code>{' '}
            after saving. See <code style={{ color: '#c0a060' }}>.env.example</code>.
          </div>
        ) : !adminEmailsConfigured ? (
          <div
            style={{
              padding: 20,
              borderRadius: 10,
              border: '1px solid rgba(192,160,96,0.45)',
              background: 'rgba(192,160,96,0.08)',
              color: '#d4c4a8',
              fontSize: 14,
              lineHeight: 1.65,
            }}
          >
            Add <code style={{ color: '#c0a060' }}>ADMIN_EMAIL</code> (or server-only{' '}
            <code style={{ color: '#c0a060' }}>SUPABASE_ADMIN_EMAIL</code>) to{' '}
            <code style={{ color: '#c0a060' }}>.env.local</code> with the exact email of your Supabase Auth user (Dashboard →
            Authentication → Users). Use commas for multiple admins. Restart dev server after saving.
          </div>
        ) : !authenticated ? (
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <div style={{ color: '#e07070', fontSize: 14 }}>{loginError}</div>
            )}
            <button
              type="submit"
              disabled={busy}
              style={{
                alignSelf: 'flex-start',
                background: 'linear-gradient(135deg, #c0a060, #a08040)',
                color: '#000',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 6,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: busy ? 'wait' : 'pointer',
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              Sign in
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#5db85d', fontSize: 14, fontWeight: 600 }}>Signed in</span>
              <button
                type="button"
                onClick={() => logout()}
                disabled={busy}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#888',
                  padding: '8px 16px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Sign out
              </button>
            </div>

            {uploadMsg && (
              <div style={{ color: uploadMsg.type === 'ok' ? '#5db85d' : '#e07070', fontSize: 14 }}>
                {uploadMsg.text}
              </div>
            )}

            <form onSubmit={upload} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Title (optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                  placeholder="Defaults from PDF filename"
                />
              </div>
              <div>
                <label style={labelStyle}>PDF file</label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  style={{ ...inputStyle, padding: 10 }}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(192,160,96,0.2)',
                  border: '1px solid #c0a060',
                  color: '#c0a060',
                  padding: '12px 28px',
                  borderRadius: 6,
                  fontWeight: 700,
                  letterSpacing: 1,
                  cursor: busy ? 'wait' : 'pointer',
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                Publish blog from PDF
              </button>
            </form>

            <div style={{ marginTop: 16 }}>
              <div style={{ ...labelStyle, marginBottom: 14 }}>Published posts</div>
              {blogs.length === 0 ? (
                <p style={{ color: '#555', fontSize: 14 }}>No posts yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {blogs.map((b) => (
                    <li
                      key={b.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                        padding: '14px 16px',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: '#e8e8f8', fontWeight: 600 }}>
                          {b.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#555', marginTop: 6, fontFamily: "'Share Tech Mono', monospace" }}>
                          /blogs/{b.slug}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Link
                          href={`/blogs/${b.slug}`}
                          style={{ fontSize: 13, color: '#7eb8d4', textDecoration: 'none', fontWeight: 600 }}
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => deleteBlog(b)}
                          style={{
                            background: 'rgba(224,112,112,0.12)',
                            border: '1px solid rgba(224,112,112,0.35)',
                            color: '#e07070',
                            padding: '8px 14px',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: busy ? 'wait' : 'pointer',
                            fontFamily: "'Rajdhani', sans-serif",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
