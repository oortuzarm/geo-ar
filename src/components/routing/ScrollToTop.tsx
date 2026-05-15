import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the window to the top on every client-side navigation.
 * Uses useLayoutEffect so the scroll happens before the browser paints,
 * preventing the brief flash of the previous scroll position.
 *
 * Coexists with ScrollRestoration: for back/forward navigation,
 * ScrollRestoration fires after this and restores the saved position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
