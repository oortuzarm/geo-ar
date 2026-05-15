import { upload } from '@vercel/blob/client'

// Per-type size limits — enforced client-side before requesting a token.
// The server-side maximum (api/upload-media.js) mirrors these at 20 MB.
const TYPE_LIMITS: Record<string, number> = {
  'video/mp4':  20 * 1024 * 1024,
  'video/webm': 20 * 1024 * 1024,
  'audio/mpeg': 20 * 1024 * 1024,
  'audio/wav':  20 * 1024 * 1024,
  'application/pdf':    20 * 1024 * 1024,
  'application/msword': 20 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':   20 * 1024 * 1024,
  'application/vnd.ms-excel':                                                   20 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':         20 * 1024 * 1024,
  'application/vnd.ms-powerpoint':                                              20 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 20 * 1024 * 1024,
  'application/zip':    20 * 1024 * 1024,
}

/**
 * Uploads a media or document File directly to Vercel Blob CDN via client upload.
 * The file body bypasses the serverless function — no 4.5 MB request body limit.
 * Returns the public CDN URL.
 */
export async function uploadFile(file: File): Promise<string> {
  const maxBytes = TYPE_LIMITS[file.type]
  if (maxBytes === undefined) {
    throw new Error(`Tipo de archivo no permitido: "${file.type || 'desconocido'}"`)
  }

  if (file.size > maxBytes) {
    throw new Error('El archivo excede el tamaño máximo permitido de 20MB.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pathname = `media/${Date.now()}-${safeName}`

  try {
    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload-media',
      contentType: file.type,
    })
    return blob.url
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (
      msg.includes('413') ||
      msg.toLowerCase().includes('too large') ||
      msg.toLowerCase().includes('maximum size') ||
      msg.toLowerCase().includes('exceeds')
    ) {
      throw new Error('El archivo excede el tamaño máximo permitido de 20MB.')
    }
    throw new Error(`No se pudo subir el archivo: ${msg}`)
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
