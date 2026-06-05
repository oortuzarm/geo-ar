/**
 * SmartLinkPublicPage — Landing Geolocalizada (V1.5)
 *
 * CORS note (P1):
 *   All public fetches (project, points) use credentials:'omit' via the
 *   slFetchProject / slListPoints helpers below, matching the policy already
 *   established for the smart-link resolve/validate endpoints.  This avoids
 *   CORS rejections from go.ubyca.com when the backend sets
 *   Access-Control-Allow-Credentials: false on /api/public/* routes.
 *
 * Backend requirement (P2):
 *   GET /api/public/smart_links/{orgSlug}/{slug} must include project_id
 *   (snake_case) in its JSON response. resolvePublicSmartLink() normalises it
 *   to projectId. Without this field the landing degrades gracefully (no map,
 *   no gallery) but full functionality requires it.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode }                        from 'react'
import { useParams }                             from 'react-router-dom'
import { MapContainer, Marker, useMap }           from 'react-leaflet'
import L                                         from 'leaflet'
import { ApiError, apiFetch }                    from '../../lib/apiFetch'
import { normalizeGeoPoint }                     from '../../lib/normalizeGeoPoint'
import { useGeoStore }                           from '../../store/geoStore'
import { useGeolocation, getCurrentPosition }    from '../../hooks/useGeolocation'
import { sendHeartbeat }                         from '../../services/liveVisitsApi'
import { getLiveVisitSessionId }                 from '../../utils/liveVisits'
import { haversineDistance, formatDistance }     from '../../features/geolocation/haversine'
import { computePointAvailability }              from '../../features/geolocation/availability'
import { getPointGalleryImages }                 from '../../lib/pointImageUtils'
import PointImageCarousel                        from '../../components/public/PointImageCarousel'
import PublicPointMarker                         from '../../components/map/PublicPointMarker'
import RoutePolyline                             from '../../components/map/RoutePolyline'
import BaseMapLayer                              from '../../components/map/BaseMapLayer'
import MapController                             from '../../components/map/MapController'
import type { FlyTarget }                        from '../../components/map/MapController'
import { fetchWalkingRoute, formatDuration }     from '../../features/routing/orsClient'
import { StatusChip, ScheduleDetail, QuotaDetail } from '../../components/availability/AvailabilityChips'
import {
  resolvePublicSmartLink,
  validatePublicSmartLink,
  type PublicSmartLink,
} from '../../services/smartLinksApi'
import type { GeoProject, GeoPoint } from '../../types'

// ── P1: credential-less public fetchers ──────────────────────────────────────
//
// These bypass the repository layer (which uses credentials:'include') so that
// requests from go.ubyca.com comply with the same CORS policy as the smart-link
// resolve / validate endpoints.  The normalisation mirrors RemoteGeoRepository.

const SL_API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

async function slFetchProject(id: string): Promise<GeoProject | null> {
  try {
    const raw = await apiFetch<Record<string, unknown>>(
      `${SL_API_BASE}/api/public/geo_projects/${id}`,
      { credentials: 'omit' },
    )
    return {
      ...raw,
      coverImage:  (raw.coverImage  ?? raw.cover_image)  as string | undefined,
      shareText:   (raw.shareText   ?? raw.share_text)   as string | undefined,
      geoPointIds: ((raw.geoPointIds ?? raw.geo_point_ids ?? []) as string[]),
      createdAt:   (raw.createdAt   ?? raw.created_at)   as string,
      updatedAt:   (raw.updatedAt   ?? raw.updated_at)   as string,
    } as GeoProject
  } catch {
    return null
  }
}

async function slListPoints(projectId: string): Promise<GeoPoint[]> {
  try {
    const raw = await apiFetch<Record<string, unknown>[]>(
      `${SL_API_BASE}/api/public/geo_projects/${projectId}/geo_points?_cb=${Date.now()}`,
      { credentials: 'omit' },
    )
    return raw.map(normalizeGeoPoint)
  } catch {
    return []
  }
}

// ── Resolution error types ────────────────────────────────────────────────────

type ResolveError = 'not_found' | 'paused' | 'api_error'

// ── Validation state machine ──────────────────────────────────────────────────

type ValidationState =
  | { phase: 'idle' }
  | { phase: 'requesting' }
  | { phase: 'validating' }
  | { phase: 'unlocked'; destinationUrl: string; matchedGeoPointId: string }
  | { phase: 'blocked';  message: string }
  | { phase: 'location_error' }

// ── Inline spinner ────────────────────────────────────────────────────────────

function Spin({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'sm'
    ? 'w-4 h-4 border-2 border-white/30 border-t-white'
    : 'w-5 h-5 border-2 border-gray-300 border-t-gray-600'
  return <span className={`${cls} rounded-full animate-spin inline-block`} />
}

// ── Resolve error screen ──────────────────────────────────────────────────────

function ResolveErrorScreen({ type, onRetry }: { type: ResolveError; onRetry?: () => void }) {
  const cfg = {
    not_found: {
      icon: '🔗',
      title: 'Smart Link no encontrado',
      desc:  'La URL solicitada no existe o fue eliminada.',
    },
    paused: {
      icon: '⏸',
      title: 'Smart Link no disponible',
      desc:  'Este Smart Link se encuentra desactivado.',
    },
    api_error: {
      icon: '⚠️',
      title: 'No fue posible cargar este Smart Link',
      desc:  'Ocurrió un error al conectar con el servidor.',
    },
  }[type]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-gray-100">
      <div className="w-full max-w-sm space-y-8 text-center">
        <img src="/logo-blanco.png" alt="Ubyca" className="h-7 mx-auto opacity-90" />
        <div className="space-y-4">
          <span className="text-4xl">{cfg.icon}</span>
          <div className="space-y-2">
            <h1 className="text-lg font-semibold text-gray-100">{cfg.title}</h1>
            <p className="text-sm text-gray-500 leading-relaxed">{cfg.desc}</p>
          </div>
          {type === 'api_error' && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm
                         font-semibold rounded-xl transition-all active:scale-[0.98]"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  )
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
//
// Inner Leaflet component (must live inside MapContainer to call useMap).
//
// WHY this exists:
//   When MapContainer first mounts, Leaflet reads the container's pixel size to
//   calibrate its internal coordinate system.  If the surrounding CSS layout
//   hasn't been painted yet (flex containers, overflow:hidden, border-radius),
//   Leaflet may measure a 0×0 box and miscalculate the initial fitBounds,
//   leaving the points off-centre or clipped to a corner.
//
//   Solution: wait one animation frame (so the browser has completed layout and
//   paint), call invalidateSize() to let Leaflet re-read the true container
//   dimensions, then apply fitBounds with the pre-computed bounds.
//
// LOOP SAFETY:
//   The effect depends only on [map, bounds].  `map` is the stable Leaflet
//   instance (never changes for the lifetime of this MapContainer).  `bounds`
//   changes only when the `points` prop changes — which happens once on initial
//   load, not on every user interaction.  flyTo actions (MapController) don't
//   mutate `bounds`, so they are never overridden by this effect.

const MAP_BOUNDS_OPTIONS: L.FitBoundsOptions = { padding: [32, 32], maxZoom: 17 }

// resetKey: incrementing from outside re-applies fitBounds with animation
// (used by the location toggle button to return to the project overview).
function BoundsController({ bounds, resetKey }: { bounds: L.LatLngBounds | null; resetKey: number }) {
  const map = useMap()

  useEffect(() => {
    if (!bounds) return
    const raf = requestAnimationFrame(() => {
      map.invalidateSize()
      map.fitBounds(bounds, MAP_BOUNDS_OPTIONS)
    })
    return () => cancelAnimationFrame(raf)
  }, [map, bounds, resetKey])

  return null
}

// Flies to the user's GPS position when centeredOnUser transitions false → true.
// When the toggle reverses, does nothing — BoundsController handles the return
// to overview via boundsResetKey.  prevRef prevents a setView on initial mount.
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

// Recalibrates Leaflet after the map container resizes (expand / collapse).
// setTimeout(50) gives the browser time to apply the new CSS dimensions before
// Leaflet reads them.  Saves and restores center+zoom so the view is preserved.
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

// ── Landing map ───────────────────────────────────────────────────────────────
//
// Read-only / visual-only map.  No GPS watchers, no analytics, no sessions,
// no validate calls, no heartbeats.

interface LandingMapProps {
  points:          GeoPoint[]
  selectedPointId: string | null
  userLocation:    { latitude: number; longitude: number } | null
  onSelectPoint:   (id: string) => void
  flyKey:          string | null
  flyTarget:       FlyTarget | null
  /** Walking route from userLocation to selectedPoint — visual only, no analytics */
  routeLatLngs:    [number, number][] | null
}

