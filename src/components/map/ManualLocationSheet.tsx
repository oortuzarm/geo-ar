import { useState } from 'react'
import AddressSearch from './AddressSearch'

interface ManualLocationSheetProps {
  /** Called when a location is confirmed (address search or map pick result) */
  onConfirm: (lat: number, lng: number) => void
  /** Called when the user chooses to pick on the map */
  onPickOnMap: () => void
  /** Called when the sheet is closed/dismissed */
  onClose: () => void
}

type Mode = 'menu' | 'address'

export default function ManualLocationSheet({ onConfirm, onPickOnMap, onClose }: ManualLocationSheetProps) {
  const [mode, setMode] = useState<Mode>('menu')

  function handleAddressSelect(lat: number, lng: number) {
    onConfirm(lat, lng)
  }

  function handlePickOnMap() {
    onClose()
    onPickOnMap()
  }

  return (
    <div className="absolute inset-0 z-[2000] flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative bg-gray-950 border-t border-white/[0.07] rounded-t-[28px] px-5 pt-4 shadow-2xl"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-5">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {mode === 'menu' && (
          <>
            {/* Icon */}
            <div className="w-11 h-11 rounded-full bg-brand-900/30 border border-brand-800/30
                            flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-gray-100 text-center mb-1">
              Indica tu ubicación manualmente
            </h2>
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
              No pudimos obtener una ubicación precisa. Puedes escribir tu dirección o seleccionarla en el mapa.
            </p>

            <div className="space-y-3 mb-4">
              {/* Address search option */}
              <button
                onClick={() => setMode('address')}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                           bg-gray-900 border border-gray-800
                           hover:bg-gray-800 hover:border-gray-700
                           active:scale-[0.98] transition-all duration-150 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-900/40 border border-brand-800/30
                                flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-400" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100">Escribir dirección</p>
                  <p className="text-xs text-gray-500 mt-0.5">Busca por nombre de calle o lugar</p>
                </div>
                <svg className="ml-auto w-4 h-4 text-gray-600 flex-shrink-0" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Map pick option */}
              <button
                onClick={handlePickOnMap}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                           bg-gray-900 border border-gray-800
                           hover:bg-gray-800 hover:border-gray-700
                           active:scale-[0.98] transition-all duration-150 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-800/30
                                flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100">Seleccionar en el mapa</p>
                  <p className="text-xs text-gray-500 mt-0.5">Toca o haz clic sobre el mapa</p>
                </div>
                <svg className="ml-auto w-4 h-4 text-gray-600 flex-shrink-0" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-400 active:scale-[0.98]
                         font-medium py-2.5 rounded-xl text-sm transition-all duration-150"
            >
              Cancelar
            </button>
          </>
        )}

        {mode === 'address' && (
          <>
            {/* Back header */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setMode('menu')}
                className="w-8 h-8 flex items-center justify-center rounded-full
                           bg-gray-900 border border-gray-800
                           text-gray-400 hover:text-gray-200 hover:bg-gray-800
                           active:scale-90 transition-all duration-150 flex-shrink-0"
                aria-label="Volver"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h2 className="text-sm font-semibold text-gray-100">Buscar dirección</h2>
            </div>

            <div className="mb-4">
              <AddressSearch
                onSelect={handleAddressSelect}
              />
            </div>

            <p className="text-xs text-gray-600 text-center">
              Escribe al menos 4 caracteres para buscar
            </p>
          </>
        )}
      </div>
    </div>
  )
}
