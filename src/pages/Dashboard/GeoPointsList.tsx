import { useState, useEffect, useMemo } from 'react'
import Modal from '../../components/ui/Modal'
import { getPointCoverImage } from '../../lib/pointImageUtils'
import { fetchProjectAnalyticsByPoint, type PointAnalytics } from '../../lib/analytics'
import type { GeoPoint } from '../../types'
import GeoPointShareModal from './GeoPointShareModal'
import { useGeoStore } from '../../store/geoStore'

function urlDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url.replace('https://', '').split('/')[0] }
}

/**
 * Approximate area of a GeoJSON polygon ring in square meters.
 * Uses the Shoelace formula projected to a local Cartesian frame at the
 * ring's first latitude.  Error < 0.3 % for polygons smaller than ~50 km.
 */
function polygonRingAreaM2(ring: number[][]): number {
  const pts = ring.slice(0, -1) // strip closing duplicate
  if (pts.length < 3) return 0
  const lat0  = pts[0][1] * (Math.PI / 180)
  const mLat  = 111_320
  const mLng  = 111_320 * Math.cos(lat0)
  let area = 0
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % pts.length]
    area += (x1 * mLng) * (y2 * mLat) - (x2 * mLng) * (y1 * mLat)
  }
  return Math.abs(area / 2)
}

/** Returns the activation-zone label shown in the point list. */
function zoneLabel(point: GeoPoint): string {
  if ((point.activationMode ?? 'radius') !== 'polygon') {
    return `${point.activationRadius} m`
  }
  const polygon = point.activationPolygon
  if (!polygon) return 'Polígono · sin zona'
  const ring = polygon.geometry.type === 'Polygon'
    ? polygon.geometry.coordinates[0]
    : polygon.geometry.coordinates[0][0]
  const m2 = polygonRingAreaM2(ring)
  return m2 >= 10_000
    ? `Polígono · ${(m2 / 10_000).toFixed(1).replace('.', ',')} ha`
    : `Polígono · ${Math.round(m2).toLocaleString('es')} m²`
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso)
    .toLocaleDateString('es', { day: 'numeric', month: 'short' })
    .replace('.', '')
}

type SortKey = 'name' | 'date' | 'entries' | 'clicks'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name',    label: 'Nombre'   },
  { key: 'date',    label: 'Fecha'    },
  { key: 'entries', label: 'Entradas' },
  { key: 'clicks',  label: 'Clics'    },
]

const FEATURED_LIMIT = 5

