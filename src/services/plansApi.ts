import { apiFetch } from '../lib/apiFetch'
import type { FeaturesConfig } from '../lib/planFeatureRegistry'
import { DEFAULT_FEATURES_CONFIG } from '../lib/planFeatureRegistry'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export interface PublicPlan {
  id:                    string
  name:                  string
  slug:                  string
  monthlyPrice:          number
  annualDiscountPercent: number
  yearlyPriceComputed:   number | null
  locationLimit:         number | null
  hasTrial:              boolean
  trialDays:             number | null
  isRecommended:         boolean
  isOnboardingPlan:      boolean
  isCustom:              boolean
  sortOrder:             number
  publicDescription:     string | null
  features:              string[]
  ctaText:               string | null
  ctaUrl:                string | null
  featuresConfig:        FeaturesConfig
}

function normalizePlan(raw: Record<string, unknown>): PublicPlan {
  const yearlyRaw    = raw.yearlyPriceComputed ?? raw.yearly_price_computed ?? null
  const locationRaw  = raw.locationLimit       ?? raw.location_limit        ?? null
  const trialDaysRaw = raw.trialDays           ?? raw.trial_days            ?? null
  const featuresRaw  = raw.features
  return {
    id:                    raw.id                                                           as string,
    name:                  raw.name                                                         as string,
    slug:                  (raw.slug ?? '')                                                 as string,
    monthlyPrice:          Number(raw.monthlyPrice          ?? raw.monthly_price          ?? 0),
    annualDiscountPercent: Number(raw.annualDiscountPercent ?? raw.annual_discount_percent ?? 0),
    yearlyPriceComputed:   yearlyRaw   !== null ? Number(yearlyRaw)   : null,
    locationLimit:         locationRaw !== null ? Number(locationRaw) : null,
    hasTrial:              Boolean(raw.hasTrial    ?? raw.has_trial    ?? false),
    trialDays:             trialDaysRaw !== null ? Number(trialDaysRaw) : null,
    isRecommended:         Boolean(raw.isRecommended    ?? raw.is_recommended    ?? false),
    isOnboardingPlan:      Boolean(raw.isOnboardingPlan ?? raw.is_onboarding_plan ?? false),
    isCustom:              Boolean(raw.isCustom          ?? raw.is_custom          ?? false),
    sortOrder:             Number(raw.sortOrder       ?? raw.sort_order     ?? 0),
    publicDescription:     ((raw.publicDescription  ?? raw.public_description  ?? null) as string | null),
    features:              Array.isArray(featuresRaw) ? (featuresRaw as string[]) : [],
    ctaText:               ((raw.ctaText  ?? raw.cta_text  ?? null) as string | null),
    ctaUrl:                ((raw.ctaUrl   ?? raw.cta_url   ?? null) as string | null),
    featuresConfig:        ((raw.featuresConfig ?? raw.features_config ?? DEFAULT_FEATURES_CONFIG) as FeaturesConfig),
  }
}

export async function getPlans(): Promise<PublicPlan[]> {
  // credentials: 'omit' — public endpoint, no auth needed.
  // Avoids CORS preflight credential requirements that would block unauthenticated
  // origins (e.g. ubyca.com landing page) when the backend uses strict CORS rules.
  const raw = await apiFetch<Record<string, unknown>[]>(`${BASE}/api/plans`, {
    credentials: 'omit',
  })
  return raw.map(normalizePlan)
}

export async function startTrial(planId: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`${BASE}/api/plans/${planId}/start_trial`, {
    method: 'POST',
  })
}
