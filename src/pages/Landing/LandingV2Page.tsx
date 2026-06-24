import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Reveal, SectionLabel, BrowserChrome } from '../../components/landing/LandingPrimitives'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'
import { matchSolution } from '../../knowledge/solutionMatcher'

// ─── Hero ─────────────────────────────────────────────────────────────────────

const ROTATING_WORDS = [
  'clientes', 'visitantes', 'asistentes', 'colaboradores', 'ciudadanos', 'usuarios',
]

function RotatingWord() {
  const [index, setIndex] = useState(0)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2000)
    return () => clearInterval(id)
  }, [])

  const word = ROTATING_WORDS[index]

  return (
    <span className="relative inline-block" aria-live="polite">
      {/* Invisible spacer anchored to the longest word — prevents layout shift */}
      <span className="invisible pointer-events-none select-none" aria-hidden="true">
        colaboradores
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 bottom-0 flex items-center"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// @ts-ignore -- Preserved for reference, not currently used as Hero visual.
function HeroCodePanel() {
  return (
    <div className="relative">
      {/* Location badge — references location_id in request */}
      <div className="absolute -top-3 right-6 z-20 flex items-center gap-2
                      bg-[#0d1117] border border-white/[0.14] rounded-xl px-3 py-2
                      shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <svg className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <p className="text-[10px] font-bold text-white font-mono leading-none">loc_stand_principal</p>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5 leading-none">Radio activo · 150m</p>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-white/[0.10]
                      shadow-[0_4px_6px_rgba(0,0,0,0.3),0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(14,165,233,0.06)]">
        <div className="h-10 bg-[#0a0e1a] border-b border-white/[0.06] flex items-center gap-3 px-4 flex-shrink-0">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-[11px] text-slate-500 font-mono">POST /api/v1/presence/validate</span>
        </div>
        <div className="bg-[#080b14] p-6 font-mono text-[13px] leading-7 overflow-x-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600 mb-3">Request</p>
          <div className="text-white">{'{'}</div>
          <div className="pl-5">
            <span className="text-brand-400">"location_id"</span>
            <span className="text-slate-500">: </span>
            <span className="text-emerald-400">"loc_stand_principal"</span>
            <span className="text-slate-600">,</span>
          </div>
          <div className="pl-5">
            <span className="text-brand-400">"lat"</span>
            <span className="text-slate-500">: </span>
            <span className="text-amber-400">-34.6037</span>
            <span className="text-slate-600">,</span>
          </div>
          <div className="pl-5">
            <span className="text-brand-400">"lng"</span>
            <span className="text-slate-500">: </span>
            <span className="text-amber-400">-58.3816</span>
          </div>
          <div className="text-white mb-4">{'}'}</div>

          <div className="border-t border-white/[0.05] mb-4" />

          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-600">Response</p>
            <span className="text-[10px] font-bold text-emerald-400">200 OK</span>
          </div>
          <div className="text-white">{'{'}</div>
          <div className="pl-5">
            <span className="text-brand-400">"present"</span>
            <span className="text-slate-500">: </span>
            <span className="text-purple-400">true</span>
            <span className="text-slate-600">,</span>
          </div>
          <div className="pl-5">
            <span className="text-brand-400">"distance_meters"</span>
            <span className="text-slate-500">: </span>
            <span className="text-amber-400">48</span>
            <span className="text-slate-600">,</span>
          </div>
          <div className="pl-5">
            <span className="text-brand-400">"dwell_seconds"</span>
            <span className="text-slate-500">: </span>
            <span className="text-amber-400">312</span>
            <span className="text-slate-600">,</span>
          </div>
          <div className="pl-5">
            <span className="text-brand-400">"validation_result"</span>
            <span className="text-slate-500">: </span>
            <span className="text-white">{'{'}</span>
          </div>
          <div className="pl-10">
            <span className="text-brand-400">"valid"</span>
            <span className="text-slate-500">: </span>
            <span className="text-purple-400">true</span>
            <span className="text-slate-600">,</span>
          </div>
          <div className="pl-10">
            <span className="text-brand-400">"checks"</span>
            <span className="text-slate-500">: </span>
            <span className="text-emerald-400">["dwell_time", "schedule", "capacity"]</span>
          </div>
          <div className="pl-5">
            <span className="text-white">{'}'}</span>
          </div>
          <div className="text-white">{'}'}</div>
        </div>
      </div>
    </div>
  )
}

function HeroVisualPanel() {
  return (
    <div className="relative w-full" style={{ paddingBottom: 48 }}>
      {/* Ambient glow behind the panel */}
      <div className="absolute -inset-20 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 85% 65% at 55% 45%, rgba(14,165,233,0.09) 0%, transparent 68%)',
      }} />

      {/* Browser + Studio screenshot */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.10]
                      shadow-[0_4px_6px_rgba(0,0,0,0.3),0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(14,165,233,0.06)]">
        <BrowserChrome url="studio.ubyca.com" />
        <div className="relative bg-[#111827] overflow-hidden" style={{ height: 410 }}>
          <img
            src="/imagen-landing-1.webp"
            alt="Studio Ubyca — presencia física en tiempo real"
            className="absolute inset-0 w-full h-full object-cover select-none"
            style={{ objectPosition: 'center top' }}
            draggable={false}
            loading="eager"
          />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, transparent 62%, rgba(5,8,16,0.82) 100%)',
          }} />
        </div>
      </div>

      {/* Floating card — visits (top right) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -right-4 top-12 hidden lg:block"
      >
        <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.12]
                        rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Hoy</p>
          <p className="text-2xl font-black text-brand-400 leading-none">147</p>
          <p className="text-[10px] text-slate-500 mt-1">visitas activas</p>
        </div>
      </motion.div>

      {/* Floating card — locations (bottom left) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        className="absolute -left-4 bottom-10 hidden lg:block"
      >
        <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.12]
                        rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] font-bold text-emerald-400">3 ubicaciones activas</p>
          </div>
          <p className="text-[10px] text-slate-500">Última activación: hace 4 min</p>
        </div>
      </motion.div>

      {/* API mini card (bottom right) — secondary: confirms the technical layer exists */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 3.0 }}
        className="absolute -right-4 bottom-10 hidden lg:block"
      >
        <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.10]
                        rounded-xl px-3.5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <p className="text-[9px] font-mono text-slate-600 mb-2">POST /presence/validate</p>
          <div className="space-y-0.5 font-mono text-[10px]">
            <div className="flex items-center justify-between gap-5">
              <span className="text-brand-400">valid</span>
              <span className="text-purple-400">true</span>
            </div>
            <div className="flex items-center justify-between gap-5">
              <span className="text-brand-400">distance</span>
              <span className="text-amber-400">48m</span>
            </div>
            <div className="flex items-center justify-between gap-5">
              <span className="text-brand-400">latency</span>
              <span className="text-emerald-400">&lt; 80ms</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative bg-[#050810] overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 80% at 72% 50%, rgba(14,165,233,0.08) 0%, transparent 65%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 45% 55% at 12% 85%, rgba(139,92,246,0.04) 0%, transparent 60%)',
      }} />

      <div
        className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10
                   flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pt-24 pb-16 lg:py-0"
        style={{ minHeight: '100dvh' }}
      >
        {/* Left: text */}
        <div className="flex-shrink-0 w-full lg:w-[460px] xl:w-[520px] flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest
                             uppercase text-brand-400 border border-brand-500/30
                             bg-brand-500/[0.08] px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Plataforma de Presencia Física
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-black text-white tracking-tight leading-[1.04]
                       text-[2.2rem] sm:text-[2.8rem] lg:text-[3rem]"
          >
            Conoce en tiempo real dónde están tus <RotatingWord />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Presencia GPS verificada en el servidor, con reglas de negocio aplicadas en
            cada validación. Studio para visualizar y operar.
            La API para integrar en cualquier sistema.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex items-center gap-3 flex-wrap"
          >
            <a
              href="https://studio.ubyca.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                         font-semibold text-sm transition-all duration-150
                         shadow-[0_4px_24px_rgba(2,132,199,0.4)]">
              Comenzar gratis
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                         border border-white/10 text-white font-semibold text-sm
                         backdrop-blur-sm transition-all duration-150"
            >
              Ver documentación
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-10 flex items-center gap-2 flex-wrap"
          >
            {['Studio', 'REST API', 'Tiempo real', 'OpenAPI 3.1'].map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-700 select-none">·</span>}
                <span className="text-xs text-slate-600">{item}</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: Studio visual + API overlay */}
        <motion.div
          initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full min-w-0"
        >
          <HeroVisualPanel />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 7, 0], opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  )
}

