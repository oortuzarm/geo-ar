import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../hooks/useWorkspace'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function SettingsPage() {
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

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center md:hidden">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </div>
          <h1 className="hidden md:block font-bold text-gray-100">Configuración</h1>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* Workspace info */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl divide-y divide-gray-800">

          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Nombre del workspace
            </p>
            <p className="text-gray-100 font-medium">{project.title || 'Mi Workspace'}</p>
          </div>

          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Estado
            </p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                              font-medium border ${
              project.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-gray-700/40 text-gray-400 border-gray-600/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                project.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'
              }`} />
              {project.status === 'active' ? 'Publicado' : 'Borrador'}
            </span>
          </div>

          <div className="px-6 py-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Ubicaciones
              </p>
              <p className="text-2xl font-bold text-gray-100 tabular-nums">{points.length}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Activas
              </p>
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">{activeCount}</p>
            </div>
          </div>

          {project.description && (
            <div className="px-6 py-5">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Descripción
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-3">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Acceso rápido
          </p>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <span>Editor de ubicaciones</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => navigate(`/project/${project.id}/preview`)}
          >
            <span>Vista previa pública</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => navigate(`/app/metrics?projectId=${project.id}`)}
          >
            <span>Analytics</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

      </main>
    </div>
  )
}
