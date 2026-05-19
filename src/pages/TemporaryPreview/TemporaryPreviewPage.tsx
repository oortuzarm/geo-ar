import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicPage from '../Public/PublicPage'
import Spinner from '../../components/ui/Spinner'
import { fetchTemporaryPreview } from '../../services/temporaryPreviewsApi'
import { ApiError } from '../../lib/apiFetch'
import type { GeoProject, GeoPoint } from '../../types'

type PageState = 'loading' | 'ok' | 'expired' | 'not-found' | 'error'

function ErrorCard({ state }: { state: Exclude<PageState, 'loading' | 'ok'> }) {
  const config = {
    expired: {
      icon: (
        <svg className="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-amber-900/40',
      title: 'Esta previsualización expiró',
      body: 'Los links de previsualización son válidos por 30 minutos.',
      cta: 'Crear una nueva experiencia',
      ctaTo: '/try',
    },
    'not-found': {
      icon: (
        <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-red-900/40',
      title: 'Link no encontrado',
      body: 'Este link de previsualización no existe o ya no está disponible.',
      cta: 'Crear una nueva experiencia',
      ctaTo: '/try',
    },
    error: {
      icon: (
        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-gray-800',
      title: 'Error al cargar',
      body: 'No se pudo cargar la previsualización. Intenta recargar la página.',
      cta: null,
      ctaTo: null,
    },
  }[state]

  return (
    <div className="h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${config.iconBg}`}>
          {config.icon}
        </div>
        <h2 className="text-base font-semibold text-gray-100 mb-2">{config.title}</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-5">{config.body}</p>
        {config.cta && config.ctaTo ? (
          <>
            <Link
              to={config.ctaTo}
              className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white
                         text-sm font-semibold rounded-xl transition-colors text-center mb-3"
            >
              {config.cta}
            </Link>
            <Link
              to="/register"
              className="block text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Crear cuenta gratuita para guardar
            </Link>
          </>
        ) : (
          <button
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}

export default function TemporaryPreviewPage() {
  const { token } = useParams<{ token: string }>()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [project, setProject]     = useState<GeoProject | null>(null)
  const [points, setPoints]       = useState<GeoPoint[]>([])

  useEffect(() => {
    if (!token) { setPageState('not-found'); return }

    fetchTemporaryPreview(token)
      .then((data) => {
        // Guard against backend that doesn't enforce expiry (defensive — backend already returns 410)
        const expiresAt = data.expiresAt ?? data.expires_at
        if (expiresAt && new Date(expiresAt) < new Date()) {
          setPageState('expired')
          return
        }
        setProject(data.project)
        setPoints(data.geoPoints ?? data.points ?? [])
        setPageState('ok')
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 404) { setPageState('not-found'); return }
          if (err.status === 410) { setPageState('expired');   return } // HTTP 410 Gone
        }
        setPageState('error')
      })
  }, [token])

  if (pageState === 'loading') {
    return (
      <div className="h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-gray-500">Cargando previsualización…</p>
      </div>
    )
  }

  if (pageState !== 'ok' || !project) {
    return <ErrorCard state={pageState === 'ok' ? 'error' : pageState} />
  }

  return <PublicPage prefetched={{ project, points }} />
}
