'use client'

import React, { useRef, useState, useEffect } from 'react'
import GoldRule from '@/components/UI/GoldRule'
import PageEdge from '@/components/UI/PageEdge'
import styles from './Chapter2_About.module.css'

export default function Chapter2About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [pageTurn, setPageTurn] = useState(0)
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (rect.height * 0.6)))
      setPageTurn(progress)
      if (progress > 0.7) setTextVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pageFrontRotate = -pageTurn * 180

  return (
    <section ref={sectionRef} id="chapter-about" className={styles.section}>
      <div className={styles.bookSpread}>
        {/* Left page — decorative tools illustration */}
        <div className={styles.leftPage}>
          <PageEdge side="right" />
          <div className={styles.toolsIllustration} aria-label="Bookbinding tools illustration">
            <svg viewBox="0 0 240 320" className={styles.toolsSvg} aria-hidden="true">
              {/* Bone folder */}
              <path d="M 40 80 Q 60 60 80 80 Q 100 100 120 80" stroke="var(--ink)" strokeWidth="1.5" fill="none" opacity="0.5" />
              {/* Awl */}
              <line x1="150" y1="60" x2="160" y2="200" stroke="var(--ink)" strokeWidth="1.2" opacity="0.45" />
              <ellipse cx="155" cy="58" rx="6" ry="10" fill="var(--leather-dark)" opacity="0.4" />
              {/* Needle and thread */}
              <path d="M 80 160 Q 120 140 160 160 Q 200 180 200 200" stroke="var(--gold-dark)" strokeWidth="0.8" fill="none" opacity="0.5" strokeDasharray="4 2" />
              {/* Paste brush */}
              <rect x="50" y="200" width="8" height="60" rx="2" fill="var(--leather-dark)" opacity="0.35" />
              <rect x="46" y="248" width="16" height="20" rx="1" fill="var(--leather)" opacity="0.3" />
              {/* Linen thread spool */}
              <ellipse cx="190" cy="250" rx="20" ry="10" fill="var(--cloth-mid)" opacity="0.3" />
              <rect x="170" y="240" width="40" height="20" rx="5" fill="var(--cloth)" opacity="0.2" />
              {/* Label */}
              <text x="120" y="300" textAnchor="middle" fontFamily="Libre Baskerville, serif" fontSize="8" fill="var(--ink)" opacity="0.35" letterSpacing="2">THE CRAFT</text>
            </svg>
          </div>
        </div>

        {/* Page turn mechanism */}
        <div className={styles.pageTurnWrapper}>
          <div
            className={styles.pageFront}
            style={{ transform: `perspective(900px) rotateY(${pageFrontRotate}deg)` }}
          >
            <div className={styles.pageInner}>
              <div className={styles.pageNumber}>i</div>
            </div>
          </div>
        </div>

        {/* Right page — About text */}
        <div className={`${styles.rightPage} ${textVisible ? styles.textVisible : ''}`}>
          <PageEdge side="left" />
          <div className={styles.pageContent}>
            <span className={styles.chapterLabel}>Chapter One</span>
            <GoldRule width="60%" />
            <h2 className={styles.heading}>The Craft</h2>
            <GoldRule width="40%" />
            <div className={styles.body}>
              <p>
                Walker Book Works began with a simple conviction: that every book,
                however worn, carries within it a story worth preserving. Ethan Walker
                built his practice in Australia around the quiet discipline of the
                bookbinder&rsquo;s bench — where patience, precision, and the right materials
                conspire to give damaged volumes a second life.
              </p>
              <p>
                From full leather rebinds to delicate paper repairs, each commission
                is approached with the same care a surgeon brings to healing. The book
                is opened, assessed, and understood before a single stitch is placed.
              </p>
              <p>
                The studio also runs hands-on workshops — intimate classes where
                participants learn the foundational movements: folding, sewing, pressing,
                and casing-in. The tools are simple. The results endure.
              </p>
            </div>
            <div className={styles.cornerOrnament} aria-hidden="true">&#x2767;</div>
          </div>
        </div>
      </div>
    </section>
  )
}
