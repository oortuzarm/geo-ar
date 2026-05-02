import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { Circle, Marker, Popup } from 'react-leaflet'
import type { GeoPoint } from '../../types'

function createIcon(selected: boolean, active: boolean) {
  const color = !active ? '#6b7280' : selected ? '#0ea5e9' : '#ef4444'
  const ring = selected ? 'box-shadow: 0 0 0 3px rgba(14,165,233,0.5);' : ''
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 28px; height: 28px;
      background: ${color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid rgba(255,255,255,0.8);
      ${ring}
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  })
}

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

  const icon = createIcon(selected, point.active)

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
            color: '#0ea5e9',
            fillColor: '#0ea5e9',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '6 4',
          } : {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.04,
            weight: 1,
            dashArray: '4 4',
          }}
        />
      )}
    </>
  )
}
