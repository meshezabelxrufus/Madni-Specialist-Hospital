'use client'

/**
 * useScrollTimeline
 * -------------------------------------------------
 * The core animation hook. Replaces manual onProgress math with a
 * declarative GSAP timeline that gets SEEKED to local scroll progress.
 *
 * WHY SEEK INSTEAD OF SCRUB?
 *   GSAP ScrollTrigger's built-in scrub uses its own smoothing layer.
 *   We already have Lenis smoothing. Seeking a paused timeline gives
 *   us direct, frame-perfect control with zero extra lag.
 *
 * USAGE:
 *   useScrollTimeline({
 *     id: 'cardiology',
 *     start: sceneConfig.start,
 *     end:   sceneConfig.end,
 *
 *     buildTimeline: () => {
 *       const tl = gsap.timeline({ paused: true, defaults: { ease: 'cinematic' } })
 *
 *       // ── ENTRY (0.00 → 0.30) ───────────────────────────────
 *       tl.fromTo(bgRef.current,    { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0)
 *       tl.fromTo(titleRef.current, { y: 64, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18 }, 0.08)
 *
 *       // ── EXIT (0.72 → 1.00) ───────────────────────────────
 *       tl.to(titleRef.current, { y: -32, opacity: 0, ease: 'power2.in', duration: 0.14 }, 0.75)
 *       tl.to(bgRef.current,    { opacity: 0, duration: 0.18 }, 0.84)
 *
 *       return tl  // duration MUST total to 1.0 for direct seek mapping
 *     },
 *
 *     // Runs every frame — use quickSetter here for GPU-layer parallax
 *     onParallax: (p) => {
 *       const drift = (p - 0.5)
 *       bgSetY.current(drift * 50)      // background: slow drift
 *       visualSetY.current(drift * 100) // visual:     faster drift
 *     }
 *   })
 *
 * TIMELINE DURATION = 1.0 CONVENTION:
 *   Keep tween end times ≤ 1.0. Then seek(progress) maps directly
 *   to progress without any multiplication needed. GSAP computes the
 *   actual duration from the last tween's end time.
 *
 * INITIAL STATE:
 *   Call gsap.set() at the TOP of buildTimeline() to initialize
 *   all elements to their pre-animation state. This runs in useEffect
 *   (after paint, before the first scroll event) — no flash.
 *   The CSS opacity:0 on .root prevents the very first frame flash.
 *
 * HOT RELOAD:
 *   On mount, the hook immediately seeks to the current global progress.
 *   This means HMR in dev correctly restores scene state without scrolling.
 */

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/animation/gsap.config'
import { getScrollManager } from './ScrollManager'

export interface ScrollTimelineOptions {
  id: string
  start: number
  end: number

  /**
   * Build and return a GSAP timeline (paused).
   * Called once in useEffect — all DOM refs are populated.
   * Keep total duration at 1.0 for direct seek(progress) mapping.
   */
  buildTimeline: () => gsap.core.Timeline

  /**
   * Optional continuous parallax callback.
   * Fires on every scroll tick with local progress (0→1).
   * Use gsap.quickSetter() here for maximum performance.
   * Runs AFTER the timeline is seeked on the same tick.
   */
  onParallax?: (localProgress: number) => void
}

export function useScrollTimeline({
  id,
  start,
  end,
  buildTimeline,
  onParallax,
}: ScrollTimelineOptions): React.MutableRefObject<gsap.core.Timeline | null> {
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  // Keep callbacks in refs — avoid re-subscribing when functions change
  const buildRef   = useRef(buildTimeline)
  const parallaxRef = useRef(onParallax)
  useEffect(() => {
    buildRef.current    = buildTimeline
    parallaxRef.current = onParallax
  })

  useEffect(() => {
    const manager = getScrollManager()
    const unregister = manager.registerScene({ id, start, end })

    // Build the timeline — by this point all useRef DOM nodes are populated
    const tl = (() => {
      try {
        return buildRef.current()
      } catch (err) {
        console.error(`[ScrollTimeline:${id}] buildTimeline threw — scene will not animate:`, err)
        return null
      }
    })()

    if (!tl) {
      unregister()
      return
    }

    tlRef.current = tl

    // Compute local progress from global at mount time.
    // On initial page load this is 0 — but on hot-reload or if ScrollStage
    // re-mounts mid-scroll, this restores the scene to the correct state.
    const range = end - start
    const syncToProgress = (globalProgress: number) => {
      if (range <= 0) return
      const p = Math.max(0, Math.min(1, (globalProgress - start) / range))
      tl.seek(p * tl.duration())
      parallaxRef.current?.(p)
    }

    // Immediate seek — runs synchronously before the first scroll event
    syncToProgress(manager.globalProgress)

    const unsubscribe = manager.subscribe(syncToProgress)

    return () => {
      unregister()
      unsubscribe()
      tl.kill()
      tlRef.current = null
    }
  }, [id, start, end]) // buildTimeline excluded — intentionally runs once

  return tlRef
}
