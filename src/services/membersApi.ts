import { apiFetch } from '../lib/apiFetch'

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
const url  = (path: string) => `${BASE}${path}`

export type OrgRole        = 'owner' | 'editor' | 'viewer'
export type InvitationRole = 'editor' | 'viewer'

export interface Member {
  id:       string
  name:     string | null
  email:    string
  role:     OrgRole
  joinedAt: string
}

export interface Invitation {
  id:        string
  email:     string
  role:      InvitationRole
  status:    'pending' | 'accepted' | 'expired'
  createdAt: string
  expiresAt: string
}

export interface MembersResponse {
  members:      Member[]
  invitations:  Invitation[]
  organization?: { name: string }
}

export interface InvitationTokenInfo {
  email:        string
  role:         InvitationRole
  organization: { name: string }
  expired:      boolean
  accepted:     boolean
}

export function getMembers(): Promise<MembersResponse> {
  return apiFetch(url('/api/members'))
}

export function updateMemberRole(id: string, role: 'editor' | 'viewer'): Promise<Member> {
  return apiFetch(url(`/api/members/${id}`), {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

export function removeMember(id: string): Promise<void> {
  return apiFetch(url(`/api/members/${id}`), { method: 'DELETE' })
}

export function sendInvitation(email: string, role: InvitationRole): Promise<Invitation> {
  return apiFetch(url('/api/invitations'), {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  })
}

export function resendInvitation(id: string): Promise<void> {
  return apiFetch(url(`/api/invitations/${id}/resend`), { method: 'POST' })
}

export function cancelInvitation(id: string): Promise<void> {
  return apiFetch(url(`/api/invitations/${id}`), { method: 'DELETE' })
}

export function getInvitationInfo(token: string): Promise<InvitationTokenInfo> {
  return apiFetch(url(`/api/invitations/accept/${token}`))
}

export function acceptInvitation(params: {
  token:                 string
  password:              string
  password_confirmation: string
  name?:                 string
}): Promise<{ user?: { id: string; email: string; role: string } }> {
  return apiFetch(url('/api/invitations/accept'), {
    method: 'POST',
    body: JSON.stringify(params),
  })
}
