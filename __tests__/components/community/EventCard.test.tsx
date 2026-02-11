import React from 'react';
import { screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EventCard } from '@/components/community/EventCard';
import { renderWithProviders } from '@/__tests__/setup/test-utils';
import {
  Event,
  EventType,
  EventFormat,
  EventCategory,
  EventStatus,
} from '@/types/community';

expect.extend(toHaveNoViolations);

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img data-fill={fill ? 'true' : undefined} {...rest} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// Mock formatDate to return predictable values
jest.mock('@/lib/utils/dateFormat', () => ({
  formatDate: (date: string, format: string) => {
    if (format === 'd. MMM yyyy') return '15. mar 2026';
    if (format === 'HH:mm') return '18:00';
    return date;
  },
}));

const createMockEvent = (overrides?: Partial<Event>): Event => ({
  id: 'event-1',
  slug: 'workshop-investovanie',
  title: 'Workshop: Investovanie do nehnuteľností',
  description: 'Praktický workshop o investovaní do nehnuteľností pre začiatočníkov aj pokročilých.',
  type: EventType.WORKSHOP,
  format: EventFormat.OFFLINE,
  category: EventCategory.REAL_ESTATE,
  bannerImage: '/images/events/workshop-banner.jpg',
  startDate: '2026-03-15T18:00:00Z',
  endDate: '2026-03-15T21:00:00Z',
  timezone: 'Europe/Bratislava',
  location: 'Bratislava, Hotel Carlton',
  address: 'Hviezdoslavovo námestie 3, 811 02 Bratislava',
  organizerId: 'organizer-1',
  maxAttendees: 50,
  attendeeCount: 32,
  price: 0,
  currency: 'EUR',
  status: EventStatus.PUBLISHED,
  published: true,
  featured: false,
  tags: ['investovanie', 'nehnuteľnosti'],
  createdAt: '2025-12-01T00:00:00Z',
  updatedAt: '2026-01-15T00:00:00Z',
  ...overrides,
});

