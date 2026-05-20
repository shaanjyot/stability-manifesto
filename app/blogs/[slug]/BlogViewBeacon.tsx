'use client'

import { useEffect, useRef } from 'react'

/** Fire-and-forget view count once the visitor actually lands on the page (not prefetch-only). */
export function BlogViewBeacon({ slug }: { slug: string }) {
  const sent = useRef(false)

  useEffect(() => {
    if (!slug?.trim() || sent.current) return
    sent.current = true
    void fetch('/api/blogs/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug.trim() }),
      keepalive: true,
    }).catch(() => {})
  }, [slug])

  return null
}
