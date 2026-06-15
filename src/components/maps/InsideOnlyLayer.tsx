import { CircleMarker } from 'react-leaflet'

interface Position {
  lat: number
  lng: number
}

interface Props {
  positions: Position[]
  pane?:     string
}

export default function InsideOnlyLayer({ positions, pane }: Props) {
  return (
    <>
      {positions.map((pos, i) => (
        <CircleMarker
          key={`io-${i}-${pos.lat}-${pos.lng}`}
          center={[pos.lat, pos.lng]}
          radius={5}
          pane={pane}
          pathOptions={{
            color:       '#10b981',  // emerald-500
            fillColor:   '#34d399',  // emerald-400
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
