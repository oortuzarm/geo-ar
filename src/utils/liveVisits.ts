const SESSION_KEY = 'lv_session_id'

export function getLiveVisitSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, id)
  return id
}

export function intensityFromCount(count: number): 'low' | 'medium' | 'high' {
  if (count >= 10) return 'high'
  if (count >= 4)  return 'medium'
  return 'low'
}
