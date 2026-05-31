import { TileLayer } from 'react-leaflet'
import VectorTileLayer from './VectorTileLayer'
import { MAP_STYLES, type MapStyleId } from '../../config/mapStyles'

interface Props {
  styleId: MapStyleId
}

// Renders a vector (MapLibre GL) or raster (TileLayer) base map depending on the style.
// Use as a drop-in replacement for <TileLayer> in every MapContainer.
export default function BaseMapLayer({ styleId }: Props) {
  const style = MAP_STYLES[styleId]

  if (style.type === 'raster') {
    return (
      <TileLayer
        url={style.url}
        attribution={style.attribution}
        maxZoom={20}
      />
    )
  }

  return <VectorTileLayer styleUrl={style.styleUrl} />
}
