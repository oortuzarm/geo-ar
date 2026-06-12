import type { GeoPoint } from '../types'

/**
 * Returns true only when a GeoPoint has real, actionable content.
 *
 * Checks that there is an actual URL or file_url present — not just a
 * contentType selector value or an empty contentData object {}.
 *
 * Used to gate CTA visibility for informative points.
 * Unlock points always show CTA regardless of this check.
 */
export function hasPointContent(point: GeoPoint): boolean {
  // Legacy lookiarUrl field takes priority
  if (point.lookiarUrl && point.lookiarUrl.startsWith('http')) return true

  // No content type → no content configured
  if (!point.contentType) return false

  // Cast to plain object so we can safely inspect runtime shape,
  // which may be {} (empty) even when typed as ContentData.
  const cd = point.contentData as Record<string, unknown> | null | undefined

  if (point.contentType === 'url') {
    const url = cd && typeof cd['url'] === 'string' ? cd['url'] : ''
    return url.startsWith('http')
  }

  // video | audio | file
  const fileUrl = cd && typeof cd['file_url'] === 'string' ? cd['file_url'] : ''
  return fileUrl.startsWith('http')
}
