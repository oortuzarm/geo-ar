export interface GeoProject {
  id: string
  title: string
  subtitle?: string
  description?: string
  coverImage?: string
  shareText?: string
  howToGet?: string
  status: 'draft' | 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  geoPointIds: string[]
}

export interface GeoPoint {
  id: string
  geoProjectId: string
  name: string
  lookiarUrl: string
  latitude: number
  longitude: number
  activationRadius: number
  image?: string
  description?: string
  instructions?: string
  buttonText?: string
  active: boolean
  order: number
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
