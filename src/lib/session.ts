const KEY     = 'ubyca:session_id'
const LEGACY_ANALYTICS = 'analytics:session_id'
const LEGACY_LV        = 'lv_session_id'

/**
 * Returns the single canonical session ID for this browser/project visitor.
 *
 * Migration order (runs once, then the new key is used directly):
 *   1. ubyca:session_id already exists → return it.
 *   2. analytics:session_id exists → adopt it, delete legacy key.
 *   3. lv_session_id exists → adopt it, delete legacy key.
 *   4. Generate a new UUID and store it.
 *
 * After migration both legacy keys are deleted so future calls hit step 1.
 */
export function getSessionId(): string {
  const existing = localStorage.getItem(KEY)
  if (existing) return existing

  const fromAnalytics = localStorage.getItem(LEGACY_ANALYTICS)
  if (fromAnalytics) {
    localStorage.setItem(KEY, fromAnalytics)
    localStorage.removeItem(LEGACY_ANALYTICS)
    localStorage.removeItem(LEGACY_LV)
    return fromAnalytics
  }

  const fromLv = localStorage.getItem(LEGACY_LV)
  if (fromLv) {
    localStorage.setItem(KEY, fromLv)
    localStorage.removeItem(LEGACY_LV)
    return fromLv
  }

  const id = crypto.randomUUID()
  localStorage.setItem(KEY, id)
  return id
}
