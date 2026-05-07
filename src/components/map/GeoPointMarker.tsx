import { useEffect, useRef } from 'react'
import { Circle, Marker, Popup } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { mapTheme } from './mapTheme'
import type { GeoPoint } from '../../types'

interface GeoPointMarkerProps {
  point: GeoPoint
  selected: boolean
  onClick: (id: string) => void
  onDragEnd: (id: string, lat: number, lng: number) => void
}

export default function GeoPointMarker({ point, selected, onClick, onDragEnd }: GeoPointMarkerProps) {
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

  const icon = createGeoIcon(selected, point.active, false, point.image)

  return (
    <>
      <Marker
        ref={markerRef}
        position={[point.latitude, point.longitude]}
        icon={icon}
        draggable
        eventHandlers={{ click: () => onClick(point.id) }}
      >
        <Popup>
          <div className="text-sm">
            <p className="font-semibold text-gray-100">{point.name}</p>
            {point.description && (
              <p className="text-gray-400 mt-1 text-xs">{point.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">Radio: {point.activationRadius} m</p>
          </div>
        </Popup>
      </Marker>

      {/* Circle is always mounted for active points so circleRef is populated during drag */}
      {point.active && (
        <Circle
          ref={circleRef}
          center={[point.latitude, point.longitude]}
          radius={point.activationRadius}
          pathOptions={selected ? {
            // Colors from theme; editor uses dashed + slightly tighter fill
            color:       mapTheme.activationRadius.selected.color,
            fillColor:   mapTheme.activationRadius.selected.fillColor,
            fillOpacity: 0.10,
            weight:      2,
            dashArray:   '6 4',
          } : {
            color:       mapTheme.activationRadius.default.color,
            fillColor:   mapTheme.activationRadius.default.fillColor,
            fillOpacity: 0.04,
            weight:      1,
            dashArray:   '4 4',
          }}
        />
      )}
    </>
  )
}
