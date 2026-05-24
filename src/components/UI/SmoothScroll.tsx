'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Desktop only
    if (window.innerWidth < 768) return

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis

    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add((t) => lenis.raf(t * 1000))

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove((t) => lenis.raf(t * 1000))
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
