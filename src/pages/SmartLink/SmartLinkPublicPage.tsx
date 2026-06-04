import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import { ApiError }            from '../../lib/apiFetch'
import {
  resolvePublicSmartLink,
  type PublicSmartLink,
} from '../../services/smartLinksApi'

// ── Error types ───────────────────────────────────────────────────────────────

type ErrorType = 'not_found' | 'paused' | 'api_error'

// ── Layout wrapper ────────────────────────────────────────────────────────────

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-gray-100">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <img src="/logo-blanco.png" alt="Ubyca" className="h-7 mx-auto opacity-90" />
        {children}
      </div>
    </div>
  )
}

// ── Loading state ─────────────────────────────────────────────────────────────

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

// ── Error states ──────────────────────────────────────────────────────────────

function ErrorScreen({ type, onRetry }: { type: ErrorType; onRetry?: () => void }) {
  const config = {
    not_found: {
      icon: '🔗',
      title: 'Smart Link no encontrado',
      description: 'La URL solicitada no existe o fue eliminada.',
      action: null,
    },
    paused: {
      icon: '⏸',
      title: 'Smart Link no disponible',
      description: 'Este Smart Link se encuentra desactivado.',
      action: null,
    },
    api_error: {
      icon: '⚠️',
      title: 'No fue posible cargar este Smart Link',
      description: 'Ocurrió un error al conectar con el servidor.',
      action: { label: 'Reintentar', fn: onRetry },
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
        {config.action && config.action.fn && (
          <button
            onClick={config.action.fn}
            className="mt-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm
                       font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            {config.action.label}
          </button>
        )}
      </div>
    </Screen>
  )
}

// ── Success / resolver screen ─────────────────────────────────────────────────

function ResolvedScreen({ smartLink }: { smartLink: PublicSmartLink }) {
  return (
    <Screen>
      <div className="space-y-6">
        {/* Smart link identity */}
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

        {/* Continuar — fase futura activará validación geográfica */}
        <button
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold
                     rounded-xl text-sm transition-all active:scale-[0.98]
                     shadow-lg shadow-brand-900/50"
        >
          Continuar →
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

  const [loading,    setLoading]    = useState(true)
  const [smartLink,  setSmartLink]  = useState<PublicSmartLink | null>(null)
  const [errorType,  setErrorType]  = useState<ErrorType | null>(null)

  function load() {
    setLoading(true)
    setErrorType(null)
    resolvePublicSmartLink(organizationSlug, smartLinkSlug)
      .then((data) => setSmartLink(data))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          try {
            const body = JSON.parse(err.message) as { error?: string }
            setErrorType(body.error?.includes('no disponible') ? 'paused' : 'not_found')
          } catch {
            setErrorType('not_found')
          }
        } else {
          setErrorType('api_error')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (organizationSlug && smartLinkSlug) {
      load()
    } else {
      setErrorType('not_found')
      setLoading(false)
    }
  }, [organizationSlug, smartLinkSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading)               return <LoadingScreen />
  if (errorType)             return <ErrorScreen type={errorType} onRetry={load} />
  if (smartLink)             return <ResolvedScreen smartLink={smartLink} />
  return                            <ErrorScreen type="api_error" onRetry={load} />
}
