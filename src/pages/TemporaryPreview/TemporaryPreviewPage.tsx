import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PublicPage from '../Public/PublicPage'
import Spinner from '../../components/ui/Spinner'
import { fetchTemporaryPreview } from '../../services/temporaryPreviewsApi'
import { ApiError } from '../../lib/apiFetch'
import type { GeoProject, GeoPoint } from '../../types'

type PageState = 'loading' | 'ok' | 'expired' | 'not-found' | 'error'

function ErrorCard(_props: { state: Exclude<PageState, 'loading' | 'ok'> }) {
  return (
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 p-6 text-center">
      <p className="text-base font-medium text-gray-200 leading-snug">
        Esta previsualización ya no está disponible
      </p>
      <p className="text-xs text-gray-600 leading-none">
        Desarrollado por{' '}
        <a
          href="https://www.ubyca.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          Ubyca
        </a>
      </p>
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
