// Vercel Serverless Function — receives a raw file body and stores it in Vercel Blob.
// Returns { url } — a permanent public CDN URL.
//
// Requires env var: BLOB_READ_WRITE_TOKEN
// Body: raw file bytes
// Headers:
//   content-type : one of the ALLOWED_TYPES below
//   x-filename   : URI-encoded original filename (optional)

import { put } from '@vercel/blob'

// Per content-type: max size in bytes and Blob folder prefix.
const ALLOWED_TYPES = {
  // Images (existing — backward compatible)
  'image/jpeg': { maxBytes: 4.5 * 1024 * 1024, folder: 'covers' },
  'image/png':  { maxBytes: 4.5 * 1024 * 1024, folder: 'covers' },
  'image/webp': { maxBytes: 4.5 * 1024 * 1024, folder: 'covers' },
  // Video
  'video/mp4':  { maxBytes: 100 * 1024 * 1024, folder: 'media' },
  'video/webm': { maxBytes: 100 * 1024 * 1024, folder: 'media' },
  // Audio
  'audio/mpeg': { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'audio/wav':  { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  // Documents / files
  'application/pdf':                                                                      { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/msword':                                                                   { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':             { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/vnd.ms-excel':                                                             { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':                  { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/vnd.ms-powerpoint':                                                       { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':          { maxBytes: 25 * 1024 * 1024, folder: 'media' },
  'application/zip':                                                                      { maxBytes: 25 * 1024 * 1024, folder: 'media' },
}

export const config = {
  api: {
    bodyParser: false,
  },
}

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
  const typeConfig  = ALLOWED_TYPES[contentType]

  if (!typeConfig) {
    res.status(400).json({ error: `Tipo no permitido: "${contentType}"` })
    return
  }

  // Early size check via Content-Length header (avoids reading the full body first).
  const declaredSize = parseInt(req.headers['content-length'] ?? '0', 10)
  if (declaredSize > typeConfig.maxBytes) {
    const maxMB = (typeConfig.maxBytes / (1024 * 1024)).toFixed(0)
    res.status(413).json({ error: `El archivo supera el límite de ${maxMB} MB` })
    return
  }

  let buffer
  try {
    buffer = await readBody(req)
  } catch (e) {
    console.error('[upload] Body read error:', e.message)
    res.status(400).json({ error: 'No se pudo leer el archivo' })
    return
  }

  if (buffer.length === 0) {
    res.status(400).json({ error: 'Archivo vacío' })
    return
  }

  if (buffer.length > typeConfig.maxBytes) {
    const maxMB = (typeConfig.maxBytes / (1024 * 1024)).toFixed(0)
    res.status(413).json({ error: `El archivo supera el límite de ${maxMB} MB` })
    return
  }

  let safeName
  try {
    const rawName = req.headers['x-filename'] || `file-${Date.now()}`
    safeName = decodeURIComponent(rawName).replace(/[^a-zA-Z0-9._-]/g, '_')
  } catch {
    safeName = `file-${Date.now()}`
  }

  const pathname = `${typeConfig.folder}/${Date.now()}-${safeName}`
  console.log(`[upload] Storing ${pathname} (${buffer.length} B, ${contentType})`)

  try {
    const blob = await put(pathname, buffer, { access: 'public', contentType })
    console.log('[upload] OK:', blob.url)
    res.status(200).json({ url: blob.url })
  } catch (e) {
    console.error('[upload] Blob put failed:', e.message)
    res.status(500).json({ error: `Error al guardar el archivo: ${e.message}` })
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
