// ─── Architecture contract ────────────────────────────────────────────────────
//
// ProjectEditor is the SINGLE canonical editor used by BOTH /project/:id and /try.
// TryPage and DashboardPage are thin persistence wrappers — they differ only in HOW
// they store data, NOT in what UI they render.
//
// The `mode` prop ('real' | 'demo') may only affect:
//   • Persistence layer   (API vs localStorage)
//   • Upload restrictions (Vercel Blob vs base64 / blocked)
//   • Point limits        (subscription vs DEMO_LIMIT)
//   • Paywalls / CTAs     (UpgradeModal vs DemoLimitModal, "Crear cuenta" links)
//   • Claim / auth flow   (PreviewQRModal temporaryNote, onPreviewOpen)
//   • Status toggle       (publish/draft — real only, demo has no concept)
//
// The `mode` prop must NOT affect:
//   • Layout or tab structure
//   • Which panels are rendered
//   • Map behavior or interactions
//   • GeoPointForm fields or validation
//   • ProjectPanel fields (beyond upload restrictions handled by EditorModeContext)
//
// Rule: any new feature added to the editor must work in BOTH modes by default.
// Gate it behind editorMode === 'demo' only if the restriction is explicitly required.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import DashboardMap from '../map/DashboardMap'
import IntensityModeSelector from '../map/IntensityModeSelector'
import type { IntensityMode } from '../map/IntensityModeSelector'
import { fetchLiveVisits, fetchHistoricalIntensity } from '../../services/liveVisitsApi'
import MapStyleToggle from '../map/MapStyleToggle'
import POISearch from '../map/POISearch'
import { useMapStyle } from '../../hooks/useMapStyle'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import Modal from '../ui/Modal'
import ToastContainer from '../ui/Toast'
import GeoPointsList from '../../pages/Dashboard/GeoPointsList'
import GeoPointForm from '../../pages/Dashboard/GeoPointForm'
import PointSummarySheet from '../../pages/Dashboard/PointSummarySheet'
import ProjectPanel from '../../pages/Dashboard/ProjectPanel'
import PreviewQRModal from '../../pages/Dashboard/PreviewQRModal'
import UpgradeModal from '../subscription/UpgradeModal'
import DemoLimitModal, { DEMO_LIMIT } from '../../pages/Try/DemoLimitModal'
import { useGeoStore } from '../../store/geoStore'
import EditorModeContext from '../../contexts/EditorModeContext'
import type { GeoPoint, MapBounds, PoiSearchResult } from '../../types'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProjectEditorProps {
  mode: 'real' | 'demo'
  loading: boolean
  // Point mutations — parent handles persistence (API or localStorage)
  onCreatePoint: (lat: number, lng: number, name?: string) => Promise<GeoPoint>
  onSavePointCoords: (id: string, lat: number, lng: number) => Promise<void>
  onToggleActive: (id: string) => void | Promise<void>
  onDeletePoint: (id: string) => Promise<void>
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkActivate: (ids: string[]) => Promise<void>
  onBulkDeactivate: (ids: string[]) => Promise<void>
  // Called after local store upsert in handlePointChange — demo uses this to autosave
  onAfterPointChange?: () => void
  // Top-level project save (real: complex sync; demo: no-op, autosaved on every change)
  onSaveProject: () => Promise<void>
  // Called when "Previsualizar" is tapped in demo mode; returns the temp preview URL + token
  onPreviewOpen?: () => Promise<{ url: string; token: string } | null>
  // Real-mode extras
  onToggleStatus?: () => Promise<void>
  onMediaOrphaned?: (url: string) => void
  // Unsaved-changes tracking (real mode: parent manages; demo: unused)
  hasUnsavedChanges?: boolean
  onMarkUnsaved?: () => void
  // Limit check
  canAddLocation: (currentCount: number) => boolean
}

// ─── Location types ───────────────────────────────────────────────────────────

type LocationPhase = 'idle' | 'acquiring' | 'failed' | 'manual-map' | 'manual-address'
type LocationSource = 'gps' | 'manual' | null

// ─── ProjectEditor ────────────────────────────────────────────────────────────

