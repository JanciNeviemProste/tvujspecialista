export type UserRole = 'customer' | 'provider' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  phone?: string
  verified: boolean
  twoFactorEnabled?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegistrationData {
  // Step 2
  name: string
  email: string
  phone: string
  password: string
  ico?: string
  companyName?: string

  // Step 3
  category: string
  yearsExperience: number
  certifications: string[]
  education: string

  // Step 4
  photo: File
  video?: File

  // Step 5
  website?: string
  linkedin?: string
  facebook?: string
  instagram?: string

  // Step 6
  bio: string
  services: string[]
  hourlyRate: number
  availability: string[]

  // Step 7
  acceptTerms: boolean
  acceptPrivacy: boolean
}
