import { useState } from 'react'
import type { ReactNode } from 'react'
import { formatDistance } from '../../features/geolocation/haversine'
import { formatDuration } from '../../features/routing/orsClient'
import type { GeoPoint, GeoPointAvailability } from '../../types'

// ─── Calendar constants ───────────────────────────────────────────────────────

const WEEK_DAYS_INDEX = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const DAY_ORDER       = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DAY_FULL: Record<string, string> = {
  Lun: 'Lunes', Mar: 'Martes', Mié: 'Miércoles',
  Jue: 'Jueves', Vie: 'Viernes', Sáb: 'Sábado', Dom: 'Domingo',
}

const DESCRIPTION_LIMIT = 140

// ─── Day formatting ───────────────────────────────────────────────────────────

function formatDays(days: string[]): string {
  if (!days.length || days.length === 7) return 'Todos los días'
  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
  const first = sorted[0]
  const last  = sorted[sorted.length - 1]
  if (DAY_ORDER.indexOf(last) - DAY_ORDER.indexOf(first) === days.length - 1)
    return days.length === 1
      ? (DAY_FULL[first] ?? first)
      : `${DAY_FULL[first] ?? first} a ${DAY_FULL[last] ?? last}`
  return sorted.map((d) => DAY_FULL[d] ?? d).join(', ')
}

// ─── Schedule state ───────────────────────────────────────────────────────────

interface ScheduleState {
  active: boolean
  available: boolean
  label: string
  days: string[]
  startTime?: string
  endTime?: string
}

function getScheduleState(av: GeoPointAvailability | undefined): ScheduleState {
  const NONE: ScheduleState = { active: false, available: true, label: '', days: [] }
  if (!av?.scheduleEnabled) return NONE

  const now   = new Date()
  const idx   = now.getDay()
  const today = WEEK_DAYS_INDEX[idx]
  const days  = av.scheduleDays ?? []
  const st    = av.scheduleStartTime
  const et    = av.scheduleEndTime
  const cur   = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const dayOk = days.length === 0 || days.includes(today)

  function nextAvailableLabel(prefix: string): string {
    for (let i = 1; i <= 7; i++) {
      const nl = WEEK_DAYS_INDEX[(idx + i) % 7]
      if (days.length === 0 || days.includes(nl)) {
        const when = i === 1 ? 'mañana' : `el ${DAY_FULL[nl] ?? nl}`
        return `${prefix} ${when}${st ? ` desde las ${st}` : ''}`
      }
    }
    return `Solo los ${formatDays(days)}`
  }

  if (!dayOk)
    return { active: true, available: false, label: nextAvailableLabel('Disponible'), days, startTime: st, endTime: et }

  if (st && et) {
    if (cur < st)
      return { active: true, available: false, label: `Disponible desde las ${st}`, days, startTime: st, endTime: et }
    if (cur > et)
      return { active: true, available: false, label: nextAvailableLabel('Disponible'), days, startTime: st, endTime: et }
    return { active: true, available: true, label: `Disponible hasta las ${et}`, days, startTime: st, endTime: et }
  }

  return { active: true, available: true, label: 'Disponible hoy', days, startTime: st, endTime: et }
}

// ─── Quota state ──────────────────────────────────────────────────────────────

interface QuotaState {
  active: boolean
  available: boolean
  label: string
  remaining?: number
  total?: number
}

function getQuotaState(av: GeoPointAvailability | undefined): QuotaState {
  if (!av?.quotaEnabled || av.quotaLimit === undefined)
    return { active: false, available: true, label: '' }
  const remaining = av.quotaLimit - (av.quotaUsed ?? 0)
  if (remaining <= 0)
    return { active: true, available: false, label: 'Sin cupos disponibles', remaining: 0, total: av.quotaLimit }
  return {
    active: true, available: true,
    label: remaining === 1 ? 'Queda 1 cupo' : `Quedan ${remaining} cupos`,
    remaining, total: av.quotaLimit,
  }
}

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

// ─── Status chip ──────────────────────────────────────────────────────────────

type ChipVariant = 'ok' | 'warn' | 'block' | 'neutral'

