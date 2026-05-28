import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Live intensity — sqrt normalization (unchanged) ───────────────────────────

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = Math.sqrt(count / max)
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
}

// ── Historical intensity — rank-based classification ──────────────────────────
//
// Assigns levels by sorted rank, not by threshold. This guarantees that there
// is ALWAYS a clear visual hierarchy regardless of how close the values are.
//
// Special cases:
//   0 active → all inactive (no result entry)
//   1 active → that point is HIGH
//   2 active → HIGH, MEDIUM
//   3 active → HIGH, MEDIUM, LOW
//
// 4+ active:
//   top    ~25% → HIGH   (min 1)
//   next   ~20% → MEDIUM (min 1)
//   rest          → LOW

function computeHistoricalLevels(
  points:    GeoPoint[],
  activeNow: Record<string, number>,
): Map<string, IntensityLevel> {
  const result = new Map<string, IntensityLevel>()

  const active = points
    .filter((p) => (activeNow[p.id] ?? 0) > 0)
    .sort((a, b) => (activeNow[b.id] ?? 0) - (activeNow[a.id] ?? 0))

  const n = active.length

  if (n === 0) return result

  if (n === 1) {
    result.set(active[0].id, 'high')
    return result
  }

  if (n === 2) {
    result.set(active[0].id, 'high')
    result.set(active[1].id, 'medium')
    return result
  }

  if (n === 3) {
    result.set(active[0].id, 'high')
    result.set(active[1].id, 'medium')
    result.set(active[2].id, 'low')
    return result
  }

  // n >= 4 — percentage-based rank buckets
  const highCount   = Math.max(1, Math.round(n * 0.25))
  const mediumCount = Math.max(1, Math.round(n * 0.20))

  active.forEach((p, i) => {
    if (i < highCount)                    result.set(p.id, 'high')
    else if (i < highCount + mediumCount) result.set(p.id, 'medium')
    else                                   result.set(p.id, 'low')
  })

  return result
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface HaloRing { radiusFactor: number; fillColor: string; fillOpacity: number }

interface Palette {
  inactive: object
  core:     Record<IntensityLevel, object>
  halo:     Record<IntensityLevel, HaloRing[]>
}

const HALO_BASE = { color: 'transparent', weight: 0, opacity: 0, interactive: false } as const

// ── Live palette — DO NOT MODIFY ──────────────────────────────────────────────

const LIVE: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.12,
    color: '#6ee7b7', weight: 1, opacity: 0.32, interactive: false,
  },
  core: {
    low: {
      fillColor: '#6ee7b7', fillOpacity: 0.55,
      color: '#34d399', weight: 2, opacity: 0.80,
    },
    medium: {
      fillColor: '#34d399', fillOpacity: 0.72,
      color: '#10b981', weight: 2.5, opacity: 0.95,
    },
    high: {
      fillColor: '#86efac', fillOpacity: 0.88,
      color: '#4ade80', weight: 3, opacity: 1.0,
    },
  },
  halo: {
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
  },
}

// ── Historical palette — extreme contrast between levels ──────────────────────
//
// LOW is intentionally very faint so HIGH and MEDIUM dominate.
// The visual gap between tiers must be immediately obvious.
//
//   low    → fillOpacity ~0.22  — tenue reference, minimal glow
//   medium → fillOpacity ~0.52  — clearly active, perceptible glow
//   high   → fillOpacity ~0.88  — dominant, near-solid, massive halo

const HISTORICAL: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.10,
    color: '#6ee7b7', weight: 1, opacity: 0.28, interactive: false,
  },
  core: {
    low: {
      fillColor: '#6ee7b7',   // emerald-300
      fillOpacity: 0.22,
      color: '#34d399',       // emerald-400
      weight: 1.5,
      opacity: 0.55,
    },
    medium: {
      fillColor: '#34d399',   // emerald-400
      fillOpacity: 0.52,
      color: '#10b981',       // emerald-500
      weight: 3,
      opacity: 0.90,
    },
    high: {
      fillColor: '#bbf7d0',   // green-200 — maximum luminosity
      fillOpacity: 0.88,
      color: '#22c55e',       // green-500
      weight: 5,
      opacity: 1.0,
    },
  },
  halo: {
    // Low: single soft ring — minimal, non-competing
    low: [
      { radiusFactor: 2.0, fillColor: '#a7f3d0', fillOpacity: 0.16 },
    ],
    // Medium: two rings — clearly active
    medium: [
      { radiusFactor: 5.0, fillColor: '#34d399', fillOpacity: 0.18 },
      { radiusFactor: 3.0, fillColor: '#34d399', fillOpacity: 0.40 },
    ],
    // High: four rings — territorial dominance
    high: [
      { radiusFactor: 12.0, fillColor: '#4ade80', fillOpacity: 0.10 },
      { radiusFactor:  9.0, fillColor: '#4ade80', fillOpacity: 0.22 },
      { radiusFactor:  6.0, fillColor: '#4ade80', fillOpacity: 0.45 },
      { radiusFactor:  3.5, fillColor: '#86efac', fillOpacity: 0.70 },
    ],
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  points:    GeoPoint[]
  activeNow: Record<string, number>
  mode?:     'live' | 'historical'
}

export default function IntensityLayer({ points, activeNow, mode = 'live' }: Props) {
  const palette = mode === 'historical' ? HISTORICAL : LIVE

  // Historical: pre-compute rank-based level for every point
  // Live: compute per-point from sqrt(count/max)
  const historicalLevelMap = mode === 'historical'
    ? computeHistoricalLevels(points, activeNow)
    : null

  const liveMax = mode === 'live'
    ? points.reduce((m, p) => Math.max(m, activeNow[p.id] ?? 0), 0)
    : 0

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
              pathOptions={palette.inactive}
            />
          )
        }

        const level = mode === 'historical'
          ? (historicalLevelMap!.get(point.id) ?? 'low')
          : relativeIntensity(count, liveMax)

        const halos = palette.halo[level]

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
              pathOptions={{ ...palette.core[level], interactive: false }}
            />
          </Fragment>
        )
      })}
    </>
  )
}
