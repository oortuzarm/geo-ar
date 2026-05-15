import { useCallback, useEffect, useState } from 'react'
import { geoProjectsApi, geoPointsApi } from '../services'
import type { GeoPoint, GeoProject } from '../types'

export function useWorkspace() {
  const [project,    setProject]    = useState<GeoProject | null>(null)
  const [points,     setPoints]     = useState<GeoPoint[]>([])
  const [loading,    setLoading]    = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
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
  }, [refreshKey])

  const updateProject = useCallback((updated: GeoProject) => {
    setProject(updated)
  }, [])

  const refresh = useCallback(() => {
    setProject(null)
    setPoints([])
    setRefreshKey((k) => k + 1)
  }, [])

  return { project, points, loading, updateProject, refresh }
}
