import type { PoiSearchResult, MapBounds } from '../types'

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'

async function fromOverpass(query: string, bounds: MapBounds): Promise<PoiSearchResult[]> {
  const { north, south, east, west } = bounds
  // Escape quotes in query to avoid breaking the Overpass QL string
  const safeQuery = query.replace(/"/g, '')
  const body = [
    '[out:json][timeout:25];',
    '(',
    `  node["name"~"${safeQuery}",i](${south},${west},${north},${east});`,
    `  way["name"~"${safeQuery}",i](${south},${west},${north},${east});`,
    ');',
    'out center;',
  ].join('\n')

  const res = await fetch(OVERPASS_ENDPOINT, { method: 'POST', body })
  if (!res.ok) throw new Error(`overpass ${res.status}`)
  const data = await res.json()

  return (data.elements as any[]).map((el) => {
    const lat: number = el.type === 'way' ? el.center.lat : el.lat
    const lng: number = el.type === 'way' ? el.center.lon : el.lon
    const name: string = el.tags?.name ?? safeQuery
    const street = [el.tags?.['addr:street'], el.tags?.['addr:housenumber']]
      .filter(Boolean)
      .join(' ')
    return {
      id: `ov-${el.id}`,
      name,
      displayName: street ? `${name}, ${street}` : name,
      lat,
      lng,
      category: el.tags?.amenity ?? el.tags?.shop ?? el.tags?.leisure,
      source: 'overpass' as const,
    }
  })
}

async function fromNominatim(query: string, bounds: MapBounds): Promise<PoiSearchResult[]> {
  const { north, south, east, west } = bounds
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '20',
    bounded: '1',
    viewbox: `${west},${north},${east},${south}`,
  })
  const res = await fetch(`${NOMINATIM_ENDPOINT}?${params}`, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) throw new Error(`nominatim ${res.status}`)
  const data = await res.json()

  return (data as any[]).map((item) => ({
    id: `nm-${item.place_id}`,
    name: (item.display_name as string).split(',')[0].trim(),
    displayName: item.display_name as string,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    source: 'nominatim' as const,
  }))
}

export async function searchPOIs(query: string, bounds: MapBounds): Promise<PoiSearchResult[]> {
  try {
    const results = await fromOverpass(query, bounds)
    if (results.length > 0) return results
    // Overpass found nothing within bounds — try Nominatim
    return await fromNominatim(query, bounds)
  } catch {
    // Overpass unreachable or errored — fall back to Nominatim
    return await fromNominatim(query, bounds)
  }
}
