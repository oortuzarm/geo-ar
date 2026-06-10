import { useEffect } from 'react'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import { createGeoIcon } from './createGeoIcon'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import IntensityLayer from './IntensityLayer'
import BaseMapLayer from './BaseMapLayer'
import HotspotsLayer from '../maps/HotspotsLayer'
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
//   intensityPane    → z-index 410  (base heatmap)
//   outsideAreasPane → z-index 415  (outside-areas clusters, above intensity)
//   hotspotsPane     → z-index 420  (hotspot clusters, topmost)

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
  points:                GeoPoint[]
  activeNow?:            Record<string, number>  // pointId → active visitor count; omit to use mock
  showPoints?:           boolean                 // render pin markers; default true
  showIntensity?:        boolean                 // render IntensityLayer; default true
  hotspots?:             HotspotPoint[]          // if provided, renders HotspotsLayer (warm ramp)
  outsideAreasHotspots?: HotspotPoint[]          // if provided, renders outside-areas layer (blue ramp)
}

export default function GpsIntensityMap({
  points,
  activeNow,
  showPoints           = true,
  showIntensity        = true,
  hotspots,
  outsideAreasHotspots,
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
      <CreatePane name="intensityPane"    zIndex={410} />
      <CreatePane name="outsideAreasPane" zIndex={415} />
      <CreatePane name="hotspotsPane"     zIndex={420} />
      <FitBounds points={points} />
      {showIntensity && (
        <IntensityLayer points={points} activeNow={resolvedActiveNow} pane="intensityPane" />
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
