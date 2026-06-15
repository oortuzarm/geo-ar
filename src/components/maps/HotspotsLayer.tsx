import { Circle } from 'react-leaflet'
import type { HotspotPoint } from '../../services/hotspotApi'

// 'hot'  = warm ramp (Zonas Calientes):   orange → green → yellow → red
// 'cold' = violet ramp (Dentro y Fuera): violet-300 → violet-400 → violet-500 → violet-700
function hotspotColor(intensity: number, variant: 'hot' | 'cold'): string {
  if (variant === 'cold') {
    if (intensity >= 0.75) return '#6d28d9'  // violet-700
    if (intensity >= 0.50) return '#8b5cf6'  // violet-500
    if (intensity >= 0.25) return '#a78bfa'  // violet-400
    return '#c4b5fd'                          // violet-300
  }
  if (intensity >= 0.75) return '#ef4444'   // red-500
  if (intensity >= 0.50) return '#eab308'   // yellow-500
  if (intensity >= 0.25) return '#22c55e'   // green-500
  return '#f97316'                           // orange-500
}

interface Props {
  hotspots: HotspotPoint[]
  pane?:    string
  variant?: 'hot' | 'cold'
}

export default function HotspotsLayer({ hotspots, pane, variant = 'hot' }: Props) {
  return (
    <>
      {hotspots.map((hs, i) => {
        const color = hotspotColor(hs.intensity, variant)
        return (
          <Circle
            key={`hs-${i}-${hs.lat}-${hs.lng}`}
            center={[hs.lat, hs.lng]}
            radius={hs.radiusMeters}
            pane={pane}
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
