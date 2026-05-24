'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ROUTES } from '@/config/squarespace'
import styles from './BookExperience.module.css'

type Phase = 'closed' | 'opening' | 'open'
const TOTAL_SPREADS = 6

// ─── Inline design primitives ────────────────────────────────────

function GoldRule({ width = '100%', narrow }: { width?: string; narrow?: boolean }) {
  return (
    <div
      className={styles.goldRule}
      style={{ width, height: narrow ? '1px' : '1px' }}
      aria-hidden="true"
    />
  )
}

function SpineContent({ compact }: { compact?: boolean }) {
  return (
    <div className={`${styles.spineInner} ${compact ? styles.spineCompact : ''}`}>
      <div className={styles.spineBand} />
      <div className={styles.spineBand} />
      <span className={styles.spineTitle}>Walker Book Works</span>
      <div className={styles.spineBand} />
      <div className={styles.spineBand} />
      <div className={styles.spineBand} />
    </div>
  )
}

// ─── Spread 0 — Endpaper ─────────────────────────────────────────

function EndpaperLeft() {
  return (
    <div className={styles.endpaper}>
      <svg className={styles.marblingFill} viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="520" fill="var(--cloth-dark)" opacity="0.08" />
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M ${i * 30 - 10} 0 C ${i * 30 + 25} ${70 + i * 22}, ${i * 30 - 18} ${200 + i * 18}, ${i * 30 + 12} 520`}
            stroke={i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--cloth)' : 'var(--cloth-mid)'}
            strokeWidth={i % 2 === 0 ? '2.2' : '1.1'}
            fill="none"
            opacity={0.28 + (i % 4) * 0.12}
          />
        ))}
      </svg>
    </div>
  )
}

function EndpaperRight() {
  return (
    <div className={styles.endpaper}>
      <svg className={styles.marblingFill} viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M ${410 - i * 30} 0 C ${410 - i * 30 - 22} ${60 + i * 25}, ${410 - i * 30 + 15} ${220 + i * 15}, ${410 - i * 30 - 10} 520`}
            stroke={i % 3 === 0 ? 'var(--gold-dark)' : i % 3 === 1 ? 'var(--cloth-mid)' : 'var(--cloth)'}
            strokeWidth={i % 2 === 0 ? '2.0' : '1.3'}
            fill="none"
            opacity={0.25 + (i % 4) * 0.13}
          />
        ))}
      </svg>
      <div className={styles.endpaperQuote}>
        <p className={styles.quoteText}>&ldquo;Every book deserves<br />a life well-bound.&rdquo;</p>
        <span className={styles.quoteAttrib}>— Ethan Walker</span>
      </div>
    </div>
  )
}

// ─── Spread 1 — The Craft ────────────────────────────────────────

function CraftLeft() {
  return (
    <div className={styles.pageContent}>
      <div className={styles.illustrationArea}>
        <svg viewBox="0 0 200 300" className={styles.toolsSvg} aria-label="Bookbinding tools: bone folder, awl, needle and thread, paste brush">
          {/* Bone folder */}
          <rect x="82" y="18" width="14" height="180" rx="7" fill="var(--leather-pale)" stroke="var(--leather-dark)" strokeWidth="1" />
          <ellipse cx="89" cy="22" rx="9" ry="13" fill="var(--leather-light)" />
          {/* Awl */}
          <rect x="54" y="28" width="9" height="145" rx="4" fill="var(--ink-light)" stroke="var(--ink)" strokeWidth="0.6" />
          <rect x="49" y="155" width="19" height="38" rx="3" fill="var(--leather)" />
          {/* Needle and thread */}
          <line x1="123" y1="18" x2="121" y2="195" stroke="var(--ink)" strokeWidth="1.8" />
          <path d="M 121 18 Q 140 55 132 105 Q 124 150 138 192" stroke="var(--parchment-dark)" strokeWidth="1.2" fill="none" />
          {/* Paste brush */}
          <rect x="148" y="38" width="11" height="125" rx="2.5" fill="var(--leather-dark)" />
          <rect x="144" y="158" width="19" height="32" rx="2" fill="var(--cloth)" />
          {/* Horizontal rule */}
          <line x1="30" y1="215" x2="170" y2="215" stroke="var(--ink-light)" strokeWidth="0.7" opacity="0.35" />
          {[0, 28, 56, 84, 112, 140].map((x) => (
            <line key={x} x1={30 + x} y1="211" x2={30 + x} y2="219" stroke="var(--ink-light)" strokeWidth="0.7" opacity="0.35" />
          ))}
          {/* Parchment scrap */}
          <rect x="22" y="232" width="156" height="50" rx="2" fill="var(--parchment)" stroke="var(--parchment-dark)" strokeWidth="1" />
          <line x1="32" y1="247" x2="168" y2="247" stroke="var(--ink-light)" strokeWidth="0.7" opacity="0.28" />
          <line x1="32" y1="260" x2="148" y2="260" stroke="var(--ink-light)" strokeWidth="0.7" opacity="0.28" />
          <line x1="32" y1="272" x2="125" y2="272" stroke="var(--ink-light)" strokeWidth="0.7" opacity="0.28" />
        </svg>
      </div>
    </div>
  )
}

