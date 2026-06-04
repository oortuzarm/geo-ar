import { computePointAvailability } from '../../features/geolocation/availability'
import { formatDistance } from '../../features/geolocation/haversine'
import type { GeoPoint } from '../../types'
import { getPointCoverImage } from '../../lib/pointImageUtils'

// Badge variants mirror the three possible access states visible from a glance.
type StatusVariant = 'ok' | 'block' | 'neutral'

const BADGE: Record<StatusVariant, string> = {
  ok:      'bg-emerald-50 border-emerald-200 text-emerald-700',
  block:   'bg-red-50 border-red-200 text-red-700',
  neutral: 'bg-gray-100 border-gray-200 text-gray-600',
}

interface PublicPointPreviewCardProps {
  point:         GeoPoint
  distance:      number | null
  /** Raw user coordinates — required for polygon-mode area checks. */
  userLocation?: { latitude: number; longitude: number } | null
  onViewDetail:  () => void
  onClose:       () => void
}

export default function PublicPointPreviewCard({
  point, distance, userLocation, onViewDetail, onClose,
}: PublicPointPreviewCardProps) {
  // Derived from the same computePointAvailability used by PublicPointCard —
  // both components always agree on the access state.
  const avail = computePointAvailability(point, distance, userLocation)

  // Map the blocked reason to a compact badge label + colour.
  let label:   string
  let variant: StatusVariant

  switch (avail.blockedReason) {
    case null:
      label   = 'Disponible'
      variant = 'ok'
      break
    case 'no-location':
      label   = 'Activá tu ubicación'
      variant = 'neutral'
      break
    case 'radius':
      label   = avail.distanceToEdge !== null && avail.distanceToEdge > 0
        ? `A ${formatDistance(avail.distanceToEdge)} del área`
        : 'Fuera del área'
      variant = 'block'
      break
    case 'schedule':
      // avail.scheduleLabel already contains the human-readable "next open" message
      // (e.g. "Disponible desde las 10:00" / "Disponible mañana desde las 10:00")
      label   = avail.scheduleLabel
      variant = 'block'
      break
    case 'quota':
      label   = avail.quotaLabel
      variant = 'block'
      break
    case 'live-visits':
      label   = avail.liveVisitsLabel
      variant = 'block'
      break
  }

  return (
    <div className="geo-preview-enter rounded-2xl overflow-hidden
                    bg-white
                    border border-gray-300/70
                    shadow-[0_4px_24px_rgba(0,0,0,0.13),0_1px_4px_rgba(0,0,0,0.07)]">

      <div className="flex gap-3 p-3">
        {getPointCoverImage(point) && (
          <img
            src={getPointCoverImage(point)}
            alt={point.name}
            className="w-[68px] h-[68px] rounded-xl object-cover flex-shrink-0 ring-1 ring-black/[0.07]"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Name + close button */}
          <div className="flex items-start gap-2">
            <p className="flex-1 text-sm font-semibold text-gray-700 leading-snug line-clamp-1">
              {point.name}
            </p>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 border border-gray-200
                         flex items-center justify-center text-gray-500 hover:text-gray-700
                         active:scale-90 transition-all duration-150"
              aria-label="Cerrar preview"
            >
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M6 6l8 8M14 6l-8 8" />
              </svg>
            </button>
          </div>

          {point.description && (
            <p className="text-xs text-gray-700 mt-0.5 line-clamp-2 leading-snug">
              {point.description}
            </p>
          )}

          <span className={`mt-1.5 inline-flex px-2 py-0.5 rounded-full border
                            text-[11px] font-medium leading-none ${BADGE[variant]}`}>
            {label}
          </span>
        </div>
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={onViewDetail}
          className="w-full bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                     text-white font-semibold py-2.5 rounded-xl text-sm
                     transition-all duration-150 shadow-lg shadow-brand-900/40"
        >
          Ver detalle
        </button>
      </div>
    </div>
  )
}
