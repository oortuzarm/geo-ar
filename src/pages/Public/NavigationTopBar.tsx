import { formatDistance } from '../../features/geolocation/haversine'
import { formatDuration } from '../../features/routing/orsClient'

interface NavigationTopBarProps {
  pointName: string
  distanceMeters: number
  durationSeconds: number
}

export default function NavigationTopBar({
  pointName,
  distanceMeters,
  durationSeconds,
}: NavigationTopBarProps) {
  return (
    <div className="absolute inset-x-4 top-4 z-[450] pointer-events-none">
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5
                   bg-gray-950/97 backdrop-blur-xl
                   border border-white/[0.08]
                   shadow-[0_4px_32px_rgba(0,0,0,0.75)]
                   animate-slide-down"
      >
        {/* Navigation arrow icon */}
        <div
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center
                     rounded-xl bg-brand-600 shadow-lg shadow-brand-900/60"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 L3.5 21.5 L12 17.5 L20.5 21.5 Z" />
          </svg>
        </div>

        {/* Destination info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 leading-none">
            Hacia
          </p>
          <p className="mt-1 text-sm font-bold text-gray-100 leading-snug line-clamp-1">
            {pointName}
          </p>
        </div>

        {/* Distance + ETA */}
        <div className="flex-shrink-0 text-right">
          <p className="text-sm font-black text-gray-100 leading-none">
            {distanceMeters > 0 ? formatDistance(distanceMeters) : '—'}
          </p>
          <p className="text-[11px] text-gray-400 mt-1 leading-none">
            {durationSeconds > 0 ? formatDuration(durationSeconds) : '—'}
          </p>
        </div>

        {/* Live indicator */}
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
  )
}
