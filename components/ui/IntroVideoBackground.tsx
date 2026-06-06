'use client'

/**
 * IntroVideoBackground
 * -------------------------------------------------
 * Cinematic fullscreen video layer for the intro scene ONLY.
 *
 * WHY A SEPARATE COMPONENT:
 *   Next.js App Router server-renders its parent (IntroScene).
 *   <video autoPlay> must not appear in the SSR output because:
 *     1. Hydration mismatch — the server has no video state.
 *     2. First-paint cost — the browser fetches the video before
 *        critical fonts and CSS load.
 *   Mounting this component only after client hydration (useState +
 *   useEffect pattern) keeps first paint instant.
 *
 * ARCHITECTURE:
 *   IntroScene owns the videoRef and passes it here as a prop.
 *   This avoids double-registering the 'intro' scene with ScrollManager
 *   (which would happen if this component also called useScrollScene).
 *   IntroScene's onParallax calls videoRef.current.pause() / .play()
 *   at the correct scroll progress thresholds.
 *
 * Z-INDEX LAYERING (inside IntroScene .root stacking context):
 *   .wrapper is inserted as the FIRST child of IntroScene's root div.
 *   CSS stacking context created by root's will-change:transform orders
 *   children strictly by DOM order — no explicit z-index needed:
 *
 *     1st  .wrapper  (this component)  ← lowest
 *     2nd  .glow     (ambient glow)    ← above video
 *     3+   h1 / p / flex items         ← text on top
 *
 * PERFORMANCE GUARDS:
 *   - Not mounted until after hydration (no SSR penalty)
 *   - prefers-reduced-motion  → component returns null (JS + CSS both check)
 *   - navigator.hardwareConcurrency ≤ 2 → skip (very low-end device)
 *   - preload="metadata"      → only first frame loaded until play()
 *   - autoPlay + muted        → browsers allow this without user gesture
 *   - pause/src-clear on exit → handled by IntroScene.onParallax
 */

import { useState, useEffect, type RefObject } from 'react'
import styles from './IntroVideoBackground.module.css'

interface IntroVideoBackgroundProps {
  /**
   * Ref owned by IntroScene. React attaches the <video> element here
   * so IntroScene's onParallax can call .pause() / .play() directly
   * without needing its own ScrollManager subscription.
   */
  videoRef: RefObject<HTMLVideoElement>
}

export function IntroVideoBackground({ videoRef }: IntroVideoBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // ── Accessibility gate ───────────────────────────────────────
    // prefers-reduced-motion: do not render any motion at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ── Low-end device gate ──────────────────────────────────────
    // Devices with ≤ 2 logical CPU cores struggle to decode video
    // alongside GSAP ScrollTrigger + Framer Motion + Lenis at 60fps.
    // Skipping the video on these devices prevents dropped frames.
    if (navigator.hardwareConcurrency <= 2) return

    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {/*
        autoPlay + muted → browsers autoplay without user gesture.
        loop            → seamless atmospheric loop.
        playsInline     → required on iOS to prevent fullscreen takeover.
        preload="metadata" → only first frame loads until onParallax
                             calls .play(); full video streams lazily.
      */}
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/video/intro-bg.mp4" type="video/mp4" />
      </video>

      {/* Blends video into site background (#D9F9FF) at the bottom */}
      <div className={styles.gradientBottom} />

      {/* Subtle fade at the top for navbar readability */}
      <div className={styles.gradientTop} />
    </div>
  )
}
