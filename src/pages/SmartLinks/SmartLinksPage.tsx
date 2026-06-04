import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import Spinner                 from '../../components/ui/Spinner'
import Modal                   from '../../components/ui/Modal'
import { useGeoStore }         from '../../store/geoStore'
import {
  listSmartLinks,
  updateSmartLink,
  deleteSmartLink,
  type SmartLink,
} from '../../services/smartLinksApi'

// ── Icons ─────────────────────────────────────────────────────────────────────

function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SmartLink['status'] }) {
  const styles = status === 'active'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-gray-700/40 text-gray-400 border-gray-600/30'
  const dot = status === 'active' ? 'bg-emerald-400' : 'bg-gray-500'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status === 'active' ? 'Activo' : 'Pausado'}
    </span>
  )
}

// ── Coverage label ────────────────────────────────────────────────────────────

function CoverageLabel({ link }: { link: SmartLink }) {
  if (link.scopeType === 'project') return <span>Proyecto completo</span>
  const n = link.geoPointIds.length
  return <span>{n} ubicación{n !== 1 ? 'es' : ''}</span>
}

// ── Row ───────────────────────────────────────────────────────────────────────

function SmartLinkRow({
  link,
  onToggle,
  onDelete,
  isTogglingId,
  isDeletingId,
}: {
  link:          SmartLink
  onToggle:      (link: SmartLink) => void
  onDelete:      (link: SmartLink) => void
  isTogglingId:  string | null
  isDeletingId:  string | null
}) {
  const navigate = useNavigate()
  const { addToast } = useGeoStore()
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(link.publicUrl)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  return (
    <div className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-4 space-y-3">
      {/* Top row: name + status */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-100 truncate">{link.name}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(link.createdAt)}</p>
        </div>
        <StatusBadge status={link.status} />
      </div>

      {/* Public URL */}
      <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/60 rounded-lg px-3 py-2 min-w-0">
        <span className="text-[11px] text-gray-400 font-mono truncate flex-1">{link.publicUrl}</span>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 flex items-center gap-1 text-[11px] font-medium transition-colors
            ${copied ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}
          title="Copiar URL"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      {/* Coverage + actions */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-gray-500">
          <CoverageLabel link={link} />
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/app/smart-links/${link.id}/edit`)}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200
                       hover:bg-gray-800 rounded-lg transition-all"
          >
            Editar
          </button>
          <button
            onClick={() => onToggle(link)}
            disabled={isTogglingId === link.id}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200
                       hover:bg-gray-800 rounded-lg transition-all disabled:opacity-50"
          >
            {isTogglingId === link.id
              ? <Spinner size="sm" />
              : link.status === 'active' ? 'Pausar' : 'Activar'
            }
          </button>
          <button
            onClick={() => onDelete(link)}
            disabled={isDeletingId === link.id}
            className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-400
                       hover:bg-red-950/30 rounded-lg transition-all disabled:opacity-50"
          >
            {isDeletingId === link.id ? <Spinner size="sm" /> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="border border-dashed border-gray-700/70 rounded-2xl px-6 py-14 text-center">
      <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4
                      text-gray-500">
        <LinkIcon />
      </div>
      <p className="text-sm font-semibold text-gray-300 mb-1">
        Convierte cualquier URL en un Smart Link geolocalizado.
      </p>
      <p className="text-xs text-gray-600 mb-5 max-w-sm mx-auto leading-relaxed">
        Utiliza Smart Links en QR, WhatsApp, email, sitios web, redes sociales y campañas
        para activar experiencias geolocalizadas.
      </p>
      <button
        onClick={onCreate}
        className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
      >
        Crear Smart Link →
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartLinksPage() {
  const navigate        = useNavigate()
  const { addToast }    = useGeoStore()

  const [links,         setLinks]         = useState<SmartLink[]>([])
  const [loading,       setLoading]       = useState(true)
  const [pageError,     setPageError]     = useState<string | null>(null)
  const [isTogglingId,  setIsTogglingId]  = useState<string | null>(null)
  const [isDeletingId,  setIsDeletingId]  = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<SmartLink | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listSmartLinks()
      .then((data) => { if (!cancelled) setLinks(data) })
      .catch(() => { if (!cancelled) setPageError('No se pudo cargar los Smart Links.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  async function handleToggle(link: SmartLink) {
    const next = link.status === 'active' ? 'paused' : 'active'
    setIsTogglingId(link.id)
    try {
      const updated = await updateSmartLink(link.id, { status: next })
      setLinks((prev) => prev.map((l) => l.id === updated.id ? updated : l))
      addToast(next === 'active' ? 'Smart Link activado' : 'Smart Link pausado', 'success')
    } catch {
      addToast('No se pudo actualizar el estado.', 'error')
    } finally {
      setIsTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return
    const id = confirmDelete.id
    setConfirmDelete(null)
    setIsDeletingId(id)
    try {
      await deleteSmartLink(id)
      setLinks((prev) => prev.filter((l) => l.id !== id))
      addToast('Smart Link eliminado', 'success')
    } catch {
      addToast('No se pudo eliminar el Smart Link.', 'error')
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <div className="text-gray-100 min-h-full">
      {/* Desktop sticky header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-100">Smart Links</h1>
          <button
            onClick={() => navigate('/app/smart-links/new')}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500
                       text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]
                       shadow-lg shadow-brand-900/40"
          >
            + Nuevo Smart Link
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Mobile title + button */}
        <div className="flex items-center justify-between md:hidden">
          <h1 className="text-lg font-bold text-gray-100">Smart Links</h1>
          <button
            onClick={() => navigate('/app/smart-links/new')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500
                       text-white text-sm font-semibold rounded-xl transition-all"
          >
            + Nuevo
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner size="lg" />
          </div>
        ) : pageError ? (
          <div className="rounded-xl bg-red-950/40 border border-red-800/50 px-4 py-3 text-sm text-red-400">
            {pageError}
          </div>
        ) : links.length === 0 ? (
          <EmptyState onCreate={() => navigate('/app/smart-links/new')} />
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <SmartLinkRow
                key={link.id}
                link={link}
                onToggle={handleToggle}
                onDelete={(l) => setConfirmDelete(l)}
                isTogglingId={isTogglingId}
                isDeletingId={isDeletingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={confirmDelete !== null}
        title="Eliminar Smart Link"
        description={`¿Eliminar "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