// ─── Platform split ───────────────────────────────────────────────────────────

function PlatformSplitSection() {
  return (
    <section className="py-14 sm:py-20 px-5 bg-[#050810] relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <Reveal className="text-center mb-10 sm:mb-14">
          <SectionLabel>Plataforma</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.12]">
            Una plataforma.<br />Dos formas de usarla.
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">
            Ubyca tiene un único motor de presencia física.
            Studio y la API son dos interfaces distintas hacia los mismos datos en tiempo real.
          </p>
        </Reveal>

        {/* Cards + connector */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">

          {/* ── Studio card */}
          <Reveal>
            <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02]
                            p-6 sm:p-8 hover:border-white/[0.12] hover:bg-white/[0.03]
                            transition-all duration-200 flex flex-col">

              {/* Visual preview */}
              <div className="mb-6 space-y-2">
                <div className="rounded-xl bg-[#0d1117] border border-white/[0.08] px-4 py-3
                                shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Hoy</p>
                  <p className="text-2xl font-black text-brand-400 leading-none">147</p>
                  <p className="text-[10px] text-slate-500 mt-1">visitas activas</p>
                </div>
                <div className="rounded-xl bg-[#0d1117] border border-white/[0.08] px-4 py-3
                                shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <p className="text-[10px] font-bold text-emerald-400">3 ubicaciones activas</p>
                  </div>
                  <p className="text-[10px] text-slate-500">Última activación: hace 4 min</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                                bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse flex-shrink-0" />
                  <span className="text-[10px] text-slate-500 font-mono">
                    Stand principal · 11 visitantes · En vivo
                  </span>
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                Para equipos
              </p>
              <h3 className="text-xl font-black text-white mb-1.5">Studio</h3>
              <p className="text-sm font-semibold text-slate-300 mb-3">
                Visualiza y analiza sin escribir código.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                Mapas en tiempo real, dashboards de analytics y editor visual de GeoPoints.
              </p>

              <div className="space-y-1.5 mb-6 flex-1">
                {['Mapa en tiempo real', 'Analytics espaciales', 'GeoPoints y polígonos', 'Reglas de activación'].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                    <span className="text-xs text-slate-500">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="/studio"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400
                           hover:text-brand-300 transition-colors duration-150"
              >
                Explorar Studio
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </a>
            </div>
          </Reveal>

          {/* ── Center connector */}
          <div>
            {/* Desktop: vertical */}
            <div className="hidden lg:flex flex-col items-center justify-center h-full w-28 relative">
              <div
                className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 25%, rgba(255,255,255,0.07) 75%, transparent)' }}
              />
              <div className="relative z-10 flex flex-col items-center gap-2.5">
                <div className="bg-[#080b14] border border-white/[0.10] rounded-full px-3 py-1.5">
                  <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                    Mismo motor
                  </span>
                </div>
                <p className="text-[9px] text-slate-700 font-mono text-center leading-relaxed">
                  Mismos datos<br />Mismo tiempo real
                </p>
              </div>
            </div>
            {/* Mobile: horizontal */}
            <div className="lg:hidden flex items-center gap-3 my-5">
              <div
                className="flex-1 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07))' }}
              />
              <div className="bg-[#080b14] border border-white/[0.10] rounded-full px-3 py-1.5 flex-shrink-0">
                <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                  Mismo motor
                </span>
              </div>
              <div
                className="flex-1 h-px"
                style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.07))' }}
              />
            </div>
          </div>

          {/* ── API card */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-white/[0.08] bg-white/[0.02]
                            p-6 sm:p-8 hover:border-white/[0.12] hover:bg-white/[0.03]
                            transition-all duration-200 flex flex-col">

              {/* Mini code panel */}
              <div className="mb-6 rounded-xl overflow-hidden border border-white/[0.08]
                              shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                <div className="h-8 bg-[#0a0e1a] border-b border-white/[0.06] flex items-center gap-2 px-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 ml-1">POST /presence/validate</span>
                </div>
                <div className="bg-[#080b14] px-4 py-3.5 font-mono text-[11px] leading-[1.8]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-brand-400">valid</span>
                    <span className="text-purple-400">true</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-brand-400">distanceMeters</span>
                    <span className="text-amber-400">48</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-brand-400">dwellTimeMet</span>
                    <span className="text-purple-400">true</span>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center gap-2">
                    <span className="text-emerald-400 text-[10px] font-bold">&lt; 80ms</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-600 text-[10px]">REST</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-600 text-[10px]">OpenAPI 3.1</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                Para desarrolladores
              </p>
              <h3 className="text-xl font-black text-white mb-1.5">API</h3>
              <p className="text-sm font-semibold text-slate-300 mb-3">
                Integra presencia física en cualquier sistema.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                REST + JSON + OpenAPI 3.1 para validar presencia GPS, consultar ubicaciones y consumir analytics.
              </p>

              <div className="space-y-1.5 mb-6 flex-1">
                {['Presence Validation', 'Locations API', 'Analytics API', 'OpenAPI 3.1'].map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0" />
                    <span className="text-xs text-slate-500">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="/docs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400
                           hover:text-brand-300 transition-colors duration-150"
              >
                Leer documentación
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </a>
            </div>
          </Reveal>

        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </section>
  )
}