function LandingMap({
  points, selectedPointId, userLocation, onSelectPoint, flyKey, flyTarget, routeLatLngs,
}: LandingMapProps) {
  // ── Toggle state for the location button ───────────────────────────────────
  // false = "go to my location" (navigation arrow)
  // true  = "return to project overview" (fit-to-bounds icon)
  const [centeredOnUser, setCenteredOnUser] = useState(false)
  // Incrementing this triggers BoundsController to re-apply fitBounds.
  const [boundsResetKey, setBoundsResetKey] = useState(0)

  // ── Fullscreen expand toggle ────────────────────────────────────────────────
  // When true the map wrapper becomes position:fixed covering the full viewport.
  // SizeController calls invalidateSize() + restores center/zoom after the CSS
  // change so Leaflet tiles and markers render correctly at the new size.
  const [isExpanded, setIsExpanded] = useState(false)

  function handleLocationToggle() {
    if (!centeredOnUser) {
      // Go to user's GPS position — UserFlyController watches this transition.
      setCenteredOnUser(true)
    } else {
      // Return to project overview — BoundsController re-applies fitBounds.
      setCenteredOnUser(false)
      setBoundsResetKey((k) => k + 1)
    }
  }

  // Compute initial map bounds that include each point's activation area.
  //
  // For radius mode: extend lat/lng by the circle radius converted to degrees,
  // so the full activation ring is visible, not just the centre marker.
  // For polygon mode: use the polygon vertices directly.
  //
  // `points` is already filtered to the Smart Link's visible scope
  // (all project points for scopeType='project', or geoPointIds subset for
  // scopeType='geo_points') — see displayPoints in SmartLinkPublicPage.
  //
  // boundsOptions.maxZoom=17 prevents over-zooming on very small radii.
  // boundsOptions.padding=[32,32] adds 32px of visual breathing room.
  const initialBounds = useMemo(() => {
    if (points.length === 0) return null

    let latMin = Infinity, latMax = -Infinity, lngMin = Infinity, lngMax = -Infinity

    for (const p of points) {
      // Always include the marker centre (guarantees at least one valid coord)
      latMin = Math.min(latMin, p.latitude)
      latMax = Math.max(latMax, p.latitude)
      lngMin = Math.min(lngMin, p.longitude)
      lngMax = Math.max(lngMax, p.longitude)

      if (p.activationMode === 'polygon' && p.activationPolygon) {
        // Polygon mode: expand bounds to cover every vertex of the polygon.
        const geom = p.activationPolygon.geometry
        const rings: number[][][] =
          geom.type === 'Polygon'
            ? (geom.coordinates as number[][][])
            : geom.type === 'MultiPolygon'
              ? (geom.coordinates as number[][][][]).flat()
              : []
        for (const ring of rings) {
          for (const pos of ring) {
            // GeoJSON position: [longitude, latitude, ...optional elevation]
            latMin = Math.min(latMin, pos[1])
            latMax = Math.max(latMax, pos[1])
            lngMin = Math.min(lngMin, pos[0])
            lngMax = Math.max(lngMax, pos[0])
          }
        }
      } else {
        // Radius mode: bounding box of the activation circle in degree space.
        // dLat = metres / (metres per degree of latitude)  ~111 320 m/°
        // dLng = dLat / cos(latitude)  — longitude degrees are shorter near the poles
        const r    = p.activationRadius
        const dLat = r / 111_320
        const dLng = r / (111_320 * Math.cos(p.latitude * (Math.PI / 180)))
        latMin = Math.min(latMin, p.latitude  - dLat)
        latMax = Math.max(latMax, p.latitude  + dLat)
        lngMin = Math.min(lngMin, p.longitude - dLng)
        lngMax = Math.max(lngMax, p.longitude + dLng)
      }
    }

    return L.latLngBounds([latMin, lngMin], [latMax, lngMax])
  }, [points])

  if (points.length === 0) return null

  const center = initialBounds
    ? ([initialBounds.getCenter().lat, initialBounds.getCenter().lng] as [number, number])
    : ([points[0].latitude, points[0].longitude] as [number, number])

  // ── Button bar common style ─────────────────────────────────────────────────
  const btnCls = 'w-10 h-10 flex items-center justify-center bg-white rounded-full ' +
                 'border border-gray-200/60 shadow-md transition-all duration-150 ' +
                 'active:scale-95 hover:shadow-lg'

  return (
    // Normal:   relative h-full w-full  →  fills the h-52 parent container.
    // Expanded: fixed inset-0 z-[9999]  →  covers the full viewport.
    // position:fixed escapes overflow:hidden on the parent, no DOM move needed.
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
        <BoundsController bounds={initialBounds} resetKey={boundsResetKey} />
        <UserFlyController centeredOnUser={centeredOnUser} userLocation={userLocation} />
        {/* SizeController: invalidateSize + restore view after expand / collapse */}
        <SizeController isExpanded={isExpanded} />
        <MapController flyKey={flyKey} flyTarget={flyTarget} />

        {points.map((p) => (
          <PublicPointMarker
            key={p.id}
            point={p}
            selected={p.id === selectedPointId}
            dimmed={selectedPointId !== null && p.id !== selectedPointId}
            onClick={() => onSelectPoint(p.id)}
            small
          />
        ))}

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

      {/* Location toggle — bottom-right */}
      {userLocation && (
        <button
          onClick={handleLocationToggle}
          className={`absolute right-2 bottom-2 z-[450] ${btnCls}`}
          title={centeredOnUser ? 'Vista del proyecto' : 'Mi ubicación'}
          aria-label={centeredOnUser ? 'Vista del proyecto' : 'Mi ubicación'}
        >
          {centeredOnUser ? (
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9V5h4M15 5h4v4M15 19h4v-4M5 15v4h4" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L4 22 L12 17.5 L20 22 Z" />
            </svg>
          )}
        </button>
      )}

      {/* Expand / collapse — bottom-left */}
      <button
        onClick={() => setIsExpanded((e) => !e)}
        className={`absolute left-2 bottom-2 z-[450] ${btnCls}`}
        title={isExpanded ? 'Reducir mapa' : 'Ampliar mapa'}
        aria-label={isExpanded ? 'Reducir mapa' : 'Ampliar mapa'}
      >
        {isExpanded ? (
          /* Collapse / exit-fullscreen icon */
          <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" />
          </svg>
        ) : (
          /* Expand / enter-fullscreen icon */
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
  hasLocation,
  onContinue,
}: {
  validation:    ValidationState
  selectedPoint: GeoPoint | null
  /** True when userLocation is already in store (GPS previously granted). */
  hasLocation:   boolean
  onContinue:    () => void
}) {
  const busy    = validation.phase === 'requesting' || validation.phase === 'validating'
  // Single source of truth for the action label — reutilizes Punto GPS buttonText.
  const ctaText = selectedPoint?.buttonText || 'Acceder al contenido'

  // ── Unlocked: active CTA, opens destination ─────────────────────────────────
  if (validation.phase === 'unlocked') {
    return (
      <button
        onClick={() => window.open(validation.destinationUrl, '_blank', 'noopener,noreferrer')}
        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold
                   rounded-2xl text-[15px] transition-all active:scale-[0.98]
                   shadow-lg shadow-brand-900/30"
      >
        {ctaText}
      </button>
    )
  }

  // ── Blocked by validation: show buttonText disabled ─────────────────────────
  // The backend already evaluated the user's position — "Reintentar" is not
  // useful here.  The disabled button communicates what they'll access once
  // they meet the requirements (enter area, wait for schedule, etc.).
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

  // ── GPS error: Reintentar is valid — user can grant permissions or go outside ─
  if (validation.phase === 'location_error') {
    return (
      <button
        onClick={onContinue}
        className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold
                   rounded-2xl text-[15px] transition-all active:scale-[0.98]"
      >
        Reintentar
      </button>
    )
  }

  // ── idle / requesting / validating ──────────────────────────────────────────
  const label =
    validation.phase === 'requesting' ? 'Obteniendo ubicación…' :
    validation.phase === 'validating' ? 'Verificando…'          :
    hasLocation                       ? ctaText                 :
                                        'Permitir ubicación →'

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

// ── SmartLinkLanding ──────────────────────────────────────────────────────────

interface SmartLinkLandingProps {
  smartLink:    PublicSmartLink
  project:      GeoProject | null
  /** P7: already filtered by scopeType in parent */
  points:       GeoPoint[]
  validation:   ValidationState
  userLocation: { latitude: number; longitude: number } | null
  /** P4: keyed by geoPointId — only the matched point has a real count */
  liveVisitsMap: Record<string, number>
  onContinue:   () => void
}

function SmartLinkLanding({
  smartLink, project, points, validation, userLocation, liveVisitsMap, onContinue,
}: SmartLinkLandingProps) {

  // ── P6: selectedPointId validated against active points list ─────────────
  const [selectedPointId, setSelectedPointId] = useState<string | null>(
    smartLink.geoPointIds?.[0] ?? null,
  )

  // Whenever the points list changes (initial load or scope update), ensure
  // selectedPointId corresponds to an actual active point in the list.
  useEffect(() => {
    if (points.length === 0) return
    const isValid = points.some((p) => p.id === selectedPointId)
    if (!isValid) setSelectedPointId(points[0].id)
  }, [points, selectedPointId])

  // After validation succeeds, lock onto the matched point.
  useEffect(() => {
    if (validation.phase === 'unlocked') {
      setSelectedPointId(validation.matchedGeoPointId)
    }
  }, [validation])

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedPointId) ?? points[0] ?? null,
    [points, selectedPointId],
  )

  // ── Hero images ─────────────────────────────────────────────────────────────
  const heroImages = useMemo(() => {
    if (selectedPoint) {
      const imgs = getPointGalleryImages(selectedPoint)
      if (imgs.length > 0) return imgs
    }
    if (project?.coverImage) return [project.coverImage]
    return []
  }, [selectedPoint, project?.coverImage])

  // ── Distance & availability ─────────────────────────────────────────────────
  const distance = useMemo(() => {
    if (!userLocation || !selectedPoint) return null
    return haversineDistance(
      userLocation.latitude, userLocation.longitude,
      selectedPoint.latitude, selectedPoint.longitude,
    )
  }, [userLocation, selectedPoint])

  // P4: look up live visits count for the SELECTED point specifically.
  // Only the matchedGeoPointId will have a real count (from heartbeat).
  // Other points get undefined → computePointAvailability shows the minimum
  // requirement optimistically instead of a wrong count.
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

  // ── Walking route (visual only — no analytics, no new GPS watcher) ──────────
  // Fetches an ORS pedestrian route from userLocation to the selected point.
  // Falls back to a straight line if ORS is unavailable — the route does NOT
  // influence bounds, analytics, or validation.
  //
  // BUG FIX: userLocation is a Zustand object whose reference changes on every
  // GPS tick even when coordinates are identical.  Depending on the full object
  // caused the effect to fire and cancel the ORS request on every GPS update,
  // so the route never resolved.  Using primitive lat/lng values as dependencies
  // means the effect only re-fires when coordinates actually change numerically.
  const [routeLatLngs,           setRouteLatLngs]           = useState<[number, number][] | null>(null)
  const [walkingDistanceMeters,  setWalkingDistanceMeters]  = useState<number | undefined>(undefined)
  const [walkingDurationSeconds, setWalkingDurationSeconds] = useState<number | undefined>(undefined)

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
          // ORS unavailable (no key, rate limit, network) — show a straight line
          // so the map always has a visual route. Does not affect analytics/validation.
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

  // ── Map fly-to ──────────────────────────────────────────────────────────────
  const [flyKey,    setFlyKey]    = useState<string | null>(null)
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null)

  function handleSelectPoint(id: string) {
    setSelectedPointId(id)
    const p = points.find((pt) => pt.id === id)
    if (p) {
      setFlyKey(`point-${id}-${Date.now()}`)
      setFlyTarget({ lat: p.latitude, lng: p.longitude, zoom: 16 })
    }
  }

  // ── Derived display values ───────────────────────────────────────────────────
  // P5: "Cómo llegar" depends on point coordinates, NOT on legacy instructions text.
  //     Every active point has latitude + longitude, so it's always available.
  const hasDirections = selectedPoint !== null
  const mapsUrl = selectedPoint
    ? `https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.latitude},${selectedPoint.longitude}&travelmode=walking`
    : null

  const hasOtherPts = points.length > 1
  const busy        = validation.phase === 'requesting' || validation.phase === 'validating'

  const [detailOpen, setDetailOpen] = useState(false)

  // ── Location chip derivation (mirrors PublicPointCard logic) ────────────────
  let locationLabel:   string   = 'Fuera del área'
  let locationVariant: 'ok' | 'warn' | 'block' | 'neutral' = 'block'
  let locationDetail:  ReactNode = null

  if (avail) {
    if (avail.insideArea) {
      locationLabel   = 'Dentro del área'
      locationVariant = 'ok'
    } else {
      locationLabel = avail.distanceToEdge !== null && avail.distanceToEdge > 0
        ? `A ${formatDistance(avail.distanceToEdge)} del área`
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
      <div className="flex-1 pb-36">

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
            {project && (
              <p className="text-white/55 text-[10px] font-semibold uppercase tracking-widest
                            mb-0.5 line-clamp-1">
                {project.title}
              </p>
            )}
            <h1 className="text-white font-bold text-xl leading-tight line-clamp-2 drop-shadow-sm">
              {selectedPoint?.name || smartLink.name}
            </h1>
          </div>
        </div>

        {/* ── STATUS + MESSAGE ── */}
        <div className="px-4 pt-4 pb-1">
          <AvailabilityBadge validation={validation} />
          {validation.phase === 'blocked' && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{validation.message}</p>
          )}
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

        {/* ── POINT CONTENT ── */}
        {selectedPoint && (
          <div className="px-4 py-3 space-y-2.5">
            {selectedPoint.description && (
              <p className="text-sm text-gray-700 leading-relaxed">{selectedPoint.description}</p>
            )}
            {selectedPoint.instructions && (
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
            )}

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

                    {/* Location chip — only when GPS is active */}
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

                {/* Schedule chip */}
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

                {/* Quota chip */}
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

                {/* Live visits chip */}
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

                {/* Permanencia — informational, no timer needed */}
                {selectedPoint?.requiresDwellTime && selectedPoint.dwellTimeSeconds && (
                  <div className="rounded-xl border px-3 py-2.5 bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 text-sm">⏳</span>
                      <span className="text-xs font-medium flex-1 leading-none text-amber-700">
                        Permanecé {Math.ceil(selectedPoint.dwellTimeSeconds / 60)} min en el área para desbloquear
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
            <div className="h-52 rounded-2xl overflow-hidden border border-gray-200
                            shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <LandingMap
                points={points}
                selectedPointId={selectedPointId}
                userLocation={userLocation}
                onSelectPoint={handleSelectPoint}
                flyKey={flyKey}
                flyTarget={flyTarget}
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

        {/* ── PROJECT INFO (secondary) ── */}
        {project && (project.shareText || project.subtitle) && (
          <div className="mx-4 mt-5 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {project.shareText || project.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* ── P3: Sticky CTA bar with safe-area-inset-bottom ── */}
      <div
        className="fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-md
                   border-t border-gray-100 px-4 pt-3 space-y-2
                   shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
        style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <CTAButton
          validation={validation}
          selectedPoint={selectedPoint}
          hasLocation={userLocation !== null}
          onContinue={onContinue}
        />

        {/* P5: "Cómo llegar" uses point coordinates — always shown when a point is selected */}
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
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartLinkPublicPage() {
  const { organizationSlug = '', smartLinkSlug = '' } = useParams<{
    organizationSlug: string
    smartLinkSlug:    string
  }>()

  // ── GPS (unchanged) ───────────────────────────────────────────────────────
  const { userLocation, setUserLocation } = useGeoStore()
  const [locationActive, setLocationActive] = useState(false)
  useGeolocation(locationActive)

  const locationRef = useRef(userLocation)
  useEffect(() => { locationRef.current = userLocation }, [userLocation])

  // ── Resolution ────────────────────────────────────────────────────────────
  const [loading,      setLoading]      = useState(true)
  const [smartLink,    setSmartLink]    = useState<PublicSmartLink | null>(null)
  const [resolveError, setResolveError] = useState<ResolveError | null>(null)

  function resolve() {
    setLoading(true)
    setResolveError(null)
    resolvePublicSmartLink(organizationSlug, smartLinkSlug)
      .then((data) => setSmartLink(data))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          try {
            const body = JSON.parse(err.message) as { error?: string }
            setResolveError(body.error?.includes('no disponible') ? 'paused' : 'not_found')
          } catch {
            setResolveError('not_found')
          }
        } else {
          setResolveError('api_error')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (organizationSlug && smartLinkSlug) resolve()
    else { setResolveError('not_found'); setLoading(false) }
  }, [organizationSlug, smartLinkSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Project + points — P1: credentials:'omit' via slFetchProject/slListPoints ─
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points,  setPoints]  = useState<GeoPoint[]>([])

  useEffect(() => {
    if (!smartLink?.projectId) return
    const projectId = smartLink.projectId
    Promise.all([
      slFetchProject(projectId),
      slListPoints(projectId),
    ]).then(([proj, pts]) => {
      if (proj) setProject(proj)
      setPoints(pts.filter((p) => p.active))
    })
  }, [smartLink?.projectId])

  // ── P7: Filter displayed points by scope ──────────────────────────────────
  // scopeType='geo_points': show only the points this Smart Link can unlock.
  // scopeType='project' (or absent): show all active project points.
  // This prevents the map from showing points the user cannot unlock via this link.
  const displayPoints = useMemo(() => {
    if (
      smartLink?.scopeType === 'geo_points' &&
      smartLink.geoPointIds &&
      smartLink.geoPointIds.length > 0
    ) {
      const scopedIds = new Set(smartLink.geoPointIds)
      return points.filter((p) => scopedIds.has(p.id))
    }
    return points
  }, [points, smartLink?.scopeType, smartLink?.geoPointIds])

  // ── Validation state (unchanged) ─────────────────────────────────────────
  const [validation, setValidation] = useState<ValidationState>({ phase: 'idle' })

  // ── P4: liveVisitsMap (per-point) instead of a single global count ────────
  // Heartbeat only runs for matchedGeoPointId, so only that point gets a real
  // count.  Other points receive undefined → computePointAvailability falls
  // back to the optimistic "minimum required" label, which is correct.
  const [liveVisitsMap, setLiveVisitsMap] = useState<Record<string, number>>({})

  // ── Heartbeat (unchanged frequency/payload/endpoint) ─────────────────────
  useEffect(() => {
    if (validation.phase !== 'unlocked') return
    const { matchedGeoPointId } = validation
    const sessionId = getLiveVisitSessionId()

    function heartbeatTick() {
      const loc = locationRef.current
      if (!loc) return
      sendHeartbeat(matchedGeoPointId, {
        session_id: sessionId,
        lat:        loc.latitude,
        lng:        loc.longitude,
        accuracy:   loc.accuracy,
      }).then((res) => {
        if (res.active_now !== undefined) {
          setLiveVisitsMap((prev) => ({ ...prev, [matchedGeoPointId]: res.active_now! }))
        }
      })
    }

    heartbeatTick()
    const timer = setInterval(heartbeatTick, 5_000)
    return () => clearInterval(timer)
  }, [validation.phase === 'unlocked' ? validation.matchedGeoPointId : null]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Continuar handler ────────────────────────────────────────────────────
  //
  // Root cause of the 2-click bug (now fixed):
  //   requestLocation() called its callback *synchronously* with (null,'requesting')
  //   before GPS responded, which resolved the Promise immediately with loc=null,
  //   causing location_error even though the user had accepted the GPS prompt.
  //
  // Fix: use getCurrentPosition() which returns a genuine Promise that resolves
  //   only when the browser delivers real coordinates (or rejects on denial/timeout).
  //   No intermediate 'requesting' callback fires — the flow is linear.
  async function handleContinue() {
    setValidation({ phase: 'requesting' })

    // Use coordinates already in the store when available (GPS previously granted).
    let loc = locationRef.current

    if (!loc) {
      try {
        // Awaits until the browser delivers real GPS coordinates.
        // Rejects on PERMISSION_DENIED (code 1), POSITION_UNAVAILABLE (code 2),
        // or TIMEOUT (code 3) — all genuine failures shown as location_error.
        const pos = await getCurrentPosition()
        loc = {
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        }
        setUserLocation(loc, 'active')
        setLocationActive(true)
        locationRef.current = loc
      } catch (err) {
        const code = (err as GeolocationPositionError)?.code
        setUserLocation(null, code === 1 ? 'denied' : 'unavailable')
        setValidation({ phase: 'location_error' })
        return
      }
    }

    setValidation({ phase: 'validating' })
    try {
      const result = await validatePublicSmartLink(organizationSlug, smartLinkSlug, {
        latitude:   loc.latitude,
        longitude:  loc.longitude,
        session_id: getLiveVisitSessionId(),
        accuracy:   loc.accuracy,
      })

      if (result.allowed && result.destinationUrl && result.matchedGeoPointId) {
        setLocationActive(true)
        setValidation({
          phase:             'unlocked',
          destinationUrl:    result.destinationUrl,
          matchedGeoPointId: result.matchedGeoPointId,
        })
      } else {
        setValidation({
          phase:   'blocked',
          message: result.message ?? 'El acceso no está disponible en este momento.',
        })
      }
    } catch (err) {
      let msg = 'No se pudo validar el acceso. Intenta nuevamente.'
      if (err instanceof ApiError) {
        try {
          const body = JSON.parse(err.message) as { message?: string; error?: string }
          msg = body.message || body.error || msg
        } catch { /* keep default */ }
      }
      setValidation({ phase: 'blocked', message: msg })
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-gray-100">
        <div className="w-full max-w-sm space-y-8 text-center">
          <img src="/logo-blanco.png" alt="Ubyca" className="h-7 mx-auto opacity-90" />
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Cargando…</p>
            <div className="flex justify-center"><Spin /></div>
          </div>
        </div>
      </div>
    )
  }

  if (resolveError) return <ResolveErrorScreen type={resolveError} onRetry={resolve} />

  if (smartLink) {
    return (
      <SmartLinkLanding
        smartLink={smartLink}
        project={project}
        points={displayPoints}
        validation={validation}
        userLocation={userLocation}
        liveVisitsMap={liveVisitsMap}
        onContinue={handleContinue}
      />
    )
  }

  return <ResolveErrorScreen type="api_error" onRetry={resolve} />
}
