import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { geoProjectsApi } from '../../services'
import Spinner from '../../components/ui/Spinner'
import { uploadImage } from '../../lib/uploadImage'
import type { GeoProject } from '../../types'

interface ProjectCardProps {
  project: GeoProject
  onDelete: (id: string) => void
  onUpdate: (updated: GeoProject) => void
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<GeoProject['status'], string> = {
  draft:    'bg-gray-900/80 text-gray-400   border border-gray-700/80',
  active:   'bg-green-950/90 text-green-300 border border-green-800/60',
  inactive: 'bg-red-950/90  text-red-300   border border-red-800/60',
}
const STATUS_LABELS: Record<GeoProject['status'], string> = {
  draft: 'Borrador', active: 'Publicado', inactive: 'Inactivo',
}

function StatusBadge({ status }: { status: GeoProject['status'] }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

// ── Dropdown menu ─────────────────────────────────────────────────────────────

interface MenuProps {
  status: GeoProject['status']
  onEdit: () => void
  onViewPublic: () => void
  onEditCover: () => void
  onToggleStatus: () => void
  onDelete: () => void
  onClose: () => void
}

function DropdownMenu({ status, onEdit, onViewPublic, onEditCover, onToggleStatus, onDelete, onClose }: MenuProps) {
  const base = 'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors'
  const item = `${base} text-gray-300 hover:bg-gray-800 hover:text-gray-100`
  const run  = (fn: () => void) => () => { fn(); onClose() }

  return (
    <div
      className="absolute top-full right-0 mt-1.5 w-52
                 bg-gray-900 border border-gray-800 rounded-xl shadow-xl
                 overflow-hidden py-1 z-50"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Navigation */}
      <button className={item} onClick={run(onEdit)}>
        <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar experiencia
      </button>

      <button className={item} onClick={run(onViewPublic)}>
        <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Ver proyecto público
      </button>

      <button className={item} onClick={run(onEditCover)}>
        <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Editar imagen de portada
      </button>

      <div className="border-t border-gray-800 my-1" />

      {/* Status toggle */}
      <button className={item} onClick={run(onToggleStatus)}>
        {status === 'active' ? (
          <>
            <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            Despublicar
          </>
        ) : (
          <>
            <svg className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Publicar
          </>
        )}
      </button>

      <div className="border-t border-gray-800 my-1" />

      {/* Destructive */}
      <button
        className={`${base} text-red-400 hover:bg-red-950/40 hover:text-red-300`}
        onClick={run(onDelete)}
      >
        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eliminar proyecto
      </button>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

export default function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
  const navigate = useNavigate()
  const coverRef = useRef<HTMLInputElement>(null)
  const menuRef  = useRef<HTMLDivElement>(null)

  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverError,     setCoverError]     = useState<string | null>(null)
  const [menuOpen,       setMenuOpen]       = useState(false)

  // Close menu on outside mousedown
  useEffect(() => {
    if (!menuOpen) return
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  async function handleToggleStatus() {
    const next = project.status === 'active' ? 'draft' : 'active'
    try {
      const updated = await geoProjectsApi.saveProject(project.id, { status: next })
      onUpdate(updated)
    } catch { /* badge reflects backend state on next load */ }
  }

  async function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setCoverError(null)
    setUploadingCover(true)
    try {
      const url     = await uploadImage(file)
      const updated = await geoProjectsApi.saveProject(project.id, { coverImage: url })
      onUpdate(updated)
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : 'Error al guardar la imagen')
    } finally {
      setUploadingCover(false)
    }
  }

  function handleCardClick() {
    if (uploadingCover) return
    navigate(`/project/${project.id}`)
  }

  return (
    <div
      className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden
                 cursor-pointer hover:border-gray-600 hover:shadow-md
                 transition-all duration-150 group"
      onClick={handleCardClick}
    >
      {/* ── Cover ────────────────────────────────────────────────────────── */}
      <div className="h-36 bg-gray-800 overflow-hidden">
        {project.coverImage?.startsWith('data:') ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-4 text-center">
            <svg className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-yellow-400 leading-tight">Subí una nueva imagen<br/>para previews sociales</p>
          </div>
        ) : project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          group-hover:bg-gray-750 transition-colors">
            <svg className="h-10 w-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        )}

        {/* Upload overlay — stops card click while uploading */}
        {uploadingCover && (
          <div
            className="absolute inset-x-0 top-0 h-36 bg-black/60 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {/* Hidden file input — triggered from menu item */}
      <input
        ref={coverRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleCoverFile}
      />

      {/* ── Status badge ─────────────────────────────────────────────────── */}
      <div className="absolute top-2.5 left-2.5 pointer-events-none">
        <StatusBadge status={project.status} />
      </div>

      {/* ── ⋮ Menu ───────────────────────────────────────────────────────── */}
      {/* stopPropagation isolates all menu interaction from the card onClick */}
      <div
        ref={menuRef}
        className="absolute top-2 right-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-7 h-7 flex items-center justify-center rounded-full
                     bg-black/40 hover:bg-black/65 text-white transition-colors"
          title="Opciones"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5"  r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {menuOpen && (
          <DropdownMenu
            status={project.status}
            onEdit={() => navigate(`/project/${project.id}`)}
            onViewPublic={() => window.open(`/public/${project.id}`, '_blank')}
            onEditCover={() => coverRef.current?.click()}
            onToggleStatus={handleToggleStatus}
            onDelete={() => onDelete(project.id)}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>

      {/* ── Cover error ──────────────────────────────────────────────────── */}
      {coverError && (
        <p className="px-4 pt-2 text-xs text-red-400">{coverError}</p>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-4">
        <p className="text-sm font-semibold text-gray-100 truncate leading-snug">
          {project.title}
        </p>

        {project.subtitle && (
          <p className="text-sm text-gray-400 truncate mt-0.5">{project.subtitle}</p>
        )}

        <p className="text-xs text-gray-600 mt-2">
          {project.geoPointIds.length} punto{project.geoPointIds.length !== 1 ? 's' : ''} ·{' '}
          {new Date(project.updatedAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
