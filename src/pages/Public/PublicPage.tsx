import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import Supercluster from 'supercluster'
import PublicPointMarker from '../../components/map/PublicPointMarker'
import ClusterMarker from '../../components/map/ClusterMarker'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { ApiError } from '../../lib/apiFetch'

import { haversineDistance } from '../../features/geolocation/haversine'
import { isInsideActivationArea } from '../../features/geolocation/availability'
import { reverseGeocode } from '../../features/geolocation/geocoding'
import { trackRadiusEnter, trackPointClick, trackDwellStarted, trackDwellCompleted, trackDwellCancelled } from '../../lib/analytics'
import { getLiveVisitSessionId } from '../../utils/liveVisits'
import { sendHeartbeat, sendProjectHeartbeat } from '../../services/liveVisitsApi'
import { fetchWalkingRoute } from '../../features/routing/orsClient'
import type { RouteResult } from '../../features/routing/orsClient'
import type { RouteStatus, DwellProgress } from './PublicPointCard'
import { useGeolocation, getCurrentPosition } from '../../hooks/useGeolocation'
import { useMapStyle } from '../../hooks/useMapStyle'
import { useGeoStore } from '../../store/geoStore'
import MapStyleToggle from '../../components/map/MapStyleToggle'
import BaseMapLayer from '../../components/map/BaseMapLayer'
import RoutePolyline from '../../components/map/RoutePolyline'
import ManualLocationSheet from '../../components/map/ManualLocationSheet'
import MapController from '../../components/map/MapController'
import type { FlyTarget } from '../../components/map/MapController'
import PublicPointCard from './PublicPointCard'
import PublicPointPreviewCard from './PublicPointPreviewCard'
import PublicPointDetailSheet from './PublicPointDetailSheet'
import Spinner from '../../components/ui/Spinner'
import ToastContainer from '../../components/ui/Toast'
import type { GeoProject, GeoPoint, LocationStatus, UserLocation, AccessResponse } from '../../types'
import GeoPointLanding, { type ValidationState } from '../../components/public/GeoPointLanding'

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

type LocationFilter = 'all' | 'available'

/**
 * Returns true when a point is available right now based on schedule, quota and live
 * visits rules. Does NOT consider geofence / GPS distance — checked at activation time.
 * liveVisitCounts: current active visitor counts from heartbeat responses.
 */
function isPointAvailableNow(point: GeoPoint, liveVisitCounts: Record<string, number>): boolean {
  const avail = point.availability
  if (!avail) return true

  if (avail.scheduleEnabled) {
    const now      = new Date()
    const localDay = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][now.getDay()]
    const hh       = String(now.getHours()).padStart(2, '0')
    const mm       = String(now.getMinutes()).padStart(2, '0')
    const time     = `${hh}:${mm}`

    if (avail.scheduleDays?.length && !avail.scheduleDays.includes(localDay)) return false
    if (avail.scheduleStartTime && time < avail.scheduleStartTime)             return false
    if (avail.scheduleEndTime   && time >= avail.scheduleEndTime)              return false
  }

  if (avail.quotaEnabled && avail.quotaLimit != null) {
    if ((avail.quotaUsed ?? 0) >= avail.quotaLimit) return false
  }

  if (avail.liveVisitsEnabled && avail.liveVisitsMinimum != null) {
    const count = liveVisitCounts[point.id]
    // If count is not yet known, don't block the point from display.
    if (count !== undefined && count < avail.liveVisitsMinimum) return false
  }

  return true
}

/**
 * Applies the project's publicInitialViewMode exactly once after the map mounts.
 * Runs inside MapContainer so useMap() is available.
 *
 * Priority:
 *   custom (with valid coords)  → setView to saved center/zoom
 *   user_location               → wait for GPS, then setView to user position
 *   fit_points (default)        → fitBounds over all active points
 *
 * A didApplyRef prevents any re-application when userLocation, selectedPoint,
 * route state or sheet state change after the initial view has been set.
 * resetTrigger can be incremented from outside to re-apply the project view
 * with animation (used by the location toggle button).
 */
function PublicInitialViewController({
  project,
  points,
  userLocation,
  resetTrigger,
}: {
  project: GeoProject
  points: GeoPoint[]
  userLocation: UserLocation | null
  resetTrigger: number
}) {
  const map = useMap()
  const didApplyRef = useRef(false)

  const viewMode = project.publicInitialViewMode ?? 'fit_points'

  const hasCustomView =
    viewMode === 'custom' &&
    project.publicInitialCenterLat != null &&
    project.publicInitialCenterLng != null &&
    project.publicInitialZoom      != null

  // If custom is requested but incomplete, fall back to fit_points.
  const effectiveMode =
    hasCustomView          ? 'custom'        :
    viewMode === 'custom'  ? 'fit_points'    :
                             viewMode

  // Shared view-apply logic; animated=false on initial mount, true on user-triggered return.
  function applyProjectView(animated: boolean) {
    if (effectiveMode === 'custom') {
      map.setView(
        [project.publicInitialCenterLat!, project.publicInitialCenterLng!],
        project.publicInitialZoom!,
        { animate: animated },
      )
      return
    }
    if (effectiveMode === 'user_location') {
      if (!userLocation) return
      map.setView([userLocation.latitude, userLocation.longitude], 15, { animate: animated })
      return
    }
    // fit_points
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 16, { animate: animated })
    } else {
      const bounds = L.latLngBounds(
        points.map((p) => [p.latitude, p.longitude] as [number, number]),
      )
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: animated })
    }
  }

  // Always-fresh ref so the reset effect never captures a stale closure.
  const applyProjectViewRef = useRef(applyProjectView)
  applyProjectViewRef.current = applyProjectView

  // One-time initial application.
  useEffect(() => {
    if (didApplyRef.current) return
    if (effectiveMode === 'user_location' && !userLocation) return
    didApplyRef.current = true
    console.log('[InitialView] mode:', effectiveMode)
    if (effectiveMode === 'custom') {
      console.log('[InitialView] applying custom',
        project.publicInitialCenterLat,
        project.publicInitialCenterLng,
        'zoom', project.publicInitialZoom)
    } else if (effectiveMode === 'user_location') {
      console.log('[InitialView] applying user_location',
        userLocation!.latitude, userLocation!.longitude)
    } else {
      console.log('[InitialView] applying fit_points,', points.length, 'points')
    }
    applyProjectViewRef.current(false)
  }, [map, effectiveMode, userLocation]) // eslint-disable-line react-hooks/exhaustive-deps

  // User-triggered return to project view (toggle button).
  useEffect(() => {
    if (resetTrigger === 0 || !didApplyRef.current) return
    applyProjectViewRef.current(true)
  }, [resetTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

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

// ── Map-click handler for manual location picking ────────────────────────────

function MapPickHandler({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (!active) return
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// ── Location badge ────────────────────────────────────────────────────────────

function LocationBadge({ status, accuracy, onClick }: { status: LocationStatus; accuracy?: number; onClick: () => void }) {
  const lowAccuracy = status === 'active' && accuracy != null && accuracy > 100
  const isDisabled = status === 'active' && !lowAccuracy

  const colorClass =
    lowAccuracy              ? 'text-amber-300 border-amber-800/50' :
    status === 'active'      ? 'text-green-300 border-gray-600/70' :
    status === 'requesting'  ? 'text-yellow-300 border-gray-600/70' :
    status === 'denied'      ? 'text-red-300 border-red-800/60' :
                               'text-amber-300 border-amber-800/50'

  const label =
    lowAccuracy              ? 'Precisión baja — indicar ubicación' :
    status === 'active'      ? 'Ubicación activa' :
    status === 'requesting'  ? 'Obteniendo ubicación…' :
    status === 'denied'      ? 'Ubicación bloqueada' :
    status === 'unavailable' ? 'GPS no disponible' :
                               'Activar ubicación'

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={[
        'flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full',
        'bg-gray-900/95 border shadow-lg transition-all duration-150',
        colorClass,
        isDisabled ? 'cursor-default' : 'cursor-pointer active:scale-95 hover:brightness-110',
      ].join(' ')}
    >
      {status === 'requesting' ? (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />
      ) : (status === 'active' && !lowAccuracy) ? (
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

function LocationSheet({ onRetry, onClose, onManualFallback }: { onRetry: () => void; onClose: () => void; onManualFallback?: () => void }) {
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
              Abre la configuración de tu navegador, busca los permisos de este sitio y habilita el acceso a la ubicación.
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
        {onManualFallback && (
          <button
            onClick={() => { onClose(); onManualFallback() }}
            className="w-full bg-gray-800 hover:bg-gray-700 active:scale-[0.98]
                       text-gray-200 font-medium py-3 rounded-xl text-sm
                       transition-all duration-150 mb-2.5 border border-gray-700"
          >
            Indicar ubicación manualmente
          </button>
        )}
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
// expanded → half-height list (~52 dvh), map remains visible above
// full     → full-screen list (map hidden), "Mapa" button floats above
type SheetState = 'hidden' | 'expanded' | 'full'

const SHEET_HEIGHT: Record<SheetState, string> = {
  hidden:   '0px',
  expanded: '52dvh',
  full:     '100dvh',
}

// Calls map.invalidateSize() after iframe layout settles, then on every resize.
function InvalidateMapSize() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150)
    const onResize = () => map.invalidateSize()
    window.addEventListener('resize', onResize)
    let ro: ResizeObserver | null = null
    const container = map.getContainer()
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => map.invalidateSize())
      ro.observe(container)
    }
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); ro?.disconnect() }
  }, [map])
  return null
}

