import { apiFetch } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const url  = (path: string) => `${BASE}${path}`

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SmartProxy {
  id:               string
  name:             string
  slug:             string
  organizationId:   string
  organizationSlug: string
  publicUrl:        string
  destinationUrl:   string
  proxyStatus:      'unknown' | 'supported' | 'partial' | 'failed'
  active:           boolean
  customDomain:     string | null
  domainStatus:     string | null
  sslStatus:        string | null
  createdAt:        string
  updatedAt:        string
}

export interface SmartProxyLiveVisitItem {
  id:          string
  name:        string
  slug:        string
  publicUrl:   string
  proxyStatus: string
  activeNow:   number
}

export interface SmartProxiesLiveVisitsSummary {
  activeNow:       number
  mostActiveProxy: SmartProxyLiveVisitItem | null
  proxies:         SmartProxyLiveVisitItem[]
  lastHourDelta:   number | null
  peakToday:       { label: string; count: number } | null
}

export interface SmartProxyLiveVisits {
  smartProxyId:  string
  activeNow:     number
  lastSeenAt:    string | null
  lastHourDelta: number | null
  peakToday:     { label: string; count: number } | null
}

export interface SmartProxyAnalytics {
  smartProxyId:     string
  openings:         number
  locationGranted:  number
  clicks:           number
  heartbeats:       number
  dwellCompletions: number
  uniqueSessions:   number
  uniqueClickers:   number
  conversionPct:    number
  avgDwellSeconds:  number | null
}

export interface IntensityPoint {
  lat:       number
  lng:       number
  count:     number
  intensity: number
}

export interface SmartProxyIntensity {
  smartProxyId: string
  points:       IntensityPoint[]
  totalSamples: number
}

export interface SmartProxyHotspot {
  lat:          number
  lng:          number
  count:        number
  intensity:    number
  radiusMeters: number
}

export interface SmartProxyHotspots {
  smartProxyId: string
  proxyName:    string
  mode:         'live' | 'historical'
  hotspots:     SmartProxyHotspot[]
  meta: {
    totalPoints:    number
    filteredPoints: number
  }
}

export interface CreateSmartProxyPayload {
  name:            string
  destination_url: string
  slug?:           string
}

export interface UpdateSmartProxyPayload {
  name?:            string
  destination_url?: string
  slug?:            string
  active?:          boolean
}

// ── API functions ─────────────────────────────────────────────────────────────

export function listSmartProxies(): Promise<SmartProxy[]> {
  return apiFetch<SmartProxy[]>(url('/api/smart_proxies'))
}

export function getSmartProxy(id: string): Promise<SmartProxy> {
  return apiFetch<SmartProxy>(url(`/api/smart_proxies/${id}`))
}

export function createSmartProxy(payload: CreateSmartProxyPayload): Promise<SmartProxy> {
  return apiFetch<SmartProxy>(url('/api/smart_proxies'), {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

export function updateSmartProxy(id: string, patch: UpdateSmartProxyPayload): Promise<SmartProxy> {
  return apiFetch<SmartProxy>(url(`/api/smart_proxies/${id}`), {
    method: 'PATCH',
    body:   JSON.stringify(patch),
  })
}

export function deleteSmartProxy(id: string): Promise<void> {
  return apiFetch<void>(url(`/api/smart_proxies/${id}`), { method: 'DELETE' })
}

export function fetchSmartProxiesLiveVisits(): Promise<SmartProxiesLiveVisitsSummary> {
  return apiFetch<SmartProxiesLiveVisitsSummary>(url('/api/smart_proxies/live_visits'))
}

export function fetchSmartProxyLiveVisits(id: string): Promise<SmartProxyLiveVisits> {
  return apiFetch<SmartProxyLiveVisits>(url(`/api/smart_proxies/${id}/live_visits`))
}

export function fetchSmartProxyAnalytics(
  id:      string,
  params?: { from?: string; to?: string },
): Promise<SmartProxyAnalytics> {
  const qs = new URLSearchParams()
  if (params?.from) qs.set('from', params.from)
  if (params?.to)   qs.set('to',   params.to)
  const q = qs.toString() ? `?${qs}` : ''
  return apiFetch<SmartProxyAnalytics>(url(`/api/smart_proxies/${id}/analytics${q}`))
}

export function fetchSmartProxyIntensity(
  id:      string,
  params?: { from?: string; to?: string },
): Promise<SmartProxyIntensity> {
  const qs = new URLSearchParams()
  if (params?.from) qs.set('from', params.from)
  if (params?.to)   qs.set('to',   params.to)
  const q = qs.toString() ? `?${qs}` : ''
  return apiFetch<SmartProxyIntensity>(url(`/api/smart_proxies/${id}/analytics/intensity${q}`))
}

export function fetchSmartProxyHotspots(
  id:      string,
  mode:    'live' | 'historical',
  params?: { startDate?: string; endDate?: string },
): Promise<SmartProxyHotspots> {
  const qs = new URLSearchParams({ mode })
  if (params?.startDate) qs.set('start_date', params.startDate)
  if (params?.endDate)   qs.set('end_date',   params.endDate)
  return apiFetch<SmartProxyHotspots>(url(`/api/smart_proxies/${id}/hotspots?${qs}`))
}
