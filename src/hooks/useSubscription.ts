import { useAuthStore } from '../store/authStore'

export interface SubscriptionState {
  planName:   string | null
  planSlug:   string | null
  status:     'trial' | 'active' | 'expired' | 'canceled' | null
  isTrialActive:  boolean
  trialDaysLeft:  number | null
  limit:      number | null   // null = unlimited
  canAddLocation: (currentCount: number) => boolean
}

export function useSubscription(): SubscriptionState {
  const user = useAuthStore((s) => s.currentUser)

  const planName      = user?.planName             ?? null
  const planSlug      = user?.planSlug             ?? null
  const status        = user?.subscriptionStatus   ?? null
  const limit         = user?.effectiveLocationLimit ?? null
  const isTrialActive = user?.trialActive          ?? false
  const trialDaysLeft = user?.daysRemaining        ?? null

  function canAddLocation(count: number): boolean {
    // No subscription data yet (null) → allow (legacy / admin bypass)
    if (!status) return true
    if (limit === null) return true   // unlimited plan
    return count < limit
  }

  return { planName, planSlug, status, isTrialActive, trialDaysLeft, limit, canAddLocation }
}