function CraftRight() {
  return (
    <div className={styles.pageContent}>
      <span className={styles.chapterLabel}>Chapter One</span>
      <GoldRule />
      <h2 className={styles.heading}>The Craft</h2>
      <GoldRule narrow />
      <div className={styles.body}>
        <p>
          <span className={styles.dropCap}>E</span>than Walker has spent two decades learning the unhurried art of bookbinding — an apprenticeship measured not in years but in the weight of linen thread, the smell of wheat-starch paste, and the patient resistance of a well-tempered spine.
        </p>
        <p>
          Working from his studio in Australia, Ethan repairs books that hold lives: inherited bibles, childhood favourites, crumbling first editions. He also creates new bindings from scratch — quarter-bound, half-bound, full leather — each one constructed by hand from materials selected for the individual book.
        </p>
        <p>
          Every technique traces to the European tradition: French link stitch, tight-back leather, hand-marbled endpapers. The tools on the facing page are his daily companions.
        </p>
      </div>
      <div className={styles.fleuron} aria-hidden="true">❧</div>
      <span className={styles.pageNum}>1</span>
    </div>
  )
}

// ─── Spread 2 — Services ─────────────────────────────────────────

function ServicesLeft() {
  return (
    <div className={styles.pageContent}>
      <span className={styles.chapterLabel}>Chapter Two</span>
      <GoldRule />
      <h2 className={styles.heading}>Services</h2>
      <GoldRule narrow />
      <p className={styles.intro}>
        Four ways Ethan Walker can bring a book back to life — or create something entirely new.
      </p>
      <span className={styles.pageNum}>ii</span>
    </div>
  )
}

const SERVICE_CARDS = [
  { title: 'Book Repair', sub: 'Restoration & Rebinding', desc: 'Damaged spines, broken hinges, detached boards — restored to integrity.', href: ROUTES.repair, rot: -1.8, offset: 0 },
  { title: 'Custom Binding', sub: 'Full Commission', desc: 'Quarter-bound, half-bound, or full leather — every binding constructed by hand.', href: ROUTES.binding, rot: 2.2, offset: 1 },
  { title: 'Workshops', sub: 'Hands-On Classes', desc: 'Learn to fold, sew, and case-in your own hand-bound book. All materials provided.', href: ROUTES.workshops, rot: -1.2, offset: 2 },
  { title: 'Enquiries', sub: 'Bespoke Commissions', desc: 'Unusual projects considered. If it involves a book, Ethan is interested.', href: ROUTES.enquiry, rot: 1.5, offset: 3 },
]

