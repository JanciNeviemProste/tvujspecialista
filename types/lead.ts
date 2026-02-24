export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed_won' | 'closed_lost'

export interface Lead {
  id: string
  specialistId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  status: LeadStatus
  notes: string[]
  gdprConsent: boolean
  createdAt: Date
  updatedAt: Date
  events?: LeadEvent[]
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
  customerEmail: string
  customerPhone: string
  message: string
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
  stats: {
    new: number
    contacted: number
    qualified: number
    closedWon: number
    closedLost: number
  }
}
