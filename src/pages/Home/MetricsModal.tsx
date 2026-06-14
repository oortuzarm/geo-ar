import { useEffect, useRef, useState } from 'react'
import { fetchProjectAnalytics, fetchProjectAnalyticsByPoint } from '../../lib/analytics'
import type { ProjectAnalytics, PointAnalytics } from '../../lib/analytics'
import Spinner from '../../components/ui/Spinner'

interface MetricsModalProps {
  projectId: string
  projectTitle: string
  isOpen: boolean
  onClose: () => void
}

// ── Stat card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  emoji: string
  label: string
  value: string | number
  sub?: string
}

function StatCard({ emoji, label, value, sub }: StatCardProps) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xl leading-none">{emoji}</span>
      <span className="text-2xl font-bold text-gray-100 mt-2 leading-none">{value}</span>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
      {sub && <span className="text-xs text-gray-600">{sub}</span>}
    </div>
  )
}

// ── Conversion badge ───────────────────────────────────────────────────────

function ConvBadge({ value }: { value: number }) {
  const cls =
    value >= 30 ? 'text-green-400' :
    value >= 15 ? 'text-yellow-400' :
    'text-gray-400'
  return <span className={`font-semibold tabular-nums ${cls}`}>{value}%</span>
}

// ── Main component ─────────────────────────────────────────────────────────

export default function MetricsModal({ projectId, projectTitle, isOpen, onClose }: MetricsModalProps) {
  const [summary, setSummary]   = useState<ProjectAnalytics | null>(null)
  const [byPoint, setByPoint]   = useState<PointAnalytics[] | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState(false)
  const fetchedForRef           = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    // Don't re-fetch if we already have data for this project in this open session
    if (fetchedForRef.current === projectId && summary !== null) return

    fetchedForRef.current = projectId
    setLoading(true)
    setError(false)
    setSummary(null)
    setByPoint(null)

    Promise.all([
      fetchProjectAnalytics(projectId),
      fetchProjectAnalyticsByPoint(projectId).catch(() => null),
    ])
      .then(([s, bp]) => {
        setSummary(s)
        setByPoint(bp)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [isOpen, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when closed so re-open on a different project always re-fetches
  useEffect(() => {
    if (!isOpen) fetchedForRef.current = null
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl
                      w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-brand-600/20 border border-brand-500/30 rounded-lg
                            flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 leading-none mb-0.5">Métricas</p>
              <h2 className="text-sm font-semibold text-gray-100 truncate">{projectTitle}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {loading && (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <svg className="h-10 w-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-500">No se pudieron cargar las métricas.</p>
              <button
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                onClick={() => { fetchedForRef.current = null; setError(false); setLoading(true)
                  Promise.all([
                    fetchProjectAnalytics(projectId),
                    fetchProjectAnalyticsByPoint(projectId).catch(() => null),
                  ])
                    .then(([s, bp]) => { setSummary(s); setByPoint(bp) })
                    .catch(() => setError(true))
                    .finally(() => setLoading(false))
                }}
              >
                Reintentar
              </button>
            </div>
          )}

          {summary && !loading && (
            <>
              {/* Section 1 — Summary */}
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Resumen general
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard
                    emoji="📍"
                    label="Entradas"
                    value={summary.radiusEntries}
                    sub="al radio de activación"
                  />
                  <StatCard
                    emoji="🖱"
                    label="Clics"
                    value={summary.clicks}
                    sub='en "Ir a experiencia"'
                  />
                  <StatCard
                    emoji="↗"
                    label="Conversión"
                    value={`${summary.conversion}%`}
                    sub="entrada → clic"
                  />
                </div>
              </section>

              {/* Section 2 — By point */}
              {byPoint !== null && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Por punto
                  </h3>

                  {byPoint.length === 0 ? (
                    <p className="text-sm text-gray-600 py-4 text-center">
                      Sin datos por punto todavía.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-800">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-full">
                              Punto
                            </th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">
                              Entradas
                            </th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">
                              Clics
                            </th>
                            <th className="text-right text-xs font-medium text-gray-500 px-4 py-3 whitespace-nowrap">
                              Conversión
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {byPoint.map((row, i) => (
                            <tr
                              key={row.pointId}
                              className={`${i < byPoint.length - 1 ? 'border-b border-gray-800/60' : ''}`}
                            >
                              <td className="px-4 py-3 text-gray-200 max-w-0">
                                <span className="block truncate">{row.pointName || '—'}</span>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-gray-300">
                                {row.radiusEntries}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-gray-300">
                                {row.clicks}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <ConvBadge value={row.conversion} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            La conversión es el % de entradas que resultaron en un clic.
          </p>
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
