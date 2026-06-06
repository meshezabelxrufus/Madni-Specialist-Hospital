/**
 * data.ts — backward-compatibility barrel
 * -------------------------------------------------
 * Re-exports everything from the split data files so that
 * existing imports from '@/lib/hospital/data' keep working
 * without changes.
 *
 * Prefer importing directly from the specific file:
 *   import { DOCTORS } from '@/lib/hospital/doctors'
 *   import { DEPARTMENTS } from '@/lib/hospital/departments'
 *   import { SUPPORT_STAFF } from '@/lib/hospital/supportStaff'
 */

export type {
  WeekDay,
  AvailabilityDay,
  DepartmentId,
  DepartmentVisualId,
  Doctor,
  Department,
  DepartmentWithDoctors,
  SupportStaff,
  Service,
} from './types'

export { DAY_SHORT } from './types'

export {
  HOSPITAL_WHATSAPP_NUMBER,
  DOCTORS,
  getDoctorById,
  getDoctorsByDepartment,
  buildDoctorWhatsAppUrl,
} from './doctors'

export {
  DEPARTMENTS,
  getDepartmentById,
  getDepartmentBySlug,
  getDepartmentWithDoctors,
  getDepartmentWithDoctorsBySlug,
  getDepartmentsWithDoctors,
  getDepartmentName,
  getRelatedDepartments,
} from './departments'

export { getDepartmentServices, SERVICES_MAP } from './services'

export {
  SUPPORT_STAFF,
  getSupportStaffById,
  getInitials,
} from './supportStaff'

// ── Hospital constants ─────────────────────────────────────────
// Keep these here — they are not doctor or department data.

export const HOSPITAL_NAME    = 'Madni Specialist Hospital & Trauma Centre'
export const HOSPITAL_TAGLINE = 'Where Precision Meets Compassion'
export const HOSPITAL_ADDRESS = 'Your Address Here'   // ⚠️  replace with real address
