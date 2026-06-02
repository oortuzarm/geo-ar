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
// Rails backend requirements for temporal analytics:
//
//   analytics_events columns to add:
//     - latitude  float, nullable
//     - longitude float, nullable
//     (created_at is standard Rails and already present)
//
//   New endpoints (GeoProjectsController or dedicated AnalyticsController):
//     GET /api/geo_projects/:id/analytics_by_hour
//       → { data: [{ hour: 0..23, count: number }] }
//     GET /api/geo_projects/:id/analytics_by_day
//       → { data: [{ day: 0..6, count: number }] }  (0 = Sunday, matches JS getDay())

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

/** Fires once per (projectId, pointId, calendar day, browser). Call when dwell timer starts. */
export function trackDwellStarted(
  projectId: string,
  pointId: string,
  location?: { latitude: number; longitude: number } | null,
): void {
  const key = `analytics:dwell_started:${projectId}:${pointId}:${todayStr()}`
  if (alreadyFiredToday(key)) return
  postEvent('dwell_started', projectId, pointId, location)
}

/** Fires once per (projectId, pointId, calendar day, browser). Call when dwell timer completes. */
export function trackDwellCompleted(
  projectId: string,
  pointId: string,
  location?: { latitude: number; longitude: number } | null,
): void {
  const key = `analytics:dwell_completed:${projectId}:${pointId}:${todayStr()}`
  if (alreadyFiredToday(key)) return
  postEvent('dwell_completed', projectId, pointId, location)
}

/** Fires every time the user exits the area before completing dwell. Not deduplicated. */
export function trackDwellCancelled(projectId: string, pointId: string): void {
  postEvent('dwell_cancelled', projectId, pointId)
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

export interface PeriodParams {
  from?: string  // YYYY-MM-DD
  to?:   string  // YYYY-MM-DD
}

function buildQS(pairs: Record<string, string | undefined>): string {
  const parts = Object.entries(pairs)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
  return parts.length > 0 ? `?${parts.join('&')}` : ''
}

export function fetchProjectAnalytics(
  projectId: string,
  params?: PeriodParams,
): Promise<ProjectAnalytics> {
  const qs = buildQS({ from: params?.from, to: params?.to })
  return apiFetch<ProjectAnalytics>(`${API_BASE}/api/geo_projects/${projectId}/analytics${qs}`)
}

export async function fetchProjectAnalyticsByPoint(
  projectId: string,
  params?: PeriodParams,
): Promise<PointAnalytics[]> {
  const qs   = buildQS({ from: params?.from, to: params?.to })
  const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_point${qs}`)
  if (Array.isArray(data)) return data as PointAnalytics[]
  if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).points))
    return (data as { points: PointAnalytics[] }).points
  return []
}

export async function fetchProjectAnalyticsByHour(
  projectId: string,
  pointId?: string,
  params?: PeriodParams,
): Promise<HourBucket[]> {
  try {
    const qs   = buildQS({ point_id: pointId, from: params?.from, to: params?.to })
    const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_hour${qs}`)
    if (Array.isArray(data)) return data as HourBucket[]
    if (data && typeof data === 'object') {
      const d = (data as Record<string, unknown>).data
      if (Array.isArray(d)) return d as HourBucket[]
    }
  } catch { /* silently handle unavailable endpoint */ }
  return []
}

export async function fetchProjectAnalyticsByDay(
  projectId: string,
  pointId?: string,
  params?: PeriodParams,
): Promise<DayBucket[]> {
  try {
    const qs   = buildQS({ point_id: pointId, from: params?.from, to: params?.to })
    const data = await apiFetch<unknown>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_day${qs}`)
    if (Array.isArray(data)) return data as DayBucket[]
    if (data && typeof data === 'object') {
      const d = (data as Record<string, unknown>).data
      if (Array.isArray(d)) return d as DayBucket[]
    }
  } catch { /* silently handle unavailable endpoint */ }
  return []
}

