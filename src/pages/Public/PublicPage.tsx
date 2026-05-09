import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import PublicPointMarker from '../../components/map/PublicPointMarker'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { ApiError } from '../../lib/apiFetch'

import { haversineDistance } from '../../features/geolocation/haversine'
import { reverseGeocode } from '../../features/geolocation/geocoding'
import { trackRadiusEnter, trackPointClick } from '../../lib/analytics'
import { fetchWalkingRoute } from '../../features/routing/orsClient'
import type { RouteResult } from '../../features/routing/orsClient'
import type { RouteStatus } from './PublicPointCard'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useGeoStore } from '../../store/geoStore'
import RoutePolyline from '../../components/map/RoutePolyline'
import MapController from '../../components/map/MapController'
import type { FlyTarget } from '../../components/map/MapController'
import PublicPointCard from './PublicPointCard'
import PublicPointPreviewCard from './PublicPointPreviewCard'
import PublicPointDetailSheet from './PublicPointDetailSheet'
import NavigationTopBar from './NavigationTopBar'
import NavigationBottomCard from './NavigationBottomCard'
import NavigationMapController from '../../components/map/NavigationMapController'
import Spinner from '../../components/ui/Spinner'
import ToastContainer from '../../components/ui/Toast'
import type { GeoProject, GeoPoint, LocationStatus } from '../../types'

/** Minimum distance in meters the user must move before recalculating the route */
const ROUTE_RECALC_THRESHOLD_M = 15

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Dynamic meta tags work for Web Share API previews inside the browser.
// WhatsApp, Telegram, iMessage and other crawlers read the HTML *before*
// JavaScript runs, so they won't see these tags in a plain SPA.
// For full OG support, serve /public/:id with pre-rendered meta tags via a
// Vercel Edge Function, a serverless function, or SSR on the Rails backend.
// ─────────────────────────────────────────────────────────────────────────────
const ORIGINAL_TITLE = document.title

function setMeta(attr: 'property' | 'name', key: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

interface OgImage { url: string; type: string }

/**
 * Resolves coverImage to a public absolute URL suitable for OG tags.
 * base64 data URIs are rejected — crawlers can't fetch them.
 * Falls back to the static /og-image.svg served from public/.
 */
function resolveOgImage(coverImage: string | undefined): OgImage {
  const fallback: OgImage = {
    url: `${window.location.origin}/og-image.svg`,
    type: 'image/svg+xml',
  }
  if (!coverImage) return fallback
  // base64 data URI — not usable as OG image URL
  if (coverImage.startsWith('data:')) return fallback
  // Relative path from the same origin (e.g. Rails Active Storage public URL)
  if (coverImage.startsWith('/')) {
    const ext = coverImage.split('.').pop()?.toLowerCase() ?? ''
    return {
      url: `${window.location.origin}${coverImage}`,
      type: ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
    }
  }
  // Absolute HTTP/HTTPS URL
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    const ext = coverImage.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
    return {
      url: coverImage,
      type: ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : ext === 'webp' ? 'image/webp' : 'image/jpeg',
    }
  }
  return fallback
}

function updatePageMeta(title: string, description: string, image: OgImage, pageUrl: string) {
  document.title = title

  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', pageUrl)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:image', image.url)
  setMeta('property', 'og:image:secure_url', image.url.replace(/^http:\/\//, 'https://'))
  setMeta('property', 'og:image:type', image.type)
  setMeta('property', 'og:image:width', '1200')
  setMeta('property', 'og:image:height', '630')

  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', image.url)
}

function resetPageMeta() {
  document.title = ORIGINAL_TITLE
}

/**
 * Trims the ORS route so it always starts from the user's current position.
 *
 * Finds the ORS waypoint closest to the user (excluding the destination) and
 * discards every point before it — those are segments the user has already
 * walked past.  The user's exact current position is then prepended as the
 * new first point, so the polyline always originates at their feet.
 *
 * This runs on every render (no recalc needed) so the line updates in real
 * time without extra ORS requests.
 */
function trimRouteFromUser(
  latLngs: [number, number][],
  userLat: number,
  userLng: number,
): [number, number][] {
  if (latLngs.length < 2) return [[userLat, userLng], ...latLngs]
  // Search all waypoints except the destination — we never want to skip the end.
  let closestIdx = 0
  let minDist = Infinity
  for (let i = 0; i < latLngs.length - 1; i++) {
    const d = haversineDistance(userLat, userLng, latLngs[i][0], latLngs[i][1])
    if (d < minDist) { minDist = d; closestIdx = i }
  }
  // Start from the user's real position; drop waypoints already passed.
  return [[userLat, userLng], ...latLngs.slice(closestIdx + 1)]
}

/** Debounce delay in ms for movement-triggered recalculations */
const ROUTE_MOVEMENT_DEBOUNCE_MS = 2_000

type LoadError = 'not-found' | 'not-published' | 'fetch-error' | 'timeout' | null

const LOAD_TIMEOUT_MS = 10_000

function UserLocationMarker({ lat, lng }: { lat: number; lng: number }) {
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
      body: 'Este proyecto existe, pero aún no ha sido publicado. Si eres el creador, puedes activarlo desde el editor.',
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

// ── Location badge ────────────────────────────────────────────────────────────

function LocationBadge({ status, onClick }: { status: LocationStatus; onClick: () => void }) {
  const isActive = status === 'active'

  const colorClass =
    status === 'active'     ? 'text-green-400 border-gray-700' :
    status === 'requesting' ? 'text-yellow-400 border-gray-700' :
    status === 'denied'     ? 'text-red-400 border-red-900/40' :
                              'text-amber-400 border-amber-900/40'

  const label =
    status === 'active'      ? 'Ubicación activa' :
    status === 'requesting'  ? 'Obteniendo ubicación…' :
    status === 'denied'      ? 'Ubicación bloqueada' :
    status === 'unavailable' ? 'GPS no disponible' :
                               'Activar ubicación'

  return (
    <button
      onClick={isActive ? undefined : onClick}
      disabled={isActive}
      className={[
        'flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full',
        'bg-gray-900/95 border shadow-lg transition-all duration-150',
        colorClass,
        isActive ? 'cursor-default' : 'cursor-pointer active:scale-95 hover:brightness-110',
      ].join(' ')}
    >
      {status === 'requesting' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />
      ) : status === 'active' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      ) : (
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )}
      <span>{label}</span>
    </button>
  )
}

