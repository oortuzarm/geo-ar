import { searchAddress } from './geocoding'
import type { NominatimResult, AddressConfidence } from '../../types'

// ── Abbreviation expansion ────────────────────────────────────────────────────
// Dot-versions first (more specific); plain-versions after.

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
  // \bAv\b is safe: \b after "v" fails inside "Avenida" (next char "e" is a word char)
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

/** Converts Chilean dot-thousands notation in street numbers: "17.000" → "17000" */
function normalizeNumbers(s: string): string {
  return s.replace(/\b(\d{1,2})\.(\d{3})\b/g, '$1$2')
}

// ── Road alias database ───────────────────────────────────────────────────────

interface RoadAliasGroup {
  variants: string[]
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

// ── Address parsing ───────────────────────────────────────────────────────────

export interface ParsedAddress {
  streetName: string
  streetNumber: string | null
  postalCode: string | null
  commune: string | null
  region: string | null
}

/**
 * Decomposes a raw address query into its semantic parts.
 * Distinguishes Chilean postal codes (7 digits) from street numbers (3–6 digits).
 *
 * "Av. Nueva Costanera 3987, 7630268 Santiago, Vitacura, Región Metropolitana"
 *   → { streetName: "Av. Nueva Costanera", streetNumber: "3987",
 *       postalCode: "7630268", commune: "Vitacura", region: "Región Metropolitana" }
 */
export function parseAddressQuery(raw: string): ParsedAddress {
  const normalized = normalizeNumbers(raw.trim())
  const parts = normalized.split(',').map(p => p.trim()).filter(Boolean)
  const main = parts[0] ?? ''

  let streetName = main
  let streetNumber: string | null = null

  // Street numbers: 3–6 digits at the end of the first segment.
  // Non-greedy .+? + $ ensures the LAST number is captured, so
  // "Ruta 5 Norte 17000" → streetName="Ruta 5 Norte", streetNumber="17000".
  const streetMatch = main.match(/^(.+?)\s+(\d{3,6})\s*$/)
  if (streetMatch) {
    streetName = streetMatch[1].trim()
    streetNumber = streetMatch[2]
  }

  let postalCode: string | null = null
  let postalCodeCity: string | null = null
  let commune: string | null = null
  let region: string | null = null

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]

    // 7-digit Chilean postal code, possibly followed by city name (e.g. "7630268 Santiago")
    const pcMatch = part.match(/^(\d{7})\s*(.*)$/)
    if (pcMatch) {
      postalCode = pcMatch[1]
      const rest = pcMatch[2].trim()
      if (rest) postalCodeCity = rest
      continue
    }

    if (/^chile$/i.test(part)) continue

    if (/regi[oó]n|metropolitana/i.test(part)) {
      region = part
      continue
    }

    // Explicit commune — later parts override earlier ones so "Vitacura" beats "Santiago"
    commune = part
  }

  return {
    streetName,
    streetNumber,
    postalCode,
    // Prefer explicit commune over city name derived from postal code segment
    commune: commune ?? postalCodeCity,
    region,
  }
}

// ── Variant generation ────────────────────────────────────────────────────────

function buildCleanVariant(road: string, num: string | null, commune: string | null, chile: boolean): string {
  const parts: string[] = [num ? `${road} ${num}` : road]
  if (commune) parts.push(commune)
  if (chile) parts.push('Chile')
  return parts.join(', ')
}

/**
 * Returns an ordered list of query strings for the geocoder.
 * Postal codes are stripped; abbreviations are expanded; clean fallback forms are added.
 */
