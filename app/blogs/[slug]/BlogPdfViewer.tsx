'use client'

import { useEffect, useState } from 'react'
import { pdfEmbedUrl } from '@/lib/pdf-embed-url'

type Props = {
  pdfUrl: string
  /** From pdf-parse at upload; omit for older posts → simple full viewer */
  pageCount?: number
}

export function BlogPdfViewer({ pdfUrl, pageCount: initialTotal }: Props) {
  const paged = typeof initialTotal === 'number' && initialTotal > 1

  const [page, setPage] = useState(1)
  const [jump, setJump] = useState('1')
  const [totalPages, setTotalPages] = useState(initialTotal && initialTotal > 0 ? initialTotal : 1)

  useEffect(() => {
    if (typeof initialTotal === 'number' && initialTotal > 0) {
      setTotalPages(initialTotal)
    }
  }, [initialTotal])

  useEffect(() => {
    setJump(String(page))
  }, [page])

  const src = pdfEmbedUrl(pdfUrl, paged ? page : undefined)

  const go = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, Math.round(p)))
    setPage(next)
  }

  const commitJump = () => {
    const n = parseInt(jump, 10)
    if (Number.isFinite(n)) go(n)
    else setJump(String(page))
  }

  if (!paged) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(192,160,96,0.15)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '12px 16px',
          }}
        >
          <span style={{ fontSize: 12, color: '#666', letterSpacing: 1, textTransform: 'uppercase' }}>
            PDF
          </span>
        </div>
        <div style={{ position: 'relative', height: 'min(75vh, 900px)', minHeight: 480 }}>
          <iframe
            title="Blog PDF"
            src={pdfEmbedUrl(pdfUrl)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              background: '#111',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(192,160,96,0.15)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 12, color: '#666', letterSpacing: 1, textTransform: 'uppercase' }}>
          Document
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            style={{
              background: 'rgba(192,160,96,0.15)',
              border: '1px solid rgba(192,160,96,0.3)',
              color: '#c0a060',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.4 : 1,
            }}
          >
            ‹ Prev
          </button>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: 13,
              color: '#888',
            }}
          >
            Page
            <input
              type="text"
              inputMode="numeric"
              aria-label="Jump to page"
              value={jump}
              onChange={(e) => setJump(e.target.value.replace(/\D/g, ''))}
              onBlur={commitJump}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  commitJump()
                  ;(e.target as HTMLInputElement).blur()
                }
              }}
              style={{
                width: 40,
                padding: '4px 6px',
                borderRadius: 6,
                border: '1px solid rgba(192,160,96,0.35)',
                background: 'rgba(0,0,0,0.4)',
                color: '#c0a060',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 13,
                textAlign: 'center',
              }}
            />
            <span style={{ color: '#444' }}>/ {totalPages}</span>
          </label>
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page >= totalPages}
            style={{
              background: 'rgba(192,160,96,0.15)',
              border: '1px solid rgba(192,160,96,0.3)',
              color: '#c0a060',
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 6,
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.4 : 1,
            }}
          >
            Next ›
          </button>
        </div>
      </div>
      <div style={{ position: 'relative', height: 'min(75vh, 900px)', minHeight: 480 }}>
        <iframe
          key={page}
          src={src}
          title="Blog PDF"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            background: '#111',
          }}
        />
      </div>
      {totalPages > 1 && totalPages <= 40 && (
        <div
          className="blog-pdf-rail"
          style={{
            display: 'flex',
            gap: 6,
            padding: '12px 16px',
            flexWrap: 'nowrap',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: '#444',
              letterSpacing: 2,
              textTransform: 'uppercase',
              flexShrink: 0,
              marginRight: 4,
            }}
          >
            Pages
          </span>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={page === p ? 'page' : undefined}
              style={{
                width: 30,
                height: 30,
                flexShrink: 0,
                borderRadius: 6,
                border: `1px solid ${page === p ? '#c0a060' : 'rgba(255,255,255,0.08)'}`,
                background: page === p ? '#c0a060' : 'rgba(255,255,255,0.03)',
                color: page === p ? '#000' : '#666',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 10,
                cursor: 'pointer',
                fontWeight: page === p ? 700 : 400,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
