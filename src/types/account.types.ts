export interface UserProfile {
  id:        string
  email:     string
  firstName: string | null
  lastName:  string | null
  company:   string | null
  jobTitle:  string | null
  country:   string | null
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?:  string
  company?:   string
  jobTitle?:  string
  country?:   string
}
