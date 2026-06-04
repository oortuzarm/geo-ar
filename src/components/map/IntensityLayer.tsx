import { Circle } from 'react-leaflet'
import L from 'leaflet'
import PolygonAreaLayer from './PolygonAreaLayer'
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

interface Palette {
  inactive: L.PathOptions
  core:     Record<IntensityLevel, L.PathOptions>
}

// ── Live palette ──────────────────────────────────────────────────────────────
//
// Intensity is expressed entirely through fillOpacity, border weight and colour.
// No external halos — geometry boundaries are respected for both circles and
// polygons. Levels are separated by clearly visible opacity steps.

const LIVE: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.08,
    color: '#6ee7b7', weight: 0.5, opacity: 0.20, interactive: false,
  },
  core: {
    low:    { fillColor: '#6ee7b7', fillOpacity: 0.18, color: '#34d399', weight: 1.5, opacity: 0.55 },
    medium: { fillColor: '#34d399', fillOpacity: 0.35, color: '#10b981', weight: 2,   opacity: 0.75 },
    high:   { fillColor: '#86efac', fillOpacity: 0.55, color: '#4ade80', weight: 2.5, opacity: 0.95 },
  },
}

// ── Historical palette ────────────────────────────────────────────────────────
//
// Higher opacity range than LIVE to reflect accumulated historical weight.
// Same no-halo approach — differentiation comes from fillOpacity and weight only.

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
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  points:    GeoPoint[]
  activeNow: Record<string, number>
  mode?:     'live' | 'historical'
  pane?:     string
}

export default function IntensityLayer({ points, activeNow, mode = 'live', pane }: Props) {
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
      mode:  p.activationMode ?? 'radius',
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
        const count     = activeNow[point.id] ?? 0
        const isPolygon = (point.activationMode ?? 'radius') === 'polygon' && point.activationPolygon != null

        // Resolve intensity level once — used by both branches.
        // null means inactive (count === 0).
        const level: IntensityLevel | null = count === 0 ? null : (
          mode === 'historical'
            ? (historicalLevelMap!.get(point.id) ?? 'low')
            : relativeIntensity(count, liveMax)
        )

        const style = level === null ? palette.inactive : palette.core[level]

        // ── Polygon branch ────────────────────────────────────────────────────
        if (isPolygon) {
          if (import.meta.env.DEV) {
            console.log(`[IntensityLayer] polygon "${point.name}" count=${count} level=${level ?? 'inactive'}`)
          }

          return (
            <PolygonAreaLayer
              key={point.id}
              polygon={point.activationPolygon!}
              pathOptions={style}
              interactive={false}
              pane={pane}
            />
          )
        }

        // ── Radius branch ─────────────────────────────────────────────────────
        // Intensity is expressed via fill colour, opacity and border weight only.
        // No external rings — visual effect stays within the real geometry boundary.
        if (import.meta.env.DEV) {
          console.log(`[IntensityLayer] radius "${point.name}" count=${count} level=${level ?? 'inactive'}`)
        }

        return (
          <Circle
            key={point.id}
            center={[point.latitude, point.longitude]}
            radius={Math.min(point.activationRadius, 1000)}
            pathOptions={{ ...style, interactive: false }}
            pane={pane}
          />
        )
      })}
    </>
  )
}
