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

// ── Layered glow halos ────────────────────────────────────────────────────────
//
// Each level has an array of halo rings rendered from outermost to innermost.
// The falloff from inner (bright) → outer (faint) creates a natural glow.
// radiusFactor is a multiplier of the core geographic radius — it only affects
// the visual size, never the actual activation zone.

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
        const level  = relativeIntensity(count, max)
        const radius = Math.min(point.activationRadius, 1000)
        const halos  = HALO[level] ?? []

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