function ServicesRight() {
  const [hovered, setHovered] = useState<number | null>(null)
  return (
    <div className={styles.cardsArea}>
      {SERVICE_CARDS.map((svc, i) => (
        <a
          key={svc.title}
          href={svc.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.serviceCard} ${hovered === i ? styles.serviceCardHovered : ''}`}
          style={{
            '--card-rotate': `${svc.rot}deg`,
            '--card-z': i + 1,
            '--card-offset': `${svc.offset * 17}px`,
          } as React.CSSProperties}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`${svc.title} — ${svc.sub}`}
        >
          <div className={styles.cardLeatherTop} />
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{svc.title}</h3>
            <span className={styles.cardSub}>{svc.sub}</span>
            <GoldRule width="90%" />
            <p className={styles.cardDesc}>{svc.desc}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

// ─── Spread 3 — Process ──────────────────────────────────────────

const PROCESS_STEPS = [
  { num: '01', title: 'Assess', desc: "Every book begins with a conversation. Ethan examines structure, paper, binding history, and the owner's intentions." },
  { num: '02', title: 'Materials', desc: 'Leather, cloth, thread, and adhesives are selected to match both the period and purpose of the book.' },
  { num: '03', title: 'Construct', desc: 'Signatures are sewn by hand on a sewing frame. Boards are laced on. Leather is pared and applied.' },
  { num: '04', title: 'Finish', desc: 'Gold tooling, edge gilding, and final pressing. The book leaves as it should always have been.' },
]

function ProcessLeft() {
  return (
    <div className={styles.pageContent}>
      <span className={styles.chapterLabel}>Chapter Three</span>
      <GoldRule />
      <h2 className={styles.heading}>The Process</h2>
      <GoldRule narrow />
      <div className={styles.processSteps}>
        {PROCESS_STEPS.slice(0, 2).map((s) => (
          <div key={s.num} className={styles.processStep}>
            <span className={styles.stepNum}>{s.num}</span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepDesc}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProcessRight() {
  return (
    <div className={styles.pageContent}>
      <div className={styles.processSteps} style={{ marginTop: '2rem' }}>
        {PROCESS_STEPS.slice(2).map((s) => (
          <div key={s.num} className={styles.processStep}>
            <span className={styles.stepNum}>{s.num}</span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepDesc}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div className={styles.fleuron} aria-hidden="true">❦</div>
    </div>
  )
}

// ─── Spread 4 — Workshops ────────────────────────────────────────

function WorkshopsLeft() {
  return (
    <div className={styles.pageContent}>
      <span className={styles.chapterLabel}>Chapter Four</span>
      <GoldRule />
      <h2 className={styles.heading}>Workshops</h2>
      <GoldRule narrow />
      <dl className={styles.workshopDetails}>
        {[
          ['Duration', 'Full day · 9am–5pm'],
          ['Capacity', 'Six participants maximum'],
          ['Includes', 'All materials, tools, morning tea & lunch'],
          ['You leave with', 'One hand-bound book, sewn and cased by you'],
        ].map(([label, value]) => (
          <div key={label} className={styles.workshopDetail}>
            <dt className={styles.detailLabel}>{label}</dt>
            <dd className={styles.detailValue}>{value}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.workshopNote}>
        Workshops are held in Ethan&rsquo;s studio. No experience required — only curiosity and a willingness to work slowly.
      </p>
    </div>
  )
}

function WorkshopsRight() {
  return (
    <div className={styles.waxSealPage}>
      <a
        href={ROUTES.workshops}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.waxSealLink}
        aria-label="Book a workshop with Ethan Walker"
      >
        <div className={styles.waxSeal}>
          <svg viewBox="0 0 120 120" className={styles.waxSvg} aria-hidden="true">
            <circle cx="60" cy="60" r="55" fill="var(--wax)" />
            <circle cx="60" cy="60" r="49" fill="var(--wax-light)" opacity="0.25" />
            <circle cx="60" cy="60" r="45" fill="none" stroke="var(--wax-ring)" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="60" y="52" textAnchor="middle" fontFamily="var(--font-label)" fontSize="9.5" fill="var(--parchment)" letterSpacing="2.5">BOOK A</text>
            <text x="60" y="70" textAnchor="middle" fontFamily="var(--font-heading)" fontSize="17" fontStyle="italic" fill="var(--parchment)">Workshop</text>
          </svg>
        </div>
      </a>
      <p className={styles.sealNote}>Press the seal to reserve your place</p>
    </div>
  )
}

// ─── Spread 5 — Contact ──────────────────────────────────────────

function ContactLeft() {
  return (
    <div className={styles.pageContent}>
      <span className={styles.chapterLabel}>Chapter Five</span>
      <GoldRule />
      <h2 className={styles.heading}>Contact</h2>
      <GoldRule narrow />
      <dl className={styles.contactDetails}>
        {[
          ['Studio', 'Walker Book Works, Australia'],
          ['Email', 'info@walkerbookworks.com.au', 'mailto:info@walkerbookworks.com.au'],
          ['Phone', '0431 339 084', 'tel:+61431339084'],
        ].map(([label, value, href]) => (
          <div key={label} className={styles.contactLine}>
            <dt className={styles.contactLabel}>{label}</dt>
            <dd className={styles.contactValue}>
              {href ? (
                <a href={href} className={styles.contactLink}>{value}</a>
              ) : value}
            </dd>
          </div>
        ))}
      </dl>
      <GoldRule width="60%" />
      <a
        href={ROUTES.contact}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaButton}
      >
        Get in Touch
      </a>
    </div>
  )
}

function ContactRight() {
  return (
    <div className={styles.endpaper}>
      <svg className={styles.marblingFill} viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M ${i * 30 - 10} 0 C ${i * 30 + 25} ${70 + i * 22}, ${i * 30 - 18} ${200 + i * 18}, ${i * 30 + 12} 520`}
            stroke={i % 3 === 0 ? 'var(--gold)' : i % 3 === 1 ? 'var(--cloth)' : 'var(--cloth-mid)'}
            strokeWidth={i % 2 === 0 ? '2.2' : '1.1'}
            fill="none"
            opacity={0.28 + (i % 4) * 0.12}
          />
        ))}
      </svg>
      <div className={styles.studioMark}>
        <span className={styles.studioMarkInitials}>WBW</span>
        <div className={styles.studioMarkRule} />
        <span className={styles.studioMarkName}>Walker Book Works</span>
        <span className={styles.studioMarkEst}>Est. Australia</span>
      </div>
    </div>
  )
}

