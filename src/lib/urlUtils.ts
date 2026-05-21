export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function isValidUrl(value: string): boolean {
  if (!value) return true // empty is not invalid
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
