/**
 * Persistent record of GeoPoints the user has successfully unlocked.
 * Keyed by `${geoProjectId}:${pointId}` → `updatedAt` ISO string.
 * If the point's updatedAt changes (i.e., it was edited), the record is stale
 * and `isPointUnlocked` returns false, causing re-evaluation.
 */

const STORAGE_KEY = 'geo_ar_unlocked_points'

type UnlockedStore = Record<string, string>

function load(): UnlockedStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UnlockedStore) : {}
  } catch {
    return {}
  }
}

function save(store: UnlockedStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {}
}

export function markPointUnlocked(geoProjectId: string, pointId: string, updatedAt: string): void {
  const store = load()
  store[`${geoProjectId}:${pointId}`] = updatedAt
  save(store)
}

export function isPointUnlocked(
  geoProjectId: string,
  pointId: string,
  updatedAt: string | undefined,
): boolean {
  if (!updatedAt) return false
  try {
    return load()[`${geoProjectId}:${pointId}`] === updatedAt
  } catch {
    return false
  }
}