const CHIP_STYLES: Record<ChipVariant, { wrap: string; text: string; divider: string }> = {
  ok:      { wrap: 'bg-emerald-500/10 border-emerald-500/25', text: 'text-emerald-400', divider: 'border-emerald-500/20' },
  warn:    { wrap: 'bg-amber-500/10 border-amber-500/25',     text: 'text-amber-400',   divider: 'border-amber-500/20'   },
  block:   { wrap: 'bg-red-500/10 border-red-500/25',         text: 'text-red-400',     divider: 'border-red-500/20'     },
  neutral: { wrap: 'bg-gray-500/10 border-gray-500/20',       text: 'text-gray-500',    divider: 'border-gray-700'       },
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
            className={`flex items-center gap-0.5 text-[11px] opacity-60 hover:opacity-100
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

function ScheduleDetail({ schedule }: { schedule: ScheduleState }) {
  return (
    <>
      {schedule.days.length > 0 && <p>{formatDays(schedule.days)}</p>}
      {schedule.startTime && schedule.endTime
        ? <p>{schedule.startTime} – {schedule.endTime}</p>
        : schedule.days.length === 0 && <p>Sin restricción de horario</p>
      }
    </>
  )
}

function QuotaDetail({ quota }: { quota: QuotaState }) {
  if (quota.total === undefined) return null
  const used = quota.total - (quota.remaining ?? 0)
  return <p>{quota.remaining} de {quota.total} disponibles · {used} usados</p>
}

// ─── Public types ─────────────────────────────────────────────────────────────

export type RouteStatus = 'idle' | 'loading' | 'ok' | 'error' | 'no-location'

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
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicPointCard({
  point, distance, isSelected, onSelect, onActivate, onExit,
  routeStatus, walkingDistanceMeters, walkingDurationSeconds,
}: PublicPointCardProps) {
  const [descExpanded, setDescExpanded] = useState(false)
  const isLongDesc = (point.description?.length ?? 0) > DESCRIPTION_LIMIT

  // Radius check always uses straight-line Haversine.
  const withinRadius = distance !== null && distance <= point.activationRadius

  // Walking distance from ORS for the expand detail (display only, never used for radius check).
  const distanceToEdge =
    distance !== null ? Math.max(0, distance - point.activationRadius) : null

  const schedule = getScheduleState(point.availability)
  const quota    = getQuotaState(point.availability)
  const canActivate = withinRadius && schedule.available && quota.available

  // ── Location chip derivation ──────────────────────────────────────────────
  let locationLabel: string
  let locationVariant: ChipVariant
  let locationDetail: ReactNode = null

  if (distance === null) {
    locationLabel   = 'Activá tu ubicación'
    locationVariant = 'neutral'
  } else if (withinRadius) {
    locationLabel   = 'Dentro del área'
    locationVariant = 'ok'
  } else {
    locationLabel   = distanceToEdge !== null && distanceToEdge > 0
      ? `A ${formatDistance(distanceToEdge)} del área`
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
    <div
      className={[
        'rounded-xl border overflow-hidden transition-all cursor-pointer',
        isSelected
          ? 'border-brand-500 bg-gray-800/80'
          : 'border-gray-800 bg-gray-900/60 hover:border-gray-700',
      ].join(' ')}
      onClick={onSelect}
    >
      {/* Cover image */}
      {point.image && (
        <div className="h-28 overflow-hidden">
          <img src={point.image} alt={point.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-3">
        {/* Name + exit button */}
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

        {/* Description */}
        {point.description && (
          <div className="mt-1">
            <p className="text-xs text-gray-400 leading-relaxed">
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

        {/* Instructions */}
        {point.instructions && (
          <div className="mt-2 flex items-start gap-1.5">
            <svg className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-gray-500 line-clamp-2">{point.instructions}</p>
          </div>
        )}

        {/* ── Selected: status chips + button ── */}
        {isSelected && (
          <div className="mt-3 space-y-1.5">

            {/* Location */}
            <StatusChip
              icon={<PinIcon />}
              label={locationLabel}
              variant={locationVariant}
              expandLabel={locationDetail != null ? 'Ver ruta' : undefined}
              detail={locationDetail}
            />

            {/* Schedule (only when configured) */}
            {schedule.active && (
              <StatusChip
                icon={<ClockIcon />}
                label={schedule.label}
                variant={schedule.available ? 'ok' : 'block'}
                expandLabel="Ver horarios"
                detail={<ScheduleDetail schedule={schedule} />}
              />
            )}

            {/* Quota (only when configured) */}
            {quota.active && (
              <StatusChip
                icon={<TagIcon />}
                label={quota.label}
                variant={quota.available ? (quota.remaining === 1 ? 'warn' : 'ok') : 'block'}
                expandLabel="Ver detalle"
                detail={<QuotaDetail quota={quota} />}
              />
            )}

            {/* Activation button */}
            <div className="pt-0.5">
              {canActivate ? (
                <button
                  onClick={(e) => { e.stopPropagation(); onActivate() }}
                  className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98]
                             text-white font-semibold py-2.5 px-4 rounded-xl text-sm
                             transition-all duration-150"
                >
                  {point.buttonText || 'Ir a experiencia'}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-800 text-gray-600 font-semibold py-2.5 px-4
                             rounded-xl text-sm cursor-not-allowed border border-gray-700/40"
                >
                  {point.buttonText || 'Ir a experiencia'}
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
