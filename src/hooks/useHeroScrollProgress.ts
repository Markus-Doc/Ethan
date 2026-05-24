'use client'

import { useEffect, useRef, useState } from 'react'

export function useHeroScrollProgress(): number {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const hero = document.getElementById('chapter-hero')
    if (!hero) return

    function update() {
      const rect = hero!.getBoundingClientRect()
      const viewH = window.innerHeight
      // progress: 0 when hero top at viewport top, 1 when hero bottom leaves viewport top
      const total = rect.height + viewH
      const scrolled = viewH - rect.top
      const p = Math.min(1, Math.max(0, scrolled / total))
      if (p !== progressRef.current) {
        progressRef.current = p
        setProgress(p)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          function tick() {
            update()
            rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
        } else {
          if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
      },
      { threshold: 0 }
    )

    io.observe(hero)
    update()

    return () => {
      io.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}
