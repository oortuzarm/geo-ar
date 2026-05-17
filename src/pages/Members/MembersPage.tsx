import { useEffect, useState } from 'react'
import Button   from '../../components/ui/Button'
import Spinner  from '../../components/ui/Spinner'
import Modal    from '../../components/ui/Modal'
import ToastContainer from '../../components/ui/Toast'
import { useAuthStore } from '../../store/authStore'
import { useGeoStore }  from '../../store/geoStore'
import {
  getMembers,
  updateMemberRole,
  removeMember,
  sendInvitation,
  resendInvitation,
  cancelInvitation,
} from '../../services/membersApi'
import type { Member, Invitation, MembersResponse, InvitationRole } from '../../services/membersApi'
import { ApiError } from '../../lib/apiFetch'

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

const ROLE_LABEL: Record<string, string> = {
  owner: 'Propietario', editor: 'Editor', viewer: 'Visor',
}

const ROLE_BADGE: Record<string, string> = {
  owner:  'bg-gray-700/70 text-gray-300 border border-gray-600',
  editor: 'bg-brand-900/60 text-brand-300 border border-brand-700/50',
  viewer: 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ name, email }: { name: string | null; email: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center
                    text-xs font-semibold text-gray-200 flex-shrink-0 select-none">
      {initials(name, email)}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${ROLE_BADGE[role] ?? ROLE_BADGE.viewer}`}>
      {ROLE_LABEL[role] ?? role}
    </span>
  )
}

// ── Invite modal ──────────────────────────────────────────────────────────────

interface InviteModalProps {
  onClose:   () => void
  onSuccess: (inv: Invitation) => void
}

function InviteModal({ onClose, onSuccess }: InviteModalProps) {
  const [email,  setEmail]  = useState('')
  const [role,   setRole]   = useState<InvitationRole>('editor')
  const [loading, setLoading] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const inv = await sendInvitation(email.trim(), role)
      onSuccess(inv)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) setError('El email ya es miembro o ya tiene una invitación pendiente.')
        else if (err.status === 403) setError('No tienes permisos para invitar miembros.')
        else setError('No se pudo enviar la invitación. Intenta de nuevo.')
      } else {
        setError('No se pudo conectar con el servidor.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-1">Invitar miembro</h3>
          <p className="text-sm text-gray-400 mb-5">
            Recibirán un email con un link para unirse a tu organización.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colaborador@email.com"
                className="bg-gray-800 border border-gray-700 hover:border-gray-600
                           rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                           transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Rol
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['editor', 'viewer'] as InvitationRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={[
                      'flex flex-col items-start gap-0.5 px-4 py-3 rounded-lg border text-left transition-all',
                      role === r
                        ? 'border-brand-500 bg-brand-900/30 text-brand-300'
                        : 'border-gray-700 bg-gray-800/60 text-gray-400 hover:border-gray-600',
                    ].join(' ')}
                  >
                    <span className="text-sm font-semibold">{ROLE_LABEL[r]}</span>
                    <span className="text-[11px] text-current opacity-70">
                      {r === 'editor' ? 'Puede crear y editar proyectos' : 'Solo lectura'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50
                            rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
              <Button loading={loading}>Enviar invitación</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MembersPage() {
  const { currentUser } = useAuthStore()
  const { addToast }    = useGeoStore()

  const [data,     setData]     = useState<MembersResponse | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  // Modal states
  const [showInvite,         setShowInvite]         = useState(false)
  const [memberToRemove,     setMemberToRemove]      = useState<Member | null>(null)
  const [invitationToCancel, setInvitationToCancel]  = useState<Invitation | null>(null)

  // Per-row loading
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null)
  const [resendingId,    setResendingId]    = useState<string | null>(null)
  const [cancellingId,   setCancellingId]   = useState<string | null>(null)
  const [removingId,     setRemovingId]     = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setPageError(null)
    setForbidden(false)
    try {
      const res = await getMembers()
      setData(res)
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setForbidden(true)
      } else {
        setPageError('No se pudo cargar la lista de miembros. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const currentMember = data?.members.find((m) => m.email === currentUser?.email)
  const isOwner       = currentMember?.role === 'owner'

  // ── Actions ────────────────────────────────────────────────────────────────

  async function handleRoleChange(member: Member, newRole: 'editor' | 'viewer') {
    setUpdatingRoleId(member.id)
    try {
      const updated = await updateMemberRole(member.id, newRole)
      setData((prev) => prev ? {
        ...prev,
        members: prev.members.map((m) => m.id === updated.id ? updated : m),
      } : prev)
      addToast(`Rol actualizado a ${ROLE_LABEL[newRole]}`, 'success')
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        addToast('No puedes cambiar el rol de este miembro.', 'error')
      } else {
        addToast('Error al actualizar el rol.', 'error')
      }
    } finally {
      setUpdatingRoleId(null)
    }
  }

  async function handleRemoveMember() {
    const member = memberToRemove
    if (!member) return
    setMemberToRemove(null)
    setRemovingId(member.id)
    try {
      await removeMember(member.id)
      setData((prev) => prev ? {
        ...prev,
        members: prev.members.filter((m) => m.id !== member.id),
      } : prev)
      addToast('Miembro eliminado', 'success')
    } catch {
      addToast('Error al eliminar el miembro.', 'error')
    } finally {
      setRemovingId(null)
    }
  }

  async function handleResend(inv: Invitation) {
    setResendingId(inv.id)
    try {
      await resendInvitation(inv.id)
      addToast('Invitación reenviada', 'success')
    } catch {
      addToast('Error al reenviar la invitación.', 'error')
    } finally {
      setResendingId(null)
    }
  }

  async function handleCancelInvitation() {
    const inv = invitationToCancel
    if (!inv) return
    setInvitationToCancel(null)
    setCancellingId(inv.id)
    try {
      await cancelInvitation(inv.id)
      setData((prev) => prev ? {
        ...prev,
        invitations: prev.invitations.filter((i) => i.id !== inv.id),
      } : prev)
      addToast('Invitación cancelada', 'success')
    } catch {
      addToast('Error al cancelar la invitación.', 'error')
    } finally {
      setCancellingId(null)
    }
  }

  function handleInviteSuccess(inv: Invitation) {
    setShowInvite(false)
    setData((prev) => prev ? {
      ...prev,
      invitations: [inv, ...prev.invitations],
    } : prev)
    addToast('Invitación enviada', 'success')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const pendingInvitations = data?.invitations.filter((i) => i.status === 'pending') ?? []

  return (
    <div className="text-gray-100">
      <ToastContainer />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Mobile logo */}
          <div className="flex items-center md:hidden">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </div>
          <h1 className="hidden md:block font-bold text-gray-100">Miembros</h1>

          {isOwner && (
            <Button onClick={() => setShowInvite(true)} size="sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Invitar miembro
            </Button>
          )}
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Forbidden */}
        {!loading && forbidden && (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="h-7 w-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Acceso restringido</h2>
            <p className="text-sm text-gray-500">No tienes permisos para administrar miembros.</p>
          </div>
        )}

        {/* Error */}
        {!loading && pageError && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">{pageError}</p>
            <Button variant="secondary" onClick={load}>Reintentar</Button>
          </div>
        )}

        {/* Content */}
        {!loading && data && !forbidden && (
          <div className="space-y-8">

            {/* Organization name */}
            {data.organization?.name && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
                  Organización
                </p>
                <p className="text-base font-semibold text-gray-200">{data.organization.name}</p>
              </div>
            )}

            {/* ── Active members ─────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                  Miembros · {data.members.length}
                </h2>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 overflow-hidden">
                {data.members.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    Sin miembros aún.
                  </div>
                ) : (
                  data.members.map((member) => {
                    const isCurrentUser = member.email === currentUser?.email
                    const canEdit       = isOwner && member.role !== 'owner'
                    const isUpdating    = updatingRoleId === member.id
                    const isRemoving    = removingId === member.id

                    return (
                      <div key={member.id}
                        className="flex items-center gap-4 px-5 py-4">

                        <Avatar name={member.name} email={member.email} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-100 truncate">
                              {member.name ?? member.email}
                            </span>
                            {isCurrentUser && (
                              <span className="text-[10px] text-gray-500 font-medium">Tú</span>
                            )}
                          </div>
                          {member.name && (
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          )}
                        </div>

                        {/* Role */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {canEdit ? (
                            <select
                              value={member.role}
                              disabled={isUpdating}
                              onChange={(e) =>
                                handleRoleChange(member, e.target.value as 'editor' | 'viewer')
                              }
                              className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1
                                         text-xs text-gray-300 cursor-pointer
                                         hover:border-gray-600 focus:outline-none focus:ring-2
                                         focus:ring-brand-500 focus:border-transparent transition-colors
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="editor">Editor</option>
                              <option value="viewer">Visor</option>
                            </select>
                          ) : (
                            <RoleBadge role={member.role} />
                          )}

                          {canEdit && (
                            <button
                              disabled={isRemoving}
                              onClick={() => setMemberToRemove(member)}
                              title="Eliminar miembro"
                              className="p-1.5 rounded-md text-gray-600 hover:text-red-400
                                         hover:bg-red-900/20 transition-colors disabled:opacity-40
                                         disabled:cursor-not-allowed"
                            >
                              {isRemoving ? (
                                <Spinner size="sm" />
                              ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>

            {/* ── Pending invitations ────────────────────────────────────────── */}
            {(pendingInvitations.length > 0 || isOwner) && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                    Invitaciones pendientes · {pendingInvitations.length}
                  </h2>
                </div>

                {pendingInvitations.length === 0 ? (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-8 text-center">
                    <p className="text-sm text-gray-500">
                      Sin invitaciones pendientes.
                      {isOwner && (
                        <>
                          {' '}
                          <button
                            onClick={() => setShowInvite(true)}
                            className="text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            Invitar un miembro
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 overflow-hidden">
                    {pendingInvitations.map((inv) => {
                      const isResending   = resendingId === inv.id
                      const isCancelling  = cancellingId === inv.id

                      return (
                        <div key={inv.id}
                          className="flex items-center gap-4 px-5 py-4">

                          {/* Pending avatar */}
                          <div className="w-9 h-9 rounded-full border-2 border-dashed border-gray-600
                                          flex items-center justify-center flex-shrink-0">
                            <svg className="h-4 w-4 text-gray-500" fill="none"
                              stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 truncate">{inv.email}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] bg-amber-900/40 text-amber-400
                                               border border-amber-700/40 px-2 py-0.5 rounded font-semibold">
                                Pendiente
                              </span>
                              <RoleBadge role={inv.role} />
                            </div>
                          </div>

                          {isOwner && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                loading={isResending}
                                disabled={isCancelling}
                                onClick={() => handleResend(inv)}
                              >
                                Reenviar
                              </Button>
                              <button
                                disabled={isCancelling || isResending}
                                onClick={() => setInvitationToCancel(inv)}
                                title="Cancelar invitación"
                                className="p-1.5 rounded-md text-gray-600 hover:text-red-400
                                           hover:bg-red-900/20 transition-colors disabled:opacity-40"
                              >
                                {isCancelling ? (
                                  <Spinner size="sm" />
                                ) : (
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}


          </div>
        )}
      </main>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSuccess={handleInviteSuccess}
        />
      )}

      <Modal
        open={!!memberToRemove}
        title="Eliminar miembro"
        description={`¿Seguro que querés eliminar a ${memberToRemove?.name ?? memberToRemove?.email}? Esta persona perderá acceso a todos los proyectos de la organización.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        danger
        onConfirm={handleRemoveMember}
        onCancel={() => setMemberToRemove(null)}
      />

      <Modal
        open={!!invitationToCancel}
        title="Cancelar invitación"
        description={`¿Cancelar la invitación enviada a ${invitationToCancel?.email}? El link del email dejará de funcionar.`}
        confirmLabel="Cancelar invitación"
        cancelLabel="Volver"
        danger
        onConfirm={handleCancelInvitation}
        onCancel={() => setInvitationToCancel(null)}
      />
    </div>
  )
}
