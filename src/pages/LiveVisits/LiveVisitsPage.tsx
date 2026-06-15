import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../hooks/useWorkspace'
import GpsIntensityMap from '../../components/map/GpsIntensityMap'
import type { IntensityLevel } from '../../components/map/GpsIntensityMap'
import IntensityModeSelector from '../../components/map/IntensityModeSelector'
import type { IntensityMode } from '../../components/map/IntensityModeSelector'
import VisualizationSelector from '../../components/maps/VisualizationSelector'
import Spinner from '../../components/ui/Spinner'
import { fetchLiveVisits, fetchOutsideSessions, fetchLiveOutsidePositions, fetchInsideOnlySessions } from '../../services/liveVisitsApi'
import type { LiveVisitsResponse } from '../../services/liveVisitsApi'
import { fetchProjectAnalyticsByPoint } from '../../lib/analytics'
import type { PeriodParams, PointAnalytics } from '../../lib/analytics'
import { fetchHotspots, fetchOutsideAreasHotspots } from '../../services/hotspotApi'
import type { HotspotPoint } from '../../services/hotspotApi'
import type { GeoPoint } from '../../types'

// ── Date helpers ──────────────────────────────────────────────────────────────

function todayISO(): string { return new Date().toISOString().slice(0, 10) }
function subtractDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// Add T12:00:00 so the date is parsed in local time, not UTC midnight.
const periodFmt = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' })
function formatPeriodLabel(from: string, to: string): string {
  const parse = (iso: string) => new Date(`${iso}T12:00:00`)
  return from === to
    ? periodFmt.format(parse(from))
    : `${periodFmt.format(parse(from))} – ${periodFmt.format(parse(to))}`
}

