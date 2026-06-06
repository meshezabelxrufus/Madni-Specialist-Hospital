'use client'

/**
 * BookingModal — WhatsApp appointment booking flow.
 *
 * FLOW:
 *   1. User clicks "Book Appointment" on a DoctorCard.
 *   2. Modal slides up with doctor context at the top.
 *   3. User fills: Name (required), Age, Preferred date, Symptoms.
 *   4. Message preview shows exactly what will be sent.
 *   5. "Open WhatsApp" → window.open() → modal closes.
 *
 * PORTAL:
 *   Rendered into document.body so it escapes the sticky canvas's
 *   overflow:hidden. Without the portal the modal would be clipped.
 *
 * ACCESSIBILITY:
 *   - role="dialog" + aria-modal + aria-labelledby
 *   - Escape closes the modal
 *   - Backdrop click closes the modal
 *   - First input gets autoFocus on open
 *   - Returns focus to the trigger button on close (via onClose caller)
 *
 * ANIMATIONS (Framer Motion + AnimatePresence):
 *   Backdrop: opacity 0→1 (300ms)
 *   Modal:    y:60→0 + scale:0.96→1 + opacity:0→1 (450ms, cinematic ease)
 *   Exit:     y:0→40 + opacity:1→0 (300ms, ease-in)
 */

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Doctor } from '@/lib/hospital/data'
import { DAY_SHORT } from '@/lib/hospital/types'
import { buildBookingMessage, buildBookingUrl, type BookingDetails } from '@/lib/hospital/whatsapp'
import { useSmoothScroll } from '@/components/layout/SmoothScrollProvider'
import styles from './BookingModal.module.css'

// ── Types ──────────────────────────────────────────────────────

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  doctor: Doctor
  departmentName: string
  accentColor: string
}

interface FormState {
  patientName: string
  age: string
  preferredDate: string
  symptoms: string
}

const EMPTY_FORM: FormState = {
  patientName: '',
  age: '',
  preferredDate: '',
  symptoms: '',
}

// ── Animation variants ─────────────────────────────────────────

const EASE_ENTER: [number, number, number, number] = [0.22, 1, 0.36, 1]
const EASE_EXIT:  [number, number, number, number] = [0.76, 0, 0.24, 1]

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.28, ease: EASE_EXIT } },
}

const modalVariants = {
  hidden:  { opacity: 0, y: 60,  scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: EASE_ENTER },
  },
  exit: {
    opacity: 0, y: 40, scale: 0.97,
    transition: { duration: 0.3, ease: EASE_EXIT },
  },
}

// ── Component ─────────────────────────────────────────────────

