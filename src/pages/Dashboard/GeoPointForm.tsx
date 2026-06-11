import { useEffect, useRef, useState } from 'react'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { ContentType, DestinationCategory, GeoPoint, GeoPointAvailability, MediaContentData } from '../../types'
import { reverseGeocode } from '../../features/geolocation/geocoding'
import { uploadFile, formatFileSize } from '../../lib/uploadFile'
import { uploadImage } from '../../lib/uploadImage'
import { isVercelBlobUrl } from '../../lib/deleteMediaFile'
import { useEditorMode } from '../../contexts/EditorModeContext'
import { usePlanFeatures } from '../../hooks/usePlanFeatures'
import { LogoField } from '../../components/ui/LogoField'
import { detectVideoType, extractYouTubeId } from '../../lib/videoUtils'
import { normalizeUrl, isValidUrl } from '../../lib/urlUtils'
import type { PointImage } from '../../types'
import UpgradeModal from '../../components/subscription/UpgradeModal'

import type { PolygonDrawMode } from '../../components/map/PolygonDrawLayer'

interface GeoPointFormProps {
  point: GeoPoint
  onChange: (updates: Partial<GeoPoint>) => void
  onDelete: () => void
  onClose: () => void
  onSave: () => void
  onMediaOrphaned?: (url: string) => void
  hideHeader?: boolean
  allPoints?: GeoPoint[]
  // ── Polygon drawing ──────────────────────────────────────────────────────
  polygonDrawMode?: PolygonDrawMode
  onRequestPolygonDraw?: () => void
  onRequestPolygonEdit?: () => void
  onStopPolygonEdit?: () => void
  /** Cancel a redraw session — restores the previous polygon without changes. */
  onCancelPolygonDraw?: () => void
  /** Cancel an edit session — restores the original polygon without changes. */
  onCancelPolygonEdit?: () => void
}

const RADIUS_TOOLTIP =
  'El radio de activación define la distancia máxima desde el punto geolocalizado dentro de la cual esta experiencia puede activarse. Si el usuario está fuera de este radio, la experiencia no se mostrará.'

const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const MAX_GALLERY = 5

// ─── Content type config ──────────────────────────────────────────────────────

const CONTENT_TYPES: { type: ContentType; label: string; icon: string }[] = [
  { type: 'url',   label: 'URL',                icon: '🔗' },
  { type: 'video', label: 'Video',              icon: '🎬' },
  { type: 'audio', label: 'Audio',              icon: '🎵' },
  { type: 'file',  label: 'Archivo descargable', icon: '📄' },
]

// ─── Destination category config (only shown when content type is URL) ────────

const DESTINATION_CATEGORIES: { value: DestinationCategory; label: string }[] = [
  { value: 'website',     label: 'Sitio web'     },
  { value: 'whatsapp',    label: 'WhatsApp'      },
  { value: 'form',        label: 'Formulario'    },
  { value: 'reservation', label: 'Reserva'       },
  { value: 'ecommerce',   label: 'E-commerce'    },
  { value: 'social',      label: 'Red social'    },
  { value: 'map',         label: 'Mapa'          },
  { value: 'coupon',      label: 'Cupón'         },
  { value: 'custom',      label: 'Personalizado' },
]

const FILE_CONFIG: Record<Exclude<ContentType, 'url'>, { accept: string; hint: string; maxLabel: string }> = {
  video: { accept: 'video/mp4,video/webm',        hint: 'Sube un video MP4 o WebM.',          maxLabel: 'Máx 20 MB' },
  audio: { accept: 'audio/mpeg,audio/wav',         hint: 'Sube un archivo MP3 o WAV.',         maxLabel: 'Máx 20 MB' },
  file:  { accept: '.pdf,.docx,.xlsx,.pptx,.zip',  hint: 'Sube un PDF, DOCX, XLSX, PPTX o ZIP.', maxLabel: 'Máx 20 MB' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors',
        enabled ? 'bg-brand-600' : 'bg-gray-700',
      ].join(' ')}
    >
      <span className={[
        'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
        enabled ? 'translate-x-4' : 'translate-x-1',
      ].join(' ')} />
    </button>
  )
}

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, right: 24 })
  const btnRef = useRef<HTMLButtonElement>(null)

  function measure() {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const top  = Math.min(rect.bottom + 8, window.innerHeight - 160)
    setPos({ top, right: 24 })
  }

  return (
    <span className="inline-flex">
      <button
        ref={btnRef}
        type="button"
        className="text-gray-500 hover:text-gray-300 transition-colors"
        onMouseEnter={() => { measure(); setOpen(true)  }}
        onMouseLeave={() => setOpen(false)}
        onClick={() => { if (!open) measure(); setOpen((v) => !v) }}
        aria-label="Más información"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {open && (
        <div
          className="fixed z-[9999] w-64 max-w-[260px]
                     bg-gray-800 border border-gray-700
                     text-xs text-gray-300 p-3 rounded-lg shadow-xl pointer-events-none
                     whitespace-normal break-words"
          style={{ top: pos.top, right: pos.right }}
        >
          {text}
        </div>
      )}
    </span>
  )
}

