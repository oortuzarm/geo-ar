export interface ApiCredential {
  id: string
  name: string
  key: string
  scopes: string[]
  active: boolean
  lastUsedAt: string | null
  createdAt: string
}

export interface ApiCredentialWithSecret extends ApiCredential {
  secret: string
}

export interface CreateCredentialPayload {
  name: string
  scopes: string[]
}

export interface UpdateCredentialPayload {
  active: boolean
}

export interface RegenerateSecretResponse {
  id: string
  secret: string
}
