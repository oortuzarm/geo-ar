import { apiFetch } from '../lib/apiFetch'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HotspotPoint {
  lat:          number
  lng:          number
  count:        number
  intensity:    number  // 0.0 – 1.0
  radiusMeters: number
}

export interface HotspotsData {
  locationId:   string
  locationName: string
  mode:         'historical' | 'live'
  hotspots:     HotspotPoint[]
  meta: {
    totalPoints:    number
    filteredPoints: number
  }
}

export interface HotspotsResponse {
  data: HotspotsData
}

export interface FetchHotspotsParams {
  locationId: string
  mode:       'live' | 'historical'
  startDate?: string  // YYYY-MM-DD, only for historical
  endDate?:   string  // YYYY-MM-DD, only for historical
}

export interface FetchOutsideAreasParams {
  projectId:  string
  mode:       'live' | 'historical'
  startDate?: string  // YYYY-MM-DD, only for historical
  endDate?:   string  // YYYY-MM-DD, only for historical
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function fetchHotspots(params: FetchHotspotsParams): Promise<HotspotsResponse> {
  const qs = new URLSearchParams({ location_id: params.locationId, mode: params.mode })
  if (params.mode === 'historical') {
    if (params.startDate) qs.set('start_date', params.startDate)
    if (params.endDate)   qs.set('end_date',   params.endDate)
  }
  return apiFetch<HotspotsResponse>(`${API_BASE}/api/analytics/hotspots?${qs}`)
}

// Returns GPS clusters that fall outside all configured GeoPoints for the project.
// Reuses the same /api/analytics/hotspots endpoint with project_id + outside_areas=true.
export function fetchOutsideAreasHotspots(params: FetchOutsideAreasParams): Promise<HotspotsResponse> {
  const qs = new URLSearchParams({
    project_id:    params.projectId,
    mode:          params.mode,
    outside_areas: 'true',
  })
  if (params.mode === 'historical') {
    if (params.startDate) qs.set('start_date', params.startDate)
    if (params.endDate)   qs.set('end_date',   params.endDate)
  }
  return apiFetch<HotspotsResponse>(`${API_BASE}/api/analytics/hotspots?${qs}`)
}
