/**
 * WhatsApp Booking — URL & Message Builder
 * -------------------------------------------------
 * Produces a wa.me deep-link with a pre-filled appointment request.
 * WhatsApp renders *bold* and line breaks in the chat preview, so
 * the message is intentionally structured with WhatsApp markdown.
 *
 * EXAMPLE OUTPUT MESSAGE:
 * ─────────────────────────────────────────
 * Hello! I would like to book an appointment at
 * Madni Specialist & Trauma Centre.
 *
 * *Patient Details*
 * • Name: Ahmed Ali
 * • Age: 38
 *
 * *Appointment Request*
 * • Department: Cardiology
 * • Doctor: Dr. Usman Farooq
 * • Preferred Date: This Friday afternoon
 *
 * *Symptoms / Notes*
 * Chest tightness when climbing stairs.
 *
 * Kindly confirm the appointment. Thank you! 🙏
 * ─────────────────────────────────────────
 */

import type { Doctor } from './types'
import { HOSPITAL_NAME } from './data'

/**
 * Primary WhatsApp booking number.
 * Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local to change without a code edit.
 * Falls back to the hardcoded number so existing deployments keep working.
 */
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '923216606087'

if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
  console.warn(
    '[whatsapp] NEXT_PUBLIC_WHATSAPP_NUMBER not set — using hardcoded fallback. ' +
    'Add it to .env.local to silence this warning.'
  )
}

// ── Types ──────────────────────────────────────────────────────

/**
 * Full booking request — built from the modal form + doctor context.
 * All fields except patientName and doctor are optional so the modal
 * can open WhatsApp even if the user fills in the minimum required info.
 */
export interface BookingDetails {
  /** Patient's name — required */
  patientName: string

  /** Patient's age — optional */
  age?: string

  /** Doctor being booked */
  doctor: Doctor

  /** Human-readable department name, e.g. 'Cardiology' */
  departmentName: string

  /**
   * Free-text preferred date/time.
   * Intentionally a string so the user can type "Monday afternoon"
   * or "As soon as possible" without wrestling a date picker.
   */
  preferredDate?: string

  /**
   * Free-text symptoms or additional notes.
   * Optional — not all appointments are symptom-driven.
   */
  symptoms?: string
}

// ── Message builder ───────────────────────────────────────────

/**
 * Build the pre-filled WhatsApp message from booking details.
 * Returns the DECODED string (before URL encoding).
 */
export function buildBookingMessage(details: BookingDetails): string {
  const { patientName, age, doctor, departmentName, preferredDate, symptoms } = details

  const lines: (string | null)[] = [
    `Hello! I would like to book an appointment at ${HOSPITAL_NAME}.`,
    '',
    `*Patient Details*`,
    `• Name: ${patientName.trim()}`,
    age?.trim() ? `• Age: ${age.trim()} years` : null,
    '',
    `*Appointment Request*`,
    `• Department: ${departmentName}`,
    `• Doctor: ${doctor.name}`,
    preferredDate?.trim() ? `• Preferred Date: ${preferredDate.trim()}` : null,
    '',
    symptoms?.trim()
      ? `*Symptoms / Notes*\n${symptoms.trim()}\n`
      : null,
    `Kindly confirm the appointment. Thank you! 🙏`,
  ]

  return lines.filter((l) => l !== null).join('\n')
}

/**
 * Build the full wa.me URL for a specific booking.
 *
 * All appointments go through the hospital's WhatsApp lines.
 * Per-doctor numbers are NOT used — the hospital staff manages
 * scheduling centrally.
 */
export function buildBookingUrl(details: BookingDetails): string {
  const message = encodeURIComponent(buildBookingMessage(details))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

// ── Quick helpers (used when no form is shown) ─────────────────

/**
 * Direct link mentioning a specific doctor — no patient details.
 * Fallback for contexts where the booking modal isn't available.
 */
export function buildDoctorDirectUrl(doctor: Doctor, departmentName: string): string {
  const message = encodeURIComponent(
    `Hello! I would like to book an appointment with ${doctor.name} ` +
    `(${departmentName} Department) at ${HOSPITAL_NAME}. ` +
    `Please guide me about availability. Thank you!`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

/** General hospital inquiry — no specific doctor. */
export function buildGeneralBookingUrl(): string {
  const message = encodeURIComponent(
    `Hello! I would like to book an appointment at ${HOSPITAL_NAME}. ` +
    `Please guide me about available doctors and timings. Thank you!`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
