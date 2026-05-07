import { useRef, useState } from 'react'
import { useGeoStore } from '../../store/geoStore'
import { uploadImage } from '../../lib/uploadImage'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject } from '../../types'

const DEFAULT_SHARE_TEXT = 'Mira esta experiencia geolocalizada'

interface ProjectPanelProps {
  onMarkUnsaved: () => void
}

// ── Reusable image upload block ───────────────────────────────────────────────
interface ImageFieldProps {
  value: string | undefined
  label: string
  description: string
  onUpload: (url: string) => void
  onRemove: () => void
}

function ImageField({ value, label, description, onUpload, onRemove }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const { addToast } = useGeoStore()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onUpload(url)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Error al subir imagen', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 leading-snug">{description}</p>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="relative w-full h-28 rounded-xl overflow-hidden border border-dashed border-gray-700
                   hover:border-brand-500/50 transition-colors group disabled:opacity-60"
        aria-label={label}
      >
        {uploading ? (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                            transition-opacity flex items-center justify-center">
              <span className="text-xs text-white font-medium">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center gap-2">
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-500">Agregar imagen</span>
          </div>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors"
        >
          Eliminar imagen
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function ProjectPanel({ onMarkUnsaved }: ProjectPanelProps) {
  const { project, updateProjectField } = useGeoStore()

  // Local controlled value — syncs to store on blur so typing doesn't trigger saves mid-word
  const [shareText, setShareText] = useState(() => project?.shareText ?? DEFAULT_SHARE_TEXT)

  if (!project) return null

  function field<K extends keyof GeoProject>(key: K, value: GeoProject[K]) {
    updateProjectField(key, value)
    onMarkUnsaved()
  }

  function handleShareTextBlur() {
    const trimmed = shareText.trim()
    if (!trimmed) {
      setShareText(DEFAULT_SHARE_TEXT)
      field('shareText', undefined)
    } else {
      field('shareText', trimmed)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 min-w-0 w-full">
      <div className="p-4 space-y-6">

        {/* ── Portada del proyecto ─────────────────────────────────────────── */}
        <section>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Portada del proyecto
          </h3>
          <ImageField
            value={project.coverImage}
            label="Imagen de portada"
            description="Usada para compartir y preview del proyecto."
            onUpload={(url) => field('coverImage', url)}
            onRemove={() => field('coverImage', undefined)}
          />
        </section>

        {/* ── Nombre del proyecto ──────────────────────────────────────────── */}
        <section>
          <label
            htmlFor="project-title"
            className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2"
          >
            Nombre del proyecto
          </label>
          <input
            id="project-title"
            type="text"
            value={project.title}
            onChange={(e) => field('title', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                       text-sm text-gray-100
                       focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40
                       transition-colors"
          />
        </section>

        {/* ── Texto para compartir ─────────────────────────────────────────── */}
        <section>
          <label
            htmlFor="share-text"
            className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1"
          >
            Texto para compartir
          </label>
          <p className="text-xs text-gray-500 mb-2 leading-snug">
            Este mensaje aparece cuando compartes el link del proyecto.
          </p>
          <textarea
            id="share-text"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            onBlur={handleShareTextBlur}
            rows={3}
            maxLength={160}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                       text-sm text-gray-100 resize-none
                       focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40
                       transition-colors"
          />
          <p className="text-right text-[10px] text-gray-600 mt-0.5">{shareText.length}/160</p>
        </section>

        {/* ── Markers del mapa ─────────────────────────────────────────────── */}
        <section>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Markers del mapa
          </h3>
          <ImageField
            value={project.markerImage}
            label="Imagen default de markers"
            description="Usada automáticamente en los puntos GPS que no tengan imagen personalizada."
            onUpload={(url) => field('markerImage', url)}
            onRemove={() => field('markerImage', undefined)}
          />
        </section>

      </div>
    </div>
  )
}
