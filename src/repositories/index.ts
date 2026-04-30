import type { IGeoRepository } from './IGeoRepository'
import { LocalGeoRepository } from './LocalGeoRepository'
import { RemoteGeoRepository } from './RemoteGeoRepository'

const API_URL = import.meta.env.VITE_API_URL as string | undefined
const IS_PROD = import.meta.env.PROD

// Debug — remove once sync is confirmed working
console.log('[GeoAR] VITE_API_URL:', API_URL)
console.log('[GeoAR] MODE:', import.meta.env.MODE)
console.log('[GeoAR] PROD:', IS_PROD)

function buildRepository(): IGeoRepository {
  if (IS_PROD) {
    if (!API_URL) {
      const msg = '[GeoAR] Missing VITE_API_URL in production. Set it in Vercel → Settings → Environment Variables.'
      console.error(msg)
      throw new Error(msg)
    }
    return new RemoteGeoRepository(API_URL)
  }
  // Development: use remote if configured, otherwise IndexedDB
  return API_URL ? new RemoteGeoRepository(API_URL) : new LocalGeoRepository()
}

export const repository: IGeoRepository = buildRepository()

console.log('[GeoAR] Repository:', repository.constructor.name)

export type { IGeoRepository }
