import { create } from 'zustand'
import { getPublicSettings, type PublicSettings } from '../services/settingsApi'

interface SettingsState extends PublicSettings {
  isLoaded: boolean
  fetchPublicSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Safe defaults while the request is in-flight: assume enabled so nothing hides prematurely
  communityMapEnabled:             true,
  communityMapDisabledTitle:       '',
  communityMapDisabledDescription: '',
  isLoaded: false,

  async fetchPublicSettings() {
    if (get().isLoaded) return
    try {
      const settings = await getPublicSettings()
      set({ ...settings, isLoaded: true })
    } catch {
      // On network error: fail open (assume enabled) so public routes still work
      set({ communityMapEnabled: true, isLoaded: true })
    }
  },
}))
