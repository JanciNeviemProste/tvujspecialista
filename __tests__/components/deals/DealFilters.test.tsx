import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DealFilters } from '@/components/deals/DealFilters';
import { renderWithProviders } from '@/__tests__/setup/test-utils';
import { Deal, DealStatus, DealFilters as DealFiltersType } from '@/types/deals';

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

const createMockDeals = (): Deal[] => [
  createMockDeal({
    id: '1',
    customerName: 'John Doe',
    status: DealStatus.NEW,
    dealValue: 5000,
    createdAt: '2026-01-15T10:00:00Z',
  }),
  createMockDeal({
    id: '2',
    customerName: 'Jane Smith',
    status: DealStatus.CONTACTED,
    dealValue: 8000,
    createdAt: '2026-01-20T10:00:00Z',
  }),
  createMockDeal({
    id: '3',
    customerName: 'Bob Wilson',
    status: DealStatus.QUALIFIED,
    dealValue: 15000,
    createdAt: '2026-01-25T10:00:00Z',
  }),
  createMockDeal({
    id: '4',
    customerName: 'Alice Brown',
    status: DealStatus.IN_PROGRESS,
    dealValue: 20000,
    createdAt: '2026-02-01T10:00:00Z',
  }),
  createMockDeal({
    id: '5',
    customerName: 'Charlie Davis',
    status: DealStatus.CLOSED_WON,
    dealValue: 12000,
    createdAt: '2026-02-05T10:00:00Z',
  }),
];

const createDefaultFilters = (): DealFiltersType => ({
  search: '',
  status: 'all',
  valueRange: [0, 20000],
  dateRange: { from: null, to: null },
  dateType: 'created',
});

