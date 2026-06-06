'use client'

/**
 * DeptAppointment — WhatsApp booking banner for the department page.
 * Builds a dept-specific pre-filled WhatsApp message.
 */

import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import type { DepartmentWithDoctors } from '@/lib/hospital/data'
import { HOSPITAL_WHATSAPP_NUMBER } from '@/lib/hospital/doctors'
import styles from './DeptAppointment.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

interface DeptAppointmentProps {
  department: DepartmentWithDoctors
}

export function DeptAppointment({ department }: DeptAppointmentProps) {
  const { name, accent, doctors } = department

  // Build a department-level WhatsApp message.
  // If there is exactly one doctor, personalise it.
  const doctorLine =
    doctors.length === 1
      ? `with ${doctors[0].name} (${name} Department)`
      : `in the ${name} Department`

  const message = encodeURIComponent(
    `Hello, I would like to book an appointment ${doctorLine} at Madni Specialist & Trauma Centre. Please confirm my appointment. Thank you.`
  )

  const waNumber = doctors[0]?.whatsappNumber ?? HOSPITAL_WHATSAPP_NUMBER
  const waUrl    = `https://wa.me/${waNumber}?text=${message}`

  return (
    <section
      className={styles.section}
      style={{ '--dept-accent': accent } as React.CSSProperties}
      aria-labelledby="appointment-heading"
    >
      {/* Background glow */}
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.inner}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* Eyebrow */}
          <p className={styles.eyebrow}>Ready to get started?</p>

          {/* Headline */}
          <h2 id="appointment-heading" className={styles.headline}>
            Book your appointment<br />
            <em>today</em>
          </h2>

          {/* Sub-text */}
          <p className={styles.sub}>
            Connect with our {name} team via WhatsApp for instant booking.
            We confirm appointments promptly.
          </p>

          {/* WhatsApp CTA */}
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            aria-label={`Book a ${name} appointment via WhatsApp`}
            whileHover={{ scale: 1.04, transition: { duration: 0.22 } }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={20} strokeWidth={1.8} />
            <span>Book via WhatsApp</span>
            <ArrowRight size={16} strokeWidth={1.8} className={styles.ctaArrow} />
          </motion.a>

          {/* Info strip */}
          <div className={styles.info}>
            <InfoItem label="Response time" value="Within minutes" />
            <span className={styles.sep} aria-hidden="true" />
            <InfoItem label="Availability" value="6 days a week" />
            <span className={styles.sep} aria-hidden="true" />
            <InfoItem label="Booking" value="Free & instant" />
          </div>

        </motion.div>
      </div>
    </section>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}
