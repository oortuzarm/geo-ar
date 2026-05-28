import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Relative intensity ────────────────────────────────────────────────────────
//
// Sqrt normalization: compresses outlier dominance and amplifies small-count
// differences, essential for skewed historical distributions.

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = Math.sqrt(count / max)
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
}

// ── Color palette ─────────────────────────────────────────────────────────────
//
//   inactive → emerald-200 ghost ring
//   low      → emerald-300 fill / emerald-400 border
//   medium   → emerald-400 fill / emerald-500 border
//   high     → green-300 luminous fill / green-400 border (brightest)

const INACTIVE_CORE = {
  fillColor:   '#a7f3d0',   // emerald-200
  fillOpacity: 0.12,
  color:       '#6ee7b7',   // emerald-300
  weight:      1,
  opacity:     0.32,
  interactive: false,
} as const

const CORE: Record<IntensityLevel, object> = {
  low: {
    fillColor:   '#6ee7b7',   // emerald-300
    fillOpacity: 0.55,
    color:       '#34d399',   // emerald-400
    weight:      2,
    opacity:     0.80,
  },
  medium: {
    fillColor:   '#34d399',   // emerald-400
    fillOpacity: 0.72,
    color:       '#10b981',   // emerald-500
    weight:      2.5,
    opacity:     0.95,
  },
  high: {
    fillColor:   '#86efac',   // green-300 — luminous, glowing from inside
    fillOpacity: 0.88,
    color:       '#4ade80',   // green-400
    weight:      3,
    opacity:     1.0,
  },
}

// ── Layered glow halos ────────────────────────────────────────────────────────
//
// Rings rendered outermost-first (faint outer → bright inner).
// radiusFactor multiplies the core geographic radius — visual only.
//
//   low      → 2 rings, max 3.0× radius
//   medium   → 3 rings, max 5.0× radius
//   high     → 4 rings, max 8.0× radius

interface HaloRing {
  radiusFactor: number
  fillColor:    string
  fillOpacity:  number
}

const HALO: Record<IntensityLevel, HaloRing[]> = {
  low: [
    { radiusFactor: 3.0, fillColor: '#a7f3d0', fillOpacity: 0.28 },
    { radiusFactor: 1.8, fillColor: '#6ee7b7', fillOpacity: 0.40 },
  ],
  medium: [
    { radiusFactor: 5.0, fillColor: '#34d399', fillOpacity: 0.14 },
    { radiusFactor: 3.5, fillColor: '#34d399', fillOpacity: 0.32 },
    { radiusFactor: 2.2, fillColor: '#34d399', fillOpacity: 0.50 },
  ],
  high: [
    { radiusFactor: 8.0, fillColor: '#4ade80', fillOpacity: 0.08 },
    { radiusFactor: 6.0, fillColor: '#4ade80', fillOpacity: 0.18 },
    { radiusFactor: 4.0, fillColor: '#4ade80', fillOpacity: 0.36 },
    { radiusFactor: 2.5, fillColor: '#86efac', fillOpacity: 0.56 },
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
