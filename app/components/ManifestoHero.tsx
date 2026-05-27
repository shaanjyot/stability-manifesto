'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type Pillar = {
  id: string
  label: string
  line: string
  icon: 'pulse' | 'target' | 'shield' | 'network' | 'people'
}

const HERO_PILLARS: Pillar[] = [
  {
    id: 'problem',
    label: 'The Problem',
    line: 'AI systems are becoming unstable at scale.',
    icon: 'pulse',
  },
  {
    id: 'paradigms',
    label: 'The Reality',
    line: 'We have entered the era of HCAS.',
    icon: 'target',
  },
  {
    id: 'missing',
    label: 'The Principle',
    line: 'Stability is the foundation of trust.',
    icon: 'shield',
  },
  {
    id: 'gudiya',
    label: 'The Solution',
    line: 'Stability Engineering provides the architecture.',
    icon: 'network',
  },
  {
    id: 'manifesto',
    label: 'The Call',
    line: 'Build the stability layer together.',
    icon: 'people',
  },
]

function PillarIcon({ type }: { type: Pillar['icon'] }) {
  const stroke = 'currentColor'
  const sw = 1.5
  switch (type) {
    case 'pulse':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M2 12h3l2.5-7 3 14 2.5-7H22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'target':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw} />
          <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth={sw} />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      )
    case 'shield':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3l8 3v6c0 5-3.5 9-8 9s-8-4-8-9V6l8-3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      )
    case 'network':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="6" cy="6" r="2.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="18" cy="6" r="2.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="12" cy="18" r="2.5" stroke={stroke} strokeWidth={sw} />
          <path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7" stroke={stroke} strokeWidth={sw} />
        </svg>
      )
    case 'people':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8" r="3" stroke={stroke} strokeWidth={sw} />
          <circle cx="17" cy="10" r="2.5" stroke={stroke} strokeWidth={sw} />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14 20c0-2.2 1.8-4 4-4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      )
  }
}

type Props = {
  scrollY: number
  onScrollTo: (id: string) => void
}

export function ManifestoHero({ scrollY, onScrollTo }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const parallax = Math.min(scrollY * 0.22, 120)

  return (
    <section id="hero" className="hero-cinematic" aria-label="The Stability Manifesto">
      <div
        className="hero-cinematic__bg"
        style={{ transform: `translate3d(0, ${parallax}px, 0) scale(1.06)` }}
        aria-hidden
      />
      <div className="hero-cinematic__beam" aria-hidden />
      <div className="hero-cinematic__dome-glow" aria-hidden />
      <div className="hero-cinematic__vignette" aria-hidden />
      <div className="hero-cinematic__grain" aria-hidden />

      <div className={`hero-cinematic__content ${mounted ? 'is-visible' : ''}`}>
        <p className="hero-cinematic__eyebrow hero-cinematic__reveal" style={{ '--i': 0 } as CSSProperties}>
          A new discipline for a complex world
        </p>

        <h1 className="hero-cinematic__title hero-cinematic__reveal" style={{ '--i': 1 } as CSSProperties}>
          <span className="hero-cinematic__title-line">The</span>
          <span className="hero-cinematic__title-line hero-cinematic__title-accent">Stability</span>
          <span className="hero-cinematic__title-line">Manifesto</span>
        </h1>

        <div className="hero-cinematic__divider hero-cinematic__reveal" style={{ '--i': 2 } as CSSProperties} aria-hidden>
          <span />
          <span />
          <span />
        </div>

        <div className="hero-cinematic__copy hero-cinematic__reveal" style={{ '--i': 3 } as CSSProperties}>
          <p>
            AI systems are no longer isolated tools. They are becoming hyper-complex adaptive systems that shape our
            world.
          </p>
          <p className="hero-cinematic__copy-emphasis">Stability is not optional.</p>
          <p>It is the foundation of trust, safety, and continuity.</p>
        </div>

        <div className="hero-cinematic__actions hero-cinematic__reveal" style={{ '--i': 4 } as CSSProperties}>
          <button type="button" className="hero-cinematic__btn hero-cinematic__btn--primary" onClick={() => onScrollTo('problem')}>
            Explore the crisis
          </button>
          <button type="button" className="hero-cinematic__btn hero-cinematic__btn--ghost" onClick={() => onScrollTo('pdf')}>
            Read the manifesto
          </button>
        </div>
      </div>

      <div className={`hero-cinematic__pillars ${mounted ? 'is-visible' : ''}`}>
        {HERO_PILLARS.map((pillar, i) => (
          <button
            key={pillar.id}
            type="button"
            className="hero-cinematic__pillar hero-cinematic__reveal"
            style={{ '--i': i + 5 } as CSSProperties}
            onClick={() => onScrollTo(pillar.id)}
          >
            <span className="hero-cinematic__pillar-icon">
              <PillarIcon type={pillar.icon} />
            </span>
            <span className="hero-cinematic__pillar-label">{pillar.label}</span>
            <span className="hero-cinematic__pillar-line">{pillar.line}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
