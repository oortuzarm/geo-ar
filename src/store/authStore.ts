import { create } from 'zustand'
import type { User } from '../types/auth.types'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  verifyEmailCode as apiVerifyEmailCode,
  me,
} from '../services/authApi'
import type { LoginCredentials, RegisterCredentials } from '../services/authApi'

interface AuthStore {
  currentUser:              User | null
  isAuthenticated:          boolean
  isLoading:                boolean
  isInitialized:            boolean
  pendingVerificationEmail: string | null

  login:              (creds: LoginCredentials)            => Promise<void>
  register:           (creds: RegisterCredentials)         => Promise<void>
  verifyEmailCode:    (email: string, code: string)        => Promise<void>
  logout:             ()                                   => Promise<void>
  refreshSession:     ()                                   => Promise<void>
  reloadUser:         ()                                   => Promise<void>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser:              null,
  isAuthenticated:          false,
  isLoading:                false,
  isInitialized:            false,
  pendingVerificationEmail: null,

  async login(creds) {
    const user = await apiLogin(creds)
    set({ currentUser: user, isAuthenticated: true, pendingVerificationEmail: null })
  },

  async register(creds) {
    const result = await apiRegister(creds)
    set({ pendingVerificationEmail: result.email })
  },

  async verifyEmailCode(email, code) {
    const user = await apiVerifyEmailCode(email, code)
    set({ currentUser: user, isAuthenticated: true, pendingVerificationEmail: null })
  },

  async logout() {
    try { await apiLogout() } catch { /* ignore network errors on logout */ }
    set({ currentUser: null, isAuthenticated: false, pendingVerificationEmail: null })
  },

  async refreshSession() {
    // Only run once per app lifecycle
    if (get().isInitialized) return
    set({ isLoading: true })
    try {
      const user = await me()
      set({ currentUser: user, isAuthenticated: true, isLoading: false, isInitialized: true })
    } catch {
      set({ currentUser: null, isAuthenticated: false, isLoading: false, isInitialized: true })
    }
  },

  async reloadUser() {
    try {
      const user = await me()
      set({ currentUser: user })
    } catch { /* session gone — leave current state intact */ }
  },
}))
