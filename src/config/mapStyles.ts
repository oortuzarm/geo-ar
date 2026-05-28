export const MAP_STYLES = {
  streets: {
    id: 'streets' as const,
    label: 'Mapa',
    tile: 'streets-v4',
    ext: 'png',
  },
  satellite: {
    id: 'satellite' as const,
    label: 'Satélite',
    tile: 'hybrid',
    ext: 'jpg',
  },
  toner: {
    id: 'toner' as const,
    label: 'Toner',
    tile: 'toner-v2',
    ext: 'png',
  },
}

export type MapStyleId = keyof typeof MAP_STYLES

export function getMapTileUrl(styleId: MapStyleId): string {
  const s = MAP_STYLES[styleId]
  return `https://api.maptiler.com/maps/${s.tile}/{z}/{x}/{y}.${s.ext}?key=${import.meta.env.VITE_MAPTILER_KEY}`
}

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>'
