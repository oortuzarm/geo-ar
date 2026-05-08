import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  content: string
}

export function MetricTooltip({ content }: Props) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const iconRef = useRef<HTMLSpanElement>(null)
  const coords  = useRef({ top: 0, left: 0 })

  function computeCoords() {
    if (!iconRef.current) return
    const r = iconRef.current.getBoundingClientRect()
    coords.current = { top: r.bottom + 8, left: r.left + r.width / 2 }
  }

  const show = useCallback(() => {
    computeCoords()
    setMounted(true)
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
    setTimeout(() => setMounted(false), 150)
  }, [])

  // Close on outside interaction (mousedown + touchstart for mobile)
  useEffect(() => {
    if (!visible) return
    function onOutside(e: MouseEvent | TouchEvent) {
      if (!iconRef.current?.contains(e.target as Node)) hide()
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('touchstart', onOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('touchstart', onOutside)
    }
  }, [visible, hide])

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation() // prevent tab switch
    visible ? hide() : show()
  }

  return (
    <>
      <span
        ref={iconRef}
        aria-label="Más información"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={handleClick}
        className="inline-flex items-center justify-center ml-1.5 w-3 h-3 shrink-0 text-gray-600 hover:text-gray-400 transition-colors duration-150 cursor-pointer"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>

      {mounted && createPortal(
        <div
          style={{
            position:   'fixed',
            top:        coords.current.top,
            left:       coords.current.left,
            transform:  `translateX(-50%) scale(${visible ? 1 : 0.95})`,
            opacity:    visible ? 1 : 0,
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            zIndex:     9999,
            pointerEvents: 'none',
          }}
          className="w-[220px] bg-gray-900 border border-white/[0.08] text-gray-300 text-[11px] leading-[1.5] px-3 py-2.5 rounded-lg shadow-xl shadow-black/50"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
}
