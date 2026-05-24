import { apiFetch } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export interface PublicSettings {
  communityMapEnabled:             boolean
  communityMapDisabledTitle:       string
  communityMapDisabledDescription: string
}

function normalizeSettings(raw: Record<string, unknown>): PublicSettings {
  return {
    communityMapEnabled:             (raw.communityMapEnabled        ?? raw.community_map_enabled        ?? true) as boolean,
    communityMapDisabledTitle:       (raw.communityMapDisabledTitle  ?? raw.community_map_disabled_title  ?? '') as string,
    communityMapDisabledDescription: (raw.communityMapDisabledDescription ?? raw.community_map_disabled_description ?? '') as string,
  }
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/public/settings`)
  return normalizeSettings(raw)
}

export async function getAdminSettings(): Promise<PublicSettings> {
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/admin/settings`)
  return normalizeSettings(raw)
}

export async function patchAdminSettings(payload: Partial<PublicSettings>): Promise<PublicSettings> {
  // camelCase keys — ApplicationController#normalize_params converts to snake_case on the backend
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/admin/settings`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return normalizeSettings(raw)
}
