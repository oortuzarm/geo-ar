import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams }       from 'react-router-dom'
import { MapContainer, useMap }          from 'react-leaflet'
import type { LatLngBoundsExpression }   from 'leaflet'
import Spinner                           from '../../components/ui/Spinner'
import PlanGate                          from '../../components/ui/PlanGate'
import { usePlanFeatures }               from '../../hooks/usePlanFeatures'
import BaseMapLayer                      from '../../components/map/BaseMapLayer'
import HotspotsLayer                     from '../../components/maps/HotspotsLayer'
import IntensityModeSelector             from '../../components/map/IntensityModeSelector'
import type { IntensityMode }            from '../../components/map/IntensityModeSelector'
import { useGeoStore }                   from '../../store/geoStore'
import {
  getSmartProxy,
  fetchSmartProxyLiveVisits,
  fetchSmartProxyAnalytics,
  fetchSmartProxyHotspots,
  type SmartProxy,
  type SmartProxyAnalytics,
  type SmartProxyHotspot,
} from '../../services/smartProxiesApi'

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayISO()              { return new Date().toISOString().slice(0, 10) }
function subtractDays(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}
function fmtDwell(secs: number | null) {
  if (secs === null || secs === undefined) return '—'
  if (secs < 60) return `${secs}s`
  return `${Math.floor(secs / 60)}m ${secs % 60}s`
}

// ── KPI card ──────────────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, accent, green, className = '',
}: {
  label:      string
  value:      string | number
  sub?:       string
  accent?:    boolean
  green?:     boolean
  className?: string
}) {
  return (
    <div className={[
      'rounded-2xl border px-4 py-4 flex flex-col gap-2 min-w-0 overflow-hidden',
      'transition-all duration-200 hover:scale-[1.01] cursor-default',
      accent ? 'bg-brand-600/8 border-brand-500/20 hover:border-brand-500/35 hover:bg-brand-600/12'
             : green ? 'bg-emerald-600/8 border-emerald-500/20'
             : 'bg-gray-900/70 border-white/[0.07] hover:border-white/[0.14]',
      className,
    ].join(' ')}>
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium leading-none">
        {label}
      </p>
      <p className={[
        'font-bold text-3xl tabular-nums leading-none break-all',
        accent ? 'text-brand-300' : green ? 'text-emerald-400' : 'text-gray-100',
      ].join(' ')}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-gray-600 leading-snug">{sub}</p>}
    </div>
  )
}

// ── Live dot ──────────────────────────────────────────────────────────────────

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  )
}

// ── Map auto-fit ──────────────────────────────────────────────────────────────

