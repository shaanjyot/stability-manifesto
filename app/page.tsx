'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { pdfEmbedUrl } from '@/lib/pdf-embed-url'
import { ManifestoHero } from './components/ManifestoHero'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'

/** Five narrative beats — editorial through-line (replaces cramped “pillar” cards) */
const MANIFESTO_BEATS = [
  {
    icon: '⚡',
    title: 'The Problem',
    sub: 'Instability at Scale',
    desc: 'AI systems are not failing because they are not intelligent. They are failing because they are not stable. Multi-agent systems exhibit emergent failure modes invisible in isolation.',
    color: '#c0a060',
  },
  {
    icon: '🔄',
    title: 'The Reality',
    sub: 'HCAS Era',
    desc: 'We have entered the age of Hyper-Complex Adaptive Systems. Instability is the new normal — arising from interaction complexity, emergent dynamics, and time compression.',
    color: '#7eb8d4',
  },
  {
    icon: '🛡️',
    title: 'The Principle',
    sub: 'Foundation First',
    desc: 'Stability is not a feature. It is the foundation. Without stability, intelligence cannot be trusted — no matter how capable individual components become.',
    color: '#c0a060',
  },
  {
    icon: '🌐',
    title: 'The Discipline',
    sub: 'Stability Engineering',
    desc: 'Stability Engineering provides the architecture, mechanisms, and control for safe, scalable, resilient systems — operating at machine speed across the entire system field.',
    color: '#7eb8d4',
  },
  {
    icon: '📣',
    title: 'The Call',
    sub: 'Build Together',
    desc: 'This is not the work of any one organization. It is a call to build the stability layer for the future together — before instability forces it upon us.',
    color: '#c0a060',
  },
]

const FAILURE_MODES = [
  'Unauthorized action execution',
  'Sensitive data leakage across contexts',
  'Resource runaway through feedback loops',
  'Identity and authority confusion',
  'Cross-agent propagation of unsafe behavior',
  'Mismatch between reported outcomes and actual state',
]

const HISTORICAL = [
  {
    era: 'Electrical Grid',
    problem: 'Isolated generators, frequency drift, cascading failures',
    solution: 'System-wide grid infrastructure',
    icon: '⚡',
  },
  {
    era: 'Air Traffic Control',
    problem: 'Pilot judgment alone, collision risk, coordination chaos',
    solution: 'Centralized ATC coordination layer',
    icon: '✈️',
  },
  {
    era: 'The Internet',
    problem: 'Point-to-point chaos, interoperability failure',
    solution: 'TCP/IP protocol infrastructure',
    icon: '🌍',
  },
  {
    era: 'AI Systems',
    problem: 'Agent autonomy, emergent instability, causal velocity',
    solution: 'GUDIYA Stability Grid',
    icon: '🧠',
  },
]

const GUDIYA_FEATURES = [
  { label: 'Identity Continuity', desc: 'Verified identity across all system interactions', icon: '🪪' },
  { label: 'Decision Traceability', desc: 'Full audit trail across time and components', icon: '🔍' },
  { label: 'Continuous Telemetry', desc: 'Real-time monitoring of system-wide behavior', icon: '📡' },
  { label: 'Field-Level Control', desc: 'Shaping interactions across the entire agent field', icon: '🕹️' },
  { label: 'Runtime Stabilization', desc: 'Dynamic intervention at machine speed', icon: '⚙️' },
  { label: 'Cognitive Braking', desc: 'Emergency decompression and propagation control', icon: '🛑' },
]

const TABLE_ROWS = [
  { approach: 'MBSE', focus: 'Component correctness', gap: 'Cannot ensure global stability', verdict: '❌ Insufficient', good: false },
  { approach: 'AI Safety', focus: 'Individual agent outputs', gap: 'Ignores interaction dynamics', verdict: '❌ Incomplete', good: false },
  { approach: 'Guardrails', focus: 'Predefined static rules', gap: 'No runtime system coordination', verdict: '❌ Too slow', good: false },
  { approach: 'Prompt Engineering', focus: 'Local instruction tuning', gap: 'Partial context, no field view', verdict: '❌ Myopic', good: false },
  { approach: 'Stability Engineering', focus: 'System-wide field control', gap: '—', verdict: '✅ Required', good: true },
]

