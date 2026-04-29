/**
 * Capa de servicio para GeoProjects.
 *
 * HOY: usa IndexedDB (local).
 * FUTURO: reemplazar cada función con un fetch() al endpoint de Lookiar:
 *   GET    /geo_projects
 *   POST   /geo_projects
 *   GET    /geo_projects/:id
 *   PUT    /geo_projects/:id
 *   DELETE /geo_projects/:id
 *
 * Los componentes NUNCA importan directamente la capa de storage.
 */

import type { GeoProject } from '../types'
import * as local from '../features/storage/projectsStore'

export async function listProjects(): Promise<GeoProject[]> {
  // FUTURE: return fetch('/api/geo_projects').then(r => r.json())
  return local.getAllProjects()
}

export async function fetchProject(id: string): Promise<GeoProject | undefined> {
  // FUTURE: return fetch(`/api/geo_projects/${id}`).then(r => r.json())
  return local.getProject(id)
}

export async function createProject(data: Partial<GeoProject> = {}): Promise<GeoProject> {
  // FUTURE: return fetch('/api/geo_projects', { method:'POST', body: JSON.stringify(data) }).then(r=>r.json())
  return local.createProject(data)
}

export async function saveProject(id: string, updates: Partial<GeoProject>): Promise<GeoProject> {
  // FUTURE: return fetch(`/api/geo_projects/${id}`, { method:'PUT', body: JSON.stringify(updates) }).then(r=>r.json())
  return local.updateProject(id, updates)
}

export async function removeProject(id: string): Promise<void> {
  // FUTURE: return fetch(`/api/geo_projects/${id}`, { method:'DELETE' })
  return local.deleteProject(id)
}
