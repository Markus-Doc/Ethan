'use client'

import { useEffect, useState } from 'react'

type Capability = 'high' | 'mid' | 'low'

export function useDeviceCapability(): Capability {
  const [capability, setCapability] = useState<Capability>('low')

  useEffect(() => {
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      setCapability('low')
      return
    }

    const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
    const speed = connection?.effectiveType ?? '4g'

    if (cores >= 8 && memory >= 8 && speed === '4g') {
      setCapability('high')
    } else if (cores >= 4 && memory >= 4 && speed !== '2g') {
      setCapability('mid')
    } else {
      setCapability('low')
    }
  }, [])

  return capability
}

export function useIsMobile(): boolean {
  // Start null (unknown) — renders mobile fallback until client hydrates
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // During SSR and initial hydration, treat as mobile (safe default)
  return isMobile ?? true
}
