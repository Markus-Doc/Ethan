'use client'

import React, { useEffect, useRef, useState } from 'react'
import BookSceneLoader from './BookSceneLoader'
import styles from './ScrollSequence.module.css'

interface Manifest {
  frameCount: number
  desktop: string[]
  mobile: string[]
  sections: Array<{
    name: string
    frameStart: number
    frameEnd: number
    scrollStart: number
    scrollEnd: number
  }>
}

interface Props {
  manifestPath: string
  scrollProgress: number
  className?: string
}

export default function ScrollSequence({ manifestPath, scrollProgress, className }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
  const manifestRef = useRef<Manifest | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const framesRef = useRef<string[]>([])
  const progressRef = useRef(scrollProgress)

  useEffect(() => {
    progressRef.current = scrollProgress
    if (!loaded || !imgRef.current || framesRef.current.length === 0) return
    const frames = framesRef.current
    const idx = Math.round(progressRef.current * (frames.length - 1))
    const src = frames[Math.min(idx, frames.length - 1)]
    if (imgRef.current.src !== window.location.origin + src) {
      requestAnimationFrame(() => {
        if (imgRef.current) imgRef.current.src = src
      })
    }
  }, [scrollProgress, loaded])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(manifestPath)
        if (!res.ok) throw new Error('manifest fetch failed')
        const manifest: Manifest = await res.json()
        manifestRef.current = manifest

        const paths = isMobile ? manifest.mobile : manifest.desktop
        framesRef.current = paths

        // Preload all frames
        let loadedCount = 0
        const total = paths.length
        await Promise.all(
          paths.map(
            (src) =>
              new Promise<void>((resolve) => {
                const img = new Image()
                img.onload = img.onerror = () => {
                  loadedCount++
                  if (loadedCount === total && !cancelled) {
                    setLoaded(true)
                    if (imgRef.current) imgRef.current.src = paths[0]
                  }
                  resolve()
                }
                img.src = src
              })
          )
        )
      } catch {
        if (!cancelled) setError(true)
      }
    }

    load()
    return () => { cancelled = true }
  }, [manifestPath, isMobile])

  if (error) {
    return <BookSceneLoader />
  }

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {!loaded && <div className={styles.pulse} aria-hidden="true" />}
      <img
        ref={imgRef}
        className={styles.frame}
        alt="Book animation"
        style={{ opacity: loaded ? 1 : 0 }}
        draggable={false}
      />
    </div>
  )
}
