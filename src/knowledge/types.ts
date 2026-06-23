// ─── Ubyca Knowledge Base — Type definitions ─────────────────────────────────
//
// This file defines the contract for all knowledge in the system.
// Any change here propagates to the entire knowledge graph.

export interface Capability {
  id: string
  name: string
  tagline: string
  description: string
  keyFeatures: string[]
  whoIsItFor: string
  apiEndpoints?: string[]
  relatedCapabilities?: string[]
}

export interface SubIntention {
  id: string
  patterns: string[]
  solution: string
}

export interface UseCase {
  id: string
  vertical: string
  title: string
  problem: string
  solution: string
  capabilities: string[]
  matchKeywords: string[]
  subIntentions?: SubIntention[]
  relatedUseCases?: string[]
}

export interface Limitation {
  area: string
  description: string
  workaround?: string
}

export interface ProductInfo {
  name: string
  tagline: string
  description: string
  positioning: string
  accessPoints: string[]
}

export interface FAQ {
  id: string
  title: string
  questionPatterns: string[]
  answer: string
  tags?: string[]
}

export interface BusinessGoal {
  id: string
  title: string
  matchKeywords: string[]
  solution: string
  capabilities: string[]
}

export interface KnowledgeBase {
  product: ProductInfo
  capabilities: Capability[]
  useCases: UseCase[]
  limitations: Limitation[]
  faqs: FAQ[]
  businessGoals: BusinessGoal[]
}
