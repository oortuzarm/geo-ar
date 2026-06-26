import { searchAddressChile } from '../features/geolocation/chileAddressSearch'
import type { PoiSearchResult, MapBounds, NominatimResult } from '../types'

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'

// ── Address-vs-POI classifier ─────────────────────────────────────────────────

/**
 * Returns true when the query looks like a street address rather than a
 * place name or brand. Address signals: dotted abbreviations (Av., Pdte.),
 * Chilean dot-thousands numbers (17.000), 5-6 digit house numbers, a comma
 * combined with a street number, or a known street-type word next to a number.
 */
export function looksLikeAddress(rawQuery: string): boolean {
  const q = rawQuery.trim()

  // Unambiguous: Chilean dot-thousands notation in a number → address
  if (/\b\d{1,2}\.\d{3}\b/.test(q)) return true

  // Unambiguous: dotted abbreviation typical of street addresses
  if (/\b(av\.|pdte\.|gral\.|pres\.|pje\.)\s/i.test(q)) return true

  // Unambiguous: 5-6 digit house numbers (common on Chilean major roads)
  if (/\b\d{5,6}\b/.test(q)) return true

  // Comma-separated location with a 3-6 digit street number → address
  if (q.includes(',') && /\b\d{3,6}\b/.test(q)) return true

  // Known street-type prefix + 3-6 digit number → address
  const hasPrefix = /\b(av|avenida|calle|pasaje|pje|camino|ruta|autopista|panamericana|presidente|pdte|pres|circunvalaci[oó]n|longitudinal)\s/i.test(q)
  const hasNum = /\b\d{3,6}\b/.test(q)
  if (hasPrefix && hasNum) return true

  return false
}

// ── NominatimResult → PoiSearchResult ────────────────────────────────────────

function nominatimToPoiResults(results: NominatimResult[]): PoiSearchResult[] {
  return results.map(r => ({
    id: `addr-${r.place_id}`,
    name: r.display_name.split(',')[0].trim(),
    displayName: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    source: 'nominatim' as const,
  }))
}

// ── Overpass rate-limit protection ────────────────────────────────────────────

let overpassCooldownUntil = 0
const OVERPASS_TIMEOUT_MS = 8_000
const OVERPASS_COOLDOWN_MS = 60_000  // 1 min cooldown after 429

async function fromOverpass(query: string, bounds: MapBounds): Promise<PoiSearchResult[]> {
  if (Date.now() < overpassCooldownUntil) {
    throw new Error('overpass-cooldown')
  }

  const { north, south, east, west } = bounds
  const safeQuery = query.replace(/"/g, '')
  const body = [
    '[out:json][timeout:25];',
    '(',
    `  node["name"~"${safeQuery}",i](${south},${west},${north},${east});`,
    `  way["name"~"${safeQuery}",i](${south},${west},${north},${east});`,
    ');',
    'out center;',
  ].join('\n')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS)

  try {
    const res = await fetch(OVERPASS_ENDPOINT, { method: 'POST', body, signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.status === 429) {
      overpassCooldownUntil = Date.now() + OVERPASS_COOLDOWN_MS
      if (import.meta.env.DEV) console.warn('[MapSearch] Overpass 429 — cooling down for 60 s')
      throw new Error('overpass-429')
    }
    if (!res.ok) throw new Error(`overpass-${res.status}`)

    const data = await res.json()
    return (data.elements as any[]).map((el) => {
      const lat: number = el.type === 'way' ? el.center.lat : el.lat
      const lng: number = el.type === 'way' ? el.center.lon : el.lon
      const name: string = el.tags?.name ?? safeQuery
      const street = [el.tags?.['addr:street'], el.tags?.['addr:housenumber']].filter(Boolean).join(' ')
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
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

// ── Nominatim fallback (bounded, for POI) ────────────────────────────────────

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

// ── POI session cache ─────────────────────────────────────────────────────────

const MAX_POI_CACHE_SIZE = 30
const poiCache = new Map<string, PoiSearchResult[]>()

function poiCacheKey(query: string, bounds: MapBounds): string {
  // Round to 1 decimal degree (~11 km) so nearby viewport changes reuse the cache
  const r = (n: number) => Math.round(n * 10) / 10
  return `${query.trim().toLowerCase()}|${r(bounds.north)},${r(bounds.south)},${r(bounds.east)},${r(bounds.west)}`
}

function getCachedPoi(key: string): PoiSearchResult[] | undefined {
  return poiCache.get(key)
}

function cachePoi(key: string, results: PoiSearchResult[]): void {
  if (poiCache.size >= MAX_POI_CACHE_SIZE) {
    const first = poiCache.keys().next().value
    if (first !== undefined) poiCache.delete(first)
  }
  poiCache.set(key, results)
}

// ── POI search: Overpass primary, Nominatim fallback ─────────────────────────

export async function searchPOIs(query: string, bounds: MapBounds): Promise<PoiSearchResult[]> {
  const key = poiCacheKey(query, bounds)
  const cached = getCachedPoi(key)
  if (cached) {
    if (import.meta.env.DEV) console.log('[MapSearch] POI cache hit:', query)
    return cached
  }

  let results: PoiSearchResult[]
  try {
    results = await fromOverpass(query, bounds)
    if (results.length > 0) {
      if (import.meta.env.DEV) console.log('[MapSearch] POI source: Overpass →', results.length, 'results')
      cachePoi(key, results)
      return results
    }
    if (import.meta.env.DEV) console.log('[MapSearch] Overpass empty, falling back to Nominatim')
    results = await fromNominatim(query, bounds)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (import.meta.env.DEV) console.warn('[MapSearch] Overpass failed:', msg, '— using Nominatim fallback')
    results = await fromNominatim(query, bounds)
  }

  if (import.meta.env.DEV) console.log('[MapSearch] POI source: Nominatim →', results.length, 'results')
  if (results.length > 0) cachePoi(key, results)
  return results
}

// ── Main dispatcher ───────────────────────────────────────────────────────────

/**
 * Unified search for both addresses and POIs/brands.
 *
 * - Address queries (Av., Pdte., street numbers, etc.) → geocoder only, no Overpass.
 * - POI/brand queries (Salcobrand, Copec, etc.) → Overpass + Nominatim fallback.
 */
export async function searchMapQuery(
  query: string,
  bounds: MapBounds | null,
): Promise<PoiSearchResult[]> {
  const isAddress = looksLikeAddress(query)

  if (import.meta.env.DEV) {
    console.log(`[MapSearch] query="${query}" → type=${isAddress ? 'address (geocoder)' : 'poi (Overpass)'}`)
  }

  if (isAddress) {
    const results = await searchAddressChile(query)
    return nominatimToPoiResults(results)
  }

  if (!bounds) {
    if (import.meta.env.DEV) console.warn('[MapSearch] POI search skipped: no map bounds')
    return []
  }

  return searchPOIs(query, bounds)
}
