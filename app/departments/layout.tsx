/**
 * Departments Layout
 * -------------------------------------------------
 * Shared layout for all /departments/* pages.
 *
 * The root layout already provides:
 *  - Navbar (fixed)
 *  - SmoothScrollProvider (Lenis smooth scroll — still active)
 *  - Grain + vignette overlays
 *  - ScrollProgress (hidden on these pages via usePathname check)
 *
 * This layout adds a stable page wrapper with top padding to
 * account for the fixed Navbar.
 */

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dept-layout">
      {children}
    </div>
  )
}
