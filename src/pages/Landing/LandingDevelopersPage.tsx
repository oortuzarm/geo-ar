import { useState } from 'react'
import LandingNavBar from '../../components/landing/LandingNavBar'
import SiteFooter from '../../components/landing/SiteFooter'

const SECTIONS = [
  { id: 'intro',       label: 'Inicio' },
  { id: 'auth',        label: 'Autenticación' },
  { id: 'scopes',      label: 'Scopes' },
  { id: 'quickstart',  label: 'Quick Start' },
  { id: 'endpoints',   label: 'Endpoints' },
  { id: 'openapi',     label: 'OpenAPI' },
]

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-[#080b14] border border-white/[0.07] rounded-xl px-5 py-4
                    font-mono text-[12px] leading-[1.8] text-slate-300 overflow-x-auto my-4 whitespace-pre">
      <code>{children}</code>
    </pre>
  )
}

function MethodBadge({ method }: { method: 'POST' | 'GET' }) {
  return (
    <span className={`inline-block text-[10px] font-bold font-mono px-2 py-0.5 rounded border flex-shrink-0
                     ${method === 'POST'
                       ? 'text-emerald-400 bg-emerald-500/[0.10] border-emerald-500/[0.20]'
                       : 'text-brand-400 bg-brand-500/[0.10] border-brand-500/[0.20]'}`}>
      {method}
    </span>
  )
}

function EndpointCard({
  method, path, scope, desc, request, response,
}: {
  method: 'POST' | 'GET'
  path: string
  scope: string
  desc: string
  request: string | null
  response: string
}) {
  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden mb-5">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white/[0.02] border-b border-white/[0.06] flex-wrap gap-y-2">
        <MethodBadge method={method} />
        <code className="text-slate-200 text-[13px] font-mono">{path}</code>
        <span className="ml-auto text-[10px] font-mono text-slate-600 bg-white/[0.03] border border-white/[0.06] rounded px-2 py-0.5 whitespace-nowrap">
          {scope}
        </span>
      </div>
      <div className="px-5 pt-4 pb-5">
        <p className="text-[13px] text-slate-400 leading-relaxed mb-3">{desc}</p>
        {request !== null && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1 mt-3">Request body</p>
            <Code>{request}</Code>
          </>
        )}
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1 mt-3">Response · 200 OK</p>
        <Code>{response}</Code>
      </div>
    </div>
  )
}