export default function ProjectEditor({
  mode,
  loading,
  onCreatePoint,
  onSavePointCoords,
  onToggleActive,
  onDeletePoint,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onAfterPointChange,
  onSaveProject,
  onToggleStatus,
  onMediaOrphaned,
  hasUnsavedChanges = false,
  onMarkUnsaved,
  canAddLocation,
  onPreviewOpen,
}: ProjectEditorProps) {
  const navigate = useNavigate()
  const {
    project,
    points, upsertPoint, updatePointCoords,
    selectedPointId, setSelectedPointId,
    setMapCenter, setMapZoom,
    addToast, isSaving,
  } = useGeoStore()

  // ── Map style ───────────────────────────────────────────────────────────────
  const { styleId: mapStyleId, setStyle: setMapStyle } = useMapStyle()

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [pointFormOpen, setPointFormOpen]       = useState(false)
  const [deletePointTarget, setDeletePointTarget] = useState<string | null>(null)
  const [locatingUser, setLocatingUser]         = useState(false)
  const [listDrawerOpen, setListDrawerOpen]     = useState(false)
  const [mobileEditOpen, setMobileEditOpen]     = useState(false)
  const [mobileProjectOpen, setMobileProjectOpen] = useState(false)
  const [isNewMobilePoint, setIsNewMobilePoint] = useState(false)
  const [fabPlacementMode, setFabPlacementMode] = useState(false)
  const [isMobile, setIsMobile]                 = useState(() => window.innerWidth < 1024)
  const [leftTab, setLeftTab]                   = useState<'points' | 'project'>('points')
  const [isPublishing, setIsPublishing]         = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewUrl, setPreviewUrl]             = useState<string | null>(null)
  const [previewToken, setPreviewToken]         = useState<string | null>(null)
  const [previewLoading, setPreviewLoading]     = useState(false)
  const [mapBounds, setMapBounds]               = useState<MapBounds | null>(null)
  const [poiResults, setPoiResults]             = useState<PoiSearchResult[]>([])
  const [limitOpen, setLimitOpen]               = useState(false)

  // ── Intensity GPS overlay ───────────────────────────────────────────────────
  const [hidePoints, setHidePoints]                 = useState(false)
  const [intensityOn, setIntensityOn]               = useState(false)
  const [intensityMode, setIntensityMode]           = useState<IntensityMode>('live')
  const [intensityActiveNow, setIntensityActiveNow] = useState<Record<string, number> | null>(null)
  const [showIntensityPopover, setShowIntensityPopover] = useState(false)
  const [intensityPopoverPos, setIntensityPopoverPos]   = useState<{ top: number; right: number } | null>(null)
  const intensityBtnRef     = useRef<HTMLButtonElement>(null)
  const intensityPopoverRef = useRef<HTMLDivElement>(null)

  // ── GPS / location state ────────────────────────────────────────────────────
  const [editorUserPos, setEditorUserPos] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const locationWatchRef  = useRef<number | null>(null)
  const bestReadingRef    = useRef<{ lat: number; lng: number; accuracy: number } | null>(null)
  const flyDoneRef        = useRef(false)
  const tier2TimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tier3TimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const desktopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dwellSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [locationPhase, setLocationPhase]           = useState<LocationPhase>('idle')
  const [currentGpsAccuracy, setCurrentGpsAccuracy] = useState<number | null>(null)
  const [locationSource, setLocationSource]         = useState<LocationSource>(null)
  const [showManualChip, setShowManualChip]         = useState(false)
  const [manualAddress, setManualAddress]           = useState('')
  const [geocoding, setGeocoding]                   = useState(false)

  useEffect(() => () => {
    if (locationWatchRef.current !== null) navigator.geolocation.clearWatch(locationWatchRef.current)
    if (tier2TimerRef.current !== null) clearTimeout(tier2TimerRef.current)
    if (tier3TimerRef.current !== null) clearTimeout(tier3TimerRef.current)
    if (desktopTimeoutRef.current !== null) clearTimeout(desktopTimeoutRef.current)
  }, [])

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Close intensity popover on outside tap/click — no backdrop needed so map stays interactive
  useEffect(() => {
    if (!showIntensityPopover) return
    const close = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (intensityBtnRef.current?.contains(target)) return
      if (intensityPopoverRef.current?.contains(target)) return
      setShowIntensityPopover(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close, { passive: true })
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [showIntensityPopover])

  useEffect(() => {
    if (!intensityOn || !project?.id) { setIntensityActiveNow(null); return }
    let cancelled = false

    if (intensityMode === 'live') {
      const load = async () => {
        try {
          const data = await fetchLiveVisits(project.id)
          if (cancelled) return
          const map: Record<string, number> = {}
          data.points.forEach((p) => { map[p.id] = p.activeNow })
          setIntensityActiveNow(map)
        } catch { /* keep previous data on error */ }
      }
      load()
      const timer = setInterval(load, 15_000)
      return () => { cancelled = true; clearInterval(timer) }
    }

    // historical — fetch once on mode/project change
    fetchHistoricalIntensity(project.id)
      .then((data) => {
        if (cancelled) return
        const map: Record<string, number> = {}
        data.points.forEach((p) => { map[p.id] = p.count })
        setIntensityActiveNow(map)
      })
      .catch(() => { /* keep previous data on error */ })
    return () => { cancelled = true }
  }, [intensityOn, intensityMode, project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Warn on accidental navigation only in real mode with unsaved changes
  useEffect(() => {
    if (mode !== 'real') return
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges, mode])

  // ── Derived ─────────────────────────────────────────────────────────────────

  const selectedPoint = points.find((p) => p.id === selectedPointId) ?? null

  const markerImg = project?.markerImage
  const effectiveMapPoints = markerImg
    ? points.map((pt) => ({ ...pt, image: pt.image ?? markerImg }))
    : points

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function focusPoint(pt: GeoPoint) {
    setMapCenter([pt.latitude, pt.longitude])
    setMapZoom(17)
  }

  function handleSelectPoint(pointId: string) {
    setSelectedPointId(pointId)
    setPointFormOpen(true)
    setMobileEditOpen(false)
    setIsNewMobilePoint(false)
    setMobileProjectOpen(false)
    const pt = useGeoStore.getState().points.find((p) => p.id === pointId)
    if (pt) focusPoint(pt)
  }

  async function openNewPoint(lat: number, lng: number, name?: string) {
    if (!useGeoStore.getState().project) return
    if (!canAddLocation(useGeoStore.getState().points.length)) {
      setLimitOpen(true)
      return
    }
    onMarkUnsaved?.()
    try {
      const newPoint = await onCreatePoint(lat, lng, name)
      setSelectedPointId(newPoint.id)
      setPointFormOpen(true)
      setMobileEditOpen(true)
      setIsNewMobilePoint(true)
      setMobileProjectOpen(false)
      addToast('Nuevo punto creado', 'success')
    } catch {
      addToast('Error al crear el punto', 'error')
    }
  }

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (locationPhase === 'manual-map') {
        const pos = { lat, lng, accuracy: 0 }
        setEditorUserPos(pos)
        setLocationSource('manual')
        setShowManualChip(true)
        setMapCenter([lat, lng])
        setMapZoom(16)
        setLocationPhase('idle')
        return
      }

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
    [project, selectedPointId, isMobile, fabPlacementMode, locationPhase],
  )

  async function handleAddPoint() {
    if (!canAddLocation(useGeoStore.getState().points.length)) {
      setLimitOpen(true)
      return
    }
    const center = useGeoStore.getState().mapCenter
    await openNewPoint(center[0], center[1])
  }

  async function createPointAt(lat: number, lng: number, name?: string): Promise<GeoPoint> {
    if (!canAddLocation(useGeoStore.getState().points.length)) {
      setLimitOpen(true)
      throw new Error('location limit reached')
    }
    onMarkUnsaved?.()
    return onCreatePoint(lat, lng, name)
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
    onMarkUnsaved?.()
    if (selectedPointId !== id) {
      setSelectedPointId(id)
      setPointFormOpen(true)
      setMobileEditOpen(false)
      setIsNewMobilePoint(false)
    }
    try {
      await onSavePointCoords(id, lat, lng)
    } catch {
      addToast('No se pudo guardar la nueva posición', 'error')
    }
  }

  function handlePointChange(updates: Partial<GeoPoint>) {
    if (!selectedPointId) return
    const current = useGeoStore.getState().points.find((p) => p.id === selectedPointId)
    if (!current) return
    onMarkUnsaved?.()
    upsertPoint({ ...current, ...updates })
    if (updates.latitude !== undefined || updates.longitude !== undefined) {
      setMapCenter([
        updates.latitude ?? current.latitude,
        updates.longitude ?? current.longitude,
      ])
    }
    onAfterPointChange?.()

    // Dwell fields are not reliably propagated by the PATCH sync endpoint.
    // Persist them immediately via the same PUT path used for GPS coordinate changes.
    if ('requiresDwellTime' in updates || 'dwellTimeSeconds' in updates) {
      const pointId = selectedPointId
      if (dwellSaveTimerRef.current) clearTimeout(dwellSaveTimerRef.current)
      dwellSaveTimerRef.current = setTimeout(() => {
        const saved = useGeoStore.getState().points.find((p) => p.id === pointId)
        if (saved) void onSavePointCoords(saved.id, saved.latitude, saved.longitude)
      }, 800)
    }
  }

  async function handleToggleActive(id: string) {
    await onToggleActive(id)
  }

  async function handleBulkActivate(ids: string[]) {
    try {
      await onBulkActivate(ids)
      addToast(`${ids.length} punto${ids.length !== 1 ? 's' : ''} activado${ids.length !== 1 ? 's' : ''}`, 'success')
    } catch {
      addToast('Error al activar los puntos', 'error')
    }
  }

  async function handleBulkDeactivate(ids: string[]) {
    try {
      await onBulkDeactivate(ids)
      addToast(`${ids.length} punto${ids.length !== 1 ? 's' : ''} desactivado${ids.length !== 1 ? 's' : ''}`, 'success')
    } catch {
      addToast('Error al desactivar los puntos', 'error')
    }
  }

  async function handleBulkDelete(ids: string[]) {
    const idsSet = new Set(ids)
    if (selectedPointId && idsSet.has(selectedPointId)) {
      setSelectedPointId(null)
      setPointFormOpen(false)
      setMobileEditOpen(false)
    }
    try {
      await onBulkDelete(ids)
      addToast(`${ids.length} punto${ids.length !== 1 ? 's' : ''} eliminado${ids.length !== 1 ? 's' : ''}`, 'success')
    } catch {
      addToast('Error al eliminar los puntos', 'error')
    }
  }

  async function confirmDeletePoint() {
    if (!deletePointTarget) return
    const target = deletePointTarget
    setDeletePointTarget(null)
    if (selectedPointId === target) {
      setSelectedPointId(null)
      setPointFormOpen(false)
      setMobileEditOpen(false)
    }
    try {
      await onDeletePoint(target)
      addToast('Punto eliminado', 'success')
    } catch {
      addToast('Error al eliminar el punto', 'error')
    }
  }

  async function handleSaveProject() {
    await onSaveProject()
  }

  async function handleToggleStatus() {
    if (!onToggleStatus || isPublishing) return
    setIsPublishing(true)
    try {
      await onToggleStatus()
    } finally {
      setIsPublishing(false)
    }
  }

  async function openPreview() {
    if (mode === 'demo' && onPreviewOpen) {
      setPreviewLoading(true)
      try {
        const result = await onPreviewOpen()
        console.info('[ProjectEditor] openPreview result:', result
          ? { url: result.url, token: result.token?.slice(0, 8) + '…' }
          : null)
        if (result && isMobile) {
          // Mobile: redirect directly — showing a QR to scan on the same device makes no sense
          window.location.href = result.url
        } else if (result) {
          setPreviewUrl(result.url)
          setPreviewToken(result.token)
          setPreviewModalOpen(true)
        } else {
          // onPreviewOpen returned null — clear any stale URL so the modal
          // never shows a previous preview, then open in fallback mode.
          console.warn('[ProjectEditor] onPreviewOpen returned null — opening modal without token')
          setPreviewUrl(null)
          setPreviewToken(null)
          setPreviewModalOpen(true)
        }
      } catch {
        addToast('No se pudo generar la previsualización', 'error')
      } finally {
        setPreviewLoading(false)
      }
    } else {
      setPreviewModalOpen(true)
    }
  }

  // ── GPS location ─────────────────────────────────────────────────────────────

  function handleMyLocation() {
    if (!navigator.geolocation) {
      addToast('Tu navegador no soporta geolocalización', 'error')
      return
    }
    if (locationWatchRef.current !== null) navigator.geolocation.clearWatch(locationWatchRef.current)
    if (tier2TimerRef.current !== null) { clearTimeout(tier2TimerRef.current); tier2TimerRef.current = null }
    if (tier3TimerRef.current !== null) { clearTimeout(tier3TimerRef.current); tier3TimerRef.current = null }
    if (desktopTimeoutRef.current !== null) { clearTimeout(desktopTimeoutRef.current); desktopTimeoutRef.current = null }
    flyDoneRef.current = false
    bestReadingRef.current = null
    setLocatingUser(true)

    if (isMobile) {
      function commitFix(pos: { lat: number; lng: number; accuracy: number }) {
        if (flyDoneRef.current) { setEditorUserPos(pos); return }
        flyDoneRef.current = true
        setEditorUserPos(pos)
        setLocationSource('gps')
        setMapCenter([pos.lat, pos.lng])
        setMapZoom(16)
        setLocatingUser(false)
      }
      locationWatchRef.current = navigator.geolocation.watchPosition(
        (raw) => {
          const pos = { lat: raw.coords.latitude, lng: raw.coords.longitude, accuracy: raw.coords.accuracy }
          if (!bestReadingRef.current || pos.accuracy < bestReadingRef.current.accuracy) bestReadingRef.current = pos
          if (pos.accuracy <= 5) {
            if (tier2TimerRef.current !== null) clearTimeout(tier2TimerRef.current)
            if (tier3TimerRef.current !== null) clearTimeout(tier3TimerRef.current)
            commitFix(pos); return
          }
          if (pos.accuracy <= 10 && !flyDoneRef.current && !tier2TimerRef.current) {
            tier2TimerRef.current = setTimeout(() => {
              if (!flyDoneRef.current && bestReadingRef.current) commitFix(bestReadingRef.current)
            }, 3000)
          }
          if (!flyDoneRef.current && !tier3TimerRef.current) {
            tier3TimerRef.current = setTimeout(() => {
              if (!flyDoneRef.current && bestReadingRef.current) commitFix(bestReadingRef.current)
            }, 8000)
          }
          if (flyDoneRef.current) setEditorUserPos(pos)
        },
        (err) => {
          setLocatingUser(false)
          if (err.code === 1) addToast('Permiso de ubicación denegado', 'error')
          else addToast('No se pudo obtener tu ubicación', 'error')
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
      )
    } else {
      setLocationPhase('acquiring')
      setCurrentGpsAccuracy(null)
      desktopTimeoutRef.current = setTimeout(() => {
        if (!flyDoneRef.current) {
          if (locationWatchRef.current !== null) {
            navigator.geolocation.clearWatch(locationWatchRef.current)
            locationWatchRef.current = null
          }
          const best = bestReadingRef.current
          if (best) {
            setEditorUserPos(best)
            setLocationSource('gps')
            setMapCenter([best.lat, best.lng])
            setMapZoom(15)
          }
          setLocationPhase('failed')
          setLocatingUser(false)
          setCurrentGpsAccuracy(null)
        }
      }, 10000)
      locationWatchRef.current = navigator.geolocation.watchPosition(
        (raw) => {
          if (locationWatchRef.current === null) return
          const acc = raw.coords.accuracy
          setCurrentGpsAccuracy(acc)
          const pos = { lat: raw.coords.latitude, lng: raw.coords.longitude, accuracy: acc }
          if (!bestReadingRef.current || acc < bestReadingRef.current.accuracy) bestReadingRef.current = pos
          if (acc > 50) return
          if (acc <= 30) {
            if (desktopTimeoutRef.current !== null) { clearTimeout(desktopTimeoutRef.current); desktopTimeoutRef.current = null }
            navigator.geolocation.clearWatch(locationWatchRef.current!)
            locationWatchRef.current = null
            flyDoneRef.current = true
            setEditorUserPos(pos)
            setLocationSource('gps')
            setMapCenter([pos.lat, pos.lng])
            setMapZoom(16)
            setLocationPhase('idle')
            setCurrentGpsAccuracy(null)
            setLocatingUser(false)
          }
        },
        (err) => {
          if (locationWatchRef.current === null) return
          locationWatchRef.current = null
          if (desktopTimeoutRef.current !== null) { clearTimeout(desktopTimeoutRef.current); desktopTimeoutRef.current = null }
          setLocatingUser(false)
          if (err.code === 1) {
            setLocationPhase('failed')
            addToast('Permiso de ubicación denegado', 'error')
          } else {
            setLocationPhase('failed')
          }
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      )
    }
  }

  async function handleGeocodeAddress() {
    if (!manualAddress.trim()) return
    setGeocoding(true)
    try {
      const params = new URLSearchParams({ q: manualAddress.trim(), format: 'json', limit: '1' })
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'Accept-Language': 'es' },
      })
      if (!res.ok) throw new Error()
      const data = await res.json() as Array<{ lat: string; lon: string }>
      if (!data[0]) { addToast('No se encontró la dirección', 'error'); return }
      const pos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), accuracy: 0 }
      setEditorUserPos(pos)
      setLocationSource('manual')
      setShowManualChip(true)
      setMapCenter([pos.lat, pos.lng])
      setMapZoom(16)
      setLocationPhase('idle')
      setManualAddress('')
    } catch {
      addToast('Error al buscar la dirección', 'error')
    } finally {
      setGeocoding(false)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="h-full bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // ─── JSX ──────────────────────────────────────────────────────────────────────

  return (
    <EditorModeContext.Provider value={mode}>
      <div className="h-full bg-gray-950 flex flex-col overflow-hidden">

        {/* ── Top bar ── */}
        <header
          className="sticky top-0 flex-shrink-0 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm z-50"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          {/* Mobile topbar */}
          <div className="lg:hidden grid grid-cols-[40px_1fr_auto] items-center h-14 px-3 gap-2">
            <button
              onClick={() => mode === 'real' ? navigate('/app') : navigate('/')}
              className="flex items-center justify-center text-gray-400 hover:text-gray-100 transition-colors"
              aria-label="Volver"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-100 text-center truncate px-1">
              {project?.title ?? 'Proyecto geolocalizado'}
            </span>
            {mode === 'real' ? (
              <Button
                variant="primary"
                size="sm"
                loading={isSaving}
                onClick={handleSaveProject}
                className={hasUnsavedChanges ? 'ring-2 ring-yellow-500/50' : ''}
              >
                {hasUnsavedChanges ? '● Guardar' : 'Guardar'}
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/register"
                  className="text-xs font-medium text-gray-400 hover:text-gray-100
                             transition-colors whitespace-nowrap"
                >
                  Crear cuenta
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  loading={previewLoading}
                  onClick={() => { void openPreview() }}
                >
                  Previsualizar
                </Button>
              </div>
            )}
          </div>

          {/* Desktop topbar */}
          <div className="hidden lg:flex items-center h-14 px-4 gap-3">
            <button
              onClick={() => mode === 'real' ? navigate('/app') : navigate('/')}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors flex-shrink-0"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {mode === 'real' ? 'Volver' : 'Inicio'}
            </button>

            <div className="w-px h-5 bg-gray-700" />

            <span className="text-sm font-medium text-gray-300 flex-1 truncate min-w-0">
              {project?.title ?? 'Proyecto geolocalizado'}
            </span>

            <div className="flex items-center gap-2 flex-shrink-0">
              {mode === 'real' ? (
                <>
                  {intensityOn ? (
                    <div className="flex items-center gap-2 flex-shrink-0 bg-emerald-900/20
                                    border border-emerald-800/50 rounded-full pl-3 pr-1 h-8">
                      <span className="text-xs font-medium text-emerald-400 whitespace-nowrap">
                        Intensidad GPS
                      </span>
                      <IntensityModeSelector mode={intensityMode} onChange={setIntensityMode} />
                      <button
                        onClick={() => setIntensityOn(false)}
                        aria-label="Cerrar intensidad GPS"
                        className="flex items-center justify-center w-5 h-5 rounded-full
                                   text-gray-500 hover:text-gray-200 hover:bg-gray-700/60
                                   transition-colors flex-shrink-0"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIntensityOn(true)}
                      className="flex items-center px-3 h-8 rounded-full text-xs font-medium
                                 border transition-colors flex-shrink-0
                                 bg-gray-800 border-gray-700 text-gray-400
                                 hover:border-gray-500 hover:text-gray-300"
                      title="Ver intensidad GPS"
                    >
                      Intensidad GPS
                    </button>
                  )}
                  {/* Hide points toggle — desktop */}
                  <button
                    onClick={() => setHidePoints((v) => !v)}
                    title={hidePoints ? 'Mostrar puntos GPS' : 'Ocultar puntos GPS'}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors flex-shrink-0 ${
                      hidePoints
                        ? 'bg-gray-700 border-gray-500 text-gray-200'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {hidePoints ? (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      )}
                    </svg>
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => { void openPreview() }}>
                    Previsualizar
                  </Button>
                  {project && (
                    <button
                      onClick={handleToggleStatus}
                      disabled={isPublishing}
                      className={`flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium
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
                  {hasUnsavedChanges && (
                    <span className="text-xs text-yellow-400 flex-shrink-0">Sin guardar</span>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    loading={isSaving}
                    onClick={handleSaveProject}
                    className={hasUnsavedChanges ? 'ring-2 ring-yellow-500/50' : ''}
                  >
                    Guardar proyecto
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" loading={previewLoading} onClick={() => { void openPreview() }}>
                    Previsualizar
                  </Button>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {DEMO_LIMIT - points.length} de {DEMO_LIMIT} disponibles
                  </span>
                  <Link
                    to="/register"
                    className="flex items-center px-4 h-8 rounded-full text-xs font-semibold
                               bg-brand-600 hover:bg-brand-500 text-white transition-colors"
                  >
                    Crear cuenta gratuita
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* Left sidebar: desktop only */}
          <aside className="hidden lg:flex w-[308px] max-w-[308px] flex-shrink-0 border-r border-gray-800 bg-gray-900 flex-col overflow-hidden">
            <>
              <div className="flex-shrink-0 flex border-b border-gray-800">
                {(['points', 'project'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeftTab(tab)}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors -mb-px border-b-2 ${
                      leftTab === tab
                        ? 'text-brand-400 border-brand-500'
                        : 'text-gray-500 hover:text-gray-300 border-transparent'
                    }`}
                  >
                    {tab === 'points' ? `Puntos GPS (${points.length})` : 'Proyecto'}
                  </button>
                ))}
              </div>
              {leftTab === 'points' ? (
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
                  projectId={project?.id}
                />
              ) : (
                <ProjectPanel onMarkUnsaved={() => onMarkUnsaved?.()} />
              )}
            </>
          </aside>

          {/* Map area */}
          <div className={`flex-1 relative overflow-hidden min-h-0 min-w-0${locationPhase === 'manual-map' ? ' cursor-crosshair' : ''}`}>

            {/* POI / address search bar + Mi ubicación (mobile only, below search) */}
            <div className="absolute top-4 z-[1000] left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-lg sm:px-4">
              <POISearch
                mapBounds={mapBounds}
                existingPoints={points}
                onFlyTo={handlePoiFlyTo}
                onCreatePoint={handlePoiCreatePoint}
                onResultsChange={setPoiResults}
              />
              <div className="lg:hidden flex items-center justify-end gap-2 mt-2">
                {/* Intensity GPS toggle — tap to enable/open mode selector */}
                <button
                  ref={intensityBtnRef}
                  onClick={() => {
                    const rect = intensityBtnRef.current?.getBoundingClientRect()
                    if (rect) setIntensityPopoverPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right })
                    if (!intensityOn) {
                      setIntensityOn(true)
                      setShowIntensityPopover(true)
                    } else {
                      setShowIntensityPopover((v) => !v)
                    }
                  }}
                  className={`flex-shrink-0 rounded-lg border p-2 shadow-lg transition-colors ${
                    intensityOn
                      ? 'bg-emerald-900/80 border-emerald-600 text-emerald-400'
                      : 'bg-gray-900/95 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                  aria-label="Intensidad GPS"
                >
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008z" />
                  </svg>
                </button>

                {/* Hide points toggle — mobile */}
                <button
                  onClick={() => setHidePoints((v) => !v)}
                  className={`flex-shrink-0 rounded-lg border p-2 shadow-lg transition-colors ${
                    hidePoints
                      ? 'bg-gray-800 border-gray-500 text-gray-200'
                      : 'bg-gray-900/95 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                  aria-label={hidePoints ? 'Mostrar puntos GPS' : 'Ocultar puntos GPS'}
                >
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {hidePoints ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    )}
                  </svg>
                </button>

                {/* GPS location button */}
                <button
                  onClick={handleMyLocation}
                  disabled={locatingUser}
                  className="flex-shrink-0 bg-gray-900/95 border border-gray-700 rounded-lg p-2
                             shadow-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
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
              </div>
            </div>

            {/* My location button — desktop only; mobile version lives in the bottom bar */}
            <button
              onClick={handleMyLocation}
              disabled={locatingUser}
              className="hidden lg:flex absolute bottom-8 left-4 z-[1000] bg-gray-900/95 border border-gray-700
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


            {/* Mobile: placement mode hint */}
            {fabPlacementMode && (
              <div className="lg:hidden absolute inset-x-4 top-[72px] z-[1001] animate-slide-up">
                <div className="bg-gray-900/97 backdrop-blur-sm border border-brand-600/50
                               rounded-2xl px-4 py-3.5 flex items-center gap-3
                               shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">
                      Toca el mapa para colocar el punto
                    </p>
                  </div>
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


            {/* Custom initial view hint — shown whenever the user has selected 'custom' */}
            {project?.publicInitialViewMode === 'custom' && (
              <>
                <div className="absolute inset-0 pointer-events-none z-[900] border-2 border-brand-500/20" />
                <div className="absolute bottom-36 lg:bottom-14 left-1/2 -translate-x-1/2 z-[900] pointer-events-none whitespace-nowrap">
                  <div className="flex items-center gap-2 bg-gray-900/96 backdrop-blur-sm
                                  border border-brand-500/30 rounded-xl px-3.5 py-2 shadow-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse flex-shrink-0" />
                    <p className="text-xs text-brand-300 font-medium">
                      Mueve y ajusta el mapa para definir la vista inicial pública
                    </p>
                  </div>
                </div>
              </>
            )}

            {points.length === 0 && !fabPlacementMode && locationPhase === 'idle' && (
              <div className="absolute bottom-36 lg:bottom-8 left-1/2 -translate-x-1/2 z-[1000]
                             bg-gray-900/90 border border-gray-700 rounded-lg px-4 py-2
                             text-sm text-gray-400 whitespace-nowrap">
                {isMobile
                  ? 'Usa el botón + para agregar el primer punto'
                  : 'Haz clic en el mapa para agregar el primer punto'}
              </div>
            )}

            {/* Desktop: GPS acquiring status */}
            {locationPhase === 'acquiring' && (
              <div className="hidden lg:flex absolute bottom-20 left-4 z-[1000] flex-col gap-1
                              bg-gray-900/97 border border-gray-700 rounded-xl px-4 py-3 shadow-lg
                              backdrop-blur-sm min-w-[220px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">Obteniendo ubicación precisa…</p>
                </div>
                {currentGpsAccuracy !== null && (
                  <p className="text-xs text-gray-400 pl-4">Precisión actual: {Math.round(currentGpsAccuracy)} m</p>
                )}
              </div>
            )}

            {/* Desktop: GPS failed */}
            {locationPhase === 'failed' && (
              <div className="hidden lg:flex absolute bottom-20 left-4 z-[1000] flex-col gap-3
                              bg-gray-900/97 border border-gray-700 rounded-xl px-4 py-4 shadow-lg
                              backdrop-blur-sm w-72">
                <p className="text-sm font-medium text-gray-700 leading-snug">
                  No pudimos obtener una ubicación precisa desde este computador.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setLocationPhase('manual-address')}
                    className="w-full text-sm bg-brand-600 hover:bg-brand-500 text-white
                               rounded-lg px-3 py-2 text-center font-medium transition-colors"
                  >
                    Escribir dirección
                  </button>
                  <button
                    onClick={() => setLocationPhase('manual-map')}
                    className="w-full text-sm bg-gray-700 hover:bg-gray-600 text-gray-100
                               rounded-lg px-3 py-2 text-center font-medium transition-colors"
                  >
                    Seleccionar en el mapa
                  </button>
                </div>
                <button
                  onClick={() => setLocationPhase('idle')}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Desktop: manual map click instruction */}
            {locationPhase === 'manual-map' && (
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-16 z-[1001]
                              items-center gap-3 bg-gray-900/97 backdrop-blur-sm
                              border border-brand-600/50 rounded-2xl px-4 py-3
                              shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <p className="text-sm font-medium text-gray-700">
                  Haz clic en el mapa para indicar tu ubicación.
                </p>
                <button
                  onClick={() => setLocationPhase('idle')}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-100 transition-colors"
                  aria-label="Cancelar"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Desktop: address geocoder input */}
            {locationPhase === 'manual-address' && (
              <div className="hidden lg:flex absolute bottom-20 left-4 z-[1001] flex-col gap-2
                              bg-gray-900/97 border border-gray-700 rounded-xl px-4 py-3 shadow-lg
                              backdrop-blur-sm w-72">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Escribir dirección</p>
                <input
                  type="text"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { void handleGeocodeAddress() } }}
                  placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2
                             text-sm text-gray-100 placeholder-gray-500
                             focus:outline-none focus:border-brand-500 transition-colors"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { void handleGeocodeAddress() }}
                    disabled={!manualAddress.trim() || geocoding}
                    className="flex-1 text-sm bg-brand-600 hover:bg-brand-500 disabled:opacity-50
                               text-white rounded-lg px-3 py-2 font-medium transition-colors"
                  >
                    {geocoding ? 'Buscando…' : 'Buscar'}
                  </button>
                  <button
                    onClick={() => setLocationPhase('idle')}
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Desktop: manual location label */}
            {locationPhase === 'idle' && locationSource === 'manual' && showManualChip && (
              <div className="hidden lg:flex absolute bottom-20 left-4 z-[1000] items-center gap-2
                              bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs text-gray-400">Ubicación indicada manualmente</span>
                <button
                  onClick={() => setShowManualChip(false)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Cerrar aviso"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
              userPos={editorUserPos}
              mapStyleId={intensityOn ? 'toner' : mapStyleId}
              intensityActiveNow={intensityOn && intensityActiveNow ? intensityActiveNow : undefined}
              intensityMode={intensityMode}
              hidePoints={hidePoints}
            />

            {/* Map style toggle — desktop only; mobile version lives in the bottom bar */}
            <div className="hidden lg:block absolute bottom-8 right-4 z-[999]">
              <MapStyleToggle styleId={mapStyleId} onStyleChange={setMapStyle} />
            </div>

            {/* Mobile intensity mode popover — portal, no backdrop so map stays interactive */}
            {showIntensityPopover && intensityPopoverPos && createPortal(
              <div
                ref={intensityPopoverRef}
                className="fixed z-[99999] flex items-center gap-1.5
                           bg-gray-900/97 backdrop-blur-sm border border-gray-700/60
                           rounded-2xl shadow-xl px-2 py-1.5"
                style={{ top: intensityPopoverPos.top, right: intensityPopoverPos.right }}
              >
                <IntensityModeSelector mode={intensityMode} onChange={setIntensityMode} />
                <button
                  onClick={() => { setIntensityOn(false); setShowIntensityPopover(false) }}
                  className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0
                             text-gray-500 hover:text-gray-200 hover:bg-gray-700/60 transition-colors"
                  aria-label="Desactivar intensidad GPS"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>,
              document.body,
            )}

            {/* ── Mobile bottom control bar ─────────────────────────────────────
                Layout: [Mapa/Satélite]  [☰ · n]  [settings]  [+]             */}
            <div
              className="lg:hidden absolute inset-x-0 bottom-8 z-[1000]"
              style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))' }}
            >
              {/* Bottom row: [Mapa/Satélite] — [☰ · n] — [+] */}
              <div className="flex items-center justify-between px-4">
                <MapStyleToggle styleId={mapStyleId} onStyleChange={setMapStyle} />

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setMobileProjectOpen(false); setListDrawerOpen(true) }}
                    className="flex items-center gap-1.5 bg-gray-900/95 border border-gray-700
                               rounded-lg px-3 py-2 text-sm font-medium text-gray-300
                               shadow-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h10" />
                    </svg>
                    · {points.length}
                  </button>

                  <button
                    onClick={() => { setListDrawerOpen(false); setMobileProjectOpen(true) }}
                    className="flex items-center justify-center w-9 h-9 bg-gray-900/95 border border-gray-700
                               rounded-lg text-gray-400 shadow-lg hover:bg-gray-800
                               hover:text-gray-200 transition-colors"
                    aria-label="Configuración del proyecto"
                  >
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {!fabPlacementMode ? (
                    <button
                      onClick={() => { setMobileProjectOpen(false); setListDrawerOpen(false); setFabPlacementMode(true) }}
                      className="w-14 h-14 flex items-center justify-center
                                 bg-brand-600 hover:bg-brand-500 active:bg-brand-700
                                 text-white rounded-full transition-colors
                                 shadow-[0_4px_20px_rgba(2,132,199,0.4)]"
                      aria-label="Agregar punto"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => setFabPlacementMode(false)}
                      className="flex items-center gap-1.5 bg-gray-700/90 border border-gray-600
                                 text-gray-200 rounded-full px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                      <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
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
                onMediaOrphaned={onMediaOrphaned}
              />
            </aside>
          )}
        </div>

        {/* ── Mobile: list bottom sheet ── */}
        {listDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-[3000]">
            <div className="absolute inset-0 bg-black/60" onClick={() => setListDrawerOpen(false)} />
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
                projectId={project?.id}
              />
            </div>
          </div>
        )}

        {/* ── Mobile: project panel sheet ── */}
        {mobileProjectOpen && (
          <div className="lg:hidden fixed inset-0 z-[3000]">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileProjectOpen(false)} />
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-2xl
                         bg-gray-900 border-t border-gray-800
                         flex flex-col overflow-hidden animate-sheet-up"
              style={{
                maxHeight: '85dvh',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              <div
                className="flex-shrink-0 flex items-center gap-3 px-2 border-b border-gray-800"
                style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
              >
                <button
                  onClick={() => setMobileProjectOpen(false)}
                  className="flex items-center justify-center w-10 h-10 text-gray-400
                             hover:text-gray-100 transition-colors flex-shrink-0"
                  aria-label="Cerrar"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="flex-1 text-base font-semibold text-gray-100">Proyecto</h2>
              </div>
              <ProjectPanel onMarkUnsaved={() => onMarkUnsaved?.()} />
            </div>
          </div>
        )}

        {/* ── Mobile: point summary sheet ── */}
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

        {/* ── Mobile: point fullscreen edit sheet ── */}
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
              onMediaOrphaned={onMediaOrphaned}
              hideHeader
            />
          </div>
        )}

        {project && (
          <PreviewQRModal
            projectId={project.id}
            projectTitle={project.title}
            isOpen={previewModalOpen}
            onClose={() => setPreviewModalOpen(false)}
            temporaryNote={mode === 'demo'}
            publicUrl={previewUrl ?? undefined}
            token={previewToken ?? undefined}
          />
        )}

        {/* Limit reached modal */}
        {limitOpen && (
          mode === 'real'
            ? <UpgradeModal onClose={() => setLimitOpen(false)} reason="limit" />
            : <DemoLimitModal onClose={() => setLimitOpen(false)} />
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
