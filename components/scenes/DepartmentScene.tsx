'use client'

/**
 * DepartmentScene — two-card cinematic scroll scene.
 *
 * ══ LAYOUT ════════════════════════════════════════════════════
 *
 *  [LEFT: Visual Department Card ~60%] [RIGHT: Info Card ~40%]
 *
 *  Visual Card:  Prominent SVG illustration in a bordered card.
 *                Full opacity. Enters from the left.
 *
 *  Info Card:    Department text + inline doctor entries.
 *                Contains label, tagline, description, and per-doctor
 *                availability + WhatsApp CTA rows.
 *                Enters from the right as a floating panel.
 *
 * ══ ANIMATION ARCHITECTURE ════════════════════════════════════
 *
 * Single GSAP timeline (duration ≈ 1.0) seeked by scroll progress.
 *
 *  ENTRY  (0.00 → 0.38)  elements enter with stagger + easing
 *  HOLD   (0.38 → 0.70)  fully visible; parallax keeps it alive
 *  EXIT   (0.70 → 1.00)  visual exits left, text + doctors exit
 *
 * ══ PARALLAX DEPTH LAYERS ════════════════════════════════════
 *
 *  Background wash   drift ×0.5   furthest, sluggish
 *  Visual card       drift ×0.8   mid-ground (larger element)
 *  Info card         drift ×-0.2  slight counter-drift (foreground)
 *  Doctor entries    drift ×-0.3  strongest counter-drift (closest)
 *
 * ══ PERFORMANCE ══════════════════════════════════════════════
 *
 *  - quickSetter: 3-5× faster than gsap.set() at 60fps
 *  - force3D / autoRound: GPU layers, no jitter
 *  - Parallax disabled on mobile (compositor cost on low-end GPUs)
 *  - infoCard overflow-y:hidden prevents layout shifts during scroll
 */

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gsap } from '@/lib/animation/gsap.config'
import { useScrollTimeline } from '@/lib/scroll/useScrollTimeline'
import { DepartmentVisual } from '@/components/ui/DepartmentVisual'
import { BookingModal } from '@/components/ui/BookingModal'
import type { DepartmentWithDoctors, Doctor } from '@/lib/hospital/data'
import type { SceneConfig } from '@/lib/scroll/types'
import { DAY_SHORT } from '@/lib/hospital/data'
import styles from './DepartmentScene.module.css'

// ── Timing constants ──────────────────────────────────────────
const T = {
  // ENTRY
  bgIn:      [0.00, 0.14] as const,
  visualIn:  [0.02, 0.28] as const,   // visual card slides in from left
  labelIn:   [0.08, 0.20] as const,
  titleIn:   [0.11, 0.28] as const,
  divIn:     [0.16, 0.24] as const,
  descIn:    [0.18, 0.30] as const,
  cardIn:    [0.22, 0.38] as const,   // doctor entries: stagger 0.05

  // EXIT
  labelOut:  [0.70, 0.80] as const,
  titleOut:  [0.73, 0.86] as const,
  divOut:    [0.74, 0.82] as const,
  descOut:   [0.76, 0.87] as const,
  cardOut:   [0.78, 0.93] as const,
  visualOut: [0.80, 0.94] as const,   // visual card exits LAST (foreground feel)
  bgOut:     [0.84, 1.00] as const,
} as const

// ── Parallax depths ───────────────────────────────────────────
const PARALLAX = {
  bg:     50,    // background: sluggish, furthest away
  visual: 65,    // visual card: mid-ground vertical drift
  text:  -18,    // info card: slight counter-drift (feels closer)
  card:  -30,    // doctor entries: strongest counter-drift
}

interface DepartmentSceneProps {
  department: DepartmentWithDoctors
  sceneConfig: SceneConfig
  index: number
}

