'use client'

/**
 * ScrollDebug — dev-only overlay
 * Remove (or leave — it tree-shakes in prod) before launch.
 */

import { useScrollProgress } from '@/lib/scroll/useScrollProgress'
import { SCENE_CONFIGS } from '@/lib/scroll/scenes.config'

export function ScrollDebug() {
  const { progress } = useScrollProgress()

  if (process.env.NODE_ENV !== 'development') return null

  const activeScene = SCENE_CONFIGS.findLast((s) => progress >= s.start)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '1.5rem',
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.7,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div>global: {progress.toFixed(4)}</div>
      <div>scene: {activeScene?.id ?? '—'}</div>
      {activeScene && (
        <div>
          local:{' '}
          {(
            (progress - activeScene.start) /
            (activeScene.end - activeScene.start)
          ).toFixed(4)}
        </div>
      )}
    </div>
  )
}
