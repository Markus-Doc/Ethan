'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import BookIllustration from './BookIllustration'

const BookScene = dynamic(() => import('./BookScene'), {
  ssr: false,
  loading: () => <BookIllustration />,
})

export default function BookSceneLoader({ coverOpen = 0 }: { coverOpen?: number }) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])

  // During SSR and initial hydration: render CSS illustration (safe)
  if (isDesktop === null || !isDesktop) {
    return <BookIllustration coverOpen={coverOpen} />
  }

  return <BookScene />
}
