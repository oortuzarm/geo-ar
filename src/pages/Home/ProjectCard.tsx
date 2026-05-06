import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoProjectsApi } from '../../services'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { uploadImage } from '../../lib/uploadImage'
import MetricsModal from './MetricsModal'
import ShareModal from '../../components/ui/ShareModal'
import type { GeoProject } from '../../types'

const MAX_NAME_LENGTH = 60

interface ProjectCardProps {
  project: GeoProject
  onDelete: (id: string) => void
  onUpdate: (updated: GeoProject) => void
}

function StatusBadge({ status }: { status: GeoProject['status'] }) {
  const styles = {
    draft:    'bg-gray-700 text-gray-300',
    active:   'bg-green-900/60 text-green-300 border border-green-800',
    inactive: 'bg-red-900/60 text-red-300 border border-red-800',
  }
  const labels = { draft: 'Borrador', active: 'Publicado', inactive: 'Inactivo' }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
  const navigate = useNavigate()
  const coverRef = useRef<HTMLInputElement>(null)

  const [editingName, setEditingName] = useState(false)
  const [draftName, setDraftName] = useState(project.title)
  const [nameSaved, setNameSaved] = useState(false)

  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [togglingStatus, setTogglingStatus] = useState(false)
  const [metricsOpen, setMetricsOpen] = useState(false)
  const [shareOpen,   setShareOpen]   = useState(false)

  const publicUrl = `${window.location.origin}/public/${project.id}`

  function handleShare() {
    setShareOpen(true)
  }

  async function saveName() {
    const trimmed = draftName.trim().slice(0, MAX_NAME_LENGTH)
    setEditingName(false)
    if (!trimmed) { setDraftName(project.title); return }
    if (trimmed === project.title) return
    try {
      const updated = await geoProjectsApi.saveProject(project.id, { title: trimmed })
      onUpdate(updated)
      setNameSaved(true)
      setTimeout(() => setNameSaved(false), 2000)
    } catch {
      setDraftName(project.title)
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); saveName() }
    if (e.key === 'Escape') { setDraftName(project.title); setEditingName(false) }
  }

  async function handleToggleStatus() {
    const nextStatus = project.status === 'active' ? 'draft' : 'active'
    setTogglingStatus(true)
    try {
      const updated = await geoProjectsApi.saveProject(project.id, { status: nextStatus })
      onUpdate(updated)
    } catch {
      // stay silent — status badge will reflect actual backend state on next load
    } finally {
      setTogglingStatus(false)
    }
  }

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setCoverError(null)
    setUploadingCover(true)
    try {
      const url = await uploadImage(file)
      const updated = await geoProjectsApi.saveProject(project.id, { coverImage: url })
      onUpdate(updated)
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : 'Error al guardar la imagen')
    } finally {
      setUploadingCover(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">

      {/* Cover image */}
      <div className="h-36 bg-gray-800 relative overflow-hidden group/cover">
        {project.coverImage?.startsWith('data:') ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-4 text-center">
            <svg className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-yellow-400 leading-tight">Subí una nueva imagen<br/>para previews sociales</p>
          </div>
        ) : project.coverImage ? (
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="h-10 w-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        )}

        {uploadingCover ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : (
          <>
            {/* Desktop: full hover overlay */}
            <div
              className="absolute inset-0 bg-black/50 items-center justify-center gap-2
                         opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer
                         hidden md:flex"
              onClick={() => coverRef.current?.click()}
            >
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-white">Cambiar imagen</span>
            </div>

            {/* Mobile: always-visible camera button */}
            <button
              className="md:hidden absolute bottom-2 right-2 bg-black/60 rounded-full p-2
                         text-white hover:bg-black/80 transition-colors"
              onClick={() => coverRef.current?.click()}
              title="Cambiar imagen"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </>
        )}

        <div className="absolute top-2 right-2 pointer-events-none">
          <StatusBadge status={project.status} />
        </div>

        <input
          ref={coverRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleCoverFile}
        />
      </div>

      {coverError && (
        <p className="px-4 pt-2 text-xs text-red-400">{coverError}</p>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 min-w-0">
          {editingName ? (
            <input
              autoFocus
              maxLength={MAX_NAME_LENGTH}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={saveName}
              onKeyDown={handleNameKeyDown}
              className="flex-1 min-w-0 bg-gray-800 border border-brand-500 rounded px-2 py-0.5
                         text-sm font-semibold text-gray-100 focus:outline-none
                         focus:ring-1 focus:ring-brand-500"
            />
          ) : (
            <button
              className="flex-1 min-w-0 text-left font-semibold text-gray-100 truncate
                         hover:text-brand-300 transition-colors cursor-text text-sm
                         focus:outline-none"
              onClick={() => { setDraftName(project.title); setEditingName(true) }}
              title="Editar nombre"
            >
              {project.title}
            </button>
          )}
          {nameSaved && (
            <span className="flex-shrink-0 text-xs text-green-400">✓</span>
          )}
        </div>

        {project.subtitle && (
          <p className="text-sm text-gray-400 truncate mt-0.5">{project.subtitle}</p>
        )}
        <p className="text-xs text-gray-600 mt-2 mb-0.5">
          {project.geoPointIds.length} punto{project.geoPointIds.length !== 1 ? 's' : ''} ·{' '}
          {new Date(project.updatedAt).toLocaleDateString('es', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </p>
      </div>

      {/* Actions — row 1: primary */}
      <div className="px-4 pb-1 flex gap-2">
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
          className="flex-1 text-gray-400 hover:text-brand-300"
          onClick={handleShare}
          title="Compartir"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Compartir
        </Button>
      </div>

      {/* Actions — row 2: icon-only */}
      <div className="px-4 pb-4 flex gap-1 pt-1">
        {/* Publish / unpublish */}
        <Button
          variant="ghost"
          size="sm"
          loading={togglingStatus}
          onClick={handleToggleStatus}
          title={project.status === 'active' ? 'Despublicar' : 'Publicar'}
          className={project.status === 'active' ? 'text-green-400 hover:text-red-400' : 'text-gray-500 hover:text-green-400'}
        >
          {project.status === 'active' ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(publicUrl, '_blank')}
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
          onClick={() => setMetricsOpen(true)}
          title="Ver métricas"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(project.id)}
          title="Eliminar proyecto"
        >
          <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>

      <MetricsModal
        projectId={project.id}
        projectTitle={project.title}
        isOpen={metricsOpen}
        onClose={() => setMetricsOpen(false)}
      />
      <ShareModal
        url={publicUrl}
        title={project.title}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  )
}
