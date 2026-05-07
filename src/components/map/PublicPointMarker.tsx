import { Marker, Circle } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { mapTheme } from './mapTheme'
import type { GeoPoint } from '../../types'

const { activationRadius: ar } = mapTheme

interface PublicPointMarkerProps {
  point:    GeoPoint
  selected: boolean
  /** true when another point is selected — dims this pin and its radius */
  dimmed:   boolean
  onClick:  () => void
}

/**
 * Read-only circular thumbnail pin for the public map.
 * Shares the same icon factory (createGeoIcon) and theme tokens (mapTheme)
 * as the editor's GeoPointMarker — single source of visual truth.
 */
export default function PublicPointMarker({
  point,
  selected,
  dimmed,
  onClick,
}: PublicPointMarkerProps) {
  const icon = createGeoIcon(selected, point.active, dimmed, point.image)

  const circleOptions = selected ? ar.selected : dimmed ? ar.dimmed : ar.default

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
