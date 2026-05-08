/**
 * Capa de servicio para GeoPoints.
 *
 * Delega en el repositorio activo, elegido por VITE_API_URL:
 *   - VITE_API_URL definida → RemoteGeoRepository (HTTP API)
 *   - VITE_API_URL ausente  → LocalGeoRepository  (IndexedDB)
 *
 * Endpoints remotos esperados:
 *   GET    /api/geo-projects/:id/geo-points
 *   POST   /api/geo-projects/:id/geo-points
 *   PUT    /api/geo-points/:id
 *   DELETE /api/geo-points/:id
 */

import type { GeoPoint } from '../types'
import { repository } from '../repositories'

export function listPoints(geoProjectId: string): Promise<GeoPoint[]> {
  return repository.listPoints(geoProjectId)
}

export function createPoint(
  data: Partial<GeoPoint> & { geoProjectId: string },
): Promise<GeoPoint> {
  return repository.createPoint(data)
}

export function savePoint(id: string, updates: Partial<GeoPoint>): Promise<GeoPoint> {
  return repository.savePoint(id, updates)
}

export function removePoint(id: string): Promise<void> {
  return repository.removePoint(id)
}

export function listPublicPoints(projectId: string): Promise<GeoPoint[]> {
  return repository.listPublicPoints(projectId)
}

export function requestPointAccess(
  projectId: string,
  pointId: string,
  lat: number,
  lng: number,
  accessMode?: string,
): Promise<{ url: string }> {
  return repository.requestPointAccess(projectId, pointId, lat, lng, accessMode)
}
