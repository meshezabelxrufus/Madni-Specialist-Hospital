'use client'

/**
 * useScrollProgress
 * -------------------------------------------------
 * Two hooks for consuming global scroll state.
 *
 * useScrollProgress()
 *   Returns live global progress (0→1). Re-renders on every tick.
 *   Use only for lightweight UI (progress bars, debug overlays).
 *   For animations use useScrollScene({ onProgress }) instead.
 *
 * useActiveScene()
 *   Returns the ID of the currently active scene.
 *   Only re-renders when the active scene CHANGES (≤5 times total).
 *   Safe to use in the ScrollProgress indicator.
 */

import { useEffect, useRef, useState } from 'react'
import { getScrollManager } from './ScrollManager'
import { SCENE_CONFIGS } from './scenes.config'

// ── Raw global progress ───────────────────────────────────────

export interface ScrollProgressState {
  progress: number
}

export function useScrollProgress(): ScrollProgressState {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const manager = getScrollManager()
    return manager.subscribe((p) => setProgress(p))
  }, [])

  return { progress }
}

// ── Active scene (optimized — re-renders only on scene change) ─

export function useActiveScene(): string {
  const [activeId, setActiveId] = useState(SCENE_CONFIGS[0].id)
  const activeIdRef = useRef(SCENE_CONFIGS[0].id)

  useEffect(() => {
    const manager = getScrollManager()

    return manager.subscribe((progress) => {
      // Walk from last scene backwards — first scene whose start <= progress wins
      let nextId = SCENE_CONFIGS[0].id
      for (let i = SCENE_CONFIGS.length - 1; i >= 0; i--) {
        if (progress >= SCENE_CONFIGS[i].start) {
          nextId = SCENE_CONFIGS[i].id
          break
        }
      }

      // Only setState when scene actually changes — avoids 60fps re-renders
      if (nextId !== activeIdRef.current) {
        activeIdRef.current = nextId
        setActiveId(nextId)
      }
    })
  }, [])

  return activeId
}
