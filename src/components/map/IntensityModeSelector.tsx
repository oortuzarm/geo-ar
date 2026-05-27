import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type IntensityMode = 'live' | 'historical'

interface Props {
  mode:     IntensityMode
  onChange: (mode: IntensityMode) => void
}

interface TooltipPos {
  top:   number
  right: number
}

export default function IntensityModeSelector({ mode, onChange }: Props) {
  const [showInfo, setShowInfo]     = useState(false)
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null)
  const infoRef = useRef<HTMLSpanElement>(null)

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!showInfo && infoRef.current) {
      const rect = infoRef.current.getBoundingClientRect()
      setTooltipPos({
        top:   rect.bottom + 12,
        right: window.innerWidth - rect.right - 4,
      })
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
      {/* En vivo */}
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

      {/* Histórica */}
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

        {/* "?" icon — stop propagation so it doesn't toggle the mode */}
        <span
          ref={infoRef}
          onClick={handleInfoClick}
          className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center
                      text-[9px] font-bold leading-none cursor-pointer transition-colors ml-0.5
                      ${showInfo
                        ? 'border-gray-300 text-gray-200'
                        : 'border-gray-500 text-gray-400 hover:border-gray-300 hover:text-gray-200'
                      }`}
        >
          ?
        </span>
      </button>

      {/* Tooltip — rendered at body level via portal so it escapes all clipping contexts */}
      {showInfo && tooltipPos && createPortal(
        <div
          style={{ position: 'fixed', top: tooltipPos.top, right: tooltipPos.right, zIndex: 99999 }}
          className="w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-700/70
                     rounded-xl shadow-2xl px-4 py-3 pointer-events-none"
        >
          <p className="text-[12px] text-gray-200 leading-relaxed whitespace-normal break-words">
            Visualiza las zonas con mayor actividad acumulada en el tiempo.
          </p>
          <p className="text-[12px] text-gray-400 leading-relaxed whitespace-normal break-words mt-1.5">
            La intensidad se calcula relativa a la zona con mayor actividad.
          </p>
        </div>,
        document.body,
      )}
    </div>
  )
}
