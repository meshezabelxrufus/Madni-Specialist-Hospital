/**
 * Scroll animation math utilities
 * -------------------------------------------------
 * All scene onProgress callbacks use these helpers.
 * Keep functions tiny — they run 60× per second.
 */

/** Clamp to [0, 1] */
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * Map global/local progress p from input range [a,b] to [0,1].
 * Returns 0 if p < a, returns 1 if p > b.
 */
export const mapRange = (p: number, a: number, b: number): number =>
  clamp01((p - a) / (b - a))

/** easeOutCubic: fast start, gentle end — for entrances */
export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3)

/** easeInCubic: gentle start, fast end — for exits */
export const easeIn = (t: number): number => t * t * t

/** easeInOutCubic: symmetric S-curve */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/**
 * Map progress p through range [a,b] with easeOut.
 * Returns 0 before a, 1 after b.
 */
export const enter = (p: number, a: number, b: number): number =>
  easeOut(mapRange(p, a, b))

/**
 * Map progress p through range [a,b] as an exit (1 → 0).
 * Returns 1 before a, 0 after b.
 */
export const exit = (p: number, a: number, b: number): number =>
  1 - easeOut(mapRange(p, a, b))

/**
 * Combined: enter(a,b) × exit(c,d).
 * Scene is fully visible between b and c, fades in/out at edges.
 */
export const band = (
  p: number,
  enterFrom: number,
  enterTo: number,
  exitFrom: number,
  exitTo: number
): number => enter(p, enterFrom, enterTo) * exit(p, exitFrom, exitTo)
