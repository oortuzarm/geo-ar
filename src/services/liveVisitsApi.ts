import { apiFetch } from '../lib/apiFetch'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

export interface LiveVisitPoint {
  id:           string
  name:         string
  lat:          number
  lng:          number
  radiusMeters: number
  activeNow:    number
}

export interface LiveVisitsResponse {
  activeNow:              number
  liveVisitsInsideAreas:  number
  liveVisitsOutsideAreas: number
  liveVisitsTotal:        number
  mostActivePoint:        LiveVisitPoint | null
  points:                 LiveVisitPoint[]
  lastHourDeltaPercent:   number | null
  peakToday:              { label: string; count: number } | null
}

export function fetchLiveVisits(projectId: string): Promise<LiveVisitsResponse> {
  return apiFetch<LiveVisitsResponse>(
    `${API_BASE}/api/geo_projects/${projectId}/live_visits`,
  )
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
  active_now?: number  // current active visitor count for this point
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
