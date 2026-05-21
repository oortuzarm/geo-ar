import type { GeoPoint } from '../types'

/** Returns the URL of the cover image, falling back to the legacy `image` field. */
export function getPointCoverImage(point: GeoPoint): string | undefined {
  if (point.images && point.images.length > 0) {
    return (point.images.find((i) => i.isCover) ?? point.images[0]).url
  }
  return point.image
}

/**
 * Returns all image URLs for a point in display order.
 * Cover image is guaranteed to be first; others follow by position.
 * Falls back to the legacy single `image` field.
 */
export function getPointGalleryImages(point: GeoPoint): string[] {
  if (point.images && point.images.length > 0) {
    const sorted = [...point.images].sort((a, b) => a.position - b.position)
    const coverIdx = sorted.findIndex((i) => i.isCover)
    if (coverIdx > 0) sorted.unshift(sorted.splice(coverIdx, 1)[0])
    return sorted.map((i) => i.url)
  }
  return point.image ? [point.image] : []
}
