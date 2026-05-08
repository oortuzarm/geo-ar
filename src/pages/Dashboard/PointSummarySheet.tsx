import type { GeoPoint } from '../../types'

interface Props {
  point: GeoPoint
  onClose: () => void
  onEdit: () => void
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
}

function domain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url.replace('https://', '').split('/')[0] }
}

export default function PointSummarySheet({ point, onClose, onEdit, onToggleActive, onDelete }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gray-900 rounded-t-2xl border-t border-gray-800 animate-sheet-up"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(point.id) }}
          className="absolute top-2 right-12 flex items-center justify-center w-9 h-9
                     text-red-500/60 hover:text-red-400 transition-colors rounded-full"
          aria-label="Eliminar punto"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 flex items-center justify-center w-9 h-9
                     text-gray-500 hover:text-gray-200 transition-colors rounded-full"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-4 pt-2 pb-5">
          <div className="flex gap-4 items-center">
            {/* Thumbnail */}
            {point.image ? (
              <img
                src={point.image}
                alt={point.name}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-700/60"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700/60
                              flex items-center justify-center flex-shrink-0">
                <svg className="h-7 w-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-100 truncate leading-snug">
                {point.name || <span className="text-gray-500 italic font-normal text-sm">Sin nombre</span>}
              </p>

              {point.instructions && (
                <p className="text-xs text-gray-500 truncate mt-0.5 leading-snug">
                  {point.instructions}
                </p>
              )}

              {point.lookiarUrl ? (
                <p className="text-xs text-brand-400 truncate mt-0.5 font-medium">
                  {domain(point.lookiarUrl)}
                </p>
              ) : (
                <p className="text-xs text-gray-600 mt-0.5">Sin URL</p>
              )}

              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleActive(point.id) }}
                  className={[
                    'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors',
                    point.active ? 'bg-brand-600' : 'bg-gray-700',
                  ].join(' ')}
                  title={point.active ? 'Desactivar' : 'Activar'}
                >
                  <span className={[
                    'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                    point.active ? 'translate-x-4' : 'translate-x-1',
                  ].join(' ')} />
                </button>
                <span className={[
                  'text-xs font-medium',
                  point.active ? 'text-green-400' : 'text-gray-500',
                ].join(' ')}>
                  {point.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onEdit}
            className="mt-5 w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                       text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
          >
            Editar punto
          </button>
        </div>
      </div>
    </>
  )
}
