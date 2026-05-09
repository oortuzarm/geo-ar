import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface NavigationMapControllerProps {
  isNavigating: boolean
  userLocation: { latitude: number; longitude: number } | null
}

/**
 * Headless component inside MapContainer.
 * In navigation mode: continuously centers the map on the user's position
 * and disables manual dragging so auto-follow stays uninterrupted.
 */
export default function NavigationMapController({
  isNavigating,
  userLocation,
}: NavigationMapControllerProps) {
  const map = useMap()

  // Smoothly pan to user on every location update while navigating
  useEffect(() => {
    if (!isNavigating || !userLocation) return
    map.panTo(
      [userLocation.latitude, userLocation.longitude],
      { animate: true, duration: 0.5, easeLinearity: 0.5 },
    )
  // Exhaustive deps: only re-run when lat/lng actually change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude, isNavigating, map])

  // Lock / unlock map interaction when nav mode toggles
  useEffect(() => {
    if (isNavigating) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
    }
    return () => {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
    }
  }, [isNavigating, map])

  return null
}
