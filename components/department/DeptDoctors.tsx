'use client'

/**
 * DeptDoctors — Doctor profiles section on the department page.
 *
 * Renders one card per doctor with:
 *  - Initials avatar (same style as DoctorCard)
 *  - Name, specialty, availability
 *  - WhatsApp booking CTA (opens wa.me link directly — no modal on pages)
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { BookingModal } from '@/components/ui/BookingModal'
import type { Doctor } from '@/lib/hospital/data'
import { DAY_SHORT } from '@/lib/hospital/data'
import styles from './DeptDoctors.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

interface DeptDoctorsProps {
  doctors:        Doctor[]
  departmentName: string
  accent:         string
}

export function DeptDoctors({ doctors, departmentName, accent }: DeptDoctorsProps) {
  return (
    <section
      className={styles.section}
      style={{ '--dept-accent': accent } as React.CSSProperties}
      aria-labelledby="doctors-heading"
    >
      <div className={styles.inner}>

        {/* Section header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className={styles.eyebrow}>Meet the team</p>
          <h2 id="doctors-heading" className={styles.title}>Our Specialists</h2>
          <div className={styles.divider} aria-hidden="true" />
        </motion.div>

        {/* Doctor cards */}
        <div className={styles.cards}>
          {doctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
            >
              <DoctorCard
                doctor={doctor}
                departmentName={departmentName}
                accent={accent}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ── Doctor card ───────────────────────────────────────────────

interface DoctorCardProps {
  doctor:         Doctor
  departmentName: string
  accent:         string
}

function DoctorCard({ doctor, departmentName, accent }: DoctorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isDaily  = doctor.availableDays.includes('Daily')
  const isOnCall = doctor.availableDays.includes('On Call')

  const cssVars = {
    '--dept-accent':    accent,
    '--dept-accent-08': `${accent}14`,
    '--dept-accent-20': `${accent}33`,
    '--accent':         accent,
    '--accent-18':      `${accent}2e`,
    '--accent-35':      `${accent}59`,
  } as React.CSSProperties

  return (
    <article
      className={styles.card}
      style={cssVars}
      aria-label={`${doctor.name}, ${doctor.specialty}`}
    >
      {/* Top accent line */}
      <div className={styles.accentLine} aria-hidden="true" />

      {/* Header: avatar + identity */}
      <div className={styles.cardHeader}>
        <div className={styles.avatarWrap} aria-hidden="true">
          <DoctorInitials name={doctor.name} color={accent} />
        </div>
        <div className={styles.identity}>
          <p className={styles.specialty}>{doctor.specialty}</p>
          <h3 className={styles.name}>{doctor.name}</h3>
        </div>
      </div>

      {/* Description */}
      <p className={styles.desc}>{doctor.shortDescription}</p>

      {/* Availability */}
      <div className={styles.avail} aria-label="Consultation hours">
        <span className={styles.availLabel}>Available</span>
        <div className={styles.dayRow}>
          {isOnCall ? (
            <span className={styles.oncall}>On Call</span>
          ) : isDaily ? (
            <span className={styles.badge}>Daily</span>
          ) : (
            doctor.availableDays.map((d) => (
              <span key={d} className={styles.badge}>{DAY_SHORT[d] ?? d}</span>
            ))
          )}
        </div>
        <time className={styles.hours}>{doctor.availableHours}</time>
      </div>

      {/* WhatsApp CTA */}
      <motion.button
        type="button"
        className={styles.cta}
        aria-label={`Book an appointment with ${doctor.name}`}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.97 }}
      >
        <MessageCircle size={16} strokeWidth={1.8} />
        <span>Book Appointment</span>
        <CtaArrow />
      </motion.button>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        departmentName={departmentName}
        accentColor={accent}
      />
    </article>
  )
}

// ── Avatar ────────────────────────────────────────────────────

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
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.avatarSvg}>
      <circle cx="32" cy="32" r="32" fill={color} fillOpacity="0.10" />
      <circle cx="32" cy="32" r="31" stroke={color} strokeOpacity="0.28" strokeWidth="1" />
      <text
        x="32" y="33"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="20"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="400"
        fontStyle="italic"
      >
        {initials}
      </text>
    </svg>
  )
}

function CtaArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className={styles.ctaArrow}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
