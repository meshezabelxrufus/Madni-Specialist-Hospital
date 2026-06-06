'use client'

/**
 * IntroScene — Hospital opening.
 *
 * Uses the same useScrollTimeline architecture as DepartmentScene:
 * one paused GSAP timeline (duration ≈ 1.0) seeked by scroll progress.
 *
 * Timeline phases:
 *   ENTRY  0.00 → 0.65  content reveals word-by-word with stagger
 *   HOLD   0.55 → 0.65  fully visible
 *   EXIT   0.65 → 1.00  entire scene floats up + fades as one unit
 *
 * The exit is applied on the ROOT element (not individual children)
 * so the whole scene lifts gracefully as the next department blooms in.
 */

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/animation/gsap.config'
import { useScrollTimeline } from '@/lib/scroll/useScrollTimeline'
import { getSceneConfig } from '@/lib/scroll/scenes.config'
import { HOSPITAL_NAME, HOSPITAL_TAGLINE } from '@/lib/hospital/data'
import { IntroVideoBackground } from '@/components/ui/IntroVideoBackground'
import styles from './IntroScene.module.css'

const SCENE = getSceneConfig('intro')

const TRUST_PILLARS = [
  { value: '8+',   label: 'Specialties'   },
  { value: '10+',  label: 'Specialists'   },
  { value: '24/7', label: 'Emergency Care' },
]