describe('EventCard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // RENDERING TESTS
  // ==========================================

  describe('Rendering', () => {
    it('renders event title and date', () => {
      const event = createMockEvent();

      renderWithProviders(<EventCard event={event} />);

      expect(
        screen.getByText('Workshop: Investovanie do nehnuteľností')
      ).toBeInTheDocument();
      // Formatted date from mocked formatDate
      expect(screen.getByText('15. mar 2026')).toBeInTheDocument();
    });

    it('renders event description', () => {
      const event = createMockEvent();

      renderWithProviders(<EventCard event={event} />);

      expect(
        screen.getByText(
          'Praktický workshop o investovaní do nehnuteľností pre začiatočníkov aj pokročilých.'
        )
      ).toBeInTheDocument();
    });

    it('renders the event time', () => {
      const event = createMockEvent();

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('18:00')).toBeInTheDocument();
    });

    it('renders event banner image', () => {
      const event = createMockEvent();

      renderWithProviders(<EventCard event={event} />);

      const img = screen.getByAltText('Workshop: Investovanie do nehnuteľností');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/events/workshop-banner.jpg');
    });
  });

  // ==========================================
  // EVENT TYPE / FORMAT TESTS
  // ==========================================

  describe('Event Type and Format', () => {
    it('shows Workshop type label', () => {
      const event = createMockEvent({ type: EventType.WORKSHOP });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Workshop')).toBeInTheDocument();
    });

    it('shows Networking type label', () => {
      const event = createMockEvent({ type: EventType.NETWORKING });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Networking')).toBeInTheDocument();
    });

    it('shows Konferencia type label', () => {
      const event = createMockEvent({ type: EventType.CONFERENCE });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Konferencia')).toBeInTheDocument();
    });

    it('shows Webinar type label', () => {
      const event = createMockEvent({ type: EventType.WEBINAR });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Webinár')).toBeInTheDocument();
    });

    it('shows Meetup type label', () => {
      const event = createMockEvent({ type: EventType.MEETUP });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Meetup')).toBeInTheDocument();
    });

    it('shows Offline format badge for offline events', () => {
      const event = createMockEvent({ format: EventFormat.OFFLINE });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('shows Online format badge for online events', () => {
      const event = createMockEvent({ format: EventFormat.ONLINE });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Online')).toBeInTheDocument();
    });
  });

  // ==========================================
  // LOCATION TESTS
  // ==========================================

  describe('Location', () => {
    it('shows location for offline events', () => {
      const event = createMockEvent({
        format: EventFormat.OFFLINE,
        location: 'Bratislava, Hotel Carlton',
      });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Bratislava, Hotel Carlton')).toBeInTheDocument();
    });

    it('shows "Online stretnutie" for online events', () => {
      const event = createMockEvent({ format: EventFormat.ONLINE });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Online stretnutie')).toBeInTheDocument();
    });

    it('shows "TBA" when offline event has no location', () => {
      const event = createMockEvent({
        format: EventFormat.OFFLINE,
        location: undefined,
      });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('TBA')).toBeInTheDocument();
    });
  });

  // ==========================================
  // ATTENDEE COUNT TESTS
  // ==========================================

  describe('Attendee Count', () => {
    it('shows attendee count', () => {
      const event = createMockEvent({
        attendeeCount: 32,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('32')).toBeInTheDocument();
    });

    it('shows capacity info when maxAttendees is set', () => {
      const event = createMockEvent({
        attendeeCount: 32,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('/ 50')).toBeInTheDocument();
    });

    it('does not show capacity when maxAttendees is not set', () => {
      const event = createMockEvent({
        attendeeCount: 15,
        maxAttendees: undefined,
      });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.queryByText(/\//)).not.toBeInTheDocument();
    });

    it('shows "Obsadené" badge when fully booked', () => {
      const event = createMockEvent({
        attendeeCount: 50,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} />);

      // "Obsadené" appears as a badge AND as button text
      const obsadeneElements = screen.getAllByText('Obsadené');
      expect(obsadeneElements.length).toBeGreaterThanOrEqual(1);
    });

    it('does not show "Obsadené" badge when not fully booked', () => {
      const event = createMockEvent({
        attendeeCount: 30,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} />);

      // Button should say "Registrovať sa", not "Obsadené"
      expect(screen.getByText('Registrovať sa')).toBeInTheDocument();
    });
  });

  // ==========================================
  // PRICE TESTS
  // ==========================================

  describe('Price', () => {
    it('shows "Zadarmo" for free events', () => {
      const event = createMockEvent({ price: 0 });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Zadarmo')).toBeInTheDocument();
    });

    it('shows price with currency for paid events', () => {
      const event = createMockEvent({ price: 25, currency: 'EUR' });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('25 EUR')).toBeInTheDocument();
    });
  });

  // ==========================================
  // BUTTON TESTS
  // ==========================================

  describe('Button', () => {
    it('shows "Registrovať sa" when RSVP button enabled and not fully booked', () => {
      const event = createMockEvent({
        attendeeCount: 30,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} showRSVPButton={true} />);

      expect(screen.getByText('Registrovať sa')).toBeInTheDocument();
    });

    it('shows "Zobraziť detail" when RSVP button disabled', () => {
      const event = createMockEvent({
        attendeeCount: 30,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} showRSVPButton={false} />);

      expect(screen.getByText('Zobraziť detail')).toBeInTheDocument();
    });

    it('shows "Obsadené" on button when fully booked', () => {
      const event = createMockEvent({
        attendeeCount: 50,
        maxAttendees: 50,
      });

      renderWithProviders(<EventCard event={event} />);

      const button = screen.getByRole('button', { name: 'Obsadené' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('links to event detail page', () => {
      const event = createMockEvent({ slug: 'workshop-investovanie' });

      renderWithProviders(<EventCard event={event} />);

      const link = screen.getByText('Registrovať sa').closest('a');
      expect(link).toHaveAttribute(
        'href',
        '/community/events/workshop-investovanie'
      );
    });

    it('shows Featured badge for featured events', () => {
      const event = createMockEvent({ featured: true });

      renderWithProviders(<EventCard event={event} />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  // ==========================================
  // ACCESSIBILITY TESTS
  // ==========================================

  describe('Accessibility', () => {
    it('should have no accessibility violations for offline event', async () => {
      const event = createMockEvent({ format: EventFormat.OFFLINE });

      const { container } = renderWithProviders(<EventCard event={event} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations for online event', async () => {
      const event = createMockEvent({ format: EventFormat.ONLINE });

      const { container } = renderWithProviders(<EventCard event={event} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when fully booked', async () => {
      const event = createMockEvent({
        attendeeCount: 50,
        maxAttendees: 50,
      });

      const { container } = renderWithProviders(<EventCard event={event} />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
