/**
 * Support Staff — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * Non-clinical team members: administration, anaesthesia, physiotherapy.
 *
 * ADDING A STAFF MEMBER:
 *   1. Add their record to SUPPORT_STAFF below.
 *   2. That's it — SupportScene renders this array dynamically.
 *
 * image: path relative to /public.
 *   '/staff/m-ali-shabbir.jpg' once a photo is available.
 *   Leave '' to show the initials avatar.
 */

import type { SupportStaff } from './types'

export const SUPPORT_STAFF: SupportStaff[] = [
  {
    id: 'm-ali-shabbir',
    name: 'M. Ali Shabbir',
    role: 'Accountant & Administrator',
    availableDays: ['Daily'],
    availableHours: 'Office Hours',
    image: '',
    shortDescription:
      'Manages hospital administration, billing, and patient records — the operational backbone keeping every department running smoothly.',
  },
  {
    id: 'dr-imtiaz',
    name: 'Dr. Imtiaz',
    role: 'Anesthesiologist',
    availableDays: ['On Call'],
    availableHours: 'On Call',
    image: '',
    shortDescription:
      'Experienced anaesthesiologist ensuring safe, precise anaesthesia for all surgical and procedural cases at the centre.',
  },
  {
    id: 'tehreem-sajjad',
    name: 'Tehreem Sajjad',
    role: 'Physiotherapist',
    availableDays: ['On Call'],
    availableHours: 'On Call',
    image: '',
    shortDescription:
      'Certified physiotherapist specialising in post-operative rehabilitation, pain management, and musculoskeletal recovery programmes.',
  },
]

// ── Query helpers ──────────────────────────────────────────────

export function getSupportStaffById(id: string): SupportStaff | undefined {
  return SUPPORT_STAFF.find((s) => s.id === id)
}

/**
 * Returns initials for the avatar fallback.
 * 'M. Ali Shabbir' → 'MS', 'Dr. Imtiaz' → 'DI'
 */
export function getInitials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s/i, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('')
}
