import { useRef, useState } from 'react'
import { Input, Textarea } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { GeoPoint } from '../../types'

interface GeoPointFormProps {
  point: GeoPoint
  onChange: (updates: Partial<GeoPoint>) => void
  onDelete: () => void
  onClose: () => void
  onSave: () => void
}

const RADIUS_TOOLTIP =
  'El radio de activación define la distancia máxima desde el punto geolocalizado dentro de la cual esta experiencia puede activarse. Si el usuario está fuera de este radio, la experiencia no se mostrará.'

export default function GeoPointForm({ point, onChange, onDelete, onClose, onSave }: GeoPointFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange({ image: reader.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-100 truncate flex-1 mr-2">
          {point.name || 'Punto GPS'}
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Input
          label="Nombre del punto*"
          placeholder="Ej: Entrada principal"
          value={point.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />

        <Input
          label="URL de Lookiar*"
          placeholder="https://www.lookiar.com/models/..."
          value={point.lookiarUrl}
          onChange={(e) => onChange({ lookiarUrl: e.target.value })}
          hint="Acepta /models/, /scene/ y cualquier URL válida de Lookiar"
        />

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Activation radius */}
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
                  onClick={(e) => { e.stopPropagation(); onChange({ image: undefined }) }}
                >✕</button>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500">Click para subir imagen</p>
                <p className="text-xs text-gray-600">.JPG .PNG · Máx 256 KB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageUpload} />
        </div>

        <Textarea
          label="Descripción"
          placeholder="Qué verá el usuario en esta experiencia"
          value={point.description ?? ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />

        <Textarea
          label="Cómo llegar"
          placeholder="Instrucciones para el usuario sobre cómo llegar al punto"
          value={point.instructions ?? ''}
          onChange={(e) => onChange({ instructions: e.target.value || undefined })}
        />

        {/* Active toggle */}
        <div className="flex items-center justify-between py-2 border-t border-gray-800">
          <span className="text-sm text-gray-300">Punto activo</span>
          <button
            onClick={() => onChange({ active: !point.active })}
            className={[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              point.active ? 'bg-brand-600' : 'bg-gray-700',
            ].join(' ')}
          >
            <span
              className={[
                'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                point.active ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <Button variant="primary" size="sm" className="w-full" onClick={onSave}>
          Guardar
        </Button>
      </div>
    </div>
  )
}
