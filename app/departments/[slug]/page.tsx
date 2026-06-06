/**
 * Department Page — /departments/[slug]
 * -------------------------------------------------
 * Statically generated at build time for all 7 departments.
 * Each page is driven entirely by the data layer — no hardcoded content.
 *
 * Data flow:
 *   slug → getDepartmentWithDoctorsBySlug() → DepartmentWithDoctors
 *   id   → getDepartmentServices()          → Service[]
 *   id   → getRelatedDepartments()          → Department[]
 */

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DEPARTMENTS } from '@/lib/hospital/departments'
import {
  getDepartmentWithDoctorsBySlug,
  getRelatedDepartments,
} from '@/lib/hospital/departments'
import { getDepartmentServices } from '@/lib/hospital/services'
import { HOSPITAL_NAME } from '@/lib/hospital/data'
import { DeptHero }        from '@/components/department/DeptHero'
import { DeptServices }    from '@/components/department/DeptServices'
import { DeptDoctors }     from '@/components/department/DeptDoctors'
import { DeptAppointment } from '@/components/department/DeptAppointment'
import { DeptRelated }     from '@/components/department/DeptRelated'

// ── Static generation ──────────────────────────────────────────

/**
 * Pre-generate all department pages at build time.
 * No dynamic fallback needed — department list is static.
 */
export function generateStaticParams() {
  return DEPARTMENTS.map((dept) => ({ slug: dept.slug }))
}

// ── SEO Metadata ──────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const dept = getDepartmentWithDoctorsBySlug(params.slug)
  if (!dept) return {}

  const doctorNames = dept.doctors.map((d) => d.name).join(', ')
  const title       = `${dept.name} Department`
  const description = dept.overview

  return {
    title,
    description,
    keywords: [
      dept.name,
      ...dept.doctors.map((d) => d.specialty),
      'hospital',
      'appointment',
      'WhatsApp booking',
      HOSPITAL_NAME,
    ],
    openGraph: {
      type:        'website',
      title:       `${title} — ${HOSPITAL_NAME}`,
      description,
      siteName:    HOSPITAL_NAME,
    },
    alternates: {
      canonical: `/departments/${dept.slug}`,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────

export default function DepartmentPage({
  params,
}: {
  params: { slug: string }
}) {
  const dept = getDepartmentWithDoctorsBySlug(params.slug)
  if (!dept) notFound()

  const services = getDepartmentServices(dept.id)
  const related  = getRelatedDepartments(dept.id, 3)

  return (
    <div
      style={{
        '--dept-accent':    dept.accent,
        '--dept-accent-08': `${dept.accent}14`,
        '--dept-accent-12': `${dept.accent}1f`,
        '--dept-accent-20': `${dept.accent}33`,
      } as React.CSSProperties}
    >
      {/* 1 — Hero: visual + headline + overview */}
      <DeptHero department={dept} />

      {/* 2 — Services grid */}
      <DeptServices services={services} accent={dept.accent} />

      {/* 3 — Doctor profiles */}
      <DeptDoctors
        doctors={dept.doctors}
        departmentName={dept.name}
        accent={dept.accent}
      />

      {/* 4 — WhatsApp appointment CTA */}
      <DeptAppointment department={dept} />

      {/* 5 — Related departments */}
      <DeptRelated departments={related} />
    </div>
  )
}
