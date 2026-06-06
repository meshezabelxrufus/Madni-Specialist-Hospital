'use client'

/**
 * ScrollProgress — vertical pill-dot navigator.
 *
 * Upgrades over the previous version:
 *  - Active dot is dept-accent colored (reads from DEPARTMENTS data)
 *  - Active dot morphs into a pill (width: 4px → 18px, CSS transition)
 *  - Section label slides in from right on :hover (CSS ::before, no JS)
 *  - Dot color exposed via --dot-color CSS custom property per button
 *  - Framer Motion layoutId shared transition still works (same element)
 *  - Hidden on /departments/* pages (those pages use their own nav)
 */

import { usePathname } from 'next/navigation'
import { getDepartmentById } from '@/lib/hospital/departments'
import { useSmoothScroll } from '@/components/layout/SmoothScrollProvider'
import { useActiveScene } from '@/lib/scroll/useScrollProgress'
import { SCENE_CONFIGS, TOTAL_SCROLL_HEIGHT_VH } from '@/lib/scroll/scenes.config'
import styles from './ScrollProgress.module.css'

// ── Nav items ─────────────────────────────────────────────────
// Order must match SCENE_CONFIGS (same IDs, same sequence).
const NAV_ITEMS = [
  { id: 'intro',        label: 'Welcome'      },
  { id: 'pediatrics',   label: 'Pediatrics'   },
  { id: 'surgery',      label: 'Surgery'      },
  { id: 'ent',          label: 'ENT'          },
  { id: 'orthopedics',  label: 'Orthopedics'  },
  { id: 'gynecology',   label: 'Gynecology'   },
  { id: 'dermatology',  label: 'Dermatology'  },
  { id: 'cardiology',   label: 'Cardiology'   },
  { id: 'support',      label: 'Team'         },
  { id: 'booking',      label: 'Book'         },
]

// Fallback colors for non-department scenes
const SCENE_ACCENT: Record<string, string> = {
  intro:    'var(--color-accent)',
  support:  'var(--color-accent)',
  booking:  'var(--color-whatsapp)',
}

// ── Component ─────────────────────────────────────────────────

export function ScrollProgress() {
  const pathname     = usePathname()
  const { scrollTo } = useSmoothScroll()
  const activeId     = useActiveScene()

  // The dot navigator is only meaningful on the cinematic home page.
  if (pathname.startsWith('/departments')) return null

  const handleClick = (id: string) => {
    const scene = SCENE_CONFIGS.find((s) => s.id === id)
    if (!scene) return
    const px = (scene.start * TOTAL_SCROLL_HEIGHT_VH * window.innerHeight) / 100
    scrollTo(px)
  }

  return (
    <nav className={styles.progress} aria-label="Jump to section">
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = id === activeId

        // Resolve this section's accent color:
        // dept scenes → their dept color; others → fallback
        const deptAccent = getDepartmentById(id)?.accent
        const dotColor   = deptAccent ?? SCENE_ACCENT[id] ?? 'var(--color-accent)'

        return (
          <button
            key={id}
            className={styles.dotBtn}
            onClick={() => handleClick(id)}
            aria-label={`Go to ${label}`}
            aria-current={isActive ? 'true' : undefined}
            data-label={label}
            style={{ '--dot-color': dotColor } as React.CSSProperties}
          >
            <span
              className={styles.dot}
              data-active={isActive ? 'true' : undefined}
            />
          </button>
        )
      })}
    </nav>
  )
}
