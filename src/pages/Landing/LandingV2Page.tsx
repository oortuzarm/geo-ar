import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

// ─── Shared primitives ────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase text-brand-400 mb-4">
      {children}
    </p>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_WORDS = [
  'eventos y festivales.',
  'activaciones.',
  'ferias y stands.',
  'tiendas y retail.',
  'municipios.',
  'turismo.',
  'campus.',
  'espacios públicos.',
]

function RotatingWord() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HERO_WORDS.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="block min-h-[1.4em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block text-brand-400"
        >
          {HERO_WORDS[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function HeroSection() {
  return (
    <section className="relative bg-[#050810] overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Ambient glow */}
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
              Experiencias geolocalizadas
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-black text-white tracking-tight leading-[1.04]
                       text-[2.2rem] sm:text-[2.8rem] lg:text-[3rem]"
          >
            Desbloquea contenido geolocalizado en
            <RotatingWord />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Obtén un análisis detallado de entradas, conversiones y actividad en tiempo real
            para comprender cómo interactúan las personas con tus ubicaciones.
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
              Crear experiencia gratis
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </a>
            <a
              href="/precios"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                         border border-white/10 text-white font-semibold text-sm
                         backdrop-blur-sm transition-all duration-150"
            >
              Ver planes
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-10 flex items-center gap-5 flex-wrap"
          >
            {[['Sin app nativa', '🌐'], ['Solo una URL', '🔗'], ['GPS verificado', '📍'], ['Métricas reales', '📊']].map(
              ([label, icon]) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ),
            )}
          </motion.div>
        </div>

        {/* Right: product screenshots */}
        <motion.div
          initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full min-w-0 relative"
          style={{ paddingBottom: 48 }}
        >
          {/* Glow */}
          <div className="absolute -inset-20 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 85% 65% at 55% 45%, rgba(14,165,233,0.09) 0%, transparent 68%)',
          }} />

          {/* Desktop browser frame */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.10]
                          shadow-[0_4px_6px_rgba(0,0,0,0.3),0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(14,165,233,0.06)]">
            <div className="h-10 bg-[#111827] border-b border-white/[0.06] flex items-center gap-3 px-4 flex-shrink-0">
              <div className="flex gap-1.5 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 flex justify-center min-w-0">
                <div className="bg-white/[0.05] border border-white/[0.05] rounded-md
                                px-4 py-1 text-[11px] text-slate-500 truncate max-w-[240px]">
                  studio.ubyca.com/project/descuentos
                </div>
              </div>
            </div>
            <div className="relative bg-[#111827] overflow-hidden" style={{ height: 410 }}>
              <img
                src="/imagen-landing-1.webp"
                alt="Editor de experiencias geolocalizadas Ubyca"
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={{ objectPosition: 'center top' }}
                draggable={false}
                loading="eager"
              />
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to bottom, transparent 62%, rgba(5,8,16,0.82) 100%)',
              }} />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 backdrop-blur-sm
                              bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-sky-400">Radio de activación activo</span>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -right-6 xl:-right-10 z-20 hidden lg:block"
            style={{ width: 182, height: 400, bottom: -8 }}
          >
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-8 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(14,165,233,0.22) 0%, transparent 70%)' }} />
            <div className="w-full h-full rounded-[2.6rem] border-[3.5px] border-gray-600/70 overflow-hidden
                            shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_56px_rgba(0,0,0,0.9),0_0_28px_rgba(14,165,233,0.12)]">
              <img
                src="/hero-mobile.jpg"
                alt="Vista mobile Ubyca"
                className="w-full h-full object-cover select-none"
                style={{ objectPosition: 'center 50%', transform: 'scale(1)', transformOrigin: 'center 70%' }}
                draggable={false}
                loading="lazy"
              />
            </div>
          </motion.div>
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

// ─── Metrics band ─────────────────────────────────────────────────────────────

const METRICS = [
  {
    number: '5x',
    title:  'más interacción',
    desc:   'Las experiencias basadas en ubicación generan más interacción al activar contenido en el momento correcto.',
  },
  {
    number: '+20%',
    title:  'visitas físicas',
    desc:   'Las activaciones geolocalizadas aumentan recorridos e interacción en espacios físicos.',
  },
  {
    number: '+293%',
    title:  'aperturas',
    desc:   'El contenido contextual aumenta el engagement y las aperturas frente a experiencias tradicionales.',
  },
  {
    number: '65%',
    title:  'interacción contextual',
    desc:   'El 65% de los usuarios interactuaría con experiencias basadas en ubicación si el contenido es relevante.',
  },
]

// Border logic per index for a sm:2-col / lg:4-col grid.
// Mobile  (1 col)  — top border for all except first.
// sm      (2 cols) — left border on odd items (col 2); top border stays for row 2 items.
// lg      (4 cols) — left border on items 1-3; remove top borders.
const METRIC_BORDERS = [
  '',
  'border-t border-white/[0.05] sm:border-t-0 sm:border-l sm:border-white/[0.06]',
  'border-t border-white/[0.05]                             lg:border-t-0 lg:border-l lg:border-white/[0.06]',
  'border-t border-white/[0.05] sm:border-l sm:border-white/[0.06] lg:border-t-0',
]

