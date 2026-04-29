import { useEffect, useRef } from 'react'
import { useGeoStore } from '../store/geoStore'

export function useGeolocation(active = true) {
  const { setUserLocation } = useGeoStore()
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    if (!navigator.geolocation) {
      setUserLocation(null, 'unavailable')
      return
    }

    setUserLocation(null, 'requesting')

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation(
          {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          'active',
        )
      },
      () => {
        setUserLocation(null, 'denied')
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [active, setUserLocation])
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  })
}
