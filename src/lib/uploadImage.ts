const MAX_SIZE = 4 * 1024 * 1024  // 4 MB

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Uploads a File to /api/upload (Vercel Blob) and returns the public URL.
 * Throws on every failure — never falls back to base64.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Tipo no permitido: "${file.type || 'desconocido'}". Usa JPG, PNG o WEBP.`,
    )
  }

  if (file.size > MAX_SIZE) {
    throw new Error('La imagen supera los 4 MB')
  }

  let res: Response
  try {
    res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'content-type': file.type,
        'x-filename': encodeURIComponent(file.name),
      },
      body: file,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor de imágenes')
  }

  let body: { url?: string; error?: string } = {}
  try {
    body = await res.json()
  } catch {
    throw new Error(`Respuesta inválida del servidor (HTTP ${res.status})`)
  }

  if (!res.ok) {
    throw new Error(body.error ?? `Error del servidor (HTTP ${res.status})`)
  }

  const { url } = body
  if (typeof url !== 'string' || !url.startsWith('http')) {
    throw new Error('El servidor no devolvió una URL válida')
  }

  return url
}
