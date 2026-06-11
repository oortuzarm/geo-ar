/**
 * GeoPointLanding — shared full-page landing experience for a single GeoPoint.
 *
 * Used by:
 *   • SmartLinkPublicPage (go.ubyca.com)  — validation via validatePublicSmartLink
 *   • PublicPage (/public/:id?point=:id)  — validation via requestPointAccess
 *
 * The parent page owns the validation logic; this component only renders it.
 * ValidationState.unlocked carries an onActivate callback so each page can
 * decide what to do when the user presses the CTA (open URL, show media, etc.).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode }                        from 'react'
import { MapContainer, Marker, Circle, Polygon, useMap } from 'react-leaflet'
import L                                         from 'leaflet'
import { haversineDistance, formatDistance }     from '../../features/geolocation/haversine'
import { computePointAvailability }              from '../../features/geolocation/availability'
import { getPointGalleryImages }                 from '../../lib/pointImageUtils'
import PointImageCarousel                        from './PointImageCarousel'
import PublicPointMarker                         from '../map/PublicPointMarker'
import RoutePolyline                             from '../map/RoutePolyline'
import BaseMapLayer                              from '../map/BaseMapLayer'
import { fetchWalkingRoute, formatDuration }     from '../../features/routing/orsClient'
import { StatusChip, ScheduleDetail, QuotaDetail } from '../availability/AvailabilityChips'
import { extractYouTubeId }                       from '../../lib/videoUtils'
import { getLiveVisitSessionId }                  from '../../utils/liveVisits'
import { fetchSessionVisitedPoints }              from '../../services/geoPointsApi'
import type { GeoProject, GeoPoint }             from '../../types'

// ── Validation state machine ──────────────────────────────────────────────────

export type ValidationState =
  | { phase: 'idle' }
  | { phase: 'requesting' }
  | { phase: 'validating' }
  | { phase: 'unlocked'; matchedGeoPointId: string; onActivate: () => void }
  | { phase: 'blocked';  message: string }
  | { phase: 'location_error' }

// ── Inline spinner ────────────────────────────────────────────────────────────

function Spin({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'sm'
    ? 'w-4 h-4 border-2 border-white/30 border-t-white'
    : 'w-5 h-5 border-2 border-gray-300 border-t-gray-600'
  return <span className={`${cls} rounded-full animate-spin inline-block`} />
}

// ── Availability badge ────────────────────────────────────────────────────────

function AvailabilityBadge({ validation }: { validation: ValidationState }) {
  if (validation.phase === 'unlocked') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-emerald-50 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
        <span className="text-xs font-semibold text-emerald-700">Disponible</span>
      </span>
    )
  }
  if (validation.phase === 'blocked') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-amber-50 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="text-xs font-semibold text-amber-700">No disponible</span>
      </span>
    )
  }
  if (validation.phase === 'location_error') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-gray-100 border border-gray-200">
        <span className="text-xs leading-none">📍</span>
        <span className="text-xs font-semibold text-gray-500">Sin ubicación</span>
      </span>
    )
  }
  if (validation.phase === 'requesting') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-gray-100 border border-gray-200">
        <Spin size="sm" />
        <span className="text-xs font-semibold text-gray-500">Obteniendo ubicación…</span>
      </span>
    )
  }
  if (validation.phase === 'validating') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-gray-100 border border-gray-200">
        <Spin size="sm" />
        <span className="text-xs font-semibold text-gray-500">Verificando…</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                     bg-gray-100 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
      <span className="text-xs font-semibold text-gray-500">Verificar ubicación</span>
    </span>
  )
}

// ── User location Leaflet icon ────────────────────────────────────────────────

const USER_DOT_ICON = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#3B82F6;border:2.5px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.25)"></div>',
  iconSize:   [14, 14],
  iconAnchor: [7, 7],
})

// ── BoundsController ─────────────────────────────────────────────────────────

const MAP_BOUNDS_OPTIONS: L.FitBoundsOptions = { padding: [48, 48], maxZoom: 16 }

function BoundsController({
  bounds,
  resetKey,
  userLocation,
}: {
  bounds:       L.LatLngBounds | null
  resetKey:     number
  userLocation: { latitude: number; longitude: number } | null
}) {
  const map = useMap()
  // True once we have expanded the view to include user location.
  // Reset when bounds/resetKey change so the expansion re-runs after each overview reset.
  const locationFittedRef = useRef(false)

  // Primary fit: the selected point's activation area (on mount, bounds change, or reset).
  useEffect(() => {
    if (!bounds) return
    locationFittedRef.current = false
    const raf = requestAnimationFrame(() => {
      map.invalidateSize()
      map.fitBounds(bounds, MAP_BOUNDS_OPTIONS)
    })
    return () => cancelAnimationFrame(raf)
  }, [map, bounds, resetKey])

  // Secondary fit: expand once to include user location when GPS first becomes available.
  // After the first expansion locationFittedRef stays true so GPS drift never re-triggers this.
  useEffect(() => {
    if (!bounds) return
    if (locationFittedRef.current) return
    if (!userLocation) return
    locationFittedRef.current = true
    const expanded = L.latLngBounds(bounds.getSouthWest(), bounds.getNorthEast())
    expanded.extend([userLocation.latitude, userLocation.longitude])
    requestAnimationFrame(() => {
      map.fitBounds(expanded, { ...MAP_BOUNDS_OPTIONS, animate: true })
    })
  }, [map, bounds, userLocation]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── UserFlyController ─────────────────────────────────────────────────────────

function UserFlyController({
  centeredOnUser,
  userLocation,
}: {
  centeredOnUser: boolean
  userLocation:   { latitude: number; longitude: number } | null
}) {
  const map = useMap()
  const prevRef = useRef(false)

  useEffect(() => {
    const wasAlreadyCentered = prevRef.current
    prevRef.current = centeredOnUser
    if (centeredOnUser && !wasAlreadyCentered && userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], 17, { animate: true })
    }
  }, [map, centeredOnUser, userLocation])

  return null
}

// ── SizeController ────────────────────────────────────────────────────────────

function SizeController({ isExpanded }: { isExpanded: boolean }) {
  const map = useMap()
  const prevRef = useRef(isExpanded)

  useEffect(() => {
    if (isExpanded === prevRef.current) return
    prevRef.current = isExpanded

    const center = map.getCenter()
    const zoom   = map.getZoom()

    const timer = setTimeout(() => {
      map.invalidateSize({ animate: false })
      map.setView(center, zoom, { animate: false })
    }, 50)

    return () => clearTimeout(timer)
  }, [map, isExpanded])

  return null
}

// ── Map mode type ─────────────────────────────────────────────────────────────

type MapMode = 'all' | 'location' | 'follow'

// ── computePointActivationBounds ──────────────────────────────────────────────

function computePointActivationBounds(point: GeoPoint): L.LatLngBounds {
  if (point.activationMode === 'polygon' && point.activationPolygon) {
    const geom = point.activationPolygon.geometry
    const rings: number[][][] =
      geom.type === 'Polygon'
        ? (geom.coordinates as number[][][])
        : geom.type === 'MultiPolygon'
          ? (geom.coordinates as number[][][][]).flat()
          : []
    const latLngs: [number, number][] = []
    for (const ring of rings) {
      for (const pos of ring) latLngs.push([pos[1], pos[0]])
    }
    if (latLngs.length > 0) return L.latLngBounds(latLngs)
  }
  const { latitude: lat, longitude: lng, activationRadius: r } = point
  const dLat = r / 111_320
  const dLng = r / (111_320 * Math.cos(lat * Math.PI / 180))
  return L.latLngBounds([lat - dLat, lng - dLng], [lat + dLat, lng + dLng])
}

// ── ActivationZone ────────────────────────────────────────────────────────────

const ZONE_STYLE = {
  color:       '#3B82F6',
  fillColor:   '#3B82F6',
  fillOpacity: 0.08,
  weight:      1.5,
  opacity:     0.35,
} as const

function ActivationZone({ point }: { point: GeoPoint }) {
  if (point.activationMode === 'polygon' && point.activationPolygon) {
    const geom = point.activationPolygon.geometry
    const rings: number[][][] =
      geom.type === 'Polygon'
        ? (geom.coordinates as number[][][])
        : geom.type === 'MultiPolygon'
          ? (geom.coordinates as number[][][][]).flat()
          : []
    if (rings.length === 0) return null
    // GeoJSON uses [lng, lat]; Leaflet <Polygon> expects [lat, lng]
    const positions = rings.map((ring) => ring.map((pos): [number, number] => [pos[1], pos[0]]))
    return <Polygon positions={positions} pathOptions={ZONE_STYLE} />
  }
  return (
    <Circle
      center={[point.latitude, point.longitude]}
      radius={point.activationRadius}
      pathOptions={ZONE_STYLE}
    />
  )
}

// ── PointActivationController ─────────────────────────────────────────────────

function PointActivationController({
  points, selectedPointId,
}: {
  points:          GeoPoint[]
  selectedPointId: string | null
}) {
  const map       = useMap()
  const mounted   = useRef(false)
  const pointsRef = useRef(points)
  useEffect(() => { pointsRef.current = points }, [points])

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    if (!selectedPointId) return
    const pt = pointsRef.current.find((p) => p.id === selectedPointId)
    if (!pt) return
    const bounds = computePointActivationBounds(pt)
    requestAnimationFrame(() => {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 17, animate: true })
    })
  }, [map, selectedPointId])

  return null
}

// ── FollowRouteController ─────────────────────────────────────────────────────

function FollowRouteController({
  active, userLat, userLng, selectedPoint,
}: {
  active:        boolean
  userLat:       number | undefined
  userLng:       number | undefined
  selectedPoint: GeoPoint | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!active || userLat === undefined || userLng === undefined || !selectedPoint) return
    const bounds = L.latLngBounds(
      [userLat, userLng],
      [selectedPoint.latitude, selectedPoint.longitude],
    )
    map.fitBounds(bounds, { padding: [64, 64], maxZoom: 16, animate: true })
  }, [map, active, userLat, userLng, selectedPoint?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── LandingMap ────────────────────────────────────────────────────────────────

interface LandingMapProps {
  points:          GeoPoint[]
  selectedPointId: string | null
  userLocation:    { latitude: number; longitude: number } | null
  onSelectPoint:   (id: string) => void
  routeLatLngs:    [number, number][] | null
}

function LandingMap({
  points, selectedPointId, userLocation, onSelectPoint, routeLatLngs,
}: LandingMapProps) {
  const [mapMode,       setMapMode]       = useState<MapMode>('all')
  const [boundsResetKey, setBoundsResetKey] = useState(0)

  const selectedPoint  = points.find((p) => p.id === selectedPointId) ?? null
  const userLat        = userLocation?.latitude
  const userLng        = userLocation?.longitude

  const [isExpanded, setIsExpanded] = useState(false)

  function handleLocationToggle() {
    if (mapMode === 'follow') setBoundsResetKey((k) => k + 1)
    setMapMode((mode) => {
      if (mode === 'all')      return 'location'
      if (mode === 'location') return 'follow'
      return 'all'
    })
  }

  // Capture the initial selected point ID once so subsequent user-driven point
  // selections (handled by PointActivationController) don't reset the overview bounds.
  const initialSelectedIdRef = useRef(selectedPointId)

  // Overview bounds: the initial main point's activation area.
  // Intentionally does NOT include selectedPointId in deps — the overview always
  // frames the point that was deep-linked (or points[0]), not the one the user
  // tapped later. userLocation expansion is handled inside BoundsController.
  const initialBounds = useMemo(() => {
    const mainPoint =
      points.find((p) => p.id === initialSelectedIdRef.current) ??
      points[0] ??
      null
    if (!mainPoint) return null
    return computePointActivationBounds(mainPoint)
  }, [points]) // eslint-disable-line react-hooks/exhaustive-deps

  if (points.length === 0) return null

  const center = initialBounds
    ? ([initialBounds.getCenter().lat, initialBounds.getCenter().lng] as [number, number])
    : ([points[0].latitude, points[0].longitude] as [number, number])

  const btnCls = 'w-10 h-10 flex items-center justify-center bg-white rounded-full ' +
                 'border border-gray-200/60 shadow-md transition-all duration-150 ' +
                 'active:scale-95 hover:shadow-lg'

  return (
    <div className={isExpanded
      ? 'fixed inset-0 z-[9999] bg-white'
      : 'relative h-full w-full'
    }>
      <MapContainer
        center={center}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <BaseMapLayer styleId="streets" />
        <BoundsController bounds={initialBounds} resetKey={boundsResetKey} userLocation={userLocation} />
        <UserFlyController centeredOnUser={mapMode === 'location'} userLocation={userLocation} />
        <PointActivationController points={points} selectedPointId={selectedPointId} />
        <FollowRouteController
          active={mapMode === 'follow'}
          userLat={userLat}
          userLng={userLng}
          selectedPoint={selectedPoint}
        />
        <SizeController isExpanded={isExpanded} />

        {selectedPoint && (
          <>
            <ActivationZone point={selectedPoint} />
            <PublicPointMarker
              key={selectedPoint.id}
              point={selectedPoint}
              selected
              dimmed={false}
              onClick={() => onSelectPoint(selectedPoint.id)}
              small
            />
          </>
        )}

        {routeLatLngs && routeLatLngs.length >= 2 && (
          <RoutePolyline latLngs={routeLatLngs} />
        )}

        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={USER_DOT_ICON}
            zIndexOffset={2000}
          />
        )}
      </MapContainer>

      {userLocation && (
        <button
          onClick={handleLocationToggle}
          className={`absolute right-2 bottom-2 z-[450] ${btnCls}`}
          title={
            mapMode === 'all'      ? 'Mi ubicación' :
            mapMode === 'location' ? 'Seguir ruta'  : 'Mostrar todos'
          }
          aria-label={
            mapMode === 'all'      ? 'Mi ubicación' :
            mapMode === 'location' ? 'Seguir ruta'  : 'Mostrar todos'
          }
        >
          {mapMode === 'all' && (
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L4 22 L12 17.5 L20 22 Z" />
            </svg>
          )}
          {mapMode === 'location' && (
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M22 12h-4M2 12h4M12 2v4M12 18v4" />
            </svg>
          )}
          {mapMode === 'follow' && (
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9V5h4M15 5h4v4M15 19h4v-4M5 15v4h4" />
            </svg>
          )}
        </button>
      )}

      <button
        onClick={() => setIsExpanded((e) => !e)}
        className={`absolute left-2 bottom-2 z-[450] ${btnCls}`}
        title={isExpanded ? 'Reducir mapa' : 'Ampliar mapa'}
        aria-label={isExpanded ? 'Reducir mapa' : 'Ampliar mapa'}
      >
        {isExpanded ? (
          <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
          </svg>
        )}
      </button>
    </div>
  )
}

// ── CTA button ────────────────────────────────────────────────────────────────

function CTAButton({
  validation,
  selectedPoint,
  onContinue,
  collectionBlocked = false,
}: {
  validation:        ValidationState
  selectedPoint:     GeoPoint | null
  onContinue:        () => void
  collectionBlocked?: boolean
}) {
  const busy    = validation.phase === 'requesting' || validation.phase === 'validating'
  const ctaText = selectedPoint?.buttonText || 'Acceder al contenido'

  if (validation.phase === 'unlocked') {
    return (
      <button
        onClick={validation.onActivate}
        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold
                   rounded-2xl text-[15px] transition-all active:scale-[0.98]
                   shadow-lg shadow-brand-900/30"
      >
        {ctaText}
      </button>
    )
  }

  if (collectionBlocked) {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-100 text-gray-400 font-bold
                   rounded-2xl text-[15px] border border-gray-200
                   cursor-not-allowed shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      >
        {ctaText}
      </button>
    )
  }

  if (validation.phase === 'blocked') {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-100 text-gray-400 font-bold
                   rounded-2xl text-[15px] border border-gray-200
                   cursor-not-allowed shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      >
        {ctaText}
      </button>
    )
  }

  if (validation.phase === 'location_error') {
    return (
      <button
        onClick={onContinue}
        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold
                   rounded-2xl text-[15px] transition-all active:scale-[0.98]"
      >
        Reintentar ubicación
      </button>
    )
  }

  const label =
    validation.phase === 'requesting' ? 'Obteniendo ubicación…' :
    validation.phase === 'validating' ? 'Verificando…'          :
                                        'Permitir ubicación'

  return (
    <button
      onClick={onContinue}
      disabled={busy}
      className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold
                 rounded-2xl text-[15px] transition-all active:scale-[0.98]
                 disabled:opacity-70 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2.5"
    >
      {busy && <Spin size="sm" />}
      {label}
    </button>
  )
}

// ── GeoPointLanding ───────────────────────────────────────────────────────────

export interface GeoPointLandingProps {
  /** The point to focus on initially. Falls back to points[0] if null or not found. */
  initialPointId: string | null
  project:        GeoProject | null
  points:         GeoPoint[]
  validation:     ValidationState
  userLocation:   { latitude: number; longitude: number } | null
  liveVisitsMap:  Record<string, number>
  onContinue:     () => void
}

