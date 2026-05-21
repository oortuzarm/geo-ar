// ─── Architecture contract ────────────────────────────────────────────────────
//
// TryPage is a PERSISTENCE WRAPPER around ProjectEditor — nothing more.
// It owns the localStorage layer and the temporary-preview API call.
// All UI, layout, and feature logic lives in ProjectEditor and its sub-components.
//
// When ProjectEditor gains a new feature, TryPage gets it for free because
// TryPage only provides callbacks; it never renders editor UI directly.
//
// Behavioral differences between demo and real mode are gated in:
//   • EditorModeContext  — lets sub-components read the mode
//   • ProjectEditor props — mode, canAddLocation, onPreviewOpen, etc.
//   • ProjectPanel        — blocked uploads, image restrictions
//
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import ProjectEditor from '../../components/editor/ProjectEditor'
import { DEMO_LIMIT } from './DemoLimitModal'
import { useGeoStore } from '../../store/geoStore'
import { createTemporaryPreview } from '../../services/temporaryPreviewsApi'
import { ApiError } from '../../lib/apiFetch'
import type { GeoPoint, GeoProject } from '../../types'

export const DEMO_STORAGE_KEY       = 'ubyca-demo-state'
export const DEMO_PREVIEW_TOKEN_KEY = 'ubyca-demo-preview-token'
const STORAGE_KEY = DEMO_STORAGE_KEY

// ── localStorage helpers ───────────────────────────────────────────────────────

function makeDemoProject(): GeoProject {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: 'Mi experiencia GPS',
    status: 'draft',
    geoPointIds: [],
    createdAt: now,
    updatedAt: now,
  }
}

function makePoint(projectId: string, lat: number, lng: number, order: number, name = ''): GeoPoint {
  return {
    id: crypto.randomUUID(),
    geoProjectId: projectId,
    name,
    latitude: lat,
    longitude: lng,
    activationRadius: 50,
    active: true,
    order,
  }
}

function saveToStorage(project: GeoProject, points: GeoPoint[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ project, points }))
  } catch { /* ignore quota errors */ }
}

function loadFromStorage(): { project: GeoProject; points: GeoPoint[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ── Demo payload sanitizers ────────────────────────────────────────────────────
// Strip all image fields before sending to the backend. Demo mode never allows
// image uploads; these sanitizers also evict stale data from old localStorage.

function sanitizeProject(project: GeoProject): GeoProject {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { coverImage: _c, markerImage: _m, ...rest } = project
  return rest
}

function sanitizePoints(points: GeoPoint[]): GeoPoint[] {
  return points.map((pt, i) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: _img, images: _images, ...rest } = pt
    return {
      ...rest,
      name:             pt.name?.trim() || `Ubicación ${i + 1}`,
      latitude:         Number(pt.latitude)         || 0,
      longitude:        Number(pt.longitude)        || 0,
      activationRadius: Number(pt.activationRadius) || 50,
      active:           pt.active ?? true,
      order:            Number(pt.order)            ?? i,
    }
  })
}

// ── TryPage — thin provider wrapper ───────────────────────────────────────────

