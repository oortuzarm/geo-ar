import { useEffect, useRef, useState } from 'react'
import { MetricTooltip } from '../../components/MetricTooltip'
import { useSearchParams } from 'react-router-dom'
import {
  fetchProjectAnalytics,
  fetchProjectAnalyticsByPoint,
  fetchProjectAnalyticsByHour,
  fetchProjectAnalyticsByDay,
  fetchProjectDestinations,
} from '../../lib/analytics'
import type {
  ProjectAnalytics,
  PointAnalytics,
  HourBucket,
  DayBucket,
  PeriodParams,
  DestinationsData,
} from '../../lib/analytics'
import { useWorkspace } from '../../hooks/useWorkspace'
import { usePlanFeatures } from '../../hooks/usePlanFeatures'
import PlanGate from '../../components/ui/PlanGate'

// ── Types ─────────────────────────────────────────────────────────────────────

type InsightTag = 'positive'  | 'warning'    | 'info'    | 'neutral'
type Period     = '7d' | '30d' | '90d' | 'custom'
type Section    = 'resumen' | 'ubicaciones' | 'conversion' | 'destinos'

interface Insight { id: string; tag: InsightTag; text: string }

// ── Period helpers ────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function subtractDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}


function computePeriodParams(
  period: Period,
  customFrom: string,
  customTo: string,
): PeriodParams | undefined {
  const to = todayISO()
  if (period === '7d')  return { from: subtractDays(6),  to }
  if (period === '30d') return { from: subtractDays(29), to }
  if (period === '90d') return { from: subtractDays(89), to }
  if (customFrom && customTo && customFrom <= customTo) return { from: customFrom, to: customTo }
  return undefined
}

function periodLabel(period: Period, customFrom: string, customTo: string): string {
  if (period === '7d')  return 'Últimos 7 días'
  if (period === '30d') return 'Últimos 30 días'
  if (period === '90d') return 'Últimos 90 días'
  if (customFrom && customTo && customFrom <= customTo) return `${customFrom} → ${customTo}`
  return 'Seleccioná un rango personalizado'
}

// ── Insights derivation ───────────────────────────────────────────────────────

function deriveInsights(summary: ProjectAnalytics, byPoint: PointAnalytics[]): Insight[] {
  const pool: Insight[] = []
  const total = summary.radiusEntries
  const sorted = [...byPoint].sort((a, b) => b.radiusEntries - a.radiusEntries)

  // No data at all — single motivational insight
  if (total === 0) {
    pool.push({
      id: 'no-data', tag: 'neutral',
      text: 'Aún no hay datos de actividad. Comparte el link público para comenzar a registrar entradas.',
    })
    return pool
  }

  // Top point by entries
  const top = sorted[0]
  if (top && top.radiusEntries > 0) {
    const pct = Math.round((top.radiusEntries / total) * 100)
    pool.push({
      id: 'top-point', tag: 'info',
      text: `El punto más visitado es "${top.pointName}" · concentra el ${pct}% de las entradas totales.`,
    })
  }

  // Best conversion point
  const withClicks = byPoint.filter(p => p.clicks > 0)
  if (withClicks.length > 0) {
    const best = [...withClicks].sort((a, b) => b.conversion - a.conversion)[0]
    pool.push({
      id: 'best-conv', tag: 'positive',
      text: `"${best.pointName}" tiene la mejor conversión del proyecto — ${best.conversion}% de entradas activadas.`,
    })
  }

  // Overall conversion quality
  if (total > 0) {
    const q = summary.conversion >= 30 ? 'excelente' : summary.conversion >= 15 ? 'saludable' : 'baja'
    pool.push({
      id: 'overall-conv',
      tag: summary.conversion >= 15 ? 'positive' : 'warning',
      text: `Conversión general ${q} — el ${summary.conversion}% de las entradas al radio resultaron en un clic.`,
    })
  }

  // Points with zero entries (inactive)
  const inactive = byPoint.filter(p => p.radiusEntries === 0)
  if (inactive.length > 0 && byPoint.length > 1) {
    pool.push({
      id: 'inactive', tag: 'warning',
      text: `${inactive.length} de ${byPoint.length} puntos aún no registran visitas — revisá su radio de activación.`,
    })
  }

  // Traffic concentration (top-2 > 65%)
  if (sorted.length >= 3 && total > 0) {
    const top2 = sorted[0].radiusEntries + sorted[1].radiusEntries
    const pct  = Math.round((top2 / total) * 100)
    if (pct >= 65) {
      pool.push({
        id: 'concentration', tag: 'neutral',
        text: `Tráfico concentrado — solo 2 puntos capturan el ${pct}% de todas las entradas del proyecto.`,
      })
    }
  }

  // Points visited but no clicks
  const visitedNoClicks = byPoint.filter(p => p.radiusEntries > 0 && p.clicks === 0)
  if (visitedNoClicks.length > 0 && summary.clicks > 0) {
    pool.push({
      id: 'no-click-points', tag: 'neutral',
      text: `${visitedNoClicks.length} punto${visitedNoClicks.length > 1 ? 's' : ''} reciben visitas pero ningún usuario activó la experiencia allí.`,
    })
  }

  // No activations despite entries
  if (summary.clicks === 0 && total > 0) {
    pool.push({
      id: 'zero-activation', tag: 'warning',
      text: `${total} entrada${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''} pero ningún usuario activó la experiencia todavía.`,
    })
  }

  // Prioritise: positive first, then info, then warning, neutral last
  const order: InsightTag[] = ['positive', 'info', 'warning', 'neutral']
  pool.sort((a, b) => order.indexOf(a.tag) - order.indexOf(b.tag))
  return pool.slice(0, 4)
}

// ── Insights section ──────────────────────────────────────────────────────────

