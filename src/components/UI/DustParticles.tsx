'use client'

import React, { useEffect, useRef } from 'react'
import styles from './DustParticles.module.css'

const PARTICLE_COUNT = 28

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function DustParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Desktop only
    if (window.innerWidth < 768) return
    const el = containerRef.current
    if (!el) return
    el.style.display = 'block'
  }, [])

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    size: rand(1, 3),
    left: rand(0, 100),
    top: rand(0, 100),
    opacity: rand(0.12, 0.32),
    duration: rand(6, 14),
    delay: rand(0, 8),
    driftX: rand(-30, 30),
    driftY: rand(-40, -80),
  }))

  return (
    <div
      ref={containerRef}
      className={styles.container}
      aria-hidden="true"
      style={{ display: 'none' }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
