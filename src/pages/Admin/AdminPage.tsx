import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  getAdminUsers, getAdminProjects, getAdminMetrics,
  getAdminPlans,
  getAdminUser,
  deleteAdminProject, deleteAdminUser,
  updateAdminUserSubscription,
  updateAdminProjectCommunityStatus,
  createAdminUser,
  type UpdateSubscriptionPayload,
  type SubscriptionSaveResponse,
  type CreateAdminUserPayload,
} from '../../services/adminApi'
import { getAdminSettings, patchAdminSettings } from '../../services/settingsApi'
import type { AdminUser, AdminUserDetail, AdminProject, AdminMetrics, AdminPlan } from '../../types/admin.types'

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

function SubscriptionBadge({ status }: { status: AdminUser['subscriptionStatus'] }) {
  if (!status) return <span className="text-gray-600 text-xs">—</span>
  const map: Record<string, string> = {
    trial:    'bg-amber-500/15   text-amber-300   border-amber-500/25',
    active:   'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    expired:  'bg-red-500/15     text-red-300     border-red-500/25',
    canceled: 'bg-gray-500/15   text-gray-400    border-gray-500/25',
  }
  const label: Record<string, string> = {
    trial: 'Trial', active: 'Activo', expired: 'Vencido', canceled: 'Cancelado',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${map[status] ?? map.canceled}`}>
      {label[status] ?? status}
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

function CommunityStatusBadge({ status }: { status: AdminProject['communityStatus'] }) {
  const map: Record<string, string> = {
    pending:  'bg-amber-500/15   text-amber-300   border-amber-500/25',
    approved: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    rejected: 'bg-red-500/15     text-red-300     border-red-500/25',
    hidden:   'bg-gray-500/15    text-gray-400    border-gray-500/25',
  }
  const label: Record<string, string> = {
    pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado', hidden: 'Oculto',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium
                      leading-none whitespace-nowrap ${map[status] ?? map.pending}`}>
      {label[status] ?? status}
    </span>
  )
}

// ── Community settings panel ──────────────────────────────────────────────────

