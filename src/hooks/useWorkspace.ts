import { useCallback, useEffect, useState } from 'react'
import { geoProjectsApi, geoPointsApi } from '../services'
import { useAuthStore } from '../store/authStore'
import type { GeoPoint, GeoProject } from '../types'

export function useWorkspace() {
  // Use a primitive selector to avoid unnecessary re-renders on object identity change
  const currentUserId    = useAuthStore((s) => s.currentUser?.id    ?? null)
  const currentUserEmail = useAuthStore((s) => s.currentUser?.email ?? null)

  const [project,    setProject]    = useState<GeoProject | null>(null)
  const [points,     setPoints]     = useState<GeoPoint[]>([])
  const [loading,    setLoading]    = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const all = await geoProjectsApi.listProjects()

      console.log('[WORKSPACE_LOAD_USER] userId=', currentUserId, 'email=', currentUserEmail)
      console.log('[WORKSPACE_LOAD_ALL_PROJECTS] count=', all.length,
        'projects=', all.map((p) => ({ id: p.id, userId: p.userId, status: p.status })))

      // Filter to the current user's projects when ownership data is available.
      // If the backend doesn't include userId, the filter is a no-op (best-effort).
      const mine = currentUserId
        ? all.filter((p) => p.userId === undefined || p.userId === null || p.userId === currentUserId)
        : all

      const sorted = [...mine].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

      let workspace = sorted[0]
      if (!workspace) {
        workspace = await geoProjectsApi.createProject({ title: 'Mi Workspace' })
      }

      console.log('[WORKSPACE_LOAD_PROJECT] id=', workspace.id, 'userId=', workspace.userId,
        'title=', workspace.title, 'status=', workspace.status, 'updatedAt=', workspace.updatedAt,
        'totalProjects=', all.length, 'mineCount=', mine.length)

      if (currentUserId && workspace.userId && workspace.userId !== currentUserId) {
        console.error('[WORKSPACE_OWNERSHIP_MISMATCH] CRITICAL: loaded project does not belong to current user',
          { currentUserId, projectUserId: workspace.userId, projectId: workspace.id })
      }

      const pts = await geoPointsApi.listPoints(workspace.id)

      console.log('[WORKSPACE_STATUS_DASHBOARD] id=', workspace.id,
        'status=', workspace.status, 'updatedAt=', workspace.updatedAt,
        'totalProjects=', all.length)

      if (cancelled) return
      setProject(workspace)
      setPoints(pts.slice().sort((a, b) => a.order - b.order))
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [refreshKey, currentUserId, currentUserEmail])

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
