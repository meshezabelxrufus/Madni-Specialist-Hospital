/**
 * Scene Configuration — Madni Specialist & Trauma Centre
 * -------------------------------------------------
 * 10 cinematic scenes, 2090vh total scroll depth.
 *
 * OVERLAP STRATEGY:
 *   Adjacent scenes share ~20–30vh of scroll space. During that
 *   window, the outgoing scene is at local progress 0.88→1.0 (fading
 *   out) while the incoming scene is at 0.0→0.12 (fading in). This
 *   creates a film-dissolve crossfade rather than a hard cut.
 *
 *   DOM order handles z-stacking: later elements render on top,
 *   so the incoming (next) scene is always visually above the exiting one.
 *
 * SCROLL POSITIONS (vh):
 *   Intro:        0   → 150
 *   Pediatrics:  130  → 430  (20vh overlap with intro — 300vh for two doctors)
 *   Surgery:     400  → 650  (30vh overlap)
 *   ENT:         620  → 870  (30vh overlap)
 *   Orthopedics: 840  → 1090 (30vh overlap)
 *   Gynecology:  1060 → 1310 (30vh overlap)
 *   Dermatology: 1280 → 1530 (30vh overlap)
 *   Cardiology:  1500 → 1750 (30vh overlap)
 *   Support:     1720 → 1920 (30vh overlap)
 *   Booking:     1890 → 2090 (30vh overlap)
 */

import type { SceneConfig } from './types'

export const TOTAL_SCROLL_HEIGHT_VH = 2090

// Explicit vh positions → normalized [0,1]
const vh = (n: number) => n / TOTAL_SCROLL_HEIGHT_VH

export const SCENE_CONFIGS: SceneConfig[] = [
  { id: 'intro',        start: vh(0),    end: vh(150)  },
  { id: 'pediatrics',   start: vh(130),  end: vh(430)  },  // 300vh — two doctors
  { id: 'surgery',      start: vh(400),  end: vh(650)  },
  { id: 'ent',          start: vh(620),  end: vh(870)  },
  { id: 'orthopedics',  start: vh(840),  end: vh(1090) },
  { id: 'gynecology',   start: vh(1060), end: vh(1310) },
  { id: 'dermatology',  start: vh(1280), end: vh(1530) },
  { id: 'cardiology',   start: vh(1500), end: vh(1750) },
  { id: 'support',      start: vh(1720), end: vh(1920) },
  { id: 'booking',      start: vh(1890), end: vh(2090) },
]

/** Quick lookup — throws in development if id not found */
export function getSceneConfig(id: string): SceneConfig {
  const config = SCENE_CONFIGS.find((s) => s.id === id)
  if (!config) {
    throw new Error(
      `[ScrollSystem] Scene "${id}" not found. ` +
      `Available: ${SCENE_CONFIGS.map((s) => s.id).join(', ')}`
    )
  }
  return config
}

if (process.env.NODE_ENV === 'development') {
  console.group('[ScrollSystem] Scene Config — Madni Hospital')
  SCENE_CONFIGS.forEach((s) => {
    const vhStart = Math.round(s.start * TOTAL_SCROLL_HEIGHT_VH)
    const vhEnd   = Math.round(s.end   * TOTAL_SCROLL_HEIGHT_VH)
    console.log(
      `${s.id.padEnd(14)} ${vhStart.toString().padStart(4)}vh → ${vhEnd.toString().padStart(4)}vh  ` +
      `[${s.start.toFixed(3)} → ${s.end.toFixed(3)}]`
    )
  })
  console.log(`Total: ${TOTAL_SCROLL_HEIGHT_VH}vh`)
  console.groupEnd()
}
