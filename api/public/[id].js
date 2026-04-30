// Vercel Serverless Function: intercepts /public/:id before the SPA catch-all.
// Fetches the project from the Rails API and injects Open Graph meta tags into
// the Vite-built index.html so crawlers (WhatsApp, Telegram, iMessage, etc.)
// see the correct title and image in the pre-rendered HTML — without JS.

import fs from 'node:fs'
import path from 'node:path'

/** @param {import('@vercel/node').VercelRequest} req
 *  @param {import('@vercel/node').VercelResponse} res */
export default async function handler(req, res) {
  const { id } = req.query
  if (!id) { res.status(400).end(); return }

  // ── 1. Fetch project from Rails API ────────────────────────────────────────
  let project = null
  const apiUrl = process.env.VITE_API_URL
  if (apiUrl) {
    try {
      const r = await fetch(
        `${apiUrl}/api/public/geo_projects/${encodeURIComponent(id)}`,
        { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5_000) },
      )
      if (r.ok) project = await r.json()
    } catch (e) {
      console.warn('[OG] project fetch failed:', e.message)
    }
  }

  // ── 2. Read dist/index.html (bundled via includeFiles in vercel.json) ───────
  let html
  const candidates = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html'),
  ]
  for (const p of candidates) {
    try { html = fs.readFileSync(p, 'utf8'); break } catch { /* try next */ }
  }
  if (!html) { res.status(500).end('index.html not found'); return }

  // ── 3. Inject OG meta tags before </head> ──────────────────────────────────
  if (project) {
    const proto  = req.headers['x-forwarded-proto'] ?? 'https'
    const host   = req.headers['x-forwarded-host']  ?? req.headers.host ?? ''
    const origin = `${proto}://${host}`
    const pageUrl = `${origin}/public/${id}`

    // Rails returns camelCase; guard against snake_case just in case
    const coverImage = project.coverImage ?? project.cover_image
    const title = project.title ?? 'Experiencia GeoAR'
    const desc  = project.subtitle
      ? `Experiencia geolocalizada: ${project.subtitle}`
      : 'Experiencia geolocalizada en GeoAR'

    const ogImage = resolveOgImage(coverImage, origin)
    const tags    = buildMetaTags({ title, desc, pageUrl, ogImage })

    html = html.replace('</head>', `${tags}\n</head>`)
  }

  res
    .setHeader('Content-Type', 'text/html; charset=utf-8')
    // 60s fresh + 5min stale-while-revalidate — fast enough for crawlers,
    // short enough for updated projects to propagate without manual purge.
    .setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    .status(200)
    .end(html)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveOgImage(coverImage, origin) {
  const fallback = { url: `${origin}/og-image.svg`, type: 'image/svg+xml' }
  if (!coverImage || coverImage.startsWith('data:')) return fallback
  if (coverImage.startsWith('/')) {
    const ext = coverImage.split('.').pop()?.toLowerCase() ?? ''
    return { url: `${origin}${coverImage}`, type: mime(ext) }
  }
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    const ext = coverImage.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
    return { url: coverImage, type: mime(ext) }
  }
  return fallback
}

function mime(ext) {
  return { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
           webp: 'image/webp', svg: 'image/svg+xml' }[ext] ?? 'image/jpeg'
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
    `  <meta property="og:title"             content="${t}" />`,
    `  <meta property="og:description"       content="${d}" />`,
    `  <meta property="og:url"               content="${u}" />`,
    `  <meta property="og:type"              content="website" />`,
    `  <meta property="og:image"             content="${i}" />`,
    `  <meta property="og:image:secure_url"  content="${i}" />`,
    `  <meta property="og:image:type"        content="${ogImage.type}" />`,
    `  <meta property="og:image:width"       content="1200" />`,
    `  <meta property="og:image:height"      content="630" />`,
    `  <meta name="twitter:card"             content="summary_large_image" />`,
    `  <meta name="twitter:title"            content="${t}" />`,
    `  <meta name="twitter:description"      content="${d}" />`,
    `  <meta name="twitter:image"            content="${i}" />`,
  ].join('\n')
}
