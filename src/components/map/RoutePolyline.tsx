import { Polyline } from 'react-leaflet'

interface RoutePolylineProps {
  latLngs: [number, number][]
}

/** Draws the walking route polyline. fitBounds is handled by MapController. */
export default function RoutePolyline({ latLngs }: RoutePolylineProps) {
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
