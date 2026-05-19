import { apiFetch } from '../lib/apiFetch'
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

export function fetchTemporaryPreview(token: string): Promise<TemporaryPreviewFetched> {
  return apiFetch<TemporaryPreviewFetched>(`${BASE}/api/temporary_previews/${token}`)
}

export interface ClaimResult {
  redirect_url: string
  redirectUrl?: string // camelCase fallback
}

export function claimTemporaryPreview(token: string, planKey?: string): Promise<ClaimResult> {
  return apiFetch<ClaimResult>(`${BASE}/api/temporary_previews/${token}/claim`, {
    method: 'POST',
    ...(planKey ? { body: JSON.stringify({ planKey }) } : {}),
  })
}
