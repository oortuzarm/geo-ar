export interface AdminUser {
  id:                     string
  email:                  string
  role:                   'user' | 'admin'
  status:                 'active' | 'suspended'
  subscriptionStatus:     'trial' | 'active' | 'expired' | 'canceled' | null
  trialEndsAt:            string | null
  planId:                 string | null
  planName:               string | null
  customLocationLimit:    number | null
  effectiveLocationLimit: number | null
  projectsCount:          number
  pointsCount:            number
  createdAt:              string
  updatedAt:              string
}

export interface AdminUserDetail extends AdminUser {
  firstName:            string | null
  lastName:             string | null
  company:              string | null
  jobTitle:             string | null
  country:              string | null
  paddleCustomerId:     string | null
  paddleSubscriptionId: string | null
  workspace: {
    id:          string
    title:       string
    status:      'draft' | 'active' | 'inactive'
    pointsCount: number
    updatedAt:   string
  } | null
}

export interface AdminProject {
  id:               string
  title:            string
  status:           'draft' | 'active' | 'inactive'
  communityEnabled: boolean
  communityStatus:  'pending' | 'approved' | 'rejected' | 'hidden'
  userId:           string | null
  userEmail:        string | null
  pointsCount:      number
  isOrphan:         boolean
  createdAt:        string
  updatedAt:        string
}

export interface AdminMetrics {
  totalUsers:             number
  totalAdmins:            number
  totalActiveUsers:       number
  totalSuspendedUsers:    number
  totalProjects:          number
  totalPublishedProjects: number
  totalDraftProjects:     number
  totalOrphanProjects:    number
  totalPoints:            number
}

import type { FeaturesConfig } from '../lib/planFeatureRegistry'

// Field names match what the backend's plan_json serializer returns (camelCase).
// The backend DB columns use snake_case; Rails serializes them as camelCase in plan_json.
export interface AdminPlan {
  id:                   string
  name:                 string
  slug:                 string
  monthlyPrice:         number         // DB: monthly_price
  annualDiscountPercent: number        // DB: annual_discount_percent
  yearlyPriceComputed:  number | null  // DB: yearly_price_computed (computed by model)
  locationLimit:        number | null  // null = unlimited
  apiAccessEnabled:     boolean        // DB: api_access_enabled
  apiCredentialsLimit:  number | null  // DB: api_credentials_limit, null = unlimited
  hasTrial:             boolean        // DB: has_trial
  trialDays:            number | null  // DB: trial_days
  isVisible:            boolean
  isRecommended:        boolean
  isOnboardingPlan:     boolean
  applyToExistingUsers: boolean
  isCustom:             boolean
  sortOrder:            number
  publicDescription:    string | null
  features:             string[]
  ctaText:              string | null
  ctaUrl:               string | null
  featuresConfig:       FeaturesConfig
  createdAt:            string
  updatedAt:            string
}

// Payload sent to POST/PATCH. normalize_params converts camelCase → snake_case,
// so monthlyPrice → monthly_price, annualDiscountPercent → annual_discount_percent, etc.
export interface CreatePlanPayload {
  name:                 string
  slug:                 string
  monthlyPrice:         number
  annualDiscountPercent: number
  locationLimit:        number | null
  apiAccessEnabled?:    boolean
  apiCredentialsLimit?: number | null
  hasTrial:             boolean
  trialDays:            number | null
  isVisible:            boolean
  isRecommended:        boolean
  isOnboardingPlan?:    boolean
  isCustom:             boolean
  sortOrder:            number
  publicDescription:    string | null
  features:             string[]
  ctaText:              string | null
  ctaUrl:               string | null
  featuresConfig?:      FeaturesConfig
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>
