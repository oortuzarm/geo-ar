import { useState } from 'react'
import type { ReactNode } from 'react'
import { formatDays } from '../../features/geolocation/availability'
import type { PointAvailability } from '../../features/geolocation/availability'

// ─── Types & styles ──────────────────────────────────────────────────────────

export type ChipVariant = 'ok' | 'warn' | 'block' | 'neutral'

export const CHIP_STYLES: Record<ChipVariant, { wrap: string; text: string; divider: string }> = {
  ok:      { wrap: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', divider: 'border-emerald-200' },
  warn:    { wrap: 'bg-amber-50 border-amber-200',     text: 'text-amber-700',   divider: 'border-amber-200'   },
  block:   { wrap: 'bg-red-50 border-red-200',         text: 'text-red-700',     divider: 'border-red-200'     },
  neutral: { wrap: 'bg-gray-100 border-gray-200',      text: 'text-gray-600',    divider: 'border-gray-200'    },
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

// ─── StatusChip ───────────────────────────────────────────────────────────────

export function StatusChip({
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

export function ScheduleDetail({ avail }: { avail: PointAvailability }) {
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

export function QuotaDetail({ avail }: { avail: PointAvailability }) {
  if (avail.quotaTotal === undefined) return null
  const used = avail.quotaTotal - (avail.quotaRemaining ?? 0)
  return <p>{avail.quotaRemaining} de {avail.quotaTotal} disponibles · {used} usados</p>
}
