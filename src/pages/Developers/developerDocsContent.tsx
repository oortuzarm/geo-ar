import { createContext, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGeoStore } from '../../store/geoStore'

// ── Context ───────────────────────────────────────────────────────────────────

interface DocsCtxValue { basePath: string; isPublic: boolean }
export const DocsContext = createContext<DocsCtxValue>({ basePath: '/app/developers', isPublic: false })
export const useDocsCtx = () => useContext(DocsContext)

// ── Constants ─────────────────────────────────────────────────────────────────

export const BASE = 'https://api.ubyca.com/api/v1'

// ── Navigation tree ───────────────────────────────────────────────────────────

export interface NavItem  { label: string; path: string }
export interface NavGroup { group: string; items?: NavItem[]; sub?: { label: string; items: NavItem[] }[] }

export const NAV: NavGroup[] = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Overview',       path: 'overview'          },
      { label: 'Quick Start',    path: 'quickstart'        },
      { label: 'Authentication', path: 'authentication'    },
      { label: 'API Key Scopes', path: 'scopes'            },
      { label: 'Sessions',       path: 'concepts/sessions' },
    ],
  },
  {
    group: 'Resources',
    sub: [
      {
        label: 'Projects',
        items: [{ label: 'The Project Object', path: 'resources/projects' }],
      },
      {
        label: 'Locations',
        items: [
          { label: 'The Location Object', path: 'resources/locations/object' },
          { label: 'List Locations',      path: 'resources/locations/list'   },
          { label: 'Get a Location',      path: 'resources/locations/get'    },
        ],
      },
      {
        label: 'Presence',
        items: [
          { label: 'Overview',          path: 'resources/presence/overview'  },
          { label: 'Check Presence',    path: 'resources/presence/check'     },
          { label: 'Validate Presence', path: 'resources/presence/validate'  },
        ],
      },
      {
        label: 'Analytics',
        items: [{ label: 'Analytics', path: 'resources/analytics' }],
      },
    ],
  },
  {
    group: 'Reference',
    items: [
      { label: 'Errors',       path: 'errors'                },
      { label: 'Rate Limits',  path: 'rate-limits'           },
      { label: 'Versioning',   path: 'reference/versioning'  },
      { label: 'Changelog',    path: 'reference/changelog'   },
    ],
  },
]

// ── UI atoms ──────────────────────────────────────────────────────────────────

const SCOPE_COLOR: Record<string, string> = {
  'projects:read':     'bg-sky-900/40 text-sky-400 border-sky-700/40',
  'analytics:read':    'bg-brand-900/50 text-brand-300 border-brand-700/40',
  'presence:validate': 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
  'presence:check':    'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
}

export function ScopeBadge({ scope }: { scope: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${SCOPE_COLOR[scope] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
      {scope}
    </span>
  )
}

export function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  const cls = method === 'GET'
    ? 'bg-sky-950/60 border-sky-800/50 text-sky-400'
    : 'bg-amber-950/60 border-amber-800/50 text-amber-400'
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold border rounded px-1.5 py-0.5 flex-shrink-0 ${cls}`}>
      {method}
    </span>
  )
}

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const addToast = useGeoStore((s) => s.addToast)

  function handleCopy() {
    navigator.clipboard.writeText(code)
      .then(() => {
        addToast(label ? `${label} copiado` : 'Copiado', 'success')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  return (
    <div className="relative group my-4 min-w-0">
      <pre className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-[11.5px] font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre max-w-full">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className={[
          'absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border',
          'transition-all duration-150 focus:outline-none',
          copied
            ? 'bg-emerald-800/60 border-emerald-700/50 text-emerald-300'
            : 'bg-gray-800/80 border-gray-700/60 text-gray-500 hover:text-gray-200 hover:bg-gray-700/80',
        ].join(' ')}
      >
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

export function Callout({ type, children }: { type: 'warning' | 'info' | 'tip'; children: React.ReactNode }) {
  const styles = {
    warning: 'bg-amber-950/20 border-amber-700/25 text-amber-300/80',
    info:    'bg-blue-950/20 border-blue-700/25 text-blue-300/80',
    tip:     'bg-emerald-950/20 border-emerald-700/25 text-emerald-300/80',
  }
  return (
    <div className={`my-4 px-4 py-3.5 border rounded-xl text-xs leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  )
}

export function Divider() {
  return <hr className="my-8 border-gray-800" />
}

// ── Link helpers ──────────────────────────────────────────────────────────────

function StudioIntegrationsLink({ children }: { children: React.ReactNode }) {
  const { isPublic } = useDocsCtx()
  if (isPublic) {
    return (
      <a href="https://studio.ubyca.com/app/integrations" target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300">
        {children}
      </a>
    )
  }
  return <Link to="/app/integrations" className="text-brand-400 hover:text-brand-300">{children}</Link>
}

