import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../hooks/useWorkspace'
import { useGeoStore } from '../../store/geoStore'
import { useAuthStore } from '../../store/authStore'
import { geoProjectsApi, geoPointsApi } from '../../services'
import { deleteMediaFile, isVercelBlobUrl } from '../../lib/deleteMediaFile'
import { fetchProjectAnalytics } from '../../lib/analytics'
import { ApiError } from '../../lib/apiFetch'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import ToastContainer from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import ShareModal from '../../components/ui/ShareModal'
import WorkspaceMap from '../../components/map/WorkspaceMap'
import type { ContentType, GeoPoint, MediaContentData } from '../../types'

// ── Content type display config ───────────────────────────────────────────────

const CT_LABEL: Record<ContentType, string> = {
  url:   'URL',
  video: 'Video',
  audio: 'Audio',
  file:  'Archivo',
}

const CT_COLOR: Record<ContentType, string> = {
  url:   'bg-sky-500/10 text-sky-400 border-sky-500/20',
  video: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  audio: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  file:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </p>
  )
}

function KPICard({
  label, value, sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-5 flex flex-col gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium leading-none">
        {label}
      </p>
      <p className="text-4xl font-bold tabular-nums leading-none text-gray-100">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-gray-600 leading-none">{sub}</p>
      )}
    </div>
  )
}

function PointThumbnail({ point }: { point: GeoPoint }) {
  return (
    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-800 border border-gray-700/50 flex-shrink-0">
      {point.image ? (
        <img src={point.image} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="h-3.5 w-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
      )}
    </div>
  )
}

function ContentTypeBadge({ ct }: { ct: ContentType }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${CT_COLOR[ct]}`}>
      {CT_LABEL[ct]}
    </span>
  )
}

function StatusToggle({
  active, disabled, onToggle,
}: {
  active: boolean
  disabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={active ? 'Cambiar a inactiva' : 'Cambiar a activa'}
      className={[
        'inline-flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 border',
        'transition-all duration-150 cursor-pointer select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:ring-1',
        active
          ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 hover:ring-emerald-500/30'
          : 'text-gray-500 border-gray-600/30 bg-gray-700/10 hover:bg-gray-700/30 hover:ring-gray-600/40',
      ].join(' ')}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
        disabled ? 'animate-pulse' : ''
      } ${active ? 'bg-emerald-400' : 'bg-gray-600'}`} />
      {active ? 'Activa' : 'Inactiva'}
    </button>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-300 mb-2">Sin ubicaciones aún</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Crea tu primera ubicación en el editor de mapa.
      </p>
      <Button onClick={onAdd}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nueva ubicación
      </Button>
    </div>
  )
}

// ── Workspace actions dropdown ────────────────────────────────────────────────

interface WorkspaceMenuProps {
  projectId: string
  projectTitle: string
  projectStatus: 'active' | 'draft' | 'inactive'
  onShare: () => void
  onEmbed: () => void
  onToggleStatus: () => void
  onDelete: () => void
  onPreview: () => void
  togglingStatus: boolean
}

