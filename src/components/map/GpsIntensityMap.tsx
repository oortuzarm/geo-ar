import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import IntensityLayer from './IntensityLayer'
import { getMapTileUrl, MAP_ATTRIBUTION } from '../../config/mapStyles'
import type { GeoPoint } from '../../types'

// Re-export so callers (LiveVisitsPage) can keep their existing import paths.
export type { IntensityLevel } from './IntensityLayer'

// ── Mock helpers (used when no real activeNow data is available) ───────────────

export function mockPointIntensity(pointId: string): 'low' | 'medium' | 'high' {
  const sum = pointId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const b = sum % 3
  return b === 0 ? 'low' : b === 1 ? 'medium' : 'high'
}

// Mock counts chosen so relative logic maps each mock level correctly:
// max will be 100 → high=100 (100%), medium=50 (50%), low=0 (0%)
function mockCount(pointId: string): number {
  const level = mockPointIntensity(pointId)
  return level === 'high' ? 100 : level === 'medium' ? 50 : 0
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
  points:      GeoPoint[]
  activeNow?:  Record<string, number>  // pointId → active visitor count; omit to use mock
  showPoints?: boolean                 // render pin markers; default true
}

export default function GpsIntensityMap({ points, activeNow, showPoints = true }: GpsIntensityMapProps) {
  const resolvedActiveNow: Record<string, number> = {}
  points.forEach((p) => {
    resolvedActiveNow[p.id] = activeNow !== undefined
      ? (activeNow[p.id] ?? 0)
      : mockCount(p.id)
  })

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
        url={getMapTileUrl('toner')}
        attribution={MAP_ATTRIBUTION}
        maxZoom={20}
      />
      <FitBounds points={points} />
      <IntensityLayer points={points} activeNow={resolvedActiveNow} />
      {showPoints && points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createGeoIcon(false, point.active, false, getPointCoverImage(point))}
        />
      ))}
    </MapContainer>
  )
}
