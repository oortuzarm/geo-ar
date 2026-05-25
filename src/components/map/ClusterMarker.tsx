import L from 'leaflet'
import { Marker } from 'react-leaflet'

interface ClusterMarkerProps {
  lat:     number
  lng:     number
  count:   number
  onClick: () => void
}

function buildClusterIcon(count: number): L.DivIcon {
  const size   = count < 10 ? 44 : count < 50 ? 53 : 62
  const half   = size / 2
  const label  = count < 100 ? String(count) : '99+'
  const fs     = count < 10 ? 16 : 15

  const html =
    `<div style="` +
    `width:${size}px;height:${size}px;` +
    `border-radius:50%;` +
    `background:rgba(10,18,36,0.93);` +
    `border:2.5px solid rgba(14,165,233,0.80);` +
    `box-shadow:0 2px 14px rgba(0,0,0,0.60),0 0 0 5px rgba(14,165,233,0.13);` +
    `display:flex;align-items:center;justify-content:center;` +
    `font-size:${fs}px;font-weight:700;` +
    `color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;` +
    `cursor:pointer;` +
    `">${label}</div>`

  return L.divIcon({
    className:  '',
    html,
    iconSize:   [size, size],
    iconAnchor: [half, half],
  })
}

export default function ClusterMarker({ lat, lng, count, onClick }: ClusterMarkerProps) {
  const icon = buildClusterIcon(count)
  return (
    <Marker
      position={[lat, lng]}
      icon={icon}
      zIndexOffset={500}
      eventHandlers={{ click: onClick }}
    />
  )
}
