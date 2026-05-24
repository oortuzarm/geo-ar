/**
 * Admin API — calls endpoints that require role === 'admin'.
 *
 * Required Rails routes (all behind before_action :require_admin):
 *
 *   namespace :api do
 *     namespace :admin do
 *       get 'users'
 *       get 'projects'
 *       get 'metrics'
 *     end
 *   end
 *
 * Example controller (app/controllers/api/admin_controller.rb):
 *
 *   class Api::AdminController < ApplicationController
 *     before_action :require_admin
 *
 *     def users
 *       users = User.left_joins(geo_projects: :geo_points)
 *                   .select('users.*, COUNT(DISTINCT geo_projects.id) AS projects_count,
 *                            COUNT(DISTINCT geo_points.id) AS points_count')
 *                   .group('users.id')
 *       render json: users.map { |u|
 *         { id: u.id, email: u.email, role: u.role, status: u.status,
 *           projects_count: u.projects_count.to_i, points_count: u.points_count.to_i,
 *           created_at: u.created_at, updated_at: u.updated_at }
 *       }
 *     end
 *
 *     def projects
 *       projects = GeoProject.left_joins(:user, :geo_points)
 *                            .select('geo_projects.*, users.email AS user_email,
 *                                     COUNT(DISTINCT geo_points.id) AS points_count')
 *                            .group('geo_projects.id, users.email')
 *       render json: projects.map { |p|
 *         { id: p.id, title: p.title, status: p.status,
 *           user_id: p.user_id, user_email: p.user_email,
 *           points_count: p.points_count.to_i, is_orphan: p.user_id.nil?,
 *           created_at: p.created_at, updated_at: p.updated_at }
 *       }
 *     end
 *
 *     def metrics
 *       render json: {
 *         total_users:              User.count,
 *         total_admins:             User.admin.count,
 *         total_active_users:       User.active.count,
 *         total_suspended_users:    User.suspended.count,
 *         total_projects:           GeoProject.count,
 *         total_published_projects: GeoProject.active.count,
 *         total_draft_projects:     GeoProject.draft.count,
 *         total_orphan_projects:    GeoProject.where(user_id: nil).count,
 *         total_points:             GeoPoint.count,
 *       }
 *     end
 *
 *     private
 *
 *     def require_admin
 *       user = User.find_by(id: session[:user_id])
 *       return head :unauthorized unless user
 *       return head :forbidden     unless user.admin?
 *     end
 *   end
 */

import { apiFetch } from '../lib/apiFetch'
import type { AdminUser, AdminProject, AdminMetrics, AdminPlan, CreatePlanPayload, UpdatePlanPayload } from '../types/admin.types'
import type { FeaturesConfig } from '../lib/planFeatureRegistry'
import { DEFAULT_FEATURES_CONFIG } from '../lib/planFeatureRegistry'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

// Rails returns snake_case; normalize to camelCase for the frontend.

function normalizeUser(raw: Record<string, unknown>): AdminUser {
  return {
    id:                     raw.id                                                                   as string,
    email:                  raw.email                                                                as string,
    role:                   raw.role                                                                 as AdminUser['role'],
    status:                 raw.status                                                               as AdminUser['status'],
    subscriptionStatus:     (raw.subscriptionStatus    ?? raw.subscription_status    ?? null)        as AdminUser['subscriptionStatus'],
    trialEndsAt:            (raw.trialEndsAt           ?? raw.trial_ends_at          ?? null)        as string | null,
    planId:                 (raw.planId                ?? raw.plan_id                ?? null)        as string | null,
    planName:               (raw.planName              ?? raw.plan_name              ?? null)        as string | null,
    customLocationLimit:    (raw.customLocationLimit   ?? raw.custom_location_limit  ?? null)        as number | null,
    effectiveLocationLimit: (raw.effectiveLocationLimit ?? raw.effective_location_limit ?? null)     as number | null,
    projectsCount:          (raw.projectsCount         ?? raw.projects_count         ?? 0)          as number,
    pointsCount:            (raw.pointsCount           ?? raw.points_count           ?? 0)          as number,
    createdAt:              (raw.createdAt             ?? raw.created_at             ?? '')         as string,
    updatedAt:              (raw.updatedAt             ?? raw.updated_at             ?? '')         as string,
  }
}

