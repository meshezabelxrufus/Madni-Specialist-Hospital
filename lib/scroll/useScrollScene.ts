'use client'

/**
 * useScrollScene
 * -------------------------------------------------
 * Subscribe a component to its scene's local progress.
 *
 * TWO MODES:
 *
 * 1. IMPERATIVE (recommended for GSAP animations):
 *    Pass `onProgress` → no React state, no re-renders.
 *    ScrollManager fires the callback directly in the GSAP tick.
 *    Use gsap.set() / gsap.quickSetter() inside it.
 *
 * 2. REACTIVE (for JSX-driven UI, e.g. opacity in style):
 *    Omit `onProgress` → returns live ScrollSceneState.
 *    Causes a re-render on every scroll tick. Only use this
 *    for lightweight UI (not scroll-driven canvas animations).
 *
 * ENTER / LEAVE callbacks:
 *    onEnter fires once when progress first crosses scene.start
 *    onLeave fires once when progress leaves scene.end
 *    Both are stable via refs — safe to close over state.
 *
 * USAGE:
 *   // Imperative (GSAP path — no re-renders):
 *   useScrollScene({
 *     id: 'hero', start: 0, end: 0.125,
 *     onProgress: (p) => gsap.set(el, { opacity: p }),
 *   })
 *
 *   // Reactive:
 *   const { progress, isActive } = useScrollScene({
 *     id: 'hero', start: 0, end: 0.125,
 *   })
 */

import { useEffect, useRef, useState } from 'react'
import { getScrollManager } from './ScrollManager'
import type { UseScrollSceneOptions, ScrollSceneState } from './types'

const DEFAULT_STATE: ScrollSceneState = {
  progress: 0,
  isActive: false,
  isComplete: false,
  globalProgress: 0,
}

export function useScrollScene(options: UseScrollSceneOptions): ScrollSceneState {
  const { id, start, end, onProgress, onEnter, onLeave } = options

  // Keep callbacks in refs — always points to the latest function without
  // needing to re-subscribe on every render when the caller re-creates them.
  const onProgressRef = useRef(onProgress)
  const onEnterRef = useRef(onEnter)
  const onLeaveRef = useRef(onLeave)

  // Sync refs after every render (before paint, before next subscriber fires)
  useEffect(() => {
    onProgressRef.current = onProgress
    onEnterRef.current = onEnter
    onLeaveRef.current = onLeave
  })

  const [state, setState] = useState<ScrollSceneState>(DEFAULT_STATE)
  const prevActiveRef = useRef(false)

  useEffect(() => {
    const manager = getScrollManager()

    // Register this scene's range so manager knows about it
    const unregister = manager.registerScene({ id, start, end })

    const unsubscribe = manager.subscribe((globalProgress) => {
      const range = end - start
      const progress =
        range <= 0
          ? 0
          : Math.max(0, Math.min(1, (globalProgress - start) / range))
      const isActive = globalProgress >= start && globalProgress <= end
      const isComplete = globalProgress > end

      // Fire enter / leave once per crossing
      if (isActive && !prevActiveRef.current) {
        onEnterRef.current?.()
      } else if (!isActive && prevActiveRef.current) {
        onLeaveRef.current?.()
      }
      prevActiveRef.current = isActive

      if (onProgressRef.current) {
        // Imperative path: callback fires inside the GSAP tick.
        // Zero React state updates — GSAP directly mutates the DOM.
        onProgressRef.current(progress, isActive)
      } else {
        // Reactive path: update state → triggers re-render.
        setState({ progress, isActive, isComplete, globalProgress })
      }
    })

    return () => {
      unregister()
      unsubscribe()
    }
  }, [id, start, end]) // intentionally exclude callbacks — handled via refs

  return state
}
