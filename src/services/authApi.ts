import { apiFetch } from '../lib/apiFetch'
import type { User, PendingVerification } from '../types/auth.types'

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

export function register(creds: RegisterCredentials): Promise<PendingVerification> {
  return apiFetch<PendingVerification>(url('/api/auth/register'), {
    method: 'POST',
    body: JSON.stringify({
      email: creds.email,
      password: creds.password,
      password_confirmation: creds.passwordConfirmation,
    }),
  })
}

export function verifyEmailCode(email: string, code: string): Promise<User> {
  return apiFetch<User>(url('/api/auth/verify_email_code'), {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })
}

export function resendVerificationCode(email: string): Promise<void> {
  return apiFetch<void>(url('/api/auth/resend_verification_code'), {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function me(): Promise<User> {
  return apiFetch<User>(url('/api/auth/me'))
}

export function logout(): Promise<void> {
  return apiFetch<void>(url('/api/auth/logout'), { method: 'DELETE' })
}

export function forgotPassword(email: string): Promise<void> {
  return apiFetch<void>(url('/api/auth/forgot_password'), {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
  return apiFetch<void>(url('/api/auth/reset_password'), {
    method: 'POST',
    body: JSON.stringify({ token, password, password_confirmation: passwordConfirmation }),
  })
}
