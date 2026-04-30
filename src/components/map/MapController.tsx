import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

export interface FlyTarget {
  lat: number
  lng: number
  zoom: number
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
    map.flyTo([flyTarget.lat, flyTarget.lng], flyTarget.zoom, {
      animate: true,
      duration: 0.8,
    })
  }, [flyKey, flyTarget, map])

  return null
}
