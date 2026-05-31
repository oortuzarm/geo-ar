import { createPortal } from 'react-dom'

interface ZoneTypeModalProps {
  open: boolean
  onSelect: (type: 'radius' | 'polygon') => void
  onCancel: () => void
}

function CircleIcon() {
  return (
    <svg className="w-9 h-9 text-brand-400" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="8.5" />
      <line x1="12" y1="3.5" x2="12" y2="20.5" strokeWidth={1} strokeDasharray="2 2" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" strokeWidth={1} strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" strokeWidth={0} />
    </svg>
  )
}

function PolygonIcon() {
  return (
    <svg className="w-9 h-9 text-brand-400" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
      <polygon points="12,3 21,9 17,20 7,20 3,9" />
      {/* vertex dots */}
      <circle cx="12" cy="3"  r="1.5" fill="currentColor" strokeWidth={0} />
      <circle cx="21" cy="9"  r="1.5" fill="currentColor" strokeWidth={0} />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" strokeWidth={0} />
      <circle cx="7"  cy="20" r="1.5" fill="currentColor" strokeWidth={0} />
      <circle cx="3"  cy="9"  r="1.5" fill="currentColor" strokeWidth={0} />
    </svg>
  )
}

export default function ZoneTypeModal({ open, onSelect, onCancel }: ZoneTypeModalProps) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      {/* Card */}
      <div
        className="relative w-full max-w-sm bg-gray-900 border border-gray-700/80
                   rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-4">
          <h3 className="text-sm font-semibold text-gray-100 leading-snug">
            ¿Qué tipo de zona querés crear?
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Podés cambiarlo después desde el formulario del punto.
          </p>
        </div>

        {/* Options */}
        <div className="px-5 pb-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onSelect('radius')}
            className="flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl
                       border border-gray-700 bg-gray-800/70
                       hover:border-brand-500/60 hover:bg-brand-500/10
                       active:scale-[0.97] transition-all duration-150 text-center"
          >
            <CircleIcon />
            <span className="text-xs font-semibold text-gray-200 leading-snug">
              Radio circular
            </span>
            <span className="text-[11px] text-gray-500 leading-snug">
              Área circular con radio editable.
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelect('polygon')}
            className="flex flex-col items-center gap-2.5 px-3 py-4 rounded-xl
                       border border-gray-700 bg-gray-800/70
                       hover:border-brand-500/60 hover:bg-brand-500/10
                       active:scale-[0.97] transition-all duration-150 text-center"
          >
            <PolygonIcon />
            <span className="text-xs font-semibold text-gray-200 leading-snug">
              Polígono
            </span>
            <span className="text-[11px] text-gray-500 leading-snug">
              Dibujá una zona personalizada.
            </span>
          </button>
        </div>

        {/* Cancel */}
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl border border-gray-700/80
                       text-xs font-medium text-gray-400
                       hover:text-gray-200 hover:border-gray-600
                       active:scale-[0.98] transition-all duration-150"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
