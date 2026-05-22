import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API:       object
    Tawk_LoadStart: Date
  }
}

const TAWK_SCRIPT_ID  = 'tawk-script'
const TAWK_WIDGET_URL = 'https://embed.tawk.to/6a10a1d7195da31c37c6ca0c/1jp8fgcu8'

export default function TawkProvider() {
  useEffect(() => {
    if (document.getElementById(TAWK_SCRIPT_ID)) return

    window.Tawk_API       = window.Tawk_API       || {}
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date()

    const script        = document.createElement('script')
    script.id           = TAWK_SCRIPT_ID
    script.src          = TAWK_WIDGET_URL
    script.async        = true
    script.charset      = 'UTF-8'
    script.crossOrigin  = '*'

    document.head.appendChild(script)
  }, [])

  return null
}
