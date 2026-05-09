import { formatDistance } from '../../features/geolocation/haversine'
import { formatDuration } from '../../features/routing/orsClient'

interface NavigationBottomCardProps {
  pointName: string
  distanceMeters: number
  durationSeconds: number
  onExit: () => void
}

export default function NavigationBottomCard({
  pointName,
  distanceMeters,
  durationSeconds,
  onExit,
}: NavigationBottomCardProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[450] md:hidden animate-slide-up">
      <div
        className="bg-gray-950/98 backdrop-blur-xl rounded-t-[28px]
                   border-t border-white/[0.07]
                   shadow-[0_-8px_40px_rgba(0,0,0,0.75)]"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-0">
          <div className="w-8 h-1 rounded-full bg-white/15" />
        </div>

        {/* Distance + ETA */}
        <div className="px-6 pt-3 pb-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-black text-gray-100 leading-none tabular-nums">
              {distanceMeters > 0 ? formatDistance(distanceMeters) : '—'}
            </span>
            <span className="text-sm text-gray-400 font-medium">
              {durationSeconds > 0 ? `· ${formatDuration(durationSeconds)}` : ''}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-1 font-medium">
            {pointName}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 mt-3 mb-3 border-t border-white/[0.06]" />

        {/* Exit button */}
        <div className="px-5">
          <button
            onClick={onExit}
            className="w-full py-3.5 rounded-2xl
                       bg-red-600 hover:bg-red-500 active:scale-[0.98]
                       text-white font-bold text-sm
                       shadow-lg shadow-red-900/50
                       transition-all duration-150"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  )
}
