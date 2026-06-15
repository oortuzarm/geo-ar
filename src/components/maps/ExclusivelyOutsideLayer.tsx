import { CircleMarker } from 'react-leaflet'

interface Position {
  lat: number
  lng: number
}

interface Props {
  positions: Position[]
  pane?:     string
}

export default function ExclusivelyOutsideLayer({ positions, pane }: Props) {
  return (
    <>
      {positions.map((pos, i) => (
        <CircleMarker
          key={`eo-${i}-${pos.lat}-${pos.lng}`}
          center={[pos.lat, pos.lng]}
          radius={5}
          pane={pane}
          pathOptions={{
            color:       '#3b82f6',  // blue-500
            fillColor:   '#60a5fa',  // blue-400
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
