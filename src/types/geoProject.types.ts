import type { Feature, Polygon, MultiPolygon } from 'geojson'

export type ActivationMode = 'radius' | 'polygon'

/** GeoJSON Feature wrapping a Polygon or MultiPolygon used as an activation zone. */
export type ActivationPolygon = Feature<Polygon | MultiPolygon>

export type PublicInitialViewMode = 'fit_points' | 'user_location' | 'custom'

export interface GeoProject {
  id: string
  userId?: string | null  // Owner — normalized from user_id; may be absent on old backends
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
  // Community map
  communityEnabled?: boolean
  communityStatus?: 'pending' | 'approved' | 'rejected' | 'hidden'
}

export interface GeoPointAvailability {
  scheduleEnabled?: boolean
  scheduleDays?: string[]     // ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  scheduleStartTime?: string  // 'HH:MM'
  scheduleEndTime?: string    // 'HH:MM'
  quotaEnabled?: boolean
  quotaLimit?: number
  quotaUsed?: number          // reserved for future backend tracking
  liveVisitsEnabled?: boolean
  liveVisitsMinimum?: number  // minimum active people required to unlock
}

// ── Content types ─────────────────────────────────────────────────────────────

export type ContentType = 'url' | 'video' | 'audio' | 'file'

// ── Destination categories (only relevant when contentType === 'url') ─────────

export type DestinationCategory =
  | 'website'
  | 'whatsapp'
  | 'form'
  | 'reservation'
  | 'ecommerce'
  | 'social'
  | 'map'
  | 'coupon'
  | 'custom'

export interface UrlContentData {
  url: string
}

export interface MediaContentData {
  file_url:  string
  file_name: string
  mime_type: string
}

export type ContentData = UrlContentData | MediaContentData

// Discriminated union returned by the /access endpoint after validation.
export type AccessResponse =
  | { success: true; content_type: 'url';                       url: string }
  | { success: true; content_type: 'video' | 'audio' | 'file'; file_url: string; file_name: string; mime_type: string }

// ── GeoPoint images ───────────────────────────────────────────────────────────

export interface PointImage {
  id: string
  url: string
  isCover: boolean
  position: number
}

// ── GeoPoint ──────────────────────────────────────────────────────────────────

export interface GeoPoint {
  id: string
  geoProjectId: string
  name: string
  lookiarUrl?: string           // legacy field — kept for backward compat
  contentType?: ContentType
  contentData?: ContentData     // excluded from public API; only returned after /access
  destinationCategory?: DestinationCategory  // only set when contentType === 'url'
  latitude: number
  longitude: number
  activationRadius: number
  image?: string           // legacy single cover image — superseded by images[]
  images?: PointImage[]
  description?: string
  instructions?: string
  buttonText?: string
  active: boolean
  order: number
  availability?: GeoPointAvailability
  accessMode?: 'restricted' | 'open'
  requiresDwellTime?: boolean
  dwellTimeSeconds?: number
  createdAt?: string
  /** Determines whether activation is based on a circular radius or a drawn polygon. Defaults to 'radius'. */
  activationMode?: ActivationMode
  /** GeoJSON Feature defining the activation zone. Only relevant when activationMode === 'polygon'. */
  activationPolygon?: ActivationPolygon
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
