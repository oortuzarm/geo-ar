import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from 'react-leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import { useGeoStore } from '../../store/geoStore'
import { haversineDistance } from '../../features/geolocation/haversine'
import GeoPointMarker from './GeoPointMarker'
import type { GeoPoint, PoiSearchResult, MapBounds } from '../../types'

function MapController() {
  const { mapCenter, mapZoom } = useGeoStore()
  const map = useMap()
  useEffect(() => {
    map.setView(mapCenter, mapZoom, { animate: true })
  }, [map, mapCenter, mapZoom])
  return null
}

interface ClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void
}

function ClickHandler({ onMapClick }: ClickHandlerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface MobileMapHandlerProps {
  onDoubleClick: (lat: number, lng: number) => void
}

function MobileMapHandler({ onDoubleClick }: MobileMapHandlerProps) {
  const map = useMap()

  useEffect(() => {
    map.doubleClickZoom.disable()
    return () => { map.doubleClickZoom.enable() }
  }, [map])

  useMapEvents({
    dblclick(e: LeafletMouseEvent) {
      onDoubleClick(e.latlng.lat, e.latlng.lng)
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

interface DashboardMapProps {
  points: GeoPoint[]
  selectedPointId: string | null
  onMapClick: (lat: number, lng: number) => void
  onMarkerClick: (id: string) => void
  onMarkerDragEnd: (id: string, lat: number, lng: number) => void
  poiResults?: PoiSearchResult[]
  onBoundsChange?: (bounds: MapBounds) => void
  onPoiCreate?: (result: PoiSearchResult) => void
  mobileMode?: boolean
  onMapDoubleClick?: (lat: number, lng: number) => void
}

export default function DashboardMap({
  points,
  selectedPointId,
  onMapClick,
  onMarkerClick,
  onMarkerDragEnd,
  poiResults = [],
  onBoundsChange,
  onPoiCreate,
  mobileMode = false,
  onMapDoubleClick,
}: DashboardMapProps) {
  const { mapCenter, mapZoom } = useGeoStore()

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      className="w-full h-full"
      style={{ width: '100%', height: '100%', background: '#111827', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController />
      <ClickHandler onMapClick={onMapClick} />
      {mobileMode && onMapDoubleClick && (
        <MobileMapHandler onDoubleClick={onMapDoubleClick} />
      )}
      {onBoundsChange && <BoundsTracker onBoundsChange={onBoundsChange} />}

      {points.map((point) => (
        <GeoPointMarker
          key={point.id}
          point={point}
          selected={point.id === selectedPointId}
          onClick={onMarkerClick}
          onDragEnd={onMarkerDragEnd}
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
