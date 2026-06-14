interface Props {
  showGpsIntensity:  boolean
  onToggleIntensity: () => void
}

function LayerDot({ active }: { active: boolean }) {
  return (
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
      active ? 'bg-emerald-400' : 'bg-gray-600'
    }`} />
  )
}

export default function VisualizationSelector({
  showGpsIntensity,
  onToggleIntensity,
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
        <LayerDot active={showGpsIntensity} />
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m2-2v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
        </svg>
        Intensidad GPS
      </button>

    </div>
  )
}