export function BookingModal({
  isOpen,
  onClose,
  doctor,
  departmentName,
  accentColor,
}: BookingModalProps) {
  const titleId       = useId()
  const nameRef       = useRef<HTMLInputElement>(null)
  const modalRef      = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [form, setForm]     = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [sent, setSent]     = useState(false)

  // ── Body scroll lock ─────────────────────────────────────────
  // Stop Lenis while the modal is open so the cinematic canvas
  // cannot scroll behind the booking form on mobile.
  const { stop: stopScroll, start: startScroll } = useSmoothScroll()
  useEffect(() => {
    if (!isOpen) return
    stopScroll()
    return () => { startScroll() }
    // stop/start are stable closures over lenisRef — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // ── Reset form + state on close ──────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
      setForm(EMPTY_FORM)
      setErrors({})
      setSent(false)
    }
  }, [isOpen])

  // ── Keyboard: Escape to close + Tab focus trap ───────────────
  // Focus trap keeps keyboard navigation inside the modal (WCAG 2.1 AA).
  // Shift+Tab on the first focusable element wraps to the last, and
  // Tab on the last wraps to the first.
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && modal) {
        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        if (focusable.length < 2) return

        const first = focusable[0]
        const last  = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // ── Build booking details for URL + preview ───────────────────
  const details: BookingDetails = {
    patientName:   form.patientName,
    age:           form.age,
    doctor,
    departmentName,
    preferredDate: form.preferredDate,
    symptoms:      form.symptoms,
  }

  // ── Validation + submit ───────────────────────────────────────
  const handleSubmit = () => {
    const newErrors: Partial<FormState> = {}
    if (!form.patientName.trim()) {
      newErrors.patientName = 'Please enter your name'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      nameRef.current?.focus()
      return
    }

    const url = buildBookingUrl(details)
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
    closeTimerRef.current = setTimeout(onClose, 350)
  }

  const update = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // ── CSS vars for accent color ─────────────────────────────────
  const cssVars = {
    '--modal-accent':    accentColor,
    '--modal-accent-20': `${accentColor}33`,
    '--modal-accent-40': `${accentColor}66`,
  } as React.CSSProperties

  // ── Availability display ──────────────────────────────────────
  const isDaily  = doctor.availableDays.includes('Daily')
  const isOnCall = doctor.availableDays.includes('On Call')

  // ── Portal render ─────────────────────────────────────────────
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Centering container — position:fixed flex wrapper.
               Keeps the modal viewport-centered without using
               CSS transform: translate(-50%,-50%), which Framer
               Motion would overwrite with its own y/scale transform. */}
          <div className={styles.container}>

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className={styles.modal}
            style={cssVars}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Accent line */}
            <div className={styles.accentLine} aria-hidden="true" />

            {/* ── DOCTOR CONTEXT ── */}
            <div className={styles.doctorRow}>
              <DoctorInitials name={doctor.name} color={accentColor} />
              <div>
                <p className={styles.deptLabel}>{departmentName}</p>
                <p className={styles.doctorName}>{doctor.name}</p>
                <p className={styles.availability}>
                  {isOnCall
                    ? 'Available on call'
                    : isDaily
                    ? `Daily · ${doctor.availableHours}`
                    : `${doctor.availableDays.map((d) => DAY_SHORT[d] ?? d).join(' · ')} · ${doctor.availableHours}`}
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            {/* ── FORM ── */}
            <form
              className={styles.form}
              onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
              noValidate
            >
              <h2 className={styles.title} id={titleId}>
                Book Appointment
              </h2>

              {/* Name */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="booking-name">
                  Your name <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="booking-name"
                  type="text"
                  autoFocus
                  autoComplete="name"
                  placeholder="Ahmed Ali"
                  value={form.patientName}
                  onChange={update('patientName')}
                  className={`${styles.input} ${errors.patientName ? styles.inputError : ''}`}
                  aria-required="true"
                  aria-describedby={errors.patientName ? 'name-error' : undefined}
                />
                {errors.patientName && (
                  <p className={styles.errorMsg} id="name-error" role="alert">
                    {errors.patientName}
                  </p>
                )}
              </div>

              {/* Age + Preferred date — inline on desktop */}
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="booking-age">
                    Age <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    id="booking-age"
                    type="number"
                    min="0"
                    max="120"
                    placeholder="35"
                    value={form.age}
                    onChange={update('age')}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="booking-date">
                    Preferred date <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    id="booking-date"
                    type="text"
                    placeholder="e.g. Monday afternoon"
                    value={form.preferredDate}
                    onChange={update('preferredDate')}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="booking-symptoms">
                  Symptoms / notes <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                  id="booking-symptoms"
                  rows={3}
                  placeholder="Briefly describe your concern…"
                  value={form.symptoms}
                  onChange={update('symptoms')}
                  className={`${styles.input} ${styles.textarea}`}
                />
              </div>

              {/* Message preview — shows what WhatsApp will receive */}
              {form.patientName.trim() && (
                <div className={styles.preview} aria-label="Message preview">
                  <p className={styles.previewLabel}>Message preview</p>
                  <pre className={styles.previewText}>
                    {buildBookingMessage(details)}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={onClose}
                >
                  Cancel
                </button>

                <motion.button
                  type="submit"
                  className={`${styles.submitBtn} ${sent ? styles.submitSent : ''}`}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                  disabled={sent}
                >
                  {sent ? (
                    <>
                      <CheckIcon />
                      <span>Opening WhatsApp…</span>
                    </>
                  ) : (
                    <>
                      <WhatsAppIcon />
                      <span>Open WhatsApp</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Close button */}
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close booking modal"
            >
              <CloseIcon />
            </button>
          </motion.div>

          </div>{/* /container */}
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ── SVG helpers ────────────────────────────────────────────────

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
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="26" cy="26" r="26" fill={color} fillOpacity="0.12" />
      <circle cx="26" cy="26" r="25.5" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
      <text
        x="26"
        y="27"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="17"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
      >
        {initials}
      </text>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
