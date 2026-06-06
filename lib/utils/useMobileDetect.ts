'use client'

import { useState, useEffect } from 'react'

export interface MobileDetect {
  /** Viewport width ≤ 768 px at mount time */
  isMobile: boolean
  /** Device has any touch input (phones, tablets) */
  isTouch: boolean
}

/**
 * Detects mobile viewport and touch capability once at mount.
 *
 * SSR-safe: starts as { false, false } to match server render,
 * then updates after hydration in a useEffect. The one-frame lag
 * is imperceptible — it only affects subtle micro-animations.
 *
 * Use this hook only when the value is needed at render time (e.g.
 * Framer Motion animation props). For values only needed inside
 * useEffect callbacks, read window.matchMedia / navigator directly.
 */
export function useMobileDetect(): MobileDetect {
  const [result, setResult] = useState<MobileDetect>({ isMobile: false, isTouch: false })

  useEffect(() => {
    setResult({
      isMobile: window.matchMedia('(max-width: 768px)').matches,
      isTouch:  navigator.maxTouchPoints > 0,
    })
  }, [])

  return result
}
