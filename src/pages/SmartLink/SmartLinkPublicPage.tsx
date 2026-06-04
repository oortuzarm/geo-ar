import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import { ApiError }            from '../../lib/apiFetch'
import { getLiveVisitSessionId } from '../../utils/liveVisits'
import {
  resolvePublicSmartLink,
  validatePublicSmartLink,
  type PublicSmartLink,
} from '../../services/smartLinksApi'

// ── Error types (resolution phase) ───────────────────────────────────────────

type ResolveError = 'not_found' | 'paused' | 'api_error'

// ── Validation state machine ──────────────────────────────────────────────────

type ValidationPhase =
  | { phase: 'idle' }
  | { phase: 'requesting' }              // waiting for GPS
  | { phase: 'validating' }              // POST in flight
  | { phase: 'blocked'; message: string }// backend rejected
  | { phase: 'location_error' }          // GPS denied / unavailable

// ── Layout wrapper ────────────────────────────────────────────────────────────

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

// ── Loading (resolution) ──────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <Screen>
      <div className="space-y-3">
        <p className="text-sm text-gray-400">Validando acceso…</p>
        <div className="flex justify-center">
          <span className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
        </div>
      </div>
    </Screen>
  )
}

// ── Resolve error screens ─────────────────────────────────────────────────────

function ResolveErrorScreen({ type, onRetry }: { type: ResolveError; onRetry?: () => void }) {
  const config = {
    not_found: {
      icon: '🔗',
      title: 'Smart Link no encontrado',
      description: 'La URL solicitada no existe o fue eliminada.',
    },
    paused: {
      icon: '⏸',
      title: 'Smart Link no disponible',
      description: 'Este Smart Link se encuentra desactivado.',
    },
    api_error: {
      icon: '⚠️',
      title: 'No fue posible cargar este Smart Link',
      description: 'Ocurrió un error al conectar con el servidor.',
    },
  }[type]

  return (
    <Screen>
      <div className="space-y-4">
        <span className="text-4xl">{config.icon}</span>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-gray-100">{config.title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed">{config.description}</p>
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
    </Screen>
  )
}

// ── Resolved screen (with validation flow) ────────────────────────────────────

function ResolvedScreen({
  smartLink,
  validation,
  onContinue,
}: {
  smartLink:  PublicSmartLink
  validation: ValidationPhase
  onContinue: () => void
}) {
  const busy = validation.phase === 'requesting' || validation.phase === 'validating'

  // GPS denied
  if (validation.phase === 'location_error') {
    return (
      <Screen>
        <div className="space-y-4">
          <span className="text-4xl">📍</span>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-100">No pudimos obtener tu ubicación</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Debes permitir el acceso a tu ubicación para continuar.
            </p>
          </div>
          <button
            onClick={onContinue}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                       rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            Reintentar
          </button>
        </div>
      </Screen>
    )
  }

  // Backend rejected
  if (validation.phase === 'blocked') {
    return (
      <Screen>
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20
                          flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-100">{smartLink.name}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{validation.message}</p>
          </div>
          <button
            onClick={onContinue}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                       rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            Reintentar
          </button>
        </div>
      </Screen>
    )
  }

  // Idle / requesting / validating
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
                     shadow-lg shadow-brand-900/50 flex items-center justify-center gap-2"
        >
          {busy && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
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

  // Resolution phase
  const [loading,      setLoading]      = useState(true)
  const [smartLink,    setSmartLink]    = useState<PublicSmartLink | null>(null)
  const [resolveError, setResolveError] = useState<ResolveError | null>(null)

  // Validation phase
  const [validation, setValidation] = useState<ValidationPhase>({ phase: 'idle' })

  // ── Resolve Smart Link on mount ───────────────────────────────────────────

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
    if (organizationSlug && smartLinkSlug) {
      resolve()
    } else {
      setResolveError('not_found')
      setLoading(false)
    }
  }, [organizationSlug, smartLinkSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Validation on "Continuar" ─────────────────────────────────────────────

  async function handleContinue() {
    setValidation({ phase: 'requesting' })

    // Step 1 — get GPS position
    let position: GeolocationPosition
    try {
      position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15_000,
          maximumAge: 0,
        })
      )
    } catch {
      setValidation({ phase: 'location_error' })
      return
    }

    // Step 2 — send to backend
    setValidation({ phase: 'validating' })
    try {
      const result = await validatePublicSmartLink(organizationSlug, smartLinkSlug, {
        latitude:   position.coords.latitude,
        longitude:  position.coords.longitude,
        session_id: getLiveVisitSessionId(),
        accuracy:   position.coords.accuracy,
      })

      if (result.allowed && result.destinationUrl) {
        // Backend-provided URL — never reconstructed on the client
        window.location.href = result.destinationUrl
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
        } catch { /* keep default msg */ }
      }
      setValidation({ phase: 'blocked', message: msg })
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading)       return <LoadingScreen />
  if (resolveError)  return <ResolveErrorScreen type={resolveError} onRetry={resolve} />
  if (smartLink)     return (
    <ResolvedScreen
      smartLink={smartLink}
      validation={validation}
      onContinue={handleContinue}
    />
  )
  return <ResolveErrorScreen type="api_error" onRetry={resolve} />
}
