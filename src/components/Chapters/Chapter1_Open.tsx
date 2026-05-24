'use client'

import React, { useEffect, useRef, useState } from 'react'
import BookIllustration from '@/components/Book/BookIllustration'
import TasselBookmark from '@/components/Book/TasselBookmark'
import styles from './Chapter1_Open.module.css'

export default function Chapter1Open() {
  const sectionRef = useRef<HTMLElement>(null)
  const [coverOpen, setCoverOpen] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowH = window.innerHeight
      // progress 0→1 as section enters and traverses viewport
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height * 0.6)))
      setCoverOpen(progress)
      if (progress > 0.6) setQuoteVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} id="chapter-open" className={styles.section}>
      <div className={styles.bookStage}>
        <BookIllustration coverOpen={coverOpen} />
        <TasselBookmark top={-8} left="52%" length={120} />

        {/* Specular hinge highlight sweeps with opening */}
        <div
          className={styles.hingeHighlight}
          style={{
            opacity: coverOpen > 0.05 ? Math.min(1, coverOpen * 2) : 0,
            left: `calc(${coverOpen * 60}% - 20px)`,
          }}
        />
      </div>

      {quoteVisible && (
        <div className={styles.quoteBlock}>
          <p className={styles.quote}>
            &ldquo;Every great book deserves a life well-bound.&rdquo;
          </p>
        </div>
      )}
    </section>
  )
}
