import type { IGeoRepository } from './IGeoRepository'
import { LocalGeoRepository } from './LocalGeoRepository'
import { RemoteGeoRepository } from './RemoteGeoRepository'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

console.log('[GeoAR] VITE_API_URL:', API_URL)
console.log('[GeoAR] PROD:', import.meta.env.PROD)

if (import.meta.env.PROD && !API_URL) {
  throw new Error('Missing VITE_API_URL in production')
}

export const repository: IGeoRepository = import.meta.env.PROD
  ? new RemoteGeoRepository(API_URL!)
  : API_URL ? new RemoteGeoRepository(API_URL) : new LocalGeoRepository()

console.log('[GeoAR] Repository:', repository.constructor.name)

export type { IGeoRepository }
