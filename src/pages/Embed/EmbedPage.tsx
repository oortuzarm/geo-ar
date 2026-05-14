import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import PublicPointMarker from '../../components/map/PublicPointMarker'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { useGeoStore } from '../../store/geoStore'
import { useGeolocation } from '../../hooks/useGeolocation'
import { ApiError } from '../../lib/apiFetch'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject, GeoPoint } from '../../types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function centerOf(points: GeoPoint[]): [number, number] {
  if (points.length === 0) return [-34.6037, -58.3816]
  return [
    points.reduce((s, p) => s + p.latitude, 0) / points.length,
    points.reduce((s, p) => s + p.longitude, 0) / points.length,
  ]
}

// ── User location dot ─────────────────────────────────────────────────────────

function UserDot({ lat, lng }: { lat: number; lng: number }) {
  return (
    <CircleMarker
      center={[lat, lng]}
      radius={8}
      pathOptions={{ color: '#0ea5e9', fillColor: '#38bdf8', fillOpacity: 0.9, weight: 2 }}
    />
  )
}

// ── Point info panel ──────────────────────────────────────────────────────────

function PointPanel({ point, onClose }: { point: GeoPoint; onClose: () => void }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] p-3">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-4
                      shadow-2xl flex items-start gap-3">
        {point.image && (
          <img
            src={point.image}
            alt={point.name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-800"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-100 text-sm leading-tight">{point.name}</p>
          {point.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-3 leading-relaxed">
              {point.description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors mt-0.5"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EmbedPage() {
  const { projectId }  = useParams<{ projectId: string }>()
  const { userLocation, setUserLocation } = useGeoStore()

  const [project,    setProject]    = useState<GeoProject | null>(null)
  const [points,     setPoints]     = useState<GeoPoint[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [geoActive,  setGeoActive]  = useState(false)

  useGeolocation(geoActive)

  useEffect(() => {
    if (!projectId) { setError('not-found'); setLoading(false); return }

    Promise.all([
      geoProjectsApi.fetchPublicProject(projectId),
      geoPointsApi.listPublicPoints(projectId),
    ])
      .then(([proj, pts]) => {
        if (!proj) { setError('not-found'); setLoading(false); return }
        setProject(proj)
        setPoints(pts.filter((p) => p.active))
        setLoading(false)
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'not-found' : 'fetch-error')
        } else {
          setError('fetch-error')
        }
        setLoading(false)
      })

    return () => { setUserLocation(null, 'idle' as never) }
  }, [projectId, setUserLocation])

  const selectedPoint = points.find((p) => p.id === selectedId) ?? null

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ height: '100dvh' }}
        className="bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !project) {
    return (
      <div style={{ height: '100dvh' }}
        className="bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-xs">
          <p className="text-gray-300 font-medium mb-1">
            {error === 'not-found' ? 'Experiencia no encontrada' : 'Error al cargar'}
          </p>
          <p className="text-sm text-gray-500">
            {error === 'not-found'
              ? 'Este proyecto no existe o no está publicado.'
              : 'No se pudo cargar la experiencia. Intentá de nuevo más tarde.'}
          </p>
        </div>
      </div>
    )
  }

  // ── Map ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <MapContainer
        center={centerOf(points)}
        zoom={points.length > 0 ? 14 : 13}
        style={{ width: '100%', height: '100%' }}
        zoomControl
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {points.map((p) => (
          <PublicPointMarker
            key={p.id}
            point={p}
            selected={selectedId === p.id}
            dimmed={selectedId !== null && selectedId !== p.id}
            onClick={() => setSelectedId((prev) => (prev === p.id ? null : p.id))}
          />
        ))}

        {userLocation && (
          <UserDot lat={userLocation.latitude} lng={userLocation.longitude} />
        )}
      </MapContainer>

      {/* Geolocate button */}
      <button
        onClick={() => setGeoActive(true)}
        title="Ubicarme"
        aria-label="Activar mi ubicación"
        className={[
          'absolute top-3 right-3 z-[1000] w-9 h-9 rounded-xl flex items-center justify-center',
          'bg-gray-900/90 backdrop-blur-sm border shadow-lg transition-colors',
          userLocation
            ? 'border-brand-500 text-brand-400'
            : 'border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500',
        ].join(' ')}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Attribution / branding */}
      <a
        href="https://ubyca.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 left-2 z-[1000] text-[10px] text-gray-600
                   hover:text-gray-400 transition-colors bg-gray-950/70 px-2 py-0.5 rounded"
      >
        Powered by Ubyca
      </a>

      {/* Point info panel */}
      {selectedPoint && (
        <PointPanel
          point={selectedPoint}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
