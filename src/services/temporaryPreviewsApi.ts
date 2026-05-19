import { apiFetch } from '../lib/apiFetch'
import type { GeoProject, GeoPoint } from '../types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export interface TemporaryPreviewCreated {
  token: string
  public_url: string
  expires_at: string
}

export interface TemporaryPreviewFetched {
  project: GeoProject
  points: GeoPoint[]
  expires_at: string
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
