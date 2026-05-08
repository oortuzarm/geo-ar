import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProjectAnalytics, fetchProjectAnalyticsByPoint } from '../../lib/analytics'
import type { ProjectAnalytics, PointAnalytics } from '../../lib/analytics'
import { geoProjectsApi } from '../../services'
import type { GeoProject } from '../../types'

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
      text: 'Aún no hay datos de actividad. Compartí el link público para comenzar a registrar entradas.',
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

// ── Coming-soon placeholder ───────────────────────────────────────────────────

function ComingSoonTab({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-6">
      <div className="w-11 h-11 rounded-2xl bg-gray-800 border border-gray-700/40 flex items-center justify-center">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className="text-[11px] text-gray-700 mt-0.5">{detail}</p>
      </div>
    </div>
  )
}

// ── Left widget ───────────────────────────────────────────────────────────────

function LeftWidget({ byPoint }: { byPoint: PointAnalytics[] | null }) {
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

  const TABS: { id: LeftTab; label: string }[] = [
    { id: 'actividad',  label: 'Actividad'  },
    { id: 'conversion', label: 'Conversión' },
    { id: 'publico',    label: 'Público'    },
    { id: 'horarios',   label: 'Horarios'   },
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
            {t.label}
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

        {/* ── Coming soon ── */}
        {tab === 'publico' && (
          <ComingSoonTab label="Próximamente" detail="Distribución geográfica de visitantes" />
        )}
        {tab === 'horarios' && (
          <ComingSoonTab label="Próximamente" detail="Actividad distribuida por hora del día" />
        )}
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

function KPICard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: boolean
}) {
  return (
    <div className={[
      'rounded-2xl border px-5 py-5 flex flex-col gap-3',
      'transition-all duration-200 hover:scale-[1.01] cursor-default',
      accent
        ? 'bg-brand-600/8 border-brand-500/20 hover:border-brand-500/35 hover:bg-brand-600/12'
        : 'bg-gray-900/70 border-white/[0.07] hover:border-white/[0.14]',
    ].join(' ')}>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium leading-none">
        {label}
      </p>
      <p className={`text-[2.625rem] font-bold tabular-nums leading-none ${
        accent ? 'text-brand-300' : 'text-gray-100'
      }`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-gray-600 leading-snug">{sub}</p>}
    </div>
  )
}

// ── Points visual list ────────────────────────────────────────────────────────

function PointsSection({ byPoint }: { byPoint: PointAnalytics[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const max = Math.max(...byPoint.map(p => p.radiusEntries), 1)

  if (byPoint.length === 0) {
    return (
      <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-10 text-center">
        <p className="text-sm text-gray-600">Sin datos por punto todavía.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200">Por punto</h3>
        <span className="text-xs text-gray-600">
          {byPoint.length} punto{byPoint.length !== 1 ? 's' : ''}
        </span>
      </div>

      {byPoint.map((pt, i) => {
        const entPct   = (pt.radiusEntries / max) * 100
        const convCls  =
          pt.conversion >= 30
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : pt.conversion >= 15
            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            : 'text-gray-500 bg-gray-800/60 border-gray-700/30'

        return (
          <div
            key={pt.pointId}
            className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0
                       hover:bg-white/[0.02] transition-colors cursor-default"
            style={{
              opacity:   mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.35s ease-out ${i * 50}ms, transform 0.35s ease-out ${i * 50}ms`,
            }}
          >
            <span className="w-4 text-xs text-gray-700 tabular-nums text-right shrink-0">
              {i + 1}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate mb-1.5">
                {pt.pointName || '—'}
              </p>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-400"
                  style={{
                    width: mounted ? `${entPct}%` : '0%',
                    transition: `width 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${i * 50}ms`,
                  }}
                />
              </div>
            </div>

            <div className="text-right shrink-0 w-14">
              <p className="text-sm font-semibold tabular-nums text-gray-200">{pt.radiusEntries}</p>
              <p className="text-[10px] text-gray-600">entradas</p>
            </div>

            <div className="text-right shrink-0 w-10 hidden sm:block">
              <p className="text-sm font-semibold tabular-nums text-gray-300">{pt.clicks}</p>
              <p className="text-[10px] text-gray-600">clics</p>
            </div>

            <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full border
                              text-[11px] font-semibold tabular-nums ${convCls}`}>
              {pt.conversion}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MetricsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects,     setProjects]     = useState<GeoProject[]>([])
  const [projLoading,  setProjLoading]  = useState(true)
  const [selectedId,   setSelectedId]   = useState<string>(searchParams.get('projectId') ?? '')
  const [summary,      setSummary]      = useState<ProjectAnalytics | null>(null)
  const [byPoint,      setByPoint]      = useState<PointAnalytics[] | null>(null)
  const [dataLoading,  setDataLoading]  = useState(false)
  const [error,        setError]        = useState(false)
  const fetchedForRef = useRef<string | null>(null)

  useEffect(() => {
    geoProjectsApi.listProjects()
      .then(list => setProjects(list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))))
      .finally(() => setProjLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    if (fetchedForRef.current === selectedId && summary !== null) return
    fetchedForRef.current = selectedId
    setDataLoading(true); setError(false); setSummary(null); setByPoint(null)
    Promise.all([
      fetchProjectAnalytics(selectedId),
      fetchProjectAnalyticsByPoint(selectedId).catch(() => null),
    ])
      .then(([s, bp]) => { setSummary(s); setByPoint(bp) })
      .catch(() => setError(true))
      .finally(() => setDataLoading(false))
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  function selectProject(id: string) {
    fetchedForRef.current = null
    setSelectedId(id)
    setSearchParams(id ? { projectId: id } : {})
  }

  const selected = projects.find(p => p.id === selectedId)

  const convQuality = summary
    ? summary.conversion >= 30 ? 'Excelente'
    : summary.conversion >= 15 ? 'Saludable'
    : summary.radiusEntries > 5 ? 'Mejorable'
    : '—'
    : ''

  return (
    <div className="text-gray-100 min-h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 md:hidden shrink-0">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
          </div>

          {/* Desktop title */}
          <h1 className="hidden md:block text-xl font-bold text-gray-100 shrink-0">Métricas</h1>

          {/* Project selector */}
          {!projLoading && projects.length > 0 && (
            <select
              value={selectedId}
              onChange={e => selectProject(e.target.value)}
              className="ml-auto bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5
                         text-sm text-gray-300 max-w-[240px] w-full
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50
                         transition-all cursor-pointer"
            >
              <option value="">Elegir proyecto…</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}

          {/* Period badge */}
          <div className="flex items-center gap-2 shrink-0 bg-gray-800 border border-gray-700/60 rounded-xl px-3 py-1.5">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400 whitespace-nowrap">Todo el período</span>
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Loading projects */}
        {projLoading && (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 rounded-full border-2 border-brand-400/30 border-t-brand-400 animate-spin" />
          </div>
        )}

        {/* No projects */}
        {!projLoading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-gray-500">No hay proyectos. Crea uno en la sección Proyectos.</p>
          </div>
        )}

        {/* Pick a project */}
        {!projLoading && projects.length > 0 && !selectedId && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-300 mb-1">Seleccioná un proyecto</p>
              <p className="text-sm text-gray-600">Elegí un proyecto para ver sus métricas.</p>
            </div>
            <select
              defaultValue=""
              onChange={e => e.target.value && selectProject(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2
                         text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50
                         cursor-pointer transition-all"
            >
              <option value="" disabled>Elegir proyecto…</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Loading data */}
        {selectedId && dataLoading && <PageSkeleton />}

        {/* Error */}
        {selectedId && error && !dataLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-sm text-gray-500">No se pudieron cargar las métricas.</p>
            <button
              onClick={() => { fetchedForRef.current = null; selectProject(selectedId) }}
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* ── Dashboard ───────────────────────────────────────────────────── */}
        {summary && !dataLoading && (
          <div className="space-y-5 animate-fade-in">

            {/* Project heading */}
            {selected && (
              <div>
                <h2 className="text-2xl font-bold text-gray-100 leading-snug">{selected.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Todo el período · datos acumulados</p>
              </div>
            )}

            {/* Hero — left widget + right chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-auto lg:h-[280px]">
              <div className="lg:col-span-2 min-h-[260px] lg:min-h-0">
                <LeftWidget byPoint={byPoint} />
              </div>
              <div className="lg:col-span-3 min-h-[260px] lg:min-h-0
                              bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 pt-5 pb-4">
                {byPoint && byPoint.length > 0
                  ? <RightChart byPoint={byPoint} />
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

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-4">
              <KPICard
                label="Entradas al radio"
                value={summary.radiusEntries}
                sub="veces que un usuario entró al área de activación"
              />
              <KPICard
                label='Clics en experiencia'
                value={summary.clicks}
                sub='activaciones del botón "Ir a experiencia"'
              />
              <KPICard
                label="Conversión"
                value={`${summary.conversion}%`}
                sub={`${convQuality} · entrada → clic`}
                accent
              />
            </div>

            {/* Insights */}
            {byPoint !== null && (
              <InsightsSection summary={summary} byPoint={byPoint} />
            )}

            {/* Points list */}
            {byPoint !== null && <PointsSection byPoint={byPoint} />}

          </div>
        )}
      </div>
    </div>
  )
}
