import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RatingStars } from '@/components/shared/RatingStars';

expect.extend(toHaveNoViolations);

describe('RatingStars', () => {
  // ===== RENDERING TESTS =====

  describe('Rendering tests', () => {
    it('1. Renders correct number of filled stars for integer rating (e.g., 4)', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={4} />);

      // Assert - 4 filled (yellow-400 fill) + 1 empty (gray-200 fill)
      const allStars = container.querySelectorAll('svg');
      expect(allStars).toHaveLength(5);

      const filledStars = container.querySelectorAll('svg.fill-yellow-400');
      expect(filledStars).toHaveLength(4);

      const emptyStars = container.querySelectorAll('svg.fill-gray-200');
      expect(emptyStars).toHaveLength(1);
    });

    it('2. Renders half star for decimal rating (e.g., 3.5)', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={3.5} />);

      // Assert - 3 filled + 1 half + 1 empty = 5 total
      const allStars = container.querySelectorAll('svg');
      expect(allStars).toHaveLength(5);

      const filledStars = container.querySelectorAll('svg.fill-yellow-400');
      expect(filledStars).toHaveLength(3);

      // Half star uses linearGradient
      const halfStarGradients = container.querySelectorAll('linearGradient');
      expect(halfStarGradients).toHaveLength(1);

      const emptyStars = container.querySelectorAll('svg.fill-gray-200');
      expect(emptyStars).toHaveLength(1);
    });

    it('3. Handles 0 rating (all empty)', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={0} />);

      // Assert - all 5 stars should be empty (gray)
      const allStars = container.querySelectorAll('svg');
      expect(allStars).toHaveLength(5);

      const filledStars = container.querySelectorAll('svg.fill-yellow-400');
      expect(filledStars).toHaveLength(0);

      const emptyStars = container.querySelectorAll('svg.fill-gray-200');
      expect(emptyStars).toHaveLength(5);
    });

    it('4. Handles 5 rating (all filled)', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={5} />);

      // Assert - all 5 stars should be filled (yellow)
      const allStars = container.querySelectorAll('svg');
      expect(allStars).toHaveLength(5);

      const filledStars = container.querySelectorAll('svg.fill-yellow-400');
      expect(filledStars).toHaveLength(5);

      const emptyStars = container.querySelectorAll('svg.fill-gray-200');
      expect(emptyStars).toHaveLength(0);
    });
  });

  // ===== COUNT TEXT TESTS =====

  describe('Count text tests', () => {
    it('5. Shows rating count text if count is provided', () => {
      // Arrange & Act
      render(<RatingStars rating={4} count={42} />);

      // Assert
      expect(screen.getByText('(42)')).toBeInTheDocument();
    });

    it('6. Hides count text when showCount is false', () => {
      // Arrange & Act
      render(<RatingStars rating={4} count={42} showCount={false} />);

      // Assert
      expect(screen.queryByText('(42)')).not.toBeInTheDocument();
    });

    it('7. Hides count text when count is undefined', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={4} />);

      // Assert - no span with count text should be rendered
      const countSpan = container.querySelector('span');
      expect(countSpan).toBeNull();
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility tests', () => {
    it('8. Passes jest-axe accessibility check', async () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={3.5} count={10} />);

      // Assert
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===== SIZE VARIANT TESTS =====

  describe('Size variant tests', () => {
    it('9. Renders small size stars with correct class', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={3} size="sm" />);

      // Assert
      const stars = container.querySelectorAll('svg');
      stars.forEach((star) => {
        expect(star.classList.contains('h-3')).toBe(true);
        expect(star.classList.contains('w-3')).toBe(true);
      });
    });

    it('10. Renders large size stars with correct class', () => {
      // Arrange & Act
      const { container } = render(<RatingStars rating={3} size="lg" />);

      // Assert
      const stars = container.querySelectorAll('svg');
      stars.forEach((star) => {
        expect(star.classList.contains('h-5')).toBe(true);
        expect(star.classList.contains('w-5')).toBe(true);
      });
    });
  });
});
