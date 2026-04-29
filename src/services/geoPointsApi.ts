/**
 * Capa de servicio para GeoPoints.
 *
 * HOY: usa IndexedDB (local).
 * FUTURO: reemplazar cada función con un fetch() al endpoint de Lookiar:
 *   POST   /geo_projects/:id/geo_points
 *   PUT    /geo_points/:id
 *   DELETE /geo_points/:id
 *   GET    /geo_projects/:id/public  → incluye los puntos activos
 *
 * Los componentes NUNCA importan directamente la capa de storage.
 */

import type { GeoPoint } from '../types'
import * as local from '../features/storage/pointsStore'

export async function listPoints(geoProjectId: string): Promise<GeoPoint[]> {
  // FUTURE: return fetch(`/api/geo_projects/${geoProjectId}/geo_points`).then(r => r.json())
  return local.getPointsByProject(geoProjectId)
}

export async function fetchPoint(id: string): Promise<GeoPoint | undefined> {
  // FUTURE: return fetch(`/api/geo_points/${id}`).then(r => r.json())
  return local.getPoint(id)
}

export async function createPoint(
  data: Partial<GeoPoint> & { geoProjectId: string },
): Promise<GeoPoint> {
  // FUTURE: return fetch(`/api/geo_projects/${data.geoProjectId}/geo_points`, {
  //   method: 'POST', body: JSON.stringify(data)
  // }).then(r => r.json())
  return local.createPoint(data)
}

export async function savePoint(id: string, updates: Partial<GeoPoint>): Promise<GeoPoint> {
  // FUTURE: return fetch(`/api/geo_points/${id}`, { method:'PUT', body: JSON.stringify(updates) }).then(r=>r.json())
  return local.updatePoint(id, updates)
}

export async function removePoint(id: string): Promise<void> {
  // FUTURE: return fetch(`/api/geo_points/${id}`, { method:'DELETE' })
  return local.deletePoint(id)
}
