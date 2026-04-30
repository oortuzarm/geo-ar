import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { ApiError } from '../../lib/apiFetch'
import { haversineDistance } from '../../features/geolocation/haversine'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useGeoStore } from '../../store/geoStore'
import PublicPointCard from './PublicPointCard'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject, GeoPoint } from '../../types'

type LoadError = 'not-found' | 'not-published' | 'fetch-error' | 'timeout' | null

const LOAD_TIMEOUT_MS = 10_000

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

function ErrorScreen({ error, id }: { error: LoadError; id?: string }) {
  const navigate = useNavigate()

  const messages: Record<NonNullable<LoadError>, { title: string; body: string }> = {
    'not-found': {
      title: 'Proyecto no disponible',
      body: 'Este proyecto no existe o el enlace es incorrecto.',
    },
    'not-published': {
      title: 'Proyecto no publicado',
      body: 'Este proyecto existe, pero aún no ha sido publicado. El creador debe publicarlo desde el editor antes de compartir este enlace.',
    },
    'fetch-error': {
      title: 'Error al cargar',
      body: 'Hubo un problema al intentar cargar el proyecto. Intenta recargar la página.',
    },
    'timeout': {
      title: 'No se pudo cargar la experiencia',
      body: 'La carga tardó demasiado. Revisa tu conexión y que el proyecto esté publicado correctamente.',
    },
  }

  const msg = error ? messages[error] : null
  if (!msg) return null

  const isNotPublished = error === 'not-published'

  return (
    <div className="h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isNotPublished ? 'bg-yellow-900/40' : 'bg-red-900/40'
        }`}>
          {isNotPublished ? (
            <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h2 className="text-base font-semibold text-gray-100 mb-2">{msg.title}</h2>
        <p className="text-sm text-gray-400 leading-relaxed">{msg.body}</p>
        {id && (
          <p className="mt-4 text-xs text-gray-600 font-mono break-all">id: {id}</p>
        )}
        <div className="mt-5 flex flex-col items-center gap-3">
          {isNotPublished && id && (
            <button
              className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white text-sm
                         font-medium rounded-lg transition-colors"
              onClick={() => navigate(`/project/${id}`)}
            >
              Ir al editor
            </button>
          )}
          <button
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PublicPage() {
  const { id } = useParams<{ id: string }>()
  const { userLocation, locationStatus } = useGeoStore()
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<LoadError>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [distances, setDistances] = useState<Record<string, number>>({})
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useGeolocation(true)

  useEffect(() => {
    if (!id) {
      console.error('[PublicPage] No hay id en la URL')
      setLoadError('not-found')
      setLoading(false)
      return
    }

    // Safety timeout — no infinite spinner
    timeoutRef.current = setTimeout(() => {
      console.error(
        `[PublicPage] Timeout de ${LOAD_TIMEOUT_MS}ms al cargar proyecto id="${id}".`,
        'Posible causa: proyecto creado en otro navegador/dispositivo (IndexedDB es local).',
      )
      setLoadError('timeout')
      setLoading(false)
    }, LOAD_TIMEOUT_MS)

    Promise.all([
      geoProjectsApi.fetchPublicProject(id),
      geoPointsApi.listPoints(id),
    ])
      .then(([proj, pts]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        if (!proj) {
          console.error(`[PublicPage] Proyecto id="${id}" no encontrado.`)
          setLoadError('not-found')
          setLoading(false)
          return
        }

        const activePoints = pts.filter((p) => p.active)
        console.info(
          `[PublicPage] Proyecto cargado: "${proj.title}"`,
          `| Puntos totales: ${pts.length}`,
          `| Puntos activos: ${activePoints.length}`,
        )
        if (activePoints.length === 0) {
          console.warn('[PublicPage] El proyecto no tiene puntos activos.')
        }

        setProject(proj)
        setPoints(activePoints)
        if (activePoints.length > 0) setSelectedPointId(activePoints[0].id)
        setLoading(false)
      })
      .catch((err) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        console.error('[PublicPage] Error al cargar el proyecto:', err)

        if (err instanceof ApiError) {
          if (err.status === 404) { setLoadError('not-found'); setLoading(false); return }
          if (err.status === 403) { setLoadError('not-published'); setLoading(false); return }
        }

        setLoadError('fetch-error')
        setLoading(false)
      })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [id])

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
      <div className="h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-gray-500">Cargando experiencia…</p>
      </div>
    )
  }

  if (loadError) {
    return <ErrorScreen error={loadError} id={id} />
  }

  if (!project) {
    return <ErrorScreen error="not-found" id={id} />
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
        <span className="animate-pulse">●</span> Obteniendo ubicación…
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

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400]
                       bg-gray-900/95 border border-gray-700 rounded-full px-4 py-1.5 shadow-lg">
          {locationBadge()}
        </div>
      </div>

      <div className="flex-shrink-0 bg-gray-950 border-t border-gray-800 px-4 pt-3 pb-4 max-h-[55vh] overflow-y-auto">
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

        {points.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Este proyecto no tiene puntos activos aún.
          </p>
        ) : (
          <div className="space-y-2 pb-2">
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
        )}
      </div>
    </div>
  )
}
