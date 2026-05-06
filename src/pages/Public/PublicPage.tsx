import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet'
import L from 'leaflet'
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
import Spinner from '../../components/ui/Spinner'
import ToastContainer from '../../components/ui/Toast'
import type { GeoProject, GeoPoint } from '../../types'

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

// ── Bottom sheet state ────────────────────────────────────────────────────────
type SheetState = 'peek' | 'mid' | 'expanded'

// Height-driven sheet: actual height = visible area per state.
// flex-1 on the scroll container then fills exactly the visible portion.
// env(safe-area-inset-bottom, 0px) ≈ 34px on Face ID iPhones, 0 elsewhere.
const SHEET_HEIGHT: Record<SheetState, string> = {
  peek:     'calc(8rem + env(safe-area-inset-bottom, 0px))',
  mid:      '45dvh',
  expanded: '90dvh',
}

export default function PublicPage() {
  const { id } = useParams<{ id: string }>()
  const { userLocation, locationStatus, addToast } = useGeoStore()
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

  // ── Bottom sheet ───────────────────────────────────────────────────────────
  const [sheetState, setSheetState] = useState<SheetState>('peek')
  const dragStartYRef = useRef<number | null>(null)

  // ── Route state ────────────────────────────────────────────────────────────
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [routeStatus, setRouteStatus] = useState<RouteStatus>('idle')
  const routeForPointRef = useRef<string | null>(null)
  const lastRoutePositionRef = useRef<{ lat: number; lng: number } | null>(null)
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointsRef = useRef<GeoPoint[]>([])
  const wasInsideRef = useRef<Record<string, boolean>>({})

  // ── flyTo control ─────────────────────────────────────────────────────────
  const [flyToKey, setFlyToKey] = useState<string | null>(null)
  const [flyToTarget, setFlyToTarget] = useState<FlyTarget | null>(null)
  const flyToCounterRef = useRef(0)

  // Separate refs for mobile sheet and desktop panel so scrollIntoView works
  // correctly in both contexts regardless of display:none.
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mobileCardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useGeolocation(true)

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
        trackRadiusEnter(id, pt.id)
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
    setSheetState('peek')
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
    setSelectedPointId(pt.id)
    setAccessError(null)
    setSheetState('mid')
    flyToCounterRef.current += 1
    setFlyToKey(`point-${pt.id}-${flyToCounterRef.current}`)
    // Shift the fly target 150px south so the real point lands above the mid sheet.
    const panOffsetPx = 150
    setFlyToTarget({ lat: pt.latitude, lng: pt.longitude, zoom: 17, panOffsetPx })
  }

  function handleMyLocation() {
    if (!userLocation) return
    flyToCounterRef.current += 1
    setFlyToKey(`user-${flyToCounterRef.current}`)
    setFlyToTarget({ lat: userLocation.latitude, lng: userLocation.longitude, zoom: 17 })
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
    dragStartYRef.current = e.touches[0].clientY
  }

  function handleDragEnd(e: React.TouchEvent) {
    if (dragStartYRef.current === null) return
    const delta = dragStartYRef.current - e.changedTouches[0].clientY
    dragStartYRef.current = null

    if (Math.abs(delta) < 10) {
      // Tap on handle: cycle through states
      setSheetState(s => s === 'peek' ? 'mid' : s === 'mid' ? 'expanded' : 'peek')
      return
    }
    if (delta > 40) setSheetState(s => s === 'peek' ? 'mid' : 'expanded')
    else if (delta < -40) setSheetState(s => s === 'expanded' ? 'mid' : 'peek')
  }

  const handleActivate = useCallback(async (point: GeoPoint) => {
    if (activatingPointId) return
    if (!userLocation) {
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
          Desktop (md:): relative flex-1 → normal flex-column child.      */}
      <div className="absolute inset-0 md:relative md:flex-1">
        <MapContainer center={mapCenter} zoom={15} className="w-full h-full">
          <MapController flyKey={flyToKey} flyTarget={flyToTarget} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <UserLocationMarker lat={userLocation.latitude} lng={userLocation.longitude} />
          )}
          {points.map((pt) => {
            const isSelected = pt.id === selectedPointId
            const somethingSelected = selectedPointId !== null
            return (
              <Circle
                key={pt.id}
                center={[pt.latitude, pt.longitude]}
                radius={pt.activationRadius}
                pathOptions={{
                  // Selected: cyan highlight. Others: dim to gray when something is selected.
                  color:       isSelected ? '#0ea5e9' : somethingSelected ? '#6b7280' : '#ef4444',
                  fillColor:   isSelected ? '#0ea5e9' : somethingSelected ? '#6b7280' : '#ef4444',
                  fillOpacity: isSelected ? 0.18     : somethingSelected ? 0.04      : 0.08,
                  weight:      isSelected ? 3        : somethingSelected ? 1         : 2,
                  opacity:     isSelected ? 1        : somethingSelected ? 0.4       : 0.8,
                }}
                eventHandlers={{ click: () => handlePointClick(pt) }}
              />
            )
          })}
          {routeResult && <RoutePolyline latLngs={routeResult.latLngs} />}
        </MapContainer>

        {/* Location badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400]
                       bg-gray-900/95 border border-gray-700 rounded-full px-4 py-1.5 shadow-lg">
          {locationBadge()}
        </div>

        {/* My location button — above the peek handle on mobile */}
        <button
          onClick={handleMyLocation}
          disabled={!userLocation}
          className="absolute right-4 z-[400]
                     bottom-[160px] md:bottom-4
                     w-11 h-11 flex items-center justify-center
                     bg-white rounded-full border border-gray-200/60 shadow-md
                     hover:bg-gray-50 active:scale-95 active:shadow-sm
                     transition-all duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
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
          peek     → 8rem + safe-area  — handle + mini summary only
          mid      → 55dvh             — partial list, fully scrollable
          expanded → 90dvh             — full scrollable list              */}
      <div
        className="md:hidden absolute inset-x-0 bottom-0 z-[1000]"
        style={{
          height: SHEET_HEIGHT[sheetState],
          transition: 'height 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div className="h-full flex flex-col rounded-t-[28px] overflow-hidden
                        bg-gray-950/97 backdrop-blur-xl
                        border-t border-white/[0.07]
                        shadow-[0_-12px_40px_rgba(0,0,0,0.7)]">

          {/* Drag handle zone — always visible in peek state.
              paddingBottom pushes content above the iPhone home indicator. */}
          <div
            className="flex-shrink-0 touch-none select-none cursor-grab active:cursor-grabbing"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            {/* Pill */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-white/20" />
            </div>

            {/* Mini summary (always visible, 40px) */}
            <div className="flex items-start gap-3 px-4 pb-3">
              {/* Mini cover — always shows project identity */}
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0
                             ring-1 ring-white/10 shadow-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                  {project.title}
                </p>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">
                  {`${points.length} experiencia${points.length !== 1 ? 's' : ''} disponible${points.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); void handleShare() }}
                className="flex-shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center
                           rounded-full text-gray-400 hover:text-gray-200
                           hover:bg-gray-800/80 active:scale-90 transition-all duration-150"
                title="Compartir"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable content — hidden in peek (header-only state) */}
          <div
            className={[
              'flex-1 min-h-0 overscroll-contain',
              sheetState === 'peek' ? 'overflow-hidden' : 'overflow-y-auto',
            ].join(' ')}
            style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            <div
              className="space-y-2 px-4 pt-1"
              style={{
                paddingBottom: sheetState === 'expanded'
                  ? 'calc(40px + env(safe-area-inset-bottom, 0px))'
                  : 'calc(96px + env(safe-area-inset-bottom, 0px))',
              }}
            >
              {renderPoints(mobileCardRefs)}
            </div>
          </div>

        </div>
      </div>

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
