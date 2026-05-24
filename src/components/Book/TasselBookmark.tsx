'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useTasselPhysics } from '@/hooks/useTasselPhysics'
import styles from './TasselBookmark.module.css'

interface Props {
  top?: number      // px from top of parent
  left?: string     // CSS left value
  length?: number   // total tassel length in px
}

// Seeded pseudo-random for consistent thread offsets
function seedRand(seed: number) {
  return ((seed * 1664525 + 1013904223) & 0xffffffff) / 0xffffffff
}

export default function TasselBookmark({ top = -20, left = '50%', length = 120 }: Props) {
  const [angle, setAngle] = useState(0)
  const { start, stop } = useTasselPhysics()
  const containerRef = useRef<HTMLDivElement>(null)

  const THREAD_COUNT = 12
  const RIBBON_H = Math.floor(length * 0.35)
  const KNOT_R = 7
  const BUNDLE_H = Math.floor(length * 0.45)
  const FRINGE_H = Math.floor(length * 0.2)

  useEffect(() => {
    start(setAngle)
    return () => stop()
  }, [start, stop])

  const threads = Array.from({ length: THREAD_COUNT }, (_, i) => ({
    x: (seedRand(i * 7 + 1) - 0.5) * 14,
    delay: seedRand(i * 13 + 3) * 80,
    curve: (seedRand(i * 11 + 5) - 0.5) * 6,
  }))

  return (
    <div
      ref={containerRef}
      className={styles.tassel}
      style={{
        top,
        left,
        transform: `translateX(-50%) rotate(${angle}deg)`,
        transformOrigin: 'top center',
      }}
    >
      {/* Silk ribbon */}
      <div className={styles.ribbon} style={{ height: RIBBON_H }}>
        <div className={styles.ribbonSheen} />
      </div>

      {/* Knot */}
      <div className={styles.knot} style={{ width: KNOT_R * 2, height: KNOT_R * 2 }} />

      {/* Thread bundle */}
      <div className={styles.bundle} style={{ height: BUNDLE_H }}>
        <svg
          width={40}
          height={BUNDLE_H}
          viewBox={`0 0 40 ${BUNDLE_H}`}
          overflow="visible"
        >
          {threads.map((t, i) => {
            const x0 = 20
            const x1 = 20 + t.x
            const cp = 20 + t.curve
            return (
              <path
                key={i}
                d={`M ${x0} 0 Q ${cp} ${BUNDLE_H / 2} ${x1} ${BUNDLE_H}`}
                stroke={`hsl(35, ${50 + i * 2}%, ${55 + (i % 3) * 5}%)`}
                strokeWidth="0.8"
                fill="none"
                opacity={0.85 + (i % 3) * 0.05}
              />
            )
          })}
        </svg>
      </div>

      {/* Fringe ends */}
      <div className={styles.fringe} style={{ height: FRINGE_H }}>
        <svg
          width={44}
          height={FRINGE_H}
          viewBox={`0 0 44 ${FRINGE_H}`}
          overflow="visible"
        >
          {threads.map((t, i) => {
            const x = 22 + t.x
            return (
              <ellipse
                key={i}
                cx={x}
                cy={FRINGE_H - 4}
                rx={1.5}
                ry={3}
                fill={`hsl(35, 55%, ${52 + (i % 4) * 4}%)`}
                opacity={0.9}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
