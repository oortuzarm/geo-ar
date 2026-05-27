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
  activeNow:            number
  mostActivePoint:      LiveVisitPoint | null
  points:               LiveVisitPoint[]
  lastHourDeltaPercent: number | null
  peakToday:            string | null
}

export function fetchLiveVisits(projectId: string): Promise<LiveVisitsResponse> {
  return apiFetch<LiveVisitsResponse>(
    `${API_BASE}/api/geo_projects/${projectId}/live_visits`,
  )
}

export function sendHeartbeat(
  geoPointId: string,
  payload: { session_id: string; lat: number; lng: number; accuracy: number },
): Promise<void> {
  if (!API_BASE) return Promise.resolve()
  return apiFetch<void>(
    `${API_BASE}/api/public/geo_points/${geoPointId}/live_visit`,
    { method: 'POST', body: JSON.stringify(payload) },
  )
}
