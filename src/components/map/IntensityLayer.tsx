import { Fragment } from 'react'
import { Circle } from 'react-leaflet'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

// ── Relative intensity ────────────────────────────────────────────────────────
//
// Sqrt normalization: compresses outlier dominance and amplifies small-count
// differences — essential for skewed historical distributions.

export function relativeIntensity(count: number, max: number): IntensityLevel {
  if (max === 0 || count === 0) return 'low'
  const pct = Math.sqrt(count / max)
  if (pct >= 0.67) return 'high'
  if (pct >= 0.34) return 'medium'
  return 'low'
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
//
// This palette is used by both /app/live-visits and /project/:id "En vivo".
// Any visual changes to live mode must happen here ONLY.

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

// ── Historical palette — extreme territorial heatmap ─────────────────────────
//
// Used ONLY by /project/:id "Histórica" mode.
// Designed to dominate the map visually: massive halos, high opacity cores,
// radical gap between levels. Differences must be obvious from a distance.
//
//   inactive → ghost ring reference
//   low      → clearly active, soft territorial mass
//   medium   → strong presence, multi-layer glow
//   high     → dominant energy field, map-covering halo

const HISTORICAL: Palette = {
  inactive: {
    fillColor: '#a7f3d0', fillOpacity: 0.14,
    color: '#6ee7b7', weight: 1, opacity: 0.35, interactive: false,
  },
  core: {
    low: {
      fillColor: '#6ee7b7', fillOpacity: 0.70,
      color: '#10b981', weight: 3, opacity: 0.90,
    },
    medium: {
      fillColor: '#34d399', fillOpacity: 0.85,
      color: '#059669', weight: 3.5, opacity: 1.0,
    },
    high: {
      fillColor: '#bbf7d0', fillOpacity: 0.95,   // green-200 — maximum luminosity
      color: '#22c55e', weight: 5, opacity: 1.0,
    },
  },
  halo: {
    low: [
      { radiusFactor: 4.0, fillColor: '#a7f3d0', fillOpacity: 0.36 },
      { radiusFactor: 2.5, fillColor: '#6ee7b7', fillOpacity: 0.55 },
    ],
    medium: [
      { radiusFactor: 7.0, fillColor: '#34d399', fillOpacity: 0.18 },
      { radiusFactor: 5.0, fillColor: '#34d399', fillOpacity: 0.38 },
      { radiusFactor: 3.0, fillColor: '#34d399', fillOpacity: 0.62 },
    ],
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
  const max     = points.reduce((m, p) => Math.max(m, activeNow[p.id] ?? 0), 0)

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

        const level = relativeIntensity(count, max)
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
