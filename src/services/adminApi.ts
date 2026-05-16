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
import type { AdminUser, AdminProject, AdminMetrics } from '../types/admin.types'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

// Rails returns snake_case; normalize to camelCase for the frontend.

function normalizeUser(raw: Record<string, unknown>): AdminUser {
  return {
    id:            raw.id            as string,
    email:         raw.email         as string,
    role:          raw.role          as AdminUser['role'],
    status:        raw.status        as AdminUser['status'],
    projectsCount: (raw.projectsCount ?? raw.projects_count ?? 0) as number,
    pointsCount:   (raw.pointsCount   ?? raw.points_count   ?? 0) as number,
    createdAt:     (raw.createdAt     ?? raw.created_at     ?? '') as string,
    updatedAt:     (raw.updatedAt     ?? raw.updated_at     ?? '') as string,
  }
}

function normalizeProject(raw: Record<string, unknown>): AdminProject {
  const userId = (raw.userId ?? raw.user_id ?? null) as string | null
  return {
    id:          raw.id                          as string,
    title:       (raw.title ?? raw.name ?? '')   as string,
    status:      raw.status                      as AdminProject['status'],
    userId,
    userEmail:   (raw.userEmail ?? raw.user_email ?? null) as string | null,
    pointsCount: (raw.pointsCount ?? raw.points_count ?? 0) as number,
    isOrphan:    (raw.isOrphan   ?? raw.is_orphan ?? userId === null) as boolean,
    createdAt:   (raw.createdAt  ?? raw.created_at ?? '') as string,
    updatedAt:   (raw.updatedAt  ?? raw.updated_at ?? '') as string,
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

export async function getAdminUsers(): Promise<AdminUser[]> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${BASE}/api/admin/users`)
  return raw.map(normalizeUser)
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
