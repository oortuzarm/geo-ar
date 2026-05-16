import { apiFetch } from '../lib/apiFetch'
import type { UserProfile, UpdateProfilePayload } from '../types/account.types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export function getAccount(): Promise<UserProfile> {
  return apiFetch<UserProfile>(`${BASE}/api/account`)
}

// normalize_params on the backend converts camelCase → snake_case automatically
export function updateAccount(payload: UpdateProfilePayload): Promise<UserProfile> {
  return apiFetch<UserProfile>(`${BASE}/api/account`, {
    method: 'PATCH',
    body: JSON.stringify({
      firstName: payload.firstName,
      lastName:  payload.lastName,
      company:   payload.company,
      jobTitle:  payload.jobTitle,
      country:   payload.country,
    }),
  })
}
