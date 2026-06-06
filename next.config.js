/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Needed to allow GSP to import cleanly in Server Components
  // We opt out server-side for gsap and lenis since they need browser APIs
  experimental: {
    optimizePackageImports: ['gsap', 'framer-motion', 'lucide-react'],
  },

  images: {
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
