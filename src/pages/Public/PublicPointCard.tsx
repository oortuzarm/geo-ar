import { formatDistance } from '../../features/geolocation/haversine'
import { formatDuration } from '../../features/routing/orsClient'
import type { GeoPoint } from '../../types'

export type RouteStatus = 'idle' | 'loading' | 'ok' | 'error' | 'no-location'

interface PublicPointCardProps {
  point: GeoPoint
  distance: number | null          // Haversine fallback (used when ORS unavailable)
  isSelected: boolean
  onSelect: () => void
  onActivate: () => void
  onExit?: () => void
  routeStatus?: RouteStatus
  walkingDistanceMeters?: number   // ORS walking distance to center
  walkingDurationSeconds?: number
}

export default function PublicPointCard({
  point,
  distance,
  isSelected,
  onSelect,
  onActivate,
  onExit,
  routeStatus,
  walkingDistanceMeters,
  walkingDurationSeconds,
}: PublicPointCardProps) {
  // Use ORS distance when available; fall back to Haversine
  const effectiveDistance =
    routeStatus === 'ok' && walkingDistanceMeters !== undefined
      ? walkingDistanceMeters
      : distance

  const withinRadius =
    effectiveDistance !== null && effectiveDistance <= point.activationRadius

  // How far the user still needs to walk to reach the activation perimeter
  const distanceToActivation =
    effectiveDistance !== null
      ? Math.max(0, effectiveDistance - point.activationRadius)
      : null

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
        {/* Name row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-100 text-sm leading-snug">{point.name}</h3>
          {isSelected && onExit && (
            <button
              onClick={(e) => { e.stopPropagation(); onExit() }}
              className="flex-shrink-0 bg-red-600 hover:bg-red-500 active:scale-95
                         text-white text-xs font-semibold px-3 py-1.5 rounded-lg
                         transition-all duration-150"
            >
              Salir
            </button>
          )}
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

        {/* ── Distance to activation + button (selected card only) ── */}
        {isSelected && (
          <div className="mt-3 space-y-2">

            {/* Route status messages */}
            {routeStatus === 'loading' && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <span className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                Calculando ruta…
              </p>
            )}

            {routeStatus === 'ok' && !withinRadius && distanceToActivation !== null && (
              <p className="text-xs text-yellow-400 font-medium">
                🚶 Te faltan {formatDistance(distanceToActivation)} para activar la experiencia
                {walkingDurationSeconds !== undefined && (
                  <span className="text-gray-500 font-normal">
                    {' '}· {formatDuration(walkingDurationSeconds)}
                  </span>
                )}
              </p>
            )}

            {routeStatus === 'no-location' && (
              <p className="text-xs text-gray-500">
                Activa tu ubicación para ver cuánto te falta.
              </p>
            )}

            {/* Activation button */}
            {withinRadius ? (
              <button
                onClick={(e) => { e.stopPropagation(); onActivate() }}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold
                           py-2.5 px-4 rounded-lg text-sm transition-colors"
              >
                Ir a experiencia AR
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-700 text-gray-500 font-semibold py-2.5 px-4
                           rounded-lg text-sm cursor-not-allowed"
              >
                Ir a experiencia AR
              </button>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
