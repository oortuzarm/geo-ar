// ─── Architecture contract ────────────────────────────────────────────────────
//
// DashboardPage is a PERSISTENCE WRAPPER around ProjectEditor — nothing more.
// It owns the API sync layer: save, publish/draft toggle, media cleanup,
// concurrency guards, and subscription-based canAddLocation.
// All UI, layout, and feature logic lives in ProjectEditor and its sub-components.
//
// When ProjectEditor gains a new feature, DashboardPage gets it for free because
// DashboardPage only provides callbacks; it never renders editor UI directly.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProjectEditor from '../../components/editor/ProjectEditor'
import { useGeoStore } from '../../store/geoStore'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { ApiError } from '../../lib/apiFetch'
import { useSubscription } from '../../hooks/useSubscription'
import { deleteMediaFile, isVercelBlobUrl } from '../../lib/deleteMediaFile'
import { LAST_PROJECT_KEY } from '../../hooks/useWorkspace'
import type { GeoPoint, MediaContentData } from '../../types'

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    setProject, setPoints,
    upsertPoint, removePoint,
    addToast, setIsSaving,
  } = useGeoStore()

  const [loading, setLoading]               = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const subscription = useSubscription()

  // Save-concurrency guards
  const isSavingRef    = useRef(false)
  const pendingSaveRef = useRef(false)
  // Track which images were sent in the last successful save to avoid re-sending unchanged ones
  const lastSavedImagesRef = useRef<{
    coverImage?: string
    points: Record<string, string | undefined>
  } | null>(null)
  // Queue of Vercel Blob URLs orphaned by user actions; flushed after a successful sync
  const pendingMediaDeletesRef = useRef<string[]>([])

  function queueMediaDelete(url: string) {
    if (!pendingMediaDeletesRef.current.includes(url)) {
      pendingMediaDeletesRef.current.push(url)
    }
  }

  // ── Load project on mount ──────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      if (id === undefined || id === 'new') {
        const newProject = await geoProjectsApi.createProject()
        localStorage.setItem(LAST_PROJECT_KEY, newProject.id)
        setProject(newProject)
        setPoints([])
        navigate(`/project/${newProject.id}`, { replace: true })
        setLoading(false)
        return
      }
      const [proj, pts] = await Promise.all([
        geoProjectsApi.fetchProject(id),
        geoPointsApi.listPoints(id),
      ])
      if (!proj) { navigate('/app'); return }
      localStorage.setItem(LAST_PROJECT_KEY, proj.id)
      console.log('[InitialView Loaded Project]', proj?.publicInitialViewMode)
      setProject(proj)
      setPoints(pts)
      if (pts.length > 0) {
        useGeoStore.getState().setMapCenter([pts[0].latitude, pts[0].longitude])
        useGeoStore.getState().setMapZoom(14)
      }
      setLoading(false)
    }
    load()
    return () => { setProject(null); setPoints([]) }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Top-level project save ─────────────────────────────────────────────────

  async function handleSave() {
    const currentProject = useGeoStore.getState().project
    if (!currentProject) return

    if (isSavingRef.current) {
      pendingSaveRef.current = true
      console.log('[Save] Guardado en curso — cambios pendientes registrados')
      return
    }

    isSavingRef.current = true
    setIsSaving(true)
    console.time('[Save] SAVE_PROJECT_TOTAL')

    try {
      const currentPoints = useGeoStore.getState().points
      const { status: _status, ...contentFields } = currentProject
      const snapshot = lastSavedImagesRef.current

      const coverImageChanged = contentFields.coverImage !== snapshot?.coverImage
      const projectPayload = coverImageChanged
        ? { ...contentFields, coverImage: contentFields.coverImage ?? null as unknown as string }
        : { ...contentFields, coverImage: undefined }

      let imagesSkipped = 0
      const pointsPayload = currentPoints.map((pt) => {
        const pointImageChanged = pt.image !== snapshot?.points[pt.id]
        if (!pointImageChanged && pt.image) imagesSkipped++
        return pointImageChanged
          ? { ...pt, image: pt.image ?? (null as unknown as string) }
          : { ...pt, image: undefined }
      })

      const payloadJson = JSON.stringify({ ...projectPayload, geoPoints: pointsPayload })
      const payloadKb   = (payloadJson.length / 1024).toFixed(1)
      const imagesInPayload = (coverImageChanged && projectPayload.coverImage ? 1 : 0)
        + pointsPayload.filter((p) => p.image?.startsWith('data:')).length
      console.log(
        `[Save] payload=${payloadKb} KB | puntos=${currentPoints.length} | imágenes en payload=${imagesInPayload} | imágenes omitidas=${imagesSkipped}`,
      )
      console.log('[InitialView Save Payload]', projectPayload.publicInitialViewMode)
      console.log('[Save][DEBUG] projectLogoUrl:', projectPayload.projectLogoUrl ?? '(sin logo)')

      pointsPayload.forEach((pt) => {
        if (pt.contentType && pt.contentType !== 'url') {
          console.log('[Save][DEBUG] content point:', {
            id: pt.id, contentType: pt.contentType, lookiarUrl: pt.lookiarUrl, contentData: pt.contentData,
          })
        }
      })

      console.time('[Save] syncProject')
      await geoProjectsApi.syncProject(currentProject.id, projectPayload, pointsPayload)
      console.timeEnd('[Save] syncProject')

      lastSavedImagesRef.current = {
        coverImage: currentProject.coverImage,
        points: Object.fromEntries(currentPoints.map((p) => [p.id, p.image])),
      }

      if (pendingMediaDeletesRef.current.length > 0) {
        const liveUrls = new Set(
          currentPoints
            .filter((p) => p.contentType !== 'url')
            .map((p) => (p.contentData as MediaContentData | undefined)?.file_url ?? '')
            .filter(Boolean),
        )
        const toDelete = pendingMediaDeletesRef.current.filter((url) => !liveUrls.has(url))
        pendingMediaDeletesRef.current = []
        if (toDelete.length > 0) {
          console.log('[MEDIA_CLEANUP_DELETE]', toDelete)
          toDelete.forEach((url) => void deleteMediaFile(url))
          console.log('[MEDIA_CLEANUP_DONE]')
        }
      }

      setHasUnsavedChanges(false)
      addToast('Proyecto guardado correctamente', 'success')
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('[Save] ApiError', err.status, err.message)
        const detail = err.status >= 500
          ? `Error del servidor (${err.status}). Intenta nuevamente.`
          : `Error al guardar (${err.status}): ${err.message}`
        addToast(detail, 'error')
      } else {
        console.error('[Save] Error inesperado:', err)
        addToast('Error al guardar el proyecto', 'error')
      }
    } finally {
      console.timeEnd('[Save] SAVE_PROJECT_TOTAL')
      isSavingRef.current = false
      setIsSaving(false)
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false
        console.log('[Save] Ejecutando guardado pendiente con estado más reciente...')
        void handleSave()
      }
    }
  }

  // ── Publish / draft toggle ─────────────────────────────────────────────────

  async function handleToggleStatus() {
    const project = useGeoStore.getState().project
    if (!project) return
    const nextStatus = project.status === 'active' ? 'draft' : 'active'
    useGeoStore.getState().updateProjectField('status', nextStatus)
    try {
      const updated = await geoProjectsApi.saveProject(project.id, { status: nextStatus })
      useGeoStore.getState().setProject({ ...useGeoStore.getState().project!, status: updated.status })
      addToast(nextStatus === 'active' ? 'Proyecto publicado' : 'Proyecto despublicado', 'success')
    } catch {
      useGeoStore.getState().updateProjectField('status', project.status)
      addToast('Error al cambiar el estado del proyecto', 'error')
    }
  }

  // ── Point mutation callbacks ───────────────────────────────────────────────

  async function handleCreatePoint(lat: number, lng: number, name?: string): Promise<GeoPoint> {
    const currentProject = useGeoStore.getState().project!
    const newPoint = await geoPointsApi.createPoint({
      geoProjectId: currentProject.id,
      latitude: lat,
      longitude: lng,
      name: name ?? '',
      order: useGeoStore.getState().points.length,
    })
    upsertPoint(newPoint)
    const updatedIds = [...currentProject.geoPointIds, newPoint.id]
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    await geoProjectsApi.saveProject(currentProject.id, {
      ...useGeoStore.getState().project!,
      geoPointIds: updatedIds,
    })
    return newPoint
  }

  async function handleSavePointCoords(id: string, _lat: number, _lng: number) {
    const saved = useGeoStore.getState().points.find((p) => p.id === id)
    if (saved) await geoPointsApi.savePoint(id, saved)
  }

  async function handleToggleActive(id: string) {
    const pt = useGeoStore.getState().points.find((p) => p.id === id)
    if (!pt) return
    upsertPoint({ ...pt, active: !pt.active })
    const updated = await geoPointsApi.savePoint(id, { active: !pt.active })
    upsertPoint(updated)
  }

  async function handleDeletePoint(id: string) {
    const ptToDelete = useGeoStore.getState().points.find((p) => p.id === id)
    const deletedCd  = ptToDelete?.contentData as MediaContentData | undefined
    const orphanUrl  = ptToDelete?.contentType !== 'url' && isVercelBlobUrl(deletedCd?.file_url)
      ? deletedCd!.file_url
      : undefined

    // Step 1 (critical): delete the point from the API. If this fails, propagate so
    // the UI shows an error and the local state is not modified.
    await geoPointsApi.removePoint(id)

    // Step 2: remove from local store and update project's geoPointIds.
    removePoint(id)
    const project = useGeoStore.getState().project!
    const updatedIds = project.geoPointIds.filter((pid) => pid !== id)
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)

    // Step 3 (non-fatal): persist updated geoPointIds to backend.
    // The point is already deleted; if this call fails the project will
    // re-sync correctly on the next full "Guardar". Don't surface this
    // failure as "Error al eliminar el punto" since the deletion succeeded.
    try {
      await geoProjectsApi.saveProject(project.id, {
        ...useGeoStore.getState().project!,
        geoPointIds: updatedIds,
      })
    } catch (err) {
      console.warn('[DeletePoint] Project geoPointIds sync failed (non-fatal):', err)
    }

    if (orphanUrl) {
      console.log('[DeletePoint] Cleaning orphan media:', orphanUrl)
      void deleteMediaFile(orphanUrl)
    }
  }

  async function handleBulkDelete(ids: string[]) {
    const idsSet = new Set(ids)

    const orphanUrls: string[] = []
    ids.forEach((id) => {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      const cd = pt?.contentData as MediaContentData | undefined
      if (pt?.contentType !== 'url' && isVercelBlobUrl(cd?.file_url)) {
        orphanUrls.push(cd!.file_url)
      }
    })

    for (const id of ids) removePoint(id)

    const freshProject = useGeoStore.getState().project!
    const updatedIds = freshProject.geoPointIds.filter((pid) => !idsSet.has(pid))
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)

    await Promise.all(ids.map((id) => geoPointsApi.removePoint(id)))
    await geoProjectsApi.saveProject(freshProject.id, {
      ...useGeoStore.getState().project!,
      geoPointIds: updatedIds,
    })

    if (orphanUrls.length > 0) {
      console.log('[BulkDelete] Cleaning orphan media assets:', orphanUrls)
      orphanUrls.forEach((url) => void deleteMediaFile(url))
    }
  }

  async function handleBulkActivate(ids: string[]) {
    for (const id of ids) {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      if (pt && !pt.active) upsertPoint({ ...pt, active: true })
    }
    await Promise.all(ids.map((id) => geoPointsApi.savePoint(id, { active: true })))
  }

  async function handleBulkDeactivate(ids: string[]) {
    for (const id of ids) {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      if (pt && pt.active) upsertPoint({ ...pt, active: false })
    }
    await Promise.all(ids.map((id) => geoPointsApi.savePoint(id, { active: false })))
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ProjectEditor
      mode="real"
      loading={loading}
      onCreatePoint={handleCreatePoint}
      onSavePointCoords={handleSavePointCoords}
      onToggleActive={handleToggleActive}
      onDeletePoint={handleDeletePoint}
      onBulkDelete={handleBulkDelete}
      onBulkActivate={handleBulkActivate}
      onBulkDeactivate={handleBulkDeactivate}
      onSaveProject={handleSave}
      onToggleStatus={handleToggleStatus}
      onMediaOrphaned={queueMediaDelete}
      hasUnsavedChanges={hasUnsavedChanges}
      onMarkUnsaved={() => setHasUnsavedChanges(true)}
      canAddLocation={subscription.canAddLocation}
    />
  )
}