// ── Platform detection ────────────────────────────────────────────────────────

function detectPlatform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua))          return 'android'
  return 'other'
}

const IOS_STEPS = [
  'Abre Ajustes',
  'Entra a "Privacidad y seguridad"',
  'Toca "Localización"',
  'Entra a "Sitios web de Safari"',
  'Selecciona "Al usar la app"',
  'Recarga la página',
]

const ANDROID_STEPS = [
  'Toca el botón ⓘ en la barra de Chrome',
  'Entra a "Permisos"',
  'Activa "Ubicación"',
  'Recarga la página',
]

function StepList({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-2.5">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-900/60 border border-brand-700/50
                           flex items-center justify-center text-[10px] font-bold text-brand-400 mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-gray-300 leading-snug">{step}</span>
        </div>
      ))}
    </div>
  )
}

// ── Location permission sheet (shown only when status === 'denied') ───────────

function LocationSheet({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  const platform = detectPlatform()

  const platformLabel = platform === 'ios' ? 'iPhone · Safari' : platform === 'android' ? 'Android · Chrome' : null
  const steps = platform === 'ios' ? IOS_STEPS : platform === 'android' ? ANDROID_STEPS : null

  return (
    <div className="absolute inset-0 z-[2000] flex flex-col justify-end md:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-950 border-t border-white/[0.07] rounded-t-[28px]
                      px-5 pt-4 shadow-2xl"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-5">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* Icon */}
        <div className="w-11 h-11 rounded-full bg-amber-900/30 border border-amber-800/30
                        flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <h2 className="text-base font-semibold text-gray-100 text-center mb-1">
          Permite el acceso a tu ubicación
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-5">
          Necesitamos tu ubicación para activar experiencias cercanas.
        </p>

        {/* Instructions — platform-specific */}
        {steps ? (
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 mb-5">
            {platformLabel && (
              <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                {platformLabel}
              </p>
            )}
            <StepList steps={steps} />
          </div>
        ) : (
          /* Fallback for desktop or unknown UA — generic hint */
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 mb-5">
            <p className="text-sm text-gray-400 leading-relaxed">
              Abre la configuración de tu navegador, buscá los permisos de este sitio y habilitá el acceso a la ubicación.
            </p>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={onRetry}
          className="w-full bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                     text-white font-semibold py-3.5 rounded-xl text-sm
                     transition-all duration-150 shadow-lg shadow-brand-900/40 mb-2.5"
        >
          Intentar nuevamente
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-full text-gray-500 hover:text-gray-300 active:scale-[0.98]
                     font-medium py-2.5 rounded-xl text-sm transition-all duration-150"
        >
          Recargar página
        </button>
      </div>
    </div>
  )
}

// ── Mobile interaction state ─────────────────────────────────────────────────
// clean   → map fullscreen, floating "Mostrar lista" button visible
// preview → floating preview card above map (point selected, sheet unchanged)
// detail  → full detail bottom sheet covering most of the screen
type MobileState = 'clean' | 'preview' | 'detail'

// ── Bottom sheet state ────────────────────────────────────────────────────────
// hidden   → map fullscreen, "Mostrar lista" button shown
// expanded → full scrollable list (the existing large sheet, unchanged design)
type SheetState = 'hidden' | 'expanded'

const SHEET_HEIGHT: Record<SheetState, string> = {
  hidden:   '0px',
  expanded: '90dvh',
}

export default function PublicPage() {
  const { id } = useParams<{ id: string }>()
  const { userLocation, locationStatus, setUserLocation, addToast } = useGeoStore()
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<LoadError>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [distances, setDistances] = useState<Record<string, number>>({})
  const [addresses, setAddresses] = useState<Record<string, string>>({})
  const [activatingPointId, setActivatingPointId] = useState<string | null>(null)
  const [accessError, setAccessError] = useState<{
    pointId: string
    message: string
    fallbackUrl?: string
  } | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Mobile interaction state ──────────────────────────────────────────────
  const [mobileState, setMobileState] = useState<MobileState>('clean')

  // ── Bottom sheet ───────────────────────────────────────────────────────────
  const [sheetState, setSheetState] = useState<SheetState>('hidden')
  const dragStartYRef = useRef<number | null>(null)

  // ── Route state ────────────────────────────────────────────────────────────
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('idle')
  const routeForPointRef = useRef<string | null>(null)
  const lastRoutePositionRef = useRef<{ lat: number; lng: number } | null>(null)
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointsRef = useRef<GeoPoint[]>([])

  // ── Navigation mode ────────────────────────────────────────────────────────
  const [isNavigating, setIsNavigating] = useState(false)
  const [navHeading, setNavHeading] = useState(0)
  const navHeadingRef = useRef<number>(0)
  const wasInsideRef = useRef<Record<string, boolean>>({})
  // Ref for the mobile bottom sheet — used to call L.DomEvent.disableClickPropagation
  // so Leaflet's internal tap/click detection cannot fire through the sheet.
  const sheetRef = useRef<HTMLDivElement>(null)

  // ── flyTo control ─────────────────────────────────────────────────────────
  const [flyToKey, setFlyToKey] = useState<string | null>(null)
  const [flyToTarget, setFlyToTarget] = useState<FlyTarget | null>(null)
  const flyToCounterRef = useRef(0)

  // ── Ghost-click suppression ───────────────────────────────────────────────
  // Mobile browsers fire a synthetic click ~300ms after touchend.  When the
  // compact sheet is tapped and expands, that ghost click can land on a map
  // marker or point card that has shifted into position, re-opening the last
  // selected point.  Any point-selection handler checks this timestamp and
  // returns early if the ghost-click window has not yet elapsed.
  const suppressMapClickUntilRef = useRef<number>(0)

  // ── Location permission UX ────────────────────────────────────────────────
  // locationActive gates watchPosition — flipped to true after the first success.
  const [locationActive, setLocationActive] = useState(false)
  // locationSheet is only shown when status === 'denied'
  const [locationSheet,  setLocationSheet]  = useState(false)

  // Isolate the mobile bottom sheet from Leaflet's tap/click detection.
  // Without this, Leaflet's internal event tracking can receive touch events
  // that bubble through common DOM ancestors and misfire as map/marker clicks.
  useEffect(() => {
    if (sheetRef.current) {
      L.DomEvent.disableClickPropagation(sheetRef.current)
    }
  }, [])

  // Close the sheet whenever location becomes active
  useEffect(() => {
    if (locationStatus === 'active') setLocationSheet(false)
  }, [locationStatus])

  // Compass heading — only active during navigation
  useEffect(() => {
    if (!isNavigating) return

    function handleOrientation(e: DeviceOrientationEvent) {
      const raw =
        (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ??
        (e.alpha !== null ? (360 - e.alpha + 360) % 360 : null)
      if (raw === null) return
      // Circular exponential smoothing to avoid wraparound jumps
      let diff = raw - navHeadingRef.current
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      navHeadingRef.current = ((navHeadingRef.current + diff * 0.25) + 360) % 360
      setNavHeading(navHeadingRef.current)
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener)
    window.addEventListener('deviceorientation', handleOrientation as EventListener)
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener)
      window.removeEventListener('deviceorientation', handleOrientation as EventListener)
    }
  }, [isNavigating])

  // One-time automatic request at mount — triggers the native browser prompt.
  // On failure we only update the badge; we don't auto-open the help sheet.
  useEffect(() => {
    if (!navigator.geolocation) { setUserLocation(null, 'unavailable'); return }
    setUserLocation(null, 'requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation(
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy },
          'active',
        )
        setLocationActive(true)
      },
      (err) => {
        setUserLocation(null, err.code === 1 ? 'denied' : 'unavailable')
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Manual request — called from badge click or "Intentar nuevamente".
  // Never caches a denied state; each call is a fresh browser prompt attempt.
  function requestLocation() {
    if (!navigator.geolocation) { setUserLocation(null, 'unavailable'); return }
    setUserLocation(null, 'requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation(
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy },
          'active',
        )
        setLocationSheet(false)
        setLocationActive(true)
      },
      (err) => {
        setUserLocation(null, err.code === 1 ? 'denied' : 'unavailable')
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  function handleBadgeClick() {
    if (locationStatus === 'requesting' || locationStatus === 'active') return
    if (locationStatus === 'denied') { setLocationSheet(true); return }
    requestLocation()
  }

  function handleLocationRetry() {
    setLocationSheet(false)
    requestLocation()
  }

  // Separate refs for mobile sheet and desktop panel so scrollIntoView works
  // correctly in both contexts regardless of display:none.
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mobileCardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useGeolocation(locationActive)

  useEffect(() => { pointsRef.current = points }, [points])

  // Reverse-geocode each point's address when the point list changes.
  // Requests are staggered 300ms apart to respect Nominatim's rate limit.
  useEffect(() => {
    if (points.length === 0) return
    let cancelled = false
    points.forEach((pt, i) => {
      setTimeout(() => {
        if (cancelled) return
        reverseGeocode(pt.latitude, pt.longitude)
          .then((addr) => {
            if (!cancelled) setAddresses((prev) => ({ ...prev, [pt.id]: addr }))
          })
          .catch(() => {/* silently skip; card will show nothing */})
      }, i * 300)
    })
    return () => { cancelled = true }
  }, [points])

  useEffect(() => {
    if (!selectedPointId) return
    mobileCardRefs.current[selectedPointId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    cardRefs.current[selectedPointId]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedPointId])

  useEffect(() => {
    if (!id) {
      console.error('[PublicPage] No hay id en la URL')
      setLoadError('not-found')
      setLoading(false)
      return
    }

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
      geoPointsApi.listPublicPoints(id),
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

        const ogImage = resolveOgImage(proj.coverImage)
        const ogDesc = proj.shareText?.trim()
          || `Experiencia geolocalizada${proj.subtitle ? `: ${proj.subtitle}` : ' en GeoAR'}`
        updatePageMeta(proj.title, ogDesc, ogImage, window.location.href)

        setProject(proj)
        setPoints(activePoints)
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
      resetPageMeta()
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

  // ── Radius-enter tracking + haptic feedback ────────────────────────────────
  useEffect(() => {
    if (!userLocation || !id) return
    for (const pt of points) {
      const dist = haversineDistance(
        userLocation.latitude, userLocation.longitude,
        pt.latitude, pt.longitude,
      )
      const isInside  = dist <= pt.activationRadius
      const wasInside = wasInsideRef.current[pt.id] ?? false
      if (!wasInside && isInside) {
        trackRadiusEnter(id, pt.id, userLocation)
        // Subtle haptic pulse when entering the activation area
        if ('vibrate' in navigator) navigator.vibrate(20)
      }
      wasInsideRef.current[pt.id] = isInside
    }
  }, [userLocation, points, id])

  // ── Route calculation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPointId) {
      setRouteResult(null)
      setRouteStatus('idle')
      routeForPointRef.current = null
      lastRoutePositionRef.current = null
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current)
      return
    }

    if (!userLocation) {
      if (routeForPointRef.current !== selectedPointId) {
        setRouteStatus('no-location')
        setRouteResult(null)
        routeForPointRef.current = selectedPointId
      }
      return
    }

    const isNewPoint = routeForPointRef.current !== selectedPointId

    if (!isNewPoint) {
      const last = lastRoutePositionRef.current
      if (last) {
        const moved = haversineDistance(
          last.lat, last.lng,
          userLocation.latitude, userLocation.longitude,
        )
        if (moved < ROUTE_RECALC_THRESHOLD_M) return
      }
    }

    routeForPointRef.current = selectedPointId

    const snapLat = userLocation.latitude
    const snapLng = userLocation.longitude
    const snapPointId = selectedPointId

    let cancelled = false

    const run = async () => {
      const target = pointsRef.current.find((p) => p.id === snapPointId)
      if (!target || cancelled) return

      setRouteStatus('loading')
      try {
        const result = await fetchWalkingRoute(
          snapLat, snapLng,
          target.latitude, target.longitude,
        )
        if (!cancelled) {
          setRouteResult(result)
          setRouteStatus('ok')
          lastRoutePositionRef.current = { lat: snapLat, lng: snapLng }
        }
      } catch {
        if (!cancelled) {
          setRouteStatus('error')
        }
      }
    }

    if (isNewPoint) {
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current)
      run()
    } else {
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current)
      routeTimerRef.current = setTimeout(run, ROUTE_MOVEMENT_DEBOUNCE_MS)
    }

    return () => {
      cancelled = true
      if (routeTimerRef.current) clearTimeout(routeTimerRef.current)
    }
  }, [selectedPointId, userLocation]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleExitSelectedPoint() {
    setSelectedPointId(null)
    setAccessError(null)
    setMobileState('clean')
    setSheetState('hidden')
    flyToCounterRef.current += 1
    setFlyToKey(`exit-${flyToCounterRef.current}`)
    if (userLocation) {
      setFlyToTarget({ lat: userLocation.latitude, lng: userLocation.longitude, zoom: 14 })
    } else if (points.length > 0) {
      const avgLat = points.reduce((s, p) => s + p.latitude, 0) / points.length
      const avgLng = points.reduce((s, p) => s + p.longitude, 0) / points.length
      setFlyToTarget({ lat: avgLat, lng: avgLng, zoom: 13 })
    }
  }

  function handlePointClick(pt: GeoPoint) {
    if (Date.now() < suppressMapClickUntilRef.current) return
    setSelectedPointId(pt.id)
    setAccessError(null)
    setMobileState('preview')
    // Tap from expanded list → close list so the map is visible.
    if (sheetState === 'expanded') setSheetState('hidden')
    flyToCounterRef.current += 1
    setFlyToKey(`point-${pt.id}-${flyToCounterRef.current}`)
    // Shift the fly target 80px south so the pin lands in the upper portion of the visible map area.
    const panOffsetPx = 80
    setFlyToTarget({ lat: pt.latitude, lng: pt.longitude, zoom: 17, panOffsetPx })
  }

  function handleViewDetail() {
    setMobileState('detail')
  }

  function handleCloseDetail() {
    setMobileState('preview')
  }

  function handleMyLocation() {
    if (!userLocation) return
    flyToCounterRef.current += 1
    setFlyToKey(`user-${flyToCounterRef.current}`)
    setFlyToTarget({ lat: userLocation.latitude, lng: userLocation.longitude, zoom: 17 })
  }

  async function handleStartNavigation() {
    // iOS 13+ requires a user-gesture permission for DeviceOrientationEvent
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
    if (typeof DOE.requestPermission === 'function') {
      try { await DOE.requestPermission() } catch { /* proceed without heading */ }
    }

    navHeadingRef.current = 0
    setNavHeading(0)
    setIsNavigating(true)
    setMobileState('clean')
    setSheetState('hidden')

    if (userLocation) {
      flyToCounterRef.current += 1
      setFlyToKey(`nav-start-${flyToCounterRef.current}`)
      setFlyToTarget({ lat: userLocation.latitude, lng: userLocation.longitude, zoom: 18 })
    }
  }

  function handleExitNavigation() {
    setIsNavigating(false)
    navHeadingRef.current = 0
    setNavHeading(0)

    if (selectedPoint) {
      setMobileState('preview')
      flyToCounterRef.current += 1
      setFlyToKey(`nav-exit-${flyToCounterRef.current}`)
      setFlyToTarget({ lat: selectedPoint.latitude, lng: selectedPoint.longitude, zoom: 17, panOffsetPx: 80 })
    }
  }

  async function handleShare() {
    const url = window.location.href
    const title = project?.title ?? 'Experiencia GeoAR'
    const text = project?.shareText?.trim()
      || `Mira esta experiencia geolocalizada: ${title}`
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          addToast('No pudimos compartir el link.', 'error')
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        addToast('Link copiado', 'success')
      } catch {
        addToast('No pudimos compartir el link.', 'error')
      }
    }
  }

  // ── Bottom sheet drag ─────────────────────────────────────────────────────

  function handleDragStart(e: React.TouchEvent) {
    e.stopPropagation()
    dragStartYRef.current = e.touches[0].clientY
  }

  function handleDragEnd(e: React.TouchEvent) {
    e.stopPropagation()
    if (dragStartYRef.current === null) return
    const delta = dragStartYRef.current - e.changedTouches[0].clientY
    dragStartYRef.current = null
    // Swipe down on the list → close and return to map
    if (delta < -40) {
      suppressMapClickUntilRef.current = Date.now() + 500
      setSheetState('hidden')
    }
  }

  const handleActivate = useCallback(async (point: GeoPoint) => {
    if (activatingPointId) return

    const isOpen = point.accessMode === 'open'

    if (!userLocation) {
      if (isOpen && point.lookiarUrl) {
        trackPointClick(id!, point.id)
        window.location.href = point.lookiarUrl
        return
      }
      addToast('Activá tu ubicación para acceder a la experiencia.', 'error')
      return
    }

    setAccessError(null)
    trackPointClick(id!, point.id)

    console.log('[Access] → Iniciando acceso', {
      projectId: id,
      pointId:   point.id,
      latitude:  userLocation.latitude,
      longitude: userLocation.longitude,
    })

    setActivatingPointId(point.id)
    try {
      const raw = await geoPointsApi.requestPointAccess(
        id!,
        point.id,
        userLocation.latitude,
        userLocation.longitude,
        point.accessMode,
      )
      console.log('[Access] ✓ Respuesta completa del backend:', JSON.stringify(raw))

      const r = raw as Record<string, unknown>
      const resolvedUrl =
        (typeof r.url          === 'string' && r.url)          ||
        (typeof r.redirect_url === 'string' && r.redirect_url) ||
        (typeof r.target_url   === 'string' && r.target_url)   ||
        (typeof r.contentUrl   === 'string' && r.contentUrl)   ||
        (typeof r.content_url  === 'string' && r.content_url)  ||
        ''

      console.log('[Access] URL resuelta:', resolvedUrl || '(vacía)')

      if (!resolvedUrl || !resolvedUrl.startsWith('http')) {
        const msg = 'No se encontró una URL válida para esta experiencia.'
        console.warn('[Access] URL inválida o vacía — no se redirige. Campo "url" recibido:', r.url)
        setAccessError({ pointId: point.id, message: msg })
        addToast(msg, 'error')
      } else {
        window.location.href = resolvedUrl
      }
    } catch (err) {
      console.error('[Access] ✗ Error recibido:', err)

      if (isOpen) {
        if (point.lookiarUrl) {
          console.warn('[Access] Open mode — backend rechazó, navegando por lookiarUrl')
          window.location.href = point.lookiarUrl
          return
        }
        const openMsg = 'Este punto no tiene una URL configurada.'
        setAccessError({ pointId: point.id, message: openMsg })
        addToast(openMsg, 'error')
        return
      }

      let msg = 'No se pudo validar el acceso.'

      if (err instanceof ApiError) {
        console.error('[Access]   HTTP status:', err.status)
        console.error('[Access]   Body raw:   ', err.message)

        try {
          const parsed: unknown = JSON.parse(err.message)
          console.log('[Access]   Body parsed:', parsed)
          if (parsed && typeof parsed === 'object' && 'message' in parsed)
            msg = String((parsed as { message: unknown }).message)
          else if (parsed && typeof parsed === 'object' && 'error' in parsed)
            msg = String((parsed as { error: unknown }).error)
        } catch {
          console.warn('[Access]   Body no es JSON')
          if (err.status === 403)      msg = 'Proyecto no publicado.'
          else if (err.status === 404) msg = 'Punto no encontrado.'
          else if (err.status === 408) msg = 'El servidor no respondió. Intenta nuevamente.'
          else                         msg = err.message || msg
        }
      }

      console.error('[Access]   Mensaje final:', msg)
      setAccessError({ pointId: point.id, message: msg })
      addToast(msg, 'error')
    } finally {
      setActivatingPointId(null)
    }
  }, [activatingPointId, userLocation, id, addToast])

  // ── Early returns ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-gray-500">Cargando experiencia…</p>
      </div>
    )
  }

  if (loadError) return <ErrorScreen error={loadError} id={id} />
  if (!project)  return <ErrorScreen error="not-found" id={id} />

  const mapCenter: [number, number] =
    userLocation
      ? [userLocation.latitude, userLocation.longitude]
      : points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [-33.4489, -70.6693]

  const selectedPoint = selectedPointId
    ? (points.find((p) => p.id === selectedPointId) ?? null)
    : null


  // ── Shared card list renderer ──────────────────────────────────────────────
  // cardRefsProp: which ref map to populate (mobile or desktop)
  function renderPoints(cardRefsProp: React.MutableRefObject<Record<string, HTMLDivElement | null>>) {
    if (points.length === 0) {
      return (
        <p className="text-sm text-gray-500 text-center py-6 px-4">
          Este proyecto no tiene puntos activos aún.
        </p>
      )
    }
    return points.map((pt) => (
      <div key={pt.id} ref={(el) => { cardRefsProp.current[pt.id] = el }}>
        <PublicPointCard
          point={pt}
          distance={distances[pt.id] ?? null}
          isSelected={pt.id === selectedPointId}
          onSelect={() => handlePointClick(pt)}
          onActivate={() => { void handleActivate(pt) }}
          onExit={pt.id === selectedPointId ? handleExitSelectedPoint : undefined}
          isActivating={pt.id === activatingPointId}
          accessMessage={accessError?.pointId === pt.id ? accessError.message : undefined}
          accessFallbackUrl={accessError?.pointId === pt.id ? accessError.fallbackUrl : undefined}
          routeStatus={pt.id === selectedPointId ? routeStatus : undefined}
          walkingDistanceMeters={
            pt.id === selectedPointId && routeResult ? routeResult.distanceMeters : undefined
          }
          walkingDurationSeconds={
            pt.id === selectedPointId && routeResult ? routeResult.durationSeconds : undefined
          }
          address={pt.instructions ?? addresses[pt.id]}
        />
      </div>
    ))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-950 overflow-hidden relative md:flex md:flex-col" style={{ height: '100dvh' }}>

      {/* ── MAP ─────────────────────────────────────────────────────────────
          Mobile: absolute inset-0 → fills full viewport behind the sheet.
          Desktop (md:): relative flex-1 → normal flex-column child.
          The inner canvas div rotates independently in navigation mode;
          all overlay buttons stay outside it so they never rotate.        */}
      <div className="absolute inset-0 md:relative md:flex-1">

        {/* Rotating map canvas — perspective pitch + compass heading in nav mode */}
        <div
          className="absolute inset-0"
          style={isNavigating ? {
            transform: `perspective(900px) rotateX(22deg) rotate(${-navHeading}deg)`,
            transformOrigin: 'center 72%',
            transition: 'transform 0.5s ease-out',
            filter: 'brightness(0.85) contrast(1.05)',
          } : {
            transition: 'transform 0.5s ease-out, filter 0.5s ease-out',
          }}
        >
          <MapContainer center={mapCenter} zoom={15} className="w-full h-full">
            <MapController flyKey={flyToKey} flyTarget={flyToTarget} />
            <NavigationMapController isNavigating={isNavigating} userLocation={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && (
              <UserLocationMarker lat={userLocation.latitude} lng={userLocation.longitude} />
            )}
            {points.map((pt) => (
              <PublicPointMarker
                key={pt.id}
                point={pt}
                selected={pt.id === selectedPointId}
                dimmed={selectedPointId !== null && pt.id !== selectedPointId}
                onClick={() => handlePointClick(pt)}
              />
            ))}
            {routeResult && (
              <RoutePolyline
                navMode={isNavigating}
                latLngs={
                  userLocation
                    ? trimRouteFromUser(routeResult.latLngs, userLocation.latitude, userLocation.longitude)
                    : routeResult.latLngs
                }
              />
            )}
          </MapContainer>
        </div>

        {/* ── Static overlays — never affected by the canvas rotation ── */}

        {/* Location badge — hidden in nav mode (NavigationTopBar takes over) */}
        {!isNavigating && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400]">
            <LocationBadge status={locationStatus} onClick={handleBadgeClick} />
          </div>
        )}

        {/* Location permission sheet (mobile only) */}
        {locationSheet && (
          <LocationSheet
            onRetry={handleLocationRetry}
            onClose={() => setLocationSheet(false)}
          />
        )}

        {/* Navigation top bar — replaces location badge in nav mode */}
        {isNavigating && selectedPoint && (
          <NavigationTopBar
            pointName={selectedPoint.name}
            distanceMeters={distances[selectedPoint.id] ?? routeResult?.distanceMeters ?? 0}
            durationSeconds={routeResult?.durationSeconds ?? 0}
          />
        )}

        {/* Share button — mobile only, hidden during navigation */}
        <button
          onClick={() => void handleShare()}
          className={[
            'absolute right-4 z-[400]',
            'w-11 h-11 flex items-center justify-center',
            'bg-white rounded-full border border-gray-200/60 shadow-md',
            'hover:bg-gray-50 active:scale-95 active:shadow-sm',
            'transition-all duration-150',
            isNavigating                 ? 'hidden'
            : mobileState === 'detail'   ? 'hidden'
            : sheetState === 'expanded'  ? 'hidden'
            : mobileState === 'preview'  ? 'bottom-[324px] md:hidden'
            :                              'bottom-[148px] md:hidden',
          ].join(' ')}
          title="Compartir"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

        {/* My location button — hidden during navigation (auto-follow is active) */}
        <button
          onClick={handleMyLocation}
          disabled={!userLocation}
          className={[
            'absolute right-4 z-[400]',
            'w-11 h-11 flex items-center justify-center',
            'bg-white rounded-full border border-gray-200/60 shadow-md',
            'hover:bg-gray-50 active:scale-95 active:shadow-sm',
            'transition-all duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
            isNavigating                 ? 'hidden md:flex md:bottom-4'
            : mobileState === 'detail'   ? 'hidden md:flex md:bottom-4'
            : sheetState === 'expanded'  ? 'hidden md:flex md:bottom-4'
            : mobileState === 'preview'  ? 'bottom-[272px] md:bottom-4'
            :                              'bottom-24 md:bottom-4',
          ].join(' ')}
          title="Mi ubicación"
        >
          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L4 22 L12 17.5 L20 22 Z" />
          </svg>
        </button>
      </div>

      {/* ── MOBILE BOTTOM SHEET (hidden on md+) ─────────────────────────────
          Height changes per state — the sheet always anchors to bottom-0 and
          grows/shrinks upward. flex-1 on the scroll area then fills exactly
          the visible space, so scroll is always reachable.
          peek     → 80px + safe-area  — handle + mini summary only
          expanded → 90dvh             — full scrollable list              */}
      <div
        ref={sheetRef}
        className="md:hidden absolute inset-x-0 bottom-0 z-[1000]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          height: SHEET_HEIGHT[sheetState],
          transition: 'height 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="h-full flex flex-col rounded-t-[28px] overflow-hidden
                        bg-gray-950/97 backdrop-blur-xl
                        border-t border-white/[0.07]
                        shadow-[0_-12px_40px_rgba(0,0,0,0.7)]">

          {/* Drag handle — swipe down to close */}
          <div
            className="flex-shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center gap-3 px-4 pb-3">
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0
                             ring-1 ring-white/10 shadow-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-100 line-clamp-2 leading-snug">
                  {project.title}
                </p>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">
                  {`${points.length} experiencia${points.length !== 1 ? 's' : ''} disponible${points.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  suppressMapClickUntilRef.current = Date.now() + 500
                  setSheetState('hidden')
                }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                           rounded-full bg-gray-800/60 border border-white/[0.07]
                           text-gray-400 hover:text-gray-100 hover:bg-gray-700/60
                           active:scale-90 transition-all duration-150"
                aria-label="Cerrar lista"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none"
                  stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable point list */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            <div
              className="space-y-2 px-4 pt-1"
              style={{ paddingBottom: 'calc(40px + env(safe-area-inset-bottom, 0px))' }}
            >
              {renderPoints(mobileCardRefs)}
            </div>
          </div>

        </div>
      </div>

      {/* ── FLOATING "MOSTRAR LISTA" BUTTON (mobile only) ─────────────────────
          Visible only when the sheet is hidden (map-first state).
          Tapping opens the sheet to peek. Disappears when list is open.    */}
      {sheetState === 'hidden' && mobileState !== 'detail' && !isNavigating && (
        <div
          className="md:hidden absolute right-4 z-[1100]"
          style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            onClick={() => {
              suppressMapClickUntilRef.current = Date.now() + 500
              // Dismiss any active pin selection before opening the list
              setMobileState('clean')
              setSelectedPointId(null)
              setAccessError(null)
              setSheetState('expanded')
            }}
            className="flex items-center gap-2 pl-3.5 pr-4 py-3
                       rounded-full bg-white text-gray-900
                       font-semibold text-sm leading-none
                       shadow-[0_4px_20px_rgba(0,0,0,0.28)]
                       active:scale-95 transition-transform duration-100"
          >
            <svg className="w-4 h-4 flex-shrink-0 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            </svg>
            <span>Mostrar lista</span>
          </button>
        </div>
      )}

      {/* ── MOBILE PREVIEW CARD ─────────────────────────────────────────────
          Floats above the floating button or peek sheet (preview state).
          Tapping "Ver detalle" opens the full detail sheet.                */}
      {mobileState === 'preview' && selectedPoint && !isNavigating && (
        <div
          className="md:hidden absolute inset-x-4 z-[1050]"
          style={{
            bottom: sheetState !== 'hidden'
              ? 'calc(80px + env(safe-area-inset-bottom, 0px) + 8px)'
              : 'calc(80px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <PublicPointPreviewCard
            point={selectedPoint}
            distance={distances[selectedPoint.id] ?? null}
            onViewDetail={handleViewDetail}
            onClose={handleExitSelectedPoint}
          />
        </div>
      )}

      {/* ── MOBILE DETAIL SHEET ──────────────────────────────────────────────
          Full-height sheet with all point information. Mobile only.        */}
      {mobileState === 'detail' && selectedPoint && (
        <PublicPointDetailSheet
          point={selectedPoint}
          distance={distances[selectedPoint.id] ?? null}
          onClose={handleCloseDetail}
          onActivate={() => { void handleActivate(selectedPoint) }}
          isActivating={selectedPoint.id === activatingPointId}
          accessMessage={accessError?.pointId === selectedPoint.id ? accessError.message : undefined}
          accessFallbackUrl={accessError?.pointId === selectedPoint.id ? accessError.fallbackUrl : undefined}
          routeStatus={routeStatus}
          walkingDistanceMeters={routeResult?.distanceMeters}
          walkingDurationSeconds={routeResult?.durationSeconds}
          address={selectedPoint.instructions ?? addresses[selectedPoint.id]}
          onStartRoute={() => void handleStartNavigation()}
        />
      )}

      {/* ── NAVIGATION BOTTOM CARD ──────────────────────────────────────────
          Persistent navigation HUD. Replaces all other mobile bottom UI.   */}
      {isNavigating && selectedPoint && (
        <NavigationBottomCard
          pointName={selectedPoint.name}
          distanceMeters={distances[selectedPoint.id] ?? routeResult?.distanceMeters ?? 0}
          durationSeconds={routeResult?.durationSeconds ?? 0}
          onExit={handleExitNavigation}
        />
      )}

      {/* ── DESKTOP PANEL (hidden on mobile) ────────────────────────────────
          Same classic layout as before — untouched for desktop users.      */}
      <div className="hidden md:block flex-shrink-0 bg-gray-950 border-t border-gray-800
                      px-4 pt-3 pb-4 max-h-[55vh] overflow-y-auto">
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
          <button
            onClick={handleShare}
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-100
                       hover:bg-gray-800 active:scale-95 transition-all duration-150"
            title="Compartir"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 pb-2">
          {renderPoints(cardRefs)}
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