function FitBoundsOnHotspots({ hotspots }: { hotspots: SmartProxyHotspot[] }) {
  const map        = useMap()
  const fittedRef  = useRef(false)

  useEffect(() => {
    if (fittedRef.current || hotspots.length === 0) return
    const bounds: LatLngBoundsExpression = hotspots.map((h) => [h.lat, h.lng] as [number, number])
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16, animate: false })
    fittedRef.current = true
  }, [hotspots.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── Proxy status badge ────────────────────────────────────────────────────────

const PROXY_STATUS_STYLES: Record<SmartProxy['proxyStatus'], string> = {
  unknown:   'bg-gray-700/40 text-gray-500 border-gray-600/30',
  supported: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  partial:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  failed:    'bg-red-500/10 text-red-400 border-red-500/20',
}
const PROXY_STATUS_LABELS: Record<SmartProxy['proxyStatus'], string> = {
  unknown: 'Sin verificar', supported: 'Compatible', partial: 'Parcial', failed: 'Error',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartProxyDetailPage() {
  const { id }       = useParams<{ id: string }>()
  const navigate     = useNavigate()
  const { addToast } = useGeoStore()
  const { canUseSmartProxies } = usePlanFeatures()

  // ── Proxy data ───────────────────────────────────────────────────────────────
  const [proxy,        setProxy]       = useState<SmartProxy | null>(null)
  const [proxyLoading, setProxyLoading] = useState(true)
  const [copied,       setCopied]      = useState(false)

  // ── Live visits (polled every 15 s) ──────────────────────────────────────────
  const [activeNow,      setActiveNow]      = useState<number | null>(null)
  const [lastHourDelta,  setLastHourDelta]  = useState<number | null>(null)
  const [peakToday,      setPeakToday]      = useState<{ label: string; count: number } | null>(null)

  // ── Analytics ────────────────────────────────────────────────────────────────
  const [analytics,        setAnalytics]        = useState<SmartProxyAnalytics | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // ── Spatial (hotspots) ───────────────────────────────────────────────────────
  const [intensityMode,  setIntensityMode]  = useState<IntensityMode>('live')
  const [hotspots,       setHotspots]       = useState<SmartProxyHotspot[]>([])
  const [hotspotsLoading, setHotspotsLoading] = useState(false)
  const [hotspotsError,  setHotspotsError]  = useState(false)
  const [hsDates, setHsDates] = useState(() => ({
    from: subtractDays(6),
    to:   todayISO(),
  }))

  // ── Load proxy ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    let cancelled = false
    setProxyLoading(true)
    getSmartProxy(id)
      .then((p) => { if (!cancelled) setProxy(p) })
      .catch(() => addToast('No se pudo cargar el Smart Proxy.', 'error'))
      .finally(() => { if (!cancelled) setProxyLoading(false) })
    return () => { cancelled = true }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Poll live visits ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    let cancelled = false
    const load = async () => {
      try {
        const lv = await fetchSmartProxyLiveVisits(id)
        if (!cancelled) {
          setActiveNow(lv.activeNow)
          setLastHourDelta(lv.lastHourDelta)
          setPeakToday(lv.peakToday)
        }
      } catch { /* keep previous value on error */ }
    }
    load()
    const timer = setInterval(load, 15_000)
    return () => { cancelled = true; clearInterval(timer) }
  }, [id])

  // ── Load analytics ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    let cancelled = false
    setAnalyticsLoading(true)
    fetchSmartProxyAnalytics(id)
      .then((a) => { if (!cancelled) setAnalytics(a) })
      .catch(() => { /* silent */ })
      .finally(() => { if (!cancelled) setAnalyticsLoading(false) })
    return () => { cancelled = true }
  }, [id])

  // ── Load hotspots ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    let cancelled = false
    setHotspotsLoading(true)
    setHotspotsError(false)

    const params = intensityMode === 'historical'
      ? { startDate: hsDates.from, endDate: hsDates.to }
      : undefined

    fetchSmartProxyHotspots(id, intensityMode === 'live' ? 'live' : 'historical', params)
      .then((r) => { if (!cancelled) setHotspots(r.hotspots) })
      .catch(() => { if (!cancelled) setHotspotsError(true) })
      .finally(() => { if (!cancelled) setHotspotsLoading(false) })

    return () => { cancelled = true }
  }, [id, intensityMode, hsDates.from, hsDates.to])

  function handleCopy() {
    if (!proxy) return
    navigator.clipboard.writeText(proxy.publicUrl)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  if (!canUseSmartProxies) {
    return (
      <PlanGate
        emoji="🔗"
        title="Smart Proxies no disponible"
        description="Esta función no está disponible en tu plan actual. Actualizá tu plan para crear y gestionar enlaces inteligentes con seguimiento."
      />
    )
  }

  if (proxyLoading) {
    return <div className="flex justify-center items-center py-32"><Spinner size="lg" /></div>
  }

  if (!proxy) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-sm text-gray-500">Smart Proxy no encontrado.</p>
        <button onClick={() => navigate('/app/smart-proxies')}
          className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
          ← Volver
        </button>
      </div>
    )
  }

  return (
    <div className="text-gray-100 min-h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/app/smart-proxies')}
            className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0"
          >
            ←
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-gray-100 truncate">{proxy.name}</h1>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0
                ${PROXY_STATUS_STYLES[proxy.proxyStatus]}`}>
                {PROXY_STATUS_LABELS[proxy.proxyStatus]}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/app/smart-proxies/${proxy.id}/edit`)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200
                       hover:bg-gray-800 rounded-lg transition-all"
          >
            Editar
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-8">

        {/* ── URL bar ────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/60 rounded-xl px-4 py-2.5">
          <span className="text-[11px] text-gray-400 font-mono truncate flex-1">{proxy.publicUrl}</span>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium transition-colors
              ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {copied ? '✓ Copiado' : 'Copiar URL'}
          </button>
          <a
            href={proxy.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-shrink-0 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Abrir →
          </a>
        </div>

        {/* ── Live section ───────────────────────────────────────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <LiveDot />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">En vivo</p>
            <span className="text-[11px] text-gray-700">· actualización cada 15 s</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <KPICard
              label="Activos ahora"
              value={activeNow ?? '—'}
              sub="sesiones activas"
              green
            />
            <KPICard
              label="Vs última hora"
              value={lastHourDelta != null ? `${lastHourDelta > 0 ? '+' : ''}${lastHourDelta}%` : '—'}
              sub="variación de sesiones"
              accent={lastHourDelta != null && lastHourDelta > 0}
            />
            <KPICard
              label="Hora más activa"
              value={peakToday?.label ?? 'Sin datos'}
              sub={peakToday ? `${peakToday.count} sesiones` : 'hoy'}
              className="col-span-2 sm:col-span-1"
            />
          </div>
        </section>

        {/* ── Analytics section ──────────────────────────────────────────────── */}
        <section className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analíticas</p>
          {analyticsLoading ? (
            <div className="flex justify-center py-8"><Spinner size="md" /></div>
          ) : analytics ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <KPICard
                label="Aperturas"
                value={analytics.openings}
                sub="veces que se abrió el proxy"
              />
              <KPICard
                label="Sesiones únicas"
                value={analytics.uniqueSessions}
                sub="visitantes distintos"
              />
              <KPICard
                label="Clics"
                value={analytics.clicks}
                sub="interacciones registradas"
              />
              <KPICard
                label="Conversión"
                value={`${analytics.conversionPct}%`}
                sub="apertura → clic"
                accent
              />
              <KPICard
                label="Permanencia prom."
                value={fmtDwell(analytics.avgDwellSeconds)}
                sub="tiempo medio en página"
              />
              <KPICard
                label="GPS obtenido"
                value={analytics.locationGranted}
                sub="usuarios con ubicación"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600 py-4">Sin datos de analíticas aún.</p>
          )}
        </section>

        {/* ── Spatial section ────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actividad Espacial</p>
            <div className="flex items-center gap-2 flex-wrap">
              <IntensityModeSelector mode={intensityMode} onChange={setIntensityMode} />
            </div>
          </div>

          {intensityMode === 'historical' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide flex-shrink-0">Período:</span>
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

          {/* Map */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-800" style={{ height: '380px' }}>
            <MapContainer
              center={[-33.4489, -70.6693]}
              zoom={11}
              maxZoom={20}
              className="w-full h-full"
              style={{ width: '100%', height: '100%', background: '#111827', zIndex: 0 }}
            >
              <BaseMapLayer styleId="toner" />
              <FitBoundsOnHotspots hotspots={hotspots} />
              {hotspots.length > 0 && <HotspotsLayer hotspots={hotspots} />}
            </MapContainer>

            {/* Loading overlay */}
            {hotspotsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 backdrop-blur-sm">
                <Spinner size="lg" />
              </div>
            )}

            {/* Empty state overlay */}
            {!hotspotsLoading && !hotspotsError && hotspots.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm pointer-events-none">
                <div className="text-center px-6 space-y-1">
                  <p className="text-sm text-gray-400">Sin datos de posición</p>
                  <p className="text-xs text-gray-600">
                    {intensityMode === 'live'
                      ? 'No hay sesiones activas con GPS en este momento.'
                      : 'Ajustá el rango de fechas para ver datos históricos.'}
                  </p>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {hotspotsError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm">
                <p className="text-sm text-red-400">No se pudo cargar el mapa.</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">Intensidad:</span>
            {[
              { color: 'bg-blue-500',   label: 'Baja'     },
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

          {/* Hotspot ranking */}
          {hotspots.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zonas más activas</p>
              <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl overflow-hidden">
                {[...hotspots]
                  .sort((a, b) => b.intensity - a.intensity)
                  .slice(0, 5)
                  .map((hs, idx) => {
                    const pct = Math.round(hs.intensity * 100)
                    const barColor =
                      hs.intensity >= 0.75 ? 'bg-red-500' :
                      hs.intensity >= 0.50 ? 'bg-yellow-500' :
                      hs.intensity >= 0.25 ? 'bg-green-500' : 'bg-blue-500'
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 sm:gap-4 px-4 py-3 ${
                          idx < Math.min(hotspots.length, 5) - 1 ? 'border-b border-gray-800/60' : ''
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center
                                          text-[10px] font-bold border ${
                          idx === 0
                            ? 'bg-orange-900/40 border-orange-700/40 text-orange-400'
                            : 'bg-gray-800 border-gray-700/60 text-gray-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium text-gray-300 min-w-0">
                          Zona #{idx + 1}
                        </span>
                        <div className="hidden sm:flex items-center gap-2 w-28 flex-shrink-0">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-gray-200 flex-shrink-0 w-10 text-right">
                          {pct}%
                        </span>
                        <span className="text-xs text-gray-600 tabular-nums flex-shrink-0">
                          {hs.count} registros
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
