'use client'

import React from 'react'
import styles from './WaxSeal.module.css'

interface Props {
  href: string
  label?: string
  size?: number
}

export default function WaxSeal({ href, label = 'Book a Workshop', size = 96 }: Props) {
  return (
    <a
      href={href}
      className={styles.seal}
      style={{ width: size, height: size }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {/* Wax texture ring */}
      <svg
        viewBox="0 0 100 100"
        className={styles.sealSvg}
        aria-hidden="true"
      >
        {/* Outer pressed wax drip */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--wax-ring, #6B0E0E)" strokeWidth="2" opacity="0.4" />
        {/* Wax body */}
        <circle cx="50" cy="50" r="42" fill="url(#waxGrad)" />
        {/* Texture cracks */}
        <path d="M 30 35 Q 50 30 70 35" stroke="var(--wax-crack, #5A0A0A)" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M 25 55 Q 50 50 75 55" stroke="var(--wax-crack, #5A0A0A)" strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* Monogram W */}
        <text
          x="50"
          y="57"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontWeight="300"
          fontSize="30"
          fill="var(--parchment)"
          letterSpacing="1"
          opacity="0.92"
        >
          W
        </text>
        <defs>
          <radialGradient id="waxGrad" cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor="var(--wax-light, #B02020)" />
            <stop offset="55%" stopColor="var(--wax-mid, #8B1A1A)" />
            <stop offset="100%" stopColor="var(--wax-dark, #4A0A0A)" />
          </radialGradient>
        </defs>
      </svg>
      <span className={styles.label}>{label}</span>
    </a>
  )
}
