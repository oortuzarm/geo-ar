import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { haversineDistance } from '../../features/geolocation/haversine'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useGeoStore } from '../../store/geoStore'
import PublicPointCard from './PublicPointCard'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject, GeoPoint } from '../../types'

// Syncs map when user location changes
function UserLocationMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.panTo([lat, lng], { animate: true }) }, [lat, lng, map])

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width: 16px; height: 16px; border-radius: 50%;
      background: #3b82f6; border: 3px solid white;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
  return <Marker position={[lat, lng]} icon={icon} />
}

export default function PublicPage() {
  const { id } = useParams<{ id: string }>()
  const { userLocation, locationStatus } = useGeoStore()
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [distances, setDistances] = useState<Record<string, number>>({})

  // Start watching GPS
  useGeolocation(true)

  // Load project
  useEffect(() => {
    if (!id) return
    Promise.all([
      geoProjectsApi.fetchProject(id),
      geoPointsApi.listPoints(id),
    ]).then(([proj, pts]) => {
      if (!proj) return
      setProject(proj)
      const activePoints = pts.filter((p) => p.active)
      setPoints(activePoints)
      if (activePoints.length > 0) setSelectedPointId(activePoints[0].id)
      setLoading(false)
    })
  }, [id])

  // Recalculate distances when user location updates
  useEffect(() => {
    if (!userLocation) return
    const newDist: Record<string, number> = {}
    for (const pt of points) {
      newDist[pt.id] = haversineDistance(
        userLocation.latitude, userLocation.longitude,
        pt.latitude, pt.longitude,
      )
    }
    setDistances(newDist)
  }, [userLocation, points])

  function handleActivate(point: GeoPoint) {
    const dist = distances[point.id] ?? Infinity
    if (dist <= point.activationRadius) {
      window.open(point.lookiarUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Proyecto no encontrado.</p>
      </div>
    )
  }

  const mapCenter: [number, number] =
    userLocation
      ? [userLocation.latitude, userLocation.longitude]
      : points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [-33.4489, -70.6693]

  const locationBadge = () => {
    if (locationStatus === 'requesting') return (
      <span className="flex items-center gap-1 text-xs text-yellow-400">
        <span className="animate-pulse-slow">●</span> Obteniendo ubicación...
      </span>
    )
    if (locationStatus === 'denied' || locationStatus === 'unavailable') return (
      <span className="flex items-center gap-1 text-xs text-red-400">
        <span>●</span> Ubicación no disponible
      </span>
    )
    if (locationStatus === 'active') return (
      <span className="flex items-center gap-1 text-xs text-green-400">
        <span>●</span> Ubicación activa
      </span>
    )
    return null
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Map fills the screen */}
      <div className="flex-1 relative">
        <MapContainer center={mapCenter} zoom={15} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <UserLocationMarker lat={userLocation.latitude} lng={userLocation.longitude} />
          )}
          {points.map((pt) => (
            <Circle
              key={pt.id}
              center={[pt.latitude, pt.longitude]}
              radius={pt.activationRadius}
              pathOptions={{
                color: pt.id === selectedPointId ? '#0ea5e9' : '#ef4444',
                fillColor: pt.id === selectedPointId ? '#0ea5e9' : '#ef4444',
                fillOpacity: 0.1,
                weight: 2,
              }}
              eventHandlers={{ click: () => setSelectedPointId(pt.id) }}
            />
          ))}
        </MapContainer>

        {/* Location status overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400]
                       bg-gray-900/95 border border-gray-700 rounded-full px-4 py-1.5 shadow-lg">
          {locationBadge()}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="flex-shrink-0 bg-gray-950 border-t border-gray-800 px-4 pt-3 pb-safe max-h-[55vh] overflow-y-auto">
        {/* Project header */}
        <div className="flex items-start gap-3 mb-3">
          {project.coverImage && (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-100 text-base leading-tight">{project.title}</h1>
            {project.subtitle && (
              <p className="text-sm text-gray-400 mt-0.5">{project.subtitle}</p>
            )}
          </div>
        </div>

        {/* Points list */}
        <div className="space-y-2 pb-4">
          {points.map((pt) => (
            <PublicPointCard
              key={pt.id}
              point={pt}
              distance={distances[pt.id] ?? null}
              isSelected={pt.id === selectedPointId}
              onSelect={() => setSelectedPointId(pt.id)}
              onActivate={() => handleActivate(pt)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