export default function StabilityManifesto() {
  const [scrollY, setScrollY] = useState(0)
  const [pdfPage, setPdfPage] = useState(1)
  const [pageJumpDraft, setPageJumpDraft] = useState('1')
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const totalPages = 28

  const pdfSrc = pdfEmbedUrl('/The_Stability_Manifesto-1.pdf', pdfPage)

  const goPdfPage = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, Math.round(p)))
    setPdfPage(next)
    setPageJumpDraft(String(next))
  }

  const commitPageJump = () => {
    const n = parseInt(pageJumpDraft, 10)
    if (Number.isFinite(n)) goPdfPage(n)
    else setPageJumpDraft(String(pdfPage))
  }

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const targets = document.querySelectorAll('[data-animate]')
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const key = (e.target as HTMLElement).dataset.animate!
            setVisible((prev) => ({ ...prev, [key]: true }))
          }
        })
      },
      { threshold: 0.12 }
    )
    targets.forEach((t) => observerRef.current!.observe(t))
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    setPageJumpDraft(String(pdfPage))
  }, [pdfPage])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const v = (key: string) => visible[key]

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif", background: '#060608', minHeight: '100vh', overflowX: 'hidden' }}>

      <SiteHeader onScrollTo={scrollTo} />

      <ManifestoHero scrollY={scrollY} onScrollTo={scrollTo} />

      {/* ── THROUGH-LINE (narrative beats) ── */}
      <section className="through-line-section" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #060608 0%, #0c0d18 50%, #060608 100%)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>THE THROUGH-LINE</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 16 }}>
            How the <span style={{ color: '#c0a060' }}>argument unfolds</span>
          </h2>
          <p style={{ fontSize: 18, color: '#707088', lineHeight: 1.7, marginBottom: 48, maxWidth: 640 }}>
            Five sequential beats — from the crisis of scale to the call to build — mapped as one readable arc instead of interchangeable cards.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MANIFESTO_BEATS.map((p, i) => (
              <div
                key={i}
                className="beat-row"
                data-animate={`beat-${i}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,72px) 1fr',
                  gap: '24px 28px',
                  padding: '36px 0',
                  borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${i * 0.08}s`,
                  opacity: v(`beat-${i}`) ? 1 : 0,
                  transform: v(`beat-${i}`) ? 'translateY(0)' : 'translateY(28px)',
                }}
              >
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 42, lineHeight: 1, color: `${p.color}44`, fontWeight: 400 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div style={{ position: 'absolute', left: 12, top: 52, bottom: -36, width: 1, background: `linear-gradient(180deg, ${p.color}66, transparent)` }} aria-hidden />
                </div>
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, background: `${p.color}18`, border: `1px solid ${p.color}44` }}>{p.icon}</div>
                    <div>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(17px,2.2vw,22px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 4 }}>{p.title}</h3>
                      <div style={{ fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: p.color }}>{p.sub}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 19, color: '#9090a8', lineHeight: 1.75, maxWidth: 720 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section id="problem" style={{ padding: '100px 24px', background: '#060608', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 200, background: 'radial-gradient(ellipse, rgba(224,112,112,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>SECTION 01</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 56 }}>
            The Problem — <span style={{ color: '#e07070' }}>Instability at Scale</span>
          </h2>
          <div className="two-col" style={{ display: 'flex', gap: 60, alignItems: 'flex-start', marginBottom: 60 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 19, color: '#9090a8', lineHeight: 1.8, marginBottom: 24 }}>
                For decades, computing operated under a stable paradigm — deterministic execution, predictable behavior, bounded interactions. The introduction of modern AI has <strong style={{ color: '#c0a060' }}>fundamentally altered this</strong>.
              </p>
              <p style={{ fontSize: 19, color: '#9090a8', lineHeight: 1.8, marginBottom: 24 }}>
                AI systems are now <strong style={{ color: '#7eb8d4' }}>autonomous, stateful, interactive, and adaptive</strong>. When these characteristics combine, systems transition into a new class: <em style={{ color: '#c0a060' }}>Hyper-Complex Adaptive Systems (HCAS)</em>.
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 32, alignItems: 'flex-start' }}>
                <div style={{ width: 3, background: '#c0a060', flexShrink: 0, borderRadius: 2, alignSelf: 'stretch' }} />
                <div>
                  <p style={{ fontSize: 18, color: '#c8c8d8', fontStyle: 'italic', lineHeight: 1.7 }}>
                    "These failures are emergent and do not arise from the model in isolation, but from its embedding within an interactive system."
                  </p>
                  <div style={{ fontSize: 19, color: '#666', marginTop: 8, letterSpacing: 1 }}>— Agents of Chaos, arxiv.org/pdf/2602.20021</div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, letterSpacing: 3, color: '#e07070', textTransform: 'uppercase', marginBottom: 20, fontWeight: 700 }}>⚠ OBSERVED FAILURE MODES</div>
              {FAILURE_MODES.map((f, i) => (
                <div key={i} data-animate={`fail-${i}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: 'rgba(224,112,112,0.04)',
                  border: '1px solid rgba(224,112,112,0.1)', borderRadius: 8, marginBottom: 8,
                  fontSize: 14, color: '#c0c0d0', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${i * 0.1}s`,
                  opacity: v(`fail-${i}`) ? 1 : 0,
                  transform: v(`fail-${i}`) ? 'translateX(0)' : 'translateX(30px)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e07070', flexShrink: 0, display: 'inline-block' }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Nyquist */}
          <div data-animate="nyquist" style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,160,96,0.15)', borderRadius: 16, padding: 40,
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            opacity: v('nyquist') ? 1 : 0, transform: v('nyquist') ? 'scale(1)' : 'scale(0.95)',
          }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: '#c0a060', marginBottom: 28 }}>⚡ The Nyquist Control Crisis</div>
            <div className="nyquist-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              {[
                { label: 'Traditional Systems', speed: 'Seconds → Minutes → Hours', ctrl: 'Human control: ✓ Sufficient', bar: 20, color: '#5db85d' },
                { label: 'AI Systems Today', speed: 'Milliseconds → Microseconds', ctrl: 'Human control: ✗ Violated', bar: 95, color: '#e07070' },
              ].map((n, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 19, color: '#e0e0f0', marginBottom: 8 }}>{n.label}</div>
                  <div style={{ fontSize: 18, color: '#888', marginBottom: 12, fontFamily: "'Share Tech Mono', monospace" }}>{n.speed}</div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${n.bar}%`, background: n.color, transition: 'width 1.5s ease' }} />
                  </div>
                  <div style={{ color: n.color, fontSize: 18, marginTop: 6 }}>{n.ctrl}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 14, color: '#666', fontStyle: 'italic', fontFamily: "'Share Tech Mono', monospace" }}>
              Feedback loops complete before intervention is possible → Amplification → Oscillation → Cascade
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY PARADIGMS FAIL ── */}
      <section id="paradigms" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #060608 0%, #080910 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>SECTION 02</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 56 }}>
            Why Existing <span style={{ color: '#c0a060' }}>Paradigms Fail</span>
          </h2>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 40 }}>
            <div className="comparison-table-header" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 3fr 2fr', background: 'rgba(255,255,255,0.04)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Approach', 'Focus', 'Fatal Gap', 'Verdict'].map((h, i) => (
                <div key={i} style={{ fontSize: 14, letterSpacing: 2, color: '#555', textTransform: 'uppercase', fontWeight: 700 }}>{h}</div>
              ))}
            </div>
            {TABLE_ROWS.map((row, i) => (
              <div key={i} data-animate={`row-${i}`} className="comparison-table-row" style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 3fr 2fr',
                padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: row.good ? 'rgba(192,160,96,0.08)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${row.good ? '#c0a060' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: `${i * 0.08}s`,
                opacity: v(`row-${i}`) ? 1 : 0,
                transform: v(`row-${i}`) ? 'translateY(0)' : 'translateY(20px)',
              }}>
                <div style={{ fontSize: 14, color: row.good ? '#c0a060' : '#e0e0f0', fontWeight: 700, alignSelf: 'center' }}>{row.approach}</div>
                <div style={{ fontSize: 14, color: '#8888a0', alignSelf: 'center' }}>{row.focus}</div>
                <div style={{ fontSize: 14, color: '#e07070', alignSelf: 'center' }}>{row.gap}</div>
                <div style={{ fontSize: 14, color: row.good ? '#5db85d' : '#e07070', alignSelf: 'center', fontWeight: 600 }}>{row.verdict}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 24, background: 'rgba(224,112,112,0.04)', border: '1px solid rgba(224,112,112,0.2)', borderRadius: 12, padding: 28, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>🪪</span>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#e8e8f8', marginBottom: 10 }}>Passportless Coupling — The Hidden Killer</div>
              <p style={{ fontSize: 19, color: '#8888a0', lineHeight: 1.7 }}>
                In AI-agentic systems, agents respond to any plausible input. Authority is inferred, not enforced. Context boundaries are porous. This transforms structured architecture into an{' '}
                <strong style={{ color: '#e07070' }}>unbounded interaction field</strong> — the primary propagation mechanism of systemic instability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSING LAYER ── */}
      <section id="missing" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #060608 0%, #0a0c14 50%, #060608 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>SECTION 03</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 24 }}>
            The <span style={{ color: '#7eb8d4' }}>Missing Layer</span>
          </h2>
          <p style={{ fontSize: 19, color: '#9090a8', lineHeight: 1.8, maxWidth: 680, margin: '0 auto 60px' }}>
            A consistent historical pattern emerges across every domain where complexity exceeded local control. The solution was always the same — a new system-wide stabilization layer.
          </p>

          <div style={{ position: 'relative' }}>
            {/* Center line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, transparent, #c0a060, transparent)', transform: 'translateX(-50%)', zIndex: 0 }} />
            {HISTORICAL.map((h, i) => (
              <div key={i} data-animate={`hist-${i}`} style={{
                display: 'flex', alignItems: 'center', marginBottom: 40, gap: 0,
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: `${i * 0.15}s`,
                opacity: v(`hist-${i}`) ? 1 : 0,
                transform: v(`hist-${i}`) ? 'translateY(0)' : 'translateY(30px)',
              }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(126,184,212,0.15)', borderRadius: 12, padding: '24px 28px' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{h.icon}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#7eb8d4', marginBottom: 8, fontWeight: 700 }}>{h.era}</div>
                  <div style={{ fontSize: 18, color: '#e07070', marginBottom: 6 }}>Problem: {h.problem}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#c0a060' }}>→ Solution: {h.solution}</div>
                </div>
                <div style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#c0a060', boxShadow: '0 0 20px rgba(192,160,96,0.6)' }} />
                </div>
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(192,160,96,0.08) 0%, rgba(126,184,212,0.08) 100%)', border: '1px solid rgba(192,160,96,0.2)', borderRadius: 16, padding: '36px 40px', textAlign: 'center', marginTop: 40 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: '#e8e8f8', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 12 }}>
              "Once interaction complexity exceeds local control, a system-level stabilization layer inevitably emerges."
            </div>
            <div style={{ fontSize: 18, color: '#c0a060', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>AI systems have now crossed that threshold.</div>
          </div>
        </div>
      </section>

      {/* ── WHY MANIFESTO ── */}
      <section id="manifesto" style={{ padding: '100px 24px', background: '#060608' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>SECTION 04</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 56 }}>
            The <span style={{ color: '#c0a060' }}>Causal Velocity</span> Crisis
          </h2>

          <div className="velocity-wrap" style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 48 }}>
            {[
              { icon: '🧬', title: 'Biological Speed', desc: 'Human civilization evolved around slow cognition — seconds, minutes, hours. Governments, enterprises, legal systems — all designed for biological-speed decision-making.', badge: '✓ Stable', badgeColor: '#5db85d', borderColor: 'rgba(126,184,212,0.15)' },
              { icon: '⚡', title: 'Machine Speed', desc: 'Agentic AI observes, reasons, decides, coordinates, and propagates actions autonomously — at millisecond and microsecond timescales across distributed networks.', badge: '⚠ Dangerous Gap', badgeColor: '#e07070', borderColor: 'rgba(224,112,112,0.3)' },
            ].map((c, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: `1px solid ${c.borderColor}`, borderRadius: 12, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{c.icon}</div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: '#e8e8f8', marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 19, color: '#8888a0', lineHeight: 1.7, marginBottom: 16 }}>{c.desc}</p>
                <span style={{ background: `${c.badgeColor}22`, color: c.badgeColor, padding: '4px 14px', borderRadius: 20, fontSize: 18, display: 'inline-block', border: `1px solid ${c.badgeColor}44` }}>{c.badge}</span>
              </div>
            ))}
            <div style={{ fontSize: 32, color: '#c0a060', flexShrink: 0 }}>→</div>
          </div>

          {/* AI Vertigo */}
          <div data-animate="vertigo" style={{
            background: 'radial-gradient(ellipse at center, rgba(224,112,112,0.06) 0%, rgba(6,6,10,0) 70%)',
            border: '1px solid rgba(224,112,112,0.2)', borderRadius: 16, padding: '36px 40px', marginBottom: 48,
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            opacity: v('vertigo') ? 1 : 0, transform: v('vertigo') ? 'scale(1)' : 'scale(0.96)',
          }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: '#e07070', marginBottom: 16 }}>🌀 AI-Vertigo</div>
            <p style={{ fontSize: 18, color: '#9090a8', lineHeight: 1.7, marginBottom: 24 }}>
              <strong style={{ color: '#c0a060' }}>Definition:</strong> The condition in which machine-speed causal propagation exceeds the ability of human or institutional cognition to maintain coherent situational awareness within an HCAS environment.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['Contradictory telemetry', 'Debugging paralysis', 'Delayed consequences', 'Unexplained oscillations', 'Cascading overcorrections'].map((s, i) => (
                <span key={i} style={{ padding: '6px 16px', background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.25)', borderRadius: 100, fontSize: 18, color: '#e07070' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Logic Chain */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#8888a0', marginBottom: 32, letterSpacing: 2, textTransform: 'uppercase' }}>The Entire Logic Chain</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              {['Agentic AI', 'Machine-Speed Causal Velocity', 'AI-Vertigo', 'Stability Engineering'].map((step, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    border: `1px solid ${i === 3 ? '#c0a060' : '#7eb8d4'}`,
                    borderRadius: 12, padding: '16px 48px', minWidth: 300, textAlign: 'center',
                    background: i === 3 ? 'rgba(192,160,96,0.12)' : 'rgba(126,184,212,0.06)',
                    boxShadow: i === 3 ? '0 0 40px rgba(192,160,96,0.15)' : 'none',
                  }}>
                    <div style={{ fontSize: 14, color: '#555', marginBottom: 4, fontFamily: "'Share Tech Mono', monospace" }}>0{i + 1}</div>
                    <div style={{ fontSize: 19, fontWeight: 600, color: i === 3 ? '#c0a060' : '#e0e0f0' }}>{step}</div>
                  </div>
                  {i < 3 && <div style={{ fontSize: 22, color: '#c0a060', margin: '8px 0', opacity: 0.6 }}>↓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GUDIYA ── */}
      <section id="gudiya" style={{ padding: '100px 24px', background: 'radial-gradient(ellipse at 50% 0%, rgba(192,160,96,0.08) 0%, #060608 60%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>THE SOLUTION</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, color: '#c0a060', marginBottom: 16, textShadow: '0 0 60px rgba(192,160,96,0.3)' }}>GUDIYA</h2>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48 }}>
            {['G — Governance', 'U — Utility', 'D — Decision', 'I — Identity', 'Y — Yielding', 'A — Auditability'].map((l, i) => (
              <div key={i} data-animate={`acr-${i}`} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(192,160,96,0.15)', borderRadius: 8, padding: '8px 20px', fontSize: 14, letterSpacing: 1,
                transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)', transitionDelay: `${i * 0.07}s`,
                opacity: v(`acr-${i}`) ? 1 : 0, transform: v(`acr-${i}`) ? 'translateY(0)' : 'translateY(20px)',
              }}>
                <span style={{ color: '#c0a060', fontWeight: 800 }}>{l.split('—')[0]}</span>
                <span style={{ color: '#8888a0' }}>—{l.split('—')[1]}</span>
              </div>
            ))}
          </div>

          <div className="gudiya-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 60 }}>
            {GUDIYA_FEATURES.map((f, i) => (
              <div key={i} data-animate={`gf-${i}`} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,160,96,0.12)', borderRadius: 12, padding: '24px 22px',
                transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)', transitionDelay: `${i * 0.1}s`,
                opacity: v(`gf-${i}`) ? 1 : 0, transform: v(`gf-${i}`) ? 'translateY(0)' : 'translateY(30px)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0a060'; e.currentTarget.style.background = 'rgba(192,160,96,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,160,96,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 19, color: '#c0a060', marginBottom: 8, fontWeight: 700 }}>{f.label}</div>
                <div style={{ fontSize: 18, color: '#888', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Arch Stack */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,160,96,0.1)', borderRadius: 16, padding: 36 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: '#8888a0', marginBottom: 24, textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase' }}>The Emerging Architectural Stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { layer: 'Application Layer', desc: 'Domain-specific intelligence', color: '#7eb8d4', highlight: false },
                { layer: 'Stability Layer ← GUDIYA', desc: 'System-wide control & coordination', color: '#c0a060', highlight: true },
                { layer: 'Infrastructure Layer', desc: 'Compute, storage, networking', color: '#5d7a8d', highlight: false },
              ].map((s, i) => (
                <div key={i} style={{
                  border: `1px solid ${s.color}`, borderRadius: 8, padding: '18px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: s.highlight ? 'rgba(192,160,96,0.1)' : 'rgba(255,255,255,0.02)',
                  transform: s.highlight ? 'scaleX(1.02)' : 'scaleX(1)',
                  boxShadow: s.highlight ? '0 0 40px rgba(192,160,96,0.15)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  <div style={{ color: s.color, fontWeight: 700, fontSize: 18 }}>{s.layer}</div>
                  <div style={{ color: '#888', fontSize: 14 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PDF VIEWER ── */}
      <section id="pdf" style={{ padding: '100px 24px', background: '#060608' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 14, letterSpacing: 4, color: '#c0a060', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>THE DOCUMENT</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: '#e8e8f8', marginBottom: 12 }}>
            Read the <span style={{ color: '#c0a060' }}>Full Manifesto</span>
          </h2>
          <p style={{ fontSize: 18, color: '#666', marginBottom: 40 }}>Prepared by Ashish Warudkar — The Manhattan Project 2.0 (patent pending)</p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192,160,96,0.15)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span style={{ color: '#c0a060', fontWeight: 700, fontSize: 14 }}>⚓ The Stability Manifesto</span>
                <span style={{ color: '#444', fontSize: 19, marginLeft: 12 }}>Ashish Warudkar · Patent Pending</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => goPdfPage(pdfPage - 1)} disabled={pdfPage === 1} style={{ background: 'rgba(192,160,96,0.15)', border: '1px solid rgba(192,160,96,0.3)', color: '#c0a060', fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 600, padding: '6px 16px', borderRadius: 6, cursor: pdfPage === 1 ? 'not-allowed' : 'pointer', letterSpacing: 1, opacity: pdfPage === 1 ? 0.4 : 1 }}>‹ Prev</button>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 14 }}>
                  <span style={{ color: '#555' }}>Page</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Jump to page"
                    value={pageJumpDraft}
                    onChange={(e) => setPageJumpDraft(e.target.value.replace(/\D/g, ''))}
                    onBlur={commitPageJump}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        commitPageJump()
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                    style={{
                      width: 44,
                      padding: '6px 8px',
                      borderRadius: 6,
                      border: '1px solid rgba(192,160,96,0.35)',
                      background: 'rgba(0,0,0,0.4)',
                      color: '#c0a060',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  />
                  <span style={{ color: '#444' }}>/ {totalPages}</span>
                </label>
                <button type="button" onClick={() => goPdfPage(pdfPage + 1)} disabled={pdfPage === totalPages} style={{ background: 'rgba(192,160,96,0.15)', border: '1px solid rgba(192,160,96,0.3)', color: '#c0a060', fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 600, padding: '6px 16px', borderRadius: 6, cursor: pdfPage === totalPages ? 'not-allowed' : 'pointer', letterSpacing: 1, opacity: pdfPage === totalPages ? 0.4 : 1 }}>Next ›</button>
              </div>
            </div>

            {/* PDF Frame — key forces remount so #page= updates inside embedded viewers */}
            <div style={{ position: 'relative', height: 800 }}>
              <iframe
                key={pdfPage}
                src={pdfSrc}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block', background: '#111' }}
                title="The Stability Manifesto PDF"
              />
            </div>

            {/* Page index */}
            <div className="pdf-page-rail" style={{ display: 'flex', gap: 6, padding: '14px 20px', flexWrap: 'nowrap', borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <span style={{ fontSize: 14, color: '#444', letterSpacing: 2, textTransform: 'uppercase', marginRight: 8, flexShrink: 0 }}>Pages:</span>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goPdfPage(p)}
                  aria-label={`View page ${p}`}
                  aria-current={pdfPage === p ? 'page' : undefined}
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    borderRadius: 6,
                    border: `1px solid ${pdfPage === p ? '#c0a060' : 'rgba(255,255,255,0.08)'}`,
                    background: pdfPage === p ? '#c0a060' : 'rgba(255,255,255,0.03)',
                    color: pdfPage === p ? '#000' : '#666',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: pdfPage === p ? 700 : 400,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter onScrollTo={scrollTo} />
    </div>
  )
}
