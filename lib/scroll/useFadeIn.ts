'use client'

/**
 * useFadeIn
 * -------------------------------------------------
 * IntersectionObserver-based hook.
 * Adds 'mobile-visible' class when element enters viewport.
 * Used by all mobile scene sections instead of GSAP.
 *
 * One-shot: once visible, stays visible. IO is disconnected.
 * This avoids re-triggering animations on scroll-back.
 */

import { useRef, useEffect } from 'react'

export function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Already visible on mount (e.g. hero above the fold)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add('mobile-visible')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('mobile-visible')
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return ref
}
