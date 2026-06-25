import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGeoStore } from '../../store/geoStore'

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE = 'https://api.ubyca.com/api/v1'
const BASE_PATH = '/app/developers'

// ── Navigation tree ───────────────────────────────────────────────────────────

interface NavItem  { label: string; path: string }
interface NavGroup { group: string; items?: NavItem[]; sub?: { label: string; items: NavItem[] }[] }

const NAV: NavGroup[] = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Overview',       path: 'overview'       },
      { label: 'Quick Start',    path: 'quickstart'     },
      { label: 'Authentication', path: 'authentication' },
      { label: 'API Key Scopes', path: 'scopes'         },
    ],
  },
  {
    group: 'Core Concepts',
    items: [
      { label: 'Locations',           path: 'concepts/locations' },
      { label: 'Sessions',            path: 'concepts/sessions'  },
      { label: 'Presence Validation', path: 'concepts/presence'  },
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
    items: [{ label: 'Errors', path: 'errors' }],
  },
]

// ── Shared UI atoms ───────────────────────────────────────────────────────────

const SCOPE_COLOR: Record<string, string> = {
  'projects:read':     'bg-sky-900/40 text-sky-400 border-sky-700/40',
  'analytics:read':    'bg-brand-900/50 text-brand-300 border-brand-700/40',
  'presence:validate': 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
  'presence:check':    'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
}

