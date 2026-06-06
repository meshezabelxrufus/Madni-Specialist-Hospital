'use client'

/**
 * SupportScene — the backbone team.
 * Three staff members appear as a horizontal row of cards.
 *
 * Animation:
 *   0.00 → 0.18  Background + label fade in
 *   0.10 → 0.35  Title slides up
 *   0.20 → 0.55  Cards stagger in from bottom (index × 0.08 delay)
 *   0.60 → 1.00  Scene exits upward
 */

import { useRef } from 'react'
import { gsap } from '@/lib/animation/gsap.config'
import { useScrollScene } from '@/lib/scroll/useScrollScene'
import { getSceneConfig } from '@/lib/scroll/scenes.config'
import { enter, band, mapRange } from '@/lib/scroll/animUtils'
import { SUPPORT_STAFF, getInitials } from '@/lib/hospital/supportStaff'
import styles from './SupportScene.module.css'

const SCENE = getSceneConfig('support')

export function SupportScene() {
  const rootRef   = useRef<HTMLDivElement>(null)
  const bgRef     = useRef<HTMLDivElement>(null)
  const labelRef  = useRef<HTMLDivElement>(null)
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const cardsRef  = useRef<(HTMLDivElement | null)[]>([])

  useScrollScene({
    id: 'support',
    start: SCENE.start,
    end: SCENE.end,
    onProgress: (p) => {
      // Guard: React 18 Strict Mode nulls refs before effect cleanup runs.
      // If a scroll update fires in that window, return early to prevent
      // "GSAP target null" warnings.
      if (!rootRef.current || !bgRef.current || !labelRef.current || !titleRef.current) return

      // Toggle inert — same pattern as DepartmentScene.
      // Without this, .card (pointer-events:auto) permanently intercepts
      // clicks on all DepartmentScenes stacked beneath this one in the DOM.
      if (p > 0.02 && p < 0.98) rootRef.current.removeAttribute('inert')
      else                       rootRef.current.setAttribute('inert', '')

      // Background
      gsap.set(bgRef.current, { opacity: band(p, 0.0, 0.18, 0.85, 1.0) })

      // Label
      const lblVis = band(p, 0.02, 0.20, 0.78, 0.95)
      gsap.set(labelRef.current, {
        opacity: lblVis,
        y: (1 - enter(p, 0.02, 0.20)) * 20,
      })

      // Title
      gsap.set(titleRef.current, {
        opacity: band(p, 0.10, 0.35, 0.78, 0.95),
        y: (1 - enter(p, 0.10, 0.35)) * 60,
      })

      // Cards stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const d = i * 0.07
        gsap.set(card, {
          opacity: band(p, 0.20 + d, 0.50 + d, 0.78, 0.95),
          y: (1 - enter(p, 0.20 + d, 0.50 + d)) * 50,
        })
      })

      // Exit: whole scene rises
      const ex = mapRange(p, 0.60, 1.0)
      gsap.set(rootRef.current, { y: -ex * 60, opacity: 1 - ex })
    },
  })

  return (
    <div
      ref={rootRef}
      className={styles.root}
      aria-label="Support Team"
    >
      <div ref={bgRef} className={styles.bg} aria-hidden="true" />

      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          <span className={styles.num}>09</span>
          <span aria-hidden="true">·</span>
          <span>Support Team</span>
        </div>

        <h2 ref={titleRef} className={styles.title}>
          The people behind every recovery
        </h2>

        <div className={styles.cards}>
          {SUPPORT_STAFF.map((member, i: number) => (
            <div
              key={member.id}
              ref={(el) => { cardsRef.current[i] = el }}
              className={styles.card}
            >
              <div className={styles.cardAvatar} aria-hidden="true">
                <span className={styles.initial}>
                  {getInitials(member.name)}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.role}>{member.role}</p>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.avail}>
                  {member.availableDays.includes('On Call')
                    ? 'Available on call'
                    : member.availableHours}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