function AvailabilityRules({
  availability,
  onChange,
  canUseSchedule   = true,
  canUseQuota      = true,
  canUseLiveVisits = true,
  onUpgradeClick,
  showHeader       = true,
}: {
  availability:      GeoPointAvailability | undefined
  onChange:          (updates: Partial<GeoPointAvailability>) => void
  canUseSchedule?:   boolean
  canUseQuota?:      boolean
  canUseLiveVisits?: boolean
  onUpgradeClick?:   () => void
  showHeader?:       boolean
}) {
  const scheduleEnabled = availability?.scheduleEnabled ?? false
  const scheduleDays    = availability?.scheduleDays ?? []
  const startTime       = availability?.scheduleStartTime ?? ''
  const endTime         = availability?.scheduleEndTime ?? ''
  const quotaEnabled       = availability?.quotaEnabled ?? false
  const quotaLimit         = availability?.quotaLimit ?? 1
  const liveVisitsEnabled  = availability?.liveVisitsEnabled ?? false
  const liveVisitsMinimum  = availability?.liveVisitsMinimum ?? 1

  function toggleDay(day: string) {
    const next = scheduleDays.includes(day)
      ? scheduleDays.filter((d) => d !== day)
      : [...scheduleDays, day]
    onChange({ scheduleDays: next })
  }

  return (
    <div className="space-y-2">
      {showHeader && (
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Disponibilidad
        </span>
      )}

      {/* ── Schedule rule ── */}
      <div
        className={`bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-3 ${!canUseSchedule ? 'cursor-pointer' : ''}`}
        onClick={!canUseSchedule ? onUpgradeClick : undefined}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${canUseSchedule ? 'text-gray-300' : 'text-gray-600'}`}>Disponible por horario</span>
          {canUseSchedule
            ? <Toggle enabled={scheduleEnabled} onToggle={() => onChange({ scheduleEnabled: !scheduleEnabled })} />
            : <span className="text-xs text-gray-600" title="Esta función no está disponible en tu plan actual.">🔒 No disponible</span>
          }
        </div>

        {canUseSchedule && scheduleEnabled && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={[
                    'px-2 py-1 rounded text-xs font-medium transition-colors',
                    scheduleDays.includes(day)
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600',
                  ].join(' ')}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Desde</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => onChange({ scheduleStartTime: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                             text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500
                             focus:border-transparent transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Hasta</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => onChange({ scheduleEndTime: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                             text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500
                             focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              La experiencia solo estará disponible durante los días y horarios seleccionados.
            </p>
          </>
        )}
      </div>

      {/* ── Quota rule ── */}
      <div
        className={`bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-3 ${!canUseQuota ? 'cursor-pointer' : ''}`}
        onClick={!canUseQuota ? onUpgradeClick : undefined}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${canUseQuota ? 'text-gray-300' : 'text-gray-600'}`}>Disponible por cupos</span>
          {canUseQuota
            ? <Toggle enabled={quotaEnabled} onToggle={() => onChange({ quotaEnabled: !quotaEnabled })} />
            : <span className="text-xs text-gray-600" title="Esta función no está disponible en tu plan actual.">🔒 No disponible</span>
          }
        </div>

        {canUseQuota && quotaEnabled && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Cupos disponibles
              </label>
              <input
                type="number"
                min={1}
                value={quotaLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val) && val >= 1) onChange({ quotaLimit: val })
                }}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500
                           focus:border-transparent transition-colors w-full"
              />
            </div>
            <p className="text-xs text-gray-500">
              La experiencia se desactivará cuando se alcance el límite de accesos definidos.
            </p>
          </>
        )}
      </div>

      {/* ── Live visits rule ── */}
      <div
        className={`bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-3 ${!canUseLiveVisits ? 'cursor-pointer' : ''}`}
        onClick={!canUseLiveVisits ? onUpgradeClick : undefined}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${canUseLiveVisits ? 'text-gray-300' : 'text-gray-600'}`}>
            Visitas en vivo
          </span>
          {canUseLiveVisits
            ? <Toggle enabled={liveVisitsEnabled} onToggle={() => onChange({ liveVisitsEnabled: !liveVisitsEnabled })} />
            : <span className="text-xs text-gray-600" title="Esta función no está disponible en tu plan actual.">🔒 No disponible</span>
          }
        </div>

        <p className={`text-xs ${canUseLiveVisits ? 'text-gray-500' : 'text-gray-700'}`}>
          Activa esta experiencia cuando haya una cantidad mínima de personas dentro del área GPS en tiempo real.
        </p>

        {canUseLiveVisits && liveVisitsEnabled && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Mínimo de personas dentro del área
              </label>
              <input
                type="number"
                min={1}
                value={liveVisitsMinimum}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (!isNaN(val) && val >= 1) onChange({ liveVisitsMinimum: val })
                }}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500
                           focus:border-transparent transition-colors w-full"
              />
            </div>
            <p className="text-xs text-gray-500">
              {`La experiencia se activará cuando haya al menos ${liveVisitsMinimum} persona${liveVisitsMinimum === 1 ? '' : 's'} dentro del área en tiempo real.`}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

function isMediaContentData(data: GeoPoint['contentData']): data is MediaContentData {
  return !!(data && 'file_url' in data && (data as MediaContentData).file_url)
}

export default function GeoPointForm({
  point, onChange, onDelete, onClose, onSave, onMediaOrphaned, hideHeader = false,
  polygonDrawMode = 'idle',
  onRequestPolygonDraw,
  onRequestPolygonEdit,
  onStopPolygonEdit,
  onCancelPolygonDraw,
  onCancelPolygonEdit,
  allPoints,
}: GeoPointFormProps) {
  const otherPoints = (allPoints ?? []).filter((p) => p.id !== point.id)

  const editorMode = useEditorMode()
  const { canUseContentType, canUseScheduleAvailability, canUseQuotaAvailability, canUseDwellTime, canUseLiveVisits } = usePlanFeatures()
  const mediaFileRef   = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)
  const [advancedOpen,         setAdvancedOpen]         = useState(false)
  const [upgradeOpen,          setUpgradeOpen]          = useState(false)

  // ── Gallery state ─────────────────────────────────────────────────────────
  // Migrate from legacy `image` field on first open — becomes position-0 cover.
  const [galleryImages, setGalleryImages] = useState<PointImage[]>(() => {
    if (point.images && point.images.length > 0) {
      return [...point.images].sort((a, b) => a.position - b.position)
    }
    if (point.image) {
      return [{ id: crypto.randomUUID(), url: point.image, isCover: true, position: 0 }]
    }
    return []
  })
  const [galleryUploading,  setGalleryUploading]  = useState(false)
  const [galleryError,      setGalleryError]      = useState<string | null>(null)
  const [galleryBlocked,    setGalleryBlocked]    = useState(false)
  const [dragIdx,           setDragIdx]           = useState<number | null>(null)
  const [dragOverIdx,       setDragOverIdx]       = useState<number | null>(null)

  // ── Local state for text fields ───────────────────────────────────────────
  const [name,        setName]        = useState(point.name)
  const [lookiarUrl,  setLookiarUrl]  = useState(point.lookiarUrl ?? '')
  const [description, setDescription] = useState(point.description ?? '')
  const [buttonText,  setButtonText]  = useState(point.buttonText ?? '')

  // ── Content type + destination category state ────────────────────────────
  const [contentType,         setContentType]         = useState<ContentType>(point.contentType ?? 'url')
  const [destinationCategory, setDestinationCategory] = useState<DestinationCategory | undefined>(point.destinationCategory)
  // Uploaded file info (for video/audio/file types)
  const initialMedia = isMediaContentData(point.contentData)
    ? { url: point.contentData.file_url, fileName: point.contentData.file_name, mimeType: point.contentData.mime_type, size: 0 }
    : null
  const [mediaFile,     setMediaFile]     = useState<{ url: string; fileName: string; mimeType: string; size: number } | null>(initialMedia)
  const [uploadState,   setUploadState]   = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadError,   setUploadError]   = useState<string | null>(null)
  const [urlError,      setUrlError]      = useState<string | null>(null)
  const [nameError,        setNameError]        = useState<string | null>(null)
  const [descriptionError, setDescriptionError] = useState<string | null>(null)
  const [contentError,     setContentError]     = useState<string | null>(null)

  // ── Address state ─────────────────────────────────────────────────────────
  const [addressCustom,   setAddressCustom]   = useState(point.instructions ?? '')
  const [addressAuto,     setAddressAuto]     = useState<string | null>(null)
  const [addressFetching, setAddressFetching] = useState(false)
  const addressEditedRef = useRef(!!point.instructions)

  // ── Video state ───────────────────────────────────────────────────────────
  const [videoUrl,   setVideoUrl]   = useState(point.pointVideoUrl ?? '')
  const [videoError, setVideoError] = useState<string | null>(null)
  const geoTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    let cancelled = false

    if (!addressEditedRef.current) {
      setAddressCustom('')
      setAddressFetching(true)
    }

    geoTimerRef.current = setTimeout(() => {
      reverseGeocode(point.latitude, point.longitude)
        .then((addr) => {
          if (cancelled) return
          setAddressAuto(addr)
          if (!addressEditedRef.current) {
            setAddressCustom(addr)
            onChange({ instructions: addr || undefined })
          }
        })
        .catch(() => { if (!cancelled) setAddressAuto(null) })
        .finally(() => { if (!cancelled) setAddressFetching(false) })
    }, 800)

    return () => {
      cancelled = true
      if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    }
  }, [point.latitude, point.longitude])

  // When content type changes, reset media state and clear destination category
  // (destination category is only relevant for URL content).
  function handleContentTypeChange(ct: ContentType) {
    if (ct !== contentType) {
      if (mediaFile && isVercelBlobUrl(mediaFile.url)) {
        console.log('[MEDIA_CLEANUP_QUEUE]', mediaFile.url)
        onMediaOrphaned?.(mediaFile.url)
      }
      setMediaFile(null)
      setUploadState('idle')
      setUploadError(null)
      setContentError(null)
      setUrlError(null)
      if (ct !== 'url') {
        setDestinationCategory(undefined)
      }
    }
    setContentType(ct)
  }

  // ── Gallery handlers ──────────────────────────────────────────────────────

  async function handleGalleryFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (editorMode === 'demo') { setGalleryError('Crea tu cuenta gratuita para subir imágenes.'); return }
    if (galleryImages.length >= MAX_GALLERY) { setGalleryError(`Máximo ${MAX_GALLERY} imágenes por punto.`); return }
    setGalleryError(null)
    setGalleryUploading(true)
    try {
      const url   = await uploadImage(file)
      const newImg: PointImage = {
        id: crypto.randomUUID(), url,
        isCover: galleryImages.length === 0,
        position: galleryImages.length,
      }
      const next = [...galleryImages, newImg]
      setGalleryImages(next)
      onChange({ images: next, image: undefined })
    } catch (err) {
      setGalleryError(err instanceof Error ? err.message : 'Error al subir la imagen')
    } finally {
      setGalleryUploading(false)
    }
  }

  function handleGalleryRemove(id: string) {
    const img = galleryImages.find((i) => i.id === id)
    if (img && isVercelBlobUrl(img.url)) onMediaOrphaned?.(img.url)
    const filtered = galleryImages.filter((i) => i.id !== id)
    const wasCover = img?.isCover ?? false
    const reindexed = filtered.map((i, idx) => ({
      ...i, isCover: wasCover && idx === 0 ? true : i.isCover, position: idx,
    }))
    setGalleryImages(reindexed)
    onChange({ images: reindexed, image: undefined })
  }

  function handleSetCover(id: string) {
    const updated = galleryImages.map((i) => ({ ...i, isCover: i.id === id }))
    setGalleryImages(updated)
    onChange({ images: updated, image: undefined })
  }

  function handleGalleryReorder(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return
    const next = [...galleryImages]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(targetIdx, 0, moved)
    const reordered = next.map((img, i) => ({ ...img, position: i }))
    setGalleryImages(reordered)
    onChange({ images: reordered, image: undefined })
    setDragIdx(null); setDragOverIdx(null)
  }

  // Validate + normalize the URL field. Returns normalized string or null (invalid).
  function validateUrl(): string | null {
    if (contentType !== 'url') return ''
    const normalized = normalizeUrl(lookiarUrl)
    if (normalized !== lookiarUrl) setLookiarUrl(normalized)
    if (!normalized) {
      setUrlError('La URL del contenido es obligatoria.')
      return null
    }
    if (!isValidUrl(normalized)) {
      setUrlError('La URL no es válida.')
      return null
    }
    setUrlError(null)
    return normalized
  }

  // Push all local text state to the parent store in one shot.
  // Returns false and blocks persistence when required fields are missing or invalid.
  function flush(): boolean {
    let valid = true

    if (!name.trim()) {
      setNameError('El nombre del punto es obligatorio.')
      valid = false
    } else {
      setNameError(null)
    }

    if (!description.trim()) {
      setDescriptionError('La descripción es obligatoria.')
      valid = false
    } else {
      setDescriptionError(null)
    }

    const normalizedUrl = validateUrl()
    if (normalizedUrl === null) valid = false

    if (contentType !== 'url' && !mediaFile) {
      setContentError(
        contentType === 'video' ? 'El video del contenido es obligatorio.'
        : contentType === 'audio' ? 'El audio del contenido es obligatorio.'
        : 'El archivo descargable es obligatorio.'
      )
      valid = false
    } else if (contentType !== 'url') {
      setContentError(null)
    }

    if (!valid) return false

    const contentData =
      contentType === 'url'
        ? { url: normalizedUrl as string }
        : mediaFile
          ? { file_url: mediaFile.url, file_name: mediaFile.fileName, mime_type: mediaFile.mimeType }
          : { file_url: '', file_name: '', mime_type: '' }

    onChange({
      name,
      contentType,
      contentData,
      lookiarUrl:          contentType === 'url' ? normalizedUrl as string : undefined,
      destinationCategory: contentType === 'url' ? destinationCategory : undefined,
      description:         description    || undefined,
      instructions:        addressCustom  || undefined,
      buttonText:          buttonText     || undefined,
    })
    return true
  }

  function handleSaveClick()  { if (flush()) onSave()  }
  function handleCloseClick() { if (flush()) onClose() }

  // ── Media upload (Vercel Blob via uploadFile) ─────────────────────────────
  async function handleMediaFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (editorMode === 'demo') {
      setUploadError('Los archivos multimedia requieren una cuenta. Crea tu cuenta gratuita para usar esta función.')
      return
    }

    if (mediaFile && isVercelBlobUrl(mediaFile.url)) {
      console.log('[MEDIA_CLEANUP_QUEUE]', mediaFile.url)
      onMediaOrphaned?.(mediaFile.url)
    }
    setUploadError(null)
    setUploadState('uploading')
    try {
      const url = await uploadFile(file)
      setMediaFile({ url, fileName: file.name, mimeType: file.type, size: file.size })
      setUploadState('done')
      setContentError(null)
      // Commit immediately so a blur/save isn't required
      onChange({
        contentType,
        contentData: { file_url: url, file_name: file.name, mime_type: file.type },
      })
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir el archivo')
      setUploadState('error')
    }
  }

  function handleMediaRemove() {
    if (mediaFile && isVercelBlobUrl(mediaFile.url)) {
      console.log('[MEDIA_CLEANUP_QUEUE]', mediaFile.url)
      onMediaOrphaned?.(mediaFile.url)
    }
    setMediaFile(null)
    setUploadState('idle')
    setUploadError(null)
    onChange({ contentData: { file_url: '', file_name: '', mime_type: '' } })
  }

  const isSaving = uploadState === 'uploading'

  return (
    <div className="flex flex-col h-full">
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-100 truncate flex-1 mr-2">
            {name || 'Punto GPS'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Eliminar punto"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button onClick={handleCloseClick} className="text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <Input
            label="Nombre del punto *"
            placeholder="Ej: Entrada principal"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(null) }}
            onBlur={() => onChange({ name })}
          />
          {nameError && <p className="text-xs text-red-400">{nameError}</p>}
        </div>

        {/* ── Acceso ────────────────────────────────────────────────────── */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Acceso
          </span>

          {/* Zona de activación — Circular o Polígono personalizado */}
          {(() => {
            const mode = point.activationMode ?? 'radius'
            const hasPolygon = Boolean(point.activationPolygon)
            return (
              <div className="bg-gray-800/50 border border-brand-500/30 rounded-lg p-3 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Zona de activación</span>
                    <InfoTooltip text={RADIUS_TOOLTIP} />
                  </div>
                  <span className="text-xs text-brand-400 font-medium">Siempre activo</span>
                </div>

                {/* Mode selector */}
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    { value: 'radius',  label: 'Circular' },
                    { value: 'polygon', label: 'Polígono' },
                  ] as { value: 'radius' | 'polygon'; label: string }[]).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (value === mode) return
                        if (value === 'radius') {
                          onChange({ activationMode: 'radius' })
                        } else {
                          onChange({ activationMode: 'polygon' })
                        }
                      }}
                      className={[
                        'py-1.5 rounded-md border text-xs font-medium transition-all',
                        mode === value
                          ? 'border-brand-500 bg-brand-500/15 text-brand-300'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Radius controls */}
                {mode === 'radius' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={5} max={1000} step={5}
                      value={point.activationRadius}
                      onChange={(e) => onChange({ activationRadius: parseInt(e.target.value) })}
                      className="flex-1 accent-brand-500"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        value={point.activationRadius}
                        onChange={(e) => onChange({ activationRadius: parseInt(e.target.value) || 10 })}
                        className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm
                                   text-gray-100 text-center focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <span className="text-xs text-gray-500">m</span>
                    </div>
                  </div>
                )}

                {/* Polygon controls */}
                {mode === 'polygon' && (
                  <div className="space-y-2">
                    {/* Status indicator */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${hasPolygon ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                      <span className={`text-xs ${hasPolygon ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {hasPolygon ? 'Polígono creado' : 'Sin polígono dibujado'}
                      </span>
                    </div>

                    {/* Drawing in progress */}
                    {polygonDrawMode === 'drawing' && (
                      <div className="space-y-2">
                        <p className="text-xs text-brand-300 animate-pulse leading-relaxed">
                          Dibujando… haz clic en el mapa para agregar vértices. Cierra el polígono haciendo clic en el primer punto o presionando Enter.
                        </p>
                        <button
                          type="button"
                          onClick={onCancelPolygonDraw}
                          className="w-full py-2 rounded-lg border border-gray-700 bg-gray-800
                                     text-xs font-medium text-gray-400 hover:border-gray-600
                                     hover:text-gray-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {/* Editing in progress */}
                    {polygonDrawMode === 'editing' && (
                      <div className="space-y-1.5">
                        <p className="text-xs text-amber-300">
                          Modo edición activo. Arrastra los vértices para modificar el polígono.
                        </p>
                        <button
                          type="button"
                          onClick={onStopPolygonEdit}
                          className="w-full py-2 rounded-lg border border-emerald-600 bg-emerald-600/15
                                     text-xs font-medium text-emerald-400 hover:bg-emerald-600/25
                                     transition-colors"
                        >
                          Finalizar edición
                        </button>
                        <button
                          type="button"
                          onClick={onCancelPolygonEdit}
                          className="w-full py-2 rounded-lg border border-gray-700 bg-gray-800
                                     text-xs font-medium text-gray-400 hover:border-gray-600
                                     hover:text-gray-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}

                    {/* Action buttons (idle mode only) */}
                    {polygonDrawMode === 'idle' && (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={onRequestPolygonDraw}
                          className="w-full py-2 rounded-lg border border-brand-600 bg-brand-600/15
                                     text-xs font-medium text-brand-400 hover:bg-brand-600/25
                                     transition-colors"
                        >
                          {hasPolygon ? 'Redibujar polígono' : 'Dibujar polígono'}
                        </button>
                        {hasPolygon && (
                          <>
                            <button
                              type="button"
                              onClick={onRequestPolygonEdit}
                              className="w-full py-2 rounded-lg border border-gray-700 bg-gray-800
                                         text-xs font-medium text-gray-300 hover:border-gray-600
                                         transition-colors"
                            >
                              Editar polígono
                            </button>
                            <button
                              type="button"
                              onClick={() => onChange({ activationPolygon: undefined })}
                              className="w-full py-2 rounded-lg border border-red-900/60 bg-red-900/10
                                         text-xs font-medium text-red-400 hover:bg-red-900/20
                                         transition-colors"
                            >
                              Eliminar polígono
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })()}

        </div>

        {/* Coordenadas — dentro de sección colapsable */}
        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500
                       hover:text-gray-300 uppercase tracking-wide transition-colors w-full text-left"
          >
            <svg
              className={`h-3 w-3 transition-transform ${advancedOpen ? 'rotate-90' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Configuración avanzada
          </button>
          {advancedOpen && (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Input
                label="Latitud*"
                type="number"
                step="0.000001"
                placeholder="-33.4489"
                value={point.latitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) onChange({ latitude: val })
                }}
              />
              <Input
                label="Longitud*"
                type="number"
                step="0.000001"
                placeholder="-70.6693"
                value={point.longitude}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  if (!isNaN(val)) onChange({ longitude: val })
                }}
              />
            </div>
          )}
        </div>

        {/* ── Tipo de contenido ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Tipo de contenido *
          </span>
          <div className="grid grid-cols-2 gap-2">
            {CONTENT_TYPES.map(({ type, label, icon }) => {
              const allowed = canUseContentType(type)
              return (
                <button
                  key={type}
                  type="button"
                  disabled={!allowed}
                  onClick={() => allowed && handleContentTypeChange(type)}
                  title={allowed ? undefined : 'Esta función no está disponible en tu plan actual.'}
                  className={[
                    'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    !allowed
                      ? 'border-gray-800 bg-gray-800/30 text-gray-600 cursor-not-allowed'
                      : contentType === type
                        ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                        : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:text-gray-300',
                  ].join(' ')}
                >
                  <span className="text-base leading-none">{allowed ? icon : '🔒'}</span>
                  <span className="truncate">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Contenido: URL ──────────────────────────────────────────────── */}
        {contentType === 'url' && (
          <>
            <div className="flex flex-col gap-1">
              <Input
                label="URL del contenido*"
                placeholder="Ej: https://tusitio.com"
                value={lookiarUrl}
                onChange={(e) => { setLookiarUrl(e.target.value); setUrlError(null) }}
                onBlur={() => {
                  const normalized = validateUrl()
                  if (normalized !== null) {
                    onChange({ lookiarUrl: normalized, contentData: { url: normalized } })
                  }
                }}
                hint={urlError ? undefined : 'Agrega cualquier enlace: experiencias, promociones o contenido digital.'}
              />
              {urlError && <p className="text-xs text-red-400">{urlError}</p>}
            </div>

            {/* ── Categoría del destino ──────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Categoría del destino
              </label>
              <select
                value={destinationCategory ?? ''}
                onChange={(e) => {
                  const val = e.target.value as DestinationCategory | ''
                  const next = val === '' ? undefined : val
                  setDestinationCategory(next)
                  onChange({ destinationCategory: next })
                }}
                className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2
                           text-sm text-gray-200 focus:border-brand-500 focus:outline-none
                           focus:ring-1 focus:ring-brand-500 transition-colors"
              >
                <option value="">Sin categoría</option>
                {DESTINATION_CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Opcional. Clasifica el destino para analytics.
              </p>
            </div>
          </>
        )}

        {/* ── Contenido: Video / Audio / Archivo ─────────────────────────── */}
        {(contentType === 'video' || contentType === 'audio' || contentType === 'file') && (() => {
          const cfg = FILE_CONFIG[contentType]
          return (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {contentType === 'video' ? 'Video del contenido*'
                  : contentType === 'audio' ? 'Audio del contenido*'
                  : 'Archivo descargable*'}
              </span>

              {/* Idle / Error: click to upload */}
              {(uploadState === 'idle' || uploadState === 'error') && !mediaFile && (
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center
                             hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => mediaFileRef.current?.click()}
                >
                  <p className="text-xs text-gray-400">{cfg.hint}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{cfg.maxLabel}</p>
                  {uploadError && (
                    <p className="text-xs text-red-400 mt-2">{uploadError}</p>
                  )}
                </div>
              )}

              {/* Uploading */}
              {uploadState === 'uploading' && (
                <div className="border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3">
                  <svg className="h-4 w-4 text-brand-400 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-xs text-gray-400">Subiendo archivo…</span>
                </div>
              )}

              {/* Done: show file info */}
              {mediaFile && uploadState !== 'uploading' && (
                <div className="border border-gray-700 rounded-lg px-3 py-2.5 flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5">
                    {contentType === 'video' ? '🎬' : contentType === 'audio' ? '🎵' : '📄'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">{mediaFile.fileName}</p>
                    {mediaFile.size > 0 && (
                      <p className="text-xs text-gray-500">{formatFileSize(mediaFile.size)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => mediaFileRef.current?.click()}
                      className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      Reemplazar
                    </button>
                    <button
                      type="button"
                      onClick={handleMediaRemove}
                      className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={mediaFileRef}
                type="file"
                accept={cfg.accept}
                className="hidden"
                onChange={handleMediaFileSelect}
              />
              {contentError && <p className="text-xs text-red-400">{contentError}</p>}
            </div>
          )
        })()}

        {/* ── Disponibilidad ─────────────────────────────────────────────── */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Disponibilidad
          </span>

          {/* Permanencia — always visible; locked when plan excludes the feature */}
          <div
            className={`bg-gray-800/50 border rounded-lg p-3 space-y-3 ${
              canUseDwellTime && (point.requiresDwellTime ?? false) ? 'border-brand-500/30' : 'border-gray-800'
            } ${!canUseDwellTime ? 'cursor-pointer' : ''}`}
            onClick={!canUseDwellTime ? () => setUpgradeOpen(true) : undefined}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`text-sm ${canUseDwellTime ? 'text-gray-300' : 'text-gray-600'}`}>
                  Permanencia
                </span>
                <InfoTooltip text="El usuario debe permanecer dentro del área durante un tiempo mínimo para activar la experiencia." />
              </div>
              {canUseDwellTime
                ? (
                  <Toggle
                    enabled={point.requiresDwellTime ?? false}
                    onToggle={() => {
                      const next = !(point.requiresDwellTime ?? false)
                      onChange({
                        requiresDwellTime: next,
                        dwellTimeSeconds:  next ? (point.dwellTimeSeconds ?? 180) : 0,
                      })
                    }}
                  />
                )
                : <span className="text-xs text-gray-600" title="Esta función no está disponible en tu plan actual.">🔒 No disponible</span>
              }
            </div>
            {canUseDwellTime && (point.requiresDwellTime ?? false) && (
              <>
                <p className="text-xs text-gray-500">
                  El usuario deberá permanecer dentro del área para desbloquear el contenido.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    label="Minutos requeridos"
                    type="number"
                    min={1}
                    max={240}
                    value={Math.max(1, Math.round((point.dwellTimeSeconds ?? 180) / 60))}
                    onChange={(e) => {
                      const mins = Math.min(240, Math.max(1, parseInt(e.target.value, 10) || 1))
                      onChange({ dwellTimeSeconds: mins * 60 })
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* ── Colección ── */}
          {(() => {
            const [collectionEnabled, setCollectionEnabled] = useState(
              () => (point.requiredPointIds?.length ?? 0) > 0,
            )
            useEffect(() => {
              setCollectionEnabled((point.requiredPointIds?.length ?? 0) > 0)
            }, [point.id])
            return (
              <div className={`bg-gray-800/50 border rounded-lg p-3 space-y-3 ${
                collectionEnabled ? 'border-brand-500/30' : 'border-gray-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-300">
                      Colección
                    </span>
                    <InfoTooltip text="Selecciona las ubicaciones que deben visitarse antes de desbloquear este contenido." />
                  </div>
                  <Toggle
                    enabled={collectionEnabled}
                    onToggle={() => {
                      const next = !collectionEnabled
                      setCollectionEnabled(next)
                      if (!next) onChange({ requiredPointIds: [] })
                    }}
                  />
                </div>
                {collectionEnabled && (
                  <>
                    <p className="text-xs text-gray-500">
                      Selecciona las ubicaciones que deben visitarse antes de desbloquear este contenido.
                    </p>
                    {otherPoints.length === 0 ? (
                      <p className="text-xs text-gray-600 italic">No hay otros puntos en este proyecto.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {otherPoints.map((p) => {
                          const selected = (point.requiredPointIds ?? []).includes(p.id)
                          return (
                            <label key={p.id} className="flex items-center gap-2.5 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => {
                                  const current = point.requiredPointIds ?? []
                                  const next    = selected
                                    ? current.filter((id) => id !== p.id)
                                    : [...current, p.id]
                                  onChange({ requiredPointIds: next })
                                }}
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700
                                           accent-brand-500 cursor-pointer flex-shrink-0"
                              />
                              <span className="text-sm text-gray-400 group-hover:text-gray-200
                                               transition-colors truncate">
                                {p.name}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })()}

          <AvailabilityRules
            showHeader={false}
            availability={point.availability}
            onChange={(updates) => onChange({ availability: { ...point.availability, ...updates } })}
            canUseSchedule={canUseScheduleAvailability}
            canUseQuota={canUseQuotaAvailability}
            canUseLiveVisits={canUseLiveVisits}
            onUpgradeClick={() => setUpgradeOpen(true)}
          />

        </div>


        {/* ── Logo del punto GPS ────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Logo del punto
          </span>
          <LogoField
            value={point.pointLogoUrl}
            zoom={point.pointLogoZoom ?? 1}
            posX={point.pointLogoPositionX ?? 0}
            posY={point.pointLogoPositionY ?? 0}
            label="Logo del punto"
            description="Este logo se mostrará junto al contenido y la información de esta ubicación."
            onUpload={(url) => onChange({ pointLogoUrl: url })}
            onRemove={() => onChange({ pointLogoUrl: undefined, pointLogoZoom: undefined, pointLogoPositionX: undefined, pointLogoPositionY: undefined })}
            onZoomChange={(z) => onChange({ pointLogoZoom: z })}
            onPositionChange={(x, y) => onChange({ pointLogoPositionX: x, pointLogoPositionY: y })}
            blocked={editorMode === 'demo'}
          />
        </div>

        {/* ── Galería del punto ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Galería del punto
          </span>

          {/* Upload drop-zone — only shown when below the 5-image limit */}
          {galleryImages.length < MAX_GALLERY && (
            <div
              className="border-2 border-dashed border-gray-700 rounded-lg p-3 text-center
                         hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => {
                if (editorMode === 'demo') { setGalleryBlocked(true); return }
                galleryFileRef.current?.click()
              }}
            >
              {galleryBlocked ? (
                <p className="text-xs text-red-400">Crea tu cuenta gratuita para subir imágenes.</p>
              ) : (
                <>
                  <p className="text-xs text-gray-400">
                    {galleryImages.length === 0 ? 'Agregar imagen de portada' : 'Agregar imagen'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    JPG · PNG · WebP · Máx 4 MB
                    {galleryImages.length > 0 && ` · ${MAX_GALLERY - galleryImages.length} libre${MAX_GALLERY - galleryImages.length !== 1 ? 's' : ''}`}
                  </p>
                </>
              )}
              {galleryError && <p className="text-xs text-red-400 mt-2">{galleryError}</p>}
            </div>
          )}

          {/* Thumbnail row */}
          {(galleryImages.length > 0 || galleryUploading) && (
            <div className="flex gap-2 flex-wrap">
              {galleryImages.map((img, idx) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx) }}
                  onDrop={() => handleGalleryReorder(idx)}
                  onDragEnd={() => { setDragIdx(null); setDragOverIdx(null) }}
                  className={[
                    'relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0',
                    'border transition-all duration-150 cursor-grab active:cursor-grabbing',
                    dragOverIdx === idx && dragIdx !== idx
                      ? 'border-brand-500 ring-2 ring-brand-500/50 scale-105'
                      : img.isCover
                        ? 'border-yellow-400/70'
                        : 'border-gray-700',
                    dragIdx === idx ? 'opacity-40' : '',
                  ].join(' ')}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Cover star */}
                  <button
                    type="button"
                    onClick={() => handleSetCover(img.id)}
                    title={img.isCover ? 'Portada actual' : 'Establecer como portada'}
                    className={[
                      'absolute bottom-1 left-1 w-5 h-5 rounded-full flex items-center justify-center',
                      'text-[9px] shadow transition-all duration-150',
                      img.isCover
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-black/55 text-white/70 hover:bg-yellow-400 hover:text-gray-900',
                    ].join(' ')}
                  >
                    ⭐
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => handleGalleryRemove(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center
                               bg-black/55 text-white text-[9px] hover:bg-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Upload-in-progress placeholder */}
              {galleryUploading && (
                <div className="w-[72px] h-[72px] rounded-xl border border-gray-700 bg-gray-800
                                flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {galleryImages.length > 1 && (
            <p className="text-[11px] text-gray-600">
              Arrastra para reordenar · ⭐ indica la portada
            </p>
          )}

          <input
            ref={galleryFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleGalleryFileSelect}
          />
        </div>

        {/* Descripción */}
        <div>
          <Textarea
            label="Descripción *"
            placeholder="Qué verá el usuario en esta experiencia"
            value={description}
            onChange={(e) => { setDescription(e.target.value); setDescriptionError(null) }}
            onBlur={() => onChange({ description: description || undefined })}
            maxLength={300}
          />
          <div className="flex items-center justify-between mt-1">
            {descriptionError
              ? <p className="text-xs text-red-400">{descriptionError}</p>
              : <span />}
            <p className={[
              'text-xs tabular-nums',
              description.length >= 270 ? 'text-yellow-500' : 'text-gray-600',
            ].join(' ')}>
              {description.length} / 300
            </p>
          </div>
        </div>

        {/* ── Video de presentación ─────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Video de presentación
          </span>
          <p className="text-xs text-gray-500 leading-snug">
            Video opcional para complementar esta experiencia.
          </p>

          <div className="flex gap-2 items-center">
            <input
              type="url"
              placeholder="https://youtu.be/... o URL de video .mp4"
              value={videoUrl}
              onChange={(e) => {
                const val = e.target.value
                setVideoUrl(val)
                setVideoError(null)
                if (!val.trim()) onChange({ pointVideoUrl: undefined, pointVideoType: undefined })
              }}
              onBlur={() => {
                const trimmed = videoUrl.trim()
                if (!trimmed) { onChange({ pointVideoUrl: undefined, pointVideoType: undefined }); return }
                const type = detectVideoType(trimmed)
                if (!type) { setVideoError('URL no válida. Usá YouTube o un archivo .mp4'); return }
                setVideoError(null)
                onChange({ pointVideoUrl: trimmed, pointVideoType: type })
              }}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                         text-sm text-gray-100 placeholder-gray-500
                         focus:outline-none focus:border-brand-500 transition-colors"
            />
            {videoUrl && (
              <button
                type="button"
                onClick={() => {
                  setVideoUrl('')
                  setVideoError(null)
                  onChange({ pointVideoUrl: undefined, pointVideoType: undefined })
                }}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label="Eliminar video"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {videoError && <p className="text-xs text-red-400">{videoError}</p>}

          {/* YouTube preview */}
          {(() => {
            const type = detectVideoType(videoUrl.trim())
            const ytId = type === 'youtube' ? extractYouTubeId(videoUrl.trim()) : null
            if (type === 'youtube' && ytId) return (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <img
                  src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )
            if (type === 'mp4') return (
              <div className="rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 flex items-center gap-3">
                <svg className="w-8 h-8 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-400 truncate">{videoUrl.trim()}</span>
              </div>
            )
            return null
          })()}
        </div>

        {/* Dirección (auto-geocodificada) */}
        <Input
          label="Dirección del punto"
          placeholder={
            addressFetching && !addressEditedRef.current
              ? 'Obteniendo dirección…'
              : (addressAuto ?? 'Ej: Entrada principal')
          }
          value={addressCustom}
          onChange={(e) => {
            const val = e.target.value
            addressEditedRef.current = val.length > 0
            setAddressCustom(val)
          }}
          onBlur={() => onChange({ instructions: addressCustom || undefined })}
          hint={
            !addressFetching && addressAuto && addressCustom && addressCustom !== addressAuto
              ? `Auto: ${addressAuto}`
              : undefined
          }
        />

        <Input
          label="Texto del botón"
          placeholder="Ej: Acceder al contenido"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          onBlur={() => onChange({ buttonText: buttonText || undefined })}
          hint='Si se deja vacío, se usa "Acceder al contenido"'
        />

      </div>

      <div className="px-4 pb-4">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleSaveClick}
          disabled={isSaving}
        >
          {isSaving ? 'Subiendo archivo…' : 'Guardar'}
        </Button>
      </div>

      {upgradeOpen && (
        <UpgradeModal reason="feature" onClose={() => setUpgradeOpen(false)} />
      )}
    </div>
  )
}
