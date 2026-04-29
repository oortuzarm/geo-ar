import { openDB, type IDBPDatabase } from 'idb'
import type { GeoProject, GeoPoint } from '../../types'

const DB_NAME = 'geo-ar-db'
const DB_VERSION = 1

export type GeoARDB = {
  geo_projects: {
    key: string
    value: GeoProject
    indexes: { by_status: string }
  }
  geo_points: {
    key: string
    value: GeoPoint
    indexes: { by_project: string }
  }
}

let _db: IDBPDatabase<GeoARDB> | null = null

export async function getDB(): Promise<IDBPDatabase<GeoARDB>> {
  if (_db) return _db

  _db = await openDB<GeoARDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('geo_projects')) {
        const projectStore = db.createObjectStore('geo_projects', { keyPath: 'id' })
        projectStore.createIndex('by_status', 'status')
      }
      if (!db.objectStoreNames.contains('geo_points')) {
        const pointStore = db.createObjectStore('geo_points', { keyPath: 'id' })
        pointStore.createIndex('by_project', 'geoProjectId')
      }
    },
  })

  return _db
}
