import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  getAdminUsers, getAdminProjects, getAdminMetrics,
  deleteAdminProject, deleteAdminUser,
} from '../../services/adminApi'
import type { AdminUser, AdminProject, AdminMetrics } from '../../types/admin.types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminUserRow extends AdminUser {
  workspace: AdminProject | null
}

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

function WorkspaceStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:   'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    draft:    'bg-gray-500/15    text-gray-400    border-gray-500/25',
    inactive: 'bg-amber-500/15   text-amber-300   border-amber-500/25',
  }
  const label: Record<string, string> = {
    active: 'Publicado', draft: 'Borrador', inactive: 'Inactivo',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${map[status] ?? map.draft}`}>
      {label[status] ?? status}
    </span>
  )
}

function UserStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    suspended: 'bg-red-500/15     text-red-300     border-red-500/25',
  }
  const label: Record<string, string> = {
    active: 'Activo', suspended: 'Suspendido',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${map[status] ?? map.active}`}>
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

// ── Delete workspace dialog ───────────────────────────────────────────────────

function DeleteWorkspaceDialog({
  row, deleting, onConfirm, onCancel,
}: {
  row: AdminUserRow
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const ws = row.workspace!

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !deleting) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleting, onCancel])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => { if (!deleting) onCancel() }}
      />
      <div className="relative bg-gray-900 border border-amber-700/40 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25
                            flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-100">Eliminar workspace</h3>
              <p className="text-xs text-gray-500 mt-0.5">Esta acción no se puede deshacer</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-1">
            ¿Seguro que querés eliminar el workspace de{' '}
            <span className="font-medium text-gray-100">{row.email}</span>?
          </p>
          <p className="text-sm font-semibold text-gray-100 mb-1 truncate">
            {ws.title || <span className="italic text-gray-500">Sin nombre</span>}
          </p>
          {ws.pointsCount > 0 && (
            <p className="text-xs text-amber-400 mt-2">
              Se eliminarán también las {ws.pointsCount} ubicaciones asociadas.
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700
                         text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-500
                         text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Eliminando…
                </>
              ) : 'Eliminar workspace'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Delete user dialog ────────────────────────────────────────────────────────

function DeleteUserDialog({
  row, deleting, onConfirm, onCancel,
}: {
  row: AdminUserRow
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !deleting) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleting, onCancel])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => { if (!deleting) onCancel() }}
      />
      <div className="relative bg-gray-900 border border-red-700/50 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/25
                            flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-100">Eliminar usuario</h3>
              <p className="text-xs text-red-400 mt-0.5">Acción irreversible</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-3">
            ¿Seguro que querés eliminar a{' '}
            <span className="font-medium text-gray-100">{row.email}</span>?
          </p>

          <ul className="text-xs text-red-300 space-y-1.5 bg-red-950/30 border border-red-800/40
                         rounded-lg px-4 py-3">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">•</span>
              Se eliminará su cuenta y todos sus datos de sesión.
            </li>
            {row.workspace && (
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">•</span>
                {row.workspace.pointsCount > 0
                  ? `Se eliminará su workspace junto con las ${row.workspace.pointsCount} ubicaciones asociadas.`
                  : 'Se eliminará su workspace y todas sus ubicaciones.'}
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">•</span>
              Esta acción no se puede deshacer.
            </li>
          </ul>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700
                         text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500
                         text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Eliminando…
                </>
              ) : 'Eliminar usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
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

// ── Loading skeleton ──────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />
}

// ── Users table (unified with workspace data) ─────────────────────────────────

