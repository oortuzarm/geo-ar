import { useState, useRef, useEffect } from 'react'
import { searchAddressChile } from '../../features/geolocation/chileAddressSearch'
import type { NominatimResult } from '../../types'

type SearchState = 'idle' | 'searching' | 'results' | 'no-results' | 'error'

interface AddressSearchProps {
  onSelect: (lat: number, lng: number, displayName: string) => void
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 3) {
      setResults([])
      setOpen(false)
      setSearchState('idle')
      return
    }

    setSearchState('searching')

    debounceRef.current = setTimeout(async () => {
      try {
        const found = await searchAddressChile(query)
        setResults(found)
        setSearchState(found.length > 0 ? 'results' : 'no-results')
        setOpen(true)
      } catch {
        setResults([])
        setSearchState('error')
        setOpen(true)
      }
    }, 500)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(result: NominatimResult) {
    onSelect(parseFloat(result.lat), parseFloat(result.lon), result.display_name)
    setQuery(result.display_name)
    setOpen(false)
    setResults([])
    setSearchState('idle')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault()
      handleSelect(results[0])
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
    setSearchState('idle')
  }

  const isSearching = searchState === 'searching'

  return (
    <div ref={containerRef} className="relative w-full">
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
          onKeyDown={handleKeyDown}
          placeholder="Buscar dirección..."
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

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700
                       rounded-lg shadow-2xl z-[1000] overflow-hidden">
          {searchState === 'results' && (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((r) => (
                <li key={r.place_id}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-300
                               hover:bg-gray-800 transition-colors flex items-start gap-2.5"
                  >
                    <svg className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="leading-snug">{r.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchState === 'no-results' && (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-400">No encontramos una coincidencia exacta.</p>
              <p className="text-xs text-gray-500 mt-1">
                Ajusta la búsqueda o selecciona el punto manualmente en el mapa.
              </p>
            </div>
          )}
          {searchState === 'error' && (
            <p className="px-4 py-3 text-sm text-red-400">
              No pudimos buscar la dirección. Intenta nuevamente.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
