import { Marker, Circle } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { mapTheme } from './mapTheme'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import PolygonAreaLayer from './PolygonAreaLayer'
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
 * Read-only pin + activation-area for the public map.
 *
 * For radius-mode points: renders a Leaflet Circle (existing behaviour).
 * For polygon-mode points: renders the GeoJSON polygon via PolygonAreaLayer
 * using the same mapTheme colour tokens as the circle, so selected/dimmed
 * states look identical to their circular counterparts.
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
  const isPolygon = (point.activationMode ?? 'radius') === 'polygon'

  return (
    <>
      <Marker
        position={[point.latitude, point.longitude]}
        icon={icon}
        zIndexOffset={selected ? 1000 : 0}
        eventHandlers={{ click: onClick }}
      />

      {isPolygon ? (
        point.activationPolygon && (
          <PolygonAreaLayer
            polygon={point.activationPolygon}
            onClick={onClick}
            pathOptions={circleOptions}
          />
        )
      ) : (
        <Circle
          center={[point.latitude, point.longitude]}
          radius={point.activationRadius}
          pathOptions={circleOptions}
          eventHandlers={{ click: onClick }}
        />
      )}
    </>
  )
}
