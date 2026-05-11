import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { getAdminUsers, getAdminProjects, getAdminMetrics } from '../../services/adminApi'
import type { AdminUser, AdminProject, AdminMetrics } from '../../types/admin.types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function fmtNum(n: number) {
  return n.toLocaleString('es-AR')
}

// ── Shared UI atoms ───────────────────────────────────────────────────────────

function SearchInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                   text-sm text-gray-200 placeholder-gray-500 w-full
                   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                   transition-colors"
      />
    </div>
  )
}

function Select({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                 text-sm text-gray-200 focus:outline-none focus:ring-2
                 focus:ring-brand-500 focus:border-transparent transition-colors
                 appearance-none cursor-pointer"
    >
      {children}
    </select>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    draft:     'bg-gray-500/15    text-gray-400    border-gray-500/25',
    inactive:  'bg-amber-500/15   text-amber-300   border-amber-500/25',
    suspended: 'bg-red-500/15     text-red-300     border-red-500/25',
  }
  const label: Record<string, string> = {
    active: 'Publicado', draft: 'Borrador', inactive: 'Inactivo', suspended: 'Suspendido',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${map[status] ?? map.draft}`}>
      {label[status] ?? status}
    </span>
  )
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${
      role === 'admin'
        ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
        : 'bg-brand-500/15  text-brand-300  border-brand-500/25'
    }`}>
      {role === 'admin' ? 'Admin' : 'Usuario'}
    </span>
  )
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} className="py-10 text-center text-sm text-gray-500">
        {message}
      </td>
    </tr>
  )
}

// ── Metric card ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  value: number
  accent?: 'default' | 'green' | 'amber' | 'red' | 'purple'
  icon: React.ReactNode
}

