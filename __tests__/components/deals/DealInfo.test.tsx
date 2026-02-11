import React from 'react';
import { render, screen } from '@testing-library/react';
import { DealInfo } from '@/components/deals/DealInfo';
import { Deal, DealStatus } from '@/types/deals';

const createMockDeal = (overrides?: Partial<Deal>): Deal => ({
  id: '1',
  specialistId: 'specialist-1',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+421901234567',
  message: 'Test deal message',
  status: DealStatus.NEW,
  dealValue: 5000,
  estimatedCloseDate: '2026-03-01',
  createdAt: '2026-01-01T10:00:00Z',
  updatedAt: '2026-01-01T10:00:00Z',
  ...overrides,
});

describe('DealInfo', () => {
  describe('Customer Information', () => {
    it('renders customer name', () => {
      render(<DealInfo deal={createMockDeal()} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders email as mailto link', () => {
      render(<DealInfo deal={createMockDeal()} />);
      const emailLink = screen.getByRole('link', { name: 'john@example.com' });
      expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
    });

    it('renders phone as tel link', () => {
      render(<DealInfo deal={createMockDeal()} />);
      const phoneLink = screen.getByRole('link', { name: '+421901234567' });
      expect(phoneLink).toHaveAttribute('href', 'tel:+421901234567');
    });
  });

  describe('Message', () => {
    it('renders message text', () => {
      render(<DealInfo deal={createMockDeal({ message: 'Mám záujem o spoluprácu' })} />);
      expect(screen.getByText('Mám záujem o spoluprácu')).toBeInTheDocument();
    });
  });

  describe('Deal Details', () => {
    it('renders deal value formatted as EUR when present', () => {
      render(<DealInfo deal={createMockDeal({ dealValue: 5000 })} />);
      expect(screen.getByText(/5[\s\u00a0]000/)).toBeInTheDocument();
    });

    it('shows "Nenastavené" when dealValue is undefined', () => {
      render(<DealInfo deal={createMockDeal({ dealValue: undefined })} />);
      const nenastavene = screen.getAllByText('Nenastavené');
      expect(nenastavene.length).toBeGreaterThanOrEqual(1);
    });

    it('shows estimated close date when present', () => {
      render(<DealInfo deal={createMockDeal({ estimatedCloseDate: '2026-06-15' })} />);
      // Should show a formatted date (Slovak locale)
      expect(screen.queryByText('Nenastavené')).not.toBeInTheDocument();
    });

    it('shows "Nenastavené" when estimatedCloseDate is undefined', () => {
      render(<DealInfo deal={createMockDeal({ estimatedCloseDate: undefined, dealValue: undefined })} />);
      const nenastavene = screen.getAllByText('Nenastavené');
      expect(nenastavene).toHaveLength(2);
    });
  });
});
