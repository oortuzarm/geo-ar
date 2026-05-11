import { apiFetch } from '../lib/apiFetch'
import type { User } from '../types/auth.types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

function url(path: string) {
  return `${BASE}${path}`
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  passwordConfirmation: string
}

export function login(creds: LoginCredentials): Promise<User> {
  return apiFetch<User>(url('/api/auth/login'), {
    method: 'POST',
    body: JSON.stringify({ email: creds.email, password: creds.password }),
  })
}

export function register(creds: RegisterCredentials): Promise<User> {
  return apiFetch<User>(url('/api/auth/register'), {
    method: 'POST',
    body: JSON.stringify({
      email: creds.email,
      password: creds.password,
      password_confirmation: creds.passwordConfirmation,
    }),
  })
}

export function me(): Promise<User> {
  return apiFetch<User>(url('/api/auth/me'))
}

export function logout(): Promise<void> {
  return apiFetch<void>(url('/api/auth/logout'), { method: 'DELETE' })
}
