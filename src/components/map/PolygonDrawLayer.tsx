/**
 * PolygonDrawLayer — integrates Leaflet-Geoman inside a react-leaflet MapContainer.
 *
 * Responsibilities:
 *  - Renders the activationPolygon of the selected point as a styled L.GeoJSON layer.
 *  - Activates Geoman draw mode when drawMode === 'drawing'.
 *  - Activates Geoman vertex-edit mode when drawMode === 'editing'.
 *  - Never shows Geoman's built-in toolbar (controlled entirely via props).
 *  - Cleans up all layers and listeners on unmount and on prop changes.
 */

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import type { ActivationPolygon } from '../../types'

export type PolygonDrawMode = 'idle' | 'drawing' | 'editing'

interface PolygonDrawLayerProps {
  /** Current draw/edit mode driven from outside (ProjectEditor). */
  drawMode: PolygonDrawMode
  /** The existing polygon to display (and edit). */
  existingPolygon: ActivationPolygon | undefined
  /** Called when drawing completes or a vertex is moved. */
  onPolygonCommit: (polygon: ActivationPolygon) => void
  /** Called when a draw session ends (so the parent can reset drawMode → 'idle'). */
  onDrawEnd: () => void
}

// ── Style constants ─────────────────────────────────────────────────────────

const POLYGON_STYLE: L.PathOptions = {
  color: '#818cf8',
  fillColor: '#818cf8',
  fillOpacity: 0.18,
  weight: 2.5,
  dashArray: undefined,
}

const POLYGON_STYLE_EDITING: L.PathOptions = {
  ...POLYGON_STYLE,
  dashArray: '6 4',
  weight: 2,
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Converts a Leaflet polygon layer to a GeoJSON Feature<Polygon>. */
function layerToFeature(layer: L.Polygon): ActivationPolygon {
  return layer.toGeoJSON() as ActivationPolygon
}

export default function PolygonDrawLayer({
  drawMode,
  existingPolygon,
  onPolygonCommit,
  onDrawEnd,
}: PolygonDrawLayerProps) {
  const map = useMap()

  // The single rendered polygon layer (L.GeoJSON wrapping an L.Polygon).
  const polygonLayerRef = useRef<L.GeoJSON | null>(null)

  // Stable refs so effects don't need the callbacks as deps.
  const onPolygonCommitRef = useRef(onPolygonCommit)
  const onDrawEndRef       = useRef(onDrawEnd)
  onPolygonCommitRef.current = onPolygonCommit
  onDrawEndRef.current       = onDrawEnd

  // ── Step 1: keep polygon layer in sync with existingPolygon ───────────────

  useEffect(() => {
    // Remove old layer whenever existingPolygon changes.
    if (polygonLayerRef.current) {
      polygonLayerRef.current.remove()
      polygonLayerRef.current = null
    }

    if (!existingPolygon) return

    const layer = L.geoJSON(existingPolygon, { style: POLYGON_STYLE })
    layer.addTo(map)
    polygonLayerRef.current = layer

    return () => {
      layer.remove()
      if (polygonLayerRef.current === layer) polygonLayerRef.current = null
    }
  }, [existingPolygon, map]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 2: react to drawMode changes ────────────────────────────────────

  useEffect(() => {
    if (!map.pm) return

    if (drawMode === 'drawing') {
      // Remove existing polygon so drawing starts fresh.
      if (polygonLayerRef.current) {
        polygonLayerRef.current.remove()
        polygonLayerRef.current = null
      }

      // Hide Geoman's own toolbar — we control everything via buttons in the form.
      map.pm.addControls({ position: 'topleft', drawPolygon: false } as Parameters<typeof map.pm.addControls>[0])

      map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20,
        allowSelfIntersection: false,
        continueDrawing: false,
      } as Parameters<typeof map.pm.enableDraw>[1])

      function handleCreate(e: { layer: L.Layer; shape: string }) {
        if (e.shape !== 'Polygon') return
        const drawnLayer = e.layer as L.Polygon

        // Build a styled permanent layer from the drawn shape.
        const feature = layerToFeature(drawnLayer)

        // Remove the Geoman-drawn layer (unstyled by default).
        drawnLayer.remove()
        map.pm.disableDraw()

        const styledLayer = L.geoJSON(feature, { style: POLYGON_STYLE })
        styledLayer.addTo(map)
        polygonLayerRef.current = styledLayer

        onPolygonCommitRef.current(feature)
        onDrawEndRef.current()
      }

      map.on('pm:create', handleCreate)

      return () => {
        map.off('pm:create', handleCreate)
        map.pm.disableDraw()
      }
    }

    if (drawMode === 'editing') {
      if (!polygonLayerRef.current) return

      // Update stroke to signal edit state visually.
      polygonLayerRef.current.setStyle(POLYGON_STYLE_EDITING)

      const editListeners: Array<{ layer: L.Layer; handler: () => void }> = []

      polygonLayerRef.current.eachLayer((inner) => {
        const poly = inner as L.Polygon
        poly.pm.enable({ allowSelfIntersection: false })

        function handleEdit() {
          onPolygonCommitRef.current(layerToFeature(poly))
        }

        poly.on('pm:edit', handleEdit)
        editListeners.push({ layer: poly, handler: handleEdit })
      })

      return () => {
        editListeners.forEach(({ layer, handler }) => {
          const poly = layer as L.Polygon
          poly.off('pm:edit', handler)
          poly.pm.disable()
        })
        polygonLayerRef.current?.setStyle(POLYGON_STYLE)
      }
    }

    // idle: disable everything
    map.pm.disableDraw()
    map.pm.disableGlobalEditMode()

  }, [drawMode, map]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 3: full cleanup on unmount ──────────────────────────────────────

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
