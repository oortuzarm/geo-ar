import { useCallback, useEffect, useState } from 'react'
import { geoProjectsApi, geoPointsApi } from '../services'
import { useAuthStore } from '../store/authStore'
import type { GeoPoint, GeoProject } from '../types'

export function useWorkspace() {
  const currentUserId    = useAuthStore((s) => s.currentUser?.id    ?? null)
  const currentUserEmail = useAuthStore((s) => s.currentUser?.email ?? null)
  const currentUserRole  = useAuthStore((s) => s.currentUser?.role  ?? null)

  const [project,    setProject]    = useState<GeoProject | null>(null)
  const [points,     setPoints]     = useState<GeoPoint[]>([])
  const [loading,    setLoading]    = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const all = await geoProjectsApi.listProjects()

      console.log('[WORKSPACE_LOAD_USER] userId=', currentUserId,
        'email=', currentUserEmail, 'role=', currentUserRole)

      // ── Project selection strategy ───────────────────────────────────────
      //
      // Priority 1: projects where userId === currentUserId (explicit ownership).
      //   Filters out other users' workspaces even when the backend returns all
      //   projects (e.g. admin session hitting a non-scoped endpoint).
      //
      // Priority 2: projects where userId is absent (null/undefined).
      //   Backend didn't include userId — trust that the response is already scoped.
      //
      // No match → auto-create the user's own workspace.
      // Every user must have exactly 1 workspace; creation is safe because the
      // backend session always associates the new project with current_user.

      const owned = currentUserId
        ? all.filter((p) => p.userId === currentUserId)
        : []

      const noOwnerInfo = all.filter(
        (p) => p.userId === undefined || p.userId === null,
      )

      let candidates: GeoProject[]

      if (owned.length > 0) {
        candidates = owned
      } else if (noOwnerInfo.length > 0) {
        // Backend didn't return userId — trust that the response is already scoped.
        console.warn('[WORKSPACE_MISSING_USER_ID]',
          'Backend did not return userId — assuming response is already scoped to current user.',
          { ambiguousCount: noOwnerInfo.length, totalCount: all.length })
        candidates = noOwnerInfo
      } else {
        candidates = []
      }

      const sorted = [...candidates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      let workspace = sorted[0] ?? null

      if (!workspace) {
        // No own workspace found — auto-create one.
        const skippedOthers = all.filter((p) => p.userId && p.userId !== currentUserId).length
        console.log('[WORKSPACE_CREATED_ON_DEMAND] Auto-creating workspace.',
          { currentUserId, totalFromAPI: all.length, skippedOtherUsers: skippedOthers })
        workspace = await geoProjectsApi.createProject({ title: 'Mi Workspace' })
      }

      console.log('[WORKSPACE_SELECTED] id=', workspace.id,
        'userId=', workspace.userId, 'status=', workspace.status)

      if (currentUserId && workspace.userId && workspace.userId !== currentUserId) {
        console.error('[WORKSPACE_OWNERSHIP_MISMATCH] CRITICAL: selected workspace belongs to another user!',
          { currentUserId, projectUserId: workspace.userId, projectId: workspace.id })
      }

      console.log('[WORKSPACE_STATUS_DASHBOARD] id=', workspace.id,
        'status=', workspace.status, 'updatedAt=', workspace.updatedAt,
        'totalFromAPI=', all.length)

      const pts = await geoPointsApi.listPoints(workspace.id)

      if (cancelled) return
      setProject(workspace)
      setPoints(pts.slice().sort((a, b) => a.order - b.order))
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [refreshKey, currentUserId, currentUserEmail, currentUserRole])

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
