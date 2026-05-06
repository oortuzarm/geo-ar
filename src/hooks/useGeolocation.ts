import { useEffect, useRef } from 'react'
import { useGeoStore } from '../store/geoStore'
import type { LocationStatus, UserLocation } from '../types'

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
            latitude:  pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy:  pos.coords.accuracy,
          },
          'active',
        )
      },
      (err) => {
        // code 1 = PERMISSION_DENIED; 2 = POSITION_UNAVAILABLE; 3 = TIMEOUT
        const status: LocationStatus = err.code === 1 ? 'denied' : 'unavailable'
        setUserLocation(null, status)
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

/**
 * Imperatively request the user's location once.
 * Safe to call after denial — may re-trigger the browser prompt on some platforms.
 * On PERMISSION_DENIED sets status to 'denied'; on other errors sets 'unavailable'.
 */
export function requestLocation(
  setUserLocation: (loc: UserLocation | null, status: LocationStatus) => void,
): void {
  if (!navigator.geolocation) {
    setUserLocation(null, 'unavailable')
    return
  }
  setUserLocation(null, 'requesting')
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation(
        {
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        },
        'active',
      )
    },
    (err) => {
      const status: LocationStatus = err.code === 1 ? 'denied' : 'unavailable'
      setUserLocation(null, status)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  )
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
