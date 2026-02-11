import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CloseDealModal } from '@/components/deals/CloseDealModal';
import { Deal, DealStatus } from '@/types/deals';

const createMockDeal = (overrides?: Partial<Deal>): Deal => ({
  id: 'deal-1',
  specialistId: 'specialist-1',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+421901234567',
  message: 'Test message',
  status: DealStatus.IN_PROGRESS,
  dealValue: 5000,
  estimatedCloseDate: '2026-03-01',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  ...overrides,
});

describe('CloseDealModal', () => {
  let mockOnClose: jest.Mock;
  let mockOnSubmit: jest.Mock;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnSubmit = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    it('returns null when isOpen is false', () => {
      const { container } = render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={false}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
      expect(container.innerHTML).toBe('');
    });

    it('returns null when deal is null', () => {
      const { container } = render(
        <CloseDealModal
          deal={null}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
      expect(container.innerHTML).toBe('');
    });

    it('renders modal when isOpen and deal provided', () => {
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByRole('heading', { name: 'Uzavrieť deal' })).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders deal customer name', () => {
      render(
        <CloseDealModal
          deal={createMockDeal({ customerName: 'Alice Cooper' })}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByText('Alice Cooper')).toBeInTheDocument();
    });

    it('shows value input for CLOSED_WON (default)', () => {
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );
      expect(screen.getByLabelText(/skutočná hodnota dealu/i)).toBeInTheDocument();
    });

    it('hides value input when CLOSED_LOST selected', async () => {
      const user = userEvent.setup();
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      await user.click(screen.getByText('Stratený'));

      expect(screen.queryByLabelText(/skutočná hodnota dealu/i)).not.toBeInTheDocument();
      expect(screen.getByText(/deal bude označený ako stratený/i)).toBeInTheDocument();
    });

    it('shows commission info text for CLOSED_LOST', async () => {
      const user = userEvent.setup();
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      await user.click(screen.getByText('Stratený'));

      expect(screen.getByText(/nebudú vytvorené žiadne provízne/i)).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('disables buttons when isLoading', () => {
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      );

      expect(screen.getByText('Zrušiť')).toBeDisabled();
      expect(screen.getByText('Ukladám...')).toBeInTheDocument();
    });

    it('shows "Ukladám..." text when isLoading', () => {
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      );

      expect(screen.getByText('Ukladám...')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose when Zrušiť clicked', async () => {
      const user = userEvent.setup();
      render(
        <CloseDealModal
          deal={createMockDeal()}
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      );

      await user.click(screen.getByText('Zrušiť'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
