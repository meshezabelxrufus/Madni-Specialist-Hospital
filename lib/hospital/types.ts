/**
 * Hospital Data — Type Definitions
 * -------------------------------------------------
 * Single source of truth for all TypeScript interfaces.
 * Import from here in doctors.ts, departments.ts, supportStaff.ts,
 * and all components that render hospital data.
 *
 * DESIGN RULES:
 *  - Availability is flat (availableDays + availableHours) — no nesting.
 *    Flat fields are easier to destructure in components and sort/filter.
 *  - Department references doctors by ID only (doctorIds: string[]).
 *    Hydration happens at runtime via getDepartmentWithDoctors().
 *  - Every Doctor has its own whatsappNumber so individual doctors
 *    can have direct lines; fallback to HOSPITAL_WHATSAPP_NUMBER.
 *  - image is a path relative to /public (e.g. '/doctors/dr-usman-farooq.jpg').
 *    Empty string = use the SVG placeholder avatar.
 */

// ── Calendar types ─────────────────────────────────────────────

export type WeekDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

/** All possible values for a doctor's available days */
export type AvailabilityDay = WeekDay | 'Daily' | 'On Call'

// ── Department identity ────────────────────────────────────────

/**
 * Strict union of department IDs.
 * Add a new string literal here when adding a new department.
 * TypeScript will then enforce correct IDs everywhere.
 */
export type DepartmentId =
  | 'cardiology'
  | 'ent'
  | 'orthopedics'
  | 'pediatrics'
  | 'surgery'
  | 'gynecology'
  | 'dermatology'

/**
 * Which SVG illustration to render for each department.
 * Must map 1-to-1 with DepartmentVisual.tsx cases.
 */
export type DepartmentVisualId = DepartmentId

// ── Core entities ──────────────────────────────────────────────

/**
 * Doctor — complete record for one doctor.
 *
 * Adding a new doctor:
 *   1. Add their record to lib/hospital/doctors.ts
 *   2. Add their id to the department's doctorIds in lib/hospital/departments.ts
 *   3. Done — they appear in the scene automatically.
 */
export interface Doctor {
  /** Kebab-case unique ID.  Example: 'dr-usman-farooq' */
  id: string

  /** Full display name with title.  Example: 'Dr. Usman Farooq' */
  name: string

  /** Medical specialty label shown on the card. Example: 'Cardiologist' */
  specialty: string

  /** Which department this doctor belongs to */
  department: DepartmentId

  /**
   * Days the doctor sees patients.
   * Use ['Daily'] for every day, ['On Call'] for on-demand.
   */
  availableDays: AvailabilityDay[]

  /**
   * Consultation hours as a display string.
   * Examples: '11:00 AM – 6:00 PM' | 'On Call'
   */
  availableHours: string

  /**
   * WhatsApp number for direct booking.
   * Format: country code + number, no '+', no spaces.
   * Example: '923001234567'
   * Use HOSPITAL_WHATSAPP_NUMBER as the default value.
   */
  whatsappNumber: string

  /**
   * Path to doctor photo relative to /public.
   * Example: '/doctors/dr-usman-farooq.jpg'
   * Set to '' to show the SVG avatar placeholder.
   */
  image: string

  /**
   * One or two sentences shown on the doctor card.
   * Focus on expertise and patient benefit.
   */
  shortDescription: string
}

// ── Services ───────────────────────────────────────────────────

/**
 * A single service offered by a department.
 * `icon` is a Lucide icon name resolved in DeptServices.tsx.
 */
export interface Service {
  id: string
  title: string
  description: string
  icon: string
}

/**
 * Department — scene definition without embedded doctors.
 * Doctors are referenced by ID and resolved at runtime.
 */
export interface Department {
  /** Must match a DepartmentId value and a scene ID in scenes.config.ts */
  id: DepartmentId

  /**
   * URL-safe path segment for the dedicated department page.
   * Matches the /departments/[slug] route.
   * Usually equals id, except 'surgery' → 'general-surgery'.
   */
  slug: string

  /** Display name shown in the scene header.  Example: 'Cardiology' */
  name: string

  /** Short cinematic tagline shown as the scene's large italic headline */
  tagline: string

  /** 2–3 sentence description used as body text in the scene */
  description: string

  /**
   * 3–4 sentence overview for the dedicated department page hero.
   * Longer and more detailed than description.
   */
  overview: string

  /** CSS color string used as the scene accent / tint.  Example: '#e05555' */
  accent: string

  /** Which SVG illustration to render (used as fallback when image is absent) */
  visual: DepartmentVisualId

  /**
   * Optional photo shown in the left visual card.
   * Path is relative to /public — e.g. '/departments/cardiology.jpg'.
   * When set, the photo replaces the SVG illustration.
   * When absent or empty, the SVG illustration is shown instead.
   * Recommended size: 800 × 600 px minimum (4:3 ratio matches the card).
   */
  image?: string

  /**
   * Ordered list of doctor IDs for this department.
   * Order determines card stacking order in the scene.
   * Resolved to Doctor[] by getDepartmentWithDoctors().
   */
  doctorIds: string[]
}

/**
 * Hydrated department — what components actually receive.
 * Created by getDepartmentWithDoctors() in departments.ts.
 * Never construct this manually — always use the helper.
 */
export interface DepartmentWithDoctors extends Department {
  doctors: Doctor[]
}

// ── Support staff ──────────────────────────────────────────────

export type SupportStaffId =
  | 'm-ali-shabbir'
  | 'dr-imtiaz'
  | 'tehreem-sajjad'

export interface SupportStaff {
  id: string
  name: string

  /** Job title / role.  Example: 'Accountant & Administrator' */
  role: string

  availableDays: AvailabilityDay[]
  availableHours: string

  /**
   * Path to photo relative to /public.
   * Set to '' to show initials avatar.
   */
  image: string

  shortDescription: string
}

// ── Hospital constants ─────────────────────────────────────────

/** Short day abbreviations for badge display */
export const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
  Daily: 'Daily',
  'On Call': 'On Call',
}
