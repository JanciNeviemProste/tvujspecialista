/**
 * Mock data for DealTimeline component tests
 *
 * This file contains reusable mock data generators and fixtures
 * for testing the DealTimeline component.
 */

import { DealEvent } from '@/types/deals';

/**
 * Creates a mock DealEvent with default or custom values
 *
 * @param type - Event type (created, status_changed, note_added, email_sent, etc.)
 * @param description - Event description text
 * @param createdAt - ISO date string (defaults to 2024-01-15T10:00:00Z)
 * @param metadata - Optional metadata object
 * @returns DealEvent object
 */
export const createMockEvent = (
  type: string,
  description: string,
  createdAt: string = '2024-01-15T10:00:00Z',
  metadata?: any
): DealEvent => ({
  id: `event-${Math.random().toString(36).substr(2, 9)}`,
  dealId: 'deal-123',
  type,
  description,
  metadata,
  createdAt,
});

/**
 * Mock events for different event types
 */
export const mockEventTypes = {
  created: createMockEvent(
    'created',
    'Deal created',
    '2024-01-15T10:00:00Z'
  ),

  statusChanged: createMockEvent(
    'status_changed',
    'Status changed from NEW to CONTACTED',
    '2024-01-15T11:00:00Z',
    {
      oldStatus: 'NEW',
      newStatus: 'CONTACTED',
    }
  ),

  noteAdded: createMockEvent(
    'note_added',
    'Note: Customer interested in premium package',
    '2024-01-15T12:00:00Z',
    {
      note: 'Customer interested in premium package',
    }
  ),

  emailSent: createMockEvent(
    'email_sent',
    'Email sent to customer',
    '2024-01-15T13:00:00Z',
    {
      emailType: 'follow_up',
    }
  ),

  valueChanged: createMockEvent(
    'value_changed',
    'Deal value updated to 5000 CZK',
    '2024-01-15T14:00:00Z',
    {
      oldValue: 3000,
      newValue: 5000,
    }
  ),

  unknown: createMockEvent(
    'unknown_event_type',
    'Unknown event occurred',
    '2024-01-15T15:00:00Z'
  ),
};

/**
 * Complete timeline with all event types (sorted newest first)
 */
export const mockCompleteTimeline: DealEvent[] = [
  mockEventTypes.emailSent,
  mockEventTypes.noteAdded,
  mockEventTypes.statusChanged,
  mockEventTypes.created,
];

/**
 * Timeline with multiple status changes
 */
export const mockMultipleStatusChanges: DealEvent[] = [
  createMockEvent(
    'status_changed',
    'Status changed from IN_PROGRESS to CLOSED_WON',
    '2024-01-15T16:00:00Z',
    { oldStatus: 'IN_PROGRESS', newStatus: 'CLOSED_WON' }
  ),
  createMockEvent(
    'status_changed',
    'Status changed from QUALIFIED to IN_PROGRESS',
    '2024-01-15T15:00:00Z',
    { oldStatus: 'QUALIFIED', newStatus: 'IN_PROGRESS' }
  ),
  createMockEvent(
    'status_changed',
    'Status changed from CONTACTED to QUALIFIED',
    '2024-01-15T14:00:00Z',
    { oldStatus: 'CONTACTED', newStatus: 'QUALIFIED' }
  ),
  createMockEvent(
    'status_changed',
    'Status changed from NEW to CONTACTED',
    '2024-01-15T11:00:00Z',
    { oldStatus: 'NEW', newStatus: 'CONTACTED' }
  ),
  createMockEvent('created', 'Deal created', '2024-01-15T10:00:00Z'),
];

/**
 * Timeline with multiple notes
 */
export const mockMultipleNotes: DealEvent[] = [
  createMockEvent(
    'note_added',
    'Note: Deal closed successfully',
    '2024-01-15T16:00:00Z',
    { note: 'Deal closed successfully' }
  ),
  createMockEvent(
    'note_added',
    'Note: Sent proposal to customer',
    '2024-01-15T13:00:00Z',
    { note: 'Sent proposal to customer' }
  ),
  createMockEvent(
    'note_added',
    'Note: Customer interested in premium package',
    '2024-01-15T12:00:00Z',
    { note: 'Customer interested in premium package' }
  ),
  createMockEvent('created', 'Deal created', '2024-01-15T10:00:00Z'),
];

