import { formatDistance } from '../../features/geolocation/haversine'
import type { GeoPoint } from '../../types'

interface PublicPointCardProps {
  point: GeoPoint
  distance: number | null
  isSelected: boolean
  onSelect: () => void
  onActivate: () => void
}

export default function PublicPointCard({
  point,
  distance,
  isSelected,
  onSelect,
  onActivate,
}: PublicPointCardProps) {
  const withinRadius = distance !== null && distance <= point.activationRadius
  const distanceText =
    distance === null
      ? 'Ubicación no disponible'
      : withinRadius
      ? `Dentro del radio (${formatDistance(distance)})`
      : `Fuera del radio · ${formatDistance(distance)} de distancia`

  return (
    <div
      className={[
        'rounded-xl border overflow-hidden transition-all cursor-pointer',
        isSelected
          ? 'border-brand-500 bg-gray-800/80'
          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700',
      ].join(' ')}
      onClick={onSelect}
    >
      {/* Image */}
      {point.image && (
        <div className="h-28 overflow-hidden">
          <img src={point.image} alt={point.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-100 text-sm">{point.name}</h3>
          {/* Distance badge */}
          <span
            className={[
              'flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full',
              distance === null
                ? 'bg-gray-800 text-gray-500'
                : withinRadius
                ? 'bg-green-900/60 text-green-300 border border-green-800'
                : 'bg-gray-800 text-gray-400',
            ].join(' ')}
          >
            {distance === null ? '—' : formatDistance(distance)}
          </span>
        </div>

        {point.description && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{point.description}</p>
        )}

        {point.instructions && (
          <div className="mt-2 flex items-start gap-1.5">
            <svg className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-gray-500 line-clamp-2">{point.instructions}</p>
          </div>
        )}

        <p className={[
          'text-xs mt-2',
          withinRadius ? 'text-green-400' : 'text-gray-500',
        ].join(' ')}>
          {distanceText}
        </p>

        {/* Activation button */}
        {isSelected && (
          <div className="mt-3">
            {withinRadius ? (
              <button
                onClick={(e) => { e.stopPropagation(); onActivate() }}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold
                           py-2.5 px-4 rounded-lg text-sm transition-colors"
              >
                Ir a experiencia AR
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full bg-gray-700 text-gray-500 font-semibold py-2.5 px-4 rounded-lg
                             text-sm cursor-not-allowed"
                >
                  Ir a experiencia AR
                </button>
                <p className="text-xs text-gray-500 text-center">
                  {distance === null
                    ? 'Activa la ubicación para acceder a esta experiencia.'
                    : 'Acércate al punto indicado para activar esta experiencia.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
