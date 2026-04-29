import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import type { GeoPoint } from '../../types'

// Create custom marker icon using div (avoids broken Leaflet default icon issue with Vite)
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
}

export default function GeoPointMarker({ point, selected, onClick }: GeoPointMarkerProps) {
  const icon = createIcon(selected, point.active)

  return (
    <Marker
      position={[point.latitude, point.longitude]}
      icon={icon}
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
  )
}