export default function TryPage() {
  const { setProject, setPoints, upsertPoint, removePoint } = useGeoStore()

  // Initialize from localStorage or create a fresh demo project
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) {
      // Evict stale image data saved before uploads were blocked in demo mode
      const hadImages =
        Boolean(saved.project.coverImage) ||
        Boolean(saved.project.markerImage) ||
        saved.points.some((p) => Boolean(p.image))
      const cleanProject = sanitizeProject(saved.project)
      const cleanPoints  = saved.points.map(({ image: _img, ...p }) => p as GeoPoint)
      if (hadImages) saveToStorage(cleanProject, cleanPoints)
      setProject(cleanProject)
      setPoints(cleanPoints)
      if (cleanPoints.length > 0) {
        useGeoStore.getState().setMapCenter([cleanPoints[0].latitude, cleanPoints[0].longitude])
        useGeoStore.getState().setMapZoom(14)
      }
    } else {
      setProject(makeDemoProject())
      setPoints([])
    }
    return () => { setProject(null); setPoints([]) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Callbacks backed by localStorage ─────────────────────────────────────────

  async function handleCreatePoint(lat: number, lng: number, name = ''): Promise<GeoPoint> {
    const project = useGeoStore.getState().project!
    const points  = useGeoStore.getState().points
    const newPoint = makePoint(project.id, lat, lng, points.length, name)
    upsertPoint(newPoint)
    const updatedIds = [...project.geoPointIds, newPoint.id]
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
    return newPoint
  }

  async function handleSavePointCoords(_id: string, _lat: number, _lng: number) {
    // updatePointCoords already called by ProjectEditor; just persist current state
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  function handleToggleActive(id: string) {
    const pt = useGeoStore.getState().points.find((p) => p.id === id)
    if (!pt) return
    upsertPoint({ ...pt, active: !pt.active })
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  async function handleDeletePoint(id: string) {
    removePoint(id)
    const project = useGeoStore.getState().project!
    const updatedIds = project.geoPointIds.filter((pid) => pid !== id)
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
  }

  async function handleBulkDelete(ids: string[]) {
    const idsSet = new Set(ids)
    for (const id of ids) removePoint(id)
    const project = useGeoStore.getState().project!
    const updatedIds = project.geoPointIds.filter((pid) => !idsSet.has(pid))
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
  }

  async function handleBulkActivate(ids: string[]) {
    for (const id of ids) {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      if (pt && !pt.active) upsertPoint({ ...pt, active: true })
    }
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  async function handleBulkDeactivate(ids: string[]) {
    for (const id of ids) {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      if (pt && pt.active) upsertPoint({ ...pt, active: false })
    }
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  async function handlePreviewOpen(): Promise<{ url: string; token: string } | null> {
    const state = useGeoStore.getState()
    if (!state.project) return null

    try {
      const cleanProject = sanitizeProject(state.project)
      const cleanPoints  = sanitizePoints(state.points)
      const firstPt      = cleanPoints[0]
      const payloadJson  = JSON.stringify({ project: cleanProject, points: cleanPoints })
      console.info('[TryPage][PreviewPayload] size_kb:', (payloadJson.length / 1024).toFixed(1))
      console.info('[TryPage][PreviewPayload] project_keys:', Object.keys(cleanProject))
      console.info('[TryPage][PreviewPayload] points_count:', cleanPoints.length)
      if (firstPt) {
        console.info('[TryPage][PreviewPayload] first_point_keys:', Object.keys(firstPt))
        console.info('[TryPage][PreviewPayload] first_point_contentType:', firstPt.contentType ?? 'undefined')
        console.info('[TryPage][PreviewPayload] first_point_url:',
          firstPt.lookiarUrl ??
          (firstPt.contentData && 'url' in firstPt.contentData ? firstPt.contentData.url : undefined) ??
          'none'
        )
      }
      const result = await createTemporaryPreview(cleanProject, cleanPoints)
      console.info('[TryPage] createTemporaryPreview response:', {
        token: result.token,
        publicUrl: result.publicUrl,
        public_url: result.public_url,
        expiresAt: result.expiresAt ?? result.expires_at,
      })

      const token = result.token
      if (!token) {
        console.error('[TryPage] Backend did not return a token — cannot open preview modal')
        return null
      }

      // Prefer the URL the backend provides; fall back to constructing it from
      // the token so a missing publicUrl field doesn't silently drop the token.
      const baseUrl =
        result.publicUrl ??
        result.public_url ??
        `${window.location.origin}/temporary/${token}`

      // Append a timestamp so each preview click produces a unique URL.
      // This forces TemporaryPreviewPage to re-fetch even when the backend
      // re-uses the same token (upsert by project ID), and prevents phone
      // browsers from serving a cached page for an already-visited URL.
      const sep = baseUrl.includes('?') ? '&' : '?'
      const url = `${baseUrl}${sep}_t=${Date.now()}`

      // Track the new token as the only active preview for this demo session.
      localStorage.setItem(DEMO_PREVIEW_TOKEN_KEY, token)
      console.info('[TryPage] handlePreviewOpen returning:', { url, token: token.slice(0, 8) + '…' })
      return { url, token }
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[TryPage] Backend error creating preview:', err.status, err.message)
      } else {
        console.error('[TryPage] Unknown error creating preview:', err)
      }
      // Return null instead of rethrowing — openPreview opens the modal in
      // fallback mode without showing a toast. Matches /project/ behaviour where
      // clicking Preview always opens the modal regardless of point count.
      return null
    }
  }

  // Called after each form field change (upsert already done by ProjectEditor)
  function handleAfterPointChange() {
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  // Called by ProjectPanel whenever a project field changes
  function handleMarkUnsaved() {
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  return (
    <ProjectEditor
      mode="demo"
      loading={false}
      onCreatePoint={handleCreatePoint}
      onSavePointCoords={handleSavePointCoords}
      onToggleActive={handleToggleActive}
      onDeletePoint={handleDeletePoint}
      onBulkDelete={handleBulkDelete}
      onBulkActivate={handleBulkActivate}
      onBulkDeactivate={handleBulkDeactivate}
      onAfterPointChange={handleAfterPointChange}
      onSaveProject={async () => { /* autosaved on every change */ }}
      onMarkUnsaved={handleMarkUnsaved}
      onPreviewOpen={handlePreviewOpen}
      canAddLocation={(count) => count < DEMO_LIMIT}
    />
  )
}
