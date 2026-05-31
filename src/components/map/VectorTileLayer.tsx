import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@maplibre/maplibre-gl-leaflet'

interface Props {
  styleUrl: string
}

// Mounts a MapLibre GL base layer inside the existing Leaflet MapContainer.
// All Leaflet overlays (markers, circles, polylines, clusters) remain on top.
// Attribution is read automatically from the style JSON source metadata.
export default function VectorTileLayer({ styleUrl }: Props) {
  const map      = useMap()
  const layerRef = useRef<L.MaplibreGL | null>(null)

  useEffect(() => {
    const layer = L.maplibreGL({ style: styleUrl })
    layer.addTo(map)
    layerRef.current = layer

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
    }
  }, [map, styleUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
