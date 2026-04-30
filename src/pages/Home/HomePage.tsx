import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoProjectsApi } from '../../services'
import type { GeoProject } from '../../types'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ToastContainer from '../../components/ui/Toast'
import ProjectCard from './ProjectCard'
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

  function handleUpdate(updated: GeoProject) {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={setDeleteTarget}
                  onUpdate={handleUpdate}
                />
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
