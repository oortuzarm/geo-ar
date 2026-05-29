import { useEffect } from 'react'
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import type { GeoPoint } from '../../types'

/**
 * Read-only map for the workspace overview.
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
  points:          GeoPoint[]
  onMarkerClick?:  (id: string) => void
  hoveredPointId?: string | null
}

export default function WorkspaceMap({ points, onMarkerClick, hoveredPointId = null }: WorkspaceMapProps) {
  const hoveredPoint = hoveredPointId ? points.find((p) => p.id === hoveredPointId) ?? null : null
  const anyHovered   = hoveredPointId !== null

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

      {/* Subtle glow circle on the hovered point */}
      {hoveredPoint && (
        <Circle
          center={[hoveredPoint.latitude, hoveredPoint.longitude]}
          radius={Math.min(hoveredPoint.activationRadius, 1000) * 1.5}
          pathOptions={{
            color:       '#38bdf8',   // sky-400
            fillColor:   '#38bdf8',
            fillOpacity: 0.10,
            weight:      1.5,
            opacity:     0.55,
            interactive: false,
          }}
        />
      )}

      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createGeoIcon(
            point.id === hoveredPointId,
            point.active,
            false,
            getPointCoverImage(point),
          )}
          opacity={anyHovered && point.id !== hoveredPointId ? 0.35 : 1}
          draggable={false}
          eventHandlers={
            onMarkerClick ? { click: () => onMarkerClick(point.id) } : undefined
          }
        />
      ))}
    </MapContainer>
  )
}
