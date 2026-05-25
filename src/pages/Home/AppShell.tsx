import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useGeoStore } from '../../store/geoStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useSubscription } from '../../hooks/useSubscription'
import { geoProjectsApi } from '../../services'

// ── Icons ─────────────────────────────────────────────────────────────────────

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

// ── CommunitySidebarWidget ────────────────────────────────────────────────────

function CommunitySidebarWidget() {
  const { project, setProject } = useGeoStore()
  const communityMapEnabled         = useSettingsStore((s) => s.communityMapEnabled)
  const communityMapDisabledTitle   = useSettingsStore((s) => s.communityMapDisabledTitle)
  const communityMapDisabledDescription = useSettingsStore((s) => s.communityMapDisabledDescription)
  const subscription = useSubscription()
  const [toggling, setToggling] = useState(false)

  if (!project || project.status !== 'active') return null

  async function handleToggle() {
    if (!project || toggling) return
    setToggling(true)
    try {
      const updated = await geoProjectsApi.saveProject(project.id, {
        communityEnabled: !project.communityEnabled,
      })
      setProject(updated)
    } catch { /* silent */ }
    finally { setToggling(false) }
  }

  return (
    <div className="relative mx-3 mb-3 rounded-xl border border-white/[0.06] bg-gray-800/50 p-3 flex flex-col gap-3 overflow-hidden">

      {/* Label + preview link */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none">
          Mapa comunitario
        </p>
        <button
          onClick={() => window.open('/community', '_blank')}
          className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors leading-none cursor-pointer"
        >
          Ver
        </button>
      </div>

      {/* Community status badge */}
      <div className="min-h-[22px]">
        {project.communityEnabled ? (
          <>
            {project.communityStatus === 'approved' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {subscription.isTrialActive || subscription.status === 'active'
                  ? 'Visible en el mapa'
                  : 'Aprobado — sin suscripción'}
              </span>
            )}
            {project.communityStatus === 'pending' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                Pendiente de aprobación
              </span>
            )}
            {project.communityStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                No aprobado
              </span>
            )}
            {project.communityStatus === 'hidden' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium border bg-gray-700/40 text-gray-400 border-gray-600/30">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
                Oculto por Ubyca
              </span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-gray-600">No aparece en el mapa</span>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className={[
          'w-full py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          toggling ? 'opacity-50 cursor-wait' : 'cursor-pointer',
          project.communityEnabled
            ? 'text-gray-400 border-gray-600/40 bg-gray-800 hover:bg-gray-700 focus:ring-gray-600'
            : 'text-brand-400 border-brand-500/40 bg-brand-500/10 hover:bg-brand-500/20 focus:ring-brand-500',
        ].join(' ')}
      >
        {toggling
          ? <span className="inline-flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-current/30 border-t-current animate-spin" />
              Guardando…
            </span>
          : project.communityEnabled ? 'Desactivar' : 'Activar'}
      </button>

      {/* Disabled overlay */}
      {!communityMapEnabled && (
        <div className="absolute inset-0 rounded-xl bg-gray-950/85 backdrop-blur-[2px]
                        flex flex-col items-center justify-center gap-1.5 px-3 text-center z-10">
          <p className="text-[11px] font-semibold text-gray-300 leading-snug">
            {communityMapDisabledTitle || 'Próximamente'}
          </p>
          {communityMapDisabledDescription && (
            <p className="text-[10px] text-gray-500 leading-snug">
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

const bottom = {
  link:   'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors leading-none',
  active: 'text-brand-400',
  idle:   'text-gray-500',
}

// ── AppShell ──────────────────────────────────────────────────────────────────

export default function AppShell() {
  const { logout, currentUser } = useAuthStore()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

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
        </nav>

        {/* Community map widget — only shown when a project is active */}
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

      {/* ── Main content column ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Page renders here — each page manages its own sticky header */}
        <main className="flex-1 min-h-0 overflow-y-auto scroll-area-mobile md:pb-0">
          <Outlet />
        </main>

        {/* ── Mobile bottom tab bar — fixed to viewport bottom ─────────────── */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-800 bg-gray-900"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <NavLink
            to="/app" end
            className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
          >
            <MapPinIcon />
            Ubicaciones
          </NavLink>
          <NavLink
            to="/app/metrics"
            className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
          >
            <ChartBarIcon />
            Analytics
          </NavLink>
          <NavLink
            to="/app/members"
            className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
          >
            <UsersIcon />
            Miembros
          </NavLink>
          <NavLink
            to="/app/account"
            className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
          >
            <AccountIcon />
            Mi cuenta
          </NavLink>
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
            >
              <ShieldIcon />
              Admin
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            className={`${bottom.link} ${bottom.idle}`}
          >
            <LogoutIcon />
            Salir
          </button>
        </nav>
      </div>
    </div>
  )
}
