import React from 'react';
import { renderWithProviders, screen, within } from '@/__tests__/setup/test-utils';
import userEvent from '@testing-library/user-event';
import { DealKanban } from '@/components/deals/DealKanban';
import { Deal, DealStatus } from '@/types/deals';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

// Mock data helpers
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

describe('DealKanban', () => {
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
    it('renders all 6 column headings', () => {
      // Arrange & Act
      renderWithProviders(
        <DealKanban
          deals={[]}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert
      expect(screen.getByText('Nový')).toBeInTheDocument();
      expect(screen.getByText('Kontaktovaný')).toBeInTheDocument();
      expect(screen.getByText('Kvalifikovaný')).toBeInTheDocument();
      expect(screen.getByText('V procese')).toBeInTheDocument();
      expect(screen.getByText('Získaný')).toBeInTheDocument();
      expect(screen.getByText('Stratený')).toBeInTheDocument();
    });

    it('groups deals by status correctly', () => {
      // Arrange
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW, customerName: 'New Deal' }),
        createMockDeal({ id: '2', status: DealStatus.CONTACTED, customerName: 'Contacted Deal' }),
        createMockDeal({ id: '3', status: DealStatus.NEW, customerName: 'Another New Deal' }),
      ];

      // Act
      renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - check NEW column has 2 deals
      expect(screen.getByText('New Deal')).toBeInTheDocument();
      expect(screen.getByText('Another New Deal')).toBeInTheDocument();

      // Assert - check CONTACTED column has 1 deal
      expect(screen.getByText('Contacted Deal')).toBeInTheDocument();
    });

    it('shows deal count per column in Badge', () => {
      // Arrange
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW }),
        createMockDeal({ id: '2', status: DealStatus.NEW }),
        createMockDeal({ id: '3', status: DealStatus.CONTACTED }),
      ];

      // Act
      const { container } = renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - find the "Nový" column heading and its sibling badge
      const novyHeading = screen.getByRole('heading', { name: 'Nový' });
      const novyColumn = novyHeading.closest('div')!;
      const novyBadge = within(novyColumn).getByText('2');
      expect(novyBadge).toBeInTheDocument();

      // Assert - find the "Kontaktovaný" column heading and its sibling badge
      const kontaktovanyHeading = screen.getByRole('heading', { name: 'Kontaktovaný' });
      const kontaktovanyColumn = kontaktovanyHeading.closest('div')!;
      const kontaktovanyBadge = within(kontaktovanyColumn).getByText('1');
      expect(kontaktovanyBadge).toBeInTheDocument();
    });

    it('shows total value when >0', () => {
      // Arrange
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW, dealValue: 1000 }),
        createMockDeal({ id: '2', status: DealStatus.NEW, dealValue: 2500 }),
      ];

      // Act
      renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - total value should be 3,500 EUR
      expect(screen.getByText(/Hodnota:\s*3\s*500/)).toBeInTheDocument();
    });

    it('shows empty state "Žiadne dealy" for columns with no deals', () => {
      // Arrange
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW }),
      ];

      // Act
      renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - CONTACTED column should have empty state
      const emptyStates = screen.getAllByText('Žiadne dealy');
      expect(emptyStates.length).toBe(5); // 5 columns without deals
    });

    it('renders DealCard for each deal', () => {
      // Arrange
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW, customerName: 'Customer 1' }),
        createMockDeal({ id: '2', status: DealStatus.NEW, customerName: 'Customer 2' }),
      ];

      // Act
      renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Assert - both customer names should be visible
      expect(screen.getByText('Customer 1')).toBeInTheDocument();
      expect(screen.getByText('Customer 2')).toBeInTheDocument();
    });
  });

  // ==========================================
  // INTERACTION TESTS
  // ==========================================

  describe('Interactions', () => {
    it('passes onStatusChange to DealCard', async () => {
      // Arrange
      const user = userEvent.setup();
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW }),
      ];

      // Act
      renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Find and click the "Zmeniť status" button
      const changeStatusButton = screen.getByRole('button', { name: /zmeniť status/i });
      await user.click(changeStatusButton);

      // Assert
      expect(mockOnStatusChange).toHaveBeenCalledWith(deals[0]);
    });

    it('passes onViewDetails to DealCard', async () => {
      // Arrange
      const user = userEvent.setup();
      const deals = [
        createMockDeal({ id: '1', status: DealStatus.NEW }),
      ];

      // Act
      renderWithProviders(
        <DealKanban
          deals={deals}
          onStatusChange={mockOnStatusChange}
          onViewDetails={mockOnViewDetails}
        />
      );

      // Find and click the "Detail" button
      const detailButton = screen.getByRole('button', { name: /detail/i });
      await user.click(detailButton);

      // Assert
      expect(mockOnViewDetails).toHaveBeenCalledWith(deals[0]);
    });
  });
});
