'use client'

/**
 * MobilePage
 * -------------------------------------------------
 * Renders when screen width ≤ 768px or touch is detected.
 *
 * Architecture:
 *   - No GSAP. No ScrollTrigger. No Lenis. No parallax.
 *   - Sections are normal block elements: position:relative, min-height:100svh
 *   - IntersectionObserver (useFadeIn) drives CSS fade/slide transitions
 *   - Animation duration: 0.36s (desktop 0.6s × 0.6 = 40% reduction)
 *   - No blur effects (backdrop-filter:none already set globally)
 *   - Static hero gradient (no video)
 *   - Same data layer, same fonts, same color tokens as desktop
 */

import Image from 'next/image'
import Link from 'next/link'
import { getDepartmentsWithDoctors } from '@/lib/hospital/departments'
import { SUPPORT_STAFF, getInitials } from '@/lib/hospital/supportStaff'
import { HOSPITAL_NAME, HOSPITAL_TAGLINE, HOSPITAL_ADDRESS } from '@/lib/hospital/data'
import { buildDoctorDirectUrl, buildGeneralBookingUrl } from '@/lib/hospital/whatsapp'
import { DepartmentVisual } from '@/components/ui/DepartmentVisual'
import { useFadeIn } from '@/lib/scroll/useFadeIn'
import styles from './mobile.module.css'

// ── Local sub-components ───────────────────────────────────────

function MobileHero() {
  const ref = useFadeIn(0.05) as React.RefObject<HTMLDivElement>

  return (
    <section
      ref={ref}
      className={`${styles.hero} fade-in`}
      aria-label="Madni Specialist & Trauma Centre"
    >
      <p className={styles.heroLabel}>Madni Specialist &amp; Trauma Centre</p>

      <h1 className={styles.heroName}>
        {HOSPITAL_NAME}
      </h1>

      <p className={styles.heroTagline}>{HOSPITAL_TAGLINE}</p>

      <div className={styles.heroDivider} aria-hidden="true" />

      <div className={styles.heroTrust} role="list" aria-label="Hospital highlights">
        {[
          { value: '8+', label: 'Specialties' },
          { value: '10+', label: 'Specialists' },
          { value: '24/7', label: 'Emergency' },
        ].map(({ value, label }, i) => (
          <>
            {i > 0 && <div key={`sep-${i}`} className={styles.heroPillarSep} aria-hidden="true" />}
            <div key={label} className={styles.heroPillar} role="listitem">
              <span className={styles.heroPillarValue}>{value}</span>
              <span className={styles.heroPillarLabel}>{label}</span>
            </div>
          </>
        ))}
      </div>

      <p className={styles.heroScrollHint} aria-hidden="true">
        <span>↓</span>
        <span>Scroll to explore</span>
      </p>
    </section>
  )
}

function MobileDeptSection({
  dept,
  index,
}: {
  dept: ReturnType<typeof getDepartmentsWithDoctors>[number]
  index: number
}) {
  const ref = useFadeIn(0.08) as React.RefObject<HTMLElement>
  const numLabel = String(index).padStart(2, '0')

  // Build CSS variables for dept accent tint
  const accentVars = {
    '--dept-accent-08': `${dept.accent}14`,
    '--dept-accent-20': `${dept.accent}33`,
  } as React.CSSProperties

  return (
    <section
      id={`dept-${dept.id}`}
      ref={ref}
      className={`${styles.deptSection} fade-in`}
      style={accentVars}
      aria-labelledby={`dept-title-${dept.id}`}
    >
      {/* Badge */}
      <div className={styles.deptBadge} aria-hidden="true">
        <span>{numLabel}</span>
        <span aria-hidden="true">·</span>
        <span>{dept.name}</span>
      </div>

      {/* Photo or SVG */}
      <div className={styles.deptImage}>
        {dept.image ? (
          <Image
            src={dept.image}
            alt={`${dept.name} department`}
            fill
            sizes="(max-width: 768px) calc(100vw - 3rem)"
            className={styles.deptImagePhoto}
            quality={75}
          />
        ) : (
          <div className={styles.deptSvgWrap}>
            <DepartmentVisual id={dept.visual} color={dept.accent} image={dept.image} />
          </div>
        )}
      </div>

      {/* Title */}
      <h2 id={`dept-title-${dept.id}`} className={styles.deptTitle}>
        {dept.name}
      </h2>

      <p className={styles.deptTagline}>{dept.tagline}</p>
      <p className={styles.deptDescription}>{dept.description}</p>

      {/* Doctor cards */}
      {dept.doctors.length > 0 && (
        <div className={styles.deptDoctors} aria-label={`${dept.name} specialists`}>
          {dept.doctors.map((doc) => {
            const initials = doc.name
              .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s/i, '')
              .split(' ')
              .filter(Boolean)
              .map((w: string) => w[0].toUpperCase())
              .slice(0, 2)
              .join('')

            const bookUrl = buildDoctorDirectUrl(doc, dept.name)

            return (
              <a
                key={doc.id}
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.deptDoctorCard}
                aria-label={`Book appointment with ${doc.name}`}
              >
                <div className={styles.deptDoctorAvatar} aria-hidden="true">
                  {initials}
                </div>
                <div className={styles.deptDoctorInfo}>
                  <span className={styles.deptDoctorName}>{doc.name}</span>
                  <span className={styles.deptDoctorSpec}>{doc.specialty}</span>
                </div>
                <span aria-hidden="true" style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '1.125rem' }}>→</span>
              </a>
            )
          })}
        </div>
      )}

      {/* General booking CTA for this dept */}
      <a
        href={buildGeneralBookingUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.deptBookBtn}
        aria-label={`Book appointment in ${dept.name}`}
      >
        <WhatsAppIconSmall />
        <span>Book Appointment</span>
      </a>

      {/* Explore full department page — matches desktop visual card link */}
      <Link
        href={`/departments/${dept.slug}`}
        className={styles.deptExploreBtn}
        aria-label={`Explore ${dept.name} department`}
      >
        <span>Explore {dept.name}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}