// ─── Unlocked content panel ───────────────────────────────────────────────────

function UnlockedContentPanel({ content, onClose }: { content: AccessResponse; onClose: () => void }) {
  const isUrl   = content.content_type === 'url'
  const isVideo = content.content_type === 'video'
  const isAudio = content.content_type === 'audio'
  const isFile  = content.content_type === 'file'

  function handleDownload() {
    if (isFile || isAudio || isVideo) {
      const a = document.createElement('a')
      a.href = content.file_url
      a.download = content.file_name || 'archivo'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  if (isUrl) return null

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#0a1020] border border-white/[0.08] rounded-t-2xl md:rounded-2xl
                   w-full md:max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden
                   shadow-[0_-24px_64px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{isVideo ? '🎬' : isAudio ? '🎵' : '📄'}</span>
            <span className="text-sm font-semibold text-white">
              {isVideo ? 'Video' : isAudio ? 'Audio' : 'Archivo descargable'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-4 min-h-0">

          {isVideo && (
            <video
              controls
              src={content.file_url}
              className="w-full rounded-xl bg-black max-h-[55dvh]"
              preload="metadata"
            />
          )}

          {isAudio && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <p className="text-sm font-medium text-gray-300 text-center max-w-xs truncate">
                {content.file_name}
              </p>
              <audio controls src={content.file_url} className="w-full max-w-sm" preload="metadata" />
            </div>
          )}

          {isFile && (
            <div className="flex flex-col items-center gap-5 py-8">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>
              <p className="text-sm font-medium text-gray-300 text-center max-w-xs truncate">
                {content.file_name}
              </p>
              <a
                href={content.file_url}
                download={content.file_name}
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                           font-semibold text-sm transition-all duration-150
                           shadow-[0_4px_20px_rgba(2,132,199,0.35)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Cluster layer (lives inside MapContainer) ─────────────────────────────────

interface MapClusterLayerProps {
  points:          GeoPoint[]
  selectedPointId: string | null
  onPointClick:    (pt: GeoPoint) => void
}

// Plain-number snapshot of the map viewport.
// Storing primitives (not a LatLngBounds object) lets React's useMemo do
// value-equality comparison: the memo re-runs only when coordinates actually
// change, and never misses an update due to a stale object reference.
interface Viewport { zoom: number; west: number; south: number; east: number; north: number }

function snapViewport(m: L.Map): Viewport {
  const b = m.getBounds()
  return { zoom: m.getZoom(), west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() }
}

function MapClusterLayer({ points, selectedPointId, onPointClick }: MapClusterLayerProps) {
  const map = useMap()

  // Single atomic state: zoom + all four bounds edges as primitives.
  // One setState call per event — no window where zoom is new but bounds are stale.
  const [vp, setVp] = useState<Viewport>(() => snapViewport(map))

  const updateViewport = useCallback(() => setVp(snapViewport(map)), [map])

  // Re-snapshot after points load: on /public the map is already at its fitBounds
  // position by the time points arrive from the API, so vp would otherwise be stale.
  useEffect(() => { updateViewport() }, [points.length, updateViewport])

  // Stable registration: deps are both stable refs, so this runs once on mount
  // and never cycles. useMapEvents({ ... }) recreates the handlers object on
  // every render (new reference → new deps → cleanup+setup every render), which
  // creates a race window where moveend from an animated flyTo can land between
  // the off() and the on() and be silently dropped.
  useEffect(() => {
    map.on('zoomend', updateViewport)
    map.on('moveend', updateViewport)
    map.on('viewreset', updateViewport)
    return () => {
      map.off('zoomend', updateViewport)
      map.off('moveend', updateViewport)
      map.off('viewreset', updateViewport)
    }
  }, [map, updateViewport])

  const sc = useMemo(() => {
    const instance = new Supercluster<GeoPoint>({ radius: 80, maxZoom: 15 })
    instance.load(
      points.map((pt) => ({
        type:       'Feature' as const,
        properties: pt,
        geometry:   { type: 'Point' as const, coordinates: [pt.longitude, pt.latitude] },
      })),
    )
    return instance
  }, [points])

  // Depends on six primitives — React skips recomputation when all six are
  // unchanged (e.g. an unrelated re-render), and runs immediately when any
  // one of them changes after zoom or pan.
  const features = useMemo(
    () => sc.getClusters([vp.west, vp.south, vp.east, vp.north], Math.floor(vp.zoom)),
    [sc, vp.zoom, vp.west, vp.south, vp.east, vp.north],
  )

  return (
    <>
      {features.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates

        if ('cluster_id' in feature.properties) {
          const { cluster_id, point_count } = feature.properties as Supercluster.ClusterProperties
          return (
            <ClusterMarker
              key={`cluster-${cluster_id}`}
              lat={lat}
              lng={lng}
              count={point_count}
              onClick={() => {
                const expansionZoom = sc.getClusterExpansionZoom(cluster_id)
                map.flyTo([lat, lng], Math.min(expansionZoom, 20), { animate: true, duration: 0.4 })
              }}
            />
          )
        }

        const pt = feature.properties as GeoPoint
        return (
          <PublicPointMarker
            key={pt.id}
            point={pt}
            selected={pt.id === selectedPointId}
            dimmed={selectedPointId !== null && pt.id !== selectedPointId}
            onClick={() => onPointClick(pt)}
            small
          />
        )
      })}
    </>
  )
}

interface DwellEntry {
  state:            'idle' | 'running' | 'completed'
  elapsed:          number
  total:            number
  startedAt:        number | null
  showResetMessage: boolean
}

export default function PublicPage({
  isEmbed = false,
  prefetched,
}: {
  isEmbed?: boolean
  prefetched?: { project: GeoProject; points: GeoPoint[] }
} = {}) {
  const { id: idParam } = useParams<{ id: string }>()
  const id = prefetched?.project.id ?? idParam
  const isTemporaryPreview = Boolean(prefetched)
  const [searchParams] = useSearchParams()
  // Captured once at mount so a URL change after load doesn't re-trigger selection.
  const deepLinkedPointIdRef = useRef(searchParams.get('point'))
  const { userLocation, locationStatus, setUserLocation, addToast } = useGeoStore()
  const { styleId: mapStyleId, setStyle: setMapStyle } = useMapStyle()
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points, setPoints] = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<LoadError>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [distances, setDistances] = useState<Record<string, number>>({})
  const [addresses, setAddresses] = useState<Record<string, string>>({})
  // Active visitor count per point, updated on each heartbeat response.
  const [liveVisitCounts, setLiveVisitCounts] = useState<Record<string, number>>({})
  const [activatingPointId, setActivatingPointId] = useState<string | null>(null)
  const [accessError, setAccessError] = useState<{
    pointId: string
    message: string
    fallbackUrl?: string
  } | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Dwell timer state ─────────────────────────────────────────────────────
  const [dwellMap, setDwellMap] = useState<Record<string, DwellEntry>>({})
  const dwellMapRef             = useRef<Record<string, DwellEntry>>({})
  const dwellCompletionFiredRef = useRef<Set<string>>(new Set())

  // ── Mobile interaction state ──────────────────────────────────────────────
  const [mobileState, setMobileState] = useState<MobileState>('clean')

  // ── Bottom sheet ───────────────────────────────────────────────────────────
  const [sheetState, setSheetState] = useState<SheetState>('hidden')
  const dragStartYRef   = useRef<number | null>(null)
  // dragHeight: live pixel height during a touch drag (null = not dragging, use SHEET_HEIGHT).
  const [dragHeight, setDragHeight] = useState<number | null>(null)
  const dragHeightRef   = useRef<number | null>(null)
  // sheetStateRef: sync copy of sheetState readable synchronously inside native listeners.
  const sheetStateRef   = useRef<SheetState>('hidden')
  // gestureLayerRef: non-scrolling wrapper that owns the expand/collapse touch listeners.
  const gestureLayerRef = useRef<HTMLDivElement>(null)
  // scrollAreaRef: inner scroll container — read scrollTop to detect collapse opportunity.
  const scrollAreaRef   = useRef<HTMLDivElement>(null)

  // ── Route state ────────────────────────────────────────────────────────────
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('idle')
  const routeForPointRef = useRef<string | null>(null)
  const lastRoutePositionRef = useRef<{ lat: number; lng: number } | null>(null)
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointsRef = useRef<GeoPoint[]>([])
  const wasInsideRef      = useRef<Record<string, boolean>>({})
  const userLocationRef   = useRef<UserLocation | null>(null)
  // Ref for the mobile bottom sheet — used to call L.DomEvent.disableClickPropagation
  // so Leaflet's internal tap/click detection cannot fire through the sheet.
  const sheetRef = useRef<HTMLDivElement>(null)

  // ── flyTo control ─────────────────────────────────────────────────────────
  const [flyToKey, setFlyToKey] = useState<string | null>(null)
  const [flyToTarget, setFlyToTarget] = useState<FlyTarget | null>(null)
  const flyToCounterRef = useRef(0)

  // ── Unlocked media content (video / audio / file) ────────────────────────
  // Set by handleActivate when the backend returns a non-URL content type.
  // Cleared when the user closes the media panel.
  const [unlockedContent, setUnlockedContent] = useState<AccessResponse | null>(null)

  // ── Landing mode validation state ─────────────────────────────────────────
  const [landingValidation, setLandingValidation] = useState<ValidationState>({ phase: 'idle' })
  // Prevents auto-trigger from firing more than once per page load
  const landingAutoStartedRef = useRef(false)
  // Saved when phase reaches 'unlocked' so area-monitoring can restore it on re-entry
  const landingUnlockedStateRef = useRef<{ onActivate: () => void; matchedGeoPointId: string } | null>(null)

  // ── Location toggle state ──────────────────────────────────────────────────
  // True whenever the button should show "return to project view" (⬚) instead
  // of the navigation arrow (▲). Set by two events:
  //   • user tapped the location button → map went to GPS
  //   • user closed a point popup      → map stayed on that area
  // In both cases the user has "left" the project overview and ⬚ lets them back.
  const [shouldReturnToProjectView, setShouldReturnToProjectView] = useState(false)
  // Incrementing this triggers PublicInitialViewController to re-apply the
  // project's initial view with animation (used when the user returns to it).
  const [resetViewTrigger, setResetViewTrigger] = useState(0)

  // ── Point list / map filter ────────────────────────────────────────────────
  // 'all'       → show every active point (regardless of schedule / quota)
  // 'available' → show only points currently accessible (schedule + quota pass)
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all')
  const [distanceSortOrder, setDistanceSortOrder] = useState<'asc' | 'desc'>('asc')

  // ── Ghost-click suppression ───────────────────────────────────────────────
  // Mobile browsers fire a synthetic click ~300ms after touchend.  When the
  // compact sheet is tapped and expands, that ghost click can land on a map
  // marker or point card that has shifted into position, re-opening the last
  // selected point.  Any point-selection handler checks this timestamp and
  // returns early if the ghost-click window has not yet elapsed.
  const suppressMapClickUntilRef = useRef<number>(0)

  // ── Location permission UX ────────────────────────────────────────────────
  // locationActive gates watchPosition — flipped to true after the first success.
  const [locationActive,      setLocationActive]      = useState(false)
  // locationSheet: mobile-native denied helper (step-by-step browser instructions)
  const [locationSheet,       setLocationSheet]       = useState(false)
  // manualLocationSheet: address search + map-pick fallback (works on any device)
  const [manualLocationSheet, setManualLocationSheet] = useState(false)
  // mapPickMode: user is clicking/tapping the map to set their location manually
  const [mapPickMode,         setMapPickMode]         = useState(false)

  // Isolate the mobile bottom sheet from Leaflet's tap/click detection.
  // Without this, Leaflet's internal event tracking can receive touch events
  // that bubble through common DOM ancestors and misfire as map/marker clicks.
  useEffect(() => {
    if (sheetRef.current) {
      L.DomEvent.disableClickPropagation(sheetRef.current)
    }
  }, [])

  // Keep sheetStateRef in sync so native touch handlers can read current state.
  useEffect(() => { sheetStateRef.current = sheetState }, [sheetState])
  // Keep dwellMapRef in sync so GPS hysteresis effect reads latest dwell state.
  useEffect(() => { dwellMapRef.current = dwellMap }, [dwellMap])

  // Airbnb-style scroll-to-expand: the gesture lives on gestureLayerRef (a non-scrolling
  // wrapper), NOT on the scroll container itself.  This prevents the browser from ever
  // entering "scroll mode" for the inner list while the sheet is in expanded state.
  //
  // expanded  → e.preventDefault() on every touchmove (eager, before dead zone)
  //             → dy > 0 (finger up) drives sheet height from expandedPx to fullPx
  //             → snap to full / back to expanded on touchend
  // full      → NO preventDefault for normal scrolls
  //             → dy < 0 (finger down) at scrollTop=0 collapses to expanded
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const el = gestureLayerRef.current!
    if (!el) return

    let startY         = 0
    let startScrollTop = 0
    type Mode = 'idle' | 'expanding' | 'collapsing' | 'scroll'
    let mode: Mode = 'idle'

    const expandedPx = () => Math.round(window.innerHeight * 0.52)
    const fullPx     = () => window.innerHeight

    function setDrag(h: number)  { dragHeightRef.current = h;    setDragHeight(h)    }
    function clearDrag()          { dragHeightRef.current = null; setDragHeight(null) }

    function onTouchStart(e: TouchEvent) {
      startY         = e.touches[0].clientY
      startScrollTop = scrollAreaRef.current?.scrollTop ?? 0
      mode           = 'idle'
    }

    function onTouchMove(e: TouchEvent) {
      const dy    = startY - e.touches[0].clientY   // positive = finger moved up
      const state = sheetStateRef.current

      // ── EXPANDED: the scroll area is overflow-y-hidden so content physically
      // cannot scroll — no need to call preventDefault() eagerly. Wait for a
      // real dead zone so the gesture feels like natural content scrolling, not
      // window dragging. Only block browser defaults once intent is confirmed.
      if (state === 'expanded') {
        if (mode === 'idle') {
          if (Math.abs(dy) < 10) return   // 10px dead zone — gesture feels natural
          mode = dy > 0 ? 'expanding' : 'scroll'
        }
        if (mode === 'expanding') {
          e.preventDefault()  // called only after intent is confirmed
          const expPx = expandedPx()
          const fPx   = fullPx()
          const newH  = Math.min(fPx, Math.max(expPx, expPx + dy))
          setDrag(newH)
          if (newH >= fPx) { setSheetState('full'); clearDrag(); mode = 'scroll' }
        }
        return
      }

      // ── FULL: normal list scroll; only intercept collapse from top ──
      if (mode === 'idle') {
        if (Math.abs(dy) < 4) return
        mode = (startScrollTop < 2 && dy < 0) ? 'collapsing' : 'scroll'
      }
      if (mode === 'scroll') return   // native scroll — no preventDefault

      // mode === 'collapsing'
      e.preventDefault()
      const expPx = expandedPx()
      const fPx   = fullPx()
      setDrag(Math.max(expPx, Math.min(fPx, fPx + dy)))  // dy < 0 → shrinks sheet
    }

    function onTouchEnd() {
      if (mode === 'expanding' || mode === 'collapsing') {
        const h         = dragHeightRef.current
        const expPx     = expandedPx()
        const fPx       = fullPx()
        const threshold = expPx + (fPx - expPx) * 0.4
        if (h !== null) setSheetState(h > threshold ? 'full' : 'expanded')
        clearDrag()
      }
      mode = 'idle'
    }

    el.addEventListener('touchstart',  onTouchStart, { passive: true  })
    el.addEventListener('touchmove',   onTouchMove,  { passive: false })
    el.addEventListener('touchend',    onTouchEnd,   { passive: true  })
    el.addEventListener('touchcancel', onTouchEnd,   { passive: true  })
    return () => {
      el.removeEventListener('touchstart',  onTouchStart)
      el.removeEventListener('touchmove',   onTouchMove)
      el.removeEventListener('touchend',    onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Close the sheet whenever location becomes active
  useEffect(() => {
    if (locationStatus === 'active') setLocationSheet(false)
  }, [locationStatus])

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

  function handleManualLocationConfirm(lat: number, lng: number) {
    // Stop any active GPS watch so it can't override the manual location.
    // accuracy: 0 signals "exact manual pick" — won't trigger lowAccuracy badge.
    setLocationActive(false)
    setUserLocation({ latitude: lat, longitude: lng, accuracy: 0 }, 'active')
    setManualLocationSheet(false)
    setMapPickMode(false)
    flyToCounterRef.current += 1
    setFlyToKey(`manual-${flyToCounterRef.current}`)
    setFlyToTarget({ lat, lng, zoom: 16 })
  }

  function handleBadgeClick() {
    if (locationStatus === 'requesting') return
    if (locationStatus === 'active') {
      // Low accuracy — offer manual
      if (userLocation && userLocation.accuracy > 100) setManualLocationSheet(true)
      return
    }
    if (locationStatus === 'denied') {
      // Mobile: show native permission helper; Desktop: go straight to manual
      if (detectPlatform() === 'other') {
        setManualLocationSheet(true)
      } else {
        setLocationSheet(true)
      }
      return
    }
    if (locationStatus === 'unavailable') {
      setManualLocationSheet(true)
      return
    }
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

  useEffect(() => { pointsRef.current    = points       }, [points])
  useEffect(() => { userLocationRef.current = userLocation }, [userLocation])

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
    if (prefetched) {
      const activePoints = prefetched.points.filter((p) => p.active)
      console.log('[DwellDebug][temporary] PublicPage prefetched — active points:', activePoints.length,
        '| first point dwell:', activePoints[0]
          ? { id: activePoints[0].id, requiresDwellTime: activePoints[0].requiresDwellTime, dwellTimeSeconds: activePoints[0].dwellTimeSeconds }
          : '(none)')
      const proj = prefetched.project
      if (!isEmbed) {
        const ogImage = resolveOgImage(proj.coverImage)
        const ogDesc = proj.shareText?.trim() || `Previsualización de: ${proj.title}`
        updatePageMeta(proj.title, ogDesc, ogImage, window.location.href)
      }
      setProject(proj)
      setPoints(activePoints)
      setLoading(false)
      return () => { if (!isEmbed) resetPageMeta() }
    }

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
          || `Experiencia geolocalizada${proj.subtitle ? `: ${proj.subtitle}` : ' en Ubyca'}`
        if (!isEmbed) updatePageMeta(proj.title, ogDesc, ogImage, window.location.href)

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
      if (!isEmbed) resetPageMeta()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!userLocation) return
    for (const pt of points) {
      const isInside  = isInsideActivationArea(pt, userLocation.latitude, userLocation.longitude)
      const wasInside = wasInsideRef.current[pt.id] ?? false
      if (!wasInside && isInside) {
        // id may be undefined in prefetched preview mode — skip analytics, still vibrate
        if (id) trackRadiusEnter(id, pt.id, userLocation)
        if ('vibrate' in navigator) navigator.vibrate(20)
      }
      wasInsideRef.current[pt.id] = isInside
    }
  }, [userLocation, points, id])

  // ── Dwell timer — GPS hysteresis ─────────────────────────────────────────
  // Entry threshold : dist ≤ activationRadius  (mirrors the access check)
  // Exit  threshold : dist > activationRadius + 20 m  (hysteresis gap)
  useEffect(() => {
    // id may be undefined in prefetched preview mode (route param is "token", not "id").
    // The timer logic never needs id — only analytics calls do.
    if (!userLocation) return
    for (const pt of points) {
      console.log('[DwellDebug][hysteresis] route:', isTemporaryPreview ? 'temporary' : 'public',
        '| pt:', pt.id,
        '| requiresDwellTime:', pt.requiresDwellTime,
        '| dwellTimeSeconds:', pt.dwellTimeSeconds)
      if (!(pt.requiresDwellTime ?? false) || !pt.dwellTimeSeconds) continue
      const dist = haversineDistance(
        userLocation.latitude, userLocation.longitude,
        pt.latitude, pt.longitude,
      )
      const entry    = dwellMapRef.current[pt.id]
      const isInside = isInsideActivationArea(pt, userLocation.latitude, userLocation.longitude)
      // For radius mode: add 20 m hysteresis to prevent rapid in/out near the edge.
      // For polygon mode: use the polygon boundary directly (no extra buffer).
      const isExited = pt.activationMode === 'polygon' && pt.activationPolygon
        ? !isInside
        : dist > pt.activationRadius + 20
      console.log('[DwellDebug][hysteresis] route:', isTemporaryPreview ? 'temporary' : 'public',
        '| pt:', pt.id,
        '| dist:', dist.toFixed(0) + 'm', '| radius:', pt.activationRadius + 'm',
        '| isInside:', isInside, '| isExited:', isExited,
        '| entry.state:', entry?.state ?? 'none')

      if (isInside && (!entry || entry.state === 'idle')) {
        setDwellMap((prev) => ({
          ...prev,
          [pt.id]: {
            state: 'running', elapsed: 0, total: pt.dwellTimeSeconds!,
            startedAt: Date.now(), showResetMessage: false,
          },
        }))
        if (id) trackDwellStarted(id, pt.id, userLocation)
      } else if (isExited && entry?.state === 'running') {
        const capturedId = pt.id
        setDwellMap((prev) => ({
          ...prev,
          [capturedId]: {
            ...prev[capturedId],
            state: 'idle', elapsed: 0, startedAt: null, showResetMessage: true,
          },
        }))
        if (id) trackDwellCancelled(id, pt.id)
        setTimeout(() => {
          setDwellMap((prev) => {
            if (!prev[capturedId]?.showResetMessage) return prev
            return { ...prev, [capturedId]: { ...prev[capturedId], showResetMessage: false } }
          })
        }, 3500)
      }
    }
  }, [userLocation, points, id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dwell interval — 1-second tick ────────────────────────────────────────
  const hasRunningDwell = Object.values(dwellMap).some((e) => e.state === 'running')
  useEffect(() => {
    if (!hasRunningDwell) return
    const interval = setInterval(() => {
      setDwellMap((prev) => {
        if (!Object.values(prev).some((e) => e.state === 'running')) return prev
        const next: Record<string, DwellEntry> = {}
        for (const [ptId, entry] of Object.entries(prev)) {
          if (entry.state !== 'running') { next[ptId] = entry; continue }
          const newElapsed = entry.elapsed + 1
          next[ptId] = newElapsed >= entry.total
            ? { ...entry, state: 'completed', elapsed: entry.total }
            : { ...entry, elapsed: newElapsed }
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [hasRunningDwell])

  // ── Live-visit heartbeat — 15-second interval ────────────────────────────
  // Live visits mide presencia física dentro del radio GPS de puntos activos,
  // independiente de disponibilidad del contenido.
  // Solo se evalúa pt.active (toggle del editor); horario, cupos, CTA y
  // reglas de acceso no se consideran aquí.
  // Fire-and-forget: errors are swallowed so they never surface to the visitor.
  useEffect(() => {
    if (!id) return // skip in prefetched preview mode (no project id)
    const sessionId = getLiveVisitSessionId()

    function heartbeatTick() {
      const loc   = userLocationRef.current
      const all   = pointsRef.current
      const active = all.filter((p) => p.active)

      if (import.meta.env.DEV) {
        console.group('[LiveVisits] heartbeat tick')
        console.log('puntos totales cargados:', all.length, '| puntos activos evaluados:', active.length)
      }

      if (!loc) {
        if (import.meta.env.DEV) {
          console.warn('[LiveVisits] sin ubicación disponible — heartbeat omitido')
          console.groupEnd()
        }
        return
      }

      if (import.meta.env.DEV) {
        console.log('ubicación del usuario → lat:', loc.latitude, '| lng:', loc.longitude, '| accuracy:', loc.accuracy, 'm')
      }

      // Project-level heartbeat: always fire when GPS is valid, regardless of area membership.
      // id is guaranteed non-null here — the outer `if (!id) return` guard ran before this tick.
      sendProjectHeartbeat(id!, { session_id: sessionId, lat: loc.latitude, lng: loc.longitude, accuracy: loc.accuracy })
      if (import.meta.env.DEV) {
        console.log('[LiveVisits] → heartbeat de proyecto | projectId:', id)
      }

      for (const pt of active) {
        const inside = isInsideActivationArea(pt, loc.latitude, loc.longitude)

        if (import.meta.env.DEV) {
          const mode = pt.activationMode ?? 'radius'
          const dist = haversineDistance(loc.latitude, loc.longitude, pt.latitude, pt.longitude)
          console.log(
            `  punto "${pt.name || pt.id}"`,
            '| id:', pt.id,
            '| modo:', mode,
            ...(mode === 'radius'
              ? ['| radio:', pt.activationRadius, 'm', '| distancia:', Math.round(dist), 'm']
              : ['| polígono:', pt.activationPolygon ? 'sí' : 'no']),
            '| dentro del área:', inside,
          )
        }

        if (inside) {
          const payload = { session_id: sessionId, lat: loc.latitude, lng: loc.longitude, accuracy: loc.accuracy }
          if (import.meta.env.DEV) {
            console.log('  → enviando heartbeat | geoPointId:', pt.id, '| payload:', payload)
          }
          sendHeartbeat(pt.id, payload).then((res) => {
            if (res?.active_now !== undefined) {
              setLiveVisitCounts((prev) => ({ ...prev, [pt.id]: res.active_now! }))
            }
          })
        } else {
          if (import.meta.env.DEV) {
            console.log('  → heartbeat omitido | fuera del área de activación')
          }
        }
      }

      if (import.meta.env.DEV) console.groupEnd()
    }

    // Fire immediately so the live count is available as soon as location is known,
    // then repeat every 15 seconds.
    heartbeatTick()
    const timer = setInterval(heartbeatTick, 5_000)
    return () => clearInterval(timer)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dwell completion side-effects ─────────────────────────────────────────
  // Fires trackDwellCompleted + completeDwellTime once per completed point.
  useEffect(() => {
    for (const [ptId, entry] of Object.entries(dwellMap)) {
      if (entry.state !== 'completed') continue
      if (dwellCompletionFiredRef.current.has(ptId)) continue
      if (!id || !entry.startedAt) continue
      dwellCompletionFiredRef.current.add(ptId)
      const capturedStartedAt = entry.startedAt
      trackDwellCompleted(id, ptId, userLocation)
      void geoPointsApi.completeDwellTime(
        id, ptId,
        userLocation?.latitude  ?? 0,
        userLocation?.longitude ?? 0,
        capturedStartedAt,
      ).catch(() => {})
    }
  }, [dwellMap]) // eslint-disable-line react-hooks/exhaustive-deps

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
    // Show the ⬚ button so the user can easily return to the project overview.
    // The map is not moved — this is purely a button-state change.
    setShouldReturnToProjectView(true)
  }

  function handlePointClick(pt: GeoPoint) {
    if (Date.now() < suppressMapClickUntilRef.current) return
    setSelectedPointId(pt.id)
    setAccessError(null)
    setMobileState('preview')
    setShouldReturnToProjectView(false)
    // Tap from list → close sheet so the map is visible.
    if (sheetState !== 'hidden') setSheetState('hidden')
    flyToCounterRef.current += 1
    setFlyToKey(`point-${pt.id}-${flyToCounterRef.current}`)
    // Shift the fly target 80px south so the pin lands in the upper portion of the visible map area.
    const panOffsetPx = 80
    setFlyToTarget({ lat: pt.latitude, lng: pt.longitude, zoom: 17, panOffsetPx })
  }

  function handleViewDetail() {
    if (!selectedPointId || !id) return
    window.location.href = `/public/${id}?point=${selectedPointId}`
  }

  function handleCloseDetail() {
    setMobileState('preview')
  }

  function handleMyLocation() {
    if (!project) return
    const viewMode = project.publicInitialViewMode ?? 'fit_points'

    // user_location mode: button always centers on current GPS (no toggle).
    if (viewMode === 'user_location') {
      if (!userLocation) return
      flyToCounterRef.current += 1
      setFlyToKey(`user-${flyToCounterRef.current}`)
      setFlyToTarget({ lat: userLocation.latitude, lng: userLocation.longitude, zoom: 17 })
      return
    }

    if (shouldReturnToProjectView) {
      // ⬚ tap: return to the project's initial view.
      setShouldReturnToProjectView(false)
      setResetViewTrigger((n) => n + 1)
    } else {
      // ▲ tap: fly to the user's GPS position.
      if (!userLocation) return
      setShouldReturnToProjectView(true)
      flyToCounterRef.current += 1
      setFlyToKey(`user-${flyToCounterRef.current}`)
      setFlyToTarget({ lat: userLocation.latitude, lng: userLocation.longitude, zoom: 17 })
    }
  }

  function handleFilterChange(next: LocationFilter) {
    if (next === locationFilter) return
    setLocationFilter(next)
    // Clear any active selection so the UI stays consistent when a selected
    // point is hidden by the new filter.
    setSelectedPointId(null)
    setAccessError(null)
    setMobileState('clean')
  }

  async function handleShare() {
    const url = window.location.href
    const title = project?.title ?? 'Experiencia Ubyca'
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
    if (sheetState === 'expanded') {
      if (delta < -40) {
        // Swipe down → close and return to map
        suppressMapClickUntilRef.current = Date.now() + 500
        setSheetState('hidden')
      } else if (delta > 40) {
        // Swipe up → expand to full list
        setSheetState('full')
      }
    } else if (sheetState === 'full') {
      if (delta < -40) {
        // Swipe down → back to partial list with map visible
        setSheetState('expanded')
      }
    }
  }

  const handleActivate = useCallback(async (point: GeoPoint) => {
    if (activatingPointId) return

    const isOpen = point.accessMode === 'open'

    // ── Prefetched preview mode ────────────────────────────────────────────────
    // The project and points exist only in the backend's temporary cache, not in
    // the real database. Skip geolocation and the /access API entirely; navigate
    // directly to the configured URL so the creator can validate the experience.
    if (prefetched) {
      if (!point.contentType || point.contentType === 'url') {
        const targetUrl =
          point.lookiarUrl ||
          (point.contentData && 'url' in point.contentData
            ? (point.contentData as { url: string }).url
            : '')
        if (targetUrl && targetUrl.startsWith('http')) {
          window.location.href = targetUrl
          return
        }
        setAccessError({ pointId: point.id, message: 'Este punto no tiene una URL configurada.' })
        return
      }
      // Media content (video/audio/file) is not available in prefetched previews.
      setAccessError({ pointId: point.id, message: 'El contenido multimedia solo está disponible en experiencias publicadas.' })
      return
    }
    // ── End prefetched mode ───────────────────────────────────────────────────

    if (!userLocation) {
      if (isOpen && point.lookiarUrl && (!point.contentType || point.contentType === 'url')) {
        trackPointClick(id!, point.id, {
          contentType:         point.contentType ?? 'url',
          destinationCategory: point.destinationCategory ?? null,
        })
        window.location.href = point.lookiarUrl
        return
      }
      addToast('Activa tu ubicación para acceder a la experiencia.', 'error')
      return
    }

    setAccessError(null)
    trackPointClick(id!, point.id, {
      contentType:         point.contentType ?? 'url',
      destinationCategory: point.destinationCategory ?? null,
    })

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
      console.log('[Access] ✓ Respuesta del backend:', JSON.stringify(raw))

      const r = raw as Record<string, unknown>
      const contentType = (typeof r.content_type === 'string' ? r.content_type : null) ?? 'url'

      if (contentType !== 'url') {
        // Media content (video / audio / file) — render inline panel
        const fileUrl = typeof r.file_url === 'string' ? r.file_url : ''
        if (!fileUrl || !fileUrl.startsWith('http')) {
          const msg = 'No se encontró el archivo para esta experiencia.'
          setAccessError({ pointId: point.id, message: msg })
          addToast(msg, 'error')
        } else {
          setAccessError(null)
          setUnlockedContent(raw as AccessResponse)
        }
      } else {
        // URL type — redirect (existing behavior)
        const resolvedUrl =
          (typeof r.url          === 'string' && r.url)          ||
          (typeof r.redirect_url === 'string' && r.redirect_url) ||
          (typeof r.target_url   === 'string' && r.target_url)   ||
          ''

        console.log('[Access] URL resuelta:', resolvedUrl || '(vacía)')

        if (!resolvedUrl || !resolvedUrl.startsWith('http')) {
          const msg = 'No se encontró una URL válida para esta experiencia.'
          console.warn('[Access] URL inválida o vacía:', r.url)
          setAccessError({ pointId: point.id, message: msg })
          addToast(msg, 'error')
        } else {
          window.location.href = resolvedUrl
        }
      }
    } catch (err) {
      console.error('[Access] ✗ Error recibido:', err)

      if (isOpen && (!point.contentType || point.contentType === 'url')) {
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
  }, [activatingPointId, userLocation, id, addToast, prefetched])

  // ── Landing mode handler ──────────────────────────────────────────────────
  async function handleLandingContinue() {
    const pointId = deepLinkedPointIdRef.current
    if (!pointId || !id) return

    const point = points.find((p) => p.id === pointId)
    if (!point) return

    setLandingValidation({ phase: 'requesting' })

    let loc = userLocationRef.current

    if (!loc) {
      try {
        const pos = await getCurrentPosition()
        loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }
        setUserLocation(loc, 'active')
        setLocationActive(true)
      } catch (err) {
        const code = (err as GeolocationPositionError)?.code
        setUserLocation(null, code === 1 ? 'denied' : 'unavailable')
        setLandingValidation({ phase: 'location_error' })
        return
      }
    } else {
      setLocationActive(true)
    }

    setLandingValidation({ phase: 'validating' })
    try {
      const raw = await geoPointsApi.requestPointAccess(
        id, point.id, loc.latitude, loc.longitude, point.accessMode,
      )
      const r = raw as Record<string, unknown>
      const contentType = (typeof r.content_type === 'string' ? r.content_type : null) ?? 'url'

      if (contentType !== 'url') {
        const fileUrl = typeof r.file_url === 'string' ? r.file_url : ''
        if (!fileUrl || !fileUrl.startsWith('http')) {
          setLandingValidation({ phase: 'blocked', message: 'No se encontró el archivo para esta experiencia.' })
        } else {
          const onActivate = () => setUnlockedContent(raw as AccessResponse)
          landingUnlockedStateRef.current = { onActivate, matchedGeoPointId: point.id }
          setLandingValidation({ phase: 'unlocked', matchedGeoPointId: point.id, onActivate })
        }
      } else {
        const resolvedUrl =
          (typeof r.url          === 'string' && r.url)          ||
          (typeof r.redirect_url === 'string' && r.redirect_url) ||
          (typeof r.target_url   === 'string' && r.target_url)   ||
          ''
        if (!resolvedUrl || !resolvedUrl.startsWith('http')) {
          setLandingValidation({ phase: 'blocked', message: 'No se encontró una URL válida para esta experiencia.' })
        } else {
          const onActivate = () => { window.location.href = resolvedUrl }
          landingUnlockedStateRef.current = { onActivate, matchedGeoPointId: point.id }
          setLandingValidation({ phase: 'unlocked', matchedGeoPointId: point.id, onActivate })
        }
      }
    } catch (err) {
      let msg = 'No se pudo validar el acceso. Intenta nuevamente.'
      if (err instanceof ApiError) {
        try {
          const parsed: unknown = JSON.parse((err as ApiError).message)
          if (parsed && typeof parsed === 'object' && 'message' in parsed)
            msg = String((parsed as { message: unknown }).message)
          else if (parsed && typeof parsed === 'object' && 'error' in parsed)
            msg = String((parsed as { error: unknown }).error)
        } catch {
          const status = (err as ApiError).status
          if (status === 403)      msg = 'Proyecto no publicado.'
          else if (status === 404) msg = 'Punto no encontrado.'
        }
      }
      setLandingValidation({ phase: 'blocked', message: msg })
    }
  }

  // Auto-trigger landing validation when GPS permission is already granted (avoids re-prompting
  // the user after navigating from the map back to a GeoPoint landing on a fresh page load).
  useEffect(() => {
    if (landingAutoStartedRef.current) return
    if (!deepLinkedPointIdRef.current) return
    if (!points.some((p) => p.id === deepLinkedPointIdRef.current)) return
    if (!navigator.permissions) return

    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((result) => {
        if (result.state === 'granted' && !landingAutoStartedRef.current) {
          landingAutoStartedRef.current = true
          void handleLandingContinue()
        }
      })
      .catch(() => { /* permissions API unavailable — user must click manually */ })
  }, [points]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep landing unlocked/blocked in sync with the user's physical position.
  // Runs whenever GPS position updates while the landing is active.
  useEffect(() => {
    if (!deepLinkedPointIdRef.current) return
    if (!userLocation) return

    const phase = landingValidation.phase
    if (phase !== 'unlocked' && phase !== 'blocked') return

    const point = points.find((p) => p.id === deepLinkedPointIdRef.current)
    if (!point) return

    const inside = isInsideActivationArea(point, userLocation.latitude, userLocation.longitude)

    if (phase === 'unlocked' && !inside) {
      setLandingValidation({ phase: 'blocked', message: 'Saliste del área de acceso.' })
    } else if (phase === 'blocked' && inside && landingUnlockedStateRef.current) {
      const { onActivate, matchedGeoPointId } = landingUnlockedStateRef.current
      setLandingValidation({ phase: 'unlocked', matchedGeoPointId, onActivate })
    }
  }, [userLocation, landingValidation.phase, points]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter-derived point sets ──────────────────────────────────────────────
  // `points`          = all admin-enabled points (the "ubicaciones" universe)
  // `availablePoints` = subset currently accessible by schedule + quota rules
  // `displayedPoints` = what actually renders on the map and in the list
  const availablePoints = points.filter((p) => isPointAvailableNow(p, liveVisitCounts))
  const displayedPoints = locationFilter === 'available' ? availablePoints : points

  const sortedDisplayedPoints = useMemo(() => {
    if (!userLocation) return displayedPoints
    return [...displayedPoints].sort((a, b) => {
      const da = distances[a.id]
      const db = distances[b.id]
      if (da == null || db == null) return 0
      return distanceSortOrder === 'asc' ? da - db : db - da
    })
  }, [displayedPoints, distances, userLocation, distanceSortOrder])

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

  // ── Landing mode: ?point=:id → full-page GeoPoint landing experience ─────
  if (deepLinkedPointIdRef.current && points.some((p) => p.id === deepLinkedPointIdRef.current)) {
    return (
      <>
        <GeoPointLanding
          initialPointId={deepLinkedPointIdRef.current}
          project={project}
          points={points}
          validation={landingValidation}
          userLocation={userLocation}
          liveVisitsMap={liveVisitCounts}
          onContinue={() => { void handleLandingContinue() }}
        />
        {unlockedContent && unlockedContent.content_type !== 'url' && (
          <UnlockedContentPanel content={unlockedContent} onClose={() => setUnlockedContent(null)} />
        )}
      </>
    )
  }

  // Fallback center for MapContainer's initial mount prop.
  // PublicInitialViewController (inside MapContainer) applies the real view once.
  const mapFallbackCenter: [number, number] = points.length > 0
    ? [
        points.reduce((s, p) => s + p.latitude,  0) / points.length,
        points.reduce((s, p) => s + p.longitude, 0) / points.length,
      ]
    : [-33.4489, -70.6693]

  const selectedPoint = selectedPointId
    ? (points.find((p) => p.id === selectedPointId) ?? null)
    : null

  // True when the button should show "return to project view" instead of the location arrow.
  const locationButtonReturnsToProject =
    (project.publicInitialViewMode ?? 'fit_points') !== 'user_location' &&
    shouldReturnToProjectView

  function getDwellProgress(ptId: string, pt: GeoPoint): DwellProgress | undefined {
    if (!(pt.requiresDwellTime ?? false)) return undefined
    const entry = dwellMap[ptId]
    const progress = !entry
      ? { state: 'idle' as const, elapsed: 0, total: pt.dwellTimeSeconds ?? 60, showResetMessage: false }
      : { state: entry.state, elapsed: entry.elapsed, total: entry.total, showResetMessage: entry.showResetMessage }
    console.log('[DwellDebug][progress] route:', isTemporaryPreview ? 'temporary' : 'public',
      '| ptId:', ptId,
      '| requiresDwellTime:', pt.requiresDwellTime,
      '| dwellTimeSeconds:', pt.dwellTimeSeconds,
      '| state:', progress.state,
      '| elapsed:', progress.elapsed + '/' + progress.total)
    return progress
  }

  // ── Shared card list renderer ──────────────────────────────────────────────
  // cardRefsProp: which ref map to populate (mobile or desktop)
  function renderPoints(cardRefsProp: React.MutableRefObject<Record<string, HTMLDivElement | null>>) {
    if (sortedDisplayedPoints.length === 0) {
      return (
        <p className="text-sm text-gray-500 text-center py-6 px-4">
          {locationFilter === 'available'
            ? 'No hay experiencias activas en este momento.'
            : 'Este proyecto no tiene puntos activos aún.'}
        </p>
      )
    }
    return sortedDisplayedPoints.map((pt) => (
      <div key={pt.id} ref={(el) => { cardRefsProp.current[pt.id] = el }}>
        <PublicPointCard
          point={pt}
          distance={distances[pt.id] ?? null}
          userLocation={userLocation}
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
          pointCreatedAt={pt.createdAt}
          dwellProgress={getDwellProgress(pt.id, pt)}
          liveVisitsCount={liveVisitCounts[pt.id]}
        />
      </div>
    ))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={`bg-gray-950 overflow-hidden relative${isEmbed ? '' : ' md:flex md:flex-col'}`}
      style={isEmbed ? { position: 'fixed', inset: 0 } : { height: '100dvh' }}
    >

      {/* ── MAP ─────────────────────────────────────────────────────────────
          Mobile: absolute inset-0 → fills full viewport behind the sheet.
          Desktop (md:): relative flex-1 → normal flex-column child.
          Embed: always absolute inset-0 (force mobile layout).            */}
      <div className={`absolute inset-0${isEmbed ? '' : ' md:relative md:flex-1'}`}>
        <MapContainer center={mapFallbackCenter} zoom={14} maxZoom={20} className="w-full h-full" style={mapPickMode ? { cursor: 'crosshair' } : undefined}>
          <MapController flyKey={flyToKey} flyTarget={flyToTarget} />
          {isEmbed && <InvalidateMapSize />}
          <MapPickHandler active={mapPickMode} onPick={handleManualLocationConfirm} />
          <PublicInitialViewController
            project={project}
            points={points}
            userLocation={userLocation}
            resetTrigger={resetViewTrigger}
          />
          <BaseMapLayer key={mapStyleId} styleId={mapStyleId} />
          {userLocation && (
            <UserLocationMarker lat={userLocation.latitude} lng={userLocation.longitude} />
          )}
          <MapClusterLayer
            points={displayedPoints}
            selectedPointId={selectedPointId}
            onPointClick={handlePointClick}
          />
          {routeResult && (
            <RoutePolyline
              latLngs={
                userLocation
                  ? trimRouteFromUser(routeResult.latLngs, userLocation.latitude, userLocation.longitude)
                  : routeResult.latLngs
              }
            />
          )}
        </MapContainer>

        {/* Location badge — interactive button */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400]">
          <LocationBadge status={locationStatus} accuracy={userLocation?.accuracy} onClick={handleBadgeClick} />
        </div>

        {/* Map style toggle — left on mobile, right on desktop.
            On mobile, the preview badge stacks above the toggle via flex-col. */}
        <div className="absolute bottom-8 left-4 z-[600] md:left-auto md:right-4 md:z-[400]
                        flex flex-col items-start gap-2">
          {isTemporaryPreview && (
            <div className="pointer-events-none md:hidden">
              <span className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm border border-white/10
                               rounded-full px-3 py-1 text-[10px] font-medium text-white/40
                               select-none whitespace-nowrap">
                Preview&nbsp;
                <a
                  href="https://www.ubyca.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto text-white/60 hover:text-white/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ubyca
                </a>
              </span>
            </div>
          )}
          <MapStyleToggle styleId={mapStyleId} onStyleChange={setMapStyle} />
        </div>

        {/* Map-pick cursor overlay — crosshair when waiting for tap/click */}
        {mapPickMode && (
          <div
            className="absolute inset-0 z-[450]"
            style={{ cursor: 'crosshair', pointerEvents: 'none' }}
          />
        )}

        {/* Map-pick instruction banner */}
        {mapPickMode && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[500] whitespace-nowrap">
            <div className="flex items-center gap-2 bg-gray-900/95 border border-gray-700 rounded-full
                            px-4 py-2 shadow-lg backdrop-blur-sm">
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
              <span className="text-xs font-medium text-gray-200">Haz clic en el mapa para seleccionar tu ubicación</span>
              <button
                onClick={() => setMapPickMode(false)}
                className="ml-1 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Cancelar selección"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Location permission sheet (mobile only) */}
        {locationSheet && (
          <LocationSheet
            onRetry={handleLocationRetry}
            onClose={() => setLocationSheet(false)}
            onManualFallback={() => setManualLocationSheet(true)}
          />
        )}

        {/* Share button — mobile only, column above my-location */}
        <button
          onClick={() => void handleShare()}
          className={[
            'absolute right-4 z-[400]',
            'w-11 h-11 flex items-center justify-center',
            'bg-white rounded-full border border-gray-200/60 shadow-md',
            'hover:bg-gray-50 active:scale-95 active:shadow-sm',
            'transition-all duration-150',
            mobileState === 'detail'    ? 'hidden'
            : sheetState !== 'hidden'   ? 'hidden'
            : mobileState === 'preview' ? (isEmbed ? 'bottom-[336px]' : 'bottom-[336px] md:hidden')
            :                             (isEmbed ? 'bottom-[160px]' : 'bottom-[160px] md:hidden'),
          ].join(' ')}
          title="Compartir"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

        {/* My location / return-to-project toggle button */}
        <button
          onClick={handleMyLocation}
          disabled={!locationButtonReturnsToProject && !userLocation}
          className={[
            'absolute right-4 z-[400]',
            'w-11 h-11 flex items-center justify-center',
            'bg-white rounded-full border border-gray-200/60 shadow-md',
            'hover:bg-gray-50 active:scale-95 active:shadow-sm',
            'transition-all duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
            mobileState === 'detail'    ? (isEmbed ? 'hidden' : 'hidden md:flex md:bottom-4')
            : sheetState !== 'hidden'   ? (isEmbed ? 'hidden' : 'hidden md:flex md:bottom-4')
            : mobileState === 'preview' ? (isEmbed ? 'bottom-[284px]' : 'bottom-[284px] md:bottom-4')
            :                             (isEmbed ? 'bottom-[108px]' : 'bottom-[108px] md:bottom-4'),
          ].join(' ')}
          title={locationButtonReturnsToProject ? 'Volver a vista del proyecto' : 'Mi ubicación'}
        >
          {locationButtonReturnsToProject ? (
            /* Fit-to-bounds icon — indicates "zoom out to show all / return to overview" */
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9V5h4M15 5h4v4M15 19h4v-4M5 15v4h4" />
            </svg>
          ) : (
            /* Navigation arrow — indicates "go to my GPS location" */
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L4 22 L12 17.5 L20 22 Z" />
            </svg>
          )}
        </button>

      {/* ── Preview watermark — desktop only (md+)
            On mobile the badge renders inside the MapStyleToggle wrapper above */}
      {isTemporaryPreview && (
        <div className="hidden md:block absolute bottom-6 left-6 z-[600] pointer-events-none">
          <span className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm border border-white/10
                           rounded-full px-3 py-1 text-[10px] font-medium text-white/40
                           select-none whitespace-nowrap">
            Preview&nbsp;
            <a
              href="https://www.ubyca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto text-white/60 hover:text-white/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Ubyca
            </a>
          </span>
        </div>
      )}
      </div>

      {/* ── MOBILE BOTTOM SHEET (hidden on md+) ─────────────────────────────
          Height changes per state — the sheet always anchors to bottom-0 and
          grows/shrinks upward. flex-1 on the scroll area fills the visible space.
          hidden   → 0px               — map fullscreen
          expanded → 52dvh             — map visible above, list below
          full     → 100dvh            — full list, "Mapa" button floats above */}
      <div
        ref={sheetRef}
        className={`${isEmbed ? '' : 'md:hidden '}absolute inset-x-0 bottom-0 z-[1000]`}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          height:     dragHeight !== null ? `${dragHeight}px` : SHEET_HEIGHT[sheetState],
          transition: dragHeight !== null ? 'none' : 'height 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="h-full flex flex-col rounded-t-[28px] overflow-hidden
                        bg-white
                        border-t border-gray-200
                        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">

          {/* Drag handle — swipe down to close */}
          <div
            className="flex-shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-9 h-1 rounded-full bg-gray-300" />
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
                <p className="text-sm font-semibold text-gray-700 line-clamp-2 leading-snug">
                  {project.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={[
                      'px-3.5 py-1.5 rounded-full text-[11px] font-semibold',
                      'border transition-all duration-200 active:scale-[0.95]',
                      'shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.07)]',
                      locationFilter === 'all'
                        ? 'bg-gray-900 text-white border-gray-700'
                        : 'bg-white text-gray-600 border-gray-300/80 hover:text-gray-800 hover:border-gray-400/70',
                    ].join(' ')}
                  >
                    {points.length} ubicaciones
                  </button>
                  <button
                    onClick={() => handleFilterChange('available')}
                    className={[
                      'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold',
                      'border transition-all duration-200 active:scale-[0.95]',
                      'shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.07)]',
                      locationFilter === 'available'
                        ? 'bg-gray-900 text-white border-gray-700'
                        : 'bg-white text-gray-600 border-gray-300/80 hover:text-gray-800 hover:border-gray-400/70',
                    ].join(' ')}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      locationFilter === 'available' ? 'bg-emerald-400' : 'bg-emerald-500/50'
                    }`} />
                    {availablePoints.length} activas
                  </button>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  suppressMapClickUntilRef.current = Date.now() + 500
                  setSheetState('hidden')
                }}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                           rounded-full bg-gray-100 border border-gray-200
                           text-gray-500 hover:text-gray-700 hover:bg-gray-200
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

          {/* Gesture capture layer — non-scrolling wrapper that owns the touch
              listeners. Keeping this separate from the scroll container prevents
              the browser from entering "scroll mode" before preventDefault fires.
              In expanded state, the same header handlers are also wired here so
              that swipe-up from any card reliably triggers the full transition
              (iOS may capture touchmove before preventDefault fires in the native
              listener; the touchend-based fallback is always reliable). */}
          <div
            ref={gestureLayerRef}
            className="flex-1 min-h-0"
            onTouchStart={sheetState === 'expanded' ? handleDragStart : undefined}
            onTouchEnd={sheetState === 'expanded' ? handleDragEnd : undefined}
          >
            {/* Inner scroll area — overflow-y-hidden in expanded (no content scroll
                until sheet is full); overflow-y-auto only in full. */}
            <div
              ref={scrollAreaRef}
              className={`h-full overscroll-contain ${
                sheetState === 'full' ? 'overflow-y-auto' : 'overflow-y-hidden'
              }`}
              style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              <div
                className="space-y-3 px-4 pt-1"
                style={{ paddingBottom: sheetState === 'full'
                  ? 'calc(80px + env(safe-area-inset-bottom, 0px))'
                  : 'calc(40px + env(safe-area-inset-bottom, 0px))' }}
              >
                {userLocation && (
                  <div className="flex items-center gap-1.5 -mb-1">
                    <button
                      onClick={() => setDistanceSortOrder('asc')}
                      className={[
                        'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 active:scale-95',
                        distanceSortOrder === 'asc'
                          ? 'bg-gray-900 text-white border-gray-700'
                          : 'bg-white text-gray-500 border-gray-300/80',
                      ].join(' ')}
                    >
                      Más cercanas
                    </button>
                    <button
                      onClick={() => setDistanceSortOrder('desc')}
                      className={[
                        'px-3 py-1 rounded-full text-[11px] font-semibold border transition-all duration-150 active:scale-95',
                        distanceSortOrder === 'desc'
                          ? 'bg-gray-900 text-white border-gray-700'
                          : 'bg-white text-gray-500 border-gray-300/80',
                      ].join(' ')}
                    >
                      Más lejanas
                    </button>
                  </div>
                )}
                {renderPoints(mobileCardRefs)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── FLOATING "MOSTRAR LISTA" BUTTON (mobile only) ─────────────────────
          Visible only when the sheet is hidden (map-first state).
          Tapping opens the sheet to peek. Disappears when list is open.    */}
      {sheetState === 'hidden' && mobileState !== 'detail' && (
        <div
          className={`${isEmbed ? '' : 'md:hidden '}absolute right-4 z-[1100]`}
          style={{ bottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}
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

      {/* ── FLOATING "MAPA" BUTTON ───────────────────────────────────────────
          Only visible in full state (map not visible). Centered at the bottom.
          Taps bring the user back to expanded so the map becomes visible.   */}
      {sheetState === 'full' && mobileState !== 'detail' && (
        <div
          className={`${isEmbed ? '' : 'md:hidden '}absolute inset-x-0 bottom-0 z-[1100]
                      flex justify-center pointer-events-none`}
          style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            onClick={() => setSheetState('expanded')}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3
                       rounded-full bg-gray-900/95 text-white backdrop-blur-sm
                       font-semibold text-sm
                       border border-white/[0.18]
                       shadow-[0_4px_24px_rgba(0,0,0,0.65)]
                       active:scale-95 transition-all duration-150"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            </svg>
            Mapa
          </button>
        </div>
      )}

      {/* ── MOBILE PREVIEW CARD ─────────────────────────────────────────────
          Floats above the floating button or peek sheet (preview state).
          Tapping "Ver detalle" opens the full detail sheet.                */}
      {mobileState === 'preview' && selectedPoint && (
        <div
          className={`${isEmbed ? '' : 'md:hidden '}absolute inset-x-4 z-[1050]`}
          style={{
            bottom: sheetState !== 'hidden'
              ? 'calc(80px + env(safe-area-inset-bottom, 0px) + 8px)'
              : 'calc(80px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <PublicPointPreviewCard
            point={selectedPoint}
            distance={distances[selectedPoint.id] ?? null}
            userLocation={userLocation}
            onViewDetail={handleViewDetail}
            onClose={handleExitSelectedPoint}
            liveVisitsCount={liveVisitCounts[selectedPoint.id]}
          />
        </div>
      )}

      {/* ── MOBILE DETAIL SHEET ──────────────────────────────────────────────
          Full-height sheet with all point information. Mobile only.        */}
      {mobileState === 'detail' && selectedPoint && (
        <PublicPointDetailSheet
          point={selectedPoint}
          distance={distances[selectedPoint.id] ?? null}
          userLocation={userLocation}
          onClose={handleCloseDetail}
          onActivate={() => { void handleActivate(selectedPoint) }}
          isActivating={selectedPoint.id === activatingPointId}
          accessMessage={accessError?.pointId === selectedPoint.id ? accessError.message : undefined}
          accessFallbackUrl={accessError?.pointId === selectedPoint.id ? accessError.fallbackUrl : undefined}
          routeStatus={routeStatus}
          walkingDistanceMeters={routeResult?.distanceMeters}
          walkingDurationSeconds={routeResult?.durationSeconds}
          address={selectedPoint.instructions ?? addresses[selectedPoint.id]}
          isEmbed={isEmbed}
          pointCreatedAt={(selectedPoint as { createdAt?: string }).createdAt ?? project?.createdAt}
          dwellProgress={getDwellProgress(selectedPoint.id, selectedPoint)}
          liveVisitsCount={liveVisitCounts[selectedPoint.id]}
        />
      )}

      {/* ── DESKTOP PANEL (hidden on mobile, always hidden in embed) ─────────*/}
      <div className={isEmbed ? 'hidden' : 'hidden md:block flex-shrink-0 bg-white border-t border-gray-200 px-4 pt-3 pb-4 max-h-[55vh] overflow-y-auto'}>
        <div className="flex items-start gap-3 mb-3">
          {project.coverImage && (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-800 text-base leading-tight">{project.title}</h1>
            {project.subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{project.subtitle}</p>
            )}
          </div>
          <button
            onClick={handleShare}
            className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-gray-700
                       hover:bg-gray-100 active:scale-95 transition-all duration-150"
            title="Compartir"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3 -mt-1">
          <button
            onClick={() => handleFilterChange('all')}
            className={[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold',
              'border transition-all duration-200 active:scale-95',
              'shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.07)]',
              locationFilter === 'all'
                ? 'bg-gray-900 text-white border-gray-700'
                : 'bg-white text-gray-600 border-gray-300/80 hover:text-gray-800 hover:border-gray-400/70',
            ].join(' ')}
          >
            {points.length} ubicaciones
          </button>
          <button
            onClick={() => handleFilterChange('available')}
            className={[
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold',
              'border transition-all duration-200 active:scale-95',
              'shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.07)]',
              locationFilter === 'available'
                ? 'bg-gray-900 text-white border-gray-700'
                : 'bg-white text-gray-600 border-gray-300/80 hover:text-gray-800 hover:border-gray-400/70',
            ].join(' ')}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              locationFilter === 'available' ? 'bg-emerald-400' : 'bg-emerald-500/50'
            }`} />
            {availablePoints.length} activas
          </button>
        </div>

        {userLocation && (
          <div className="flex items-center gap-1.5 mb-3 -mt-1">
            <button
              onClick={() => setDistanceSortOrder('asc')}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95',
                'shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.07)]',
                distanceSortOrder === 'asc'
                  ? 'bg-gray-900 text-white border-gray-700'
                  : 'bg-white text-gray-600 border-gray-300/80 hover:text-gray-800 hover:border-gray-400/70',
              ].join(' ')}
            >
              Más cercanas
            </button>
            <button
              onClick={() => setDistanceSortOrder('desc')}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95',
                'shadow-[0_2px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.07)]',
                distanceSortOrder === 'desc'
                  ? 'bg-gray-900 text-white border-gray-700'
                  : 'bg-white text-gray-600 border-gray-300/80 hover:text-gray-800 hover:border-gray-400/70',
              ].join(' ')}
            >
              Más lejanas
            </button>
          </div>
        )}

        <div className="space-y-2 pb-2">
          {renderPoints(cardRefs)}
        </div>
      </div>

      {/* Manual location fallback — address search or map pick */}
      {manualLocationSheet && (
        <ManualLocationSheet
          onConfirm={handleManualLocationConfirm}
          onPickOnMap={() => setMapPickMode(true)}
          onClose={() => setManualLocationSheet(false)}
        />
      )}

      {/* Unlocked media content panel (video / audio / file) */}
      {unlockedContent && unlockedContent.content_type !== 'url' && (
        <UnlockedContentPanel
          content={unlockedContent}
          onClose={() => setUnlockedContent(null)}
        />
      )}

      <ToastContainer />
    </div>
  )
}
