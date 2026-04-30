import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoProjectsApi } from '../../services'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject } from '../../types'

const MAX_NAME_LENGTH = 60

interface ProjectCardProps {
  project: GeoProject
  onDelete: (id: string) => void
  onUpdate: (updated: GeoProject) => void
}

function StatusBadge({ status }: { status: GeoProject['status'] }) {
  const styles = {
    draft: 'bg-gray-700 text-gray-300',
    active: 'bg-green-900/60 text-green-300 border border-green-800',
    inactive: 'bg-red-900/60 text-red-300 border border-red-800',
  }
  const labels = { draft: 'Borrador', active: 'Activo', inactive: 'Inactivo' }
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

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > 5 * 1024 * 1024) {
      setCoverError('La imagen supera los 5 MB')
      return
    }
    setCoverError(null)
    setUploadingCover(true)

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const updated = await geoProjectsApi.saveProject(project.id, {
          coverImage: reader.result as string,
        })
        onUpdate(updated)
      } catch {
        setCoverError('Error al guardar la imagen')
      } finally {
        setUploadingCover(false)
      }
    }
    reader.onerror = () => {
      setCoverError('Error al leer el archivo')
      setUploadingCover(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">

      {/* Cover image */}
      <div className="h-36 bg-gray-800 relative overflow-hidden group/cover">
        {project.coverImage ? (
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
          onClick={() => onDelete(project.id)}
          title="Eliminar proyecto"
        >
          <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