function UsersTable({
  rows, deletingWorkspaceId, deletingUserId,
  onViewWorkspace, onDeleteWorkspace, onDeleteUser,
}: {
  rows: AdminUserRow[]
  deletingWorkspaceId: string | null
  deletingUserId: string | null
  onViewWorkspace: (row: AdminUserRow) => void
  onDeleteWorkspace: (row: AdminUserRow) => void
  onDeleteUser: (row: AdminUserRow) => void
}) {
  const [search,       setSearch]       = useState('')
  const [roleFilter,   setRoleFilter]   = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = search.toLowerCase()
      if (q && !r.email.toLowerCase().includes(q) &&
          !(r.workspace?.title ?? '').toLowerCase().includes(q)) return false
      if (roleFilter   !== 'all' && r.role   !== roleFilter)   return false
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      return true
    })
  }, [rows, search, roleFilter, statusFilter])

  const anyDeleting = !!deletingWorkspaceId || !!deletingUserId

  return (
    <>
      <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-gray-800/60">
        <div className="flex-1 min-w-[180px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por email o workspace…" />
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
          {filtered.length} de {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800/60">
              {['Email', 'Rol', 'Workspace', 'Ubicaciones', 'Estado', 'Registro', 'Modificado', ''].map((h, i) => (
                <th key={i}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.length === 0
              ? <EmptyRow cols={8} message="No se encontraron usuarios." />
              : filtered.map((row) => {
                const ws             = row.workspace
                const isDeletingWs   = deletingWorkspaceId === ws?.id
                const isDeletingUser = deletingUserId === row.id

                return (
                  <tr key={row.id}
                    className={`hover:bg-gray-800/30 transition-colors ${isDeletingUser ? 'opacity-50' : ''}`}>

                    {/* Email */}
                    <td className="px-5 py-3 font-medium text-gray-200 max-w-[220px]">
                      <span className="block truncate">{row.email}</span>
                    </td>

                    {/* Rol */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <RoleBadge role={row.role} />
                    </td>

                    {/* Workspace */}
                    <td className="px-5 py-3 max-w-[180px]">
                      {ws ? (
                        <div className="space-y-1">
                          <span className="block text-gray-200 text-xs truncate">
                            {ws.title || <span className="italic text-gray-500">Sin nombre</span>}
                          </span>
                          <WorkspaceStatusBadge status={ws.status} />
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Ubicaciones */}
                    <td className="px-5 py-3 text-gray-300 tabular-nums">
                      {ws !== null ? ws.pointsCount : <span className="text-gray-600">—</span>}
                    </td>

                    {/* Estado (user) */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <UserStatusBadge status={row.status} />
                    </td>

                    {/* Registro */}
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                      {fmtDate(row.createdAt)}
                    </td>

                    {/* Modificado */}
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                      {fmtDate(row.updatedAt)}
                    </td>

                    {/* Acciones */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">

                        {/* Ver workspace */}
                        <button
                          onClick={() => { if (ws) onViewWorkspace(row) }}
                          disabled={!ws || anyDeleting}
                          title={ws ? 'Ver workspace' : 'Sin workspace'}
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            !ws || anyDeleting
                              ? 'text-gray-700 cursor-not-allowed'
                              : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700 cursor-pointer',
                          ].join(' ')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>

                        {/* Eliminar workspace */}
                        <button
                          onClick={() => { if (ws && !anyDeleting) onDeleteWorkspace(row) }}
                          disabled={!ws || anyDeleting}
                          title={ws ? 'Eliminar workspace' : 'Sin workspace'}
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            !ws || (anyDeleting && !isDeletingWs)
                              ? 'text-gray-700 cursor-not-allowed'
                              : isDeletingWs
                              ? 'text-amber-400 cursor-wait'
                              : 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 cursor-pointer',
                          ].join(' ')}
                        >
                          {isDeletingWs ? (
                            <span className="w-3 h-3 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>

                        {/* Eliminar usuario */}
                        <button
                          onClick={() => { if (!anyDeleting) onDeleteUser(row) }}
                          disabled={anyDeleting}
                          title="Eliminar usuario"
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            anyDeleting && !isDeletingUser
                              ? 'text-gray-700 cursor-not-allowed'
                              : isDeletingUser
                              ? 'text-red-400 cursor-wait'
                              : 'text-red-500/70 hover:text-red-400 hover:bg-red-500/10 cursor-pointer',
                          ].join(' ')}
                        >
                          {isDeletingUser ? (
                            <span className="w-3 h-3 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                            </svg>
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </>
  )
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

  const [deleteWorkspaceTarget, setDeleteWorkspaceTarget] = useState<AdminUserRow | null>(null)
  const [deleteUserTarget,      setDeleteUserTarget]      = useState<AdminUserRow | null>(null)
  const [deletingWorkspaceId,   setDeletingWorkspaceId]   = useState<string | null>(null)
  const [deletingUserId,        setDeletingUserId]        = useState<string | null>(null)
  const [refreshing,            setRefreshing]            = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

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
      .catch(() => setErrorProjects('No se pudieron cargar los workspaces.'))
      .finally(() => setLoadingProjects(false))
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  // Merge users + projects into unified rows.
  // When a user has multiple projects, pick the most recently updated one —
  // this matches the dashboard's useWorkspace logic (sorted[0] by updatedAt desc).
  const projectByUserId = useMemo(() => {
    const map = new Map<string, AdminProject>()
    for (const p of projects) {
      if (p.userId === null) continue
      const existing = map.get(p.userId)
      if (!existing || p.updatedAt > existing.updatedAt) {
        map.set(p.userId, p)
      }
    }
    return map
  }, [projects])

  const mergedRows = useMemo<AdminUserRow[]>(() => {
    const rows = users.map((u) => ({ ...u, workspace: projectByUserId.get(u.id) ?? null }))
    rows.forEach((r) => {
      if (r.workspace) {
        console.log('[WORKSPACE_STATUS_ADMIN] userId=', r.id,
          'id=', r.workspace.id, 'status=', r.workspace.status,
          'updatedAt=', r.workspace.updatedAt)
      }
    })
    return rows
  }, [users, projectByUserId])

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  async function refreshData() {
    setRefreshing(true)
    try {
      const [freshUsers, freshProjects, freshMetrics] = await Promise.all([
        getAdminUsers(),
        getAdminProjects(),
        getAdminMetrics(),
      ])
      setUsers(freshUsers)
      setProjects(freshProjects)
      setMetrics(freshMetrics)
    } catch {
      setToast({ msg: 'No se pudieron actualizar los datos.', type: 'error' })
    } finally {
      setRefreshing(false)
    }
  }

  async function handleDeleteWorkspaceConfirmed() {
    if (!deleteWorkspaceTarget?.workspace) return
    const row = deleteWorkspaceTarget
    const ws  = row.workspace!
    console.log('[ADMIN_DELETE_WORKSPACE] userId=', row.id, 'workspaceId=', ws.id)
    setDeleteWorkspaceTarget(null)
    setDeletingWorkspaceId(ws.id)
    try {
      await deleteAdminProject(ws.id)
      setProjects((prev) => prev.filter((p) => p.id !== ws.id))
      getAdminMetrics().then(setMetrics).catch(() => null)
      setToast({ msg: `Workspace "${ws.title || 'Sin nombre'}" eliminado.`, type: 'success' })
    } catch {
      setToast({ msg: 'No se pudo eliminar el workspace. Intentá de nuevo.', type: 'error' })
    } finally {
      setDeletingWorkspaceId(null)
    }
  }

  async function handleDeleteUserConfirmed() {
    if (!deleteUserTarget) return
    const row = deleteUserTarget
    console.log('[ADMIN_DELETE_USER] userId=', row.id, 'email=', row.email)
    setDeleteUserTarget(null)
    setDeletingUserId(row.id)
    try {
      await deleteAdminUser(row.id)
      setUsers((prev) => prev.filter((u) => u.id !== row.id))
      if (row.workspace) {
        setProjects((prev) => prev.filter((p) => p.id !== row.workspace!.id))
      }
      getAdminMetrics().then(setMetrics).catch(() => null)
      setToast({ msg: `Usuario "${row.email}" eliminado.`, type: 'success' })
    } catch {
      setToast({ msg: 'No se pudo eliminar el usuario. Intentá de nuevo.', type: 'error' })
    } finally {
      setDeletingUserId(null)
    }
  }

  function handleViewWorkspace(row: AdminUserRow) {
    if (!row.workspace) return
    window.open('/project/' + row.workspace.id, '_blank')
  }

  const tableLoading = loadingUsers || loadingProjects
  const tableError   = errorUsers ?? errorProjects ?? null

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

          <span className="text-xs text-gray-500 hidden sm:block truncate max-w-[200px]">
            {currentUser?.email}
          </span>

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[76px] rounded-xl" />
            ))}
          </div>
        ) : errorMetrics ? (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40
                        rounded-xl px-4 py-3">{errorMetrics}</p>
        ) : metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <MetricCard label="Usuarios totales"      value={metrics.totalUsers}             icon={UserIcon}      />
            <MetricCard label="Usuarios activos"      value={metrics.totalActiveUsers}       icon={ActiveIcon}    accent="green"  />
            <MetricCard label="Ws. publicados"        value={metrics.totalPublishedProjects} icon={PublishedIcon} accent="green"  />
            <MetricCard label="Ws. huérfanos"         value={metrics.totalOrphanProjects}    icon={OrphanIcon}    accent={metrics.totalOrphanProjects > 0 ? 'amber' : 'default'} />
            <MetricCard label="Ubicaciones totales"   value={metrics.totalPoints}            icon={PointsIcon}    accent="purple" />
          </div>
        ) : null}

        {/* ── Users section ── */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Usuarios</h2>
            <button
              onClick={refreshData}
              disabled={refreshing || tableLoading}
              title="Actualizar datos desde el servidor"
              className={[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                'border border-gray-700 text-gray-400 transition-colors',
                refreshing || tableLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-gray-600 hover:text-gray-200 hover:bg-gray-800 cursor-pointer',
              ].join(' ')}
            >
              <svg
                className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>

          {tableLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 rounded-lg" />
              ))}
            </div>
          ) : tableError ? (
            <p className="px-5 py-6 text-sm text-red-400">{tableError}</p>
          ) : (
            <UsersTable
              rows={mergedRows}
              deletingWorkspaceId={deletingWorkspaceId}
              deletingUserId={deletingUserId}
              onViewWorkspace={handleViewWorkspace}
              onDeleteWorkspace={(row) => setDeleteWorkspaceTarget(row)}
              onDeleteUser={(row) => setDeleteUserTarget(row)}
            />
          )}
        </section>

      </main>

      {/* ── Delete workspace dialog ── */}
      {deleteWorkspaceTarget?.workspace && (
        <DeleteWorkspaceDialog
          row={deleteWorkspaceTarget}
          deleting={!!deletingWorkspaceId}
          onConfirm={handleDeleteWorkspaceConfirmed}
          onCancel={() => setDeleteWorkspaceTarget(null)}
        />
      )}

      {/* ── Delete user dialog ── */}
      {deleteUserTarget && (
        <DeleteUserDialog
          row={deleteUserTarget}
          deleting={!!deletingUserId}
          onConfirm={handleDeleteUserConfirmed}
          onCancel={() => setDeleteUserTarget(null)}
        />
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className={[
          'fixed bottom-5 right-5 z-[10000] flex items-center gap-3',
          'px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium',
          'animate-fade-in max-w-sm',
          toast.type === 'success'
            ? 'bg-emerald-900/90 border-emerald-700/50 text-emerald-200'
            : 'bg-red-900/90 border-red-700/50 text-red-200',
        ].join(' ')}>
          {toast.type === 'success' ? (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
