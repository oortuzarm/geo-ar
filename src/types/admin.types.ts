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

export interface AdminProject {
  id:          string
  title:       string
  status:      'draft' | 'active' | 'inactive'
  userId:      string | null
  userEmail:   string | null
  pointsCount: number
  isOrphan:    boolean
  createdAt:   string
  updatedAt:   string
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
  hasTrial:             boolean        // DB: has_trial
  trialDays:            number | null  // DB: trial_days
  isVisible:            boolean
  isRecommended:        boolean
  applyToExistingUsers: boolean
  isCustom:             boolean
  sortOrder:            number
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
  hasTrial:             boolean
  trialDays:            number | null
  isVisible:            boolean
  isRecommended:        boolean
  isCustom:             boolean
  sortOrder:            number
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>
