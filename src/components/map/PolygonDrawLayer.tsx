/**
 * PolygonDrawLayer — integrates Leaflet-Geoman inside a react-leaflet MapContainer.
 *
 * Used for the SELECTED point (or during pre-creation drawing).
 *
 * Responsibilities:
 *  - Renders the activationPolygon with selected (cyan) or unselected (red) style.
 *  - Activates Geoman draw mode when drawMode === 'drawing'.
 *  - Activates Geoman vertex-edit mode when drawMode === 'editing'.
 *  - Enables drag-to-move when drawMode === 'idle' and isSelected === true.
 *  - Never shows Geoman's built-in toolbar (controlled entirely via props).
 *  - Cleans up all layers and listeners on unmount and on prop changes.
 *
 * Cancellation detection:
 *  pm:drawend fires for both completion and cancellation (Escape).
 *  We track didCreate to distinguish them. Programmatic disableDraw() in
 *  cleanup also fires pm:drawend, but listeners are removed first so
 *  onDrawCancel is NOT triggered.
 */

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import type { ActivationPolygon } from '../../types'

export type PolygonDrawMode = 'idle' | 'drawing' | 'editing'

interface PolygonDrawLayerProps {
  drawMode:         PolygonDrawMode
  existingPolygon:  ActivationPolygon | undefined
  /** True when the associated point is the currently selected point. */
  isSelected:       boolean
  onPolygonCommit:  (polygon: ActivationPolygon) => void
  onDrawEnd:        () => void
  onDrawCancel?:    () => void
}

// ── Styles (match GeoPointMarker's circle styles exactly) ──────────────────

const STYLE_SELECTED: L.PathOptions = {
  color:       '#0ea5e9',
  fillColor:   '#0ea5e9',
  fillOpacity: 0.10,
  weight:      2,
  dashArray:   '6 4',
}

const STYLE_DEFAULT: L.PathOptions = {
  color:       '#ef4444',
  fillColor:   '#ef4444',
  fillOpacity: 0.04,
  weight:      1,
  dashArray:   '4 4',
}

const STYLE_EDITING: L.PathOptions = {
  color:       '#0ea5e9',
  fillColor:   '#0ea5e9',
  fillOpacity: 0.15,
  weight:      2,
  dashArray:   '6 4',
}

function layerToFeature(layer: L.Polygon): ActivationPolygon {
  return layer.toGeoJSON() as ActivationPolygon
}

export default function PolygonDrawLayer({
  drawMode,
  existingPolygon,
  isSelected,
  onPolygonCommit,
  onDrawEnd,
  onDrawCancel,
}: PolygonDrawLayerProps) {
  const map = useMap()

  const polygonLayerRef     = useRef<L.GeoJSON | null>(null)
  const onPolygonCommitRef  = useRef(onPolygonCommit)
  const onDrawEndRef        = useRef(onDrawEnd)
  const onDrawCancelRef     = useRef(onDrawCancel)
  onPolygonCommitRef.current  = onPolygonCommit
  onDrawEndRef.current        = onDrawEnd
  onDrawCancelRef.current     = onDrawCancel

  // ── Effect 1: sync polygon layer with existingPolygon + isSelected style ──

  useEffect(() => {
    if (polygonLayerRef.current) {
      polygonLayerRef.current.remove()
      polygonLayerRef.current = null
    }

    if (!existingPolygon) return

    const style = isSelected ? STYLE_SELECTED : STYLE_DEFAULT
    const layer = L.geoJSON(existingPolygon, { style })
    layer.addTo(map)
    polygonLayerRef.current = layer

    return () => {
      layer.remove()
      if (polygonLayerRef.current === layer) polygonLayerRef.current = null
    }
  }, [existingPolygon, isSelected, map]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 2: react to drawMode + isSelected ─────────────────────────────

  useEffect(() => {
    if (!map.pm) return

    // ── Drawing ─────────────────────────────────────────────────────────────
    if (drawMode === 'drawing') {
      if (polygonLayerRef.current) {
        polygonLayerRef.current.remove()
        polygonLayerRef.current = null
      }

      map.pm.addControls({ position: 'topleft', drawPolygon: false } as Parameters<typeof map.pm.addControls>[0])
      map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20,
        allowSelfIntersection: false,
        continueDrawing: false,
      } as Parameters<typeof map.pm.enableDraw>[1])

      let didCreate = false

      function handleCreate(e: { layer: L.Layer; shape: string }) {
        if (e.shape !== 'Polygon') return
        didCreate = true
        const drawnLayer = e.layer as L.Polygon
        const feature = layerToFeature(drawnLayer)
        drawnLayer.remove()
        map.pm.disableDraw()
        const styledLayer = L.geoJSON(feature, { style: STYLE_SELECTED })
        styledLayer.addTo(map)
        polygonLayerRef.current = styledLayer
        onPolygonCommitRef.current(feature)
        onDrawEndRef.current()
      }

      function handleDrawEnd() {
        if (!didCreate) onDrawCancelRef.current?.()
      }

      map.on('pm:create', handleCreate)
      map.on('pm:drawend', handleDrawEnd)

      return () => {
        map.off('pm:create', handleCreate)
        map.off('pm:drawend', handleDrawEnd)
        map.pm.disableDraw()
      }
    }

    // ── Editing vertices ─────────────────────────────────────────────────────
    if (drawMode === 'editing') {
      if (!polygonLayerRef.current) return
      polygonLayerRef.current.setStyle(STYLE_EDITING)

      // Accumulate the latest edited geometry here. We do NOT call onPolygonCommit
      // on every pm:edit because that would cause Effect 1 to remove and recreate
      // the layer mid-session, breaking Geoman's edit handles. The single commit
      // happens in the cleanup function when the editing session ends.
      let latestFeature: ActivationPolygon | null = null

      const editListeners: Array<{ poly: L.Polygon; handler: () => void }> = []

      polygonLayerRef.current.eachLayer((inner) => {
        const poly = inner as L.Polygon
        poly.pm.enable({ allowSelfIntersection: false })

        function handleEdit() {
          latestFeature = layerToFeature(poly)
        }

        poly.on('pm:edit', handleEdit)
        editListeners.push({ poly, handler: handleEdit })
      })

      return () => {
        editListeners.forEach(({ poly, handler }) => {
          poly.off('pm:edit', handler)
          poly.pm.disable()
        })
        // Commit the final geometry once, only if the user actually moved a vertex.
        if (latestFeature) onPolygonCommitRef.current(latestFeature)
        polygonLayerRef.current?.setStyle(STYLE_SELECTED)
      }
    }

    // ── Idle ─────────────────────────────────────────────────────────────────
    // Moving the polygon as a unit is done by dragging the pin in GeoPointMarker
    // (pin drag → translate polygon coordinates via ProjectEditor.handleMarkerDragEnd).
    // No Geoman drag mode is needed here.
    map.pm.disableDraw()
    map.pm.disableGlobalEditMode()

  }, [drawMode, map]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effect 3: full cleanup on unmount ─────────────────────────────────────

  useEffect(() => {
    return () => {
      if (!map.pm) return
      map.pm.disableDraw()
      map.pm.disableGlobalEditMode()
      if (polygonLayerRef.current) {
        polygonLayerRef.current.remove()
        polygonLayerRef.current = null
      }
    }
  }, [map]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
