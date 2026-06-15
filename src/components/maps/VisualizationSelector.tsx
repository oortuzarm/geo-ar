interface Props {
  showGpsIntensity:               boolean
  showHotspots:                   boolean
  showOutsideAreas:               boolean
  onToggleIntensity:              () => void
  onToggleHotspots:               () => void
  onToggleOutsideAreas:           () => void
  showExclusivelyOutside?:        boolean
  onToggleExclusivelyOutside?:    () => void
  showLiveOutside?:               boolean
  onToggleLiveOutside?:           () => void
}

function LayerDot({ active, color }: { active: boolean; color: 'amber' | 'orange' | 'violet' | 'blue' }) {
  return (
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
      active
        ? color === 'amber'  ? 'bg-amber-400'
        : color === 'orange' ? 'bg-orange-400'
        : color === 'violet' ? 'bg-violet-400'
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
  showExclusivelyOutside,
  onToggleExclusivelyOutside,
  showLiveOutside,
  onToggleLiveOutside,
}: Props) {
  return (
    <div className="inline-flex flex-nowrap min-w-max whitespace-nowrap items-center bg-gray-900 border border-gray-700/60 rounded-xl p-[3px] gap-[2px]">

      {/* Label */}
      <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wide px-2 flex-shrink-0 select-none">
        Capas
      </span>
      <div className="w-px h-3.5 bg-gray-700/60 flex-shrink-0" />

      {/* Actividad en Ubicaciones */}
      <button
        type="button"
        onClick={onToggleIntensity}
        title={showGpsIntensity ? 'Desactivar Actividad en Ubicaciones' : 'Activar Actividad en Ubicaciones'}
        className={[
          'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          showGpsIntensity
            ? 'bg-amber-900/50 border border-amber-700/40 text-amber-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-400',
        ].join(' ')}
      >
        <LayerDot active={showGpsIntensity} color="amber" />
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
        Actividad en Ubicaciones
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

      {/* Actividad Dentro y Fuera */}
      <button
        type="button"
        onClick={onToggleOutsideAreas}
        title={showOutsideAreas ? 'Desactivar Actividad Dentro y Fuera' : 'Activar Actividad Dentro y Fuera'}
        className={[
          'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
          'transition-all whitespace-nowrap',
          showOutsideAreas
            ? 'bg-violet-900/50 border border-violet-700/40 text-violet-300 shadow-sm'
            : 'text-gray-500 hover:text-gray-400',
        ].join(' ')}
      >
        <LayerDot active={showOutsideAreas} color="violet" />
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Dentro y Fuera
      </button>

      {/* Fuera de Ubicaciones — solo en modo en vivo (prop opcional) */}
      {onToggleLiveOutside !== undefined && (
        <>
          <div className="w-px h-3.5 bg-gray-700/60 flex-shrink-0" />
          <button
            type="button"
            onClick={onToggleLiveOutside}
            title={(showLiveOutside ?? false) ? 'Desactivar Fuera de Ubicaciones' : 'Activar Fuera de Ubicaciones'}
            className={[
              'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
              'transition-all whitespace-nowrap',
              (showLiveOutside ?? false)
                ? 'bg-blue-900/50 border border-blue-700/40 text-blue-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-400',
            ].join(' ')}
          >
            <LayerDot active={showLiveOutside ?? false} color="blue" />
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Fuera de Ubic.
          </button>
        </>
      )}

      {/* Personas Exclusivamente Fuera — solo en modo histórico (prop opcional) */}
      {onToggleExclusivelyOutside !== undefined && (
        <>
          <div className="w-px h-3.5 bg-gray-700/60 flex-shrink-0" />
          <button
            type="button"
            onClick={onToggleExclusivelyOutside}
            title={(showExclusivelyOutside ?? false) ? 'Desactivar Personas Exclusivamente Fuera' : 'Activar Personas Exclusivamente Fuera'}
            className={[
              'flex items-center gap-1.5 px-2.5 h-[26px] rounded-lg text-[11px] font-medium',
              'transition-all whitespace-nowrap',
              (showExclusivelyOutside ?? false)
                ? 'bg-blue-900/50 border border-blue-700/40 text-blue-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-400',
            ].join(' ')}
          >
            <LayerDot active={showExclusivelyOutside ?? false} color="blue" />
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Excl. Fuera
          </button>
        </>
      )}

    </div>
  )
}
