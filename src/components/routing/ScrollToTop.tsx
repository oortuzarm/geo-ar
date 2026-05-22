import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  // Disable browser-native scroll restoration so it never races with our own reset.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    // CSS rule: when overflow-x is 'hidden', overflow-y computes to 'auto'.
    // With html+body at height:100%, content on public pages overflows *body*,
    // making document.body the real scroll container — not document.documentElement.
    // window.scrollTo only resets documentElement; we must also reset body directly.
    window.scrollTo(0, 0)
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
