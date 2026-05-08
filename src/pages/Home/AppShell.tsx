import { Outlet, NavLink } from 'react-router-dom'

// ── Icons ─────────────────────────────────────────────────────────────────────

function FolderIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
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

// ── Style helpers ─────────────────────────────────────────────────────────────

const side = {
  link: 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
  active: 'bg-gray-800 text-gray-100',
  idle: 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/60',
}

const bottom = {
  link: 'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors leading-none',
  active: 'text-brand-400',
  idle: 'text-gray-500',
}

// ── AppShell ──────────────────────────────────────────────────────────────────

export default function AppShell() {
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">

      {/* ── Desktop left sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0
                        border-r border-gray-800 bg-gray-900">

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-800 flex-shrink-0">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-100 text-sm leading-none">GeoAR</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Experiencias GPS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavLink
            to="/" end
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <FolderIcon />
            Proyectos
          </NavLink>
          <NavLink
            to="/metrics"
            className={({ isActive }) => `${side.link} ${isActive ? side.active : side.idle}`}
          >
            <ChartBarIcon />
            Métricas
          </NavLink>
        </nav>

        {/* Version footer */}
        <div className="px-5 py-4 border-t border-gray-800">
          <p className="text-[11px] text-gray-700">GeoAR · v1</p>
        </div>
      </aside>

      {/* ── Main content column ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Page renders here — each page manages its own sticky header */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>

        {/* ── Mobile bottom tab bar ─────────────────────────────────────────── */}
        <nav
          className="md:hidden flex border-t border-gray-800 bg-gray-900 flex-shrink-0"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <NavLink
            to="/" end
            className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
          >
            <FolderIcon />
            Proyectos
          </NavLink>
          <NavLink
            to="/metrics"
            className={({ isActive }) => `${bottom.link} ${isActive ? bottom.active : bottom.idle}`}
          >
            <ChartBarIcon />
            Métricas
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
