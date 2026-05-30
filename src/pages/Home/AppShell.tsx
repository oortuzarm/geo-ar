import { useState, useEffect, useRef } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useSubscription } from '../../hooks/useSubscription'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { LAST_PROJECT_KEY } from '../../hooks/useWorkspace'
import type { GeoProject } from '../../types'

// ── Icons ─────────────────────────────────────────────────────────────────────

// Activity/pulse icon — conveys real-time monitoring
function LiveVisitsIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ChartBarIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function IntegrationsIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  )
}

// ── Plan sidebar widget ────────────────────────────────────────────────────────

function PlanSidebarWidget() {
  const { pointsCount } = useWorkspaceStore()
  const subscription    = useSubscription()
  const navigate        = useNavigate()

  if (!subscription.isTrialActive && !subscription.planName && subscription.limit === null) return null

  const atLimit = !subscription.canAddLocation(pointsCount)
  const pct = subscription.limit !== null
    ? Math.min(100, (pointsCount / subscription.limit) * 100)
    : 0

  const UsageBar = subscription.limit !== null ? (
    <>
      <div className="bg-gray-800 rounded-full h-1 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${atLimit ? 'bg-red-500' : 'bg-brand-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-gray-600 tabular-nums">
        {pointsCount} / {subscription.limit} ubicaciones
      </p>
    </>
  ) : null

  if (subscription.isTrialActive) {
    const daysLeft = subscription.trialDaysLeft
    return (
      <div className="mx-3 pt-3 pb-2.5 border-t border-gray-800/60 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-brand-300 leading-snug">
            Prueba del plan {subscription.planName}
          </p>
          <p className="text-[11px] text-gray-400">
            {daysLeft === 0
              ? 'Vence hoy'
              : `Vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'}`}
          </p>
        </div>
        {UsageBar}
        <button
          onClick={() => navigate('/app/plans')}
          className="self-start text-xs font-medium text-brand-400 hover:text-brand-300
                     transition-colors"
        >
          Elegir plan →
        </button>
      </div>
    )
  }

  return (
    <div className="mx-3 pt-3 pb-2.5 border-t border-gray-800/60 flex flex-col gap-2">
      {subscription.planName && (
        <span className="self-start inline-flex items-center px-2 py-0.5 rounded-full border
                         text-[11px] font-medium bg-brand-500/10 text-brand-400 border-brand-500/20">
          {subscription.planName}
        </span>
      )}
      {UsageBar}
    </div>
  )
}

// ── Community sidebar widget ───────────────────────────────────────────────────

