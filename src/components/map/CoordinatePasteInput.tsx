import { useState } from 'react'
import { parseCoordinatesInput } from '../../features/geolocation/parseCoordinatesInput'
import type { ParsedCoordinates } from '../../features/geolocation/parseCoordinatesInput'

const SOURCE_LABEL: Record<string, string> = {
  plain: 'coordenadas',
  google_maps_pin: 'pin de Google Maps',
  google_maps_viewport: 'centro del mapa',
}

interface Props {
  onConfirm: (lat: number, lng: number) => void | Promise<void>
  confirmLabel?: string
}

export default function CoordinatePasteInput({ onConfirm, confirmLabel = 'Fijar ubicación' }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [value, setValue] = useState('')
  const [parsed, setParsed] = useState<ParsedCoordinates | null>(null)
  const [hasError, setHasError] = useState(false)
  const [confirming, setConfirming] = useState(false)

  function handleChange(v: string) {
    setValue(v)
    if (!v.trim()) {
      setParsed(null)
      setHasError(false)
      return
    }
    const result = parseCoordinatesInput(v)
    setParsed(result)
    setHasError(result === null && v.trim().length > 5)
  }

  function handleClose() {
    setExpanded(false)
    setValue('')
    setParsed(null)
    setHasError(false)
  }

  async function handleConfirm() {
    if (!parsed || confirming) return
    setConfirming(true)
    try {
      await onConfirm(parsed.lat, parsed.lng)
      handleClose()
    } finally {
      setConfirming(false)
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors
                   flex items-center gap-1.5 w-full py-0.5"
      >
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Pegar coordenadas o link de Google Maps
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">Coordenadas o link de Google Maps</span>
        <button onClick={handleClose} className="text-gray-600 hover:text-gray-400 transition-colors">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); e.stopPropagation() }}
        placeholder="-33.3972, -70.5973 o link de Google Maps"
        autoFocus
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-2.5 py-2
                   text-xs text-gray-200 placeholder-gray-600
                   focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent"
      />

      {parsed && (
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <svg className="h-3 w-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd" />
          </svg>
          {parsed.lat.toFixed(6)}, {parsed.lng.toFixed(6)}
          <span className="text-gray-500 ml-1">· {SOURCE_LABEL[parsed.source]}</span>
        </p>
      )}

      {hasError && !parsed && (
        <p className="text-xs text-red-400">
          No pudimos leer las coordenadas. Intenta con: -33.39, -70.59 o link de Google Maps.
        </p>
      )}

      <button
        onClick={handleConfirm}
        disabled={!parsed || confirming}
        className="w-full py-1.5 rounded-md text-xs font-semibold transition-colors
                   bg-brand-600 hover:bg-brand-500 text-white
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {confirming ? 'Fijando…' : confirmLabel}
      </button>
    </div>
  )
}
