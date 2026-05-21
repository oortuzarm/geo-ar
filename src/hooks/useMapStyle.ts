import { useState } from 'react'
import type { MapStyleId } from '../config/mapStyles'

const STORAGE_KEY = 'ubyca_map_style'

export function useMapStyle() {
  const [styleId, setStyleId] = useState<MapStyleId>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'satellite' ? 'satellite' : 'streets'
  })

  function setStyle(id: MapStyleId) {
    setStyleId(id)
    localStorage.setItem(STORAGE_KEY, id)
  }

  return { styleId, setStyle }
}
