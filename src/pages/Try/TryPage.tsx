import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import DashboardMap from '../../components/map/DashboardMap'
import POISearch from '../../components/map/POISearch'
import GeoPointsList from '../Dashboard/GeoPointsList'
import GeoPointForm from '../Dashboard/GeoPointForm'
import PointSummarySheet from '../Dashboard/PointSummarySheet'
import Modal from '../../components/ui/Modal'
import ToastContainer from '../../components/ui/Toast'
import { useGeoStore } from '../../store/geoStore'
import EditorModeContext from '../../contexts/EditorModeContext'
import type { GeoPoint, GeoProject, MapBounds, PoiSearchResult } from '../../types'

const DEMO_LIMIT = 10
const STORAGE_KEY = 'ubyca-demo-state'

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

export default function TryPage() {
  const {
    project, setProject,
    points, setPoints, upsertPoint, updatePointCoords, removePoint,
    selectedPointId, setSelectedPointId,
    setMapCenter, setMapZoom,
    addToast,
  } = useGeoStore()

  const [pointFormOpen, setPointFormOpen]     = useState(false)
  const [deletePointTarget, setDeletePointTarget] = useState<string | null>(null)
  const [mobileEditOpen, setMobileEditOpen]   = useState(false)
  const [isNewMobilePoint, setIsNewMobilePoint] = useState(false)
  const [fabPlacementMode, setFabPlacementMode] = useState(false)
  const [isMobile, setIsMobile]               = useState(() => window.innerWidth < 1024)
  const [listDrawerOpen, setListDrawerOpen]   = useState(false)
  const [mapBounds, setMapBounds]             = useState<MapBounds | null>(null)
  const [poiResults, setPoiResults]           = useState<PoiSearchResult[]>([])
  const [limitOpen, setLimitOpen]             = useState(false)

  const selectedPoint = points.find((p) => p.id === selectedPointId) ?? null

  // Initialize from localStorage or create a fresh demo project
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) {
      setProject(saved.project)
      setPoints(saved.points)
      if (saved.points.length > 0) {
        setMapCenter([saved.points[0].latitude, saved.points[0].longitude])
        setMapZoom(14)
      }
    } else {
      setProject(makeDemoProject())
      setPoints([])
    }
    return () => { setProject(null); setPoints([]) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  function canAddPoint() {
    return useGeoStore.getState().points.length < DEMO_LIMIT
  }

  function focusPoint(pt: GeoPoint) {
    setMapCenter([pt.latitude, pt.longitude])
    setMapZoom(17)
  }

  function handleSelectPoint(pointId: string) {
    setSelectedPointId(pointId)
    setPointFormOpen(true)
    setMobileEditOpen(false)
    setIsNewMobilePoint(false)
    const pt = useGeoStore.getState().points.find((p) => p.id === pointId)
    if (pt) focusPoint(pt)
  }

  async function openNewPoint(lat: number, lng: number, name = '') {
    const currentProject = useGeoStore.getState().project
    if (!currentProject) return
    if (!canAddPoint()) { setLimitOpen(true); return }
    const currentPoints = useGeoStore.getState().points
    const newPoint = makePoint(currentProject.id, lat, lng, currentPoints.length, name)
    upsertPoint(newPoint)
    const updatedIds = [...currentProject.geoPointIds, newPoint.id]
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
    setSelectedPointId(newPoint.id)
    setPointFormOpen(true)
    setMobileEditOpen(true)
    setIsNewMobilePoint(true)
    addToast('Nuevo punto creado', 'success')
  }

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (!project) return
      if (selectedPointId) {
        setSelectedPointId(null)
        setPointFormOpen(false)
        setMobileEditOpen(false)
        setIsNewMobilePoint(false)
        return
      }
      if (isMobile) {
        if (fabPlacementMode) {
          setFabPlacementMode(false)
          await openNewPoint(lat, lng)
        }
        return
      }
      await openNewPoint(lat, lng)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, selectedPointId, isMobile, fabPlacementMode],
  )

  async function handleAddPoint() {
    if (!canAddPoint()) { setLimitOpen(true); return }
    const center = useGeoStore.getState().mapCenter
    await openNewPoint(center[0], center[1])
  }

  async function createPointAt(lat: number, lng: number, name = ''): Promise<GeoPoint> {
    const currentProject = useGeoStore.getState().project
    if (!currentProject) throw new Error('no project')
    if (!canAddPoint()) { setLimitOpen(true); throw new Error('limit reached') }
    const currentPoints = useGeoStore.getState().points
    const newPoint = makePoint(currentProject.id, lat, lng, currentPoints.length, name)
    upsertPoint(newPoint)
    const updatedIds = [...currentProject.geoPointIds, newPoint.id]
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
    return newPoint
  }

  async function handlePoiCreatePoint(result: PoiSearchResult) {
    await createPointAt(result.lat, result.lng, result.name)
    setMapCenter([result.lat, result.lng])
  }

  async function handlePoiCreateFromPopup(result: PoiSearchResult) {
    setPoiResults((prev) => prev.filter((r) => r.id !== result.id))
    await createPointAt(result.lat, result.lng, result.name)
  }

  function handlePoiFlyTo(lat: number, lng: number) {
    setMapCenter([lat, lng])
    setMapZoom(17)
  }

  async function handleMarkerDragEnd(id: string, lat: number, lng: number) {
    updatePointCoords(id, lat, lng)
    if (selectedPointId !== id) {
      setSelectedPointId(id)
      setPointFormOpen(true)
      setMobileEditOpen(false)
      setIsNewMobilePoint(false)
    }
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  function handlePointChange(updates: Partial<GeoPoint>) {
    if (!selectedPointId) return
    const current = useGeoStore.getState().points.find((p) => p.id === selectedPointId)
    if (!current) return
    upsertPoint({ ...current, ...updates })
    if (updates.latitude !== undefined || updates.longitude !== undefined) {
      setMapCenter([
        updates.latitude ?? current.latitude,
        updates.longitude ?? current.longitude,
      ])
    }
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  function handleToggleActive(pointId: string) {
    const pt = useGeoStore.getState().points.find((p) => p.id === pointId)
    if (!pt) return
    upsertPoint({ ...pt, active: !pt.active })
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
  }

  async function handleBulkActivate(ids: string[]) {
    for (const id of ids) {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      if (pt && !pt.active) upsertPoint({ ...pt, active: true })
    }
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
    addToast(`${ids.length} punto${ids.length !== 1 ? 's' : ''} activado${ids.length !== 1 ? 's' : ''}`, 'success')
  }

  async function handleBulkDeactivate(ids: string[]) {
    for (const id of ids) {
      const pt = useGeoStore.getState().points.find((p) => p.id === id)
      if (pt && pt.active) upsertPoint({ ...pt, active: false })
    }
    const state = useGeoStore.getState()
    if (state.project) saveToStorage(state.project, state.points)
    addToast(`${ids.length} punto${ids.length !== 1 ? 's' : ''} desactivado${ids.length !== 1 ? 's' : ''}`, 'success')
  }

  async function handleBulkDelete(ids: string[]) {
    if (!project) return
    const idsSet = new Set(ids)
    for (const id of ids) removePoint(id)
    if (selectedPointId && idsSet.has(selectedPointId)) {
      setSelectedPointId(null)
      setPointFormOpen(false)
    }
    const freshProject = useGeoStore.getState().project!
    const updatedIds = freshProject.geoPointIds.filter((pid) => !idsSet.has(pid))
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
    addToast(`${ids.length} punto${ids.length !== 1 ? 's' : ''} eliminado${ids.length !== 1 ? 's' : ''}`, 'success')
  }

  function confirmDeletePoint() {
    if (!deletePointTarget) return
    removePoint(deletePointTarget)
    const currentProject = useGeoStore.getState().project!
    const updatedIds = currentProject.geoPointIds.filter((pid) => pid !== deletePointTarget)
    useGeoStore.getState().updateProjectField('geoPointIds', updatedIds)
    const state = useGeoStore.getState()
    saveToStorage(state.project!, state.points)
    setDeletePointTarget(null)
    if (selectedPointId === deletePointTarget) {
      setSelectedPointId(null)
      setPointFormOpen(false)
    }
    addToast('Punto eliminado', 'success')
  }

  const markerImg = project?.markerImage
  const effectiveMapPoints = markerImg
    ? points.map((pt) => ({ ...pt, image: pt.image ?? markerImg }))
    : points

  return (
    <EditorModeContext.Provider value="demo">
      <div className="h-full bg-gray-950 flex flex-col overflow-hidden">

        {/* Demo banner */}
        <div className="flex-shrink-0 bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
            <p className="text-xs text-amber-300/90 truncate">
              Demo — Datos guardados en este navegador. Hasta {DEMO_LIMIT} ubicaciones.
            </p>
          </div>
          <Link
            to="/register"
            className="flex-shrink-0 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500
                       px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            Crear cuenta gratis
          </Link>
        </div>

        {/* Top bar */}
        <header
          className="flex-shrink-0 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm z-50"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {/* Mobile */}
          <div className="lg:hidden grid grid-cols-[40px_1fr_auto] items-center h-14 px-3 gap-2">
            <div />
            <span className="text-sm font-semibold text-gray-100 text-center truncate px-1">
              {project?.title ?? 'Experiencia GPS'}
            </span>
            <Link
              to="/register"
              className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500
                         px-3 h-8 rounded-lg transition-colors flex items-center whitespace-nowrap"
            >
              Crear cuenta
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex items-center h-14 px-4 gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors flex-shrink-0"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Inicio
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <span className="text-sm font-medium text-gray-300 flex-1 truncate min-w-0">
              {project?.title ?? 'Experiencia GPS'}
            </span>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-amber-400/80">
                {DEMO_LIMIT - points.length} de {DEMO_LIMIT} ubicaciones disponibles
              </span>
              <Link
                to="/register"
                className="flex items-center px-4 h-8 rounded-full text-xs font-semibold
                           bg-brand-600 hover:bg-brand-500 text-white transition-colors"
              >
                Crear cuenta gratuita
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* Left sidebar: desktop only */}
          <aside className="hidden lg:flex w-[308px] max-w-[308px] flex-shrink-0 border-r border-gray-800 bg-gray-900 flex-col overflow-hidden">
            <GeoPointsList
              points={points}
              selectedId={selectedPointId}
              onSelect={handleSelectPoint}
              onAdd={handleAddPoint}
              onToggleActive={handleToggleActive}
              onBulkActivate={handleBulkActivate}
              onBulkDeactivate={handleBulkDeactivate}
              onBulkDelete={handleBulkDelete}
              hideIdleTitle
            />
          </aside>

          {/* Map area */}
          <div className={`flex-1 relative overflow-hidden min-h-0 min-w-0${fabPlacementMode ? ' cursor-crosshair' : ''}`}>

            {/* POI / address search */}
            <div className="absolute top-4 z-[1000] left-14 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-lg sm:px-4">
              <POISearch
                mapBounds={mapBounds}
                existingPoints={points}
                onFlyTo={handlePoiFlyTo}
                onCreatePoint={handlePoiCreatePoint}
                onResultsChange={setPoiResults}
              />
            </div>

            {/* Mobile: FAB */}
            {!fabPlacementMode && (
              <div
                className="lg:hidden absolute right-4 z-[1000]"
                style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
              >
                <button
                  onClick={() => setFabPlacementMode(true)}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                             text-white rounded-full px-4 py-3 font-semibold text-sm transition-colors
                             shadow-[0_4px_20px_rgba(2,132,199,0.4)]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar punto
                </button>
              </div>
            )}

            {/* Mobile: placement mode hint */}
            {fabPlacementMode && (
              <div className="lg:hidden absolute inset-x-4 top-[72px] z-[1001] animate-slide-up">
                <div className="bg-gray-900/97 backdrop-blur-sm border border-brand-600/50
                               rounded-2xl px-4 py-3.5 flex items-center gap-3
                               shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <p className="text-sm font-medium text-gray-100 flex-1">
                    Toca el mapa para colocar el punto
                  </p>
                  <button
                    onClick={() => setFabPlacementMode(false)}
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8
                               text-gray-400 hover:text-gray-100 transition-colors rounded-full"
                    aria-label="Cancelar"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile: list button */}
            <div className="lg:hidden absolute bottom-8 right-4 z-[1000]">
              <button
                className="bg-gray-900/95 border border-gray-700 rounded-lg px-3 py-2
                           text-sm font-medium text-gray-300 shadow-lg hover:bg-gray-800 transition-colors"
                onClick={() => setListDrawerOpen(true)}
              >
                Lista · {points.length}
              </button>
            </div>

            {points.length === 0 && !fabPlacementMode && (
              <div className="absolute bottom-36 lg:bottom-8 left-1/2 -translate-x-1/2 z-[1000]
                             bg-gray-900/90 border border-gray-700 rounded-lg px-4 py-2
                             text-sm text-gray-400 whitespace-nowrap">
                {isMobile
                  ? 'Usa el botón + para agregar el primer punto'
                  : 'Haz clic en el mapa para agregar el primer punto'}
              </div>
            )}

            <DashboardMap
              points={effectiveMapPoints}
              selectedPointId={selectedPointId}
              onMapClick={handleMapClick}
              onMarkerClick={handleSelectPoint}
              onMarkerDragEnd={handleMarkerDragEnd}
              poiResults={poiResults}
              onBoundsChange={setMapBounds}
              onPoiCreate={handlePoiCreateFromPopup}
              userPos={null}
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

        {/* Mobile: list drawer */}
        {listDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-[3000]">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setListDrawerOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 h-[70vh] bg-gray-900 rounded-t-2xl
                           border-t border-gray-800 flex flex-col overflow-hidden">
              <GeoPointsList
                points={points}
                selectedId={selectedPointId}
                onSelect={(id) => { handleSelectPoint(id); setListDrawerOpen(false) }}
                onAdd={() => { void handleAddPoint(); setListDrawerOpen(false) }}
                onToggleActive={handleToggleActive}
                onBulkActivate={handleBulkActivate}
                onBulkDeactivate={handleBulkDeactivate}
                onBulkDelete={handleBulkDelete}
                onClose={() => setListDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Mobile: point summary sheet */}
        {pointFormOpen && selectedPoint && !mobileEditOpen && (
          <div className="lg:hidden fixed inset-0 z-[3000]">
            <PointSummarySheet
              point={selectedPoint}
              onClose={() => { setSelectedPointId(null); setPointFormOpen(false) }}
              onEdit={() => setMobileEditOpen(true)}
              onToggleActive={handleToggleActive}
              onDelete={(id) => setDeletePointTarget(id)}
            />
          </div>
        )}

        {/* Mobile: fullscreen point edit */}
        {pointFormOpen && selectedPoint && mobileEditOpen && (
          <div
            className="lg:hidden fixed inset-0 z-[3000] bg-gray-900 flex flex-col overflow-hidden animate-sheet-up"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div
              className="flex-shrink-0 flex items-center gap-3 px-2 border-b border-gray-800"
              style={{
                paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
                paddingBottom: '0.75rem',
              }}
            >
              <button
                onClick={isNewMobilePoint
                  ? () => { setSelectedPointId(null); setPointFormOpen(false); setMobileEditOpen(false); setIsNewMobilePoint(false) }
                  : () => setMobileEditOpen(false)
                }
                className="flex items-center justify-center w-10 h-10 text-gray-400
                           hover:text-gray-100 transition-colors flex-shrink-0"
                aria-label={isNewMobilePoint ? 'Cancelar' : 'Volver'}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="flex-1 text-base font-semibold text-gray-100 truncate">
                {selectedPoint.name || (isNewMobilePoint ? 'Nuevo punto' : 'Punto GPS')}
              </h2>
              <button
                onClick={() => setDeletePointTarget(selectedPoint.id)}
                className="flex items-center justify-center w-10 h-10 text-red-400
                           hover:text-red-300 transition-colors flex-shrink-0"
                title="Eliminar punto"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <GeoPointForm
              key={selectedPointId ?? ''}
              point={selectedPoint}
              onChange={handlePointChange}
              onDelete={() => setDeletePointTarget(selectedPoint.id)}
              onClose={isNewMobilePoint
                ? () => { setSelectedPointId(null); setPointFormOpen(false); setMobileEditOpen(false); setIsNewMobilePoint(false) }
                : () => setMobileEditOpen(false)
              }
              onSave={() => {
                addToast('Punto guardado', 'success')
                setSelectedPointId(null)
                setPointFormOpen(false)
                setMobileEditOpen(false)
                setIsNewMobilePoint(false)
              }}
              hideHeader
            />
          </div>
        )}

        {/* Limit reached modal */}
        {limitOpen && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setLimitOpen(false)} />
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25
                              flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Límite de la demo alcanzado</h2>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                La demo permite hasta {DEMO_LIMIT} ubicaciones. Crea una cuenta gratuita para agregar
                más puntos GPS y guardar tu experiencia de forma permanente.
              </p>
              <Link
                to="/register"
                className="block w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white text-sm
                           font-semibold rounded-lg transition-colors text-center mb-2"
                onClick={() => setLimitOpen(false)}
              >
                Crear cuenta gratuita
              </Link>
              <button
                onClick={() => setLimitOpen(false)}
                className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm
                           font-medium rounded-lg transition-colors"
              >
                Continuar explorando
              </button>
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
    </EditorModeContext.Provider>
  )
}