function MobileSupportSection() {
  const ref = useFadeIn(0.08) as React.RefObject<HTMLElement>

  return (
    <section
      ref={ref}
      className={`${styles.supportSection} fade-in`}
      aria-labelledby="mobile-support-title"
    >
      <div className={styles.supportLabel} aria-hidden="true">
        <span>09</span>
        <span>·</span>
        <span>Support Team</span>
      </div>

      <h2 id="mobile-support-title" className={styles.supportTitle}>
        The people behind every recovery
      </h2>

      <div className={styles.supportCards}>
        {SUPPORT_STAFF.map((member) => (
          <div key={member.id} className={styles.supportCard}>
            <div className={styles.supportAvatar} aria-hidden="true">
              {getInitials(member.name)}
            </div>
            <div className={styles.supportCardBody}>
              <p className={styles.supportRole}>{member.role}</p>
              <p className={styles.supportName}>{member.name}</p>
              <p className={styles.supportDesc}>{member.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MobileBookingSection() {
  const ref = useFadeIn(0.08) as React.RefObject<HTMLElement>
  const bookingUrl = buildGeneralBookingUrl()

  return (
    <section
      ref={ref}
      className={`${styles.bookingSection} fade-in`}
      aria-labelledby="mobile-booking-title"
    >
      <div className={styles.bookingBadge} aria-hidden="true">
        <span>10</span>
        <span>·</span>
        <span>Appointments</span>
      </div>

      <h2 id="mobile-booking-title" className={styles.bookingTitle}>
        Begin your journey<br />
        <em>to better health</em>
      </h2>

      <p className={styles.bookingSub}>
        Every specialist at {HOSPITAL_NAME} is ready to see you.
        Book your appointment in seconds via WhatsApp.
      </p>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.bookingCta}
        aria-label="Book an appointment via WhatsApp"
      >
        <WhatsAppIcon />
        <span>Book an Appointment</span>
      </a>

      <div className={styles.bookingInfo} aria-label="Hospital information">
        <div className={styles.bookingInfoItem}>
          <span className={styles.bookingInfoLabel}>Address</span>
          <span className={styles.bookingInfoValue}>{HOSPITAL_ADDRESS}</span>
        </div>
        <div className={styles.bookingInfoItem}>
          <span className={styles.bookingInfoLabel}>Emergency</span>
          <span className={styles.bookingInfoValue}>24 / 7 Trauma Care</span>
        </div>
        <div className={styles.bookingInfoItem}>
          <span className={styles.bookingInfoLabel}>Specialties</span>
          <span className={styles.bookingInfoValue}>8 Departments</span>
        </div>
      </div>
    </section>
  )
}

// ── Icon helpers ───────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function WhatsAppIconSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ── Main export ────────────────────────────────────────────────

export function MobilePage() {
  const departments = getDepartmentsWithDoctors()

  return (
    <div className={styles.mobilePage}>
      <MobileHero />

      {departments.map((dept, i) => (
        <MobileDeptSection key={dept.id} dept={dept} index={i + 1} />
      ))}

      <MobileSupportSection />
      <MobileBookingSection />
    </div>
  )
}
