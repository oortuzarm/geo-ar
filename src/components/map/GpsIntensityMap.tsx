import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { createGeoIcon } from './createGeoIcon'
import { getCurrentPosition } from '../../hooks/useGeolocation'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import IntensityLayer from './IntensityLayer'
import BaseMapLayer from './BaseMapLayer'
import HotspotsLayer from '../maps/HotspotsLayer'
import ExclusivelyOutsideLayer from '../maps/ExclusivelyOutsideLayer'
import type { GeoPoint } from '../../types'
import type { HotspotPoint } from '../../services/hotspotApi'

// Re-export so callers (LiveVisitsPage) can keep their existing import paths.
export type { IntensityLevel } from './IntensityLayer'

// ── Custom panes ──────────────────────────────────────────────────────────────
//
// Leaflet renders all SVG vector layers in the same overlayPane (z-index 400).
// Within that pane, stacking order is DOM-insertion order — unreliable across
// React re-renders. Custom panes with explicit z-indexes guarantee consistent
// rendering order regardless of React re-renders.
//
//   intensityPane          → z-index 410  (base heatmap)
//   exclusivelyOutsidePane → z-index 413  (individual person markers)
//   outsideAreasPane       → z-index 415  (outside-areas clusters, above intensity)
//   hotspotsPane           → z-index 420  (hotspot clusters, topmost)

function CreatePane({ name, zIndex }: { name: string; zIndex: number }) {
  const map = useMap()
  useEffect(() => {
    if (!map.getPane(name)) {
      const pane = map.createPane(name)
      pane.style.zIndex = String(zIndex)
      // Pointer events off — individual layers control their own interactivity.
      pane.style.pointerEvents = 'none'
    }
  }, [map, name, zIndex])
  return null
}

// ── Mock helpers (used when no real activeNow data is available) ───────────────

export function mockPointIntensity(pointId: string): 'low' | 'medium' | 'high' {
  const sum = pointId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const b = sum % 3
  return b === 0 ? 'low' : b === 1 ? 'medium' : 'high'
}

// Mock counts chosen so relative logic maps each mock level correctly:
// max will be 100 → high=100 (100%), medium=50 (50%), low=0 (0%)
function mockCount(pointId: string): number {
  const level = mockPointIntensity(pointId)
  return level === 'high' ? 100 : level === 'medium' ? 50 : 0
}

// ── Locate control ─────────────────────────────────────────────────────────────

function LocateControl() {
  const map = useMap()
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const [loading, setLoading]           = useState(false)
  const [errorMsg, setErrorMsg]         = useState<string | null>(null)

  useEffect(() => {
    const div = L.DomUtil.create('div')
    const ctl = new (class extends L.Control {
      onAdd() { return div }
    })({ position: 'bottomleft' })
    ctl.addTo(map)
    L.DomEvent.disableClickPropagation(div)
    L.DomEvent.disableScrollPropagation(div)
    setPortalTarget(div)
    return () => { ctl.remove() }
  }, [map])

  async function handleLocate() {
    if (loading) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const pos = await getCurrentPosition()
      map.setView([pos.coords.latitude, pos.coords.longitude], 16, { animate: true })
    } catch (err: unknown) {
      const geo = err as GeolocationPositionError
      const msg = geo?.code === 1 ? 'Permiso denegado' : 'No se pudo obtener ubicación'
      setErrorMsg(msg)
      setTimeout(() => setErrorMsg(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (!portalTarget) return null

  return createPortal(
    <div className="flex flex-col items-start gap-1 mb-6 sm:mb-2 ml-2">
      {errorMsg && (
        <span className="bg-gray-900/95 border border-red-800/60 text-red-400
                         text-[10px] px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
          {errorMsg}
        </span>
      )}
      <button
        onClick={handleLocate}
        disabled={loading}
        title="Mi ubicación"
        className="flex items-center gap-1.5 bg-gray-900/90 hover:bg-gray-800
                   border border-white/[0.1] text-gray-300 hover:text-white
                   text-xs font-medium px-3 py-2 rounded-xl shadow-lg
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg className="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        Mi ubicación
      </button>
    </div>,
    portalTarget,
  )
}

// ── Map internals ─────────────────────────────────────────────────────────────

function FitBounds({ points }: { points: GeoPoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 14, { animate: false })
      return
    }
    const latlngs: [number, number][] = points.map((p) => [p.latitude, p.longitude])
    map.fitBounds(latlngs, { padding: [40, 40], maxZoom: 14, animate: false })
  }, [points.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ── Public component ──────────────────────────────────────────────────────────

export interface GpsIntensityMapProps {
  points:                       GeoPoint[]
  activeNow?:                   Record<string, number>        // pointId → active visitor count; omit to use mock
  showPoints?:                  boolean                       // render pin markers; default true
  showIntensity?:               boolean                       // render IntensityLayer; default true
  hotspots?:                    HotspotPoint[]                // if provided, renders HotspotsLayer (warm ramp)
  outsideAreasHotspots?:        HotspotPoint[]                // if provided, renders outside-areas layer (violet ramp)
  exclusivelyOutsidePositions?: { lat: number; lng: number }[] // one marker per exclusively-outside person (historical)
  liveOutsidePositions?:        { lat: number; lng: number }[] // one marker per active person outside areas (live)
}

export default function GpsIntensityMap({
  points,
  activeNow,
  showPoints                 = true,
  showIntensity              = true,
  hotspots,
  outsideAreasHotspots,
  exclusivelyOutsidePositions,
  liveOutsidePositions,
}: GpsIntensityMapProps) {
  const resolvedActiveNow: Record<string, number> = {}
  points.forEach((p) => {
    resolvedActiveNow[p.id] = activeNow !== undefined
      ? (activeNow[p.id] ?? 0)
      : mockCount(p.id)
  })

  return (
    <MapContainer
      center={[-33.4489, -70.6693]}
      zoom={11}
      maxZoom={20}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', background: '#111827', zIndex: 0 }}
      zoomControl
    >
      <BaseMapLayer styleId="toner" />
      <CreatePane name="intensityPane"          zIndex={410} />
      <CreatePane name="exclusivelyOutsidePane" zIndex={413} />
      <CreatePane name="outsideAreasPane"       zIndex={415} />
      <CreatePane name="hotspotsPane"           zIndex={420} />
      <FitBounds points={points} />
      <LocateControl />
      {showIntensity && (
        <IntensityLayer points={points} activeNow={resolvedActiveNow} pane="intensityPane" />
      )}
      {exclusivelyOutsidePositions && exclusivelyOutsidePositions.length > 0 && (
        <ExclusivelyOutsideLayer positions={exclusivelyOutsidePositions} pane="exclusivelyOutsidePane" />
      )}
      {liveOutsidePositions && liveOutsidePositions.length > 0 && (
        <ExclusivelyOutsideLayer positions={liveOutsidePositions} pane="exclusivelyOutsidePane" />
      )}
      {outsideAreasHotspots && outsideAreasHotspots.length > 0 && (
        <HotspotsLayer hotspots={outsideAreasHotspots} pane="outsideAreasPane" variant="cold" />
      )}
      {hotspots && hotspots.length > 0 && (
        <HotspotsLayer hotspots={hotspots} pane="hotspotsPane" />
      )}
      {showPoints && points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createGeoIcon(false, point.active, false, getPointCoverImage(point))}
        />
      ))}
    </MapContainer>
  )
}