function InsightsSection({ summary, byPoint }: {
  summary: ProjectAnalytics
  byPoint: PointAnalytics[]
}) {
  const insights = deriveInsights(summary, byPoint)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  if (insights.length === 0) return null

  const DOT: Record<InsightTag, string> = {
    positive: 'bg-emerald-400',
    warning:  'bg-amber-400',
    info:     'bg-brand-400',
    neutral:  'bg-gray-600',
  }

  const TEXT: Record<InsightTag, string> = {
    positive: 'text-emerald-300/90',
    warning:  'text-amber-300/90',
    info:     'text-brand-300/90',
    neutral:  'text-gray-400',
  }

  return (
    <div
      className="rounded-2xl border border-brand-500/[0.18] px-6 py-5"
      style={{ background: 'linear-gradient(135deg, #0a1c2e 0%, #0d1f2d 50%, #0c1a28 100%)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-brand-500/15 border border-brand-500/25
                            flex items-center justify-center">
              <svg className="w-3 h-3 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-100">Insights automáticos</h3>
          </div>
          <p className="text-[11px] text-gray-600">
            Resumen inteligente del comportamiento de tu experiencia.
          </p>
        </div>
        <span className="text-[10px] font-medium text-brand-500/70 bg-brand-500/8
                         border border-brand-500/15 rounded-full px-2 py-0.5 shrink-0">
          {insights.length} activos
        </span>
      </div>

      {/* Insight items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {insights.map((ins, i) => (
          <div
            key={ins.id}
            className="flex items-start gap-2.5 group cursor-default"
            style={{
              opacity:   mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(5px)',
              transition: `opacity 0.32s ease-out ${i * 75}ms, transform 0.32s ease-out ${i * 75}ms`,
            }}
          >
            {/* Dot indicator */}
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 mt-[5px] ${DOT[ins.tag]}`}
            />
            {/* Text */}
            <p className={`text-[12.5px] leading-snug transition-colors duration-150
                           group-hover:text-gray-200 ${TEXT[ins.tag]}`}>
              {ins.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}



// ── Skeleton ──────────────────────────────────────────────────────────────────

function Pulse({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-800/80 rounded-xl ${className}`} />
}

function PageSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[280px]">
        <div className="lg:col-span-2"><Pulse className="h-full" /></div>
        <div className="lg:col-span-3"><Pulse className="h-full" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Pulse className="h-28" />
        <Pulse className="h-28" />
        <Pulse className="h-28" />
      </div>
      <Pulse className="h-48" />
    </div>
  )
}

// ── Horizontal bar row (LookiAR style) ────────────────────────────────────────

function BarRow({
  label, value, maxValue, displayValue, mounted, delay = 0,
}: {
  label: string; value: number; maxValue: number
  displayValue: string; mounted: boolean; delay?: number
}) {
  const [hov, setHov] = useState(false)
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div
      className="flex items-center gap-3 py-0.5 group cursor-default"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className={`w-28 text-sm truncate shrink-0 transition-colors duration-150 ${
        hov ? 'text-gray-200' : 'text-gray-400'
      }`}>
        {label}
      </span>

      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
          style={{
            width: mounted ? `${Math.max(pct, value > 0 ? 3 : 0)}%` : '0%',
            transition: `width 0.65s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </div>

      <span className={`w-12 text-right text-sm tabular-nums shrink-0 transition-colors duration-150 ${
        hov ? 'text-gray-100' : 'text-gray-500'
      }`}>
        {displayValue}
      </span>
    </div>
  )
}

// ── Dist bar row — pre-computed barPct + display label ────────────────────────

function DistBarRow({ label, barPct, displayLabel, mounted, delay }: {
  label: string; barPct: number; displayLabel: string; mounted: boolean; delay: number
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="flex items-center gap-3 py-0.5 cursor-default"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span className={`w-24 text-sm truncate shrink-0 transition-colors duration-150 ${
        hov ? 'text-gray-200' : 'text-gray-400'
      }`}>{label}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
          style={{
            width: mounted ? `${barPct}%` : '0%',
            transition: `width 0.65s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          }}
        />
      </div>
      <span className={`w-10 text-right text-sm tabular-nums shrink-0 transition-colors duration-150 ${
        hov ? 'text-gray-100' : 'text-gray-500'
      }`}>{displayLabel}</span>
    </div>
  )
}

// ── Widget primitives ─────────────────────────────────────────────────────────

function WidgetSubTabs({
  options, value, onChange,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-px bg-gray-800 rounded-lg p-0.5">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={[
            'px-2.5 py-1 text-[11px] rounded-md transition-all duration-150',
            value === o.id
              ? 'bg-gray-700 text-gray-200 shadow-sm'
              : 'text-gray-500 hover:text-gray-400',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function WidgetInsight({ text }: { text: string }) {
  return (
    <div className="mt-2 pt-2.5 border-t border-white/[0.05] flex items-start gap-2 shrink-0">
      <span className="w-1 h-1 rounded-full bg-brand-400/70 shrink-0 mt-[5px]" />
      <p className="text-[11px] text-gray-500 leading-snug">{text}</p>
    </div>
  )
}

function TabSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-4 h-4 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
    </div>
  )
}

function TabEmpty({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
      <div className="text-gray-700">{icon}</div>
      <p className="text-[11px] font-medium text-gray-600">{title}</p>
      <p className="text-[10px] text-gray-700 leading-snug max-w-[180px]">{sub}</p>
    </div>
  )
}

// ── Temporal helpers ──────────────────────────────────────────────────────────

const HOUR_GROUP_LABELS = ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h']

