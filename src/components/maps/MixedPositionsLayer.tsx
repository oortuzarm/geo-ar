import { CircleMarker } from 'react-leaflet'

interface Position {
  lat: number
  lng: number
}

interface Props {
  positions: Position[]
  pane?:     string
}

export default function MixedPositionsLayer({ positions, pane }: Props) {
  return (
    <>
      {positions.map((pos, i) => (
        <CircleMarker
          key={`mp-${i}-${pos.lat}-${pos.lng}`}
          center={[pos.lat, pos.lng]}
          radius={5}
          pane={pane}
          pathOptions={{
            color:       '#8b5cf6',  // violet-500
            fillColor:   '#a78bfa',  // violet-400
            fillOpacity: 0.80,
            weight:      1.5,
            opacity:     0.90,
            interactive: false,
          }}
        />
      ))}
    </>
  )
}
