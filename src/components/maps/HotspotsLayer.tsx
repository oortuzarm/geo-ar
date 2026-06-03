import { Circle } from 'react-leaflet'
import type { HotspotPoint } from '../../services/hotspotApi'

// Color ramp: blue (low) → green → yellow → red (very high)
function hotspotColor(intensity: number): string {
  if (intensity >= 0.75) return '#ef4444'  // red
  if (intensity >= 0.50) return '#eab308'  // yellow
  if (intensity >= 0.25) return '#22c55e'  // green
  return '#3b82f6'                          // blue
}

interface Props {
  hotspots: HotspotPoint[]
}

export default function HotspotsLayer({ hotspots }: Props) {
  return (
    <>
      {hotspots.map((hs, i) => {
        const color = hotspotColor(hs.intensity)
        return (
          <Circle
            key={`hs-${i}-${hs.lat}-${hs.lng}`}
            center={[hs.lat, hs.lng]}
            radius={hs.radiusMeters}
            pathOptions={{
              color,
              fillColor:   color,
              fillOpacity: 0.12 + hs.intensity * 0.53,
              weight:      1.5,
              opacity:     0.45 + hs.intensity * 0.45,
            }}
          />
        )
      })}
    </>
  )
}
