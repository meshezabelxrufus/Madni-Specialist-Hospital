/**
 * DepartmentVisual — real photo or SVG illustration per department.
 *
 * PHOTO MODE (when `image` prop is set):
 *   - next/image with fill + object-fit:cover, 4:3 card
 *   - Layer 0: photo — slight desaturation idle, full colour on hover
 *   - Layer 1: dept-accent tint gradient overlay (bottom) + vignette (top-left)
 *   - Layer 2: badge pill (handled by parent, z-index:2 already set)
 *   Falls back to SVG if image fails to load.
 *
 * SVG MODE (when `image` is absent / empty):
 *   Premium medical illustration, viewBox 320 × 240 (4:3).
 *   Each SVG uses anatomical lines + dept accent color.
 */

import React from 'react'
import Image from 'next/image'
import type { DepartmentVisualId } from '@/lib/hospital/data'

interface DepartmentVisualProps {
  id: DepartmentVisualId
  color: string
  /** Path relative to /public — e.g. '/departments/cardiology.jpg'.
   *  When set, photo renders instead of SVG. */
  image?: string
  className?: string
}

export function DepartmentVisual({ id, color, image, className }: DepartmentVisualProps) {
  const c = color  // dept accent color

  // ── PHOTO MODE ────────────────────────────────────────────────
  // Renders when a real department photo is available.
  // The parent .visualCard already has position:relative + overflow:hidden
  // so Image with fill works out of the box.
  if (image) {
    return (
      <>
        {/* Photo — fills the entire card, slight desaturation on idle */}
        <Image
          src={image}
          alt={`${id} department`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'saturate(0.75) brightness(0.95)',
            transition: 'filter 0.4s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.filter = 'saturate(1) brightness(1)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.75) brightness(0.95)'
          }}
          priority={false}
        />

        {/* Layer 1a — dept accent tint rising from the bottom */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: `linear-gradient(
              to top,
              ${color}55 0%,
              ${color}22 35%,
              transparent 65%
            )`,
            pointerEvents: 'none',
          }}
        />

        {/* Layer 1b — dark vignette top-left (depth / premium feel) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,0,0,0.28) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      </>
    )
  }

  // ── SVG MODE ──────────────────────────────────────────────────
  // Falls back to SVG illustration when no photo is provided.

  const visuals: Record<DepartmentVisualId, React.ReactElement> = {

    // ─────────────────────────────────────────────────────────
    // CARDIOLOGY — Heart anatomy + ECG waveform
    // ─────────────────────────────────────────────────────────
    cardiology: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Outer glow circle */}
        <circle cx="160" cy="115" r="90" fill={c} fillOpacity="0.04" />

        {/* Large heart — main shape */}
        <path
          d="M160 200
             C110 170 40 145 40 95
             C40 62 65 42 92 42
             C112 42 132 54 160 74
             C188 54 208 42 228 42
             C255 42 280 62 280 95
             C280 145 210 170 160 200Z"
          stroke={c}
          strokeWidth="2"
          strokeLinejoin="round"
          fill={c}
          fillOpacity="0.06"
        />

        {/* Inner heart highlight */}
        <path
          d="M160 175
             C125 155 72 135 72 100
             C72 80 86 66 105 66
             C120 66 135 76 160 94
             C185 76 200 66 215 66
             C234 66 248 80 248 100
             C248 135 195 155 160 175Z"
          stroke={c}
          strokeWidth="1"
          strokeLinejoin="round"
          fill={c}
          fillOpacity="0.04"
          opacity="0.6"
        />

        {/* Aortic arch — top of heart */}
        <path d="M138 68 C138 42 152 32 160 28 C168 32 182 42 182 68" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        {/* Left pulmonary artery */}
        <path d="M140 56 L112 44 L112 36" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4" />
        {/* Right pulmonary artery */}
        <path d="M180 56 L208 44 L208 36" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Coronary arteries */}
        <path d="M148 88 C136 100 128 120 130 145" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
        <path d="M172 88 C184 100 192 120 190 145" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />

        {/* ECG waveform — runs through lower third */}
        <polyline
          points="20,195 50,195 65,168 78,222 90,180 100,200 108,195 122,195 136,155 152,235 164,175 174,195 188,195 200,195"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        {/* ECG line extension */}
        <line x1="200" y1="195" x2="300" y2="195" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <line x1="20" y1="195" x2="20" y2="195" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5" />

        {/* Small pulse dot */}
        <circle cx="160" cy="175" r="3.5" fill={c} fillOpacity="0.7" />
      </svg>
    ),

    // ─────────────────────────────────────────────────────────
    // ENT — Ear anatomy + sound wave rings
    // ─────────────────────────────────────────────────────────
    ent: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Outer glow */}
        <circle cx="160" cy="120" r="88" fill={c} fillOpacity="0.04" />

        {/* Sound wave rings — emanating from right */}
        <path d="M232 120 Q248 100 248 120 Q248 140 232 120" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25" />
        <path d="M232 120 Q262 90 262 120 Q262 150 232 120" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.20" />
        <path d="M232 120 Q278 78 278 120 Q278 162 232 120" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.15" />
        <path d="M232 120 Q296 64 296 120 Q296 176 232 120" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.10" />

        {/* Main ear outline — detailed helix */}
        <path
          d="M160 58
             C132 58 108 76 108 104
             C108 122 118 136 128 144
             C136 151 140 158 138 168
             C136 178 130 182 128 182
             C120 182 116 176 116 168
             C116 158 122 152 122 145"
          stroke={c}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M160 58
             C182 58 202 72 202 96
             C202 116 190 128 180 134
             C170 140 165 148 166 162
             C167 172 172 180 172 188"
          stroke={c}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Anti-helix */}
        <path
          d="M148 72 C136 80 128 96 130 114 C132 128 142 136 150 140"
          stroke={c}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Tragus */}
        <path d="M122 128 C118 132 118 140 122 144" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Ear canal entrance */}
        <ellipse cx="148" cy="132" rx="10" ry="14" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.06" />
        <ellipse cx="148" cy="132" rx="5" ry="8" stroke={c} strokeWidth="1" fill={c} fillOpacity="0.10" opacity="0.7" />

        {/* Eardrum cross-section (deeper, smaller, more interior) */}
        <ellipse cx="96" cy="132" rx="8" ry="12" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.08" opacity="0.5" />

        {/* Ear canal tube */}
        <path d="M138 126 L104 128" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <path d="M138 138 L104 136" stroke={c} strokeWidth="1" strokeLinecap="round" opacity="0.4" />

        {/* Lobe */}
        <path
          d="M128 182 C128 196 138 204 148 204 C158 204 166 196 166 184 C166 180 165 176 163 174"
          stroke={c}
          strokeWidth="2"
          strokeLinecap="round"
          fill={c}
          fillOpacity="0.04"
        />

        {/* Concentric resonance circles — subtle, centred on canal */}
        <circle cx="148" cy="132" r="20" stroke={c} strokeWidth="0.8" opacity="0.15" />
        <circle cx="148" cy="132" r="30" stroke={c} strokeWidth="0.8" opacity="0.10" />
      </svg>
    ),

    // ─────────────────────────────────────────────────────────
    // ORTHOPEDICS — Knee joint cross-section
    // ─────────────────────────────────────────────────────────
    orthopedics: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Background circle */}
        <circle cx="160" cy="120" r="88" fill={c} fillOpacity="0.04" />

        {/* FEMUR — upper bone */}
        {/* Shaft */}
        <rect x="140" y="20" width="40" height="85" rx="8" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.05" />
        {/* Medullary canal (hollow interior) */}
        <rect x="150" y="30" width="20" height="65" rx="4" stroke={c} strokeWidth="1" fill={c} fillOpacity="0.04" opacity="0.5" />
        {/* Distal epiphysis — condyles */}
        <ellipse cx="148" cy="108" rx="20" ry="14" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.07" />
        <ellipse cx="172" cy="108" rx="20" ry="14" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.07" />
        {/* Inter-condylar notch */}
        <path d="M155 108 Q160 118 165 108" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Articular cartilage — femoral */}
        <path d="M128 116 Q148 124 160 124 Q172 124 192 116" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />

        {/* Meniscus — medial + lateral */}
        <path d="M130 132 Q148 126 160 126 Q172 126 190 132" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Meniscus fill hint */}
        <path d="M130 132 Q148 136 160 136 Q172 136 190 132" stroke={c} strokeWidth="1" strokeLinecap="round" fill={c} fillOpacity="0.08" opacity="0.6" />

        {/* Cruciate ligaments */}
        <line x1="152" y1="124" x2="168" y2="146" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
        <line x1="168" y1="124" x2="152" y2="146" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />

        {/* TIBIA — lower bone */}
        {/* Proximal plateau */}
        <path d="M126 148 Q160 140 194 148 L194 165 Q160 158 126 165 Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.07" />
        {/* Tibial shaft */}
        <rect x="143" y="165" width="34" height="62" rx="6" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.05" />
        {/* Medullary canal */}
        <rect x="151" y="174" width="18" height="44" rx="3" stroke={c} strokeWidth="1" fill={c} fillOpacity="0.04" opacity="0.5" />

        {/* Patella */}
        <ellipse cx="110" cy="130" rx="14" ry="18" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.08" />
        {/* Patellar tendon */}
        <path d="M110 148 L130 165" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Quadriceps tendon */}
        <path d="M110 112 L126 108" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.5" />

        {/* Lateral collateral region */}
        <path d="M193 112 L210 108 L210 148 L193 150" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.3" />

        {/* Measurement tick marks — precision medical feel */}
        <line x1="220" y1="20"  x2="226" y2="20"  stroke={c} strokeWidth="1" opacity="0.25" />
        <line x1="220" y1="108" x2="226" y2="108" stroke={c} strokeWidth="1" opacity="0.25" />
        <line x1="220" y1="148" x2="226" y2="148" stroke={c} strokeWidth="1" opacity="0.25" />
        <line x1="220" y1="228" x2="226" y2="228" stroke={c} strokeWidth="1" opacity="0.25" />
        <line x1="223" y1="20"  x2="223" y2="228" stroke={c} strokeWidth="0.8" opacity="0.15" />
      </svg>
    ),

    // ─────────────────────────────────────────────────────────
    // PEDIATRICS — Child figure with health motifs
    // ─────────────────────────────────────────────────────────
    pediatrics: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Warm background glow */}
        <circle cx="160" cy="120" r="88" fill={c} fillOpacity="0.05" />

        {/* Growth chart grid — background */}
        {[0,1,2,3,4].map((i) => (
          <line key={`h${i}`} x1="40" y1={60 + i * 36} x2="280" y2={60 + i * 36} stroke={c} strokeWidth="0.7" opacity="0.08" />
        ))}
        {[0,1,2,3,4,5].map((i) => (
          <line key={`v${i}`} x1={40 + i * 48} y1="60" x2={40 + i * 48} y2="204" stroke={c} strokeWidth="0.7" opacity="0.08" />
        ))}
        {/* Growth curve */}
        <path d="M46 196 C80 188 110 165 140 140 C170 115 200 88 274 66" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25" />

        {/* Child — head */}
        <circle cx="160" cy="74" r="26" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.07" />
        {/* Hair tuft */}
        <path d="M148 52 Q153 44 158 50 Q163 42 168 50 Q173 44 176 52" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Face */}
        <circle cx="152" cy="72" r="2.5" fill={c} fillOpacity="0.6" />
        <circle cx="168" cy="72" r="2.5" fill={c} fillOpacity="0.6" />
        <path d="M152 82 Q160 88 168 82" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Body */}
        <path d="M140 100 L140 158 Q160 162 180 158 L180 100 Q162 94 140 100Z" stroke={c} strokeWidth="2" fill={c} fillOpacity="0.07" />

        {/* Heart on chest */}
        <path d="M155 118 C152 114 146 116 146 122 C146 127 155 134 155 134 C155 134 164 127 164 122 C164 116 158 114 155 118Z" fill={c} fillOpacity="0.55" stroke={c} strokeWidth="0.8" />

        {/* Arms — outstretched, welcoming */}
        <path d="M140 108 L108 92 L100 86" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M180 108 L212 92 L220 86" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        {/* Hands */}
        <circle cx="100" cy="86" r="5" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.10" />
        <circle cx="220" cy="86" r="5" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.10" />

        {/* Legs */}
        <path d="M148 158 L142 200" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M172 158 L178 200" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        {/* Feet */}
        <path d="M135 200 L149 200 L144 208" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M185 200 L171 200 L176 208" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Stethoscope suggestion */}
        <path d="M220 86 L228 94 Q232 104 228 112 Q224 120 216 118" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        <circle cx="214" cy="120" r="4" stroke={c} strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* Sparkle stars — pediatric warmth */}
        {/* Star 1 */}
        <path d="M72 84 L74 78 L76 84 L82 84 L77 88 L79 94 L74 90 L69 94 L71 88 L66 84Z" fill={c} fillOpacity="0.22" stroke={c} strokeWidth="0.5" />
        {/* Star 2 — smaller */}
        <path d="M252 72 L253.5 67 L255 72 L260 72 L256 75 L257.5 80 L253.5 77 L249.5 80 L251 75 L247 72Z" fill={c} fillOpacity="0.18" stroke={c} strokeWidth="0.5" />
        {/* Star 3 — tiny */}
        <path d="M88 172 L89 169 L90 172 L93 172 L91 174 L92 177 L89 175 L86 177 L87 174 L85 172Z" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="0.4" />
        <path d="M240 160 L241 157 L242 160 L245 160 L243 162 L244 165 L241 163 L238 165 L239 162 L237 160Z" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="0.4" />
      </svg>
    ),

    // ─────────────────────────────────────────────────────────
    // SURGERY — Surgical precision + instruments
    // ─────────────────────────────────────────────────────────
    surgery: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Background glow */}
        <circle cx="160" cy="120" r="88" fill={c} fillOpacity="0.04" />

        {/* Surgical field — precision targeting reticle */}
        <circle cx="160" cy="120" r="72" stroke={c} strokeWidth="1" opacity="0.15" />
        <circle cx="160" cy="120" r="50" stroke={c} strokeWidth="1.2" opacity="0.20" />
        <circle cx="160" cy="120" r="28" stroke={c} strokeWidth="1.5" opacity="0.30" />
        <circle cx="160" cy="120" r="10" stroke={c} strokeWidth="2"   opacity="0.50" />

        {/* Crosshair lines */}
        <line x1="160" y1="32" x2="160" y2="82" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
        <line x1="160" y1="158" x2="160" y2="208" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
        <line x1="70" y1="120" x2="120" y2="120" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
        <line x1="200" y1="120" x2="250" y2="120" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

        {/* Tick marks on reticle */}
        <line x1="160" y1="68" x2="160" y2="75" stroke={c} strokeWidth="1.5" opacity="0.35" />
        <line x1="160" y1="165" x2="160" y2="172" stroke={c} strokeWidth="1.5" opacity="0.35" />
        <line x1="83" y1="120" x2="90" y2="120" stroke={c} strokeWidth="1.5" opacity="0.35" />
        <line x1="230" y1="120" x2="237" y2="120" stroke={c} strokeWidth="1.5" opacity="0.35" />

        {/* Scalpel — upper right */}
        <g opacity="0.85">
          {/* Handle */}
          <rect x="212" y="46" width="8" height="44" rx="3" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.06" transform="rotate(45 216 68)" />
          {/* Blade */}
          <path d="M228 32 L252 28 L258 52 L234 60 Z" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.10" />
          {/* Cutting edge */}
          <path d="M258 52 L234 60" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          {/* Blade line detail */}
          <line x1="240" y1="44" x2="252" y2="40" stroke={c} strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* Needle holder — lower left */}
        <g opacity="0.70">
          <line x1="68" y1="200" x2="112" y2="156" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
          {/* Jaws */}
          <path d="M112 156 L120 148 L116 158" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M112 156 L104 148 L108 158" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Ratchet ridges on handle */}
          <line x1="80" y1="188" x2="76" y2="192" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="84" y1="184" x2="80" y2="188" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="88" y1="180" x2="84" y2="184" stroke={c} strokeWidth="1" opacity="0.5" />
        </g>

        {/* Surgical suture path */}
        <path d="M130 142 C126 150 118 158 106 162" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35" strokeDasharray="4 3" />

        {/* Centre dot */}
        <circle cx="160" cy="120" r="3.5" fill={c} fillOpacity="0.75" />
        <circle cx="160" cy="120" r="6.5" stroke={c} strokeWidth="1" fill="none" opacity="0.4" />

        {/* DNA / helix hint — subtle, upper left */}
        <path d="M58 56 Q64 66 70 56 Q76 46 82 56 Q88 66 94 56" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.30" />
        <path d="M58 68 Q64 58 70 68 Q76 78 82 68 Q88 58 94 68" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.30" />
        <line x1="64" y1="59" x2="64" y2="65" stroke={c} strokeWidth="0.8" opacity="0.25" />
        <line x1="76" y1="52" x2="76" y2="72" stroke={c} strokeWidth="0.8" opacity="0.25" />
        <line x1="88" y1="59" x2="88" y2="65" stroke={c} strokeWidth="0.8" opacity="0.25" />
      </svg>
    ),

    // ─────────────────────────────────────────────────────────
    // GYNECOLOGY — Lotus + women's health motifs
    // ─────────────────────────────────────────────────────────
    gynecology: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Soft background glow */}
        <circle cx="160" cy="110" r="88" fill={c} fillOpacity="0.05" />

        {/* Outer lotus petals — layer 3 (furthest back) */}
        <path d="M160 170 C120 160 76 140 72 100 C68 72 90 52 116 56 C135 58 148 74 160 90 C172 74 185 58 204 56 C230 52 252 72 248 100 C244 140 200 160 160 170Z"
          stroke={c} strokeWidth="1" strokeLinejoin="round" fill={c} fillOpacity="0.04" opacity="0.50" />

        {/* Middle lotus petals — layer 2 */}
        <path d="M160 165 C128 152 90 130 88 100 C86 76 104 62 124 64 C140 66 152 80 160 96 C168 80 180 66 196 64 C216 62 234 76 232 100 C230 130 192 152 160 165Z"
          stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill={c} fillOpacity="0.06" opacity="0.70" />

        {/* Inner lotus petals — layer 1 (closest) */}
        <path d="M160 158 C138 146 110 124 110 102 C110 84 124 72 140 74 C150 76 157 86 160 96 C163 86 170 76 180 74 C196 72 210 84 210 102 C210 124 182 146 160 158Z"
          stroke={c} strokeWidth="2" strokeLinejoin="round" fill={c} fillOpacity="0.08" />

        {/* Center petal / bud */}
        <path d="M160 148 C150 138 142 122 144 108 C146 96 153 88 160 86 C167 88 174 96 176 108 C178 122 170 138 160 148Z"
          stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.12" />

        {/* Stamen dots */}
        <circle cx="160" cy="104" r="4" fill={c} fillOpacity="0.65" />
        <circle cx="152" cy="112" r="2.5" fill={c} fillOpacity="0.40" />
        <circle cx="168" cy="112" r="2.5" fill={c} fillOpacity="0.40" />
        <circle cx="156" cy="120" r="2" fill={c} fillOpacity="0.30" />
        <circle cx="164" cy="120" r="2" fill={c} fillOpacity="0.30" />

        {/* Stem */}
        <line x1="160" y1="168" x2="160" y2="210" stroke={c} strokeWidth="2" strokeLinecap="round" />
        {/* Left leaf */}
        <path d="M160 195 Q138 185 130 170 Q142 176 160 195Z" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.10" />
        {/* Right leaf */}
        <path d="M160 188 Q182 178 190 163 Q178 169 160 188Z" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.10" />

        {/* Venus symbol — subtle, upper area */}
        <circle cx="160" cy="38" r="14" stroke={c} strokeWidth="1.5" fill="none" opacity="0.35" />
        <line x1="160" y1="52" x2="160" y2="66" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
        <line x1="153" y1="60" x2="167" y2="60" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

        {/* Decorative organic curves */}
        <path d="M74 80 Q66 90 70 102" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.20" />
        <path d="M246 80 Q254 90 250 102" stroke={c} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.20" />
      </svg>
    ),

    // ─────────────────────────────────────────────────────────
    // DERMATOLOGY — Skin layers cross-section + cellular detail
    // ─────────────────────────────────────────────────────────
    dermatology: (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
        {/* Outer glow */}
        <circle cx="160" cy="120" r="88" fill={c} fillOpacity="0.04" />

        {/* Skin layer cross-section — left side (anatomical cut) */}
        {/* Epidermis — outermost, wavy top edge */}
        <path d="M40 88 Q52 82 64 88 Q76 94 88 88 Q100 82 112 88 Q124 94 136 88 Q148 82 160 88 Q172 94 184 88 Q196 82 208 88 Q220 94 232 88 Q244 82 256 88 Q268 94 280 88 L280 108 L40 108 Z"
          stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.10" />
        <text x="46" y="100" fill={c} fillOpacity="0.55" fontSize="7" fontFamily="system-ui,sans-serif" letterSpacing="0.1em">EPIDERMIS</text>

        {/* Dermis — second layer */}
        <rect x="40" y="108" width="240" height="44" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.06" />
        <text x="46" y="133" fill={c} fillOpacity="0.45" fontSize="7" fontFamily="system-ui,sans-serif" letterSpacing="0.1em">DERMIS</text>

        {/* Hair follicle — within dermis */}
        <path d="M200 108 L196 128 Q196 140 202 148 Q208 156 206 168" stroke={c} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.60" />
        <ellipse cx="200" cy="108" rx="5" ry="3" stroke={c} strokeWidth="1" fill={c} fillOpacity="0.12" opacity="0.7" />
        {/* Sebaceous gland */}
        <ellipse cx="194" cy="132" rx="8" ry="6" stroke={c} strokeWidth="1" fill={c} fillOpacity="0.08" opacity="0.6" />

        {/* Sweat gland — coiled duct */}
        <path d="M240 108 L240 136 Q240 148 234 152 Q228 156 226 152 Q224 148 228 144 Q232 140 232 152" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.50" />

        {/* Hypodermis — deepest layer (fat lobules) */}
        <rect x="40" y="152" width="240" height="48" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.04" />
        <text x="46" y="180" fill={c} fillOpacity="0.40" fontSize="7" fontFamily="system-ui,sans-serif" letterSpacing="0.1em">HYPODERMIS</text>
        {/* Fat lobules */}
        {[70,100,130,160,190,220,248].map((x, i) => (
          <ellipse key={i} cx={x} cy={186} rx={13} ry={9} stroke={c} strokeWidth="0.8" fill={c} fillOpacity="0.06" opacity="0.7" />
        ))}

        {/* Blood vessels in dermis */}
        <path d="M68 118 Q80 114 92 118 Q104 122 116 118" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M68 128 Q80 132 92 128 Q104 124 116 128" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />

        {/* Nerve ending */}
        <path d="M148 152 L148 168 Q148 176 156 180 Q164 184 164 176 Q164 168 156 168" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.40" />

        {/* Magnified cell view — upper right */}
        <circle cx="264" cy="64" r="36" stroke={c} strokeWidth="1.2" fill={c} fillOpacity="0.04" opacity="0.8" />
        {/* Cell nucleus */}
        <circle cx="264" cy="64" r="14" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.08" opacity="0.9" />
        {/* Nucleolus */}
        <circle cx="264" cy="64" r="5" fill={c} fillOpacity="0.30" opacity="0.9" />
        {/* Cell organelles */}
        <ellipse cx="250" cy="54" rx="5" ry="3" stroke={c} strokeWidth="0.8" fill="none" opacity="0.5" />
        <ellipse cx="276" cy="74" rx="5" ry="3" stroke={c} strokeWidth="0.8" fill="none" opacity="0.5" />
        <ellipse cx="254" cy="76" rx="4" ry="2.5" stroke={c} strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* Magnifier handle */}
        <line x1="292" y1="92" x2="306" y2="106" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  }

  return visuals[id] ?? null
}
