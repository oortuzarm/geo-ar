import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Reset every possible scroll container.
//
// Why all three:
//   window.scrollTo       → resets document.documentElement (standards mode)
//   documentElement.scrollTop → explicit, covers Chrome mobile edge cases
//   body.scrollTop        → fixes the CSS-induced body scroll container
//     (overflow-x:hidden on html+body forces overflow-y:auto, making body
//      the real scroll container when height:100% constrains both elements)
function resetScroll() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // Take ownership of scroll restoration so the browser never fires its own.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    // Synchronous reset — fires before the browser paints.
    resetScroll()

    // rAF reset — iOS Safari and some Android browsers fire their own async
    // scroll restoration after useLayoutEffect. Repeating inside rAF ensures
    // we override it immediately before the next frame is painted.
    const id = requestAnimationFrame(resetScroll)
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return null
}