function normalizeProject(raw: Record<string, unknown>): AdminProject {
  const userId = (raw.userId ?? raw.user_id ?? null) as string | null
  return {
    id:               raw.id                                                        as string,
    title:            (raw.title ?? raw.name ?? '')                                 as string,
    status:           raw.status                                                    as AdminProject['status'],
    communityEnabled: (raw.communityEnabled ?? raw.community_enabled ?? false)      as boolean,
    communityStatus:  ((raw.communityStatus ?? raw.community_status ?? 'pending') as AdminProject['communityStatus']),
    userId,
    userEmail:        (raw.userEmail ?? raw.user_email ?? null)                     as string | null,
    pointsCount:      (raw.pointsCount ?? raw.points_count ?? 0)                   as number,
    isOrphan:         (raw.isOrphan   ?? raw.is_orphan ?? userId === null)          as boolean,
    createdAt:        (raw.createdAt  ?? raw.created_at ?? '')                     as string,
    updatedAt:        (raw.updatedAt  ?? raw.updated_at ?? '')                     as string,
  }
}

function normalizeMetrics(raw: Record<string, unknown>): AdminMetrics {
  return {
    totalUsers:             (raw.totalUsers             ?? raw.total_users             ?? 0) as number,
    totalAdmins:            (raw.totalAdmins            ?? raw.total_admins            ?? 0) as number,
    totalActiveUsers:       (raw.totalActiveUsers       ?? raw.total_active_users       ?? 0) as number,
    totalSuspendedUsers:    (raw.totalSuspendedUsers    ?? raw.total_suspended_users    ?? 0) as number,
    totalProjects:          (raw.totalProjects          ?? raw.total_projects          ?? 0) as number,
    totalPublishedProjects: (raw.totalPublishedProjects ?? raw.total_published_projects ?? 0) as number,
    totalDraftProjects:     (raw.totalDraftProjects     ?? raw.total_draft_projects     ?? 0) as number,
    totalOrphanProjects:    (raw.totalOrphanProjects    ?? raw.total_orphan_projects    ?? 0) as number,
    totalPoints:            (raw.totalPoints            ?? raw.total_points            ?? 0) as number,
  }
}

export async function getAdminUsers(opts: { cacheBust?: boolean } = {}): Promise<AdminUser[]> {
  const url = opts.cacheBust
    ? `${BASE}/api/admin/users?_t=${Date.now()}`
    : `${BASE}/api/admin/users`
  const raw = await apiFetch<Record<string, unknown>[]>(url, {
    headers: opts.cacheBust ? { 'Cache-Control': 'no-cache' } : {},
  })
  console.log('[ADMIN_USERS_REFRESHED_RAW]', raw.slice(0, 3).map((u) => ({
    id: u.id, email: u.email, planId: u.planId ?? u.plan_id, planName: u.planName ?? u.plan_name, subscriptionStatus: u.subscriptionStatus ?? u.subscription_status,
  })))
  const users = raw.map(normalizeUser)
  console.log('[ADMIN_USERS_REFRESHED_NORMALIZED]', users.slice(0, 3).map((u) => ({
    id: u.id, planId: u.planId, planName: u.planName, subscriptionStatus: u.subscriptionStatus,
  })))
  return users
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${BASE}/api/admin/projects`)
  const projects = raw.map(normalizeProject)
  console.log('[ADMIN_PROJECTS_FETCH] count=', projects.length)
  console.log('[ADMIN_PROJECTS_FETCH_IDS]', projects.map((p) => p.id))
  return projects
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/admin/metrics`)
  return normalizeMetrics(raw)
}

export async function deleteAdminProject(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/api/geo_projects/${id}`, { method: 'DELETE' })
}

export async function deleteAdminUser(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/api/admin/users/${id}`, { method: 'DELETE' })
}

// ── Plans ─────────────────────────────────────────────────────────────────────
//
// Expected Rails routes (under namespace :api, namespace :admin):
//   resources :plans, only: %i[index create update destroy]
//
// GET    /api/admin/plans
// POST   /api/admin/plans
// PATCH  /api/admin/plans/:id
// DELETE /api/admin/plans/:id

