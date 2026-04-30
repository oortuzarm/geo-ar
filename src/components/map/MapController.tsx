import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export interface FitTarget {
  latLngs: [number, number][]
  userLat: number
  userLng: number
}

interface MapControllerProps {
  /** Changing this value triggers a single fitBounds call.
   *  Use a new string (e.g. pointId) only when explicitly needed. */
  fitKey: string | null
  fitTarget: FitTarget | null
  onInteract: () => void
}

/**
 * Headless component that lives inside MapContainer.
 * - Listens for user drag/zoom and calls onInteract().
 * - Calls fitBounds exactly once per unique fitKey value.
 */
export default function MapController({ fitKey, fitTarget, onInteract }: MapControllerProps) {
  const map = useMap()
  const lastFitKeyRef = useRef<string | null>(null)
  // Keep onInteract stable in the Leaflet event closure
  const onInteractRef = useRef(onInteract)
  useEffect(() => { onInteractRef.current = onInteract }, [onInteract])

  // Detect manual user interaction (drag or zoom initiated by the user)
  useEffect(() => {
    const handler = () => onInteractRef.current()
    map.on('dragstart', handler)
    map.on('zoomstart', handler)
    return () => {
      map.off('dragstart', handler)
      map.off('zoomstart', handler)
    }
  }, [map])

  // fitBounds only when fitKey changes (guards against re-runs for the same key)
  useEffect(() => {
    if (!fitKey || !fitTarget || fitKey === lastFitKeyRef.current) return
    lastFitKeyRef.current = fitKey

    const { latLngs, userLat, userLng } = fitTarget
    if (latLngs.length === 0) return

    const bounds = L.latLngBounds([[userLat, userLng], ...latLngs])
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17, animate: true })
  }, [fitKey, fitTarget, map])

  return null
}
