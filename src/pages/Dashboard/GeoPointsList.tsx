import { useState, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import type { GeoPoint } from '../../types'

interface GeoPointsListProps {
  points: GeoPoint[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onToggleActive: (id: string) => void
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkDeactivate: (ids: string[]) => Promise<void>
}

export default function GeoPointsList({
  points,
  selectedId,
  onSelect,
  onAdd,
  onToggleActive,
  onBulkDelete,
  onBulkDeactivate,
}: GeoPointsListProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isWorking, setIsWorking] = useState(false)

  // Keep checkedIds in sync if points are removed externally (e.g. per-point delete)
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
    setCheckedIds(
      allChecked ? new Set() : new Set(points.map((p) => p.id)),
    )
  }

  async function handleBulkDeactivate() {
    setIsWorking(true)
    try {
      await onBulkDeactivate(Array.from(checkedIds))
      setCheckedIds(new Set())
    } finally {
      setIsWorking(false)
    }
  }

  async function handleBulkDelete() {
    setIsWorking(true)
    try {
      await onBulkDelete(Array.from(checkedIds))
      setCheckedIds(new Set())
    } finally {
      setIsWorking(false)
      setConfirmDelete(false)
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="px-3 py-3 border-b border-gray-800 flex items-center gap-2.5">
        {/* Select-all checkbox */}
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
          {someChecked && (
            <div className="h-1.5 w-1.5 rounded-sm bg-brand-400" />
          )}
        </button>

        <h2 className="flex-1 text-sm font-semibold">
          {checkedCount > 0 ? (
            <span className="text-brand-400">
              {checkedCount} seleccionado{checkedCount !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-gray-100">
              Puntos GPS{' '}
              <span className="text-xs font-normal text-gray-500">({points.length})</span>
            </span>
          )}
        </h2>
      </div>

      {/* ── Bulk action bar ── */}
      {checkedCount > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/70 border-b border-gray-800">
          <button
            onClick={handleBulkDeactivate}
            disabled={isWorking}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-100
                       disabled:opacity-40 disabled:cursor-wait transition-colors"
          >
            {/* Slash-circle icon */}
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M4.93 4.93l14.14 14.14" />
            </svg>
            Desactivar
          </button>

          <span className="text-gray-700 select-none">·</span>

          <button
            onClick={() => setConfirmDelete(true)}
            disabled={isWorking}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300
                       disabled:opacity-40 disabled:cursor-wait transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      )}

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto">
        {points.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500">
              Haz clic en el mapa para agregar el primer punto.
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {points.map((point) => {
              const checked = checkedIds.has(point.id)
              const isSelected = selectedId === point.id && checkedCount === 0
              return (
                <li key={point.id}>
                  <div
                    className={[
                      'flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors border-l-2',
                      isSelected
                        ? 'bg-brand-900/40 border-brand-500'
                        : checked
                          ? 'bg-brand-900/20 border-brand-700'
                          : 'hover:bg-gray-800/60 border-transparent',
                    ].join(' ')}
                    onClick={() => {
                      if (checkedCount > 0) {
                        // In selection mode: row click toggles the checkbox
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
                    {/* Per-row checkbox */}
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

                    {/* Status dot */}
                    <div
                      className={[
                        'w-2 h-2 rounded-full flex-shrink-0',
                        point.active ? 'bg-red-500' : 'bg-gray-600',
                      ].join(' ')}
                    />

                    {/* Name + metadata */}
                    <div className="flex-1 min-w-0">
                      <p className={[
                        'text-sm truncate',
                        point.active ? 'text-gray-200' : 'text-gray-500',
                      ].join(' ')}>
                        {point.name || <span className="italic text-gray-600">Sin nombre</span>}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {point.activationRadius} m
                        {point.lookiarUrl
                          ? ' · ' + point.lookiarUrl.replace('https://', '').split('/').slice(0, 2).join('/')
                          : ''}
                      </p>
                    </div>

                    {/* Individual active toggle — always available */}
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
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* ── Footer ── */}
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

      {/* ── Bulk delete confirmation ── */}
      <Modal
        open={confirmDelete}
        title={`Eliminar ${checkedCount} punto${checkedCount !== 1 ? 's' : ''} GPS`}
        description={`Se eliminarán ${checkedCount} punto${checkedCount !== 1 ? 's' : ''} del proyecto. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleBulkDelete}
        onCancel={() => setConfirmDelete(false)}
        danger
      />
    </div>
  )
}
