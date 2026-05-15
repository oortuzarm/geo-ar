const VERCEL_BLOB_HOST = 'blob.vercel-storage.com'

/** Returns true only for URLs that belong to this project's Vercel Blob store. */
export function isVercelBlobUrl(url: unknown): url is string {
  return typeof url === 'string' && url.length > 0 && url.includes(VERCEL_BLOB_HOST)
}

/**
 * Requests deletion of a Vercel Blob asset via /api/delete-media.
 * Fire-and-forget safe: never throws — logs warnings on failure instead.
 * Silently no-ops for empty or non-Blob URLs.
 */
export async function deleteMediaFile(fileUrl: string): Promise<void> {
  if (!isVercelBlobUrl(fileUrl)) {
    if (fileUrl) console.warn('[deleteMediaFile] Skipping non-Blob URL:', fileUrl)
    return
  }

  try {
    const res = await fetch('/api/delete-media', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: fileUrl }),
    })
    if (res.ok) {
      console.log('[deleteMediaFile] Deleted asset:', fileUrl)
    } else {
      const body = await res.json().catch(() => ({}))
      console.warn('[deleteMediaFile] Server rejected deletion:', fileUrl, body.error ?? res.status)
    }
  } catch (err) {
    console.warn('[deleteMediaFile] Network error deleting:', fileUrl, err)
  }
}
