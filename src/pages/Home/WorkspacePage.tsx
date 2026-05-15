import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../hooks/useWorkspace'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ToastContainer from '../../components/ui/Toast'
import WorkspaceMap from '../../components/map/WorkspaceMap'
import type { ContentType, GeoPoint } from '../../types'

// ── Content type display config ───────────────────────────────────────────────

const CT_LABEL: Record<ContentType, string> = {
  url:   'URL',
  video: 'Video',
  audio: 'Audio',
  file:  'Archivo',
}

const CT_COLOR: Record<ContentType, string> = {
  url:   'bg-sky-500/10 text-sky-400 border-sky-500/20',
  video: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  audio: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  file:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </p>
  )
}

function KPICard({
  label, value, sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-5 flex flex-col gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium leading-none">
        {label}
      </p>
      <p className="text-4xl font-bold tabular-nums leading-none text-gray-100">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-gray-600 leading-none">{sub}</p>
      )}
    </div>
  )
}

function PointThumbnail({ point }: { point: GeoPoint }) {
  return (
    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-800 border border-gray-700/50 flex-shrink-0">
      {point.image ? (
        <img src={point.image} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="h-3.5 w-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
      )}
    </div>
  )
}

function ContentTypeBadge({ ct }: { ct: ContentType }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${CT_COLOR[ct]}`}>
      {CT_LABEL[ct]}
    </span>
  )
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${active ? 'text-emerald-400' : 'text-gray-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-emerald-400' : 'bg-gray-600'}`} />
      {active ? 'Activa' : 'Inactiva'}
    </span>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-300 mb-2">Sin ubicaciones aún</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Crea tu primera ubicación en el editor de mapa.
      </p>
      <Button onClick={onAdd}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nueva ubicación
      </Button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const navigate = useNavigate()
  const { project, points, loading } = useWorkspace()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!project) return null

  const activeCount = points.filter((p) => p.active).length
  const editorUrl   = `/project/${project.id}`
  const metricsUrl  = `/app/metrics?projectId=${project.id}`

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Mobile: logo (desktop sidebar already shows it) */}
          <div className="flex items-center md:hidden">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </div>
          <h1 className="hidden md:block font-bold text-gray-100">Ubicaciones</h1>

          <Button onClick={() => navigate(editorUrl)}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva ubicación
          </Button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {points.length === 0 ? (
          <EmptyState onAdd={() => navigate(editorUrl)} />
        ) : (
          <>
            {/* ── KPI strip ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

              <KPICard
                label="Ubicaciones"
                value={points.length}
                sub={points.length === 1 ? 'en total' : 'en total'}
              />

              <KPICard
                label="Activas"
                value={activeCount}
                sub={`de ${points.length} habilitadas`}
              />

              {/* Estado */}
              <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-5 flex flex-col gap-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium leading-none">
                  Estado
                </p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    project.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-gray-700/40 text-gray-400 border-gray-600/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      project.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'
                    }`} />
                    {project.status === 'active' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>

              {/* Analytics CTA */}
              <button
                onClick={() => navigate(metricsUrl)}
                className="bg-gray-900/70 border border-white/[0.07] hover:border-brand-500/30
                           hover:bg-brand-500/5 rounded-2xl px-5 py-5 flex flex-col gap-2
                           text-left transition-all group cursor-pointer"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium
                              leading-none group-hover:text-brand-400 transition-colors">
                  Analytics
                </p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                    Ver métricas
                  </p>
                  <svg className="h-4 w-4 text-brand-500 group-hover:text-brand-400 transition-colors"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* ── Map ───────────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Mapa</SectionLabel>
                <button
                  onClick={() => navigate(editorUrl)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors
                             flex items-center gap-1"
                >
                  Ir al editor
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div
                className="rounded-2xl overflow-hidden border border-gray-800"
                style={{ height: '320px' }}
              >
                <WorkspaceMap
                  points={points}
                  onMarkerClick={() => navigate(editorUrl)}
                />
              </div>
            </section>

            {/* ── Locations table ───────────────────────────────────────── */}
            <section className="pb-6">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>
                  Ubicaciones{' '}
                  <span className="text-gray-700 normal-case font-normal">({points.length})</span>
                </SectionLabel>
                <button
                  onClick={() => navigate(editorUrl)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Gestionar en editor →
                </button>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/60">
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-8">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Nombre
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Tipo
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Estado
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Radio
                      </th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((point, idx) => {
                      const ct = point.contentType ?? 'url'
                      return (
                        <tr
                          key={point.id}
                          className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-600 text-xs tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <PointThumbnail point={point} />
                              <span className={`font-medium truncate max-w-[200px] ${
                                point.active ? 'text-gray-100' : 'text-gray-500'
                              }`}>
                                {point.name || (
                                  <em className="font-normal text-gray-600 not-italic">Sin nombre</em>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <ContentTypeBadge ct={ct} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusDot active={point.active} />
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs tabular-nums">
                            {point.activationRadius} m
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => navigate(editorUrl)}
                                className="text-xs text-gray-400 hover:text-gray-100 transition-colors
                                           px-2 py-1 rounded hover:bg-gray-700/50"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => navigate(metricsUrl)}
                                className="text-xs text-brand-400 hover:text-brand-300 transition-colors
                                           px-2 py-1 rounded hover:bg-brand-500/10"
                              >
                                Analytics
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {points.map((point) => {
                  const ct = point.contentType ?? 'url'
                  return (
                    <div
                      key={point.id}
                      className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3
                                 flex items-center gap-3"
                    >
                      <PointThumbnail point={point} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          point.active ? 'text-gray-100' : 'text-gray-500'
                        }`}>
                          {point.name || 'Sin nombre'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <ContentTypeBadge ct={ct} />
                          <span className="text-[11px] text-gray-600 tabular-nums">
                            {point.activationRadius} m
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(editorUrl)}
                        className="flex-shrink-0 text-xs text-brand-400 hover:text-brand-300
                                   transition-colors px-2 py-1.5 rounded hover:bg-brand-500/10"
                      >
                        Editar
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <ToastContainer />
    </div>
  )
}
