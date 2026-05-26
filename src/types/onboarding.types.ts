export interface OnboardingCategory {
  id:          number
  name:        string
  slug:        string
  description: string | null
  iconName:    string | null
}

export interface OnboardingOption {
  id:       number
  group:    'industry' | 'org_type' | 'org_size' | 'objective'
  name:     string
  slug:     string
  position: number
}

export interface OnboardingConfig {
  categories: OnboardingCategory[]
  options:    OnboardingOption[]
}

export interface OnboardingSubmitPayload {
  workspaceTitle?: string
  company?:        string
  categoryId?:     number
  industryId?:     number
  orgTypeId?:      number
  orgSizeId?:      number
  objectiveId?:    number
  country?:        string
  completed?:      boolean
}

export interface AdminOnboardingCategory {
  id:          number
  name:        string
  slug:        string
  description: string | null
  iconName:    string | null
  position:    number
  active:      boolean
  usageCount:  number
  createdAt:   string
  updatedAt:   string
}

export interface AdminOnboardingOption {
  id:         number
  group:      'industry' | 'org_type' | 'org_size' | 'objective'
  name:       string
  slug:       string
  position:   number
  active:     boolean
  usageCount: number
  createdAt:  string
  updatedAt:  string
}

export interface OnboardingMetricsItem {
  id:    number
  name:  string
  count: number
}

export interface OnboardingMetrics {
  totals: {
    users:          number
    completed:      number
    completionRate: number
  }
  categories:        OnboardingMetricsItem[]
  industries:        OnboardingMetricsItem[]
  organizationTypes: OnboardingMetricsItem[]
  organizationSizes: OnboardingMetricsItem[]
  objectives:        OnboardingMetricsItem[]
}
