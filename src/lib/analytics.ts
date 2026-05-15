import { apiFetch } from './apiFetch'

const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// ── Session ID ─────────────────────────────────────────────────────────────

export function getAnalyticsSessionId(): string {
  const KEY = 'analytics:session_id'
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

// ── Deduplication ──────────────────────────────────────────────────────────

/** Returns true if the event was already fired today (and marks it if not). */
function alreadyFiredToday(key: string): boolean {
  if (localStorage.getItem(key)) return true
  localStorage.setItem(key, '1')
  return false
}

// In-memory cooldown for click events — resets on page reload.
// Prevents accidental double-taps (<500ms) but allows real repeated clicks.
const _lastClickAt = new Map<string, number>()
const CLICK_COOLDOWN_MS = 500

function isClickOnCooldown(key: string): boolean {
  const now  = Date.now()
  const last = _lastClickAt.get(key) ?? 0
  if (now - last < CLICK_COOLDOWN_MS) return true
  _lastClickAt.set(key, now)
  return false
}

// ── Internal POST ──────────────────────────────────────────────────────────
//
// Rails backend requirements for temporal + geographic analytics:
//
//   analytics_events columns to add:
//     - latitude  float, nullable
//     - longitude float, nullable
//     - country   string, nullable  ← filled by background reverse-geocoding job
//     - city      string, nullable
//     - commune   string, nullable
//     (created_at is standard Rails and already present)
//
//   New endpoints (GeoProjectsController or dedicated AnalyticsController):
//     GET /api/geo_projects/:id/analytics_by_hour
//       → { data: [{ hour: 0..23, count: number }] }
//     GET /api/geo_projects/:id/analytics_by_day
//       → { data: [{ day: 0..6, count: number }] }  (0 = Sunday, matches JS getDay())
//     GET /api/geo_projects/:id/analytics_geo
//       → { countries: GeoBucket[], cities: GeoBucket[], communes: GeoBucket[] }
//         where GeoBucket = { label: string, count: number, pct: number }
//
//   Reverse geocoding: on analytics_event create, enqueue a background job that
//   calls Nominatim (https://nominatim.openstreetmap.org/reverse) with the stored
//   lat/lng and writes country/city/commune back to the record.

function postEvent(
  eventType: string,
  projectId: string,
  pointId: string,
  location?: { latitude: number; longitude: number } | null,
): void {
  const url  = `${API_BASE}/api/analytics_events`
  const body = JSON.stringify({
    projectId,
    pointId,
    eventType,
    sessionId: getAnalyticsSessionId(),
    ...(location && { latitude: location.latitude, longitude: location.longitude }),
  })

  console.log(`[ANALYTICS_CLICK_SENT] eventType=${eventType} pointId=${pointId}`)

  // keepalive:true lets the request survive page navigation (critical for URL-type experiences
  // that call window.location.href immediately after firing this event).
  void fetch(url, {
    method:      'POST',
    credentials: 'include',
    keepalive:   true,
    headers:     { 'Content-Type': 'application/json' },
    body,
  })
    .then((res) => {
      console.log(`[ANALYTICS_CLICK_RESPONSE] eventType=${eventType} status=${res.status}`)
    })
    .catch(() => { /* analytics are non-critical — never throw */ })
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Fires once per (projectId, pointId, calendar day, browser).
 * Call on outside → inside radius transition.
 */
export function trackRadiusEnter(
  projectId: string,
  pointId: string,
  location?: { latitude: number; longitude: number } | null,
): void {
  const key = `analytics:radius_enter:${projectId}:${pointId}:${todayStr()}`
  if (alreadyFiredToday(key)) return
  postEvent('radius_enter', projectId, pointId, location)
}

/**
 * Fires on every real click — not deduplicated across time.
 * Only suppresses clicks within a 500ms window to prevent accidental double-taps.
 * Call when the user taps "Ir a experiencia" / custom button text.
 */
export function trackPointClick(projectId: string, pointId: string): void {
  const key = `${projectId}:${pointId}`
  console.log(`[ANALYTICS_CLICK_ATTEMPT] pointId=${pointId} t=${Date.now()}`)
  if (isClickOnCooldown(key)) {
    console.log(`[ANALYTICS_CLICK_ATTEMPT] blocked — within 500ms cooldown`)
    return
  }
  postEvent('point_click', projectId, pointId)
}

// ── Analytics fetch ────────────────────────────────────────────────────────

export interface ProjectAnalytics {
  radiusEntries: number
  clicks: number
  conversion: number
}

export interface PointAnalytics {
  pointId: string
  pointName: string
  radiusEntries: number
  clicks: number
  conversion: number
}

export interface HourBucket { hour: number; count: number }
export interface DayBucket  { day:  number; count: number }
export interface GeoBucket  { label: string; count: number; pct: number }
export interface GeoDistribution {
  countries: GeoBucket[]
  cities:    GeoBucket[]
  communes:  GeoBucket[]
}

export function fetchProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
  return apiFetch<ProjectAnalytics>(`${API_BASE}/api/geo_projects/${projectId}/analytics`)
}

export async function fetchProjectAnalyticsByPoint(projectId: string): Promise<PointAnalytics[]> {
  const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_point`)
  if (Array.isArray(data)) return data as PointAnalytics[]
  if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).points))
    return (data as { points: PointAnalytics[] }).points
  return []
}

export async function fetchProjectAnalyticsByHour(projectId: string): Promise<HourBucket[]> {
  try {
    const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_hour`)
    if (Array.isArray(data)) return data as HourBucket[]
    if (data && typeof data === 'object') {
      const d = (data as Record<string, unknown>).data
      if (Array.isArray(d)) return d as HourBucket[]
    }
  } catch { /* endpoint not yet available */ }
  return []
}

export async function fetchProjectAnalyticsByDay(projectId: string): Promise<DayBucket[]> {
  try {
    const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_day`)
    if (Array.isArray(data)) return data as DayBucket[]
    if (data && typeof data === 'object') {
      const d = (data as Record<string, unknown>).data
      if (Array.isArray(d)) return d as DayBucket[]
    }
  } catch { /* endpoint not yet available */ }
  return []
}

export async function fetchProjectGeoDistribution(projectId: string): Promise<GeoDistribution> {
  const empty: GeoDistribution = { countries: [], cities: [], communes: [] }
  try {
    const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_geo`)
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>
      return {
        countries: Array.isArray(d.countries) ? d.countries as GeoBucket[] : [],
        cities:    Array.isArray(d.cities)    ? d.cities    as GeoBucket[] : [],
        communes:  Array.isArray(d.communes)  ? d.communes  as GeoBucket[] : [],
      }
    }
  } catch { /* endpoint not yet available */ }
  return empty
}
