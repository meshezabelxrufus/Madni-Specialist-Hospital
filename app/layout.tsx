/**
 * Root Layout
 * -------------------------------------------------
 * Server Component — only runs on the server.
 *
 * Responsibilities:
 *  - Sets <html> and <body> with correct attributes
 *  - Injects Google Fonts via Next.js font optimization
 *  - Wraps children with SmoothScrollProvider (Client Component)
 *  - Renders fixed UI: Navbar + ScrollProgress
 *
 * IMPORTANT:
 *  SmoothScrollProvider must wrap at this level so Lenis
 *  and GSAP are initialized ONCE for the entire app.
 *  Never initialize them inside individual page components.
 */

import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { StagewiseToolbar } from '@/components/dev/StagewiseToolbar'
import './globals.css'

/* ----------------------------------------------------------
   FONTS — Next.js font optimization (self-hosted, no FOUT)
   ---------------------------------------------------------- */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

/* ----------------------------------------------------------
   SEO METADATA
   ---------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL('https://madnihospital.com'),
  title: {
    default: 'Madni Specialist Hospital & Trauma Centre',
    template: '%s | Madni Specialist Hospital',
  },
  description:
    'Madni Specialist Hospital & Trauma Centre in Jalalpur Jattan offers expert care in Pediatrics, Surgery, ENT, Orthopedics, Gynecology, Dermatology and Cardiology. Book your appointment instantly via WhatsApp.',
  keywords: [
    'Madni Specialist Hospital',
    'Madni Trauma Centre',
    'Jalalpur Jattan hospital',
    'Gujrat hospital',
    'pediatrics',
    'cardiology',
    'ENT specialist',
    'orthopedics',
    'gynecology',
    'dermatology',
    'WhatsApp appointment',
    'trauma centre Punjab',
  ],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Madni Specialist Hospital & Trauma Centre',
    title: 'Madni Specialist Hospital & Trauma Centre',
    description: 'Expert specialist care in Jalalpur Jattan. Book your appointment instantly via WhatsApp.',
    images: [{ url: '/favicon.png', width: 512, height: 512, alt: 'Madni Specialist Hospital' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080c10',
}

/* ----------------------------------------------------------
   ROOT LAYOUT
   ---------------------------------------------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Cinematic overlays — fixed, pointer-events:none, z:9997+ */}
        <div className="grain"   aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        {/*
          SmoothScrollProvider is a Client Component.
          It initializes Lenis + GSAP once for the entire app.
          Everything inside has access to useSmoothScroll() hook.
        */}
        <SmoothScrollProvider>
          {/* Dev toolbar — no-op in production */}
          <StagewiseToolbar />

          {/* Fixed UI — rendered outside page content flow */}
          <Navbar />
          <ScrollProgress />

          {/* Page content */}
          <main id="main-content" role="main">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
