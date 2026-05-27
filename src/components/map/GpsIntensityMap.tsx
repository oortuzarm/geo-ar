import { Fragment, useEffect } from 'react'
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import { intensityFromCount } from '../../utils/liveVisits'
import type { GeoPoint } from '../../types'

// ── Intensity helpers ─────────────────────────────────────────────────────────

export type IntensityLevel = 'low' | 'medium' | 'high'

const CIRCLE_STYLE: Record<IntensityLevel, { color: string; fillColor: string; fillOpacity: number }> = {
  low:    { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.18 },
  medium: { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.22 },
  high:   { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.28 },
}

// Deterministic mock intensity per point — same value on every render.
export function mockPointIntensity(pointId: string): IntensityLevel {
  const sum = pointId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const b = sum % 3
  return b === 0 ? 'low' : b === 1 ? 'medium' : 'high'
}

// ── Map internals ─────────────────────────────────────────────────────────────

function FitBounds({ points }: { points: GeoPoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 14, { animate: false })
      return
    }
    const latlngs: [number, number][] = points.map((p) => [p.latitude, p.longitude])
    map.fitBounds(latlngs, { padding: [40, 40], maxZoom: 14, animate: false })
  }, [points.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── Public component ──────────────────────────────────────────────────────────

export interface GpsIntensityMapProps {
  points:    GeoPoint[]
  activeNow?: Record<string, number>  // pointId → active visitor count; overrides mock
}

export default function GpsIntensityMap({ points, activeNow }: GpsIntensityMapProps) {
  return (
    <MapContainer
      center={[-33.4489, -70.6693]}
      zoom={11}
      maxZoom={20}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', background: '#111827', zIndex: 0 }}
      zoomControl
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_KEY}`}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>'
        maxZoom={20}
      />
      <FitBounds points={points} />
      {points.map((point) => {
        const level = activeNow !== undefined
          ? intensityFromCount(activeNow[point.id] ?? 0)
          : mockPointIntensity(point.id)
        const style = CIRCLE_STYLE[level]
        return (
          <Fragment key={point.id}>
            {/* Intensity area — capped at 1 000 m, drawn below the marker */}
            <Circle
              center={[point.latitude, point.longitude]}
              radius={Math.min(point.activationRadius, 1000)}
              pathOptions={{ ...style, weight: 1.5, opacity: 0.7 }}
            />
            {/* Pin on top */}
            <Marker
              position={[point.latitude, point.longitude]}
              icon={createGeoIcon(false, point.active, false, getPointCoverImage(point))}
            />
          </Fragment>
        )
      })}
    </MapContainer>
  )
}
