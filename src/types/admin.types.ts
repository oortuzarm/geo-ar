export interface AdminUser {
  id:            string
  email:         string
  role:          'user' | 'admin'
  status:        'active' | 'suspended'
  projectsCount: number
  pointsCount:   number
  createdAt:     string
  updatedAt:     string
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

export interface AdminPlan {
  id:             string
  name:           string
  priceMonthly:   number
  discountAnnual: number
  locationLimit:  number | null  // null = unlimited
  trialEnabled:   boolean
  trialDays:      number
  isVisible:      boolean
  isRecommended:  boolean
  isCustom:       boolean
  sortOrder:      number
  createdAt:      string
  updatedAt:      string
}

export interface CreatePlanPayload {
  name:           string
  priceMonthly:   number
  discountAnnual: number
  locationLimit:  number | null
  trialEnabled:   boolean
  trialDays:      number
  isVisible:      boolean
  isRecommended:  boolean
  isCustom:       boolean
  sortOrder:      number
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>
