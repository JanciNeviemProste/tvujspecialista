export interface Review {
  id: string
  specialistId: string
  leadId?: string
  customerName: string
  rating: number
  text: string
  verified: boolean
  verifiedEmail?: boolean
  verifiedSms?: boolean
  published: boolean
  publishedAt?: Date
  createdAt: Date
  response?: {
    text: string
    createdAt: Date
  }
}

export interface ReviewToken {
  token: string
  leadId: string
  expiresAt: Date
  used: boolean
  usedAt?: Date
}

export interface ReviewSubmission {
  token: string
  rating: number
  text: string
}
