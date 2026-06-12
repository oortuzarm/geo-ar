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
    updatedAt:         (raw.updatedAt         ?? raw.updated_at)         as string | undefined,
    activationMode:      (raw.activationMode      ?? raw.activation_mode)       as string | undefined,
    activationPolygon:   (raw.activationPolygon   ?? raw.activation_polygon)    as unknown,
    pointLogoUrl:        (raw.pointLogoUrl        ?? raw.point_logo_url)        as string | undefined,
    pointLogoZoom:       (raw.pointLogoZoom       ?? raw.point_logo_zoom)       as number | undefined,
    pointLogoPositionX:  (raw.pointLogoPositionX  ?? raw.point_logo_position_x) as number | undefined,
    pointLogoPositionY:  (raw.pointLogoPositionY  ?? raw.point_logo_position_y) as number | undefined,
    pointVideoUrl:       (raw.pointVideoUrl       ?? raw.point_video_url)       as string | undefined,
    pointVideoType:      (raw.pointVideoType      ?? raw.point_video_type)      as 'youtube' | 'mp4' | undefined,
    requiredPointIds:    ((raw.requiredPointIds   ?? raw.required_point_ids)    as string[] | undefined) ?? [],
  } as GeoPoint
}
