import { useEffect, useRef, useState } from 'react'
import { MetricTooltip } from '../../components/MetricTooltip'
import { useSearchParams } from 'react-router-dom'
import {
  fetchProjectAnalytics,
  fetchProjectAnalyticsByPoint,
  fetchProjectAnalyticsByHour,
  fetchProjectAnalyticsByDay,
  fetchProjectGeoDistribution,
} from '../../lib/analytics'
import type {
  ProjectAnalytics,
  PointAnalytics,
  HourBucket,
  DayBucket,
  GeoBucket,
  GeoDistribution,
} from '../../lib/analytics'
import { useWorkspace } from '../../hooks/useWorkspace'
import { usePlanFeatures } from '../../hooks/usePlanFeatures'
import PlanGate from '../../components/ui/PlanGate'

// ── Types ─────────────────────────────────────────────────────────────────────

type LeftTab    = 'actividad' | 'conversion' | 'publico' | 'horarios'
type SubTab     = 'entradas'  | 'clics'
type InsightTag = 'positive'  | 'warning'    | 'info'    | 'neutral'

interface Insight { id: string; tag: InsightTag; text: string }

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

// ── Geo helpers ───────────────────────────────────────────────────────────────

function bucketsToBars(buckets: GeoBucket[]): { label: string; barPct: number; displayLabel: string }[] {
  const maxCount = Math.max(...buckets.map(b => b.count), 1)
  return buckets.map(b => ({
    label:        b.label,
    barPct:       Math.round((b.count / maxCount) * 100),
    displayLabel: `${b.pct}%`,
  }))
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

// ── Public tab ────────────────────────────────────────────────────────────────

type PublicSubTab = 'pais' | 'ciudad' | 'comuna'

const PUBLIC_SUBTABS: { id: PublicSubTab; label: string }[] = [
  { id: 'pais',   label: 'País'   },
  { id: 'ciudad', label: 'Ciudad' },
  { id: 'comuna', label: 'Comuna' },
]

function PublicTab({ projectId, pointId }: { projectId: string; pointId?: string }) {
  const [sub, setSub]         = useState<PublicSubTab>('pais')
  const [fade, setFade]       = useState(true)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [geo, setGeo]         = useState<GeoDistribution | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchProjectGeoDistribution(projectId, pointId)
      .then(setGeo)
      .finally(() => setLoading(false))
  }, [projectId, pointId])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150)
    return () => clearTimeout(t)
  }, [sub])

  function changeSub(next: string) {
    const n = next as PublicSubTab
    if (n === sub) return
    setFade(false); setMounted(false)
    setTimeout(() => { setSub(n); setFade(true) }, 120)
  }

  const subData: GeoBucket[] = geo
    ? (sub === 'pais' ? geo.countries : sub === 'ciudad' ? geo.cities : geo.communes)
    : []
  const bars = bucketsToBars(subData)
  const hasData = bars.length > 0
  const insight = hasData ? `${subData[0].label} lidera con el ${subData[0].pct}% del tráfico registrado.` : null

  const globeIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h3 className="text-sm font-semibold text-gray-200">Público</h3>
        <WidgetSubTabs options={PUBLIC_SUBTABS} value={sub} onChange={changeSub} />
      </div>

      {loading ? (
        <TabSpinner />
      ) : !hasData ? (
        <>
          <TabEmpty
            icon={globeIcon}
            title="Sin datos geográficos aún"
            sub="Aparecerán cuando los usuarios visiten tu experiencia con ubicación activada."
          />
          <WidgetInsight text="Los datos de país, ciudad y comuna se registran al entrar al radio de activación." />
        </>
      ) : (
        <div
          className="flex-1 flex flex-col min-h-0"
          style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.12s ease' }}
        >
          <div className="flex-1 flex flex-col justify-between min-h-0">
            {bars.map((row, i) => (
              <DistBarRow
                key={row.label}
                label={row.label}
                barPct={row.barPct}
                displayLabel={row.displayLabel}
                mounted={mounted}
                delay={i * 50}
              />
            ))}
          </div>
          {insight && <WidgetInsight text={insight} />}
        </div>
      )}
    </>
  )
}

// ── Horarios tab ──────────────────────────────────────────────────────────────

type HorariosSubTab = 'horas' | 'dias'

