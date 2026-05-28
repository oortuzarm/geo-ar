import { useEffect, useRef } from 'react'
import { Circle, Marker } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { mapTheme } from './mapTheme'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import type { GeoPoint } from '../../types'

interface GeoPointMarkerProps {
  point: GeoPoint
  selected: boolean
  onClick: (id: string) => void
  onDragEnd: (id: string, lat: number, lng: number) => void
  /** Reduce marker icon to ~30% opacity — used when intensity GPS is active */
  dimmed?: boolean
  /** Hide marker icon completely — does NOT affect the activation radius circle */
  hidden?: boolean
}

export default function GeoPointMarker({
  point, selected, onClick, onDragEnd,
  dimmed = false, hidden = false,
}: GeoPointMarkerProps) {
  const markerRef  = useRef<L.Marker | null>(null)
  const circleRef  = useRef<L.Circle | null>(null)
  const isDragging = useRef(false)

  // Keep fresh references inside stable Leaflet event handlers
  const onDragEndRef = useRef(onDragEnd)
  onDragEndRef.current = onDragEnd
  const pointIdRef = useRef(point.id)
  pointIdRef.current = point.id

  // Sync circle when the point moves externally (form inputs, map click, address search)
  // but never interfere with an active drag — Leaflet already owns the DOM during drag
  useEffect(() => {
    if (!isDragging.current) {
      circleRef.current?.setLatLng([point.latitude, point.longitude])
    }
  }, [point.latitude, point.longitude])

  // Attach drag events directly to the Leaflet marker instance.
  // Using native Leaflet .on() avoids the react-leaflet eventHandlers batching/re-attachment
  // cycle that can miss high-frequency drag events.
  useEffect(() => {
    const m = markerRef.current
    if (!m) return

    const onDragStart = () => { isDragging.current = true }

    const onDrag = () => {
      // Move the circle imperatively — zero React renders, 60 fps
      circleRef.current?.setLatLng(m.getLatLng())
    }

    const onDragEnd = () => {
      isDragging.current = false
      const { lat, lng } = m.getLatLng()
      // Finalise: persist new coords and sync circle to authoritative position
      circleRef.current?.setLatLng([lat, lng])
      onDragEndRef.current(pointIdRef.current, lat, lng)
    }

    m.on('dragstart', onDragStart)
    m.on('drag',      onDrag)
    m.on('dragend',   onDragEnd)

    return () => {
      m.off('dragstart', onDragStart)
      m.off('drag',      onDrag)
      m.off('dragend',   onDragEnd)
    }
  }, []) // stable: same Leaflet instance lives as long as this component (keyed by point.id)

  // Smooth marker icon opacity — direct DOM manipulation so CSS transitions apply.
  // hidden > dimmed > normal. The Circle (radius) is intentionally unaffected.
  useEffect(() => {
    const el = markerRef.current?.getElement()
    if (!el) return
    el.style.transition = 'opacity 0.35s ease'
    el.style.opacity    = hidden ? '0' : dimmed ? '0.3' : '1'
  }, [dimmed, hidden])

  const icon = createGeoIcon(selected, point.active, false, getPointCoverImage(point))

  return (
    <>
      <Marker
        ref={markerRef}
        position={[point.latitude, point.longitude]}
        icon={icon}
        draggable
        zIndexOffset={selected ? 1000 : 0}
        eventHandlers={{ click: () => onClick(point.id) }}
      />

      {/* Circle is always mounted for active points so circleRef is populated during drag.
          Its opacity is driven only by `dimmed` — `hidden` never affects it. */}
      {point.active && (
        <Circle
          ref={circleRef}
          center={[point.latitude, point.longitude]}
          radius={point.activationRadius}
          pathOptions={selected ? {
            color:       mapTheme.activationRadius.selected.color,
            fillColor:   mapTheme.activationRadius.selected.fillColor,
            fillOpacity: dimmed ? 0.03 : 0.10,
            opacity:     dimmed ? 0.15 : 1,
            weight:      dimmed ? 0.5 : 2,
            dashArray:   '6 4',
          } : {
            color:       mapTheme.activationRadius.default.color,
            fillColor:   mapTheme.activationRadius.default.fillColor,
            fillOpacity: dimmed ? 0.01 : 0.04,
            opacity:     dimmed ? 0.10 : 1,
            weight:      dimmed ? 0.5 : 1,
            dashArray:   '4 4',
          }}
        />
      )}
    </>
  )
}
