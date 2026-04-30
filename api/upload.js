// Vercel Serverless Function — receives a raw image body and stores it in Vercel Blob.
// Returns { url } — a permanent public URL safe for og:image.
//
// Requires env var: BLOB_READ_WRITE_TOKEN (Vercel dashboard → Storage → Blob → token)
// Body: raw file bytes (content-type must be image/*)
// Headers:
//   content-type : image/jpeg | image/png | image/webp
//   x-filename   : URI-encoded original filename (optional)

import { put } from '@vercel/blob'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[upload] BLOB_READ_WRITE_TOKEN not set')
    res.status(503).json({ error: 'Blob storage not configured on this deployment' })
    return
  }

  const contentType = (req.headers['content-type'] ?? '').split(';')[0].trim()
  if (!contentType.startsWith('image/')) {
    res.status(400).json({ error: `Invalid content-type: "${contentType}". Must be image/*` })
    return
  }

  let buffer
  try {
    buffer = await readBody(req)
  } catch (e) {
    console.error('[upload] Body read error:', e.message)
    res.status(400).json({ error: 'Could not read request body' })
    return
  }

  if (buffer.length === 0) {
    res.status(400).json({ error: 'Empty body — no file received' })
    return
  }

  if (buffer.length > 4.5 * 1024 * 1024) {
    res.status(413).json({ error: 'File too large (max 4.5 MB)' })
    return
  }

  let safeName
  try {
    const rawName = req.headers['x-filename'] || `cover-${Date.now()}.jpg`
    safeName = decodeURIComponent(rawName).replace(/[^a-zA-Z0-9._-]/g, '_')
  } catch {
    safeName = `cover-${Date.now()}.jpg`
  }

  const pathname = `covers/${Date.now()}-${safeName}`
  console.log(`[upload] Storing ${pathname} (${buffer.length} B, ${contentType})`)

  try {
    const blob = await put(pathname, buffer, { access: 'public', contentType })
    console.log('[upload] OK:', blob.url)
    res.status(200).json({ url: blob.url })
  } catch (e) {
    console.error('[upload] Blob put failed:', e.message)
    res.status(500).json({ error: `Blob upload failed: ${e.message}` })
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}
