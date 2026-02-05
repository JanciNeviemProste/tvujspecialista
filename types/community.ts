export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: EventType;
  format: EventFormat;
  category: EventCategory;
  bannerImage: string;
  startDate: string;
  endDate: string;
  timezone: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  meetingLink?: string;
  meetingPassword?: string;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  maxAttendees?: number;
  attendeeCount: number;
  price: number;
  currency: string;
  status: EventStatus;
  published: boolean;
  featured: boolean;
  tags: string[];
  rsvps?: RSVP[];
  createdAt: string;
  updatedAt: string;
}

export enum EventType {
  WORKSHOP = 'workshop',
  NETWORKING = 'networking',
  CONFERENCE = 'conference',
  WEBINAR = 'webinar',
  MEETUP = 'meetup',
}

export enum EventFormat {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum EventCategory {
  REAL_ESTATE = 'real_estate',
  FINANCIAL = 'financial',
  BOTH = 'both',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  status: RSVPStatus;
  registeredAt: string;
  confirmedAt?: string;
  attendedAt?: string;
  cancelledAt?: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  event?: Event;
}

export enum RSVPStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  NONE = 'none',
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export interface EventFilters {
  type?: EventType;
  format?: EventFormat;
  category?: EventCategory;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}
