'use client'

/**
 * Navbar
 * -------------------------------------------------
 * Fixed, scroll-reactive navigation bar.
 *
 * Desktop (≥ 769px):
 *   All nav links visible inline + Book Appointment CTA
 *
 * Mobile (≤ 768px):
 *   Logo + hamburger button only.
 *   Tapping hamburger opens a full-screen slide-down drawer
 *   with all departments + About + Book Appointment.
 *   Drawer closes on link tap or outside tap.
 */

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Stethoscope, Bone, Scissors, Brain, Baby, Activity, Sparkles } from 'lucide-react'
import { navbarVariants, navLinkVariants } from '@/lib/animation/motionVariants'
import { ScrollTrigger } from '@/lib/animation/gsap.config'
import { useSmoothScroll } from './SmoothScrollProvider'
import { buildGeneralBookingUrl } from '@/lib/hospital/whatsapp'
import styles from './Navbar.module.css'

/**
 * Desktop nav items — vhStart values match scenes.config.ts scroll positions.
 * Lenis scrollTo(pixels) navigates to the correct scene on the sticky canvas.
 */
const NAV_ITEMS = [
  { id: 'pediatrics',  label: 'Pediatrics',   icon: Baby,       vhStart: 280,  slug: 'pediatrics'   },
  { id: 'surgery',     label: 'Surgery',      icon: Scissors,   vhStart: 400,  slug: 'general-surgery' },
  { id: 'ent',         label: 'ENT',          icon: Stethoscope,vhStart: 620,  slug: 'ent'           },
  { id: 'orthopedics', label: 'Orthopedics',  icon: Bone,       vhStart: 840,  slug: 'orthopedics'   },
  { id: 'gynecology',  label: 'Gynecology',   icon: Heart,      vhStart: 1060, slug: 'gynecology'    },
  { id: 'dermatology', label: 'Dermatology',  icon: Sparkles,   vhStart: 1280, slug: 'dermatology'   },
  { id: 'cardiology',  label: 'Cardiology',   icon: Activity,   vhStart: 1500, slug: 'cardiology'    },
]

export function Navbar() {
  const { scrollTo } = useSmoothScroll()
  const pathname      = usePathname()
  const [isScrolled, setIsScrolled]     = useState(false)
  const [menuOpen,   setMenuOpen]       = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const isSolid = isScrolled || pathname !== '/'

  // Frosted-glass transition at 80px scroll
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 80,
      onEnter:     () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    })
    return () => trigger.kill()
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close drawer on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (vhStart: number) => {
    scrollTo((vhStart / 100) * window.innerHeight, { duration: 1.6 })
    setMenuOpen(false)
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      scrollTo(0, { duration: 1.6 })
    }
    setMenuOpen(false)
  }

  const handleBooking = () => {
    window.open(buildGeneralBookingUrl(), '_blank', 'noopener,noreferrer')
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        className={styles.navbar}
        variants={navbarVariants}
        animate={isSolid ? 'solid' : 'transparent'}
        initial="transparent"
      >
        <div className={styles.inner}>

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            href="/"
            className={styles.logo}
            onClick={handleLogoClick}
            aria-label="Go to home page"
          >
            <span className={styles.logoMark}>
              <MedicalCrossIcon />
            </span>
            <span className={styles.logoName}>
              <span className={styles.logoText}>Madni</span>
              <span className={styles.logoSub}>Specialist Hospital &amp; Trauma Centre</span>
            </span>
          </Link>

          {/* ── Desktop: nav links + CTA ──────────────────────── */}
          <div className={styles.right}>
            <nav aria-label="Main navigation" className={styles.desktopNav}>
              <ul className={styles.navList}>
                {NAV_ITEMS.map(({ id, label, icon: Icon, vhStart }) => (
                  <li key={id}>
                    <motion.button
                      className={styles.navLink}
                      variants={navLinkVariants}
                      initial="rest"
                      whileHover="hover"
                      onClick={() => handleNavClick(vhStart)}
                    >
                      <Icon size={13} className={styles.navIcon} aria-hidden />
                      <span>{label}</span>
                    </motion.button>
                  </li>
                ))}
                <li>
                  <Link
                    href="/about"
                    className={styles.navLink}
                    data-active={pathname === '/about' ? 'true' : undefined}
                    aria-current={pathname === '/about' ? 'page' : undefined}
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>

            <button
              className={styles.bookBtn}
              onClick={handleBooking}
              aria-label="Book an appointment via WhatsApp"
            >
              <WhatsAppIcon />
              <span className={styles.bookBtnText}>Book Appointment</span>
            </button>

            {/* ── Mobile: hamburger toggle ────────────────────── */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
            >
              <span className={`${styles.hamburgerLine} ${menuOpen ? styles.lineTop : ''}`} />
              <span className={`${styles.hamburgerLine} ${menuOpen ? styles.lineMid : ''}`} />
              <span className={`${styles.hamburgerLine} ${menuOpen ? styles.lineBot : ''}`} />
            </button>
          </div>

        </div>
      </motion.header>

      {/* ── Mobile drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-drawer"
            ref={drawerRef}
            className={styles.drawer}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Departments */}
            <p className={styles.drawerSection}>Departments</p>
            <nav>
              <ul className={styles.drawerList}>
                {NAV_ITEMS.map(({ id, label, icon: Icon, vhStart, slug }) => (
                  <li key={id}>
                    {/* On home page: scroll to scene. On other pages: navigate to dept page */}
                    {pathname === '/' ? (
                      <button
                        className={styles.drawerLink}
                        onClick={() => handleNavClick(vhStart)}
                      >
                        <span className={styles.drawerIcon}><Icon size={16} /></span>
                        <span>{label}</span>
                      </button>
                    ) : (
                      <Link
                        href={`/departments/${slug}`}
                        className={styles.drawerLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={styles.drawerIcon}><Icon size={16} /></span>
                        <span>{label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.drawerDivider} />

            {/* About */}
            <Link
              href="/about"
              className={styles.drawerLink}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === '/about' ? 'page' : undefined}
            >
              About Us
            </Link>

            <div className={styles.drawerDivider} />

            {/* Book CTA */}
            <button
              className={styles.drawerBookBtn}
              onClick={handleBooking}
              aria-label="Book an appointment via WhatsApp"
            >
              <WhatsAppIcon />
              <span>Book an Appointment</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── SVG helpers ────────────────────────────────────────────────

function MedicalCrossIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 8h-4V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4h4a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
