import { motion } from 'framer-motion'
import { Reveal, SectionLabel, BrowserChrome } from '../../components/landing/LandingPrimitives'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative bg-[#050810] overflow-hidden" style={{ minHeight: '100dvh' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 75% at 68% 48%, rgba(14,165,233,0.08) 0%, transparent 65%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 40% 50% at 8% 80%, rgba(139,92,246,0.04) 0%, transparent 60%)',
      }} />

      <div
        className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10
                   flex flex-col lg:flex-row items-center gap-12 lg:gap-10 pt-24 pb-16 lg:py-0"
        style={{ minHeight: '100dvh' }}
      >
        {/* Left: text */}
        <div className="flex-shrink-0 w-full lg:w-[480px] xl:w-[540px] flex flex-col items-start">
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-black text-white tracking-tight leading-[1.04]
                       text-[2.6rem] sm:text-[3.2rem] lg:text-[3.4rem]"
          >
            Studio Ubyca
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-base md:text-lg text-slate-400 leading-relaxed"
          >
            Conecta espacios físicos con experiencias digitales que suceden en el momento
            y lugar correcto. Mide la interacción de tus visitantes en tiempo real.
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
                         shadow-[0_4px_24px_rgba(2,132,199,0.4)]"
            >
              Comenzar gratis
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
            {[
              ['Datos en tiempo real', '📊'],
              ['API e integraciones', '🔌'],
              ['Control total', '⚙️'],
              ['Sin app nativa', '🌐'],
            ].map(([label, icon]) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: product screenshot */}
        <motion.div
          initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 w-full min-w-0 relative"
          style={{ paddingBottom: 32 }}
        >
          <div className="absolute -inset-20 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 85% 65% at 55% 45%, rgba(14,165,233,0.09) 0%, transparent 68%)',
          }} />

          <div className="relative rounded-2xl overflow-hidden border border-white/[0.10]
                          shadow-[0_4px_6px_rgba(0,0,0,0.3),0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(14,165,233,0.06)]">
            <BrowserChrome url="studio.ubyca.com" />
            <div className="relative bg-[#111827] overflow-hidden" style={{ height: 410 }}>
              <img
                src="/imagen-landing-1.webp"
                alt="Studio Ubyca — editor de experiencias geolocalizadas"
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

          {/* Floating stat cards */}
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
        </motion.div>
      </div>

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

// ─── Analytics & Datos ────────────────────────────────────────────────────────

