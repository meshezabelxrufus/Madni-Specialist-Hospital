'use client'

/**
 * DeptServices — Services grid for a department page.
 * Uses Framer Motion viewport animations for smooth entrance.
 * Icons are resolved from a Lucide icon map keyed by string name.
 */

import { motion } from 'framer-motion'
import {
  Activity, AlertCircle, Bone, Calendar, ClipboardCheck,
  Droplets, Dumbbell, Ear, Flower2, Gauge, Heart,
  Leaf, Mic2, RefreshCcw, Scissors, Search, Shield,
  Sparkles, Star, Stethoscope, Thermometer, TrendingUp,
  Users, Wand2, Wind, Zap,
  type LucideIcon,
} from 'lucide-react'
import type { Service } from '@/lib/hospital/data'
import styles from './DeptServices.module.css'

// ── Icon registry ─────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Activity, AlertCircle, Bone, Calendar, ClipboardCheck,
  Droplets, Dumbbell, Ear, Flower2, Gauge, Heart,
  Leaf, Mic2, RefreshCcw, Scissors, Search, Shield,
  Sparkles, Star, Stethoscope, Thermometer, TrendingUp,
  Users, Wand2, Wind, Zap,
}

// ── Animation variants ────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

// ── Component ─────────────────────────────────────────────────

interface DeptServicesProps {
  services: Service[]
  accent:   string
}

export function DeptServices({ services, accent }: DeptServicesProps) {
  return (
    <section
      className={styles.section}
      style={{ '--dept-accent': accent } as React.CSSProperties}
      aria-labelledby="services-heading"
    >
      <div className={styles.inner}>

        {/* Section header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className={styles.eyebrow}>What we offer</p>
          <h2 id="services-heading" className={styles.title}>Our Services</h2>
          <div className={styles.divider} aria-hidden="true" />
        </motion.div>

        {/* Services grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? Stethoscope
            return (
              <motion.div
                key={service.id}
                className={styles.card}
                variants={cardVariants}
              >
                {/* Icon */}
                <div className={styles.iconWrap} aria-hidden="true">
                  <Icon size={20} strokeWidth={1.6} />
                </div>

                {/* Text */}
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
