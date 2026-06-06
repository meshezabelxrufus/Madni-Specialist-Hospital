/**
 * Doctors — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * ADDING A DOCTOR:
 *   1. Copy any existing doctor block and change the values.
 *   2. Use kebab-case for the id: 'dr-firstname-lastname'
 *   3. Set image to '/doctors/[id].jpg' once a photo is available.
 *      Leave as '' to show the SVG avatar placeholder.
 *   4. Add the doctor's id to the relevant department's doctorIds
 *      array in departments.ts — that's the only other file to touch.
 *
 * REMOVING A DOCTOR:
 *   1. Delete their record from this file.
 *   2. Remove their id from the department's doctorIds in departments.ts.
 *
 * WhatsApp number format: country code + number, no + or spaces.
 * Pakistan example: '923001234567'
 * Using HOSPITAL_WHATSAPP_NUMBER as the default for all doctors.
 * Override per-doctor when individual lines are available.
 */

import type { Doctor } from './types'

/**
 * Hospital WhatsApp appointment lines.
 * All bookings are routed to these numbers — not to individual doctors.
 * Primary line is used for all wa.me links.
 */
export const HOSPITAL_WHATSAPP_NUMBER   = '923216606087'  // Primary booking line
export const HOSPITAL_WHATSAPP_NUMBER_2 = '923040599381'  // Secondary / backup line

// ─────────────────────────────────────────────────────────────
// Doctor records — one constant per doctor for readable diffs
// ─────────────────────────────────────────────────────────────

const DR_USMAN_FAROOQ: Doctor = {
  id: 'dr-usman-farooq',
  name: 'Dr. Usman Farooq',
  specialty: 'Cardiologist',
  department: 'cardiology',
  availableDays: ['Monday', 'Tuesday', 'Wednesday'],
  availableHours: '11:00 AM – 6:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Board-certified cardiologist with expertise in echocardiography, arrhythmia management, and preventive cardiac care.',
}

const DR_TAYYAB: Doctor = {
  id: 'dr-tayyab',
  name: 'Dr. Tayyab',
  specialty: 'ENT Specialist',
  department: 'ent',
  availableDays: ['Tuesday', 'Thursday'],
  availableHours: '3:00 PM – 6:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'ENT specialist skilled in diagnosing and treating ear, nose, and throat conditions including sinusitis and hearing disorders.',
}

const DR_SOHAIL_AMJAD_MIRZA: Doctor = {
  id: 'dr-sohail-amjad-mirza',
  name: 'Dr. Sohail Amjad Mirza',
  specialty: 'Orthopedic Surgeon',
  department: 'orthopedics',
  availableDays: ['Daily'],
  availableHours: '1:00 PM – 6:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Orthopedic surgeon specialising in joint replacement, sports injuries, and minimally invasive bone and muscle procedures.',
}

const DR_UMER_SHABBIR: Doctor = {
  id: 'dr-umer-shabbir',
  name: 'Dr. Umer Shabbir',
  specialty: 'Pediatrician',
  department: 'pediatrics',
  availableDays: ['Daily'],
  availableHours: '3:00 PM – 8:30 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Dedicated paediatrician providing comprehensive child healthcare from newborns through adolescents, with extended evening hours.',
}

const DR_SHABBIR: Doctor = {
  id: 'dr-shabbir',
  name: 'Dr. Shabbir',
  specialty: 'Pediatrician',
  department: 'pediatrics',
  availableDays: ['Daily'],
  availableHours: '10:00 AM – 2:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Experienced paediatrician offering morning consultations for routine check-ups, vaccinations, and childhood illnesses.',
}

const DR_ASIF: Doctor = {
  id: 'dr-asif',
  name: 'Dr. Asif',
  specialty: 'Consultant Surgeon',
  department: 'surgery',
  availableDays: ['Daily'],
  availableHours: '11:00 AM – 4:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Consultant surgeon with expertise in emergency trauma, laparoscopic procedures, and a wide range of elective operations.',
}

const DR_AMNA: Doctor = {
  id: 'dr-amna',
  name: 'Dr. Amna',
  specialty: 'Gynecologist',
  department: 'gynecology',
  availableDays: ['Daily'],
  availableHours: '5:00 PM – 7:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Gynaecologist offering compassionate women\'s health services including prenatal care, gynaecological surgery, and reproductive health.',
}

const DR_AISHA_NAZEER: Doctor = {
  id: 'dr-aisha-nazeer',
  name: 'Dr. Aisha Nazeer',
  specialty: 'Skin Specialist',
  department: 'dermatology',
  availableDays: ['Monday', 'Tuesday', 'Wednesday'],
  availableHours: '4:00 PM – 7:00 PM',
  whatsappNumber: HOSPITAL_WHATSAPP_NUMBER,
  image: '',
  shortDescription:
    'Dermatologist specialising in skin diseases, cosmetic dermatology, acne treatment, and evidence-based skincare protocols.',
}

// ── Master roster ──────────────────────────────────────────────

/**
 * Complete list of all doctors at the hospital.
 * This is the only array that drives doctor rendering —
 * no other file should hardcode doctor data.
 */
export const DOCTORS: Doctor[] = [
  DR_USMAN_FAROOQ,
  DR_TAYYAB,
  DR_SOHAIL_AMJAD_MIRZA,
  DR_UMER_SHABBIR,
  DR_SHABBIR,
  DR_ASIF,
  DR_AMNA,
  DR_AISHA_NAZEER,
]

// ── Query helpers ──────────────────────────────────────────────

/** O(n) lookup by doctor id — safe to call in render */
export function getDoctorById(id: string): Doctor | undefined {
  return DOCTORS.find((d) => d.id === id)
}

/**
 * Returns all doctors belonging to a given department, in roster order.
 * Used by getDepartmentWithDoctors() in departments.ts.
 */
export function getDoctorsByDepartment(
  departmentId: string,
  doctorIds?: string[]
): Doctor[] {
  // If explicit ordered IDs are provided, resolve in that order.
  if (doctorIds && doctorIds.length > 0) {
    return doctorIds
      .map((id) => DOCTORS.find((d) => d.id === id))
      .filter((d): d is Doctor => d !== undefined)
  }
  // Otherwise return all doctors for that department
  return DOCTORS.filter((d) => d.department === departmentId)
}

/**
 * Builds the WhatsApp booking URL for a specific doctor.
 * Uses the doctor's own whatsappNumber if set, otherwise the hospital number.
 */
export function buildDoctorWhatsAppUrl(doctor: Doctor, departmentName: string): string {
  const number = doctor.whatsappNumber || HOSPITAL_WHATSAPP_NUMBER
  const message = encodeURIComponent(
    `Hello, I would like to book an appointment with ${doctor.name} ` +
    `(${departmentName} Department). Please confirm my appointment. Thank you.`
  )
  return `https://wa.me/${number}?text=${message}`
}
