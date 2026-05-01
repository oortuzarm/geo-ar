import { useEffect, useRef, useState } from 'react'
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
  const [livePos, setLivePos] = useState<[number, number]>([point.latitude, point.longitude])
  const isDraggingRef = useRef(false)
  const icon = createIcon(selected, point.active)

  // Sync circle when coordinates change externally (form inputs, map click, address search)
  // but never fight an active drag
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLivePos([point.latitude, point.longitude])
    }
  }, [point.latitude, point.longitude])

  return (
    <>
      <Marker
        position={[point.latitude, point.longitude]}
        icon={icon}
        draggable
        eventHandlers={{
          click: () => onClick(point.id),
          dragstart: () => { isDraggingRef.current = true },
          drag: (e) => {
            const { lat, lng } = (e.target as L.Marker).getLatLng()
            setLivePos([lat, lng])
          },
          dragend: (e) => {
            const { lat, lng } = (e.target as L.Marker).getLatLng()
            isDraggingRef.current = false
            setLivePos([lat, lng])
            onDragEnd(point.id, lat, lng)
          },
        }}
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

      {selected && (
        <Circle
          center={livePos}
          radius={point.activationRadius}
          pathOptions={{
            color: '#0ea5e9',
            fillColor: '#0ea5e9',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '6 4',
          }}
        />
      )}
    </>
  )
}
