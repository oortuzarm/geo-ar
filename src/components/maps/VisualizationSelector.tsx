interface Props {
  showGpsIntensity:     boolean
  showHotspots:         boolean
  showOutsideAreas:     boolean
  onToggleIntensity:    () => void
  onToggleHotspots:     () => void
  onToggleOutsideAreas: () => void
}

function LayerDot({ active, color }: { active: boolean; color: 'emerald' | 'orange' | 'blue' }) {
  return (
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
      active
        ? color === 'emerald' ? 'bg-emerald-400'
        : color === 'orange'  ? 'bg-orange-400'
        : 'bg-blue-400'
        : 'bg-gray-600'
    }`} />
  )
}

export default function VisualizationSelector({
  showGpsIntensity,
  showHotspots,
  showOutsideAreas,
  onToggleIntensity,
  onToggleHotspots,
  onToggleOutsideAreas,
}: Props) {
  return (
    <div className="inline-flex items-center bg-gray-900 border border-gray-700/60 rounded-xl p-[3px] gap-[2px]">

      {/* Label */}
      <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide px-2 flex-shrink-0 select-none">
        Capas
      </span>
      <div className="w-px h-3.5 bg-gray-700/60 flex-shrink-0" />

      {/* Intensidad GPS */}
      <button
        type="button"
        onClick={onToggleIntensity}
        title={showGpsIntensity ? 'Desactivar Intensidad GPS' : 'Activar Intensidad GPS'}
        className={[
          'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          showGpsIntensity
            ? 'bg-gray-700/80 text-gray-200 shadow-sm'
            : 'text-gray-500 hover:text-gray-400',
        ].join(' ')}
      >
        <LayerDot active={showGpsIntensity} color="emerald" />
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
        Intensidad GPS
      </button>

      {/* Zonas Calientes */}
      <button
        type="button"
        onClick={onToggleHotspots}
        title={showHotspots ? 'Desactivar Zonas Calientes' : 'Activar Zonas Calientes'}
        className={[
          'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          showHotspots
            ? 'bg-orange-900/50 border border-orange-700/40 text-orange-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-400',
        ].join(' ')}
      >
        <LayerDot active={showHotspots} color="orange" />
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
        Zonas Calientes
      </button>

      {/* Actividad Fuera de Áreas */}
      <button
        type="button"
        onClick={onToggleOutsideAreas}
        title={showOutsideAreas ? 'Desactivar Actividad Fuera de Áreas' : 'Activar Actividad Fuera de Áreas'}
        className={[
          'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          showOutsideAreas
            ? 'bg-blue-900/50 border border-blue-700/40 text-blue-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-400',
        ].join(' ')}
      >
        <LayerDot active={showOutsideAreas} color="blue" />
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Fuera de Áreas
      </button>

    </div>
  )
}
