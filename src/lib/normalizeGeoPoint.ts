import type { GeoPoint } from '../types'

/**
 * Maps an API response object (potentially snake_case) to a typed GeoPoint.
 * Applied to every endpoint that returns point data so callers never see
 * undefined for requiresDwellTime / dwellTimeSeconds regardless of whether
 * the backend serialises in camelCase or snake_case.
 *
 * Every field is mapped explicitly (no ...raw spread) so TypeScript can
 * verify the shape without an unsafe cast.
 */
export function normalizeGeoPoint(raw: Record<string, unknown>): GeoPoint {
  const requiresDwellTime = raw.requiresDwellTime ?? raw.requires_dwell_time
  const dwellTimeSeconds  = raw.dwellTimeSeconds  ?? raw.dwell_time_seconds

  return {
    // ── Required fields ────────────────────────────────────────────────────
    id:               raw.id               as string,
    geoProjectId:     (raw.geoProjectId    ?? raw.geo_project_id)    as string,
    name:             raw.name             as string,
    latitude:         raw.latitude         as number,
    longitude:        raw.longitude        as number,
    activationRadius: Number(raw.activationRadius ?? raw.activation_radius ?? 50),
    active:           Boolean(raw.active),
    order:            (raw.order           ?? 0)                     as number,

    // ── Content ────────────────────────────────────────────────────────────
    lookiarUrl:          (raw.lookiarUrl          ?? raw.lookiar_url)          as GeoPoint['lookiarUrl'],
    contentType:         (raw.contentType         ?? raw.content_type)         as GeoPoint['contentType'],
    contentData:         (raw.contentData         ?? raw.content_data)         as GeoPoint['contentData'],
    destinationCategory: (raw.destinationCategory ?? raw.destination_category) as GeoPoint['destinationCategory'],
    pointCategory:       (raw.pointCategory       ?? raw.point_category)       as GeoPoint['pointCategory'],
    buttonText:          (raw.buttonText          ?? raw.button_text)          as GeoPoint['buttonText'],

    // ── Description / meta ────────────────────────────────────────────────
    image:        raw.image        as GeoPoint['image'],
    images:       raw.images       as GeoPoint['images'],
    description:  raw.description  as GeoPoint['description'],
    instructions: raw.instructions as GeoPoint['instructions'],

    // ── Access / mode ──────────────────────────────────────────────────────
    accessMode: (raw.accessMode ?? raw.access_mode) as GeoPoint['accessMode'],
    pointMode:  (raw.pointMode  ?? raw.point_mode)  as GeoPoint['pointMode'],
    availability: raw.availability                  as GeoPoint['availability'],

    // ── Dwell ─────────────────────────────────────────────────────────────
    requiresDwellTime: requiresDwellTime != null ? Boolean(requiresDwellTime) : undefined,
    dwellTimeSeconds:  dwellTimeSeconds  != null ? Number(dwellTimeSeconds)   : undefined,

    // ── Timestamps ────────────────────────────────────────────────────────
    createdAt: (raw.createdAt ?? raw.created_at) as GeoPoint['createdAt'],
    updatedAt: (raw.updatedAt ?? raw.updated_at) as GeoPoint['updatedAt'],

    // ── Activation zone ───────────────────────────────────────────────────
    activationMode:    (raw.activationMode    ?? raw.activation_mode)      as GeoPoint['activationMode'],
    activationPolygon: (raw.activationPolygon ?? raw.activation_polygon)   as GeoPoint['activationPolygon'],

    // ── Point branding ────────────────────────────────────────────────────
    pointLogoUrl:       (raw.pointLogoUrl       ?? raw.point_logo_url)        as GeoPoint['pointLogoUrl'],
    pointLogoZoom:      (raw.pointLogoZoom       ?? raw.point_logo_zoom)       as GeoPoint['pointLogoZoom'],
    pointLogoPositionX: (raw.pointLogoPositionX  ?? raw.point_logo_position_x) as GeoPoint['pointLogoPositionX'],
    pointLogoPositionY: (raw.pointLogoPositionY  ?? raw.point_logo_position_y) as GeoPoint['pointLogoPositionY'],
    pointVideoUrl:      (raw.pointVideoUrl       ?? raw.point_video_url)       as GeoPoint['pointVideoUrl'],
    pointVideoType:     (raw.pointVideoType      ?? raw.point_video_type)      as GeoPoint['pointVideoType'],

    // ── Collection / social ───────────────────────────────────────────────
    requiredPointIds: ((raw.requiredPointIds ?? raw.required_point_ids) as string[] | undefined) ?? [],
    socialLinks:      ((raw.socialLinks      ?? raw.social_links)       ?? {})                   as GeoPoint['socialLinks'],

    // ── Featured ──────────────────────────────────────────────────────────
    featured: Boolean(raw.featured),

    // ── Actions (cta / welcome) ───────────────────────────────────────────
    // undefined means "no stored value" — form falls back to its own default.
    ctaEnabled:     (() => { const v = raw.ctaEnabled     ?? raw.cta_enabled;     return v != null ? Boolean(v) : undefined })(),
    welcomeEnabled: (() => { const v = raw.welcomeEnabled ?? raw.welcome_enabled; return v != null ? Boolean(v) : undefined })(),
    welcomeTitle:   (raw.welcomeTitle   ?? raw.welcome_title)   as GeoPoint['welcomeTitle'],
    welcomeMessage: (raw.welcomeMessage ?? raw.welcome_message) as GeoPoint['welcomeMessage'],
    welcomeButton:  (raw.welcomeButton  ?? raw.welcome_button)  as GeoPoint['welcomeButton'],
  }
}
