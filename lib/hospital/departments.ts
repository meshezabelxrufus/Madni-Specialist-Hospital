/**
 * Departments — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * Each department references doctors by ID only.
 * Call getDepartmentsWithDoctors() to get the hydrated version
 * that components (DepartmentScene) actually consume.
 *
 * ADDING A DEPARTMENT:
 *   1. Add the new DepartmentId to types.ts union.
 *   2. Add a DepartmentVisualId SVG case to DepartmentVisual.tsx.
 *   3. Add a scene entry in scenes.config.ts with the scroll range.
 *   4. Add the department record below with doctorIds.
 *   5. Add a nav item to ScrollProgress.tsx NAV_ITEMS.
 *   That's every touch point — nothing else needs updating.
 *
 * CHANGING A DOCTOR'S DEPARTMENT:
 *   Edit doctors.ts (change doctor.department) and update doctorIds here.
 */

import type { Department, DepartmentWithDoctors } from './types'
import { getDoctorsByDepartment } from './doctors'

// ─────────────────────────────────────────────────────────────
// Department records
// ─────────────────────────────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  // ── 1. Pediatrics ──────────────────────────────────────────────
  // Dr. Shabbir first, Dr. Umer Shabbir second (per requested order)
  {
    id: 'pediatrics',
    slug: 'pediatrics',
    name: 'Pediatrics',
    tagline: 'Every child deserves the very best',
    description:
      'Compassionate, family-centred paediatric care from birth through adolescence — available morning and evening for your convenience.',
    overview:
      'The Pediatrics Department is dedicated to the health and wellbeing of children from newborns through adolescents. Our two experienced paediatricians offer morning and evening clinics six days a week, ensuring families can access expert care at a time that suits them. From managing everyday childhood illnesses to monitoring growth and providing vaccination guidance, we deliver compassionate, family-centred care in a welcoming environment.',
    accent: '#f59e0b',
    visual: 'pediatrics',
    image: '/departments/pediatrics.jpg',
    doctorIds: ['dr-shabbir', 'dr-umer-shabbir'],
  },

  // ── 2. General Surgery ─────────────────────────────────────────
  {
    id: 'surgery',
    slug: 'general-surgery',
    name: 'General Surgery',
    tagline: 'Precision at every stage',
    description:
      'A full spectrum of general surgical procedures delivered with clinical excellence, from emergency trauma to elective operations.',
    overview:
      'The General Surgery Department provides a full range of surgical services, from minor day-case procedures to complex operations, delivered with clinical precision and compassionate care. Our consultant surgeon manages everything from hernia repairs and gallbladder surgery to wound care and post-operative follow-up. Daily clinic hours and a commitment to continuity of care ensure that every patient receives expert surgical attention throughout their treatment journey.',
    accent: '#cbd5e1',
    visual: 'surgery',
    image: '/departments/surgery.jpg',
    doctorIds: ['dr-asif'],
  },

  // ── 3. ENT ─────────────────────────────────────────────────────
  {
    id: 'ent',
    slug: 'ent',
    name: 'ENT',
    tagline: 'Clarity in every sense',
    description:
      'Comprehensive ear, nose and throat care — from chronic sinusitis to hearing disorders — with a gentle, patient-first approach.',
    overview:
      'The ENT Department provides expert care for all conditions affecting the ear, nose, and throat. Our specialist offers accurate diagnosis and effective treatment for sinusitis, hearing disorders, tonsillitis, allergic conditions, and nasal obstructions. Our patient-first approach ensures both acute and chronic ENT conditions are managed with precision and sensitivity, with twice-weekly evening clinics designed around your schedule.',
    accent: '#38bdf8',
    visual: 'ent',
    image: '/departments/ent.jpg',
    doctorIds: ['dr-tayyab'],
  },

  // ── 4. Orthopedics ─────────────────────────────────────────────
  {
    id: 'orthopedics',
    slug: 'orthopedics',
    name: 'Orthopedics',
    tagline: 'Restoring movement. Restoring life.',
    description:
      'Expert orthopedic surgery and joint care to get you moving again, with minimally invasive techniques tailored to your needs.',
    overview:
      'The Orthopedics Department offers advanced assessment and management of musculoskeletal conditions, from joint pain and fractures to sports injuries and complex bone disorders. Our specialist is available daily, making it easy to access expert orthopedic care without long waits. Whether you are managing a recent injury or a long-term condition, our team provides targeted, evidence-based treatment to restore your mobility and quality of life.',
    accent: '#94a3b8',
    visual: 'orthopedics',
    image: '/departments/orthopedics.jpg',
    doctorIds: ['dr-sohail-amjad-mirza'],
  },

  // ── 5. Gynecology ──────────────────────────────────────────────
  {
    id: 'gynecology',
    slug: 'gynecology',
    name: 'Gynecology',
    tagline: "Dedicated to women's wellness",
    description:
      "Holistic, respectful gynaecological care covering all stages of a woman's life — in a safe, confidential environment.",
    overview:
      "The Gynecology Department offers holistic and respectful women's healthcare in a safe, confidential environment. Our gynaecologist provides comprehensive services covering every stage of a woman's life — from family planning and antenatal care to postnatal follow-up and management of menstrual disorders. Evening clinics are designed to accommodate working women and mothers, ensuring expert care is always accessible when you need it most.",
    accent: '#f472b6',
    visual: 'gynecology',
    image: '/departments/gynecology.jpg',
    doctorIds: ['dr-amna'],
  },

  // ── 6. Dermatology ─────────────────────────────────────────────
  {
    id: 'dermatology',
    slug: 'dermatology',
    name: 'Dermatology',
    tagline: 'Healthy skin. Confident you.',
    description:
      'Expert diagnosis and treatment for all skin conditions — from acne to complex dermatological disorders — with evidence-based care.',
    overview:
      'The Dermatology Department delivers evidence-based skin care and advanced cosmetic treatments in a professional, welcoming environment. Our skin specialist combines expertise in medical dermatology with the latest aesthetic procedures, including PRP therapy, laser treatments, microneedling, and plasma pen therapy. Whether you are seeking treatment for a skin condition or looking to enhance your complexion, our clinic offers personalised care tailored to your skin goals.',
    accent: '#fb923c',
    visual: 'dermatology',
    image: '/departments/dermatology.jpg',
    doctorIds: ['dr-aisha-nazeer'],
  },

  // ── 7. Cardiology ──────────────────────────────────────────────
  {
    id: 'cardiology',
    slug: 'cardiology',
    name: 'Cardiology',
    tagline: 'Where the heart finds its rhythm',
    description:
      'Advanced cardiac diagnostics and treatment led by a specialist dedicated to preserving heart health with precision and care.',
    overview:
      'The Cardiology Department at Madni Specialist & Trauma Centre delivers comprehensive cardiac care, from routine consultations to complex heart disease management. Our specialist brings expertise in ECG interpretation, blood pressure management, and preventive cardiology to ensure every patient receives precise and personalised care. We are committed to protecting your heart health through evidence-based diagnostics and compassionate treatment, with dedicated clinic hours three days a week.',
    accent: '#e05555',
    visual: 'cardiology',
    image: '/departments/cardiology.jpg',
    doctorIds: ['dr-usman-farooq'],
  },
]

