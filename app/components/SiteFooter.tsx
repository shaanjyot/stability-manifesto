import Link from 'next/link'
import { NAV_ITEMS, sectionHref } from '@/lib/site-nav'

type Props = {
  onScrollTo?: (id: string) => void
}

export function SiteFooter({ onScrollTo }: Props) {
  return (
    <footer
      style={{
        background: '#030305',
        borderTop: '1px solid rgba(192,160,96,0.1)',
        padding: '80px 24px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 200,
          background: 'radial-gradient(ellipse, rgba(192,160,96,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="footer-top" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 48, marginBottom: 48 }}>
          <div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 24,
                fontWeight: 700,
                color: '#c0a060',
                letterSpacing: 3,
                marginBottom: 12,
              }}
            >
              ⚓ STABILITY MANIFESTO
            </div>
            <div style={{ fontSize: 19, color: '#666', lineHeight: 1.5 }}>
              Intelligence builds the future.
              <br />
              <span style={{ color: '#c0a060' }}>Stability protects it.</span>
            </div>
          </div>
          <div className="footer-links" style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: 3,
                  color: '#444',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                SECTIONS
              </div>
              {NAV_ITEMS.map((item) =>
                item.kind === 'link' ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      color: '#8888a0',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 14,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.label}
                  </Link>
                ) : onScrollTo ? (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onScrollTo(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8888a0',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      letterSpacing: 0.5,
                      padding: 0,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c0a060')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#8888a0')}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.id}
                    href={sectionHref(item.id)}
                    style={{
                      color: '#8888a0',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 14,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: 3,
                  color: '#444',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                CONTACT
              </div>
              <div style={{ fontSize: 14, color: '#8888a0', lineHeight: 2 }}>Ashish Warudkar</div>
              <div style={{ fontSize: 14, color: '#8888a0', lineHeight: 2 }}>Manhattan Project 2.0</div>
              <a
                href="https://x.com/warudkar_a36955"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#7eb8d4', lineHeight: 2, textDecoration: 'none' }}
              >
                @warudkar_a36955
              </a>
              <a href="mailto:ashish@manhattanproject20.com" style={{ fontSize: 14, color: '#7eb8d4', lineHeight: 2, textDecoration: 'none' }}>
                ashish@manhattanproject20.com
              </a>
              <a
                href="https://manhattanproject20.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#7eb8d4', lineHeight: 2, textDecoration: 'none' }}
              >
                manhattanproject20.com
              </a>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 24 }} />
        <div style={{ fontSize: 19, color: '#333', letterSpacing: 0.5 }}>
          © 2026 The Manhattan Project 2.0 · Ashish Warudkar · Patent Pending · All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
