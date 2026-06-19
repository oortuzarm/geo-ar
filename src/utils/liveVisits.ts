import { getSessionId } from '../lib/session'

export function getLiveVisitSessionId(): string {
  return getSessionId()
}

export function intensityFromCount(count: number): 'low' | 'medium' | 'high' {
  if (count >= 10) return 'high'
  if (count >= 4)  return 'medium'
  return 'low'
}