export function DepartmentScene({ department, sceneConfig, index }: DepartmentSceneProps) {
  const router = useRouter()
  const deptUrl = `/departments/${department.slug}`

  // ── DOM refs ──────────────────────────────────────────────
  const rootRef      = useRef<HTMLDivElement>(null)
  const bgRef        = useRef<HTMLDivElement>(null)
  const visualRef    = useRef<HTMLDivElement>(null)   // LEFT visual card
  const textColRef   = useRef<HTMLDivElement>(null)   // RIGHT info card
  const labelRef     = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const divRef       = useRef<HTMLDivElement>(null)
  const descRef      = useRef<HTMLParagraphElement>(null)
  const cardsRef      = useRef<(HTMLDivElement | null)[]>([])
  const visualLinkRef = useRef<HTMLDivElement>(null)

  // ── Mobile detection ──────────────────────────────────────
  const isMobileRef = useRef(false)
  useEffect(() => {
    isMobileRef.current = window.matchMedia('(max-width: 768px)').matches
  }, [])

  // ── QuickSetter refs ──────────────────────────────────────
  const qs = useRef<{
    bgY:     (v: number) => void
    visualY: (v: number) => void
    visualX: (v: number) => void
    textY:   (v: number) => void
    cardY:   (v: number) => void
  } | null>(null)

  useScrollTimeline({
    id:    department.id,
    start: sceneConfig.start,
    end:   sceneConfig.end,

    buildTimeline: () => {
      const cards = cardsRef.current.filter((c): c is HTMLDivElement => c !== null)
      const m = isMobileRef.current

      // Motion values — halved on mobile to reduce GPU workload
      const visualX      = m ? -30  : -56
      const yLabel       = m ? 12   : 24
      const yTitle       = m ? 28   : 56
      const yDesc        = m ? 18   : 36
      const cardX        = m ? 32   : 64
      const cardScaleIn  = m ? 0.96 : 0.93
      // Exit offsets
      const visualXOut   = m ? -20  : -44
      const yLabelOut    = m ? -12  : -24
      const yTitleOut    = m ? -16  : -32
      const yDescOut     = m ? -12  : -24
      const cardXOut     = m ? 20   : 40

      // ── 1. Initial states (sync, post-paint) ─────────────
      gsap.set(rootRef.current,    { opacity: 1 })
      gsap.set(bgRef.current,      { opacity: 0 })
      gsap.set(visualRef.current,  { opacity: 0, x: visualX, scale: 0.95 })
      // Info card fades in as a whole — prevents the "empty white box" flash
      // during scene crossfades. Individual children use POSITION-only transforms
      // for the stagger depth effect (no double-opacity multiplication).
      gsap.set(textColRef.current, { opacity: 0 })
      gsap.set(labelRef.current,   { y: yLabel })
      gsap.set(titleRef.current,   { y: yTitle })
      gsap.set(divRef.current,     { scaleX: 0 })
      gsap.set(descRef.current,    { y: yDesc })
      gsap.set(cards,              { x: cardX, scale: cardScaleIn })

      // ── 2. QuickSetters for parallax ─────────────────────
      qs.current = {
        bgY:     gsap.quickSetter(bgRef.current,     'y', 'px') as (v: number) => void,
        visualY: gsap.quickSetter(visualRef.current, 'y', 'px') as (v: number) => void,
        visualX: gsap.quickSetter(visualRef.current, 'x', 'px') as (v: number) => void,
        textY:   gsap.quickSetter(textColRef.current,'y', 'px') as (v: number) => void,
        cardY:   gsap.quickSetter(cards[0] ?? bgRef.current, 'y', 'px') as (v: number) => void,
      }

      // ── 3. Build timeline ─────────────────────────────────
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'cinematic',
          force3D: true,
          autoRound: false,
        },
      })

      // ENTRY ───────────────────────────────────────────────

      // Background ambient wash
      tl.fromTo(bgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: dur(...T.bgIn) },
        T.bgIn[0]
      )

      // Visual card: slides in from left at full opacity
      tl.fromTo(visualRef.current,
        { opacity: 0, x: visualX, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, ease: 'power3.out', duration: dur(...T.visualIn) },
        T.visualIn[0]
      )

      // Info card fades in as a single unit — no empty white box during crossfade
      tl.fromTo(textColRef.current,
        { opacity: 0 },
        { opacity: 1, duration: dur(...T.labelIn) },
        T.labelIn[0]
      )

      // Individual elements stagger their POSITION within the already-fading card.
      // No opacity tweens here — the parent card controls visibility.
      tl.fromTo(labelRef.current,
        { y: yLabel },
        { y: 0, duration: dur(...T.labelIn) },
        T.labelIn[0]
      )
      tl.fromTo(titleRef.current,
        { y: yTitle },
        { y: 0, duration: dur(...T.titleIn) },
        T.titleIn[0]
      )
      tl.fromTo(divRef.current,
        { scaleX: 0 },
        { scaleX: 1, opacity: 0.45, duration: dur(...T.divIn) },
        T.divIn[0]
      )
      tl.fromTo(descRef.current,
        { y: yDesc },
        { y: 0, duration: dur(...T.descIn) },
        T.descIn[0]
      )
      tl.fromTo(cards,
        { x: cardX, scale: cardScaleIn },
        {
          x: 0, scale: 1,
          duration: dur(...T.cardIn),
          stagger: { amount: cards.length > 1 ? 0.06 : 0 },
        },
        T.cardIn[0]
      )

      // HOLD (0.38 → 0.70) — parallax keeps scene alive

      // EXIT ────────────────────────────────────────────────

      // Individual elements stagger their position OUT (no opacity — card handles it)
      tl.to(labelRef.current,
        { y: yLabelOut, ease: 'power2.in', duration: dur(...T.labelOut) },
        T.labelOut[0]
      )
      tl.to(titleRef.current,
        { y: yTitleOut, ease: 'power2.in', duration: dur(...T.titleOut) },
        T.titleOut[0]
      )
      tl.to(divRef.current,
        { opacity: 0, scaleX: 0, ease: 'power2.in', duration: dur(...T.divOut) },
        T.divOut[0]
      )
      tl.to(descRef.current,
        { y: yDescOut, ease: 'power2.in', duration: dur(...T.descOut) },
        T.descOut[0]
      )

      // Doctor entries slide right
      tl.to(cards,
        {
          x: cardXOut, scale: 0.96,
          ease: 'power2.in',
          duration: dur(...T.cardOut),
          stagger: { amount: cards.length > 1 ? 0.04 : 0 },
        },
        T.cardOut[0]
      )

      // Info card fades out as a whole
      tl.to(textColRef.current,
        { opacity: 0, ease: 'power2.in', duration: dur(...T.cardOut) },
        T.cardOut[0]
      )

      // Visual card: exits left after text starts exiting
      tl.to(visualRef.current,
        { opacity: 0, x: visualXOut, scale: 0.96, ease: 'power2.in', duration: dur(...T.visualOut) },
        T.visualOut[0]
      )

      // Background: last to fade — lingers for crossfade into next scene
      tl.to(bgRef.current,
        { opacity: 0, ease: 'power2.in', duration: dur(...T.bgOut) },
        T.bgOut[0]
      )

      // ── 4. Block entire scene until it becomes active ────────────
      // Setting inert on the root makes EVERY element inside non-interactive,
      // regardless of their CSS pointer-events. This is the only reliable way
      // to prevent invisible scenes from absorbing clicks meant for the visible one.
      // onParallax removes inert when p enters the visible range (> 0.02).
      rootRef.current?.setAttribute('inert', '')

      return tl
    },

    // ── Parallax ─────────────────────────────────────────
    // Disabled on mobile — multi-layer parallax on animated
    // compositor layers is the single biggest GPU bottleneck
    // on low-end devices. Scene transitions provide ample motion.
    onParallax: (p) => {
      // Toggle inert on the scene root — one attribute blocks the ENTIRE scene.
      // All 7 scenes are always mounted; without this, the last scene (Dermatology)
      // intercepts every click on every other scene via its always-on pointer events.
      if (rootRef.current) {
        if (p > 0.02 && p < 0.98) rootRef.current.removeAttribute('inert')
        else                       rootRef.current.setAttribute('inert', '')
      }

      if (!qs.current || isMobileRef.current) return
      const drift = p - 0.5  // [-0.5 → +0.5]

      qs.current.bgY(drift * PARALLAX.bg)
      qs.current.visualY(drift * PARALLAX.visual)
      qs.current.visualX(drift * 16)              // slight horizontal drift → 3D depth
      qs.current.textY(drift * PARALLAX.text)
      qs.current.cardY(drift * PARALLAX.card)
    },
  })

  const numLabel = String(index).padStart(2, '0')

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{
        '--dept-accent':    department.accent,
        '--dept-accent-08': `${department.accent}14`,  // 8%
        '--dept-accent-12': `${department.accent}1f`,  // 12%
        '--dept-accent-20': `${department.accent}33`,  // 20%
      } as React.CSSProperties}
      aria-label={`${department.name} Department`}
    >
      {/* Ambient background color wash */}
      <div ref={bgRef} className={styles.bg} aria-hidden="true" />

      <div className={styles.layout}>

        {/* ── LEFT: Visual Department Card (click / tap to navigate) ── */}
        <div
          ref={visualLinkRef}
          className={styles.visualCardLink}
          onClick={() => router.push(deptUrl)}
          onKeyDown={(e) => e.key === 'Enter' && router.push(deptUrl)}
          role="link"
          tabIndex={0}
          aria-label={`View ${department.name} department page`}
        >
          <div ref={visualRef} className={styles.visualCard}>
            {/* Department badge pill — always on top */}
            <div className={styles.visualBadge}>
              <span className={styles.visualNum}>{numLabel}</span>
              <span className={styles.visualDot} aria-hidden="true">·</span>
              <span className={styles.visualDeptName}>{department.name}</span>
            </div>

            {department.image ? (
              /*
                Photo mode — fills the card via next/image fill.
                .visualCard already has position:relative + overflow:hidden
                so the fill works without any extra wrapper.
                The overlay adds a dept-tinted cinematic gradient on top.
              */
              <>
                <Image
                  src={department.image}
                  alt={`${department.name} department`}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={styles.visualPhoto}
                  quality={85}
                  priority={index === 1}
                />
                <div className={styles.visualPhotoOverlay} aria-hidden="true" />
              </>
            ) : (
              /* SVG fallback — shown when no photo is provided */
              <div className={styles.visualSvgWrap}>
                <DepartmentVisual id={department.visual} color={department.accent} image={department.image} />
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Information Card ────────────────────── */}
        <div ref={textColRef} className={styles.infoCard}>

          {/* Text header */}
          <div className={styles.infoHeader}>
            <div ref={labelRef} className={styles.label}>
              <span className={styles.num}>{numLabel}</span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.deptName}>{department.name}</span>
            </div>

            {/* Title is a link on desktop */}
            <Link
              href={`/departments/${department.slug}`}
              className={styles.titleLink}
              tabIndex={-1}
              aria-hidden="true"
            >
              <h2 ref={titleRef} className={styles.title}>
                {department.tagline}
              </h2>
            </Link>

            <div ref={divRef} className={styles.divider} aria-hidden="true" />

            <p ref={descRef} className={styles.desc}>
              {department.description}
            </p>
          </div>

          {/* Doctor entries */}
          <div className={styles.doctorList}>
            {department.doctors.map((doctor, i) => (
              <div
                key={doctor.id}
                ref={(el) => { cardsRef.current[i] = el }}
                className={styles.doctorEntry}
              >
                <DoctorEntry
                  doctor={doctor}
                  departmentName={department.name}
                  accentColor={department.accent}
                />
              </div>
            ))}
          </div>

          {/* Explore button — always visible, uses router.push for reliable navigation */}
          <button
            type="button"
            className={styles.exploreDeptBtn}
            onClick={() => router.push(deptUrl)}
          >
            Explore {department.name}
            <ViewArrow />
          </button>

        </div>
      </div>
    </div>
  )
}

