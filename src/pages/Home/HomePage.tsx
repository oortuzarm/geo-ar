import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoProjectsApi } from '../../services'
import type { GeoProject } from '../../types'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ToastContainer from '../../components/ui/Toast'
import { useGeoStore } from '../../store/geoStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { addToast } = useGeoStore()
  const [projects, setProjects] = useState<GeoProject[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    geoProjectsApi.listProjects().then((list) => {
      setProjects(list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
      setLoading(false)
    })
  }, [])

  async function handleNew() {
    const project = await geoProjectsApi.createProject()
    navigate(`/project/${project.id}`)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await geoProjectsApi.removeProject(deleteTarget)
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget))
    setDeleteTarget(null)
    addToast('Proyecto eliminado', 'success')
  }

  const statusBadge = (status: GeoProject['status']) => {
    const map = {
      draft: 'bg-gray-700 text-gray-300',
      active: 'bg-green-900/60 text-green-300 border border-green-800',
      inactive: 'bg-red-900/60 text-red-300 border border-red-800',
    }
    const label = { draft: 'Borrador', active: 'Activo', inactive: 'Inactivo' }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status]}`}>
        {label[status]}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-100 leading-none">GeoAR</h1>
              <p className="text-xs text-gray-500">Experiencias geolocalizadas</p>
            </div>
          </div>
          <Button onClick={handleNew}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo proyecto GPS
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Sin proyectos aún</h2>
            <p className="text-gray-500 mb-6">Crea tu primer proyecto GPS para comenzar.</p>
            <Button onClick={handleNew}>Crear proyecto GPS</Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden
                             hover:border-gray-700 transition-colors group"
                >
                  {/* Cover image */}
                  <div className="h-36 bg-gray-800 relative overflow-hidden">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="h-10 w-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">{statusBadge(project.status)}</div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-100 truncate">{project.title}</h3>
                    {project.subtitle && (
                      <p className="text-sm text-gray-400 truncate mt-0.5">{project.subtitle}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      {project.geoPointIds.length} punto{project.geoPointIds.length !== 1 ? 's' : ''} ·{' '}
                      {new Date(project.updatedAt).toLocaleDateString('es', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/public/${project.id}`, '_blank')}
                      title="Abrir vista pública"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(project.id)}
                      title="Eliminar proyecto"
                    >
                      <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Modal
        open={!!deleteTarget}
        title="Eliminar proyecto"
        description="Esta acción no se puede deshacer. Se eliminarán el proyecto y todos sus puntos GPS."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
      <ToastContainer />
    </div>
  )
}
