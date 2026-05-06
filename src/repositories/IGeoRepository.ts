import type { GeoProject, GeoPoint } from '../types'

export interface IGeoRepository {
  // Projects (authenticated)
  listProjects(): Promise<GeoProject[]>
  fetchProject(id: string): Promise<GeoProject | undefined>
  createProject(data: Partial<GeoProject>): Promise<GeoProject>
  saveProject(id: string, updates: Partial<GeoProject>): Promise<GeoProject>
  syncProject(id: string, project: Partial<GeoProject>, points: GeoPoint[]): Promise<GeoProject>
  removeProject(id: string): Promise<void>

  // Public (no auth — only published projects)
  fetchPublicProject(id: string): Promise<GeoProject | undefined>

  // Points (authenticated / editor)
  listPoints(projectId: string): Promise<GeoPoint[]>
  createPoint(data: Partial<GeoPoint> & { geoProjectId: string }): Promise<GeoPoint>
  savePoint(id: string, updates: Partial<GeoPoint>): Promise<GeoPoint>
  removePoint(id: string): Promise<void>

  // Points (public — lookiarUrl excluded from payload)
  listPublicPoints(projectId: string): Promise<GeoPoint[]>
  requestPointAccess(projectId: string, pointId: string, lat: number, lng: number): Promise<{ url: string }>
}
