import { searchAddress } from './geocoding'
import type { NominatimResult } from '../../types'

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
  /** All known name variants (used for matching and as query alternatives) */
  variants: string[]
  /** Added to alias queries when the user's query contains no commune */
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
  // Non-greedy (.+?) combined with $ anchor ensures the LAST number in main is captured,
  // so "Ruta 5 Norte 17000" correctly yields roadName="Ruta 5 Norte", number="17000".
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

/** Returns an ordered list of query strings to try against the geocoder. */
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

  // Core variants: original → expanded → without region → without "Avenida" prefix
  add(buildVariant(parsed.roadName, parsed.number, parsed.extras))
  add(buildVariant(parsedExp.roadName, parsedExp.number, parsedExp.extras))
  if (coreExtras.length < parsedExp.extras.length) {
    add(buildVariant(parsedExp.roadName, parsedExp.number, coreExtras))
  }
  const roadNoAv = parsedExp.roadName.replace(/^Avenida\s+/i, '').trim()
  if (roadNoAv !== parsedExp.roadName) {
    add(buildVariant(roadNoAv, parsedExp.number, coreExtras))
  }

  // Alias variants: triggered when any known road name appears in the query
  const lowerNorm = normalized.toLowerCase()
  const lowerExp = expanded.toLowerCase()

  for (const group of ROAD_ALIASES) {
    const lowerVariants = group.variants.map(v => v.toLowerCase())
    const anyMatches = lowerVariants.some(v => lowerNorm.includes(v) || lowerExp.includes(v))
    if (!anyMatches) continue

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

  const commune = q.split(',')[1]?.trim()
  if (commune && commune.length > 2 && dn.includes(commune)) score += 2

  return score
}

// ── Early-stop criterion ──────────────────────────────────────────────────────

/**
 * Returns true when the accumulated results are good enough to stop querying
 * further variants. Requires at least one Chilean result; softly requires
 * number/commune match (but doesn't block if we already have 2+ Chilean results).
 */
function isSufficientBatch(
  results: NominatimResult[],
  number: string | null,
  commune: string | null
): boolean {
  if (results.length === 0) return false

  const inChile = results.filter(r => r.display_name.toLowerCase().includes('chile'))
  if (inChile.length === 0) return false

  if (number) {
    const hasNumber = inChile.some(r => r.display_name.includes(number))
    if (!hasNumber && inChile.length < 2) return false
  }

  if (commune && commune.length > 2) {
    const lc = commune.toLowerCase()
    const hasCommune = inChile.some(r => r.display_name.toLowerCase().includes(lc))
    if (!hasCommune && inChile.length < 2) return false
  }

  return true
}

// ── In-memory session cache ───────────────────────────────────────────────────

const MAX_CACHE_SIZE = 50
const queryCache = new Map<string, NominatimResult[]>()

function cacheKey(rawQuery: string): string {
  // Two queries that expand to the same canonical form share a cache entry
  return expandAbbreviations(normalizeNumbers(rawQuery.trim())).toLowerCase()
}

function setCache(key: string, results: NominatimResult[]): void {
  if (queryCache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry (FIFO)
    const firstKey = queryCache.keys().next().value
    if (firstKey !== undefined) queryCache.delete(firstKey)
  }
  queryCache.set(key, results)
}

// ── Main export ───────────────────────────────────────────────────────────────

/** Maximum geocoder requests per search action (sequential, stops earlier on good results). */
const MAX_VARIANTS_PER_SEARCH = 5

export async function searchAddressChile(rawQuery: string): Promise<NominatimResult[]> {
  const key = cacheKey(rawQuery)
  const cached = queryCache.get(key)
  if (cached) {
    if (import.meta.env.DEV) console.log('[AddressSearch] cache hit:', key)
    return cached
  }

  const variants = generateSearchVariants(rawQuery)
  const limit = Math.min(variants.length, MAX_VARIANTS_PER_SEARCH)
  const parsed = parseQuery(normalizeNumbers(rawQuery.trim()))
  const commune = parsed.extras[0] ?? null

  if (import.meta.env.DEV) {
    console.log(
      `[AddressSearch] trying ${limit}/${variants.length} variants:`,
      variants.slice(0, limit)
    )
  }

  const accumulated: NominatimResult[] = []

  for (let i = 0; i < limit; i++) {
    const variant = variants[i]
    try {
      const results = await searchAddress(variant)
      accumulated.push(...results)

      const deduped = deduplicateResults(accumulated)
      if (isSufficientBatch(deduped, parsed.number, commune)) {
        if (import.meta.env.DEV) {
          console.log(`[AddressSearch] early stop at variant ${i + 1}/${limit}:`, variant, `→ ${deduped.length} results`)
        }
        deduped.sort((a, b) => scoreResult(b, rawQuery) - scoreResult(a, rawQuery))
        const final = deduped.slice(0, 7)
        setCache(key, final)
        return final
      }
    } catch {
      if (import.meta.env.DEV) console.warn('[AddressSearch] variant failed:', variant)
    }
  }

  if (import.meta.env.DEV) {
    console.log(`[AddressSearch] exhausted ${limit} variants → ${accumulated.length} raw results`)
  }

  const deduped = deduplicateResults(accumulated)
  deduped.sort((a, b) => scoreResult(b, rawQuery) - scoreResult(a, rawQuery))
  const final = deduped.slice(0, 7)

  if (final.length > 0) setCache(key, final)
  return final
}
