import { Reveal, SectionLabel } from '../../components/landing/LandingPrimitives'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/presence/validate',
    desc: 'Valida si un usuario está presente en una ubicación. Aplica reglas de dwell time, horario y capacidad.',
    scope: 'presence:validate',
    methodColor: 'text-emerald-400',
    methodBg: 'bg-emerald-500/[0.10] border-emerald-500/[0.20]',
  },
  {
    method: 'POST',
    path: '/presence/check',
    desc: 'Consulta rápida de presencia sin evaluar reglas de negocio. Devuelve coordenadas, distancia y zona.',
    scope: 'presence:check',
    methodColor: 'text-emerald-400',
    methodBg: 'bg-emerald-500/[0.10] border-emerald-500/[0.20]',
  },
  {
    method: 'GET',
    path: '/projects/{id}/analytics',
    desc: 'Métricas de visitas, dwell time promedio y flujos espaciales de un proyecto.',
    scope: 'analytics:read',
    methodColor: 'text-brand-400',
    methodBg: 'bg-brand-500/[0.10] border-brand-500/[0.20]',
  },
  {
    method: 'GET',
    path: '/locations/{id}',
    desc: 'Devuelve geometría, radio activo y metadatos de un GeoPoint.',
    scope: 'locations:read',
    methodColor: 'text-brand-400',
    methodBg: 'bg-brand-500/[0.10] border-brand-500/[0.20]',
  },
]

function HeroCodeBlock() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.10] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
      <div className="bg-[#0d1117] border-b border-white/[0.06] px-5 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[11px] text-slate-500 font-mono">POST /api/v1/presence/validate</span>
      </div>
      <div className="bg-[#080b14] p-5 font-mono text-[12px] leading-7 overflow-x-auto">
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

export default function LandingDevelopersPage() {
  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pb-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div>
              <Reveal>
                <SectionLabel>Developers</SectionLabel>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.08] tracking-tight mb-5">
                  La API de presencia física para tu stack.
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Valida coordenadas contra GeoPoints, consulta ubicaciones y consume analytics
                  espaciales desde tus propios sistemas. REST + OpenAPI 3.1.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://studio.ubyca.com/app/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                               bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white
                               font-semibold text-sm transition-all duration-150
                               shadow-[0_4px_24px_rgba(2,132,199,0.4)]">
                    Portal de developers
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                    </svg>
                  </a>
                  <a
                    href="/openapi.yaml"
                    download
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                               bg-white/[0.05] hover:bg-white/[0.09] active:scale-[0.98]
                               border border-white/[0.10] text-slate-300 hover:text-white
                               font-semibold text-sm transition-all duration-150">
                    Descargar OpenAPI
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: code panel */}
            <Reveal delay={0.12}>
              <HeroCodeBlock />
            </Reveal>

          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-16 sm:py-20 px-5 bg-[#060d1c]">
        <div className="max-w-3xl mx-auto">

          <Reveal className="mb-10">
            <SectionLabel>Endpoints</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Cuatro endpoints. Todo lo que necesitás.
            </h2>
          </Reveal>

          <div className="space-y-3">
            {ENDPOINTS.map((ep, i) => (
              <Reveal key={ep.path} delay={i * 0.06}>
                <div className="flex items-start gap-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]
                                px-5 py-4 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-150">
                  <span className={`flex-shrink-0 mt-0.5 text-[10px] font-bold font-mono px-2 py-0.5
                                   rounded border ${ep.methodBg} ${ep.methodColor}`}>
                    {ep.method}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-mono text-slate-200 leading-none mb-1.5">{ep.path}</p>
                    <p className="text-[12px] text-slate-500 leading-snug">{ep.desc}</p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-mono text-slate-700
                                   bg-white/[0.03] border border-white/[0.06] rounded px-2 py-1 whitespace-nowrap">
                    {ep.scope}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 bg-[#050810] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 70% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 65%)' }} />
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
              Empieza a integrar hoy.
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Accedé al portal de developers desde Studio para ver la referencia completa,
              probar endpoints y descargar el spec OpenAPI 3.1.
            </p>
            <a
              href="https://studio.ubyca.com/app/developers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl
                         bg-brand-600 hover:bg-brand-500 active:scale-[0.98]
                         text-white font-bold text-base transition-all duration-150
                         shadow-[0_4px_32px_rgba(2,132,199,0.4)]">
              Ir al portal de developers
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </a>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
