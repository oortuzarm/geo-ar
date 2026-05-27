import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { formatDistance } from '../../features/geolocation/haversine'
import { formatDuration } from '../../features/routing/orsClient'
import { computePointAvailability, formatDays } from '../../features/geolocation/availability'
import type { PointAvailability } from '../../features/geolocation/availability'
import type { GeoPoint } from '../../types'
import Modal from '../../components/ui/Modal'
import { getPointCoverImage } from '../../lib/pointImageUtils'

const DESCRIPTION_LIMIT = 140

// ─── Icons ────────────────────────────────────────────────────────────────────

function PinIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.507 17 13.207 17 10a7 7 0 10-14 0c0 3.207 1.698 5.507 3.354 7.115a14.92 14.92 0 002.757 2.198 10.4 10.4 0 00.523.282l.018.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth={1.75}>
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" d="M10 6.5V10l2 2" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  )
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20" fill="currentColor"
    >
      <path fillRule="evenodd" clipRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      />
    </svg>
  )
}

// ─── Badge system types ───────────────────────────────────────────────────────

/** Operational badge rendered on each card (max 1 at a time). */
type OpBadge = 'available' | 'last-slots' | 'every-day' | 'tomorrow' | null

// ─── Status chip ──────────────────────────────────────────────────────────────

type ChipVariant = 'ok' | 'warn' | 'block' | 'neutral'

