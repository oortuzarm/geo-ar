import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGeoStore } from '../../store/geoStore'

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE = 'https://api.ubyca.com/api/v1'

type TabId = 'intro' | 'auth' | 'scopes' | 'quickstart' | 'openapi' | 'endpoints'

const TABS: { id: TabId; label: string }[] = [
  { id: 'intro',      label: 'Introducción' },
  { id: 'auth',       label: 'Autenticación' },
  { id: 'scopes',     label: 'Scopes'        },
  { id: 'quickstart', label: 'Quick Start'   },
  { id: 'openapi',    label: 'OpenAPI'       },
  { id: 'endpoints',  label: 'Endpoints'     },
]

const SCOPE_COLOR: Record<string, string> = {
  'projects:read':     'bg-sky-900/40 text-sky-400 border-sky-700/40',
  'locations:read':    'bg-violet-900/40 text-violet-400 border-violet-700/40',
  'analytics:read':    'bg-brand-900/50 text-brand-300 border-brand-700/40',
  'presence:validate': 'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
  'presence:check':    'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
}

const SCOPES_TABLE = [
  {
    value:     'projects:read',
    desc:      'Acceso de lectura a proyectos del workspace.',
    endpoints: 'GET /projects · GET /projects/{id}',
  },
  {
    value:     'locations:read',
    desc:      'Acceso de lectura a las ubicaciones (GeoPoints) de un proyecto.',
    endpoints: 'GET /projects/{id}/locations · GET /locations/{id}',
  },
  {
    value:     'analytics:read',
    desc:      'Lectura de métricas y reportes analíticos por proyecto.',
    endpoints: 'GET /projects/{id}/analytics · /analytics/locations · /analytics/distribution · /analytics/intensity · /analytics/outside_areas',
  },
  {
    value:     'presence:check',
    desc:      'Dry-run de validación de presencia sin efectos secundarios.',
    endpoints: 'POST /presence/check',
  },
  {
    value:     'presence:validate',
    desc:      'Validar presencia GPS en tiempo real (registra eventos y consume quota).',
    endpoints: 'POST /presence/validate',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-gray-900/70 border border-white/[0.07] rounded-2xl px-6 py-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
      {children}
    </p>
  )
}

// ── Code block with copy button ───────────────────────────────────────────────

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
    <div className="relative group">
      <pre className="bg-gray-950 border border-gray-800 rounded-xl px-4 py-3.5
                      text-[11.5px] font-mono text-gray-300 overflow-x-auto
                      leading-relaxed whitespace-pre">
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

// ── Step component for Quick Start ────────────────────────────────────────────

function Step({
  n, title, desc, method, path, code, response,
}: {
  n:         number
  title:     string
  desc:      string
  method:    'GET' | 'POST'
  path:      string
  code:      string
  response?: string
}) {
  return (
    <div className="relative pl-10">
      {/* Step number */}
      <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-gray-800 border border-gray-700
                      flex items-center justify-center text-[11px] font-bold text-gray-400 flex-shrink-0">
        {n}
      </div>

      <div className="mb-2">
        <span className="text-sm font-semibold text-gray-100">{title}</span>
        <span className="ml-2 text-xs text-gray-500">{desc}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <MethodBadge method={method} />
        <span className="font-mono text-xs text-gray-400">{path}</span>
      </div>

      <CodeBlock code={code} label={title} />

      {response && (
        <div className="mt-2">
          <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider mb-1.5">
            Respuesta
          </p>
          <pre className="bg-gray-950/60 border border-gray-800/60 rounded-xl px-4 py-3
                          text-[11.5px] font-mono text-gray-500 overflow-x-auto leading-relaxed whitespace-pre">
            {response}
          </pre>
        </div>
      )}
    </div>
  )
}

// ── Tab: Introducción ─────────────────────────────────────────────────────────

