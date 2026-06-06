/**
 * Cinematic Easing System
 * -------------------------------------------------
 * One easing family used throughout the entire scroll experience.
 * All GSAP animations reference EASE_CINEMATIC.
 *
 * CURVE: cubic-bezier(0.22, 1, 0.36, 1)
 * ┌─ Extremely fast start (near-instant response to input)
 * └─ Ultra-gentle deceleration (camera-like momentum to rest)
 *
 * This matches the feel of film camera mechanics and high-end
 * Apple/Framer Motion interactions. It is more aggressive than
 * expo.out (0.16, 1, 0.3, 1) — the snap is sharper.
 *
 * GSAP name registered in gsap.config.ts: 'cinematic'
 */

import { gsap } from './gsap.config'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

/**
 * The primary easing for all scene animations.
 * Use as: { ease: EASE_CINEMATIC } in any GSAP tween.
 */
export const EASE_CINEMATIC = CustomEase.create(
  'cinematic',
  // SVG path for cubic-bezier(0.22, 1, 0.36, 1)
  'M0,0 C0.22,1 0.36,1 1,1'
)

/**
 * Softer version for exits — elements float away gently.
 * cubic-bezier(0.36, 0, 0.66, 0): fast-in, slow-out reversed
 * In practice: ease-in-quad — quick invisible departure
 */
export const EASE_EXIT = 'power2.in'

/**
 * For staggered elements entering — each word/card in a sequence.
 * Slightly snappier than the main cinematic curve.
 */
export const EASE_STAGGER = 'expo.out'

/**
 * For parallax layer offsets — continuous smooth drift.
 * Direct — no easing needed since it's a positional mapping.
 */
export const EASE_LINEAR = 'none'
