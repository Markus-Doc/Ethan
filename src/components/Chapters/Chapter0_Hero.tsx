import BookSceneLoader from '@/components/Book/BookSceneLoader'
import TasselBookmark from '@/components/Book/TasselBookmark'
import styles from './Chapter0_Hero.module.css'

export default function Chapter0Hero() {
  return (
    <section id="chapter-hero" className={styles.section}>
      <div className={styles.bookWrapper}>
        {/* BookSceneLoader: shows CSS/SVG on mobile, Three.js on desktop */}
        <BookSceneLoader />
        <TasselBookmark top={-8} left="52%" length={130} />
      </div>

      <div className={styles.text}>
        {/* CSS animation — no JS dependency for LCP element */}
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
