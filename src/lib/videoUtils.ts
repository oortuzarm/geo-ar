export type VideoType = 'youtube' | 'mp4'

export function detectVideoType(url: string): VideoType | null {
  const trimmed = url.trim().toLowerCase()
  if (!trimmed) return null
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) return 'youtube'
  if (trimmed.endsWith('.mp4') || trimmed.includes('.mp4?') || trimmed.includes('.mp4#')) return 'mp4'
  return null
}

export function extractYouTubeId(url: string): string | null {
  const watchMatch  = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]
  const shortMatch  = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]
  const embedMatch  = url.match(/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]
  return null
}
