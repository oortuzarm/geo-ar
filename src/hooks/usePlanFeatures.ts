import { useAuthStore } from '../store/authStore'
import { DEFAULT_FEATURES_CONFIG } from '../lib/planFeatureRegistry'
import type { FeaturesConfig } from '../lib/planFeatureRegistry'

export interface PlanFeatures {
  config:                      FeaturesConfig
  canUseContentType:           (type: string) => boolean
  canUseScheduleAvailability:  boolean
  canUseQuotaAvailability:     boolean
  canUseAnalytics:             boolean
  canUseMembers:               boolean
  canUseDwellTime:             boolean
  canUseLiveVisits:            boolean
}

export function usePlanFeatures(): PlanFeatures {
  const user = useAuthStore((s) => s.currentUser)
  const config: FeaturesConfig = user?.planFeaturesConfig ?? DEFAULT_FEATURES_CONFIG

  const allowedTypes = Array.isArray(config.content_types)
    ? config.content_types
    : DEFAULT_FEATURES_CONFIG.content_types

  return {
    config,
    canUseContentType:          (type: string) => allowedTypes.includes(type),
    canUseScheduleAvailability: config.availability_schedule ?? true,
    canUseQuotaAvailability:    config.availability_quota    ?? true,
    canUseAnalytics:            config.analytics             ?? true,
    canUseMembers:              config.members               ?? true,
    canUseDwellTime:            config.dwell_time            ?? true,
    canUseLiveVisits:           config.live_visits           ?? true,
  }
}