const HORARIOS_SUBTABS: { id: HorariosSubTab; label: string }[] = [
  { id: 'horas', label: 'Horas' },
  { id: 'dias',  label: 'Días'  },
]

function HorariosTab({ projectId, pointId }: { projectId: string; pointId?: string }) {
  const [sub, setSub]         = useState<HorariosSubTab>('horas')
  const [fade, setFade]       = useState(true)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hours, setHours]     = useState<HourBucket[]>([])
  const [days,  setDays]      = useState<DayBucket[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchProjectAnalyticsByHour(projectId, pointId),
      fetchProjectAnalyticsByDay(projectId, pointId),
    ])
      .then(([h, d]) => { setHours(h); setDays(d) })
      .finally(() => setLoading(false))
  }, [projectId, pointId])

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

// ── Left widget ───────────────────────────────────────────────────────────────

function LeftWidget({ byPoint, projectId, pointId }: {
  byPoint: PointAnalytics[] | null
  projectId: string
  pointId?: string
}) {
  const [tab, setTab]       = useState<LeftTab>('actividad')
  const [subTab, setSubTab] = useState<SubTab>('entradas')
  const [fade, setFade]     = useState(true)
  const [barsMounted, setBarsMounted] = useState(false)

  function switchTab(next: LeftTab) {
    if (next === tab) return
    setFade(false)
    setTimeout(() => { setTab(next); setBarsMounted(false); setFade(true) }, 130)
  }

  function switchSubTab(s: SubTab) {
    if (s === subTab) return
    setBarsMounted(false)
    setSubTab(s)
  }

  useEffect(() => {
    const t = setTimeout(() => setBarsMounted(true), 180)
    return () => clearTimeout(t)
  }, [tab, subTab])

  const TABS: { id: LeftTab; label: string; tooltip: string }[] = [
    { id: 'actividad',  label: 'Actividad',  tooltip: 'Muestra la cantidad de entradas al radio y clics registrados por punto.' },
    { id: 'conversion', label: 'Conversión', tooltip: 'Porcentaje de usuarios que hicieron clic en la experiencia después de entrar al radio de activación.' },
    { id: 'publico',    label: 'Público',    tooltip: 'Distribución geográfica de las personas que ingresaron al radio de activación.' },
    { id: 'horarios',   label: 'Horarios',   tooltip: 'Horarios y días en que los usuarios ingresaron físicamente a los radios de activación.' },
  ]

  const sorted = byPoint ?? []
  const byEnt  = [...sorted].sort((a, b) => b.radiusEntries - a.radiusEntries).slice(0, 6)
  const byClk  = [...sorted].sort((a, b) => b.clicks        - a.clicks).slice(0, 6)
  const byConv = [...sorted].sort((a, b) => b.conversion    - a.conversion).slice(0, 6)

  const actRows = subTab === 'entradas' ? byEnt : byClk
  const actMax  = subTab === 'entradas'
    ? Math.max(...byEnt.map(p => p.radiusEntries), 1)
    : Math.max(...byClk.map(p => p.clicks), 1)
  const convMax = Math.max(...byConv.map(p => p.conversion), 1)

  return (
    <div className="h-full flex flex-col bg-gray-900/70 border border-white/[0.07] rounded-2xl overflow-hidden">

      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-white/[0.06] overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => switchTab(t.id)}
            className={[
              'relative px-4 py-3 text-xs font-medium whitespace-nowrap transition-all duration-150',
              tab === t.id ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300',
            ].join(' ')}
          >
            <span className="inline-flex items-center">
              {t.label}
              <MetricTooltip content={t.tooltip} />
            </span>
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-400 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="flex-1 flex flex-col px-5 py-4 min-h-0"
        style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.13s ease' }}
      >

        {/* ── Actividad ── */}
        {tab === 'actividad' && (
          <>
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-semibold text-gray-200">Actividad</h3>
              <div className="flex gap-px bg-gray-800 rounded-lg p-0.5">
                {(['entradas', 'clics'] as SubTab[]).map(s => (
                  <button
                    key={s}
                    onClick={() => switchSubTab(s)}
                    className={[
                      'px-2.5 py-1 text-[11px] rounded-md transition-all duration-150 capitalize',
                      subTab === s ? 'bg-gray-700 text-gray-200 shadow-sm' : 'text-gray-500 hover:text-gray-400',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {sorted.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-600">Sin datos de actividad aún</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
                {actRows.map((pt, i) => (
                  <BarRow
                    key={pt.pointId}
                    label={pt.pointName}
                    value={subTab === 'entradas' ? pt.radiusEntries : pt.clicks}
                    maxValue={actMax}
                    displayValue={String(subTab === 'entradas' ? pt.radiusEntries : pt.clicks)}
                    mounted={barsMounted}
                    delay={i * 55}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Conversión ── */}
        {tab === 'conversion' && (
          <>
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-semibold text-gray-200">Conv. por punto</h3>
            </div>

            {sorted.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-600">Sin datos aún</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
                {byConv.map((pt, i) => (
                  <BarRow
                    key={pt.pointId}
                    label={pt.pointName}
                    value={pt.conversion}
                    maxValue={convMax}
                    displayValue={`${pt.conversion}%`}
                    mounted={barsMounted}
                    delay={i * 55}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Público ── */}
        {tab === 'publico' && <PublicTab projectId={projectId} pointId={pointId} />}

        {/* ── Horarios ── */}
        {tab === 'horarios' && <HorariosTab projectId={projectId} pointId={pointId} />}
      </div>
    </div>
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

function KPICard({ label, value, sub, accent, className = '' }: {
  label: string; value: string | number; sub?: string; accent?: boolean; className?: string
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
      <p className={`text-3xl sm:text-[2.625rem] font-bold tabular-nums leading-none break-all ${
        accent ? 'text-brand-300' : 'text-gray-100'
      }`}>
        {value}
      </p>
      {sub && <p className="text-[10px] sm:text-[11px] text-gray-600 leading-snug">{sub}</p>}
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

  // ── Point filter derived values ────────────────────────────────────────────
  const pointFilter: PointAnalytics | null =
    pointId && byPoint ? (byPoint.find((p) => p.pointId === pointId) ?? null) : null

  const displaySummary: ProjectAnalytics | null = pointFilter
    ? { radiusEntries: pointFilter.radiusEntries, clicks: pointFilter.clicks, conversion: pointFilter.conversion }
    : summary

  const displayByPoint = pointFilter ? [pointFilter] : byPoint

  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    setDataLoading(true); setError(false); setSummary(null); setByPoint(null)
    Promise.all([
      fetchProjectAnalytics(selectedId),
      fetchProjectAnalyticsByPoint(selectedId).catch(() => null),
    ])
      .then(([s, bp]) => { if (!cancelled) { setSummary(s); setByPoint(bp) } })
      .catch(() => { if (!cancelled) setError(true) })
      .finally(() => { if (!cancelled) setDataLoading(false) })
    return () => { cancelled = true }
  }, [selectedId, retryKey])

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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-100 shrink-0">Analytics</h1>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Mobile page header */}
        <div className="md:hidden mb-4">
          <h1 className="text-lg font-bold text-gray-100">Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">Métricas y comportamiento</p>
        </div>

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

        {/* ── Dashboard ───────────────────────────────────────────────────── */}
        {summary && displaySummary && !dataLoading && !workspaceLoading && (
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

            {/* Hero — left widget + right chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-auto lg:h-[280px]">
              <div className="lg:col-span-2 min-h-[260px] lg:min-h-0">
                <LeftWidget byPoint={displayByPoint} projectId={selectedId} pointId={pointId || undefined} />
              </div>
              <div className="lg:col-span-3 min-h-[260px] lg:min-h-0
                              bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 pt-5 pb-4">
                {displayByPoint && displayByPoint.length > 0
                  ? <RightChart byPoint={displayByPoint} />
                  : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                      <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                      </svg>
                      <p className="text-sm text-gray-600">Activá tu primer punto para ver el gráfico</p>
                    </div>
                  )
                }
              </div>
            </div>

            {/* KPI cards — 2-col on mobile (accent card full-width), 3-col on sm+ */}
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

            {/* Insights */}
            {displayByPoint !== null && !pointFilter && (
              <InsightsSection summary={displaySummary!} byPoint={displayByPoint} />
            )}

          </div>
        )}
      </div>
    </div>
  )
}
