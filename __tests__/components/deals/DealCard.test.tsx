import React from 'react';
import { renderWithProviders, screen } from '@/__tests__/setup/test-utils';
import userEvent from '@testing-library/user-event';
import { DealCard } from '@/components/deals/DealCard';
import { Deal, DealStatus } from '@/types/deals';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Mail: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-mail" aria-hidden="true" />
  ),
  Phone: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-phone" aria-hidden="true" />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-calendar" aria-hidden="true" />
  ),
  DollarSign: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="icon-dollar-sign" aria-hidden="true" />
  ),
}));

// Mock data helper
const createMockDeal = (overrides?: Partial<Deal>): Deal => ({
  id: '1',
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

describe('DealCard', () => {
  let mockOnStatusChange: jest.Mock;
  let mockOnViewDetails: jest.Mock;

  beforeEach(() => {
    mockOnStatusChange = jest.fn();
    mockOnViewDetails = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // RENDERING TESTS
  // ==========================================

  describe('Rendering', () => {
    it('renders customer name', () => {
      // Arrange
      const deal = createMockDeal({ customerName: 'Jane Smith' });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders email and phone', () => {
      // Arrange
      const deal = createMockDeal({
        customerEmail: 'test@example.com',
        customerPhone: '+421123456789',
      });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('+421123456789')).toBeInTheDocument();
    });

    it('renders message', () => {
      // Arrange
      const deal = createMockDeal({ message: 'I need a plumber urgently' });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      expect(screen.getByText('I need a plumber urgently')).toBeInTheDocument();
    });

    it('renders correct status badge text', () => {
      // Arrange
      const deal = createMockDeal({ status: DealStatus.NEW });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      expect(screen.getByText('Nový')).toBeInTheDocument();
    });

    it('renders deal value formatted as EUR currency', () => {
      // Arrange
      const deal = createMockDeal({ dealValue: 5000 });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - check for formatted EUR value
      expect(screen.getByText(/5\s*000/)).toBeInTheDocument();
    });

    it('renders estimated close date in Slovak format', () => {
      // Arrange
      const deal = createMockDeal({ estimatedCloseDate: '2026-03-15' });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - Slovak format should show month abbreviation and year
      expect(screen.getByText(/Uzavretie:/)).toBeInTheDocument();
      expect(screen.getByText(/15\./)).toBeInTheDocument();
    });

    it('renders created date', () => {
      // Arrange
      const deal = createMockDeal({ createdAt: '2026-01-01T10:00:00Z' });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      expect(screen.getByText(/Vytvorené:/)).toBeInTheDocument();
    });
  });

  // ==========================================
  // INTERACTION TESTS
  // ==========================================

  describe('Interactions', () => {
    it('calls onViewDetails with deal when Detail button clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const deal = createMockDeal();

      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Act
      const detailButton = screen.getByRole('button', { name: /detail/i });
      await user.click(detailButton);

      // Assert
      expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
      expect(mockOnViewDetails).toHaveBeenCalledWith(deal);
    });

    it('calls onStatusChange with deal when "Zmeniť status" clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      const deal = createMockDeal({ status: DealStatus.NEW });

      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Act
      const changeStatusButton = screen.getByRole('button', { name: /zmeniť status/i });
      await user.click(changeStatusButton);

      // Assert
      expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
      expect(mockOnStatusChange).toHaveBeenCalledWith(deal);
    });

    it('hides "Zmeniť status" button for CLOSED_WON deals', () => {
      // Arrange
      const deal = createMockDeal({ status: DealStatus.CLOSED_WON });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      const changeStatusButton = screen.queryByRole('button', { name: /zmeniť status/i });
      expect(changeStatusButton).not.toBeInTheDocument();
    });

    it('hides "Zmeniť status" button for CLOSED_LOST deals', () => {
      // Arrange
      const deal = createMockDeal({ status: DealStatus.CLOSED_LOST });

      // Act
      renderWithProviders(
        <DealCard
          deal={deal}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      const changeStatusButton = screen.queryByRole('button', { name: /zmeniť status/i });
      expect(changeStatusButton).not.toBeInTheDocument();
    });
  });
});
