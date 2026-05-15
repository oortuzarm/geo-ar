import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import type { GeoPoint } from '../../types'

/**
 * Read-only map for the workspace overview.
 * Reuses the existing createGeoIcon factory for visual consistency.
 * Markers are NOT draggable — this is a display-only component.
 * Fits the viewport to all visible points on mount.
 */

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

export interface WorkspaceMapProps {
  points: GeoPoint[]
  onMarkerClick?: (id: string) => void
}

export default function WorkspaceMap({ points, onMarkerClick }: WorkspaceMapProps) {
  return (
    <MapContainer
      center={[-33.4489, -70.6693]}
      zoom={11}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', background: '#111827', zIndex: 0 }}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createGeoIcon(false, point.active, false, point.image)}
          draggable={false}
          eventHandlers={
            onMarkerClick ? { click: () => onMarkerClick(point.id) } : undefined
          }
        />
      ))}
    </MapContainer>
  )
}
