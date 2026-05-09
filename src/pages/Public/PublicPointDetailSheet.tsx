import { useState } from 'react'
import PublicPointCard from './PublicPointCard'
import type { GeoPoint } from '../../types'
import type { RouteStatus } from './PublicPointCard'
import Modal from '../../components/ui/Modal'
import { computePointAvailability } from '../../features/geolocation/availability'

interface PublicPointDetailSheetProps {
  point:                  GeoPoint
  distance:               number | null
  onClose:                () => void
  onActivate:             () => void
  isActivating:           boolean
  accessMessage?:         string
  accessFallbackUrl?:     string
  routeStatus?:           RouteStatus
  walkingDistanceMeters?: number
  walkingDurationSeconds?: number
  address?:               string
  onStartRoute?:          () => void
}

export default function PublicPointDetailSheet({
  point, distance, onClose, onActivate,
  isActivating, accessMessage, accessFallbackUrl,
  routeStatus, walkingDistanceMeters, walkingDurationSeconds, address,
  onStartRoute,
}: PublicPointDetailSheetProps) {
  const [showRouteWarning, setShowRouteWarning] = useState(false)
  const avail = computePointAvailability(point, distance)

  function handleStartRoute() {
    if (!avail.canAccess) {
      setShowRouteWarning(true)
    } else {
      onStartRoute?.()
    }
  }

  return (
    <>
    <div
      className="md:hidden absolute inset-x-0 bottom-0 z-[1100]"
      style={{ height: '82dvh', transition: 'height 0.4s cubic-bezier(0.32,0.72,0,1)' }}
    >
      <div className="h-full flex flex-col rounded-t-[28px] overflow-hidden
                      bg-gray-950/98 backdrop-blur-xl
                      border-t border-white/[0.07]
                      shadow-[0_-12px_40px_rgba(0,0,0,0.75)]">

        {/* Handle + back */}
        <div className="flex-shrink-0">
          <div className="flex justify-center pt-2 pb-0">
            <div className="w-9 h-1 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center px-4 py-3 border-b border-white/[0.06]">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300
                         active:scale-95 transition-all duration-150 text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none"
                stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l-7 7 7 7" />
              </svg>
              Volver al mapa
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          <div className="p-4">
            <PublicPointCard
              point={point}
              distance={distance}
              isSelected
              onSelect={() => {}}
              onActivate={onActivate}
              isActivating={isActivating}
              accessMessage={accessMessage}
              accessFallbackUrl={accessFallbackUrl}
              routeStatus={routeStatus}
              walkingDistanceMeters={walkingDistanceMeters}
              walkingDurationSeconds={walkingDurationSeconds}
              address={address}
              onStartRoute={onStartRoute ? handleStartRoute : undefined}
            />
          </div>
        </div>

      </div>
    </div>

    <Modal
      open={showRouteWarning}
      title="Contenido no disponible"
      description="Puedes dirigirte al lugar, pero actualmente no podrás acceder al contenido."
      confirmLabel="Ir de todas formas"
      cancelLabel="Cancelar"
      onConfirm={() => { setShowRouteWarning(false); onStartRoute?.() }}
      onCancel={() => setShowRouteWarning(false)}
    />
    </>
  )
}
