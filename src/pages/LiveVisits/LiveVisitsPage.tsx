import { useEffect, useState } from 'react'
import { useWorkspace } from '../../hooks/useWorkspace'
import GpsIntensityMap, { mockPointIntensity } from '../../components/map/GpsIntensityMap'
import type { IntensityLevel } from '../../components/map/GpsIntensityMap'
import Spinner from '../../components/ui/Spinner'

// ── Shared live dot ───────────────────────────────────────────────────────────

function LiveDot({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'
  return (
    <span className={`relative flex ${dim} flex-shrink-0`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className={`relative inline-flex rounded-full ${dim} bg-emerald-500`} />
    </span>
  )
}

// ── Informative modal ─────────────────────────────────────────────────────────

function LiveVisitsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 space-y-5">

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <LiveDot />
            <h3 className="text-base font-semibold text-gray-100">Visitas en Vivo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 transition-colors -mt-1 -mr-1 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          Pronto podrás ver en tiempo real cuántas personas se encuentran dentro de cada zona de
          activación de tu proyecto GPS, con tendencias horarias y comparativas históricas.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm
                     font-medium rounded-lg transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

// ── Feature / marketing card ──────────────────────────────────────────────────

function LiveVisitsFeatureCard({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <LiveDot />
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-none">
          Visitas en Vivo
        </p>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium
                         bg-brand-500/10 text-brand-400 border-brand-500/20">
          Premium
        </span>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        Visualiza cuántas personas se encuentran dentro de tus zonas de activación en tiempo real
        y toma decisiones dinámicas sobre tus proyectos GPS.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gray-800/60 border border-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p className="text-3xl font-bold tabular-nums text-emerald-400 leading-none">18</p>
          <p className="text-xs text-gray-500 leading-none mt-1">personas dentro del área</p>
        </div>
        <div className="bg-gray-800/60 border border-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p className="text-3xl font-bold tabular-nums text-brand-400 leading-none">+42%</p>
          <p className="text-xs text-gray-500 leading-none mt-1">vs última hora</p>
        </div>
        <div className="bg-gray-800/60 border border-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p className="text-xl font-bold tabular-nums text-gray-200 leading-none">18:00–19:00</p>
          <p className="text-xs text-gray-500 leading-none mt-1">hora más activa</p>
        </div>
      </div>

      <div>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500
                     text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver visitas en vivo
        </button>
      </div>
    </div>
  )
}

// ── Constants ─────────────────────────────────────────────────────────────────

const INTENSITY_LABEL: Record<IntensityLevel, string> = { low: 'Baja', medium: 'Media', high: 'Alta' }
const INTENSITY_DOT:   Record<IntensityLevel, string> = {
  low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-red-500',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LiveVisitsPage() {
  const { points, loading } = useWorkspace()
  const [modalOpen, setModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  const highPoints     = points.filter((p) => mockPointIntensity(p.id) === 'high')
  const mostActiveName = highPoints[0]?.name || points[0]?.name || '—'

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <LiveDot />
          <h1 className="font-bold text-gray-100">Visitas en Vivo</h1>
          <span className="hidden sm:inline text-xs text-gray-600">
            Datos simulados · backend próximamente
          </span>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Feature / marketing card */}
        <LiveVisitsFeatureCard onOpenModal={() => setModalOpen(true)} />

        {/* ── GPS Intensity Map ─────────────────────────────────────────────── */}
        <section className="space-y-4">

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Mapa de Intensidad GPS
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
              <LiveDot size="sm" />
              En vivo
            </span>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-900/70 border border-white/[0.07] rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
                Personas activas ahora
              </p>
              <p className="text-2xl font-bold tabular-nums text-emerald-400 leading-none">18</p>
            </div>
            <div className="bg-gray-900/70 border border-white/[0.07] rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
                Zona más activa
              </p>
              <p className="text-sm font-semibold text-gray-200 leading-tight truncate">
                {mostActiveName}
              </p>
            </div>
            <div className="bg-gray-900/70 border border-white/[0.07] rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide leading-none">
                Peak hoy
              </p>
              <p className="text-sm font-semibold text-gray-200 leading-tight">34 pers · 17:45</p>
            </div>
          </div>

          {/* Map */}
          {points.length > 0 ? (
            <div className="rounded-2xl overflow-hidden border border-gray-800" style={{ height: '420px' }}>
              <GpsIntensityMap points={points} />
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 flex flex-col
                            items-center justify-center gap-3 py-20 text-center">
              <p className="text-sm text-gray-600">No hay ubicaciones configuradas en tu workspace.</p>
              <p className="text-xs text-gray-700">
                Agrega zonas GPS para ver la intensidad de visitas.
              </p>
            </div>
          )}

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
            <span className="text-[11px] text-gray-600 ml-auto">Radio máx. 1.000 m por zona</span>
          </div>

        </section>

      </main>

      {modalOpen && <LiveVisitsModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
