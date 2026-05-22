import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // Take ownership of scroll restoration so the browser never restores
  // a stale position on back/forward navigation before React can respond.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // useLayoutEffect fires synchronously before the browser paints,
  // so the page is never seen at the previous scroll position.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