export default function GeoPointLanding({
  initialPointId, project, points, validation, userLocation, liveVisitsMap, onContinue,
}: GeoPointLandingProps) {

  const [selectedPointId, setSelectedPointId] = useState<string | null>(initialPointId)

  useEffect(() => {
    if (points.length === 0) return
    const isValid = points.some((p) => p.id === selectedPointId)
    if (!isValid) setSelectedPointId(points[0].id)
  }, [points, selectedPointId])

  useEffect(() => {
    if (validation.phase === 'unlocked') {
      setSelectedPointId(validation.matchedGeoPointId)
    }
  }, [validation])

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedPointId) ?? points[0] ?? null,
    [points, selectedPointId],
  )

  const effectiveLogo = selectedPoint?.pointLogoUrl
    ? { url: selectedPoint.pointLogoUrl, zoom: selectedPoint.pointLogoZoom ?? 1, posX: selectedPoint.pointLogoPositionX ?? 0, posY: selectedPoint.pointLogoPositionY ?? 0 }
    : project?.projectLogoUrl
    ? { url: project.projectLogoUrl, zoom: project.projectLogoZoom ?? 1, posX: project.projectLogoPositionX ?? 0, posY: project.projectLogoPositionY ?? 0 }
    : null

  const heroImages = useMemo(
    () => (selectedPoint ? getPointGalleryImages(selectedPoint) : []),
    [selectedPoint],
  )

  const distance = useMemo(() => {
    if (!userLocation || !selectedPoint) return null
    return haversineDistance(
      userLocation.latitude, userLocation.longitude,
      selectedPoint.latitude, selectedPoint.longitude,
    )
  }, [userLocation, selectedPoint])

  const avail = useMemo(
    () => selectedPoint
      ? computePointAvailability(
          selectedPoint,
          distance,
          userLocation,
          liveVisitsMap[selectedPoint.id],
        )
      : null,
    [selectedPoint, distance, userLocation, liveVisitsMap],
  )

  // Walking route (visual only)
  const [routeLatLngs,           setRouteLatLngs]           = useState<[number, number][] | null>(null)
  const [walkingDistanceMeters,  setWalkingDistanceMeters]  = useState<number | undefined>(undefined)
  const [walkingDurationSeconds, setWalkingDurationSeconds] = useState<number | undefined>(undefined)

  // ── Collection progress ───────────────────────────────────────────────────
  const [visitedPointIds,  setVisitedPointIds]  = useState<string[]>([])
  const [collectionLoaded, setCollectionLoaded] = useState(false)

  const collectionRequired = (selectedPoint?.requiredPointIds?.length ?? 0) > 0
  const collectionMet = !collectionRequired ||
    (selectedPoint?.requiredPointIds ?? []).every((id) => visitedPointIds.includes(id))
  const collectionNotMet = collectionLoaded && collectionRequired && !collectionMet

  useEffect(() => {
    if (!collectionRequired || !project?.id) {
      setCollectionLoaded(true)
      return
    }
    setCollectionLoaded(false)
    const sessionId = getLiveVisitSessionId()
    fetchSessionVisitedPoints(project.id, sessionId)
      .then(setVisitedPointIds)
      .catch(() => {})
      .finally(() => setCollectionLoaded(true))
  }, [selectedPoint?.id, project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const userLat = userLocation?.latitude
  const userLng = userLocation?.longitude

  useEffect(() => {
    if (userLat === undefined || userLng === undefined || !selectedPoint) {
      setRouteLatLngs(null)
      setWalkingDistanceMeters(undefined)
      setWalkingDurationSeconds(undefined)
      return
    }

    let cancelled = false

    fetchWalkingRoute(userLat, userLng, selectedPoint.latitude, selectedPoint.longitude)
      .then((result) => {
        if (!cancelled) {
          setRouteLatLngs(result.latLngs)
          setWalkingDistanceMeters(result.distanceMeters)
          setWalkingDurationSeconds(result.durationSeconds)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRouteLatLngs([
            [userLat, userLng],
            [selectedPoint.latitude, selectedPoint.longitude],
          ])
          setWalkingDistanceMeters(undefined)
          setWalkingDurationSeconds(undefined)
        }
      })

    return () => { cancelled = true }
  }, [selectedPoint?.id, userLat, userLng])

  const hasDirections = selectedPoint !== null
  const mapsUrl = selectedPoint
    ? `https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.latitude},${selectedPoint.longitude}&travelmode=walking`
    : null

  const hasOtherPts = points.length > 1
  const busy        = validation.phase === 'requesting' || validation.phase === 'validating'

  const [detailOpen, setDetailOpen] = useState(false)

  let locationLabel:   string   = 'Fuera del área'
  let locationVariant: 'ok' | 'warn' | 'block' | 'neutral' = 'block'
  let locationDetail:  ReactNode = null

  if (avail) {
    if (avail.insideArea) {
      locationLabel   = 'Dentro del área'
      locationVariant = 'ok'
    } else {
      locationLabel = avail.distanceToEdge !== null && avail.distanceToEdge > 0
        ? `Estás a ${formatDistance(avail.distanceToEdge)} del área`
        : 'Fuera del área'
      locationVariant = 'block'

      if (walkingDistanceMeters !== undefined && selectedPoint) {
        const walkToEdge = Math.max(0, walkingDistanceMeters - selectedPoint.activationRadius)
        locationDetail = (
          <p>
            {formatDistance(walkToEdge)} caminando
            {walkingDurationSeconds !== undefined && ` · ${formatDuration(walkingDurationSeconds)}`}
          </p>
        )
      }
    }
  }

  const hasAvailabilityDetail = avail !== null && (
    distance !== null ||
    avail.scheduleActive ||
    avail.quotaActive ||
    avail.liveVisitsActive ||
    Boolean(selectedPoint?.requiresDwellTime && selectedPoint.dwellTimeSeconds)
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Scrollable body ── */}
      <div className="flex-1 pb-56">

        {/* ── HERO ── */}
        <div className="relative w-full bg-gray-900 overflow-hidden" style={{ maxHeight: '320px' }}>
          {heroImages.length > 0 ? (
            <PointImageCarousel images={heroImages} />
          ) : (
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-brand-900 via-brand-800 to-gray-900" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-2/3
                          bg-gradient-to-t from-black/80 via-black/40 to-transparent
                          pointer-events-none" />
          <div className="absolute top-4 left-4 pointer-events-none">
            <img src="/logo-blanco.png" alt="Ubyca" className="h-5 opacity-75" />
          </div>
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pointer-events-none">
            <div className="flex items-end gap-3">
              {effectiveLogo && (
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0
                                bg-white ring-1 ring-black/10 mb-0.5">
                  <img
                    src={effectiveLogo.url}
                    alt={project?.title}
                    className="w-full h-full object-contain"
                    style={{ transform: `translate(${effectiveLogo.posX}%, ${effectiveLogo.posY}%) scale(${effectiveLogo.zoom})` }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {project && (
                  <p className="text-white/55 text-[10px] font-semibold uppercase tracking-widest
                                mb-0.5 line-clamp-1">
                    {project.title}
                  </p>
                )}
                <h1 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-sm">
                  {selectedPoint?.name || project?.title || 'Experiencia'}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATUS + MESSAGE ── */}
        <div className="px-4 pt-4 pb-1">
          <AvailabilityBadge validation={validation} />
          {validation.phase === 'location_error' && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Debes permitir el acceso a tu ubicación para continuar.
            </p>
          )}
          {validation.phase === 'idle' && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Esta experiencia requiere verificar tu ubicación.
            </p>
          )}
        </div>

        {/* ── DESCRIPCIÓN ── */}
        {selectedPoint?.description && (
          <div className="px-4 pt-1 pb-1">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedPoint.description}</p>
          </div>
        )}

        {/* ── DIRECCIÓN ── */}
        {selectedPoint?.instructions && (
          <div className="px-4 pt-2 pb-1">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243
                     a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-500 leading-snug">{selectedPoint.instructions}</p>
            </div>
          </div>
        )}

        {/* ── VIDEO DE PRESENTACIÓN ── */}
        {selectedPoint?.pointVideoUrl && selectedPoint?.pointVideoType && (() => {
          const { pointVideoUrl: url, pointVideoType: type } = selectedPoint
          const ytId = type === 'youtube' ? extractYouTubeId(url) : null
          if (type === 'youtube' && !ytId) return null
          return (
            <div className="px-4 pt-1 pb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Video de presentación
              </p>
              {type === 'youtube' ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    title="Video de presentación"
                  />
                </div>
              ) : (
                <video
                  src={url}
                  controls
                  preload="metadata"
                  className="w-full rounded-xl bg-black shadow-sm"
                />
              )}
            </div>
          )
        })()}

        {/* ── COLECCIÓN ── */}
        {collectionNotMet && selectedPoint && (
          <div className="px-4 pb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-widest mb-2">
                Contenido bloqueado
              </p>
              <p className="text-sm text-amber-800 mb-3">
                Para desbloquear este contenido debes visitar:
              </p>
              <div className="space-y-2 mb-3">
                {(selectedPoint.requiredPointIds ?? []).map((reqId) => {
                  const reqPoint = points.find((p) => p.id === reqId)
                  const visited  = visitedPointIds.includes(reqId)
                  return (
                    <div key={reqId} className="flex items-center gap-2">
                      <span className={`text-base leading-none ${visited ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {visited ? '✓' : '□'}
                      </span>
                      <span className={`text-sm ${visited ? 'text-emerald-700 line-through' : 'text-amber-800'}`}>
                        {reqPoint?.name ?? reqId}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-amber-600 font-medium">
                {(selectedPoint.requiredPointIds ?? []).filter((id) => visitedPointIds.includes(id)).length}
                /{selectedPoint.requiredPointIds?.length ?? 0} completados
              </p>
            </div>
          </div>
        )}

        {/* ── LOCATION / AVAILABILITY DETAIL ── */}
        {selectedPoint && (
          <div className="px-4 py-3 space-y-2.5">
            {hasAvailabilityDetail && (
              <>
                <button
                  onClick={() => setDetailOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                             border border-gray-200 bg-gray-50 text-sm text-gray-600
                             hover:bg-gray-100 active:scale-[0.99] transition-all duration-150"
                >
                  <span className="font-medium">
                    {detailOpen ? 'Ocultar detalle' : 'Ver detalle de disponibilidad'}
                  </span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${detailOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20" fill="currentColor"
                  >
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </button>

                {detailOpen && avail && (
                  <div className="space-y-1.5 pt-0.5">

                    {distance !== null && (
                      <StatusChip
                        icon={
                          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd"
                              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.507 17 13.207 17 10a7 7 0 10-14 0c0 3.207 1.698 5.507 3.354 7.115a14.92 14.92 0 002.757 2.198 10.4 10.4 0 00.523.282l.018.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            />
                          </svg>
                        }
                        label={locationLabel}
                        variant={locationVariant}
                        expandLabel={locationDetail != null ? 'Ver ruta' : undefined}
                        detail={locationDetail}
                      />
                    )}

                    {avail.scheduleActive && (
                      <StatusChip
                        icon={
                          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="none"
                            stroke="currentColor" strokeWidth={1.75}>
                            <circle cx="10" cy="10" r="7.5" />
                            <path strokeLinecap="round" d="M10 6.5V10l2 2" />
                          </svg>
                        }
                        label={avail.scheduleLabel}
                        variant={avail.scheduleAvailable ? 'ok' : 'block'}
                        expandLabel="Ver horarios"
                        detail={<ScheduleDetail avail={avail} />}
                      />
                    )}

                    {avail.quotaActive && (
                      <StatusChip
                        icon={
                          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd"
                              d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                            />
                          </svg>
                        }
                        label={avail.quotaLabel}
                        variant={avail.quotaAvailable ? (avail.quotaRemaining === 1 ? 'warn' : 'ok') : 'block'}
                        expandLabel="Ver detalle"
                        detail={<QuotaDetail avail={avail} />}
                      />
                    )}

                    {avail.liveVisitsActive && (
                      <StatusChip
                        icon={
                          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        }
                        label={avail.liveVisitsLabel}
                        variant={avail.liveVisitsAvailable ? 'ok' : 'warn'}
                        expandLabel={!avail.liveVisitsAvailable ? 'Ver detalle' : undefined}
                        detail={!avail.liveVisitsAvailable ? (
                          <p>
                            {avail.liveVisitsRemaining === undefined
                              ? 'Esta experiencia se activará cuando haya más personas presentes en el lugar.'
                              : avail.liveVisitsRemaining === 1
                                ? 'Falta 1 persona para activar esta experiencia.'
                                : `Faltan ${avail.liveVisitsRemaining} personas para activar esta experiencia.`
                            }
                          </p>
                        ) : undefined}
                      />
                    )}

                    {selectedPoint?.requiresDwellTime && selectedPoint.dwellTimeSeconds && (
                      <div className="rounded-xl border px-3 py-2.5 bg-amber-50 border-amber-200">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-700 text-sm">⏳</span>
                          <span className="text-xs font-medium flex-1 leading-none text-amber-700">
                            Debes permanecer {Math.ceil(selectedPoint.dwellTimeSeconds / 60)} minutos dentro del área
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── MAP ── */}
        {points.length > 0 && (
          <div className="px-4 mt-3">
            {hasOtherPts && (
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Puntos del proyecto
              </p>
            )}
            <div className="relative z-0 h-52 rounded-2xl overflow-hidden border border-gray-200
                            shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <LandingMap
                points={points}
                selectedPointId={selectedPointId}
                userLocation={userLocation}
                onSelectPoint={(id) => setSelectedPointId(id)}
                routeLatLngs={routeLatLngs}
              />
            </div>
            {hasOtherPts && (
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Tocá un punto para explorar su contenido
              </p>
            )}
          </div>
        )}

      </div>

      {/* ── Sticky CTA bar ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-[1001] bg-white/95 backdrop-blur-md
                   border-t border-gray-100 px-4 pt-3 space-y-2
                   shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <CTAButton
          validation={validation}
          selectedPoint={selectedPoint}
          onContinue={onContinue}
          collectionBlocked={collectionNotMet}
        />

        {hasDirections && mapsUrl && !busy && (
          <button
            onClick={() => window.open(mapsUrl, '_blank', 'noopener,noreferrer')}
            className="w-full py-3 flex items-center justify-center gap-2
                       rounded-xl text-sm font-semibold text-gray-600
                       bg-gray-50 border border-gray-200
                       hover:bg-gray-100 active:scale-[0.98] transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Cómo llegar
          </button>
        )}

        <button
          onClick={() => { window.location.href = project?.id ? `/public/${project.id}` : '/public' }}
          className="w-full py-2 flex items-center justify-center gap-1.5
                     text-sm text-gray-400 hover:text-gray-500 active:scale-[0.98]
                     transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Ver todas las ubicaciones
        </button>
      </div>
    </div>
  )
}