// ─── Capabilities ─────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    label: 'Detecta',
    desc: 'Define ubicaciones sobre cualquier mapa y monitorea entradas, permanencia y salidas en cada zona. Sin hardware, balizas ni infraestructura física adicional.',
    visual: (
      <div className="w-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#070a12] mb-5">
        <div className="relative h-28">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 220 112"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="220" height="112" fill="#070a12" />
            <line x1="0" y1="28" x2="220" y2="42" stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
            <line x1="0" y1="72" x2="220" y2="78" stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
            <line x1="52" y1="0" x2="48" y2="112" stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
            <line x1="150" y1="0" x2="154" y2="112" stroke="rgba(255,255,255,0.04)" strokeWidth="7" />
            <line x1="0" y1="112" x2="110" y2="0" stroke="rgba(255,255,255,0.025)" strokeWidth="4" />
            <circle
              cx="110" cy="58" r="37"
              fill="rgba(14,165,233,0.07)"
              stroke="rgba(14,165,233,0.32)"
              strokeWidth="1.5"
              strokeDasharray="5 2.5"
            />
            <circle cx="110" cy="58" r="9" fill="rgba(14,165,233,0.18)" />
            <circle cx="110" cy="58" r="4" fill="#0ea5e9" />
            <circle cx="110" cy="58" r="1.5" fill="white" />
          </svg>
          <div className="absolute top-2 left-2.5 flex items-center gap-1 bg-[#070a12]/75 rounded px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-white/50 font-mono">GeoPoint activo</span>
            <span className="text-[9px] text-slate-700 font-mono"> · Radio 150m</span>
          </div>
        </div>
        <div className="border-t border-white/[0.06] px-3 py-2.5">
          <span className="text-[10px] text-slate-600 font-mono">3 entradas · 1 salida · hoy</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Valida',
    desc: 'Cada presencia se verifica en tiempo real utilizando la ubicación autorizada por el usuario y las condiciones que hayas definido para cada ubicación.',
    visual: (
      <div className="w-full rounded-xl border border-white/[0.08] bg-[#080b14] overflow-hidden mb-5">
        <div className="px-4 py-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-brand-400 font-mono text-[11px]">"present"</span>
            <span className="text-purple-400 font-mono text-[11px] font-bold">true</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-400 font-mono text-[11px]">"distance_m"</span>
            <span className="text-amber-400 font-mono text-[11px]">48</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-400 font-mono text-[11px]">"dwell_s"</span>
            <span className="text-amber-400 font-mono text-[11px]">312</span>
          </div>
        </div>
        <div className="border-t border-white/[0.06] px-4 py-2 flex items-center justify-between">
          <span className="text-[9px] text-emerald-500/60 font-mono font-bold">200 OK</span>
          <span className="text-[9px] font-bold text-emerald-400 font-mono">&lt; 80ms</span>
        </div>
      </div>
    ),
  },
  {
    label: 'Actúa',
    desc: 'Convierte la presencia física en acciones. Activa experiencias, contenido, beneficios o integraciones cuando se cumplen las condiciones que definas.',
    visual: (
      <div className="w-full rounded-xl border border-white/[0.08] bg-[#080b14] overflow-hidden mb-5">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex-1 text-center bg-brand-500/[0.08] border border-brand-500/[0.22] rounded-lg py-2">
              <p className="text-[8px] font-bold text-brand-400 font-mono leading-tight">Ubyca</p>
              <p className="text-[7px] text-brand-400/50 font-mono">API</p>
            </div>
            <svg className="w-3 h-3 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex-1 text-center bg-white/[0.03] border border-white/[0.10] rounded-lg py-2">
              <p className="text-[8px] font-bold text-slate-400 font-mono leading-tight">Tu</p>
              <p className="text-[7px] text-slate-500 font-mono">sistema</p>
            </div>
            <svg className="w-3 h-3 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex-1 text-center bg-emerald-500/[0.08] border border-emerald-500/[0.22] rounded-lg py-2">
              <p className="text-[8px] font-bold text-emerald-400 font-mono leading-tight">Acción</p>
              <p className="text-[7px] text-emerald-400/50 font-mono">activa</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2 bg-[#060810] rounded-lg px-3 py-1.5 border border-white/[0.06]">
            <span className="text-[9px] text-slate-600 font-mono">POST /your-webhook</span>
            <span className="ml-auto text-[9px] font-bold text-emerald-400/70 font-mono">200 OK</span>
          </div>
        </div>
      </div>
    ),
  },
]