export function IntroScene() {
  const rootRef    = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
  const nameRef    = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const trustRef   = useRef<HTMLDivElement>(null)
  const hintRef    = useRef<HTMLParagraphElement>(null)

  // ref passed into IntroVideoBackground so onParallax can pause/resume
  // the video without needing a second ScrollManager subscription
  const videoRef = useRef<HTMLVideoElement>(null)

  // scroll indicator — visible at p=0, faded out by onParallax as user scrolls
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const setIndicatorOp     = useRef<((v: number) => void) | null>(null)

  // quickSetter for the exit parallax (root element rises as scene leaves)
  const setRootY   = useRef<((v: number) => void) | null>(null)
  const setRootOp  = useRef<((v: number) => void) | null>(null)

  // Mobile detection — must precede useScrollTimeline so this effect
  // fires first, making isMobileRef available to buildTimeline.
  const isMobileRef = useRef(false)
  useEffect(() => {
    isMobileRef.current = window.matchMedia('(max-width: 768px)').matches
  }, [])

  useScrollTimeline({
    id:    'intro',
    start: SCENE.start,
    end:   SCENE.end,

    buildTimeline: () => {
      const nameWords = nameRef.current
        ? Array.from(nameRef.current.querySelectorAll<HTMLElement>('[data-word]'))
        : []
      const pillars = trustRef.current
        ? Array.from(trustRef.current.children as HTMLCollectionOf<HTMLElement>)
        : []

      // Initialize quickSetters for root exit parallax
      setRootY.current  = gsap.quickSetter(rootRef.current,  'y',       'px') as (v: number) => void
      setRootOp.current = gsap.quickSetter(rootRef.current,  'opacity', '')   as (v: number) => void

      // Quicksetter for the scroll indicator — driven in onParallax below
      setIndicatorOp.current = gsap.quickSetter(scrollIndicatorRef.current, 'opacity', '') as (v: number) => void

      // Pre-initialize all elements to their hidden state
      // (root stays opacity:1 — it's the first visible scene)
      const m = isMobileRef.current
      const yName    = m ? 40 : 80
      const yTagline = m ? 16 : 30
      const yPillars = m ? 14 : 24

      gsap.set(glowRef.current,    { opacity: 0, scale: 0.85 })
      gsap.set(nameWords,          { opacity: 0, y: yName })
      gsap.set(taglineRef.current, { opacity: 0, y: yTagline })
      gsap.set(pillars,            { opacity: 0, y: yPillars })
      gsap.set(hintRef.current,    { opacity: 0 })

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'cinematic',
          force3D: true,
          autoRound: false,
        },
      })

      // ── ENTRY ─────────────────────────────────────────────

      // Glow blooms in behind everything
      tl.fromTo(glowRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' },
        0
      )

      // Hospital name: word-by-word reveal — the hero moment
      tl.fromTo(nameWords,
        { opacity: 0, y: yName },
        { opacity: 1, y: 0, duration: 0.30, stagger: 0.045 },
        0.04
      )

      // Tagline
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: yTagline },
        { opacity: 1, y: 0, duration: 0.18 },
        0.32
      )

      // Trust pillars — stagger in after tagline
      tl.fromTo(pillars,
        { opacity: 0, y: yPillars },
        { opacity: 1, y: 0, duration: 0.14, stagger: 0.06 },
        0.42
      )

      // Scroll hint — last element, subtlest
      tl.fromTo(hintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.12 },
        0.58
      )

      // ── HOLD (0.62 → 0.65) ───────────────────────────────
      // (nothing — scene is fully visible, parallax keeps it alive)

      // ── EXIT (0.65 → 1.00) ───────────────────────────────
      // The exit is driven by onParallax (continuous quickSetter on root)
      // rather than a timeline tween, so it responds smoothly without
      // "snapping" to a keyframe position.

      return tl
    },

    // Root lifts and fades as the first department scene blooms in.
    // Using quickSetter (not tl.to) means this is a pure positional
    // mapping — perfectly smooth with no easing curve fighting the scroll.
    // Mobile: halved drift to reduce compositor workload.
    onParallax: (p) => {
      // ── Video resource management ────────────────────────────────
      // Runs before the quickSetter early-return so video control is
      // always active even before buildTimeline's quickSetters are ready.
      //
      // Pause threshold (p ≥ 0.90): root opacity is ~0.03 at this point
      // (nearly invisible) — no visual difference, but frees the GPU
      // decoder and video compositor layer for the department scenes.
      //
      // Resume threshold (p < 0.55): give a 0.35-unit dead-band so the
      // video doesn't start/stop jerkily when the user hovers near the
      // intro/cardiology crossfade.
      const vid = videoRef.current
      if (vid) {
        if (p >= 0.90 && !vid.paused) {
          vid.pause()
        } else if (p < 0.55 && vid.paused) {
          // .play() returns a Promise; swallow AbortError from rapid
          // pause→play cycles and PermissionError from browser policy.
          vid.play().catch(() => {})
        }
      }

      if (!setRootY.current || !setRootOp.current) return

      // Scroll indicator: 1 at p=0, fades to 0 by p=0.15.
      // The small threshold means it vanishes after the first tiny scroll
      // gesture — it's purely a first-visit affordance.
      if (setIndicatorOp.current) {
        setIndicatorOp.current(Math.max(0, 1 - p / 0.15))
      }

      if (p <= 0.62) {
        // Scene visible — no exit drift
        setRootY.current(0)
        setRootOp.current(1)
      } else {
        // Exit: map 0.62→1.0 to upward drift + fade
        const exitFraction = (p - 0.62) / 0.38  // 0 → 1
        // Apply cinematic easing manually for the exit curve
        const eased = 1 - Math.pow(1 - exitFraction, 2)  // easeInQuad
        const maxDrift = isMobileRef.current ? 40 : 80
        setRootY.current(-eased * maxDrift)
        setRootOp.current(1 - eased)
      }
    },
  })

  const nameWords = HOSPITAL_NAME.split(' ')

  return (
    <div ref={rootRef} className={styles.root} aria-label="Madni Specialist & Trauma Centre">
      {/*
        Video is the FIRST child so DOM order places it at the bottom of
        the stacking context created by .root's will-change:transform.
        .glow (second child) paints above it; text flex items paint above both.
        No z-index integers needed.
      */}
      <IntroVideoBackground videoRef={videoRef} />

      <div ref={glowRef} className={styles.glow} aria-hidden="true" />

      <h1 ref={nameRef} className={styles.name}>
        {nameWords.map((word, i) => (
          <span key={i} className={styles.wordWrap}>
            <span data-word>{word}</span>{' '}
          </span>
        ))}
      </h1>

      <p ref={taglineRef} className={styles.tagline}>
        {HOSPITAL_TAGLINE}
      </p>

      <div className={styles.divider} aria-hidden="true" />

      <div ref={trustRef} className={styles.trust} aria-label="Hospital highlights">
        {TRUST_PILLARS.map(({ value, label }) => (
          <div key={label} className={styles.pillar}>
            <span className={styles.pillarValue}>{value}</span>
            <span className={styles.pillarLabel}>{label}</span>
          </div>
        ))}
      </div>

      <p ref={hintRef} className={styles.hint} aria-hidden="true">
        Scroll to explore our departments
        <span className={styles.arrow}>↓</span>
      </p>

      {/* Scroll indicator — visible at zero scroll, fades as user scrolls.
          position:absolute keeps it out of the flex flow.  */}
      <div
        ref={scrollIndicatorRef}
        className={styles.scrollIndicator}
        aria-hidden="true"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <div className={styles.scrollLine}>
          <span className={styles.scrollDot} />
        </div>
      </div>
    </div>
  )
}