function CommunitySettingsPanel() {
  const [enabled,     setEnabled]     = useState(true)
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [saveResult,  setSaveResult]  = useState<'success' | 'error' | null>(null)

  useEffect(() => {
    getAdminSettings()
      .then((s) => {
        setEnabled(s.communityMapEnabled)
        setTitle(s.communityMapDisabledTitle)
        setDescription(s.communityMapDisabledDescription)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!saveResult) return
    const t = setTimeout(() => setSaveResult(null), 3000)
    return () => clearTimeout(t)
  }, [saveResult])

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setSaveResult(null)
    try {
      const updated = await patchAdminSettings({
        communityMapEnabled:             enabled,
        communityMapDisabledTitle:       title,
        communityMapDisabledDescription: description,
      })
      setEnabled(updated.communityMapEnabled)
      setTitle(updated.communityMapDisabledTitle)
      setDescription(updated.communityMapDisabledDescription)
      setSaveResult('success')
    } catch {
      setSaveResult('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-white">Configuración del mapa comunitario</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Controla si el mapa comunitario está disponible públicamente y el mensaje que verán los usuarios cuando esté deshabilitado.
        </p>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="p-5 space-y-5">

          {/* Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-200 font-medium">Habilitar mapa comunitario</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Cuando está desactivado, los usuarios ven un mensaje de no disponible en /community.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled((v) => !v)}
              className={[
                'relative w-10 h-5 rounded-full flex-shrink-0 transition-colors cursor-pointer',
                enabled ? 'bg-brand-600' : 'bg-gray-700',
              ].join(' ')}
            >
              <span className={[
                'absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform',
                enabled ? 'translate-x-5' : '',
              ].join(' ')} />
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1.5">
              Título cuando está deshabilitado
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Mapa comunitario próximamente"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
                         text-gray-100 placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1.5">
              Descripción cuando está deshabilitado
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Ej: Estamos preparando el mapa comunitario. Volvé pronto."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
                         text-gray-100 placeholder-gray-600 resize-none
                         focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
            />
          </div>

          {/* Save row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-xs min-h-[1rem]">
              {saveResult === 'success' && (
                <span className="text-emerald-400">Cambios guardados.</span>
              )}
              {saveResult === 'error' && (
                <span className="text-red-400">No se pudo guardar. Intentá de nuevo.</span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={[
                'px-4 py-2 rounded-lg text-xs font-semibold transition-colors',
                'bg-brand-600 hover:bg-brand-500 text-white',
                saving ? 'opacity-60 cursor-wait' : 'cursor-pointer',
              ].join(' ')}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>

        </div>
      )}
    </section>
  )
}

// ── Community table ───────────────────────────────────────────────────────────

type CommunityFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'hidden'

function CommunityTable({
  projects,
  updating,
  onUpdateStatus,
}: {
  projects:       AdminProject[]
  updating:       string | null
  onUpdateStatus: (id: string, status: AdminProject['communityStatus']) => void
}) {
  const [filter, setFilter] = useState<CommunityFilter>('all')
  const [search, setSearch] = useState('')

  const communityProjects = projects.filter((p) => p.communityEnabled)

  const visible = communityProjects.filter((p) => {
    const matchFilter = filter === 'all' || p.communityStatus === filter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      (p.userEmail ?? '').toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  const pendingCount = communityProjects.filter((p) => p.communityStatus === 'pending').length

  return (
    <>
      <div className="px-5 py-3 border-b border-gray-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          {(['all', 'pending', 'approved', 'rejected', 'hidden'] as CommunityFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors relative',
                filter === f
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/25'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
              ].join(' ')}
            >
              {{ all: 'Todos', pending: 'Pendientes', approved: 'Aprobados', rejected: 'Rechazados', hidden: 'Ocultos' }[f]}
              {f === 'pending' && pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-black text-[9px] font-bold rounded-full px-1 leading-none py-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="ml-auto w-52">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar proyecto o email…" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {['Proyecto', 'Email', 'Ws. Estado', 'Comunidad', 'Puntos', 'Acciones'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {visible.length === 0 ? (
              <EmptyRow cols={6} message="No hay proyectos que coincidan con el filtro." />
            ) : (
              visible.map((p) => {
                const isUpdating = updating === p.id
                return (
                  <tr key={p.id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="px-5 py-3 max-w-[160px]">
                      <span className="block text-gray-200 text-xs truncate">
                        {p.title || <span className="italic text-gray-500">Sin nombre</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs max-w-[180px]">
                      <span className="block truncate">{p.userEmail ?? <span className="text-gray-600">—</span>}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <WorkspaceStatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <CommunityStatusBadge status={p.communityStatus} />
                    </td>
                    <td className="px-5 py-3 text-gray-300 tabular-nums">{p.pointsCount}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {/* Aprobar */}
                        <button
                          onClick={() => onUpdateStatus(p.id, 'approved')}
                          disabled={isUpdating || p.communityStatus === 'approved'}
                          title="Aprobar"
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            isUpdating || p.communityStatus === 'approved'
                              ? 'text-gray-700 cursor-not-allowed'
                              : 'text-emerald-500/70 hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer',
                          ].join(' ')}
                        >
                          {isUpdating ? (
                            <span className="w-3 h-3 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {/* Rechazar */}
                        <button
                          onClick={() => onUpdateStatus(p.id, 'rejected')}
                          disabled={isUpdating || p.communityStatus === 'rejected'}
                          title="Rechazar"
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            isUpdating || p.communityStatus === 'rejected'
                              ? 'text-gray-700 cursor-not-allowed'
                              : 'text-red-500/70 hover:text-red-400 hover:bg-red-500/10 cursor-pointer',
                          ].join(' ')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* Ocultar */}
                        <button
                          onClick={() => onUpdateStatus(p.id, 'hidden')}
                          disabled={isUpdating || p.communityStatus === 'hidden'}
                          title="Ocultar"
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            isUpdating || p.communityStatus === 'hidden'
                              ? 'text-gray-700 cursor-not-allowed'
                              : 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 cursor-pointer',
                          ].join(' ')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        </button>

                        {/* Ver experiencia pública */}
                        <a
                          href={`/public/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ver experiencia pública"
                          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors
                                     text-gray-400 hover:text-gray-100 hover:bg-gray-700 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </>
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

// ── Manage subscription dialog ────────────────────────────────────────────────

function ManageSubscriptionDialog({
  row, plans, saving, onSave, onCancel,
}: {
  row: AdminUserRow
  plans: AdminPlan[]
  saving: boolean
  onSave: (payload: UpdateSubscriptionPayload) => void
  onCancel: () => void
}) {
  const [planId,      setPlanId]      = useState(row.planId ?? '')
  const [status,      setStatus]      = useState<string>(row.subscriptionStatus ?? 'trial')
  const [customLimit, setCustomLimit] = useState(
    row.customLocationLimit !== null ? String(row.customLocationLimit) : ''
  )
  const [trialEndsAt, setTrialEndsAt] = useState(
    row.trialEndsAt ? row.trialEndsAt.slice(0, 10) : ''
  )

  useEffect(() => {
    console.log('[MANAGE_SUB_DIALOG_OPEN]', {
      userId: row.id, email: row.email,
      planId: row.planId, planName: row.planName,
      subscriptionStatus: row.subscriptionStatus,
      plansLoaded: plans.length,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && !saving) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [saving, onCancel])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      planId: planId || null,
      subscriptionStatus: status as UpdateSubscriptionPayload['subscriptionStatus'],
      customLocationLimit: customLimit !== '' ? Number(customLimit) : null,
      trialEndsAt: trialEndsAt ? new Date(trialEndsAt).toISOString() : null,
    })
  }

  const field = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => { if (!saving) onCancel() }}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/25
                            flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Suscripción</h3>
              <p className="text-xs text-gray-500 truncate max-w-[260px]">{row.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Plan</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className={field}>
              <option value="">Sin plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Estado</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
              <option value="trial">Trial</option>
              <option value="active">Activo</option>
              <option value="expired">Vencido</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          {status === 'trial' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Fin del trial</label>
              <input
                type="date"
                value={trialEndsAt}
                onChange={(e) => setTrialEndsAt(e.target.value)}
                className={field}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Límite personalizado{' '}
              <span className="text-gray-600 font-normal">(vacío = usa el del plan)</span>
            </label>
            <input
              type="number"
              min="0"
              value={customLimit}
              onChange={(e) => setCustomLimit(e.target.value)}
              placeholder="Ej: 100"
              className={`${field} placeholder-gray-600`}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700
                         text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-500
                         text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Guardando…
                </>
              ) : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Add user modal ────────────────────────────────────────────────────────────

function AddUserModal({
  plans, saving, onSave, onCancel,
}: {
  plans: AdminPlan[]
  saving: boolean
  onSave: (payload: CreateAdminUserPayload) => void
  onCancel: () => void
}) {
  const [email,        setEmail]        = useState('')
  const [firstName,    setFirstName]    = useState('')
  const [lastName,     setLastName]     = useState('')
  const [company,      setCompany]      = useState('')
  const [jobTitle,     setJobTitle]     = useState('')
  const [country,      setCountry]      = useState('')
  const [role,         setRole]         = useState<'user' | 'admin'>('user')
  const [status,       setStatus]       = useState<'active' | 'suspended'>('active')
  const [planId,       setPlanId]       = useState('')
  const [subStatus,    setSubStatus]    = useState<'trial' | 'active' | 'expired' | 'canceled'>('trial')
  const [trialEndsAt,  setTrialEndsAt]  = useState('')
  const [customLimit,  setCustomLimit]  = useState('')
  const [passwordMode, setPasswordMode] = useState<'auto' | 'manual'>('auto')
  const [password,     setPassword]     = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [forceChange,  setForceChange]  = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && !saving) onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [saving, onCancel])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) { setError('El correo es obligatorio.'); return }
    if (passwordMode === 'manual') {
      if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
      if (password !== confirmation) { setError('Las contraseñas no coinciden.'); return }
    }

    onSave({
      email:                email.trim().toLowerCase(),
      role,
      status,
      planId:               planId || null,
      subscriptionStatus:   subStatus,
      trialEndsAt:          subStatus === 'trial' && trialEndsAt ? new Date(trialEndsAt).toISOString() : null,
      customLocationLimit:  customLimit !== '' ? Number(customLimit) : null,
      firstName:            firstName.trim() || undefined,
      lastName:             lastName.trim()  || undefined,
      company:              company.trim()   || undefined,
      jobTitle:             jobTitle.trim()  || undefined,
      country:              country.trim()   || undefined,
      passwordMode,
      password:             passwordMode === 'manual' ? password     : undefined,
      passwordConfirmation: passwordMode === 'manual' ? confirmation : undefined,
      forcePasswordChange:  forceChange,
    })
  }

  const field = 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none'
  const label = 'block text-xs font-medium text-gray-400 mb-1'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => { if (!saving) onCancel() }}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500/15 border border-brand-500/25
                            flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Agregar usuario</h3>
              <p className="text-xs text-gray-500">El usuario recibirá un email para activar su cuenta.</p>
            </div>
          </div>

          {/* Identity section */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Identidad</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={label}>Correo electrónico <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                  autoFocus
                  className={`${field} placeholder-gray-600`}
                />
              </div>
              <div>
                <label className={label}>Nombre</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Nombre" className={`${field} placeholder-gray-600`} />
              </div>
              <div>
                <label className={label}>Apellido</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido" className={`${field} placeholder-gray-600`} />
              </div>
              <div>
                <label className={label}>Empresa</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                  placeholder="Empresa" className={`${field} placeholder-gray-600`} />
              </div>
              <div>
                <label className={label}>Cargo</label>
                <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Cargo" className={`${field} placeholder-gray-600`} />
              </div>
              <div>
                <label className={label}>País</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                  placeholder="País" className={`${field} placeholder-gray-600`} />
              </div>
              <div>
                <label className={label}>Rol</label>
                <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')} className={field}>
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className={label}>Estado de la cuenta</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')} className={field}>
                  <option value="active">Activo</option>
                  <option value="suspended">Suspendido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subscription section */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Suscripción</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Plan</label>
                <select value={planId} onChange={(e) => setPlanId(e.target.value)} className={field}>
                  <option value="">Sin plan</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Estado de suscripción</label>
                <select value={subStatus} onChange={(e) => setSubStatus(e.target.value as typeof subStatus)} className={field}>
                  <option value="trial">Trial</option>
                  <option value="active">Activo</option>
                  <option value="expired">Vencido</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </div>
              {subStatus === 'trial' && (
                <div>
                  <label className={label}>Fin del trial</label>
                  <input type="date" value={trialEndsAt} onChange={(e) => setTrialEndsAt(e.target.value)} className={field} />
                </div>
              )}
              <div>
                <label className={label}>
                  Límite personalizado{' '}
                  <span className="text-gray-600 font-normal">(vacío = usa el del plan)</span>
                </label>
                <input
                  type="number" min="0" value={customLimit}
                  onChange={(e) => setCustomLimit(e.target.value)}
                  placeholder="Ej: 100"
                  className={`${field} placeholder-gray-600`}
                />
              </div>
            </div>
          </div>

          {/* Password section */}
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Contraseña</p>
            <div className="flex gap-2 mb-3">
              {(['auto', 'manual'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPasswordMode(mode)}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    passwordMode === mode
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700',
                  ].join(' ')}
                >
                  {mode === 'auto' ? 'Automática (link de activación)' : 'Manual'}
                </button>
              ))}
            </div>

            {passwordMode === 'auto' ? (
              <p className="text-xs text-gray-500 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2">
                Se generará una contraseña aleatoria y se enviará un email con un link para que el usuario la establezca.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={label}>Contraseña <span className="text-red-400">*</span></label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`${field} placeholder-gray-600`}
                  />
                </div>
                <div>
                  <label className={label}>Confirmar contraseña <span className="text-red-400">*</span></label>
                  <input
                    type="password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder="Repetir contraseña"
                    className={`${field} placeholder-gray-600`}
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    id="force-change"
                    type="checkbox"
                    checked={forceChange}
                    onChange={(e) => setForceChange(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-brand-500 focus:ring-brand-500"
                  />
                  <label htmlFor="force-change" className="text-xs text-gray-400 cursor-pointer">
                    Forzar cambio de contraseña al primer inicio de sesión
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700
                         text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-500
                         text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creando…
                </>
              ) : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── User detail drawer ────────────────────────────────────────────────────────

function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-200">
        {value != null && value !== ''
          ? String(value)
          : <span className="text-gray-600 italic">No disponible</span>}
      </p>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-5 first:mt-0">
      {children}
    </p>
  )
}

function AccountSection({ detail }: { detail: AdminUserDetail }) {
  return (
    <div>
      <SectionLabel>Identidad</SectionLabel>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="col-span-2"><DetailField label="Email" value={detail.email} /></div>
        <DetailField label="Nombre"   value={detail.firstName} />
        <DetailField label="Apellido" value={detail.lastName} />
        <DetailField label="Empresa"  value={detail.company} />
        <DetailField label="Cargo"    value={detail.jobTitle} />
        <div className="col-span-2"><DetailField label="País" value={detail.country} /></div>
      </div>

      <SectionLabel>Acceso</SectionLabel>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Rol</p>
          <RoleBadge role={detail.role} />
        </div>
        <div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Estado</p>
          <UserStatusBadge status={detail.status} />
        </div>
        <DetailField label="Registro"   value={fmtDate(detail.createdAt)} />
        <DetailField label="Modificado" value={fmtDate(detail.updatedAt)} />
        <div className="col-span-2"><DetailField label="Último acceso" value={null} /></div>
      </div>
    </div>
  )
}

function SubscriptionSection({ detail }: { detail: AdminUserDetail }) {
  return (
    <div>
      <SectionLabel>Plan y suscripción</SectionLabel>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <DetailField label="Plan" value={detail.planName} />
        <div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Estado</p>
          <SubscriptionBadge status={detail.subscriptionStatus} />
        </div>
        <DetailField label="Trial hasta"          value={detail.trialEndsAt ? fmtDate(detail.trialEndsAt) : null} />
        <DetailField label="Límite personalizado" value={detail.customLocationLimit} />
        <div className="col-span-2">
          <DetailField
            label="Límite efectivo"
            value={detail.effectiveLocationLimit != null ? String(detail.effectiveLocationLimit) : 'Ilimitado'}
          />
        </div>
      </div>

      {(detail.paddleCustomerId || detail.paddleSubscriptionId) && (
        <>
          <SectionLabel>Paddle</SectionLabel>
          <div className="space-y-4">
            <DetailField label="Customer ID"     value={detail.paddleCustomerId} />
            <DetailField label="Subscription ID" value={detail.paddleSubscriptionId} />
          </div>
        </>
      )}

      <SectionLabel>Historial de pagos</SectionLabel>
      <p className="text-sm text-gray-600 italic">Historial de pagos aún no disponible.</p>
    </div>
  )
}

function WorkspaceSection({ detail }: { detail: AdminUserDetail }) {
  const ws = detail.workspace
  if (!ws) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-gray-500">Este usuario no tiene workspace.</p>
      </div>
    )
  }
  return (
    <div>
      <SectionLabel>Workspace</SectionLabel>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="col-span-2"><DetailField label="Nombre" value={ws.title || 'Sin nombre'} /></div>
        <div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Estado</p>
          <WorkspaceStatusBadge status={ws.status} />
        </div>
        <DetailField label="Ubicaciones"          value={ws.pointsCount} />
        <div className="col-span-2">
          <DetailField label="Última modificación" value={fmtDate(ws.updatedAt)} />
        </div>
      </div>
      <div className="mt-5">
        <a
          href={`/project/${ws.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors border border-gray-700"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Abrir workspace
        </a>
      </div>
    </div>
  )
}

function UserDetailDrawer({
  row, onClose,
}: {
  row: AdminUserRow
  onClose: () => void
}) {
  type Tab = 'account' | 'subscription' | 'workspace'
  const [tab,        setTab]        = useState<Tab>('account')
  const [detail,     setDetail]     = useState<AdminUserDetail | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setFetchError(null)
    setDetail(null)
    getAdminUser(row.id)
      .then(setDetail)
      .catch(() => setFetchError('No se pudo cargar el detalle del usuario.'))
      .finally(() => setLoading(false))
  }, [row.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'account',      label: 'Cuenta' },
    { key: 'subscription', label: 'Suscripción' },
    { key: 'workspace',    label: 'Workspace' },
  ]

  return (
    <>
      {/* Overlay — below existing modals (z-9999) */}
      <div
        className="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-[9998] flex flex-col w-full sm:w-[520px]
                      bg-gray-900 border-l border-gray-800 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="min-w-0 pr-3">
            <p className="text-sm font-semibold text-gray-100 truncate">{row.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <RoleBadge role={row.role} />
              <UserStatusBadge status={row.status} />
              {row.planName && (
                <span className="text-[10px] text-gray-400 border border-gray-700 rounded px-1.5 py-0.5">
                  {row.planName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                       text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 flex-shrink-0 overflow-x-auto">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={[
                'flex-shrink-0 py-3 px-4 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                tab === key
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 rounded-lg" />)}
            </div>
          ) : fetchError ? (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3">
              {fetchError}
            </p>
          ) : detail ? (
            <>
              {tab === 'account'      && <AccountSection      detail={detail} />}
              {tab === 'subscription' && <SubscriptionSection detail={detail} />}
              {tab === 'workspace'    && <WorkspaceSection    detail={detail} />}
            </>
          ) : null}
        </div>
      </div>
    </>
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
  onViewWorkspace, onDeleteWorkspace, onDeleteUser, onManageSubscription, onSelectUser,
}: {
  rows: AdminUserRow[]
  deletingWorkspaceId: string | null
  deletingUserId: string | null
  onViewWorkspace: (row: AdminUserRow) => void
  onDeleteWorkspace: (row: AdminUserRow) => void
  onDeleteUser: (row: AdminUserRow) => void
  onManageSubscription: (row: AdminUserRow) => void
  onSelectUser: (row: AdminUserRow) => void
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
              {['Email', 'Rol', 'Workspace', 'Ubicaciones', 'Estado', 'Plan', 'Registro', 'Modificado', ''].map((h, i) => (
                <th key={i}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filtered.length === 0
              ? <EmptyRow cols={9} message="No se encontraron usuarios." />
              : filtered.map((row) => {
                const ws             = row.workspace
                const isDeletingWs   = deletingWorkspaceId === ws?.id
                const isDeletingUser = deletingUserId === row.id

                return (
                  <tr key={row.id}
                    className={`hover:bg-gray-800/30 transition-colors ${isDeletingUser ? 'opacity-50' : ''}`}>

                    {/* Email — click opens detail drawer */}
                    <td className="px-5 py-3 font-medium max-w-[220px]">
                      <button
                        onClick={() => onSelectUser(row)}
                        className="block truncate text-left text-gray-200 hover:text-brand-300
                                   hover:underline underline-offset-2 cursor-pointer transition-colors w-full"
                      >
                        {row.email}
                      </button>
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

                    {/* Plan */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {row.planName && (
                          <span className="text-xs text-gray-300">{row.planName}</span>
                        )}
                        <SubscriptionBadge status={row.subscriptionStatus} />
                      </div>
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

                        {/* Gestionar suscripción */}
                        <button
                          onClick={() => { if (!anyDeleting) onManageSubscription(row) }}
                          disabled={anyDeleting}
                          title="Gestionar suscripción"
                          className={[
                            'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                            anyDeleting
                              ? 'text-gray-700 cursor-not-allowed'
                              : 'text-brand-500/70 hover:text-brand-400 hover:bg-brand-500/10 cursor-pointer',
                          ].join(' ')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>

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
  const [plans,    setPlans]    = useState<AdminPlan[]>([])

  const [loadingUsers,    setLoadingUsers]    = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingMetrics,  setLoadingMetrics]  = useState(true)
  const [errorUsers,    setErrorUsers]    = useState<string | null>(null)
  const [errorProjects, setErrorProjects] = useState<string | null>(null)
  const [errorMetrics,  setErrorMetrics]  = useState<string | null>(null)

  const [activeSection, setActiveSection] = useState<'users' | 'community'>('users')

  const [deleteWorkspaceTarget, setDeleteWorkspaceTarget] = useState<AdminUserRow | null>(null)
  const [deleteUserTarget,      setDeleteUserTarget]      = useState<AdminUserRow | null>(null)
  const [manageSubTarget,       setManageSubTarget]       = useState<AdminUserRow | null>(null)
  const [deletingWorkspaceId,   setDeletingWorkspaceId]   = useState<string | null>(null)
  const [deletingUserId,        setDeletingUserId]        = useState<string | null>(null)
  const [savingSubscription,    setSavingSubscription]    = useState(false)
  const [selectedUser,          setSelectedUser]          = useState<AdminUserRow | null>(null)
  const [addUserOpen,           setAddUserOpen]           = useState(false)
  const [savingAddUser,         setSavingAddUser]         = useState(false)
  const [refreshing,            setRefreshing]            = useState(false)
  const [updatingCommunityId,   setUpdatingCommunityId]   = useState<string | null>(null)
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

    getAdminPlans().then(setPlans).catch(() => null)
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
      setToast({ msg: 'No se pudo eliminar el workspace. Intenta de nuevo.', type: 'error' })
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
      setToast({ msg: 'No se pudo eliminar el usuario. Intenta de nuevo.', type: 'error' })
    } finally {
      setDeletingUserId(null)
    }
  }

  async function handleSaveSubscription(payload: UpdateSubscriptionPayload) {
    if (!manageSubTarget) return
    const row = manageSubTarget
    console.log('[ADMIN_SUBSCRIPTION_SAVE_PAYLOAD]', { userId: row.id, email: row.email, payload })
    setSavingSubscription(true)
    try {
      const subResp: SubscriptionSaveResponse = await updateAdminUserSubscription(row.id, payload)

      // Immediate targeted update from the PATCH response — no waiting for a follow-up GET.
      setUsers((prev) => {
        const next = prev.map((u) => {
          if (u.id !== row.id) return u
          const updated: AdminUser = {
            ...u,
            planId:                subResp.planId,
            planName:              subResp.planName,
            subscriptionStatus:    subResp.subscriptionStatus,
            trialEndsAt:           subResp.trialEndsAt,
            customLocationLimit:   subResp.customLocationLimit,
            effectiveLocationLimit: subResp.effectiveLocationLimit,
          }
          console.log('[ADMIN_USER_NORMALIZED]', updated)
          return updated
        })
        return next
      })

      setManageSubTarget(null)
      setToast({ msg: `Suscripción de ${row.email} actualizada.`, type: 'success' })

      // Snapshot the authoritative subscription data from the PATCH response.
      // The background GET might return stale/cached data for this user's plan fields,
      // so we always prefer the PATCH response for those fields on the updated user.
      const savedSub = {
        planId:                subResp.planId,
        planName:              subResp.planName,
        subscriptionStatus:    subResp.subscriptionStatus,
        trialEndsAt:           subResp.trialEndsAt,
        customLocationLimit:   subResp.customLocationLimit,
        effectiveLocationLimit: subResp.effectiveLocationLimit,
      }
      const updatedUserId = row.id

      // Background full refresh with cache-busting (don't await — don't block the UI)
      getAdminUsers({ cacheBust: true })
        .then((freshUsers) => {
          const merged = freshUsers.map((u) => {
            if (u.id !== updatedUserId) return u
            // Always use the PATCH response's subscription fields for the updated user —
            // the GET might be cached/stale and return null for planId/planName.
            return { ...u, ...savedSub }
          })
          console.log('[ADMIN_USERS_MERGED_AFTER_REFRESH]', merged.map((u) => ({
            id: u.id, planId: u.planId, planName: u.planName, subscriptionStatus: u.subscriptionStatus,
          })))
          setUsers(merged)
        })
        .catch(() => null)
    } catch {
      setToast({ msg: 'No se pudo actualizar la suscripción. Intenta de nuevo.', type: 'error' })
    } finally {
      setSavingSubscription(false)
    }
  }

  async function handleCreateUser(payload: CreateAdminUserPayload) {
    setSavingAddUser(true)
    try {
      const newUser = await createAdminUser(payload)
      setUsers((prev) => [newUser, ...prev])
      getAdminMetrics().then(setMetrics).catch(() => null)
      setAddUserOpen(false)
      setToast({ msg: `Usuario "${newUser.email}" creado correctamente.`, type: 'success' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo crear el usuario.'
      setToast({ msg, type: 'error' })
    } finally {
      setSavingAddUser(false)
    }
  }

  function handleViewWorkspace(row: AdminUserRow) {
    if (!row.workspace) return
    window.open('/project/' + row.workspace.id, '_blank')
  }

  async function handleUpdateCommunityStatus(
    id: string,
    status: AdminProject['communityStatus'],
  ) {
    setUpdatingCommunityId(id)
    try {
      await updateAdminProjectCommunityStatus(id, status)
      setProjects((prev) =>
        prev.map((p) => p.id === id ? { ...p, communityStatus: status } : p)
      )
      setToast({ msg: `Estado actualizado a "${status}".`, type: 'success' })
    } catch {
      setToast({ msg: 'No se pudo actualizar el estado. Intenta de nuevo.', type: 'error' })
    } finally {
      setUpdatingCommunityId(null)
    }
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

          {/* Nav tabs */}
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => setActiveSection('users')}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeSection === 'users'
                  ? 'bg-gray-800 text-gray-100'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
              ].join(' ')}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveSection('community')}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative',
                activeSection === 'community'
                  ? 'bg-gray-800 text-gray-100'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
              ].join(' ')}
            >
              Mapa comunitario
              {projects.filter((p) => p.communityEnabled && p.communityStatus === 'pending').length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-black text-[9px] font-bold rounded-full px-1 leading-none py-0.5">
                  {projects.filter((p) => p.communityEnabled && p.communityStatus === 'pending').length}
                </span>
              )}
            </button>
            <Link
              to="/admin/plans"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400
                         hover:text-gray-200 hover:bg-gray-800 transition-colors"
            >
              Planes
            </Link>
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
        {activeSection === 'users' && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Usuarios</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddUserOpen(true)}
                  disabled={tableLoading}
                  className={[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                    'bg-brand-600 text-white transition-colors',
                    tableLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-500 cursor-pointer',
                  ].join(' ')}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Agregar usuario
                </button>
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
                onManageSubscription={(row) => setManageSubTarget(row)}
                onSelectUser={(row) => setSelectedUser(row)}
              />
            )}
          </section>
        )}

        {/* ── Community section ── */}
        {activeSection === 'community' && (
          <>
            <CommunitySettingsPanel />

            <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-white">Mapa comunitario</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Proyectos que solicitaron aparecer en el mapa público de Ubyca.
                </p>
              </div>
              {loadingProjects ? (
                <div className="p-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 rounded-lg" />
                  ))}
                </div>
              ) : errorProjects ? (
                <p className="px-5 py-6 text-sm text-red-400">{errorProjects}</p>
              ) : (
                <CommunityTable
                  projects={projects}
                  updating={updatingCommunityId}
                  onUpdateStatus={handleUpdateCommunityStatus}
                />
              )}
            </section>
          </>
        )}

      </main>

      {/* ── Manage subscription dialog ── */}
      {manageSubTarget && (
        <ManageSubscriptionDialog
          key={manageSubTarget.id}
          row={manageSubTarget}
          plans={plans}
          saving={savingSubscription}
          onSave={handleSaveSubscription}
          onCancel={() => setManageSubTarget(null)}
        />
      )}

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

      {/* ── Add user modal ── */}
      {addUserOpen && (
        <AddUserModal
          plans={plans}
          saving={savingAddUser}
          onSave={handleCreateUser}
          onCancel={() => setAddUserOpen(false)}
        />
      )}

      {/* ── User detail drawer ── */}
      {selectedUser && (
        <UserDetailDrawer
          key={selectedUser.id}
          row={selectedUser}
          onClose={() => setSelectedUser(null)}
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
