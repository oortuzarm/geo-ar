import { useEffect, useRef, useState } from 'react'

export type IntensityMode = 'live' | 'historical'

interface Props {
  mode:     IntensityMode
  onChange: (mode: IntensityMode) => void
}

export default function IntensityModeSelector({ mode, onChange }: Props) {
  const [showInfo, setShowInfo]   = useState(false)
  const [tooltipDir, setTooltipDir] = useState<'up' | 'down'>('up')
  const infoRef = useRef<HTMLSpanElement>(null)

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!showInfo && infoRef.current) {
      const top = infoRef.current.getBoundingClientRect().top
      setTooltipDir(top < 150 ? 'down' : 'up')
    }
    setShowInfo((v) => !v)
  }

  useEffect(() => {
    if (!showInfo) return
    const handler = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showInfo])

  return (
    <div className="inline-flex items-center bg-gray-900 border border-gray-700/60 rounded-full p-[3px] gap-[2px]">
      <button
        onClick={() => onChange('live')}
        className={`flex items-center gap-1.5 px-3 h-[26px] rounded-full text-[11px] font-medium
                    transition-all whitespace-nowrap ${
          mode === 'live'
            ? 'bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        {mode === 'live' ? (
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
        )}
        En vivo
      </button>

      <button
        onClick={() => onChange('historical')}
        className={`flex items-center gap-1.5 px-3 h-[26px] rounded-full text-[11px] font-medium
                    transition-all whitespace-nowrap ${
          mode === 'historical'
            ? 'bg-gray-700/80 text-gray-200 shadow-sm'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        {mode === 'historical' && (
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        Histórica

        <span
          ref={infoRef}
          onClick={handleInfoClick}
          className="relative flex-shrink-0 w-3.5 h-3.5 rounded-full border border-gray-500 text-gray-400
                     hover:border-gray-300 hover:text-gray-200 flex items-center justify-center
                     text-[9px] font-bold leading-none cursor-pointer transition-colors"
        >
          ?
          {showInfo && (
            <span
              className={`absolute right-0 w-56 bg-gray-800 border border-gray-700/60
                          rounded-xl shadow-xl px-3 py-2.5 z-[9999] pointer-events-none
                          text-left font-normal text-[11px] text-gray-300 leading-relaxed
                          ${tooltipDir === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'}`}
            >
              Visualiza las zonas con mayor actividad acumulada en el tiempo.
              <br />
              La intensidad se calcula relativa a la zona con mayor actividad.
            </span>
          )}
        </span>
      </button>
    </div>
  )
}
