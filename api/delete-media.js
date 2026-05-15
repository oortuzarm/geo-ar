// Vercel Serverless Function — deletes a single Vercel Blob asset by URL.
// Called fire-and-forget after a successful save/delete when a media file is
// no longer referenced by any geo point.
//
// POST /api/delete-media
// Body: { url: string }
//
// Requires env var: BLOB_READ_WRITE_TOKEN

import { del } from '@vercel/blob'

const VERCEL_BLOB_HOST = 'blob.vercel-storage.com'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[delete-media] BLOB_READ_WRITE_TOKEN not set')
    return res.status(503).json({ error: 'Blob storage not configured on this deployment' })
  }

  const { url } = req.body ?? {}

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid url' })
  }

  // Only delete assets that belong to Vercel Blob — never external URLs.
  if (!url.includes(VERCEL_BLOB_HOST)) {
    console.warn('[delete-media] Rejected non-Blob URL:', url)
    return res.status(400).json({ error: 'URL does not belong to Vercel Blob' })
  }

  try {
    await del(url)
    console.log('[delete-media] Deleted:', url)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[delete-media] Failed to delete:', url, err.message)
    return res.status(500).json({ error: err.message })
  }
}
