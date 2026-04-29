import { useState, useRef, useEffect } from 'react'
import { searchAddress } from '../../features/geolocation/geocoding'
import type { NominatimResult } from '../../types'

interface AddressSearchProps {
  onSelect: (lat: number, lng: number, displayName: string) => void
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.length < 3) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const found = await searchAddress(query)
        setResults(found)
        setOpen(found.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 500)
  }, [query])

  // Close dropdown on outside click
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
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar dirección..."
          className="w-full bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg
                     pl-10 pr-10 py-2.5 text-sm text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {loading && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400"
            viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700
                       rounded-lg shadow-2xl z-[1000] overflow-hidden max-h-60 overflow-y-auto">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
