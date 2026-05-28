import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Relative intensity ────────────────────────────────────────────────────────
//
// Sqrt normalization: sqrt(count / max) vs the naive count/max.
//
// Historical data is almost always skewed — one zone with 50 entries, others
// with 1-6. With linear normalization, 6/50 = 12% → "low" for everything
// except the busiest. Sqrt compresses the high end and amplifies the low end:
//   sqrt(6/50) ≈ 35% → "medium" instead of "low"
//   sqrt(4/6)  ≈ 82% → "high" for the second busiest in a tight cluster
//
// count = 0 must be handled by the caller — this function only receives counts > 0.

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = Math.sqrt(count / max)
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
}

// ── Color palette: pure green intensity ramp ──────────────────────────────────
//
//   low    → emerald-200 / emerald-300 — quiet, translucent presence
//   medium → emerald-400 / emerald-500 — visible movement
//   high   → green-400  / green-500   — brilliant, energetic (no cyan)

const CORE: Record<IntensityLevel, object> = {
  low: {
    fillColor: '#a7f3d0',   // emerald-200
    fillOpacity: 0.18,
    color: '#6ee7b7',       // emerald-300
    weight: 1,
    opacity: 0.35,
  },
  medium: {
    fillColor: '#34d399',   // emerald-400
    fillOpacity: 0.30,
    color: '#10b981',       // emerald-500
    weight: 1.5,
    opacity: 0.72,
  },
  high: {
    fillColor: '#4ade80',   // green-400
    fillOpacity: 0.45,
    color: '#22c55e',       // green-500
    weight: 2,
    opacity: 0.95,
  },
}

// Rendered for zones with count = 0: almost invisible — indicates the zone
// exists but has no recorded activity. No halos, no fill glow.
const INACTIVE_CORE = {
  fillColor: '#a7f3d0',
  fillOpacity: 0.04,
  color: '#6ee7b7',
  weight: 0.5,
  opacity: 0.12,
  interactive: false,
} as const

// ── Layered glow halos ────────────────────────────────────────────────────────
//
// Each level has an array of halo rings rendered from outermost to innermost.
// The falloff from inner (bright) → outer (faint) creates a natural glow.
// radiusFactor multiplies the core geographic radius — visual only.

interface HaloRing {
  radiusFactor: number
  fillColor:    string
  fillOpacity:  number
}

const HALO: Partial<Record<IntensityLevel, HaloRing[]>> = {
  // Low: single soft ambient ring
  low: [
    { radiusFactor: 1.7, fillColor: '#a7f3d0', fillOpacity: 0.10 },
  ],

  // Medium: two-ring glow — inner brighter, outer wider and dimmer
  medium: [
    { radiusFactor: 2.8, fillColor: '#34d399', fillOpacity: 0.07 },
    { radiusFactor: 1.9, fillColor: '#34d399', fillOpacity: 0.16 },
  ],

  // High: three-ring energy field — layered falloff for strong glow
  high: [
    { radiusFactor: 4.0, fillColor: '#4ade80', fillOpacity: 0.05 },
    { radiusFactor: 2.7, fillColor: '#4ade80', fillOpacity: 0.13 },
    { radiusFactor: 1.8, fillColor: '#4ade80', fillOpacity: 0.24 },
  ],
}

const HALO_STYLE_BASE = { color: 'transparent', weight: 0, opacity: 0, interactive: false } as const

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  points:    GeoPoint[]
  activeNow: Record<string, number>
}

export default function IntensityLayer({ points, activeNow }: Props) {
  const max = points.reduce((m, p) => Math.max(m, activeNow[p.id] ?? 0), 0)

  return (
    <>
      {points.map((point) => {
        const count  = activeNow[point.id] ?? 0
        const radius = Math.min(point.activationRadius, 1000)

        // Zones with zero activity render as a nearly invisible ghost ring —
        // they don't compete with real-activity zones and have no halo.
        if (count === 0) {
          return (
            <Circle
              key={point.id}
              center={[point.latitude, point.longitude]}
              radius={radius}
              pathOptions={INACTIVE_CORE}
            />
          )
        }

        const level = relativeIntensity(count, max)
        const halos = HALO[level] ?? []

        return (
          <Fragment key={point.id}>
            {/* Outermost ring first so inner rings paint on top */}
            {halos.map((halo, i) => (
              <Circle
                key={i}
                center={[point.latitude, point.longitude]}
                radius={radius * halo.radiusFactor}
                pathOptions={{
                  ...HALO_STYLE_BASE,
                  fillColor:   halo.fillColor,
                  fillOpacity: halo.fillOpacity,
                }}
              />
            ))}
            <Circle
              center={[point.latitude, point.longitude]}
              radius={radius}
              pathOptions={{ ...CORE[level], interactive: false }}
            />
          </Fragment>
        )
      })}
    </>
  )
}
