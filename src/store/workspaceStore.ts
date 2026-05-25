import { create } from 'zustand'
import type { GeoProject } from '../types'

interface WorkspaceStore {
  project: GeoProject | null
  pointsCount: number
  isLoaded: boolean
  setWorkspace: (project: GeoProject, pointsCount: number) => void
  updateProject: (project: GeoProject) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  project: null,
  pointsCount: 0,
  isLoaded: false,
  setWorkspace: (project, pointsCount) => set({ project, pointsCount, isLoaded: true }),
  updateProject: (project) => set({ project }),
}))