export function generateSearchVariants(rawQuery: string): string[] {
  const normalized = normalizeNumbers(rawQuery.trim())
  const parsed = parseAddressQuery(normalized)

  const roadOrig = parsed.streetName
  const roadExp = expandAbbreviations(roadOrig)
  const roadNoAv = roadExp.replace(/^Avenida\s+/i, '').trim()
  const { streetNumber: num, commune, region } = parsed

  const variants: string[] = []
  const seen = new Set<string>()

  function add(v: string): boolean {
    const clean = v.trim().replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').replace(/,\s*$/, '')
    if (clean && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase())
      variants.push(clean)
      return true
    }
    return false
  }

  // 1. Fully expanded + commune + Chile (most precise, no postal code)
  if (commune) {
    add(buildCleanVariant(roadExp, num, commune, true))
    if (roadNoAv !== roadExp) add(buildCleanVariant(roadNoAv, num, commune, true))
  }

  // 2. Fully expanded + Chile (no commune)
  add(buildCleanVariant(roadExp, num, null, true))
  if (roadNoAv !== roadExp) add(buildCleanVariant(roadNoAv, num, null, true))

  // 3. With region when commune is available
  if (commune && region) {
    add(buildCleanVariant(roadExp, num, `${commune}, ${region}`, false))
  }

  // 4. Original abbreviation form (some entries indexed with Av. prefix)
  if (roadOrig !== roadExp) {
    if (commune) add(buildCleanVariant(roadOrig, num, commune, true))
    add(buildCleanVariant(roadOrig, num, null, true))
  }

  // 5. Road aliases
  const lowerNorm = normalized.toLowerCase()
  const lowerExp = roadExp.toLowerCase()
  for (const group of ROAD_ALIASES) {
    const anyMatch = group.variants.some(v =>
      lowerNorm.includes(v.toLowerCase()) || lowerExp.includes(v.toLowerCase())
    )
    if (!anyMatch) continue

    const loc = commune ?? (group.suggestedCommunes?.[0] ?? null)
    let added = 0
    for (const alias of group.variants) {
      if (added >= 3) break
      if (add(buildCleanVariant(alias, num, loc, true))) added++
    }
  }

  return variants.slice(0, MAX_VARIANTS_PER_SEARCH)
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function deduplicateResults(results: NominatimResult[], commune: string | null): NominatimResult[] {
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
    if (tooClose) continue

    // Same road name within the same commune → keep only the first occurrence.
    // This avoids showing multiple "Avenida X" segments from the same street.
    if (commune) {
      const road = r.display_name.split(',')[0].trim().toLowerCase()
      const communeLc = commune.toLowerCase()
      const dnLc = r.display_name.toLowerCase()
      const sameSegment = kept.some(k => {
        return k.display_name.split(',')[0].trim().toLowerCase() === road
          && k.display_name.toLowerCase().includes(communeLc)
          && dnLc.includes(communeLc)
      })
      if (sameSegment) continue
    }

    kept.push(r)
  }

  return kept
}

// ── Confidence scoring ────────────────────────────────────────────────────────

function computeConfidence(r: NominatimResult, parsed: ParsedAddress): AddressConfidence {
  const dn = r.display_name.toLowerCase()

  // Exact: number match (also check address.house_number when Nominatim returns it)
  if (parsed.streetNumber) {
    const hasNumberInDisplay = dn.includes(parsed.streetNumber)
    const hasNumberInAddress = r.address?.house_number === parsed.streetNumber
    if (hasNumberInDisplay || hasNumberInAddress) return 'exact'

    // No number → approximate or low_confidence based on road+commune match
    const roadLc = parsed.streetName.toLowerCase()
    const roadExpLc = expandAbbreviations(parsed.streetName).toLowerCase()
    const hasRoad = dn.includes(roadLc) || dn.includes(roadExpLc)
    const hasCommune = parsed.commune ? dn.includes(parsed.commune.toLowerCase()) : false

    if (hasRoad && hasCommune) return 'approximate'
    return 'low_confidence'
  }

  // No number in query: road+commune match is sufficient for 'exact'
  const roadLc = parsed.streetName.toLowerCase()
  const roadExpLc = expandAbbreviations(parsed.streetName).toLowerCase()
  const hasRoad = dn.includes(roadLc) || dn.includes(roadExpLc)
  if (hasRoad) return 'exact'
  return 'approximate'
}

function scoreResult(r: NominatimResult, parsed: ParsedAddress): number {
  const dn = r.display_name.toLowerCase()
  let score = 0

  if (dn.includes('chile')) score += 1
  if (parsed.streetNumber && dn.includes(parsed.streetNumber)) score += 5
  if (parsed.commune && dn.includes(parsed.commune.toLowerCase())) score += 2
  if (parsed.region && dn.includes(parsed.region.toLowerCase())) score += 1

  return score
}

// ── Number filtering ──────────────────────────────────────────────────────────

function filterByNumber(
  sortedResults: NominatimResult[],
  parsed: ParsedAddress,
): { exact: NominatimResult[]; approximate: NominatimResult | null } {
  if (!parsed.streetNumber) {
    return { exact: sortedResults, approximate: null }
  }

  const num = parsed.streetNumber
  const exact = sortedResults.filter(r =>
    r.display_name.includes(num) || r.address?.house_number === num
  )

  if (exact.length > 0) {
    if (import.meta.env.DEV) {
      const discarded = sortedResults.filter(r =>
        !r.display_name.includes(num) && r.address?.house_number !== num
      )
      if (discarded.length > 0) {
        console.log('[AddressSearch] discarded (no number match):', discarded.map(r => r.display_name))
      }
    }
    return { exact, approximate: null }
  }

  // No exact match — first item (already sorted by score) is best approximate
  if (import.meta.env.DEV) {
    console.log('[AddressSearch] no exact number match → approximate fallback activated')
    if (sortedResults.length > 1) {
      console.log('[AddressSearch] discarded:', sortedResults.slice(1).map(r => r.display_name))
    }
  }
  return { exact: [], approximate: sortedResults[0] ?? null }
}

// ── Early-stop criterion ──────────────────────────────────────────────────────

