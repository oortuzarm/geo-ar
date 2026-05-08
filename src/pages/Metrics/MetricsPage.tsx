import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProjectAnalytics, fetchProjectAnalyticsByPoint } from '../../lib/analytics'
import type { ProjectAnalytics, PointAnalytics } from '../../lib/analytics'
import { geoProjectsApi } from '../../services'
import type { GeoProject } from '../../types'
import Spinner from '../../components/ui/Spinner'

// ── Conversion badge ──────────────────────────────────────────────────────────

function ConvBadge({ value }: { value: number }) {
  const cls =
    value >= 30 ? 'text-emerald-400' :
    value >= 15 ? 'text-amber-400'   :
    'text-gray-400'
  return <span className={`font-semibold tabular-nums ${cls}`}>{value}%</span>
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 flex flex-col gap-1.5">
      <span className="text-gray-500">{icon}</span>
      <span className="text-3xl font-bold text-gray-100 mt-1 leading-none tabular-nums">{value}</span>
      <span className="text-sm text-gray-400">{label}</span>
      {sub && <span className="text-xs text-gray-600">{sub}</span>}
    </div>
  )
}

// ── Insights ──────────────────────────────────────────────────────────────────

function Insights({ summary, byPoint }: { summary: ProjectAnalytics; byPoint: PointAnalytics[] | null }) {
  const lines: string[] = []

  if (summary.radiusEntries === 0) {
    lines.push('Aún no hay visitas registradas para este proyecto.')
  } else {
    if (byPoint && byPoint.length > 0) {
      const top = [...byPoint].sort((a, b) => b.radiusEntries - a.radiusEntries)[0]
      if (top.radiusEntries > 0) {
        lines.push(`El punto más activo es "${top.pointName}" con ${top.radiusEntries} entrada${top.radiusEntries !== 1 ? 's' : ''}.`)
      }
    }

    if (summary.conversion >= 40) {
      lines.push('Conversión excelente: más del 40% de las visitas hacen clic en la experiencia.')
    } else if (summary.conversion >= 20) {
      lines.push('Conversión saludable: 1 de cada 5 visitantes activa la experiencia.')
    } else if (summary.radiusEntries >= 5) {
      lines.push('Conversión baja: pocas entradas al radio resultan en un clic. Revisá el mensaje o botón del punto.')
    }
  }

  if (lines.length === 0) return null

  return (
    <section>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Insights
      </h3>
      <div className="bg-brand-600/8 border border-brand-500/20 rounded-xl px-4 py-3.5 space-y-1.5">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-gray-300 leading-snug">
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}

// ── Empty project selector state ──────────────────────────────────────────────

function NoProjectSelected({ projects, onSelect }: {
  projects: GeoProject[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center">
        <svg className="h-7 w-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div>
        <p className="text-gray-300 font-medium mb-1">Seleccioná un proyecto</p>
        <p className="text-sm text-gray-600">Elegí un proyecto para ver sus métricas.</p>
      </div>
      {projects.length > 0 && (
        <select
          defaultValue=""
          onChange={(e) => e.target.value && onSelect(e.target.value)}
          className="mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                     text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500
                     transition-colors cursor-pointer"
        >
          <option value="" disabled>Elegir proyecto…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MetricsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects,     setProjects]     = useState<GeoProject[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [selectedId,   setSelectedId]   = useState<string>(searchParams.get('projectId') ?? '')
  const [summary,      setSummary]      = useState<ProjectAnalytics | null>(null)
  const [byPoint,      setByPoint]      = useState<PointAnalytics[] | null>(null)
  const [dataLoading,  setDataLoading]  = useState(false)
  const [error,        setError]        = useState(false)
  const fetchedForRef = useRef<string | null>(null)

  // Load project list once
  useEffect(() => {
    geoProjectsApi.listProjects()
      .then((list) => setProjects(list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))))
      .finally(() => setProjectsLoading(false))
  }, [])

  // Fetch analytics whenever selectedId changes
  useEffect(() => {
    if (!selectedId) return
    if (fetchedForRef.current === selectedId && summary !== null) return

    fetchedForRef.current = selectedId
    setDataLoading(true)
    setError(false)
    setSummary(null)
    setByPoint(null)

    Promise.all([
      fetchProjectAnalytics(selectedId),
      fetchProjectAnalyticsByPoint(selectedId).catch(() => null),
    ])
      .then(([s, bp]) => { setSummary(s); setByPoint(bp) })
      .catch(() => setError(true))
      .finally(() => setDataLoading(false))
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  function selectProject(id: string) {
    setSelectedId(id)
    fetchedForRef.current = null
    setSearchParams(id ? { projectId: id } : {})
  }

  const selectedProject = projects.find((p) => p.id === selectedId)

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Mobile: show logo; desktop: show page title */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-100 text-sm">GeoAR</span>
          </div>
          <h1 className="hidden md:block font-bold text-gray-100">Métricas</h1>

          {/* Project selector */}
          {!projectsLoading && projects.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => selectProject(e.target.value)}
              className="ml-auto bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5
                         text-sm text-gray-300 max-w-[220px] w-full
                         focus:outline-none focus:ring-2 focus:ring-brand-500
                         transition-colors cursor-pointer"
            >
              <option value="">Elegir proyecto…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Loading projects */}
        {projectsLoading && (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        )}

        {/* No projects at all */}
        {!projectsLoading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-gray-400">No hay proyectos todavía.</p>
            <p className="text-sm text-gray-600">Creá un proyecto en la sección Proyectos para ver métricas aquí.</p>
          </div>
        )}

        {/* No project selected */}
        {!projectsLoading && projects.length > 0 && !selectedId && (
          <NoProjectSelected projects={projects} onSelect={selectProject} />
        )}

        {/* Selected — loading data */}
        {selectedId && dataLoading && (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        )}

        {/* Selected — error */}
        {selectedId && error && !dataLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <svg className="h-10 w-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-500">No se pudieron cargar las métricas.</p>
            <button
              onClick={() => { fetchedForRef.current = null; selectProject(selectedId) }}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Selected — data ready */}
        {summary && !dataLoading && (
          <div className="space-y-8">

            {/* Project name subtitle */}
            {selectedProject && (
              <div>
                <h2 className="text-xl font-bold text-gray-100 leading-snug">
                  {selectedProject.title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Métricas acumuladas desde el inicio</p>
              </div>
            )}

            {/* Summary cards */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Resumen general
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  icon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  }
                  label="Entradas"
                  value={summary.radiusEntries}
                  sub="al radio de activación"
                />
                <StatCard
                  icon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  }
                  label="Clics"
                  value={summary.clicks}
                  sub='en "Ir a experiencia"'
                />
                <StatCard
                  icon={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                    </svg>
                  }
                  label="Conversión"
                  value={`${summary.conversion}%`}
                  sub="entrada → clic"
                />
              </div>
            </section>

            {/* Insights */}
            <Insights summary={summary} byPoint={byPoint} />

            {/* By point table */}
            {byPoint !== null && (
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Por punto
                </h3>

                {byPoint.length === 0 ? (
                  <p className="text-sm text-gray-600 py-6 text-center">
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
                            Conv.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {byPoint.map((row, i) => (
                          <tr
                            key={row.pointId}
                            className={i < byPoint.length - 1 ? 'border-b border-gray-800/60' : ''}
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

            {/* Próximamente */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Próximamente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Actividad por horario', desc: 'Visualizá en qué franjas horarias ocurren más entradas.' },
                  { label: 'Distribución geográfica', desc: 'Mapa de calor de las zonas con más actividad.' },
                  { label: 'Tendencias en el tiempo', desc: 'Evolución de entradas y clics día a día.' },
                ].map(({ label, desc }) => (
                  <div
                    key={label}
                    className="bg-gray-800/30 border border-gray-800 rounded-xl px-4 py-4 opacity-60"
                  >
                    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
                    <p className="text-xs text-gray-600 leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer note */}
            <p className="text-xs text-gray-700 pb-2">
              La conversión es el porcentaje de entradas al radio que resultaron en un clic.
            </p>

          </div>
        )}
      </div>
    </div>
  )
}
