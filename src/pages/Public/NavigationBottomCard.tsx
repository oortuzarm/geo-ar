import { formatDistance } from '../../features/geolocation/haversine'
import { formatDuration } from '../../features/routing/orsClient'

interface NavigationBottomCardProps {
  pointName: string
  distanceMeters: number
  durationSeconds: number
  isLocked: boolean
  onRecenter: () => void
  onExit: () => void
}

export default function NavigationBottomCard({
  pointName,
  distanceMeters,
  durationSeconds,
  isLocked,
  onRecenter,
  onExit,
}: NavigationBottomCardProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[450] md:hidden">
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
            {durationSeconds > 0 && (
              <span className="text-sm text-gray-400 font-medium">
                · {formatDuration(durationSeconds)}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-1 font-medium">
            {pointName}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 mt-3 mb-3 border-t border-white/[0.06]" />

        {/* Actions */}
        <div className="px-5 flex items-center gap-3">
          {/* Re-center button — only visible when user has panned away */}
          {!isLocked && (
            <button
              onClick={onRecenter}
              className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl
                         bg-brand-600/90 hover:bg-brand-600 active:scale-[0.98]
                         text-white font-semibold text-sm
                         shadow-lg shadow-brand-900/50
                         transition-all duration-150 flex-shrink-0"
            >
              {/* Target / re-center icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm-8.93 3A9.004 9.004 0 0111 3.07V1h2v2.07A9.004 9.004 0 0120.93 11H23v2h-2.07A9.004 9.004 0 0113 20.93V23h-2v-2.07A9.004 9.004 0 013.07 13H1v-2h2.07z" />
              </svg>
              Recentrar
            </button>
          )}

          {/* Exit button */}
          <button
            onClick={onExit}
            className="flex-1 py-3.5 rounded-2xl
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
