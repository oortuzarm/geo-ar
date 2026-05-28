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

// ── Shared halo geometry ──────────────────────────────────────────────────────
//
// Both modes use the same radiusFactor multipliers so the halo geometry is
// consistent. Visual intensity difference between modes comes from fillOpacity,
// not from different ring sizes. Rings are rendered outermost → innermost.
//
//   low    → 1 ring  (max 1.4× real radius)
//   medium → 2 rings (max 2.0×)
//   high   → 3 rings (max 2.5×)

const HALO_FACTORS: Record<IntensityLevel, number[]> = {
  low:    [1.4],
  medium: [2.0, 1.4],
  high:   [2.5, 1.8, 1.35],
}

// ── Live palette ──────────────────────────────────────────────────────────────
//
// Used by "En vivo" and by /app/live-visits (mode defaults to 'live').
// Lower fillOpacity — map remains fully readable underneath.

const LIVE: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.12,
    color: '#6ee7b7', weight: 1, opacity: 0.32, interactive: false,
  },
  core: {
    low:    { fillColor: '#6ee7b7', fillOpacity: 0.12, color: '#34d399', weight: 1.5, opacity: 0.55 },
    medium: { fillColor: '#34d399', fillOpacity: 0.20, color: '#10b981', weight: 2,   opacity: 0.75 },
    high:   { fillColor: '#86efac', fillOpacity: 0.30, color: '#4ade80', weight: 2.5, opacity: 0.95 },
  },
  halo: {
    low: [
      { radiusFactor: HALO_FACTORS.low[0],    fillColor: '#a7f3d0', fillOpacity: 0.22 },
    ],
    medium: [
      { radiusFactor: HALO_FACTORS.medium[0], fillColor: '#34d399', fillOpacity: 0.16 },
      { radiusFactor: HALO_FACTORS.medium[1], fillColor: '#34d399', fillOpacity: 0.30 },
    ],
    high: [
      { radiusFactor: HALO_FACTORS.high[0],   fillColor: '#4ade80', fillOpacity: 0.14 },
      { radiusFactor: HALO_FACTORS.high[1],   fillColor: '#4ade80', fillOpacity: 0.28 },
      { radiusFactor: HALO_FACTORS.high[2],   fillColor: '#86efac', fillOpacity: 0.44 },
    ],
  },
}

// ── Historical palette ────────────────────────────────────────────────────────
//
// Used ONLY by /project/:id "Histórica" mode.
// Same halo radiusFactor geometry as LIVE — only fillOpacity is higher to
// express historical accumulation more visibly.
//
//   inactive → fillOpacity 0.06 — barely visible ghost
//   low      → fillOpacity 0.22 — soft, visible but non-competing
//   medium   → fillOpacity 0.52 — clearly active
//   high     → fillOpacity 0.88 — dominant, near-solid

const HISTORICAL: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.06,
    color: '#6ee7b7', weight: 0.5, opacity: 0.20, interactive: false,
  },
  core: {
    low:    { fillColor: '#6ee7b7', fillOpacity: 0.22, color: '#34d399', weight: 1.5, opacity: 0.60 },
    medium: { fillColor: '#34d399', fillOpacity: 0.52, color: '#10b981', weight: 3,   opacity: 0.90 },
    high:   { fillColor: '#bbf7d0', fillOpacity: 0.88, color: '#22c55e', weight: 5,   opacity: 1.0  },
  },
  halo: {
    low: [
      { radiusFactor: HALO_FACTORS.low[0],    fillColor: '#a7f3d0', fillOpacity: 0.28 },
    ],
    medium: [
      { radiusFactor: HALO_FACTORS.medium[0], fillColor: '#34d399', fillOpacity: 0.24 },
      { radiusFactor: HALO_FACTORS.medium[1], fillColor: '#34d399', fillOpacity: 0.48 },
    ],
    high: [
      { radiusFactor: HALO_FACTORS.high[0],   fillColor: '#4ade80', fillOpacity: 0.22 },
      { radiusFactor: HALO_FACTORS.high[1],   fillColor: '#4ade80', fillOpacity: 0.44 },
      { radiusFactor: HALO_FACTORS.high[2],   fillColor: '#86efac', fillOpacity: 0.68 },
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

  // ── Temporary diagnostic log — remove after confirming data flow ───────────
  if (import.meta.env.DEV) {
    const summary = points.map((p) => ({
      id:    p.id,
      name:  p.name,
      count: activeNow[p.id] ?? 'MISSING',
      level: mode === 'historical'
        ? (historicalLevelMap?.get(p.id) ?? ((activeNow[p.id] ?? 0) === 0 ? 'inactive' : 'MISSING'))
        : ((activeNow[p.id] ?? 0) === 0 ? 'inactive' : relativeIntensity(activeNow[p.id] ?? 0, liveMax)),
    }))
    console.log('[IntensityLayer] mode:', mode, '| activeNow keys:', Object.keys(activeNow), '| classification:', summary)
  }
  // ──────────────────────────────────────────────────────────────────────────

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

        if (import.meta.env.DEV) {
          const coreStyle = palette.core[level] as Record<string, unknown>
          console.log(`[IntensityLayer] point="${point.name}" count=${count} level=${level} fillOpacity=${coreStyle.fillOpacity}`)
        }

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
