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
      console.log('[WORKSPACE_CANDIDATES]',
        all.map((p) => ({ id: p.id, userId: p.userId, status: p.status })))

      // ── Project selection strategy ───────────────────────────────────────
      //
      // Priority 1: projects where userId === currentUserId (explicit ownership).
      //   Filters out other users' workspaces even when the backend returns all
      //   projects (e.g. admin session hitting a non-scoped endpoint).
      //
      // Priority 2: projects where userId is absent (null/undefined).
      //   Backend didn't include userId — trust that the response is already scoped.
      //
      // No match → show empty state. NEVER auto-create a workspace here.
      // Workspace creation happens on demand when the user takes a real action.

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
        console.warn('[WORKSPACE_MISSING_USER_ID]',
          'Backend did not return userId — assuming response is already scoped to current user.',
          { ambiguousCount: noOwnerInfo.length, totalCount: all.length })
        candidates = noOwnerInfo
      } else {
        // No own project found — either new user or admin seeing only other users' projects.
        const skipped = all.filter((p) => p.userId && p.userId !== currentUserId)
        console.log('[WORKSPACE_AUTO_CREATE_BLOCKED]',
          'No workspace found for current user. Showing empty state instead of auto-creating.',
          { currentUserId, totalFromAPI: all.length, skippedOtherUsers: skipped.length })
        candidates = []
      }

      const sorted = [...candidates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      const workspace = sorted[0] ?? null

      if (!workspace) {
        console.log('[WORKSPACE_EMPTY_STATE] No workspace for userId=', currentUserId)
        if (!cancelled) {
          setProject(null)
          setPoints([])
          setLoading(false)
        }
        return
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
