import type { GeoPoint } from '../../types'

interface Props {
  point: GeoPoint
  onClose: () => void
  onEdit: () => void
  onToggleActive: (id: string) => void
}

function domain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url.replace('https://', '').split('/')[0] }
}

export default function PointSummarySheet({ point, onClose, onEdit, onToggleActive }: Props) {
  return (
    <>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 bg-gray-900 rounded-t-2xl border-t border-gray-800">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-200 transition-colors p-1"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-4 pb-6 pt-1">
          <div className="flex gap-3 items-center">
            {/* Thumbnail */}
            {point.image ? (
              <img
                src={point.image}
                alt={point.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-700
                              flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-100 truncate leading-tight">
                {point.name || <span className="text-gray-500 italic font-normal">Sin nombre</span>}
              </p>
              {point.lookiarUrl && (
                <p className="text-xs text-gray-400 truncate mt-0.5">{domain(point.lookiarUrl)}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">{point.activationRadius} m</span>
                <span className="text-gray-700 select-none">·</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleActive(point.id) }}
                  className={[
                    'relative inline-flex h-4 w-8 flex-shrink-0 items-center rounded-full transition-colors',
                    point.active ? 'bg-brand-600' : 'bg-gray-700',
                  ].join(' ')}
                  title={point.active ? 'Desactivar' : 'Activar'}
                >
                  <span className={[
                    'inline-block h-3 w-3 rounded-full bg-white shadow transition-transform',
                    point.active ? 'translate-x-4' : 'translate-x-1',
                  ].join(' ')} />
                </button>
                <span className="text-xs text-gray-500">{point.active ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="mt-4 w-full bg-brand-600 hover:bg-brand-500 text-white font-medium
                       py-3 rounded-xl text-sm transition-colors"
          >
            Editar punto
          </button>
        </div>
      </div>
    </>
  )
}
