import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

// ─── Demo data ────────────────────────────────────────────────────────────────

const USE_CASES = [
  { emoji: '🗺️', title: 'Turismo Interactivo', desc: 'Rutas culturales con contenido que se activa al llegar al lugar.', color: '#0ea5e9' },
  { emoji: '🎭', title: 'Eventos',              desc: 'Experiencias en vivo donde la ubicación es la clave de acceso.', color: '#8b5cf6' },
  { emoji: '🏛️', title: 'Museos & Cultura',    desc: 'Guías inmersivas para colecciones y espacios físicos.',           color: '#10b981' },
  { emoji: '🎯', title: 'Activaciones de Marca',desc: 'Campañas físico-digitales con datos reales de comportamiento.',   color: '#f59e0b' },
  { emoji: '🎮', title: 'Gymkhanas & Juegos',   desc: 'Desafíos urbanos donde el GPS es el árbitro.',                   color: '#ef4444' },
  { emoji: '🏫', title: 'Educación',            desc: 'Aprendizaje contextual que ocurre en el espacio físico real.',    color: '#ec4899' },
]

const FEATURES = [
  { icon: '🌐', title: 'Sin app nativa',       desc: 'Todo funciona desde el navegador. Sin instalaciones, sin fricción.' },
  { icon: '🔗', title: 'Solo una URL',         desc: 'Comparte con un link. Compatible con cualquier dispositivo.' },
  { icon: '📍', title: 'GPS verificado',       desc: 'El acceso al contenido se verifica en tiempo real con la ubicación física.' },
  { icon: '📊', title: 'Métricas reales',      desc: 'Visitas, activaciones, radios y conversiones en un dashboard limpio.' },
  { icon: '📱', title: 'Mobile first',         desc: 'Diseñado para vivirse desde el celular, en movimiento, en el lugar.' },
  { icon: '⚡', title: 'Activación contextual',desc: 'El contenido correcto, en el momento exacto, en el lugar preciso.' },
]

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase
                     text-brand-400 border border-brand-500/30 bg-brand-500/[0.08] px-3.5 py-1.5 rounded-full">
      {children}
    </span>
  )
}

// ─── CSS fake-map grid (lightweight, for demo section mockups) ────────────────

