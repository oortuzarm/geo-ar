import { formatDistance } from '../../features/geolocation/haversine'
import type { GeoPoint, GeoPointAvailability } from '../../types'

const WEEK_DAYS_INDEX = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function checkSchedule(av: GeoPointAvailability): boolean {
  if (!av.scheduleEnabled) return true
  const now   = new Date()
  const today = WEEK_DAYS_INDEX[now.getDay()]
  const days  = av.scheduleDays ?? []
  if (days.length > 0 && !days.includes(today)) return false
  if (av.scheduleStartTime && av.scheduleEndTime) {
    const cur = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    return cur >= av.scheduleStartTime && cur <= av.scheduleEndTime
  }
  return true
}

type StatusVariant = 'ok' | 'block' | 'neutral'

function deriveStatus(point: GeoPoint, distance: number | null): { label: string; variant: StatusVariant } {
  if (distance === null) return { label: 'Activá tu ubicación', variant: 'neutral' }

  const withinRadius = distance <= point.activationRadius
  if (!withinRadius) {
    const edge = Math.max(0, distance - point.activationRadius)
    return { label: `A ${formatDistance(edge)} del área`, variant: 'block' }
  }

  const av = point.availability
  if (av) {
    if (!checkSchedule(av)) return { label: 'Fuera de horario', variant: 'block' }
    if (av.quotaEnabled && av.quotaLimit !== undefined) {
      const remaining = av.quotaLimit - (av.quotaUsed ?? 0)
      if (remaining <= 0) return { label: 'Sin cupos', variant: 'block' }
    }
  }

  return { label: 'Disponible', variant: 'ok' }
}

const BADGE: Record<StatusVariant, string> = {
  ok:      'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  block:   'bg-red-500/15 border-red-500/30 text-red-400',
  neutral: 'bg-gray-500/15 border-gray-500/25 text-gray-400',
}

interface PublicPointPreviewCardProps {
  point:        GeoPoint
  distance:     number | null
  onViewDetail: () => void
  onClose:      () => void
}

export default function PublicPointPreviewCard({
  point, distance, onViewDetail, onClose,
}: PublicPointPreviewCardProps) {
  const { label, variant } = deriveStatus(point, distance)

  return (
    <div className="geo-preview-enter rounded-2xl overflow-hidden
                    bg-gray-900/97 backdrop-blur-xl
                    border border-white/[0.09]
                    shadow-[0_8px_32px_rgba(0,0,0,0.65)]">

      <div className="flex gap-3 p-3">
        {point.image && (
          <img
            src={point.image}
            alt={point.name}
            className="w-[68px] h-[68px] rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* Name + close button */}
          <div className="flex items-start gap-2">
            <p className="flex-1 text-sm font-semibold text-gray-100 leading-snug line-clamp-1">
              {point.name}
            </p>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700/80 border border-gray-600/30
                         flex items-center justify-center text-gray-400 hover:text-gray-200
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
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-snug">
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
