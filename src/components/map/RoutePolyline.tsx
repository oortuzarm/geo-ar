import { useEffect } from 'react'
import { Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'

interface RoutePolylineProps {
  latLngs: [number, number][]
  userLat: number
  userLng: number
}

/**
 * Draws the walking route on the map and fits bounds to show
 * the full route + user position when the route changes.
 */
export default function RoutePolyline({ latLngs, userLat, userLng }: RoutePolylineProps) {
  const map = useMap()

  useEffect(() => {
    if (latLngs.length === 0) return
    const bounds = L.latLngBounds([[userLat, userLng], ...latLngs])
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17, animate: true })
  }, [latLngs, userLat, userLng, map])

  return (
    <Polyline
      positions={latLngs}
      pathOptions={{
        color: '#3b82f6',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  )
}