function StudioIntegrationsBtn() {
  const { isPublic } = useDocsCtx()
  const cls = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors'
  if (isPublic) {
    return (
      <a href="https://studio.ubyca.com/app/integrations" target="_blank" rel="noreferrer" className={cls}>
        Open Studio
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    )
  }
  return (
    <Link to="/app/integrations" className={cls}>
      Ir a Integraciones
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

// ── OpenAPI download ──────────────────────────────────────────────────────────

const OPENAPI_URL = '/openapi.yaml'

function OpenAPIDownloadCard() {
  return (
    <a
      href={OPENAPI_URL}
      target="_blank"
      rel="noreferrer"
      download="openapi.yaml"
      className="my-4 flex items-center gap-3 px-4 py-3.5 bg-gray-900/60 border border-white/[0.07] rounded-xl hover:border-white/[0.14] hover:bg-gray-900/80 transition-all group"
    >
      <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-gray-600 transition-colors">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">OpenAPI Specification</p>
        <p className="text-[11px] text-gray-600 font-mono">{OPENAPI_URL}</p>
      </div>
      <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  )
}

// ── Doc primitives ────────────────────────────────────────────────────────────

export function PageTitle({ title, badge, subtitle }: { title: string; badge?: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {badge && <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">{badge}</p>}
      <h1 className="text-2xl font-bold text-gray-100 tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-400 leading-relaxed">{subtitle}</p>}
    </div>
  )
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-gray-100 mt-10 mb-3">{children}</h2>
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-200 mt-6 mb-2">{children}</h3>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-400 leading-relaxed mb-3">{children}</p>
}

export interface AttrRow { name: string; type: string; req?: boolean; desc: string }

export function AttrTable({ rows }: { rows: AttrRow[] }) {
  return (
    <div className="my-4 border border-white/[0.07] rounded-xl overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-900/60 border-b border-white/[0.06]">
            <th className="text-left px-4 py-2.5 font-semibold text-gray-500 w-44">Attribute</th>
            <th className="text-left px-4 py-2.5 font-semibold text-gray-500 w-28">Type</th>
            <th className="text-left px-4 py-2.5 font-semibold text-gray-500">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.name} className={`border-b border-white/[0.04] last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-900/20'}`}>
              <td className="px-4 py-2.5 font-mono text-gray-300 align-top">{r.name}</td>
              <td className="px-4 py-2.5 font-mono text-brand-400/80 align-top whitespace-nowrap">{r.type}</td>
              <td className="px-4 py-2.5 text-gray-500 leading-relaxed align-top">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EndpointBadge({ method, path }: { method: 'GET' | 'POST'; path: string }) {
  return (
    <div className="flex items-center gap-2 my-4 px-4 py-3 bg-gray-900/60 border border-white/[0.07] rounded-xl overflow-x-auto">
      <MethodBadge method={method} />
      <span className="font-mono text-xs text-gray-300 whitespace-nowrap">{path}</span>
    </div>
  )
}

export function DocNav({ prev, next }: { prev?: { label: string; path: string }; next?: { label: string; path: string } }) {
  const { basePath } = useDocsCtx()
  return (
    <div className="flex flex-wrap justify-between gap-4 mt-12 pt-6 border-t border-gray-800">
      {prev ? (
        <Link to={`${basePath}/${prev.path}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors shrink-0">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {prev.label}
        </Link>
      ) : <div />}
      {next ? (
        <Link to={`${basePath}/${next.path}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors shrink-0 ml-auto">
          {next.label}
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      ) : <div />}
    </div>
  )
}

// ── Doc page: internal link helper ────────────────────────────────────────────

function DocLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { basePath } = useDocsCtx()
  return <Link to={`${basePath}/${to}`} className="text-brand-400 hover:text-brand-300">{children}</Link>
}

// ── PAGE: Overview ────────────────────────────────────────────────────────────

function OverviewPage() {
  return (
    <div>
      <PageTitle title="Ubyca API v1" badge="Getting Started" subtitle="REST API para integrar capacidades de geolocalización en tus propias aplicaciones." />

      <P>La Ubyca API te permite validar la presencia física de un usuario en una ubicación GPS, descubrir proyectos y ubicaciones, y consultar métricas de tráfico y conversión en tiempo real.</P>

      <div className="my-4 flex items-center gap-3 px-4 py-3 bg-gray-900/60 border border-white/[0.07] rounded-xl overflow-x-auto">
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider flex-shrink-0">Base URL</span>
        <span className="font-mono text-xs text-gray-300 select-all whitespace-nowrap">{BASE}</span>
      </div>

      <OpenAPIDownloadCard />

      <H2>Cómo funciona</H2>
      <ol className="space-y-3 my-4">
        {[
          { n: 1, title: 'Descubrir', desc: `GET ${BASE}/projects → GET .../locations — obtener el location_id de cada punto de validación.` },
          { n: 2, title: 'Validar presencia', desc: `POST ${BASE}/presence/validate — enviar coordenadas GPS y session_id para obtener valid: true/false.` },
          { n: 3, title: 'Consultar analytics', desc: `GET ${BASE}/projects/{id}/analytics — métricas de entradas, conversión y visitas activas.` },
        ].map((s) => (
          <li key={s.n} className="flex gap-4 min-w-0">
            <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[11px] font-bold text-gray-400 flex-shrink-0 mt-0.5">{s.n}</span>
            <div className="min-w-0">
              <span className="text-sm font-medium text-gray-200">{s.title} — </span>
              <span className="text-xs text-gray-500 font-mono break-all">{s.desc}</span>
            </div>
          </li>
        ))}
      </ol>

      <H2>Respuestas</H2>
      <P>Todas las respuestas son JSON. Las listas usan <code className="font-mono text-xs text-gray-300">&#123;"data":[...]&#125;</code> con <code className="font-mono text-xs text-gray-300">meta.count</code>. Los recursos individuales usan <code className="font-mono text-xs text-gray-300">&#123;"data":&#123;...&#125;&#125;</code>.</P>
      <P>Los campos de request usan <code className="font-mono text-xs text-gray-300">snake_case</code>. Los campos de respuesta usan <code className="font-mono text-xs text-gray-300">camelCase</code>.</P>

      <H2>Autenticación</H2>
      <P>Todos los endpoints excepto <code className="font-mono text-xs text-gray-300">GET /health</code> requieren credenciales de API. Ver <DocLink to="authentication">Authentication</DocLink>.</P>

      <H2>Scopes</H2>
      <P>Cada API Key tiene un conjunto de scopes que limitan su acceso. Ver <DocLink to="scopes">API Key Scopes</DocLink>.</P>

      <div className="my-4 px-4 py-4 bg-brand-950/20 border border-brand-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-900/40 border border-brand-700/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-100 mb-0.5">Necesitas credenciales</p>
            <p className="text-xs text-gray-400 mb-3">Para usar la API crea una API Key desde Studio. Cada clave tiene scopes que definen a qué endpoints puede acceder.</p>
            <StudioIntegrationsBtn />
          </div>
        </div>
      </div>

      <DocNav next={{ label: 'Quick Start', path: 'quickstart' }} />
    </div>
  )
}

// ── PAGE: Quick Start ─────────────────────────────────────────────────────────

function QuickStartPage() {
  const { basePath } = useDocsCtx()

  const STEPS: {
    n: number
    title: string
    method: 'GET' | 'POST'
    path: string
    note?: string
    chainNote?: string
    code: string
    response: string
  }[] = [
    {
      n: 1, title: 'Verificar estado', method: 'GET',
      path: `${BASE}/health`,
      code: `curl ${BASE}/health`,
      response: `{"status":"ok","version":"v1"}`,
    },
    {
      n: 2, title: 'Listar proyectos', method: 'GET',
      path: `${BASE}/projects`,
      note: 'Requiere scope projects:read. Reemplaza ubk_live_xxx con tu API Key y sk_live_xxx con tu Secret — ambos disponibles en Studio → Integraciones.',
      code: `curl ${BASE}/projects \\\n  -u "ubk_live_xxx:sk_live_xxx"`,
      response: `{\n  "data": [\n    {\n      "id": "550e8400-e29b-41d4-a716-446655440000",\n      "title": "Circuito Histórico",\n      "status": "active",\n      "locationCount": 3\n    }\n  ],\n  "meta": { "count": 1 }\n}`,
      chainNote: '→ Copia el valor de data[0].id. Lo usarás como {project_id} en el Paso 3.',
    },
    {
      n: 3, title: 'Listar ubicaciones', method: 'GET',
      path: `${BASE}/projects/{project_id}/locations`,
      note: 'Usa el project_id obtenido en el Paso 2. Requiere scope projects:read.',
      code: `curl "${BASE}/projects/550e8400-e29b-41d4-a716-446655440000/locations" \\\n  -u "ubk_live_xxx:sk_live_xxx"`,
      response: `{\n  "data": [\n    {\n      "id": "660e8400-e29b-41d4-a716-446655440001",\n      "name": "Punto Central",\n      "latitude": -33.4372,\n      "longitude": -70.6506,\n      "boundary": { "type": "radius", "radiusMeters": 50 },\n      "active": true\n    }\n  ],\n  "meta": { "count": 1 }\n}`,
      chainNote: '→ El campo data[0].id de la ubicación es tu location_id para los Pasos 4 y 5.',
    },
    {
      n: 4, title: 'Verificar presencia (dry-run)', method: 'POST',
      path: `${BASE}/presence/check`,
      note: 'Requiere scope presence:check. No consume quota, no registra eventos.',
      code: `curl -X POST ${BASE}/presence/check \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "location_id": "660e8400-e29b-41d4-a716-446655440001",\n    "session_id": "session-abc-123",\n    "coordinates": {\n      "latitude": -33.4372,\n      "longitude": -70.6506\n    }\n  }'`,
      response: `{\n  "valid": true,\n  "locationId": "660e8400-e29b-41d4-a716-446655440001",\n  "sessionId": "session-abc-123",\n  "checks": {\n    "locationActive": true,\n    "insideBoundary": true,\n    "boundaryType": "radius",\n    "distanceMeters": 34.7\n  },\n  "destination": { "type": "url", "url": "https://example.com/contenido" },\n  "failureReason": null,\n  "eventId": null\n}`,
    },
    {
      n: 5, title: 'Validar presencia GPS', method: 'POST',
      path: `${BASE}/presence/validate`,
      note: 'Usa el mismo location_id y session_id del Paso 4. Requiere scope presence:validate. Registra eventos y consume quota.',
      code: `curl -X POST ${BASE}/presence/validate \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "location_id": "660e8400-e29b-41d4-a716-446655440001",\n    "session_id": "session-abc-123",\n    "coordinates": {\n      "latitude": -33.4372,\n      "longitude": -70.6506,\n      "accuracy_meters": 8.0\n    }\n  }'`,
      response: `{\n  "valid": true,\n  "locationId": "660e8400-e29b-41d4-a716-446655440001",\n  "sessionId": "session-abc-123",\n  "checks": {\n    "locationActive": true,\n    "insideBoundary": true,\n    "boundaryType": "radius",\n    "distanceMeters": 34.7\n  },\n  "destination": { "type": "url", "url": "https://example.com/contenido" },\n  "failureReason": null,\n  "eventId": "770e8400-e29b-41d4-a716-446655440010"\n}`,
    },
  ]

  return (
    <div>
      <PageTitle title="Quick Start" badge="Getting Started" subtitle="Integra el flujo completo de presencia en 5 llamadas." />
      <P>Necesitas una API Key con los scopes <code className="font-mono text-xs text-gray-300">projects:read</code>, <code className="font-mono text-xs text-gray-300">presence:check</code> y <code className="font-mono text-xs text-gray-300">presence:validate</code>. Créala desde <StudioIntegrationsLink>Studio → Integraciones</StudioIntegrationsLink>.</P>

      {/* Base URL */}
      <div className="flex items-center gap-3 my-4 px-4 py-3 bg-gray-900/40 border border-white/[0.06] rounded-xl">
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest flex-shrink-0">Base URL</span>
        <code className="font-mono text-xs text-gray-300 break-all">{BASE}</code>
      </div>

      <div className="space-y-8 mt-6">
        {STEPS.map((s) => (
          <div key={s.n} className="relative pl-10 min-w-0">
            <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[11px] font-bold text-gray-400 flex-shrink-0">{s.n}</div>
            <p className="text-sm font-semibold text-gray-100 mb-1">{s.title}</p>
            {s.note && <p className="text-xs text-gray-500 mb-2">{s.note}</p>}
            <div className="flex items-center gap-2 mb-2 overflow-x-auto">
              <MethodBadge method={s.method} />
              <span className="font-mono text-xs text-gray-400 whitespace-nowrap">{s.path}</span>
            </div>

            {/* Step 4: session_id explanation before curl */}
            {s.n === 4 && (
              <p className="text-xs text-gray-500 mb-2">
                El <code className="font-mono text-xs text-gray-400">session_id</code> lo genera tu aplicación — puede ser cualquier string único por sesión de usuario. Recomendado: UUID v4.{' '}
                <a href={`${basePath}/concepts/sessions`} className="text-brand-400 hover:text-brand-300 underline underline-offset-2">Ver Sessions.</a>
              </p>
            )}

            <CodeBlock code={s.code} label={s.title} />
            <div className="mt-2 min-w-0">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">Respuesta</p>
              <pre className="bg-gray-950/60 border border-gray-800/60 rounded-xl px-4 py-3 text-[11.5px] font-mono text-gray-500 overflow-x-auto leading-relaxed whitespace-pre max-w-full">{s.response}</pre>
            </div>

            {/* Chaining annotation */}
            {s.chainNote && (
              <p className="mt-2 text-xs text-brand-400/80 font-mono">{s.chainNote}</p>
            )}

            {/* Step 5: response interpretation + valid:false callout */}
            {s.n === 5 && (
              <div className="mt-3 space-y-3">
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-green-400 flex-shrink-0">valid: true</span>
                    <span className="text-gray-500">→ entrega el contenido de <code className="font-mono text-gray-400">destination.url</code> al usuario.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-red-400 flex-shrink-0">valid: false</span>
                    <span className="text-gray-500">→ revisa <code className="font-mono text-gray-400">failureReason</code> para saber qué condición no se cumplió.{' '}
                      <a href={`${basePath}/resources/presence/overview`} className="text-brand-400 hover:text-brand-300 underline underline-offset-2">Ver Presence Overview.</a>
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                  <p className="text-xs font-semibold text-amber-300 mb-1">valid: false is expected</p>
                  <p className="text-xs text-gray-500">Si las coordenadas enviadas no están dentro del área configurada para la ubicación, la API responderá HTTP 200 con <code className="font-mono text-xs text-gray-400">valid: false</code> y <code className="font-mono text-xs text-gray-400">failureReason: "outside_boundary"</code>. Esto es un resultado de negocio esperado, no un error HTTP.</p>
                </div>
                <p className="text-xs text-gray-500">Con esto ya tienes el flujo básico completo: descubrir una ubicación, verificar presencia y registrar una validación real.</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <DocNav prev={{ label: 'Overview', path: 'overview' }} next={{ label: 'Authentication', path: 'authentication' }} />
    </div>
  )
}

// ── PAGE: Authentication ──────────────────────────────────────────────────────

function AuthenticationPage() {
  return (
    <div>
      <PageTitle title="Authentication" badge="Getting Started" subtitle="Todos los endpoints excepto GET /health requieren credenciales de API." />
      <P>Las credenciales consisten en una API Key pública (<code className="font-mono text-xs text-gray-300">ubk_live_...</code>) y un Secret (<code className="font-mono text-xs text-gray-300">sk_live_...</code>). Se crean desde <StudioIntegrationsLink>Studio → Integraciones</StudioIntegrationsLink>.</P>

      <H2>HTTP Basic (recomendado)</H2>
      <P>Pasa la API Key como username y el Secret como password. La mayoría de los clientes HTTP codifican automáticamente el par en Base64.</P>
      <CodeBlock label="Basic Auth" code={`curl ${BASE}/projects \\\n  -u "ubk_live_xxxxxxxxxxxx:sk_live_xxxxxxxxxxxx"\n\n# Equivalente explícito con header:\ncurl ${BASE}/projects \\\n  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)"`} />

      <H2>Bearer Pair</H2>
      <P>Pasa el par <code className="font-mono text-xs text-gray-300">key:secret</code> directamente en el header <code className="font-mono text-xs text-gray-300">Authorization</code> como Bearer token.</P>
      <CodeBlock label="Bearer Pair" code={`curl ${BASE}/projects \\\n  -H "Authorization: Bearer ubk_live_xxx:sk_live_xxx"`} />

      <Callout type="warning">
        El Secret solo se muestra una vez al crear la credencial. Guárdalo en un lugar seguro — si lo pierdes debes regenerar la credencial desde Integraciones.
      </Callout>

      <H2>Respuesta de error</H2>
      <CodeBlock code={`HTTP/1.1 401 Unauthorized\n\n{\n  "error": "Invalid or missing API credentials"\n}`} />

      <H2>OpenAPI Specification</H2>
      <P>El spec completo en OpenAPI 3.1.0 describe todos los endpoints, schemas y ejemplos.</P>
      <OpenAPIDownloadCard />

      <DocNav prev={{ label: 'Quick Start', path: 'quickstart' }} next={{ label: 'API Key Scopes', path: 'scopes' }} />
    </div>
  )
}

// ── PAGE: Scopes ──────────────────────────────────────────────────────────────

function ScopesPage() {
  const SCOPES = [
    {
      value: 'projects:read',
      desc: 'Acceso de lectura a proyectos y ubicaciones del workspace.',
      endpoints: 'GET /projects · GET /projects/{id} · GET /projects/{id}/locations · GET /locations/{id}',
    },
    {
      value: 'analytics:read',
      desc: 'Lectura de métricas y reportes analíticos por proyecto.',
      endpoints: 'GET /projects/{id}/analytics · /analytics/locations · /analytics/distribution · /analytics/intensity · /analytics/outside_areas',
    },
    {
      value: 'presence:check',
      desc: 'Dry-run de validación de presencia sin efectos secundarios.',
      endpoints: 'POST /presence/check',
    },
    {
      value: 'presence:validate',
      desc: 'Validar presencia GPS en tiempo real. Registra eventos y consume quota.',
      endpoints: 'POST /presence/validate',
    },
  ]

  return (
    <div>
      <PageTitle title="API Key Scopes" badge="Getting Started" subtitle="Cada API Key tiene un conjunto de scopes que limitan su acceso." />
      <P>Los scopes se seleccionan al crear la credencial desde <StudioIntegrationsLink>Studio → Integraciones</StudioIntegrationsLink>. Una credencial solo puede acceder a los endpoints que su conjunto de scopes autoriza.</P>

      <H2>Scopes disponibles</H2>
      <div className="space-y-3 my-4">
        {SCOPES.map((s) => (
          <div key={s.value} className="border border-white/[0.06] rounded-xl px-4 py-4 bg-gray-900/40">
            <ScopeBadge scope={s.value} />
            <p className="text-sm text-gray-300 mt-2 mb-1">{s.desc}</p>
            <p className="text-[11px] font-mono text-gray-600 break-all">{s.endpoints}</p>
          </div>
        ))}
      </div>

      <H2>Combinaciones comunes</H2>
      <H3>Solo lectura</H3>
      <div className="flex gap-1.5 flex-wrap my-2"><ScopeBadge scope="projects:read" /><ScopeBadge scope="analytics:read" /></div>
      <H3>Flujo de presencia</H3>
      <div className="flex gap-1.5 flex-wrap my-2"><ScopeBadge scope="projects:read" /><ScopeBadge scope="presence:check" /><ScopeBadge scope="presence:validate" /></div>
      <H3>Acceso completo</H3>
      <div className="flex gap-1.5 flex-wrap my-2"><ScopeBadge scope="projects:read" /><ScopeBadge scope="analytics:read" /><ScopeBadge scope="presence:check" /><ScopeBadge scope="presence:validate" /></div>

      <H2>Error de scope</H2>
      <CodeBlock code={`HTTP/1.1 403 Forbidden\n\n{\n  "error": "insufficient_scope",\n  "required": "presence:validate"\n}`} />

      <DocNav prev={{ label: 'Authentication', path: 'authentication' }} next={{ label: 'Sessions', path: 'concepts/sessions' }} />
    </div>
  )
}

// ── PAGE: Concept — Sessions ──────────────────────────────────────────────────

function ConceptSessionsPage() {
  return (
    <div>
      <PageTitle title="Sessions" badge="Getting Started" subtitle="Un session_id identifica la sesión de un usuario final en el sistema." />
      <P>El <code className="font-mono text-xs text-gray-300">session_id</code> es generado por el cliente — cualquier string no vacío es válido. Ubyca lo usa para:</P>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>Rastrear visitas en vivo (<code className="font-mono text-xs">liveVisitsCurrent</code> excluye la sesión que hace el request).</li>
        <li>Deduplicar eventos de analytics.</li>
      </ul>

      <H2>Recomendaciones</H2>
      <P>Genera un nuevo <code className="font-mono text-xs text-gray-300">session_id</code> por cada sesión de usuario. Un UUID v4 generado al inicio de la sesión es la opción recomendada:</P>
      <CodeBlock code={`{\n  "location_id": "660e8400-e29b-41d4-a716-446655440001",\n  "session_id": "sess_a1b2c3d4-e5f6-7890-abcd-ef1234567890",\n  "coordinates": { "latitude": -33.4372, "longitude": -70.6506 }\n}`} />

      <H2>Reutilización</H2>
      <P>Reutilizar el mismo <code className="font-mono text-xs text-gray-300">session_id</code> en múltiples llamadas a Presence dentro de la misma sesión de usuario es el comportamiento esperado — Ubyca usa esa continuidad para rastrear visitas en vivo y deduplicar eventos de analytics. No generes un <code className="font-mono text-xs text-gray-300">session_id</code> nuevo en cada request.</P>

      <H2>Session Lifetime</H2>
      <Callout type="info">
        <strong className="font-semibold">Session lifetime is not part of the public API contract.</strong>{' '}
        The API does not document a TTL, expiration, or automatic invalidation for session IDs. Generate a new <code className="font-mono text-xs">session_id</code> for each distinct user session — typically at app launch or when a user starts a new interaction.
      </Callout>

      <DocNav prev={{ label: 'API Key Scopes', path: 'scopes' }} next={{ label: 'The Project Object', path: 'resources/projects' }} />
    </div>
  )
}

// ── PAGE: Resources — Projects ────────────────────────────────────────────────

function ResourcesProjectsPage() {
  const projectExample = `{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Circuito Histórico",
    "subtitle": null,
    "description": null,
    "status": "active",
    "communityEnabled": false,
    "locationCount": 3,
    "createdAt": "2026-06-01T10:00:00.000Z",
    "updatedAt": "2026-06-20T14:30:00.000Z"
  }
}`

  return (
    <div>
      <PageTitle title="The Project Object" badge="Resources / Projects" subtitle="Un Project agrupa un conjunto de Locations bajo una experiencia compartida." />

      <H2>Example</H2>
      <CodeBlock code={projectExample} label="Project Object" />

      <H2>Attributes</H2>
      <AttrTable rows={[
        { name: 'id',               type: 'string (uuid)',     req: true,  desc: 'Identificador único del proyecto.' },
        { name: 'title',            type: 'string',            req: true,  desc: 'Nombre del proyecto.' },
        { name: 'subtitle',         type: 'string | null',                 desc: 'Subtítulo opcional.' },
        { name: 'description',      type: 'string | null',                 desc: 'Descripción larga.' },
        { name: 'status',           type: 'string',            req: true,  desc: 'Estado de publicación (e.g. active, draft).' },
        { name: 'communityEnabled', type: 'boolean',           req: true,  desc: 'Si el proyecto aparece en el showcase comunitario.' },
        { name: 'locationCount',    type: 'integer',           req: true,  desc: 'Número de Locations en este proyecto.' },
        { name: 'createdAt',        type: 'string (datetime)', req: true,  desc: 'ISO 8601, precisión de milisegundo.' },
        { name: 'updatedAt',        type: 'string (datetime)', req: true,  desc: 'ISO 8601, precisión de milisegundo.' },
      ]} />

      <H2>Relación con Locations</H2>
      <P>Un Project es el contenedor de una o más <DocLink to="resources/locations/object">Locations</DocLink>. Cada Location pertenece a exactamente un Project.</P>
      <div className="my-4 space-y-2">
        {[
          { title: 'Contenedor',  desc: 'Un Project puede tener una o más Locations. El campo locationCount refleja el total de Locations asociadas.' },
          { title: 'Pertenencia', desc: 'Cada Location pertenece a exactamente un Project y no se comparte entre proyectos.' },
          { title: 'Presencia',   desc: 'La validación de presencia ocurre siempre contra una Location — nunca directamente contra un Project.' },
        ].map((item) => (
          <div key={item.title} className="flex gap-3 px-4 py-2.5 bg-gray-900/40 border border-white/[0.05] rounded-lg">
            <span className="text-xs font-semibold text-gray-300 w-24 flex-shrink-0">{item.title}</span>
            <span className="text-xs text-gray-500">{item.desc}</span>
          </div>
        ))}
      </div>
      <P>Ver <DocLink to="resources/locations/list">List Locations</DocLink> para obtener todas las Locations de un proyecto, y <DocLink to="resources/locations/object">The Location Object</DocLink> para la referencia completa de cada Location.</P>

      <H2>Endpoints</H2>

      <H3>List Projects</H3>
      <EndpointBadge method="GET" path="/projects" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="projects:read" /></div>
      <P>Returns all projects in the workspace ordered by creation date.</P>
      <CodeBlock label="List Projects" code={`curl ${BASE}/projects \\\n  -u "ubk_live_xxx:sk_live_xxx"`} />
      <CodeBlock label="Response" code={`{\n  "data": [\n    {\n      "id": "550e8400-e29b-41d4-a716-446655440000",\n      "title": "Circuito Histórico",\n      "subtitle": null,\n      "description": null,\n      "status": "active",\n      "communityEnabled": false,\n      "locationCount": 3,\n      "createdAt": "2026-06-01T10:00:00.000Z",\n      "updatedAt": "2026-06-20T14:30:00.000Z"\n    }\n  ],\n  "meta": { "count": 1 }\n}`} />

      <H3>Get a Project</H3>
      <EndpointBadge method="GET" path="/projects/{id}" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="projects:read" /></div>
      <P>Returns a single Project by UUID. Must belong to the organization associated with the API Key.</P>
      <AttrTable rows={[{ name: 'id', type: 'string (uuid)', req: true, desc: 'UUID del proyecto. Path parameter.' }]} />
      <CodeBlock label="Get a Project" code={`curl ${BASE}/projects/550e8400-e29b-41d4-a716-446655440000 \\\n  -u "ubk_live_xxx:sk_live_xxx"`} />
      <CodeBlock label="Response" code={projectExample} />

      <DocNav prev={{ label: 'Sessions', path: 'concepts/sessions' }} next={{ label: 'The Location Object', path: 'resources/locations/object' }} />
    </div>
  )
}

// ── PAGE: The Location Object ─────────────────────────────────────────────────

function LocationObjectPage() {
  const locationExample = `{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Punto Central",
    "description": "Acceso principal al recorrido.",
    "instructions": null,
    "active": true,
    "order": 0,
    "latitude": -33.4372,
    "longitude": -70.6506,
    "boundary": {
      "type": "radius",
      "radiusMeters": 50
    },
    "schedule": {
      "enabled": true,
      "days": ["mon", "tue", "wed", "thu", "fri"],
      "startTime": "09:00",
      "endTime": "18:00"
    },
    "quota": {
      "enabled": true,
      "limit": 100,
      "used": 42,
      "remaining": 58
    },
    "dwell": {
      "enabled": true,
      "seconds": 60
    },
    "destination": {
      "type": "url",
      "url": "https://example.com/contenido"
    },
    "destinationCategory": "website",
    "pointCategory": "tourism",
    "createdAt": "2026-06-01T10:00:00.000Z"
  }
}`

  return (
    <div>
      <PageTitle
        title="The Location Object"
        badge="Resources / Locations"
        subtitle="Una Location (GeoPoint) es el recurso central de la API. Define el área geográfica y las reglas de disponibilidad que se evalúan en cada validación de presencia."
      />

      <P>El campo <code className="font-mono text-xs text-gray-300">id</code> de una Location es el valor que debes pasar como <code className="font-mono text-xs text-gray-300">location_id</code> en <DocLink to="resources/presence/validate">Presence Validate</DocLink> y <DocLink to="resources/presence/check">Presence Check</DocLink>.</P>

      <H2>Example</H2>
      <CodeBlock code={locationExample} label="Location Object" />

      <H2>Attributes</H2>
      <AttrTable rows={[
        { name: 'id',                  type: 'string (uuid)',     req: true,  desc: 'UUID único de la Location. Úsalo como location_id en Presence.' },
        { name: 'name',                type: 'string',            req: true,  desc: 'Nombre visible de la ubicación.' },
        { name: 'description',         type: 'string | null',                 desc: 'Descripción opcional.' },
        { name: 'instructions',        type: 'string | null',                 desc: 'Instrucciones para el usuario final en este punto.' },
        { name: 'active',              type: 'boolean',           req: true,  desc: 'Solo las Locations activas pueden pasar validación. Si false → failureReason: location_inactive.' },
        { name: 'order',               type: 'integer',           req: true,  desc: 'Posición de display dentro del proyecto (ascendente).' },
        { name: 'latitude',            type: 'number',            req: true,  desc: 'Latitud del centro en grados decimales.' },
        { name: 'longitude',           type: 'number',            req: true,  desc: 'Longitud del centro en grados decimales.' },
        { name: 'boundary',            type: 'object',            req: true,  desc: 'Configuración del área geográfica. Ver The boundary.' },
        { name: 'schedule',            type: 'object',            req: true,  desc: 'Restricciones de horario. Ver The schedule.' },
        { name: 'quota',               type: 'object',            req: true,  desc: 'Cupo máximo de validaciones. Ver The quota.' },
        { name: 'dwell',               type: 'object',            req: true,  desc: 'Tiempo mínimo de permanencia requerido. Ver The dwell check.' },
        { name: 'destination',         type: 'object',            req: true,  desc: 'Contenido a entregar en validación exitosa. Ver The destination.' },
        { name: 'destinationCategory', type: 'string | null',                 desc: 'website, whatsapp, form, reservation, ecommerce, social, map, coupon, custom.' },
        { name: 'pointCategory',       type: 'string | null',                 desc: 'gastronomy, retail, health, tourism, culture, education, services, events, entertainment, transport, accommodation, sport, real_estate, corporate, other.' },
        { name: 'createdAt',           type: 'string (datetime)', req: true,  desc: 'ISO 8601, precisión de milisegundo.' },
      ]} />

      <Divider />

      <H2>The boundary</H2>
      <P>Define el área geográfica dentro de la cual el usuario debe estar para pasar la validación. Soporta dos tipos: <code className="font-mono text-xs text-gray-300">radius</code> y <code className="font-mono text-xs text-gray-300">polygon</code>.</P>

      <H3>radius</H3>
      <P>Área circular definida por <code className="font-mono text-xs text-gray-300">radiusMeters</code> alrededor del centro (<code className="font-mono text-xs text-gray-300">latitude</code>, <code className="font-mono text-xs text-gray-300">longitude</code>).</P>
      <AttrTable rows={[
        { name: 'type',         type: '"radius"', req: true, desc: 'Discriminador de tipo.' },
        { name: 'radiusMeters', type: 'integer',  req: true, desc: 'Radio del área circular en metros.' },
      ]} />
      <CodeBlock code={`"boundary": {\n  "type": "radius",\n  "radiusMeters": 50\n}`} />

      <H3>polygon</H3>
      <P>Área de forma arbitraria definida por un array de coordenadas <code className="font-mono text-xs text-gray-300">[longitude, latitude]</code>. El último punto debe cerrar el polígono.</P>
      <AttrTable rows={[
        { name: 'type',    type: '"polygon"',  req: true, desc: 'Discriminador de tipo.' },
        { name: 'polygon', type: 'number[][]', req: true, desc: 'Array de pares [longitude, latitude].' },
      ]} />
      <CodeBlock code={`"boundary": {\n  "type": "polygon",\n  "polygon": [\n    [-70.6520, -33.4380],\n    [-70.6490, -33.4380],\n    [-70.6490, -33.4360],\n    [-70.6520, -33.4360],\n    [-70.6520, -33.4380]\n  ]\n}`} />

      <Callout type="info">Cuando <code className="font-mono text-xs">boundaryType</code> es <code className="font-mono text-xs">radius</code>, la respuesta de Presence incluye <code className="font-mono text-xs">distanceMeters</code> — la distancia del usuario al centro de la Location.</Callout>

      <Divider />

      <H2>The schedule</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">schedule.enabled</code> es <code className="font-mono text-xs text-gray-300">true</code>, la Location solo acepta validaciones en los días y horario configurados. Fuera del horario → <code className="font-mono text-xs text-gray-300">failureReason: outside_schedule</code>.</P>
      <AttrTable rows={[
        { name: 'enabled',   type: 'boolean',       req: true,  desc: 'Si las restricciones de horario están activas.' },
        { name: 'days',      type: 'string[]',       req: true,  desc: 'Días accesibles: mon, tue, wed, thu, fri, sat, sun.' },
        { name: 'startTime', type: 'string | null',              desc: 'Hora de apertura diaria en HH:MM. null si disabled.' },
        { name: 'endTime',   type: 'string | null',              desc: 'Hora de cierre diaria en HH:MM. null si disabled.' },
      ]} />
      <CodeBlock code={`"schedule": {\n  "enabled": true,\n  "days": ["mon", "tue", "wed", "thu", "fri"],\n  "startTime": "09:00",\n  "endTime": "18:00"\n}`} />

      <Divider />

      <H2>The quota</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">quota.enabled</code> es <code className="font-mono text-xs text-gray-300">true</code>, cada llamada exitosa a <code className="font-mono text-xs text-gray-300">/presence/validate</code> descuenta una unidad de <code className="font-mono text-xs text-gray-300">remaining</code>. Cuando llega a 0 → <code className="font-mono text-xs text-gray-300">failureReason: quota_exhausted</code>. Las llamadas a <code className="font-mono text-xs text-gray-300">/presence/check</code> nunca consumen quota.</P>
      <AttrTable rows={[
        { name: 'enabled',   type: 'boolean',        req: true,  desc: 'Si el control de cupo está activo.' },
        { name: 'limit',     type: 'integer | null',              desc: 'Total de validaciones permitidas. null si disabled.' },
        { name: 'used',      type: 'integer',         req: true,  desc: 'Validaciones consumidas hasta ahora.' },
        { name: 'remaining', type: 'integer | null',              desc: 'Validaciones restantes (limit - used, mínimo 0). null si disabled.' },
      ]} />

      <Divider />

      <H2>The dwell check</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">dwell.enabled</code> es <code className="font-mono text-xs text-gray-300">true</code>, el usuario debe haber permanecido dentro del área al menos <code className="font-mono text-xs text-gray-300">dwell.seconds</code> segundos. El cliente envía el tiempo transcurrido en <code className="font-mono text-xs text-gray-300">dwell_elapsed_seconds</code>.</P>
      <AttrTable rows={[
        { name: 'enabled', type: 'boolean', req: true, desc: 'Si se requiere permanencia mínima.' },
        { name: 'seconds', type: 'integer', req: true, desc: 'Segundos mínimos dentro del área.' },
      ]} />

      <Divider />

      <H2>The destination</H2>
      <P>Define el contenido entregado cuando <code className="font-mono text-xs text-gray-300">valid: true</code>. Cuando la validación falla, <code className="font-mono text-xs text-gray-300">destination</code> es <code className="font-mono text-xs text-gray-300">null</code>.</P>
      <AttrTable rows={[
        { name: 'type', type: '"url"',        req: true, desc: 'Tipo de destino. Actualmente siempre "url".' },
        { name: 'url',  type: 'string | null', req: true, desc: 'URL a entregar en validación exitosa. null si no hay contenido configurado.' },
      ]} />

      <Divider />

      <H2>La cadena de evaluación</H2>
      <P>Ubyca evalúa la Location en este orden. Cada check fallido detiene la evaluación y establece <code className="font-mono text-xs text-gray-300">failureReason</code>:</P>

      <div className="my-4 space-y-0">
        {[
          { n: 1, field: 'locationActive',    failure: 'location_inactive',               desc: '¿Está la Location activa?' },
          { n: 2, field: 'insideBoundary',    failure: 'outside_boundary',                desc: '¿Están las coordenadas dentro del área?' },
          { n: 3, field: 'scheduleActive',    failure: 'outside_schedule',                desc: '¿Es el horario actual válido?' },
          { n: 4, field: 'quotaAvailable',    failure: 'quota_exhausted',                 desc: '¿Quedan validaciones disponibles?' },
          { n: 5, field: 'liveVisitsMet',     failure: 'minimum_live_visits_not_reached', desc: '¿Hay suficientes usuarios concurrentes?' },
          { n: 6, field: 'dwellTimeMet',      failure: 'dwell_time_not_met',              desc: '¿Ha permanecido el usuario el tiempo mínimo?' },
        ].map((row) => (
          <div key={row.n} className="flex items-start gap-4 py-3 border-b border-gray-800/60 last:border-0">
            <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0 mt-0.5">{row.n}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{row.desc}</p>
              <p className="text-[11px] font-mono text-gray-600 mt-0.5">checks.{row.field}</p>
            </div>
            <code className="text-[10px] font-mono text-red-400/70 flex-shrink-0">{row.failure}</code>
          </div>
        ))}
      </div>

      <P>Los campos de <code className="font-mono text-xs text-gray-300">checks</code> correspondientes a checks no alcanzados están ausentes de la respuesta.</P>

      <Callout type="info">
        <p className="font-semibold mb-1.5">Live visits check (paso 5)</p>
        <p>Algunas ubicaciones pueden requerir un mínimo de usuarios concurrentes activos antes de permitir una validación exitosa. Cuando esta condición está configurada y no se cumple, la API responde con <code className="font-mono text-xs">failureReason: "minimum_live_visits_not_reached"</code>.</p>
        <p className="mt-2">Esta configuración se administra desde Ubyca Studio. No existe un atributo <code className="font-mono text-xs">liveVisits</code> en el Location Object de la API — no debe enviarse nada adicional en requests de Presence para este check. Ver la referencia completa de <code className="font-mono text-xs">checks.liveVisitsMet</code> y demás campos de diagnóstico en <DocLink to="resources/presence/overview">Presence Overview → The checks object</DocLink>.</p>
      </Callout>

      <DocNav prev={{ label: 'The Project Object', path: 'resources/projects' }} next={{ label: 'List Locations', path: 'resources/locations/list' }} />
    </div>
  )
}

// ── PAGE: List Locations ──────────────────────────────────────────────────────

function LocationListPage() {
  return (
    <div>
      <PageTitle title="List Locations" badge="Resources / Locations" />
      <EndpointBadge method="GET" path="/projects/{project_id}/locations" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="projects:read" /></div>
      <P>Devuelve todas las Locations del proyecto ordenadas por su campo <code className="font-mono text-xs text-gray-300">order</code>. Incluye todas, incluso las inactivas.</P>

      <H2>Path parameters</H2>
      <AttrTable rows={[{ name: 'project_id', type: 'string (uuid)', req: true, desc: 'UUID del proyecto.' }]} />

      <H2>Response</H2>
      <P>Array de <DocLink to="resources/locations/object">Location objects</DocLink> en <code className="font-mono text-xs text-gray-300">data</code> con <code className="font-mono text-xs text-gray-300">meta.count</code>.</P>
      <CodeBlock label="Response" code={`{\n  "data": [\n    {\n      "id": "660e8400-e29b-41d4-a716-446655440001",\n      "name": "Punto Central",\n      "active": true,\n      "order": 0,\n      "latitude": -33.4372,\n      "longitude": -70.6506,\n      "boundary": { "type": "radius", "radiusMeters": 50 },\n      "schedule": { "enabled": false, "days": [], "startTime": null, "endTime": null },\n      "quota": { "enabled": false, "limit": null, "used": 0, "remaining": null },\n      "dwell": { "enabled": false, "seconds": 0 },\n      "destination": { "type": "url", "url": "https://example.com/contenido" },\n      "createdAt": "2026-06-01T10:00:00.000Z"\n    }\n  ],\n  "meta": { "count": 1 }\n}`} />

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized', desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',    desc: 'Falta el scope projects:read.' },
        { name: '404', type: 'Not Found',    desc: 'El proyecto no existe o no pertenece a la organización.' },
      ]} />

      <DocNav prev={{ label: 'The Location Object', path: 'resources/locations/object' }} next={{ label: 'Get a Location', path: 'resources/locations/get' }} />
    </div>
  )
}

// ── PAGE: Get a Location ──────────────────────────────────────────────────────

function LocationGetPage() {
  const locationGetExample = `{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Punto Central",
    "description": "Acceso principal al recorrido.",
    "instructions": null,
    "active": true,
    "order": 0,
    "latitude": -33.4372,
    "longitude": -70.6506,
    "boundary": {
      "type": "radius",
      "radiusMeters": 50
    },
    "schedule": {
      "enabled": false,
      "days": [],
      "startTime": null,
      "endTime": null
    },
    "quota": {
      "enabled": false,
      "limit": null,
      "used": 0,
      "remaining": null
    },
    "dwell": {
      "enabled": false,
      "seconds": 0
    },
    "destination": {
      "type": "url",
      "url": "https://example.com/contenido"
    },
    "destinationCategory": "website",
    "pointCategory": "tourism",
    "createdAt": "2026-06-01T10:00:00.000Z"
  }
}`

  return (
    <div>
      <PageTitle title="Get a Location" badge="Resources / Locations" />
      <EndpointBadge method="GET" path="/locations/{id}" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="projects:read" /></div>
      <P>Devuelve una única Location por UUID. Debe pertenecer a la organización asociada a la credencial.</P>

      <H2>Path parameters</H2>
      <AttrTable rows={[{ name: 'id', type: 'string (uuid)', req: true, desc: 'UUID de la Location.' }]} />

      <H2>Response</H2>
      <P>Un <DocLink to="resources/locations/object">Location object</DocLink> en <code className="font-mono text-xs text-gray-300">data</code>. Returns a single Location object wrapped in data.</P>
      <CodeBlock code={locationGetExample} label="Get a Location" />
      <Callout type="info">
        If the location exists but belongs to another organization, the API returns 404 rather than exposing its existence.
      </Callout>

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized', desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',    desc: 'Falta el scope projects:read.' },
        { name: '404', type: 'Not Found',    desc: 'La Location no existe o no pertenece a la organización.' },
      ]} />

      <DocNav prev={{ label: 'List Locations', path: 'resources/locations/list' }} next={{ label: 'Presence Overview', path: 'resources/presence/overview' }} />
    </div>
  )
}

// ── PAGE: Presence Overview ───────────────────────────────────────────────────

function PresenceOverviewPage() {
  const requestExample = `curl -X POST ${BASE}/presence/validate \\
  -u "ubk_live_xxx:sk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "location_id": "660e8400-e29b-41d4-a716-446655440001",
    "session_id": "session-abc-123",
    "coordinates": {
      "latitude": -33.4372,
      "longitude": -70.6506,
      "accuracy_meters": 8.0
    },
    "dwell_elapsed_seconds": 120,
    "timestamp": "2026-06-19T15:30:00Z",
    "context": {
      "user_ref": "user-xyz",
      "metadata": { "channel": "mobile" }
    }
  }'`

  const validResponse = `{
  "valid": true,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": {
    "locationActive": true,
    "insideBoundary": true,
    "boundaryType": "radius",
    "distanceMeters": 34.7,
    "scheduleActive": true,
    "quotaAvailable": true,
    "quotaRemaining": 9,
    "liveVisitsEnabled": false,
    "liveVisitsMet": true,
    "dwellRequired": false
  },
  "destination": {
    "type": "url",
    "url": "https://example.com/contenido"
  },
  "failureReason": null,
  "eventId": "770e8400-e29b-41d4-a716-446655440010"
}`

  const failResponse = `{
  "valid": false,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": {
    "locationActive": true,
    "insideBoundary": false,
    "boundaryType": "radius",
    "distanceMeters": 312.4
  },
  "destination": null,
  "failureReason": "outside_boundary",
  "eventId": "770e8400-e29b-41d4-a716-446655440011"
}`

  return (
    <div>
      <PageTitle title="Presence Validation" badge="Resources / Presence" subtitle="Valida si un usuario está físicamente presente en una Location, evaluando boundary, schedule, quota, live visits y dwell." />

      <H2>Modelo pull</H2>
      <P>La API de Presence usa un modelo pull: tu backend envía las coordenadas GPS del usuario y Ubyca evalúa si se cumplen todas las condiciones de disponibilidad configuradas en la <DocLink to="resources/locations/object">Location</DocLink>. No hay webhooks ni notificaciones push.</P>

      <Callout type="warning">
        <strong className="font-semibold">HTTP 200 para todos los outcomes.</strong> Tanto las validaciones exitosas (<code className="font-mono text-xs">valid: true</code>) como las fallidas (<code className="font-mono text-xs">valid: false</code>) devuelven HTTP 200. Usa el campo <code className="font-mono text-xs">valid</code> — no el código HTTP — para determinar el resultado.
      </Callout>

      <H2>Check vs. Validate</H2>
      <div className="my-4 border border-white/[0.07] rounded-xl overflow-x-auto">
        <table className="w-full text-xs min-w-[480px]">
          <thead>
            <tr className="bg-gray-900/60 border-b border-white/[0.06]">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-500 w-40"></th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-400">POST /presence/check</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-400">POST /presence/validate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {[
              { label: 'Scope',                check: 'presence:check',  validate: 'presence:validate' },
              { label: 'Consume quota',         check: 'No',              validate: 'Sí' },
              { label: 'Registra eventos',      check: 'No',              validate: 'Sí (presence.validated, destination.delivered)' },
              { label: 'Actualiza live visits', check: 'No',              validate: 'Sí' },
              { label: 'eventId',               check: 'Siempre null',    validate: 'UUID si el evento fue grabado' },
              { label: 'Idempotency-Key',       check: 'No soportado',    validate: 'Soportado (TTL: 24h)' },
            ].map((row) => (
              <tr key={row.label}>
                <td className="px-4 py-2.5 text-gray-500 font-medium">{row.label}</td>
                <td className="px-4 py-2.5 text-gray-400">{row.check}</td>
                <td className="px-4 py-2.5 text-gray-400">{row.validate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Divider />

      <H2>The request</H2>
      <CodeBlock code={requestExample} label="Presence Validate" />

      <H3>Request fields</H3>
      <AttrTable rows={[
        { name: 'location_id',                type: 'string',  req: true,  desc: 'UUID de la Location objetivo. Obtenerlo desde GET /projects/{id}/locations.' },
        { name: 'session_id',                 type: 'string',  req: true,  desc: 'Identificador de sesión del usuario final (cualquier string no vacío).' },
        { name: 'coordinates',                type: 'object',  req: true,  desc: 'Coordenadas GPS actuales del usuario.' },
        { name: 'coordinates.latitude',       type: 'number',  req: true,  desc: 'Latitud en grados decimales (-90 a 90).' },
        { name: 'coordinates.longitude',      type: 'number',  req: true,  desc: 'Longitud en grados decimales (-180 a 180).' },
        { name: 'coordinates.accuracy_meters',type: 'number',              desc: 'Radio de precisión GPS en metros. Opcional.' },
        { name: 'dwell_elapsed_seconds',      type: 'integer',             desc: 'Segundos dentro del área. Funcionalmente requerido cuando dwell.enabled: true.' },
        { name: 'timestamp',                  type: 'string',              desc: 'ISO 8601. Usado para evaluar el schedule. Por defecto: tiempo del servidor.' },
        { name: 'context',                    type: 'object',              desc: 'Metadata opcional almacenada en el evento de analytics.' },
        { name: 'context.user_ref',           type: 'string',              desc: 'Referencia de usuario en el sistema del cliente.' },
        { name: 'context.metadata',           type: 'object',              desc: 'Pares clave-valor arbitrarios almacenados en el contexto del evento.' },
      ]} />

      <Divider />

      <H2>The response</H2>
      <H3>Valid: true</H3>
      <CodeBlock code={validResponse} />
      <H3>Valid: false</H3>
      <CodeBlock code={failResponse} />

      <H3>Response fields</H3>
      <AttrTable rows={[
        { name: 'valid',         type: 'boolean',       req: true, desc: 'true si todos los checks pasaron. false si alguno falló.' },
        { name: 'locationId',    type: 'string (uuid)', req: true, desc: 'UUID de la Location evaluada.' },
        { name: 'sessionId',     type: 'string',        req: true, desc: 'Session ID recibido en la request.' },
        { name: 'checks',        type: 'object',        req: true, desc: 'Resultados diagnósticos por check. Ver The checks object.' },
        { name: 'destination',   type: 'object | null', req: true, desc: 'Destino entregado cuando valid: true y hay contenido. null cuando valid: false.' },
        { name: 'failureReason', type: 'string | null', req: true, desc: 'Código de fallo cuando valid: false. null cuando valid: true.' },
        { name: 'eventId',       type: 'string | null', req: true, desc: '/validate: UUID del evento grabado. /check: siempre null.' },
      ]} />

      <Divider />

      <H2>The checks object</H2>
      <P>Los campos de <code className="font-mono text-xs text-gray-300">checks</code> son condicionales — solo se incluyen los checks alcanzados antes del fallo o al completar la evaluación.</P>
      <AttrTable rows={[
        { name: 'locationActive',     type: 'boolean', desc: 'Si la Location está activa.' },
        { name: 'insideBoundary',     type: 'boolean', desc: 'Si las coordenadas caen dentro del área configurada.' },
        { name: 'boundaryType',       type: 'string',  desc: '"radius" o "polygon".' },
        { name: 'distanceMeters',     type: 'number',  desc: 'Distancia al centro en metros. Solo cuando boundaryType es "radius".' },
        { name: 'scheduleActive',     type: 'boolean', desc: 'Si el horario actual está dentro del schedule configurado.' },
        { name: 'quotaAvailable',     type: 'boolean', desc: 'Si hay cupo disponible. Solo cuando quota.enabled: true.' },
        { name: 'quotaRemaining',     type: 'integer', desc: 'Validaciones restantes. Solo cuando quota.enabled: true.' },
        { name: 'liveVisitsEnabled',  type: 'boolean', desc: 'Si se exige un mínimo de usuarios concurrentes.' },
        { name: 'liveVisitsRequired', type: 'integer', desc: 'Mínimo requerido. Solo cuando liveVisitsEnabled: true.' },
        { name: 'liveVisitsCurrent',  type: 'integer', desc: 'Usuarios activos actualmente, excluyendo la sesión del request. Solo cuando liveVisitsEnabled: true.' },
        { name: 'liveVisitsMet',      type: 'boolean', desc: 'Si se cumple el mínimo de usuarios concurrentes (contando al usuario actual como +1).' },
        { name: 'dwellRequired',      type: 'boolean', desc: 'Si la Location exige permanencia mínima.' },
        { name: 'dwellTimeMet',       type: 'boolean', desc: 'Si el tiempo de permanencia fue suficiente. Solo cuando dwellRequired: true.' },
      ]} />

      <Divider />

      <H2>Failure reasons</H2>
      <AttrTable rows={[
        { name: 'location_inactive',               type: '', desc: 'La Location está desactivada (active: false).' },
        { name: 'outside_boundary',                type: '', desc: 'Las coordenadas caen fuera del área configurada.' },
        { name: 'outside_schedule',                type: '', desc: 'El momento del request está fuera del horario configurado.' },
        { name: 'quota_exhausted',                 type: '', desc: 'El cupo de validaciones se agotó (remaining: 0).' },
        { name: 'minimum_live_visits_not_reached', type: '', desc: 'No hay suficientes usuarios concurrentes en el área.' },
        { name: 'dwell_required',                  type: '', desc: 'La Location requiere permanencia y dwell_elapsed_seconds no fue enviado.' },
        { name: 'dwell_time_not_met',              type: '', desc: 'El tiempo enviado es menor al mínimo requerido.' },
      ]} />

      <Divider />

      <H2>Idempotency</H2>
      <P><code className="font-mono text-xs text-gray-300">POST /presence/validate</code> soporta el header <code className="font-mono text-xs text-gray-300">Idempotency-Key</code> (TTL: 24h, máx. 255 chars).</P>
      <CodeBlock code={`curl -X POST ${BASE}/presence/validate \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -H "Idempotency-Key: req_a1b2c3d4-e5f6-7890-abcd-ef1234567890" \\\n  -d '{ "location_id": "...", "session_id": "...", "coordinates": {...} }'`} />
      <P>Si la misma clave está en progreso → <code className="font-mono text-xs text-gray-300">409 Conflict</code> con <code className="font-mono text-xs text-gray-300">retryAfter</code> en segundos.</P>
      <CodeBlock code={`HTTP/1.1 409 Conflict\n\n{\n  "error": "Request in progress",\n  "retryAfter": 30\n}`} />

      <DocNav prev={{ label: 'Get a Location', path: 'resources/locations/get' }} next={{ label: 'Check Presence', path: 'resources/presence/check' }} />
    </div>
  )
}

// ── PAGE: Check Presence ──────────────────────────────────────────────────────

function PresenceCheckPage() {
  const checkResponse = `{
  "valid": true,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": {
    "locationActive": true,
    "insideBoundary": true,
    "boundaryType": "radius",
    "distanceMeters": 34.7,
    "scheduleActive": true,
    "quotaAvailable": true,
    "quotaRemaining": 9,
    "liveVisitsEnabled": false,
    "liveVisitsMet": true,
    "dwellRequired": false
  },
  "destination": {
    "type": "url",
    "url": "https://example.com/contenido"
  },
  "failureReason": null,
  "eventId": null
}`

  return (
    <div>
      <PageTitle title="Check Presence" badge="Resources / Presence" subtitle="Dry-run de validación de presencia sin efectos secundarios." />
      <EndpointBadge method="POST" path="/presence/check" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="presence:check" /></div>
      <P>Evalúa la cadena completa de checks sin producir efectos secundarios. No consume quota, no registra eventos, no actualiza live visits. <code className="font-mono text-xs text-gray-300">eventId</code> es siempre <code className="font-mono text-xs text-gray-300">null</code>.</P>
      <Callout type="warning">HTTP 200 es devuelto tanto cuando <code className="font-mono text-xs">valid: true</code> como cuando <code className="font-mono text-xs">valid: false</code>. Usa el campo <code className="font-mono text-xs">valid</code> — no el código HTTP — para determinar el resultado.</Callout>

      <H2>Request</H2>
      <P>Mismos campos que <DocLink to="resources/presence/validate">Validate Presence</DocLink>. No soporta <code className="font-mono text-xs text-gray-300">Idempotency-Key</code>.</P>
      <CodeBlock label="Check" code={`curl -X POST ${BASE}/presence/check \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "location_id": "660e8400-e29b-41d4-a716-446655440001",\n    "session_id": "session-abc-123",\n    "coordinates": { "latitude": -33.4372, "longitude": -70.6506 }\n  }'`} />

      <H2>Response</H2>
      <P>Returns the same business evaluation used by Validate Presence, but does not record events. Ver <DocLink to="resources/presence/overview">Presence Overview → The response</DocLink> para la referencia completa de campos y el objeto <code className="font-mono text-xs text-gray-300">checks</code>.</P>
      <CodeBlock code={checkResponse} />

      <Divider />

      <H2>Check vs Validate</H2>
      <div className="my-4 border border-white/[0.07] rounded-xl overflow-x-auto">
        <table className="w-full text-xs min-w-[400px]">
          <thead>
            <tr className="bg-gray-900/60 border-b border-white/[0.06]">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-500 flex-1">Capability</th>
              <th className="text-center px-4 py-2.5 font-semibold text-gray-400 w-24">Check</th>
              <th className="text-center px-4 py-2.5 font-semibold text-gray-400 w-24">Validate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {[
              { label: 'Evaluates rules',     check: '✓',    validate: '✓'    },
              { label: 'Returns destination', check: '✓',    validate: '✓'    },
              { label: 'Returns checks',      check: '✓',    validate: '✓'    },
              { label: 'Records event',       check: '✗',    validate: '✓'    },
              { label: 'Consumes quota',      check: '✗',    validate: '✓'    },
              { label: 'eventId',             check: 'null', validate: 'UUID' },
            ].map((row) => (
              <tr key={row.label}>
                <td className="px-4 py-2.5 text-gray-400">{row.label}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${row.check === '✓' ? 'text-emerald-400' : row.check === '✗' ? 'text-red-400/70' : 'text-gray-500'}`}>{row.check}</td>
                <td className={`px-4 py-2.5 text-center font-mono ${row.validate === '✓' ? 'text-emerald-400' : row.validate === '✗' ? 'text-red-400/70' : 'text-gray-500'}`}>{row.validate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="tip">
        <strong className="font-semibold">Use Check before Validate.</strong>{' '}Check Presence is ideal for previews, eligibility checks, and client-side validation before performing a real validation. Use <DocLink to="resources/presence/validate">Validate Presence</DocLink> when you want to register the event and consume quota.
      </Callout>

      <Divider />

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized',   desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',       desc: 'Falta el scope presence:check.' },
        { name: '404', type: 'Not Found',       desc: 'location_id no existe o no pertenece a la organización.' },
        { name: '422', type: 'Unprocessable',   desc: 'Parámetros de request inválidos.' },
      ]} />

      <DocNav prev={{ label: 'Presence Overview', path: 'resources/presence/overview' }} next={{ label: 'Validate Presence', path: 'resources/presence/validate' }} />
    </div>
  )
}

// ── PAGE: Validate Presence ───────────────────────────────────────────────────

function PresenceValidatePage() {
  const requestExample = `curl -X POST ${BASE}/presence/validate \\
  -u "ubk_live_xxx:sk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "location_id": "660e8400-e29b-41d4-a716-446655440001",
    "session_id": "session-abc-123",
    "coordinates": {
      "latitude": -33.4372,
      "longitude": -70.6506,
      "accuracy_meters": 8.0
    },
    "dwell_elapsed_seconds": 120,
    "timestamp": "2026-06-19T15:30:00Z",
    "context": {
      "user_ref": "user-xyz",
      "metadata": { "channel": "mobile" }
    }
  }'`

  const validResponse = `{
  "valid": true,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": {
    "locationActive": true,
    "insideBoundary": true,
    "boundaryType": "radius",
    "distanceMeters": 34.7,
    "scheduleActive": true,
    "quotaAvailable": true,
    "quotaRemaining": 9,
    "liveVisitsEnabled": false,
    "liveVisitsMet": true,
    "dwellRequired": false
  },
  "destination": {
    "type": "url",
    "url": "https://example.com/contenido"
  },
  "failureReason": null,
  "eventId": "770e8400-e29b-41d4-a716-446655440010"
}`

  const failResponse = `{
  "valid": false,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": {
    "locationActive": true,
    "insideBoundary": false,
    "boundaryType": "radius",
    "distanceMeters": 312.4
  },
  "destination": null,
  "failureReason": "outside_boundary",
  "eventId": "770e8400-e29b-41d4-a716-446655440011"
}`

  return (
    <div>
      <PageTitle title="Validate Presence" badge="Resources / Presence" subtitle="Validación de presencia GPS con efectos secundarios completos." />
      <EndpointBadge method="POST" path="/presence/validate" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="presence:validate" /></div>
      <P>A diferencia de <DocLink to="resources/presence/check">Check</DocLink>, produce efectos secundarios: consume quota, registra eventos <code className="font-mono text-xs text-gray-300">presence.validated</code> y <code className="font-mono text-xs text-gray-300">destination.delivered</code>, y actualiza visitas en vivo.</P>
      <Callout type="warning">HTTP 200 es devuelto tanto cuando <code className="font-mono text-xs">valid: true</code> como cuando <code className="font-mono text-xs">valid: false</code>. Los efectos secundarios ocurren en ambos casos.</Callout>

      <H2>Request</H2>
      <P>Ver <DocLink to="resources/presence/overview">Presence Overview → The request</DocLink> para la referencia completa de todos los campos. Soporta el header <code className="font-mono text-xs text-gray-300">Idempotency-Key</code>.</P>
      <CodeBlock code={requestExample} label="Validate Presence" />

      <H2>Response</H2>
      <P>La respuesta siempre es HTTP 200. Usa el campo <code className="font-mono text-xs text-gray-300">valid</code> — no el código HTTP — para determinar el resultado. Ver <DocLink to="resources/presence/overview">Presence Overview → The response</DocLink> para la referencia completa de campos y el objeto <code className="font-mono text-xs text-gray-300">checks</code>.</P>

      <H3>valid: true</H3>
      <CodeBlock code={validResponse} />

      <H3>valid: false</H3>
      <CodeBlock code={failResponse} />

      <Divider />

      <H2>Side Effects</H2>
      <P>Validate Presence produce efectos secundarios que persisten en el sistema. A diferencia de <DocLink to="resources/presence/check">Check Presence</DocLink>, cada llamada válida a este endpoint:</P>
      <div className="my-4 space-y-2">
        {[
          { label: 'Registra eventos',      desc: 'presence.validated y destination.delivered se graban en analytics.' },
          { label: 'Consume quota',         desc: 'Si quota.enabled: true, descuenta una unidad de remaining.' },
          { label: 'Actualiza live visits', desc: 'La sesión queda activa en el conteo de visitas en vivo del proyecto.' },
        ].map((item) => (
          <div key={item.label} className="flex gap-3 px-4 py-2.5 bg-gray-900/40 border border-white/[0.05] rounded-lg">
            <span className="text-xs font-semibold text-gray-300 w-36 flex-shrink-0">{item.label}</span>
            <span className="text-xs text-gray-500">{item.desc}</span>
          </div>
        ))}
      </div>
      <Callout type="info">
        Los efectos secundarios ocurren tanto cuando <code className="font-mono text-xs">valid: true</code> como cuando <code className="font-mono text-xs">valid: false</code>. No ocurren ante errores HTTP 4xx (credenciales inválidas, scope insuficiente, parámetros inválidos). <DocLink to="resources/presence/check">Check Presence</DocLink> nunca produce efectos secundarios.
      </Callout>

      <Divider />

      <H2>Idempotency</H2>
      <P>Soporta el header <code className="font-mono text-xs text-gray-300">Idempotency-Key</code> (TTL: 24h, máx. 255 chars). Reenviar la misma clave con el mismo request devuelve la respuesta original sin producir efectos secundarios adicionales.</P>
      <CodeBlock code={`curl -X POST ${BASE}/presence/validate \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -H "Idempotency-Key: req_a1b2c3d4-e5f6-7890-abcd-ef1234567890" \\\n  -d '{ "location_id": "...", "session_id": "...", "coordinates": {...} }'`} label="Idempotency-Key" />
      <P>Si la misma clave está en progreso → <code className="font-mono text-xs text-gray-300">409 Conflict</code> con <code className="font-mono text-xs text-gray-300">retryAfter</code> en segundos. Ver <DocLink to="errors">Errors → Idempotency errors</DocLink>.</P>

      <Divider />

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized',  desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',     desc: 'Falta el scope presence:validate.' },
        { name: '404', type: 'Not Found',     desc: 'location_id no existe o no pertenece a la organización.' },
        { name: '409', type: 'Conflict',      desc: 'Idempotency-Key en uso — hay un request en progreso con esa clave.' },
        { name: '422', type: 'Unprocessable', desc: 'Parámetros de request inválidos.' },
      ]} />

      <DocNav prev={{ label: 'Check Presence', path: 'resources/presence/check' }} next={{ label: 'Analytics', path: 'resources/analytics' }} />
    </div>
  )
}

// ── PAGE: Analytics ───────────────────────────────────────────────────────────

function AnalyticsPage() {
  const summaryExample = `{
  "data": {
    "summary": {
      "radiusEntries": 3,
      "clicks": 2,
      "conversionPct": 67
    },
    "liveVisits": {
      "activeNow": 1,
      "mostActiveLocation": {
        "locationId": "660e8400-e29b-41d4-a716-446655440001",
        "locationName": "Punto Central",
        "activeNow": 1
      },
      "lastHourDeltaPct": 15,
      "peakToday": {
        "label": "14:00–15:00",
        "count": 34
      }
    }
  }
}`

  const locationsExample = `{
  "data": [
    {
      "locationId": "660e8400-e29b-41d4-a716-446655440001",
      "locationName": "Punto Central",
      "radiusEntries": 2,
      "clicks": 2,
      "conversionPct": 100,
      "activeNow": 1
    },
    {
      "locationId": "660e8400-e29b-41d4-a716-446655440002",
      "locationName": "Punto Norte",
      "radiusEntries": 1,
      "clicks": 0,
      "conversionPct": 0,
      "activeNow": 0
    }
  ]
}`

  const distributionExample = `{
  "data": {
    "byHour": [
      { "hour": 9,  "count": 5  },
      { "hour": 14, "count": 12 },
      { "hour": 18, "count": 3  }
    ],
    "byDayOfWeek": [
      { "day": 1, "count": 7 },
      { "day": 3, "count": 4 },
      { "day": 5, "count": 9 }
    ],
    "geo": {
      "countries": [
        { "label": "Chile",     "count": 18, "pct": 90 },
        { "label": "Argentina", "count": 2,  "pct": 10 }
      ],
      "cities": [
        { "label": "Santiago", "count": 15, "pct": 75 }
      ],
      "communes": [
        { "label": "Providencia", "count": 10, "pct": 50 }
      ]
    }
  }
}`

  const intensityExample = `{
  "data": [
    {
      "locationId": "660e8400-e29b-41d4-a716-446655440001",
      "locationName": "Punto Central",
      "lat": -33.4372,
      "lng": -70.6506,
      "entryCount": 42
    },
    {
      "locationId": "660e8400-e29b-41d4-a716-446655440002",
      "locationName": "Punto Norte",
      "lat": -33.4200,
      "lng": -70.6400,
      "entryCount": 17
    }
  ]
}`

  const outsideAreasExample = `{
  "data": {
    "mode": "historical",
    "hotspots": [
      {
        "lat": -35.0,
        "lng": -59.0,
        "count": 3,
        "intensity": 1.0,
        "radiusMeters": 8
      },
      {
        "lat": -35.01,
        "lng": -59.01,
        "count": 1,
        "intensity": 0.3333,
        "radiusMeters": 8
      }
    ],
    "meta": {
      "totalPoints": 5,
      "outsidePoints": 4,
      "activeGeoPointsCount": 2
    }
  }
}`

  return (
    <div>
      <PageTitle
        title="Analytics"
        badge="Resources / Analytics"
        subtitle="Transforma eventos de presencia en métricas agregadas. Cubre tráfico histórico, conversión, distribución temporal, heatmaps de entradas, y actividad GPS fuera de áreas definidas."
      />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="analytics:read" /></div>

      <P>Los endpoints de analytics consumen dos tipos de eventos registrados por Presence Validate:</P>
      <div className="my-4 grid sm:grid-cols-2 gap-3">
        {[
          { label: 'Eventos de entrada', events: 'radius_enter, presence.validated', field: 'radiusEntries' },
          { label: 'Eventos de conversión', events: 'point_click, destination.delivered', field: 'clicks, conversionPct' },
        ].map((t) => (
          <div key={t.label} className="px-4 py-3 bg-gray-900/40 border border-white/[0.06] rounded-xl">
            <p className="text-xs font-semibold text-gray-300 mb-1">{t.label}</p>
            <p className="text-[11px] font-mono text-gray-600 break-all">{t.events}</p>
            <p className="text-[11px] text-gray-600 mt-1">→ <code className="font-mono">{t.field}</code></p>
          </div>
        ))}
      </div>

      <H2>Parámetros comunes</H2>
      <AttrTable rows={[
        { name: 'from',        type: 'string (date)', desc: 'Inicio del rango, inclusive, formato YYYY-MM-DD. Aplica al event_date del evento.' },
        { name: 'to',          type: 'string (date)', desc: 'Fin del rango, inclusive, formato YYYY-MM-DD.' },
        { name: 'location_id', type: 'string (uuid)', desc: 'Filtrar por una Location. Disponible en summary, distribution y outside_areas. Error 404 si no pertenece al proyecto.' },
      ]} />

      <Divider />

      {/* ── Summary ── */}
      <H2>Summary</H2>
      <EndpointBadge method="GET" path="/projects/{id}/analytics" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="analytics:read" /></div>
      <P>Métricas agregadas del proyecto más el estado de visitas en vivo. Filtra por rango de fecha y/o location_id.</P>
      <CodeBlock code={summaryExample} label="Analytics Summary" />

      <H3>summary</H3>
      <AttrTable rows={[
        { name: 'radiusEntries', type: 'integer',      desc: 'Entradas únicas contadas por radius_enter + presence.validated.' },
        { name: 'clicks',        type: 'integer',      desc: 'Conversiones contadas por point_click + destination.delivered.' },
        { name: 'conversionPct', type: 'integer 0–100', desc: 'unique clickers / unique enterers × 100, redondeado. 0 si no hay entradas.' },
      ]} />

      <H3>liveVisits</H3>
      <AttrTable rows={[
        { name: 'activeNow',           type: 'integer',      desc: 'Sesiones activas en este momento en todas las Locations del proyecto.' },
        { name: 'mostActiveLocation',  type: 'object | null', desc: 'Location con más sesiones activas ahora. null cuando activeNow es 0.' },
        { name: 'lastHourDeltaPct',    type: 'integer | null', desc: 'Cambio porcentual de sesiones activas vs. hace 1 hora. null si no hay dato previo.' },
        { name: 'peakToday',           type: 'object | null', desc: 'Ventana de 1 hora con más actividad hoy (label: "14:00–15:00"). null si no hay datos.' },
      ]} />

      <Divider />

      {/* ── Locations ── */}
      <H2>Locations</H2>
      <EndpointBadge method="GET" path="/projects/{id}/analytics/locations" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="analytics:read" /></div>
      <P>Breakdown de métricas por Location. Incluye todas las Locations del proyecto, incluso las que tienen cero eventos. No soporta filtro por <code className="font-mono text-xs text-gray-300">location_id</code>.</P>
      <CodeBlock code={locationsExample} label="Analytics Locations" />
      <AttrTable rows={[
        { name: 'locationId',    type: 'string (uuid)', desc: 'UUID de la Location.' },
        { name: 'locationName',  type: 'string',        desc: 'Nombre de la Location.' },
        { name: 'radiusEntries', type: 'integer',       desc: 'Entradas en esta Location.' },
        { name: 'clicks',        type: 'integer',       desc: 'Conversiones en esta Location.' },
        { name: 'conversionPct', type: 'integer 0–100', desc: 'Tasa de conversión para esta Location.' },
        { name: 'activeNow',     type: 'integer',       desc: 'Sesiones activas ahora en esta Location.' },
      ]} />

      <Divider />

      {/* ── Distribution ── */}
      <H2>Distribution</H2>
      <EndpointBadge method="GET" path="/projects/{id}/analytics/distribution" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="analytics:read" /></div>
      <P>Distribución de eventos en tres dimensiones: hora del día (0–23), día de la semana (0=Dom, 6=Sáb) y geografía (país, ciudad, comuna). Solo se incluyen horas/días con al menos un evento.</P>
      <CodeBlock code={distributionExample} label="Analytics Distribution" />
      <H3>geo</H3>
      <AttrTable rows={[
        { name: 'label', type: 'string',       desc: 'Nombre del país, ciudad o comuna.' },
        { name: 'count', type: 'integer',      desc: 'Eventos atribuidos a esta entidad geográfica.' },
        { name: 'pct',   type: 'integer 0–100', desc: 'Porcentaje del total de eventos, redondeado.' },
      ]} />
      <Callout type="info">Solo se incluyen eventos con geocodificación resuelta. Eventos sin coordenadas geocodificadas quedan excluidos de <code className="font-mono text-xs">geo</code>.</Callout>

      <Divider />

      {/* ── Intensity ── */}
      <H2>Intensity</H2>
      <EndpointBadge method="GET" path="/projects/{id}/analytics/intensity" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="analytics:read" /></div>
      <P>Conteo histórico de entradas por Location con sus coordenadas. Útil para heatmaps. Siempre devuelve el total histórico — no soporta filtros de fecha ni <code className="font-mono text-xs text-gray-300">location_id</code>.</P>
      <CodeBlock code={intensityExample} label="Analytics Intensity" />
      <AttrTable rows={[
        { name: 'locationId',   type: 'string (uuid)', desc: 'UUID de la Location.' },
        { name: 'locationName', type: 'string',        desc: 'Nombre de la Location.' },
        { name: 'lat',          type: 'number',        desc: 'Latitud del centro de la Location.' },
        { name: 'lng',          type: 'number',        desc: 'Longitud del centro de la Location.' },
        { name: 'entryCount',   type: 'integer',       desc: 'Total histórico de entradas (radius_enter + presence.validated).' },
      ]} />

      <Divider />

      {/* ── Outside Areas ── */}
      <H2>Outside Areas</H2>
      <EndpointBadge method="GET" path="/projects/{id}/analytics/outside_areas" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="analytics:read" /></div>
      <P>Coordenadas GPS registradas fuera de todas las áreas activas del proyecto, agrupadas en hotspots. Soporta dos modos:</P>
      <div className="my-4 grid sm:grid-cols-2 gap-3">
        <div className="px-4 py-3 bg-gray-900/40 border border-white/[0.06] rounded-xl">
          <p className="text-xs font-semibold text-gray-300 mb-1"><code className="font-mono">mode=historical</code> (default)</p>
          <p className="text-xs text-gray-500">GPS de eventos pasados con <code className="font-mono text-xs">had_outside_position: true</code>. Acepta filtros de fecha.</p>
        </div>
        <div className="px-4 py-3 bg-gray-900/40 border border-white/[0.06] rounded-xl">
          <p className="text-xs font-semibold text-gray-300 mb-1"><code className="font-mono">mode=live</code></p>
          <p className="text-xs text-gray-500">Posiciones GPS actuales de sesiones activas. Los filtros de fecha se ignoran.</p>
        </div>
      </div>
      <P>Los hotspots están agrupados en una grilla de ~11 m de precisión, ordenados descendente por count. <code className="font-mono text-xs text-gray-300">intensity</code> está normalizado 0.0–1.0 relativo al hotspot con mayor count. <code className="font-mono text-xs text-gray-300">radiusMeters</code> es siempre 8.</P>
      <CodeBlock code={outsideAreasExample} label="Analytics Outside Areas" />
      <AttrTable rows={[
        { name: 'mode',                    type: '"historical" | "live"', desc: 'Modo aplicado a la respuesta.' },
        { name: 'hotspots[].lat',          type: 'number',               desc: 'Latitud del centroide del cluster.' },
        { name: 'hotspots[].lng',          type: 'number',               desc: 'Longitud del centroide del cluster.' },
        { name: 'hotspots[].count',        type: 'integer',              desc: 'Puntos GPS en este cluster.' },
        { name: 'hotspots[].intensity',    type: 'number 0.0–1.0',       desc: 'Intensidad normalizada. El cluster más denso siempre tiene 1.0.' },
        { name: 'hotspots[].radiusMeters', type: 'integer',              desc: 'Radio visual del dot. Siempre 8.' },
        { name: 'meta.totalPoints',        type: 'integer',              desc: 'Total de puntos GPS evaluados.' },
        { name: 'meta.outsidePoints',      type: 'integer',              desc: 'Puntos que cayeron fuera de todas las áreas activas.' },
        { name: 'meta.activeGeoPointsCount', type: 'integer',            desc: 'Número de Locations activas usadas como límites de exclusión.' },
      ]} />

      <Divider />

      <H2>Time Range</H2>
      <P>Los parámetros <code className="font-mono text-xs text-gray-300">from</code> y <code className="font-mono text-xs text-gray-300">to</code> son opcionales y aplican al campo <code className="font-mono text-xs text-gray-300">event_date</code> de los eventos registrados. Los valores inválidos son ignorados silenciosamente.</P>
      <Callout type="info">
        The default time range is not part of the public API contract. Clients should explicitly provide <code className="font-mono text-xs">from</code> and <code className="font-mono text-xs">to</code> when requesting analytics.
      </Callout>
      <Callout type="tip">
        <strong className="font-semibold">Best Practice.</strong>{' '}For predictable reporting and reproducible results, always send both <code className="font-mono text-xs">from</code> and <code className="font-mono text-xs">to</code> parameters rather than relying on defaults.
      </Callout>

      <Divider />

      <H2>Errors</H2>
      <P>Todos los endpoints de Analytics pueden devolver los siguientes errores. Ver <DocLink to="errors">Errors</DocLink> y <DocLink to="rate-limits">Rate Limits</DocLink> para más detalles.</P>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized',      desc: 'Missing or invalid API credentials.' },
        { name: '403', type: 'Forbidden',         desc: 'Missing analytics:read scope.' },
        { name: '404', type: 'Not Found',         desc: 'Resource not found or inaccessible. Also applies when the location_id filter references a location not belonging to the project.' },
        { name: '429', type: 'Too Many Requests', desc: 'Rate limit exceeded. See Rate Limits for retry guidance.' },
      ]} />

      <DocNav prev={{ label: 'Validate Presence', path: 'resources/presence/validate' }} next={{ label: 'Errors', path: 'errors' }} />
    </div>
  )
}

// ── PAGE: Errors ──────────────────────────────────────────────────────────────

function ErrorsPage() {
  return (
    <div>
      <PageTitle title="Errors" badge="Reference" subtitle="La API usa códigos HTTP estándar. Los errores de negocio de presencia (valid: false) no son errores HTTP — siempre llegan en HTTP 200." />

      <Callout type="info">
        <strong className="font-semibold">HTTP 200 para outcomes de presencia.</strong> Una validación fallida (<code className="font-mono text-xs">failureReason: outside_boundary</code>, etc.) devuelve HTTP 200. Los errores 4xx indican problemas de autenticación, autorización, recurso no encontrado o parámetros inválidos.
      </Callout>

      <H2>The error object</H2>
      <P>Todos los errores devuelven JSON con al menos el campo <code className="font-mono text-xs text-gray-300">error</code>. Algunos errores incluyen campos adicionales.</P>
      <CodeBlock code={`// Error estándar\n{\n  "error": "Invalid or missing API credentials"\n}\n\n// Error de scope\n{\n  "error": "insufficient_scope",\n  "required": "presence:validate"\n}\n\n// Error de validación\n{\n  "error": "Invalid request parameters",\n  "details": {\n    "latitude": "must be between -90 and 90",\n    "session_id": "is required"\n  }\n}\n\n// Conflicto de idempotencia\n{\n  "error": "Request in progress",\n  "retryAfter": 30\n}`} />

      <Divider />

      <H2>HTTP Status Codes</H2>
      <AttrTable rows={[
        { name: '200 OK',                   type: '', desc: 'Request exitoso. Para Presence, el outcome está en el campo valid.' },
        { name: '401 Unauthorized',         type: '', desc: 'Credenciales ausentes o inválidas.' },
        { name: '403 Forbidden',            type: '', desc: 'Credenciales válidas pero scope insuficiente.' },
        { name: '404 Not Found',            type: '', desc: 'El recurso no existe o no pertenece a la organización.' },
        { name: '409 Conflict',             type: '', desc: 'Idempotency-Key en progreso. Esperar retryAfter segundos.' },
        { name: '422 Unprocessable Entity', type: '', desc: 'Parámetros de request fallaron validación.' },
      ]} />

      <Divider />

      <H2>Scope errors (403)</H2>
      <AttrTable rows={[
        { name: 'projects:read',     type: '403', desc: 'Falta en GET /projects, GET /projects/{id}, GET /projects/{id}/locations, GET /locations/{id}.' },
        { name: 'analytics:read',    type: '403', desc: 'Falta en todos los endpoints GET /projects/{id}/analytics/*.' },
        { name: 'presence:check',    type: '403', desc: 'Falta en POST /presence/check.' },
        { name: 'presence:validate', type: '403', desc: 'Falta en POST /presence/validate.' },
      ]} />

      <Divider />

      <H2>Validation errors (422)</H2>
      <CodeBlock code={`HTTP/1.1 422 Unprocessable Entity\n\n{\n  "error": "Invalid request parameters",\n  "details": {\n    "coordinates.latitude": "is required",\n    "session_id": "is required"\n  }\n}`} />

      <Divider />

      <H2>Idempotency errors (409)</H2>
      <P>Solo en <code className="font-mono text-xs text-gray-300">POST /presence/validate</code>. Espera <code className="font-mono text-xs text-gray-300">retryAfter</code> segundos y reintenta.</P>
      <CodeBlock code={`HTTP/1.1 409 Conflict\n\n{\n  "error": "Request in progress",\n  "retryAfter": 30\n}`} />

      <Divider />

      <H2>Presence failure reasons</H2>
      <P>Estos valores aparecen en el campo <code className="font-mono text-xs text-gray-300">failureReason</code> de una respuesta HTTP 200 cuando <code className="font-mono text-xs text-gray-300">valid: false</code>. No son errores HTTP.</P>
      <AttrTable rows={[
        { name: 'location_inactive',               type: 'HTTP 200', desc: 'La Location está desactivada.' },
        { name: 'outside_boundary',                type: 'HTTP 200', desc: 'Las coordenadas GPS caen fuera del área configurada.' },
        { name: 'outside_schedule',                type: 'HTTP 200', desc: 'El request llegó fuera del horario de operación.' },
        { name: 'quota_exhausted',                 type: 'HTTP 200', desc: 'El cupo de validaciones se agotó.' },
        { name: 'minimum_live_visits_not_reached', type: 'HTTP 200', desc: 'No hay suficientes usuarios concurrentes en el área.' },
        { name: 'dwell_required',                  type: 'HTTP 200', desc: 'La Location requiere permanencia y dwell_elapsed_seconds no fue enviado.' },
        { name: 'dwell_time_not_met',              type: 'HTTP 200', desc: 'El tiempo de permanencia enviado es menor al mínimo requerido.' },
      ]} />

      <Divider />

      <H2>Server Errors (5xx)</H2>
      <P>5xx responses indicate an unexpected error on the server side. These are not caused by the client request and do not require modifying the request before retrying.</P>
      <Callout type="info">
        If you receive a 5xx response, retry the request using exponential backoff: start with a short wait, double on each failure, and add random jitter to avoid synchronized retries across clients.
      </Callout>

      <DocNav prev={{ label: 'Analytics', path: 'resources/analytics' }} next={{ label: 'Rate Limits', path: 'rate-limits' }} />
    </div>
  )
}

// ── PAGE: Rate Limits ─────────────────────────────────────────────────────────

function RateLimitsPage() {
  return (
    <div>
      <PageTitle
        title="Rate Limits"
        badge="Reference"
        subtitle="La API aplica dos límites independientes: por IP de origen y por API Key. El primero que se alcanza bloquea la request con HTTP 429."
      />

      <H2>Límites actuales</H2>
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left py-2 pr-6 text-gray-500 font-medium">Límite</th>
              <th className="text-left py-2 pr-6 text-gray-500 font-medium">Valor</th>
              <th className="text-left py-2 text-gray-500 font-medium">Aplica a</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/[0.04]">
              <td className="py-2.5 pr-6 text-gray-300 font-medium">IP de origen</td>
              <td className="py-2.5 pr-6 font-mono text-brand-400">300 req / min</td>
              <td className="py-2.5 text-gray-500">Todos los endpoints de API v1</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-6 text-gray-300 font-medium">API Key</td>
              <td className="py-2.5 pr-6 font-mono text-brand-400">120 req / min</td>
              <td className="py-2.5 text-gray-500">Todos los endpoints excepto <code className="font-mono text-gray-400">GET /health</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout type="info">
        Los dos límites son independientes. Una misma request puede ser bloqueada por cualquiera de los dos, el que se alcance primero. <code className="font-mono text-xs">GET /health</code> está excluido del límite por API Key, pero sigue sujeto al límite por IP.
      </Callout>
      <Callout type="info">
        <strong className="font-semibold">No rate limit headers.</strong> Ubyca no expone los headers <code className="font-mono text-xs">X-RateLimit-Limit</code>, <code className="font-mono text-xs">X-RateLimit-Remaining</code> ni <code className="font-mono text-xs">X-RateLimit-Reset</code>. Las respuestas normales no incluyen información de cuota restante. El único header relacionado con rate limiting es <code className="font-mono text-xs">Retry-After</code>, y solo aparece cuando la API responde con HTTP 429.
      </Callout>

      <Divider />

      <H2>429 Too Many Requests</H2>
      <P>Al exceder cualquiera de los dos límites, la API responde con HTTP 429. La respuesta incluye el header <code className="font-mono text-xs text-gray-300">Retry-After</code> con la duración de la ventana de throttle en segundos.</P>
      <CodeBlock code={`HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 60

{
  "error": "Demasiadas solicitudes. Intenta nuevamente más tarde."
}`} label="429 Too Many Requests" />

      <H3>Header Retry-After</H3>
      <AttrTable rows={[
        {
          name: 'Retry-After',
          type: 'integer (segundos)',
          desc: 'Tiempo mínimo a esperar antes de reintentar. Solo presente en respuestas 429. Valor actual: 60. Las respuestas normales no incluyen headers informativos de rate limiting.',
        },
      ]} />

      <Divider />

      <H2>Manejo de 429</H2>
      <Callout type="warning">
        No reintentes inmediatamente. Lee el header <code className="font-mono text-xs">Retry-After</code> y espera esa cantidad de segundos antes de reintentar.
      </Callout>
      <CodeBlock code={`// Leer Retry-After y esperar
const retryAfter = parseInt(response.headers.get('Retry-After') ?? '60', 10)
const waitMs = retryAfter * 1000

await new Promise(resolve => setTimeout(resolve, waitMs))

// Reintentar el request`} label="Respetar Retry-After" />

      <H2>Buenas prácticas</H2>
      <div className="space-y-3 my-4">
        {[
          {
            title: 'Respetar Retry-After',
            desc: 'Cuando recibes un 429, lee el header Retry-After y espera exactamente esa cantidad de segundos antes de reintentar. El valor actual es 60.',
          },
          {
            title: 'Backoff exponencial',
            desc: 'Si continúas recibiendo 429 tras el primer retry, aplica backoff exponencial con jitter: espera 2ⁿ segundos más un valor aleatorio antes de cada reintento adicional.',
          },
          {
            title: 'Evitar polling agresivo',
            desc: 'No consultes analytics o listas de ubicaciones en bucles cortos. Con 120 req/min por API Key, un bucle de 2 segundos agota el cupo en 4 minutos aunque no haya actividad real.',
          },
          {
            title: 'Cachear respuestas de lectura',
            desc: 'Los endpoints GET de proyectos, locations y analytics son adecuados para cachear del lado del cliente. Reduce el consumo de cupo y protege contra bursts involuntarios.',
          },
        ].map((t) => (
          <div key={t.title} className="px-4 py-3 bg-gray-900/40 border border-white/[0.06] rounded-xl">
            <p className="text-xs font-semibold text-gray-300 mb-1">{t.title}</p>
            <p className="text-xs text-gray-500">{t.desc}</p>
          </div>
        ))}
      </div>

      <DocNav prev={{ label: 'Errors', path: 'errors' }} next={{ label: 'Versioning', path: 'reference/versioning' }} />
    </div>
  )
}

// ── PAGE: Reference — Versioning ─────────────────────────────────────────────

function VersioningPage() {
  return (
    <div>
      <PageTitle
        title="Versioning"
        badge="Reference"
        subtitle="How Ubyca versions its public API and what changes you can expect."
      />

      <H2>Current Version</H2>
      <P>Current API version: <code className="font-mono text-xs text-gray-300">v1</code></P>
      <CodeBlock code="https://api.ubyca.com/api/v1" />
      <P>All public endpoints documented today belong to API v1.</P>

      <H2>Non-Breaking Changes</H2>
      <P>Ubyca may introduce compatible changes within v1 at any time. These do not require updates to existing integrations:</P>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>New endpoints</li>
        <li>New fields in responses</li>
        <li>New optional request parameters</li>
        <li>New documented examples</li>
        <li>Documentation improvements</li>
      </ul>
      <Callout type="info">Clients should ignore unknown response fields to remain forward compatible.</Callout>

      <H2>Breaking Changes</H2>
      <P>The following changes are considered breaking and will not be introduced within v1:</P>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>Removal of endpoints</li>
        <li>Removal of response fields</li>
        <li>Incompatible behavior changes</li>
        <li>Authentication mechanism changes</li>
      </ul>
      <Callout type="warning">Breaking changes require a new major API version.</Callout>

      <H2>Future Versions</H2>
      <P>Future major versions will be released under a new base path:</P>
      <CodeBlock code={`https://api.ubyca.com/api/v1\nhttps://api.ubyca.com/api/v2`} />
      <P>Multiple versions will coexist during a transition period to give integrators time to migrate.</P>

      <H2>Staying Informed</H2>
      <P>Changes to the public API are announced through the <DocLink to="reference/changelog">API Changelog</DocLink>.</P>

      <DocNav prev={{ label: 'Rate Limits', path: 'rate-limits' }} next={{ label: 'Changelog', path: 'reference/changelog' }} />
    </div>
  )
}

// ── PAGE: Reference — Changelog ───────────────────────────────────────────────

function ChangelogPage() {
  return (
    <div>
      <PageTitle
        title="API Changelog"
        badge="Reference"
        subtitle="The API Changelog tracks notable additions and improvements to Ubyca's public API and developer documentation."
      />

      <P>Use this page to stay informed about new capabilities, documentation updates, and compatibility-related changes.</P>

      <Callout type="info">The changelog highlights notable public-facing changes. Minor internal improvements may not appear here.</Callout>

      <H2>2026-06</H2>

      <H3>Documentation</H3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>Added comprehensive Presence Check documentation.</li>
        <li>Added comprehensive Presence Validate documentation.</li>
        <li>Expanded Quick Start with an end-to-end integration flow.</li>
        <li>Added Rate Limits documentation aligned with the production API.</li>
        <li>Added Versioning documentation.</li>
        <li>Added Analytics error handling and time range guidance.</li>
        <li>Expanded Project and Location reference pages.</li>
      </ul>

      <H3>Developer Experience</H3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>Added OpenAPI download access from the documentation sidebar.</li>
        <li>Improved mobile documentation navigation.</li>
        <li>Simplified documentation structure by removing redundant concepts.</li>
      </ul>

      <Divider />

      <H2>2026-05</H2>

      <H3>Initial Release</H3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>Public API v1 released.</li>
        <li>Authentication via API Key and Secret.</li>
        <li>Projects, Locations, Presence and Analytics endpoints available.</li>
      </ul>

      <DocNav prev={{ label: 'Versioning', path: 'reference/versioning' }} />
    </div>
  )
}

// ── Content router ────────────────────────────────────────────────────────────

export function DocContent({ section }: { section: string }) {
  switch (section) {
    case 'overview':                    return <OverviewPage />
    case 'quickstart':                  return <QuickStartPage />
    case 'authentication':              return <AuthenticationPage />
    case 'scopes':                      return <ScopesPage />
    case 'concepts/locations':          return <LocationObjectPage />
    case 'concepts/sessions':           return <ConceptSessionsPage />
    case 'concepts/presence':           return <PresenceOverviewPage />
    case 'resources/projects':          return <ResourcesProjectsPage />
    case 'resources/locations/object':  return <LocationObjectPage />
    case 'resources/locations/list':    return <LocationListPage />
    case 'resources/locations/get':     return <LocationGetPage />
    case 'resources/presence/overview': return <PresenceOverviewPage />
    case 'resources/presence/check':    return <PresenceCheckPage />
    case 'resources/presence/validate': return <PresenceValidatePage />
    case 'resources/analytics':         return <AnalyticsPage />
    case 'errors':                      return <ErrorsPage />
    case 'rate-limits':                 return <RateLimitsPage />
    case 'reference/versioning':        return <VersioningPage />
    case 'reference/changelog':         return <ChangelogPage />
    default:                            return <OverviewPage />
  }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  const { basePath } = useDocsCtx()
  const navigate = useNavigate()

  function go(path: string) {
    navigate(`${basePath}/${path}`)
    onNavigate?.()
  }

  function NavItem({ item }: { item: NavItem }) {
    const active = current === item.path
    return (
      <button
        onClick={() => go(item.path)}
        className={[
          'w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors duration-100',
          active
            ? 'bg-brand-900/40 text-brand-300 font-medium'
            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50',
        ].join(' ')}
      >
        {item.label}
      </button>
    )
  }

  return (
    <nav className="flex flex-col py-4">
      <div className="space-y-5 flex-1">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-1 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">{group.group}</p>
            {group.items && (
              <div className="space-y-0.5">
                {group.items.map((item) => <NavItem key={item.path} item={item} />)}
              </div>
            )}
            {group.sub && group.sub.map((sub) => (
              <div key={sub.label} className="mt-3">
                <p className="px-3 mb-1 text-[10px] font-medium text-gray-600">{sub.label}</p>
                <div className="space-y-0.5">
                  {sub.items.map((item) => <NavItem key={item.path} item={item} />)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Persistent OpenAPI spec download */}
      <div className="mt-6 px-3 pb-2">
        <a
          href={OPENAPI_URL}
          download="openapi.yaml"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-white/[0.07] text-xs text-gray-500 hover:text-gray-300 hover:border-white/[0.15] hover:bg-gray-800/40 transition-colors"
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>OpenAPI Spec</span>
          <span className="ml-auto text-[10px] font-mono text-gray-700">yaml</span>
        </a>
      </div>
    </nav>
  )
}