const CHIP_STYLES: Record<ChipVariant, { wrap: string; text: string; divider: string }> = {
  ok:      { wrap: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', divider: 'border-emerald-200' },
  warn:    { wrap: 'bg-amber-50 border-amber-200',     text: 'text-amber-700',   divider: 'border-amber-200'   },
  block:   { wrap: 'bg-red-50 border-red-200',         text: 'text-red-700',     divider: 'border-red-200'     },
  neutral: { wrap: 'bg-gray-100 border-gray-200',      text: 'text-gray-600',    divider: 'border-gray-200'    },
}

function StatusChip({
  icon, label, variant, expandLabel, detail,
}: {
  icon: ReactNode
  label: string
  variant: ChipVariant
  expandLabel?: string
  detail?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const s = CHIP_STYLES[variant]

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${s.wrap}`}>
      <div className="flex items-center gap-2">
        <span className={s.text}>{icon}</span>
        <span className={`text-xs font-medium flex-1 leading-none ${s.text}`}>{label}</span>
        {detail != null && (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
            className={`flex items-center gap-0.5 text-[11px] opacity-75 hover:opacity-100
                        transition-opacity ${s.text}`}
          >
            <span>{expandLabel ?? 'Ver'}</span>
            <ChevronDownIcon open={open} />
          </button>
        )}
      </div>

      {open && detail != null && (
        <div className={`mt-2 pt-2 border-t text-[11px] leading-relaxed space-y-0.5 ${s.divider} ${s.text} opacity-80`}>
          {detail}
        </div>
      )}
    </div>
  )
}

// ─── Detail sub-components ────────────────────────────────────────────────────

function ScheduleDetail({ avail }: { avail: PointAvailability }) {
  return (
    <>
      {avail.scheduleDays.length > 0 && <p>{formatDays(avail.scheduleDays)}</p>}
      {avail.scheduleStartTime && avail.scheduleEndTime
        ? <p>{avail.scheduleStartTime} – {avail.scheduleEndTime}</p>
        : avail.scheduleDays.length === 0 && <p>Sin restricción de horario</p>
      }
    </>
  )
}

function QuotaDetail({ avail }: { avail: PointAvailability }) {
  if (avail.quotaTotal === undefined) return null
  const used = avail.quotaTotal - (avail.quotaRemaining ?? 0)
  return <p>{avail.quotaRemaining} de {avail.quotaTotal} disponibles · {used} usados</p>
}

// ─── Public types ─────────────────────────────────────────────────────────────

export type RouteStatus = 'idle' | 'loading' | 'ok' | 'error' | 'no-location'

export interface DwellProgress {
  state: 'idle' | 'running' | 'completed'
  elapsed: number  // seconds
  total: number    // seconds
  showResetMessage?: boolean
}

function formatDwellTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

interface PublicPointCardProps {
  point: GeoPoint
  distance: number | null
  isSelected: boolean
  onSelect: () => void
  onActivate: () => void
  onExit?: () => void
  routeStatus?: RouteStatus
  walkingDistanceMeters?: number
  walkingDurationSeconds?: number
  isActivating?: boolean
  accessMessage?: string
  accessFallbackUrl?: string
  /** Auto-resolved address from reverse geocoding; falls back to point.instructions for legacy data */
  address?: string
  /** When true, suppresses the cover image banner (caller renders a carousel above). */
  hideImage?: boolean
  /** ISO string (point.createdAt) used for the "✨ Nuevo" editorial badge.
   *  Shown when the point was created within the last 7 days. Omit to suppress the badge. */
  pointCreatedAt?: string
  /** When true, renders in detail-sheet layout: flat container, larger type,
   *  badges centred at top, more spacious chips and CTA. */
  isDetail?: boolean
  dwellProgress?: DwellProgress
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicPointCard({
  point, distance, isSelected, onSelect, onActivate, onExit,
  routeStatus, walkingDistanceMeters, walkingDurationSeconds,
  isActivating, accessMessage, accessFallbackUrl, address,
  hideImage = false, pointCreatedAt, isDetail = false,
  dwellProgress,
}: PublicPointCardProps) {
  const [descExpanded, setDescExpanded] = useState(false)
  const [showRouteWarning, setShowRouteWarning] = useState(false)
  const isLongDesc = (point.description?.length ?? 0) > DESCRIPTION_LIMIT

  // Single availability computation — all chips, button state, and messages
  // derive exclusively from this object. Never re-check schedules below.
  const avail = computePointAvailability(point, distance)

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}&travelmode=walking`

  // True when schedule or quota would block access even if the user were inside the radius.
  // Location/radius is intentionally excluded — it is never a reason to show this warning.
  const contentUnavailableOnArrival =
    (avail.scheduleActive && !avail.scheduleAvailable) ||
    (avail.quotaActive && !avail.quotaAvailable)

  const isAvailableNow = !contentUnavailableOnArrival
  const hasCoverBanner = !hideImage && Boolean(getPointCoverImage(point))

  // ── Badge computation ───────────────────────────────────────────────────────
  // Editorial: point/project published within the last 7 days.
  const isNew = Boolean(
    pointCreatedAt &&
    Date.now() - new Date(pointCreatedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  )
  // Operational (max 1, evaluated in priority order):
  //   1. available  — schedule + quota pass right now
  //   2. last-slots — quota still open but ≤ 10 remaining
  //   3. every-day  — schedule enabled and available all 7 days
  //   4. tomorrow   — schedule blocks today; tomorrow's day passes
  const opBadge: OpBadge = (() => {
    if (isAvailableNow) return 'available'
    if (avail.quotaActive && avail.quotaAvailable &&
        avail.quotaRemaining !== undefined && avail.quotaRemaining <= 10)
      return 'last-slots'
    const av = point.availability
    if (av?.scheduleEnabled && (!avail.quotaActive || avail.quotaAvailable)) {
      const days = av.scheduleDays ?? []
      if (days.length === 0 || days.length === 7) return 'every-day'
      const d    = new Date(); d.setDate(d.getDate() + 1)
      const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const
      const dayOk = days.includes(DAYS[d.getDay()])
      if (dayOk) return 'tomorrow'
    }
    return null
  })()

  function openMaps() {
    window.open(mapsUrl, '_blank', 'noopener,noreferrer')
  }

  function handleNavigate(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (contentUnavailableOnArrival) {
      setShowRouteWarning(true)
    } else {
      openMaps()
    }
  }

  // ── Dwell helpers ─────────────────────────────────────────────────────────
  const dwellRequired  = point.requiresDwellTime ?? false
  const dwellState     = dwellProgress?.state ?? 'idle'
  const dwellCompleted = dwellState === 'completed'
  // CTA is gated by dwell when required and not yet completed
  const dwellBlocking  = dwellRequired && !dwellCompleted

  if (dwellRequired) {
    console.log('[PublicPointCard] point:', point.id,
      '| requiresDwellTime:', point.requiresDwellTime,
      '| dwellTimeSeconds:', point.dwellTimeSeconds,
      '| dwellState:', dwellState,
      '| dwellBlocking:', dwellBlocking,
      '| avail.canAccess:', avail.canAccess,
      '| insideRadius:', avail.insideRadius,
      '| dwellProgress:', dwellProgress)
  }

  // ── Location chip derivation ──────────────────────────────────────────────
  let locationLabel: string
  let locationVariant: ChipVariant
  let locationDetail: ReactNode = null

  if (distance === null) {
    locationLabel   = 'Activá tu ubicación'
    locationVariant = 'neutral'
  } else if (avail.insideRadius) {
    locationLabel   = 'Dentro del área'
    locationVariant = 'ok'
  } else {
    locationLabel   = dwellRequired
      ? 'Acercate al lugar para comenzar'
      : avail.distanceToEdge !== null && avail.distanceToEdge > 0
        ? `A ${formatDistance(avail.distanceToEdge)} del área`
        : 'Fuera del área'
    locationVariant = 'block'

    if (routeStatus === 'ok' && walkingDistanceMeters !== undefined) {
      const walkToEdge = Math.max(0, walkingDistanceMeters - point.activationRadius)
      locationDetail = (
        <>
          <p>{formatDistance(walkToEdge)} caminando
            {walkingDurationSeconds !== undefined && ` · ${formatDuration(walkingDurationSeconds)}`}
          </p>
        </>
      )
    }
  }

  return (
    <>
    <div
      className={isDetail ? '' : [
        'rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer',
        isSelected && avail.insideRadius
          ? 'border-brand-500/40 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] ring-1 ring-brand-500/15'
          : isSelected
          ? 'border-brand-500/30 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]'
          : 'border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)] hover:border-gray-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.11),0_2px_6px_rgba(0,0,0,0.06)]',
      ].join(' ')}
      onClick={isDetail ? undefined : onSelect}
    >
      {/* DETAIL MODE: badges centred above the image */}
      {isDetail && (isNew || opBadge) && (
        <div className="flex justify-center items-center flex-wrap gap-2 pb-4">
          {isNew && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                             bg-black/[0.5] backdrop-blur-md border border-amber-300/[0.3]
                             shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
              <span className="text-[9px] leading-none">✨</span>
              <span className="text-[11px] font-medium text-amber-200 leading-none">Nuevo</span>
            </span>
          )}
          {opBadge === 'available' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-black/[0.65] backdrop-blur-md border border-white/[0.28]
                             shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-[12px] font-semibold text-white leading-none">Disponible</span>
            </span>
          )}
          {opBadge === 'last-slots' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-black/[0.65] backdrop-blur-md border border-white/[0.28]
                             shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] leading-none">🔥</span>
              <span className="text-[12px] font-semibold text-white leading-none">Últimos cupos</span>
            </span>
          )}
          {opBadge === 'every-day' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-black/[0.65] backdrop-blur-md border border-white/[0.28]
                             shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] leading-none">🗓️</span>
              <span className="text-[12px] font-semibold text-white leading-none">Todos los días</span>
            </span>
          )}
          {opBadge === 'tomorrow' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-black/[0.65] backdrop-blur-md border border-white/[0.28]
                             shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] leading-none">🕒</span>
              <span className="text-[12px] font-semibold text-white leading-none">Disponible mañana</span>
            </span>
          )}
        </div>
      )}
      {/* Cover image — hidden when caller renders a full carousel above the card */}
      {!hideImage && getPointCoverImage(point) && (
        <div className={`relative overflow-hidden ${isDetail ? 'h-52 rounded-2xl mb-5' : 'h-32'}`}>
          <img
            src={getPointCoverImage(point)}
            alt={point.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Inset ring — prevents white/pale images from bleeding into the white card surface */}
          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.07)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/2
                          bg-gradient-to-t from-gray-950/70 to-transparent
                          pointer-events-none" />
          {/* List mode only — detail mode shows badges above the image */}
          {!isDetail && (isNew || opBadge) && (
            <div className="absolute bottom-3.5 left-3 flex items-center gap-2">
              {/* Editorial — warm/subtle, secondary to the operational badge */}
              {isNew && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                                 bg-black/[0.4] backdrop-blur-md border border-amber-300/[0.22]
                                 shadow-[0_1px_6px_rgba(0,0,0,0.25)]">
                  <span className="text-[9px] leading-none">✨</span>
                  <span className="text-[11px] font-medium text-amber-200 leading-none">Nuevo</span>
                </span>
              )}
              {/* Operational — more opaque, larger, higher contrast */}
              {opBadge === 'available' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-black/[0.55] backdrop-blur-md border border-white/[0.22]
                                 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-[12px] font-semibold text-white leading-none">Disponible</span>
                </span>
              )}
              {opBadge === 'last-slots' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-black/[0.55] backdrop-blur-md border border-white/[0.22]
                                 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  <span className="text-[10px] leading-none">🔥</span>
                  <span className="text-[12px] font-semibold text-white leading-none">Últimos cupos</span>
                </span>
              )}
              {opBadge === 'every-day' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-black/[0.55] backdrop-blur-md border border-white/[0.22]
                                 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  <span className="text-[10px] leading-none">🗓️</span>
                  <span className="text-[12px] font-semibold text-white leading-none">Todos los días</span>
                </span>
              )}
              {opBadge === 'tomorrow' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-black/[0.55] backdrop-blur-md border border-white/[0.22]
                                 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  <span className="text-[10px] leading-none">🕒</span>
                  <span className="text-[12px] font-semibold text-white leading-none">Disponible mañana</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className={isDetail ? '' : 'p-3.5'}>
        {/* Name + exit button */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-bold leading-snug ${isDetail ? 'text-xl text-gray-900' : 'text-sm text-gray-800'}`}
          >{point.name}</h3>
          {isSelected && onExit && (
            <button
              onClick={(e) => { e.stopPropagation(); onExit() }}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center
                         rounded-full bg-gray-100 hover:bg-gray-200
                         border border-gray-200 text-gray-500 hover:text-gray-700
                         active:scale-90 transition-all duration-150"
              aria-label="Cerrar"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M6 6l8 8M14 6l-8 8" />
              </svg>
            </button>
          )}
        </div>

        {/* Badge system — below title when no cover image occupies the banner slot (list mode only) */}
        {!isDetail && !hasCoverBanner && (isNew || opBadge) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Editorial — warm/subtle */}
            {isNew && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
                               bg-black/[0.2] border border-amber-300/[0.18]">
                <span className="text-[9px] leading-none">✨</span>
                <span className="text-[11px] font-medium text-amber-200 leading-none">Nuevo</span>
              </span>
            )}
            {/* Operational — more prominent */}
            {opBadge === 'available' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-black/[0.3] border border-white/[0.15]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-[12px] font-semibold text-white leading-none">Disponible</span>
              </span>
            )}
            {opBadge === 'last-slots' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-black/[0.3] border border-white/[0.15]">
                <span className="text-[10px] leading-none">🔥</span>
                <span className="text-[12px] font-semibold text-white leading-none">Últimos cupos</span>
              </span>
            )}
            {opBadge === 'every-day' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-black/[0.3] border border-white/[0.15]">
                <span className="text-[10px] leading-none">🗓️</span>
                <span className="text-[12px] font-semibold text-white leading-none">Todos los días</span>
              </span>
            )}
            {opBadge === 'tomorrow' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-black/[0.3] border border-white/[0.15]">
                <span className="text-[10px] leading-none">🕒</span>
                <span className="text-[12px] font-semibold text-white leading-none">Disponible mañana</span>
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {point.description && (
          <div className={isDetail ? 'mt-3' : 'mt-1'}>
            <p className={`leading-relaxed ${isDetail ? 'text-sm text-gray-700' : 'text-xs text-gray-600'}`}>
              {descExpanded || !isLongDesc
                ? point.description
                : point.description.slice(0, DESCRIPTION_LIMIT)}
              {isLongDesc && !descExpanded && (
                <>{' … '}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDescExpanded(true) }}
                    className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
                  >
                    Ver más
                  </button>
                </>
              )}
            </p>
            {isLongDesc && descExpanded && (
              <button
                onClick={(e) => { e.stopPropagation(); setDescExpanded(false) }}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium mt-1 transition-colors"
              >
                Ver menos
              </button>
            )}
          </div>
        )}

        {/* Address — auto-resolved via reverse geocoding; falls back to legacy instructions */}
        {(address ?? point.instructions) && (
          <div className={`flex items-start gap-1.5 ${isDetail ? 'mt-3' : 'mt-2'}`}>
            <svg className={`flex-shrink-0 mt-0.5 ${isDetail ? 'h-4 w-4 text-gray-400' : 'h-3.5 w-3.5 text-gray-400'}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className={`line-clamp-2 ${isDetail ? 'text-sm text-gray-600' : 'text-xs text-gray-500'}`}>{address ?? point.instructions}</p>
          </div>
        )}

        {/* ── Selected: status chips + button ── */}
        {isSelected && (
          <div className={`space-y-1.5 ${isDetail ? 'mt-6 pt-5 border-t border-gray-200' : 'mt-3'}`}>

            {/* Location */}
            <StatusChip
              icon={<PinIcon />}
              label={locationLabel}
              variant={locationVariant}
              expandLabel={locationDetail != null ? 'Ver ruta' : undefined}
              detail={locationDetail}
            />

            {/* Schedule chip — only when a schedule is configured on this point */}
            {avail.scheduleActive && (
              <StatusChip
                icon={<ClockIcon />}
                label={avail.scheduleLabel}
                variant={avail.scheduleAvailable ? 'ok' : 'block'}
                expandLabel="Ver horarios"
                detail={<ScheduleDetail avail={avail} />}
              />
            )}

            {/* Quota chip — only when a quota is configured on this point */}
            {avail.quotaActive && (
              <StatusChip
                icon={<TagIcon />}
                label={avail.quotaLabel}
                variant={avail.quotaAvailable ? (avail.quotaRemaining === 1 ? 'warn' : 'ok') : 'block'}
                expandLabel="Ver detalle"
                detail={<QuotaDetail avail={avail} />}
              />
            )}

            {/* Dwell chip — only when this point requires permanence */}
            {dwellRequired && avail.insideRadius && dwellState === 'idle' && (
              <div className="rounded-xl border px-3 py-2.5 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-amber-700 text-sm">⏳</span>
                  <span className="text-xs font-medium flex-1 leading-none text-amber-700">
                    Permanencia requerida · {dwellProgress
                      ? formatDwellTime(dwellProgress.total)
                      : formatDwellTime(point.dwellTimeSeconds ?? 60)} en el área
                  </span>
                </div>
              </div>
            )}
            {dwellRequired && dwellState === 'running' && dwellProgress && (
              <div className="rounded-xl border px-3 py-2.5 bg-amber-50 border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-700 text-sm">⏳</span>
                  <span className="text-xs font-medium flex-1 leading-none text-amber-700">
                    Permanencia en progreso · {formatDwellTime(dwellProgress.elapsed)} / {formatDwellTime(dwellProgress.total)}
                  </span>
                </div>
                <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (dwellProgress.elapsed / dwellProgress.total) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {dwellRequired && dwellCompleted && (
              <StatusChip
                icon={<span className="text-sm">✅</span>}
                label="Acceso desbloqueado"
                variant="ok"
              />
            )}
            {dwellRequired && dwellProgress?.showResetMessage && (
              <p className="text-xs text-amber-600 text-center px-1 leading-snug">
                Saliste del área. El tiempo se reinició.
              </p>
            )}

            {/* CTA button — enabled iff avail.canAccess and dwell not blocking */}
            <div className={`space-y-2 ${isDetail ? 'pt-2' : 'pt-0.5'}`}>
              {!avail.insideRadius && (
                <button
                  onClick={handleNavigate}
                  className={[
                    'w-full flex items-center justify-center gap-2 rounded-xl text-sm font-semibold',
                    isDetail
                      ? 'py-3.5 px-4 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]'
                      : 'py-3 px-4 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.07)]',
                    'active:scale-[0.98] transition-all duration-150',
                  ].join(' ')}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Cómo llegar
                </button>
              )}
              {avail.canAccess && !dwellBlocking ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onActivate() }}
                  disabled={isActivating}
                  className={[
                    'w-full font-semibold py-3.5 px-4 rounded-xl text-sm transition-all duration-200',
                    isActivating
                      ? 'bg-brand-700 text-white/70 cursor-wait'
                      : 'bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white'
                        + ' shadow-lg shadow-brand-900/50'
                        + ' ring-1 ring-brand-400/30',
                  ].join(' ')}
                >
                  {isActivating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white
                                       rounded-full animate-spin" />
                      Verificando…
                    </span>
                  ) : (point.buttonText || 'Acceder al contenido')}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-400 font-semibold py-3.5 px-4
                             rounded-xl text-sm cursor-not-allowed border border-gray-200
                             shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                >
                  {point.buttonText || 'Acceder al contenido'}
                </button>
              )}

              {/* Inline feedback: server error message or popup-blocked fallback.
                  Shown only after the user attempts activation and the server
                  responds — never derived from local availability state.      */}
              {accessMessage && (
                accessFallbackUrl ? (
                  <a
                    href={accessFallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="block w-full text-center text-xs font-medium
                               text-brand-400 hover:text-brand-300 underline
                               underline-offset-2 transition-colors py-1"
                  >
                    {accessMessage}
                  </a>
                ) : (
                  <p className="text-xs text-red-400 text-center px-1 leading-snug">
                    {accessMessage}
                  </p>
                )
              )}
            </div>

          </div>
        )}
      </div>
    </div>

    {/* Portal ensures the modal escapes any backdrop-filter / overflow:hidden
        ancestor (e.g. PublicPointDetailSheet) that would clip a fixed overlay. */}
    {showRouteWarning && createPortal(
      <Modal
        open
        title="Contenido no disponible"
        description="Puedes dirigirte al lugar, pero actualmente no podrás acceder al contenido."
        confirmLabel="Ir de todas formas"
        cancelLabel="Cancelar"
        onConfirm={() => { setShowRouteWarning(false); openMaps() }}
        onCancel={() => setShowRouteWarning(false)}
      />,
      document.body,
    )}
    </>
  )
}