function groupHours(buckets: HourBucket[]): { label: string; barPct: number }[] {
  const map = new Map(buckets.map(b => [b.hour, b.count]))
  const grouped = HOUR_GROUP_LABELS.map((label, gi) => ({
    label,
    count: (map.get(gi * 3) ?? 0) + (map.get(gi * 3 + 1) ?? 0) + (map.get(gi * 3 + 2) ?? 0),
  }))
  const max = Math.max(...grouped.map(g => g.count), 1)
  return grouped.map(g => ({ label: g.label, barPct: Math.round((g.count / max) * 100) }))
}

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function mapDays(buckets: DayBucket[]): { label: string; barPct: number; count: number }[] {
  const map  = new Map(buckets.map(b => [b.day, b.count]))
  const days = DAY_LABELS.map((label, i) => ({ label, count: map.get(i) ?? 0 }))
  const max  = Math.max(...days.map(d => d.count), 1)
  return days.map(d => ({ ...d, barPct: Math.round((d.count / max) * 100) }))
}

// ── Horarios tab ──────────────────────────────────────────────────────────────

type HorariosSubTab = 'horas' | 'dias'

const HORARIOS_SUBTABS: { id: HorariosSubTab; label: string }[] = [
  { id: 'horas', label: 'Horas' },
  { id: 'dias',  label: 'Días'  },
]

