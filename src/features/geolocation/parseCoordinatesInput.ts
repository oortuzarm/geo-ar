export type CoordinateSource = 'plain' | 'google_maps_pin' | 'google_maps_viewport'

export interface ParsedCoordinates {
  lat: number
  lng: number
  source: CoordinateSource
}

/**
 * Parses user-pasted coordinates or a Google Maps URL into {lat, lng}.
 *
 * Priority:
 * 1. !3dLAT!4dLNG in URL  → specific pin/place (most accurate — preferred)
 * 2. @LAT,LNG in URL       → viewport center
 * 3. Plain "LAT, LNG"
 *
 * Returns null if the input cannot be parsed or coordinates are invalid.
 *
 * Example URL handled:
 * https://www.google.com/maps/place/.../@-33.3948559,-70.5996171,16.6z/data=!4m6!3m5!1s...!3d-33.3972749!4d-70.597294
 * → prefers !3d-33.3972749!4d-70.597294 (the actual place pin)
 */
export function parseCoordinatesInput(input: string): ParsedCoordinates | null {
  const s = input.trim()
  if (!s) return null

  // 1. Google Maps !3dLAT!4dLNG — pin coordinates for the actual place
  const pinMatch = s.match(/!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/)
  if (pinMatch) {
    const lat = parseFloat(pinMatch[1])
    const lng = parseFloat(pinMatch[2])
    if (isValid(lat, lng)) {
      if (import.meta.env.DEV) console.log('[CoordParse] source=google_maps_pin', lat, lng)
      return { lat, lng, source: 'google_maps_pin' }
    }
  }

  // 2. Google Maps @LAT,LNG — viewport center
  const viewportMatch = s.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/)
  if (viewportMatch) {
    const lat = parseFloat(viewportMatch[1])
    const lng = parseFloat(viewportMatch[2])
    if (isValid(lat, lng)) {
      if (import.meta.env.DEV) console.log('[CoordParse] source=google_maps_viewport', lat, lng)
      return { lat, lng, source: 'google_maps_viewport' }
    }
  }

  // 3. Plain "LAT, LNG" or "LAT LNG"
  const plainMatch = s.match(/^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/)
  if (plainMatch) {
    const lat = parseFloat(plainMatch[1])
    const lng = parseFloat(plainMatch[2])
    if (isValid(lat, lng)) {
      if (import.meta.env.DEV) console.log('[CoordParse] source=plain', lat, lng)
      return { lat, lng, source: 'plain' }
    }
  }

  if (import.meta.env.DEV) console.log('[CoordParse] could not parse:', s)
  return null
}

function isValid(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
