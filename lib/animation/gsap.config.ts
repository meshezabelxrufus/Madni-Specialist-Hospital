import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

// ── Global GSAP defaults ───────────────────────────────────────

// Detect touch/mobile once at module load (client-only — this file
// is only imported inside 'use client' components)
const isMobileOrTouch =
  typeof window !== 'undefined' &&
  (navigator.maxTouchPoints > 0 || window.matchMedia('(max-width: 768px)').matches)

gsap.defaults({
  ease: 'expo.out',
  duration: 1,

  // force3D promotes animated elements to GPU compositor layers.
  // On desktop this speeds up animations. On mobile with shared CPU/GPU RAM
  // it creates 80+ permanent layers → VRAM pressure → jank.
  // Mobile: false = browser promotes only during active animation, then releases.
  force3D: isMobileOrTouch ? false : true,

  autoRound: false,
})

// lagSmoothing: after a tab switch or DevTools open, GSAP fires a large
// time-jump in one frame. Lenis needs this disabled (0) to prevent snapping.
// On mobile Lenis is not active — restore the default (500ms) so GSAP
// handles time gaps gracefully instead of firing all at once.
if (isMobileOrTouch) {
  gsap.ticker.lagSmoothing(500)  // default GSAP value — safe on mobile
} else {
  gsap.ticker.lagSmoothing(0)    // required for Lenis on desktop
}

// ── Register the cinematic ease ────────────────────────────────
CustomEase.create('cinematic', 'M0,0 C0.22,1 0.36,1 1,1')

export { gsap, ScrollTrigger, CustomEase }

