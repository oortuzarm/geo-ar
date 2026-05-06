import type { NominatimResult } from '../../types'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'

interface NominatimReverseResult {
  display_name: string
  address?: {
    road?: string
    house_number?: string
    suburb?: string
    neighbourhood?: string
    city_district?: string
    town?: string
    city?: string
    [key: string]: string | undefined
  }
}

/** Returns a short human-readable address for the given coordinates, e.g. "Av. La Dehesa 1670, Lo Barnechea" */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
  })
  const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) throw new Error('Reverse geocoding failed')
  const data = await res.json() as NominatimReverseResult

  const a = data.address ?? {}
  const street = [a.road, a.house_number].filter(Boolean).join(' ')
  const area   = a.suburb ?? a.neighbourhood ?? a.city_district ?? a.town ?? a.city
  const parts  = [street, area].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : data.display_name
}

export async function searchAddress(query: string): Promise<NominatimResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '5',
    addressdetails: '1',
  })

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { 'Accept-Language': 'es' },
  })

  if (!res.ok) throw new Error('Error al buscar dirección')
  return res.json() as Promise<NominatimResult[]>
}