function WorkspaceMenu({
  projectId, projectTitle: _t, projectStatus,
  onShare, onEmbed, onToggleStatus, onDelete, onPreview,
  togglingStatus,
}: WorkspaceMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const item = 'flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-colors text-left'

  function act(fn: () => void) {
    setOpen(false)
    fn()
  }

  void projectId

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                   text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
        title="Acciones del workspace"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        <span className="hidden sm:inline">Workspace</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-56 bg-gray-900 border border-gray-700 rounded-xl
                        shadow-2xl py-1 z-50">

          <button className={item} onClick={() => act(onShare)}>
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartir
          </button>

          <button className={item} onClick={() => act(onEmbed)}>
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Integrar en sitio web
          </button>

          <button className={item} onClick={() => act(onPreview)}>
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver público
          </button>

          <div className="border-t border-gray-800 my-1" />

          <button
            className={`${item} ${togglingStatus ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => act(onToggleStatus)}
          >
            {projectStatus === 'active' ? (
              <>
                <svg className="h-4 w-4 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <span className="text-amber-400">Pasar a borrador</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-emerald-400">Publicar</span>
              </>
            )}
          </button>

          <div className="border-t border-gray-800 my-1" />

          <button
            className={`${item} text-red-400 hover:text-red-300 hover:bg-red-500/10`}
            onClick={() => act(onDelete)}
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar workspace
          </button>
        </div>
      )}
    </div>
  )
}

// ── Embed modal ───────────────────────────────────────────────────────────────

function EmbedModal({
  projectId,
  onClose,
}: {
  projectId: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const iframeCode = [
    `<iframe`,
    `  src="${window.location.origin}/embed/${projectId}"`,
    `  width="100%"`,
    `  height="600"`,
    `  style="border:0;border-radius:16px;overflow:hidden;"`,
    `  allow="geolocation"`,
    `  allowfullscreen`,
    `></iframe>`,
  ].join('\n')

  async function handleCopy() {
    try { await navigator.clipboard.writeText(iframeCode) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = iframeCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus(); ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-100">Integrar en sitio web</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors -mt-0.5 ml-4"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Copia este código y pégalo en tu sitio web para mostrar este mapa interactivo.
          </p>
          <div className="relative">
            <textarea
              readOnly
              value={iframeCode}
              rows={8}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3
                         text-xs font-mono text-gray-300 resize-none focus:outline-none
                         focus:ring-1 focus:ring-brand-500 leading-relaxed"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopy}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold',
                'transition-all duration-150 focus:outline-none focus:ring-2',
                'focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-brand-600 hover:bg-brand-500 text-white',
              ].join(' ')}
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar código
                </>
              )}
            </button>
            <button
              onClick={() => window.open(`${window.location.origin}/embed/${projectId}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                         bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-gray-600
                         focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const navigate   = useNavigate()
  const { addToast } = useGeoStore()
  const { currentUser } = useAuthStore()
  const { project, points, loading, updateProject, refresh } = useWorkspace()

  const [shareOpen,       setShareOpen]      = useState(false)
  const [embedOpen,       setEmbedOpen]      = useState(false)
  const [deleteConfirm,   setDeleteConfirm]  = useState(false)
  const [togglingStatus,  setTogglingStatus] = useState(false)
  const [deleting,        setDeleting]       = useState(false)
  const [totalClicks,     setTotalClicks]    = useState<number | null>(null)
  const [togglingPointId, setTogglingPointId] = useState<string | null>(null)
  // Optimistic active overrides: pointId → bool. Cleared after server round-trip.
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!project) return
    fetchProjectAnalytics(project.id)
      .then((s) => setTotalClicks(s.clicks))
      .catch(() => setTotalClicks(0))
  }, [project?.id])

  if (loading || deleting) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!project) return null

  const activeCount = points.filter((p) =>
    activeOverrides[p.id] !== undefined ? activeOverrides[p.id] : p.active
  ).length
  const editorUrl   = `/project/${project.id}`
  const publicUrl   = `${window.location.origin}/public/${project.id}`

  async function handleToggleStatus() {
    const p = project!
    const nextStatus = p.status === 'active' ? 'draft' : 'active'

    // Block regardless of role — in /app, only the owner may modify their workspace.
    if (currentUser && p.userId && p.userId !== currentUser.id) {
      console.error('[WORKSPACE_STATUS_UPDATE_BLOCKED]',
        { currentUserId: currentUser.id, currentUserRole: currentUser.role,
          projectUserId: p.userId, projectId: p.id })
      addToast('Este workspace no pertenece al usuario autenticado.', 'error')
      return
    }

    console.log('[WORKSPACE_STATUS_UPDATE] currentUserId=', currentUser?.id,
      'role=', currentUser?.role, 'projectId=', p.id,
      'projectUserId=', p.userId, 'nextStatus=', nextStatus)

    setTogglingStatus(true)
    try {
      const updated = await geoProjectsApi.saveProject(p.id, { status: nextStatus })
      updateProject(updated)
    } catch { /* silent */ }
    finally { setTogglingStatus(false) }
  }

  async function handleTogglePoint(point: GeoPoint) {
    if (togglingPointId) return
    const nextActive = !(activeOverrides[point.id] ?? point.active)
    setTogglingPointId(point.id)
    setActiveOverrides((prev) => ({ ...prev, [point.id]: nextActive }))
    try {
      await geoPointsApi.savePoint(point.id, { active: nextActive })
      // Sync hook state so KPIs and map stay consistent
      refresh()
    } catch {
      // Revert optimistic update
      setActiveOverrides((prev) => {
        const next = { ...prev }
        delete next[point.id]
        return next
      })
      addToast('No se pudo actualizar el estado de la ubicación', 'error')
    } finally {
      setTogglingPointId(null)
    }
  }

  async function handleDeleteConfirmed() {
    const p = project!

    // Block regardless of role — in /app, only the owner may delete their workspace.
    if (currentUser && p.userId && p.userId !== currentUser.id) {
      console.error('[WORKSPACE_STATUS_UPDATE_BLOCKED] delete blocked',
        { currentUserId: currentUser.id, currentUserRole: currentUser.role,
          projectUserId: p.userId, projectId: p.id })
      addToast('Este workspace no pertenece al usuario autenticado.', 'error')
      setDeleteConfirm(false)
      return
    }

    const projectId = p.id
    console.log('[WORKSPACE_DELETE_START] projectId=', projectId, 'userId=', p.userId)
    setDeleteConfirm(false)
    setDeleting(true)

    // Collect Vercel Blob URLs to clean up after deletion (non-critical)
    let orphanUrls: string[] = []
    try {
      const pts = await geoPointsApi.listPoints(projectId)
      orphanUrls = pts.flatMap((pt) => {
        if (pt.contentType === 'url') return []
        const cd = pt.contentData as MediaContentData | undefined
        return isVercelBlobUrl(cd?.file_url) ? [cd!.file_url] : []
      })
    } catch { /* non-critical — proceed with delete even if listing fails */ }

    try {
      await geoProjectsApi.removeProject(projectId)
      if (orphanUrls.length > 0) orphanUrls.forEach((url) => void deleteMediaFile(url))
      console.log('[WORKSPACE_DELETE_SUCCESS] projectId=', projectId)
      addToast('Workspace eliminado correctamente', 'success')
      refresh()
    } catch (err) {
      const detail = err instanceof ApiError
        ? `(${err.status}) ${err.message}`
        : String(err)
      console.error('[WORKSPACE_DELETE_ERROR] projectId=', projectId, err)
      addToast(`No se pudo eliminar el workspace: ${detail}`, 'error')
    } finally {
      // Always reset deleting — without this the component stays frozen on <Spinner /> after success
      setDeleting(false)
    }
  }

  return (
    <div className="text-gray-100">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Mobile: logo (desktop sidebar already shows it) */}
          <div className="flex items-center md:hidden">
            <img
              src="/logo-blanco.png"
              alt="Ubyca"
              className="h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </div>
          <h1 className="hidden md:block font-bold text-gray-100">Ubicaciones</h1>

          <div className="flex items-center gap-2">
            <WorkspaceMenu
              projectId={project.id}
              projectTitle={project.title}
              projectStatus={project.status}
              togglingStatus={togglingStatus}
              onShare={() => setShareOpen(true)}
              onEmbed={() => setEmbedOpen(true)}
              onPreview={() => window.open(publicUrl, '_blank')}
              onToggleStatus={handleToggleStatus}
              onDelete={() => setDeleteConfirm(true)}
            />
            <Button onClick={() => navigate(editorUrl)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva ubicación
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {points.length === 0 ? (
          <EmptyState onAdd={() => navigate(editorUrl)} />
        ) : (
          <>
            {/* ── KPI strip ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

              <KPICard
                label="Ubicaciones"
                value={points.length}
                sub="en total"
              />

              <KPICard
                label="Activas"
                value={activeCount}
                sub={`de ${points.length} habilitadas`}
              />

              {/* Estado */}
              <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-5 flex flex-col gap-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium leading-none">
                  Estado
                </p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    project.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-gray-700/40 text-gray-400 border-gray-600/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      project.status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'
                    }`} />
                    {project.status === 'active' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
              </div>

              <KPICard
                label="Clics en experiencia"
                value={totalClicks ?? '—'}
                sub="en total"
              />
            </div>

            {/* ── Map ───────────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>Mapa</SectionLabel>
                <button
                  onClick={() => navigate(editorUrl)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors
                             flex items-center gap-1"
                >
                  Ir al editor
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div
                className="rounded-2xl overflow-hidden border border-gray-800"
                style={{ height: '320px' }}
              >
                <WorkspaceMap
                  points={points}
                  onMarkerClick={() => navigate(editorUrl)}
                />
              </div>
            </section>

            {/* ── Locations table ───────────────────────────────────────── */}
            <section className="pb-6">
              <div className="mb-4">
                <SectionLabel>
                  Ubicaciones{' '}
                  <span className="text-gray-700 normal-case font-normal">({points.length})</span>
                </SectionLabel>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/60">
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-8">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Nombre
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Tipo
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Estado
                      </th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Radio
                      </th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((point, idx) => {
                      const ct         = point.contentType ?? 'url'
                      const isActive   = activeOverrides[point.id] !== undefined
                        ? activeOverrides[point.id]
                        : point.active
                      const isToggling = togglingPointId === point.id
                      return (
                        <tr
                          key={point.id}
                          className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-600 text-xs tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <PointThumbnail point={point} />
                              <span className={`font-medium truncate max-w-[200px] ${
                                isActive ? 'text-gray-100' : 'text-gray-500'
                              }`}>
                                {point.name || (
                                  <em className="font-normal text-gray-600 not-italic">Sin nombre</em>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <ContentTypeBadge ct={ct} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusToggle
                              active={isActive}
                              disabled={isToggling || !!togglingPointId}
                              onToggle={() => handleTogglePoint(point)}
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs tabular-nums">
                            {point.activationRadius} m
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => navigate(`/app/metrics?projectId=${project.id}&pointId=${point.id}`)}
                              className="text-xs text-brand-400 hover:text-brand-300 transition-colors
                                         px-2 py-1 rounded hover:bg-brand-500/10"
                            >
                              Analytics
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {points.map((point) => {
                  const ct         = point.contentType ?? 'url'
                  const isActive   = activeOverrides[point.id] !== undefined
                    ? activeOverrides[point.id]
                    : point.active
                  const isToggling = togglingPointId === point.id
                  return (
                    <div
                      key={point.id}
                      className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3
                                 flex items-center gap-3"
                    >
                      <PointThumbnail point={point} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-gray-100' : 'text-gray-500'
                        }`}>
                          {point.name || 'Sin nombre'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <ContentTypeBadge ct={ct} />
                          <StatusToggle
                            active={isActive}
                            disabled={isToggling || !!togglingPointId}
                            onToggle={() => handleTogglePoint(point)}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/app/metrics?projectId=${project.id}&pointId=${point.id}`)}
                        className="flex-shrink-0 text-xs text-brand-400 hover:text-brand-300
                                   transition-colors px-2 py-1.5 rounded hover:bg-brand-500/10"
                      >
                        Analytics
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      <ShareModal
        url={publicUrl}
        title={project.title}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />

      {embedOpen && (
        <EmbedModal
          projectId={project.id}
          onClose={() => setEmbedOpen(false)}
        />
      )}

      <Modal
        open={deleteConfirm}
        title="¿Eliminar workspace?"
        description="Se eliminarán todas las ubicaciones asociadas. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirm(false)}
        danger
      />

      <ToastContainer />
    </div>
  )
}