function isSufficientBatch(results: NominatimResult[], parsed: ParsedAddress): boolean {
  if (results.length === 0) return false

  const inChile = results.filter(r => r.display_name.toLowerCase().includes('chile'))
  if (inChile.length === 0) return false

  if (parsed.streetNumber) {
    const hasNumber = inChile.some(r =>
      r.display_name.includes(parsed.streetNumber!) || r.address?.house_number === parsed.streetNumber
    )
    if (!hasNumber && inChile.length < 2) return false
  }

  if (parsed.commune && parsed.commune.length > 2) {
    const lc = parsed.commune.toLowerCase()
    const hasCommune = inChile.some(r => r.display_name.toLowerCase().includes(lc))
    if (!hasCommune && inChile.length < 2) return false
  }

  return true
}

// ── Scored address result ─────────────────────────────────────────────────────

export interface ScoredAddress {
  nominatim: NominatimResult
  confidence: AddressConfidence
}

// ── In-memory session cache ───────────────────────────────────────────────────

interface CachedSearch {
  results: ScoredAddress[]
}

const MAX_CACHE_SIZE = 50
const queryCache = new Map<string, CachedSearch>()

function cacheKey(rawQuery: string): string {
  return expandAbbreviations(normalizeNumbers(rawQuery.trim())).toLowerCase()
}

function setCache(key: string, value: CachedSearch): void {
  if (queryCache.size >= MAX_CACHE_SIZE) {
    const firstKey = queryCache.keys().next().value
    if (firstKey !== undefined) queryCache.delete(firstKey)
  }
  queryCache.set(key, value)
}

// ── Main export ───────────────────────────────────────────────────────────────

const MAX_VARIANTS_PER_SEARCH = 5
const MAX_ADDRESS_RESULTS = 3

export async function searchAddressChile(rawQuery: string): Promise<ScoredAddress[]> {
  const key = cacheKey(rawQuery)
  const cached = queryCache.get(key)
  if (cached) {
    if (import.meta.env.DEV) console.log('[AddressSearch] cache hit:', key)
    return cached.results
  }

  const parsed = parseAddressQuery(rawQuery)
  const variants = generateSearchVariants(rawQuery)
  const limit = Math.min(variants.length, MAX_VARIANTS_PER_SEARCH)

  if (import.meta.env.DEV) {
    console.log('[AddressSearch] parsed address:', parsed)
    console.log(`[AddressSearch] trying ${limit}/${variants.length} variants:`, variants.slice(0, limit))
  }

  const accumulated: NominatimResult[] = []

  for (let i = 0; i < limit; i++) {
    const variant = variants[i]
    try {
      const results = await searchAddress(variant)
      if (import.meta.env.DEV) {
        console.log(`[AddressSearch] variant ${i + 1}: "${variant}" → ${results.length} raw results`)
      }
      accumulated.push(...results)

      const deduped = deduplicateResults(accumulated, parsed.commune)
      if (isSufficientBatch(deduped, parsed)) {
        if (import.meta.env.DEV) {
          console.log(`[AddressSearch] early stop at variant ${i + 1}/${limit} → ${deduped.length} deduped`)
        }
        return finalize(deduped, parsed, key)
      }
    } catch {
      if (import.meta.env.DEV) console.warn('[AddressSearch] variant failed:', variant)
    }
  }

  if (import.meta.env.DEV) {
    console.log(`[AddressSearch] exhausted ${limit} variants → ${accumulated.length} raw results`)
  }

  const deduped = deduplicateResults(accumulated, parsed.commune)
  return finalize(deduped, parsed, key)
}

function finalize(deduped: NominatimResult[], parsed: ParsedAddress, key: string): ScoredAddress[] {
  deduped.sort((a, b) => scoreResult(b, parsed) - scoreResult(a, parsed))

  const { exact, approximate } = filterByNumber(deduped, parsed)

  let final: ScoredAddress[]

  if (exact.length > 0) {
    final = exact.slice(0, MAX_ADDRESS_RESULTS).map(r => ({
      nominatim: r,
      confidence: computeConfidence(r, parsed),
    }))
    if (import.meta.env.DEV) {
      console.log(`[AddressSearch] ${exact.length} exact match(es), returning ${final.length}`)
      final.forEach(r => console.log(`  confidence=${r.confidence}:`, r.nominatim.display_name))
    }
  } else if (approximate) {
    const confidence = computeConfidence(approximate, parsed)
    final = [{ nominatim: approximate, confidence }]
    if (import.meta.env.DEV) {
      console.log(`[AddressSearch] no exact match → ${confidence} fallback:`, approximate.display_name)
    }
  } else {
    final = deduped.slice(0, MAX_ADDRESS_RESULTS).map(r => ({
      nominatim: r,
      confidence: computeConfidence(r, parsed),
    }))
    if (import.meta.env.DEV) {
      console.log(`[AddressSearch] no street number in query, returning ${final.length} results`)
    }
  }

  if (final.length > 0) setCache(key, { results: final })
  return final
}
