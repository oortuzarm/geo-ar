import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  // Changes on every /try preview click — forces a re-fetch even when the
  // backend re-uses the same token (upsert by project ID).
  const cacheBust = searchParams.get('_t')

  const [pageState, setPageState] = useState<PageState>('loading')
  const [project, setProject]     = useState<GeoProject | null>(null)
  const [points, setPoints]       = useState<GeoPoint[]>([])

  useEffect(() => {
    if (!token) { setPageState('not-found'); return }

    // Reset to loading so stale content is never visible during re-fetch.
    setPageState('loading')
    setProject(null)
    setPoints([])

    fetchTemporaryPreview(token)
      .then((data) => {
        // Guard against backend that doesn't enforce expiry (defensive — backend already returns 410)
        const expiresAt = data.expiresAt ?? data.expires_at
        if (expiresAt && new Date(expiresAt) < new Date()) {
          setPageState('expired')
          return
        }
        const resolvedPoints = data.geoPoints ?? data.points ?? []

        // Restore dwell settings from the sidecar stored at preview creation time.
        // The backend temporary_previews endpoint may not preserve requiresDwellTime /
        // dwellTimeSeconds through its storage layer (e.g. Rails strong-param filtering).
        // The sidecar uses ?? so it never overwrites a field already returned by the API.
        let finalPoints = resolvedPoints
        const dwellSidecarRaw = token ? localStorage.getItem(`preview_dwell_${token}`) : null
        if (dwellSidecarRaw) {
          try {
            const sidecar = JSON.parse(dwellSidecarRaw) as Record<string, { requiresDwellTime?: boolean; dwellTimeSeconds?: number }>
            finalPoints = resolvedPoints.map((p) => ({
              ...p,
              requiresDwellTime: p.requiresDwellTime ?? sidecar[p.id]?.requiresDwellTime,
              dwellTimeSeconds:  p.dwellTimeSeconds  ?? sidecar[p.id]?.dwellTimeSeconds,
            }))
            console.log('[DwellDebug][temporary] TemporaryPreviewPage — dwell sidecar applied | token:', token?.slice(0, 8))
          } catch {
            console.warn('[DwellDebug][temporary] TemporaryPreviewPage — failed to parse dwell sidecar')
          }
        }

        console.log('[DwellDebug][temporary] TemporaryPreviewPage — final points:', finalPoints.length,
          '| first point dwell fields:', finalPoints[0]
            ? { id: finalPoints[0].id, requiresDwellTime: finalPoints[0].requiresDwellTime, dwellTimeSeconds: finalPoints[0].dwellTimeSeconds }
            : '(no points)')
        setProject(data.project)
        setPoints(finalPoints)
        setPageState('ok')
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 404) { setPageState('not-found'); return }
          if (err.status === 410) { setPageState('expired');   return } // HTTP 410 Gone
        }
        setPageState('error')
      })
  }, [token, cacheBust])

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
