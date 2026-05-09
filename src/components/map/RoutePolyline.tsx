import { Polyline } from 'react-leaflet'

interface RoutePolylineProps {
  latLngs: [number, number][]
  navMode?: boolean
}

/** Draws the walking route polyline. In navMode renders a glow + main layer. */
export default function RoutePolyline({ latLngs, navMode }: RoutePolylineProps) {
  if (navMode) {
    return (
      <>
        {/* Glow / halo layer */}
        <Polyline
          positions={latLngs}
          pathOptions={{
            color: '#1d4ed8',
            weight: 18,
            opacity: 0.22,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
        {/* Main route line */}
        <Polyline
          positions={latLngs}
          pathOptions={{
            color: '#3b82f6',
            weight: 8,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      </>
    )
  }

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
