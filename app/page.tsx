/**
 * Home Page — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * All 10 scenes mount ONCE inside ScrollStage and never unmount.
 * Scroll progress controls which scene is visible — no routing,
 * no re-renders, no layout shifts.
 *
 * DOM order = z-stacking order.
 * Intro is lowest, Booking is highest.
 * During scene crossfades (20–30vh overlap), the incoming scene
 * (later in DOM) naturally renders above the outgoing one.
 */

import { ScrollStage } from '@/components/layout/ScrollStage'
import { IntroScene }       from '@/components/scenes/IntroScene'
import { DepartmentScene }  from '@/components/scenes/DepartmentScene'
import { SupportScene }     from '@/components/scenes/SupportScene'
import { BookingScene }     from '@/components/scenes/BookingScene'
import { ScrollDebug }      from '@/components/dev/ScrollDebug'
import { getDepartmentsWithDoctors } from '@/lib/hospital/departments'
import { SCENE_CONFIGS }             from '@/lib/scroll/scenes.config'

export default function HomePage() {
  return (
    <ScrollStage>
      {/* 1 — Hospital introduction */}
      <IntroScene />

      {/* 2–8 — Medical departments (reusable DepartmentScene) */}
      {getDepartmentsWithDoctors().map((dept, i: number) => {
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

      {/* 9 — Support team */}
      <SupportScene />

      {/* 10 — Final booking CTA */}
      <BookingScene />

      {/* Dev overlay — auto-removed in production */}
      <ScrollDebug />
    </ScrollStage>
  )
}
