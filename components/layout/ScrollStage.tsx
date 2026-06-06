'use client'

/**
 * ScrollStage
 * -------------------------------------------------
 * The scroll track + viewport canvas for the entire experience.
 *
 * STRUCTURE:
 *   <div track>        ← 1200vh tall — the scroll distance
 *     <div canvas>     ← 100vh, position:sticky, top:0 — the viewport
 *       {children}     ← all scenes, always mounted
 *     </div>
 *   </div>
 *
 * HOW IT WORKS:
 *   1. The outer "track" div is 1200vh tall. The browser creates
 *      1200vh of scrollable distance — this is the scroll budget
 *      for the entire cinematic experience.
 *
 *   2. The inner "canvas" div is position:sticky — it stays pinned
 *      to the top of the viewport for the entire scroll journey.
 *      overflow:hidden clips any animations that escape the viewport.
 *
 *   3. A GSAP ScrollTrigger watches the track div. As the user scrolls,
 *      self.progress goes from 0 (top) to 1 (bottom of track hits
 *      bottom of viewport). This is fed directly into ScrollManager.
 *
 *   4. Scene components inside the canvas subscribe via useScrollScene()
 *      and animate based on their local progress — no mounting/unmounting.
 *
 * PERFORMANCE NOTES:
 *   - scrub: true (no delay) because Lenis already provides inertia.
 *     Adding scrub delay on top of Lenis creates double-buffered lag.
 *   - Cleanup resets ScrollManager so re-mounting in dev hot-reload
 *     starts with a clean slate (no duplicate scene registrations).
 *
 * EFFECT ORDERING with SmoothScrollProvider:
 *   React fires child effects before parent effects.
 *   So this ScrollTrigger is created BEFORE SmoothScrollProvider
 *   sets the Lenis proxy. This is safe — ScrollTrigger reads the proxy
 *   on each update call, not at creation. By the time the user can
 *   scroll, both effects have completed.
 */

import { useEffect, useRef, type ReactNode } from 'react'
import { ScrollTrigger } from '@/lib/animation/gsap.config'
import { getScrollManager } from '@/lib/scroll/ScrollManager'
import { TOTAL_SCROLL_HEIGHT_VH } from '@/lib/scroll/scenes.config'

interface ScrollStageProps {
  children: ReactNode
  /** Optional CSS class for the sticky canvas (not the track) */
  canvasClassName?: string
}

export function ScrollStage({ children, canvasClassName }: ScrollStageProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const manager = getScrollManager()

    // Master ScrollTrigger: single source of scroll progress for the whole app.
    //
    // NO `scrub` option here. scrub is for linking a GSAP animation to scroll —
    // without an animation target, scrub creates a no-op internal tween and
    // onUpdate never fires. We drive progress manually via onUpdate instead.
    //
    // NO `animation` option. We don't want GSAP to animate anything here;
    // we only want to read self.progress and pass it to ScrollManager.
    // The ScrollManager then notifies all scene subscribers synchronously.
    //
    // Lenis already provides the smoothing layer (duration: 1.4, expo easing).
    // Adding scrub delay on top would double-buffer and feel laggy.
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        manager.updateProgress(self.progress)
      },
    })

    return () => {
      trigger.kill()
      // Full reset so hot-reload dev cycles start clean
      manager.reset()
    }
  }, [])

  return (
    <div
      ref={trackRef}
      style={{ height: `${TOTAL_SCROLL_HEIGHT_VH}vh` }}
    >
      <div
        className={`${canvasClassName || ''} canvas-stage`}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          /* overflow:hidden on desktop for parallax clip.
             On mobile individual scene roots handle their own scrolling. */
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
