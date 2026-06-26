import { searchAddress } from './geocoding'
import type { NominatimResult } from '../../types'

// ── Abbreviation expansion ────────────────────────────────────────────────────
// Applied in order: dot-versions first (more specific), then plain versions.

const ABBR_EXPANSIONS: Array<[RegExp, string]> = [
  [/\bPdte\.\s*/gi, 'Presidente '],
  [/\bPres\.\s*/gi, 'Presidente '],
  [/\bGral\.\s*/gi, 'General '],
  [/\bSta\.\s*/gi, 'Santa '],
  [/\bSto\.\s*/gi, 'Santo '],
  [/\bAv\.\s*/gi, 'Avenida '],
  [/\bPdte\b/gi, 'Presidente'],
  [/\bGral\b/gi, 'General'],
  [/\bSta\b/gi, 'Santa'],
  [/\bSto\b/gi, 'Santo'],
  // \bAv\b is safe: \b after "v" fails inside "Avenida" since next char is "e" (word char)
  [/\bAv\b/gi, 'Avenida'],
  [/\bR\.M\b\.?/g, 'Región Metropolitana'],
  [/\bRM\b/gi, 'Región Metropolitana'],
  [/Región Metropolitana(?!\s+de\s+Santiago)/g, 'Región Metropolitana de Santiago'],
]

function expandAbbreviations(s: string): string {
  let r = s
  for (const [pattern, replacement] of ABBR_EXPANSIONS) {
    r = r.replace(pattern, replacement)
  }
  return r.replace(/\s{2,}/g, ' ').trim()
}

/** Converts Chilean dot-thousands notation: "17.000" → "17000" */
function normalizeNumbers(s: string): string {
  return s.replace(/\b(\d{1,2})\.(\d{3})\b/g, '$1$2')
}

// ── Road alias database ───────────────────────────────────────────────────────

interface RoadAliasGroup {
  /** All known name variants (used for matching and as query alternatives) */
  variants: string[]
  /** Appended to alias queries when the user's query has no commune */
  suggestedCommunes?: string[]
}

export const ROAD_ALIASES: RoadAliasGroup[] = [
  {
    variants: [
      'Presidente Eduardo Frei Montalva',
      'Eduardo Frei Montalva',
      'Av. Presidente Eduardo Frei Montalva',
      'Av. Pdte. Eduardo Frei Montalva',
      'Panamericana Norte',
      'Ruta 5 Norte',
    ],
    suggestedCommunes: ['Colina'],
  },
]

// ── Query parsing ─────────────────────────────────────────────────────────────

interface ParsedQuery {
  roadName: string
  number: string | null
  extras: string[]
}

function parseQuery(raw: string): ParsedQuery {
  const parts = raw.split(',').map(p => p.trim()).filter(Boolean)
  const main = parts[0] ?? ''
  const extras = parts.slice(1)

  // Street numbers in Chile: 3–6 digits.
  // Non-greedy match ensures the LAST number in the main part is captured,
  // avoiding route numbers like "5" in "Ruta 5 Norte 17000".
  const m = main.match(/^(.+?)\s+(\d{3,6})\s*$/)
  if (m) {
    return { roadName: m[1].trim(), number: m[2], extras }
  }
  return { roadName: main, number: null, extras }
}

// ── Variant generation ────────────────────────────────────────────────────────

function buildVariant(road: string, num: string | null, extras: string[]): string {
  const main = num ? `${road} ${num}` : road
  const allParts = [main, ...extras]
  if (!allParts.some(p => /^chile$/i.test(p.trim()))) allParts.push('Chile')
  return allParts.join(', ')
}

function stripRegion(extras: string[]): string[] {
  return extras.filter(e => !/regi[oó]n|metropolitana|de santiago/i.test(e))
}

/** Returns an ordered list of query strings to try against Nominatim. */
export function generateSearchVariants(rawQuery: string): string[] {
  const normalized = normalizeNumbers(rawQuery.trim())
  const expanded = expandAbbreviations(normalized)

  const parsed = parseQuery(normalized)
  const parsedExp = parseQuery(expanded)
  const coreExtras = stripRegion(parsedExp.extras)

  const variants: string[] = []
  const seen = new Set<string>()

  function add(v: string): boolean {
    const clean = v.trim().replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',')
    if (clean && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase())
      variants.push(clean)
      return true
    }
    return false
  }

  // Core variants: original, fully expanded, without region, without "Avenida" prefix
  add(buildVariant(parsed.roadName, parsed.number, parsed.extras))
  add(buildVariant(parsedExp.roadName, parsedExp.number, parsedExp.extras))
  if (coreExtras.length < parsedExp.extras.length) {
    add(buildVariant(parsedExp.roadName, parsedExp.number, coreExtras))
  }
  const roadNoAv = parsedExp.roadName.replace(/^Avenida\s+/i, '').trim()
  if (roadNoAv !== parsedExp.roadName) {
    add(buildVariant(roadNoAv, parsedExp.number, coreExtras))
  }

  // Alias variants: triggered when any known alias name appears in the query
  const lowerNorm = normalized.toLowerCase()
  const lowerExp = expanded.toLowerCase()

  for (const group of ROAD_ALIASES) {
    const lowerVariants = group.variants.map(v => v.toLowerCase())
    const anyMatches = lowerVariants.some(v => lowerNorm.includes(v) || lowerExp.includes(v))
    if (!anyMatches) continue

    // When no commune in query, use suggested ones so aliases target the right area
    const locationExtras = coreExtras.length > 0 ? coreExtras : (group.suggestedCommunes ?? [])

    let added = 0
    for (const alias of group.variants) {
      if (added >= 5) break
      if (add(buildVariant(alias, parsedExp.number, locationExtras))) added++
    }
  }

  return variants.slice(0, 10)
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function deduplicateResults(results: NominatimResult[]): NominatimResult[] {
  const seenIds = new Set<number>()
  const kept: NominatimResult[] = []

  for (const r of results) {
    if (seenIds.has(r.place_id)) continue
    seenIds.add(r.place_id)

    const lat = parseFloat(r.lat)
    const lon = parseFloat(r.lon)
    // ~100 m proximity threshold
    const tooClose = kept.some(
      k => Math.abs(lat - parseFloat(k.lat)) < 0.001 && Math.abs(lon - parseFloat(k.lon)) < 0.001
    )
    if (!tooClose) kept.push(r)
  }

  return kept
}

// ── Relevance scoring ─────────────────────────────────────────────────────────

function scoreResult(r: NominatimResult, originalQuery: string): number {
  const dn = r.display_name.toLowerCase()
  const q = originalQuery.toLowerCase()
  let score = 0

  if (dn.includes('chile')) score += 1

  const numMatch = q.match(/\b(\d{3,6})\b/)
  if (numMatch && dn.includes(numMatch[1])) score += 3

  // First part after the main address is usually the commune
  const commune = q.split(',')[1]?.trim()
  if (commune && commune.length > 2 && dn.includes(commune)) score += 2

  return score
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function searchAddressChile(rawQuery: string): Promise<NominatimResult[]> {
  const variants = generateSearchVariants(rawQuery)

  if (import.meta.env.DEV) {
    console.log('[AddressSearch] variants:', variants)
  }

  const settled = await Promise.allSettled(variants.map(v => searchAddress(v)))

  const allResults: NominatimResult[] = []
  for (const r of settled) {
    if (r.status === 'fulfilled') allResults.push(...r.value)
  }

  const deduped = deduplicateResults(allResults)
  deduped.sort((a, b) => scoreResult(b, rawQuery) - scoreResult(a, rawQuery))
  return deduped.slice(0, 7)
}
