import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RSVPCard } from '@/components/community/RSVPCard';
import { RSVP, RSVPStatus, EventFormat, EventType, EventCategory, EventStatus, PaymentStatus } from '@/types/community';

const createMockRSVP = (overrides?: Partial<RSVP>): RSVP => ({
  id: 'rsvp-1',
  eventId: 'event-1',
  userId: 'user-1',
  status: RSVPStatus.CONFIRMED,
  registeredAt: '2026-01-01T10:00:00Z',
  paymentStatus: PaymentStatus.PAID,
  event: {
    id: 'event-1',
    slug: 'workshop-jan-2026',
    title: 'Workshop pre špecialistov',
    description: 'Praktický workshop',
    type: EventType.WORKSHOP,
    format: EventFormat.OFFLINE,
    category: EventCategory.REAL_ESTATE,
    bannerImage: '/images/event.jpg',
    startDate: '2026-03-15T09:00:00Z',
    endDate: '2026-03-15T17:00:00Z',
    timezone: 'Europe/Bratislava',
    location: 'Bratislava, Staré Mesto',
    organizerId: 'org-1',
    attendeeCount: 25,
    price: 50,
    currency: 'EUR',
    status: EventStatus.PUBLISHED,
    published: true,
    featured: false,
    tags: ['workshop'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  ...overrides,
});

describe('RSVPCard', () => {
  describe('Null guard', () => {
    it('returns null when rsvp has no event', () => {
      const rsvp = createMockRSVP();
      rsvp.event = undefined;
      const { container } = render(<RSVPCard rsvp={rsvp} />);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('Content', () => {
    it('renders event title', () => {
      render(<RSVPCard rsvp={createMockRSVP()} />);
      expect(screen.getByText('Workshop pre špecialistov')).toBeInTheDocument();
    });

    it('renders event date', () => {
      render(<RSVPCard rsvp={createMockRSVP()} />);
      // formatDate with 'd. MMMM yyyy' → "15. marec 2026"
      expect(screen.getByText(/15\. marec 2026/)).toBeInTheDocument();
    });

    it('renders location for offline events', () => {
      render(<RSVPCard rsvp={createMockRSVP()} />);
      expect(screen.getByText('Bratislava, Staré Mesto')).toBeInTheDocument();
    });

    it('renders "Online stretnutie" for online events', () => {
      const rsvp = createMockRSVP();
      rsvp.event!.format = EventFormat.ONLINE;
      render(<RSVPCard rsvp={rsvp} />);
      expect(screen.getByText('Online stretnutie')).toBeInTheDocument();
    });

    it('renders "Zobraziť detail" link', () => {
      render(<RSVPCard rsvp={createMockRSVP()} />);
      expect(screen.getByText('Zobraziť detail')).toBeInTheDocument();
    });
  });

  describe('Status badges', () => {
    it('shows "Potvrdené" badge for CONFIRMED', () => {
      render(<RSVPCard rsvp={createMockRSVP({ status: RSVPStatus.CONFIRMED })} />);
      expect(screen.getByText('Potvrdené')).toBeInTheDocument();
    });

    it('shows "Čaká na potvrdenie" badge for PENDING', () => {
      render(<RSVPCard rsvp={createMockRSVP({ status: RSVPStatus.PENDING })} />);
      expect(screen.getByText('Čaká na potvrdenie')).toBeInTheDocument();
    });

    it('shows "Zúčastnený" badge for ATTENDED', () => {
      render(<RSVPCard rsvp={createMockRSVP({ status: RSVPStatus.ATTENDED })} />);
      expect(screen.getByText('Zúčastnený')).toBeInTheDocument();
    });

    it('shows "Zrušené" badge for CANCELLED', () => {
      render(<RSVPCard rsvp={createMockRSVP({ status: RSVPStatus.CANCELLED })} />);
      expect(screen.getByText('Zrušené')).toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('shows "Potvrdiť účasť" button for PENDING when onConfirm provided', () => {
      render(
        <RSVPCard
          rsvp={createMockRSVP({ status: RSVPStatus.PENDING })}
          onConfirm={jest.fn()}
        />
      );
      expect(screen.getByText('Potvrdiť účasť')).toBeInTheDocument();
    });

    it('does not show "Potvrdiť účasť" when onConfirm not provided', () => {
      render(<RSVPCard rsvp={createMockRSVP({ status: RSVPStatus.PENDING })} />);
      expect(screen.queryByText('Potvrdiť účasť')).not.toBeInTheDocument();
    });

    it('calls onConfirm with rsvp id when clicked', async () => {
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();
      render(
        <RSVPCard
          rsvp={createMockRSVP({ status: RSVPStatus.PENDING })}
          onConfirm={mockOnConfirm}
        />
      );

      await user.click(screen.getByText('Potvrdiť účasť'));
      expect(mockOnConfirm).toHaveBeenCalledWith('rsvp-1');
    });

    it('shows "Zrušiť registráciu" for PENDING when onCancel provided', () => {
      render(
        <RSVPCard
          rsvp={createMockRSVP({ status: RSVPStatus.PENDING })}
          onCancel={jest.fn()}
        />
      );
      expect(screen.getByText('Zrušiť registráciu')).toBeInTheDocument();
    });

    it('shows "Zrušiť registráciu" for CONFIRMED when onCancel provided', () => {
      render(
        <RSVPCard
          rsvp={createMockRSVP({ status: RSVPStatus.CONFIRMED })}
          onCancel={jest.fn()}
        />
      );
      expect(screen.getByText('Zrušiť registráciu')).toBeInTheDocument();
    });

    it('does not show "Zrušiť registráciu" for CANCELLED', () => {
      render(
        <RSVPCard
          rsvp={createMockRSVP({ status: RSVPStatus.CANCELLED })}
          onCancel={jest.fn()}
        />
      );
      expect(screen.queryByText('Zrušiť registráciu')).not.toBeInTheDocument();
    });

    it('calls onCancel with rsvp id when clicked', async () => {
      const user = userEvent.setup();
      const mockOnCancel = jest.fn();
      render(
        <RSVPCard
          rsvp={createMockRSVP({ status: RSVPStatus.CONFIRMED })}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByText('Zrušiť registráciu'));
      expect(mockOnCancel).toHaveBeenCalledWith('rsvp-1');
    });
  });

  describe('Meeting link', () => {
    it('does not show "Pripojiť sa" for offline events', () => {
      render(<RSVPCard rsvp={createMockRSVP({ status: RSVPStatus.CONFIRMED })} />);
      expect(screen.queryByText('Pripojiť sa')).not.toBeInTheDocument();
    });

    it('does not show "Pripojiť sa" for pending online events', () => {
      const rsvp = createMockRSVP({ status: RSVPStatus.PENDING });
      rsvp.event!.format = EventFormat.ONLINE;
      rsvp.event!.meetingLink = 'https://meet.example.com/abc';
      render(<RSVPCard rsvp={rsvp} />);
      expect(screen.queryByText('Pripojiť sa')).not.toBeInTheDocument();
    });
  });
});
