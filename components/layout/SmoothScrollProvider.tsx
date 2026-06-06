'use client'

/**
 * SmoothScrollProvider
 * -------------------------------------------------
 * Initializes Lenis smooth scroll and wires it to GSAP's ticker
 * so ScrollTrigger and Lenis advance on the same animation frame.
 *
 * LENIS 1.x — IMPORTANT ARCHITECTURE NOTE:
 *   Lenis 1.x scrolls the page via window.scrollTo() (native scroll).
 *   window.scrollY changes normally. CSS position:sticky works.
 *   DO NOT use ScrollTrigger.scrollerProxy() with Lenis 1.x.
 *
 *   scrollerProxy was needed for Lenis 0.x which applied
 *   transform: translateY to simulate scroll. Using it with Lenis 1.x
 *   (with pinType:'transform') makes ScrollTrigger compute trigger
 *   start/end positions against a phantom transform offset — so
 *   self.progress in onUpdate is always 0.
 *
 * OFFICIAL LENIS 1.x + GSAP INTEGRATION (4 lines):
 *   1. Create Lenis
 *   2. gsap.ticker.add((time) => lenis.raf(time * 1000))
 *   3. lenis.on('scroll', () => ScrollTrigger.update())
 *   4. gsap.ticker.lagSmoothing(0)
 *
 * WIRING ORDER (React fires child effects before parent effects):
 *   → Scene useScrollTimeline effects fire first (subscribe to ScrollManager)
 *   → ScrollStage useEffect fires (creates master ScrollTrigger)
 *   → This effect fires last (starts Lenis, wires ticker)
 *   By the time the user scrolls, everything is ready.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/animation/gsap.config'

/* ----------------------------------------------------------
   LENIS PHYSICS
   duration + easing controls the scroll inertia feel.
   Desktop: 1.4s exponential = cinema camera momentum.
   Mobile:  0.7s — snappier response, less memory pressure,
            avoids the inertia overshooting on small screens.
   ---------------------------------------------------------- */
const LENIS_OPTIONS: ConstructorParameters<typeof Lenis>[0] = {
  duration: 1.4,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.5,
  infinite: false,
}

const LENIS_OPTIONS_MOBILE: ConstructorParameters<typeof Lenis>[0] = {
  duration: 0.7,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 2.0,
  infinite: false,
}

/* ----------------------------------------------------------
   CONTEXT
   ---------------------------------------------------------- */
interface SmoothScrollContextValue {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: object) => void
  stop: () => void
  start: () => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)

/* ----------------------------------------------------------
   PROVIDER
   ---------------------------------------------------------- */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // ── Device check ─────────────────────────────────────────────
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isTouch  = navigator.maxTouchPoints > 0

    // On mobile/touch devices: skip Lenis entirely.
    // Native iOS/Android momentum scroll is hardware-accelerated in the GPU
    // compositor — it cannot be matched by JS-driven interpolation and any
    // attempt to intercept it causes jank. GSAP ScrollTrigger works perfectly
    // with native scroll via window.scrollY.
    if (isMobile || isTouch) {
      // Still wire ScrollTrigger to native scroll events
      const onNativeScroll = () => ScrollTrigger.update()
      window.addEventListener('scroll', onNativeScroll, { passive: true })
      // Small delay so fonts/images are measured correctly
      const initTimer = setTimeout(() => ScrollTrigger.refresh(), 300)
      return () => {
        window.removeEventListener('scroll', onNativeScroll)
        clearTimeout(initTimer)
      }
    }

    // ── Desktop only: Lenis smooth scroll ────────────────────────
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      infinite: false,
    })
    lenisRef.current = lenis

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    // ── 4. Refresh on resize (debounced) ─────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('resize', onResize)

    const initTimer = setTimeout(() => ScrollTrigger.refresh(), 200)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.off('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      clearTimeout(initTimer)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo: SmoothScrollContextValue['scrollTo'] = (target, options) =>
    lenisRef.current?.scrollTo(target as string & number & HTMLElement, options)

  const stop  = () => lenisRef.current?.stop()
  const start = () => lenisRef.current?.start()

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