function normalizePlan(raw: Record<string, unknown>): AdminPlan {
  const yearlyRaw    = raw.yearlyPriceComputed ?? raw.yearly_price_computed ?? null
  const locationRaw  = raw.locationLimit ?? raw.location_limit ?? null
  const trialDaysRaw = raw.trialDays ?? raw.trial_days ?? null
  const featuresRaw  = raw.features
  return {
    id:                    raw.id                                                              as string,
    name:                  raw.name                                                            as string,
    slug:                  (raw.slug ?? '')                                                    as string,
    monthlyPrice:          Number(raw.monthlyPrice          ?? raw.monthly_price          ?? 0),
    annualDiscountPercent: Number(raw.annualDiscountPercent ?? raw.annual_discount_percent ?? 0),
    yearlyPriceComputed:   yearlyRaw   !== null ? Number(yearlyRaw)   : null,
    locationLimit:         locationRaw !== null ? Number(locationRaw) : null,
    hasTrial:              (raw.hasTrial               ?? raw.has_trial              ?? false) as boolean,
    trialDays:             trialDaysRaw !== null ? Number(trialDaysRaw) : null,
    isVisible:             (raw.isVisible              ?? raw.is_visible             ?? true)  as boolean,
    isRecommended:         (raw.isRecommended          ?? raw.is_recommended         ?? false) as boolean,
    applyToExistingUsers:  (raw.applyToExistingUsers   ?? raw.apply_to_existing_users ?? false) as boolean,
    isCustom:              Boolean(raw.isCustom        ?? raw.is_custom              ?? false),
    sortOrder:             Number(raw.sortOrder         ?? raw.sort_order             ?? 0),
    publicDescription:     ((raw.publicDescription  ?? raw.public_description  ?? null) as string | null),
    features:              Array.isArray(featuresRaw) ? (featuresRaw as string[]) : [],
    ctaText:               ((raw.ctaText  ?? raw.cta_text  ?? null) as string | null),
    ctaUrl:                ((raw.ctaUrl   ?? raw.cta_url   ?? null) as string | null),
    featuresConfig:        ((raw.featuresConfig ?? raw.features_config ?? DEFAULT_FEATURES_CONFIG) as FeaturesConfig),
    createdAt:             (raw.createdAt              ?? raw.created_at             ?? '')    as string,
    updatedAt:             (raw.updatedAt              ?? raw.updated_at             ?? '')    as string,
  }
}

export async function getAdminPlans(): Promise<AdminPlan[]> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${BASE}/api/admin/plans`)
  return raw.map(normalizePlan)
}

export async function createAdminPlan(payload: CreatePlanPayload): Promise<AdminPlan> {
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/admin/plans`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return normalizePlan(raw)
}

export async function updateAdminPlan(id: string, payload: UpdatePlanPayload): Promise<AdminPlan> {
  console.log('[ADMIN_PLAN_SAVE_PAYLOAD]', payload)
  const raw = await apiFetch<Record<string, unknown>>(`${BASE}/api/admin/plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  console.log('[ADMIN_PLAN_SAVE_RESPONSE]', raw)
  const normalized = normalizePlan(raw)
  console.log('[ADMIN_PLAN_NORMALIZED]', { isCustom: normalized.isCustom, monthlyPrice: normalized.monthlyPrice, annualDiscountPercent: normalized.annualDiscountPercent })
  return normalized
}

export async function deleteAdminPlan(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/api/admin/plans/${id}`, { method: 'DELETE' })
}

// ── Community status ──────────────────────────────────────────────────────────

export async function updateAdminProjectCommunityStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected' | 'hidden',
): Promise<void> {
  await apiFetch<unknown>(`${BASE}/api/admin/projects/${id}/community_status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ── User subscriptions ────────────────────────────────────────────────────────
//
// PATCH /api/admin/users/:userId/subscription
// Body: { planId?, subscriptionStatus?, customLocationLimit?, trialStartsAt?, trialEndsAt? }

export interface UpdateSubscriptionPayload {
  planId?:              string | null
  subscriptionStatus?:  'trial' | 'active' | 'expired' | 'canceled'
  customLocationLimit?: number | null
  trialStartsAt?:       string | null
  trialEndsAt?:         string | null
}

// Shape returned by PATCH /api/admin/users/:userId/subscription
export interface SubscriptionSaveResponse {
  userId:                string
  planId:                string | null
  planName:              string | null
  planSlug:              string | null
  subscriptionStatus:    'trial' | 'active' | 'expired' | 'canceled' | null
  trialEndsAt:           string | null
  customLocationLimit:   number | null
  effectiveLocationLimit: number | null
}

export async function updateAdminUserSubscription(
  userId: string,
  payload: UpdateSubscriptionPayload,
): Promise<SubscriptionSaveResponse> {
  const raw = await apiFetch<Record<string, unknown>>(
    `${BASE}/api/admin/users/${userId}/subscription`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  )
  console.log('[ADMIN_SUBSCRIPTION_SAVE_RESPONSE]', raw)
  return {
    userId:                (raw.userId                ?? raw.user_id                ?? userId)     as string,
    planId:                (raw.planId                ?? raw.plan_id                ?? null)       as string | null,
    planName:              (raw.planName              ?? raw.plan_name              ?? null)       as string | null,
    planSlug:              (raw.planSlug              ?? raw.plan_slug              ?? null)       as string | null,
    subscriptionStatus:    (raw.subscriptionStatus    ?? raw.subscription_status    ?? null)       as SubscriptionSaveResponse['subscriptionStatus'],
    trialEndsAt:           (raw.trialEndsAt           ?? raw.trial_ends_at          ?? null)       as string | null,
    customLocationLimit:   (raw.customLocationLimit   ?? raw.custom_location_limit  ?? null)       as number | null,
    effectiveLocationLimit: (raw.effectiveLocationLimit ?? raw.effective_location_limit ?? null)   as number | null,
  }
}
