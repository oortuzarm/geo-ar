import { apiFetch } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const url  = (path: string) => `${BASE}${path}`

// ── Public types (go.ubyca.com resolver) ─────────────────────────────────────

export interface PublicSmartLink {
  name:             string
  slug:             string
  organizationSlug: string
  status:           'active' | 'paused' | 'archived'
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

export function resolvePublicSmartLink(
  organizationSlug: string,
  slug: string,
): Promise<PublicSmartLink> {
  return apiFetch<PublicSmartLink>(
    url(`/api/public/smart_links/${organizationSlug}/${slug}`)
  )
}
