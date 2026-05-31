export const MAP_STYLES = {
  streets: {
    id:          'streets' as const,
    label:       'Mapa',
    type:        'vector' as const,
    styleUrl:    'https://vector.openstreetmap.org/styles/shortbread/colorful.json',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    id:          'satellite' as const,
    label:       'Satélite',
    type:        'raster' as const,
    url:         'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '&copy; Google',
  },
  toner: {
    id:          'toner' as const,
    label:       'Toner',
    type:        'vector' as const,
    styleUrl:    'https://vector.openstreetmap.org/styles/shortbread/graybeard.json',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
}

export type MapStyleId = keyof typeof MAP_STYLES

// OSM attribution for fixed-style components (streets, toner)
export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
