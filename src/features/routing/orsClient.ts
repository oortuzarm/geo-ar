const ORS_ENDPOINT =
  'https://api.openrouteservice.org/v2/directions/foot-walking/geojson'

export interface RouteResult {
  /** [lat, lng] pairs ready for react-leaflet Polyline */
  latLngs: [number, number][]
  distanceMeters: number
  durationSeconds: number
}

export async function fetchWalkingRoute(
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
): Promise<RouteResult> {
  const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY
  if (!apiKey) {
    console.error('[ORS] Missing VITE_OPENROUTESERVICE_API_KEY — set it in Vercel env vars')
    throw new Error('Missing ORS API key')
  }

  const res = await fetch(ORS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    body: JSON.stringify({
      coordinates: [
        [userLng, userLat],   // ORS expects [lng, lat]
        [targetLng, targetLat],
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`ORS ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  const feature = data.features[0]
  const summary = feature.properties.summary

  // ORS returns [lng, lat]; Leaflet needs [lat, lng]
  const latLngs: [number, number][] = feature.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng],
  )

  return {
    latLngs,
    distanceMeters: summary.distance,
    durationSeconds: summary.duration,
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m} min` : `${h}h`
}
