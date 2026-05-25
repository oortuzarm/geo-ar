import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export interface FlyTarget {
  lat: number
  lng: number
  zoom: number
  /**
   * Pixels to shift the view upward after centering.
   * Used on mobile to compensate for the bottom sheet covering the lower map area.
   * When set, the zoom is treated as a minimum (won't zoom out if already closer).
   * When absent/0, the exact zoom is used (allows zoom out for overview).
   */
  panOffsetPx?: number
}

interface MapControllerProps {
  /** Changing this value triggers a single flyTo call. */
  flyKey: string | null
  flyTarget: FlyTarget | null
}

/**
 * Headless component inside MapContainer.
 * Calls map.flyTo exactly once per unique flyKey value.
 * No auto-movement on location updates — all navigation is explicit.
 */
export default function MapController({ flyKey, flyTarget }: MapControllerProps) {
  const map = useMap()
  const lastFlyKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!flyKey || !flyTarget || flyKey === lastFlyKeyRef.current) return
    lastFlyKeyRef.current = flyKey

    const { lat, lng, zoom, panOffsetPx = 0 } = flyTarget

    if (panOffsetPx > 0) {
      // Point-selection case: don't zoom out if already close enough.
      const targetZoom = Math.max(map.getZoom(), zoom)
      // In Leaflet's world-pixel space, Y increases southward.
      // We want the real point to appear panOffsetPx px ABOVE the map center.
      // So the flyTo target must be panOffsetPx px SOUTH of the real point (add Y).
      // flyTo centers that southern target → real point lands above center, clear of the sheet.
      const px = map.project([lat, lng], targetZoom)
      const shifted = px.add(L.point(0, panOffsetPx))
      const adjustedLatLng = map.unproject(shifted, targetZoom)
      map.flyTo(adjustedLatLng, targetZoom, { animate: true, duration: 0.8 })
    } else {
      // Overview case (exit, user location): use exact zoom to allow zoom out.
      map.flyTo([lat, lng], zoom, { animate: true, duration: 0.8 })
    }
  }, [flyKey, flyTarget, map])

  return null
}
