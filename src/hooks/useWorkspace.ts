import { useEffect, useState } from 'react'
import { geoProjectsApi, geoPointsApi } from '../services'
import type { GeoPoint, GeoProject } from '../types'

/**
 * Resolves the user's primary workspace:
 *   - Loads all projects, takes the most recently updated one.
 *   - If no projects exist, silently creates a default one.
 *   - Then loads that project's points.
 *
 * The concept of "workspace" is a UX layer over the existing Project model.
 * Nothing changes in the backend — the first project IS the workspace.
 */
export function useWorkspace() {
  const [project, setProject] = useState<GeoProject | null>(null)
  const [points,  setPoints]  = useState<GeoPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const all = await geoProjectsApi.listProjects()
      const sorted = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

      let workspace = sorted[0]
      if (!workspace) {
        workspace = await geoProjectsApi.createProject({ title: 'Mi Workspace' })
      }

      const pts = await geoPointsApi.listPoints(workspace.id)

      if (cancelled) return
      setProject(workspace)
      setPoints(pts.slice().sort((a, b) => a.order - b.order))
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { project, points, loading }
}