// ── Point visibility predicate ────────────────────────────────────────────────
//
// Live mode:      active=true → visible   |   active=false → hidden
// Historical mode: active is ignored; only createdAt matters.
//                 createdAt <= endDate → visible (point existed during period)
//                 createdAt >  endDate → hidden  (point didn't exist yet)
//
// Uses createdAt.slice(0,10) so ISO-8601 timestamps compare correctly with
// YYYY-MM-DD date strings via lexicographic order.
function isPointInPeriod(
  point:   { active: boolean; createdAt?: string },
  mode:    IntensityMode,
  endDate: string,
): boolean {
  if (mode === 'live') return point.active
  // historical: active is irrelevant — only existence during the period matters
  if (!endDate || !point.createdAt) return true
  return point.createdAt.slice(0, 10) <= endDate
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

const INTENSITY_LABEL: Record<IntensityLevel, string> = {
  low: 'Baja', medium: 'Media', high: 'Alta',
}
// Legend dot colors mirror the IntensityLayer amber ramp.
const INTENSITY_DOT: Record<IntensityLevel, string> = {
  low:    'bg-amber-200',
  medium: 'bg-amber-400',
  high:   'bg-amber-500',
}

// ── Location filter dropdown ──────────────────────────────────────────────────

function PointFilterDropdown({
  points,
  selectedId,
  onSelect,
}: {
  points:     GeoPoint[]
  selectedId: string | null
  onSelect:   (id: string | null) => void
}) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const filtered = query.trim()
    ? points.filter(p => (p.name ?? '').toLowerCase().includes(query.toLowerCase()))
    : points

  const selectedName = points.find(p => p.id === selectedId)?.name ?? 'Sin nombre'

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 bg-gray-800 border border-gray-700/60
                   hover:border-gray-600 rounded-lg px-3 py-1.5 text-[11px] font-medium
                   text-gray-300 hover:text-gray-200 transition-colors"
      >
        <span className="max-w-[200px] truncate">
          {selectedId ? selectedName : 'Todas las ubicaciones'}
        </span>
        <svg
          className={`w-3 h-3 text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-64
                        bg-gray-900 border border-gray-700/60 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-800">
            <input
              autoFocus
              type="text"
              placeholder="Buscar ubicación..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5
                         text-xs text-gray-300 placeholder-gray-600
                         focus:outline-none focus:ring-1 focus:ring-brand-500
                         focus:border-transparent transition-colors"
            />
          </div>

          {/* Options */}
          <div className="overflow-y-auto max-h-48 py-1">
            <button
              type="button"
              onClick={() => { onSelect(null); setOpen(false); setQuery('') }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                !selectedId
                  ? 'text-brand-300 bg-brand-900/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              Todas las ubicaciones
            </button>

            {filtered.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => { onSelect(p.id); setOpen(false); setQuery('') }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors truncate ${
                  selectedId === p.id
                    ? 'text-brand-300 bg-brand-900/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                {p.name || 'Sin nombre'}
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="py-4 text-center text-xs text-gray-600">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LiveVisitsPage() {
  const navigate = useNavigate()
  const { project, points, loading } = useWorkspace()
  const editorUrl = project ? `/project/${project.id}` : null

  const [liveData,    setLiveData]    = useState<LiveVisitsResponse | null>(null)
  const [intensityMode, setIntensityMode] = useState<IntensityMode>('live')
  const [historicalMap, setHistoricalMap] = useState<Record<string, number> | null>(null)
  const [historicalLoading, setHistoricalLoading] = useState(false)
  const [historicalPoints, setHistoricalPoints] = useState<PointAnalytics[] | null>(null)

  // ── Layer state ──────────────────────────────────────────────────────────────
  const [showGpsIntensity,       setShowGpsIntensity]       = useState(true)
  const [showHotspots,           setShowHotspots]           = useState(false)
  const [showOutsideAreas,       setShowOutsideAreas]       = useState(false)
  const [showExclusivelyOutside, setShowExclusivelyOutside] = useState(false)
  const [showLiveOutside,        setShowLiveOutside]        = useState(false)
  const [showInsideOnly,         setShowInsideOnly]         = useState(false)

  // At least one layer must stay active.
  function handleToggleIntensity() {
    if (showGpsIntensity && !showHotspots && !showOutsideAreas && !showExclusivelyOutside && !showLiveOutside) return
    setShowGpsIntensity(v => !v)
  }
  function handleToggleHotspots() {
    if (showHotspots && !showGpsIntensity && !showOutsideAreas && !showExclusivelyOutside && !showLiveOutside) return
    setShowHotspots(v => !v)
  }
  function handleToggleOutsideAreas() {
    if (showOutsideAreas && !showGpsIntensity && !showHotspots && !showExclusivelyOutside && !showLiveOutside) return
    setShowOutsideAreas(v => !v)
  }
  function handleToggleExclusivelyOutside() {
    if (showExclusivelyOutside && !showGpsIntensity && !showHotspots && !showOutsideAreas) return
    setShowExclusivelyOutside(v => !v)
  }
  function handleToggleLiveOutside() {
    if (showLiveOutside && !showGpsIntensity && !showHotspots && !showOutsideAreas) return
    setShowLiveOutside(v => !v)
  }
  function handleToggleInsideOnly() {
    if (showInsideOnly && !showGpsIntensity && !showHotspots && !showOutsideAreas && !showExclusivelyOutside) return
    setShowInsideOnly(v => !v)
  }

  // Empty Set = all visible points selected (sentinel for "no filter active").
  const [selectedPointIds, setSelectedPointIds] = useState<Set<string>>(new Set())
  const [hotspots,              setHotspots]              = useState<HotspotPoint[] | null>(null)
  const [hotspotsLoading,       setHotspotsLoading]       = useState(false)
  const [hotspotsError,         setHotspotsError]         = useState(false)
  const [outsideAreasHotspots,        setOutsideAreasHotspots]        = useState<HotspotPoint[] | null>(null)
  const [outsideAreasLoading,         setOutsideAreasLoading]         = useState(false)
  const [exclusivelyOutsidePositions, setExclusivelyOutsidePositions] = useState<{ lat: number; lng: number }[] | null>(null)
  const [exclusivelyOutsideLoading,   setExclusivelyOutsideLoading]   = useState(false)
  const [liveOutsidePositions,        setLiveOutsidePositions]        = useState<{ lat: number; lng: number }[] | null>(null)
  const [liveOutsideLoading,          setLiveOutsideLoading]          = useState(false)
  const [insideOnlyPositions,         setInsideOnlyPositions]         = useState<{ lat: number; lng: number }[] | null>(null)
  const [insideOnlyLoading,           setInsideOnlyLoading]           = useState(false)
  const [hsDates, setHsDates] = useState<{ from: string; to: string }>(() => ({
    from: subtractDays(6),
    to:   todayISO(),
  }))

  const LIVE_MAP_VISIBLE_KEY = 'live_visits_map_visible'
  const [mapVisible, setMapVisible] = useState<boolean>(() => {
    const stored = localStorage.getItem(LIVE_MAP_VISIBLE_KEY)
    if (stored !== null) return stored === 'true'
    return true  // visible by default
  })
  function handleMapToggle() {
    setMapVisible(v => {
      const next = !v
      localStorage.setItem(LIVE_MAP_VISIBLE_KEY, String(next))
      return next
    })
  }

  const LIVE_GPS_POINTS_KEY = 'live_visits_show_gps_points'
  const [showGpsPoints, setShowGpsPoints] = useState<boolean>(() => {
    const stored = localStorage.getItem(LIVE_GPS_POINTS_KEY)
    if (stored !== null) return stored === 'true'
    return true  // show points by default
  })
  function handleGpsPointsToggle() {
    setShowGpsPoints(v => {
      const next = !v
      localStorage.setItem(LIVE_GPS_POINTS_KEY, String(next))
      return next
    })
  }

  // Polling: fetch live + period data every 15 s. Re-triggers immediately when
  // project or the selected date range changes.
  useEffect(() => {
    if (!project?.id) return
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchLiveVisits(project!.id, { from: hsDates.from, to: hsDates.to })
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
  }, [project?.id, hsDates.from, hsDates.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Historical intensity: re-fetches whenever project, mode, or period dates change.
  // Uses analytics_by_point (supports from/to) instead of historical_intensity
  // (no date filter — always returns all-time counts regardless of params).
  useEffect(() => {
    if (!project?.id || intensityMode !== 'historical') {
      setHistoricalMap(null)
      setHistoricalPoints(null)
      return
    }
    let cancelled = false
    setHistoricalLoading(true)

    const periodParams: PeriodParams | undefined =
      (hsDates.from && hsDates.to) ? { from: hsDates.from, to: hsDates.to } : undefined

    fetchProjectAnalyticsByPoint(project.id, periodParams)
      .then((pts) => {
        if (cancelled) return
        const map: Record<string, number> = {}
        pts.forEach((p) => { map[p.pointId] = p.radiusEntries })
        setHistoricalMap(map)
        setHistoricalPoints(pts)
      })
      .catch(() => { /* keep null on error */ })
      .finally(() => { if (!cancelled) setHistoricalLoading(false) })

    return () => { cancelled = true }
  }, [project?.id, intensityMode, hsDates.from, hsDates.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Hotspots: fetch for every filtered point in parallel, merge results.
  // Re-fetches when selection, mode, period dates, or point pool changes.
  useEffect(() => {
    const periodPoints = points.filter(p => isPointInPeriod(p, intensityMode, hsDates.to))
    const targets = selectedPointIds.size === 0
      ? periodPoints
      : periodPoints.filter(p => selectedPointIds.has(p.id))

    if (!showHotspots || targets.length === 0) { setHotspots(null); return }

    let cancelled = false
    setHotspotsLoading(true)
    setHotspotsError(false)

    const mode = intensityMode === 'live' ? 'live' : 'historical'
    const dateParams = mode === 'historical' ? { startDate: hsDates.from, endDate: hsDates.to } : {}

    Promise.all(
      targets.map(p =>
        fetchHotspots({ locationId: p.id, mode, ...dateParams })
          .then(res => res.data.hotspots)
          .catch(() => [] as HotspotPoint[])
      )
    )
      .then(results => { if (!cancelled) setHotspots(results.flat()) })
      .catch(() => { if (!cancelled) setHotspotsError(true) })
      .finally(() => { if (!cancelled) setHotspotsLoading(false) })

    return () => { cancelled = true }
  }, [showHotspots, selectedPointIds, points, intensityMode, hsDates.from, hsDates.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Outside areas: single project-level call (not per-location).
  // Fetches GPS clusters outside all configured GeoPoints for the current project.
  useEffect(() => {
    if (!project?.id || !showOutsideAreas) { setOutsideAreasHotspots(null); return }
    let cancelled = false
    setOutsideAreasLoading(true)

    const mode = intensityMode === 'live' ? 'live' : 'historical'
    const dateParams = mode === 'historical' ? { startDate: hsDates.from, endDate: hsDates.to } : {}

    fetchOutsideAreasHotspots({ projectId: project.id, mode, ...dateParams })
      .then(res => { if (!cancelled) setOutsideAreasHotspots(res.data.hotspots) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setOutsideAreasLoading(false) })

    return () => { cancelled = true }
  }, [showOutsideAreas, project?.id, intensityMode, hsDates.from, hsDates.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Exclusively-outside persons: only fetched in historical mode.
  useEffect(() => {
    if (!project?.id || !showExclusivelyOutside || intensityMode !== 'historical') {
      setExclusivelyOutsidePositions(null)
      return
    }
    let cancelled = false
    setExclusivelyOutsideLoading(true)

    fetchOutsideSessions(project.id, { from: hsDates.from, to: hsDates.to })
      .then(res => { if (!cancelled) setExclusivelyOutsidePositions(res.positions) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setExclusivelyOutsideLoading(false) })

    return () => { cancelled = true }
  }, [showExclusivelyOutside, project?.id, intensityMode, hsDates.from, hsDates.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Inside-only persons: fetched once per period change, only in historical mode.
  useEffect(() => {
    if (!project?.id || !showInsideOnly || intensityMode !== 'historical') {
      setInsideOnlyPositions(null)
      return
    }
    let cancelled = false
    setInsideOnlyLoading(true)

    fetchInsideOnlySessions(project.id, { from: hsDates.from, to: hsDates.to })
      .then(res => { if (!cancelled) setInsideOnlyPositions(res.positions) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setInsideOnlyLoading(false) })

    return () => { cancelled = true }
  }, [showInsideOnly, project?.id, intensityMode, hsDates.from, hsDates.to]) // eslint-disable-line react-hooks/exhaustive-deps

  // Live outside persons: polls every 15 s, only in live mode.
  useEffect(() => {
    if (!project?.id || !showLiveOutside || intensityMode !== 'live') {
      setLiveOutsidePositions(null)
      return
    }
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetchLiveOutsidePositions(project!.id)
        if (!cancelled) setLiveOutsidePositions(res.positions)
      } catch {
        // silently keep previous data on error
      } finally {
        if (!cancelled) setLiveOutsideLoading(false)
      }
    }

    setLiveOutsideLoading(true)
    load()
    const timer = setInterval(load, 15_000)
    return () => { cancelled = true; clearInterval(timer) }
  }, [showLiveOutside, project?.id, intensityMode]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  // Visible points: in historical mode, exclude points created after the period end date.
  // active=false does NOT exclude — analytics always shows all points regardless of status.
  const visiblePoints = points.filter(p => isPointInPeriod(p, intensityMode, hsDates.to))

  // Filtered points: apply the location selector (empty Set = all visible, no filter).
  const filteredPoints = selectedPointIds.size === 0
    ? visiblePoints
    : visiblePoints.filter(p => selectedPointIds.has(p.id))
  const filteredIds    = new Set(filteredPoints.map(p => p.id))

  // Build per-point maps — restricted to filtered (selected) points only.
  const activeNowMap: Record<string, number> = {}
  const deltaMap: Record<string, number | null> = {}
  const peakMap: Record<string, { label: string; count: number } | null> = {}
  liveData?.points
    .filter(p => filteredIds.has(p.id))
    .forEach((p) => {
      activeNowMap[p.id] = p.activeNow
      deltaMap[p.id]     = p.lastHourDeltaPercent
      peakMap[p.id]      = p.peakToday
    })

  // Which data drives the map depends on the current mode.
  const mapActiveNow: Record<string, number> = intensityMode === 'live'
    ? activeNowMap
    : (historicalMap ?? {})

  const ranked = filteredPoints
    .map((p) => ({
      point:                p,
      people:               activeNowMap[p.id] ?? 0,
      lastHourDeltaPercent: deltaMap[p.id] ?? null,
      peakToday:            peakMap[p.id] ?? null,
    }))
    .sort((a, b) => b.people - a.people)

  const activeRanked = ranked.filter((r) => r.people > 0)

  const peakLabel = liveData?.peakToday?.label ?? null

  return (
    <div className="text-gray-100 overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 hidden md:block">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <LiveDot />
          <h1 className="font-bold text-gray-100">Visitas en Vivo</h1>
          <span className="hidden sm:inline text-xs text-gray-600">
            Actualización cada 15 s
          </span>
          <div className="ml-auto">
            <IntensityModeSelector mode={intensityMode} onChange={setIntensityMode} />
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ── Mobile page header ─────────────────────────────────────────────── */}
        <div className="md:hidden flex items-center gap-2.5 pb-2">
          <LiveDot />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-100">Visitas en Vivo</h1>
            <p className="text-xs text-gray-500 mt-0.5">Actividad en tiempo real</p>
          </div>
          <IntensityModeSelector mode={intensityMode} onChange={setIntensityMode} />
        </div>

        {/* ── Filtro de período — solo en modo Histórico ───────────────────────── */}
        {intensityMode === 'historical' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide flex-shrink-0">
              Período:
            </span>
            <input
              type="date"
              value={hsDates.from}
              max={hsDates.to}
              onChange={e => setHsDates(d => ({ ...d, from: e.target.value }))}
              className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-2 py-1
                         text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500
                         focus:border-transparent transition-colors"
            />
            <span className="text-gray-600 text-xs">→</span>
            <input
              type="date"
              value={hsDates.to}
              min={hsDates.from}
              max={todayISO()}
              onChange={e => setHsDates(d => ({ ...d, to: e.target.value }))}
              className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg px-2 py-1
                         text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500
                         focus:border-transparent transition-colors"
            />
          </div>
        )}

        {/* ── 1. General — solo en modo En vivo ─────────────────────────────────── */}
        {intensityMode === 'live' && (
        <section className="space-y-3">
          <SectionLabel>General</SectionLabel>

          {/* Live visit breakdown: inside / outside / total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatTile
              label="En ubicaciones"
              value={liveData === null ? '—' : (liveData.liveVisitsInsideAreas ?? 0)}
              valueClass="text-2xl text-emerald-400"
              hint="Personas actualmente dentro de alguna ubicación activa."
            />
            <StatTile
              label="Fuera de ubicaciones"
              value={liveData === null ? '—' : (liveData.liveVisitsOutsideAreas ?? 0)}
              valueClass="text-2xl text-blue-400"
              hint="Personas actualmente fuera de todas las ubicaciones activas."
            />
            <StatTile
              label="Total en vivo"
              value={liveData === null ? '—' : (liveData.liveVisitsTotal ?? 0)}
              valueClass="text-2xl text-gray-100"
              hint="Suma de personas en ubicaciones y fuera de ubicaciones."
            />
          </div>

          {/* Analytics: trend + peak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatTile
              label="Vs última hora"
              value={
                liveData?.lastHourDeltaPercent != null
                  ? `${liveData.lastHourDeltaPercent > 0 ? '+' : ''}${liveData.lastHourDeltaPercent}%`
                  : '—'
              }
              valueClass={`text-2xl ${
                liveData?.lastHourDeltaPercent == null   ? 'text-gray-600'  :
                liveData.lastHourDeltaPercent  >  0     ? 'text-brand-400' :
                liveData.lastHourDeltaPercent  <  0     ? 'text-red-400'   :
                                                          'text-gray-400'
              }`}
              hint="Variación respecto al mismo indicador hace una hora."
            />
            <StatTile
              label="Hora más activa"
              value={peakLabel ?? 'Sin datos todavía'}
              valueClass={`text-base ${peakLabel ? 'text-gray-200' : 'text-gray-600'}`}
              hint="Hora con mayor cantidad de personas activas durante el día."
            />
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-relaxed">
            <svg className="w-3 h-3 flex-shrink-0 mt-px text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Las métricas en vivo muestran personas activas durante los últimos 45 segundos.
            Una persona se considera activa hasta 45 segundos después del último heartbeat recibido.
          </p>
        </section>
        )}

        {/* ── 2. Resumen del período — solo en modo Histórico ──────────────────── */}
        {intensityMode === 'historical' && (
        <section className="space-y-3">
          <div className="flex items-baseline gap-2">
            <SectionLabel>Resumen del período</SectionLabel>
            <span className="text-[11px] text-gray-600">
              {formatPeriodLabel(hsDates.from, hsDates.to)}
            </span>
          </div>

          {(() => {
            const inside  = liveData?.periodPeopleInsideAreas ?? 0
            const mixed   = liveData?.periodPeopleMixed       ?? 0
            const outside = liveData?.periodPeopleOutsideAreas ?? 0
            const total   = liveData?.periodPeopleTotal        ?? 0
            const onlyInside = inside - mixed
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatTile
                  label="Personas solo en ubicaciones"
                  value={liveData === null ? '—' : onlyInside}
                  valueClass="text-2xl text-emerald-400"
                  hint="Personas que estuvieron dentro de ubicaciones y nunca fueron detectadas fuera."
                />
                <StatTile
                  label="Personas exclusivamente fuera"
                  value={liveData === null ? '—' : outside}
                  valueClass="text-2xl text-blue-400"
                  hint="Personas detectadas durante el período que nunca ingresaron a ninguna ubicación."
                />
                <StatTile
                  label="Personas dentro y fuera"
                  value={liveData === null ? '—' : mixed}
                  valueClass="text-2xl text-violet-400"
                  hint="Personas que estuvieron tanto dentro como fuera de ubicaciones durante el período."
                />
                <StatTile
                  label="Personas totales"
                  value={liveData === null ? '—' : total}
                  valueClass="text-2xl text-gray-100"
                  hint="Total de personas únicas detectadas durante el período. Igual a la suma de las tres categorías anteriores."
                />
              </div>
            )
          })()}
        </section>
        )}

        {/* ── 3. Actividad Espacial ──────────────────────────────────────────── */}
        <section className="space-y-4">

          <div className="flex flex-wrap items-center justify-between gap-y-2 min-w-0">
            <SectionLabel>Actividad Espacial</SectionLabel>
            <div className="flex items-center gap-2 flex-wrap min-w-0 max-w-full">
              <div className="w-full max-w-full min-w-0 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
                <VisualizationSelector
                  showGpsIntensity={showGpsIntensity}
                  showHotspots={showHotspots}
                  showOutsideAreas={showOutsideAreas}
                  onToggleIntensity={handleToggleIntensity}
                  onToggleHotspots={handleToggleHotspots}
                  onToggleOutsideAreas={handleToggleOutsideAreas}
                  {...(intensityMode === 'live' ? {
                    showLiveOutside,
                    onToggleLiveOutside: handleToggleLiveOutside,
                  } : {})}
                  {...(intensityMode === 'historical' ? {
                    showInsideOnly,
                    onToggleInsideOnly: handleToggleInsideOnly,
                    showExclusivelyOutside,
                    onToggleExclusivelyOutside: handleToggleExclusivelyOutside,
                  } : {})}
                />
              </div>
              {editorUrl && (
                <button
                  onClick={() => navigate(editorUrl)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors
                             flex items-center gap-1 whitespace-nowrap"
                >
                  Ir al editor
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Layer descriptions ───────────────────────────────────────────── */}
          {(showGpsIntensity || showHotspots || showOutsideAreas || showExclusivelyOutside || showLiveOutside || showInsideOnly) && (
            <div className="flex flex-col gap-1">
              {showGpsIntensity && (
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 flex-shrink-0 mt-[3px]" />
                  <span>
                    <span className="font-medium text-gray-400">Actividad en Ubicaciones</span>
                    {' — '}
                    {intensityMode === 'live'
                      ? 'Concentración de actividad GPS dentro de las ubicaciones monitoreadas.'
                      : 'Visualiza dónde se concentró la actividad dentro de las ubicaciones configuradas durante el período.'}
                  </span>
                </p>
              )}
              {showHotspots && (
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400/70 flex-shrink-0 mt-[3px]" />
                  <span>
                    <span className="font-medium text-gray-400">Zonas Calientes</span>
                    {' — '}
                    {intensityMode === 'live'
                      ? 'Sectores donde se están registrando más accesos en este momento.'
                      : 'Sectores donde se registraron más accesos.'}
                  </span>
                </p>
              )}
              {showOutsideAreas && (
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70 flex-shrink-0 mt-[3px]" />
                  <span>
                    <span className="font-medium text-gray-400">Actividad Dentro y Fuera</span>
                    {' — '}
                    Interacciones registradas tanto dentro como fuera de los GeoPoints configurados durante el período. Permite identificar desplazamientos entre ubicaciones monitoreadas y zonas externas.
                  </span>
                </p>
              )}
              {showExclusivelyOutside && (
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70 flex-shrink-0 mt-[3px]" />
                  <span>
                    <span className="font-medium text-gray-400">Personas Exclusivamente Fuera</span>
                    {' — '}
                    Personas detectadas durante el período que nunca ingresaron a ninguna ubicación. Cada marcador representa una persona única.
                  </span>
                </p>
              )}
              {showLiveOutside && (
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70 flex-shrink-0 mt-[3px]" />
                  <span>
                    <span className="font-medium text-gray-400">Fuera de Ubicaciones</span>
                    {' — '}
                    Personas activas actualmente fuera de todas las ubicaciones configuradas. Cada marcador representa una persona activa.
                  </span>
                </p>
              )}
              {showInsideOnly && (
                <p className="flex items-start gap-1.5 text-[11px] text-gray-500 leading-snug">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 flex-shrink-0 mt-[3px]" />
                  <span>
                    <span className="font-medium text-gray-400">Personas Solo en Ubicaciones</span>
                    {' — '}
                    Personas detectadas durante el período que permanecieron siempre dentro de las ubicaciones configuradas. Cada marcador representa una persona única.
                  </span>
                </p>
              )}
            </div>
          )}

          {/* ── Location selector ──────────────────────────────────────────── */}
          {(showGpsIntensity || showHotspots) && visiblePoints.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide flex-shrink-0">
                Ubicación:
              </span>
              <PointFilterDropdown
                points={visiblePoints}
                selectedId={selectedPointIds.size === 1 ? Array.from(selectedPointIds)[0] : null}
                onSelect={id => setSelectedPointIds(id ? new Set([id]) : new Set())}
              />
            </div>
          )}

          {/* ── Secondary controls: Ocultar puntos/mapa ─────────────────────────── */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGpsPointsToggle}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              {showGpsPoints ? 'Ocultar puntos' : 'Mostrar puntos'}
            </button>
            <button
              onClick={handleMapToggle}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              {mapVisible ? 'Ocultar mapa' : 'Mostrar mapa'}
            </button>
          </div>

          {visiblePoints.length > 0 ? (
            <>
              {mapVisible && (
                <>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-800" style={{ height: '420px' }}>
                    <GpsIntensityMap
                      points={filteredPoints}
                      activeNow={mapActiveNow}
                      showPoints={showGpsPoints}
                      showIntensity={showGpsIntensity}
                      hotspots={showHotspots && hotspots ? hotspots : undefined}
                      outsideAreasHotspots={showOutsideAreas && outsideAreasHotspots ? outsideAreasHotspots : undefined}
                      exclusivelyOutsidePositions={showExclusivelyOutside && exclusivelyOutsidePositions ? exclusivelyOutsidePositions : undefined}
                      liveOutsidePositions={showLiveOutside && liveOutsidePositions ? liveOutsidePositions : undefined}
                      insideOnlyPositions={showInsideOnly && insideOnlyPositions ? insideOnlyPositions : undefined}
                    />
                    {/* Loading overlay */}
                    {((intensityMode === 'historical' && historicalLoading && showGpsIntensity) ||
                      (showHotspots && hotspotsLoading) ||
                      (showOutsideAreas && outsideAreasLoading) ||
                      (showExclusivelyOutside && exclusivelyOutsideLoading) ||
                      (showLiveOutside && liveOutsideLoading) ||
                      (showInsideOnly && insideOnlyLoading)) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 backdrop-blur-sm">
                        <Spinner size="lg" />
                      </div>
                    )}
                    {/* Hotspot empty state overlay — only when hotspots is the sole active layer */}
                    {showHotspots && !showGpsIntensity && !showOutsideAreas && !hotspotsLoading && !hotspotsError && hotspots !== null && hotspots.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm">
                        <div className="text-center px-6 space-y-1">
                          <p className="text-sm text-gray-400">Sin zonas calientes detectadas</p>
                          <p className="text-xs text-gray-600">No hay datos de posición para el período seleccionado.</p>
                        </div>
                      </div>
                    )}
                    {/* Error overlay */}
                    {showHotspots && hotspotsError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm">
                        <p className="text-sm text-red-400">No se pudieron cargar las zonas calientes.</p>
                      </div>
                    )}
                  </div>

                  {/* Legends — each shown independently when layer is active */}
                  <div className="space-y-1.5">
                    {showGpsIntensity && (
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                          Actividad en Ubicaciones:
                        </span>
                        {(['low', 'medium', 'high'] as IntensityLevel[]).map((level) => (
                          <span key={level} className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className={`w-3 h-3 rounded-full ${INTENSITY_DOT[level]} opacity-80 flex-shrink-0`} />
                            {INTENSITY_LABEL[level]}
                          </span>
                        ))}
                        <span className="text-[11px] text-gray-600 ml-auto">
                          {intensityMode === 'historical' ? 'Acumulado histórico · relativa al máximo' : 'Radio máx. 1.000 m por zona'}
                        </span>
                      </div>
                    )}
                    {showHotspots && (
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                          Zonas Calientes:
                        </span>
                        {[
                          { color: 'bg-orange-500', label: 'Baja'     },
                          { color: 'bg-green-500',  label: 'Media'    },
                          { color: 'bg-yellow-500', label: 'Alta'     },
                          { color: 'bg-red-500',    label: 'Muy alta' },
                        ].map(({ color, label }) => (
                          <span key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className={`w-3 h-3 rounded-full ${color} opacity-80 flex-shrink-0`} />
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {showOutsideAreas && (
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                          Dentro y Fuera:
                        </span>
                        {[
                          { color: 'bg-violet-300', label: 'Baja'     },
                          { color: 'bg-violet-400', label: 'Media'    },
                          { color: 'bg-violet-500', label: 'Alta'     },
                          { color: 'bg-violet-700', label: 'Muy alta' },
                        ].map(({ color, label }) => (
                          <span key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className={`w-3 h-3 rounded-full ${color} opacity-80 flex-shrink-0`} />
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {showExclusivelyOutside && (
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                          Excl. Fuera:
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="w-3 h-3 rounded-full bg-blue-400 opacity-80 flex-shrink-0" />
                          Persona única
                        </span>
                      </div>
                    )}
                    {showLiveOutside && (
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                          Fuera de Ubic.:
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="w-3 h-3 rounded-full bg-blue-400 opacity-80 flex-shrink-0" />
                          Persona activa
                        </span>
                      </div>
                    )}
                    {showInsideOnly && (
                      <div className="flex items-center gap-5 flex-wrap">
                        <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">
                          Solo Ubic.:
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <span className="w-3 h-3 rounded-full bg-emerald-400 opacity-80 flex-shrink-0" />
                          Persona única
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── 4a. Ranking — En vivo: zonas activas / Histórico: por período ── */}
              {intensityMode === 'live' ? (
              <div className="space-y-2">
                  <SectionLabel>Ranking de zonas activas</SectionLabel>

                  {activeRanked.length > 0 ? (
                    <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl overflow-hidden">
                      {activeRanked.map(({ point, people, lastHourDeltaPercent, peakToday }, idx) => (
                        <div
                          key={point.id}
                          className={`flex items-center gap-3 sm:gap-4 px-4 py-3 ${
                            idx < activeRanked.length - 1 ? 'border-b border-gray-800/60' : ''
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
                                            text-[10px] font-bold border ${
                            idx === 0
                              ? 'bg-brand-500/20 border-brand-500/30 text-brand-400'
                              : 'bg-gray-800 border-gray-700/60 text-gray-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">
                              {point.name || 'Sin nombre'}
                            </p>
                            <p className="text-[10px] leading-none mt-0.5 tabular-nums">
                              <span className={
                                lastHourDeltaPercent == null ? 'text-gray-600' :
                                lastHourDeltaPercent  >  0  ? 'text-brand-400' :
                                lastHourDeltaPercent  <  0  ? 'text-red-400'   : 'text-gray-500'
                              }>
                                {lastHourDeltaPercent != null
                                  ? `${lastHourDeltaPercent > 0 ? '+' : ''}${lastHourDeltaPercent}%`
                                  : '—'}
                              </span>
                              <span className="hidden sm:inline text-gray-500">
                                <span className="text-gray-700 mx-1">·</span>
                                {peakToday?.label ?? 'Sin datos todavía'}
                              </span>
                            </p>
                          </div>
                          <span className="hidden sm:inline text-[11px] text-gray-600 tabular-nums flex-shrink-0">
                            {point.activationRadius} m
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 flex-shrink-0">
                            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            En vivo
                          </span>
                          <span className="text-sm font-semibold text-emerald-400 tabular-nums flex-shrink-0">
                            {people} pers.
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : liveData !== null ? (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl px-6 py-10 text-center space-y-2">
                      <p className="text-sm text-gray-500">No hay zonas activas en este momento.</p>
                      <p className="text-xs text-gray-600">
                        Cuando una persona entre dentro del radio GPS de un punto, aparecerá aquí automáticamente.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
              <div className="space-y-2">
                <SectionLabel>Ranking del período</SectionLabel>

                {historicalLoading && !historicalPoints ? (
                  <div className="flex justify-center py-8"><Spinner size="md" /></div>
                ) : historicalPoints && historicalPoints.length > 0 ? (
                  <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl overflow-hidden">
                    {[...historicalPoints]
                      .sort((a, b) => b.radiusEntries - a.radiusEntries)
                      .map((p, idx, arr) => (
                        <div
                          key={p.pointId}
                          className={`flex items-center gap-3 sm:gap-4 px-4 py-3 ${
                            idx < arr.length - 1 ? 'border-b border-gray-800/60' : ''
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
                                            text-[10px] font-bold border ${
                            idx === 0
                              ? 'bg-brand-500/20 border-brand-500/30 text-brand-400'
                              : 'bg-gray-800 border-gray-700/60 text-gray-500'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">
                              {p.pointName || 'Sin nombre'}
                            </p>
                            {p.clicks > 0 && (
                              <p className="hidden sm:block text-[10px] text-gray-500 leading-none mt-0.5 tabular-nums">
                                {p.clicks} clics · {p.conversion}% conv.
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-gray-200 tabular-nums flex-shrink-0">
                            {p.radiusEntries} visitas
                          </span>
                        </div>
                      ))}
                  </div>
                ) : historicalPoints !== null ? (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl px-6 py-10 text-center space-y-2">
                    <p className="text-sm text-gray-500">Sin datos para el período seleccionado.</p>
                    <p className="text-xs text-gray-600">
                      Ajustá el rango de fechas para ver registros históricos.
                    </p>
                  </div>
                ) : null}
              </div>
              )}

            </>
          ) : (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col
                            items-center justify-center gap-3 py-20 text-center">
              {points.length === 0 ? (
                /* Case 1: project has no points at all */
                <>
                  <p className="text-sm text-gray-600">No hay ubicaciones creadas.</p>
                  <p className="text-xs text-gray-700">
                    Crea una ubicación en el editor para verla aquí.
                  </p>
                </>
              ) : (
                /* Case 2: points exist but none were created before the period end date */
                <>
                  <p className="text-sm text-gray-600">No hay ubicaciones en este período.</p>
                  <p className="text-xs text-gray-700">
                    Las ubicaciones actuales fueron creadas después del rango seleccionado.
                  </p>
                </>
              )}
              {editorUrl && (
                <button
                  onClick={() => navigate(editorUrl)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                             bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                             transition-all duration-150 shadow-sm"
                >
                  {points.length === 0 ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Nueva ubicación
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Ir al editor
                    </>
                  )}
                </button>
              )}
            </div>
          )}

        </section>

      </main>
    </div>
  )
}
