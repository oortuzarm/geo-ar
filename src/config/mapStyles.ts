export const MAP_STYLES = {
  streets: {
    id:          'streets' as const,
    label:       'Mapa',
    url:         'https://tiles.versatiles.org/colorful/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    id:          'satellite' as const,
    label:       'Satélite',
    url:         'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
  },
  toner: {
    id:          'toner' as const,
    label:       'Toner',
    url:         'https://tiles.versatiles.org/graybeard/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
}

export type MapStyleId = keyof typeof MAP_STYLES

export function getMapTileUrl(styleId: MapStyleId): string {
  return MAP_STYLES[styleId].url
}

// OSM attribution for fixed-style components (streets, toner)
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
