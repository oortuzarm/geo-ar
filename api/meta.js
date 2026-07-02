// Vercel Serverless Function — serves marketing routes with per-route meta tags.
//
// Invoked via vercel.json for 10 public marketing paths. The homepage (/)
// is handled directly by index.html; routing / through this function would
// cause a fetch loop since the shell is loaded via GET /.
//
//   /solutions/retail  →  /api/meta?route=/solutions/retail
//   /precios           →  /api/meta?route=/precios
//   … (see ROUTES map below and vercel.json for the full list)
//
// Strategy: fetch the SPA shell (index.html at /), strip all variable head
// tags to prevent duplicates, inject route-specific title / description /
// OG / Twitter / canonical tags so crawlers see correct metadata before JS.

const BASE_URL = 'https://www.ubyca.com'
const OG_IMAGE = `${BASE_URL}/og-image.svg`

// ── Central metadata map ──────────────────────────────────────────────────────
// Add or update entries here when marketing routes change.
// Keep vercel.json in sync: each key here needs a corresponding route entry.
// title: ≤60 chars ideal | description: ≤160 chars ideal.
const ROUTES = {
  '/solutions/retail': {
    title: 'Ubyca para Retail — Activa experiencias cuando tus clientes están en tienda',
    description: 'Detecta la presencia de tus clientes en el punto de venta y activa mensajes, beneficios y experiencias en el momento de mayor intención de compra. Sin hardware. Sin apps.',
  },
  '/solutions/events': {
    title: 'Ubyca para Eventos — Experiencias geolocalizadas por zona del recinto',
    description: 'Activa contenido diferente en cada zona del evento, valida presencia en sesiones y mide el comportamiento espacial de los asistentes en tiempo real. Sin beacons ni infraestructura.',
  },
  '/solutions/real-estate': {
    title: 'Ubyca para Real Estate — Activa experiencias cuando el interesado está en el proyecto',
    description: 'Entrega información del proyecto, fichas técnicas y materiales de venta cuando el interesado llega físicamente al lugar. Mide las visitas a cada sala de ventas con datos reales.',
  },
  '/solutions/tourism': {
    title: 'Ubyca para Turismo — Experiencias geolocalizadas para destinos y rutas',
    description: 'Crea rutas turísticas interactivas donde el contenido se activa al llegar a cada punto. Ideal para destinos, museos, parques naturales y patrimonio cultural.',
  },
  '/solutions/sector-publico': {
    title: 'Ubyca para Sector Público — Digitaliza espacios y experiencias ciudadanas',
    description: 'Conecta municipalidades, parques, centros históricos y espacios públicos con experiencias digitales activadas por ubicación. Entrega información contextual a ciudadanos y visitantes.',
  },
  '/solutions/brand-activations': {
    title: 'Ubyca para Activaciones de Marca — Experiencias geolocalizadas en terreno',
    description: 'Activa contenido, beneficios y experiencias cuando el público llega a tu zona. Mide la participación real de cada activación, pop-up, lanzamiento o evento patrocinado.',
  },
  '/studio': {
    title: 'Ubyca Studio — Crea y gestiona experiencias geolocalizadas',
    description: 'Diseña zonas GPS, configura contenido y monitorea el comportamiento de tus usuarios desde un panel centralizado. Empieza gratis, sin código ni hardware.',
  },
  '/docs': {
    title: 'Documentación para Desarrolladores — Ubyca API',
    description: 'Integra Ubyca en tu aplicación con nuestra API REST. Referencia completa, guías de inicio rápido y ejemplos para conectar experiencias geolocalizadas a cualquier plataforma.',
  },
  '/precios': {
    title: 'Precios — Ubyca',
    description: 'Planes flexibles para empresas de todos los tamaños. Desde proyectos piloto hasta despliegues a escala nacional. Sin compromisos. Empieza gratis.',
  },
  '/contact': {
    title: 'Contacto — Ubyca',
    description: 'Habla con nuestro equipo para conocer cómo Ubyca puede transformar tus espacios en experiencias digitales. Solicita una demo o un presupuesto personalizado.',
  },
}

export default async function handler(req, res) {
  const route = Array.isArray(req.query.route) ? req.query.route[0] : req.query.route
  const meta = ROUTES[route]
  if (!meta) { res.status(400).end('Unknown route'); return }

  const proto  = req.headers['x-forwarded-proto'] ?? 'https'
  const host   = req.headers['x-forwarded-host']  ?? req.headers.host ?? ''
  const origin = `${proto}://${host}`

  // Fetch the SPA shell. The / route is NOT routed through this function,
  // so fetching it here goes straight to the static index.html — no loop.
  let html
  try {
    const r = await fetch(`${origin}/`, { signal: AbortSignal.timeout(4_000) })
    if (!r.ok) throw new Error(`Shell HTTP ${r.status}`)
    html = await r.text()
  } catch (e) {
    console.error('[meta] shell fetch failed:', e.message)
    res.status(502).end('Could not load page shell')
    return
  }

  // Strip existing per-route head tags to prevent duplicates in the output.
  // The index.html tags are replaced entirely by the route-specific block below.
  html = html
    .replace(/<title>[^<]*<\/title>/gi, '')
    .replace(/<meta\s[^>]*name="description"[^>]*>/gi, '')
    .replace(/<meta\s[^>]*property="og:[^"]*"[^>]*>/gi, '')
    .replace(/<meta\s[^>]*name="twitter:[^"]*"[^>]*>/gi, '')
    .replace(/<link\s[^>]*rel="canonical"[^>]*>/gi, '')

  // Inject route-specific meta block immediately before </head>
  const canonical = `${BASE_URL}${route}`
  html = html.replace('</head>', `${buildMetaTags({ ...meta, canonical })}\n</head>`)

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    .setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    .status(200)
    .end(html)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildMetaTags({ title, description, canonical }) {
  const t = esc(title), d = esc(description), c = esc(canonical), i = esc(OG_IMAGE)
  return [
    `  <title>${t}</title>`,
    `  <link rel="canonical"               href="${c}" />`,
    `  <meta name="description"            content="${d}" />`,
    `  <meta property="og:title"           content="${t}" />`,
    `  <meta property="og:description"     content="${d}" />`,
    `  <meta property="og:url"             content="${c}" />`,
    `  <meta property="og:type"            content="website" />`,
    `  <meta property="og:image"           content="${i}" />`,
    `  <meta property="og:image:secure_url" content="${i}" />`,
    `  <meta property="og:image:type"      content="image/svg+xml" />`,
    `  <meta property="og:image:width"     content="1200" />`,
    `  <meta property="og:image:height"    content="630" />`,
    `  <meta name="twitter:card"           content="summary_large_image" />`,
    `  <meta name="twitter:title"          content="${t}" />`,
    `  <meta name="twitter:description"    content="${d}" />`,
    `  <meta name="twitter:image"          content="${i}" />`,
  ].join('\n')
}
