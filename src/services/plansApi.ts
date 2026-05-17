import { apiFetch } from '../lib/apiFetch'

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
  isCustom:              boolean
  sortOrder:             number
}

function normalizePlan(raw: Record<string, unknown>): PublicPlan {
  return {
    id:                    raw.id                                                           as string,
    name:                  raw.name                                                         as string,
    slug:                  (raw.slug ?? '')                                                 as string,
    monthlyPrice:          (raw.monthlyPrice          ?? raw.monthly_price          ?? 0)  as number,
    annualDiscountPercent: (raw.annualDiscountPercent ?? raw.annual_discount_percent ?? 0) as number,
    yearlyPriceComputed:   (raw.yearlyPriceComputed   ?? raw.yearly_price_computed  ?? null) as number | null,
    locationLimit:         (raw.locationLimit          ?? raw.location_limit         ?? null) as number | null,
    hasTrial:              (raw.hasTrial               ?? raw.has_trial              ?? false) as boolean,
    trialDays:             (raw.trialDays              ?? raw.trial_days             ?? null) as number | null,
    isRecommended:         (raw.isRecommended          ?? raw.is_recommended         ?? false) as boolean,
    isCustom:              (raw.isCustom               ?? raw.is_custom              ?? false) as boolean,
    sortOrder:             (raw.sortOrder              ?? raw.sort_order             ?? 0)  as number,
  }
}

export async function getPlans(): Promise<PublicPlan[]> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${BASE}/api/plans`)
  return raw.map(normalizePlan)
}
