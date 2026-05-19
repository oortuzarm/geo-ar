import { useCallback, useEffect, useState } from 'react'
import { geoProjectsApi, geoPointsApi } from '../services'
import { useAuthStore } from '../store/authStore'
import type { GeoPoint, GeoProject } from '../types'

/** localStorage key — written by DashboardPage when a project is opened/created. */
export const LAST_PROJECT_KEY = 'ubyca-last-project-id'

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

      // The last project the user explicitly opened (written by DashboardPage).
      // Used as selection priority so that navigating back from /project/:id always
      // re-opens the same project, even if listProjects is filtered by subscription.
      const lastProjectId = localStorage.getItem(LAST_PROJECT_KEY)

      const all = await geoProjectsApi.listProjects()

      console.log('[WORKSPACE_LOAD_USER] userId=', currentUserId,
        'email=', currentUserEmail, 'role=', currentUserRole,
        '| lastProjectId=', lastProjectId, '| totalFromAPI=', all.length)

      // ── Project selection strategy ───────────────────────────────────────
      //
      // Priority 1: lastProjectId found in the owned/unscoped candidates.
      //   Handles the common case where the user just came back from /project/:id.
      //
      // Priority 2: most-recently-updated owned candidate (original behaviour).
      //
      // Priority 3: direct fetchProject(lastProjectId).
      //   Handles the case where listProjects is filtered by subscription and
      //   returns 0 results, but the project still exists (e.g. right after claim).
      //
      // Priority 4: auto-create a new workspace.
      //   Only triggered when the user genuinely has no projects at all.

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
        candidates = []
      }

      // Priority 1: prefer the last-visited project if it's in the candidate list.
      const lastInList = lastProjectId
        ? candidates.find((p) => p.id === lastProjectId) ?? null
        : null

      const sorted = [...candidates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      let workspace: GeoProject | null = lastInList ?? sorted[0] ?? null

      // Priority 3: listProjects returned nothing but we have a lastProjectId —
      // try fetching the project directly (bypasses subscription filters on the list).
      if (!workspace && lastProjectId) {
        try {
          console.log('[WORKSPACE_DIRECT_FETCH] listProjects returned 0 — trying direct fetch for', lastProjectId)
          const direct = await geoProjectsApi.fetchProject(lastProjectId)
          if (direct) {
            workspace = direct
            console.log('[WORKSPACE_DIRECT_FETCH] Found project directly:', direct.id)
          }
        } catch {
          // Project no longer exists or not accessible — clear the stale key.
          console.warn('[WORKSPACE_DIRECT_FETCH] fetchProject failed — clearing lastProjectId')
          localStorage.removeItem(LAST_PROJECT_KEY)
        }
      }

      if (!workspace) {
        // Priority 4: no project found at all — auto-create a blank workspace.
        const skippedOthers = all.filter((p) => p.userId && p.userId !== currentUserId).length
        console.log('[WORKSPACE_CREATED_ON_DEMAND] Auto-creating workspace.',
          { currentUserId, totalFromAPI: all.length, skippedOtherUsers: skippedOthers })
        workspace = await geoProjectsApi.createProject({ title: 'Mi Workspace' })
      }

      console.log('[WORKSPACE_SELECTED] id=', workspace.id,
        'userId=', workspace.userId, 'status=', workspace.status,
        '| via=', lastInList ? 'lastProjectId-in-list'
          : (workspace.id === lastProjectId ? 'direct-fetch' : 'sorted-first'))

      if (currentUserId && workspace.userId && workspace.userId !== currentUserId) {
        console.error('[WORKSPACE_OWNERSHIP_MISMATCH] CRITICAL: selected workspace belongs to another user!',
          { currentUserId, projectUserId: workspace.userId, projectId: workspace.id })
      }

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
