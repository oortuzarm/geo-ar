import { useRef, useState } from 'react'
import { useGeoStore } from '../../store/geoStore'
import { uploadImage } from '../../lib/uploadImage'
import { useEditorMode } from '../../contexts/EditorModeContext'
import Spinner from '../../components/ui/Spinner'
import type { GeoProject, PublicInitialViewMode } from '../../types'
const IMAGE_BASE64_MAX = 256 * 1024

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > IMAGE_BASE64_MAX) {
      reject(new Error('La imagen supera los 256 KB. Comprimila antes de subirla.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Error al leer la imagen'))
    reader.readAsDataURL(file)
  })
}

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
  /** When true: clicking shows an upsell toast instead of opening the file picker */
  blocked?: boolean
}

function ImageField({ value, label, description, onUpload, onRemove, blocked }: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [blockedClicked, setBlockedClicked] = useState(false)
  const { addToast } = useGeoStore()
  const editorMode = useEditorMode()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const url = editorMode === 'demo'
        ? await fileToBase64(file)
        : await uploadImage(file)
      onUpload(url)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Error al subir imagen', 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleClick() {
    if (blocked) {
      setBlockedClicked(true)
      return
    }
    fileRef.current?.click()
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 leading-snug">{description}</p>

      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="relative w-full h-28 rounded-xl overflow-hidden border border-dashed border-gray-700
                   hover:border-brand-500/50 transition-colors group disabled:opacity-60"
        aria-label={label}
      >
        {uploading ? (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : blocked && blockedClicked ? (
          <div className="w-full h-full bg-gray-800/50 flex flex-col items-center justify-center gap-1.5 px-4">
            <span className="text-xs text-red-400 text-center leading-snug">
              Crea tu cuenta gratuita para usar esta función.
            </span>
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

      {value && !blocked && (
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

// ── Logo field (circular preview + zoom) ─────────────────────────────────────

interface LogoFieldProps {
  value: string | undefined
  zoom: number
  label: string
  description: string
  onUpload: (url: string) => void
  onRemove: () => void
  onZoomChange: (zoom: number) => void
  blocked?: boolean
}

function LogoField({ value, zoom, label, description, onUpload, onRemove, onZoomChange, blocked }: LogoFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [blockedClicked, setBlockedClicked] = useState(false)
  const { addToast } = useGeoStore()
  const editorMode = useEditorMode()

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const url = editorMode === 'demo' ? await fileToBase64(file) : await uploadImage(file)
      onUpload(url)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Error al subir imagen', 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleClick() {
    if (blocked) { setBlockedClicked(true); return }
    fileRef.current?.click()
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3 leading-snug">{description}</p>

      <div className="flex flex-col items-center gap-3">

        {/* Circular preview / upload trigger */}
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="relative w-24 h-24 rounded-full overflow-hidden bg-white
                     border-2 border-dashed border-gray-700
                     hover:border-brand-500/50 transition-colors group disabled:opacity-60"
          aria-label={label}
        >
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="sm" />
            </div>
          ) : blocked && blockedClicked ? (
            <div className="absolute inset-0 flex items-center justify-center px-2">
              <span className="text-[10px] text-red-400 text-center leading-snug">
                Crea tu cuenta gratuita para usar esta función.
              </span>
            </div>
          ) : value ? (
            <>
              <img
                src={value}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                style={{ transform: `scale(${zoom})` }}
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100
                              transition-opacity flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">Cambiar</span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[10px] text-gray-500">Agregar</span>
            </div>
          )}
        </button>

        {/* Zoom slider — only when logo is loaded */}
        {value && !blocked && (
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Zoom</span>
              <span className="text-[10px] text-gray-400 tabular-nums">{zoom.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={zoom}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        )}

        {/* Remove */}
        {value && !blocked && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Eliminar imagen
          </button>
        )}
      </div>

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

// ── Public initial view section ───────────────────────────────────────────────

const VIEW_OPTIONS: { value: PublicInitialViewMode; label: string }[] = [
  { value: 'fit_points',     label: 'Mostrar todos los puntos' },
  { value: 'user_location',  label: 'Mostrar ubicación del visitante' },
  { value: 'custom',         label: 'Usar vista personalizada actual del mapa' },
]

function PublicInitialViewSection({ onMarkUnsaved }: { onMarkUnsaved: () => void }) {
  const { project, updateProjectField, lastKnownMapView } = useGeoStore()
  const [savedFeedback, setSavedFeedback] = useState(false)

  if (!project) return null

  console.log('[InitialView Editor Selected]', project.publicInitialViewMode)

  const currentMode: PublicInitialViewMode = project.publicInitialViewMode ?? 'fit_points'

  function handleModeChange(mode: PublicInitialViewMode) {
    console.log('[InitialView Update]', mode)
    updateProjectField('publicInitialViewMode', mode)
    onMarkUnsaved()
  }

  function handleSaveView() {
    const view = lastKnownMapView
    if (!view) return
    updateProjectField('publicInitialCenterLat', view.center[0])
    updateProjectField('publicInitialCenterLng', view.center[1])
    updateProjectField('publicInitialZoom', view.zoom)
    onMarkUnsaved()
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2000)
  }

  const hasSavedView =
    project.publicInitialCenterLat != null &&
    project.publicInitialCenterLng != null &&
    project.publicInitialZoom != null

  return (
    <section>
      <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
        Vista inicial pública
      </h3>
      <p className="text-xs text-gray-500 mb-3 leading-snug">
        Define cómo se verá el mapa cuando alguien abra este proyecto.
      </p>

      <div className="space-y-2">
        {VIEW_OPTIONS.map(({ value, label }) => (
          <label
            key={value}
            className="flex items-start gap-2.5 cursor-pointer group rounded-lg
                       px-2 py-1.5 -mx-2 hover:bg-gray-800/40 transition-colors"
          >
            <input
              type="radio"
              name="publicInitialViewMode"
              value={value}
              checked={currentMode === value}
              onChange={() => handleModeChange(value)}
              className="mt-0.5 flex-shrink-0 accent-brand-500"
            />
            <span className="text-sm text-gray-300 leading-snug">{label}</span>
          </label>
        ))}
      </div>

      {currentMode === 'custom' && (
        <div className="mt-3 p-3 rounded-xl bg-brand-500/[0.07] border border-brand-500/20">
          <p className="text-xs text-brand-300/80 mb-3 leading-snug">
            La vista actual del mapa será utilizada como vista inicial pública.
          </p>
          <button
            onClick={handleSaveView}
            className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                       text-white text-xs font-semibold transition-all duration-150"
          >
            {savedFeedback ? '✓ Vista guardada' : 'Guardar vista actual'}
          </button>
          {hasSavedView && (
            <p className="text-[10px] text-gray-600 mt-2 text-center tabular-nums">
              {project.publicInitialCenterLat!.toFixed(4)},&nbsp;
              {project.publicInitialCenterLng!.toFixed(4)}
              &nbsp;·&nbsp;zoom&nbsp;{project.publicInitialZoom}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function ProjectPanel({ onMarkUnsaved }: ProjectPanelProps) {
  const { project, updateProjectField } = useGeoStore()
  const editorMode = useEditorMode()

  // Local controlled value — syncs to store on blur so typing doesn't trigger saves mid-word
  const [shareText, setShareText] = useState(() => project?.shareText ?? DEFAULT_SHARE_TEXT)

  if (!project) return null

  const imagesBlocked = editorMode === 'demo'

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
    <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 [scrollbar-gutter:stable]">
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
            blocked={imagesBlocked}
          />
        </section>

        {/* ── Identidad pública del proyecto ──────────────────────────────── */}
        <section>
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
            Identidad pública del proyecto
          </h3>
          <p className="text-xs text-gray-500 mb-4 leading-snug">
            Configuración visual del proyecto en páginas públicas.
          </p>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Logo del proyecto
            </p>
            <LogoField
              value={project.projectLogoUrl}
              zoom={project.projectLogoZoom ?? 1}
              label="Logo del proyecto"
              description="Este logo representa la identidad visual del proyecto y podrá mostrarse en las páginas públicas."
              onUpload={(url) => field('projectLogoUrl', url)}
              onRemove={() => { field('projectLogoUrl', undefined); field('projectLogoZoom', undefined) }}
              onZoomChange={(z) => field('projectLogoZoom', z)}
              blocked={imagesBlocked}
            />
          </div>
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

        {/* ── Vista inicial pública ────────────────────────────────────────── */}
        <PublicInitialViewSection onMarkUnsaved={onMarkUnsaved} />

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
            blocked={imagesBlocked}
          />
        </section>

      </div>
    </div>
  )
}
