/**
 * Capa de servicio para GeoProjects.
 *
 * Delega en el repositorio activo, elegido por VITE_API_URL:
 *   - VITE_API_URL definida → RemoteGeoRepository (HTTP API)
 *   - VITE_API_URL ausente  → LocalGeoRepository  (IndexedDB)
 *
 * Endpoints remotos esperados:
 *   GET    /api/geo-projects
 *   POST   /api/geo-projects
 *   GET    /api/geo-projects/:id
 *   PUT    /api/geo-projects/:id
 *   DELETE /api/geo-projects/:id
 *   GET    /api/public/geo-projects/:id  ← sin autenticación
 */

import type { GeoProject } from '../types'
import { repository } from '../repositories'

export function listProjects(): Promise<GeoProject[]> {
  return repository.listProjects()
}

export function fetchProject(id: string): Promise<GeoProject | undefined> {
  return repository.fetchProject(id)
}

export function fetchPublicProject(id: string): Promise<GeoProject | undefined> {
  return repository.fetchPublicProject(id)
}

export function createProject(data: Partial<GeoProject> = {}): Promise<GeoProject> {
  return repository.createProject(data)
}

export function saveProject(id: string, updates: Partial<GeoProject>): Promise<GeoProject> {
  return repository.saveProject(id, updates)
}

export function removeProject(id: string): Promise<void> {
  return repository.removeProject(id)
}
