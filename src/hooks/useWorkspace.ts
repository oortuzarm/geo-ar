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
      // Priority 1: projects where userId === currentUserId (explicit ownership match).
      //   This is always correct — filters out other users' workspaces even when the
      //   backend returns all projects (e.g. because the session user is an admin).
      //
      // Priority 2: projects where userId is absent (null/undefined).
      //   The backend didn't include userId — trust that it scoped the response.
      //   Log a warning because this is ambiguous.
      //
      // If neither priority finds any project → create a fresh one.
      // Never fall back to projects owned by a different user.

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
        // Backend returned projects but ALL belong to other users.
        // This happens when an admin hits GET /api/geo_projects and gets every project.
        const skipped = all.filter((p) => p.userId && p.userId !== currentUserId)
        console.warn('[WORKSPACE_NO_OWN_PROJECT]',
          'No project found for current user. Creating one.',
          { currentUserId, skippedOtherUsers: skipped.length })
        candidates = []
      }

      const sorted = [...candidates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

      let workspace = sorted[0]
      if (!workspace) {
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
