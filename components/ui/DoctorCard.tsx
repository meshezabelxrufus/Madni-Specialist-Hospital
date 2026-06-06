'use client'

/**
 * DoctorCard — Premium glassmorphism card component.
 *
 * Motion layers (each on a separate DOM element to avoid conflicts):
 *
 *  1. FLOAT   — infinite y[0, -7, 0] on the card itself — makes it
 *               feel alive while stationary in the sticky canvas.
 *               Disabled automatically with prefers-reduced-motion.
 *
 *  2. LIFT    — whileHover: y:-14, scale:1.025 — responds to user
 *               attention. Overrides the float animation while hovered;
 *               smoothly resumes float when the mouse leaves.
 *
 *  3. GLOW    — CSS :hover transition on the radial gradient overlay —
 *               GPU-composited, no JavaScript, zero jank.
 *
 *  4. CTA     — whileHover scale + whileTap scale on the booking button.
 *
 * GSAP context:
 *   DepartmentScene animates the WRAPPER div (x, scale, opacity via timeline).
 *   This motion.article animates y (float/hover). Different elements,
 *   different CSS properties — no conflict.
 */

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Doctor } from '@/lib/hospital/data'
import { DAY_SHORT } from '@/lib/hospital/types'
import { BookingModal } from './BookingModal'
import styles from './DoctorCard.module.css'

// ── Types ──────────────────────────────────────────────────────

interface DoctorCardProps {
  doctor: Doctor
  departmentName: string
  accentColor: string
}

// ── Easing (matches the scroll system) ────────────────────────

const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const

// ── Component ─────────────────────────────────────────────────

export function DoctorCard({ doctor, departmentName, accentColor }: DoctorCardProps) {
  const prefersReduced = useReducedMotion()
  const isDaily        = doctor.availableDays.includes('Daily')
  const isOnCall       = doctor.availableDays.includes('On Call')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Disable float animation on touch devices — continuous y-animation
  // on a compositor layer costs GPU every frame, and touch users can't
  // perceive hover effects anyway. whileTap still works for tap feedback.
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0)
  }, [])

  // Build the inline CSS custom properties for this dept's accent color.
  // Using 8-digit hex (6-digit color + 2-digit alpha) for opacity variants.
  // All dept colors in departments.ts are 6-digit hex, so this is safe.
  const cssVars = {
    '--accent':    accentColor,
    '--accent-18': `${accentColor}2e`,  // 18 % opacity
    '--accent-35': `${accentColor}59`,  // 35 % opacity
  } as React.CSSProperties

  return (
    <motion.article
      className={styles.card}
      style={cssVars}
      aria-label={`${doctor.name} — ${doctor.specialty}`}

      // ── Float ────────────────────────────────────────────
      // Disabled on touch (no hover perception) and reduced-motion.
      animate={(prefersReduced || isTouch) ? {} : { y: [0, -7, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        // Don't restart the float from 0 after hover ends — continue
        // from wherever it was to avoid a snap back to top.
        repeatType: 'mirror',
      }}

      // ── Lift on hover ─────────────────────────────────────
      whileHover={{
        y: -14,
        scale: 1.025,
        transition: { duration: 0.42, ease: EASE_CINEMATIC },
      }}
    >
      {/* Radial glow behind content (CSS :hover, GPU layer) */}
      <div className={styles.glow} aria-hidden="true" />

      {/* Dept accent line at the top of the card */}
      <div className={styles.accentLine} aria-hidden="true" />

      {/* ─────────── HEADER ─────────── */}
      <div className={styles.header}>
        {/* Initials avatar — Apple Health style */}
        <div className={styles.avatarWrap} aria-hidden="true">
          <DoctorInitials name={doctor.name} color={accentColor} />
          {/* Ring that glows on :hover (CSS transition) */}
          <span className={styles.avatarRing} />
        </div>

        <div className={styles.identity}>
          <p className={styles.specialty}>{doctor.specialty}</p>
          <h3 className={styles.name}>{doctor.name}</h3>
        </div>
      </div>

      {/* ─────────── DIVIDER ─────────── */}
      <div className={styles.divider} role="separator" />

      {/* ─────────── DESCRIPTION ─────────── */}
      <p className={styles.desc}>{doctor.shortDescription}</p>

      {/* ─────────── AVAILABILITY ─────────── */}
      <div className={styles.avail} aria-label="Consultation hours">
        <span className={styles.availLabel}>Available</span>

        <div className={styles.dayRow}>
          {isOnCall ? (
            <span className={styles.oncall}>On Call</span>
          ) : isDaily ? (
            <span className={styles.badge}>Daily</span>
          ) : (
            doctor.availableDays.map((d) => (
              <span key={d} className={styles.badge}>
                {DAY_SHORT[d] ?? d}
              </span>
            ))
          )}
        </div>

        <time className={styles.hours}>{doctor.availableHours}</time>
      </div>

      {/* ─────────── WHATSAPP CTA — opens booking modal ─────────── */}
      <motion.button
        type="button"
        className={styles.cta}
        aria-label={`Book an appointment with ${doctor.name}`}
        onClick={() => setIsModalOpen(true)}
        whileHover={{
          scale: 1.04,
          transition: { duration: 0.22, ease: EASE_CINEMATIC },
        }}
        whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
      >
        <WhatsAppIcon />
        <span>Book Appointment</span>
        <ArrowIcon />
      </motion.button>

      {/* Booking modal — rendered in document.body portal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        departmentName={departmentName}
        accentColor={accentColor}
      />
    </motion.article>
  )
}

// ── SVG helpers ────────────────────────────────────────────────

/**
 * Renders the doctor's initials (minus honorific) in a dept-colored
 * circular frame. Apple Health-style: clean, no photos needed.
 */
function DoctorInitials({ name, color }: { name: string; color: string }) {
  const initials = name
    .replace(/^(Dr|Prof|Mr|Ms|Mrs)\.\s*/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.avatarSvg}
    >
      {/* Background fill */}
      <circle cx="32" cy="32" r="32" fill={color} fillOpacity="0.1" />
      {/* Crisp border ring */}
      <circle cx="32" cy="32" r="31" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
      {/* Initials */}
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="20"
        fontFamily="'Cormorant Garamond', Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fontStyle="italic"
      >
        {initials}
      </text>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.ctaIcon}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.ctaArrow}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
