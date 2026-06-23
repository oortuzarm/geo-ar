import { knowledge } from './index'
import type { UseCase } from './types'

export interface MatchResult {
  body: string
  tags: string[]
  matchedId: string | null
}

const CAPABILITY_TAG_LABELS: Record<string, string> = {
  studio: 'Studio',
  api: 'API',
  geopoints: 'GeoPoints',
  presence: 'Presencia física',
  analytics: 'Analytics',
  'live-visits': 'Visitas en vivo',
  'spatial-intelligence': 'Inteligencia espacial',
  'smart-proxies': 'Smart Proxies',
  integrations: 'Integraciones',
}

export const DEFAULT_SOLUTION: MatchResult = {
  body:
    'Ubyca puede resolver casi cualquier caso donde la ubicación física del usuario importa. ' +
    'Define zonas sobre el mapa, configura las reglas de activación y obtén datos reales de ' +
    'presencia, permanencia y comportamiento espacial — sin hardware adicional, sin aplicaciones ' +
    'nativas que instalar.',
  tags: ['GeoPoints', 'Presencia física', 'Analytics', 'API'],
  matchedId: null,
}

export function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function matchSolution(query: string): MatchResult {
  const lower = normalize(query)
  let bestUc: UseCase | null = null
  let bestScore = 0

  for (const uc of knowledge.useCases) {
    const score = uc.matchKeywords.filter(k => lower.includes(normalize(k))).length
    if (score > bestScore) {
      bestScore = score
      bestUc = uc
    }
  }

  if (!bestUc) return DEFAULT_SOLUTION

  return {
    body: bestUc.solution,
    tags: bestUc.capabilities.map(id => CAPABILITY_TAG_LABELS[id] ?? id),
    matchedId: bestUc.id,
  }
}
