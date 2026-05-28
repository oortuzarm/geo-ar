import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Relative intensity ────────────────────────────────────────────────────────
//
// Sqrt normalization so skewed historical distributions (one very busy zone,
// many quiet ones) still produce visible contrast across all levels.

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = Math.sqrt(count / max)
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
}

// ── Color palette ─────────────────────────────────────────────────────────────
//
//   inactive → emerald-200 ghost — zone boundary reference only
//   low      → emerald-300 / emerald-400 — clearly active, visible mass
//   medium   → emerald-400 / emerald-500 — strong territorial presence
//   high     → green-400  / green-500   — dominant energy field

// Zones with count = 0: visible reference boundary, no halos.
const INACTIVE_CORE = {
  fillColor:   '#a7f3d0',   // emerald-200
  fillOpacity: 0.09,
  color:       '#6ee7b7',   // emerald-300
  weight:      1,
  opacity:     0.28,
  interactive: false,
} as const

const CORE: Record<IntensityLevel, object> = {
  low: {
    fillColor:   '#6ee7b7',   // emerald-300 — warm, clearly active
    fillOpacity: 0.38,
    color:       '#34d399',   // emerald-400
    weight:      1.5,
    opacity:     0.65,
  },
  medium: {
    fillColor:   '#34d399',   // emerald-400
    fillOpacity: 0.55,
    color:       '#10b981',   // emerald-500
    weight:      2,
    opacity:     0.88,
  },
  high: {
    fillColor:   '#4ade80',   // green-400
    fillOpacity: 0.72,
    color:       '#22c55e',   // green-500
    weight:      2.5,
    opacity:     1.0,
  },
}

// ── Layered glow halos ────────────────────────────────────────────────────────
//
// Rings are rendered outermost-first (natural falloff: faint outer → bright inner).
// radiusFactor multiplies the core geographic radius — visual only, no zone change.
//
//   low    → 2 rings — soft ambient glow
//   medium → 3 rings — clear multi-layer presence
//   high   → 4 rings — dominant energy field

interface HaloRing {
  radiusFactor: number
  fillColor:    string
  fillOpacity:  number
}

const HALO: Record<IntensityLevel, HaloRing[]> = {
  low: [
    { radiusFactor: 2.2, fillColor: '#a7f3d0', fillOpacity: 0.18 },
    { radiusFactor: 1.5, fillColor: '#6ee7b7', fillOpacity: 0.26 },
  ],
  medium: [
    { radiusFactor: 3.8, fillColor: '#34d399', fillOpacity: 0.09 },
    { radiusFactor: 2.6, fillColor: '#34d399', fillOpacity: 0.22 },
    { radiusFactor: 1.7, fillColor: '#34d399', fillOpacity: 0.34 },
  ],
  high: [
    { radiusFactor: 5.5, fillColor: '#4ade80', fillOpacity: 0.06 },
    { radiusFactor: 4.0, fillColor: '#4ade80', fillOpacity: 0.15 },
    { radiusFactor: 2.8, fillColor: '#4ade80', fillOpacity: 0.28 },
    { radiusFactor: 1.8, fillColor: '#4ade80', fillOpacity: 0.42 },
  ],
}

const HALO_BASE = { color: 'transparent', weight: 0, opacity: 0, interactive: false } as const

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

        // count = 0: faint ghost ring — zone reference, no halos
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
        const halos = HALO[level]

        return (
          <Fragment key={point.id}>
            {halos.map((halo, i) => (
              <Circle
                key={i}
                center={[point.latitude, point.longitude]}
                radius={radius * halo.radiusFactor}
                pathOptions={{
                  ...HALO_BASE,
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
