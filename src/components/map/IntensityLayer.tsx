import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Relative intensity ────────────────────────────────────────────────────────
//
// Intensity is relative to the busiest zone at this moment, not fixed thresholds.
// This ensures useful visual contrast for both small venues (2 visitors) and
// large ones (thousands). Zones with 0 visitors are always "low".

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = count / max
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
}

// ── Color palette: pure green intensity ramp ──────────────────────────────────
//
// Single green family across all three levels. Brightness and saturation
// increase with activity — never reads as alert or danger.
//
//   low    → emerald-200 / emerald-300 — quiet, translucent presence
//   medium → emerald-400 / emerald-500 — visible movement
//   high   → green-400  / green-500   — brilliant, energetic (no cyan)

const CORE: Record<IntensityLevel, object> = {
  low: {
    fillColor: '#a7f3d0',   // emerald-200 — quiet presence
    fillOpacity: 0.18,
    color: '#6ee7b7',       // emerald-300
    weight: 1,
    opacity: 0.35,
  },
  medium: {
    fillColor: '#34d399',   // emerald-400 — visible movement
    fillOpacity: 0.30,
    color: '#10b981',       // emerald-500
    weight: 1.5,
    opacity: 0.72,
  },
  high: {
    fillColor: '#4ade80',   // green-400 — brilliant, intense
    fillOpacity: 0.45,
    color: '#22c55e',       // green-500
    weight: 2,
    opacity: 0.95,
  },
}

// Outer luminous halo — rendered only for medium and high to suggest glow/energy.
const HALO: Partial<Record<IntensityLevel, { radiusFactor: number; style: object }>> = {
  medium: {
    radiusFactor: 1.30,
    style: {
      fillColor: '#34d399',   // emerald-400
      fillOpacity: 0.07,
      color: 'transparent',
      weight: 0,
      opacity: 0,
    },
  },
  high: {
    radiusFactor: 1.45,
    style: {
      fillColor: '#4ade80',   // green-400
      fillOpacity: 0.11,
      color: 'transparent',
      weight: 0,
      opacity: 0,
    },
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  points:    GeoPoint[]
  activeNow: Record<string, number>  // pointId → live visitor count
}

export default function IntensityLayer({ points, activeNow }: Props) {
  const max = points.reduce((m, p) => Math.max(m, activeNow[p.id] ?? 0), 0)

  return (
    <>
      {points.map((point) => {
        const count  = activeNow[point.id] ?? 0
        const level  = relativeIntensity(count, max)
        const radius = Math.min(point.activationRadius, 1000)
        const halo   = HALO[level]

        return (
          <Fragment key={point.id}>
            {halo && (
              <Circle
                center={[point.latitude, point.longitude]}
                radius={radius * halo.radiusFactor}
                pathOptions={{ ...halo.style, interactive: false }}
              />
            )}
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
