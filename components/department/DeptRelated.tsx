'use client'

/**
 * DeptRelated — "Explore our other departments" section.
 * Shows up to 3 related department cards with navigation links.
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { DepartmentVisual } from '@/components/ui/DepartmentVisual'
import type { Department } from '@/lib/hospital/data'
import styles from './DeptRelated.module.css'

const EASE = [0.16, 1, 0.3, 1] as const

interface DeptRelatedProps {
  departments: Department[]
}

export function DeptRelated({ departments }: DeptRelatedProps) {
  if (departments.length === 0) return null

  return (
    <section
      className={styles.section}
      aria-labelledby="related-heading"
    >
      <div className={styles.inner}>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className={styles.eyebrow}>Explore more</p>
          <h2 id="related-heading" className={styles.title}>
            Other Departments
          </h2>
          <div className={styles.divider} aria-hidden="true" />
        </motion.div>

        {/* Department cards */}
        <div className={styles.grid}>
          {departments.map((dept, i) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            >
              <RelatedCard department={dept} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

function RelatedCard({ department }: { department: Department }) {
  const { name, tagline, accent, visual, slug } = department

  return (
    <Link
      href={`/departments/${slug}`}
      className={styles.card}
      style={{
        '--dept-accent':    accent,
        '--dept-accent-08': `${accent}14`,
      } as React.CSSProperties}
      aria-label={`Visit ${name} department`}
    >
      {/* Mini visual */}
      <div className={styles.cardVisual}>
        <div className={styles.cardDotGrid} aria-hidden="true" />
        <div className={styles.cardSvg} aria-hidden="true">
          <DepartmentVisual id={visual} color={accent} />
        </div>
      </div>

      {/* Text */}
      <div className={styles.cardBody}>
        <p className={styles.cardName}>{name}</p>
        <p className={styles.cardTagline}>{tagline}</p>
        <span className={styles.cardCta} aria-hidden="true">
          View Department <ArrowRight size={12} strokeWidth={1.8} />
        </span>
      </div>
    </Link>
  )
}