// ── Query helpers ──────────────────────────────────────────────

/** O(n) lookup by department id */
export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.id === id)
}

/**
 * Hydrate a single department: resolves doctorIds → Doctor[] records.
 * Returns undefined if the department id is not found.
 *
 * This is what DepartmentScene receives as its prop.
 */
export function getDepartmentWithDoctors(id: string): DepartmentWithDoctors | undefined {
  const dept = getDepartmentById(id)
  if (!dept) return undefined

  return {
    ...dept,
    doctors: getDoctorsByDepartment(dept.id, dept.doctorIds),
  }
}

/**
 * Returns all departments, each hydrated with their Doctor records.
 * Used in page.tsx to render all DepartmentScene instances.
 *
 * Order in this array = order of scenes on screen.
 */
export function getDepartmentsWithDoctors(): DepartmentWithDoctors[] {
  return DEPARTMENTS.map((dept) => ({
    ...dept,
    doctors: getDoctorsByDepartment(dept.id, dept.doctorIds),
  }))
}

/**
 * Returns the display name for a department id.
 * Safe to call with unknown strings (returns the id as fallback).
 */
export function getDepartmentName(id: string): string {
  return getDepartmentById(id)?.name ?? id
}

/**
 * Looks up a department by its URL slug (e.g. 'general-surgery').
 * The slug may differ from the department id (surgery → general-surgery).
 */
export function getDepartmentBySlug(slug: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.slug === slug)
}

/**
 * Hydrates a department by slug — resolves doctorIds → Doctor[].
 * Used in the /departments/[slug] page route.
 * Returns undefined when slug does not match any department.
 */
export function getDepartmentWithDoctorsBySlug(
  slug: string
): import('./types').DepartmentWithDoctors | undefined {
  const dept = getDepartmentBySlug(slug)
  if (!dept) return undefined
  return {
    ...dept,
    doctors: getDoctorsByDepartment(dept.id, dept.doctorIds),
  }
}

/**
 * Returns every department except the one with the given id.
 * Used by the "Related Departments" section on department pages.
 */
export function getRelatedDepartments(
  excludeId: string,
  limit = 3
): Department[] {
  return DEPARTMENTS.filter((d) => d.id !== excludeId).slice(0, limit)
}
