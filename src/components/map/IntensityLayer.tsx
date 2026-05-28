import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Live classification — sqrt normalization ───────────────────────────────────
//
// Sqrt(count/max) compresses outlier dominance and amplifies small-count
// differences. Used exclusively by "En vivo" mode.

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = Math.sqrt(count / max)
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
}

// ── Historical classification — rank-based ────────────────────────────────────
//
// Assigns levels by sorted rank, NOT by threshold. This guarantees a clear
// visual hierarchy regardless of how close the values are.
//
// Special cases (n = active count with count > 0):
//   n = 0 → all inactive
//   n = 1 → that point is HIGH
//   n = 2 → HIGH, MEDIUM
//   n = 3 → HIGH, MEDIUM, LOW
//
// n ≥ 4:
//   top    Math.round(n × 0.25) → HIGH   (min 1)
//   next   Math.round(n × 0.20) → MEDIUM (min 1)
//   rest                         → LOW
//
// Example: [6, 4, 2, 2, 1] → HIGH, MEDIUM, LOW, LOW, LOW
// Example: [120, 80, 40, 15, 8, 2] → HIGH, HIGH, MEDIUM, LOW, LOW, LOW

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

  if (n === 1) { result.set(active[0].id, 'high'); return result }

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

  const highCount   = Math.max(1, Math.round(n * 0.25))
  const mediumCount = Math.max(1, Math.round(n * 0.20))

  active.forEach((p, i) => {
    if      (i < highCount)                    result.set(p.id, 'high')
    else if (i < highCount + mediumCount)      result.set(p.id, 'medium')
    else                                        result.set(p.id, 'low')
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

// ── Live palette ──────────────────────────────────────────────────────────────
//
// Used by "En vivo" and by /app/live-visits (mode defaults to 'live').
// DO NOT modify this palette when working on historical visuals.

const LIVE: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.12,
    color: '#6ee7b7', weight: 1, opacity: 0.32, interactive: false,
  },
  core: {
    low: {
      fillColor: '#6ee7b7', fillOpacity: 0.12,
      color: '#34d399', weight: 1.5, opacity: 0.55,
    },
    medium: {
      fillColor: '#34d399', fillOpacity: 0.20,
      color: '#10b981', weight: 2, opacity: 0.75,
    },
    high: {
      fillColor: '#86efac', fillOpacity: 0.30,
      color: '#4ade80', weight: 2.5, opacity: 0.95,
    },
  },
  // Halos are intentionally tight — glow stays within the geographic area.
  // Intensity is expressed through fillOpacity, not spatial expansion.
  halo: {
    low: [
      { radiusFactor: 1.25, fillColor: '#a7f3d0', fillOpacity: 0.25 },
    ],
    medium: [
      { radiusFactor: 1.45, fillColor: '#34d399', fillOpacity: 0.22 },
      { radiusFactor: 1.18, fillColor: '#34d399', fillOpacity: 0.38 },
    ],
    high: [
      { radiusFactor: 1.65, fillColor: '#4ade80', fillOpacity: 0.20 },
      { radiusFactor: 1.35, fillColor: '#4ade80', fillOpacity: 0.40 },
      { radiusFactor: 1.12, fillColor: '#86efac', fillOpacity: 0.55 },
    ],
  },
}

// ── Historical palette ────────────────────────────────────────────────────────
//
// Used ONLY by /project/:id "Histórica" mode.
// Visual hierarchy based on rank — differences must be immediately obvious.
//
//   inactive → fillOpacity 0.06 — barely visible ghost
//   low      → fillOpacity 0.22 — soft, visible but non-competing
//   medium   → fillOpacity 0.52 — clearly active
//   high     → fillOpacity 0.88 — dominant, near-solid
//
// Halos stay contained (max 3.5×) — intensity expressed via fill density and
// border weight, not territorial expansion.

const HISTORICAL: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.06,
    color: '#6ee7b7', weight: 0.5, opacity: 0.20, interactive: false,
  },
  core: {
    low: {
      fillColor: '#6ee7b7',   // emerald-300
      fillOpacity: 0.22,
      color: '#34d399',       // emerald-400
      weight: 1.5,
      opacity: 0.60,
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
    low: [
      { radiusFactor: 1.5, fillColor: '#a7f3d0', fillOpacity: 0.18 },
    ],
    medium: [
      { radiusFactor: 2.5, fillColor: '#34d399', fillOpacity: 0.22 },
      { radiusFactor: 1.6, fillColor: '#34d399', fillOpacity: 0.42 },
    ],
    high: [
      { radiusFactor: 3.5, fillColor: '#4ade80', fillOpacity: 0.18 },
      { radiusFactor: 2.2, fillColor: '#4ade80', fillOpacity: 0.40 },
      { radiusFactor: 1.4, fillColor: '#86efac', fillOpacity: 0.62 },
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
