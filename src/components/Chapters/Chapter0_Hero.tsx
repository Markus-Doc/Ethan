'use client'

import dynamic from 'next/dynamic'
import TasselBookmark from '@/components/Book/TasselBookmark'
import { useHeroScrollProgress } from '@/hooks/useHeroScrollProgress'
import styles from './Chapter0_Hero.module.css'

const ScrollSequence = dynamic(() => import('@/components/Book/ScrollSequence'), { ssr: false })
const DustParticles = dynamic(() => import('@/components/UI/DustParticles'), { ssr: false })

export default function Chapter0Hero() {
  const scrollProgress = useHeroScrollProgress()

  return (
    <section id="chapter-hero" className={styles.section}>
      <div className={styles.bookWrapper}>
        <ScrollSequence
          manifestPath="/sequences/book-hero/manifest.json"
          scrollProgress={scrollProgress}
          className={styles.scrollSequence}
        />
        <TasselBookmark top={-8} left="52%" length={130} />
        <DustParticles />
      </div>

      <div className={styles.text}>
        <h1 className={styles.wordmark}>Walker Book Works</h1>
        <div className={styles.ruleSmall} />
        <p className={styles.tagline}>Binding. Repair. Craft.</p>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>scroll</span>
      </div>
    </section>
  )
}
