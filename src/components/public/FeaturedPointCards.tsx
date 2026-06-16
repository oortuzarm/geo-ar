import type { GeoPoint, PointCategory } from '../../types'
import { getPointCoverImage } from '../../lib/pointImageUtils'

const CATEGORY_LABELS: Record<PointCategory, string> = {
  gastronomy:    'Gastronomía',
  retail:        'Comercio',
  health:        'Salud',
  tourism:       'Turismo',
  culture:       'Cultura',
  education:     'Educación',
  services:      'Servicios',
  events:        'Eventos',
  entertainment: 'Entretenimiento',
  transport:     'Transporte',
  accommodation: 'Alojamiento',
  sport:         'Deporte',
  real_estate:   'Inmuebles',
  corporate:     'Corporativo',
  other:         'Otro',
}

function fmtDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}

interface Props {
  points:          GeoPoint[]
  distances:       Record<string, number>
  selectedPointId: string | null
  onCardClick:     (point: GeoPoint) => void
}

export default function FeaturedPointCards({
  points,
  distances,
  selectedPointId,
  onCardClick,
}: Props) {
  if (points.length === 0) return null

  return (
    <div
      className="flex gap-2.5 overflow-x-auto px-4 pb-1"
      style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
    >
      {points.map((point) => {
        const thumb    = getPointCoverImage(point)
        const dist     = distances[point.id]
        const isSelected = selectedPointId === point.id
        const catLabel = point.pointCategory ? CATEGORY_LABELS[point.pointCategory] : null

        return (
          <button
            key={point.id}
            onClick={() => onCardClick(point)}
            className={[
              'relative flex-shrink-0 flex items-center gap-2.5',
              'bg-white rounded-2xl pl-2.5 pr-3.5 py-2.5',
              'shadow-[0_2px_12px_rgba(0,0,0,0.15)]',
              'border transition-all duration-150 active:scale-95',
              isSelected
                ? 'border-brand-400 ring-2 ring-brand-300/50'
                : 'border-white/60 hover:border-gray-200',
            ].join(' ')}
          >
            {/* Featured star */}
            <svg
              className="absolute top-1.5 left-1.5 w-3 h-3 text-amber-400 drop-shadow-sm pointer-events-none"
              viewBox="0 0 24 24" fill="currentColor"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>

            {/* Thumbnail */}
            {thumb ? (
              <img
                src={thumb}
                alt={point.name}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}

            {/* Text content */}
            <div className="flex flex-col min-w-0 max-w-[110px]">
              <span className="text-[13px] font-semibold text-gray-800 truncate leading-snug">
                {point.name || 'Sin nombre'}
              </span>
              {catLabel && (
                <span className="text-[11px] text-gray-400 truncate leading-tight">
                  {catLabel}
                </span>
              )}
              {dist != null && (
                <span className="text-[11px] text-gray-400 leading-none mt-0.5">
                  {fmtDistance(dist)}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