interface GeoPointsListProps {
  points: GeoPoint[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onToggleActive: (id: string) => void
  onToggleFeatured: (id: string) => void
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkActivate: (ids: string[]) => Promise<void>
  onBulkDeactivate: (ids: string[]) => Promise<void>
  /** When provided (mobile drawer context), renders a × button in the header */
  onClose?: () => void
  /** Hides "Puntos GPS (N)" when idle — use in sidebar where the tab already provides that context */
  hideIdleTitle?: boolean
  /** Required to enable analytics-based sort options (Entradas, Clics) */
  projectId?: string
}

export default function GeoPointsList({
  points,
  selectedId,
  onSelect,
  onAdd,
  onToggleActive,
  onToggleFeatured,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onClose,
  hideIdleTitle = false,
  projectId,
}: GeoPointsListProps) {
  const { addToast } = useGeoStore()
  const [selectionMode, setSelectionMode] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [sharePoint, setSharePoint] = useState<GeoPoint | null>(null)

  const featuredCount = points.filter((p) => p.featured).length

  function handleToggleFeatured(e: React.MouseEvent, point: GeoPoint) {
    e.stopPropagation()
    if (!point.featured && featuredCount >= FEATURED_LIMIT) {
      addToast(`Puedes destacar hasta ${FEATURED_LIMIT} puntos GPS.`, 'info')
      return
    }
    onToggleFeatured(point.id)
  }

  // ── Sort ────────────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [analyticsMap, setAnalyticsMap] = useState<Record<string, PointAnalytics> | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // Fetch analytics lazily when user selects a metric-based sort
  useEffect(() => {
    if ((sortKey !== 'entries' && sortKey !== 'clicks') || !projectId) return
    if (analyticsMap !== null) return   // already fetched
    let cancelled = false
    setAnalyticsLoading(true)
    fetchProjectAnalyticsByPoint(projectId)
      .then((data) => {
        if (cancelled) return
        const map: Record<string, PointAnalytics> = {}
        data.forEach((row) => { map[row.pointId] = row })
        setAnalyticsMap(map)
      })
      .catch(() => { /* keep analyticsMap null → fallback to 0 counts */ })
      .finally(() => { if (!cancelled) setAnalyticsLoading(false) })
    return () => { cancelled = true }
  }, [sortKey, projectId, analyticsMap])

  const sortedPoints = useMemo(() => {
    const arr = [...points]
    if (sortKey === 'name') {
      arr.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
    } else if (sortKey === 'date') {
      arr.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return tb - ta   // newest first
      })
    } else if (sortKey === 'entries') {
      arr.sort((a, b) => (analyticsMap?.[b.id]?.radiusEntries ?? 0) - (analyticsMap?.[a.id]?.radiusEntries ?? 0))
    } else {
      arr.sort((a, b) => (analyticsMap?.[b.id]?.clicks ?? 0) - (analyticsMap?.[a.id]?.clicks ?? 0))
    }
    return arr
  }, [points, sortKey, analyticsMap])

  // ── Selection ───────────────────────────────────────────────────────────────

  // Keep checkedIds clean when points are removed externally (per-point delete from form)
  useEffect(() => {
    setCheckedIds((prev) => {
      const validIds = new Set(points.map((p) => p.id))
      const filtered = new Set([...prev].filter((id) => validIds.has(id)))
      return filtered.size === prev.size ? prev : filtered
    })
  }, [points])

  const checkedCount = checkedIds.size
  const allChecked = points.length > 0 && checkedCount === points.length
  const someChecked = checkedCount > 0 && !allChecked

  const selectedPoints = points.filter((p) => checkedIds.has(p.id))
  const allActive   = selectedPoints.length > 0 && selectedPoints.every((p) => p.active)
  const allInactive = selectedPoints.length > 0 && selectedPoints.every((p) => !p.active)

  function enterSelectionMode() { setSelectionMode(true) }

  function exitSelectionMode() {
    setSelectionMode(false)
    setCheckedIds(new Set())
  }

  function toggleOne(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll(e: React.MouseEvent) {
    e.stopPropagation()
    setCheckedIds(allChecked ? new Set() : new Set(points.map((p) => p.id)))
  }

  async function handleBulkActivate() {
    setIsWorking(true)
    try { await onBulkActivate(Array.from(checkedIds)) }
    finally { setIsWorking(false); exitSelectionMode() }
  }

  async function handleBulkDeactivate() {
    setIsWorking(true)
    try { await onBulkDeactivate(Array.from(checkedIds)) }
    finally { setIsWorking(false); exitSelectionMode() }
  }

  async function handleBulkDelete() {
    setIsWorking(true)
    try { await onBulkDelete(Array.from(checkedIds)) }
    finally { setIsWorking(false); setConfirmDelete(false); exitSelectionMode() }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function metricValue(pointId: string): number | null {
    if (sortKey !== 'entries' && sortKey !== 'clicks') return null
    if (!analyticsMap) return null
    const row = analyticsMap[pointId]
    return sortKey === 'entries' ? (row?.radiusEntries ?? 0) : (row?.clicks ?? 0)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">

      {/* ── Header ── */}
      <div className="px-3 py-3 border-b border-gray-800 flex items-center gap-2.5 min-h-[48px]">

        {/* Select-all checkbox — only in selection mode */}
        {selectionMode && (
          <button
            onClick={toggleAll}
            className={[
              'flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors',
              allChecked
                ? 'bg-brand-600 border-brand-600'
                : 'border-gray-600 hover:border-brand-500',
            ].join(' ')}
            aria-label={allChecked ? 'Deseleccionar todos' : 'Seleccionar todos'}
          >
            {allChecked && (
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
              </svg>
            )}
            {someChecked && <div className="h-1.5 w-1.5 rounded-sm bg-brand-400" />}
          </button>
        )}

        {/* Title + featured counter */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold">
            {selectionMode && checkedCount > 0 ? (
              <span className="text-brand-400">
                {checkedCount} seleccionado{checkedCount !== 1 ? 's' : ''}
              </span>
            ) : !hideIdleTitle ? (
              <span className="text-gray-100">
                Puntos GPS{' '}
                <span className="text-xs font-normal text-gray-500">({points.length})</span>
              </span>
            ) : null}
          </h2>
          {!selectionMode && points.length > 0 && (
            <p className="text-[11px] text-gray-500 leading-none mt-0.5">
              Destacados:{' '}
              <span className={featuredCount > 0 ? 'text-amber-400 font-medium' : ''}>
                {featuredCount}/{FEATURED_LIMIT}
              </span>
            </p>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {points.length > 0 && (
            selectionMode ? (
              <button
                onClick={exitSelectionMode}
                className="text-xs text-gray-400 hover:text-gray-100 transition-colors px-1 py-0.5"
                aria-label="Salir del modo selección"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button
                onClick={enterSelectionMode}
                className="text-xs text-gray-400 hover:text-brand-400 transition-colors"
              >
                Seleccionar
              </button>
            )
          )}

          {/* Drawer close button — only in non-selection mode */}
          {onClose && !selectionMode && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-200 transition-colors p-0.5"
              aria-label="Cerrar panel"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Sort bar ── */}
      {!selectionMode && points.length > 1 && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-800/60 overflow-x-auto [scrollbar-width:none]">
          {SORT_OPTIONS.map((opt) => {
            const active = sortKey === opt.key
            const loading = analyticsLoading && active && (opt.key === 'entries' || opt.key === 'clicks')
            return (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={[
                  'flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-md text-[11px] font-medium transition-colors',
                  active
                    ? 'bg-gray-700/80 text-gray-100'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/60',
                ].join(' ')}
              >
                {loading ? (
                  <span className="inline-block w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
                ) : null}
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Bulk action bar — only in selection mode with ≥1 checked ── */}
      {selectionMode && checkedCount > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/70 border-b border-gray-800">

          {!allActive && (
            <button
              onClick={handleBulkActivate}
              disabled={isWorking}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-100
                         disabled:opacity-40 disabled:cursor-wait transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Activar
            </button>
          )}

          {!allActive && !allInactive && (
            <span className="text-gray-700 select-none">·</span>
          )}

          {!allInactive && (
            <button
              onClick={handleBulkDeactivate}
              disabled={isWorking}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-100
                         disabled:opacity-40 disabled:cursor-wait transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M4.93 4.93l14.14 14.14" />
              </svg>
              Desactivar
            </button>
          )}

          <span className="text-gray-700 select-none">·</span>

          <button
            onClick={() => setConfirmDelete(true)}
            disabled={isWorking}
            title="Eliminar"
            aria-label="Eliminar"
            className="text-red-400 hover:text-red-300
                       disabled:opacity-40 disabled:cursor-wait transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
        {points.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">
              Haz clic en el mapa para agregar el primer punto.
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {sortedPoints.map((point) => {
              const checked = checkedIds.has(point.id)
              const isEditing = selectedId === point.id && !selectionMode
              const metric = metricValue(point.id)
              return (
                <li key={point.id}>
                  <div
                    className={[
                      'flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-l-2',
                      isEditing
                        ? 'bg-brand-900/40 border-brand-500'
                        : checked
                          ? 'bg-brand-900/20 border-brand-700'
                          : 'hover:bg-gray-800/60 border-transparent',
                    ].join(' ')}
                    onClick={() => {
                      if (selectionMode) {
                        setCheckedIds((prev) => {
                          const next = new Set(prev)
                          if (next.has(point.id)) next.delete(point.id)
                          else next.add(point.id)
                          return next
                        })
                      } else {
                        onSelect(point.id)
                      }
                    }}
                  >
                    {/* Checkbox — only in selection mode */}
                    {selectionMode && (
                      <button
                        onClick={(e) => toggleOne(point.id, e)}
                        className={[
                          'flex-shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors',
                          checked
                            ? 'bg-brand-600 border-brand-600'
                            : 'border-gray-600 hover:border-brand-500',
                        ].join(' ')}
                        aria-label={checked ? 'Deseleccionar' : 'Seleccionar'}
                      >
                        {checked && (
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-800 border border-gray-700/50">
                      {getPointCoverImage(point) ? (
                        <img src={getPointCoverImage(point)} alt={point.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name + metadata */}
                    <div className="flex-1 min-w-0">
                      <p className={[
                        'text-sm font-medium truncate',
                        point.active ? 'text-gray-100' : 'text-gray-500',
                      ].join(' ')}>
                        {point.name || <span className="italic text-gray-600 font-normal">Sin nombre</span>}
                      </p>
                      <p className="text-xs text-gray-600 truncate mt-0.5">
                        {zoneLabel(point)}
                        {point.lookiarUrl ? ' · ' + urlDomain(point.lookiarUrl) : ''}
                      </p>
                    </div>

                    {/* Date label — only when sorted by date */}
                    {sortKey === 'date' && !selectionMode && (
                      <span className="flex-shrink-0 text-[11px] text-gray-500 whitespace-nowrap">
                        {formatDate(point.createdAt)}
                      </span>
                    )}

                    {/* Metric badge — only when sorted by analytics */}
                    {metric !== null && !selectionMode && (
                      <span className="flex-shrink-0 text-[11px] tabular-nums text-gray-400 font-medium min-w-[2rem] text-right">
                        {metric > 999 ? `${(metric / 1000).toFixed(1)}k` : metric}
                      </span>
                    )}

                    {/* Compartir — always visible when not in selection mode */}
                    {!selectionMode && projectId && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSharePoint(point) }}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center
                                   rounded text-gray-600 hover:text-gray-300
                                   hover:bg-gray-700/60 transition-colors"
                        title="Compartir"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    )}

                    {/* Destacar — star toggle */}
                    {!selectionMode && (
                      <button
                        onClick={(e) => handleToggleFeatured(e, point)}
                        className={[
                          'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded transition-colors',
                          point.featured
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-gray-600 hover:text-gray-300 hover:bg-gray-700/60',
                        ].join(' ')}
                        title={point.featured ? 'Quitar destacado' : 'Destacar punto'}
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"
                          fill={point.featured ? 'currentColor' : 'none'}
                          stroke="currentColor" strokeWidth={2}
                          strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    )}

                    {/* Toggle — in Orden and Nombre modes only */}
                    {!selectionMode && metric === null && sortKey !== 'date' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleActive(point.id) }}
                        className={[
                          'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors',
                          point.active ? 'bg-brand-600' : 'bg-gray-700',
                        ].join(' ')}
                        title={point.active ? 'Desactivar' : 'Activar'}
                      >
                        <span
                          className={[
                            'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
                            point.active ? 'translate-x-4' : 'translate-x-1',
                          ].join(' ')}
                        />
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* ── Footer ── */}
      {!selectionMode && (
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md
                       border border-dashed border-gray-700 text-sm text-gray-400
                       hover:border-brand-600 hover:text-brand-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar punto al mapa
          </button>
        </div>
      )}

      {/* ── Bulk delete confirmation modal ── */}
      <Modal
        open={confirmDelete}
        title={`Eliminar ${checkedCount} punto${checkedCount !== 1 ? 's' : ''} GPS`}
        description={`Se eliminarán ${checkedCount} punto${checkedCount !== 1 ? 's' : ''} del proyecto. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleBulkDelete}
        onCancel={() => setConfirmDelete(false)}
        danger
      />

      {/* ── Share modal ── */}
      {sharePoint && projectId && (
        <GeoPointShareModal
          point={sharePoint}
          projectId={projectId}
          isOpen
          onClose={() => setSharePoint(null)}
        />
      )}
    </div>
  )
}
