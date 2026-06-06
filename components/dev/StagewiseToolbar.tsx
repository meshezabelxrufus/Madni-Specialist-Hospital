'use client'

import { useEffect } from 'react'

/**
 * Mounts the 21st-extension / Stagewise toolbar in development only.
 * Rendered once in the root layout — useEffect fires after hydration
 * so the toolbar never touches the server-render path.
 */
export function StagewiseToolbar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    import('@21st-extension/toolbar').then(({ initToolbar }) => {
      initToolbar({ plugins: [] })
    })
  }, [])

  return null
}
