import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardMap from '../../components/map/DashboardMap'
import AddressSearch from '../../components/map/AddressSearch'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import ToastContainer from '../../components/ui/Toast'
import GeoPointsList from './GeoPointsList'
import GeoPointForm from './GeoPointForm'
import { useGeoStore } from '../../store/geoStore'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { getCurrentPosition } from '../../hooks/useGeolocation'
import type { GeoPoint } from '../../types'

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    project, setProject,
    points, setPoints, upsertPoint, updatePointCoords, removePoint,
    selectedPointId, setSelectedPointId,
    setMapCenter, setMapZoom,
    addToast, isSaving, setIsSaving,
  } = useGeoStore()

  const [loading, setLoading] = useState(true)
  const [pointFormOpen, setPointFormOpen] = useState(false)
  const [deletePointTarget, setDeletePointTarget] = useState<string | null>(null)
  const [locatingUser, setLocatingUser] = useState(false)
  const [listDrawerOpen, setListDrawerOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  // Load project on mount
  useEffect(() => {
    async function load() {
      if (id === undefined || id === 'new') {
        const newProject = await geoProjectsApi.createProject()
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
      if (!proj) { navigate('/'); return }
      setProject(proj)
      setPoints(pts)
      if (pts.length > 0) {
        setMapCenter([pts[0].latitude, pts[0].longitude])
        setMapZoom(14)
      }
      setLoading(false)
    }
    load()
    return () => { setProject(null); setPoints([]) }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Warn on accidental navigation when there are unsaved content changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  function focusPoint(pt: GeoPoint) {
    setMapCenter([pt.latitude, pt.longitude])
    setMapZoom(17)
  }

  function handleSelectPoint(pointId: string) {
    setSelectedPointId(pointId)
    setPointFormOpen(true)
    const pt = points.find((p) => p.id === pointId)
    if (pt) focusPoint(pt)
  }

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (!project) return

      setHasUnsavedChanges(true)
      if (selectedPointId) {
        const current = useGeoStore.getState().points.find((p) => p.id === selectedPointId)
        if (current) upsertPoint({ ...current, latitude: lat, longitude: lng })
        const updated = await geoPointsApi.savePoint(selectedPointId, { latitude: lat, longitude: lng })
        upsertPoint(updated)
      } else {
        const newPoint = await geoPointsApi.createPoint({
          geoProjectId: project.id,
          latitude: lat,
          longitude: lng,
          order: useGeoStore.getState().points.length,
        })
        upsertPoint(newPoint)
        const updatedIds = [...project.geoPointIds, newPoint.id]
        useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
        await geoProjectsApi.saveProject(project.id, { ...project, geoPointIds: updatedIds })
        setSelectedPointId(newPoint.id)
        setPointFormOpen(true)
      }
    },
    [project, selectedPointId, upsertPoint, setSelectedPointId],
  )

  async function handleAddPoint() {
    if (!project) return
    setHasUnsavedChanges(true)
    const center = useGeoStore.getState().mapCenter
    const currentPoints = useGeoStore.getState().points
    const newPoint = await geoPointsApi.createPoint({
      geoProjectId: project.id,
      latitude: center[0],
      longitude: center[1],
      order: currentPoints.length,
    })
    upsertPoint(newPoint)
    const updatedIds = [...project.geoPointIds, newPoint.id]
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    await geoProjectsApi.saveProject(project.id, { ...project, geoPointIds: updatedIds })
    focusPoint(newPoint)
    setSelectedPointId(newPoint.id)
    setPointFormOpen(true)
  }

  async function handleAddressSelect(lat: number, lng: number) {
    if (!project) return
    setMapCenter([lat, lng])
    setMapZoom(17)
    setHasUnsavedChanges(true)
    const newPoint = await geoPointsApi.createPoint({
      geoProjectId: project.id,
      latitude: lat,
      longitude: lng,
      order: useGeoStore.getState().points.length,
    })
    upsertPoint(newPoint)
    const updatedIds = [...project.geoPointIds, newPoint.id]
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    await geoProjectsApi.saveProject(project.id, { ...project, geoPointIds: updatedIds })
    setSelectedPointId(newPoint.id)
    setPointFormOpen(true)
  }

  async function handleMarkerDragEnd(id: string, lat: number, lng: number) {
    // Atomic update inside Zustand's set callback — reads the very latest state,
    // so no other field (radius, name, url…) can be accidentally overwritten
    updatePointCoords(id, lat, lng)
    setHasUnsavedChanges(true)

    if (selectedPointId !== id) {
      setSelectedPointId(id)
      setPointFormOpen(true)
    }

    // Autosave: persist coordinates immediately so reload keeps the new position
    const saved = useGeoStore.getState().points.find((p) => p.id === id)
    if (saved) {
      try {
        await geoPointsApi.savePoint(id, saved)
      } catch {
        addToast('No se pudo guardar la nueva posición', 'error')
      }
    }
  }

  function handlePointChange(updates: Partial<GeoPoint>) {
    if (!selectedPointId) return
    const current = useGeoStore.getState().points.find((p) => p.id === selectedPointId)
    if (!current) return
    setHasUnsavedChanges(true)

    upsertPoint({ ...current, ...updates })

    if (updates.latitude !== undefined || updates.longitude !== undefined) {
      setMapCenter([
        updates.latitude ?? current.latitude,
        updates.longitude ?? current.longitude,
      ])
    }
  }

  async function handleToggleActive(pointId: string) {
    const pt = points.find((p) => p.id === pointId)
    if (!pt) return
    upsertPoint({ ...pt, active: !pt.active })
    const updated = await geoPointsApi.savePoint(pointId, { active: !pt.active })
    upsertPoint(updated)
  }

  async function confirmDeletePoint() {
    if (!deletePointTarget || !project) return
    await geoPointsApi.removePoint(deletePointTarget)
    removePoint(deletePointTarget)
    const updatedIds = project.geoPointIds.filter((pid) => pid !== deletePointTarget)
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    await geoProjectsApi.saveProject(project.id, { ...project, geoPointIds: updatedIds })
    setDeletePointTarget(null)
    if (selectedPointId === deletePointTarget) {
      setSelectedPointId(null)
      setPointFormOpen(false)
    }
    addToast('Punto eliminado', 'success')
  }

  async function handleSave() {
    if (!project) return
    setIsSaving(true)
    try {
      // Exclude status — publication is a separate immediate action via handleToggleStatus
      const { status: _status, ...contentFields } = project
      await geoProjectsApi.saveProject(project.id, contentFields)
      const currentPoints = useGeoStore.getState().points
      for (const pt of currentPoints) {
        await geoPointsApi.savePoint(pt.id, pt)
      }
      setHasUnsavedChanges(false)
      addToast('Proyecto guardado correctamente', 'success')
    } catch {
      addToast('Error al guardar el proyecto', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleStatus() {
    if (!project || isPublishing) return
    const nextStatus = project.status === 'active' ? 'draft' : 'active'
    setIsPublishing(true)
    // Optimistic update
    useGeoStore.getState().updateProjectField('status', nextStatus)
    try {
      const updated = await geoProjectsApi.saveProject(project.id, { status: nextStatus })
      useGeoStore.getState().setProject({ ...useGeoStore.getState().project!, status: updated.status })
      addToast(nextStatus === 'active' ? 'Proyecto publicado' : 'Proyecto despublicado', 'success')
    } catch {
      // Rollback on error
      useGeoStore.getState().updateProjectField('status', project.status)
      addToast('Error al cambiar el estado del proyecto', 'error')
    } finally {
      setIsPublishing(false)
    }
  }

  async function handleMyLocation() {
    setLocatingUser(true)
    try {
      const pos = await getCurrentPosition()
      setMapCenter([pos.coords.latitude, pos.coords.longitude])
      setMapZoom(16)
    } catch {
      addToast('No se pudo obtener tu ubicación', 'error')
    } finally {
      setLocatingUser(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const selectedPoint = points.find((p) => p.id === selectedPointId) ?? null

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <header className="flex-shrink-0 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm z-50">
        <div className="flex items-center h-14 px-3 sm:px-4 gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors flex-shrink-0"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Volver</span>
          </button>

          <div className="hidden sm:block w-px h-5 bg-gray-700" />

          <span className="text-sm font-medium text-gray-300 flex-1 truncate min-w-0">
            {project?.title ?? 'Proyecto geolocalizado'}
          </span>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => navigate(`/project/${project?.id}/preview`)}
            >
              Previsualizar
            </Button>

            {/* Publish toggle — saves immediately to backend */}
            {project && (
              <button
                onClick={handleToggleStatus}
                disabled={isPublishing}
                className={`hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium
                            border transition-colors flex-shrink-0 disabled:opacity-60 disabled:cursor-wait ${
                  project.status === 'active'
                    ? 'bg-green-900/40 border-green-700 text-green-300 hover:bg-red-900/30 hover:border-red-700 hover:text-red-300'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-green-900/30 hover:border-green-700 hover:text-green-300'
                }`}
                title={project.status === 'active' ? 'Despublicar' : 'Publicar'}
              >
                {isPublishing ? (
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    project.status === 'active' ? 'bg-green-400' : 'bg-gray-500'
                  }`} />
                )}
                {project.status === 'active' ? 'Publicado' : 'Borrador'}
              </button>
            )}

            {/* Unsaved content indicator */}
            {hasUnsavedChanges && (
              <span className="hidden sm:inline text-xs text-yellow-400 flex-shrink-0">
                Sin guardar
              </span>
            )}

            <Button
              variant="primary"
              size="sm"
              loading={isSaving}
              onClick={handleSave}
              className={hasUnsavedChanges ? 'ring-2 ring-yellow-500/50' : ''}
            >
              <span className="hidden sm:inline">Guardar proyecto</span>
              <span className="sm:hidden">
                {hasUnsavedChanges ? '● Guardar' : 'Guardar'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Left sidebar: desktop only */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-gray-800 bg-gray-900 flex-col overflow-hidden">
          <GeoPointsList
            points={points}
            selectedId={selectedPointId}
            onSelect={handleSelectPoint}
            onAdd={handleAddPoint}
            onToggleActive={handleToggleActive}
          />
        </aside>

        {/* Map area */}
        <div className="flex-1 relative overflow-hidden min-h-0">

          {/* Address search bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-1rem)] sm:w-full sm:max-w-lg sm:px-4">
            <AddressSearch onSelect={handleAddressSelect} />
          </div>

          {/* My location button */}
          <button
            onClick={handleMyLocation}
            disabled={locatingUser}
            className="absolute bottom-8 left-4 z-[1000] bg-gray-900/95 border border-gray-700
                       rounded-lg p-2.5 shadow-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="Mi ubicación"
          >
            {locatingUser ? (
              <Spinner size="sm" />
            ) : (
              <svg className="h-5 w-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>

          {/* Mobile: open list drawer */}
          <button
            className="lg:hidden absolute bottom-8 right-4 z-[1000] bg-gray-900/95 border border-gray-700
                       rounded-lg px-3 py-2 text-sm font-medium text-gray-300 shadow-lg
                       hover:bg-gray-800 transition-colors"
            onClick={() => setListDrawerOpen(true)}
          >
            Lista · {points.length}
          </button>

          {points.length === 0 && (
            <div className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[1000]
                           bg-gray-900/90 border border-gray-700 rounded-lg px-4 py-2
                           text-sm text-gray-400 whitespace-nowrap">
              Haz clic en el mapa para agregar el primer punto
            </div>
          )}

          <DashboardMap
            points={points}
            selectedPointId={selectedPointId}
            onMapClick={handleMapClick}
            onMarkerClick={handleSelectPoint}
            onMarkerDragEnd={handleMarkerDragEnd}
          />
        </div>

        {/* Right panel: desktop only */}
        {pointFormOpen && selectedPoint && (
          <aside className="hidden lg:flex w-72 flex-shrink-0 border-l border-gray-800 bg-gray-900 flex-col overflow-hidden">
            <GeoPointForm
              key={selectedPointId ?? ''}
              point={selectedPoint}
              onChange={handlePointChange}
              onDelete={() => setDeletePointTarget(selectedPoint.id)}
              onClose={() => { setSelectedPointId(null); setPointFormOpen(false) }}
              onSave={() => {
                addToast('Punto guardado', 'success')
                setSelectedPointId(null)
                setPointFormOpen(false)
              }}
            />
          </aside>
        )}
      </div>

      {/* ── Mobile: list bottom sheet ── */}
      {listDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[3000]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setListDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 h-[70vh] bg-gray-900 rounded-t-2xl
                         border-t border-gray-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-100">
                Puntos GPS{' '}
                <span className="text-gray-500 font-normal">({points.length})</span>
              </span>
              <button
                onClick={() => setListDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <GeoPointsList
              points={points}
              selectedId={selectedPointId}
              onSelect={(id) => { handleSelectPoint(id); setListDrawerOpen(false) }}
              onAdd={() => { handleAddPoint(); setListDrawerOpen(false) }}
              onToggleActive={handleToggleActive}
            />
          </div>
        </div>
      )}

      {/* ── Mobile: point form bottom sheet ── */}
      {pointFormOpen && selectedPoint && (
        <div className="lg:hidden fixed inset-0 z-[3000]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => { setSelectedPointId(null); setPointFormOpen(false) }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[88vh] bg-gray-900 rounded-t-2xl
                         border-t border-gray-800 flex flex-col overflow-hidden">
            <GeoPointForm
              key={selectedPointId ?? ''}
              point={selectedPoint}
              onChange={handlePointChange}
              onDelete={() => setDeletePointTarget(selectedPoint.id)}
              onClose={() => { setSelectedPointId(null); setPointFormOpen(false) }}
              onSave={() => {
                addToast('Punto guardado', 'success')
                setSelectedPointId(null)
                setPointFormOpen(false)
              }}
            />
          </div>
        </div>
      )}

      <Modal
        open={!!deletePointTarget}
        title="Eliminar punto"
        description="¿Eliminar este punto GPS? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={confirmDeletePoint}
        onCancel={() => setDeletePointTarget(null)}
        danger
      />
      <ToastContainer />
    </div>
  )
}