function MetricCard({ label, value, icon, accent = 'default' }: MetricCardProps) {
  const ring: Record<string, string> = {
    default: 'border-gray-700/60',
    green:   'border-emerald-700/40',
    amber:   'border-amber-700/40',
    red:     'border-red-700/40',
    purple:  'border-purple-700/40',
  }
  const iconBg: Record<string, string> = {
    default: 'bg-gray-800 text-gray-400',
    green:   'bg-emerald-900/40 text-emerald-400',
    amber:   'bg-amber-900/40 text-amber-400',
    red:     'bg-red-900/40 text-red-400',
    purple:  'bg-purple-900/40 text-purple-400',
  }
  return (
    <div className={`bg-gray-900 border ${ring[accent]} rounded-xl p-4 flex items-center gap-4`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white leading-none">{fmtNum(value)}</p>
        <p className="text-xs text-gray-400 mt-1 leading-snug">{label}</p>
      </div>
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ── Users table ───────────────────────────────────────────────────────────────

function UsersTable({ users }: { users: AdminUser[] }) {
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase()
      if (q && !u.email.toLowerCase().includes(q)) return false
      if (roleFilter   !== 'all' && u.role   !== roleFilter)   return false
      if (statusFilter !== 'all' && u.status !== statusFilter) return false
      return true
    })
  }, [users, search, roleFilter, statusFilter])

  return (
    <>
      <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-gray-800/60">
        <div className="flex-1 min-w-[180px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por email…" />
        </div>
        <Select value={roleFilter} onChange={setRoleFilter}>
          <option value="all">Todos los roles</option>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </Select>
        <Select value={statusFilter} onChange={setStatusFilter}>
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="suspended">Suspendido</option>
        </Select>
        <span className="self-center text-xs text-gray-500 ml-1">
          {filtered.length} de {users.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800/60">
              {['Email', 'Rol', 'Estado', 'Proyectos', 'Puntos', 'Registro'].map((h) => (
                <th key={h}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.length === 0
              ? <EmptyRow cols={6} message="No se encontraron usuarios." />
              : filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-200 max-w-[220px] truncate">
                    {u.email}
                  </td>
                  <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-5 py-3 text-gray-300 tabular-nums">{u.projectsCount}</td>
                  <td className="px-5 py-3 text-gray-300 tabular-nums">{u.pointsCount}</td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Projects table ────────────────────────────────────────────────────────────

function ProjectsTable({ projects }: { projects: AdminProject[] }) {
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orphanOnly,   setOrphanOnly]   = useState(false)

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = search.toLowerCase()
      if (q && !p.title.toLowerCase().includes(q) && !(p.userEmail ?? '').toLowerCase().includes(q))
        return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (orphanOnly && !p.isOrphan) return false
      return true
    })
  }, [projects, search, statusFilter, orphanOnly])

  return (
    <>
      <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-gray-800/60">
        <div className="flex-1 min-w-[180px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o email…" />
        </div>
        <Select value={statusFilter} onChange={setStatusFilter}>
          <option value="all">Todos los estados</option>
          <option value="active">Publicado</option>
          <option value="draft">Borrador</option>
          <option value="inactive">Inactivo</option>
        </Select>
        <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700
                          rounded-lg cursor-pointer hover:border-gray-600 transition-colors select-none">
          <input
            type="checkbox"
            checked={orphanOnly}
            onChange={(e) => setOrphanOnly(e.target.checked)}
            className="accent-brand-500 w-3.5 h-3.5"
          />
          <span className="text-sm text-gray-300">Solo huérfanos</span>
        </label>
        <span className="self-center text-xs text-gray-500 ml-1">
          {filtered.length} de {projects.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800/60">
              {['Nombre', 'Estado', 'Usuario', 'Puntos', 'Creado', 'Modificado'].map((h) => (
                <th key={h}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.length === 0
              ? <EmptyRow cols={6} message="No se encontraron proyectos." />
              : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-medium text-gray-200 max-w-[200px] block truncate">
                      {p.title || <span className="text-gray-500 italic">Sin nombre</span>}
                    </span>
                    {p.isOrphan && (
                      <span className="text-[10px] text-amber-400 font-medium">Sin propietario</span>
                    )}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-gray-400 max-w-[180px] truncate">
                    {p.userEmail ?? <span className="text-gray-600 italic">—</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-300 tabular-nums">{p.pointsCount}</td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{fmtDate(p.createdAt)}</td>
                  <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{fmtDate(p.updatedAt)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />
}

// ── AdminPage ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const [users,    setUsers]    = useState<AdminUser[]>([])
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [metrics,  setMetrics]  = useState<AdminMetrics | null>(null)

  const [loadingUsers,    setLoadingUsers]    = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingMetrics,  setLoadingMetrics]  = useState(true)
  const [errorUsers,    setErrorUsers]    = useState<string | null>(null)
  const [errorProjects, setErrorProjects] = useState<string | null>(null)
  const [errorMetrics,  setErrorMetrics]  = useState<string | null>(null)

  useEffect(() => {
    getAdminMetrics()
      .then(setMetrics)
      .catch(() => setErrorMetrics('No se pudieron cargar las métricas.'))
      .finally(() => setLoadingMetrics(false))

    getAdminUsers()
      .then(setUsers)
      .catch(() => setErrorUsers('No se pudieron cargar los usuarios.'))
      .finally(() => setLoadingUsers(false))

    getAdminProjects()
      .then(setProjects)
      .catch(() => setErrorProjects('No se pudieron cargar los proyectos.'))
      .finally(() => setLoadingProjects(false))
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  // ── Icons ─────────────────────────────────────────────────────────────────

  const UserIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm9 3v6m3-3h-6" />
    </svg>
  )
  const ActiveIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
  const FolderIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  )
  const PublishedIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
  const OrphanIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
  const PointsIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm
                         flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-100 text-sm">Panel administrador</span>
          </div>

          <div className="flex-1" />

          {/* Admin email */}
          <span className="text-xs text-gray-500 hidden sm:block truncate max-w-[200px]">
            {currentUser?.email}
          </span>

          {/* Nav buttons */}
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors
                       px-3 py-1.5 rounded-lg hover:bg-gray-800 hidden sm:block"
          >
            Ir al dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors
                       px-3 py-1.5 border border-gray-700 hover:border-gray-600 rounded-lg"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">

        {/* ── Metrics ── */}
        {loadingMetrics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[76px] rounded-xl" />
            ))}
          </div>
        ) : errorMetrics ? (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40
                        rounded-xl px-4 py-3">{errorMetrics}</p>
        ) : metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard label="Usuarios totales"       value={metrics.totalUsers}             icon={UserIcon}      />
            <MetricCard label="Usuarios activos"       value={metrics.totalActiveUsers}       icon={ActiveIcon}    accent="green"  />
            <MetricCard label="Proyectos totales"      value={metrics.totalProjects}          icon={FolderIcon}    />
            <MetricCard label="Proyectos publicados"   value={metrics.totalPublishedProjects} icon={PublishedIcon} accent="green"  />
            <MetricCard label="Proyectos huérfanos"    value={metrics.totalOrphanProjects}    icon={OrphanIcon}    accent={metrics.totalOrphanProjects > 0 ? 'amber' : 'default'} />
            <MetricCard label="Puntos totales"         value={metrics.totalPoints}            icon={PointsIcon}    accent="purple" />
          </div>
        ) : null}

        {/* ── Users section ── */}
        <Section title="Usuarios">
          {loadingUsers ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-lg" />
              ))}
            </div>
          ) : errorUsers ? (
            <p className="px-5 py-6 text-sm text-red-400">{errorUsers}</p>
          ) : (
            <UsersTable users={users} />
          )}
        </Section>

        {/* ── Projects section ── */}
        <Section title="Proyectos">
          {loadingProjects ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-lg" />
              ))}
            </div>
          ) : errorProjects ? (
            <p className="px-5 py-6 text-sm text-red-400">{errorProjects}</p>
          ) : (
            <ProjectsTable projects={projects} />
          )}
        </Section>

      </main>
    </div>
  )
}