function ScopeBadge({ scope }: { scope: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${SCOPE_COLOR[scope] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}>
      {scope}
    </span>
  )
}

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  const cls = method === 'GET'
    ? 'bg-sky-950/60 border-sky-800/50 text-sky-400'
    : 'bg-amber-950/60 border-amber-800/50 text-amber-400'
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold border rounded px-1.5 py-0.5 flex-shrink-0 ${cls}`}>
      {method}
    </span>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
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
    <div className="relative group my-4">
      <pre className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5 text-[11.5px] font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre">
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

function Callout({ type, children }: { type: 'warning' | 'info' | 'tip'; children: React.ReactNode }) {
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

function Divider() {
  return <hr className="my-8 border-gray-800" />
}

// ── Doc page primitives ───────────────────────────────────────────────────────

function PageTitle({ title, badge, subtitle }: { title: string; badge?: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {badge && (
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">{badge}</p>
      )}
      <h1 className="text-2xl font-bold text-gray-100 tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-400 leading-relaxed">{subtitle}</p>}
    </div>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-gray-100 mt-10 mb-3">{children}</h2>
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-200 mt-6 mb-2">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-400 leading-relaxed mb-3">{children}</p>
}

interface AttrRow {
  name:     string
  type:     string
  req?:     boolean
  desc:     string
}

function AttrTable({ rows }: { rows: AttrRow[] }) {
  return (
    <div className="my-4 border border-white/[0.07] rounded-xl overflow-hidden">
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

function EndpointBadge({ method, path }: { method: 'GET' | 'POST'; path: string }) {
  return (
    <div className="flex items-center gap-2 my-4 px-4 py-3 bg-gray-900/60 border border-white/[0.07] rounded-xl">
      <MethodBadge method={method} />
      <span className="font-mono text-xs text-gray-300">{path}</span>
    </div>
  )
}

function DocNav({ prev, next }: { prev?: { label: string; path: string }; next?: { label: string; path: string } }) {
  return (
    <div className="flex justify-between mt-12 pt-6 border-t border-gray-800">
      {prev ? (
        <Link to={`${BASE_PATH}/${prev.path}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {prev.label}
        </Link>
      ) : <div />}
      {next ? (
        <Link to={`${BASE_PATH}/${next.path}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
          {next.label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      ) : <div />}
    </div>
  )
}

// ── PAGE: Overview ────────────────────────────────────────────────────────────

function OverviewPage() {
  return (
    <div>
      <PageTitle
        title="Ubyca API v1"
        badge="Getting Started"
        subtitle="REST API para integrar capacidades de geolocalización en tus propias aplicaciones."
      />

      <P>La Ubyca API te permite validar la presencia física de un usuario en una ubicación GPS, descubrir proyectos y ubicaciones, y consultar métricas de tráfico y conversión en tiempo real.</P>

      <div className="my-4 flex items-center gap-3 px-4 py-3 bg-gray-900/60 border border-white/[0.07] rounded-xl">
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Base URL</span>
        <span className="font-mono text-xs text-gray-300 select-all">{BASE}</span>
      </div>

      <H2>Cómo funciona</H2>
      <P>El flujo típico de integración sigue tres pasos:</P>

      <ol className="space-y-3 my-4">
        {[
          { n: 1, title: 'Descubrir', desc: `GET ${BASE}/projects → GET .../locations — obtener el location_id que representa cada punto de validación.` },
          { n: 2, title: 'Validar presencia', desc: `POST ${BASE}/presence/validate — enviar coordenadas GPS y session_id para obtener valid: true/false.` },
          { n: 3, title: 'Consultar analytics', desc: `GET ${BASE}/projects/{id}/analytics — métricas de entradas, conversión y visitas activas.` },
        ].map((s) => (
          <li key={s.n} className="flex gap-4">
            <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[11px] font-bold text-gray-400 flex-shrink-0 mt-0.5">{s.n}</span>
            <div>
              <span className="text-sm font-medium text-gray-200">{s.title} </span>
              <span className="text-xs text-gray-500 font-mono">{s.desc}</span>
            </div>
          </li>
        ))}
      </ol>

      <H2>Respuestas</H2>
      <P>Todas las respuestas son JSON. Las listas se devuelven en un wrapper <code className="text-gray-300 font-mono text-xs">&#123;"data": [...]&#125;</code> con un campo <code className="font-mono text-xs text-gray-300">meta.count</code>. Los recursos individuales usan <code className="font-mono text-xs text-gray-300">&#123;"data": &#123;...&#125;&#125;</code>.</P>
      <P>Los campos de request usan <code className="font-mono text-xs text-gray-300">snake_case</code>. Los campos de respuesta usan <code className="font-mono text-xs text-gray-300">camelCase</code>.</P>

      <H2>Autenticación</H2>
      <P>Todos los endpoints excepto <code className="font-mono text-xs text-gray-300">GET /health</code> requieren credenciales de API. Se soportan HTTP Basic y Bearer pair. Ver <Link to={`${BASE_PATH}/authentication`} className="text-brand-400 hover:text-brand-300">Authentication</Link>.</P>

      <H2>Scopes</H2>
      <P>Cada API Key tiene un conjunto de scopes que limitan su acceso. Los scopes se configuran al crear la credencial desde Studio. Ver <Link to={`${BASE_PATH}/scopes`} className="text-brand-400 hover:text-brand-300">API Key Scopes</Link>.</P>

      <Callout type="info">
        Crea tus credenciales desde <Link to="/app/integrations" className="underline">Studio → Integraciones</Link>.
        El secret solo se muestra una vez al crearlo.
      </Callout>

      <DocNav next={{ label: 'Quick Start', path: 'quickstart' }} />
    </div>
  )
}

// ── PAGE: Quick Start ─────────────────────────────────────────────────────────

function QuickStartPage() {
  const STEPS = [
    {
      n: 1, title: 'Verificar estado', method: 'GET' as const,
      path: `${BASE}/health`,
      code: `curl ${BASE}/health`,
      response: `{"status":"ok","version":"v1"}`,
    },
    {
      n: 2, title: 'Listar proyectos', method: 'GET' as const,
      path: `${BASE}/projects`,
      code: `curl ${BASE}/projects \\\n  -u "ubk_live_xxx:sk_live_xxx"`,
      response: `{\n  "data": [\n    {\n      "id": "550e8400-e29b-41d4-a716-446655440000",\n      "title": "Circuito Histórico",\n      "status": "active",\n      "locationCount": 3\n    }\n  ],\n  "meta": { "count": 1 }\n}`,
    },
    {
      n: 3, title: 'Listar ubicaciones', method: 'GET' as const,
      path: `${BASE}/projects/{project_id}/locations`,
      note: 'Requiere scope projects:read.',
      code: `curl "${BASE}/projects/550e8400-e29b-41d4-a716-446655440000/locations" \\\n  -u "ubk_live_xxx:sk_live_xxx"`,
      response: `{\n  "data": [\n    {\n      "id": "660e8400-e29b-41d4-a716-446655440001",\n      "name": "Punto Central",\n      "latitude": -33.4372,\n      "longitude": -70.6506,\n      "boundary": { "type": "radius", "radiusMeters": 50 },\n      "active": true\n    }\n  ],\n  "meta": { "count": 1 }\n}`,
    },
    {
      n: 4, title: 'Verificar presencia (dry-run)', method: 'POST' as const,
      path: `${BASE}/presence/check`,
      note: 'Requiere scope presence:check. No consume quota, no registra eventos.',
      code: `curl -X POST ${BASE}/presence/check \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "location_id": "660e8400-e29b-41d4-a716-446655440001",\n    "session_id": "session-abc-123",\n    "coordinates": {\n      "latitude": -33.4372,\n      "longitude": -70.6506\n    }\n  }'`,
      response: `{\n  "valid": true,\n  "locationId": "660e8400-e29b-41d4-a716-446655440001",\n  "sessionId": "session-abc-123",\n  "checks": {\n    "locationActive": true,\n    "insideBoundary": true,\n    "boundaryType": "radius",\n    "distanceMeters": 34.7\n  },\n  "destination": { "type": "url", "url": "https://example.com/contenido" },\n  "failureReason": null,\n  "eventId": null\n}`,
    },
    {
      n: 5, title: 'Validar presencia GPS', method: 'POST' as const,
      path: `${BASE}/presence/validate`,
      note: 'Requiere scope presence:validate. Registra eventos y consume quota.',
      code: `curl -X POST ${BASE}/presence/validate \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "location_id": "660e8400-e29b-41d4-a716-446655440001",\n    "session_id": "session-abc-123",\n    "coordinates": {\n      "latitude": -33.4372,\n      "longitude": -70.6506,\n      "accuracy_meters": 8.0\n    }\n  }'`,
      response: `{\n  "valid": true,\n  "locationId": "660e8400-e29b-41d4-a716-446655440001",\n  "sessionId": "session-abc-123",\n  "checks": {\n    "locationActive": true,\n    "insideBoundary": true,\n    "boundaryType": "radius",\n    "distanceMeters": 34.7\n  },\n  "destination": { "type": "url", "url": "https://example.com/contenido" },\n  "failureReason": null,\n  "eventId": "770e8400-e29b-41d4-a716-446655440010"\n}`,
    },
  ]

  return (
    <div>
      <PageTitle title="Quick Start" badge="Getting Started" subtitle="Integra el flujo completo de presencia en 5 llamadas." />

      <P>Necesitas una API Key con los scopes <code className="font-mono text-xs text-gray-300">projects:read</code>, <code className="font-mono text-xs text-gray-300">presence:check</code> y <code className="font-mono text-xs text-gray-300">presence:validate</code>. Créala desde <Link to="/app/integrations" className="text-brand-400 hover:text-brand-300">Integraciones</Link>.</P>

      <div className="space-y-8 mt-6">
        {STEPS.map((s) => (
          <div key={s.n} className="relative pl-10">
            <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[11px] font-bold text-gray-400 flex-shrink-0">{s.n}</div>
            <p className="text-sm font-semibold text-gray-100 mb-1">{s.title}</p>
            {s.note && <p className="text-xs text-gray-500 mb-2">{s.note}</p>}
            <div className="flex items-center gap-2 mb-2">
              <MethodBadge method={s.method} />
              <span className="font-mono text-xs text-gray-400">{s.path}</span>
            </div>
            <CodeBlock code={s.code} label={s.title} />
            <div className="mt-2">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">Respuesta</p>
              <pre className="bg-gray-950/60 border border-gray-800/60 rounded-xl px-4 py-3 text-[11.5px] font-mono text-gray-500 overflow-x-auto leading-relaxed whitespace-pre">{s.response}</pre>
            </div>
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

      <P>Las credenciales consisten en una API Key pública (<code className="font-mono text-xs text-gray-300">ubk_live_...</code>) y un Secret (<code className="font-mono text-xs text-gray-300">sk_live_...</code>). Se crean desde <Link to="/app/integrations" className="text-brand-400 hover:text-brand-300">Studio → Integraciones</Link>.</P>

      <H2>HTTP Basic (recomendado)</H2>
      <P>Pasa la API Key como username y el Secret como password. La mayoría de los clientes HTTP codifican automáticamente el par en Base64.</P>
      <CodeBlock
        label="Basic Auth"
        code={`curl ${BASE}/projects \\\n  -u "ubk_live_xxxxxxxxxxxx:sk_live_xxxxxxxxxxxx"\n\n# Equivalente explícito con header:\ncurl ${BASE}/projects \\\n  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)"`}
      />

      <H2>Bearer Pair</H2>
      <P>Pasa el par <code className="font-mono text-xs text-gray-300">key:secret</code> directamente en el header <code className="font-mono text-xs text-gray-300">Authorization</code> como Bearer token.</P>
      <CodeBlock
        label="Bearer Pair"
        code={`curl ${BASE}/projects \\\n  -H "Authorization: Bearer ubk_live_xxx:sk_live_xxx"`}
      />

      <Callout type="warning">
        El Secret solo se muestra una vez al crear la credencial. Guárdalo en un lugar seguro — si lo pierdes debes regenerar la credencial desde Integraciones.
      </Callout>

      <H2>Respuesta de error</H2>
      <P>Credenciales inválidas o ausentes devuelven <code className="font-mono text-xs text-gray-300">401 Unauthorized</code>.</P>
      <CodeBlock code={`{\n  "error": "Invalid or missing API credentials"\n}`} />

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

      <P>Los scopes se seleccionan al crear la credencial desde <Link to="/app/integrations" className="text-brand-400 hover:text-brand-300">Studio → Integraciones</Link>. Una credencial solo puede acceder a los endpoints que su conjunto de scopes autoriza.</P>

      <H2>Scopes disponibles</H2>

      <div className="space-y-3 my-4">
        {SCOPES.map((s) => (
          <div key={s.value} className="border border-white/[0.06] rounded-xl px-4 py-4 bg-gray-900/40">
            <ScopeBadge scope={s.value} />
            <p className="text-sm text-gray-300 mt-2 mb-1">{s.desc}</p>
            <p className="text-[11px] font-mono text-gray-600">{s.endpoints}</p>
          </div>
        ))}
      </div>

      <H2>Combinaciones comunes</H2>

      <H3>Solo lectura</H3>
      <P>Consultar proyectos, ubicaciones y métricas sin ejecutar presencia.</P>
      <div className="flex gap-1.5 flex-wrap my-2">
        <ScopeBadge scope="projects:read" />
        <ScopeBadge scope="analytics:read" />
      </div>

      <H3>Flujo de presencia</H3>
      <P>Descubrir ubicaciones y validar presencia con dry-run previo.</P>
      <div className="flex gap-1.5 flex-wrap my-2">
        <ScopeBadge scope="projects:read" />
        <ScopeBadge scope="presence:check" />
        <ScopeBadge scope="presence:validate" />
      </div>

      <H3>Acceso completo</H3>
      <div className="flex gap-1.5 flex-wrap my-2">
        <ScopeBadge scope="projects:read" />
        <ScopeBadge scope="analytics:read" />
        <ScopeBadge scope="presence:check" />
        <ScopeBadge scope="presence:validate" />
      </div>

      <H2>Error de scope</H2>
      <P>Un scope ausente devuelve <code className="font-mono text-xs text-gray-300">403 Forbidden</code> con el scope requerido identificado en el cuerpo.</P>
      <CodeBlock code={`HTTP/1.1 403 Forbidden\n\n{\n  "error": "insufficient_scope",\n  "required": "presence:validate"\n}`} />

      <DocNav prev={{ label: 'Authentication', path: 'authentication' }} next={{ label: 'Locations', path: 'concepts/locations' }} />
    </div>
  )
}

// ── PAGE: Concept — Locations ─────────────────────────────────────────────────

function ConceptLocationsPage() {
  return (
    <div>
      <PageTitle title="Locations" badge="Core Concepts" subtitle="Una Location (GeoPoint) es la entidad central de la API." />
      <P>Cada Location define un punto geográfico con reglas de disponibilidad. Es el objeto al que se valida la presencia de un usuario. Agrupa boundary, schedule, quota, dwell y destination en un único recurso.</P>
      <P>El campo <code className="font-mono text-xs text-gray-300">id</code> de una Location es el valor que debes pasar como <code className="font-mono text-xs text-gray-300">location_id</code> en cada llamada a Presence.</P>
      <Callout type="tip">
        Ver <Link to={`${BASE_PATH}/resources/locations/object`} className="underline">The Location Object</Link> para la referencia completa de atributos, ejemplos JSON y la cadena de evaluación.
      </Callout>
      <DocNav prev={{ label: 'API Key Scopes', path: 'scopes' }} next={{ label: 'Sessions', path: 'concepts/sessions' }} />
    </div>
  )
}

// ── PAGE: Concept — Sessions ──────────────────────────────────────────────────

function ConceptSessionsPage() {
  return (
    <div>
      <PageTitle title="Sessions" badge="Core Concepts" subtitle="Un session_id identifica la sesión de un usuario final en el sistema." />
      <P>El <code className="font-mono text-xs text-gray-300">session_id</code> es generado por el cliente — cualquier string no vacío es válido. Ubyca lo usa para dos propósitos:</P>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-4 ml-2">
        <li>Rastrear visitas en vivo (<code className="font-mono text-xs">liveVisitsCurrent</code> excluye la sesión que hace el request).</li>
        <li>Deduplicar eventos de analytics — un mismo session_id no genera múltiples entradas únicas.</li>
      </ul>
      <H2>Recomendaciones</H2>
      <P>Usa un identificador estable por sesión de usuario — un UUID v4 generado al inicio de la sesión funciona bien. No uses identificadores que roten frecuentemente (como timestamp) ya que perderías la deduplicación.</P>
      <CodeBlock code={`{\n  "location_id": "660e8400-e29b-41d4-a716-446655440001",\n  "session_id": "sess_a1b2c3d4-e5f6-7890-abcd-ef1234567890",\n  "coordinates": { "latitude": -33.4372, "longitude": -70.6506 }\n}`} />
      <DocNav prev={{ label: 'Locations', path: 'concepts/locations' }} next={{ label: 'Presence Validation', path: 'concepts/presence' }} />
    </div>
  )
}

// ── PAGE: Concept — Presence Validation ──────────────────────────────────────

function ConceptPresencePage() {
  return (
    <div>
      <PageTitle title="Presence Validation" badge="Core Concepts" subtitle="Ubyca valida la presencia de un usuario contra las reglas de una Location." />
      <P>La API de Presence usa un modelo pull: tu backend envía las coordenadas GPS del usuario y Ubyca evalúa si se cumplen todas las condiciones de disponibilidad. El resultado es <code className="font-mono text-xs text-gray-300">valid: true</code> o <code className="font-mono text-xs text-gray-300">valid: false</code> — siempre en HTTP 200.</P>
      <P>Hay dos endpoints: <code className="font-mono text-xs text-gray-300">/presence/check</code> para dry-run sin efectos secundarios, y <code className="font-mono text-xs text-gray-300">/presence/validate</code> para la validación real que registra eventos y consume quota.</P>
      <Callout type="tip">
        Ver <Link to={`${BASE_PATH}/resources/presence/overview`} className="underline">Presence Overview</Link> para la referencia completa del flujo, el objeto checks, los failure reasons y idempotencia.
      </Callout>
      <DocNav prev={{ label: 'Sessions', path: 'concepts/sessions' }} next={{ label: 'The Project Object', path: 'resources/projects' }} />
    </div>
  )
}

// ── PAGE: Resources — Projects ────────────────────────────────────────────────

function ResourcesProjectsPage() {
  return (
    <div>
      <PageTitle title="The Project Object" badge="Resources / Projects" subtitle="Un Project agrupa un conjunto de Locations bajo una experiencia compartida." />

      <H2>Attributes</H2>
      <AttrTable rows={[
        { name: 'id',               type: 'string (uuid)',     req: true,  desc: 'Identificador único del proyecto.' },
        { name: 'title',            type: 'string',            req: true,  desc: 'Nombre del proyecto.' },
        { name: 'subtitle',         type: 'string | null',     req: false, desc: 'Subtítulo opcional.' },
        { name: 'description',      type: 'string | null',     req: false, desc: 'Descripción larga.' },
        { name: 'status',           type: 'string',            req: true,  desc: 'Estado de publicación (e.g. active, draft).' },
        { name: 'communityEnabled', type: 'boolean',           req: true,  desc: 'Si el proyecto aparece en el showcase comunitario.' },
        { name: 'locationCount',    type: 'integer',           req: true,  desc: 'Número de Locations en este proyecto.' },
        { name: 'createdAt',        type: 'string (datetime)', req: true,  desc: 'ISO 8601, precisión de milisegundo.' },
        { name: 'updatedAt',        type: 'string (datetime)', req: true,  desc: 'ISO 8601, precisión de milisegundo.' },
      ]} />

      <H2>Endpoints</H2>
      <div className="space-y-3">
        <div className="flex items-center gap-3 py-2">
          <MethodBadge method="GET" /><span className="font-mono text-xs text-gray-300">/projects</span>
          <ScopeBadge scope="projects:read" />
          <span className="text-xs text-gray-500 ml-auto">List all projects</span>
        </div>
        <div className="flex items-center gap-3 py-2 border-t border-gray-800">
          <MethodBadge method="GET" /><span className="font-mono text-xs text-gray-300">/projects/&#123;id&#125;</span>
          <ScopeBadge scope="projects:read" />
          <span className="text-xs text-gray-500 ml-auto">Get a project</span>
        </div>
      </div>

      <DocNav prev={{ label: 'Presence Validation', path: 'concepts/presence' }} next={{ label: 'The Location Object', path: 'resources/locations/object' }} />
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

  const polygonExample = `{
  "boundary": {
    "type": "polygon",
    "polygon": [
      [-70.6520, -33.4380],
      [-70.6490, -33.4380],
      [-70.6490, -33.4360],
      [-70.6520, -33.4360],
      [-70.6520, -33.4380]
    ]
  }
}`

  return (
    <div>
      <PageTitle
        title="The Location Object"
        badge="Resources / Locations"
        subtitle="Una Location (GeoPoint) es el recurso central de la API. Define el área geográfica y las reglas de disponibilidad que se evalúan en cada validación de presencia."
      />

      <P>El campo <code className="font-mono text-xs text-gray-300">id</code> de una Location es el valor que debes pasar como <code className="font-mono text-xs text-gray-300">location_id</code> en <Link to={`${BASE_PATH}/resources/presence/validate`} className="text-brand-400 hover:text-brand-300">Presence Validate</Link> y <Link to={`${BASE_PATH}/resources/presence/check`} className="text-brand-400 hover:text-brand-300">Presence Check</Link>.</P>

      <H2>Example</H2>
      <CodeBlock code={locationExample} label="Location Object" />

      <H2>Attributes</H2>

      <AttrTable rows={[
        { name: 'id',                  type: 'string (uuid)',     req: true,  desc: 'UUID único de la Location. Úsalo como location_id en Presence.' },
        { name: 'name',                type: 'string',            req: true,  desc: 'Nombre visible de la ubicación.' },
        { name: 'description',         type: 'string | null',     req: false, desc: 'Descripción opcional.' },
        { name: 'instructions',        type: 'string | null',     req: false, desc: 'Instrucciones para el usuario final en este punto.' },
        { name: 'active',              type: 'boolean',           req: true,  desc: 'Solo las Locations activas pueden pasar validación. Si false, failureReason: location_inactive.' },
        { name: 'order',               type: 'integer',           req: true,  desc: 'Posición de display dentro del proyecto (ascendente).' },
        { name: 'latitude',            type: 'number',            req: true,  desc: 'Latitud del centro en grados decimales.' },
        { name: 'longitude',           type: 'number',            req: true,  desc: 'Longitud del centro en grados decimales.' },
        { name: 'boundary',            type: 'object',            req: true,  desc: 'Configuración del área geográfica. Ver The boundary.' },
        { name: 'schedule',            type: 'object',            req: true,  desc: 'Restricciones de horario. Ver The schedule.' },
        { name: 'quota',               type: 'object',            req: true,  desc: 'Cupo máximo de validaciones. Ver The quota.' },
        { name: 'dwell',               type: 'object',            req: true,  desc: 'Tiempo mínimo de permanencia requerido. Ver The dwell check.' },
        { name: 'destination',         type: 'object',            req: true,  desc: 'Contenido a entregar en validación exitosa. Ver The destination.' },
        { name: 'destinationCategory', type: 'string | null',     req: false, desc: 'Categoría del destino: website, whatsapp, form, reservation, ecommerce, social, map, coupon, custom.' },
        { name: 'pointCategory',       type: 'string | null',     req: false, desc: 'Categoría del lugar: gastronomy, retail, health, tourism, culture, education, services, events, entertainment, transport, accommodation, sport, real_estate, corporate, other.' },
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
      <P>Área de forma arbitraria definida por un array de coordenadas <code className="font-mono text-xs text-gray-300">[longitude, latitude]</code>. El último punto debe cerrar el polígono (igual al primero).</P>
      <AttrTable rows={[
        { name: 'type',    type: '"polygon"',  req: true, desc: 'Discriminador de tipo.' },
        { name: 'polygon', type: 'number[][]', req: true, desc: 'Array de pares [longitude, latitude] que definen el polígono.' },
      ]} />
      <CodeBlock code={polygonExample} />

      <Callout type="info">
        Cuando <code className="font-mono text-xs">boundaryType</code> es <code className="font-mono text-xs">radius</code>, la respuesta de Presence incluye <code className="font-mono text-xs">distanceMeters</code> — la distancia del usuario al centro de la Location.
      </Callout>

      <Divider />

      <H2>The schedule</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">schedule.enabled</code> es <code className="font-mono text-xs text-gray-300">true</code>, la Location solo acepta validaciones en los días y horario configurados. Fuera del horario, la respuesta incluye <code className="font-mono text-xs text-gray-300">failureReason: outside_schedule</code>.</P>

      <AttrTable rows={[
        { name: 'enabled',   type: 'boolean',      req: true,  desc: 'Si las restricciones de horario están activas.' },
        { name: 'days',      type: 'string[]',     req: true,  desc: 'Días en que la Location es accesible. Valores: mon, tue, wed, thu, fri, sat, sun.' },
        { name: 'startTime', type: 'string | null', req: false, desc: 'Hora de apertura diaria en formato HH:MM. null cuando el horario está deshabilitado.' },
        { name: 'endTime',   type: 'string | null', req: false, desc: 'Hora de cierre diaria en formato HH:MM. null cuando el horario está deshabilitado.' },
      ]} />

      <CodeBlock code={`"schedule": {\n  "enabled": true,\n  "days": ["mon", "tue", "wed", "thu", "fri"],\n  "startTime": "09:00",\n  "endTime": "18:00"\n}`} />
      <CodeBlock code={`// Horario deshabilitado\n"schedule": {\n  "enabled": false,\n  "days": [],\n  "startTime": null,\n  "endTime": null\n}`} />

      <Divider />

      <H2>The quota</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">quota.enabled</code> es <code className="font-mono text-xs text-gray-300">true</code>, cada llamada exitosa a <code className="font-mono text-xs text-gray-300">/presence/validate</code> descuenta una unidad de <code className="font-mono text-xs text-gray-300">remaining</code>. Cuando <code className="font-mono text-xs text-gray-300">remaining</code> llega a 0, las validaciones fallan con <code className="font-mono text-xs text-gray-300">failureReason: quota_exhausted</code>.</P>
      <P>Las llamadas a <code className="font-mono text-xs text-gray-300">/presence/check</code> nunca consumen quota.</P>

      <AttrTable rows={[
        { name: 'enabled',   type: 'boolean',       req: true,  desc: 'Si el control de cupo está activo.' },
        { name: 'limit',     type: 'integer | null', req: false, desc: 'Total de validaciones permitidas. null cuando el cupo está deshabilitado.' },
        { name: 'used',      type: 'integer',        req: true,  desc: 'Validaciones consumidas hasta ahora.' },
        { name: 'remaining', type: 'integer | null', req: false, desc: 'Validaciones restantes (limit - used, mínimo 0). null cuando el cupo está deshabilitado.' },
      ]} />

      <Divider />

      <H2>The dwell check</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">dwell.enabled</code> es <code className="font-mono text-xs text-gray-300">true</code>, el usuario debe haber permanecido dentro del área al menos <code className="font-mono text-xs text-gray-300">dwell.seconds</code> segundos antes de que la validación pase.</P>
      <P>El cliente debe enviar el tiempo transcurrido en el campo <code className="font-mono text-xs text-gray-300">dwell_elapsed_seconds</code> de la request. Si la Location requiere dwell y el campo no se incluye, la validación falla con <code className="font-mono text-xs text-gray-300">failureReason: dwell_required</code>. Si se incluye pero el tiempo es insuficiente, falla con <code className="font-mono text-xs text-gray-300">failureReason: dwell_time_not_met</code>.</P>

      <AttrTable rows={[
        { name: 'enabled', type: 'boolean', req: true, desc: 'Si se requiere permanencia mínima.' },
        { name: 'seconds', type: 'integer', req: true, desc: 'Segundos mínimos que el usuario debe pasar dentro del área.' },
      ]} />

      <Divider />

      <H2>The destination</H2>
      <P>Define el contenido que Ubyca entrega al usuario cuando <code className="font-mono text-xs text-gray-300">valid</code> es <code className="font-mono text-xs text-gray-300">true</code>. El tipo actual es siempre <code className="font-mono text-xs text-gray-300">"url"</code>.</P>
      <P>Cuando una validación pasa, la respuesta de Presence incluye el objeto <code className="font-mono text-xs text-gray-300">destination</code> con la URL a entregar. Cuando la validación falla, <code className="font-mono text-xs text-gray-300">destination</code> es <code className="font-mono text-xs text-gray-300">null</code>.</P>

      <AttrTable rows={[
        { name: 'type', type: '"url"',        req: true, desc: 'Tipo de destino. Actualmente siempre "url".' },
        { name: 'url',  type: 'string | null', req: true, desc: 'URL a entregar en validación exitosa. null cuando no hay contenido configurado.' },
      ]} />

      <Divider />

      <H2>La cadena de evaluación</H2>
      <P>Cuando llega una request de Presence, Ubyca evalúa la Location en este orden. Cada check fallido detiene la evaluación y establece <code className="font-mono text-xs text-gray-300">failureReason</code>:</P>

      <div className="my-4 space-y-0">
        {[
          { n: 1, check: 'location_active',     field: 'locationActive',    failure: 'location_inactive',             desc: '¿Está la Location activa?' },
          { n: 2, check: 'boundary',            field: 'insideBoundary',    failure: 'outside_boundary',              desc: '¿Están las coordenadas dentro del área?' },
          { n: 3, check: 'schedule',            field: 'scheduleActive',    failure: 'outside_schedule',              desc: '¿Es el horario actual válido para esta Location?' },
          { n: 4, check: 'quota',               field: 'quotaAvailable',    failure: 'quota_exhausted',               desc: '¿Quedan validaciones disponibles?' },
          { n: 5, check: 'live_visits',         field: 'liveVisitsMet',     failure: 'minimum_live_visits_not_reached', desc: '¿Hay suficientes usuarios concurrentes en el área?' },
          { n: 6, check: 'dwell',               field: 'dwellTimeMet',      failure: 'dwell_time_not_met',            desc: '¿Ha permanecido el usuario el tiempo mínimo?' },
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

      <P>Los campos del objeto <code className="font-mono text-xs text-gray-300">checks</code> correspondientes a checks no alcanzados están ausentes de la respuesta.</P>

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

      <P>Devuelve todas las Locations del proyecto especificado, ordenadas por su campo <code className="font-mono text-xs text-gray-300">order</code>. Incluye todas las Locations, incluso las inactivas.</P>

      <H2>Path parameters</H2>
      <AttrTable rows={[
        { name: 'project_id', type: 'string (uuid)', req: true, desc: 'UUID del proyecto.' },
      ]} />

      <H2>Response</H2>
      <P>Array de <Link to={`${BASE_PATH}/resources/locations/object`} className="text-brand-400 hover:text-brand-300">Location objects</Link> en <code className="font-mono text-xs text-gray-300">data</code> con <code className="font-mono text-xs text-gray-300">meta.count</code>.</P>

      <CodeBlock label="Response" code={`{\n  "data": [\n    {\n      "id": "660e8400-e29b-41d4-a716-446655440001",\n      "name": "Punto Central",\n      "active": true,\n      "order": 0,\n      "latitude": -33.4372,\n      "longitude": -70.6506,\n      "boundary": { "type": "radius", "radiusMeters": 50 },\n      "schedule": { "enabled": false, "days": [], "startTime": null, "endTime": null },\n      "quota": { "enabled": false, "limit": null, "used": 0, "remaining": null },\n      "dwell": { "enabled": false, "seconds": 0 },\n      "destination": { "type": "url", "url": "https://example.com/contenido" },\n      "createdAt": "2026-06-01T10:00:00.000Z"\n    }\n  ],\n  "meta": { "count": 1 }\n}`} />

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized',   req: false, desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',       req: false, desc: 'Falta el scope projects:read.' },
        { name: '404', type: 'Not Found',       req: false, desc: 'El proyecto no existe o no pertenece a la organización.' },
      ]} />

      <DocNav prev={{ label: 'The Location Object', path: 'resources/locations/object' }} next={{ label: 'Get a Location', path: 'resources/locations/get' }} />
    </div>
  )
}

// ── PAGE: Get a Location ──────────────────────────────────────────────────────

function LocationGetPage() {
  return (
    <div>
      <PageTitle title="Get a Location" badge="Resources / Locations" />
      <EndpointBadge method="GET" path="/locations/{id}" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="projects:read" /></div>

      <P>Devuelve una única Location por UUID. La Location debe pertenecer a la organización asociada a la credencial.</P>

      <H2>Path parameters</H2>
      <AttrTable rows={[
        { name: 'id', type: 'string (uuid)', req: true, desc: 'UUID de la Location.' },
      ]} />

      <H2>Response</H2>
      <P>Un <Link to={`${BASE_PATH}/resources/locations/object`} className="text-brand-400 hover:text-brand-300">Location object</Link> en <code className="font-mono text-xs text-gray-300">data</code>.</P>

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized', req: false, desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',    req: false, desc: 'Falta el scope projects:read.' },
        { name: '404', type: 'Not Found',    req: false, desc: 'La Location no existe o no pertenece a la organización.' },
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
      <PageTitle
        title="Presence Validation"
        badge="Resources / Presence"
        subtitle="Valida si un usuario está físicamente presente en una Location, evaluando boundary, schedule, quota, live visits y dwell."
      />

      <H2>Modelo pull</H2>
      <P>La API de Presence usa un modelo pull: tu backend envía las coordenadas GPS del usuario y Ubyca evalúa si se cumplen todas las condiciones de disponibilidad configuradas en la <Link to={`${BASE_PATH}/resources/locations/object`} className="text-brand-400 hover:text-brand-300">Location</Link>. No hay webhooks ni notificaciones push.</P>

      <Callout type="warning">
        <strong className="font-semibold">HTTP 200 para todos los outcomes.</strong> Tanto las validaciones exitosas (<code className="font-mono text-xs">valid: true</code>) como las fallidas (<code className="font-mono text-xs">valid: false</code>) devuelven HTTP 200. Usa el campo <code className="font-mono text-xs">valid</code> — no el código HTTP — para determinar el resultado.
      </Callout>

      <H2>Check vs. Validate</H2>

      <div className="my-4 border border-white/[0.07] rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-900/60 border-b border-white/[0.06]">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-500 w-40"></th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-400">POST /presence/check</th>
              <th className="text-left px-4 py-2.5 font-semibold text-gray-400">POST /presence/validate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {[
              { label: 'Scope',             check: 'presence:check',    validate: 'presence:validate' },
              { label: 'Consume quota',      check: 'No',                validate: 'Sí' },
              { label: 'Registra eventos',   check: 'No',                validate: 'Sí (presence.validated, destination.delivered)' },
              { label: 'Actualiza live visits', check: 'No',             validate: 'Sí' },
              { label: 'eventId',            check: 'Siempre null',      validate: 'UUID si el evento fue grabado' },
              { label: 'Idempotency-Key',    check: 'No soportado',      validate: 'Soportado (TTL: 24h)' },
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

      <P>Usa <code className="font-mono text-xs text-gray-300">/presence/check</code> para validar sin consecuencias — útil para mostrar un estado de elegibilidad antes de comprometer la llamada real. Usa <code className="font-mono text-xs text-gray-300">/presence/validate</code> para el momento de conversión efectiva.</P>

      <Divider />

      <H2>The request</H2>
      <CodeBlock code={requestExample} label="Presence Validate" />

      <H3>Request fields</H3>
      <AttrTable rows={[
        { name: 'location_id',           type: 'string',  req: true,  desc: 'UUID de la Location objetivo. Obtenerlo desde GET /projects/{id}/locations.' },
        { name: 'session_id',            type: 'string',  req: true,  desc: 'Identificador de sesión del usuario final (cualquier string no vacío).' },
        { name: 'coordinates',           type: 'object',  req: true,  desc: 'Coordenadas GPS actuales del usuario.' },
        { name: 'coordinates.latitude',  type: 'number',  req: true,  desc: 'Latitud en grados decimales (-90 a 90).' },
        { name: 'coordinates.longitude', type: 'number',  req: true,  desc: 'Longitud en grados decimales (-180 a 180).' },
        { name: 'coordinates.accuracy_meters', type: 'number', req: false, desc: 'Radio de precisión GPS en metros. Opcional.' },
        { name: 'dwell_elapsed_seconds', type: 'integer', req: false, desc: 'Segundos dentro del área. Funcionalmente requerido cuando dwell.enabled: true.' },
        { name: 'timestamp',             type: 'string',  req: false, desc: 'ISO 8601. Usado para evaluar el schedule. Por defecto: tiempo del servidor.' },
        { name: 'context',               type: 'object',  req: false, desc: 'Metadata opcional. Almacenada en el evento de analytics.' },
        { name: 'context.user_ref',      type: 'string',  req: false, desc: 'Referencia de usuario en el sistema del cliente.' },
        { name: 'context.metadata',      type: 'object',  req: false, desc: 'Pares clave-valor arbitrarios almacenados en el contexto del evento.' },
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
        { name: 'destination',   type: 'object | null', req: true, desc: 'Destino entregado cuando valid: true y la Location tiene contenido. null cuando valid: false o sin contenido.' },
        { name: 'failureReason', type: 'string | null', req: true, desc: 'Código de fallo cuando valid: false. null cuando valid: true.' },
        { name: 'eventId',       type: 'string | null', req: true, desc: '/validate: UUID del evento grabado. /check: siempre null.' },
      ]} />

      <Divider />

      <H2>The checks object</H2>
      <P>Los campos de <code className="font-mono text-xs text-gray-300">checks</code> son condicionales — no todos aparecen en todas las respuestas. Solo se incluyen los checks que fueron alcanzados antes del fallo o al completar la evaluación exitosamente.</P>

      <AttrTable rows={[
        { name: 'locationActive',    type: 'boolean', req: false, desc: 'Si la Location está activa.' },
        { name: 'insideBoundary',    type: 'boolean', req: false, desc: 'Si las coordenadas caen dentro del área configurada.' },
        { name: 'boundaryType',      type: 'string',  req: false, desc: '"radius" o "polygon".' },
        { name: 'distanceMeters',    type: 'number',  req: false, desc: 'Distancia al centro de la Location en metros. Solo presente cuando boundaryType es "radius".' },
        { name: 'scheduleActive',    type: 'boolean', req: false, desc: 'Si el horario actual está dentro del schedule configurado.' },
        { name: 'quotaAvailable',    type: 'boolean', req: false, desc: 'Si hay cupo disponible. Solo presente cuando quota.enabled: true.' },
        { name: 'quotaRemaining',    type: 'integer', req: false, desc: 'Validaciones restantes. Solo presente cuando quota.enabled: true.' },
        { name: 'liveVisitsEnabled', type: 'boolean', req: false, desc: 'Si se exige un mínimo de usuarios concurrentes.' },
        { name: 'liveVisitsRequired',type: 'integer', req: false, desc: 'Mínimo de usuarios concurrentes requerido. Solo presente cuando liveVisitsEnabled: true.' },
        { name: 'liveVisitsCurrent', type: 'integer', req: false, desc: 'Usuarios activos actualmente en el área, excluyendo la sesión que hace el request. Solo presente cuando liveVisitsEnabled: true.' },
        { name: 'liveVisitsMet',     type: 'boolean', req: false, desc: 'Si se cumple el mínimo de usuarios concurrentes (contando al usuario actual como +1).' },
        { name: 'dwellRequired',     type: 'boolean', req: false, desc: 'Si la Location exige permanencia mínima.' },
        { name: 'dwellTimeMet',      type: 'boolean', req: false, desc: 'Si el tiempo de permanencia fue suficiente. Solo presente cuando dwellRequired: true.' },
      ]} />

      <Divider />

      <H2>Failure reasons</H2>
      <P>Cuando <code className="font-mono text-xs text-gray-300">valid</code> es <code className="font-mono text-xs text-gray-300">false</code>, el campo <code className="font-mono text-xs text-gray-300">failureReason</code> contiene uno de los siguientes valores:</P>

      <AttrTable rows={[
        { name: 'location_inactive',               type: '',  desc: 'La Location está desactivada (active: false).' },
        { name: 'outside_boundary',                type: '',  desc: 'Las coordenadas caen fuera del área configurada.' },
        { name: 'outside_schedule',                type: '',  desc: 'El momento del request está fuera del horario configurado.' },
        { name: 'quota_exhausted',                 type: '',  desc: 'El cupo de validaciones se agotó (remaining: 0).' },
        { name: 'minimum_live_visits_not_reached', type: '',  desc: 'No hay suficientes usuarios concurrentes en el área.' },
        { name: 'dwell_required',                  type: '',  desc: 'La Location requiere permanencia y dwell_elapsed_seconds no fue enviado.' },
        { name: 'dwell_time_not_met',              type: '',  desc: 'El tiempo de permanencia enviado es menor al mínimo configurado.' },
      ]} />

      <Divider />

      <H2>Idempotency</H2>
      <P>El endpoint <code className="font-mono text-xs text-gray-300">POST /presence/validate</code> soporta el header <code className="font-mono text-xs text-gray-300">Idempotency-Key</code> para garantizar que un request no se ejecute dos veces en caso de reintentos.</P>

      <AttrTable rows={[
        { name: 'TTL',       type: '24 horas', desc: 'Una clave expira 24 horas después del request original.' },
        { name: 'Max chars', type: '255',       desc: 'Longitud máxima de la clave.' },
        { name: 'Scope',     type: 'org + key', desc: 'La clave es única por credencial de API.' },
      ]} />

      <CodeBlock code={`curl -X POST ${BASE}/presence/validate \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -H "Idempotency-Key: req_a1b2c3d4-e5f6-7890-abcd-ef1234567890" \\\n  -d '{ "location_id": "...", "session_id": "...", "coordinates": {...} }'`} />

      <P>Si una request con la misma clave está actualmente en progreso, la API responde <code className="font-mono text-xs text-gray-300">409 Conflict</code> con un campo <code className="font-mono text-xs text-gray-300">retryAfter</code> indicando cuántos segundos esperar.</P>

      <CodeBlock code={`HTTP/1.1 409 Conflict\n\n{\n  "error": "Request in progress",\n  "retryAfter": 30\n}`} />

      <DocNav prev={{ label: 'Get a Location', path: 'resources/locations/get' }} next={{ label: 'Check Presence', path: 'resources/presence/check' }} />
    </div>
  )
}

// ── PAGE: Check Presence ──────────────────────────────────────────────────────

function PresenceCheckPage() {
  return (
    <div>
      <PageTitle title="Check Presence" badge="Resources / Presence" subtitle="Dry-run de validación de presencia sin efectos secundarios." />
      <EndpointBadge method="POST" path="/presence/check" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="presence:check" /></div>

      <P>Evalúa la cadena completa de checks de disponibilidad sin producir ningún efecto secundario. No consume quota, no registra eventos, no actualiza live visits. <code className="font-mono text-xs text-gray-300">eventId</code> es siempre <code className="font-mono text-xs text-gray-300">null</code>.</P>

      <H2>Request</H2>
      <P>Mismos campos que <Link to={`${BASE_PATH}/resources/presence/validate`} className="text-brand-400 hover:text-brand-300">Validate Presence</Link>. No soporta <code className="font-mono text-xs text-gray-300">Idempotency-Key</code>.</P>
      <CodeBlock label="Check" code={`curl -X POST ${BASE}/presence/check \\\n  -u "ubk_live_xxx:sk_live_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "location_id": "660e8400-e29b-41d4-a716-446655440001",\n    "session_id": "session-abc-123",\n    "coordinates": {\n      "latitude": -33.4372,\n      "longitude": -70.6506\n    }\n  }'`} />

      <H2>Response</H2>
      <P>Idéntica a Validate Presence, con <code className="font-mono text-xs text-gray-300">eventId: null</code> siempre.</P>
      <CodeBlock code={`{\n  "valid": true,\n  "locationId": "660e8400-e29b-41d4-a716-446655440001",\n  "sessionId": "session-abc-123",\n  "checks": {\n    "locationActive": true,\n    "insideBoundary": true,\n    "boundaryType": "radius",\n    "distanceMeters": 34.7\n  },\n  "destination": { "type": "url", "url": "https://example.com/contenido" },\n  "failureReason": null,\n  "eventId": null\n}`} />

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized', desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',    desc: 'Falta el scope presence:check.' },
        { name: '404', type: 'Not Found',    desc: 'location_id no existe o no pertenece a la organización.' },
        { name: '422', type: 'Unprocessable', desc: 'Parámetros de request inválidos.' },
      ]} />

      <DocNav prev={{ label: 'Presence Overview', path: 'resources/presence/overview' }} next={{ label: 'Validate Presence', path: 'resources/presence/validate' }} />
    </div>
  )
}

// ── PAGE: Validate Presence ───────────────────────────────────────────────────

function PresenceValidatePage() {
  return (
    <div>
      <PageTitle title="Validate Presence" badge="Resources / Presence" subtitle="Validación de presencia GPS con efectos secundarios completos." />
      <EndpointBadge method="POST" path="/presence/validate" />
      <div className="flex gap-2 mb-4"><ScopeBadge scope="presence:validate" /></div>

      <P>Valida si el usuario está dentro del área y cumple todas las reglas de disponibilidad. A diferencia de <Link to={`${BASE_PATH}/resources/presence/check`} className="text-brand-400 hover:text-brand-300">Check</Link>, produce efectos secundarios:</P>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-3 ml-2">
        <li>Consume una unidad de quota si la Location tiene quota configurada.</li>
        <li>Registra un evento <code className="font-mono text-xs">presence.validated</code>.</li>
        <li>Registra un evento <code className="font-mono text-xs">destination.delivered</code> cuando <code className="font-mono text-xs">valid: true</code> y hay contenido.</li>
        <li>Registra o actualiza la visita en vivo de la sesión.</li>
      </ul>

      <Callout type="warning">
        HTTP 200 es devuelto tanto cuando <code className="font-mono text-xs">valid: true</code> como cuando <code className="font-mono text-xs">valid: false</code>. Los efectos secundarios ocurren en ambos casos.
      </Callout>

      <H2>Request</H2>
      <P>Ver <Link to={`${BASE_PATH}/resources/presence/overview`} className="text-brand-400 hover:text-brand-300">Presence Overview → The request</Link> para todos los campos. Soporta el header <code className="font-mono text-xs text-gray-300">Idempotency-Key</code>.</P>

      <H2>Errors</H2>
      <AttrTable rows={[
        { name: '401', type: 'Unauthorized', desc: 'Credenciales inválidas o ausentes.' },
        { name: '403', type: 'Forbidden',    desc: 'Falta el scope presence:validate.' },
        { name: '404', type: 'Not Found',    desc: 'location_id no existe o no pertenece a la organización.' },
        { name: '409', type: 'Conflict',     desc: 'Idempotency-Key en uso — hay un request en progreso con esa clave.' },
        { name: '422', type: 'Unprocessable', desc: 'Parámetros de request inválidos.' },
      ]} />

      <DocNav prev={{ label: 'Check Presence', path: 'resources/presence/check' }} next={{ label: 'Analytics', path: 'resources/analytics' }} />
    </div>
  )
}

// ── PAGE: Analytics ───────────────────────────────────────────────────────────

function AnalyticsPage() {
  const ENDPOINTS = [
    { method: 'GET' as const, path: '/projects/{id}/analytics',              desc: 'Métricas agregadas + estado de visitas en vivo.' },
    { method: 'GET' as const, path: '/projects/{id}/analytics/locations',    desc: 'Métricas desglosadas por Location.' },
    { method: 'GET' as const, path: '/projects/{id}/analytics/distribution', desc: 'Distribución por hora, día de semana y geografía.' },
    { method: 'GET' as const, path: '/projects/{id}/analytics/intensity',    desc: 'Conteo de entradas por Location con coordenadas.' },
    { method: 'GET' as const, path: '/projects/{id}/analytics/outside_areas', desc: 'GPS registrado fuera de las áreas definidas.' },
  ]

  return (
    <div>
      <PageTitle title="Analytics" badge="Resources / Analytics" subtitle="Métricas históricas y en vivo para proyectos y ubicaciones." />
      <div className="flex gap-2 mb-6"><ScopeBadge scope="analytics:read" /></div>

      <P>Los endpoints de analytics cubren dos tipos de eventos:</P>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 my-3 ml-2">
        <li><strong className="text-gray-300 font-medium">Eventos de entrada:</strong> <code className="font-mono text-xs">radius_enter</code>, <code className="font-mono text-xs">presence.validated</code> — contribuyen a <code className="font-mono text-xs">radiusEntries</code>.</li>
        <li><strong className="text-gray-300 font-medium">Eventos de conversión:</strong> <code className="font-mono text-xs">point_click</code>, <code className="font-mono text-xs">destination.delivered</code> — contribuyen a <code className="font-mono text-xs">clicks</code> y <code className="font-mono text-xs">conversionPct</code>.</li>
      </ul>

      <H2>Query parameters</H2>
      <AttrTable rows={[
        { name: 'from',        type: 'string (date)', desc: 'Inicio del rango (inclusive), formato YYYY-MM-DD.' },
        { name: 'to',          type: 'string (date)', desc: 'Fin del rango (inclusive), formato YYYY-MM-DD.' },
        { name: 'location_id', type: 'string (uuid)', desc: 'Filtrar por una Location específica. Disponible en summary, distribution y outside_areas.' },
      ]} />

      <H2>Endpoints</H2>
      <div className="space-y-2.5 my-4">
        {ENDPOINTS.map((ep) => (
          <div key={ep.path} className="flex items-center gap-3 py-2.5 border-b border-gray-800/60 last:border-0">
            <MethodBadge method={ep.method} />
            <span className="font-mono text-xs text-gray-300 flex-1">{ep.path}</span>
            <span className="text-xs text-gray-500">{ep.desc}</span>
          </div>
        ))}
      </div>

      <H2>Summary metrics</H2>
      <AttrTable rows={[
        { name: 'radiusEntries', type: 'integer', desc: 'Número de eventos de entrada (radius_enter + presence.validated).' },
        { name: 'clicks',        type: 'integer', desc: 'Número de eventos de conversión (point_click + destination.delivered).' },
        { name: 'conversionPct', type: 'integer', desc: 'Tasa de conversión: unique clickers / unique enterers × 100, redondeado. 0 cuando no hay entradas.' },
      ]} />

      <DocNav prev={{ label: 'Validate Presence', path: 'resources/presence/validate' }} next={{ label: 'Errors', path: 'errors' }} />
    </div>
  )
}

// ── PAGE: Errors ──────────────────────────────────────────────────────────────

function ErrorsPage() {
  return (
    <div>
      <PageTitle
        title="Errors"
        badge="Reference"
        subtitle="La API usa códigos HTTP estándar. Los errores de negocio de presencia (valid: false) no son errores HTTP — siempre llegan en HTTP 200."
      />

      <Callout type="info">
        <strong className="font-semibold">HTTP 200 para outcomes de presencia.</strong> Una validación fallida (<code className="font-mono text-xs">failureReason: outside_boundary</code>, etc.) devuelve HTTP 200. Los errores 4xx indican problemas de autenticación, autorización, recurso no encontrado, o parámetros inválidos — no resultados de negocio.
      </Callout>

      <H2>The error object</H2>
      <P>Todos los errores devuelven JSON con al menos el campo <code className="font-mono text-xs text-gray-300">error</code>.</P>

      <CodeBlock code={`{\n  "error": "Invalid or missing API credentials"\n}`} />

      <P>Los errores de scope incluyen el campo adicional <code className="font-mono text-xs text-gray-300">required</code>:</P>
      <CodeBlock code={`{\n  "error": "insufficient_scope",\n  "required": "presence:validate"\n}`} />

      <P>Los errores de validación incluyen <code className="font-mono text-xs text-gray-300">details</code> con errores por campo:</P>
      <CodeBlock code={`{\n  "error": "Invalid request parameters",\n  "details": {\n    "latitude": "must be between -90 and 90",\n    "session_id": "is required"\n  }\n}`} />

      <P>Los conflictos de idempotencia incluyen <code className="font-mono text-xs text-gray-300">retryAfter</code> en segundos:</P>
      <CodeBlock code={`{\n  "error": "Request in progress",\n  "retryAfter": 30\n}`} />

      <Divider />

      <H2>HTTP Status Codes</H2>

      <AttrTable rows={[
        { name: '200 OK',                   type: '', desc: 'Request exitoso. Para Presence, el outcome de negocio está en el campo valid.' },
        { name: '401 Unauthorized',         type: '', desc: 'Credenciales ausentes o inválidas.' },
        { name: '403 Forbidden',            type: '', desc: 'Credenciales válidas pero scope insuficiente.' },
        { name: '404 Not Found',            type: '', desc: 'El recurso no existe o no pertenece a la organización.' },
        { name: '409 Conflict',             type: '', desc: 'Idempotency-Key en progreso. Esperar retryAfter segundos.' },
        { name: '422 Unprocessable Entity', type: '', desc: 'Parámetros de request fallaron validación.' },
      ]} />

      <Divider />

      <H2>Scope errors (403)</H2>
      <P>El campo <code className="font-mono text-xs text-gray-300">required</code> identifica el scope que falta.</P>

      <AttrTable rows={[
        { name: 'projects:read',     type: '403', desc: 'Falta en GET /projects, GET /projects/{id}, GET /projects/{id}/locations, GET /locations/{id}.' },
        { name: 'analytics:read',    type: '403', desc: 'Falta en todos los endpoints GET /projects/{id}/analytics/*.' },
        { name: 'presence:check',    type: '403', desc: 'Falta en POST /presence/check.' },
        { name: 'presence:validate', type: '403', desc: 'Falta en POST /presence/validate.' },
      ]} />

      <Divider />

      <H2>Validation errors (422)</H2>
      <P>Cuando la request no pasa validación, la respuesta incluye <code className="font-mono text-xs text-gray-300">details</code> con errores por campo.</P>
      <CodeBlock code={`HTTP/1.1 422 Unprocessable Entity\n\n{\n  "error": "Invalid request parameters",\n  "details": {\n    "coordinates.latitude": "is required",\n    "session_id": "is required"\n  }\n}`} />

      <Divider />

      <H2>Idempotency errors (409)</H2>
      <P>Solo en <code className="font-mono text-xs text-gray-300">POST /presence/validate</code>. Ocurre cuando ya hay un request en vuelo con la misma <code className="font-mono text-xs text-gray-300">Idempotency-Key</code>. Espera <code className="font-mono text-xs text-gray-300">retryAfter</code> segundos y reintenta.</P>
      <CodeBlock code={`HTTP/1.1 409 Conflict\n\n{\n  "error": "Request in progress",\n  "retryAfter": 30\n}`} />

      <Divider />

      <H2>Presence failure reasons</H2>
      <P>Estos valores no son errores HTTP — aparecen en el campo <code className="font-mono text-xs text-gray-300">failureReason</code> de una respuesta HTTP 200. Indican por qué una validación resultó en <code className="font-mono text-xs text-gray-300">valid: false</code>.</P>

      <AttrTable rows={[
        { name: 'location_inactive',               type: 'valid: false', desc: 'La Location está desactivada.' },
        { name: 'outside_boundary',                type: 'valid: false', desc: 'Las coordenadas GPS caen fuera del área configurada.' },
        { name: 'outside_schedule',                type: 'valid: false', desc: 'El request llegó fuera del horario de operación.' },
        { name: 'quota_exhausted',                 type: 'valid: false', desc: 'El cupo de validaciones se agotó.' },
        { name: 'minimum_live_visits_not_reached', type: 'valid: false', desc: 'No hay suficientes usuarios concurrentes en el área.' },
        { name: 'dwell_required',                  type: 'valid: false', desc: 'La Location requiere permanencia y dwell_elapsed_seconds no fue enviado.' },
        { name: 'dwell_time_not_met',              type: 'valid: false', desc: 'El tiempo de permanencia enviado es menor al mínimo requerido.' },
      ]} />

      <DocNav prev={{ label: 'Analytics', path: 'resources/analytics' }} />
    </div>
  )
}

// ── Content router ────────────────────────────────────────────────────────────

function DocContent({ section }: { section: string }) {
  switch (section) {
    case 'overview':                       return <OverviewPage />
    case 'quickstart':                     return <QuickStartPage />
    case 'authentication':                 return <AuthenticationPage />
    case 'scopes':                         return <ScopesPage />
    case 'concepts/locations':             return <ConceptLocationsPage />
    case 'concepts/sessions':              return <ConceptSessionsPage />
    case 'concepts/presence':              return <ConceptPresencePage />
    case 'resources/projects':             return <ResourcesProjectsPage />
    case 'resources/locations/object':     return <LocationObjectPage />
    case 'resources/locations/list':       return <LocationListPage />
    case 'resources/locations/get':        return <LocationGetPage />
    case 'resources/presence/overview':    return <PresenceOverviewPage />
    case 'resources/presence/check':       return <PresenceCheckPage />
    case 'resources/presence/validate':    return <PresenceValidatePage />
    case 'resources/analytics':            return <AnalyticsPage />
    case 'errors':                         return <ErrorsPage />
    default:                               return <OverviewPage />
  }
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  const navigate = useNavigate()

  function go(path: string) {
    navigate(`${BASE_PATH}/${path}`)
    onNavigate?.()
  }

  function NavLink({ item }: { item: NavItem }) {
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
    <nav className="py-4 space-y-5">
      {NAV.map((group) => (
        <div key={group.group}>
          <p className="px-3 mb-1 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            {group.group}
          </p>

          {group.items && (
            <div className="space-y-0.5">
              {group.items.map((item) => <NavLink key={item.path} item={item} />)}
            </div>
          )}

          {group.sub && group.sub.map((sub) => (
            <div key={sub.label} className="mt-3">
              <p className="px-3 mb-1 text-[10px] font-medium text-gray-600">{sub.label}</p>
              <div className="space-y-0.5">
                {sub.items.map((item) => <NavLink key={item.path} item={item} />)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </nav>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DevelopersPage() {
  const { '*': wildcard = '' } = useParams()
  const section = wildcard || 'overview'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="text-gray-100 min-h-full flex flex-col">

      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0">
        <div className="px-4 md:px-6 h-14 flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-sm font-semibold text-gray-100">Developers</h1>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono bg-brand-900/50 text-brand-300 border border-brand-700/40">
            API v1
          </span>

          <div className="ml-auto">
            <a
              href="/openapi.yaml"
              download="ubyca-api-v1.yaml"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         bg-gray-800 hover:bg-gray-700 border border-white/[0.08] text-gray-400 hover:text-gray-200
                         transition-colors duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              OpenAPI
            </a>
          </div>
        </div>
      </header>

      {/* ── Mobile sidebar drawer ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-gray-950 border-r border-gray-800 overflow-y-auto md:hidden px-3">
            <div className="h-14 flex items-center gap-2 border-b border-gray-800 mb-2">
              <span className="text-sm font-semibold text-gray-100">Developers</span>
              <button className="ml-auto text-gray-500 hover:text-gray-300" onClick={() => setMobileOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar current={section} onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main two-column layout ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Desktop sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0 border-r border-gray-800 overflow-y-auto sticky top-14 self-start max-h-[calc(100vh-3.5rem)] px-3">
          <Sidebar current={section} />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 pb-16">
            <DocContent section={section} />
          </div>
        </main>

      </div>
    </div>
  )
}
