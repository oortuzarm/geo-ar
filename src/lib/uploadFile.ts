// Per-type size limits (mirror api/upload.js)
const TYPE_LIMITS: Record<string, number> = {
  'video/mp4':  10 * 1024 * 1024,
  'video/webm': 10 * 1024 * 1024,
  'audio/mpeg': 10 * 1024 * 1024,
  'audio/wav':  10 * 1024 * 1024,
  'application/pdf':    10 * 1024 * 1024,
  'application/msword': 10 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':   10 * 1024 * 1024,
  'application/vnd.ms-excel':                                                   10 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':         10 * 1024 * 1024,
  'application/vnd.ms-powerpoint':                                              10 * 1024 * 1024,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 10 * 1024 * 1024,
  'application/zip':    10 * 1024 * 1024,
}

/**
 * Uploads a media or document File to /api/upload (Vercel Blob) and returns the public URL.
 * Throws a descriptive error on every failure.
 */
export async function uploadFile(file: File): Promise<string> {
  const maxBytes = TYPE_LIMITS[file.type]
  if (maxBytes === undefined) {
    throw new Error(`Tipo de archivo no permitido: "${file.type || 'desconocido'}"`)
  }

  if (file.size > maxBytes) {
    const maxMB = Math.round(maxBytes / (1024 * 1024))
    throw new Error(`El archivo excede el tamaño máximo permitido de ${maxMB}MB.`)
  }

  let res: Response
  try {
    res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'content-type': file.type,
        'x-filename':   encodeURIComponent(file.name),
      },
      body: file,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor de archivos')
  }

  let body: { url?: string; error?: string } = {}
  try {
    body = await res.json()
  } catch {
    throw new Error(`Respuesta inválida del servidor (HTTP ${res.status})`)
  }

  if (!res.ok) {
    if (res.status === 413) {
      throw new Error('El archivo excede el tamaño máximo permitido de 10MB.')
    }
    throw new Error(body.error ?? `Error del servidor (HTTP ${res.status})`)
  }

  const { url } = body
  if (typeof url !== 'string' || !url.startsWith('http')) {
    throw new Error('El servidor no devolvió una URL válida')
  }

  return url
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)                       return `${bytes} B`
  if (bytes < 1024 * 1024)               return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
