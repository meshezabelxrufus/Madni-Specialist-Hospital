'use client'

/**
 * ClientPage
 * -------------------------------------------------
 * Detects mobile vs desktop ONCE after hydration,
 * then renders the correct layout.
 *
 * WHY CLIENT-SIDE DETECTION:
 *   Server-side user-agent sniffing is unreliable (proxies, bots,
 *   desktop browsers with mobile UA, etc). Client-side matchMedia
 *   + maxTouchPoints is the ground truth.
 *
 * HYDRATION STRATEGY:
 *   We default to 'desktop' for SSR, then on the client a useEffect
 *   checks if we're actually on mobile and switches instantly.
 *   On a real mobile device:
 *     1. Server sends desktop HTML (same background color)
 *     2. Client hydrates → useEffect runs → switches to MobilePage
 *   The switch is a single repaint at ~16ms — imperceptible as a flash
 *   because both layouts share the same --color-bg background.
 *
 *   On desktop: no switch needed, stays as rendered.
 *   On mobile: one fast swap before the user has time to interact.
 *
 * IMPORTANT — no GSAP runs on mobile:
 *   The desktop <ScrollStage> tree is never mounted on mobile.
 *   MobilePage uses only IntersectionObserver + CSS transitions.
 */

import { useState, useEffect } from 'react'
import { ScrollStage }       from '@/components/layout/ScrollStage'
import { IntroScene }        from '@/components/scenes/IntroScene'
import { DepartmentScene }   from '@/components/scenes/DepartmentScene'
import { SupportScene }      from '@/components/scenes/SupportScene'
import { BookingScene }      from '@/components/scenes/BookingScene'
import { ScrollDebug }       from '@/components/dev/ScrollDebug'
import { MobilePage }        from '@/components/mobile/MobilePage'
import { getDepartmentsWithDoctors } from '@/lib/hospital/departments'
import { SCENE_CONFIGS }             from '@/lib/scroll/scenes.config'

export function ClientPage() {
  // Default: desktop (matches SSR output — prevents hydration mismatch)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobile =
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(max-width: 768px)').matches
    setIsMobile(mobile)

    // Also listen for orientation changes / window resize
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // ── Mobile path ─────────────────────────────────────────────
  if (isMobile) {
    return <MobilePage />
  }

  // ── Desktop path — full cinematic experience ─────────────────
  const departments = getDepartmentsWithDoctors()

  return (
    <ScrollStage>
      <IntroScene />

      {departments.map((dept, i: number) => {
        const sceneConfig = SCENE_CONFIGS.find((s) => s.id === dept.id)
        if (!sceneConfig) return null
        return (
          <DepartmentScene
            key={dept.id}
            department={dept}
            sceneConfig={sceneConfig}
            index={i + 1}
          />
        )
      })}

      <SupportScene />
      <BookingScene />

      {/* Dev overlay — auto-removed in production */}
      <ScrollDebug />
    </ScrollStage>
  )
}
