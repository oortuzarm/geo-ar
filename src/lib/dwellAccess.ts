import type { GeoPoint } from '../types'

export interface DwellAccessState {
  requiresDwell:   boolean  // point has dwell enabled with dwellTimeSeconds > 0
  insideRadius:    boolean  // user is within activationRadius
  isRunning:       boolean  // timer is counting
  isCompleted:     boolean  // timer finished
  progressSeconds: number   // elapsed seconds
  totalSeconds:    number   // required seconds
  blocksAccess:    boolean  // true → CTA must be disabled
}

/**
 * Single source of truth for the dwell access gate.
 * Used by both /public and /temporary routes.
 *
 * blocksAccess = requiresDwell && !isCompleted
 *   — true when dwell is required and the timer hasn't finished
 *   — false when dwell is not required, or when the timer completed
 *
 * @param point           The GeoPoint (must have requiresDwellTime / dwellTimeSeconds)
 * @param distanceMeters  Pre-computed distance to point centre; null = no GPS
 * @param dwellState      Current timer state from dwellMap; undefined = 'idle'
 * @param elapsedSeconds  Elapsed seconds from dwellMap entry
 */
export function getDwellAccessState(
  point: GeoPoint,
  distanceMeters: number | null,
  dwellState?: 'idle' | 'running' | 'completed',
  elapsedSeconds?: number,
): DwellAccessState {
  const requiresDwell =
    (point.requiresDwellTime ?? false) === true &&
    (point.dwellTimeSeconds  ?? 0)     >  0

  const insideRadius = distanceMeters !== null && distanceMeters <= point.activationRadius
  const state        = dwellState ?? 'idle'
  const isRunning    = state === 'running'
  const isCompleted  = state === 'completed'
  const blocksAccess = requiresDwell && !isCompleted

  return {
    requiresDwell,
    insideRadius,
    isRunning,
    isCompleted,
    progressSeconds: elapsedSeconds ?? 0,
    totalSeconds:    point.dwellTimeSeconds ?? 0,
    blocksAccess,
  }
}
