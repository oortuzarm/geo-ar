import type { IGeoRepository } from './IGeoRepository'
import type { GeoProject, GeoPoint } from '../types'
import { apiFetch, ApiError } from '../lib/apiFetch'
import { LocalGeoRepository } from './LocalGeoRepository'

export class RemoteGeoRepository implements IGeoRepository {
  private readonly base: string
  // Local IndexedDB used purely as an offline cache
  private readonly cache = new LocalGeoRepository()

  constructor(baseUrl: string) {
    this.base = baseUrl.replace(/\/$/, '')
  }

  private url(path: string) {
    return `${this.base}${path}`
  }

  // ── Projects ────────────────────────────────────────────────────────────────

  listProjects(): Promise<GeoProject[]> {
    return apiFetch<GeoProject[]>(this.url('/api/geo_projects'))
  }

  async fetchProject(id: string): Promise<GeoProject | undefined> {
    try {
      return await apiFetch<GeoProject>(this.url(`/api/geo_projects/${id}`))
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return undefined
      throw err
    }
  }

  async fetchPublicProject(id: string): Promise<GeoProject | undefined> {
    try {
      const proj = await apiFetch<GeoProject>(this.url(`/api/public/geo_projects/${id}`))
      void this.cacheProject(proj)
      return proj
    } catch (err) {
      // 404 = doesn't exist, 403 = not published → don't serve stale cache
      if (err instanceof ApiError && (err.status === 404 || err.status === 403)) throw err
      // Network failure → serve from cache if available
      console.warn('[RemoteGeoRepository] fetchPublicProject offline, trying cache. id:', id)
      return this.cache.fetchProject(id)
    }
  }

  createProject(data: Partial<GeoProject>): Promise<GeoProject> {
    return apiFetch<GeoProject>(this.url('/api/geo_projects'), {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  saveProject(id: string, updates: Partial<GeoProject>): Promise<GeoProject> {
    const hasImage = typeof updates.coverImage === 'string' && updates.coverImage.startsWith('data:')
    return apiFetch<GeoProject>(this.url(`/api/geo_projects/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updates),
      timeout: hasImage ? 30_000 : 15_000,
    })
  }

  syncProject(id: string, project: Partial<GeoProject>, points: GeoPoint[]): Promise<GeoProject> {
    const hasImage =
      (typeof project.coverImage === 'string' && project.coverImage.startsWith('data:')) ||
      points.some((p) => typeof p.image === 'string' && p.image.startsWith('data:'))
    return apiFetch<GeoProject>(this.url(`/api/geo_projects/${id}/sync`), {
      method: 'PATCH',
      body: JSON.stringify({ ...project, geoPoints: points }),
      timeout: hasImage ? 60_000 : 30_000,
    })
  }

  async removeProject(id: string): Promise<void> {
    await apiFetch<void>(this.url(`/api/geo_projects/${id}`), { method: 'DELETE' })
  }

  // ── Points ───────────────────────────────────────────────────────────────────

  async listPoints(projectId: string): Promise<GeoPoint[]> {
    const endpoint = this.url(`/api/geo_projects/${projectId}/geo_points`)
    console.log('[RemoteGeoRepository] listPoints →', endpoint)
    try {
      const points = await apiFetch<GeoPoint[]>(endpoint)
      void this.cachePoints(points)
      return points
    } catch (err) {
      // On explicit API errors (4xx/5xx) propagate; on network errors use cache
      if (err instanceof ApiError) throw err
      console.warn('[RemoteGeoRepository] listPoints offline, trying cache. projectId:', projectId)
      return this.cache.listPoints(projectId)
    }
  }

  createPoint(data: Partial<GeoPoint> & { geoProjectId: string }): Promise<GeoPoint> {
    return apiFetch<GeoPoint>(
      this.url(`/api/geo_projects/${data.geoProjectId}/geo_points`),
      { method: 'POST', body: JSON.stringify(data) },
    )
  }

  savePoint(id: string, updates: Partial<GeoPoint>): Promise<GeoPoint> {
    // Images are base64 strings that can be several hundred KB; allow extra time.
    const hasImage = typeof updates.image === 'string' && updates.image.startsWith('data:')
    return apiFetch<GeoPoint>(this.url(`/api/geo_points/${id}`), {
      method: 'PUT',
      body: JSON.stringify(updates),
      timeout: hasImage ? 30_000 : 15_000,
    })
  }

  async removePoint(id: string): Promise<void> {
    await apiFetch<void>(this.url(`/api/geo_points/${id}`), { method: 'DELETE' })
  }

  listPublicPoints(projectId: string): Promise<GeoPoint[]> {
    return apiFetch<GeoPoint[]>(this.url(`/api/public/geo_projects/${projectId}/geo_points`))
  }

  requestPointAccess(projectId: string, pointId: string, lat: number, lng: number, accessMode?: string): Promise<{ url: string }> {
    // Send the browser's local time and day so the backend can validate the
    // schedule using the same clock as the frontend (avoids UTC vs local-time divergence).
    const now = new Date()
    const hh  = String(now.getHours()).padStart(2, '0')
    const mm  = String(now.getMinutes()).padStart(2, '0')
    const localTime = `${hh}:${mm}`
    const localDay  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][now.getDay()]

    return apiFetch<{ url: string }>(
      this.url(`/api/public/geo_projects/${projectId}/geo_points/${pointId}/access`),
      { method: 'POST', body: JSON.stringify({ latitude: lat, longitude: lng, localTime, localDay, accessMode }) },
    )
  }

  // ── Cache helpers (fire-and-forget, never throw) ─────────────────────────────

  private async cacheProject(proj: GeoProject): Promise<void> {
    try {
      const { getDB } = await import('../features/storage/db')
      const db = await getDB()
      await db.put('geo_projects', proj)
    } catch { /* non-critical */ }
  }

  private async cachePoints(points: GeoPoint[]): Promise<void> {
    try {
      const { getDB } = await import('../features/storage/db')
      const db = await getDB()
      await Promise.all(points.map((p) => db.put('geo_points', p)))
    } catch { /* non-critical */ }
  }
}
