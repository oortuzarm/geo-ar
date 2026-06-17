import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import Spinner                 from '../../components/ui/Spinner'
import Modal                   from '../../components/ui/Modal'
import { useGeoStore }         from '../../store/geoStore'
import { usePlanFeatures }     from '../../hooks/usePlanFeatures'
import PlanGate                from '../../components/ui/PlanGate'
import {
  listSmartProxies,
  updateSmartProxy,
  deleteSmartProxy,
  type SmartProxy,
} from '../../services/smartProxiesApi'

// ── Icons ─────────────────────────────────────────────────────────────────────

function ProxyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
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

// ── Status badges ─────────────────────────────────────────────────────────────

function ActiveBadge({ active }: { active: boolean }) {
  const styles = active
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : 'bg-gray-700/40 text-gray-400 border-gray-600/30'
  const dot = active ? 'bg-emerald-400' : 'bg-gray-500'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function SmartProxyRow({
  proxy,
  onToggle,
  onDelete,
  isTogglingId,
  isDeletingId,
}: {
  proxy:        SmartProxy
  onToggle:     (proxy: SmartProxy) => void
  onDelete:     (proxy: SmartProxy) => void
  isTogglingId: string | null
  isDeletingId: string | null
}) {
  const navigate        = useNavigate()
  const { addToast }    = useGeoStore()
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(proxy.publicUrl)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => addToast('No se pudo copiar', 'error'))
  }

  return (
    <div
      className="bg-gray-900/70 border border-white/[0.07] rounded-2xl px-5 py-4 space-y-3
                 hover:border-white/[0.12] transition-colors cursor-pointer"
      onClick={() => navigate(`/app/smart-proxies/${proxy.id}`)}
    >
      {/* Top row: name + badges */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-100 truncate">{proxy.name}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{proxy.destinationUrl}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ActiveBadge active={proxy.active} />
        </div>
      </div>

      {/* Public URL */}
      <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/60 rounded-lg px-3 py-2 min-w-0"
           onClick={e => e.stopPropagation()}>
        <span className="text-[11px] text-gray-400 font-mono truncate flex-1">{proxy.publicUrl}</span>
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

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between gap-3" onClick={e => e.stopPropagation()}>
        <span className="text-[11px] text-gray-600">{formatDate(proxy.createdAt)}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/app/smart-proxies/${proxy.id}`) }}
            className="px-2.5 py-1.5 text-xs font-medium text-brand-400 hover:text-brand-300
                       hover:bg-brand-950/30 rounded-lg transition-all"
          >
            Ver detalles
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(proxy) }}
            disabled={isTogglingId === proxy.id}
            className="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200
                       hover:bg-gray-800 rounded-lg transition-all disabled:opacity-50"
          >
            {isTogglingId === proxy.id
              ? <Spinner size="sm" />
              : proxy.active ? 'Desactivar' : 'Activar'
            }
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(proxy) }}
            disabled={isDeletingId === proxy.id}
            className="px-2.5 py-1.5 text-xs font-medium text-red-500 hover:text-red-400
                       hover:bg-red-950/30 rounded-lg transition-all disabled:opacity-50"
          >
            {isDeletingId === proxy.id ? <Spinner size="sm" /> : 'Eliminar'}
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
      <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500">
        <ProxyIcon />
      </div>
      <p className="text-sm font-semibold text-gray-300 mb-1">
        Convierte cualquier sitio en un proxy geolocalizado.
      </p>
      <p className="text-xs text-gray-600 mb-5 max-w-sm mx-auto leading-relaxed">
        Los usuarios acceden al sitio original a través de Ubyca y obtenés analytics
        de ubicación, visitas en vivo y zonas calientes sin que la empresa instale nada.
      </p>
      <button
        onClick={onCreate}
        className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
      >
        Crear Smart Proxy →
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SmartProxiesPage() {
  const navigate                 = useNavigate()
  const { addToast }             = useGeoStore()
  const { canUseSmartProxies }   = usePlanFeatures()

  const [proxies,       setProxies]       = useState<SmartProxy[]>([])
  const [loading,       setLoading]       = useState(true)
  const [pageError,     setPageError]     = useState<string | null>(null)
  const [isTogglingId,  setIsTogglingId]  = useState<string | null>(null)
  const [isDeletingId,  setIsDeletingId]  = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<SmartProxy | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listSmartProxies()
      .then((data) => { if (!cancelled) setProxies(data) })
      .catch(() => { if (!cancelled) setPageError('No se pudo cargar los Smart Proxies.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  async function handleToggle(proxy: SmartProxy) {
    setIsTogglingId(proxy.id)
    try {
      const updated = await updateSmartProxy(proxy.id, { active: !proxy.active })
      setProxies((prev) => prev.map((p) => p.id === updated.id ? updated : p))
      addToast(updated.active ? 'Smart Proxy activado' : 'Smart Proxy desactivado', 'success')
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
      await deleteSmartProxy(id)
      setProxies((prev) => prev.filter((p) => p.id !== id))
      addToast('Smart Proxy eliminado', 'success')
    } catch {
      addToast('No se pudo eliminar el Smart Proxy.', 'error')
    } finally {
      setIsDeletingId(null)
    }
  }

  if (!canUseSmartProxies) {
    return (
      <PlanGate
        emoji="🔗"
        title="Smart Proxies no disponible"
        description="Esta función no está disponible en tu plan actual. Actualizá tu plan para crear y gestionar enlaces inteligentes con seguimiento."
      />
    )
  }

  return (
    <div className="text-gray-100 min-h-full">
      {/* Desktop sticky header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-20 hidden md:block">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-100">Smart Proxies</h1>
          <button
            onClick={() => navigate('/app/smart-proxies/new')}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500
                       text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98]
                       shadow-lg shadow-brand-900/40"
          >
            + Nuevo Smart Proxy
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Mobile title + button */}
        <div className="flex items-center justify-between md:hidden">
          <h1 className="text-lg font-bold text-gray-100">Smart Proxies</h1>
          <button
            onClick={() => navigate('/app/smart-proxies/new')}
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
        ) : proxies.length === 0 ? (
          <EmptyState onCreate={() => navigate('/app/smart-proxies/new')} />
        ) : (
          <div className="space-y-3">
            {proxies.map((proxy) => (
              <SmartProxyRow
                key={proxy.id}
                proxy={proxy}
                onToggle={handleToggle}
                onDelete={(p) => setConfirmDelete(p)}
                isTogglingId={isTogglingId}
                isDeletingId={isDeletingId}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={confirmDelete !== null}
        title="Eliminar Smart Proxy"
        description={`¿Eliminar "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
