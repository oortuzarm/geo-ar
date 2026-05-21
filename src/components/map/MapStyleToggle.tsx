import { MAP_STYLES, type MapStyleId } from '../../config/mapStyles'

const STYLES = [MAP_STYLES.streets, MAP_STYLES.satellite]

interface Props {
  styleId: MapStyleId
  onStyleChange: (id: MapStyleId) => void
  className?: string
}

export default function MapStyleToggle({ styleId, onStyleChange, className = '' }: Props) {
  return (
    <div
      className={`inline-flex overflow-hidden rounded-lg
                  bg-gray-950/80 backdrop-blur-md
                  border border-white/[0.14]
                  shadow-[0_2px_12px_rgba(0,0,0,0.45)] ${className}`}
    >
      {STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleChange(style.id)}
          className={[
            'px-3 py-1.5 text-[11px] font-semibold leading-none',
            'transition-all duration-150 active:scale-95',
            styleId === style.id
              ? 'bg-white/[0.16] text-white'
              : 'text-white/45 hover:text-white/70',
          ].join(' ')}
        >
          {style.label}
        </button>
      ))}
    </div>
  )
}
