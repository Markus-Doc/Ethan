'use client'

import React, { useRef, useState, useEffect } from 'react'
import GoldRule from '@/components/UI/GoldRule'
import WaxSeal from '@/components/UI/WaxSeal'
import { ROUTES } from '@/config/squarespace'
import styles from './Chapter5_Workshops.module.css'

export default function Chapter5Workshops() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="chapter-workshops" className={styles.section}>
      <div className={`${styles.spread} ${visible ? styles.spreadVisible : ''}`}>
        {/* Left page — cinematic background */}
        <div className={styles.leftPage}>
          <div className={styles.leatherMotion} aria-hidden="true">
            {/* Animated leather texture pulsing */}
            <div className={styles.leatherLayer1} />
            <div className={styles.leatherLayer2} />
            <div className={styles.leatherLayer3} />
          </div>
          <div className={styles.leftOverlay}>
            <span className={styles.leftLabel}>Walker Book Works</span>
            <div className={styles.leftDivider} />
            <span className={styles.leftSub}>Sydney, Australia</span>
          </div>
        </div>

        {/* Right page — workshop details */}
        <div className={styles.rightPage}>
          <div className={styles.pageContent}>
            <span className={styles.chapterLabel}>Chapter Four</span>
            <GoldRule width="70%" />
            <h2 className={styles.heading}>Workshops</h2>
            <GoldRule width="50%" />

            <p className={styles.body}>
              Every workshop is a small class — never more than six participants — held
              in Ethan&rsquo;s studio. You will leave with a hand-bound book you made yourself,
              and an understanding of what makes a well-made book last a hundred years.
            </p>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Duration</span>
                <span className={styles.detailValue}>Full day · 9am – 4pm</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Format</span>
                <span className={styles.detailValue}>Hands-on, all materials supplied</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Capacity</span>
                <span className={styles.detailValue}>Maximum 6 participants</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Dates</span>
                <span className={styles.detailValue}>See booking page for availability</span>
              </div>
            </div>

            <div className={styles.ctaArea}>
              <WaxSeal href={ROUTES.workshops} label="Book a Workshop" size={88} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
