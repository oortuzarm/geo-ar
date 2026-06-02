import { apiFetch } from '../lib/apiFetch'
import type {
  ApiCredential,
  ApiCredentialWithSecret,
  CreateCredentialPayload,
  UpdateCredentialPayload,
  RegenerateSecretResponse,
} from '../types/integrations.types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const url  = (path: string) => `${BASE}${path}`

export function listCredentials(): Promise<ApiCredential[]> {
  return apiFetch<ApiCredential[]>(url('/api/api_credentials'))
}

export function createCredential(payload: CreateCredentialPayload): Promise<ApiCredentialWithSecret> {
  return apiFetch<ApiCredentialWithSecret>(url('/api/api_credentials'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function updateCredential(id: string, patch: UpdateCredentialPayload): Promise<ApiCredential> {
  return apiFetch<ApiCredential>(url(`/api/api_credentials/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
}

export function regenerateCredentialSecret(id: string): Promise<RegenerateSecretResponse> {
  return apiFetch<RegenerateSecretResponse>(url(`/api/api_credentials/${id}/regenerate_secret`), {
    method: 'POST',
  })
}

export function deleteCredential(id: string): Promise<void> {
  return apiFetch<void>(url(`/api/api_credentials/${id}`), { method: 'DELETE' })
}