/**
 * Timeline with email communication
 */
export const mockEmailTimeline: DealEvent[] = [
  createMockEvent(
    'email_sent',
    'Follow-up email sent',
    '2024-01-15T15:00:00Z',
    { emailType: 'follow_up' }
  ),
  createMockEvent(
    'email_sent',
    'Proposal email sent',
    '2024-01-15T13:00:00Z',
    { emailType: 'proposal' }
  ),
  createMockEvent(
    'email_sent',
    'Welcome email sent',
    '2024-01-15T11:00:00Z',
    { emailType: 'welcome' }
  ),
  createMockEvent('created', 'Deal created', '2024-01-15T10:00:00Z'),
];

/**
 * Single event timeline
 */
export const mockSingleEvent: DealEvent[] = [
  createMockEvent('created', 'Deal created', '2024-01-15T10:00:00Z'),
];

/**
 * Empty timeline
 */
export const mockEmptyTimeline: DealEvent[] = [];

/**
 * Large timeline (for performance testing)
 */
export const createLargeTimeline = (count: number = 100): DealEvent[] => {
  const events: DealEvent[] = [];
  const eventTypes = ['created', 'status_changed', 'note_added', 'email_sent'];

  for (let i = 0; i < count; i++) {
    const type = eventTypes[i % eventTypes.length];
    const date = new Date('2024-01-15T10:00:00Z');
    date.setMinutes(date.getMinutes() + i * 10);

    events.push(
      createMockEvent(
        type,
        `Event ${i + 1}: ${type}`,
        date.toISOString(),
        { index: i }
      )
    );
  }

  return events.reverse(); // Newest first
};

/**
 * Timeline with different date formats
 */
export const mockDifferentDates: DealEvent[] = [
  createMockEvent('email_sent', 'Recent event', new Date().toISOString()),
  createMockEvent('note_added', 'Yesterday event', new Date(Date.now() - 86400000).toISOString()),
  createMockEvent('status_changed', 'Last week event', '2024-01-08T10:00:00Z'),
  createMockEvent('created', 'Last month event', '2023-12-15T10:00:00Z'),
];

/**
 * Timeline with special characters in descriptions
 */
export const mockSpecialCharacters: DealEvent[] = [
  createMockEvent(
    'note_added',
    'Note: Customer said "I\'m interested!" & wants more info',
    '2024-01-15T12:00:00Z',
    { note: 'Customer said "I\'m interested!" & wants more info' }
  ),
  createMockEvent(
    'status_changed',
    'Status: NEW → CONTACTED',
    '2024-01-15T11:00:00Z',
    { oldStatus: 'NEW', newStatus: 'CONTACTED' }
  ),
  createMockEvent('created', 'Deal created <test>', '2024-01-15T10:00:00Z'),
];

/**
 * Timeline with edge case metadata
 */
export const mockEdgeCaseMetadata: DealEvent[] = [
  createMockEvent(
    'status_changed',
    'Status changed with null oldStatus',
    '2024-01-15T11:00:00Z',
    { oldStatus: null, newStatus: 'CONTACTED' }
  ),
  createMockEvent(
    'note_added',
    'Note with empty string',
    '2024-01-15T12:00:00Z',
    { note: '' }
  ),
  createMockEvent(
    'email_sent',
    'Email with undefined type',
    '2024-01-15T13:00:00Z',
    { emailType: undefined }
  ),
  createMockEvent(
    'created',
    'Event with no metadata',
    '2024-01-15T10:00:00Z'
  ),
];

/**
 * Export all mock data as a single object for easy access
 */
export const mockData = {
  single: mockSingleEvent,
  empty: mockEmptyTimeline,
  complete: mockCompleteTimeline,
  multipleStatusChanges: mockMultipleStatusChanges,
  multipleNotes: mockMultipleNotes,
  emails: mockEmailTimeline,
  differentDates: mockDifferentDates,
  specialCharacters: mockSpecialCharacters,
  edgeCases: mockEdgeCaseMetadata,
  createLarge: createLargeTimeline,
  types: mockEventTypes,
};