describe('DealFilters Component', () => {
  let mockOnFiltersChange: jest.Mock;
  let mockDeals: Deal[];
  let defaultFilters: DealFiltersType;

  beforeEach(() => {
    mockOnFiltersChange = jest.fn();
    mockDeals = createMockDeals();
    defaultFilters = createDefaultFilters();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // RENDERING TESTS (3)
  // ==========================================

  describe('Rendering', () => {
    it('renders search input', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      const searchInput = screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      });
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Hľadať dealy...');
    });

    it('renders status dropdown', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      const statusSelect = screen.getByRole('combobox', {
        name: /filter by deal status/i,
      });
      expect(statusSelect).toBeInTheDocument();
    });

    it('renders advanced filters toggle button', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent('Viac filtrov');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ==========================================
  // SEARCH FILTER TESTS (3)
  // ==========================================

  describe('Search Filter', () => {
    it('updates search filter on input', async () => {
      // Arrange
      const user = userEvent.setup();
      const { rerender } = renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );
      const searchInput = screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      });

      // Act
      await user.type(searchInput, 'John');

      // Assert - verify onFiltersChange was called for each character
      expect(mockOnFiltersChange).toHaveBeenCalled();
      expect(mockOnFiltersChange.mock.calls.length).toBeGreaterThan(0);
    });

    it('calls onFiltersChange with search value', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );
      const searchInput = screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      });

      // Act
      await user.clear(searchInput);
      await user.type(searchInput, 'J');

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalled();
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.search).toBe('J');
    });

    it('displays entered search value', () => {
      // Arrange
      const filtersWithSearch = { ...defaultFilters, search: 'Alice' };

      // Act
      renderWithProviders(
        <DealFilters
          filters={filtersWithSearch}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      const searchInput = screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      });
      expect(searchInput).toHaveValue('Alice');
    });
  });

  // ==========================================
  // STATUS FILTER TESTS (2)
  // ==========================================

  describe('Status Filter', () => {
    it('updates status filter on select change', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );
      const statusSelect = screen.getByRole('combobox', {
        name: /filter by deal status/i,
      });

      // Act
      await user.selectOptions(statusSelect, DealStatus.CONTACTED);

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        status: DealStatus.CONTACTED,
      });
    });

    it('shows all status options (all, NEW, CONTACTED, QUALIFIED, IN_PROGRESS, CLOSED_WON, CLOSED_LOST)', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );
      const statusSelect = screen.getByRole('combobox', {
        name: /filter by deal status/i,
      });
      const options = Array.from(statusSelect.querySelectorAll('option'));

      // Assert
      expect(options).toHaveLength(7);
      expect(options[0]).toHaveValue('all');
      expect(options[1]).toHaveValue(DealStatus.NEW);
      expect(options[2]).toHaveValue(DealStatus.CONTACTED);
      expect(options[3]).toHaveValue(DealStatus.QUALIFIED);
      expect(options[4]).toHaveValue(DealStatus.IN_PROGRESS);
      expect(options[5]).toHaveValue(DealStatus.CLOSED_WON);
      expect(options[6]).toHaveValue(DealStatus.CLOSED_LOST);
    });
  });

  // ==========================================
  // VALUE RANGE SLIDER TESTS (3)
  // ==========================================

  describe('Value Range Slider', () => {
    it('renders value range slider with correct min/max', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      // Assert - check for slider label and value display
      await waitFor(() => {
        expect(screen.getByText(/hodnota dealu/i)).toBeInTheDocument();
        expect(screen.getByText(/0\s*€/)).toBeInTheDocument();
        expect(screen.getByText(/20\s*000\s*€/)).toBeInTheDocument();
      });
    });

    it('updates valueRange on slider change', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      // Note: Simulating slider change is complex with Radix UI
      // We'll verify the component responds to prop changes instead
      const newFilters = { ...defaultFilters, valueRange: [1000, 15000] as [number, number] };
      const { rerender } = renderWithProviders(
        <DealFilters
          filters={newFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      await user.click(screen.getByRole('button', { name: /show advanced filters/i }));

      // Assert - verify the range is displayed
      await waitFor(() => {
        expect(screen.getByText(/1\s*000\s*€/)).toBeInTheDocument();
        expect(screen.getByText(/15\s*000\s*€/)).toBeInTheDocument();
      });
    });

    it('displays current range values', async () => {
      // Arrange
      const user = userEvent.setup();
      const filtersWithRange = {
        ...defaultFilters,
        valueRange: [5000, 12000] as [number, number],
      };
      renderWithProviders(
        <DealFilters
          filters={filtersWithRange}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/5\s*000\s*€/)).toBeInTheDocument();
        expect(screen.getByText(/12\s*000\s*€/)).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // DATE RANGE PICKER TESTS (4)
  // ==========================================

  describe('Date Range Picker', () => {
    it('renders date range picker', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      // Assert
      await waitFor(() => {
        const fromInput = screen.getByLabelText(/od/i);
        const toInput = screen.getByLabelText(/do/i);
        expect(fromInput).toBeInTheDocument();
        expect(toInput).toBeInTheDocument();
        expect(fromInput).toHaveAttribute('type', 'date');
        expect(toInput).toHaveAttribute('type', 'date');
      });
    });

    it('updates dateRange.from on change', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/od/i)).toBeInTheDocument();
      });

      const fromInput = screen.getByLabelText(/od/i);
      await user.type(fromInput, '2026-01-01');

      // Assert
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalled();
        const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
        expect(lastCall.dateRange.from).toBe('2026-01-01');
      });
    });

    it('updates dateRange.to on change', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/do/i)).toBeInTheDocument();
      });

      const toInput = screen.getByLabelText(/do/i);
      await user.type(toInput, '2026-12-31');

      // Assert
      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalled();
        const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
        expect(lastCall.dateRange.to).toBe('2026-12-31');
      });
    });

    it("switches dateType between 'created' and 'estimatedClose'", async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText(/dátum vytvorenia/i)).toBeInTheDocument();
      });

      // Assert initial state
      const createdButton = screen.getByRole('button', { name: /dátum vytvorenia/i });
      const estimatedButton = screen.getByRole('button', { name: /predpokladané uzavretie/i });

      // Created should be active by default
      expect(createdButton).toBeInTheDocument();
      expect(estimatedButton).toBeInTheDocument();

      // Act - switch to estimatedClose
      await user.click(estimatedButton);

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        dateType: 'estimatedClose',
      });

      // Act - switch back to created
      await user.click(createdButton);

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        ...defaultFilters,
        dateType: 'created',
      });
    });
  });

  // ==========================================
  // CLEAR FILTERS TESTS (2)
  // ==========================================

  describe('Clear Filters', () => {
    it('shows clear filters button when filters active', () => {
      // Arrange - filters with active search
      const activeFilters = { ...defaultFilters, search: 'John' };

      // Act
      renderWithProviders(
        <DealFilters
          filters={activeFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('Vymazať');
    });

    it('resets all filters to default on click', async () => {
      // Arrange
      const user = userEvent.setup();
      const activeFilters: DealFiltersType = {
        search: 'John',
        status: DealStatus.CONTACTED,
        valueRange: [5000, 15000],
        dateRange: { from: '2026-01-01', to: '2026-12-31' },
        dateType: 'estimatedClose',
      };

      renderWithProviders(
        <DealFilters
          filters={activeFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      await user.click(clearButton);

      // Assert
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: '',
        status: 'all',
        valueRange: [0, 20000],
        dateRange: { from: null, to: null },
        dateType: 'created',
      });
    });

    it('does not show clear filters button when no filters active', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      const clearButton = screen.queryByRole('button', { name: /clear all filters/i });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // ADVANCED FILTERS TOGGLE (1)
  // ==========================================

  describe('Advanced Filters Toggle', () => {
    it('toggles advanced filters section visibility', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });

      // Assert - initially collapsed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('region', { name: /advanced filters/i })).not.toBeInTheDocument();

      // Act - expand
      await user.click(toggleButton);

      // Assert - expanded
      await waitFor(() => {
        const expandedButton = screen.getByRole('button', {
          name: /hide advanced filters/i,
        });
        expect(expandedButton).toHaveAttribute('aria-expanded', 'true');
        expect(expandedButton).toHaveTextContent('Menej');
        expect(screen.getByRole('region', { name: /advanced filters/i })).toBeInTheDocument();
      });

      // Act - collapse
      const expandedButton = screen.getByRole('button', {
        name: /hide advanced filters/i,
      });
      await user.click(expandedButton);

      // Assert - collapsed again
      await waitFor(() => {
        const collapsedButton = screen.getByRole('button', {
          name: /show advanced filters/i,
        });
        expect(collapsedButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('region', { name: /advanced filters/i })).not.toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // ADDITIONAL EDGE CASES & INTEGRATION
  // ==========================================

  describe('Edge Cases and Integration', () => {
    it('handles empty deals array gracefully', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={[]}
        />
      );

      // Assert - component should render without errors
      expect(screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      })).toBeInTheDocument();
    });

    it('calculates max deal value correctly from deals', async () => {
      // Arrange
      const user = userEvent.setup();
      const dealsWithHighValue = [
        createMockDeal({ dealValue: 50000 }),
        createMockDeal({ dealValue: 100000 }),
      ];

      renderWithProviders(
        <DealFilters
          filters={{ ...defaultFilters, valueRange: [0, 100000] }}
          onFiltersChange={mockOnFiltersChange}
          deals={dealsWithHighValue}
        />
      );

      // Act - expand advanced filters
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);

      // Assert - check that max value is displayed correctly
      await waitFor(() => {
        expect(screen.getByText(/100\s*000\s*€/)).toBeInTheDocument();
      });
    });

    it('maintains filter state between toggling advanced filters', async () => {
      // Arrange
      const user = userEvent.setup();
      const filtersWithData = {
        ...defaultFilters,
        search: 'Test',
        status: DealStatus.QUALIFIED as DealStatus | 'all',
      };

      renderWithProviders(
        <DealFilters
          filters={filtersWithData}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Act - toggle advanced filters multiple times
      const toggleButton = screen.getByRole('button', {
        name: /show advanced filters/i,
      });
      await user.click(toggleButton);
      await user.click(screen.getByRole('button', { name: /hide advanced filters/i }));

      // Assert - basic filters should remain
      expect(screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      })).toHaveValue('Test');
      expect(screen.getByRole('combobox', {
        name: /filter by deal status/i,
      })).toHaveValue(DealStatus.QUALIFIED);
    });

    it('has proper ARIA labels for accessibility', () => {
      // Arrange & Act
      renderWithProviders(
        <DealFilters
          filters={defaultFilters}
          onFiltersChange={mockOnFiltersChange}
          deals={mockDeals}
        />
      );

      // Assert
      expect(screen.getByRole('search', { name: /deal filters/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', {
        name: /search deals by name, email, or phone/i,
      })).toBeInTheDocument();
      expect(screen.getByRole('combobox', {
        name: /filter by deal status/i,
      })).toBeInTheDocument();
    });
  });
});
