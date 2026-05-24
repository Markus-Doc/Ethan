'use client'

import { useEffect, useRef } from 'react'

export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  options: { start?: string; end?: string } = {}
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      () => {
        const rect = el.getBoundingClientRect()
        const windowH = window.innerHeight
        const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)))
        onProgress(progress)
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, onProgress])
}

export function useScrollVelocity(): React.RefObject<number> {
  const velocity = useRef(0)

  useEffect(() => {
    let lastY = window.scrollY
    let lastTime = performance.now()

    const onScroll = () => {
      const now = performance.now()
      const dt = now - lastTime
      if (dt > 0) {
        velocity.current = (window.scrollY - lastY) / dt
        lastY = window.scrollY
        lastTime = now
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return velocity
}
