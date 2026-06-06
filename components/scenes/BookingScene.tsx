'use client'

/**
 * BookingScene — final CTA. The last thing users see.
 *
 * Animation:
 *   0.00 → 0.20  Scene fades in, teal glow expands
 *   0.08 → 0.32  Headline reveals
 *   0.22 → 0.45  Sub-copy + button fade in
 *   0.40 → 0.65  Address / contact info fades in
 *   0.65+        Scene holds — no exit (it's the end)
 */

import { useRef } from 'react'
import { gsap } from '@/lib/animation/gsap.config'
import { useScrollScene } from '@/lib/scroll/useScrollScene'
import { getSceneConfig } from '@/lib/scroll/scenes.config'
import { enter, band } from '@/lib/scroll/animUtils'
import { buildGeneralBookingUrl } from '@/lib/hospital/whatsapp'
import { HOSPITAL_NAME, HOSPITAL_ADDRESS } from '@/lib/hospital/data'
import styles from './BookingScene.module.css'

const SCENE = getSceneConfig('booking')

export function BookingScene() {
  const rootRef    = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)
  const headRef    = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const btnRef     = useRef<HTMLAnchorElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)

  useScrollScene({
    id: 'booking',
    start: SCENE.start,
    end: SCENE.end,
    onProgress: (p) => {
      // Guard: React 18 Strict Mode nulls refs before effect cleanup runs.
      // If a scroll update fires in that window, return early to prevent
      // "GSAP target null" warnings.
      if (!rootRef.current || !glowRef.current || !headRef.current ||
          !subRef.current  || !btnRef.current  || !infoRef.current) return

      // Toggle inert — same pattern as DepartmentScene.
      // Without this, .inner (pointer-events:auto) permanently intercepts
      // clicks on all DepartmentScenes stacked beneath this one in the DOM.
      // No re-inert at p > 0.98: this is the final scene, stays interactive.
      if (p > 0.02) rootRef.current.removeAttribute('inert')
      else          rootRef.current.setAttribute('inert', '')

      // No exit animation — this is the final scene

      // Glow
      gsap.set(glowRef.current, {
        opacity: enter(p, 0.0, 0.20),
        scale: 0.7 + enter(p, 0.0, 0.30) * 0.3,
      })

      // Headline
      gsap.set(headRef.current, {
        opacity: enter(p, 0.08, 0.32),
        y: (1 - enter(p, 0.08, 0.32)) * 60,
      })

      // Sub-copy
      gsap.set(subRef.current, {
        opacity: enter(p, 0.22, 0.45),
        y: (1 - enter(p, 0.22, 0.45)) * 40,
      })

      // Button
      gsap.set(btnRef.current, {
        opacity: enter(p, 0.26, 0.50),
        y: (1 - enter(p, 0.26, 0.50)) * 30,
        scale: 0.94 + enter(p, 0.26, 0.50) * 0.06,
      })

      // Info block
      gsap.set(infoRef.current, {
        opacity: enter(p, 0.40, 0.65),
        y: (1 - enter(p, 0.40, 0.65)) * 24,
      })

      // Root fade in
      gsap.set(rootRef.current, {
        opacity: enter(p, 0.0, 0.12),
      })
    },
  })

  const bookingUrl = buildGeneralBookingUrl()

  return (
    <div ref={rootRef} className={styles.root} aria-label="Book an appointment">
      {/* Teal glow */}
      <div ref={glowRef} className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.badge}>
          <span>10 · Appointments</span>
        </div>

        <h2 ref={headRef} className={styles.headline}>
          Begin your journey<br />
          <em>to better health</em>
        </h2>

        <p ref={subRef} className={styles.sub}>
          Every specialist at {HOSPITAL_NAME} is ready to see you.
          Book your appointment in seconds via WhatsApp.
        </p>

        <a
          ref={btnRef}
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
          aria-label="Book an appointment via WhatsApp"
        >
          <WhatsAppIcon />
          <span>Book an Appointment</span>
        </a>

        <div ref={infoRef} className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Address</span>
            <span className={styles.infoValue}>{HOSPITAL_ADDRESS}</span>
          </div>
          <div className={styles.infoSep} aria-hidden="true" />
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Emergency</span>
            <span className={styles.infoValue}>24 / 7 Trauma Care</span>
          </div>
          <div className={styles.infoSep} aria-hidden="true" />
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Specialties</span>
            <span className={styles.infoValue}>8 Departments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
