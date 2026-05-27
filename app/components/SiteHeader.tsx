'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DESKTOP_NAV, NAV_ITEMS, sectionHref } from '@/lib/site-nav'

type Props = {
  /** When true, section links use in-page scroll (home). Otherwise hash links to /. */
  onScrollTo?: (id: string) => void
}

export function SiteHeader({ onScrollTo }: Props) {
  const [scrollY, setScrollY] = useState(0)
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goSection = (id: string) => {
    if (onScrollTo) {
      onScrollTo(id)
    }
    setNavOpen(false)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.4s ease',
        padding: '0 24px',
        background: scrollY > 60 ? 'rgba(6,6,10,0.97)' : 'transparent',
        backdropFilter: scrollY > 60 ? 'blur(18px)' : 'none',
        borderBottom: scrollY > 60 ? '1px solid rgba(192,160,96,0.1)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 70,
        }}
      >
        {onScrollTo ? (
          <div
            onClick={() => goSection('hero')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <span style={{ fontSize: 24, color: '#c0a060' }}>⚓</span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#e0e0f0',
                letterSpacing: 2,
              }}
            >
              STABILITY<span style={{ color: '#c0a060' }}>.</span>
            </span>
          </div>
        ) : (
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: 24, color: '#c0a060' }}>⚓</span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#e0e0f0',
                letterSpacing: 2,
              }}
            >
              STABILITY<span style={{ color: '#c0a060' }}>.</span>
            </span>
          </Link>
        )}

        <div className="nav-links">
          {DESKTOP_NAV.map((item) => {
            if (item.kind === 'link') {
              return (
                <Link key={item.href} href={item.href} className="nav-item">
                  {item.label}
                </Link>
              )
            }
            if (item.kind === 'dropdown') {
              return (
                <div key={item.label} className="nav-dropdown">
                  <button type="button" className="nav-dropdown-trigger">
                    {item.label}
                  </button>
                  <div className="nav-dropdown-menu">
                    {item.items.map((sub) =>
                      onScrollTo ? (
                        <button key={sub.id} type="button" onClick={() => goSection(sub.id)}>
                          {sub.label}
                        </button>
                      ) : (
                        <Link key={sub.id} href={sectionHref(sub.id)} onClick={() => setNavOpen(false)}>
                          {sub.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )
            }
            if (onScrollTo) {
              return (
                <button key={item.id} type="button" className="nav-item" onClick={() => goSection(item.id)}>
                  {item.label}
                </button>
              )
            }
            return (
              <Link key={item.id} href={sectionHref(item.id)} className="nav-item">
                {item.label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          className="nav-menu-toggle"
          onClick={() => setNavOpen(!navOpen)}
          style={{ background: 'none', border: 'none', color: '#c0a060', fontSize: 22, cursor: 'pointer', padding: 8 }}
        >
          {navOpen ? '✕' : '☰'}
        </button>
      </div>

      {navOpen && (
        <div
          style={{
            background: 'rgba(6,6,10,0.98)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            borderTop: '1px solid rgba(192,160,96,0.15)',
          }}
        >
          {NAV_ITEMS.map((item) =>
            item.kind === 'link' ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                style={{
                  color: '#e0e0f0',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  padding: '10px 0',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            ) : onScrollTo ? (
              <button
                key={item.id}
                type="button"
                onClick={() => goSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e0e0f0',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  padding: '10px 0',
                  textAlign: 'left',
                  letterSpacing: 1,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={sectionHref(item.id)}
                onClick={() => setNavOpen(false)}
                style={{
                  color: '#e0e0f0',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  padding: '10px 0',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  )
}
