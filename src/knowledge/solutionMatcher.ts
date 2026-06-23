import { knowledge } from './index'
import type { UseCase, FAQ } from './types'

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

function scoreKeywords(patterns: string[], lower: string): number {
  return patterns
    .filter(k => lower.includes(normalize(k)))
    .reduce((sum, k) => sum + (normalize(k).includes(' ') ? 2 : 1), 0)
}

export function matchSolution(query: string): MatchResult {
  const lower = normalize(query)

  // Score use cases
  let bestUc: UseCase | null = null
  let bestUcScore = 0
  let secondUcScore = 0

  for (const uc of knowledge.useCases) {
    const score = scoreKeywords(uc.matchKeywords, lower)
    if (score > bestUcScore) {
      secondUcScore = bestUcScore
      bestUcScore = score
      bestUc = uc
    } else if (score > secondUcScore) {
      secondUcScore = score
    }
  }

  // Score FAQs — FAQ wins if bestFaqScore > 0 AND bestFaqScore >= bestUcScore
  let bestFaq: FAQ | null = null
  let bestFaqScore = 0

  for (const faq of knowledge.faqs) {
    const score = scoreKeywords(faq.questionPatterns, lower)
    if (score > bestFaqScore) {
      bestFaqScore = score
      bestFaq = faq
    }
  }

  const usedFaq = bestFaqScore > 0 && bestFaqScore >= bestUcScore
  // TODO: instrument — { query, matchedId, bestUcScore, secondUcScore, bestFaqScore, usedFaq, usedFallback: !bestUc && !usedFaq }
  // Example log destination: posthog.capture('solution_match', { query, matchedId, bestUcScore, secondUcScore, bestFaqScore, usedFaq })

  if (usedFaq && bestFaq) {
    return {
      body: bestFaq.answer,
      tags: bestFaq.tags ?? [],
      matchedId: bestFaq.id,
    }
  }

  if (!bestUc) return DEFAULT_SOLUTION

  return {
    body: bestUc.solution,
    tags: bestUc.capabilities.map(id => CAPABILITY_TAG_LABELS[id] ?? id),
    matchedId: bestUc.id,
  }
}
