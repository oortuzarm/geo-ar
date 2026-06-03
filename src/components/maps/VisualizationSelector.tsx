export type VizMode = 'intensity' | 'hotspots'

interface Props {
  mode:     VizMode
  onChange: (mode: VizMode) => void
}

export default function VisualizationSelector({ mode, onChange }: Props) {
  return (
    <div className="inline-flex items-center bg-gray-900 border border-gray-700/60 rounded-full p-[3px] gap-[2px]">

      {/* Intensidad GPS */}
      <button
        onClick={() => onChange('intensity')}
        className={[
          'flex items-center gap-1.5 px-3 h-[26px] rounded-full text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          mode === 'intensity'
            ? 'bg-gray-700/80 text-gray-200 shadow-sm'
            : 'text-gray-500 hover:text-gray-300',
        ].join(' ')}
      >
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
        Intensidad GPS
      </button>

      {/* Zonas Calientes */}
      <button
        onClick={() => onChange('hotspots')}
        className={[
          'flex items-center gap-1.5 px-3 h-[26px] rounded-full text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          mode === 'hotspots'
            ? 'bg-orange-900/50 border border-orange-700/40 text-orange-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-300',
        ].join(' ')}
      >
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
        Zonas Calientes
      </button>

    </div>
  )
}
