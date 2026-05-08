import { useEffect, useRef, useState } from 'react'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { GeoPoint, GeoPointAvailability } from '../../types'
import { reverseGeocode } from '../../features/geolocation/geocoding'

interface GeoPointFormProps {
  point: GeoPoint
  onChange: (updates: Partial<GeoPoint>) => void
  onDelete: () => void
  onClose: () => void
  onSave: () => void
  hideHeader?: boolean
}

const RADIUS_TOOLTIP =
  'El radio de activación define la distancia máxima desde el punto geolocalizado dentro de la cual esta experiencia puede activarse. Si el usuario está fuera de este radio, la experiencia no se mostrará.'

const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

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

function AvailabilityRules({
  availability,
  onChange,
}: {
  availability: GeoPointAvailability | undefined
  onChange: (updates: Partial<GeoPointAvailability>) => void
}) {
  const scheduleEnabled = availability?.scheduleEnabled ?? false
  const scheduleDays    = availability?.scheduleDays ?? []
  const startTime       = availability?.scheduleStartTime ?? ''
  const endTime         = availability?.scheduleEndTime ?? ''
  const quotaEnabled    = availability?.quotaEnabled ?? false
  const quotaLimit      = availability?.quotaLimit ?? 1

  function toggleDay(day: string) {
    const next = scheduleDays.includes(day)
      ? scheduleDays.filter((d) => d !== day)
      : [...scheduleDays, day]
    onChange({ scheduleDays: next })
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        Reglas de disponibilidad
      </span>

      {/* ── Schedule rule ── */}
      <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Disponible por horario</span>
          <Toggle
            enabled={scheduleEnabled}
            onToggle={() => onChange({ scheduleEnabled: !scheduleEnabled })}
          />
        </div>

        {scheduleEnabled && (
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
      <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Disponible por cupos</span>
          <Toggle
            enabled={quotaEnabled}
            onToggle={() => onChange({ quotaEnabled: !quotaEnabled })}
          />
        </div>

        {quotaEnabled && (
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
    </div>
  )
}

export default function GeoPointForm({ point, onChange, onDelete, onClose, onSave, hideHeader = false }: GeoPointFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  // ── Local state for text fields ───────────────────────────────────────────
  // Decoupled from the parent store so every keystroke doesn't trigger a
  // full re-render of DashboardPage + Leaflet map. Parent is notified on
  // blur (lightweight) and on explicit save/close (flush all).
  // The component is mounted with key={selectedPointId} in the parent, so
  // useState initializers run fresh whenever a different point is selected.
  const [name,        setName]        = useState(point.name)
  const [lookiarUrl,  setLookiarUrl]  = useState(point.lookiarUrl ?? '')
  const [description, setDescription] = useState(point.description ?? '')
  const [buttonText,  setButtonText]  = useState(point.buttonText ?? '')

  // ── Address: auto-geocoded + optional manual override ────────────────────
  // addressCustom:  what's in the input (persisted via point.instructions)
  // addressAuto:    live reverse-geocoded string (never persisted directly)
  // addressFetching: true while a geocoding request is in flight
  // addressEditedRef: true when user has manually typed; suppresses auto-fill
  const [addressCustom,   setAddressCustom]   = useState(point.instructions ?? '')
  const [addressAuto,     setAddressAuto]     = useState<string | null>(null)
  const [addressFetching, setAddressFetching] = useState(false)
  const addressEditedRef = useRef(!!point.instructions)
  const geoTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    let cancelled = false

    // Immediately clear stale address so the loading placeholder shows right away.
    // Skip when the user has manually edited — never touch their custom text.
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
            // Commit immediately so navigating back (without blur) still shows the address
            onChange({ instructions: addr || undefined })
          }
        })
        .catch(() => {
          if (!cancelled) setAddressAuto(null)
        })
        .finally(() => {
          if (!cancelled) setAddressFetching(false)
        })
    }, 800)

    return () => {
      cancelled = true
      if (geoTimerRef.current) clearTimeout(geoTimerRef.current)
    }
  }, [point.latitude, point.longitude])

  // Push all local text state to the parent store in one shot.
  // Called before closing or saving to ensure nothing is lost.
  function flush() {
    onChange({
      name,
      lookiarUrl,
      description:  description    || undefined,
      instructions: addressCustom  || undefined,
      buttonText:   buttonText     || undefined,
    })
  }

  function handleSaveClick()  { flush(); onSave()  }
  function handleCloseClick() { flush(); onClose() }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setImageError(null)
    if (file.size > 256 * 1024) {
      setImageError('La imagen supera los 256 KB. Comprimila antes de subirla.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange({ image: reader.result as string })
    reader.readAsDataURL(file)
  }

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

        {/* Text fields — local state, committed to parent on blur */}
        <Input
          label="Nombre del punto*"
          placeholder="Ej: Entrada principal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onChange({ name })}
        />

        <Input
          label="URL del contenido*"
          placeholder="Ej: https://tusitio.com"
          value={lookiarUrl}
          onChange={(e) => setLookiarUrl(e.target.value)}
          onBlur={() => onChange({ lookiarUrl })}
          hint="Agrega cualquier enlace: experiencias, promociones o contenido digital."
        />

        {/* ── Availability rules ─────────────────────────────────────────── */}
        <AvailabilityRules
          availability={point.availability}
          onChange={(updates) => onChange({ availability: { ...point.availability, ...updates } })}
        />

        {/* Coordinates — inside collapsible section; drag the marker to reposition */}
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

        {/* Activation radius — committed immediately for live circle update */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Radio de activación
            </span>
            <button
              className="text-gray-500 hover:text-gray-300 relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showTooltip && (
                <div className="absolute left-6 top-0 z-50 w-64 bg-gray-800 border border-gray-700
                               text-xs text-gray-300 p-3 rounded-lg shadow-xl pointer-events-none">
                  {RADIUS_TOOLTIP}
                </div>
              )}
            </button>
          </div>
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
        </div>

        {/* Point image */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Imagen de portada</span>
          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-3 text-center
                       hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {point.image ? (
              <div className="relative">
                <img src={point.image} alt="Point" className="w-full h-24 object-cover rounded" />
                <button
                  className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 text-xs"
                  onClick={(e) => { e.stopPropagation(); setImageError(null); onChange({ image: undefined }) }}
                >✕</button>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500">Click para subir imagen</p>
                <p className="text-xs text-gray-600">.JPG .PNG · Máx 256 KB</p>
              </>
            )}
          </div>
          {imageError && (
            <p className="text-xs text-red-400">{imageError}</p>
          )}
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageUpload} />
        </div>

        {/* Text areas — local state, committed on blur */}
        <div>
          <Textarea
            label="Descripción"
            placeholder="Qué verá el usuario en esta experiencia"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => onChange({ description: description || undefined })}
            maxLength={300}
          />
          <p className={[
            'text-xs text-right mt-1 tabular-nums',
            description.length >= 270 ? 'text-yellow-500' : 'text-gray-600',
          ].join(' ')}>
            {description.length} / 300
          </p>
        </div>

        {/* Address: auto-filled from reverse geocoding, editable manually.
            Placeholder switches to "Obteniendo dirección…" while fetching so
            the user never sees a stale address during an in-progress geocode. */}
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
          placeholder="Ej: Ir a experiencia"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          onBlur={() => onChange({ buttonText: buttonText || undefined })}
          hint='Si se deja vacío, se usa "Ir a experiencia"'
        />

      </div>

      <div className="px-4 pb-4">
        <Button variant="primary" size="sm" className="w-full" onClick={handleSaveClick}>
          Guardar
        </Button>
      </div>
    </div>
  )
}
