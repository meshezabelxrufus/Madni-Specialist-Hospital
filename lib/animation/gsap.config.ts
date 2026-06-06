/**
 * GSAP Configuration
 * -------------------------------------------------
 * Registered once. Imported inside SmoothScrollProvider ('use client')
 * so this never runs on the server.
 *
 * Plugin registration order:
 *   1. ScrollTrigger — powers the master scroll trigger in ScrollStage
 *   2. CustomEase    — enables cubic-bezier(0.22,1,0.36,1) as 'cinematic'
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

// ── Global GSAP defaults ───────────────────────────────────────

gsap.defaults({
  ease: 'expo.out',     // safe fallback; scenes override with 'cinematic'
  duration: 1,
  // force3D: true promotes all animated elements to GPU composited layers.
  // Without this, GSAP uses CSS transforms — same result but slightly slower
  // because the browser re-evaluates CSS. force3D sets transform3d directly.
  force3D: true,
  // Disable sub-pixel rounding on transforms — prevents jitter at low values
  autoRound: false,
})

// Lenis requires lagSmoothing to be disabled.
// With smoothing on, GSAP advances time in large jumps after lag (tab switch,
// DevTools), which causes Lenis to snap to a distant scroll position.
gsap.ticker.lagSmoothing(0)

// ── Register the cinematic ease (0.22, 1, 0.36, 1) ────────────
// Imported and used as 'cinematic' throughout the codebase.
// The curve: near-instant snap, ultra-gentle arrival — film camera feel.
CustomEase.create('cinematic', 'M0,0 C0.22,1 0.36,1 1,1')

export { gsap, ScrollTrigger, CustomEase }
