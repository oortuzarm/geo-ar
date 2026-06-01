/**
 * PolygonAreaLayer — renders a single polygon-mode point's activation area.
 *
 * Used for:
 *  - Unselected polygon-mode points in the editor map (red style).
 *  - Any polygon-mode point in the public map (style driven by selected/dimmed).
 *  - Intensity-GPS overlay (non-interactive, style driven by activity level).
 *
 * No draw or edit controls — purely visual + optional click-to-select.
 */

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { ActivationPolygon } from '../../types'

interface PolygonAreaLayerProps {
  polygon:       ActivationPolygon
  /** Called when the user clicks this polygon area. Omit for non-interactive overlays. */
  onClick?:      () => void
  /**
   * Optional Leaflet PathOptions that override the default red style.
   * When it changes (e.g. selection state), the layer style is updated
   * imperatively — no layer recreation needed.
   */
  pathOptions?:  L.PathOptions
  /**
   * Whether the layer captures pointer events. Default: true.
   * Pass false for background visualisation layers (e.g. intensity overlay)
   * so clicks pass through to the underlying map and markers.
   */
  interactive?:  boolean
}

const STYLE_DEFAULT: L.PathOptions = {
  color:       '#ef4444',
  fillColor:   '#ef4444',
  fillOpacity: 0.04,
  weight:      1,
  dashArray:   '4 4',
}

export default function PolygonAreaLayer({
  polygon,
  onClick,
  pathOptions,
  interactive = true,
}: PolygonAreaLayerProps) {
  const map        = useMap()
  const layerRef   = useRef<L.GeoJSON | null>(null)
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  // ── Create / recreate when the polygon geometry or interactive mode changes ─

  useEffect(() => {
    const style = pathOptions ?? STYLE_DEFAULT
    const layer = L.geoJSON(polygon, { style, interactive })

    if (interactive && onClick !== undefined) {
      layer.on('click', (e: L.LeafletMouseEvent) => {
        // Stop propagation so the map click handler doesn't deselect the point.
        L.DomEvent.stopPropagation(e)
        onClickRef.current?.()
      })
    }

    layer.addTo(map)
    layerRef.current = layer

    return () => {
      layer.off()
      layer.remove()
      layerRef.current = null
    }
  }, [polygon, interactive, map]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update style imperatively when selection / dim state changes ──────────
  // Avoids destroying and recreating the layer on every click.

  useEffect(() => {
    if (!layerRef.current) return
    layerRef.current.setStyle(pathOptions ?? STYLE_DEFAULT)
  }, [pathOptions])

  return null
}
