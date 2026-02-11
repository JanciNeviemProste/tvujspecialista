import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SpecialistCard } from '@/components/shared/SpecialistCard';

expect.extend(toHaveNoViolations);

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    const { fill, sizes, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

describe('SpecialistCard', () => {
  // Mock specialist data
  const mockSpecialist = {
    slug: 'jan-novak',
    name: 'Jan Novak',
    photo: '/images/specialists/jan-novak.jpg',
    verified: true,
    topSpecialist: false,
    category: 'Elektrikar',
    location: 'Praha',
    rating: 4.5,
    reviewsCount: 28,
    hourlyRate: 500,
    bio: 'Zkuseny elektrikar s 10 lety praxe v oboru.',
  };

  // ===== RENDERING TESTS =====

  describe('Rendering tests', () => {
    it('1. Renders specialist name and category', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      expect(screen.getByText('Jan Novak')).toBeInTheDocument();
      expect(screen.getByText(/Elektrikar/)).toBeInTheDocument();
    });

    it('2. Shows location', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      expect(screen.getByText(/Praha/)).toBeInTheDocument();
    });

    it('3. Displays verified badge when verified=true', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      expect(screen.getByText('Ověřený')).toBeInTheDocument();
    });

    it('4. Hides verified badge when verified=false', () => {
      // Arrange
      const unverifiedSpecialist = { ...mockSpecialist, verified: false };

      // Act
      render(<SpecialistCard specialist={unverifiedSpecialist} />);

      // Assert
      expect(screen.queryByText('Ověřený')).not.toBeInTheDocument();
    });

    it('5. Shows Top badge when topSpecialist=true', () => {
      // Arrange
      const topSpecialist = { ...mockSpecialist, topSpecialist: true };

      // Act
      render(<SpecialistCard specialist={topSpecialist} />);

      // Assert
      expect(screen.getByText('Top')).toBeInTheDocument();
    });

    it('6. Shows rating with RatingStars', () => {
      // Arrange & Act
      const { container } = render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert - RatingStars should render 5 SVG stars
      const stars = container.querySelectorAll('svg');
      expect(stars.length).toBe(5);

      // Assert - count text should be shown
      expect(screen.getByText('(28)')).toBeInTheDocument();
    });

    it('7. Links to correct specialist profile URL', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/specialista/jan-novak');
    });

    it('8. Shows bio text', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      expect(
        screen.getByText('Zkuseny elektrikar s 10 lety praxe v oboru.')
      ).toBeInTheDocument();
    });

    it('9. Shows hourly rate when greater than 0', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      expect(screen.getByText(/Od 500 Kč\/hod/)).toBeInTheDocument();
    });

    it('10. Hides hourly rate when 0', () => {
      // Arrange
      const freeSpecialist = { ...mockSpecialist, hourlyRate: 0 };

      // Act
      render(<SpecialistCard specialist={freeSpecialist} />);

      // Assert
      expect(screen.queryByText(/Kč\/hod/)).not.toBeInTheDocument();
    });

    it('11. Shows contact button', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      expect(screen.getByText('Kontaktovat')).toBeInTheDocument();
    });

    it('12. Renders specialist photo with correct alt text', () => {
      // Arrange & Act
      render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      const img = screen.getByAltText('Jan Novak');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/specialists/jan-novak.jpg');
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility tests', () => {
    it('13. Passes jest-axe accessibility check', async () => {
      // Arrange & Act
      const { container } = render(<SpecialistCard specialist={mockSpecialist} />);

      // Assert
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
