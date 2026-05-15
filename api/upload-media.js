// Vercel Serverless Function — token handler for Vercel Blob Client Upload.
//
// The media file is uploaded directly from the browser to Vercel Blob CDN;
// the file body never passes through this function (no 4.5 MB payload limit).
//
// Flow:
//   1. Browser calls upload() from @vercel/blob/client → POST {type:'blob.generate-client-token'}
//   2. This handler validates the request and returns a short-lived client token
//   3. Browser uploads directly to Vercel Blob using that token
//   4. Vercel Blob calls back with {type:'blob.upload-completed'}
//
// Requires env var: BLOB_READ_WRITE_TOKEN

import { handleUpload } from '@vercel/blob/client'

const ALLOWED_MEDIA_TYPES = [
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
]

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[upload-media] BLOB_READ_WRITE_TOKEN not set')
    return res.status(503).json({ error: 'Blob storage not configured on this deployment' })
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        console.log('[upload-media] Generating token for:', pathname)
        return {
          allowedContentTypes: ALLOWED_MEDIA_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[upload-media] Completed:', blob.url)
      },
    })
    return res.status(200).json(jsonResponse)
  } catch (err) {
    console.error('[upload-media] Error:', err.message)
    return res.status(400).json({ error: err.message })
  }
}
