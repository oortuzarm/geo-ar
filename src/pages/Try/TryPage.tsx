import { useEffect } from 'react'
import ProjectEditor from '../../components/editor/ProjectEditor'
import { useGeoStore } from '../../store/geoStore'
import { createTemporaryPreview } from '../../services/temporaryPreviewsApi'
import { ApiError } from '../../lib/apiFetch'
import type { GeoPoint, GeoProject } from '../../types'

const DEMO_LIMIT = 10
export const DEMO_STORAGE_KEY = 'ubyca-demo-state'
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

// ── Point sanitizer — normalizes demo points before sending to the backend ────
// Handles blank names, coerces numeric fields, and sets safe defaults so the
// backend's validations don't reject a partially-filled demo project.

function sanitizePoints(points: GeoPoint[]): GeoPoint[] {
  return points.map((pt, i) => ({
    ...pt,
    name:             pt.name?.trim() || `Ubicación ${i + 1}`,
    latitude:         Number(pt.latitude)         || 0,
    longitude:        Number(pt.longitude)        || 0,
    activationRadius: Number(pt.activationRadius) || 50,
    active:           pt.active ?? true,
    order:            Number(pt.order)            ?? i,
  }))
}

// ── TryPage — thin provider wrapper ───────────────────────────────────────────

export default function TryPage() {
  const { setProject, setPoints, upsertPoint, removePoint } = useGeoStore()

  // Initialize from localStorage or create a fresh demo project
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) {
      setProject(saved.project)
      setPoints(saved.points)
      if (saved.points.length > 0) {
        useGeoStore.getState().setMapCenter([saved.points[0].latitude, saved.points[0].longitude])
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
      const result = await createTemporaryPreview(state.project, sanitizePoints(state.points))
      const url = result.publicUrl ?? result.public_url ?? null
      if (!url) return null
      return { url, token: result.token }
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[TemporaryPreview] Error del backend', err.status, err.message)
      }
      throw err
    }
  }

  // Called after each form field change (upsert already done by ProjectEditor)
  function handleAfterPointChange() {
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
      onPreviewOpen={handlePreviewOpen}
      canAddLocation={(count) => count < DEMO_LIMIT}
    />
  )
}
