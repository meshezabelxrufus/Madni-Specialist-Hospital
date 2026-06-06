/**
 * Home Page — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * Delegates to ClientPage which detects mobile/desktop
 * after hydration and renders the correct layout:
 *
 *   Desktop: Full cinematic ScrollStage with GSAP
 *   Mobile:  Lightweight MobilePage with IntersectionObserver
 */

import { ClientPage } from './ClientPage'

export default function HomePage() {
  return <ClientPage />
}
