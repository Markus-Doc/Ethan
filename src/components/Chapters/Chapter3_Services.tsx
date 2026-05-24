'use client'

import React, { useRef, useState, useEffect } from 'react'
import GoldRule from '@/components/UI/GoldRule'
import TasselBookmark from '@/components/Book/TasselBookmark'
import { ROUTES } from '@/config/squarespace'
import styles from './Chapter3_Services.module.css'

const SERVICES = [
  {
    title: 'Book Repair',
    subtitle: 'Restoration & Rebinding',
    desc: 'Damaged spines, broken hinges, detached boards, and torn pages — restored to integrity with period-appropriate materials and techniques.',
    href: ROUTES.repair,
    rotation: -1.8,
  },
  {
    title: 'Custom Binding',
    subtitle: 'Full Commission Binding',
    desc: 'Quarter-bound, half-bound, or full leather — every binding is constructed by hand, from selecting the cloth to tooling the spine.',
    href: ROUTES.binding,
    rotation: 2.2,
  },
  {
    title: 'Workshops',
    subtitle: 'Hands-On Classes',
    desc: 'Intimate bookbinding workshops — learn to fold, sew, and case-in your own hand-bound book. All materials provided.',
    href: ROUTES.workshops,
    rotation: -1.2,
  },
  {
    title: 'Enquiries',
    subtitle: 'Bespoke Commissions',
    desc: 'Unusual projects and bespoke commissions considered. If it involves a book, Ethan is interested.',
    href: ROUTES.enquiry,
    rotation: 1.5,
  },
]

export default function Chapter3Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleCards, setVisibleCards] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.max(0, (windowH - rect.top) / rect.height)
      setVisibleCards(Math.floor(progress * 5))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} id="chapter-services" className={styles.section}>
      <div className={styles.bookSpread}>
        {/* Left page — label */}
        <div className={styles.leftPage}>
          <TasselBookmark top={-8} left="50%" length={100} />
          <div className={styles.leftContent}>
            <span className={styles.chapterLabel}>Chapter Two</span>
            <GoldRule width="70%" />
            <h2 className={styles.heading}>Services</h2>
            <GoldRule width="50%" />
            <p className={styles.intro}>
              Four ways Ethan Walker can bring a book back to life — or create something
              entirely new.
            </p>
          </div>
        </div>

        {/* Right page — stacking cards */}
        <div className={styles.rightPage}>
          <div className={styles.cardsArea}>
            {SERVICES.map((svc, i) => {
              const isVisible = i < visibleCards
              const isHovered = hoveredCard === i

              return (
                <a
                  key={svc.title}
                  href={svc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.card} ${isVisible ? styles.cardVisible : ''} ${isHovered ? styles.cardHovered : ''}`}
                  style={{
                    '--card-rotate': `${svc.rotation}deg`,
                    '--card-delay': `${i * 160}ms`,
                    '--card-offset': `${i * 14}px`,
                    zIndex: i + 1,
                  } as React.CSSProperties}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  aria-label={`${svc.title} — ${svc.subtitle}`}
                >
                  <div className={styles.cardLeatherTop} />
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{svc.title}</h3>
                      <span className={styles.cardSubtitle}>{svc.subtitle}</span>
                    </div>
                    <GoldRule width="90%" />
                    <p className={styles.cardDesc}>{svc.desc}</p>
                    <div className={styles.cardCta}>
                      <span>Enquire</span>
                      <span className={styles.ctaArrow}>→</span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
