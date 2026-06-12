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
import { useParams }                             from 'react-router-dom'
import { ApiError, apiFetch }                   from '../../lib/apiFetch'
import { normalizeGeoPoint }                    from '../../lib/normalizeGeoPoint'
import { markPointUnlocked }                    from '../../lib/unlockedPoints'
import { trackPointClick }                      from '../../lib/analytics'
import { hasPointContent }                      from '../../lib/pointContent'
import { useGeoStore }                          from '../../store/geoStore'
import { useGeolocation, getCurrentPosition }   from '../../hooks/useGeolocation'
import { sendHeartbeat, sendProjectHeartbeat }  from '../../services/liveVisitsApi'
import { getLiveVisitSessionId }                from '../../utils/liveVisits'
import {
  resolvePublicSmartLink,
  validatePublicSmartLink,
  type PublicSmartLink,
} from '../../services/smartLinksApi'
import type { GeoProject, GeoPoint }            from '../../types'
import GeoPointLanding, { type ValidationState } from '../../components/public/GeoPointLanding'

// ── P1: credential-less public fetchers ──────────────────────────────────────

const SL_API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

async function slFetchProject(id: string): Promise<GeoProject | null> {
  try {
    const raw = await apiFetch<Record<string, unknown>>(
      `${SL_API_BASE}/api/public/geo_projects/${id}`,
      { credentials: 'omit' },
    )
    return {
      ...raw,
      coverImage:     (raw.coverImage     ?? raw.cover_image)     as string | undefined,
      projectLogoUrl:       (raw.projectLogoUrl       ?? raw.project_logo_url  ?? raw.logo_url) as string | undefined,
      projectLogoZoom:      (raw.projectLogoZoom      ?? raw.project_logo_zoom)                  as number | undefined,
      projectLogoPositionX: (raw.projectLogoPositionX ?? raw.project_logo_position_x)            as number | undefined,
      projectLogoPositionY: (raw.projectLogoPositionY ?? raw.project_logo_position_y)            as number | undefined,
      shareText:      (raw.shareText      ?? raw.share_text)      as string | undefined,
      geoPointIds:    ((raw.geoPointIds   ?? raw.geo_point_ids    ?? []) as string[]),
      createdAt:      (raw.createdAt      ?? raw.created_at)      as string,
      updatedAt:      (raw.updatedAt      ?? raw.updated_at)      as string,
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartLinkPublicPage() {
  const { organizationSlug = '', smartLinkSlug = '' } = useParams<{
    organizationSlug: string
    smartLinkSlug:    string
  }>()

  // ── GPS ───────────────────────────────────────────────────────────────────
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

  // ── Project + points ──────────────────────────────────────────────────────
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

  // P7: Filter displayed points by scope
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

  // ── Validation state ──────────────────────────────────────────────────────
  const [validation, setValidation] = useState<ValidationState>({ phase: 'idle' })

  // ── Live visits map (per-point) ───────────────────────────────────────────
  const [liveVisitsMap, setLiveVisitsMap] = useState<Record<string, number>>({})

  // ── Heartbeat ─────────────────────────────────────────────────────────────
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

  // Project-level heartbeat — fires whenever GPS is available, regardless of validation state.
  // Starts as soon as the project loads; actual sends begin once locationRef has a fix.
  useEffect(() => {
    const projectId = smartLink?.projectId
    if (!projectId) return
    const sessionId = getLiveVisitSessionId()

    function projectHeartbeatTick() {
      const loc = locationRef.current
      if (!loc) return
      sendProjectHeartbeat(projectId!, {
        session_id: sessionId,
        lat:        loc.latitude,
        lng:        loc.longitude,
        accuracy:   loc.accuracy,
      })
    }

    projectHeartbeatTick()
    const timer = setInterval(projectHeartbeatTick, 5_000)
    return () => clearInterval(timer)
  }, [smartLink?.projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-trigger for informative SmartLink points ────────────────────────
  // Informative points don't need GPS — bypass immediately when displayPoints load.
  const autoStartedRef = useRef(false)
  useEffect(() => {
    if (autoStartedRef.current) return
    if (!displayPoints.length) return
    const primary = displayPoints[0]
    if (primary?.pointMode !== 'informative') return
    if (!hasPointContent(primary)) return  // no real content — nothing to auto-open
    autoStartedRef.current = true
    void handleContinue()
  }, [displayPoints]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Continuar handler ─────────────────────────────────────────────────────
  async function handleContinue() {
    // Informative points: content is embedded in point data, no GPS or API call needed.
    const primaryPoint = displayPoints[0]
    if (primaryPoint?.pointMode === 'informative') {
      const point = primaryPoint
      setLocationActive(true)
      const onActivate = () => {
        trackPointClick(point.geoProjectId, point.id, {
          contentType:         point.contentType ?? 'info',
          destinationCategory: point.destinationCategory ?? null,
        })
        if (point.updatedAt) markPointUnlocked(point.geoProjectId, point.id, point.updatedAt)
        if (!point.contentType || point.contentType === 'url') {
          const cd = point.contentData as Record<string, unknown> | undefined
          const url = point.lookiarUrl || (cd && typeof cd['url'] === 'string' ? cd['url'] : '')
          if (url && url.startsWith('http')) { window.open(url, '_blank', 'noopener,noreferrer'); return }
        } else {
          const cd = point.contentData as Record<string, unknown> | undefined
          const fileUrl = cd && typeof cd['file_url'] === 'string' ? cd['file_url'] : ''
          if (fileUrl && fileUrl.startsWith('http')) window.open(fileUrl, '_blank', 'noopener,noreferrer')
        }
      }
      setValidation({ phase: 'unlocked', matchedGeoPointId: point.id, onActivate })
      return
    }

    setValidation({ phase: 'requesting' })

    let loc = locationRef.current

    if (!loc) {
      try {
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
        const destUrl       = result.destinationUrl
        const matchedPoint  = points.find((p) => p.id === result.matchedGeoPointId)
        setValidation({
          phase:             'unlocked',
          matchedGeoPointId: result.matchedGeoPointId,
          onActivate:        () => {
            if (matchedPoint?.updatedAt)
              markPointUnlocked(matchedPoint.geoProjectId, matchedPoint.id, matchedPoint.updatedAt)
            window.open(destUrl, '_blank', 'noopener,noreferrer')
          },
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
            <div className="flex justify-center">
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin inline-block" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (resolveError) return <ResolveErrorScreen type={resolveError} onRetry={resolve} />

  if (smartLink) {
    return (
      <GeoPointLanding
        initialPointId={smartLink.geoPointIds?.[0] ?? null}
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
