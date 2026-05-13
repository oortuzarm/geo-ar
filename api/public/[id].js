// Vercel Serverless Function — intercepts /public/:id BEFORE the SPA catch-all.
//
// Routing (vercel.json "routes"):
//   1. /public/:id  → this function   (explicit, before filesystem)
//   2. handle: filesystem              (serves /assets/*, /og-image.svg, etc.)
//   3. /(.*) → /index.html            (SPA fallback)
//
// The SPA shell (dist/index.html) is fetched via HTTP from the same Vercel origin
// instead of the filesystem — simpler and guaranteed to work on every deployment.

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) { res.status(400).end(); return }

  const proto  = req.headers['x-forwarded-proto'] ?? 'https'
  const host   = req.headers['x-forwarded-host']  ?? req.headers.host ?? ''
  const origin = `${proto}://${host}`

  // ── 1. Fetch the SPA shell from Vercel's CDN ────────────────────────────────
  // dist/index.html is served as a static file at /. Fetching it here avoids
  // any filesystem path issues inside the Lambda.
  let html
  try {
    const r = await fetch(`${origin}/`, { signal: AbortSignal.timeout(4_000) })
    if (!r.ok) throw new Error(`Shell HTTP ${r.status}`)
    html = await r.text()
  } catch (e) {
    console.error('[OG] shell fetch failed:', e.message)
    res.status(502).end('Could not load page shell')
    return
  }

  // ── 2. Fetch project from Rails API ─────────────────────────────────────────
  let project = null
  const apiUrl = process.env.VITE_API_URL
  if (apiUrl) {
    try {
      const r = await fetch(
        `${apiUrl}/api/public/geo_projects/${encodeURIComponent(id)}`,
        { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5_000) },
      )
      if (r.ok) project = await r.json()
      else console.warn('[OG] API responded:', r.status)
    } catch (e) {
      console.warn('[OG] project fetch failed:', e.message)
    }
  } else {
    console.warn('[OG] VITE_API_URL not set — skipping project fetch')
  }

  // ── 3. Build meta tags ───────────────────────────────────────────────────────
  const pageUrl    = `${origin}/public/${id}`
  const coverImage = project?.coverImage ?? project?.cover_image
  const title      = project?.title ? `${project.title} — Ubyca` : 'Ubyca — Experiencias geolocalizadas'
  const desc       = project?.shareText?.trim()
    || (project?.subtitle
      ? `Experiencia geolocalizada: ${project.subtitle}`
      : 'Crea puntos geolocalizados, define radios de activación y permite que tus usuarios desbloqueen contenido, rutas, promociones o experiencias al llegar a un lugar específico.')
  const ogImage    = resolveOgImage(coverImage, origin)

  const metaBlock = project
    ? buildMetaTags({ title, desc, pageUrl, ogImage })
    : ''

  // Always inject the debug marker so "View Page Source" confirms the function ran
  html = html.replace(
    '</head>',
    `  <!-- Ubyca OG SSR active -->\n${metaBlock}\n</head>`,
  )

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    .setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    .status(200)
    .end(html)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveOgImage(coverImage, origin) {
  const fallback = { url: `${origin}/og-image.svg`, type: 'image/svg+xml' }
  if (!coverImage || coverImage.startsWith('data:')) return fallback
  if (coverImage.startsWith('/')) {
    return { url: `${origin}${coverImage}`, type: mime(ext(coverImage)) }
  }
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return { url: coverImage, type: mime(ext(coverImage.split('?')[0])) }
  }
  return fallback
}

function ext(url) {
  return (url.split('.').pop() ?? '').toLowerCase()
}

function mime(e) {
  return { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
           webp: 'image/webp', svg: 'image/svg+xml' }[e] ?? 'image/jpeg'
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildMetaTags({ title, desc, pageUrl, ogImage }) {
  const t = esc(title)
  const d = esc(desc)
  const u = esc(pageUrl)
  const i = esc(ogImage.url)
  return [
    `  <title>${t}</title>`,
    `  <meta property="og:title"            content="${t}" />`,
    `  <meta property="og:description"      content="${d}" />`,
    `  <meta property="og:url"              content="${u}" />`,
    `  <meta property="og:type"             content="website" />`,
    `  <meta property="og:image"            content="${i}" />`,
    `  <meta property="og:image:secure_url" content="${i}" />`,
    `  <meta property="og:image:type"       content="${ogImage.type}" />`,
    `  <meta property="og:image:width"      content="1200" />`,
    `  <meta property="og:image:height"     content="630" />`,
    `  <meta name="twitter:card"            content="summary_large_image" />`,
    `  <meta name="twitter:title"           content="${t}" />`,
    `  <meta name="twitter:description"     content="${d}" />`,
    `  <meta name="twitter:image"           content="${i}" />`,
  ].join('\n')
}
