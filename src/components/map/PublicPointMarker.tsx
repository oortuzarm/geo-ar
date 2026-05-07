import { Marker, Circle } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import type { GeoPoint } from '../../types'

interface PublicPointMarkerProps {
  point: GeoPoint
  selected: boolean
  /** true when another point is selected — dims this pin */
  dimmed: boolean
  onClick: () => void
}

/**
 * Read-only teardrop pin for the public map.
 * Uses the same icon factory as the editor's GeoPointMarker.
 * Shows the activation-radius Circle only when selected.
 */
export default function PublicPointMarker({
  point,
  selected,
  dimmed,
  onClick,
}: PublicPointMarkerProps) {
  const icon = createGeoIcon(selected, point.active, dimmed)

  const circleOptions = selected
    ? { color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.18, weight: 3, opacity: 1 }
    : dimmed
      ? { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.03, weight: 1, opacity: 0.35 }
      : { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.07, weight: 1, opacity: 0.7 }

  return (
    <>
      <Marker
        position={[point.latitude, point.longitude]}
        icon={icon}
        eventHandlers={{ click: onClick }}
      />
      <Circle
        center={[point.latitude, point.longitude]}
        radius={point.activationRadius}
        pathOptions={circleOptions}
        eventHandlers={{ click: onClick }}
      />
    </>
  )
}
