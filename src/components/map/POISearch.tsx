import { useState, useRef, useEffect } from 'react'
import { searchMapQuery, looksLikeAddress } from '../../services/poiSearchService'
import { lastSearchMeta } from '../../features/geolocation/chileAddressSearch'
import { haversineDistance } from '../../features/geolocation/haversine'
import Modal from '../ui/Modal'
import type { PoiSearchResult, MapBounds, GeoPoint } from '../../types'

interface Props {
  mapBounds: MapBounds | null
  existingPoints: GeoPoint[]
  onFlyTo: (lat: number, lng: number) => void
  onCreatePoint: (result: PoiSearchResult) => Promise<void>
  onResultsChange: (results: PoiSearchResult[]) => void
}

type SearchState = 'idle' | 'searching' | 'results' | 'no-results' | 'error'

export default function POISearch({ mapBounds, existingPoints, onFlyTo, onCreatePoint, onResultsChange }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PoiSearchResult[]>([])
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const [open, setOpen] = useState(false)
  const [creatingIds, setCreatingIds] = useState<Set<string>>(new Set())
  const [confirmBulk, setConfirmBulk] = useState(false)
  const [creatingAll, setCreatingAll] = useState(false)
  const [hasApproximate, setHasApproximate] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRequestRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  // Stable refs so the debounced callback always sees the latest values
  const mapBoundsRef = useRef(mapBounds)
  mapBoundsRef.current = mapBounds
  const onResultsChangeRef = useRef(onResultsChange)
  onResultsChangeRef.current = onResultsChange

  function isDuplicate(result: PoiSearchResult): boolean {
    return existingPoints.some(
      (p) => haversineDistance(p.latitude, p.longitude, result.lat, result.lng) < 10,
    )
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 4) {
      setResults([])
      setOpen(false)
      setSearchState('idle')
      onResultsChangeRef.current([])
      return
    }

    setSearchState('searching')
    setHasApproximate(false)

    debounceRef.current = setTimeout(async () => {
      const reqId = ++latestRequestRef.current
      try {
        const found = await searchMapQuery(query, mapBoundsRef.current)
        if (latestRequestRef.current !== reqId) return
        setResults(found)
        onResultsChangeRef.current(found)
        setHasApproximate(looksLikeAddress(query) && lastSearchMeta.hasApproximate)
        setSearchState(found.length > 0 ? 'results' : 'no-results')
        setOpen(true)
      } catch {
        if (latestRequestRef.current !== reqId) return
        setResults([])
        onResultsChangeRef.current([])
        setHasApproximate(false)
        setSearchState('error')
        setOpen(true)
      }
    }, 500)
  }, [query])

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  async function handleCreate(result: PoiSearchResult) {
    if (isDuplicate(result) || creatingIds.has(result.id) || creatingAll) return
    setCreatingIds((prev) => new Set([...prev, result.id]))
    try {
      await onCreatePoint(result)
      setResults((prev) => {
        const next = prev.filter((r) => r.id !== result.id)
        onResultsChangeRef.current(next)
        return next
      })
    } finally {
      setCreatingIds((prev) => {
        const s = new Set(prev)
        s.delete(result.id)
        return s
      })
    }
  }

  async function handleCreateAll() {
    const toCreate = results.filter((r) => !isDuplicate(r))
    setConfirmBulk(false)
    setCreatingAll(true)
    try {
      for (const result of toCreate) {
        setCreatingIds((prev) => new Set([...prev, result.id]))
        await onCreatePoint(result)
        setCreatingIds((prev) => {
          const s = new Set(prev)
          s.delete(result.id)
          return s
        })
      }
    } finally {
      setCreatingAll(false)
    }
    setResults([])
    onResultsChangeRef.current([])
    setOpen(false)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    onResultsChangeRef.current([])
    setOpen(false)
    setSearchState('idle')
    setHasApproximate(false)
  }

  // Prevent map from receiving pointer/keyboard events through the search widget
  function stopProp(e: React.SyntheticEvent) {
    e.stopPropagation()
  }

  const nonDuplicates = results.filter((r) => !isDuplicate(r))
  const isSearching = searchState === 'searching'

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseDown={stopProp}
      onClick={stopProp}
      onTouchStart={stopProp}
    >
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
            e.stopPropagation()
          }}
          placeholder="Buscar sucursales, lugares..."
          className="w-full bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg
                     pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {isSearching && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
            viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {query && !isSearching && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            title="Limpiar búsqueda"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700
                       rounded-lg shadow-2xl z-[1000] overflow-hidden">

          {searchState === 'results' && (
            <>
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-800/60">
                {results.map((r) => {
                  const dup = isDuplicate(r)
                  const creating = creatingIds.has(r.id)
                  return (
                    <li
                      key={r.id}
                      className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Clicking the name/address flies to that location */}
                      <button
                        onClick={() => onFlyTo(r.lat, r.lng)}
                        className="flex-1 text-left min-w-0"
                        title="Ver en mapa"
                      >
                        <p className="text-sm text-gray-200 truncate">{r.name}</p>
                        {r.displayName !== r.name && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{r.displayName}</p>
                        )}
                      </button>

                      {dup ? (
                        <span className="flex-shrink-0 text-xs text-gray-600 mt-0.5 italic">
                          Ya existe
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCreate(r)}
                          disabled={creating || creatingAll}
                          className="flex-shrink-0 text-xs font-medium text-brand-400 hover:text-brand-300
                                     disabled:opacity-40 disabled:cursor-wait transition-colors mt-0.5"
                        >
                          {creating ? 'Creando…' : '+ Punto'}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* Approximate fallback notice */}
              {hasApproximate && (
                <div className="border-t border-gray-800 px-3 py-2">
                  <p className="text-xs text-amber-400">
                    No encontramos la numeración exacta. Puedes ajustar la búsqueda o seleccionar el punto manualmente en el mapa.
                  </p>
                </div>
              )}

              {/* Footer: summary + bulk action (hidden for address queries) */}
              {!looksLikeAddress(query) && (
                <div className="border-t border-gray-800 px-3 py-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-600">
                    {results.length} resultado{results.length !== 1 ? 's' : ''}
                    {results.length - nonDuplicates.length > 0 &&
                      ` · ${results.length - nonDuplicates.length} ya existente${results.length - nonDuplicates.length !== 1 ? 's' : ''}`}
                  </span>
                  {nonDuplicates.length > 1 && (
                    <button
                      onClick={() => setConfirmBulk(true)}
                      disabled={creatingAll}
                      className="text-xs font-medium text-brand-400 hover:text-brand-300
                                 disabled:opacity-40 disabled:cursor-wait transition-colors flex-shrink-0"
                    >
                      {creatingAll ? 'Creando…' : `Crear todos (${nonDuplicates.length})`}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {searchState === 'no-results' && (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-400">No encontramos una coincidencia exacta.</p>
              <p className="text-xs text-gray-500 mt-1">
                {looksLikeAddress(query)
                  ? 'Prueba ajustar la búsqueda o selecciona el punto manualmente en el mapa.'
                  : 'No encontramos lugares con ese nombre en esta zona del mapa.'}
              </p>
            </div>
          )}

          {searchState === 'error' && (
            <p className="px-4 py-3 text-sm text-red-400">
              No se pudo realizar la búsqueda. Intenta nuevamente.
            </p>
          )}
        </div>
      )}

      <Modal
        open={confirmBulk}
        title={`Crear ${nonDuplicates.length} puntos GPS`}
        description={`Se agregarán ${nonDuplicates.length} puntos al proyecto basados en los resultados de búsqueda. ¿Continuar?`}
        confirmLabel={`Crear ${nonDuplicates.length} puntos`}
        onConfirm={handleCreateAll}
        onCancel={() => setConfirmBulk(false)}
      />
    </div>
  )
}
