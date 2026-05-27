import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useWorkspace } from '../../hooks/useWorkspace'
import GpsIntensityMap from '../../components/map/GpsIntensityMap'
import type { IntensityLevel } from '../../components/map/GpsIntensityMap'
import IntensityModeSelector from '../../components/map/IntensityModeSelector'
import type { IntensityMode } from '../../components/map/IntensityModeSelector'
import Spinner from '../../components/ui/Spinner'
import { fetchLiveVisits, fetchHistoricalIntensity } from '../../services/liveVisitsApi'
import type { LiveVisitsResponse } from '../../services/liveVisitsApi'
import { intensityFromCount } from '../../utils/liveVisits'

// vsLastHour remains mocked until the backend provides trend data.
function mockVsLastHour(pointId: string): string {
  const sum = pointId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const pct = 10 + (sum % 45)
  return sum % 4 === 0 ? `-${pct}%` : `+${pct}%`
}

// ── Shared components ─────────────────────────────────────────────────────────

function LiveDot({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'
  return (
    <span className={`relative flex ${dim} flex-shrink-0`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className={`relative inline-flex rounded-full ${dim} bg-emerald-500`} />
    </span>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</p>
  )
}

function StatTile({
  label, value, valueClass = 'text-2xl text-gray-100', hint,
}: {
  label:       string
  value:       string | number
  valueClass?: string
  hint?:       string
}) {
  return (
    <div className="bg-gray-900/70 border border-white/[0.07] rounded-xl px-4 py-3.5 flex flex-col gap-1.5">
      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
        {label}
      </p>
      <p className={`font-bold tabular-nums leading-none ${valueClass}`}>{value}</p>
      {hint && (
        <p className="text-[10px] text-gray-600 leading-none">{hint}</p>
      )}
    </div>
  )
}

// ── Intensity badge (for live-mode ranked list) ───────────────────────────────

const INTENSITY_BADGE: Record<IntensityLevel, string> = {
  low:    'bg-green-500/10  text-green-400  border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high:   'bg-red-500/10   text-red-400    border-red-500/20',
}
const INTENSITY_LABEL: Record<IntensityLevel, string> = {
  low: 'Baja', medium: 'Media', high: 'Alta',
}
// Legend dot colors match the IntensityLayer visual system (emerald → cyan).
const INTENSITY_DOT: Record<IntensityLevel, string> = {
  low:    'bg-emerald-200',
  medium: 'bg-emerald-500',
  high:   'bg-cyan-500',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LiveVisitsPage() {
  const { project, points, loading } = useWorkspace()

  const [liveData,    setLiveData]    = useState<LiveVisitsResponse | null>(null)
  const [intensityMode, setIntensityMode] = useState<IntensityMode>('live')
  const [historicalMap, setHistoricalMap] = useState<Record<string, number> | null>(null)
  const [historicalLoading, setHistoricalLoading] = useState(false)

  // Polling: fetch live data every 15 s while the page is open.
  useEffect(() => {
    if (!project?.id) return
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchLiveVisits(project!.id)
        if (!cancelled) setLiveData(data)
      } catch {
        // silently keep previous data on error
      }
    }

    load()
    const timer = setInterval(load, 15_000)
    return () => {
      cancelled = true
      clearInterval(timer)
      setLiveData(null)
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Historical: fetch once when mode is switched to 'historical'.
  useEffect(() => {
    if (!project?.id || intensityMode !== 'historical') { setHistoricalMap(null); return }
    let cancelled = false
    setHistoricalLoading(true)

    fetchHistoricalIntensity(project.id)
      .then((data) => {
        if (cancelled) return
        const map: Record<string, number> = {}
        data.points.forEach((p) => { map[p.id] = p.count })
        setHistoricalMap(map)
      })
      .catch(() => { /* keep null on error */ })
      .finally(() => { if (!cancelled) setHistoricalLoading(false) })

    return () => { cancelled = true }
  }, [project?.id, intensityMode]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  // Build per-point activeNow map from live API response.
  const activeNowMap: Record<string, number> = {}
  liveData?.points.forEach((p) => { activeNowMap[p.id] = p.activeNow })

  // Which data drives the map depends on the current mode.
  const mapActiveNow: Record<string, number> = intensityMode === 'live'
    ? activeNowMap
    : (historicalMap ?? {})

  const ranked = points
    .map((p) => ({
      point:      p,
      people:     activeNowMap[p.id] ?? 0,
      vsLastHour: mockVsLastHour(p.id),
      intensity:  intensityFromCount(activeNowMap[p.id] ?? 0),
    }))
    .sort((a, b) => b.people - a.people)

  const totalPeople  = liveData?.activeNow ?? 0
  const activeRanked = ranked.filter((r) => r.people > 0)
  const top          = activeRanked[0] ?? null

  const activeNowDisplay: string | number = liveData === null ? '—' : totalPeople

  const peakLabel = liveData?.peakToday?.label ?? null
  const peakHint  = liveData?.peakToday != null ? `${liveData.peakToday.count} registros` : undefined

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <LiveDot />
          <h1 className="font-bold text-gray-100">Visitas en Vivo</h1>
          <span className="hidden sm:inline text-xs text-gray-600">
            Actualización cada 15 s
          </span>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ── 1. General ─────────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionLabel>General</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatTile
              label="Personas activas ahora"
              value={activeNowDisplay}
              valueClass="text-2xl text-emerald-400"
            />
            <StatTile
              label="Vs última hora"
              value="+38%"
              valueClass="text-2xl text-brand-400"
            />
            <StatTile
              label="Hora más activa"
              value={peakLabel ?? 'Sin datos todavía'}
              valueClass={`text-base ${peakLabel ? 'text-gray-200' : 'text-gray-600'}`}
              hint={peakHint}
            />
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-relaxed">
            <svg className="w-3 h-3 flex-shrink-0 mt-px text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Las métricas representan dispositivos activos físicamente dentro de las áreas GPS configuradas.
            Una sesión permanece activa hasta 45 segundos después del último heartbeat recibido.
          </p>
        </section>

        {/* ── 2. Punto GPS más activo (solo cuando hay visitantes) ───────────── */}
        {top && (
          <section className="space-y-3">
            <SectionLabel>Punto GPS más activo</SectionLabel>
            <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl p-5 space-y-4">

              {/* Point name + intensity badge */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
                                 text-[10px] font-bold bg-brand-500/20 border border-brand-500/30 text-brand-400">
                  1
                </span>
                <p className="text-base font-semibold text-gray-100 truncate flex-1">
                  {top.point.name || 'Sin nombre'}
                </p>
                <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full
                                  border text-[10px] font-medium ${INTENSITY_BADGE[top.intensity]}`}>
                  {INTENSITY_LABEL[top.intensity]} actividad
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-800/60 border border-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
                    Personas en área
                  </p>
                  <p className="text-2xl font-bold tabular-nums text-emerald-400 leading-none">
                    {top.people}
                  </p>
                </div>
                <div className="bg-gray-800/60 border border-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
                    Vs última hora
                  </p>
                  <p className={`text-2xl font-bold tabular-nums leading-none ${
                    top.vsLastHour.startsWith('-') ? 'text-red-400' : 'text-brand-400'
                  }`}>
                    {top.vsLastHour}
                  </p>
                </div>
                <div className="bg-gray-800/60 border border-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
                    Horas más activas
                  </p>
                  <p className={`text-base font-bold tabular-nums leading-none ${peakLabel ? 'text-gray-200' : 'text-gray-600'}`}>
                    {peakLabel ?? 'Sin datos todavía'}
                  </p>
                  {peakHint && (
                    <p className="text-[10px] text-gray-600 leading-none">{peakHint}</p>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ── 3. Mapa de Intensidad GPS ──────────────────────────────────────── */}
        <section className="space-y-4">

          <div className="flex items-center justify-between">
            <SectionLabel>Mapa de Intensidad GPS</SectionLabel>
            <IntensityModeSelector mode={intensityMode} onChange={setIntensityMode} />
          </div>

          {points.length > 0 ? (
            <>
              <div className="relative rounded-2xl overflow-hidden border border-gray-800" style={{ height: '420px' }}>
                <GpsIntensityMap points={points} activeNow={mapActiveNow} />
                {intensityMode === 'historical' && historicalLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 backdrop-blur-sm">
                    <Spinner size="lg" />
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 flex-wrap">
                <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                  Intensidad:
                </span>
                {(['low', 'medium', 'high'] as IntensityLevel[]).map((level) => (
                  <span key={level} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className={`w-3 h-3 rounded-full ${INTENSITY_DOT[level]} opacity-80 flex-shrink-0`} />
                    {INTENSITY_LABEL[level]}
                  </span>
                ))}
                <span className="text-[11px] text-gray-600 ml-auto">
                  {intensityMode === 'historical' ? 'Últimos 7 días · relativa al máximo' : 'Radio máx. 1.000 m por zona'}
                </span>
              </div>

              {/* ── 4. Ranking de zonas ─────────────────────────────────────── */}
              <div className="space-y-2">
                <SectionLabel>Ranking de zonas activas</SectionLabel>

                {activeRanked.length > 0 ? (
                  <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl overflow-hidden">
                    {activeRanked.map(({ point, people }, idx) => (
                      <div
                        key={point.id}
                        className={`flex items-center gap-3 sm:gap-4 px-4 py-3 ${
                          idx < activeRanked.length - 1 ? 'border-b border-gray-800/60' : ''
                        }`}
                      >
                        {/* Rank badge */}
                        <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
                                          text-[10px] font-bold border ${
                          idx === 0
                            ? 'bg-brand-500/20 border-brand-500/30 text-brand-400'
                            : 'bg-gray-800 border-gray-700/60 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>

                        {/* Point name */}
                        <span className="flex-1 text-sm font-medium text-gray-200 truncate min-w-0">
                          {point.name || 'Sin nombre'}
                        </span>

                        {/* Radius */}
                        <span className="hidden sm:inline text-[11px] text-gray-600 tabular-nums flex-shrink-0">
                          {point.activationRadius} m
                        </span>

                        {/* En vivo badge */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 flex-shrink-0">
                          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                          </span>
                          En vivo
                        </span>

                        {/* People count */}
                        <span className="text-sm font-semibold text-emerald-400 tabular-nums flex-shrink-0">
                          {people} pers.
                        </span>
                      </div>
                    ))}
                  </div>
                ) : liveData !== null ? (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl px-6 py-10 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      No hay zonas activas en este momento.
                    </p>
                    <p className="text-xs text-gray-600">
                      Cuando una persona entre dentro del radio GPS de un punto, aparecerá aquí automáticamente.
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col
                            items-center justify-center gap-3 py-20 text-center">
              <p className="text-sm text-gray-600">No hay ubicaciones configuradas en tu workspace.</p>
              <p className="text-xs text-gray-700">
                Agrega zonas GPS para ver la intensidad de visitas.
              </p>
            </div>
          )}

        </section>

      </main>
    </div>
  )
}
