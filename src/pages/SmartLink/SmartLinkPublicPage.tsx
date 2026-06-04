import { useEffect, useRef, useState } from 'react'
import { useParams }                   from 'react-router-dom'
import { ApiError }                    from '../../lib/apiFetch'
import { useGeoStore }                 from '../../store/geoStore'
import { useGeolocation, requestLocation } from '../../hooks/useGeolocation'
import { sendHeartbeat }               from '../../services/liveVisitsApi'
import { getLiveVisitSessionId }       from '../../utils/liveVisits'
import {
  resolvePublicSmartLink,
  validatePublicSmartLink,
  type PublicSmartLink,
} from '../../services/smartLinksApi'

// ── Resolution error types ────────────────────────────────────────────────────

type ResolveError = 'not_found' | 'paused' | 'api_error'

// ── Validation state machine ──────────────────────────────────────────────────
//
// Same design as /public:
//   idle       → user hasn't tapped yet
//   requesting → GPS prompt in progress (requestLocation called)
//   validating → POST /validate in flight
//   unlocked   → backend allowed, destinationUrl ready, heartbeat running
//   blocked    → backend denied or GPS error, message shown

type ValidationState =
  | { phase: 'idle' }
  | { phase: 'requesting' }
  | { phase: 'validating' }
  | { phase: 'unlocked'; destinationUrl: string; matchedGeoPointId: string }
  | { phase: 'blocked';  message: string }
  | { phase: 'location_error' }

// ── Layout ────────────────────────────────────────────────────────────────────

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-gray-100">
      <div className="w-full max-w-sm space-y-8 text-center">
        <img src="/logo-blanco.png" alt="Ubyca" className="h-7 mx-auto opacity-90" />
        {children}
      </div>
    </div>
  )
}

// ── Spinner inline ────────────────────────────────────────────────────────────

