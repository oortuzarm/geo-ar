import { apiFetch } from '../lib/apiFetch'
import { normalizeGeoPoint } from '../lib/normalizeGeoPoint'
import type { GeoProject, GeoPoint } from '../types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export interface TemporaryPreviewCreated {
  token:     string
  publicUrl: string
  expiresAt: string
  // Defensive fallbacks — in case an older response uses snake_case keys
  public_url?:  string
  expires_at?:  string
}

export interface TemporaryPreviewFetched {
  project:   GeoProject
  geoPoints: GeoPoint[]
  expiresAt: string
  // Defensive fallbacks
  points?:     GeoPoint[]
  expires_at?: string
}

export function createTemporaryPreview(
  project: GeoProject,
  points: GeoPoint[],
): Promise<TemporaryPreviewCreated> {
  return apiFetch<TemporaryPreviewCreated>(`${BASE}/api/temporary_previews`, {
    method: 'POST',
    body: JSON.stringify({ project, points }),
  })
}

export async function fetchTemporaryPreview(token: string): Promise<TemporaryPreviewFetched> {
  // Append a per-call timestamp so every request is a cache miss at every layer:
  // browser disk cache, CDN, and any server-side HTTP cache. Without this,
  // a browser refresh of the same URL can return stale data even with
  // cache: 'no-store', because that flag only controls the browser's own cache.
  const raw = await apiFetch<Record<string, unknown>>(
    `${BASE}/api/temporary_previews/${token}?_cb=${Date.now()}`,
    { cache: 'no-store' },
  )

  // Normalize raw point objects so camelCase fields (requiresDwellTime, dwellTimeSeconds)
  // are always populated regardless of whether the backend serialises in snake_case.
  const rawPoints = (
    (raw.geoPoints ?? raw.geo_points ?? raw.points) as Record<string, unknown>[] | undefined
  ) ?? []
  const geoPoints = rawPoints.map(normalizeGeoPoint)

  console.log('[DwellDebug] fetchTemporaryPreview — first point dwell fields:',
    geoPoints[0]
      ? { id: geoPoints[0].id, requiresDwellTime: geoPoints[0].requiresDwellTime, dwellTimeSeconds: geoPoints[0].dwellTimeSeconds }
      : '(no points)')

  return {
    ...(raw as object),
    project:   raw.project   as GeoProject,
    geoPoints,
    expiresAt: (raw.expiresAt ?? raw.expires_at) as string,
  } as TemporaryPreviewFetched
}

export interface ClaimResult {
  projectId:    string
  redirectUrl:  string
  redirect_url?: string // snake_case fallback
}

export function claimTemporaryPreview(token: string, planKey?: string): Promise<ClaimResult> {
  return apiFetch<ClaimResult>(`${BASE}/api/temporary_previews/${token}/claim`, {
    method: 'POST',
    ...(planKey ? { body: JSON.stringify({ planKey }) } : {}),
  })
}
