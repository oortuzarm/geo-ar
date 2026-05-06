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

// ── Internal POST ──────────────────────────────────────────────────────────

function postEvent(eventType: string, projectId: string, pointId: string): void {
  void apiFetch<void>(`${API_BASE}/api/analytics_events`, {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      pointId,
      eventType,
      sessionId: getAnalyticsSessionId(),
    }),
  }).catch(() => { /* analytics are non-critical — never throw */ })
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Fires once per (projectId, pointId, calendar day, browser).
 * Call on outside → inside radius transition.
 */
export function trackRadiusEnter(projectId: string, pointId: string): void {
  const key = `analytics:radius_enter:${projectId}:${pointId}:${todayStr()}`
  if (alreadyFiredToday(key)) return
  postEvent('radius_enter', projectId, pointId)
}

/**
 * Fires once per (projectId, pointId, calendar day, browser).
 * Call when the user taps "Ir a experiencia" / custom button text.
 */
export function trackPointClick(projectId: string, pointId: string): void {
  const key = `analytics:point_click:${projectId}:${pointId}:${todayStr()}`
  if (alreadyFiredToday(key)) return
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

export function fetchProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
  return apiFetch<ProjectAnalytics>(`${API_BASE}/api/geo_projects/${projectId}/analytics`)
}

export function fetchProjectAnalyticsByPoint(projectId: string): Promise<PointAnalytics[]> {
  return apiFetch<PointAnalytics[]>(`${API_BASE}/api/geo_projects/${projectId}/analytics_by_point`)
}
