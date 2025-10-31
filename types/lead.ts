export type LeadStatus = 'new' | 'contacted' | 'scheduled' | 'closed' | 'cancelled'

export interface Lead {
  id: string
  specialistId: string
  customerName: string
  email: string
  phone: string
  message: string
  preferredDate?: Date
  status: LeadStatus
  createdAt: Date
  updatedAt: Date
  events: LeadEvent[]
  notes?: string
}

export interface LeadEvent {
  id: string
  leadId: string
  type: 'created' | 'status_change' | 'note_added' | 'contacted'
  description: string
  createdBy?: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface LeadFormData {
  specialistId: string
  customerName: string
  email: string
  phone: string
  message: string
  preferredDate?: Date
  gdprConsent: boolean
}

export interface LeadFilters {
  status?: LeadStatus
  dateFrom?: Date
  dateTo?: Date
  search?: string
  page?: number
  limit?: number
}

export interface LeadListResponse {
  leads: Lead[]
  total: number
  page: number
  limit: number
  stats: {
    new: number
    contacted: number
    scheduled: number
    closed: number
  }
}