function HorariosTab({ projectId, pointId, params }: {
  projectId: string
  pointId?: string
  params?: PeriodParams
}) {
  const [sub, setSub]         = useState<HorariosSubTab>('horas')
  const [fade, setFade]       = useState(true)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hours, setHours]     = useState<HourBucket[]>([])
  const [days,  setDays]      = useState<DayBucket[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchProjectAnalyticsByHour(projectId, pointId, params),
      fetchProjectAnalyticsByDay(projectId, pointId, params),
    ])
      .then(([h, d]) => { setHours(h); setDays(d) })
      .finally(() => setLoading(false))
  }, [projectId, pointId, params?.from, params?.to])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(t)
  }, [sub])

  function changeSub(next: string) {
    const n = next as HorariosSubTab
    if (n === sub) return
    setFade(false); setMounted(false)
    setTimeout(() => { setSub(n); setFade(true) }, 120)
  }

  const hourBars = groupHours(hours)
  const dayBars  = mapDays(days)
  const hasHours = hours.some(h => h.count > 0)
  const hasDays  = days.some(d => d.count > 0)
  const hasData  = sub === 'horas' ? hasHours : hasDays

  const peakHourGroup = hasHours
    ? HOUR_GROUP_LABELS[hourBars.reduce((best, row, i) => row.barPct > hourBars[best].barPct ? i : best, 0)]
    : null
  const peakDay = hasDays
    ? dayBars.reduce((best, row) => row.count > best.count ? row : best, dayBars[0])
    : null

  const clockIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h3 className="text-sm font-semibold text-gray-200">Horarios</h3>
        <WidgetSubTabs options={HORARIOS_SUBTABS} value={sub} onChange={changeSub} />
      </div>

      {loading ? (
        <TabSpinner />
      ) : !hasData ? (
        <>
          <TabEmpty
            icon={clockIcon}
            title="Sin actividad temporal aún"
            sub="Los horarios y días de mayor visita aparecerán con el tiempo."
          />
          <WidgetInsight text="Los datos temporales se registran automáticamente al entrar al radio de activación." />
        </>
      ) : (
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.12s ease' }}
        >
          {sub === 'horas' ? (
            <>
              {/* 2-column grid matches LookiAR Horarios reference */}
              <div
                className="flex-1 grid grid-cols-2 gap-x-5 min-h-0"
                style={{ alignContent: 'space-between' }}
              >
                {hourBars.map((row, i) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="w-7 text-xs text-gray-500 tabular-nums shrink-0">
                      {row.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                        style={{
                          width: mounted ? `${row.barPct}%` : '0%',
                          transition: `width 0.65s cubic-bezier(0.4, 0, 0.2, 1) ${i * 35}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {peakHourGroup && (
                <WidgetInsight text={`Mayor actividad registrada alrededor de las ${peakHourGroup}.`} />
              )}
            </>
          ) : (
            <>
              <div className="flex-1 flex flex-col justify-between min-h-0">
                {dayBars.map((row, i) => (
                  <DistBarRow
                    key={row.label}
                    label={row.label}
                    barPct={row.barPct}
                    displayLabel={String(row.count)}
                    mounted={mounted}
                    delay={i * 45}
                  />
                ))}
              </div>
              {peakDay && (
                <WidgetInsight text={`${peakDay.label} concentra la mayor actividad de la semana.`} />
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}


// ── Right chart — grouped vertical bars per point ─────────────────────────────

function RightChart({ byPoint }: { byPoint: PointAnalytics[] }) {
  const [mounted, setMounted]   = useState(false)
  const [hovered, setHovered]   = useState<number | null>(null)
  const containerRef            = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 350)
    return () => clearTimeout(t)
  }, [])

  const data   = byPoint.slice(0, 8)
  const maxVal = Math.max(...data.flatMap(p => [p.radiusEntries, p.clicks]), 1)
  const LEVELS = 4
  const BAR_H  = 160

  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
        <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
        </svg>
        <p className="text-sm text-gray-600">Activá tu primer punto para ver el gráfico</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      {/* Legend */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Entradas vs Clics · por punto
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-sm bg-brand-500/80 inline-block" />
            Entradas
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span className="w-2 h-2 rounded-sm bg-emerald-500/80 inline-block" />
            Clics
          </span>
        </div>
      </div>

      {/* Chart body */}
      <div className="flex-1 flex gap-2 min-h-0">

        {/* Y-axis labels */}
        <div
          className="flex flex-col justify-between shrink-0 w-8 text-right"
          style={{ paddingBottom: '26px' }}
        >
          {[...Array(LEVELS + 1)].map((_, i) => (
            <span key={i} className="text-[10px] text-gray-700 tabular-nums leading-none">
              {Math.round((maxVal * (LEVELS - i)) / LEVELS)}
            </span>
          ))}
        </div>

        {/* Bars + grid */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Bars area */}
          <div className="relative flex-1" style={{ height: `${BAR_H}px` }}>

            {/* Gridlines */}
            {[...Array(LEVELS + 1)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-800/60"
                style={{ top: `${(i / LEVELS) * 100}%` }}
              />
            ))}

            {/* Bar columns */}
            <div className="absolute inset-0 flex items-end gap-1.5">
              {data.map((pt, i) => {
                const ePct = (pt.radiusEntries / maxVal) * 100
                const cPct = (pt.clicks        / maxVal) * 100
                const isH  = hovered === i

                return (
                  <div
                    key={pt.pointId}
                    className="flex-1 flex items-end gap-0.5 h-full relative group cursor-default"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {isH && (
                      <div
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30
                                   bg-gray-800 border border-gray-700/60 rounded-xl px-3 py-2.5
                                   shadow-2xl shadow-black/60 text-[11px] whitespace-nowrap pointer-events-none"
                      >
                        <p className="font-semibold text-gray-200 mb-1.5 max-w-[150px] truncate">
                          {pt.pointName}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-gray-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
                              Entradas
                            </span>
                            <span className="font-semibold text-gray-200 tabular-nums">
                              {pt.radiusEntries}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-gray-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                              Clics
                            </span>
                            <span className="font-semibold text-gray-200 tabular-nums">
                              {pt.clicks}
                            </span>
                          </div>
                          <div className="pt-1 mt-0.5 border-t border-gray-700 flex items-center justify-between gap-5">
                            <span className="text-gray-500">Conversión</span>
                            <span className={`font-bold ${
                              pt.conversion >= 30 ? 'text-emerald-400' :
                              pt.conversion >= 15 ? 'text-amber-400'   : 'text-gray-400'
                            }`}>
                              {pt.conversion}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Entries bar */}
                    <div className="flex-1 flex flex-col justify-end h-full">
                      <div
                        className="w-full rounded-t-[3px] transition-[filter] duration-200"
                        style={{
                          height: mounted ? `${Math.max(ePct, pt.radiusEntries > 0 ? 2 : 0)}%` : '0%',
                          background: 'linear-gradient(to top, #075985, #38bdf8)',
                          filter: isH ? 'brightness(1.25)' : 'none',
                          transition: [
                            `height 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 50}ms`,
                            'filter 0.2s ease',
                          ].join(', '),
                        }}
                      />
                    </div>

                    {/* Clicks bar */}
                    <div className="flex-1 flex flex-col justify-end h-full">
                      <div
                        className="w-full rounded-t-[3px] transition-[filter] duration-200"
                        style={{
                          height: mounted ? `${Math.max(cPct, pt.clicks > 0 ? 2 : 0)}%` : '0%',
                          background: 'linear-gradient(to top, #064e3b, #34d399)',
                          filter: isH ? 'brightness(1.25)' : 'none',
                          transition: [
                            `height 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 50 + 35}ms`,
                            'filter 0.2s ease',
                          ].join(', '),
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* X labels */}
          <div className="flex gap-1.5 mt-2 shrink-0" style={{ height: '24px' }}>
            {data.map(pt => (
              <div key={pt.pointId} className="flex-1 overflow-hidden">
                <p className="text-[9px] text-gray-600 truncate text-center leading-tight">
                  {pt.pointName.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── KPI card (LookiAR style) ──────────────────────────────────────────────────

function KPICard({ label, value, sub, accent, compact, className = '' }: {
  label: string; value: string | number; sub?: string; accent?: boolean; compact?: boolean; className?: string
}) {
  return (
    <div className={[
      'rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-2 sm:gap-3 min-w-0 overflow-hidden',
      'transition-all duration-200 hover:scale-[1.01] cursor-default',
      accent
        ? 'bg-brand-600/8 border-brand-500/20 hover:border-brand-500/35 hover:bg-brand-600/12'
        : 'bg-gray-900/70 border-white/[0.07] hover:border-white/[0.14]',
      className,
    ].join(' ')}>
      <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-medium leading-none">
        {label}
      </p>
      <p className={[
        'font-bold',
        compact
          ? 'text-xl sm:text-2xl leading-snug line-clamp-2 break-words'
          : 'text-3xl sm:text-[2.625rem] tabular-nums leading-none break-all',
        accent ? 'text-brand-300' : 'text-gray-100',
      ].join(' ')}>
        {value}
      </p>
      {sub && <p className="text-[10px] sm:text-[11px] text-gray-600 leading-snug">{sub}</p>}
    </div>
  )
}

// ── Period selector ───────────────────────────────────────────────────────────

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: '7d',     label: '7 días'       },
  { id: '30d',    label: '30 días'      },
  { id: '90d',    label: '90 días'      },
  { id: 'custom', label: 'Personalizado' },
]

function PeriodSelector({
  value,
  onChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: {
  value: Period
  onChange: (p: Period) => void
  customFrom: string
  customTo: string
  onCustomFromChange: (v: string) => void
  onCustomToChange: (v: string) => void
}) {
  const today = todayISO()
  const inputCls = [
    'bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-2 py-1',
    'text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500',
    'focus:border-transparent transition-colors flex-shrink-0',
  ].join(' ')

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto flex-wrap" style={{ scrollbarWidth: 'none' }}>
      {PERIOD_OPTIONS.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={[
            'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0',
            value === p.id
              ? 'bg-gray-700 text-gray-100 border border-gray-600/80 shadow-sm'
              : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-gray-700/50',
          ].join(' ')}
        >
          {p.label}
        </button>
      ))}

      {value === 'custom' && (
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
          <input
            type="date"
            value={customFrom}
            max={customTo || today}
            onChange={e => onCustomFromChange(e.target.value)}
            className={inputCls}
          />
          <span className="text-gray-600 text-xs">→</span>
          <input
            type="date"
            value={customTo}
            min={customFrom || undefined}
            max={today}
            onChange={e => onCustomToChange(e.target.value)}
            className={inputCls}
          />
        </div>
      )}
    </div>
  )
}

// ── Analytics nav ─────────────────────────────────────────────────────────────

const ANALYTICS_SECTIONS: { id: Section; label: string }[] = [
  { id: 'resumen',     label: 'Resumen'     },
  { id: 'ubicaciones', label: 'Ubicaciones' },
  { id: 'conversion',  label: 'Conversión'  },
  { id: 'destinos',    label: 'Destinos'    },
]

function AnalyticsNav({ value, onChange }: { value: Section; onChange: (s: Section) => void }) {
  return (
    <div className="flex overflow-x-auto border-b border-gray-800" style={{ scrollbarWidth: 'none' }}>
      {ANALYTICS_SECTIONS.map(s => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={[
            'relative px-4 py-3 text-xs font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0',
            value === s.id ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300',
          ].join(' ')}
        >
          {s.label}
          {value === s.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-400 rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  )
}

// ── Ubicaciones section ───────────────────────────────────────────────────────

function UbicacionesSection({
  byPoint,
  summary,
  pointFilter,
}: {
  byPoint: PointAnalytics[]
  summary: ProjectAnalytics
  pointFilter: PointAnalytics | null
}) {
  const sorted = [...byPoint].sort((a, b) => b.radiusEntries - a.radiusEntries)
  const total  = summary.radiusEntries

  if (byPoint.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-gray-900/40 py-14 text-center">
        <p className="text-sm text-gray-600">Sin datos de ubicaciones aún.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {pointFilter && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
          Mostrando datos para: <span className="text-brand-300 font-medium">{pointFilter.pointName}</span>
        </div>
      )}
      <div className="rounded-2xl border border-white/[0.07] bg-gray-900/70 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Rendimiento por ubicación</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ordenadas por entradas al radio de activación</p>
          </div>
          <span className="text-xs text-gray-600 flex-shrink-0">{sorted.length} ubicaciones</span>
        </div>

        {/* Column headers — desktop only */}
        <div className="hidden sm:grid gap-4 px-5 sm:px-6 py-2.5 border-b border-white/[0.04]
                        text-[10px] text-gray-600 font-medium uppercase tracking-wider"
          style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px' }}>
          <span>Ubicación</span>
          <span className="text-right">Entradas</span>
          <span className="text-right">Convs.</span>
          <span className="text-right">Tasa cv.</span>
          <span className="text-right">Participación</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {sorted.map((pt, i) => {
            const pct       = total > 0 ? Math.round((pt.radiusEntries / total) * 100) : 0
            const convColor = pt.conversion >= 30 ? 'text-emerald-400'
                            : pt.conversion >= 15 ? 'text-amber-400'
                            : 'text-gray-500'
            return (
              <div
                key={pt.pointId}
                className="flex sm:grid gap-4 items-center px-5 sm:px-6 py-4
                           hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-gray-700 w-4 text-right flex-shrink-0 tabular-nums">{i + 1}</span>
                  <p className="text-sm text-gray-200 truncate font-medium">{pt.pointName}</p>
                </div>
                <span className="hidden sm:block text-sm tabular-nums text-gray-400 text-right">{pt.radiusEntries}</span>
                <span className="hidden sm:block text-sm tabular-nums text-gray-400 text-right">{pt.clicks}</span>
                <span className={`hidden sm:block text-sm tabular-nums font-semibold text-right ${convColor}`}>{pt.conversion}%</span>
                <span className="hidden sm:block text-sm tabular-nums text-gray-300 font-medium text-right">{pct}%</span>
                {/* Mobile compact */}
                <div className="sm:hidden flex items-center gap-2 text-xs flex-shrink-0 ml-auto">
                  <span className="text-gray-500">{pt.radiusEntries} ent.</span>
                  <span className={`font-semibold ${convColor}`}>{pt.conversion}%</span>
                  <span className="text-gray-400">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Funnel step ───────────────────────────────────────────────────────────────

function FunnelStep({
  label, count, pct, mounted, accent = false,
}: { label: string; count: number; pct: number; mounted: boolean; accent?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${accent ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold tabular-nums ${accent ? 'text-brand-300' : 'text-gray-100'}`}>
            {count}
          </span>
          <span className="text-xs text-gray-600 tabular-nums w-9 text-right">{pct}%</span>
        </div>
      </div>
      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            accent ? 'bg-gradient-to-r from-brand-600 to-brand-400' : 'bg-gray-600'
          }`}
          style={{
            width: mounted ? `${Math.max(pct, count > 0 ? 2 : 0)}%` : '0%',
            transition: 'width 0.65s cubic-bezier(0.4, 0, 0.2, 1) 120ms',
          }}
        />
      </div>
    </div>
  )
}

// ── Conversion section ────────────────────────────────────────────────────────

function ConversionSection({
  summary,
  convQuality,
  pointFilter,
}: {
  summary: ProjectAnalytics
  convQuality: string
  pointFilter: PointAnalytics | null
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 140)
    return () => clearTimeout(t)
  }, [])

  const convPct = summary.radiusEntries > 0
    ? Math.round((summary.clicks / summary.radiusEntries) * 100)
    : 0
  const dropPct = 100 - convPct

  const qualityColor = summary.conversion >= 30 ? 'text-emerald-400'
                     : summary.conversion >= 15 ? 'text-amber-400'
                     : 'text-gray-500'

  return (
    <div className="space-y-5 animate-fade-in">
      {pointFilter && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
          Mostrando datos para: <span className="text-brand-300 font-medium">{pointFilter.pointName}</span>
        </div>
      )}

      {/* ── Embudo ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-gray-900/70 px-5 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-200">Embudo de conversión</h3>
          <MetricTooltip content="Porcentaje de usuarios que pasan de entrar al radio de activación a hacer clic en la experiencia." />
        </div>

        <div className="space-y-4">
          <FunnelStep
            label="Entradas al radio"
            count={summary.radiusEntries}
            pct={100}
            mounted={mounted}
          />

          {/* Drop-off connector */}
          <div className="flex items-center gap-3 py-0.5 pl-1">
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <div className="w-px h-2.5 bg-gray-700" />
              <div className="w-px h-2.5 bg-gray-700" />
            </div>
            {summary.radiusEntries > 0 && dropPct > 0 && (
              <span className="text-xs text-gray-600 tabular-nums">
                {dropPct}% no continuó
              </span>
            )}
          </div>

          <FunnelStep
            label="Clics en destino"
            count={summary.clicks}
            pct={convPct}
            mounted={mounted}
            accent
          />
        </div>

        {/* Conversion rate summary */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Tasa de conversión</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tabular-nums ${qualityColor}`}>
              {summary.conversion}%
            </span>
            {convQuality !== '—' && (
              <span className="text-xs text-gray-600">{convQuality}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Referencia de calidad ───────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-gray-900/70 px-5 sm:px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-200 mb-4">¿Qué significa esta tasa?</h3>
        <div className="space-y-1.5">
          {[
            { range: '≥ 30%', label: 'Excelente',  color: 'bg-emerald-500', active: summary.conversion >= 30 },
            { range: '15–29%', label: 'Saludable', color: 'bg-amber-500',   active: summary.conversion >= 15 && summary.conversion < 30 },
            { range: '< 15%',  label: 'Mejorable', color: 'bg-gray-600',    active: summary.conversion < 15 && summary.radiusEntries > 5 },
          ].map(tier => (
            <div
              key={tier.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                tier.active ? 'bg-white/[0.04]' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tier.color} ${tier.active ? 'opacity-100' : 'opacity-25'}`} />
              <span className={`text-sm flex-1 ${tier.active ? 'text-gray-200 font-medium' : 'text-gray-600'}`}>
                {tier.label}
              </span>
              <span className={`text-xs tabular-nums ${tier.active ? 'text-gray-400' : 'text-gray-700'}`}>
                {tier.range}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ── Destinations section ──────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  whatsapp:    'WhatsApp',
  website:     'Sitio web',
  form:        'Formulario',
  reservation: 'Reserva',
  ecommerce:   'E-commerce',
  social:      'Red social',
  map:         'Mapa',
  coupon:      'Cupón',
  custom:      'Sin categoría',
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  url:   'URL',
  video: 'Video',
  audio: 'Audio',
  file:  'Archivo',
}

function fmtN(n: number): string {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}k`
      : String(n)
}

// Unified label for a destination key (can be a category or content_type).
function destLabel(key: string): string {
  return CATEGORY_LABELS[key] ?? CONTENT_TYPE_LABELS[key] ?? key
}

function deriveDestInsights(data: DestinationsData | null): string[] {
  if (!data || data.totalClicks === 0) return []
  const insights: string[] = []

  const top = data.byCategory[0]
  if (top) {
    const label = CATEGORY_LABELS[top.category] ?? top.category
    insights.push(`${label} es el destino más utilizado con ${top.share}% de los clics.`)
  }

  const topLoc = data.byLocation[0]
  if (topLoc) {
    insights.push(
      `La ubicación "${topLoc.pointName}" concentra la mayor cantidad de clics hacia destinos (${topLoc.totalClicks}).`
    )
  }

  if (topLoc?.topDest) {
    const lbl = destLabel(topLoc.topDest)
    insights.push(`El destino líder de "${topLoc.pointName}" es ${lbl}.`)
  }

  const mediaClicks = data.byContentType
    .filter(ct => ct.contentType !== 'url')
    .reduce((s, ct) => s + ct.clicks, 0)
  if (mediaClicks > 0 && data.contextualClicks > 0) {
    const pct = Math.round(mediaClicks / data.contextualClicks * 100)
    insights.push(`${pct}% de los clics van hacia contenido multimedia (video, audio o archivos).`)
  }

  if (data.legacyClicks > 0 && data.contextualClicks === 0) {
    insights.push(
      'Los clics existentes son anteriores al tracking de destinos. ' +
      'Los nuevos comenzarán a clasificarse automáticamente.'
    )
  } else if (data.legacyClicks > 0) {
    const legacyPct = Math.round(data.legacyClicks / data.totalClicks * 100)
    if (legacyPct >= 20) {
      insights.push(
        `${legacyPct}% de los clics son históricos sin categoría. ` +
        'Los nuevos clics incluyen el tipo de destino completo.'
      )
    }
  }

  return insights.slice(0, 4)
}

function DestinacionesSection({
  projectId,
  pointId,
  pointFilter,
  params,
}: {
  projectId:   string
  pointId?:    string
  pointFilter: PointAnalytics | null
  params?:     PeriodParams
}) {
  const [data,    setData]    = useState<DestinationsData | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLoading(true); setMounted(false)
    fetchProjectDestinations(projectId, pointId, params)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [projectId, pointId, params?.from, params?.to])

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setMounted(true), 120)
      return () => clearTimeout(t)
    }
  }, [loading])

  const hasContextual = (data?.contextualClicks ?? 0) > 0
  const topCat        = data?.byCategory[0]
  const insights      = deriveDestInsights(data ?? null)

  return (
    <div className="space-y-5 animate-fade-in">
      {pointFilter && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
          Mostrando datos para:{' '}
          <span className="text-brand-300 font-medium">{pointFilter.pointName}</span>
        </div>
      )}

      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* ── KPI cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <KPICard
              label="Total clics"
              value={fmtN(data?.totalClicks ?? 0)}
              sub="interacciones con destinos"
            />
            <KPICard
              label="Destino líder"
              value={
                topCat
                  ? (CATEGORY_LABELS[topCat.category] ?? topCat.category)
                  : '—'
              }
              sub={topCat ? `${topCat.clicks} clics · ${topCat.share}%` : 'sin datos aún'}
              accent={!!topCat}
              compact
            />
          </div>

          {!hasContextual ? (
            /* ── Empty state ────────────────────────────────────── */
            <div className="rounded-2xl border border-white/[0.06] bg-gray-900/40 px-6 py-12 flex flex-col items-center gap-3 text-center">
              <span className="text-3xl">🎯</span>
              <p className="text-sm font-semibold text-gray-300">Sin datos de destinos aún</p>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                {(data?.totalClicks ?? 0) > 0
                  ? 'Los clics existentes son anteriores al tracking de destinos. Los nuevos clics comenzarán a clasificarse automáticamente por tipo de destino.'
                  : 'Los datos aparecerán a medida que los usuarios interactúen con tus ubicaciones.'}
              </p>
            </div>
          ) : (
            <>
              {/* ── Ranking de categorías ────────────────────────── */}
              {data!.byCategory.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-gray-900/40 px-5 py-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Ranking de destinos
                  </p>
                  <div className="space-y-3">
                    {data!.byCategory.map((cat, i) => (
                      <BarRow
                        key={cat.category}
                        label={CATEGORY_LABELS[cat.category] ?? cat.category}
                        value={cat.clicks}
                        maxValue={data!.byCategory[0].clicks}
                        displayValue={`${cat.share}%`}
                        mounted={mounted}
                        delay={i * 55}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Por ubicación ────────────────────────────────── */}
              {data!.byLocation.length > 0 ? (
                <div className="rounded-2xl border border-white/[0.06] bg-gray-900/40 px-5 py-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Destinos por ubicación
                  </p>

                  {/* Header row */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-x-4 mb-2 px-1">
                    <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">Ubicación</span>
                    <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide text-right w-12">Clics</span>
                    <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide text-right w-28">Destino líder</span>
                    <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide text-right w-16">Partic.</span>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    {data!.byLocation.map((loc) => (
                      <div
                        key={loc.pointId}
                        className="py-2.5 px-1 hover:bg-white/[0.02] transition-colors rounded-lg group"
                      >
                        {/* Mobile: name + compact data line */}
                        <div className="sm:hidden">
                          <p className="text-sm text-gray-300 truncate group-hover:text-gray-100 transition-colors">
                            {loc.pointName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-xs tabular-nums text-gray-500">{loc.totalClicks} clics</span>
                            {loc.topDest && (
                              <>
                                <span className="text-gray-700 text-xs">·</span>
                                <span className="text-xs text-gray-400">{destLabel(loc.topDest)}</span>
                                <span className="text-gray-700 text-xs">·</span>
                                <span className="text-xs tabular-nums text-gray-500">{loc.topDestShare}%</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Desktop: grid columns */}
                        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center">
                          <span className="text-sm text-gray-300 truncate group-hover:text-gray-100 transition-colors">
                            {loc.pointName}
                          </span>
                          <span className="text-sm tabular-nums text-gray-400 text-right w-12">
                            {loc.totalClicks}
                          </span>
                          <span className="text-sm text-right w-28 truncate">
                            {loc.topDest
                              ? <span className="text-gray-300">{destLabel(loc.topDest)}</span>
                              : <span className="text-gray-600">—</span>}
                          </span>
                          <span className="text-sm tabular-nums text-gray-500 text-right w-16">
                            {loc.topDest ? `${loc.topDestShare}%` : '—'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-gray-900/40 px-5 py-8 text-center">
                  <p className="text-xs text-gray-500">
                    Sin datos por ubicación aún — aparecerán con los próximos clics.
                  </p>
                </div>
              )}

              {/* ── Insights ─────────────────────────────────────── */}
              {insights.length > 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-gray-900/40 px-5 py-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Insights de destinos
                  </p>
                  <div className="space-y-2.5">
                    {insights.map((text, i) => (
                      <WidgetInsight key={i} text={text} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MetricsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { project, loading: workspaceLoading } = useWorkspace()
  const { canUseAnalytics } = usePlanFeatures()
  const selectedId = project?.id ?? ''
  const [pointId,     setPointId]     = useState<string>(searchParams.get('pointId') ?? '')
  const [summary,     setSummary]     = useState<ProjectAnalytics | null>(null)
  const [byPoint,     setByPoint]     = useState<PointAnalytics[] | null>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error,       setError]       = useState(false)
  const [retryKey,    setRetryKey]    = useState(0)
  const [period,      setPeriod]      = useState<Period>('30d')
  const [section,     setSection]     = useState<Section>('resumen')
  const [customFrom,  setCustomFrom]  = useState('')
  const [customTo,    setCustomTo]    = useState('')

  // ── Point filter derived values ────────────────────────────────────────────
  const pointFilter: PointAnalytics | null =
    pointId && byPoint ? (byPoint.find((p) => p.pointId === pointId) ?? null) : null

  const displaySummary: ProjectAnalytics | null = pointFilter
    ? { radiusEntries: pointFilter.radiusEntries, clicks: pointFilter.clicks, conversion: pointFilter.conversion }
    : summary

  const displayByPoint = pointFilter ? [pointFilter] : byPoint

  const periodParams = computePeriodParams(period, customFrom, customTo)

  useEffect(() => {
    if (!selectedId) return
    // For custom period, wait until both dates are set and valid
    if (period === 'custom' && !periodParams) return
    let cancelled = false
    setDataLoading(true); setError(false); setSummary(null); setByPoint(null)
    Promise.all([
      fetchProjectAnalytics(selectedId, periodParams),
      fetchProjectAnalyticsByPoint(selectedId, periodParams).catch(() => null),
    ])
      .then(([s, bp]) => { if (!cancelled) { setSummary(s); setByPoint(bp) } })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setDataLoading(false) })
    return () => { cancelled = true }
  }, [selectedId, retryKey, period, customFrom, customTo])

  function clearPointFilter() {
    setPointId('')
    setSearchParams({})
  }

  const convQuality = displaySummary
    ? displaySummary.conversion >= 30 ? 'Excelente'
    : displaySummary.conversion >= 15 ? 'Saludable'
    : displaySummary.radiusEntries > 5 ? 'Mejorable'
    : '—'
    : ''

  if (!canUseAnalytics) {
    return (
      <PlanGate
        emoji="📊"
        title="Analíticas no disponibles"
        description="Esta función no está disponible en tu plan actual. Actualizá tu plan para acceder a las analíticas de tus proyectos."
      />
    )
  }

  return (
    <div className="text-gray-100 min-h-full overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-100 shrink-0">Analytics</h1>
          <PeriodSelector
            value={period}
            onChange={setPeriod}
            customFrom={customFrom}
            customTo={customTo}
            onCustomFromChange={setCustomFrom}
            onCustomToChange={setCustomTo}
          />
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Mobile page header */}
        <div className="md:hidden mb-4 space-y-3">
          <h1 className="text-lg font-bold text-gray-100">Analytics</h1>
          <PeriodSelector
            value={period}
            onChange={setPeriod}
            customFrom={customFrom}
            customTo={customTo}
            onCustomFromChange={setCustomFrom}
            onCustomToChange={setCustomTo}
          />
        </div>

        {/* Analytics sub-nav */}
        <div className="mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <AnalyticsNav value={section} onChange={setSection} />
        </div>

        {/* Period label */}
        {!(period === 'custom' && !periodParams) && (
          <div className="mb-5 flex items-center gap-2 text-xs text-gray-600">
            <svg className="w-3 h-3 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{periodLabel(period, customFrom, customTo)}</span>
          </div>
        )}

        {/* ── Secciones que no requieren datos ──────────────────────────── */}

        {section === 'destinos' && (
          selectedId ? (
            <DestinacionesSection
              projectId={selectedId}
              pointId={pointId || undefined}
              pointFilter={pointFilter}
              params={periodParams}
            />
          ) : (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-500">Selecciona un proyecto para ver destinos.</p>
            </div>
          )
        )}

        {/* ── Secciones que requieren datos ─────────────────────────────── */}

        {['resumen', 'ubicaciones', 'conversion'].includes(section) && (
          <>
            {/* Loading */}
            {(workspaceLoading || dataLoading) && <PageSkeleton />}

            {/* Error */}
            {!workspaceLoading && selectedId && error && !dataLoading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-sm text-gray-500">No se pudieron cargar las métricas.</p>
                <button
                  onClick={() => setRetryKey(k => k + 1)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {summary && displaySummary && !dataLoading && !workspaceLoading && (
              <>

                {/* ── Resumen ─────────────────────────────────────────── */}
                {section === 'resumen' && (
                  <div className="space-y-5 animate-fade-in">

                    {/* Project heading */}
                    {project && (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-100 leading-snug">{project.title}</h2>
                        {pointFilter ? (
                          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                                             font-medium bg-brand-500/10 border border-brand-500/20 text-brand-300">
                              <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              Ubicación: {pointFilter.pointName}
                            </span>
                            <button
                              onClick={clearPointFilter}
                              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                              Ver proyecto completo →
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-0.5">Todo el período · datos acumulados</p>
                        )}
                      </div>
                    )}

                    {/* KPI cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <KPICard
                        label="Entradas al radio"
                        value={displaySummary!.radiusEntries}
                        sub="veces que un usuario entró al área de activación"
                      />
                      <KPICard
                        label="Clics en experiencia"
                        value={displaySummary!.clicks}
                        sub='activaciones del botón "Ir a experiencia"'
                      />
                      <KPICard
                        label="Conversión"
                        value={`${displaySummary!.conversion}%`}
                        sub={`${convQuality} · entrada → clic`}
                        accent
                        className="col-span-2 sm:col-span-1"
                      />
                    </div>

                    {/* Entradas vs Conversiones — full-width chart */}
                    <div className="rounded-2xl border border-white/[0.07] bg-gray-900/70 px-5 pt-5 pb-4 min-h-[220px]">
                      {displayByPoint && displayByPoint.length > 0
                        ? <RightChart byPoint={displayByPoint} />
                        : (
                          <div className="min-h-[180px] flex flex-col items-center justify-center gap-3 text-center">
                            <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                            </svg>
                            <p className="text-sm text-gray-600">Activá tu primer punto para ver el gráfico</p>
                          </div>
                        )
                      }
                    </div>

                    {/* Actividad por horario */}
                    <div className="rounded-2xl border border-white/[0.07] bg-gray-900/70 px-5 sm:px-6 py-5">
                      <h3 className="text-sm font-semibold text-gray-200 mb-4">Actividad por horario</h3>
                      <div className="flex flex-col" style={{ minHeight: '180px' }}>
                        <HorariosTab projectId={selectedId} pointId={pointId || undefined} params={periodParams} />
                      </div>
                    </div>

                    {/* Insights */}
                    {displayByPoint !== null && !pointFilter && (
                      <InsightsSection summary={displaySummary!} byPoint={displayByPoint} />
                    )}

                  </div>
                )}

                {/* ── Ubicaciones ─────────────────────────────── */}
                {section === 'ubicaciones' && (
                  <UbicacionesSection
                    byPoint={displayByPoint ?? []}
                    summary={displaySummary!}
                    pointFilter={pointFilter}
                  />
                )}

                {/* ── Conversión ──────────────────────────────── */}
                {section === 'conversion' && (
                  <ConversionSection
                    summary={displaySummary!}
                    convQuality={convQuality}
                    pointFilter={pointFilter}
                  />
                )}

              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
