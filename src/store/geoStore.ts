import { create } from 'zustand'
import type { GeoProject, GeoPoint, UserLocation, LocationStatus } from '../types'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface GeoStore {
  // Current project being edited
  project: GeoProject | null
  setProject: (project: GeoProject | null) => void
  updateProjectField: <K extends keyof GeoProject>(key: K, value: GeoProject[K]) => void

  // Geo points for current project
  points: GeoPoint[]
  setPoints: (points: GeoPoint[]) => void
  upsertPoint: (point: GeoPoint) => void
  updatePointCoords: (id: string, lat: number, lng: number) => void
  removePoint: (id: string) => void

  // Selected point in the editor
  selectedPointId: string | null
  setSelectedPointId: (id: string | null) => void

  // Map state
  mapCenter: [number, number]
  setMapCenter: (center: [number, number]) => void
  mapZoom: number
  setMapZoom: (zoom: number) => void
  // Tracks the real current map view as the user pans/zooms in the dashboard
  lastKnownMapView: { center: [number, number]; zoom: number } | null
  setLastKnownMapView: (view: { center: [number, number]; zoom: number }) => void

  // User location (for public view)
  userLocation: UserLocation | null
  locationStatus: LocationStatus
  setUserLocation: (loc: UserLocation | null, status: LocationStatus) => void

  // Toast notifications
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void

  // Saving state
  isSaving: boolean
  setIsSaving: (v: boolean) => void
}

export const useGeoStore = create<GeoStore>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  updateProjectField: (key, value) =>
    set((state) => ({
      project: state.project ? { ...state.project, [key]: value } : null,
    })),

  points: [],
  setPoints: (points) => set({ points }),
  upsertPoint: (point) =>
    set((state) => {
      const exists = state.points.find((p) => p.id === point.id)
      if (exists) {
        return { points: state.points.map((p) => (p.id === point.id ? point : p)) }
      }
      return { points: [...state.points, point] }
    }),
  updatePointCoords: (id, lat, lng) =>
    set((state) => ({
      points: state.points.map((p) =>
        p.id === id ? { ...p, latitude: lat, longitude: lng } : p
      ),
    })),
  removePoint: (id) =>
    set((state) => ({ points: state.points.filter((p) => p.id !== id) })),

  selectedPointId: null,
  setSelectedPointId: (id) => set({ selectedPointId: id }),

  mapCenter: [-33.4489, -70.6693], // Santiago, Chile por defecto
  setMapCenter: (center) => set({ mapCenter: center }),
  mapZoom: 13,
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  lastKnownMapView: null,
  setLastKnownMapView: (view) => set({ lastKnownMapView: view }),

  userLocation: null,
  locationStatus: 'idle',
  setUserLocation: (userLocation, locationStatus) => set({ userLocation, locationStatus }),

  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  isSaving: false,
  setIsSaving: (isSaving) => set({ isSaving }),
}))
