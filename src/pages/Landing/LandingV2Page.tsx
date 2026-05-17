import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import LandingNavBar from '../../components/landing/LandingNavBar'

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
            Convierte ubicaciones reales en{' '}
            <span className="text-brand-400">experiencias interactivas</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Crea puntos geolocalizados, define radios de activación y permite que tus usuarios
            desbloqueen contenido, rutas, promociones o experiencias al llegar a un lugar específico.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex items-center gap-3 flex-wrap"
          >
            <Link to="/project/new"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                         font-semibold text-sm transition-all duration-150
                         shadow-[0_4px_24px_rgba(2,132,199,0.4)]">
              Crear experiencia gratis
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </Link>
            <button
              onClick={() => document.getElementById('v2-cases')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                         border border-white/10 text-white font-semibold text-sm
                         backdrop-blur-sm transition-all duration-150"
            >
              Ver casos de uso
            </button>
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

// ─── How it works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Crea un punto en el mapa',
    desc: 'Coloca uno o varios puntos GPS en cualquier lugar del mundo.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Define un radio de activación',
    desc: 'Establece el área en metros donde se activa la experiencia.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" strokeWidth={1.75} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Agrega contenido o un enlace',
    desc: 'Texto, imágenes, URL o promociones que se desbloquean al llegar.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Comparte el proyecto',
    desc: 'Una URL única. Sin apps, sin instalaciones, sin fricción.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    title: 'Los usuarios desbloquean la experiencia',
    desc: 'Al llegar al radio, el contenido se activa automáticamente.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

function HowItWorksSection() {
  return (
    <section id="v2-how" className="py-28 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060d1c 55%, #050810 100%)' }}>
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-16">
          <SectionLabel>Paso a paso</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Así funciona</h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            En minutos puedes tener una experiencia geolocalizada lista para compartir.
          </p>
        </Reveal>

        {/* Steps grid */}
        <div className="relative">
          {/* Desktop: horizontal connector line */}
          <div className="hidden lg:block absolute top-10 left-[calc(10%+2.5rem)] right-[calc(10%+2.5rem)] h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(14,165,233,0.15) 20%, rgba(14,165,233,0.15) 80%, transparent)' }} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.07}>
                {/* Mobile: timeline layout */}
                <div className="flex lg:flex-col lg:items-center gap-4 lg:gap-0 lg:text-center">
                  {/* Icon badge */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-white/[0.08]
                                    flex items-center justify-center text-brand-400
                                    shadow-[0_0_0_1px_rgba(14,165,233,0.04),0_8px_24px_rgba(0,0,0,0.4)]">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full
                                     bg-brand-600 border-2 border-[#060d1c]
                                     text-white text-[10px] font-black
                                     flex items-center justify-center">
                      {i + 1}
                    </span>
                    {/* Mobile vertical connector (between steps) */}
                    {i < STEPS.length - 1 && (
                      <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-full mt-0
                                      w-px h-10 bg-brand-500/10" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="pt-1 lg:pt-4 lg:px-1">
                    <h3 className="font-bold text-white text-sm leading-snug mb-1.5">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Editor screenshot below steps */}
        <Reveal delay={0.25} className="mt-20">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07]
                          shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <img
              src="/funciona-desktop.webp"
              alt="Editor Ubyca con mapa y puntos geolocalizados"
              className="w-full object-cover select-none"
              style={{ height: 300, objectPosition: 'center 40%' }}
              loading="lazy"
              draggable={false}
            />
            {/* Left + right + bottom fade */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: [
                'linear-gradient(to right, rgba(6,13,28,0.55) 0%, transparent 18%, transparent 82%, rgba(6,13,28,0.55) 100%)',
                'linear-gradient(to bottom, transparent 50%, rgba(6,13,28,0.85) 100%)',
              ].join(', '),
            }} />
            {/* Floating label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[11px] font-semibold text-slate-500">
                Editor de puntos GPS — Ubyca Studio
              </span>
            </div>
          </div>
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
    <section id="v2-cases" className="py-28 px-5 bg-[#050810]">
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-14">
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
    <section className="py-28 px-5"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #06101f 50%, #050810 100%)' }}>
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-14">
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

// ─── Metrics section ──────────────────────────────────────────────────────────

function WorldAsInterfaceSection() {
  return (
    <section id="v2-concept" className="py-16 lg:py-28 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060c18 55%, #050810 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 60% at 25% 55%, rgba(14,165,233,0.07) 0%, transparent 65%)',
      }} />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Screenshot — desktop only ── */}
          <Reveal className="hidden lg:block flex-1 w-full relative">
            <div className="absolute -inset-12 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(14,165,233,0.08) 0%, transparent 70%)',
            }} />

            {/* Browser chrome */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.09]
                            shadow-[0_32px_96px_rgba(0,0,0,0.7)]">
              <div className="h-10 bg-[#0d1117] border-b border-white/[0.06] flex items-center gap-3 px-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/[0.05] rounded-md px-4 py-0.5 text-[11px] text-slate-500">
                    studio.ubyca.com/project/descuentos/metrics
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ height: 420 }}>
                <div className="absolute inset-0 bg-[#0d1117]" />
                <img
                  src="/screenshot-metrics.png"
                  alt="Dashboard de métricas Ubyca"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ objectPosition: 'center top' }}
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(9,11,17,0.92))' }} />
              </div>
            </div>

            {/* Floating conversion card */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-5 top-14 hidden lg:block"
            >
              <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.12]
                              rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Conversión</p>
                <p className="text-3xl font-black text-emerald-400 leading-none">46%</p>
                <p className="text-[10px] text-slate-600 mt-1">Excelente · entrada → clic</p>
              </div>
            </motion.div>

            {/* Floating insight card */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -left-5 bottom-14 hidden lg:block"
            >
              <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.12]
                              rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-[195px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-500/30
                                  flex items-center justify-center flex-shrink-0 text-[10px]">⚡</div>
                  <p className="text-[10px] font-bold text-white">Insight automático</p>
                </div>
                <p className="text-[10px] text-emerald-400 leading-snug">
                  "Nuevo punto" — 60% conversión, mejor del proyecto
                </p>
              </div>
            </motion.div>
          </Reveal>

          {/* ── Text ── */}
          <div className="flex-shrink-0 w-full lg:w-[380px] flex flex-col items-start">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase
                               text-brand-400 border border-brand-500/30 bg-brand-500/[0.08] px-3.5 py-1.5 rounded-full">
                Analytics
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-black text-white leading-tight">
                Métricas reales.<br />Comportamiento real.
              </h2>
              <p className="mt-4 text-slate-400 text-base leading-relaxed">
                Cada entrada al área, cada clic, cada conversión — en tiempo real. Sin estimaciones, sin supuestos.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                {[
                  { v: '13',  l: 'Entradas al radio', c: 'text-white' },
                  { v: '6',   l: 'Clics en exp.',     c: 'text-brand-400' },
                  { v: '46%', l: 'Conversión',         c: 'text-emerald-400' },
                ].map((s) => (
                  <div key={s.l} className="p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] text-center">
                    <p className={`text-xl font-black leading-none ${s.c}`}>{s.v}</p>
                    <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-7 space-y-2.5">
                {[
                  'Entradas al área de activación por punto',
                  'Activaciones y clics por contenido',
                  'Análisis por horarios, días y conversiones',
                  'Insights automáticos generados en tiempo real',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="py-32 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 65%)',
      }} />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Reveal>
          <div className="w-14 h-14 rounded-2xl bg-brand-600/15 border border-brand-500/25
                          flex items-center justify-center mx-auto mb-8
                          shadow-[0_0_24px_rgba(14,165,233,0.18)]">
            <svg className="w-7 h-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
            Crea tu primera experiencia geolocalizada
          </h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Prueba Ubyca creando un proyecto real desde el editor.
          </p>
          <Link to="/project/new"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl
                       bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                       text-white font-bold text-base transition-all duration-150
                       shadow-[0_4px_32px_rgba(2,132,199,0.45)]">
            Crear experiencia gratis
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050810] py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center">
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-6 w-auto select-none"
            draggable={false}
          />
        </div>
        <p className="text-xs text-slate-700 order-last sm:order-none">©2026 - Ubyca | Todos los derechos reservados</p>
        <div className="flex items-center gap-5 flex-wrap justify-center">
          <Link to="/terms_and_conditions" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Términos y Condiciones
          </Link>
          <Link to="/privacy_policy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Política de Privacidad
          </Link>
          <Link to="/app" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            Abrir aplicación →
          </Link>
        </div>
      </div>
    </footer>
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
      <HowItWorksSection />
      <UseCasesSection />
      <DifferentialsSection />
      <WorldAsInterfaceSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