function IntroTab() {
  const USE_CASES = [
    { title: 'Geofencing',                    desc: 'Detectar si un usuario ingresó a un área geográfica definida en tiempo real.' },
    { title: 'Validación de presencia',       desc: 'Confirmar que un dispositivo está físicamente en una ubicación específica.' },
    { title: 'Programas de fidelización',     desc: 'Recompensar visitas a locales, eventos o puntos de interés.' },
    { title: 'Activaciones geolocalizadas',   desc: 'Disparar contenido, ofertas o experiencias cuando el usuario llega a un lugar.' },
    { title: 'Analytics espaciales',          desc: 'Medir tráfico, permanencia y conversión por ubicación a lo largo del tiempo.' },
  ]

  return (
    <div className="space-y-5">
      <Card>
        <SectionLabel>Qué es la Ubyca API</SectionLabel>
        <p className="text-sm text-gray-300 leading-relaxed mb-3">
          La <span className="text-gray-100 font-medium">Ubyca API v1</span> te permite integrar capacidades de
          geolocalización en tus propias aplicaciones, sitios web y sistemas.
          Con ella podés crear flujos de presencia GPS, consultar proyectos y ubicaciones,
          y obtener métricas espaciales en tiempo real.
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          La API sigue REST con respuestas JSON. Las credenciales se gestionan desde Studio
          y cada clave tiene un conjunto de scopes que limitan el acceso.
        </p>
      </Card>

      <Card>
        <SectionLabel>Casos de uso típicos</SectionLabel>
        <div className="space-y-3">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-gray-200">{uc.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-brand-500/20 bg-brand-950/20">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-900/40 border border-brand-700/40 rounded-xl
                          flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-100 mb-0.5">Necesitás credenciales</p>
            <p className="text-xs text-gray-400 mb-3">
              Para usar la API creá una API Key desde la sección Integraciones.
              Cada clave tiene scopes que definen a qué endpoints puede acceder.
            </p>
            <Link
              to="/app/integrations"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                         bg-brand-600 hover:bg-brand-500 text-white transition-colors"
            >
              Ir a Integraciones
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/40 border border-white/[0.05] rounded-xl">
        <div className="font-mono text-xs text-gray-500">Base URL</div>
        <div className="flex-1 font-mono text-xs text-gray-300 select-all">{BASE}</div>
      </div>
    </div>
  )
}

// ── Tab: Autenticación ────────────────────────────────────────────────────────

function AuthTab() {
  return (
    <div className="space-y-5">
      <Card>
        <SectionLabel>Headers recomendados</SectionLabel>
        <p className="text-sm text-gray-400 mb-4">
          Incluí tu API Key y Secret en cada request. Los headers <span className="font-mono text-gray-300 text-xs">X-Api-Key</span> y <span className="font-mono text-gray-300 text-xs">X-Api-Secret</span> son el método principal.
        </p>
        <CodeBlock
          code={`curl -X GET ${BASE}/projects \\
  -H "X-Api-Key: ubk_live_xxxxxxxxxxxx" \\
  -H "X-Api-Secret: sk_live_xxxxxxxxxxxx"`}
          label="Headers ejemplo"
        />
      </Card>

      <Card>
        <SectionLabel>Authorization: Basic</SectionLabel>
        <p className="text-sm text-gray-400 mb-4">
          Podés usar HTTP Basic Auth con el par <span className="font-mono text-gray-300 text-xs">key:secret</span> codificado en Base64.
          Es equivalente a los headers X-Api-Key / X-Api-Secret.
        </p>
        <CodeBlock
          code={`# curl codifica automáticamente con -u
curl -u "ubk_live_xxx:sk_live_xxx" \\
  ${BASE}/projects`}
          label="Basic Auth ejemplo"
        />
      </Card>

      <Card>
        <SectionLabel>Authorization: Bearer</SectionLabel>
        <p className="text-sm text-gray-400 mb-4">
          También podés pasar <span className="font-mono text-gray-300 text-xs">key:secret</span> como Bearer token en el header <span className="font-mono text-gray-300 text-xs">Authorization</span>.
        </p>
        <CodeBlock
          code={`curl -X GET ${BASE}/projects \\
  -H "Authorization: Bearer ubk_live_xxx:sk_live_xxx"`}
          label="Bearer ejemplo"
        />
      </Card>

      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-950/20 border border-amber-700/25 rounded-xl">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs text-amber-300/80 leading-relaxed">
          El secret solo se muestra una vez al crearlo. Almacenalo en un lugar seguro —
          si lo perdés debés regenerar la credencial desde Integraciones.
        </p>
      </div>
    </div>
  )
}

// ── Tab: Scopes ───────────────────────────────────────────────────────────────

