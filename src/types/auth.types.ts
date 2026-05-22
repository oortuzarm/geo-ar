import type { FeaturesConfig } from '../lib/planFeatureRegistry'

export interface User {
  id:     string
  email:  string
  role:   'user' | 'admin'
  status: 'active' | 'suspended'
  // Subscription fields — null when the migration hasn't run or plan isn't assigned yet.
  subscriptionStatus:     'trial' | 'active' | 'expired' | 'canceled' | null
  trialEndsAt:            string | null   // ISO-8601
  effectiveLocationLimit: number | null   // null = unlimited
  planName:               string | null
  planSlug:               string | null
  planFeaturesConfig:     FeaturesConfig | null
}
