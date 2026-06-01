import { useEffect, useRef } from 'react'
import { MapContainer, CircleMarker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useGeoStore } from '../../store/geoStore'
import type { Map as LeafletMap } from 'leaflet'
import { haversineDistance } from '../../features/geolocation/haversine'
import GeoPointMarker from './GeoPointMarker'
import IntensityLayer from './IntensityLayer'
import PolygonDrawLayer from './PolygonDrawLayer'
import PolygonAreaLayer from './PolygonAreaLayer'
import type { PolygonDrawMode, PolygonMoveFn } from './PolygonDrawLayer'
import type { GeoPoint, PoiSearchResult, MapBounds, ActivationPolygon } from '../../types'
import { type MapStyleId } from '../../config/mapStyles'
import BaseMapLayer from './BaseMapLayer'

function MapController() {
  const { mapCenter, mapZoom } = useGeoStore()
  const map = useMap()
  useEffect(() => {
    map.setView(mapCenter, mapZoom, { animate: true })
  }, [map, mapCenter, mapZoom])
  return null
}

// Tracks the real map view (pan + zoom) as the user moves around, without
// feeding back into MapController (which would cause a setView loop).
function MapViewTracker() {
  const { setLastKnownMapView } = useGeoStore()
  const mapRef = useRef<LeafletMap | null>(null)

  const map = useMapEvents({
    moveend() { snapshot(map) },
    zoomend() { snapshot(map) },
  })

  function snapshot(m: LeafletMap) {
    const c = m.getCenter()
    setLastKnownMapView({ center: [c.lat, c.lng], zoom: m.getZoom() })
  }

  useEffect(() => {
    mapRef.current = map
    snapshot(map)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

interface ClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void
}

function ClickHandler({ onMapClick, disabled }: ClickHandlerProps & { disabled?: boolean }) {
  useMapEvents({
    click(e) {
      if (disabled) return
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface DblClickHandlerProps {
  onMapDblClick: (lat: number, lng: number) => void
}

function DblClickHandler({ onMapDblClick, disabled }: DblClickHandlerProps & { disabled?: boolean }) {
  useMapEvents({
    dblclick(e) {
      if (disabled) return
      onMapDblClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface BoundsTrackerProps {
  onBoundsChange: (bounds: MapBounds) => void
}

function BoundsTracker({ onBoundsChange }: BoundsTrackerProps) {
  const onBoundsChangeRef = useRef(onBoundsChange)
  onBoundsChangeRef.current = onBoundsChange

  const map = useMapEvents({
    moveend() {
      const b = map.getBounds()
      onBoundsChangeRef.current({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      })
    },
  })

  useEffect(() => {
    const b = map.getBounds()
    onBoundsChangeRef.current({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    })
  }, [map])

  return null
}

interface UserPos { lat: number; lng: number; accuracy: number }

function UserLocationLayer({ userPos }: { userPos: UserPos | null }) {
  const map = useMap()
  const dotRef = useRef<L.CircleMarker | null>(null)

  useEffect(() => {
    if (!userPos) {
      dotRef.current?.remove()
      dotRef.current = null
      return
    }
    const latlng: L.LatLngExpression = [userPos.lat, userPos.lng]
    if (dotRef.current) {
      dotRef.current.setLatLng(latlng)
    } else {
      dotRef.current = L.circleMarker(latlng, {
        radius: 8,
        color: '#ffffff', weight: 2.5,
        fillColor: '#2196F3', fillOpacity: 1,
        interactive: false,
      }).addTo(map)
    }
  }, [userPos, map])

  useEffect(() => () => { dotRef.current?.remove() }, [])
  return null
}

interface DashboardMapProps {
  points: GeoPoint[]
  selectedPointId: string | null
  onMapClick: (lat: number, lng: number) => void
  onMapDblClick: (lat: number, lng: number) => void
  onMarkerClick: (id: string) => void
  onMarkerDragEnd: (id: string, lat: number, lng: number) => void
  poiResults?: PoiSearchResult[]
  onBoundsChange?: (bounds: MapBounds) => void
  onPoiCreate?: (result: PoiSearchResult) => void
  userPos?: UserPos | null
  mapStyleId?: MapStyleId
  intensityActiveNow?: Record<string, number>
  intensityMode?: 'live' | 'historical'
  hidePoints?: boolean
  // ── Polygon drawing ──────────────────────────────────────────────────────
  polygonDrawMode?: PolygonDrawMode
  polygonForPoint?: ActivationPolygon | undefined
  onPolygonCommit?: (polygon: ActivationPolygon) => void
  onPolygonDrawEnd?: () => void
  onPolygonDrawCancel?: () => void
  /** Increment to force PolygonDrawLayer to rebuild the polygon layer (used on cancel). */
  polygonRenderKey?: number
}

export default function DashboardMap({
  points,
  selectedPointId,
  onMapClick,
  onMapDblClick,
  onMarkerClick,
  onMarkerDragEnd,
  poiResults = [],
  onBoundsChange,
  onPoiCreate,
  userPos = null,
  mapStyleId = 'streets',
  intensityActiveNow,
  intensityMode = 'live',
  hidePoints = false,
  polygonDrawMode = 'idle',
  polygonForPoint,
  onPolygonCommit,
  onPolygonDrawEnd,
  onPolygonDrawCancel,
  polygonRenderKey = 0,
}: DashboardMapProps) {
  const drawingActive = polygonDrawMode !== 'idle'
  const { mapCenter, mapZoom } = useGeoStore()

  // Shared ref populated by PolygonDrawLayer on mount; consumed by GeoPointMarker
  // during pin drag so both pin and polygon move simultaneously at 60 fps.
  const polygonMoveRef = useRef<PolygonMoveFn | null>(null)

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      maxZoom={20}
      doubleClickZoom={false}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', background: '#111827', zIndex: 0 }}
    >
      <BaseMapLayer key={mapStyleId} styleId={mapStyleId} />
      <MapController />
      <MapViewTracker />
      <ClickHandler onMapClick={onMapClick} disabled={drawingActive} />
      <DblClickHandler onMapDblClick={onMapDblClick} disabled={drawingActive} />
      {/* Unselected polygon-mode points — red, click-to-select only */}
      {points
        .filter((p) =>
          (p.activationMode ?? 'radius') === 'polygon' &&
          p.activationPolygon != null &&
          p.id !== selectedPointId,
        )
        .map((p) => (
          <PolygonAreaLayer
            key={p.id}
            polygon={p.activationPolygon!}
            onClick={() => onMarkerClick(p.id)}
          />
        ))}

      {/* Selected point's polygon — cyan, draw/edit/drag controls */}
      {onPolygonCommit && onPolygonDrawEnd && (
        <PolygonDrawLayer
          drawMode={polygonDrawMode}
          existingPolygon={polygonForPoint}
          isSelected
          renderKey={polygonRenderKey}
          onPolygonCommit={onPolygonCommit}
          onDrawEnd={onPolygonDrawEnd}
          onDrawCancel={onPolygonDrawCancel}
          onMoveRefReady={(fn) => { polygonMoveRef.current = fn }}
        />
      )}
      {onBoundsChange && <BoundsTracker onBoundsChange={onBoundsChange} />}
      <UserLocationLayer userPos={userPos} />

      {intensityActiveNow && (
        <IntensityLayer points={points} activeNow={intensityActiveNow} mode={intensityMode} />
      )}

      {points.map((point) => (
        <GeoPointMarker
          key={point.id}
          point={point}
          selected={point.id === selectedPointId}
          onClick={onMarkerClick}
          onDragEnd={onMarkerDragEnd}
          hidden={hidePoints}
          onPolygonDrag={
            (point.activationMode ?? 'radius') === 'polygon' && point.id === selectedPointId
              ? (delta) => polygonMoveRef.current?.(delta)
              : undefined
          }
        />
      ))}

      {/* POI search result markers */}
      {poiResults.map((poi) => {
        const alreadyCreated = points.some(
          (p) => haversineDistance(p.latitude, p.longitude, poi.lat, poi.lng) < 10,
        )
        return (
          <CircleMarker
            key={poi.id}
            center={[poi.lat, poi.lng]}
            radius={8}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <p className="font-semibold">{poi.name}</p>
                {poi.displayName !== poi.name && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug max-w-[220px]">
                    {poi.displayName}
                  </p>
                )}
                {poi.category && (
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{poi.category}</p>
                )}
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {alreadyCreated ? (
                    <span className="text-xs text-gray-400">✓ Ya creado como punto GPS</span>
                  ) : onPoiCreate ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onPoiCreate(poi)
                      }}
                      className="text-xs font-medium text-sky-600 hover:text-sky-500 transition-colors"
                    >
                      + Crear punto GPS
                    </button>
                  ) : null}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
