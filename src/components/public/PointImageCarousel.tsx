import { useRef, useState } from 'react'

interface Props {
  images: string[]
  className?: string
}

export default function PointImageCarousel({ images, className = '' }: Props) {
  const [current, setCurrent]     = useState(0)
  const touchStartX               = useRef<number | null>(null)

  if (images.length === 0) return null

  function prev() { setCurrent((c) => Math.max(0, c - 1)) }
  function next() { setCurrent((c) => Math.min(images.length - 1, c + 1)) }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    touchStartX.current = null
    if (Math.abs(delta) < 40) return
    if (delta > 0) next(); else prev()
  }

  if (images.length === 1) {
    return (
      <div className={className}>
        <img
          src={images[0]}
          alt=""
          className="w-full aspect-[4/3] object-cover block"
          loading="eager"
        />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sliding strip */}
      <div
        className="flex transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((url, i) => (
          <div key={i} className="w-full flex-shrink-0 aspect-[4/3]">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-3 right-3 pointer-events-none">
        <span className="bg-black/55 backdrop-blur-sm rounded-full px-2.5 py-1
                         text-[11px] font-semibold text-white/90 leading-none tabular-nums">
          {current + 1}/{images.length}
        </span>
      </div>

      {/* Left arrow */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          className="absolute left-2 top-1/2 -translate-y-1/2
                     w-8 h-8 md:w-9 md:h-9 rounded-full
                     flex items-center justify-center
                     bg-black/45 hover:bg-black/60 backdrop-blur-sm
                     border border-white/10
                     shadow-[0_2px_8px_rgba(0,0,0,0.35)]
                     text-white active:scale-90
                     transition-all duration-150"
          aria-label="Imagen anterior"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4l-7 7 7 7" />
          </svg>
        </button>
      )}

      {/* Right arrow */}
      {current < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     w-8 h-8 md:w-9 md:h-9 rounded-full
                     flex items-center justify-center
                     bg-black/45 hover:bg-black/60 backdrop-blur-sm
                     border border-white/10
                     shadow-[0_2px_8px_rgba(0,0,0,0.35)]
                     text-white active:scale-90
                     transition-all duration-150"
          aria-label="Imagen siguiente"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none"
            stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 4l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
        {images.map((_, i) => (
          <span
            key={i}
            className={[
              'rounded-full transition-all duration-200 shadow-sm',
              i === current
                ? 'w-4 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/50',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
