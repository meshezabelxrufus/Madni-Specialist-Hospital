/**
 * Framer Motion Shared Variants
 * -------------------------------------------------
 * ALL motion variants live here. Import them into
 * Client Components — never use inline variants.
 *
 * RULES:
 *  - Only animate: transform, opacity, filter
 *  - No layout-shifting props (width, height, top, left)
 *  - Use Framer Motion ONLY for micro-interactions,
 *    NOT for scroll-driven animations (use GSAP for those)
 */

import type { Variants } from 'framer-motion'

/* ----------------------------------------------------------
   DOCTOR CARD
   ---------------------------------------------------------- */
export const cardVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  hover: {
    scale: 1.02,
    y: -10,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

export const cardGlowVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
}

export const cardImageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

/* ----------------------------------------------------------
   WHATSAPP BUTTON
   ---------------------------------------------------------- */
export const whatsappBtnVariants: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 0 0px rgba(37, 211, 102, 0)',
  },
  hover: {
    scale: 1.06,
    boxShadow: '0 0 30px rgba(37, 211, 102, 0.45)',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  tap: {
    scale: 0.96,
    transition: { duration: 0.1, ease: 'easeIn' },
  },
}

export const whatsappIconVariants: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: -8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

/* ----------------------------------------------------------
   MODAL
   ---------------------------------------------------------- */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 16,
    transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] },
  },
}

export const modalChildVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

/* ----------------------------------------------------------
   NAVBAR
   ---------------------------------------------------------- */
export const navbarVariants: Variants = {
  transparent: {
    backgroundColor: 'rgba(217, 249, 255, 0)',
    backdropFilter: 'blur(0px) saturate(100%)',
    borderBottomColor: 'rgba(159, 161, 255, 0)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  solid: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(28px) saturate(160%)',
    borderBottomColor: 'rgba(159, 161, 255, 0.18)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const navLinkVariants: Variants = {
  rest: { opacity: 0.65, y: 0 },
  hover: {
    opacity: 1,
    y: -1.5,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ----------------------------------------------------------
   SERVICE BADGE
   ---------------------------------------------------------- */
export const badgeVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

/* ----------------------------------------------------------
   GENERIC FADE UP
   ---------------------------------------------------------- */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

/* ----------------------------------------------------------
   SCROLL PROGRESS INDICATOR
   ---------------------------------------------------------- */
export const progressDotVariants: Variants = {
  inactive: { scale: 1, opacity: 0.3 },
  active: {
    scale: 1.4,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}
