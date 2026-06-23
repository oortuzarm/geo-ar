import { knowledge } from './index'
import type { UseCase, FAQ, BusinessGoal, SubIntention } from './types'

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
    'Ubyca verifica si una persona estuvo físicamente en un lugar — con hora exacta, duración ' +
    'y sin posibilidad de falsificación. Eso habilita casos muy distintos: registrar visitas de ' +
    'equipos en terreno, activar contenido o beneficios por presencia, medir tráfico real en ' +
    'ubicaciones, controlar acceso sin hardware, o demostrar que una campaña generó presencia ' +
    'física. ¿Cuál de estos se acerca más a lo que necesitas?',
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

function detectSubIntention(subIntentions: SubIntention[], lower: string): SubIntention | null {
  let best: SubIntention | null = null
  let bestScore = 0
  for (const sub of subIntentions) {
    const score = scoreKeywords(sub.patterns, lower)
    if (score > bestScore) { bestScore = score; best = sub }
  }
  return best
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

  // Score business goals
  let bestGoal: BusinessGoal | null = null
  let bestGoalScore = 0

  for (const goal of knowledge.businessGoals) {
    const score = scoreKeywords(goal.matchKeywords, lower)
    if (score > bestGoalScore) {
      bestGoalScore = score
      bestGoal = goal
    }
  }

  // Score FAQs
  let bestFaq: FAQ | null = null
  let bestFaqScore = 0

  for (const faq of knowledge.faqs) {
    const score = scoreKeywords(faq.questionPatterns, lower)
    if (score > bestFaqScore) {
      bestFaqScore = score
      bestFaq = faq
    }
  }

  // Priority: FAQ > BusinessGoal > UseCase > Fallback
  // Ties favour the higher-priority layer
  const faqWins = bestFaqScore > 0 && bestFaqScore >= bestGoalScore && bestFaqScore >= bestUcScore
  const goalWins = !faqWins && bestGoalScore > 0 && bestGoalScore >= bestUcScore
  // TODO: instrument — { query, matchedId, bestUcScore, secondUcScore, bestGoalScore, bestFaqScore, faqWins, goalWins }
  // Example log destination: posthog.capture('solution_match', { query, matchedId, bestUcScore, bestGoalScore, bestFaqScore, faqWins, goalWins })

  if (faqWins && bestFaq) {
    return {
      body: bestFaq.answer,
      tags: bestFaq.tags ?? [],
      matchedId: bestFaq.id,
    }
  }

  if (goalWins && bestGoal) {
    return {
      body: bestGoal.solution,
      tags: bestGoal.capabilities.map(id => CAPABILITY_TAG_LABELS[id] ?? id),
      matchedId: bestGoal.id,
    }
  }

  if (!bestUc) return DEFAULT_SOLUTION

  const subIntent = bestUc.subIntentions?.length
    ? detectSubIntention(bestUc.subIntentions, lower)
    : null

  return {
    body: subIntent?.solution ?? bestUc.solution,
    tags: bestUc.capabilities.map(id => CAPABILITY_TAG_LABELS[id] ?? id),
    matchedId: bestUc.id,
  }
}

// ─── Audit mode (temporary diagnostic, no production effect) ────────────────

export interface AuditCandidate {
  id: string
  title: string
  type: 'FAQ' | 'BusinessGoal' | 'UseCase'
  score: number
  matchedKeywords: string[]
}

export interface AuditResult {
  query: string
  normalized: string
  top3: AuditCandidate[]
  winner: AuditCandidate | null
  isFallback: boolean
  subIntentionId?: string
  subIntentionSolution?: string
}

function scoreWithMatches(
  patterns: string[],
  lower: string,
): { score: number; matched: string[] } {
  const matched = patterns.filter(k => lower.includes(normalize(k)))
  const score = matched.reduce((sum, k) => sum + (normalize(k).includes(' ') ? 2 : 1), 0)
  return { score, matched }
}

export function auditMatch(query: string): AuditResult {
  const normalized = normalize(query)
  const candidates: AuditCandidate[] = []

  for (const faq of knowledge.faqs) {
    const { score, matched } = scoreWithMatches(faq.questionPatterns, normalized)
    candidates.push({ id: faq.id, title: faq.title, type: 'FAQ', score, matchedKeywords: matched })
  }

  for (const goal of knowledge.businessGoals) {
    const { score, matched } = scoreWithMatches(goal.matchKeywords, normalized)
    candidates.push({ id: goal.id, title: goal.title, type: 'BusinessGoal', score, matchedKeywords: matched })
  }

  for (const uc of knowledge.useCases) {
    const { score, matched } = scoreWithMatches(uc.matchKeywords, normalized)
    candidates.push({ id: uc.id, title: uc.title, type: 'UseCase', score, matchedKeywords: matched })
  }

  const typePriority: Record<string, number> = { FAQ: 3, BusinessGoal: 2, UseCase: 1 }
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return typePriority[b.type] - typePriority[a.type]
  })

  const top3 = candidates.filter(c => c.score > 0).slice(0, 3)
  const winner = top3.length > 0 ? top3[0] : null

  let subIntentionId: string | undefined
  let subIntentionSolution: string | undefined

  if (winner?.type === 'UseCase') {
    const uc = knowledge.useCases.find(u => u.id === winner.id)
    if (uc?.subIntentions?.length) {
      const sub = detectSubIntention(uc.subIntentions, normalized)
      if (sub) {
        subIntentionId = sub.id
        subIntentionSolution = sub.solution
      }
    }
  }

  return { query, normalized, top3, winner, isFallback: winner === null, subIntentionId, subIntentionSolution }
}
