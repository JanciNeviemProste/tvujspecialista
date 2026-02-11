import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PricingCard } from '@/components/subscriptions/PricingCard';
import { PricingPlan, SubscriptionType } from '@/types/subscriptions';

const createMockPlan = (overrides?: Partial<PricingPlan>): PricingPlan => ({
  type: SubscriptionType.MARKETPLACE,
  name: 'Professional',
  description: 'Pre aktívnych špecialistov',
  monthlyPrice: 499,
  features: ['Neobmedzený počet leadov', 'Prioritná podpora', 'Analytika'],
  cta: 'Vybrať plán',
  ...overrides,
});

describe('PricingCard', () => {
  let mockOnSelectPlan: jest.Mock;

  beforeEach(() => {
    mockOnSelectPlan = jest.fn();
  });

  describe('Content', () => {
    it('renders plan name', () => {
      render(<PricingCard plan={createMockPlan()} onSelectPlan={mockOnSelectPlan} />);
      expect(screen.getByText('Professional')).toBeInTheDocument();
    });

    it('renders plan description', () => {
      render(<PricingCard plan={createMockPlan()} onSelectPlan={mockOnSelectPlan} />);
      expect(screen.getByText('Pre aktívnych špecialistov')).toBeInTheDocument();
    });

    it('renders monthly price', () => {
      render(<PricingCard plan={createMockPlan({ monthlyPrice: 499 })} onSelectPlan={mockOnSelectPlan} />);
      expect(screen.getByText('499 Kč')).toBeInTheDocument();
      expect(screen.getByText('/mesiac')).toBeInTheDocument();
    });

    it('renders yearly price savings when yearlyPrice exists', () => {
      render(
        <PricingCard
          plan={createMockPlan({ monthlyPrice: 499, yearlyPrice: 4990 })}
          onSelectPlan={mockOnSelectPlan}
        />
      );
      expect(screen.getByText(/4990 Kč\/rok/)).toBeInTheDocument();
      expect(screen.getByText(/ušetríte/)).toBeInTheDocument();
    });

    it('does not render yearly savings when no yearlyPrice', () => {
      render(
        <PricingCard
          plan={createMockPlan({ yearlyPrice: undefined })}
          onSelectPlan={mockOnSelectPlan}
        />
      );
      expect(screen.queryByText(/ušetríte/)).not.toBeInTheDocument();
    });

    it('renders all features', () => {
      const features = ['Feature A', 'Feature B', 'Feature C'];
      render(
        <PricingCard
          plan={createMockPlan({ features })}
          onSelectPlan={mockOnSelectPlan}
        />
      );

      features.forEach((f) => {
        expect(screen.getByText(f)).toBeInTheDocument();
      });
    });
  });

  describe('Recommended badge', () => {
    it('shows "Odporúčame" badge when isRecommended', () => {
      render(
        <PricingCard
          plan={createMockPlan()}
          onSelectPlan={mockOnSelectPlan}
          isRecommended={true}
        />
      );
      expect(screen.getByText('Odporúčame')).toBeInTheDocument();
    });

    it('does not show badge when not recommended', () => {
      render(
        <PricingCard
          plan={createMockPlan()}
          onSelectPlan={mockOnSelectPlan}
          isRecommended={false}
        />
      );
      expect(screen.queryByText('Odporúčame')).not.toBeInTheDocument();
    });
  });

  describe('Button', () => {
    it('renders CTA text on button', () => {
      render(
        <PricingCard
          plan={createMockPlan({ cta: 'Začať teraz' })}
          onSelectPlan={mockOnSelectPlan}
        />
      );
      expect(screen.getByRole('button', { name: 'Začať teraz' })).toBeInTheDocument();
    });

    it('shows "Aktuálny plán" when currentPlan', () => {
      render(
        <PricingCard
          plan={createMockPlan()}
          onSelectPlan={mockOnSelectPlan}
          currentPlan={true}
        />
      );
      expect(screen.getByRole('button', { name: 'Aktuálny plán' })).toBeInTheDocument();
    });

    it('disables button when currentPlan', () => {
      render(
        <PricingCard
          plan={createMockPlan()}
          onSelectPlan={mockOnSelectPlan}
          currentPlan={true}
        />
      );
      expect(screen.getByRole('button', { name: 'Aktuálny plán' })).toBeDisabled();
    });

    it('shows "Načítavam..." when isLoading', () => {
      render(
        <PricingCard
          plan={createMockPlan()}
          onSelectPlan={mockOnSelectPlan}
          isLoading={true}
        />
      );
      expect(screen.getByRole('button', { name: 'Načítavam...' })).toBeInTheDocument();
    });

    it('calls onSelectPlan when clicked', async () => {
      const user = userEvent.setup();
      render(
        <PricingCard
          plan={createMockPlan({ cta: 'Vybrať' })}
          onSelectPlan={mockOnSelectPlan}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Vybrať' }));
      expect(mockOnSelectPlan).toHaveBeenCalled();
    });
  });
});