// ── Duration helper ───────────────────────────────────────────
function dur(start: number, end: number): number {
  return end - start
}

// ══════════════════════════════════════════════════════════════
// DoctorEntry — compact inline doctor panel inside the info card.
//
// Replaces the standalone DoctorCard for the new two-card layout.
// Contains all the same data (name, specialty, availability, CTA)
// without the outer card shell (since the info card IS the container).
//
// Motion: the parent div (cardsRef) is animated by GSAP (enter/exit).
// The CTA button uses Framer Motion whileHover/whileTap.
// The BookingModal is a portal — z-index managed globally.
// ══════════════════════════════════════════════════════════════

interface DoctorEntryProps {
  doctor: Doctor
  departmentName: string
  accentColor: string
}

function DoctorEntry({ doctor, departmentName, accentColor }: DoctorEntryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isDaily  = doctor.availableDays.includes('Daily')
  const isOnCall = doctor.availableDays.includes('On Call')

  const cssVars = {
    '--dept-accent': accentColor,
    '--accent':      accentColor,
    '--accent-18':   `${accentColor}2e`,   // 18% opacity
    '--accent-35':   `${accentColor}59`,   // 35% opacity
  } as React.CSSProperties

  return (
    <div style={cssVars}>
      {/* Avatar + name row */}
      <div className={styles.doctorHeader}>
        <div className={styles.doctorAvatarWrap} aria-hidden="true">
          <DoctorInitials name={doctor.name} color={accentColor} />
        </div>
        <div className={styles.doctorMeta}>
          <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
          <h3 className={styles.doctorName}>{doctor.name}</h3>
        </div>
      </div>

      {/* Short description */}
      <p className={styles.doctorDesc}>{doctor.shortDescription}</p>

      {/* Availability */}
      <div className={styles.doctorAvail} aria-label="Consultation hours">
        <span className={styles.availLabel}>Available</span>
        <div className={styles.dayRow}>
          {isOnCall ? (
            <span className={styles.oncall}>On Call</span>
          ) : isDaily ? (
            <span className={styles.badge}>Daily</span>
          ) : (
            doctor.availableDays.map((d) => (
              <span key={d} className={styles.badge}>{DAY_SHORT[d] ?? d}</span>
            ))
          )}
        </div>
        <time className={styles.hours}>{doctor.availableHours}</time>
      </div>

      {/* WhatsApp CTA — plain <button>, no Framer Motion.
          Using motion.button with whileHover causes Framer Motion to
          measure the button's DOM position at mount. When inside a
          GSAP-staggered card that is still mid-animation (x ≠ 0),
          Framer Motion caches a wrong position and the hover hit-zone
          ends up offset from the visual. CSS :hover handles the
          micro-interaction cleanly with zero layout measurement. */}
      <button
        type="button"
        className={styles.doctorCta}
        aria-label={`Book an appointment with ${doctor.name}`}
        onClick={() => setIsModalOpen(true)}
      >
        <WhatsAppIcon />
        <span>Book Appointment</span>
        <ArrowIcon />
      </button>

      {/* Booking modal — rendered in document.body portal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        departmentName={departmentName}
        accentColor={accentColor}
      />
    </div>
  )
}

// ── SVG sub-components ────────────────────────────────────────

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
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.doctorAvatarSvg}
    >
      <circle cx="32" cy="32" r="32" fill={color} fillOpacity="0.10" />
      <circle cx="32" cy="32" r="31" stroke={color} strokeOpacity="0.28" strokeWidth="1" />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="20"
        fontFamily="'Cormorant Garamond', Georgia, 'Times New Roman', serif"
        fontWeight="400"
        fontStyle="italic"
      >
        {initials}
      </text>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={styles.doctorCtaIcon}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.doctorCtaArrow}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function ViewArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}
