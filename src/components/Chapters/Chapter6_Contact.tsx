'use client'

import React, { useRef, useState, useEffect } from 'react'
import BookIllustration from '@/components/Book/BookIllustration'
import TasselBookmark from '@/components/Book/TasselBookmark'
import GoldRule from '@/components/UI/GoldRule'
import { ROUTES } from '@/config/squarespace'
import styles from './Chapter6_Contact.module.css'

export default function Chapter6Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [coverClose, setCoverClose] = useState(0) // 0=open, 1=closed
  const [finVisible, setFinVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / rect.height))
      // Cover closes as section scrolls in
      setCoverClose(progress * 0.85)
      if (progress > 0.7) setFinVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // coverOpen prop: 1 = fully open. As coverClose goes 0→1, coverOpen goes 1→0
  const coverOpen = 1 - coverClose

  return (
    <section ref={sectionRef} id="chapter-contact" className={styles.section}>
      <div className={styles.bookWrapper}>
        <BookIllustration coverOpen={coverOpen} />
        <TasselBookmark top={-8} left="52%" length={120} />

        {/* Back cover contact — embossed effect */}
        <div className={`${styles.backCover} ${coverClose > 0.7 ? styles.backCoverVisible : ''}`}>
          <div className={styles.embossed}>
            <p className={styles.studioName}>Walker Book Works</p>
            <div className={styles.embossDivider} />
            <a
              href={`mailto:info@walkerbookworks.com.au`}
              className={styles.contactLine}
            >
              info@walkerbookworks.com.au
            </a>
            <a
              href={`tel:+610431339084`}
              className={styles.contactLine}
            >
              0431 339 084
            </a>
            <div className={styles.embossDivider} />
            <a
              href={ROUTES.contact}
              className={styles.contactCta}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Fin */}
      <div className={`${styles.fin} ${finVisible ? styles.finVisible : ''}`} aria-label="End">
        <GoldRule width="200px" />
        <p className={styles.finText}>Fin.</p>
        <GoldRule width="120px" />
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Walker Book Works · walkerbookworks.com.au · Sydney, Australia
        </p>
        <p className={styles.footerSmall}>
          Bespoke book repair, binding &amp; workshops by Ethan Walker
        </p>
      </footer>
    </section>
  )
}