// ─── Spread registry ─────────────────────────────────────────────

const SPREADS: Array<{ Left: React.FC; Right: React.FC; title: string }> = [
  { Left: EndpaperLeft, Right: EndpaperRight, title: 'Endpaper' },
  { Left: CraftLeft, Right: CraftRight, title: 'The Craft' },
  { Left: ServicesLeft, Right: ServicesRight, title: 'Services' },
  { Left: ProcessLeft, Right: ProcessRight, title: 'The Process' },
  { Left: WorkshopsLeft, Right: WorkshopsRight, title: 'Workshops' },
  { Left: ContactLeft, Right: ContactRight, title: 'Contact' },
]

// ─── Book Experience ─────────────────────────────────────────────

export default function BookExperience() {
  const [phase, setPhase] = useState<Phase>('closed')
  const [spread, setSpread] = useState(0)
  const [turning, setTurning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const coverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && phase === 'closed') setPhase('open')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [phase])

  const openBook = useCallback(() => {
    if (phase !== 'closed') return
    setPhase('opening')
    setTimeout(() => setPhase('open'), 1400)
  }, [phase])

  const goTo = useCallback((next: number) => {
    if (turning || next < 0 || next >= TOTAL_SPREADS) return
    setTurning(true)
    setTimeout(() => {
      setSpread(next)
      setTurning(false)
    }, 600)
  }, [turning])

  useEffect(() => {
    if (phase !== 'open') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(spread + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(spread - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, spread, goTo])

  const { Left, Right } = SPREADS[spread]

  return (
    <div className={styles.scene} role="main" aria-label="Walker Book Works">
      {/* Desk atmosphere */}
      <div className={styles.desk} aria-hidden="true" />
      <div className={`${styles.bookGlow} ${phase !== 'closed' ? styles.bookGlowOpen : ''}`} aria-hidden="true" />

      {/* ── CLOSED BOOK (desktop only) ── */}
      {phase === 'closed' && !isMobile && (
        <div
          className={styles.closedScene}
          onClick={openBook}
          role="button"
          tabIndex={0}
          aria-label="Walker Book Works — click to open the book"
          onKeyDown={(e) => e.key === 'Enter' && openBook()}
        >
          <div className={styles.closedBookBody}>
            {/* Front cover */}
            <div className={styles.closedCover}>
              <div className={styles.clothTexture} />
              <div className={`${styles.leatherCorner} ${styles.cornerTL}`} />
              <div className={`${styles.leatherCorner} ${styles.cornerTR}`} />
              <div className={`${styles.leatherCorner} ${styles.cornerBL}`} />
              <div className={`${styles.leatherCorner} ${styles.cornerBR}`} />
              <div className={styles.coverText}>
                <span className={styles.coverTitle}>Walker Book Works</span>
                <div className={styles.coverGoldRule} />
                <span className={styles.coverSubtitle}>Binding · Repair · Craft</span>
              </div>
              {/* Tassel */}
              <div className={styles.tassel} aria-hidden="true">
                <div className={styles.tasselRibbon} />
                <div className={styles.tasselFringe}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className={styles.tasselThread} style={{ '--ti': i } as React.CSSProperties} />
                  ))}
                </div>
              </div>
            </div>
            {/* Spine face */}
            <div className={styles.closedSpine}>
              <SpineContent />
            </div>
            {/* Page edge stack */}
            <div className={styles.closedPageEdge} aria-hidden="true" />
            {/* Top edge */}
            <div className={styles.closedTopEdge} aria-hidden="true" />
            {/* Bottom edge */}
            <div className={styles.closedBottomEdge} aria-hidden="true" />
          </div>
          <p className={styles.openHint} aria-hidden="true">Click to open</p>
        </div>
      )}

      {/* ── OPENING ANIMATION ── */}
      {phase === 'opening' && !isMobile && (
        <div className={styles.openingScene}>
          <div className={styles.openingBook}>
            <div className={styles.openingCoverWrap}>
              <div ref={coverRef} className={`${styles.openingCover} ${styles.coverSwing}`}>
                <div className={styles.clothTexture} />
                <div className={`${styles.leatherCorner} ${styles.cornerTL}`} />
                <div className={`${styles.leatherCorner} ${styles.cornerBL}`} />
                <div className={styles.coverText}>
                  <span className={styles.coverTitle}>Walker Book Works</span>
                </div>
              </div>
            </div>
            <div className={styles.openingLeft}>
              <EndpaperLeft />
            </div>
            <div className={styles.openingRight}>
              <EndpaperRight />
            </div>
          </div>
        </div>
      )}

      {/* ── OPEN BOOK ── */}
      {phase === 'open' && (
        <div
          className={`${styles.openBook} ${isMobile ? styles.openBookMobile : ''} ${turning ? styles.openBookTurning : ''}`}
        >
          {/* Spine strip */}
          {!isMobile && (
            <div className={styles.openSpine} aria-hidden="true">
              <SpineContent compact />
            </div>
          )}

          {/* Left page */}
          <div className={styles.leftPage}>
            <div className={`${styles.pageInner} ${turning ? styles.pageOut : ''}`}>
              <Left />
            </div>
            {/* Page edge lines */}
            <div className={styles.pageEdgeLeft} aria-hidden="true" />
          </div>

          {/* Gutter */}
          <div className={styles.gutter} aria-hidden="true" />

          {/* Right page */}
          <div className={styles.rightPage}>
            <div className={`${styles.pageInner} ${turning ? styles.pageOut : ''}`}>
              <Right />
            </div>
            {/* Corner fold for next page */}
            {spread < TOTAL_SPREADS - 1 && (
              <button
                className={styles.cornerFold}
                onClick={() => goTo(spread + 1)}
                aria-label={`Turn to ${SPREADS[spread + 1].title}`}
              />
            )}
          </div>

          {/* Navigation arrows */}
          {spread > 0 && (
            <button
              className={`${styles.navArrow} ${styles.navPrev}`}
              onClick={() => goTo(spread - 1)}
              aria-label={`Previous: ${SPREADS[spread - 1].title}`}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {spread < TOTAL_SPREADS - 1 && (
            <button
              className={`${styles.navArrow} ${styles.navNext}`}
              onClick={() => goTo(spread + 1)}
              aria-label={`Next: ${SPREADS[spread + 1].title}`}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Spread indicator dots */}
          <div className={styles.spreadDots} role="tablist" aria-label="Book pages">
            {SPREADS.map((s, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === spread}
                aria-label={s.title}
                className={`${styles.dot} ${i === spread ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
