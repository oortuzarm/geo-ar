import type { IGeoRepository } from './IGeoRepository'
import type { GeoProject, GeoPoint } from '../types'
import * as projectsStore from '../features/storage/projectsStore'
import * as pointsStore from '../features/storage/pointsStore'

export class LocalGeoRepository implements IGeoRepository {
  listProjects() { return projectsStore.getAllProjects() }
  fetchProject(id: string) { return projectsStore.getProject(id) }
  // In local mode, public and private access are identical (no auth layer)
  fetchPublicProject(id: string) { return projectsStore.getProject(id) }
  createProject(data: Partial<GeoProject>) { return projectsStore.createProject(data) }
  saveProject(id: string, updates: Partial<GeoProject>) { return projectsStore.updateProject(id, updates) }
  removeProject(id: string) { return projectsStore.deleteProject(id) }

  listPoints(projectId: string) { return pointsStore.getPointsByProject(projectId) }
  createPoint(data: Partial<GeoPoint> & { geoProjectId: string }) { return pointsStore.createPoint(data) }
  savePoint(id: string, updates: Partial<GeoPoint>) { return pointsStore.updatePoint(id, updates) }
  removePoint(id: string) { return pointsStore.deletePoint(id) }

  async syncProject(id: string, project: Partial<GeoProject>, points: GeoPoint[]): Promise<GeoProject> {
    const updated = await projectsStore.updateProject(id, project)
    await Promise.all(points.map((pt) => pointsStore.updatePoint(pt.id, pt)))
    return updated
  }

  // In local/dev mode, public and editor access are identical.
  listPublicPoints(projectId: string): Promise<GeoPoint[]> {
    return pointsStore.getPointsByProject(projectId)
  }

  async requestPointAccess(projectId: string, pointId: string, _lat: number, _lng: number, _accessMode?: string) {
    const points = await pointsStore.getPointsByProject(projectId)
    const point  = points.find((p) => p.id === pointId)
    if (!point) throw new Error('Punto no encontrado')
    const ct = point.contentType ?? 'url'
    if (ct !== 'url' && point.contentData && 'file_url' in point.contentData) {
      const d = point.contentData as import('../types').MediaContentData
      return { success: true as const, content_type: ct as 'video' | 'audio' | 'file', file_url: d.file_url, file_name: d.file_name, mime_type: d.mime_type }
    }
    return { success: true as const, content_type: 'url' as const, url: point.lookiarUrl ?? '' }
  }
}
