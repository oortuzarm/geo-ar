/**
 * Single source of truth for geo-point access eligibility.
 *
 * ALL components that render availability status (chips, badges, CTA buttons)
 * MUST call computePointAvailability() and consume the returned object.
 * No component should re-implement schedule or quota checks independently.
 *
 * Timezone: every date/time call uses the browser's local clock via new Date()
 * + getDay() / getHours() / getMinutes().  Nothing UTC-implicit.
 */

import type { GeoPoint } from '../../types'

// ── Day label helpers ─────────────────────────────────────────────────────────

const WEEK_DAYS_INDEX = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const DAY_ORDER       = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DAY_FULL: Record<string, string> = {
  Lun: 'Lunes', Mar: 'Martes', Mié: 'Miércoles',
  Jue: 'Jueves', Vie: 'Viernes', Sáb: 'Sábado', Dom: 'Domingo',
}

export function formatDays(days: string[]): string {
  if (!days.length || days.length === 7) return 'Todos los días'
  const sorted = [...days].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
  const first = sorted[0]
  const last  = sorted[sorted.length - 1]
  if (DAY_ORDER.indexOf(last) - DAY_ORDER.indexOf(first) === days.length - 1)
    return days.length === 1
      ? (DAY_FULL[first] ?? first)
      : `${DAY_FULL[first] ?? first} a ${DAY_FULL[last] ?? last}`
  return sorted.map((d) => DAY_FULL[d] ?? d).join(', ')
}

// ── Public types ──────────────────────────────────────────────────────────────

export type BlockedReason = 'no-location' | 'radius' | 'schedule' | 'quota' | null

export interface PointAvailability {
  // ── Core access gate — the ONLY canAccess flag any component should use ──
  canAccess:      boolean
  /**
   * Whether the CTA button should be interactive.
   * Equals canAccess for "restricted" mode (default).
   * Always true for "open" mode — conditions are still shown but never block the button.
   */
  canActivate:    boolean
  blockedReason:  BlockedReason

  // ── Radius ───────────────────────────────────────────────────────────────
  insideRadius:   boolean
  /** Metres beyond the activation edge; null when no location fix. */
  distanceToEdge: number | null

  // ── Schedule ─────────────────────────────────────────────────────────────
  scheduleActive:    boolean
  scheduleAvailable: boolean
  /** Human-readable chip label derived from the current local time.
   *  "Disponible hasta las HH:MM"  when available and time-bounded.
   *  "Disponible desde las HH:MM"  when not yet open.
   *  "Disponible <día>"            when available but outside today.
   *  Empty string when scheduleActive === false.                           */
  scheduleLabel:     string
  scheduleDays:      string[]
  scheduleStartTime: string | undefined
  scheduleEndTime:   string | undefined

  // ── Quota ─────────────────────────────────────────────────────────────────
  quotaActive:    boolean
  quotaAvailable: boolean
  quotaLabel:     string
  quotaRemaining: number | undefined
  quotaTotal:     number | undefined
}

// ── Core computation ──────────────────────────────────────────────────────────

/**
 * Derives the complete access-eligibility state for one geo-point.
 *
 * @param point    - the GeoPoint record (availability sub-object included)
 * @param distance - straight-line Haversine distance in metres, or null if
 *                   the user's location is not yet known
 *
 * Call once per render and pass the result down to all child elements.
 * Do NOT call new Date() or check schedules anywhere else in the render tree.
 */
