import { apiFetch, ApiError } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const url  = (path: string) => `${BASE}${path}`

// ── Public types (go.ubyca.com resolver) ─────────────────────────────────────

export interface PublicSmartLink {
  name:             string
  slug:             string
  organizationSlug: string
  status:           'active' | 'paused' | 'archived'
  // Optional landing-page fields — returned by the backend when available.
  // The Rails API may serialize these as snake_case; resolvePublicSmartLink normalizes them.
  projectId?:   string
  scopeType?:   'project' | 'geo_points'
  geoPointIds?: string[]
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SmartLink {
  id:               string
  name:             string
  slug:             string
  organizationSlug: string
  publicUrl:        string
  scopeType:        'project' | 'geo_points'
  destinationType:  'external_url'
  destinationUrl:   string
  status:           'active' | 'paused' | 'archived'
  projectId:        string
  geoPointIds:      string[]
  uiConfig:         Record<string, unknown>
  createdAt:        string
  updatedAt:        string
}

export interface CreateSmartLinkPayload {
  name:             string
  slug?:            string
  project_id:       string
  scope_type:       'project' | 'geo_points'
  destination_type: 'external_url'
  destination_url:  string
  status?:          'active' | 'paused'
  geo_point_ids?:   string[]
}

export interface UpdateSmartLinkPayload {
  name?:            string
  slug?:            string
  scope_type?:      'project' | 'geo_points'
  destination_url?: string
  status?:          'active' | 'paused'
  geo_point_ids?:   string[]
}

// ── API functions ─────────────────────────────────────────────────────────────

export function listSmartLinks(): Promise<SmartLink[]> {
  return apiFetch<SmartLink[]>(url('/api/smart_links'))
}

export function getSmartLink(id: string): Promise<SmartLink> {
  return apiFetch<SmartLink>(url(`/api/smart_links/${id}`))
}

export function createSmartLink(payload: CreateSmartLinkPayload): Promise<SmartLink> {
  return apiFetch<SmartLink>(url('/api/smart_links'), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateSmartLink(id: string, patch: UpdateSmartLinkPayload): Promise<SmartLink> {
  return apiFetch<SmartLink>(url(`/api/smart_links/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export function deleteSmartLink(id: string): Promise<void> {
  return apiFetch<void>(url(`/api/smart_links/${id}`), { method: 'DELETE' })
}

// ── Public resolver (no auth, used on go.ubyca.com) ──────────────────────────
//
// Uses fetch directly with credentials: 'omit' — the backend CORS policy for
// /api/public/smart_links/* sets Access-Control-Allow-Credentials: false, so
// apiFetch (which always sends credentials: 'include') would be rejected.
// All other Studio functions above use apiFetch normally.

export interface ValidateSmartLinkPayload {
  latitude:              number
  longitude:             number
  session_id:            string
  accuracy?:             number
  dwell_elapsed_seconds?: number
}

export interface ValidateSmartLinkResult {
  allowed:           boolean
  destinationUrl:    string | null
  matchedGeoPointId: string | null
  reason:            string | null
  message:           string | null
  smartLink:         PublicSmartLink
  availability:      Record<string, unknown>
}

// Public validate — credentials: 'omit' for the same CORS reason as resolve.
export async function validatePublicSmartLink(
  organizationSlug: string,
  slug: string,
  payload: ValidateSmartLinkPayload,
): Promise<ValidateSmartLinkResult> {
  const res = await fetch(
    url(`/api/public/smart_links/${organizationSlug}/${slug}/validate`),
    {
      method: 'POST',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new ApiError(res.status, body || res.statusText)
  }
  return res.json() as Promise<ValidateSmartLinkResult>
}

export async function resolvePublicSmartLink(
  organizationSlug: string,
  slug: string,
): Promise<PublicSmartLink> {
  const res = await fetch(
    url(`/api/public/smart_links/${organizationSlug}/${slug}`),
    {
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
    },
  )
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new ApiError(res.status, body || res.statusText)
  }
  const raw = await res.json() as Record<string, unknown>
  // Normalize optional landing-page fields from snake_case (Rails) or camelCase.
  return {
    ...raw,
    projectId:   (raw.projectId   ?? raw.project_id)   as string | undefined,
    scopeType:   (raw.scopeType   ?? raw.scope_type)   as 'project' | 'geo_points' | undefined,
    geoPointIds: (raw.geoPointIds ?? raw.geo_point_ids) as string[] | undefined,
  } as PublicSmartLink
}
