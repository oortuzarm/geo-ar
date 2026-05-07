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

  return (
    <>
      <Marker
        position={[point.latitude, point.longitude]}
        icon={icon}
        eventHandlers={{ click: onClick }}
      />

      {selected && (
        <Circle
          center={[point.latitude, point.longitude]}
          radius={point.activationRadius}
          pathOptions={{
            color:       '#0ea5e9',
            fillColor:   '#0ea5e9',
            fillOpacity: 0.18,
            weight:      3,
          }}
        />
      )}
    </>
  )
}