function MockMap() {
  return (
    <div className="w-full h-full relative overflow-hidden" style={{
      background: '#0d1117',
      backgroundImage: [
        'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      ].join(', '),
      backgroundSize: '30px 30px',
    }}>
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        <line x1="0" y1="110" x2="400" y2="120" stroke="#1e293b" strokeWidth="9" />
        <line x1="0" y1="175" x2="400" y2="162" stroke="#1e293b" strokeWidth="5" />
        <line x1="155" y1="0" x2="138" y2="280" stroke="#1e293b" strokeWidth="7" />
        <line x1="260" y1="0" x2="278" y2="280" stroke="#1e293b" strokeWidth="4" />
      </svg>
      {/* Activation circle A */}
      <div className="absolute top-[38%] left-[36%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-20 h-20 rounded-full border-2 border-brand-500/45 bg-brand-500/[0.07]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-4 h-4 rounded-full bg-brand-500 border-2 border-white
                        shadow-[0_0_12px_#0ea5e9]" />
      </div>
      {/* Activation circle B */}
      <div className="absolute top-[66%] left-[65%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-14 h-14 rounded-full border-2 border-violet-500/40 bg-violet-500/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-3 h-3 rounded-full bg-violet-400 border-2 border-white
                        shadow-[0_0_10px_#8b5cf6]" />
      </div>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function NavBar() {
  const [open, setOpen] = useState(false)

  const scrollTo = (id: string) => {
    setOpen(false)
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-white/[0.06] bg-[#050810]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center
                            shadow-[0_0_18px_rgba(2,132,199,0.4)]">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-black text-white text-[17px] tracking-tight">Ubyca</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {[['Cómo funciona', 'how'], ['Casos de uso', 'cases'], ['Diferenciales', 'features']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400
                           hover:text-white hover:bg-white/5 transition-all duration-150">
                {label}
              </button>
            ))}
          </nav>

          <Link to="/app"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                       font-semibold text-sm transition-all duration-150
                       shadow-[0_4px_20px_rgba(2,132,199,0.35)]">
            Abrir app
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg
                       text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#050810]/96 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 space-y-1">
          {[['Cómo funciona', 'how'], ['Casos de uso', 'cases'], ['Diferenciales', 'features']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                         text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              {label}
            </button>
          ))}
          <div className="pt-2">
            <Link to="/app" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                         bg-brand-600 text-white font-semibold text-sm">
              Abrir app →
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative bg-[#050810] overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 72% 50%, rgba(14,165,233,0.07) 0%, transparent 65%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10
                      flex flex-col lg:flex-row items-center gap-12 lg:gap-10 pt-24 pb-16 lg:py-0"
        style={{ minHeight: '100dvh' }}>

        {/* ── Left: text + CTAs ─────────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-full lg:w-[440px] xl:w-[500px] flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Badge>Plataforma de experiencias GPS</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-black text-white tracking-tight leading-[1.06]
                       text-[2.1rem] sm:text-[2.6rem] lg:text-[2.8rem]"
          >
            La plataforma para crear experiencias geolocalizadas.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Crea rutas, puntos interactivos y contenido desbloqueable por ubicación.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex items-center gap-3 flex-wrap"
          >
            <Link to="/app"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                         font-semibold text-sm transition-all duration-150
                         shadow-[0_4px_24px_rgba(2,132,199,0.4)]">
              Crear experiencia
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </Link>
            <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                         bg-white/[0.06] hover:bg-white/[0.10] active:scale-[0.98]
                         border border-white/10 text-white font-semibold text-sm
                         backdrop-blur-sm transition-all duration-150">
              Cómo funciona
            </button>
          </motion.div>

          {/* Proof points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex items-center gap-5 flex-wrap"
          >
            {[['Sin app nativa', '🌐'], ['Solo una URL', '🔗'], ['GPS verificado', '📍']].map(([label, icon]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: product screenshots ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full min-w-0 relative"
          style={{ paddingBottom: 48 }}
        >
          {/* Blue glow behind the whole composition */}
          <div className="absolute -inset-20 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 85% 65% at 55% 45%, rgba(14,165,233,0.09) 0%, transparent 68%)' }} />

          {/* ── Desktop screenshot — browser chrome wrapper ─────────────────── */}
          <div className="relative rounded-2xl overflow-hidden
                          border border-white/[0.10]
                          shadow-[0_4px_6px_rgba(0,0,0,0.3),0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(14,165,233,0.06)]">

            {/* Browser title bar */}
            <div className="h-10 bg-[#111827] border-b border-white/[0.06]
                            flex items-center gap-3 px-4 flex-shrink-0">
              <div className="flex gap-1.5 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 flex justify-center min-w-0">
                <div className="bg-white/[0.05] border border-white/[0.05] rounded-md
                                px-4 py-1 text-[11px] text-slate-500 truncate max-w-[220px]">
                  studio.ubyca.com/project/descuentos
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold flex-shrink-0
                              text-emerald-400 bg-emerald-500/10 border border-emerald-500/20
                              px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Publicado
              </div>
            </div>

            {/* Screenshot body */}
            <div className="relative bg-[#111827] overflow-hidden" style={{ height: 410 }}>
              {/* Fallback grid (hidden once image loads) */}
              <div className="absolute inset-0">
                <MockMap />
              </div>

              {/* Real editor screenshot */}
              <img
                src="/hero-desktop.png"
                alt="Editor Ubyca — dashboard de experiencias geolocalizadas"
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={{ objectPosition: 'center center' }}
                draggable={false}
                loading="eager"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />

              {/* Bottom fade — creates depth and lets phone float on top cleanly */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to bottom, transparent 62%, rgba(5,8,16,0.82) 100%)',
              }} />

              {/* GPS precision chip — matches real screenshot UI */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 backdrop-blur-sm
                              bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-sky-400">Activación por GPS</span>
              </div>
            </div>
          </div>

          {/* ── Floating phone mockup ───────────────────────────────────────── */}
          <motion.div
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -right-6 xl:-right-10 z-20 hidden lg:block"
            style={{ width: 172, height: 344, bottom: -8 }}
          >
            {/* Glow under the phone */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-8 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(14,165,233,0.22) 0%, transparent 70%)' }} />

            {/* iPhone frame */}
            <div className="relative w-full h-full rounded-[2.6rem]
                            border-[3.5px] border-gray-600/70
                            overflow-hidden
                            shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_56px_rgba(0,0,0,0.9),0_0_28px_rgba(14,165,233,0.12)]"
                 style={{ background: '#0a0a0a' }}>

              {/* Real mobile screenshot — scale(1.22) zooms in so overflow-hidden
                  clips the iOS status bar (top ~5%) and browser bar (bottom ~7%)
                  transformOrigin at 42% shifts the focal point toward the map/card area */}
              <img
                src="/hero-mobile.jpg"
                alt="Vista mobile Ubyca"
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={{
                  objectPosition: 'center 50%',
                  transform: 'scale(1.22)',
                  transformOrigin: 'center 42%',
                }}
                draggable={false}
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />

              {/* Coded fallback (visible only when /hero-mobile.jpg is missing) */}
              <div className="w-full h-full flex flex-col">
                {/* Status bar */}
                <div className="relative flex items-center justify-between px-4 pt-3 flex-shrink-0">
                  <span className="text-[8px] text-white/50 font-semibold">12:21</span>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-b-2xl" />
                  <div className="flex items-center gap-1">
                    <svg className="w-2 h-2 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <div className="w-3 h-1.5 rounded-[2px] border border-white/30 overflow-hidden">
                      <div className="h-full w-4/5 bg-green-400 rounded-[1px]" />
                    </div>
                  </div>
                </div>
                {/* Map area */}
                <div className="flex-1 relative overflow-hidden">
                  <MockMap />
                  {/* GPS dot on map */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full border border-brand-500/30 bg-brand-500/[0.08]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-3 h-3 rounded-full bg-brand-400 border-2 border-white
                                    shadow-[0_0_10px_#0ea5e9]" />
                  </div>
                  {/* Location active badge */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2
                                  flex items-center gap-1 bg-black/70 backdrop-blur-sm
                                  border border-white/10 rounded-full px-2 py-0.5">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[7px] text-slate-300 font-semibold">Ubicación activa</span>
                  </div>
                </div>
                {/* Bottom sheet */}
                <div className="flex-shrink-0 bg-gray-950 rounded-t-2xl
                                border-t border-white/[0.07] px-3.5 pt-2.5 pb-4">
                  <div className="w-6 h-0.5 bg-white/15 rounded-full mx-auto mb-2.5" />
                  <p className="text-[10px] font-black text-white leading-none">20 % de descuento</p>
                  <p className="text-[8px] text-slate-500 mt-1 mb-2.5 leading-snug line-clamp-2">
                    Válido exclusivamente en este local.
                  </p>
                  <button className="w-full py-1.5 rounded-xl bg-brand-600 text-white text-[9px] font-bold">
                    Ver detalle
                  </button>
                </div>
              </div>
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

// ─── Metrics dashboard screenshot section ────────────────────────────────────

function MetricsDashboardSection() {
  return (
    <section className="py-28 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060c18 55%, #050810 100%)' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 60% at 25% 55%, rgba(14,165,233,0.07) 0%, transparent 65%)',
      }} />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Screenshot ── */}
          <Reveal className="flex-1 w-full relative">
            {/* Glow behind frame */}
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
                    app.ubyca.com/project/descuentos/metrics
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ height: 420 }}>
                {/* Fallback visible when image is missing */}
                <div className="absolute inset-0">
                  <MockMap />
                </div>
                <img
                  src="/screenshot-metrics.png"
                  alt="Dashboard de métricas Ubyca"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ objectPosition: 'center top' }}
                  draggable={false}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                {/* Bottom fade */}
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
              <Badge>Analytics</Badge>
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

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { n: '01', emoji: '🗺️', title: 'Crea tu proyecto',    desc: 'Define el área geográfica y agrega los puntos donde quieres que se active el contenido.' },
    { n: '02', emoji: '📍', title: 'Asocia contenido',    desc: 'Vincula video, audio, texto o links a cada punto. Configura el radio de activación.' },
    { n: '03', emoji: '🚀', title: 'Comparte la URL',     desc: 'Tu audiencia abre el link y el contenido se desbloquea al llegar al lugar físico.' },
  ]

  return (
    <section id="how" className="py-28 px-5 bg-[#050810]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <Badge>Cómo funciona</Badge>
          <h2 className="mt-5 text-4xl md:text-5xl font-black text-white leading-tight">
            Tres pasos. Sin fricción.
          </h2>
          <p className="mt-4 text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Desde cero hasta una experiencia geolocalizada funcionando en minutos.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="relative p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02]
                              hover:bg-white/[0.04] hover:border-white/[0.12]
                              transition-all duration-300 overflow-hidden h-full">
                <span className="absolute -top-1 right-4 text-[5rem] font-black text-white/[0.04]
                                 select-none leading-none pointer-events-none">{s.n}</span>
                <span className="text-4xl mb-5 block">{s.emoji}</span>
                <h3 className="text-base font-bold text-white mb-2.5">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Dual preview (editor + mobile) ──────────────────────────────────────────

function DualPreviewSection() {
  return (
    <section id="demo" className="py-28 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060d18 50%, #050810 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <Badge>Producto</Badge>
          <h2 className="mt-5 text-4xl md:text-5xl font-black text-white leading-tight">
            Editor poderoso.<br className="sm:hidden" /> Experiencia hermosa.
          </h2>
          <p className="mt-4 text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Una interfaz para creadores. Una experiencia de usuario para tu audiencia.
          </p>
        </Reveal>

        <Reveal>
          <div className="flex flex-col lg:flex-row gap-8 items-center">

            {/* Editor mockup */}
            <div className="w-full lg:flex-1 rounded-2xl overflow-hidden border border-white/[0.09]
                            shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
              {/* Title bar */}
              <div className="h-10 bg-gray-900 border-b border-white/[0.06] flex items-center gap-3 px-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-gray-800/80 rounded-md px-4 py-0.5 text-[11px] text-slate-500">
                    app.ubyca.com/project/arte-urbano-ba
                  </div>
                </div>
              </div>

              {/* Editor body */}
              <div className="flex bg-gray-950" style={{ height: 340 }}>
                {/* Sidebar */}
                <div className="w-52 flex-shrink-0 border-r border-white/[0.06] flex flex-col">
                  <div className="px-4 pt-4 pb-2 border-b border-white/[0.04]">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Proyecto</p>
                    <p className="text-sm font-bold text-white leading-snug">Arte Urbano BA</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold
                                    text-emerald-400 bg-emerald-500/10 border border-emerald-500/20
                                    px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Publicado
                    </div>
                  </div>
                  <div className="px-3 pt-3 space-y-0.5 flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Puntos</p>
                    {[
                      { name: 'Mural Palermo',  color: '#0ea5e9', stat: '247' },
                      { name: 'Café Histórico', color: '#8b5cf6', stat: '189' },
                      { name: 'Galería Norte',  color: '#10b981', stat: '94'  },
                    ].map((pt) => (
                      <div key={pt.name}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: pt.color, boxShadow: `0 0 6px ${pt.color}` }} />
                        <span className="text-xs text-slate-300 flex-1 min-w-0 truncate">{pt.name}</span>
                        <span className="text-[10px] text-slate-600 font-mono">{pt.stat}</span>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 w-full px-2 py-2 mt-1 rounded-lg
                                       text-xs text-slate-600 hover:text-slate-400 hover:bg-white/[0.03]
                                       transition-all">
                      <span className="text-sm leading-none font-light">+</span> Agregar punto
                    </button>
                  </div>
                </div>

                {/* Map area */}
                <div className="flex-1 relative">
                  <MockMap />
                  {/* Floating detail panel */}
                  <div className="absolute top-3 right-3 bg-gray-950/92 backdrop-blur-sm
                                  border border-white/10 rounded-xl p-3 w-40
                                  shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                    <p className="text-[10px] font-bold text-white mb-2 truncate">Mural Palermo</p>
                    <div className="space-y-1.5">
                      {[['Radio', '80m', 'text-white'], ['Visitas', '247', 'text-brand-400'], ['Activaciones', '189', 'text-emerald-400']].map(([k, v, cls]) => (
                        <div key={k} className="flex justify-between text-[10px]">
                          <span className="text-slate-500">{k}</span>
                          <span className={`font-semibold ${cls}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile phone mockup */}
            <div className="hidden lg:flex flex-col items-center flex-shrink-0">
              <div className="relative" style={{ width: 196, height: 406 }}>
                <div className="absolute inset-0 rounded-[2.6rem] border-[5px] border-gray-700/80
                                bg-gray-950 overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 pt-2.5 pb-1">
                    <span className="text-[9px] text-white/50 font-semibold">9:41</span>
                    <div className="w-14 h-4 bg-black rounded-b-xl -mt-2.5 mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
                    <div className="w-3.5 h-2 rounded-[2px] border border-white/30 overflow-hidden">
                      <div className="h-full w-4/5 bg-green-400 rounded-[1px]" />
                    </div>
                  </div>
                  {/* Map */}
                  <div style={{ height: 155 }}>
                    <MockMap />
                  </div>
                  {/* Location badge */}
                  <div className="flex justify-center mt-2">
                    <div className="flex items-center gap-1.5 bg-gray-900/90 border border-white/10
                                    rounded-full px-3 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[9px] text-slate-300 font-semibold">Ubicación activa</span>
                    </div>
                  </div>
                  {/* Bottom sheet */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-950 rounded-t-3xl
                                  border-t border-white/[0.06] px-4 pt-3 pb-5">
                    <div className="w-7 h-1 bg-white/15 rounded-full mx-auto mb-3" />
                    <p className="text-[11px] font-black text-white">Mural Palermo</p>
                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <span className="text-[9px] text-emerald-400 font-bold">✓ Dentro del área</span>
                      <span className="text-[9px] text-slate-600">· 42m</span>
                    </div>
                    <button className="w-full py-2 rounded-xl bg-brand-600 text-white text-[10px] font-bold">
                      Acceder al contenido
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-600 text-center">Vista del usuario</p>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Use cases ────────────────────────────────────────────────────────────────

function UseCasesSection() {
  return (
    <section id="cases" className="py-28 px-5 bg-[#050810]">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <Badge>Casos de uso</Badge>
          <h2 className="mt-5 text-4xl md:text-5xl font-black text-white leading-tight">
            Para cualquier lugar.<br className="sm:hidden" /> Para cualquier experiencia.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((uc, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="group p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]
                              hover:border-white/[0.13] hover:bg-white/[0.04]
                              transition-all duration-300 cursor-default h-full">
                <span className="text-3xl mb-4 block">{uc.emoji}</span>
                <h3 className="text-sm font-bold text-white mb-2">{uc.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{uc.desc}</p>
                <div className="mt-5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: uc.color }} />
                  <span className="text-[11px] text-slate-600 group-hover:text-slate-400 transition-colors">
                    Explorar →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  return (
    <section id="features" className="py-28 px-5"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060c16 50%, #050810 100%)' }}>
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <Badge>Diferenciales</Badge>
          <h2 className="mt-5 text-4xl md:text-5xl font-black text-white leading-tight">
            El contenido correcto.<br /> En el lugar exacto.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]
                              hover:bg-white/[0.04] hover:border-brand-500/20
                              transition-all duration-300 h-full">
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="text-sm font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA section ─────────────────────────────────────────────────────────────

function CtaSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="py-32 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 100%, rgba(14,165,233,0.08) 0%, transparent 70%)' }} />

      <Reveal>
        <div className="max-w-xl mx-auto text-center">
          <Badge>Comenzá hoy</Badge>
          <h2 className="mt-6 text-4xl md:text-5xl font-black text-white leading-tight">
            Tu primera experiencia geolocalizada, en minutos.
          </h2>
          <p className="mt-5 text-slate-400 text-base md:text-lg leading-relaxed">
            Sin instalaciones. Sin configuraciones complejas.<br />
            Crea, configura y comparte.
          </p>

          {sent ? (
            <div className="mt-10 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07]">
              <p className="text-xl font-bold text-emerald-400">¡Listo! 🎉</p>
              <p className="text-slate-400 text-sm mt-2">Nos ponemos en contacto a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}
              className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5
                           text-white placeholder:text-slate-600 text-sm
                           focus:outline-none focus:border-brand-500/60 focus:bg-white/[0.08]
                           transition-all duration-150"
              />
              <button type="submit"
                className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                           text-white font-semibold text-sm transition-all duration-150 whitespace-nowrap
                           shadow-[0_4px_24px_rgba(2,132,199,0.35)]">
                Solicitar acceso
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-white/[0.06]">
            <p className="text-slate-600 text-sm mb-3">¿Ya tenés cuenta?</p>
            <Link to="/app"
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300
                         font-semibold text-sm transition-colors">
              Abrir la app
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer className="py-10 px-5 border-t border-white/[0.06] bg-[#050810]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-black text-white text-sm tracking-tight">Ubyca</span>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Ubyca — Plataforma de experiencias geolocalizadas.
        </p>
        <Link to="/app" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
          Abrir app →
        </Link>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050810] overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <HowItWorksSection />
      <MetricsDashboardSection />
      <DualPreviewSection />
      <UseCasesSection />
      <FeaturesSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
