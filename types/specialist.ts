export type SubscriptionTier = 'basic' | 'pro' | 'premium'

export type SpecialistCategory = 'Finanční poradce' | 'Realitní makléř'

export interface Specialist {
  id: string
  slug: string
  name: string
  email: string
  phone: string
  photo: string
  verified: boolean
  topSpecialist: boolean
  category: SpecialistCategory
  location: string
  bio: string
  yearsExperience: number
  hourlyRate: number
  rating: number
  reviewsCount: number
  services: string[]
  certifications: string[]
  education: string
  website?: string
  linkedin?: string
  facebook?: string
  instagram?: string
  videoUrl?: string
  availability: string[]
  subscriptionTier: SubscriptionTier
  createdAt: Date
  updatedAt: Date
}

export interface SpecialistFilters {
  category?: string
  location?: string
  minRating?: number
  maxPrice?: number
  verified?: boolean
  search?: string
  page?: number
  limit?: number
  sortBy?: 'rating' | 'price' | 'reviews' | 'newest'
}

export interface SpecialistListResponse {
  specialists: Specialist[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
