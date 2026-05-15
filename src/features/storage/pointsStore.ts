import { v4 as uuid } from 'uuid'
import { getDB } from './db'
import type { GeoPoint } from '../../types'

export async function getPointsByProject(geoProjectId: string): Promise<GeoPoint[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('geo_points', 'by_project', geoProjectId)
  return all.sort((a, b) => a.order - b.order)
}

export async function getPoint(id: string): Promise<GeoPoint | undefined> {
  const db = await getDB()
  return db.get('geo_points', id)
}

export async function createPoint(data: Partial<GeoPoint> & { geoProjectId: string }): Promise<GeoPoint> {
  const db = await getDB()
  const point: GeoPoint = {
    id: uuid(),
    geoProjectId: data.geoProjectId,
    name: data.name ?? 'Nuevo punto',
    lookiarUrl: data.lookiarUrl ?? '',
    contentType: data.contentType ?? 'url',
    contentData: data.contentData ?? { url: '' },
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    activationRadius: data.activationRadius ?? 50,
    image: data.image,
    description: data.description,
    active: data.active ?? true,
    order: data.order ?? 0,
  }
  await db.put('geo_points', point)
  return point
}

export async function updatePoint(id: string, updates: Partial<GeoPoint>): Promise<GeoPoint> {
  const db = await getDB()
  const existing = await db.get('geo_points', id)
  if (!existing) throw new Error(`Punto ${id} no encontrado`)
  const updated: GeoPoint = { ...existing, ...updates, id }
  await db.put('geo_points', updated)
  return updated
}

export async function deletePoint(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('geo_points', id)
}
