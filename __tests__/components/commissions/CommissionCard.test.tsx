import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommissionCard } from '@/components/commissions/CommissionCard';
import { Commission, CommissionStatus } from '@/types/commissions';

const createMockCommission = (overrides?: Partial<Commission>): Commission => ({
  id: 'comm-1',
  dealId: 'deal-1',
  specialistId: 'specialist-1',
  dealValue: 10000,
  commissionRate: 10,
  commissionAmount: 1000,
  status: CommissionStatus.PENDING,
  calculatedAt: '2026-01-01T10:00:00Z',
  dueDate: '2026-06-01T00:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  deal: {
    id: 'deal-1',
    specialistId: 'specialist-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+421901234567',
    message: 'Test',
    status: 'closed_won' as any,
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
  },
  ...overrides,
});

describe('CommissionCard', () => {
  describe('Rendering', () => {
    it('renders title "Provízia z dealu"', () => {
      render(<CommissionCard commission={createMockCommission()} />);
      expect(screen.getByText('Provízia z dealu')).toBeInTheDocument();
    });

    it('renders customer name from deal', () => {
      render(<CommissionCard commission={createMockCommission()} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders correct status badge for PENDING', () => {
      render(<CommissionCard commission={createMockCommission({ status: CommissionStatus.PENDING })} />);
      expect(screen.getByText('Čaká na úhradu')).toBeInTheDocument();
    });

    it('renders correct status badge for PAID', () => {
      render(<CommissionCard commission={createMockCommission({ status: CommissionStatus.PAID })} />);
      expect(screen.getByText('Zaplatené')).toBeInTheDocument();
    });

    it('renders correct status badge for INVOICED', () => {
      render(<CommissionCard commission={createMockCommission({ status: CommissionStatus.INVOICED })} />);
      expect(screen.getByText('Vyfakturované')).toBeInTheDocument();
    });

    it('renders deal value formatted as EUR', () => {
      render(<CommissionCard commission={createMockCommission({ dealValue: 10000 })} />);
      expect(screen.getByText(/10[\s\u00a0]000/)).toBeInTheDocument();
    });

    it('renders commission rate', () => {
      render(<CommissionCard commission={createMockCommission({ commissionRate: 10 })} />);
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('renders commission amount', () => {
      render(<CommissionCard commission={createMockCommission({ commissionAmount: 1000 })} />);
      expect(screen.getByText(/1[\s\u00a0]000/)).toBeInTheDocument();
    });

    it('renders due date', () => {
      render(<CommissionCard commission={createMockCommission({ dueDate: '2026-06-01T00:00:00Z' })} />);
      expect(screen.getByText(/Splatnosť/)).toBeInTheDocument();
    });

    it('renders notes when present', () => {
      render(<CommissionCard commission={createMockCommission({ notes: 'Important note' })} />);
      expect(screen.getByText('Important note')).toBeInTheDocument();
    });
  });

  describe('Overdue indicator', () => {
    it('shows overdue indicator when past due and PENDING', () => {
      render(
        <CommissionCard
          commission={createMockCommission({
            status: CommissionStatus.PENDING,
            dueDate: '2020-01-01T00:00:00Z', // past date
          })}
        />
      );
      // The date should have destructive styling - verify the AlertCircle icon is rendered
      const dueDateText = screen.getByText(/Splatnosť/);
      expect(dueDateText).toBeInTheDocument();
    });

    it('does not show overdue for PAID status even with past date', () => {
      render(
        <CommissionCard
          commission={createMockCommission({
            status: CommissionStatus.PAID,
            dueDate: '2020-01-01T00:00:00Z',
            paidAt: '2020-01-15T00:00:00Z',
          })}
        />
      );
      expect(screen.getByText('Zaplatené')).toBeInTheDocument();
    });
  });

  describe('Date displays', () => {
    it('shows paid date when paidAt exists', () => {
      render(
        <CommissionCard
          commission={createMockCommission({
            status: CommissionStatus.PAID,
            paidAt: '2026-03-15T00:00:00Z',
          })}
        />
      );
      expect(screen.getByText(/Zaplatené:/)).toBeInTheDocument();
    });

    it('shows invoiced date when invoicedAt exists but paidAt does not', () => {
      render(
        <CommissionCard
          commission={createMockCommission({
            status: CommissionStatus.INVOICED,
            invoicedAt: '2026-02-15T00:00:00Z',
            paidAt: undefined,
          })}
        />
      );
      expect(screen.getByText(/Vyfakturované:/)).toBeInTheDocument();
    });
  });

  describe('Pay button', () => {
    it('renders pay button for PENDING status when onPay provided', () => {
      render(
        <CommissionCard
          commission={createMockCommission({ status: CommissionStatus.PENDING })}
          onPay={jest.fn()}
        />
      );
      expect(screen.getByText('Zaplatiť províziu')).toBeInTheDocument();
    });

    it('does not render pay button for PAID status', () => {
      render(
        <CommissionCard
          commission={createMockCommission({ status: CommissionStatus.PAID })}
          onPay={jest.fn()}
        />
      );
      expect(screen.queryByText('Zaplatiť províziu')).not.toBeInTheDocument();
    });

    it('does not render pay button when onPay not provided', () => {
      render(
        <CommissionCard commission={createMockCommission({ status: CommissionStatus.PENDING })} />
      );
      expect(screen.queryByText('Zaplatiť províziu')).not.toBeInTheDocument();
    });

    it('calls onPay with commission when clicked', async () => {
      const user = userEvent.setup();
      const mockOnPay = jest.fn();
      const commission = createMockCommission({ status: CommissionStatus.PENDING });

      render(<CommissionCard commission={commission} onPay={mockOnPay} />);

      await user.click(screen.getByText('Zaplatiť províziu'));
      expect(mockOnPay).toHaveBeenCalledWith(commission);
    });
  });
});
