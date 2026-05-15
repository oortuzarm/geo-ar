import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoProjectsApi, geoPointsApi } from '../../services'
import type { GeoProject, MediaContentData } from '../../types'
import { deleteMediaFile, isVercelBlobUrl } from '../../lib/deleteMediaFile'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ToastContainer from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import ProjectCard from './ProjectCard'
import { useGeoStore } from '../../store/geoStore'

type SortOrder = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

const STATUS_SEARCH: Record<GeoProject['status'], string> = {
  draft: 'borrador', active: 'publicado', inactive: 'inactivo',
}

export default function HomePage() {
  const navigate = useNavigate()
  const { addToast } = useGeoStore()

  const [projects,        setProjects]        = useState<GeoProject[]>([])
  const [loading,         setLoading]         = useState(true)
  const [query,           setQuery]           = useState('')
  const [sortBy,          setSortBy]          = useState<SortOrder>('newest')
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

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

  function handleDelete(id: string) {
    setProjectToDelete(id)
  }

  // Optimistic delete — card disappears immediately; restored on API failure.
  // Fetches points first so we can clean up any Vercel Blob media assets after delete.
  async function confirmDelete() {
    const id = projectToDelete
    if (!id) return
    setProjectToDelete(null)
    const snapshot = projects.find((p) => p.id === id)

    // Collect media file_urls for all points in this project (before deletion).
    let orphanUrls: string[] = []
    try {
      const pts = await geoPointsApi.listPoints(id)
      orphanUrls = pts.flatMap((pt) => {
        if (pt.contentType === 'url') return []
        const cd = pt.contentData as MediaContentData | undefined
        return isVercelBlobUrl(cd?.file_url) ? [cd!.file_url] : []
      })
    } catch { /* non-critical — proceed with delete even if points can't be fetched */ }

    // Optimistic removal from UI
    setProjects((prev) => prev.filter((p) => p.id !== id))

    try {
      await geoProjectsApi.removeProject(id)
      addToast('Proyecto eliminado', 'success')
      if (orphanUrls.length > 0) {
        console.log('[DeleteProject] Cleaning orphan media assets:', orphanUrls)
        orphanUrls.forEach((url) => void deleteMediaFile(url))
      }
    } catch {
      if (snapshot) setProjects((prev) => [snapshot, ...prev])
      addToast('Error al eliminar el proyecto', 'error')
    }
  }

  function handleUpdate(updated: GeoProject) {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  // Filtered + sorted list — recomputed only when inputs change
  const visibleProjects = useMemo(() => {
    const q = query.trim().toLowerCase()

    const filtered = q
      ? projects.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q) ||
          (STATUS_SEARCH[p.status] ?? '').includes(q),
        )
      : projects

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':    return a.updatedAt.localeCompare(b.updatedAt)
        case 'name-asc':  return a.title.localeCompare(b.title, 'es')
        case 'name-desc': return b.title.localeCompare(a.title, 'es')
        default:          return b.updatedAt.localeCompare(a.updatedAt)
      }
    })
  }, [projects, query, sortBy])

  const isSearching = query.trim().length > 0

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Mobile: show logo; desktop: sidebar already has it */}
          <div className="flex items-center md:hidden">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </div>
          <h1 className="hidden md:block font-bold text-gray-100">Proyectos</h1>

          <Button onClick={handleNew}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo proyecto GPS
          </Button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>

        ) : projects.length === 0 ? (
          /* Empty state — zero projects in backend */
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

            {/* ── Search + Sort bar ─────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">

              {/* Search input */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar proyectos..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg
                             pl-9 pr-9 py-2 text-sm text-gray-100 placeholder-gray-500
                             hover:border-gray-600
                             focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                             transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-gray-500 hover:text-gray-300 transition-colors"
                    title="Limpiar búsqueda"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                           text-sm text-gray-300
                           hover:border-gray-600
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           transition-colors sm:w-44 cursor-pointer"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="name-asc">Nombre A–Z</option>
                <option value="name-desc">Nombre Z–A</option>
              </select>
            </div>

            {/* ── Count ─────────────────────────────────────────────────────── */}
            <p className="text-sm text-gray-500 mb-4">
              {isSearching
                ? `${visibleProjects.length} de ${projects.length} proyecto${projects.length !== 1 ? 's' : ''}`
                : `${projects.length} proyecto${projects.length !== 1 ? 's' : ''}`}
            </p>

            {/* ── No results from search ────────────────────────────────────── */}
            {visibleProjects.length === 0 ? (
              <div className="text-center py-16">
                <svg className="h-12 w-12 text-gray-700 mx-auto mb-3"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-400 font-medium">No se encontraron proyectos</p>
                <p className="text-sm text-gray-600 mt-1">
                  Ningún proyecto coincide con "{query.trim()}"
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Limpiar búsqueda
                </button>
              </div>

            ) : (
              /* ── Grid ───────────────────────────────────────────────────── */
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )}

          </div>
        )}
      </main>

      <Modal
        open={projectToDelete !== null}
        title="¿Eliminar proyecto?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
        danger
      />
      <ToastContainer />
    </div>
  )
}

