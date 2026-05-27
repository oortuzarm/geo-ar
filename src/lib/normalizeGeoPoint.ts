import type { GeoPoint } from '../types'

/**
 * Maps an API response object (potentially snake_case) to a typed GeoPoint.
 * Applied to every endpoint that returns point data so callers never see
 * undefined for requiresDwellTime / dwellTimeSeconds regardless of whether
 * the backend serialises in camelCase or snake_case.
 */
export function normalizeGeoPoint(raw: Record<string, unknown>): GeoPoint {
  const requiresDwellTime = raw.requiresDwellTime ?? raw.requires_dwell_time
  const dwellTimeSeconds  = raw.dwellTimeSeconds  ?? raw.dwell_time_seconds

  return {
    ...raw,
    geoProjectId:      (raw.geoProjectId     ?? raw.geo_project_id)     as string,
    lookiarUrl:        (raw.lookiarUrl        ?? raw.lookiar_url)        as string | undefined,
    contentType:       (raw.contentType       ?? raw.content_type)       as string | undefined,
    contentData:       (raw.contentData       ?? raw.content_data)       as unknown,
    activationRadius:  Number(raw.activationRadius ?? raw.activation_radius ?? 50),
    buttonText:        (raw.buttonText        ?? raw.button_text)        as string | undefined,
    accessMode:        (raw.accessMode        ?? raw.access_mode)        as string | undefined,
    requiresDwellTime: requiresDwellTime != null ? Boolean(requiresDwellTime) : undefined,
    dwellTimeSeconds:  dwellTimeSeconds  != null ? Number(dwellTimeSeconds)   : undefined,
    createdAt:         (raw.createdAt         ?? raw.created_at)         as string | undefined,
  } as GeoPoint
}
