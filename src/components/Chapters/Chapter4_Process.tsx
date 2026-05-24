'use client'

import React, { useRef, useEffect, useState } from 'react'
import GoldRule from '@/components/UI/GoldRule'
import styles from './Chapter4_Process.module.css'

const STEPS = [
  {
    num: '01',
    title: 'Assessment',
    desc: 'Every book tells you what it needs. The spine is examined, the text block tested, the boards assessed. Only then does the work begin.',
    Illustration: () => (
      <svg viewBox="0 0 200 200" className={styles.illustration}>
        {/* Hands examining spine */}
        <path d="M 60 120 Q 80 80 100 100 Q 120 120 140 100" stroke="var(--leather)" strokeWidth="2" fill="none" opacity="0.6" />
        <rect x="85" y="60" width="30" height="80" rx="2" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.4" />
        {/* Magnifier hint */}
        <circle cx="140" cy="70" r="18" fill="none" stroke="var(--gold)" strokeWidth="1.2" opacity="0.45" />
        <line x1="153" y1="83" x2="164" y2="96" stroke="var(--gold)" strokeWidth="1.5" opacity="0.45" />
        <text x="100" y="175" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="9" fill="var(--ink)" opacity="0.3" letterSpacing="3">ASSESS</text>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Materials',
    desc: 'Leather, linen, thread, and paste — chosen to match the era and purpose of the book. Nothing synthetic where natural materials will endure.',
    Illustration: () => (
      <svg viewBox="0 0 200 200" className={styles.illustration}>
        {/* Cloth swatch */}
        <rect x="40" y="60" width="60" height="80" rx="2" fill="var(--cloth)" opacity="0.25" />
        <rect x="40" y="60" width="60" height="80" rx="2" fill="none" stroke="var(--cloth)" strokeWidth="1" opacity="0.4" />
        {/* Leather strip */}
        <rect x="110" y="80" width="50" height="40" rx="2" fill="var(--leather)" opacity="0.3" />
        {/* Thread spool */}
        <ellipse cx="100" cy="160" rx="20" ry="8" fill="var(--parchment-dark)" opacity="0.5" />
        <rect x="80" y="152" width="40" height="16" rx="4" fill="var(--leather-light)" opacity="0.25" />
        <text x="100" y="195" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="9" fill="var(--ink)" opacity="0.3" letterSpacing="3">GATHER</text>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Structure',
    desc: 'Signatures sewn on tapes or cords. The text block rounded and backed. Boards cut and lined. The book reassembles itself, stronger than before.',
    Illustration: () => (
      <svg viewBox="0 0 200 200" className={styles.illustration}>
        {/* Sewn signatures */}
        {[0,1,2,3].map(i => (
          <rect key={i} x={70 + i*4} y={50} width={3} height={100} rx={1} fill="var(--parchment-dark)" opacity={0.4} />
        ))}
        {/* Thread stitching */}
        <path d="M 70 80 Q 90 70 110 80 Q 130 90 150 80" stroke="var(--leather)" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 3" />
        <path d="M 70 110 Q 90 100 110 110 Q 130 120 150 110" stroke="var(--leather)" strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="4 3" />
        {/* Press boards */}
        <rect x="50" y="40" width="10" height="120" rx="1" fill="var(--cloth-dark)" opacity="0.35" />
        <rect x="140" y="40" width="10" height="120" rx="1" fill="var(--cloth-dark)" opacity="0.35" />
        <text x="100" y="195" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="9" fill="var(--ink)" opacity="0.3" letterSpacing="3">CONSTRUCT</text>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Finishing',
    desc: 'Gold tooling on the spine. Covers pressed to adhesion. Edges trimmed and polished. The book is closed, examined, and returned to its owner.',
    Illustration: () => (
      <svg viewBox="0 0 200 200" className={styles.illustration}>
        {/* Finished book */}
        <rect x="55" y="50" width="90" height="110" rx="2" fill="var(--cloth)" opacity="0.3" />
        <rect x="55" y="50" width="16" height="110" fill="var(--leather)" opacity="0.4" />
        {/* Gold bands */}
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={52} y={72 + i*15} width={22} height={5} rx={1} fill="var(--gold)" opacity={0.45} />
        ))}
        {/* Sparkle */}
        <line x1="140" y1="65" x2="148" y2="57" stroke="var(--gold)" strokeWidth="1.2" opacity="0.5" />
        <line x1="145" y1="61" x2="143" y2="61" stroke="var(--gold)" strokeWidth="1.2" opacity="0.5" />
        <text x="100" y="195" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="9" fill="var(--ink)" opacity="0.3" letterSpacing="3">COMPLETE</text>
      </svg>
    ),
  },
]

export default function Chapter4Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollX, setScrollX] = useState(0)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    if (isMobile) return // mobile: vertical scroll, no horizontal trick

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (rect.height - windowH)))
      const maxScroll = track.scrollWidth - track.clientWidth
      setScrollX(progress * maxScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  return (
    <section ref={sectionRef} id="chapter-process" className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.chapterLabel}>Chapter Three</span>
        <GoldRule width="60%" />
        <h2 className={styles.heading}>The Process</h2>
        <GoldRule width="40%" />
      </div>

      <div className={styles.trackOuter}>
        <div
          ref={trackRef}
          className={styles.track}
          style={isMobile ? {} : { transform: `translateX(-${scrollX}px)` }}
        >
          {STEPS.map(({ num, title, desc, Illustration }) => (
            <div key={num} className={styles.page}>
              <div className={styles.pageInner}>
                <div className={styles.illustrationArea}>
                  <Illustration />
                </div>
                <div className={styles.pageText}>
                  <span className={styles.stepNum}>{num}</span>
                  <GoldRule width="80%" />
                  <h3 className={styles.stepTitle}>{title}</h3>
                  <p className={styles.stepDesc}>{desc}</p>
                </div>
              </div>
              {/* Page edge lines */}
              <div className={styles.pageEdgeLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
