'use client'

/**
 * DeptHero — Department page hero section.
 * Full-viewport hero with the department visual, tagline, overview,
 * and a back-to-home navigation link.
 *
 * Framer Motion handles the entrance animation via viewport triggers.
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { DepartmentVisual } from '@/components/ui/DepartmentVisual'
import type { DepartmentWithDoctors } from '@/lib/hospital/data'
import styles from './DeptHero.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

interface DeptHeroProps {
  department: DepartmentWithDoctors
}

export function DeptHero({ department }: DeptHeroProps) {
  const { name, tagline, overview, accent, visual } = department

  return (
    <section
      className={styles.hero}
      style={{ '--dept-accent': accent } as React.CSSProperties}
      aria-label={`${name} Department Hero`}
    >
      {/* Ambient gradient wash */}
      <div className={styles.heroBg} aria-hidden="true" />

      <div className={styles.heroInner}>

        {/* ── Left column: text ────────────────────── */}
        <div className={styles.textCol}>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={14} strokeWidth={1.8} />
              Back to Home
            </Link>
          </motion.div>

          {/* Dept badge */}
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          >
            {name}
          </motion.div>

          {/* Tagline */}
          <motion.h1
            className={styles.tagline}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
          >
            {tagline}
          </motion.h1>

          {/* Overview */}
          <motion.p
            className={styles.overview}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: EASE }}
          >
            {overview}
          </motion.p>

          {/* CTA scroll hint */}
          <motion.div
            className={styles.scrollHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className={styles.scrollLine} aria-hidden="true" />
            <span>Scroll to explore</span>
          </motion.div>

        </div>

        {/* ── Right column: visual card ─────────────── */}
        <motion.div
          className={styles.visualCol}
          initial={{ opacity: 0, x: 56, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.14, ease: EASE }}
        >
          <div className={styles.visualCard}>
            {/* Dot-grid texture */}
            <div className={styles.visualDotGrid} aria-hidden="true" />

            {/* Dept accent left bar */}
            <div className={styles.visualAccentBar} aria-hidden="true" />

            {/* SVG illustration */}
            <div className={styles.visualSvg}>
              <DepartmentVisual id={visual} color={accent} />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
