import React from 'react';
import { render, screen } from '@testing-library/react';
import { DealAnalytics } from '@/components/deals/DealAnalytics';
import { DealAnalyticsData, DealStatus } from '@/types/deals';

describe('DealAnalytics', () => {
  // Mock data
  const mockAnalytics: DealAnalyticsData = {
    conversionRate: 25.5,
    averageDealValue: 1500,
    averageTimeToClose: 14,
    winRate: 60.3,
    statusDistribution: [
      { status: DealStatus.NEW, count: 10 },
      { status: DealStatus.CONTACTED, count: 8 },
      { status: DealStatus.QUALIFIED, count: 6 },
      { status: DealStatus.IN_PROGRESS, count: 4 },
      { status: DealStatus.CLOSED_WON, count: 12 },
      { status: DealStatus.CLOSED_LOST, count: 8 },
    ],
    monthlyTrend: [
      { month: 'Január', won: 5, lost: 3 },
      { month: 'Február', won: 7, lost: 2 },
      { month: 'Marec', won: 8, lost: 4 },
      { month: 'Apríl', won: 6, lost: 5 },
      { month: 'Máj', won: 9, lost: 3 },
      { month: 'Jún', won: 12, lost: 8 },
    ],
  };

  // ===== RENDERING TESTS =====

  describe('Rendering tests', () => {
    it('1. Renders analytics dashboard with all metrics', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      expect(screen.getByText('Konverzný pomer')).toBeInTheDocument();
      expect(screen.getByText('Priemerná hodnota')).toBeInTheDocument();
      expect(screen.getByText('Priemerný čas uzavretia')).toBeInTheDocument();
      expect(screen.getByText('Úspešnosť')).toBeInTheDocument();
      expect(screen.getByText('Rozdelenie podľa statusu')).toBeInTheDocument();
      expect(screen.getByText('Mesačný trend')).toBeInTheDocument();
    });

    it('2. Shows loading skeleton when isLoading=true', () => {
      // Arrange & Act
      const { container } = render(
        <DealAnalytics analytics={null} isLoading={true} />
      );

      // Assert
      const skeletonCards = container.querySelectorAll('.animate-pulse');
      expect(skeletonCards.length).toBeGreaterThan(0);
    });

    it('3. Handles null analytics gracefully', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={null} isLoading={false} />);

      // Assert
      expect(screen.getByText('Žiadne dáta pre analytiku')).toBeInTheDocument();
      expect(screen.queryByText('Konverzný pomer')).not.toBeInTheDocument();
    });
  });

  // ===== METRIC DISPLAY TESTS =====

  describe('Metric display tests', () => {
    it('4. Displays conversion rate as percentage', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      expect(screen.getByText('25.5%')).toBeInTheDocument();
    });

    it('5. Displays average deal value formatted as EUR', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      // Slovak locale formats currency as "1 500 €" with non-breaking space
      const currencyText = screen.getByText(/1[\s\u00A0]500[\s\u00A0]€/);
      expect(currencyText).toBeInTheDocument();
    });

    it('6. Displays average time to close in days', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      expect(screen.getByText('14 dní')).toBeInTheDocument();
    });

    it('7. Displays win rate as percentage', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      expect(screen.getByText('60.3%')).toBeInTheDocument();
    });
  });

  // ===== STATUS DISTRIBUTION TESTS =====

  describe('Status distribution tests', () => {
    it('8. Renders status distribution bars', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    it('9. Shows correct counts for each status', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert - check for presence of status labels and counts
      expect(screen.getByText('Získaný')).toBeInTheDocument();
      expect(screen.getByText('Nový')).toBeInTheDocument();
      expect(screen.getByText('Kontaktovaný')).toBeInTheDocument();
      expect(screen.getByText('Kvalifikovaný')).toBeInTheDocument();
      expect(screen.getByText('V procese')).toBeInTheDocument();
      expect(screen.getByText('Stratený')).toBeInTheDocument();
    });

    it('10. Calculates bar widths correctly (relative to total)', () => {
      // Arrange
      const totalDeals = mockAnalytics.statusDistribution.reduce(
        (sum, item) => sum + item.count,
        0
      );
      const closedWonCount = mockAnalytics.statusDistribution.find(
        (item) => item.status === DealStatus.CLOSED_WON
      )?.count || 0;
      const expectedPercentage = (closedWonCount / totalDeals) * 100;

      // Act
      const { container } = render(
        <DealAnalytics analytics={mockAnalytics} isLoading={false} />
      );

      // Assert
      const progressBars = container.querySelectorAll('[role="progressbar"]');
      const closedWonBar = Array.from(progressBars).find((bar) =>
        bar.getAttribute('aria-label')?.includes('Získaný')
      );
      expect(closedWonBar).toHaveAttribute(
        'aria-valuenow',
        expectedPercentage.toString()
      );
    });
  });

  // ===== MONTHLY TREND TESTS =====

  describe('Monthly trend tests', () => {
    it('11. Renders monthly trend chart (last 6 months)', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      expect(screen.getByText('Január')).toBeInTheDocument();
      expect(screen.getByText('Február')).toBeInTheDocument();
      expect(screen.getByText('Marec')).toBeInTheDocument();
      expect(screen.getByText('Apríl')).toBeInTheDocument();
      expect(screen.getByText('Máj')).toBeInTheDocument();
      expect(screen.getByText('Jún')).toBeInTheDocument();
    });

    it('12. Shows won vs lost deals per month', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      expect(screen.getByText(/5 získaných \/ 3 stratených/)).toBeInTheDocument();
      expect(screen.getByText(/7 získaných \/ 2 stratených/)).toBeInTheDocument();
      expect(screen.getByText(/8 získaných \/ 4 stratených/)).toBeInTheDocument();
      expect(screen.getByText(/6 získaných \/ 5 stratených/)).toBeInTheDocument();
      expect(screen.getByText(/9 získaných \/ 3 stratených/)).toBeInTheDocument();
      expect(screen.getByText(/12 získaných \/ 8 stratených/)).toBeInTheDocument();
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility tests', () => {
    it('13. Has proper ARIA labels (role="region")', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      const region = screen.getByRole('region', { name: 'Deal analytics' });
      expect(region).toBeInTheDocument();
    });

    it('14. Uses role="progressbar" for bars with aria-valuenow', () => {
      // Arrange & Act
      render(<DealAnalytics analytics={mockAnalytics} isLoading={false} />);

      // Assert
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach((bar) => {
        expect(bar).toHaveAttribute('aria-valuenow');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
        expect(bar).toHaveAttribute('aria-label');
      });
    });

    it('15. Has semantic heading structure', () => {
      // Arrange & Act
      const { container } = render(
        <DealAnalytics analytics={mockAnalytics} isLoading={false} />
      );

      // Assert
      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBeGreaterThan(0);
      expect(screen.getByText('Rozdelenie podľa statusu')).toBeInTheDocument();
      expect(screen.getByText('Mesačný trend')).toBeInTheDocument();
    });
  });
});
