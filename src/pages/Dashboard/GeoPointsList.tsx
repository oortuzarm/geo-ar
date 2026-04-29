import type { GeoPoint } from '../../types'

interface GeoPointsListProps {
  points: GeoPoint[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onToggleActive: (id: string) => void
}

export default function GeoPointsList({
  points,
  selectedId,
  onSelect,
  onAdd,
  onToggleActive,
}: GeoPointsListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-100">
          Puntos GPS
          <span className="ml-2 text-xs font-normal text-gray-500">({points.length})</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {points.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">
              Haz clic en el mapa para agregar el primer punto.
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {points.map((point) => (
              <li key={point.id}>
                <div
                  className={[
                    'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                    selectedId === point.id
                      ? 'bg-brand-900/40 border-l-2 border-brand-500'
                      : 'hover:bg-gray-800/60 border-l-2 border-transparent',
                  ].join(' ')}
                  onClick={() => onSelect(point.id)}
                >
                  {/* Colored dot */}
                  <div
                    className={[
                      'w-2.5 h-2.5 rounded-full flex-shrink-0',
                      point.active ? 'bg-red-500' : 'bg-gray-600',
                    ].join(' ')}
                  />

                  <div className="flex-1 min-w-0">
                    <p className={[
                      'text-sm truncate',
                      point.active ? 'text-gray-200' : 'text-gray-500',
                    ].join(' ')}>
                      {point.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {point.activationRadius} m
                      {point.lookiarUrl && ' · ' + point.lookiarUrl.replace('https://', '').split('/').slice(0, 2).join('/')}
                    </p>
                  </div>

                  {/* Active toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleActive(point.id) }}
                    className={[
                      'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors',
                      point.active ? 'bg-brand-600' : 'bg-gray-700',
                    ].join(' ')}
                    title={point.active ? 'Desactivar' : 'Activar'}
                  >
                    <span
                      className={[
                        'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                        point.active ? 'translate-x-4' : 'translate-x-1',
                      ].join(' ')}
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md
                     border border-dashed border-gray-700 text-sm text-gray-400
                     hover:border-brand-600 hover:text-brand-400 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar proyecto al mapa
        </button>
      </div>
    </div>
  )
}
