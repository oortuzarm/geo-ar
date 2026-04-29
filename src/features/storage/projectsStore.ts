import { v4 as uuid } from 'uuid'
import { getDB } from './db'
import type { GeoProject } from '../../types'

export async function getAllProjects(): Promise<GeoProject[]> {
  const db = await getDB()
  return db.getAll('geo_projects')
}

export async function getProject(id: string): Promise<GeoProject | undefined> {
  const db = await getDB()
  return db.get('geo_projects', id)
}

export async function createProject(data: Partial<GeoProject> = {}): Promise<GeoProject> {
  const db = await getDB()
  const now = new Date().toISOString()
  const project: GeoProject = {
    id: uuid(),
    title: data.title ?? 'Nuevo proyecto GPS',
    subtitle: data.subtitle,
    description: data.description,
    coverImage: data.coverImage,
    howToGet: data.howToGet,
    status: data.status ?? 'draft',
    createdAt: now,
    updatedAt: now,
    geoPointIds: [],
  }
  await db.put('geo_projects', project)
  return project
}

export async function updateProject(id: string, updates: Partial<GeoProject>): Promise<GeoProject> {
  const db = await getDB()
  const existing = await db.get('geo_projects', id)
  if (!existing) throw new Error(`Proyecto ${id} no encontrado`)
  const updated: GeoProject = { ...existing, ...updates, id, updatedAt: new Date().toISOString() }
  await db.put('geo_projects', updated)
  return updated
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('geo_projects', id)
}