function CapabilitiesSection() {
  return (
    <section className="relative bg-[#050810] px-5 py-12 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12 sm:mb-16">
          <SectionLabel>El núcleo</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Detecta. Valida. Actúa.
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Tres capacidades que convierten coordenadas GPS en decisiones operacionales.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.label} delay={i * 0.1}>
              <div className={[
                'flex flex-col items-center text-center px-8 py-8 sm:py-0',
                i > 0 ? 'border-t border-white/[0.05] sm:border-t-0 sm:border-l sm:border-white/[0.06]' : '',
              ].join(' ')}>
                {cap.visual}
                <p className="text-[11px] font-black tracking-widest uppercase text-brand-400 mb-3">
                  {cap.label}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
                  {cap.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    title: 'Define tus ubicaciones',
    desc: 'Define GeoPoints, radios y polígonos sobre el mapa. Cada ubicación puede tener reglas de horario, cupos y tiempo mínimo de permanencia.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Ubyca valida la presencia',
    desc: 'Las coordenadas se contrastan en tiempo real contra tus GeoPoints activos. El resultado indica presencia válida, ubicación identificada y permanencia acumulada.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Actúa sobre el resultado en tiempo real',
    desc: 'Visualiza los resultados en Studio o intégralos vía API. Cada validación incluye presencia confirmada y condiciones cumplidas.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

function HowItWorksSection() {
  return (
    <section id="v2-how" className="py-16 sm:py-20 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060d1c 55%, #050810 100%)' }}>
      <div className="max-w-5xl mx-auto">

        <Reveal className="text-center mb-14 sm:mb-20">
          <SectionLabel>El flujo</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Sin instalaciones. Sin hardware. Sin semanas de espera.
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Ubyca funciona desde el primer request. No hay integración de meses ni agentes físicos que instalar.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="relative">
          {/* Desktop: horizontal connector */}
          <div className="hidden lg:block absolute top-[2.75rem] left-[calc(100%/6+1.5rem)] right-[calc(100%/6+1.5rem)] h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(14,165,233,0.18) 15%, rgba(14,165,233,0.18) 85%, transparent)' }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
            {HOW_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="flex lg:flex-col lg:items-center gap-5 lg:gap-0 lg:text-center">
                  {/* Icon badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-[5.5rem] h-[5.5rem] rounded-2xl bg-gray-900 border border-white/[0.08]
                                    flex items-center justify-center text-brand-400
                                    shadow-[0_0_0_1px_rgba(14,165,233,0.05),0_8px_28px_rgba(0,0,0,0.45)]">
                      {step.icon}
                    </div>
                    <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full
                                     bg-brand-600 border-2 border-[#060d1c]
                                     text-white text-[10px] font-black
                                     flex items-center justify-center">
                      {i + 1}
                    </span>
                    {/* Mobile vertical connector */}
                    {i < HOW_STEPS.length - 1 && (
                      <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-full mt-1
                                      w-px h-10 bg-brand-500/[0.12]" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="lg:pt-6 lg:px-3">
                    <h3 className="font-bold text-white text-base leading-snug mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Reveal delay={0.3} className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://studio.ubyca.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                       bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                       font-semibold text-sm transition-all duration-150
                       shadow-[0_4px_24px_rgba(2,132,199,0.4)]">
            Comenzar gratis
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </a>
          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                       bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                       border border-white/10 text-white font-semibold text-sm
                       backdrop-blur-sm transition-all duration-150"
          >
            Leer documentación
          </a>
        </Reveal>

      </div>
    </section>
  )
}

// ─── Studio section ───────────────────────────────────────────────────────────

const STUDIO_FEATURES = [
  {
    title: 'Ubicaciones y GeoPoints',
    desc: 'Dibuja radios o polígonos sobre el mapa y define reglas de activación por zona.',
  },
  {
    title: 'Visitas en vivo',
    desc: 'Observa la actividad de tus usuarios en tiempo real, zona por zona.',
  },
  {
    title: 'Analytics espaciales',
    desc: 'Métricas de dwell time, flujos de entrada y conversión por ubicación.',
  },
  {
    title: 'Inteligencia espacial',
    desc: 'Identifica patrones de comportamiento y optimiza la operación de tus espacios.',
  },
]

function StudioMobilePanel() {
  return (
    <div className="relative flex items-start justify-center"
         style={{ paddingTop: 8, paddingBottom: 40 }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 65% at 45% 45%, rgba(14,165,233,0.09) 0%, transparent 68%)',
      }} />

      {/* Secondary phone — behind, desktop only */}
      <div className="relative z-0 hidden lg:block flex-shrink-0"
           style={{ width: 200, height: 400, marginTop: 36, marginRight: -50 }}>
        <div className="relative w-full h-full overflow-hidden rounded-[2.4rem]
                        border-[2.5px] border-white/[0.10]
                        shadow-[0_4px_6px_rgba(0,0,0,0.2),0_16px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(14,165,233,0.04)]">
          <img
            src="/hero-mobile.jpg"
            alt="Studio Ubyca — vista de exploración"
            className="w-full h-full object-cover select-none"
            style={{ objectPosition: 'center 65%' }}
            draggable={false}
            loading="lazy"
          />
          {/* Dim overlay reinforces secondary hierarchy */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>
      </div>

      {/* Primary phone — in front */}
      <div className="relative z-10 mt-4 flex-shrink-0" style={{ width: 250, height: 500 }}>
        <div className="w-full h-full overflow-hidden rounded-[2.8rem]
                        border-[2.5px] border-white/[0.15]
                        shadow-[0_4px_6px_rgba(0,0,0,0.3),0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(14,165,233,0.07)]">
          <img
            src="/hero-mobile.jpg"
            alt="Studio Ubyca — mapa de presencia física en terreno"
            className="w-full h-full object-cover select-none"
            style={{ objectPosition: 'center 42%' }}
            draggable={false}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

function StudioSection() {
  return (
    <section id="v2-studio" className="py-16 sm:py-20 px-5 bg-[#050810]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: copy */}
          <div>
            <Reveal>
              <SectionLabel>Studio</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Gestiona presencia física visualmente.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Crea ubicaciones, administra GeoPoints, visualiza visitas en tiempo real
                y descubre patrones espaciales desde una única interfaz.
              </p>
            </Reveal>

            {/* Feature rows — same structure as ApiSection endpoint rows */}
            <Reveal delay={0.08}>
              <div className="space-y-3 mb-8">
                {STUDIO_FEATURES.map((f) => (
                  <div key={f.title}
                    className="flex items-start gap-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]
                               px-4 py-3.5 hover:border-white/[0.10] hover:bg-white/[0.05] transition-all duration-150">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-[5px]" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-300 leading-none mb-1">{f.title}</p>
                      <p className="text-[11px] text-slate-600 leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.15}>
              <a
                href="/studio"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                           bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                           font-semibold text-sm transition-all duration-150
                           shadow-[0_4px_20px_rgba(2,132,199,0.35)]">
                Explorar Studio
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Right: mobile visual */}
          <Reveal delay={0.12}>
            <StudioMobilePanel />
          </Reveal>

        </div>
      </div>
    </section>
  )
}

// ─── API section ──────────────────────────────────────────────────────────────

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/presence/validate',
    desc: 'Valida si un usuario está presente en una ubicación.',
    scope: 'presence:validate',
    methodColor: 'text-emerald-400',
    methodBg: 'bg-emerald-500/[0.10] border-emerald-500/[0.20]',
  },
  {
    method: 'POST',
    path: '/presence/check',
    desc: 'Consulta rápida de presencia sin reglas de negocio.',
    scope: 'presence:check',
    methodColor: 'text-emerald-400',
    methodBg: 'bg-emerald-500/[0.10] border-emerald-500/[0.20]',
  },
  {
    method: 'GET',
    path: '/projects/{id}/analytics',
    desc: 'Métricas de visitas, dwell time y flujos espaciales.',
    scope: 'analytics:read',
    methodColor: 'text-brand-400',
    methodBg: 'bg-brand-500/[0.10] border-brand-500/[0.20]',
  },
  {
    method: 'GET',
    path: '/locations/{id}',
    desc: 'Devuelve geometría, radio y metadatos de un GeoPoint.',
    scope: 'locations:read',
    methodColor: 'text-brand-400',
    methodBg: 'bg-brand-500/[0.10] border-brand-500/[0.20]',
  },
]

function ApiCodePanel() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.10] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
      {/* Header bar */}
      <div className="bg-[#0d1117] border-b border-white/[0.06] px-5 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[11px] text-slate-500 font-mono">POST /api/v1/presence/validate</span>
      </div>
      {/* Code body */}
      <div className="bg-[#080b14] p-5 font-mono text-[12px] leading-7 overflow-x-auto">
        {/* Request */}
        <p className="text-slate-600 mb-1">{'// Request'}</p>
        <p><span className="text-slate-500">{'{'}</span></p>
        <p className="pl-5">
          <span className="text-brand-400">"location_id"</span>
          <span className="text-slate-500">: </span>
          <span className="text-emerald-400">"loc_stand_principal"</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-5">
          <span className="text-brand-400">"lat"</span>
          <span className="text-slate-500">: </span>
          <span className="text-amber-400">-34.603722</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-5">
          <span className="text-brand-400">"lng"</span>
          <span className="text-slate-500">: </span>
          <span className="text-amber-400">-58.381592</span>
        </p>
        <p><span className="text-slate-500">{'}'}</span></p>

        <div className="my-4 border-t border-white/[0.05]" />

        {/* Response */}
        <p className="text-slate-600 mb-1">{'// Response  200 OK'}</p>
        <p><span className="text-slate-500">{'{'}</span></p>
        <p className="pl-5">
          <span className="text-brand-400">"valid"</span>
          <span className="text-slate-500">: </span>
          <span className="text-purple-400">true</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-5">
          <span className="text-brand-400">"locationId"</span>
          <span className="text-slate-500">: </span>
          <span className="text-emerald-400">"loc_stand_principal"</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-5">
          <span className="text-brand-400">"checks"</span>
          <span className="text-slate-500">{': {'}</span>
        </p>
        <p className="pl-10">
          <span className="text-brand-400">"insideBoundary"</span>
          <span className="text-slate-500">: </span>
          <span className="text-purple-400">true</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-10">
          <span className="text-brand-400">"distanceMeters"</span>
          <span className="text-slate-500">: </span>
          <span className="text-amber-400">48</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-10">
          <span className="text-brand-400">"dwellTimeMet"</span>
          <span className="text-slate-500">: </span>
          <span className="text-purple-400">true</span>
        </p>
        <p className="pl-5"><span className="text-slate-500">{'}'}{','}</span></p>
        <p className="pl-5">
          <span className="text-brand-400">"validation_result"</span>
          <span className="text-slate-500">{': {'}</span>
        </p>
        <p className="pl-10">
          <span className="text-brand-400">"valid"</span>
          <span className="text-slate-500">: </span>
          <span className="text-purple-400">true</span>
          <span className="text-slate-500">,</span>
        </p>
        <p className="pl-10">
          <span className="text-brand-400">"checks"</span>
          <span className="text-slate-500">{': ['}</span>
          <span className="text-emerald-400">"dwell_time"</span>
          <span className="text-slate-500">, </span>
          <span className="text-emerald-400">"schedule"</span>
          <span className="text-slate-500">, </span>
          <span className="text-emerald-400">"capacity"</span>
          <span className="text-slate-500">{']'}</span>
        </p>
        <p className="pl-5"><span className="text-slate-500">{'}'}</span></p>
        <p><span className="text-slate-500">{'}'}</span></p>
      </div>
    </div>
  )
}

function ApiSection() {
  return (
    <section id="v2-api" className="py-16 sm:py-24 px-5 bg-[#050810]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: copy + endpoints */}
          <div>
            <Reveal>
              <SectionLabel>API</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Integra validación de presencia en cualquier sistema.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Integra validación GPS, reglas de disponibilidad y datos espaciales en cualquier
                sistema. REST, JSON y OpenAPI 3.1.
              </p>
            </Reveal>

            {/* Endpoint rows */}
            <Reveal delay={0.08}>
              <div className="space-y-3 mb-8">
                {ENDPOINTS.map((ep) => (
                  <div key={ep.path}
                    className="flex items-start gap-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]
                               px-4 py-3.5 hover:border-white/[0.10] hover:bg-white/[0.05] transition-all duration-150">
                    <span className={`flex-shrink-0 mt-0.5 text-[10px] font-bold font-mono px-2 py-0.5
                                     rounded border ${ep.methodBg} ${ep.methodColor}`}>
                      {ep.method}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-mono text-slate-300 leading-none mb-1 truncate">{ep.path}</p>
                      <p className="text-[11px] text-slate-600 leading-snug">{ep.desc}</p>
                    </div>
                    <span className="flex-shrink-0 ml-auto text-[9px] font-mono text-slate-700
                                     bg-white/[0.03] border border-white/[0.06] rounded px-1.5 py-0.5 whitespace-nowrap">
                      {ep.scope}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                             bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                             font-semibold text-sm transition-all duration-150
                             shadow-[0_4px_20px_rgba(2,132,199,0.35)]">
                  Ver documentación
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                  </svg>
                </a>
              </div>
              <p className="mt-5 text-sm text-slate-600">
                ¿Prefieres una interfaz visual?{' '}
                <a href="/studio"
                   className="text-slate-500 hover:text-slate-400 underline underline-offset-2
                              transition-colors duration-150">
                  Explora Studio
                </a>
              </p>
            </Reveal>
          </div>

          {/* Right: code panel */}
          <Reveal delay={0.12}>
            <ApiCodePanel />
          </Reveal>

        </div>
      </div>
    </section>
  )
}

// ─── Solution Matcher (MVP experimental) ─────────────────────────────────────

const MATCHER_EXAMPLES = [
  'Quiero verificar que mis vendedores visiten las tiendas asignadas.',
  'Quiero controlar el acceso a zonas de un evento sin usar QR.',
  'Quiero saber cuánto tiempo pasan los clientes en mi local.',
  'Quiero crear una ruta turística con contenido que se activa en cada parada.',
]


function SolutionMatcherSection() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<{ body: string; tags: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    if (query) return
    const id = setInterval(() => setPlaceholderIdx(i => (i + 1) % MATCHER_EXAMPLES.length), 3500)
    return () => clearInterval(id)
  }, [query])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/solution-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      if (!res.ok) throw new Error('api-unavailable')
      const data = await res.json()
      setResult({ body: data.answer, tags: data.capabilities })
      // TODO: posthog/gtag({ query: trimmed, matchedUseCase: data.matchedUseCase, source: data.source })
    } catch {
      // Fallback to local matcher when API is unavailable (dev mode / network error)
      const local = matchSolution(trimmed)
      setResult({ body: local.body, tags: local.tags })
      // TODO: log fallback occurrence
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 sm:py-24 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)',
      }} />

      <div className="max-w-2xl mx-auto relative">
        <Reveal className="text-center mb-10">
          <SectionLabel>Experimental</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            ¿Y esto para qué me sirve?
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Describe tu problema y te mostramos cómo Ubyca podría ayudarte.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={MATCHER_EXAMPLES[placeholderIdx]}
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-2xl px-5 py-4
                         text-white placeholder:text-slate-600 text-sm leading-relaxed
                         focus:outline-none focus:border-brand-500/50 focus:bg-white/[0.06]
                         resize-none transition-all duration-150"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-500
                           disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-[0.98] text-white font-semibold text-sm
                           transition-all duration-150 shadow-[0_4px_20px_rgba(2,132,199,0.3)]"
              >
                {loading ? 'Analizando...' : 'Ver solución'}
              </button>
            </div>
          </form>
        </Reveal>

        {result && (
          <motion.div
            key={result.body}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 p-7 rounded-2xl border border-brand-500/[0.18] bg-brand-500/[0.05]"
          >
            <p className="text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-4">
              Cómo Ubyca podría ayudarte
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">{result.body}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {result.tags.map(tag => (
                <span key={tag}
                  className="text-[11px] font-semibold text-brand-400
                             border border-brand-500/25 bg-brand-500/[0.08]
                             px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <a href="/studio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white
                           hover:text-brand-300 transition-colors duration-150">
                Explorar Studio
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// ─── Use cases ────────────────────────────────────────────────────────────────

const USE_CASES = [
  {
    icon: '🏪',
    accent: '#0ea5e9',
    title: 'Retail',
    short: 'Activa promociones dinámicas en tiendas físicas.',
    detail: 'Descuentos, beneficios y contenido exclusivo para clientes que llegan a tus puntos de venta.',
  },
  {
    icon: '🗺️',
    accent: '#8b5cf6',
    title: 'Turismo',
    short: 'Crea rutas interactivas y experiencias geolocalizadas.',
    detail: 'Guías de ciudad, rutas culturales o patrimoniales con contenido que se activa en cada parada.',
  },
  {
    icon: '🎭',
    accent: '#10b981',
    title: 'Eventos',
    short: 'Desbloquea contenido, beneficios o dinámicas según la ubicación del asistente.',
    detail: 'Acceso a programas, gymkhanas, juegos urbanos o activaciones exclusivas en zonas delimitadas.',
  },
  {
    icon: '🏫',
    accent: '#f59e0b',
    title: 'Educación',
    short: 'Transforma espacios reales en experiencias de aprendizaje contextual.',
    detail: 'Museos, campus y centros históricos con contenido interactivo que se activa en cada zona.',
  },
  {
    icon: '🏙️',
    accent: '#ef4444',
    title: 'Real Estate',
    short: 'Entrega información interactiva sobre proyectos, salas de venta o ubicaciones.',
    detail: 'Fichas técnicas, renders o formularios que se activan al llegar al proyecto.',
  },
  {
    icon: '📣',
    accent: '#f97316',
    title: 'Activaciones de Marca',
    short: 'Crea campañas físico-digitales conectadas a lugares reales.',
    detail: 'Experiencias interactivas, lanzamientos y dinámicas geolocalizadas para marcas y audiencias.',
  },
]

function UseCasesSection() {
  return (
    <section id="v2-cases" className="py-16 sm:py-20 px-5 bg-[#050810]">
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-10 sm:mb-14">
          <SectionLabel>Verticales</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Casos de uso</h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Ubyca se adapta a cualquier industria donde la ubicación importa.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {USE_CASES.map((uc, i) => (
            <Reveal key={uc.title} delay={i * 0.06}>
              <div className="group relative rounded-2xl bg-gray-900/40 border border-white/[0.06]
                              p-6 hover:border-white/[0.11] hover:bg-gray-900/60
                              transition-all duration-200 overflow-hidden h-full">
                {/* Hover accent glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${uc.accent}18 0%, transparent 70%)` }} />
                <span className="text-3xl mb-4 block">{uc.icon}</span>
                <h3 className="font-bold text-white text-base mb-2">{uc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{uc.short}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{uc.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="py-20 sm:py-24 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 65%)',
      }} />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
            Crea tu primera experiencia geolocalizada
          </h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Prueba Ubyca creando un proyecto real desde el editor.
          </p>
          <a
            href="https://studio.ubyca.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl
                       bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                       text-white font-bold text-base transition-all duration-150
                       shadow-[0_4px_32px_rgba(2,132,199,0.45)]">
            Crear experiencia gratis
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingV2Page() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const el = document.getElementById(id)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120)
  }, [])

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />
      <HeroSection />
      <PlatformSplitSection />
      <CapabilitiesSection />
      <HowItWorksSection />
      <StudioSection />
      <ApiSection />
      <UseCasesSection />
      <SolutionMatcherSection />
      <FinalCTASection />
      <SiteFooter />
    </div>
  )
}
