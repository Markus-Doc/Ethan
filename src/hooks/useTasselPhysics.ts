'use client'

import { useRef, useEffect, useCallback } from 'react'

class TasselSpring {
  angle = 0
  velocity = 0
  readonly damping = 0.92
  readonly strength = 0.03

  tick(scrollDelta: number): number {
    const force = scrollDelta * 0.22
    this.velocity += (-this.angle * this.strength) + force
    this.velocity *= this.damping
    this.angle += this.velocity
    // clamp to prevent wild swings
    this.angle = Math.max(-45, Math.min(45, this.angle))
    return this.angle
  }
}

// Simple Perlin-like noise for idle drift
function smoothNoise(t: number): number {
  return Math.sin(t * 0.8) * 0.6 + Math.sin(t * 1.3) * 0.4 + Math.sin(t * 0.3) * 0.3
}

export function useTasselPhysics() {
  const spring = useRef(new TasselSpring())
  const lastScrollY = useRef(0)
  const rafRef = useRef<number>(0)
  const angleRef = useRef(0)
  const setAngleFn = useRef<((a: number) => void) | null>(null)
  const idleTime = useRef(0)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback((setAngle: (a: number) => void) => {
    setAngleFn.current = setAngle

    const loop = () => {
      const scrollY = window.scrollY
      const delta = scrollY - lastScrollY.current
      lastScrollY.current = scrollY

      if (Math.abs(delta) > 0.5) {
        isScrolling.current = true
        idleTime.current = 0
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
        scrollTimeout.current = setTimeout(() => { isScrolling.current = false }, 150)
      }

      let angle: number
      if (isScrolling.current) {
        angle = spring.current.tick(delta)
      } else {
        // idle micro-drift via noise
        idleTime.current += 0.016
        spring.current.tick(0)
        angle = spring.current.angle + smoothNoise(idleTime.current) * 1.2
      }

      if (Math.abs(angle - angleRef.current) > 0.01) {
        angleRef.current = angle
        setAngleFn.current?.(angle)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { start, stop }
}
