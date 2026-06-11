import { useRef, useState } from 'react'
import { useGeoStore }      from '../../store/geoStore'
import { uploadImage }      from '../../lib/uploadImage'
import { useEditorMode }    from '../../contexts/EditorModeContext'
import Spinner              from './Spinner'

const IMAGE_BASE64_MAX = 256 * 1024

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > IMAGE_BASE64_MAX) {
      reject(new Error('La imagen supera los 256 KB. Comprimila antes de subirla.'))
      return
    }
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Error al leer la imagen'))
    reader.readAsDataURL(file)
  })
}

export interface LogoFieldProps {
  value:    string | undefined
  zoom:     number
  posX:     number
  posY:     number
  label:    string
  description: string
  onUpload:         (url: string) => void
  onRemove:         () => void
  onZoomChange:     (zoom: number) => void
  onPositionChange: (x: number, y: number) => void
  blocked?: boolean
}

export function LogoField({
  value, zoom, posX, posY, label, description,
  onUpload, onRemove, onZoomChange, onPositionChange, blocked,
}: LogoFieldProps) {
  const fileRef          = useRef<HTMLInputElement>(null)
  const [uploading,      setUploading]      = useState(false)
  const [blockedClicked, setBlockedClicked] = useState(false)
  const [dragging,       setDragging]       = useState(false)
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null)
  const didDragRef   = useRef(false)
  const { addToast } = useGeoStore()
  const editorMode   = useEditorMode()

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

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (!value || blocked) return
    didDragRef.current = false
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX, posY }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragStartRef.current) return
    const { x: sx, y: sy, posX: spx, posY: spy } = dragStartRef.current
    if (Math.abs(e.clientX - sx) > 3 || Math.abs(e.clientY - sy) > 3) didDragRef.current = true
    const size = e.currentTarget.getBoundingClientRect().width
    onPositionChange(spx + (e.clientX - sx) / size * 100, spy + (e.clientY - sy) / size * 100)
  }

  function handlePointerUp() {
    setDragging(false)
    dragStartRef.current = null
  }

  function handleClick() {
    if (didDragRef.current) { didDragRef.current = false; return }
    if (blocked) { setBlockedClicked(true); return }
    fileRef.current?.click()
  }

  const hasNonDefaultPosition = posX !== 0 || posY !== 0

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3 leading-snug">{description}</p>

      <div className="flex flex-col items-center gap-3">

        <button
          type="button"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          disabled={uploading}
          className={[
            'relative w-24 h-24 rounded-full overflow-hidden bg-white',
            'border-2 border-dashed border-gray-700',
            'hover:border-brand-500/50 transition-colors disabled:opacity-60',
            value && !blocked ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : '',
          ].join(' ')}
          style={{ touchAction: 'none' }}
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
            <img
              src={value}
              alt=""
              className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
              style={{ transform: `translate(${posX}%, ${posY}%) scale(${zoom})` }}
              draggable={false}
            />
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

        {value && !blocked && hasNonDefaultPosition && (
          <button
            type="button"
            onClick={() => onPositionChange(0, 0)}
            className="text-xs text-gray-500 hover:text-brand-400 transition-colors"
          >
            Restablecer posición
          </button>
        )}

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
