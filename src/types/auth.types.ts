import type { FeaturesConfig } from '../lib/planFeatureRegistry'

export interface PendingVerification {
  status: 'pending_verification'
  email:  string
}

export interface User {
  id:     string
  email:  string
  role:   'user' | 'admin'
  status: 'active' | 'suspended'
  // Subscription fields — null when plan isn't assigned yet.
  planId:                 string | null
  subscriptionStatus:     'trial' | 'active' | 'expired' | 'canceled' | null
  trialStartsAt:          string | null   // ISO-8601
  trialEndsAt:            string | null   // ISO-8601
  trialActive:            boolean
  daysRemaining:          number | null
  effectiveLocationLimit: number | null   // null = unlimited
  planName:               string | null
  planSlug:               string | null
  planFeaturesConfig:     FeaturesConfig | null
  apiAccessEnabled:       boolean         // whether the plan includes API access
  apiCredentialsLimit:    number | null   // null = unlimited
  onboardingCompleted:    boolean         // false → show onboarding flow
}
