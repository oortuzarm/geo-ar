import { Marker, Circle } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { mapTheme } from './mapTheme'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import type { GeoPoint } from '../../types'

const { activationRadius: ar } = mapTheme

interface PublicPointMarkerProps {
  point:    GeoPoint
  selected: boolean
  /** true when another point is selected — dims this pin and its radius */
  dimmed:   boolean
  onClick:  () => void
  /** true → use compact 48×38 px icon variant (public clustered map) */
  small?:   boolean
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
  small = false,
}: PublicPointMarkerProps) {
  const icon = createGeoIcon(selected, point.active, dimmed, getPointCoverImage(point), small)

  const circleOptions = selected ? ar.selected : dimmed ? ar.dimmed : ar.default

  return (
    <>
      <Marker
        position={[point.latitude, point.longitude]}
        icon={icon}
        zIndexOffset={selected ? 1000 : 0}
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