export default function LandingDevelopersPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <LandingNavBar />

      <div className="pt-16 flex min-h-[calc(100vh-4rem)]">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-16
                          self-start h-[calc(100vh-4rem)] border-r border-white/[0.06] overflow-y-auto">
          <div className="px-5 pt-8 pb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4 px-3">
              Ubyca API
            </p>
            <nav className="space-y-0.5">
              {SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center px-3 py-2 rounded-lg text-[13px] text-slate-400
                             hover:text-white hover:bg-white/[0.05] transition-all duration-100"
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-1">
              <a
                href="https://studio.ubyca.com/app/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-brand-400
                           hover:text-brand-300 hover:bg-brand-500/[0.06] transition-all duration-100"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Studio Portal
              </a>
              <a
                href="/openapi.yaml"
                download
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-slate-500
                           hover:text-slate-300 hover:bg-white/[0.04] transition-all duration-100"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                openapi.yaml
              </a>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-14 py-10">
          <div className="max-w-2xl">

            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden flex items-center gap-2 mb-7 text-[13px] text-slate-400
                         hover:text-white border border-white/[0.08] rounded-lg px-4 py-2.5
                         bg-white/[0.03] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              En esta página
            </button>

            {mobileNavOpen && (
              <div className="lg:hidden mb-7 border border-white/[0.08] rounded-xl bg-[#080b14] p-4">
                <nav className="space-y-0.5">
                  {SECTIONS.map(s => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-[13px] text-slate-400
                                 hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* ── Inicio ───────────────────────────────────────────────────────── */}
            <section id="intro" className="mb-14 scroll-mt-24">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">Documentación</h1>
              <p className="text-[14px] text-slate-400 leading-relaxed mb-6">
                Ubyca expone una API REST para validar presencia física de usuarios en tiempo real.
                Envía coordenadas GPS contra GeoPoints configurados en tu proyecto y recibe resultados
                accionables: presente o ausente, distancia exacta, tiempo de permanencia y resultado
                de las reglas de negocio aplicadas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { title: 'Presence API',  desc: 'Validación GPS y reglas de negocio.',   href: '#endpoints', dot: 'bg-emerald-400' },
                  { title: 'Locations API', desc: 'Geometría y metadatos de GeoPoints.',   href: '#endpoints', dot: 'bg-brand-400' },
                  { title: 'Analytics API', desc: 'Métricas espaciales de un proyecto.',   href: '#endpoints', dot: 'bg-purple-400' },
                  { title: 'OpenAPI 3.1',   desc: 'Especificación descargable completa.',  href: '#openapi',   dot: 'bg-amber-400' },
                ] as const).map(c => (
                  <a
                    key={c.title}
                    href={c.href}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-white/[0.07]
                               bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12]
                               transition-all duration-150 group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                    <div>
                      <p className="text-[13px] font-semibold text-white mb-0.5 group-hover:text-white">{c.title}</p>
                      <p className="text-[12px] text-slate-500">{c.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* ── Autenticación ─────────────────────────────────────────────────── */}
            <section id="auth" className="mb-14 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-1">Autenticación</h2>
              <p className="text-[11px] text-slate-600 font-mono mb-5">Bearer token · HTTPS obligatorio</p>

              <p className="text-[14px] text-slate-400 leading-relaxed mb-1">
                Todas las peticiones requieren un token de API en el header{' '}
                <code className="text-slate-300 bg-white/[0.06] px-1.5 py-0.5 rounded text-[12px] font-mono">
                  Authorization
                </code>.
                Genera tu clave desde{' '}
                <a
                  href="https://studio.ubyca.com/app/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
                >
                  Studio › Developers
                </a>.
              </p>

              <Code>{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}</Code>

              <p className="text-[13px] text-slate-500">
                Base URL:{' '}
                <code className="text-slate-300 bg-white/[0.06] px-1.5 py-0.5 rounded text-[12px] font-mono">
                  https://api.ubyca.com/v1
                </code>
              </p>
            </section>

            {/* ── Scopes ────────────────────────────────────────────────────────── */}
            <section id="scopes" className="mb-14 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-1">Scopes</h2>
              <p className="text-[11px] text-slate-600 font-mono mb-5">Permisos por API key</p>

              <p className="text-[14px] text-slate-400 leading-relaxed mb-5">
                Cada API key tiene scopes asignados que determinan qué endpoints puede invocar.
                El scope requerido aparece junto a cada endpoint.
              </p>

              <div className="border border-white/[0.07] rounded-xl overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        Scope
                      </th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        Descripción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {([
                      { scope: 'presence:validate', desc: 'Validar presencia con reglas de negocio.' },
                      { scope: 'presence:check',    desc: 'Consulta rápida de presencia sin reglas.' },
                      { scope: 'locations:read',    desc: 'Leer geometría y metadatos de GeoPoints.' },
                      { scope: 'analytics:read',    desc: 'Leer métricas espaciales de un proyecto.' },
                    ] as const).map(row => (
                      <tr key={row.scope} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <code className="font-mono text-brand-400 text-[12px]">{row.scope}</code>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Quick Start ───────────────────────────────────────────────────── */}
            <section id="quickstart" className="mb-14 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-1">Quick Start</h2>
              <p className="text-[11px] text-slate-600 font-mono mb-6">Primer request en 4 pasos</p>

              <ol className="space-y-6">
                {([
                  {
                    n: '1',
                    title: 'Crea un GeoPoint en Studio',
                    body: 'En Studio, crea un proyecto y define una ubicación (GeoPoint) con nombre, coordenadas y radio activo.',
                    code: null,
                  },
                  {
                    n: '2',
                    title: 'Genera una API key',
                    body: 'Desde Studio › Settings › Developers, crea una clave con el scope presence:validate.',
                    code: null,
                  },
                  {
                    n: '3',
                    title: 'Haz el primer request',
                    body: null,
                    code: `curl -X POST https://api.ubyca.com/v1/presence/validate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "location_id": "YOUR_LOCATION_ID",
    "lat": -34.603722,
    "lng": -58.381592
  }'`,
                  },
                  {
                    n: '4',
                    title: 'Consume el resultado',
                    body: 'La respuesta incluye si el usuario está presente, la distancia exacta y si se cumplen las reglas de negocio configuradas en el GeoPoint.',
                    code: null,
                  },
                ] as const).map(item => (
                  <li key={item.n} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-600 text-white text-[11px]
                                     font-black flex items-center justify-center mt-0.5">
                      {item.n}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white mb-1">{item.title}</p>
                      {item.body && (
                        <p className="text-[13px] text-slate-500 leading-relaxed">{item.body}</p>
                      )}
                      {item.code && <Code>{item.code}</Code>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Endpoints ─────────────────────────────────────────────────────── */}
            <section id="endpoints" className="mb-14 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-1">Endpoints</h2>
              <p className="text-[11px] text-slate-600 font-mono mb-8">REST · JSON · HTTPS</p>

              <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-500/60 mb-4">
                Presence API
              </h3>
              <EndpointCard
                method="POST"
                path="/presence/validate"
                scope="presence:validate"
                desc="Valida si las coordenadas enviadas corresponden a una presencia dentro de una ubicación activa. Evalúa reglas de negocio: dwell time mínimo, horario y capacidad."
                request={`{
  "location_id": "loc_stand_principal",
  "lat": -34.603722,
  "lng": -58.381592
}`}
                response={`{
  "valid": true,
  "locationId": "loc_stand_principal",
  "checks": {
    "insideBoundary": true,
    "distanceMeters": 48,
    "dwellTimeMet": true
  },
  "validation_result": {
    "valid": true,
    "checks": ["dwell_time", "schedule", "capacity"]
  }
}`}
              />

              <EndpointCard
                method="POST"
                path="/presence/check"
                scope="presence:check"
                desc="Consulta rápida de presencia sin evaluar reglas de negocio. Devuelve si el usuario está dentro del radio, la distancia exacta y el tiempo de permanencia acumulado."
                request={`{
  "location_id": "loc_stand_principal",
  "lat": -34.603722,
  "lng": -58.381592
}`}
                response={`{
  "present": true,
  "locationId": "loc_stand_principal",
  "distanceMeters": 48,
  "dwellSeconds": 312
}`}
              />

              <h3 className="text-[11px] font-bold uppercase tracking-widest text-brand-400/60 mt-8 mb-4">
                Locations API
              </h3>
              <EndpointCard
                method="GET"
                path="/locations/{id}"
                scope="locations:read"
                desc="Devuelve la geometría, radio activo y metadatos de un GeoPoint."
                request={null}
                response={`{
  "id": "loc_stand_principal",
  "name": "Stand Principal",
  "lat": -34.603722,
  "lng": -58.381592,
  "radius": 150,
  "active": true
}`}
              />

              <h3 className="text-[11px] font-bold uppercase tracking-widest text-purple-400/60 mt-8 mb-4">
                Analytics API
              </h3>
              <EndpointCard
                method="GET"
                path="/projects/{id}/analytics"
                scope="analytics:read"
                desc="Métricas de visitas, dwell time promedio y flujos espaciales de un proyecto."
                request={null}
                response={`{
  "visits": 1284,
  "uniqueVisitors": 892,
  "avgDwellSeconds": 248,
  "peakHour": "14:00"
}`}
              />
            </section>

            {/* ── OpenAPI ───────────────────────────────────────────────────────── */}
            <section id="openapi" className="mb-14 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-1">OpenAPI</h2>
              <p className="text-[11px] text-slate-600 font-mono mb-5">Versión 3.1</p>

              <p className="text-[14px] text-slate-400 leading-relaxed mb-6">
                La especificación completa de la API está disponible en formato OpenAPI 3.1.
                Úsala para generar clientes, explorar endpoints con Swagger UI o integrarla
                en tu pipeline de CI.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/openapi.yaml"
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                             bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.10]
                             text-slate-300 hover:text-white font-semibold text-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                  </svg>
                  Descargar openapi.yaml
                </a>
                <a
                  href="https://studio.ubyca.com/app/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                             bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm
                             transition-all shadow-[0_4px_20px_rgba(2,132,199,0.35)]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir Studio Portal
                </a>
              </div>
            </section>

          </div>
        </main>

      </div>

      <SiteFooter />
    </div>
  )
}
