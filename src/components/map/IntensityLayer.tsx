import { Circle } from 'react-leaflet'
import { intensityFromCount } from '../../utils/liveVisits'
import type { GeoPoint } from '../../types'

export type IntensityLevel = 'low' | 'medium' | 'high'

export const INTENSITY_CIRCLE_STYLE: Record<IntensityLevel, { color: string; fillColor: string; fillOpacity: number }> = {
  low:    { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.18 },
  medium: { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.22 },
  high:   { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.28 },
}

interface Props {
  points:    GeoPoint[]
  activeNow: Record<string, number>  // pointId → live count; 0 = no visitors
}

export default function IntensityLayer({ points, activeNow }: Props) {
  return (
    <>
      {points.map((point) => {
        const level = intensityFromCount(activeNow[point.id] ?? 0)
        const style = INTENSITY_CIRCLE_STYLE[level]
        return (
          <Circle
            key={point.id}
            center={[point.latitude, point.longitude]}
            radius={Math.min(point.activationRadius, 1000)}
            pathOptions={{ ...style, weight: 1.5, opacity: 0.7, interactive: false }}
          />
        )
      })}
    </>
  )
}