function AnalyticsSection() {
  return (
    <section className="py-16 sm:py-24 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060c18 55%, #050810 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 60% at 75% 55%, rgba(14,165,233,0.06) 0%, transparent 65%)',
      }} />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">

          {/* Screenshot */}
          <Reveal className="flex-1 w-full relative">
            <div className="absolute -inset-12 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 75% 60% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 70%)',
            }} />
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.09]
                            shadow-[0_32px_96px_rgba(0,0,0,0.7)]">
              <BrowserChrome url="studio.ubyca.com/metrics" />
              <div className="relative overflow-hidden" style={{ height: 400 }}>
                <img
                  src="/screenshot-metrics.png"
                  alt="Dashboard de analytics Ubyca"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ objectPosition: 'center top' }}
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(9,11,17,0.92))' }} />
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 top-12 hidden lg:block"
            >
              <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.12]
                              rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Conversión</p>
                <p className="text-3xl font-black text-emerald-400 leading-none">46%</p>
                <p className="text-[10px] text-slate-600 mt-1">entrada → clic</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -left-4 bottom-12 hidden lg:block"
            >
              <div className="bg-gray-950/95 backdrop-blur-xl border border-white/[0.12]
                              rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-brand-500/20 border border-brand-500/30
                                  flex items-center justify-center text-[9px]">⚡</div>
                  <p className="text-[10px] font-bold text-white">Tendencia</p>
                </div>
                <p className="text-[10px] text-emerald-400">+32% respecto al mes anterior</p>
              </div>
            </motion.div>
          </Reveal>

          {/* Text */}
          <div className="flex-shrink-0 w-full lg:w-[380px] flex flex-col items-start">
            <Reveal>
              <SectionLabel>Analytics y datos</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Comprende qué ocurre<br className="hidden sm:block" /> en cada ubicación.
              </h2>
              <p className="mt-4 text-slate-400 text-base leading-relaxed">
                Toma decisiones basadas en datos reales. Ubyca registra cada interacción
                y la convierte en información accionable para tu organización.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 grid grid-cols-3 gap-3 w-full">
                {[
                  { v: '13',  l: 'Entradas al radio', c: 'text-white' },
                  { v: '6',   l: 'Activaciones',      c: 'text-brand-400' },
                  { v: '46%', l: 'Conversión',        c: 'text-emerald-400' },
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
                  'Visitas y entradas por ubicación',
                  'Conversiones y activaciones por contenido',
                  'Comportamiento por horario y zona geográfica',
                  'Tendencias y comparativas entre períodos',
                  'Métricas de permanencia por punto',
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

// ─── API e Integraciones ──────────────────────────────────────────────────────

const INTEGRATIONS = [
  { icon: '📱', title: 'Apps móviles', desc: 'Integra experiencias geolocalizadas en tus aplicaciones nativas.' },
  { icon: '🌐', title: 'Sitios web', desc: 'Conecta tu web con datos de ubicación y contenido contextual.' },
  { icon: '🛒', title: 'E-commerce', desc: 'Activa promociones y beneficios para clientes en tiendas físicas.' },
  { icon: '⚙️', title: 'Sistemas internos', desc: 'Consume datos geolocalizados desde tus plataformas corporativas.' },
]

function ApiSection() {
  return (
    <section className="py-16 sm:py-24 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 55% at 20% 50%, rgba(139,92,246,0.05) 0%, transparent 65%)',
      }} />
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-14">
          <SectionLabel>API e Integraciones</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ubyca como parte de tu<br className="hidden sm:block" />
            <span className="text-brand-400"> infraestructura digital.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Conecta Ubyca con tus aplicaciones, sitios web y sistemas para crear
            experiencias geolocalizadas integradas.
          </p>
        </Reveal>

        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14">

          {/* Code block */}
          <Reveal className="flex-1 w-full min-w-0">
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden
                            shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
              <div className="h-10 bg-[#0a0e1a] border-b border-white/[0.06] flex items-center gap-3 px-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[11px] text-slate-500 font-mono ml-1">ubyca-api · response.json</span>
              </div>
              <div className="bg-[#080b14] p-6 font-mono text-[13px] leading-7 overflow-x-auto">
                <div className="text-slate-600">{'// GET /v1/locations/:id/analytics'}</div>
                <div className="mt-3 text-white">{'{'}</div>
                <div className="pl-5">
                  <span className="text-brand-400">"location_id"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-emerald-400">"loc_xk8Gq2"</span>
                  <span className="text-slate-600">,</span>
                </div>
                <div className="pl-5">
                  <span className="text-brand-400">"name"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-emerald-400">"Stand principal"</span>
                  <span className="text-slate-600">,</span>
                </div>
                <div className="pl-5">
                  <span className="text-brand-400">"entries_today"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-amber-400">147</span>
                  <span className="text-slate-600">,</span>
                </div>
                <div className="pl-5">
                  <span className="text-brand-400">"conversions"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-amber-400">68</span>
                  <span className="text-slate-600">,</span>
                </div>
                <div className="pl-5">
                  <span className="text-brand-400">"conversion_rate"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-emerald-400">"46.3%"</span>
                  <span className="text-slate-600">,</span>
                </div>
                <div className="pl-5">
                  <span className="text-brand-400">"radius_m"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-amber-400">50</span>
                  <span className="text-slate-600">,</span>
                </div>
                <div className="pl-5">
                  <span className="text-brand-400">"active"</span>
                  <span className="text-slate-500">: </span>
                  <span className="text-purple-400">true</span>
                </div>
                <div className="text-white">{'}'}</div>
              </div>
            </div>
          </Reveal>

          {/* Integration targets */}
          <div className="flex-shrink-0 w-full lg:w-[340px] flex flex-col">
            <Reveal>
              <p className="text-white font-bold text-lg mb-2">Integra con cualquier sistema</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Construye sobre la infraestructura de Ubyca o consume datos geolocalizados
                desde tus sistemas existentes.
              </p>
            </Reveal>
            <div className="flex flex-col gap-3">
              {INTEGRATIONS.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="group flex items-start gap-4 p-4 rounded-xl
                                  border border-white/[0.06] bg-white/[0.01]
                                  hover:border-white/[0.12] hover:bg-white/[0.03]
                                  transition-all duration-200">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-0.5">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Editor Visual y Control ──────────────────────────────────────────────────

const CONTROL_FEATURES = [
  { icon: '⭕', label: 'Radios de activación', desc: 'Define el área exacta donde se activa cada experiencia.' },
  { icon: '🔷', label: 'Polígonos personalizados', desc: 'Dibuja zonas irregulares sobre el mapa con precisión.' },
  { icon: '🕐', label: 'Horarios y ventanas de tiempo', desc: 'Activa experiencias solo en los horarios que elijas.' },
  { icon: '👥', label: 'Cupos y permanencia', desc: 'Controla capacidad máxima y tiempo mínimo de permanencia (dwell time).' },
]

function EditorSection() {
  return (
    <section className="py-16 sm:py-24 px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #060d1c 55%, #050810 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Text */}
          <div className="flex-shrink-0 w-full lg:w-[400px] flex flex-col items-start">
            <Reveal>
              <SectionLabel>Editor Visual</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Define exactamente cuándo,<br />dónde y bajo qué condiciones.
              </h2>
              <p className="mt-4 text-slate-400 text-base leading-relaxed">
                Control total sobre cada experiencia. Crea ubicaciones, gestiona contenido
                multimedia y configura reglas de activación desde una interfaz visual.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 w-full space-y-3">
              {CONTROL_FEATURES.map((f, i) => (
                <Reveal key={f.label} delay={0.1 + i * 0.06}>
                  <div className="flex items-start gap-3.5 p-4 rounded-xl
                                  border border-white/[0.06] bg-white/[0.01]
                                  hover:border-white/[0.11] transition-colors duration-200">
                    <span className="text-xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{f.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </Reveal>
          </div>

          {/* Screenshot */}
          <Reveal className="flex-1 w-full relative">
            <div className="absolute -inset-12 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 70%)',
            }} />
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.09]
                            shadow-[0_32px_96px_rgba(0,0,0,0.7)]">
              <BrowserChrome url="studio.ubyca.com/project/expo-2026" />
              <div className="relative overflow-hidden" style={{ height: 420 }}>
                <img
                  src="/imagen-landing-1.webp"
                  alt="Editor visual de Studio Ubyca"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ objectPosition: 'center top' }}
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(to bottom, transparent 65%, rgba(5,8,16,0.88) 100%)',
                }} />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 backdrop-blur-sm
                                bg-sky-500/10 border border-sky-500/20 rounded-full px-2.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-sky-400">Radio de activación activo</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Live Visits ──────────────────────────────────────────────────────────────

const LIVE_CARDS = [
  {
    label: 'Visitantes activos',
    value: '24',
    sub: 'ahora mismo',
    color: 'text-brand-400',
    dotColor: 'bg-brand-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Zona más activa',
    value: 'Stand A',
    sub: '11 visitantes',
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: 'Intensidad GPS',
    value: 'Alta',
    sub: 'señal óptima',
    color: 'text-amber-400',
    dotColor: 'bg-amber-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Activaciones hoy',
    value: '68',
    sub: '+12 vs. ayer',
    color: 'text-purple-400',
    dotColor: 'bg-purple-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

const ZONE_RANKING = [
  { name: 'Stand principal', visits: 11, pct: 100 },
  { name: 'Zona B – Demo área', visits: 8, pct: 73 },
  { name: 'Acceso principal', visits: 5, pct: 45 },
]

function LiveVisitsSection() {
  return (
    <section className="py-16 sm:py-24 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 65% at 50% 50%, rgba(14,165,233,0.05) 0%, transparent 65%)',
      }} />
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-14">
          <SectionLabel>Inteligencia Espacial</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Visualiza la actividad en tiempo real.
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Monitorea visitantes activos, intensidad por zona y ranking de ubicaciones
            mientras sucede.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LIVE_CARDS.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.08}>
              <div className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]
                              hover:border-white/[0.12] hover:bg-white/[0.04]
                              transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06]
                                   flex items-center justify-center ${card.color}`}>
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${card.dotColor} animate-pulse`} />
                    <span className="text-[10px] text-slate-600">en vivo</span>
                  </div>
                </div>
                <p className={`text-2xl font-black leading-none ${card.color}`}>{card.value}</p>
                <p className="text-[11px] font-semibold text-white/70 mt-1">{card.label}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{card.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-6">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.01] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-white">Ranking de zonas</p>
              <span className="text-[10px] text-brand-400 font-semibold border border-brand-500/20
                               bg-brand-500/[0.06] px-2.5 py-1 rounded-full">Actualizado ahora</span>
            </div>
            <div className="space-y-4">
              {ZONE_RANKING.map((zone, i) => (
                <div key={zone.name} className="flex items-center gap-4">
                  <span className="text-xs text-slate-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-300 truncate">{zone.name}</span>
                      <span className="text-xs text-slate-500 ml-2 flex-shrink-0">{zone.visits} visitas</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05]">
                      <div className="h-full rounded-full bg-brand-500/60 transition-all"
                        style={{ width: `${zone.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Plataforma completa ──────────────────────────────────────────────────────

const PLATFORM_FEATURES = [
  {
    title: 'Códigos QR',
    desc: 'Genera QR vinculados a ubicaciones para campañas físicas sin fricción.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 4v1m6.364 1.636l-.707.707M20 12h-1M17.657 17.657l-.707-.707M12 20v-1M6.343 17.657l.707-.707M4 12h1M6.343 6.343l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
      </svg>
    ),
  },
  {
    title: 'Links para compartir',
    desc: 'Un link directo para cada proyecto. Compatible con cualquier canal.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    title: 'Roles y equipos',
    desc: 'Administra accesos y permisos diferenciados por miembro del equipo.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Métricas por proyecto',
    desc: 'Dashboard completo de rendimiento para cada experiencia activa.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Gestión centralizada',
    desc: 'Administra múltiples proyectos desde un único workspace unificado.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Configuración avanzada',
    desc: 'Personaliza cada aspecto de la experiencia y del workspace.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

function PlatformSection() {
  return (
    <section className="py-16 sm:py-24 px-5"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #06101f 50%, #050810 100%)' }}>
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center mb-12">
          <SectionLabel>Plataforma completa</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            No es un creador de puntos GPS.
            <span className="text-brand-400"> Es una plataforma.</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-lg mx-auto">
            Administra, mide e integra experiencias geolocalizadas desde un único
            espacio de trabajo diseñado para equipos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLATFORM_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.055}>
              <div className="group flex items-start gap-4 p-5 rounded-2xl
                              border border-white/[0.06] bg-white/[0.01]
                              hover:border-white/[0.12] hover:bg-white/[0.03]
                              transition-all duration-200">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl
                                bg-brand-500/[0.09] border border-brand-500/[0.18]
                                flex items-center justify-center text-brand-400
                                group-hover:bg-brand-500/[0.14] transition-colors duration-200">
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm mb-1 leading-snug">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────

function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 px-5 bg-[#050810] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 65%)',
      }} />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
            Empieza a construir experiencias geolocalizadas sobre una plataforma
            diseñada para empresas.
          </h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Crea tu cuenta gratis y accede a todas las capacidades de Studio Ubyca.
          </p>
          <a
            href="https://studio.ubyca.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl
                       bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                       text-white font-bold text-base transition-all duration-150
                       shadow-[0_4px_32px_rgba(2,132,199,0.45)]"
          >
            Crear cuenta gratis
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

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />
      <HeroSection />
      <AnalyticsSection />
      <ApiSection />
      <EditorSection />
      <LiveVisitsSection />
      <PlatformSection />
      <FinalCTASection />
      <SiteFooter />
    </div>
  )
}