function CommunitySidebarWidget() {
  const { project, updateProject } = useWorkspaceStore()
  const communityMapEnabled             = useSettingsStore((s) => s.communityMapEnabled)
  const communityMapDisabledTitle       = useSettingsStore((s) => s.communityMapDisabledTitle)
  const communityMapDisabledDescription = useSettingsStore((s) => s.communityMapDisabledDescription)
  const showCommunityMapSection         = useSettingsStore((s) => s.showCommunityMapSection)
  const subscription = useSubscription()
  const [toggling, setToggling] = useState(false)

  if (!showCommunityMapSection) return null
  if (!project || project.status !== 'active') return null

  const subscriptionActive = subscription.isTrialActive || subscription.status === 'active'

  async function handleToggle() {
    if (!project || toggling) return
    setToggling(true)
    try {
      const updated = await geoProjectsApi.saveProject(project.id, {
        communityEnabled: !project.communityEnabled,
      })
      updateProject(updated)
    } catch { /* silent */ }
    finally { setToggling(false) }
  }

  return (
    <div className="relative mx-3 pt-3 pb-3 border-t border-gray-800/60 flex flex-col gap-2.5">

      {/* Title */}
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
        {!communityMapEnabled && communityMapDisabledTitle
          ? communityMapDisabledTitle
          : 'Mapa comunitario Ubyca'}
      </p>

      {/* Subtitle */}
      <p className="text-[11px] text-gray-600 leading-snug">
        {!communityMapEnabled && communityMapDisabledDescription
          ? communityMapDisabledDescription
          : 'Amplia el alcance de tu proyecto permitiendo que más personas puedan descubrirlo'}
      </p>

      {/* Status badge */}
      <div>
        {project.communityEnabled ? (
          <>
            {project.communityStatus === 'approved' && (
              <span className={[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                subscriptionActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-gray-700/30 text-gray-500 border-gray-600/20',
              ].join(' ')}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  subscriptionActive ? 'bg-emerald-400' : 'bg-gray-500'
                }`} />
                {subscriptionActive ? 'Visible en el mapa' : 'Aprobado'}
              </span>
            )}
            {project.communityStatus === 'pending' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                Pendiente
              </span>
            )}
            {project.communityStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                No aprobado
              </span>
            )}
            {project.communityStatus === 'hidden' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-gray-700/40 text-gray-400 border-gray-600/30">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
                Oculto por Ubyca
              </span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-gray-600">No visible en el mapa</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={[
            'flex-1 py-1.5 rounded-md text-[11px] font-medium border transition-all duration-150 text-center focus:outline-none',
            toggling ? 'opacity-50 cursor-wait' : 'cursor-pointer',
            project.communityEnabled
              ? 'text-gray-400 border-gray-700/50 bg-gray-800/80 hover:bg-gray-700/80'
              : 'text-brand-400 border-brand-500/40 bg-brand-500/10 hover:bg-brand-500/20',
          ].join(' ')}
        >
          {toggling
            ? <span className="inline-flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              </span>
            : project.communityEnabled ? 'Desactivar' : 'Activar'}
        </button>
        <button
          onClick={() => window.open('/community', '_blank')}
          className="flex-1 py-1.5 rounded-md text-[11px] font-medium border text-center
                     text-gray-500 border-gray-700/40 bg-transparent hover:bg-gray-800/60
                     transition-all duration-150 cursor-pointer focus:outline-none"
        >
          Previsualizar
        </button>
      </div>

      {/* Global disabled overlay */}
      {!communityMapEnabled && (
        <div className="absolute inset-0 rounded-lg bg-gray-950/85 backdrop-blur-[2px]
                        flex flex-col items-center justify-center gap-1.5 px-3 text-center z-10">
          {communityMapDisabledTitle && (
            <p className="text-[11px] font-semibold text-gray-200 leading-snug">
              {communityMapDisabledTitle}
            </p>
          )}
          {communityMapDisabledDescription && (
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {communityMapDisabledDescription}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const side = {
  link:   'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
  active: 'bg-gray-800 text-gray-100',
  idle:   'text-gray-500 hover:text-gray-200 hover:bg-gray-800/60',
}

// ── AppShell ──────────────────────────────────────────────────────────────────

// ── Mobile trial banner (md:hidden — sidebar handles desktop) ─────────────────

function MobileTrialBanner() {
  const { isTrialActive, trialDaysLeft, planName } = useSubscription()
  const navigate = useNavigate()

  if (!isTrialActive || trialDaysLeft === null) return null

  return (
    <div className="md:hidden mx-4 mt-3 mb-1 flex items-center justify-between gap-3
                    bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-brand-300 leading-snug">
          Prueba del plan {planName}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {trialDaysLeft === 0
            ? 'Vence hoy'
            : `Vence en ${trialDaysLeft} día${trialDaysLeft === 1 ? '' : 's'}`}
        </p>
      </div>
      <button
        onClick={() => navigate('/app/plans')}
        className="flex-shrink-0 text-[11px] font-medium text-brand-300
                   hover:text-brand-200 transition-colors whitespace-nowrap"
      >
        Elegir plan →
      </button>
    </div>
  )
}

// ── No-plan banner ────────────────────────────────────────────────────────────

function NoPlanBanner() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const navigate    = useNavigate()

  if (!currentUser || currentUser.role === 'admin') return null
  if (currentUser.planId !== null && currentUser.planId !== undefined) return null

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5
                    bg-amber-500/10 border-b border-amber-500/20 flex-shrink-0">
      <p className="text-xs text-amber-300 leading-snug">
        Selecciona un plan para activar tu prueba gratuita.
      </p>
      <button
        onClick={() => navigate('/app/plans')}
        className="flex-shrink-0 text-xs font-semibold text-amber-200
                   bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30
                   px-3 py-1 rounded-lg transition-colors"
      >
        Ver planes
      </button>
    </div>
  )
}

export default function AppShell() {
  const { logout, currentUser } = useAuthStore()
  const navigate = useNavigate()
  const { isLoaded, setWorkspace } = useWorkspaceStore()
  const fetchStarted = useRef(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Fallback: load workspace data for sidebar when WorkspacePage hasn't done it yet.
  // Runs once per user session; WorkspacePage overwrites with fresher data when mounted.
  useEffect(() => {
    if (isLoaded || !currentUser || fetchStarted.current) return
    fetchStarted.current = true
    let cancelled = false
    ;(async () => {
      try {
        const lastId = localStorage.getItem(LAST_PROJECT_KEY)
        let project: GeoProject | null = null
        if (lastId) {
          try { project = await geoProjectsApi.fetchProject(lastId) ?? null }
          catch { /* project not found, fall through to list */ }
        }
        if (!project) {
          const all = await geoProjectsApi.listProjects()
          const match = all.find((p) => p.userId === currentUser.id) ?? all[0]
          project = match ?? null
        }
        if (!cancelled && project) {
          const pts = await geoPointsApi.listPoints(project.id)
          if (!cancelled) setWorkspace(project, pts.length)
        }
      } catch { /* silent — sidebar stays empty until WorkspacePage mounts */ }
    })()
    return () => { cancelled = true }
  }, [currentUser?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drawerOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [drawerOpen])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function closeDrawer() { setDrawerOpen(false) }

  return (
    <div
      className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden"
      style={{ height: '100dvh' }}
    >

      {/* ── Desktop left sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0
                        border-r border-gray-800 bg-gray-900">

        {/* Brand */}
        <div className="flex items-center px-5 h-16 border-b border-gray-800 flex-shrink-0">
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-10 w-auto object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavLink
            to="/app/live-visits"
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <LiveVisitsIcon />
            Visitas en Vivo
          </NavLink>
          <NavLink
            to="/app" end
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <MapPinIcon />
            Ubicaciones
          </NavLink>
          <NavLink
            to="/app/metrics"
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <ChartBarIcon />
            Analytics
          </NavLink>
          <NavLink
            to="/app/members"
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <UsersIcon />
            Miembros
          </NavLink>
          <NavLink
            to="/app/account"
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <AccountIcon />
            Mi cuenta
          </NavLink>
          <NavLink
            to="/app/integrations"
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <IntegrationsIcon />
            Integraciones
          </NavLink>
        </nav>

        {/* Plan widget — visible on all /app/* routes */}
        <PlanSidebarWidget />

        {/* Community map widget — visible when a project is active */}
        <CommunitySidebarWidget />

        {/* User + logout footer */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          {currentUser && (
            <p className="px-3 text-[11px] text-gray-600 truncate" title={currentUser.email}>
              {currentUser.email}
            </p>
          )}
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
            >
              <ShieldIcon />
              Panel administrador
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className={`w-full ${side.link} ${side.idle}`}
          >
            <LogoutIcon />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer backdrop ───────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* ── Mobile drawer panel ──────────────────────────────────────────────── */}
      <div
        className={[
          'md:hidden fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col',
          'bg-gray-900 border-r border-gray-800',
          'transition-transform duration-300 ease-in-out',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-800 flex-shrink-0">
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-9 w-auto object-contain select-none"
            draggable={false}
          />
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavLink
            to="/app/live-visits"
            onClick={closeDrawer}
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <LiveVisitsIcon />
            Visitas en Vivo
          </NavLink>
          <NavLink
            to="/app" end
            onClick={closeDrawer}
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <MapPinIcon />
            Ubicaciones
          </NavLink>
          <NavLink
            to="/app/metrics"
            onClick={closeDrawer}
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <ChartBarIcon />
            Analytics
          </NavLink>
          <NavLink
            to="/app/members"
            onClick={closeDrawer}
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <UsersIcon />
            Miembros
          </NavLink>
          <NavLink
            to="/app/integrations"
            onClick={closeDrawer}
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <IntegrationsIcon />
            Integraciones
          </NavLink>
          <NavLink
            to="/app/account"
            onClick={closeDrawer}
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <AccountIcon />
            Mi cuenta
          </NavLink>
        </nav>

        {/* Drawer community widget */}
        <CommunitySidebarWidget />

        {/* Drawer plan widget */}
        <PlanSidebarWidget />

        {/* Drawer footer */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          {currentUser && (
            <p className="px-3 text-[11px] text-gray-600 truncate" title={currentUser.email}>
              {currentUser.email}
            </p>
          )}
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={closeDrawer}
              className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
            >
              <ShieldIcon />
              Administración
            </NavLink>
          )}
          <button
            onClick={() => { closeDrawer(); handleLogout() }}
            className={`w-full ${side.link} ${side.idle}`}
          >
            <LogoutIcon />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── Main content column ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar with hamburger ─────────────────────────────────────── */}
        <div className="md:hidden flex items-center h-14 px-4 border-b border-gray-800 bg-gray-900 flex-shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img
            src="/logo-blanco.png"
            alt="Ubyca"
            className="h-8 w-auto object-contain select-none ml-3"
            draggable={false}
          />
        </div>

        <NoPlanBanner />

        {/* Page renders here — each page manages its own sticky header */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <MobileTrialBanner />
          <Outlet />
        </main>

      </div>
    </div>
  )
}
