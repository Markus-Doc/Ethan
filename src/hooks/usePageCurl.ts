'use client'

import { useRef, useState, useCallback } from 'react'

export type PageState = 'closed' | 'turning' | 'open'

export function usePageCurl() {
  const [state, setState] = useState<PageState>('closed')
  const progressRef = useRef(0)

  const setProgress = useCallback((p: number) => {
    progressRef.current = p
    if (p <= 0.05) setState('closed')
    else if (p >= 0.95) setState('open')
    else setState('turning')
  }, [])

  const rotationDeg = useCallback((p: number) => {
    // 0 → flat (closed), 1 → -180deg (fully open/turned)
    return -p * 180
  }, [])

  return { state, setProgress, rotationDeg, progressRef }
}