function ScopesTab() {
  return (
    <div className="space-y-5">
      <Card>
        <SectionLabel>Scopes disponibles</SectionLabel>
        <p className="text-sm text-gray-400 mb-5">
          Cada API Key tiene un conjunto de scopes que limitan su acceso.
          Seleccionás los scopes al crear la credencial desde Integraciones.
        </p>

        <div className="space-y-3">
          {SCOPES_TABLE.map((s) => (
            <div
              key={s.value}
              className="border border-white/[0.06] rounded-xl px-4 py-4 bg-gray-900/40"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <ScopeBadge scope={s.value} />
              </div>
              <p className="text-sm text-gray-300 mb-1">{s.desc}</p>
              <p className="text-[11px] font-mono text-gray-600">{s.endpoints}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionLabel>Ejemplo: solo lectura</SectionLabel>
        <p className="text-sm text-gray-400 mb-3">
          Para consultar proyectos, ubicaciones y métricas sin ejecutar presencia.
        </p>
        <div className="flex gap-1.5 flex-wrap">
          <ScopeBadge scope="projects:read" />
          <ScopeBadge scope="locations:read" />
          <ScopeBadge scope="analytics:read" />
        </div>
      </Card>

      <Card>
        <SectionLabel>Ejemplo: flujo completo de presencia</SectionLabel>
        <p className="text-sm text-gray-400 mb-3">
          Para recorrer el flujo completo — descubrir proyectos, obtener{' '}
          <span className="font-mono text-gray-300 text-xs">location_id</span>, y
          ejecutar check + validate. Este es el conjunto mínimo para el Quick Start.
        </p>
        <div className="flex gap-1.5 flex-wrap">
          <ScopeBadge scope="projects:read" />
          <ScopeBadge scope="locations:read" />
          <ScopeBadge scope="presence:check" />
          <ScopeBadge scope="presence:validate" />
        </div>
      </Card>

      <Card>
        <SectionLabel>Ejemplo: credencial full access</SectionLabel>
        <p className="text-sm text-gray-400 mb-3">
          Acceso completo a todos los recursos. Recomendado para entornos de staging o
          integraciones que necesiten todas las capacidades.
        </p>
        <div className="flex gap-1.5 flex-wrap">
          <ScopeBadge scope="projects:read" />
          <ScopeBadge scope="locations:read" />
          <ScopeBadge scope="analytics:read" />
          <ScopeBadge scope="presence:check" />
          <ScopeBadge scope="presence:validate" />
        </div>
      </Card>
    </div>
  )
}

// ── Tab: Quick Start ──────────────────────────────────────────────────────────

function QuickStartTab() {
  const STEPS = [
    {
      n:      1,
      title:  'Verificar estado',
      desc:   'Health check sin autenticación.',
      method: 'GET' as const,
      path:   `${BASE}/health`,
      code:   `curl ${BASE}/health`,
      response: `{"status":"ok"}`,
    },
    {
      n:      2,
      title:  'Listar proyectos',
      desc:   'Requiere scope projects:read.',
      method: 'GET' as const,
      path:   `${BASE}/projects`,
      code:   `curl ${BASE}/projects \\
  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)"`,
      response: `{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Circuito Histórico",
      "status": "active",
      "locationCount": 3
    }
  ],
  "meta": { "count": 1 }
}`,
    },
    {
      n:      3,
      title:  'Listar ubicaciones',
      desc:   'Requiere scope locations:read.',
      method: 'GET' as const,
      path:   `${BASE}/projects/{project_id}/locations`,
      code:   `curl "${BASE}/projects/550e8400-e29b-41d4-a716-446655440000/locations" \\
  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)"`,
      response: `{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Punto Central",
      "latitude": -33.4372,
      "longitude": -70.6506,
      "boundary": { "type": "radius", "radiusMeters": 50 },
      "active": true
    }
  ],
  "meta": { "count": 1 }
}`,
    },
    {
      n:      4,
      title:  'Verificar presencia activa (dry-run)',
      desc:   'Requiere scope presence:check. Sin efectos secundarios — no consume quota.',
      method: 'POST' as const,
      path:   `${BASE}/presence/check`,
      code:   `curl -X POST ${BASE}/presence/check \\
  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)" \\
  -H "Content-Type: application/json" \\
  -d '{
    "location_id": "660e8400-e29b-41d4-a716-446655440001",
    "session_id": "session-abc-123",
    "coordinates": {
      "latitude": -33.4372,
      "longitude": -70.6506,
      "accuracy_meters": 8
    }
  }'`,
      response: `{
  "valid": true,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": { "locationActive": true, "insideBoundary": true, "distanceMeters": 34.7 },
  "destination": { "type": "url", "url": "https://example.com/contenido" },
  "failureReason": null,
  "eventId": null
}`,
    },
    {
      n:      5,
      title:  'Validar presencia GPS',
      desc:   'Requiere scope presence:validate. Registra evento y consume quota si corresponde.',
      method: 'POST' as const,
      path:   `${BASE}/presence/validate`,
      code:   `curl -X POST ${BASE}/presence/validate \\
  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)" \\
  -H "Content-Type: application/json" \\
  -d '{
    "location_id": "660e8400-e29b-41d4-a716-446655440001",
    "session_id": "session-abc-123",
    "coordinates": {
      "latitude": -33.4372,
      "longitude": -70.6506,
      "accuracy_meters": 8
    }
  }'`,
      response: `{
  "valid": true,
  "locationId": "660e8400-e29b-41d4-a716-446655440001",
  "sessionId": "session-abc-123",
  "checks": { "locationActive": true, "insideBoundary": true, "distanceMeters": 34.7 },
  "destination": { "type": "url", "url": "https://example.com/contenido" },
  "failureReason": null,
  "eventId": "770e8400-e29b-41d4-a716-446655440010"
}`,
    },
    {
      n:      6,
      title:  'Consultar analytics',
      desc:   'Requiere scope analytics:read.',
      method: 'GET' as const,
      path:   `${BASE}/projects/{project_id}/analytics`,
      code:   `curl "${BASE}/projects/550e8400-e29b-41d4-a716-446655440000/analytics?from=2026-01-01&to=2026-12-31" \\
  -H "Authorization: Basic $(echo -n 'ubk_live_xxx:sk_live_xxx' | base64)"`,
      response: `{
  "data": {
    "summary": {
      "radiusEntries": 142,
      "clicks": 89,
      "conversionPct": 63
    },
    "liveVisits": {
      "activeNow": 4,
      "lastHourDeltaPct": 15
    }
  }
}`,
    },
  ]

  return (
    <div className="space-y-5">
      <Card>
        <SectionLabel>Flujo completo</SectionLabel>
        <p className="text-sm text-gray-400 mb-6">
          Seguí estos 6 pasos en orden para integrar la API desde cero.
          Necesitás al menos una API Key con los scopes correspondientes a cada paso.
        </p>

        <div className="space-y-8">
          {STEPS.map((s) => (
            <Step key={s.n} {...s} />
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Tab: OpenAPI ──────────────────────────────────────────────────────────────

function OpenApiTab() {
  return (
    <div className="space-y-5">
      <Card>
        <SectionLabel>Especificación OpenAPI</SectionLabel>
        <p className="text-sm text-gray-400 mb-5">
          La especificación completa de la Ubyca API v1 está disponible en formato OpenAPI 3.1.
          Podés usarla para generar clientes, configurar herramientas como Postman o Insomnia,
          o validar requests contra el contrato oficial.
        </p>

        <a
          href="/openapi.yaml"
          download="ubyca-api-v1.yaml"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                     bg-gray-800 hover:bg-gray-700 border border-white/[0.08] hover:border-white/[0.13]
                     text-gray-200 transition-all duration-150"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar OpenAPI spec (YAML)
        </a>
      </Card>

      <Card>
        <SectionLabel>Importar en Postman</SectionLabel>
        <ol className="space-y-3">
          {[
            'Descargá el archivo ubyca-api-v1.yaml.',
            'En Postman, abrí Import → Upload Files.',
            'Seleccioná el archivo descargado.',
            'Postman generará la colección con todos los endpoints.',
            'Configurá las variables ubk_key y ubk_secret en tu entorno.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-400">
              <span className="text-gray-600 font-mono text-xs mt-0.5 flex-shrink-0 w-4">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <SectionLabel>Importar en Insomnia</SectionLabel>
        <ol className="space-y-3">
          {[
            'Descargá el archivo ubyca-api-v1.yaml.',
            'En Insomnia, abrí Import / Export → Import Data.',
            'Seleccioná From File y elegí el YAML.',
            'La colección se importa con todos los endpoints y esquemas.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-400">
              <span className="text-gray-600 font-mono text-xs mt-0.5 flex-shrink-0 w-4">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

// ── Tab: Endpoints ────────────────────────────────────────────────────────────

interface EndpointDef {
  method:  'GET' | 'POST'
  path:    string
  desc:    string
  scope?:  string
}

interface EndpointGroupDef {
  title:     string
  endpoints: EndpointDef[]
}

const ENDPOINT_GROUPS: EndpointGroupDef[] = [
  {
    title: 'Health',
    endpoints: [
      { method: 'GET',  path: '/health',                               desc: 'Verificar que la API está disponible.', },
    ],
  },
  {
    title: 'Projects',
    endpoints: [
      { method: 'GET',  path: '/projects',                             desc: 'Listar todos los proyectos del workspace.',        scope: 'projects:read' },
      { method: 'GET',  path: '/projects/{project_id}',                desc: 'Obtener detalle de un proyecto específico.',       scope: 'projects:read' },
    ],
  },
  {
    title: 'Locations',
    endpoints: [
      { method: 'GET',  path: '/projects/{project_id}/locations',      desc: 'Listar ubicaciones (puntos) de un proyecto.',      scope: 'locations:read' },
      { method: 'GET',  path: '/locations/{id}',                       desc: 'Obtener detalle de una ubicación.',                scope: 'locations:read' },
    ],
  },
  {
    title: 'Presence',
    endpoints: [
      { method: 'POST', path: '/presence/check',                       desc: 'Consultar el estado de presencia activa.',          scope: 'presence:check'    },
      { method: 'POST', path: '/presence/validate',                    desc: 'Validar presencia GPS contra una ubicación.',       scope: 'presence:validate' },
    ],
  },
  {
    title: 'Analytics',
    endpoints: [
      { method: 'GET',  path: '/projects/{id}/analytics',                 desc: 'Métricas agregadas del proyecto por período.',                   scope: 'analytics:read' },
      { method: 'GET',  path: '/projects/{id}/analytics/locations',       desc: 'Métricas desglosadas por ubicación.',                           scope: 'analytics:read' },
      { method: 'GET',  path: '/projects/{id}/analytics/distribution',    desc: 'Distribución temporal y geográfica de eventos.',                 scope: 'analytics:read' },
      { method: 'GET',  path: '/projects/{id}/analytics/intensity',       desc: 'Conteo de entradas por ubicación con coordenadas.',              scope: 'analytics:read' },
      { method: 'GET',  path: '/projects/{id}/analytics/outside_areas',   desc: 'GPS registrado fuera de las áreas definidas.',                   scope: 'analytics:read' },
    ],
  },
]

function EndpointsTab() {
  return (
    <div className="space-y-4">
      {ENDPOINT_GROUPS.map((group) => (
        <Card key={group.title}>
          <SectionLabel>{group.title}</SectionLabel>
          <div className="space-y-2.5">
            {group.endpoints.map((ep) => (
              <div
                key={`${ep.method}-${ep.path}`}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4
                           py-2.5 border-b border-white/[0.05] last:border-0"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MethodBadge method={ep.method} />
                  <span className="font-mono text-xs text-gray-300 truncate">{ep.path}</span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end flex-shrink-0">
                  <span className="text-xs text-gray-500 sm:text-right">{ep.desc}</span>
                  {ep.scope && <ScopeBadge scope={ep.scope} />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DevelopersPage() {
  const [tab, setTab] = useState<TabId>('intro')

  return (
    <div className="text-gray-100 min-h-full">

      {/* ── Desktop sticky header ──────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <h1 className="text-sm font-semibold text-gray-100">Developers</h1>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono
                           bg-brand-900/50 text-brand-300 border border-brand-700/40">
            API v1
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

        {/* Mobile header */}
        <div className="md:hidden">
          <h1 className="text-lg font-bold text-gray-100">Developers</h1>
          <p className="text-xs text-gray-500 mt-0.5">Documentación de la API v1</p>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-800 overflow-x-auto -mb-1 scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'relative px-4 py-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap flex-shrink-0',
                tab === t.id ? 'text-gray-100' : 'text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div key={tab} className="animate-fade-in pb-10">
          {tab === 'intro'      && <IntroTab />}
          {tab === 'auth'       && <AuthTab />}
          {tab === 'scopes'     && <ScopesTab />}
          {tab === 'quickstart' && <QuickStartTab />}
          {tab === 'openapi'    && <OpenApiTab />}
          {tab === 'endpoints'  && <EndpointsTab />}
        </div>

      </div>
    </div>
  )
}
