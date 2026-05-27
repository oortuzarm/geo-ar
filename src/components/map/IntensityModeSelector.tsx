export type IntensityMode = 'live' | 'historical'

interface Props {
  mode:     IntensityMode
  onChange: (mode: IntensityMode) => void
}

export default function IntensityModeSelector({ mode, onChange }: Props) {
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
        title={'Visualiza las zonas con mayor actividad acumulada en el tiempo.\nLa intensidad se calcula relativa a la zona con mayor actividad.'}
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
      </button>
    </div>
  )
}