export function computePointAvailability(
  point: GeoPoint,
  distance: number | null,
): PointAvailability {

  // ── Radius ────────────────────────────────────────────────────────────────
  const insideRadius   = distance !== null && distance <= point.activationRadius
  const distanceToEdge = distance !== null
    ? Math.max(0, distance - point.activationRadius)
    : null

  // ── Schedule (local browser time — never UTC) ─────────────────────────────
  const av = point.availability

  let scheduleActive    = false
  let scheduleAvailable = true
  let scheduleLabel     = ''
  let scheduleDays: string[]       = []
  let scheduleStartTime: string | undefined
  let scheduleEndTime:   string | undefined

  if (av?.scheduleEnabled) {
    scheduleActive    = true
    scheduleDays      = av.scheduleDays ?? []
    scheduleStartTime = av.scheduleStartTime
    scheduleEndTime   = av.scheduleEndTime

    // All time comparisons use the device's local clock.
    const now   = new Date()
    const idx   = now.getDay()                          // 0 = Sunday … 6 = Saturday
    const today = WEEK_DAYS_INDEX[idx]
    const cur   = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dayOk = scheduleDays.length === 0 || scheduleDays.includes(today)

    // Returns "Disponible <when> [desde las HH:MM]" for the next open day.
    function nextAvailableLabel(prefix: string): string {
      for (let i = 1; i <= 7; i++) {
        const nl = WEEK_DAYS_INDEX[(idx + i) % 7]
        if (scheduleDays.length === 0 || scheduleDays.includes(nl)) {
          const when = i === 1 ? 'mañana' : `el ${DAY_FULL[nl] ?? nl}`
          return `${prefix} ${when}${scheduleStartTime ? ` desde las ${scheduleStartTime}` : ''}`
        }
      }
      return `Solo los ${formatDays(scheduleDays)}`
    }

    if (!dayOk) {
      scheduleAvailable = false
      scheduleLabel     = nextAvailableLabel('Disponible')
    } else if (scheduleStartTime && scheduleEndTime) {
      if (cur < scheduleStartTime) {
        scheduleAvailable = false
        scheduleLabel     = `Disponible desde las ${scheduleStartTime}`
      } else if (cur >= scheduleEndTime) {
        // At or past closing time — exclusive end: [start, end) is the open window.
        scheduleAvailable = false
        scheduleLabel     = nextAvailableLabel('Disponible')
      } else {
        // cur >= scheduleStartTime && cur < scheduleEndTime → open now.
        scheduleAvailable = true
        scheduleLabel     = `Disponible hasta las ${scheduleEndTime}`
      }
    } else {
      // Schedule enabled but no time window — open all day on allowed days.
      scheduleAvailable = true
      scheduleLabel     = 'Disponible hoy'
    }
  }

  // ── Quota ─────────────────────────────────────────────────────────────────
  let quotaActive    = false
  let quotaAvailable = true
  let quotaLabel     = ''
  let quotaRemaining: number | undefined
  let quotaTotal:     number | undefined

  if (av?.quotaEnabled && av.quotaLimit !== undefined) {
    quotaActive    = true
    quotaTotal     = av.quotaLimit
    quotaRemaining = Math.max(0, av.quotaLimit - (av.quotaUsed ?? 0))
    if (quotaRemaining <= 0) {
      quotaAvailable = false
      quotaLabel     = 'Sin cupos disponibles'
    } else {
      quotaAvailable = true
      quotaLabel     = quotaRemaining === 1 ? 'Queda 1 cupo' : `Quedan ${quotaRemaining} cupos`
    }
  }

  // ── Composite gate ────────────────────────────────────────────────────────
  // All three conditions must hold. Checked in priority order so blockedReason
  // reflects the outermost blocker (the one the user needs to fix first).
  const canAccess =
    distance !== null &&
    insideRadius &&
    scheduleAvailable &&
    quotaAvailable

  // canActivate controls the CTA button only.
  // "open" mode bypasses the gate so the button is always enabled.
  const canActivate = point.accessMode === 'open' ? true : canAccess

  let blockedReason: BlockedReason = null
  if (distance === null)         blockedReason = 'no-location'
  else if (!insideRadius)        blockedReason = 'radius'
  else if (!scheduleAvailable)   blockedReason = 'schedule'
  else if (!quotaAvailable)      blockedReason = 'quota'

  return {
    canAccess, canActivate, blockedReason,
    insideRadius, distanceToEdge,
    scheduleActive, scheduleAvailable, scheduleLabel,
    scheduleDays, scheduleStartTime, scheduleEndTime,
    quotaActive, quotaAvailable, quotaLabel, quotaRemaining, quotaTotal,
  }
}
