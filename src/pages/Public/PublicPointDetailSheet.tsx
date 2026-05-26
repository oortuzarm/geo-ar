import { useState, useEffect } from 'react'
import PublicPointCard from './PublicPointCard'
import PointImageCarousel from '../../components/public/PointImageCarousel'
import type { GeoPoint } from '../../types'
import type { RouteStatus } from './PublicPointCard'
import { getPointGalleryImages } from '../../lib/pointImageUtils'

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
  isEmbed?:               boolean
  pointCreatedAt?:        string
}

export default function PublicPointDetailSheet({
  point, distance, onClose, onActivate,
  isActivating, accessMessage, accessFallbackUrl,
  routeStatus, walkingDistanceMeters, walkingDurationSeconds, address,
  isEmbed = false, pointCreatedAt,
}: PublicPointDetailSheetProps) {
  const galleryImages = getPointGalleryImages(point)
  const hasGallery    = galleryImages.length > 0

  // Slide-up on mount: start at 0, animate to final height after first paint.
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      className={`${isEmbed ? '' : 'md:hidden '}absolute inset-x-0 bottom-0 z-[1100]`}
      style={{ height: visible ? '72dvh' : '0dvh', transition: 'height 0.45s cubic-bezier(0.32,0.72,0,1)' }}
    >
      <div className="h-full flex flex-col rounded-t-[28px] overflow-hidden
                      bg-white
                      border-t border-gray-200
                      shadow-[0_-4px_24px_rgba(0,0,0,0.1)]">

        {/* Handle + back */}
        <div className="flex-shrink-0">
          <div className="flex justify-center pt-2 pb-0">
            <div className="w-9 h-1 rounded-full bg-gray-300" />
          </div>
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-brand-600 hover:text-brand-500
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
          {/* Carousel — same horizontal margins as the card below */}
          {hasGallery && (
            <div className="px-4 pt-4">
              <PointImageCarousel
                images={galleryImages}
                className="rounded-2xl overflow-hidden"
              />
            </div>
          )}

          {/* Card — px-4 aligns with carousel; pt shrinks when carousel is above */}
          <div className={`px-4 pb-4 ${hasGallery ? 'pt-3' : 'pt-4'}`}>
            <PublicPointCard
              point={point}
              distance={distance}
              isSelected
              isDetail
              hideImage={hasGallery}
              onSelect={() => {}}
              onActivate={onActivate}
              isActivating={isActivating}
              accessMessage={accessMessage}
              accessFallbackUrl={accessFallbackUrl}
              routeStatus={routeStatus}
              walkingDistanceMeters={walkingDistanceMeters}
              walkingDurationSeconds={walkingDurationSeconds}
              address={address}
              pointCreatedAt={pointCreatedAt}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
