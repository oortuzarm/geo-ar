import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet'
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

// ── InvalidateMapSize ─────────────────────────────────────────────────────────
// Inside an iframe the map container may have size 0 at mount time.
// invalidateSize() forces Leaflet to recompute tile layout.

function InvalidateMapSize() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)

    // ResizeObserver covers iframe resize without a window resize event
    let ro: ResizeObserver | null = null
    const container = map.getContainer()
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => map.invalidateSize())
      ro.observe(container)
    }

    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [map])
  return null
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
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000, padding: '12px' }}>
      <div style={{
        background: 'rgba(17,24,39,0.96)',
        border: '1px solid rgba(75,85,99,0.8)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        backdropFilter: 'blur(8px)',
      }}>
        {point.image && (
          <img
            src={point.image}
            alt={point.name}
            style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0, background: '#374151' }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: '#f3f4f6', fontSize: 14, lineHeight: 1.3, margin: 0 }}>
            {point.name}
          </p>
          {point.description && (
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, lineHeight: 1.6, margin: '4px 0 0' }}>
              {point.description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{ flexShrink: 0, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2 }}
        >
          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

// These inline styles ensure the map fills the iframe regardless of host-page
// CSS resets or Tailwind dark-mode overrides.
const ROOT_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  fontFamily: 'system-ui, sans-serif',
}

const MAP_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: '#e5e7eb', // light gray while tiles load — not black
}

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
      <div style={{ ...ROOT_STYLE, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !project) {
    return (
      <div style={{ ...ROOT_STYLE, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <p style={{ color: '#111827', fontWeight: 600, marginBottom: 8 }}>
            {error === 'not-found' ? 'Experiencia no encontrada' : 'Error al cargar'}
          </p>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
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
    <div style={ROOT_STYLE}>
      <MapContainer
        center={centerOf(points)}
        zoom={points.length > 0 ? 14 : 13}
        style={MAP_STYLE}
        zoomControl
        attributionControl
      >
        {/* Light OSM basemap — clearly visible in any context */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {/* Recalculate tile grid after iframe layout settles */}
        <InvalidateMapSize />

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
        style={{
          position: 'absolute', top: 12, right: 12, zIndex: 1000,
          width: 36, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.95)',
          border: userLocation ? '1.5px solid #0ea5e9' : '1.5px solid #d1d5db',
          color: userLocation ? '#0ea5e9' : '#6b7280',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}
      >
        <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        style={{
          position: 'absolute', bottom: 8, left: 8, zIndex: 1000,
          fontSize: 10, color: '#9ca3af', textDecoration: 'none',
          background: 'rgba(255,255,255,0.8)',
          padding: '2px 6px', borderRadius: 4,
          transition: 'color 0.15s',
        }}
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
