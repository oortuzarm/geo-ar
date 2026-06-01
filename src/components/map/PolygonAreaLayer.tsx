/**
 * PolygonAreaLayer — renders a single polygon-mode point's activation area.
 *
 * Used for UNSELECTED polygon-mode points in the editor map.
 * No draw or edit controls — purely visual + click-to-select.
 */

import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import type { ActivationPolygon } from '../../types'

interface PolygonAreaLayerProps {
  polygon: ActivationPolygon
  /** Called when the user clicks this polygon area. */
  onClick: () => void
}

const STYLE: L.PathOptions = {
  color:       '#ef4444',
  fillColor:   '#ef4444',
  fillOpacity: 0.04,
  weight:      1,
  dashArray:   '4 4',
}

export default function PolygonAreaLayer({ polygon, onClick }: PolygonAreaLayerProps) {
  const map      = useMap()
  const layerRef = useRef<L.GeoJSON | null>(null)
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  useEffect(() => {
    const layer = L.geoJSON(polygon, { style: STYLE, interactive: true })

    layer.on('click', (e: L.LeafletMouseEvent) => {
      // Stop propagation so the map click handler doesn't deselect the point.
      L.DomEvent.stopPropagation(e)
      onClickRef.current()
    })

    layer.addTo(map)
    layerRef.current = layer

    return () => {
      layer.off()
      layer.remove()
      layerRef.current = null
    }
  }, [polygon, map]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
