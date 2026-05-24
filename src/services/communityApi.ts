import { apiFetch } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''

export interface CommunityPoint {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface CommunityProject {
  id: string
  title: string
  description?: string
  coverImage?: string
  publicUrl: string
  pointsCount: number
  points: CommunityPoint[]
}

export async function getCommunityProjects(): Promise<CommunityProject[]> {
  const raw = await apiFetch<Record<string, unknown>[]>(`${BASE}/api/community/projects`)
  return raw.map((p) => ({
    id:          p.id as string,
    title:       (p.title ?? '') as string,
    description: (p.description ?? undefined) as string | undefined,
    coverImage:  ((p.coverImage ?? p.cover_image) ?? undefined) as string | undefined,
    publicUrl:   (p.publicUrl ?? p.public_url ?? '') as string,
    pointsCount: (p.pointsCount ?? p.points_count ?? 0) as number,
    points:      Array.isArray(p.points) ? (p.points as CommunityPoint[]) : [],
  }))
}
