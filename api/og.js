// Vercel Serverless Function — serves /public/:id with pre-rendered OG meta tags.
//
// Invoked via vercel.json routes:
//   /public/([^/]+)  →  /api/og?id=$1
//
// Fetches the SPA shell (dist/index.html served statically at /) and injects
// Open Graph tags so WhatsApp, Telegram, iMessage, etc. see them on first load.

export default async function handler(req, res) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
  if (!id) { res.status(400).end('Missing id'); return }

  const proto  = req.headers['x-forwarded-proto'] ?? 'https'
  const host   = req.headers['x-forwarded-host']  ?? req.headers.host ?? ''
  const origin = `${proto}://${host}`

  // ── 1. Fetch the SPA shell ──────────────────────────────────────────────────
  // dist/index.html is served as a static file at /.
  // Fetching it via HTTP avoids any Lambda filesystem path issues.
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
      else console.warn('[OG] API responded:', r.status, 'for id:', id)
    } catch (e) {
      console.warn('[OG] project fetch failed:', e.message)
    }
  } else {
    console.warn('[OG] VITE_API_URL not set')
  }

  // ── 3. Build and inject meta tags ───────────────────────────────────────────
  // Reconstruct the canonical /public/:id URL, preserving any extra query params
  // (e.g. ?v=2000 cache-busters) that arrived via the original request.
  // req.query always contains `id` from the vercel.json rewrite; every other key
  // comes from the original requester and should be kept in og:url so WhatsApp
  // sees a distinct URL when the param changes.
  const extraParams = Object.entries(req.query)
    .filter(([k]) => k !== 'id')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(Array.isArray(v) ? v[0] : v)}`)
    .join('&')
  const pageUrl    = `${origin}/public/${id}${extraParams ? `?${extraParams}` : ''}`
  const coverImage = project?.coverImage ?? project?.cover_image
  const title      = project?.title ?? 'Experiencia GeoAR'
  const desc       = project?.subtitle
    ? `Experiencia geolocalizada: ${project.subtitle}`
    : 'Experiencia geolocalizada en GeoAR'
  const ogImage    = resolveOgImage(coverImage, origin)

  const metaBlock = project ? buildMetaTags({ title, desc, pageUrl, ogImage }) : ''

  html = html.replace(
    '</head>',
    `  <!-- GeoAR OG SSR active -->\n${metaBlock}\n</head>`,
  )

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    .setHeader('Cache-Control', 'no-store, max-age=0')
    .status(200)
    .end(html)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveOgImage(coverImage, origin) {
  const fallback = { url: `${origin}/og-image.svg`, type: 'image/svg+xml' }
  if (!coverImage || coverImage.startsWith('data:')) return fallback
  if (coverImage.startsWith('/'))
    return { url: `${origin}${coverImage}`, type: mimeFromUrl(coverImage) }
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://'))
    return { url: coverImage, type: mimeFromUrl(coverImage.split('?')[0]) }
  return fallback
}

function mimeFromUrl(url) {
  const e = (url.split('.').pop() ?? '').toLowerCase()
  return { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
           webp: 'image/webp', svg: 'image/svg+xml' }[e] ?? 'image/jpeg'
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildMetaTags({ title, desc, pageUrl, ogImage }) {
  const t = esc(title), d = esc(desc), u = esc(pageUrl), i = esc(ogImage.url)
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