function Spin({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'sm'
    ? 'w-4 h-4 border-2 border-white/30 border-t-white'
    : 'w-5 h-5 border-2 border-gray-600 border-t-gray-300'
  return <span className={`${cls} rounded-full animate-spin inline-block`} />
}

// ── Resolve error screen ──────────────────────────────────────────────────────

function ResolveErrorScreen({ type, onRetry }: { type: ResolveError; onRetry?: () => void }) {
  const cfg = {
    not_found: { icon: '🔗', title: 'Smart Link no encontrado',           desc: 'La URL solicitada no existe o fue eliminada.'                    },
    paused:    { icon: '⏸',  title: 'Smart Link no disponible',           desc: 'Este Smart Link se encuentra desactivado.'                       },
    api_error: { icon: '⚠️',  title: 'No fue posible cargar este Smart Link', desc: 'Ocurrió un error al conectar con el servidor.'                },
  }[type]

  return (
    <Screen>
      <div className="space-y-4">
        <span className="text-4xl">{cfg.icon}</span>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-gray-100">{cfg.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed">{cfg.desc}</p>
        </div>
        {type === 'api_error' && onRetry && (
          <button onClick={onRetry}
            className="mt-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm
                       font-semibold rounded-xl transition-all active:scale-[0.98]">
            Reintentar
          </button>
        )}
      </div>
    </Screen>
  )
}

// ── Main experience screen ────────────────────────────────────────────────────
//
// Renders the Smart Link identity + the correct UI for each validation phase.

function ExperienceScreen({
  smartLink, validation, onContinue,
}: {
  smartLink:  PublicSmartLink
  validation: ValidationState
  onContinue: () => void
}) {
  const busy = validation.phase === 'requesting' || validation.phase === 'validating'

  // ── GPS denied ─────────────────────────────────────────────────────────────
  if (validation.phase === 'location_error') {
    return (
      <Screen>
        <div className="space-y-4">
          <span className="text-4xl">📍</span>
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-100">{smartLink.name}</h2>
            <h3 className="text-sm font-medium text-gray-300">No pudimos obtener tu ubicación</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Debes permitir el acceso a tu ubicación para continuar.
            </p>
          </div>
          <button onClick={onContinue}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                       rounded-xl text-sm transition-all active:scale-[0.98]">
            Reintentar
          </button>
        </div>
      </Screen>
    )
  }

  // ── Backend denied ─────────────────────────────────────────────────────────
  if (validation.phase === 'blocked') {
    return (
      <Screen>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-base font-semibold text-gray-100">{smartLink.name}</h2>
            {/* Availability status chip — reuses /public language */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
                            bg-amber-500/10 border-amber-500/20 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-xs font-medium">No disponible</span>
            </div>
          </div>
          {/* Message from backend — same text /public shows */}
          <p className="text-sm text-gray-400 leading-relaxed">{validation.message}</p>
          <button onClick={onContinue}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                       rounded-xl text-sm transition-all active:scale-[0.98]">
            Reintentar
          </button>
        </div>
      </Screen>
    )
  }

  // ── Unlocked — show "Abrir experiencia" ────────────────────────────────────
  //
  // User stays on go.ubyca.com; heartbeat keeps running in background.
  // window.open keeps go.ubyca.com alive so GPS tracking continues.
  if (validation.phase === 'unlocked') {
    return (
      <Screen>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20
                            flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-100">{smartLink.name}</h1>
            {/* Availability status chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
                            bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-xs font-medium">Disponible</span>
            </div>
          </div>
          {/* Explicit user action — never automatic redirect */}
          <button
            onClick={() => window.open(validation.destinationUrl, '_blank', 'noopener,noreferrer')}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                       rounded-xl text-sm transition-all active:scale-[0.98]
                       shadow-lg shadow-brand-900/50">
            Abrir experiencia →
          </button>
          <p className="text-xs text-gray-600">
            Tu posición sigue siendo monitoreada mientras permanezcas en esta página.
          </p>
        </div>
      </Screen>
    )
  }

  // ── Idle / requesting / validating ─────────────────────────────────────────
  return (
    <Screen>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20
                          flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101
                   m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-100">{smartLink.name}</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Esta experiencia requiere validar tu ubicación para continuar.
          </p>
        </div>

        <button
          onClick={onContinue}
          disabled={busy}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                     rounded-xl text-sm transition-all active:scale-[0.98]
                     disabled:opacity-70 disabled:cursor-not-allowed
                     shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2">
          {busy && <Spin size="sm" />}
          {busy ? 'Validando ubicación…' : 'Continuar →'}
        </button>
      </div>
    </Screen>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartLinkPublicPage() {
  const { organizationSlug = '', smartLinkSlug = '' } = useParams<{
    organizationSlug: string
    smartLinkSlug:    string
  }>()

  // ── GPS — same pattern as /public ─────────────────────────────────────────
  // userLocation lives in geoStore so it's shared across the component tree.
  // locationActive gates watchPosition — only starts after the user grants GPS.
  const { userLocation, setUserLocation } = useGeoStore()
  const [locationActive, setLocationActive] = useState(false)
  useGeolocation(locationActive)

  // Keep a ref so the heartbeat interval always reads the latest coords without
  // restarting the interval on every GPS update — same pattern as PublicPage.
  const locationRef = useRef(userLocation)
  useEffect(() => { locationRef.current = userLocation }, [userLocation])

  // ── Resolution phase ───────────────────────────────────────────────────────
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

  // ── Validation state ───────────────────────────────────────────────────────
  const [validation, setValidation] = useState<ValidationState>({ phase: 'idle' })

  // ── Heartbeat — same mechanism as /public ─────────────────────────────────
  // Starts once matchedGeoPointId is known (after successful validate).
  // Runs every 5 seconds, same interval as PublicPage.
  // Feeds geo_point_live_visits → Live Visits → Intensidad GPS → Zonas Calientes.
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
      })
    }

    heartbeatTick()
    const timer = setInterval(heartbeatTick, 5_000)
    return () => clearInterval(timer)
  }, [validation.phase === 'unlocked' ? validation.matchedGeoPointId : null]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Continuar handler ──────────────────────────────────────────────────────
  async function handleContinue() {
    setValidation({ phase: 'requesting' })

    // Step 1 — GPS (same as /public: getCurrentPosition first time, then watch)
    if (!userLocation) {
      await new Promise<void>((resolve) => {
        requestLocation((loc, status) => {
          setUserLocation(loc, status)
          if (loc) {
            setLocationActive(true)  // start watchPosition
            locationRef.current = loc
          }
          resolve()
        })
      })
    }

    const loc = locationRef.current
    if (!loc) {
      setValidation({ phase: 'location_error' })
      return
    }

    // Step 2 — POST /validate (backend owns all validation logic)
    setValidation({ phase: 'validating' })
    try {
      const result = await validatePublicSmartLink(organizationSlug, smartLinkSlug, {
        latitude:   loc.latitude,
        longitude:  loc.longitude,
        session_id: getLiveVisitSessionId(),
        accuracy:   loc.accuracy,
      })

      if (result.allowed && result.destinationUrl && result.matchedGeoPointId) {
        // Activate GPS watch now that we have an area to track
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

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Screen>
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Validando acceso…</p>
          <div className="flex justify-center"><Spin /></div>
        </div>
      </Screen>
    )
  }

  if (resolveError) return <ResolveErrorScreen type={resolveError} onRetry={resolve} />

  if (smartLink) {
    return (
      <ExperienceScreen
        smartLink={smartLink}
        validation={validation}
        onContinue={handleContinue}
      />
    )
  }

  return <ResolveErrorScreen type="api_error" onRetry={resolve} />
}
