export type PublicInitialViewMode = 'fit_points' | 'user_location' | 'custom'

export interface GeoProject {
  id: string
  title: string
  subtitle?: string
  description?: string
  coverImage?: string
  shareText?: string
  markerImage?: string
  howToGet?: string
  status: 'draft' | 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  geoPointIds: string[]
  // Public initial map view
  publicInitialViewMode?: PublicInitialViewMode
  publicInitialCenterLat?: number
  publicInitialCenterLng?: number
  publicInitialZoom?: number
}

export interface GeoPointAvailability {
  scheduleEnabled?: boolean
  scheduleDays?: string[]     // ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  scheduleStartTime?: string  // 'HH:MM'
  scheduleEndTime?: string    // 'HH:MM'
  quotaEnabled?: boolean
  quotaLimit?: number
  quotaUsed?: number          // reserved for future backend tracking
}

export interface GeoPoint {
  id: string
  geoProjectId: string
  name: string
  lookiarUrl?: string
  latitude: number
  longitude: number
  activationRadius: number
  image?: string
  description?: string
  instructions?: string
  buttonText?: string
  active: boolean
  order: number
  availability?: GeoPointAvailability
  accessMode?: 'restricted' | 'open'
}

export type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  boundingbox: string[]
}

export type LocationStatus = 'idle' | 'requesting' | 'active' | 'denied' | 'unavailable'

export type MapBounds = {
  north: number
  south: number
  east: number
  west: number
}

export type PoiSearchResult = {
  id: string
  name: string
  displayName: string
  lat: number
  lng: number
  category?: string
  source: 'overpass' | 'nominatim'
}

export type UserLocation = {
  latitude: number
  longitude: number
  accuracy: number
}
