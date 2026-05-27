'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

/** Copy / system share for the current blog URL (clean path, no hash). */
export function BlogShareToolbar() {
  const [pageUrl, setPageUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyErr, setCopyErr] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setPageUrl(`${window.location.origin}${window.location.pathname}`)
    setCanShare(typeof navigator.share === 'function')
  }, [])

  const copyLink = async () => {
    if (!pageUrl) return
    setCopyErr(false)
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyErr(true)
    }
  }

  const shareNative = async () => {
    if (!pageUrl) return
    try {
      await navigator.share({
        url: pageUrl,
        title: typeof document !== 'undefined' ? document.title : undefined,
      })
    } catch (e) {
      const err = e as Error
      if (err?.name === 'AbortError') return
      await copyLink()
    }
  }

  const btnBase: CSSProperties = {
    background: 'rgba(192,160,96,0.12)',
    border: '1px solid rgba(192,160,96,0.35)',
    color: '#c0a060',
    padding: '8px 14px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: pageUrl ? 'pointer' : 'wait',
    fontFamily: "'Rajdhani', sans-serif",
    opacity: pageUrl ? 1 : 0.6,
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginTop: 16,
      }}
    >
      <span
        style={{
          fontSize: 14,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#666',
          fontWeight: 600,
          marginRight: 4,
        }}
      >
        Share
      </span>
      <button type="button" onClick={() => void copyLink()} disabled={!pageUrl} style={btnBase}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
      {canShare && (
        <button type="button" onClick={() => void shareNative()} disabled={!pageUrl} style={btnBase}>
          Share…
        </button>
      )}
      {copied && !copyErr && (
        <span style={{ fontSize: 13, color: '#5db85d', fontWeight: 600 }}>Link in clipboard</span>
      )}
      {copyErr && (
        <span style={{ fontSize: 13, color: '#c08060' }}>
          Copy blocked — select the URL in the address bar or try Share…
        </span>
      )}
    </div>
  )
}
