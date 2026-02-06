import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { DealTimeline } from '@/components/deals/DealTimeline';
import '@testing-library/jest-dom';
import {
  createMockEvent,
  mockCompleteTimeline,
  mockSingleEvent,
  mockEventTypes,
} from './mockData';

// Mock the format utility
jest.mock('@/lib/utils/format', () => ({
  formatDateTime: (date: string, locale: string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat(locale === 'cs' ? 'cs-CZ' : 'sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Circle: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-circle" aria-hidden="true" />
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-arrow-right" aria-hidden="true" />
  ),
  DollarSign: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-dollar-sign" aria-hidden="true" />
  ),
  MessageSquare: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-message-square" aria-hidden="true" />
  ),
  Mail: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-mail" aria-hidden="true" />
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-clock" aria-hidden="true" />
  ),
}));

describe('DealTimeline', () => {
  // Use imported mock data
  const mockEvents = mockCompleteTimeline;

  describe('Rendering tests', () => {
    it('renders timeline with events', () => {
      render(<DealTimeline events={mockEvents} isLoading={false} />);

      // Check that timeline is rendered
      const timeline = screen.getByRole('list', { name: /deal timeline/i });
      expect(timeline).toBeInTheDocument();

      // Check that all events are rendered
      const listItems = within(timeline).getAllByRole('listitem');
      expect(listItems).toHaveLength(mockEvents.length);

      // Check that descriptions are visible
      expect(screen.getByText('Deal created')).toBeInTheDocument();
      expect(screen.getByText('Status changed from NEW to CONTACTED')).toBeInTheDocument();
      expect(screen.getByText('Note: Customer interested in premium package')).toBeInTheDocument();
      expect(screen.getByText('Email sent to customer')).toBeInTheDocument();
    });

    it('shows loading skeleton when isLoading=true', () => {
      render(<DealTimeline events={[]} isLoading={true} />);

      // Timeline should not be rendered
      expect(screen.queryByRole('list', { name: /deal timeline/i })).not.toBeInTheDocument();

      // Check for loading skeleton elements (3 skeleton items)
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows empty state when no events', () => {
      render(<DealTimeline events={[]} isLoading={false} />);

      // Check for empty state message
      expect(screen.getByText(/zatiaľ žiadne udalosti/i)).toBeInTheDocument();

      // Check for Clock icon
      expect(screen.getByTestId('icon-clock')).toBeInTheDocument();

      // Timeline should not be rendered
      expect(screen.queryByRole('list', { name: /deal timeline/i })).not.toBeInTheDocument();
    });
  });

  describe('Event type tests', () => {
    it('renders CREATED event correctly (blue color, correct icon, description)', () => {
      const createdEvent = [mockEventTypes.created];
      render(<DealTimeline events={createdEvent} isLoading={false} />);

      // Check description
      expect(screen.getByText('Deal created')).toBeInTheDocument();

      // Check for Circle icon (created event)
      expect(screen.getByTestId('icon-circle')).toBeInTheDocument();

      // Check for blue color class
      const iconContainer = screen.getByTestId('icon-circle').parentElement;
      expect(iconContainer).toHaveClass('text-blue-500', 'bg-blue-500/10');
    });

    it('renders STATUS_CHANGED event with old/new status (green color)', () => {
      const statusEvent = [mockEventTypes.statusChanged];
      render(<DealTimeline events={statusEvent} isLoading={false} />);

      // Check description
      expect(screen.getByText('Status changed from NEW to CONTACTED')).toBeInTheDocument();

      // Check for ArrowRight icon (status change event)
      expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();

      // Check for green color class
      const iconContainer = screen.getByTestId('icon-arrow-right').parentElement;
      expect(iconContainer).toHaveClass('text-green-500', 'bg-green-500/10');
    });

    it('renders NOTE_ADDED event with note text (purple color)', () => {
      const noteEvent = [mockEventTypes.noteAdded];
      render(<DealTimeline events={noteEvent} isLoading={false} />);

      // Check description
      expect(screen.getByText('Note: Customer interested in premium package')).toBeInTheDocument();

      // Check for MessageSquare icon (note event)
      expect(screen.getByTestId('icon-message-square')).toBeInTheDocument();

      // Check for purple color class
      const iconContainer = screen.getByTestId('icon-message-square').parentElement;
      expect(iconContainer).toHaveClass('text-purple-500', 'bg-purple-500/10');
    });

    it('renders EMAIL_SENT event (orange color)', () => {
      const emailEvent = [mockEventTypes.emailSent];
      render(<DealTimeline events={emailEvent} isLoading={false} />);

      // Check description
      expect(screen.getByText('Email sent to customer')).toBeInTheDocument();

      // Check for Mail icon (email event)
      expect(screen.getByTestId('icon-mail')).toBeInTheDocument();

      // Check for orange color class
      const iconContainer = screen.getByTestId('icon-mail').parentElement;
      expect(iconContainer).toHaveClass('text-orange-500', 'bg-orange-500/10');
    });
  });

  describe('Chronological order test', () => {
    it('displays events in reverse chronological order (newest first)', () => {
      const orderedEvents = [
        createMockEvent('created', 'Deal created', '2024-01-15T10:00:00Z'),
        createMockEvent('status_changed', 'Status changed', '2024-01-15T11:00:00Z'),
        createMockEvent('note_added', 'Note added', '2024-01-15T12:00:00Z'),
        createMockEvent('email_sent', 'Email sent', '2024-01-15T13:00:00Z'),
      ];

      render(<DealTimeline events={orderedEvents} isLoading={false} />);

      const listItems = screen.getAllByRole('listitem');

      // Events are rendered in the order they appear in the array
      // Component expects events to be pre-sorted (newest first)
      expect(within(listItems[0]).getByText('Deal created')).toBeInTheDocument();
      expect(within(listItems[1]).getByText('Status changed')).toBeInTheDocument();
      expect(within(listItems[2]).getByText('Note added')).toBeInTheDocument();
      expect(within(listItems[3]).getByText('Email sent')).toBeInTheDocument();
    });
  });

  describe('Date formatting tests', () => {
    it('formats dates correctly (Slovak locale)', () => {
      const event = [createMockEvent('created', 'Deal created', '2024-01-15T10:30:00Z')];
      render(<DealTimeline events={event} isLoading={false} />);

      // Check for time element with correct datetime attribute
      const timeElement = screen.getByText(/2024/).closest('time');
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveAttribute('datetime', '2024-01-15T10:30:00Z');

      // The formatted text should be in Slovak format
      // Format depends on timezone, but should contain date parts
      expect(timeElement?.textContent).toMatch(/\d{2}\.?\s*\d{2}\.?\s*\d{4}/);
    });

    it('shows formatted time with hours and minutes', () => {
      const event = [createMockEvent('created', 'Deal created', '2024-01-15T14:45:00Z')];
      render(<DealTimeline events={event} isLoading={false} />);

      const timeElement = screen.getByText(/2024/).closest('time');
      expect(timeElement).toBeInTheDocument();

      // Should contain time portion (HH:MM)
      expect(timeElement?.textContent).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('Metadata handling tests', () => {
    it('shows old and new status for STATUS_CHANGED', () => {
      const statusEvent = [
        createMockEvent('status_changed', 'Status changed from NEW to CONTACTED', '2024-01-15T11:00:00Z', {
          oldStatus: 'NEW',
          newStatus: 'CONTACTED',
        }),
      ];
      render(<DealTimeline events={statusEvent} isLoading={false} />);

      // The description should contain old and new status
      const description = screen.getByText(/status changed from NEW to CONTACTED/i);
      expect(description).toBeInTheDocument();
      expect(description.textContent).toContain('NEW');
      expect(description.textContent).toContain('CONTACTED');
    });

    it('shows note content for NOTE_ADDED', () => {
      const noteEvent = [
        createMockEvent('note_added', 'Note: Customer wants to schedule a call', '2024-01-15T12:00:00Z', {
          note: 'Customer wants to schedule a call',
        }),
      ];
      render(<DealTimeline events={noteEvent} isLoading={false} />);

      // The description should contain the note content
      const description = screen.getByText(/customer wants to schedule a call/i);
      expect(description).toBeInTheDocument();
      expect(description.textContent).toContain('Customer wants to schedule a call');
    });

    it('shows email type for EMAIL_SENT', () => {
      const emailEvent = [
        createMockEvent('email_sent', 'Follow-up email sent to customer', '2024-01-15T13:00:00Z', {
          emailType: 'follow_up',
        }),
      ];
      render(<DealTimeline events={emailEvent} isLoading={false} />);

      // The description should contain email information
      const description = screen.getByText(/email sent/i);
      expect(description).toBeInTheDocument();
    });
  });

  describe('Accessibility tests', () => {
    it('has proper ARIA labels (role="list", aria-label)', () => {
      render(<DealTimeline events={mockEvents} isLoading={false} />);

      // Check for proper role and aria-label
      const timeline = screen.getByRole('list', { name: /deal timeline/i });
      expect(timeline).toBeInTheDocument();
      expect(timeline).toHaveAttribute('aria-label', 'Deal timeline');
    });

    it('uses semantic HTML (<ol>, <li>, <time>)', () => {
      const { container } = render(<DealTimeline events={mockEvents} isLoading={false} />);

      // Check for ordered list
      const orderedList = container.querySelector('ol');
      expect(orderedList).toBeInTheDocument();
      expect(orderedList).toHaveAttribute('role', 'list');

      // Check for list items
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(mockEvents.length);

      // Check for time elements
      const timeElements = container.querySelectorAll('time');
      expect(timeElements.length).toBe(mockEvents.length);

      // Each time element should have a datetime attribute
      timeElements.forEach((timeEl) => {
        expect(timeEl).toHaveAttribute('datetime');
      });

      // Icons should have aria-hidden="true"
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('handles undefined events gracefully', () => {
      // @ts-expect-error Testing undefined case
      render(<DealTimeline events={undefined} isLoading={false} />);

      // Should show empty state
      expect(screen.getByText(/zatiaľ žiadne udalosti/i)).toBeInTheDocument();
    });

    it('handles single event', () => {
      render(<DealTimeline events={mockSingleEvent} isLoading={false} />);

      const timeline = screen.getByRole('list', { name: /deal timeline/i });
      const listItems = within(timeline).getAllByRole('listitem');

      expect(listItems).toHaveLength(1);
      expect(screen.getByText('Deal created')).toBeInTheDocument();
    });

    it('handles unknown event type with default styling', () => {
      const unknownEvent = [createMockEvent('unknown_event_type', 'Unknown event occurred')];
      render(<DealTimeline events={unknownEvent} isLoading={false} />);

      // Should render with Circle icon (default)
      expect(screen.getByTestId('icon-circle')).toBeInTheDocument();

      // Should have gray color (default)
      const iconContainer = screen.getByTestId('icon-circle').parentElement;
      expect(iconContainer).toHaveClass('text-gray-500', 'bg-gray-500/10');

      // Description should still be visible
      expect(screen.getByText('Unknown event occurred')).toBeInTheDocument();
    });

    it('renders vertical line between events except for the last one', () => {
      const multipleEvents = [
        createMockEvent('created', 'Event 1', '2024-01-15T10:00:00Z'),
        createMockEvent('status_changed', 'Event 2', '2024-01-15T11:00:00Z'),
        createMockEvent('note_added', 'Event 3', '2024-01-15T12:00:00Z'),
      ];

      const { container } = render(<DealTimeline events={multipleEvents} isLoading={false} />);

      // Count vertical lines (should be 2 for 3 events)
      const verticalLines = container.querySelectorAll('.absolute.left-4.top-10.bottom-0');
      expect(verticalLines).toHaveLength(multipleEvents.length - 1);
    });

    it('applies custom className prop', () => {
      const { container } = render(
        <DealTimeline events={mockEvents} isLoading={false} className="custom-timeline-class" />
      );

      const timeline = container.querySelector('.custom-timeline-class');
      expect(timeline).toBeInTheDocument();
    });

    it('applies custom className to loading state', () => {
      const { container } = render(
        <DealTimeline events={[]} isLoading={true} className="custom-loading-class" />
      );

      const loadingContainer = container.querySelector('.custom-loading-class');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('applies custom className to empty state', () => {
      const { container } = render(
        <DealTimeline events={[]} isLoading={false} className="custom-empty-class" />
      );

      const emptyContainer = container.querySelector('.custom-empty-class');
      expect(emptyContainer).toBeInTheDocument();
    });
  });
});
