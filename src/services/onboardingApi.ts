import { apiFetch } from '../lib/apiFetch'
import type {
  OnboardingConfig,
  OnboardingSubmitPayload,
  AdminOnboardingCategory,
  AdminOnboardingOption,
} from '../types/onboarding.types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

function url(path: string) {
  return `${BASE}${path}`
}

// ── Public (auth required, any user) ─────────────────────────────────────────

export function getOnboardingConfig(): Promise<OnboardingConfig> {
  return apiFetch<OnboardingConfig>(url('/api/onboarding/config'))
}

export function submitOnboarding(payload: OnboardingSubmitPayload): Promise<{ onboardingCompleted: boolean }> {
  return apiFetch(url('/api/onboarding'), {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function getAdminOnboardingCategories(): Promise<AdminOnboardingCategory[]> {
  return apiFetch<AdminOnboardingCategory[]>(url('/api/admin/onboarding_categories'))
}

export function createAdminOnboardingCategory(payload: Partial<AdminOnboardingCategory>): Promise<AdminOnboardingCategory> {
  return apiFetch<AdminOnboardingCategory>(url('/api/admin/onboarding_categories'), {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

export function updateAdminOnboardingCategory(id: number, payload: Partial<AdminOnboardingCategory>): Promise<AdminOnboardingCategory> {
  return apiFetch<AdminOnboardingCategory>(url(`/api/admin/onboarding_categories/${id}`), {
    method: 'PATCH',
    body:   JSON.stringify(payload),
  })
}

export function deleteAdminOnboardingCategory(id: number): Promise<void> {
  return apiFetch<void>(url(`/api/admin/onboarding_categories/${id}`), { method: 'DELETE' })
}

export function getAdminOnboardingOptions(group?: string): Promise<AdminOnboardingOption[]> {
  const q = group ? `?group=${group}` : ''
  return apiFetch<AdminOnboardingOption[]>(url(`/api/admin/onboarding_options${q}`))
}

export function createAdminOnboardingOption(payload: Partial<AdminOnboardingOption>): Promise<AdminOnboardingOption> {
  return apiFetch<AdminOnboardingOption>(url('/api/admin/onboarding_options'), {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

export function updateAdminOnboardingOption(id: number, payload: Partial<AdminOnboardingOption>): Promise<AdminOnboardingOption> {
  return apiFetch<AdminOnboardingOption>(url(`/api/admin/onboarding_options/${id}`), {
    method: 'PATCH',
    body:   JSON.stringify(payload),
  })
}

export function deleteAdminOnboardingOption(id: number): Promise<void> {
  return apiFetch<void>(url(`/api/admin/onboarding_options/${id}`), { method: 'DELETE' })
}

export function reorderAdminOnboardingOptions(ids: number[]): Promise<void> {
  return apiFetch<void>(url('/api/admin/onboarding_options/reorder'), {
    method: 'PATCH',
    body:   JSON.stringify({ ids }),
  })
}
