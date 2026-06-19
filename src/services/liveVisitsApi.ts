import { apiFetch } from '../lib/apiFetch'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

export interface LiveVisitPoint {
  id:                   string
  name:                 string
  lat:                  number
  lng:                  number
  radiusMeters:         number
  activeNow:            number
  lastHourDeltaPercent: number | null
  peakToday:            { label: string; count: number } | null
}

export interface LiveVisitsResponse {
  activeNow:               number
  liveVisitsInsideAreas:   number
  liveVisitsOutsideAreas:  number
  liveVisitsMixed:         number
  liveVisitsTotal:         number
  periodPeopleInsideAreas:  number
  periodPeopleOutsideAreas: number
  periodPeopleMixed:        number
  periodPeopleTotal:        number
  mostActivePoint:         LiveVisitPoint | null
  points:                  LiveVisitPoint[]
  lastHourDeltaPercent:    number | null
  peakToday:               { label: string; count: number } | null
}

export function fetchLiveVisits(
  projectId: string,
  params?: { from?: string; to?: string },
): Promise<LiveVisitsResponse> {
  const url = new URL(`${API_BASE}/api/geo_projects/${projectId}/live_visits`)
  if (params?.from) url.searchParams.set('from', params.from)
  if (params?.to)   url.searchParams.set('to',   params.to)
  return apiFetch<LiveVisitsResponse>(url.toString())
}

export interface ExclusivelyOutsideResponse {
  positions: { lat: number; lng: number }[]
}

export function fetchInsideOnlySessions(
  projectId: string,
  params?: { from?: string; to?: string },
): Promise<ExclusivelyOutsideResponse> {
  const url = new URL(`${API_BASE}/api/geo_projects/${projectId}/inside_only_sessions`)
  if (params?.from) url.searchParams.set('from', params.from)
  if (params?.to)   url.searchParams.set('to',   params.to)
  return apiFetch<ExclusivelyOutsideResponse>(url.toString())
}

export function fetchLiveInsidePositions(projectId: string): Promise<ExclusivelyOutsideResponse> {
  return apiFetch<ExclusivelyOutsideResponse>(
    `${API_BASE}/api/geo_projects/${projectId}/live_inside_positions`,
  )
}

export function fetchLiveMixedPositions(projectId: string): Promise<ExclusivelyOutsideResponse> {
  return apiFetch<ExclusivelyOutsideResponse>(
    `${API_BASE}/api/geo_projects/${projectId}/live_mixed_positions`,
  )
}

export function fetchLiveOutsidePositions(projectId: string): Promise<ExclusivelyOutsideResponse> {
  return apiFetch<ExclusivelyOutsideResponse>(
    `${API_BASE}/api/geo_projects/${projectId}/live_outside_positions`,
  )
}

export function fetchOutsideSessions(
  projectId: string,
  params?: { from?: string; to?: string },
): Promise<ExclusivelyOutsideResponse> {
  const url = new URL(`${API_BASE}/api/geo_projects/${projectId}/outside_sessions`)
  if (params?.from) url.searchParams.set('from', params.from)
  if (params?.to)   url.searchParams.set('to',   params.to)
  return apiFetch<ExclusivelyOutsideResponse>(url.toString())
}

export interface HistoricalIntensityPoint {
  pointId: string   // geo_point UUID — serialized as pointId by the Rails API
  id?:     string   // fallback in case older API versions use id
  name:    string
  count:   number   // radius_enter events in the period
}

export interface HistoricalIntensityResponse {
  period: string  // e.g. "7d"
  points: HistoricalIntensityPoint[]
}

export function fetchHistoricalIntensity(projectId: string): Promise<HistoricalIntensityResponse> {
  return apiFetch<HistoricalIntensityResponse>(
    `${API_BASE}/api/geo_projects/${projectId}/historical_intensity`,
  )
}

export interface HeartbeatResponse {
  active_now?:     number   // current active visitor count for this point
  insideRadius?:   boolean  // backend's determination of whether user is inside the area
  distanceMeters?: number   // distance to point centre in metres
}

export function sendHeartbeat(
  geoPointId: string,
  payload: { session_id: string; lat: number; lng: number; accuracy: number },
): Promise<HeartbeatResponse> {
  if (!API_BASE) return Promise.resolve({})
  return apiFetch<HeartbeatResponse>(
    `${API_BASE}/api/public/geo_points/${geoPointId}/live_visit`,
    { method: 'POST', body: JSON.stringify(payload) },
  ).catch(() => ({}))
}

// Project-level heartbeat — records GPS presence regardless of area membership.
// Used by the backend to feed "Actividad Fuera de Áreas" analytics.
export function sendProjectHeartbeat(
  projectId: string,
  payload: { session_id: string; lat: number; lng: number; accuracy: number },
): Promise<void> {
  if (!API_BASE) return Promise.resolve()
  return apiFetch<void>(
    `${API_BASE}/api/public/geo_projects/${projectId}/live_location`,
    { method: 'POST', body: JSON.stringify(payload) },
  ).catch(() => {})
}
