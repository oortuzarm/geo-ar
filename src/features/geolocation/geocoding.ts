import type { NominatimResult } from '../../types'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

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
