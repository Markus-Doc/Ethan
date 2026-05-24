'use client'

import React from 'react'
import styles from './BookIllustration.module.css'

interface Props {
  coverOpen?: number   // 0 = closed, 1 = fully open
  className?: string
}

export default function BookIllustration({ coverOpen = 0, className = '' }: Props) {
  const coverRotate = coverOpen * -160

  return (
    <div className={`${styles.stage} ${className}`}>
      {/* Back board */}
      <div className={styles.backBoard} />

      {/* Pages block */}
      <div className={styles.pagesBlock}>
        <div className={styles.pagesEdge} />
      </div>

      {/* Spine */}
      <div className={styles.spine}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={styles.spineBand} style={{ top: `${16 + i * 16}%` }} />
        ))}
      </div>

      {/* Front board with cover-open transform */}
      <div
        className={styles.frontBoardWrapper}
        style={{ transform: `perspective(800px) rotateY(${coverRotate}deg)` }}
      >
        <div className={styles.frontBoard}>
          {/* Corner pieces */}
          <div className={`${styles.corner} ${styles.cornerTL}`} />
          <div className={`${styles.corner} ${styles.cornerTR}`} />
          <div className={`${styles.corner} ${styles.cornerBL}`} />
          <div className={`${styles.corner} ${styles.cornerBR}`} />
          {/* Endpaper visible when open */}
          {coverOpen > 0.3 && (
            <div className={styles.endpaper} style={{ opacity: Math.min(1, (coverOpen - 0.3) * 2) }}>
              <div className={styles.endpaperPattern} />
              <p className={styles.quote}>
                &ldquo;Every great book deserves a life well-bound.&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tassel slot at top */}
      <div className={styles.tasselSlot} />
    </div>
  )
}
