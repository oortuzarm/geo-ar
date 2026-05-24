import { apiFetch } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export interface SiteConfig {
  registerTrialDays: number
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/site_config`, {
    credentials: 'omit',
  })
  return {
    registerTrialDays: Number(raw.registerTrialDays ?? raw.register_trial_days ?? 14),
  }
}

export async function updateAdminSiteConfig(
  key: string,
  value: string,
): Promise<{ key: string; value: string }> {
  return apiFetch<{ key: string; value: string }>(
    `${BASE}/api/admin/site_configs/${key}`,
    { method: 'PATCH', body: JSON.stringify({ value }) },
  )
}
