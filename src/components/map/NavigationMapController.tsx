import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

interface NavigationMapControllerProps {
  isNavigating: boolean
  /** Whether auto-follow is active (vs. user exploring freely) */
  isLocked: boolean
  userLocation: { latitude: number; longitude: number } | null
  onUserDrag: () => void
}

/**
 * Headless component inside MapContainer.
 *
 * Follow mode (isLocked):
 *   - Smoothly pans to the user on every location update
 *   - Map dragging is disabled
 *   - Listens for dragstart to detect manual pans and calls onUserDrag
 *
 * Free mode (!isLocked):
 *   - Map dragging is re-enabled so the user can explore
 *   - Auto-pan paused
 *   - Heading rotation CSS is zeroed externally (in PublicPage)
 *
 * Not navigating: everything is restored.
 */
export default function NavigationMapController({
  isNavigating,
  isLocked,
  userLocation,
  onUserDrag,
}: NavigationMapControllerProps) {
  const map = useMap()
  // Keep onUserDrag stable in the event listener without adding it to deps
  const onUserDragRef = useRef(onUserDrag)
  useEffect(() => { onUserDragRef.current = onUserDrag }, [onUserDrag])

  // Auto-pan on location updates while locked
  useEffect(() => {
    if (!isNavigating || !isLocked || !userLocation) return
    map.panTo(
      [userLocation.latitude, userLocation.longitude],
      { animate: true, duration: 0.5, easeLinearity: 0.5 },
    )
  // Only react to actual lat/lng changes, not object identity
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.latitude, userLocation?.longitude, isNavigating, isLocked, map])

  // Lock/unlock dragging and detect manual drag attempts
  useEffect(() => {
    if (!isNavigating) {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      return
    }

    if (isLocked) {
      map.dragging.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.scrollWheelZoom.disable()

      // If the user somehow triggers drag (e.g. via keyboard or external event),
      // fire onUserDrag to switch to free mode
      function onDragStart() { onUserDragRef.current() }
      map.on('dragstart', onDragStart)
      return () => { map.off('dragstart', onDragStart) }
    } else {
      // Free mode — re-enable all interaction
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()

      // Listen for drag so we can confirm free mode (already set, but keeps state consistent)
      function onDragStart() { onUserDragRef.current() }
      map.on('dragstart', onDragStart)
      return () => {
        map.off('dragstart', onDragStart)
      }
    }
  }, [isNavigating, isLocked, map])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
    }
  }, [map])

  return null
}
