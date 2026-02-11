import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DealDetailModal } from '@/components/deals/DealDetailModal';
import { Deal, DealStatus } from '@/types/deals';

// Mock the hooks used by this component
const mockMutateAsync = jest.fn();
jest.mock('@/lib/hooks/useDeals', () => ({
  useAddDealNote: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  useDealEvents: () => ({
    data: [],
    isLoading: false,
  }),
}));

const createMockDeal = (overrides?: Partial<Deal>): Deal => ({
  id: 'deal-1',
  specialistId: 'specialist-1',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+421901234567',
  message: 'Test message',
  status: DealStatus.NEW,
  dealValue: 5000,
  estimatedCloseDate: '2026-03-01',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  ...overrides,
});

describe('DealDetailModal', () => {
  let mockOnClose: jest.Mock;
  let mockOnEditValue: jest.Mock;
  let mockOnCloseDeal: jest.Mock;
  let mockOnReopen: jest.Mock;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnEditValue = jest.fn();
    mockOnCloseDeal = jest.fn();
    mockOnReopen = jest.fn();
    mockMutateAsync.mockReset();
  });

  const renderModal = (deal: Deal | null = createMockDeal(), isOpen = true) =>
    render(
      <DealDetailModal
        deal={deal}
        isOpen={isOpen}
        onClose={mockOnClose}
        onEditValue={mockOnEditValue}
        onCloseDeal={mockOnCloseDeal}
        onReopen={mockOnReopen}
      />
    );

  describe('Visibility', () => {
    it('returns null when isOpen is false', () => {
      const { container } = renderModal(createMockDeal(), false);
      expect(container.innerHTML).toBe('');
    });

    it('returns null when deal is null', () => {
      const { container } = renderModal(null, true);
      expect(container.innerHTML).toBe('');
    });

    it('renders when isOpen and deal provided', () => {
      renderModal();
      expect(screen.getByText('Detail dealu')).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders deal status badge', () => {
      renderModal(createMockDeal({ status: DealStatus.NEW }));
      expect(screen.getByText('Nový')).toBeInTheDocument();
    });

    it('renders customer info via DealInfo', () => {
      renderModal(createMockDeal({ customerName: 'Alice' }));
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('renders timeline section heading', () => {
      renderModal();
      expect(screen.getByText('História udalostí')).toBeInTheDocument();
    });
  });

  describe('Actions for open deals', () => {
    it('shows "Upraviť hodnotu" button for non-closed deals', () => {
      renderModal(createMockDeal({ status: DealStatus.NEW }));
      expect(screen.getByText('Upraviť hodnotu')).toBeInTheDocument();
    });

    it('shows "Uzavrieť deal" button for non-closed deals', () => {
      renderModal(createMockDeal({ status: DealStatus.IN_PROGRESS }));
      expect(screen.getByText('Uzavrieť deal')).toBeInTheDocument();
    });

    it('calls onEditValue and onClose when "Upraviť hodnotu" clicked', async () => {
      const user = userEvent.setup();
      const deal = createMockDeal({ status: DealStatus.NEW });
      renderModal(deal);

      await user.click(screen.getByText('Upraviť hodnotu'));

      expect(mockOnEditValue).toHaveBeenCalledWith(deal);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onCloseDeal and onClose when "Uzavrieť deal" clicked', async () => {
      const user = userEvent.setup();
      const deal = createMockDeal({ status: DealStatus.IN_PROGRESS });
      renderModal(deal);

      await user.click(screen.getByText('Uzavrieť deal'));

      expect(mockOnCloseDeal).toHaveBeenCalledWith(deal);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Actions for closed deals', () => {
    it('shows "Znovu otvoriť" button for CLOSED_WON deals', () => {
      renderModal(createMockDeal({ status: DealStatus.CLOSED_WON }));
      expect(screen.getByText('Znovu otvoriť')).toBeInTheDocument();
      expect(screen.queryByText('Upraviť hodnotu')).not.toBeInTheDocument();
      expect(screen.queryByText('Uzavrieť deal')).not.toBeInTheDocument();
    });

    it('shows "Znovu otvoriť" for CLOSED_LOST deals', () => {
      renderModal(createMockDeal({ status: DealStatus.CLOSED_LOST }));
      expect(screen.getByText('Znovu otvoriť')).toBeInTheDocument();
    });

    it('calls onReopen and onClose when "Znovu otvoriť" clicked', async () => {
      const user = userEvent.setup();
      const deal = createMockDeal({ status: DealStatus.CLOSED_WON });
      renderModal(deal);

      await user.click(screen.getByText('Znovu otvoriť'));

      expect(mockOnReopen).toHaveBeenCalledWith(deal);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Keyboard', () => {
    it('calls onClose when Escape pressed', () => {
      renderModal();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Close button', () => {
    it('calls onClose when close button clicked', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByLabelText('Close modal'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when "Zavrieť" text button clicked', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.click(screen.getByText('Zavrieť'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