function MetricsBandSection() {
  return (
    <section className="relative bg-[#050810] px-5 py-12 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.number} delay={i * 0.1}>
              <div className={[
                'flex flex-col items-center text-center px-8 py-8 sm:py-6 lg:py-0',
                METRIC_BORDERS[i],
              ].join(' ')}>
                <span className="text-[2.8rem] sm:text-[3.2rem] font-black text-brand-400 leading-none tracking-tight tabular-nums">
                  {m.number}
                </span>
                <p className="mt-3 text-sm font-semibold text-white/80">
                  {m.title}
                </p>
                <p className="mt-2.5 text-[12px] text-slate-400 leading-relaxed max-w-[240px]">
                  {m.desc}
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
    title: 'Crea ubicaciones',
    desc: 'Agrega puntos geolocalizados desde el mapa y personaliza su contenido.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Define el área de activación',
    desc: 'Configura el radio de acceso y las reglas para desbloquear contenido según ubicación.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth={1.75} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Desbloquea contenido',
    desc: 'Tus usuarios podrán acceder a promociones, rutas o contenido al llegar al lugar indicado.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
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
          <SectionLabel>Cómo funciona</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Activa contenido en lugares reales.
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Aumenta la interacción en espacios físicos utilizando contenido desbloqueable por ubicación.
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
            Comienza gratis
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </a>
          <a
            href="https://www.ubyca.com/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                       bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                       border border-white/10 text-white font-semibold text-sm
                       backdrop-blur-sm transition-all duration-150"
          >
            Hablemos
          </a>
        </Reveal>

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

// ─── Differentials ───────────────────────────────────────────────────────────

const DIFFERENTIALS = [
  {
    title: 'Sin app nativa',
    desc: 'Funciona desde el navegador. Sin instalaciones, sin fricción.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
  },
  {
    title: 'Solo una URL',
    desc: 'Un link. Sin QR obligatorio, sin descargas, sin fricción de onboarding.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: 'GPS verificado',
    desc: 'Acceso verificado en tiempo real contra la posición física del usuario.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Métricas reales',
    desc: 'Activaciones, radios y conversiones visibles en tiempo real.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Mobile first',
    desc: 'Diseñado para usarse en movimiento, desde el celular, en el lugar.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Activación contextual',
    desc: 'El contenido correcto, en el momento exacto, en el lugar preciso.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

function DifferentialsSection() {
  return (
    <section className="py-16 sm:py-20 px-5"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #06101f 50%, #050810 100%)' }}>
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-10 sm:mb-14">
          <SectionLabel>Diferenciales</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.06]">
            No es un mapa.{' '}
            <span className="text-brand-400">Es activación real.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Ubyca no muestra lugares. Activa experiencias cuando alguien llega a ellos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DIFFERENTIALS.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.055}>
              <div className="group flex items-start gap-4 p-5 rounded-2xl
                              border border-white/[0.06] bg-white/[0.01]
                              hover:border-white/[0.12] hover:bg-white/[0.03]
                              transition-all duration-200">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl
                                bg-brand-500/[0.09] border border-brand-500/[0.18]
                                flex items-center justify-center text-brand-400
                                group-hover:bg-brand-500/[0.14] transition-colors duration-200">
                  {d.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm mb-1 leading-snug">{d.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Analytics (compact bridge) ───────────────────────────────────────────────

function WorldAsInterfaceSection() {
  return (
    <section id="v2-concept" className="py-14 sm:py-20 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 55% at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 65%)',
      }} />
      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <Reveal>
          <SectionLabel>Analytics</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Mide la actividad de tus ubicaciones
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">
            Obtén información sobre entradas, conversiones y actividad en tiempo real
            para comprender cómo interactúan las personas con tus experiencias geolocalizadas.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md">
            {[
              { v: '147', l: 'Entradas',         c: 'text-white' },
              { v: '68',  l: 'Conversiones',     c: 'text-emerald-400' },
              { v: '24',  l: 'Actividad en vivo', c: 'text-brand-400' },
            ].map((s) => (
              <div key={s.l} className="py-4 px-3 rounded-xl border border-white/[0.07] bg-white/[0.02] text-center">
                <p className={`text-2xl font-black leading-none ${s.c}`}>{s.v}</p>
                <p className="text-[11px] text-slate-500 mt-2 leading-snug">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <a
            href="/studio"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold
                       text-brand-400 hover:text-brand-300 transition-colors duration-150 group"
          >
            Explorar Studio
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path fillRule="evenodd" clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </a>
        </Reveal>

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
      <MetricsBandSection />
      <HowItWorksSection />
      <UseCasesSection />
      <DifferentialsSection />
      <WorldAsInterfaceSection />
      <FinalCTASection />
      <SiteFooter />
    </div>
  )
}
